import supabase, {
  createStatelessSupabaseClient,
  getSupabaseErrorMessage,
  isSupabaseUnavailable,
} from '@/services/supabase';

const KEYS = {
  GENERAL: 'general',
  SURVEY_STATE: 'survey_state',
};

const TABLES = {
  APP_SETTINGS: 'app_settings',
  ADMIN_PROFILES: 'admin_profiles',
};

const DEFAULTS = {
  general: {
    title: 'بنها بتقول إيه؟',
    subtitle: 'شاركنا رأيك وساعدنا نفهم المدينة أكتر',
  },
  survey_state: {
    open: true,
    closedMessage: 'الاستبيان مغلق حالياً',
  },
};

const lsKey = (key) => `benha_settings_${key}`;

const readLocal = (key) => {
  try {
    const raw = localStorage.getItem(lsKey(key));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const writeLocal = (key, value) => {
  try {
    localStorage.setItem(lsKey(key), JSON.stringify(value));
  } catch {}
};

const logAdminError = (action, err) => {
  // eslint-disable-next-line no-console
  console.error(`[settings] ${action} failed`, err);
};

const fetchOne = async (key) => {
  try {
    const { data, error } = await supabase
      .from(TABLES.APP_SETTINGS)
      .select('key,value')
      .eq('key', key)
      .maybeSingle();

    if (error) throw error;
    if (data?.value) {
      writeLocal(key, data.value);
      return { record: data, value: data.value };
    }
    return { record: null, value: readLocal(key) || DEFAULTS[key] };
  } catch (err) {
    if (isSupabaseUnavailable(err)) {
      return { record: null, value: readLocal(key) || DEFAULTS[key] };
    }
    throw err;
  }
};

export const getGeneral = async () => (await fetchOne(KEYS.GENERAL)).value;
export const getSurveyState = async () => (await fetchOne(KEYS.SURVEY_STATE)).value;

const upsert = async (key, value) => {
  writeLocal(key, value);
  const { error } = await supabase
    .from(TABLES.APP_SETTINGS)
    .upsert({ key, value }, { onConflict: 'key' });

  if (!error) return { ok: true, persisted: true };
  if (isSupabaseUnavailable(error)) return { ok: true, persisted: false, error };
  return { ok: false, persisted: false, error };
};

export const saveGeneral = (value) => upsert(KEYS.GENERAL, value);
export const saveSurveyState = (value) => upsert(KEYS.SURVEY_STATE, value);

export const getCurrentAdminProfile = async (userId) => {
  if (!userId) return null;
  const { data, error } = await supabase
    .from(TABLES.ADMIN_PROFILES)
    .select('id,email,role,is_active,created_at')
    .eq('id', userId)
    .maybeSingle();

  if (error) throw new Error(getSupabaseErrorMessage(error, 'فشل تحميل بيانات المدير'));
  if (!data || data.is_active === false) return null;
  return {
    id: data.id,
    email: data.email,
    role: data.role || 'viewer',
    created: data.created_at,
  };
};

export const listAdmins = async () => {
  try {
    const { data, error } = await supabase
      .from(TABLES.ADMIN_PROFILES)
      .select('id,email,role,created_at,is_active')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []).map((row) => ({
      id: row.id,
      email: row.email,
      role: row.role || 'viewer',
      created: row.created_at,
    }));
  } catch (err) {
    logAdminError('listAdmins', err);
    throw new Error(getSupabaseErrorMessage(err, 'فشل تحميل قائمة المدراء'));
  }
};

export const createAdmin = async ({ email, password, role = 'admin' }) => {
  try {
    const normalizedEmail = String(email || '').trim().toLowerCase();
    if (!normalizedEmail) throw new Error('البريد الإلكتروني مطلوب');

    const { data: rpcData, error: rpcError } = await supabase.rpc('create_admin_user', {
      p_email: normalizedEmail,
      p_password: password,
      p_role: role,
    });
    if (!rpcError) return rpcData;
    logAdminError('createAdminRpcFallback', rpcError);

    const { data: existingProfile, error: existingProfileError } = await supabase
      .from(TABLES.ADMIN_PROFILES)
      .select('id,is_active')
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (existingProfileError) throw existingProfileError;
    if (existingProfile?.is_active) throw new Error('هذا البريد مسجل بالفعل كمدير');

    const signupClient = createStatelessSupabaseClient();
    const { data: signupData, error: signupError } = await signupClient.auth.signUp({
      email: normalizedEmail,
      password,
    });
    if (signupError) throw signupError;

    const newUserId = signupData?.user?.id;
    if (!newUserId) {
      throw new Error('تعذر إنشاء حساب المدير. تأكد من إعدادات Supabase Auth');
    }

    const { error: upsertError } = await supabase
      .from(TABLES.ADMIN_PROFILES)
      .upsert(
        {
          id: newUserId,
          email: normalizedEmail,
          role,
          is_active: true,
        },
        { onConflict: 'id' }
      );
    if (upsertError) throw upsertError;

    return { id: newUserId, email: normalizedEmail, role, is_active: true };
  } catch (err) {
    logAdminError('createAdmin', err);
    throw new Error(getSupabaseErrorMessage(err, 'فشل إضافة المدير'));
  }
};

export const deleteAdmin = async (id) => {
  try {
    const { error: rpcError } = await supabase.rpc('delete_admin_user', { p_admin_id: id });
    if (!rpcError) return true;
    logAdminError('deleteAdminRpcFallback', rpcError);

    const { error } = await supabase
      .from(TABLES.ADMIN_PROFILES)
      .update({ is_active: false })
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (err) {
    logAdminError('deleteAdmin', err);
    throw new Error(getSupabaseErrorMessage(err, 'فشل حذف المدير'));
  }
};

export const updateOwnAccount = async ({ id, email, oldPassword, newPassword }) => {
  if (newPassword) {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    if (userError) {
      logAdminError('updateOwnAccountGetUser', userError);
      throw new Error(getSupabaseErrorMessage(userError, 'فشل التحقق من الحساب الحالي'));
    }
    const currentEmail = userData?.user?.email;
    if (!currentEmail) {
      throw new Error('لا يمكن تغيير كلمة المرور بدون بريد إلكتروني صالح');
    }

    const { error: verifyError } = await supabase.auth.signInWithPassword({
      email: currentEmail,
      password: oldPassword,
    });
    if (verifyError) {
      logAdminError('updateOwnAccountVerifyPassword', verifyError);
      throw new Error('كلمة المرور الحالية غير صحيحة');
    }
  }

  const patch = {};
  if (email) patch.email = email;
  if (newPassword) patch.password = newPassword;

  const { data, error } = await supabase.auth.updateUser(patch);
  if (error) {
    logAdminError('updateOwnAccount', error);
    throw new Error(getSupabaseErrorMessage(error, 'فشل تحديث الحساب'));
  }

  if (email) {
    const { error: profileError } = await supabase
      .from(TABLES.ADMIN_PROFILES)
      .update({ email })
      .eq('id', id);
    if (profileError) {
      logAdminError('updateOwnAccountProfileSync', profileError);
      throw new Error(getSupabaseErrorMessage(profileError, 'فشل مزامنة البريد الإلكتروني'));
    }
  }

  return data?.user || null;
};
