import pb from '@/utils/pocketbase';

/**
 * Settings live in PocketBase collection `app_settings` as singleton key/value
 * rows. Public read so the home page can hydrate title + open/closed state
 * without needing auth. Writes require an admin_users session.
 *
 * Local fallback: `localStorage.benha_settings_<key>` keeps the last known
 * value so the public page still renders something usable when PB is down.
 */

const KEYS = {
  GENERAL: 'general',
  SURVEY_STATE: 'survey_state',
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
  try { localStorage.setItem(lsKey(key), JSON.stringify(value)); } catch {}
};

const isPocketBaseUnavailable = (err) => {
  if (!err) return false;
  if (err.status === 0) return true;
  const msg = String(err.message || '').toLowerCase();
  return msg.includes('failed to fetch') || msg.includes('networkerror') || msg.includes('load failed');
};

const firstFieldError = (data) => {
  if (!data || typeof data !== 'object') return '';
  for (const value of Object.values(data)) {
    if (value?.message) return value.message;
  }
  return '';
};

const getPbErrorMessage = (err, fallbackMessage) => {
  const message =
    firstFieldError(err?.response?.data) ||
    firstFieldError(err?.data?.data) ||
    err?.response?.message ||
    err?.data?.message ||
    err?.message;

  if (!message || typeof message !== 'string') return fallbackMessage;
  return message;
};

const logAdminError = (action, err) => {
  console.error(`[settings] ${action} failed`, {
    status: err?.status,
    message: err?.message,
    response: err?.response,
    data: err?.data,
    url: err?.url,
  });
};

const fetchOne = async (key) => {
  try {
    const rec = await pb.collection('app_settings').getFirstListItem(`key="${key}"`, { $autoCancel: false });
    if (rec?.value) writeLocal(key, rec.value);
    return { record: rec, value: rec?.value || DEFAULTS[key] };
  } catch (err) {
    if (err?.status === 404) return { record: null, value: readLocal(key) || DEFAULTS[key] };
    // Network or other error → fall back to local.
    return { record: null, value: readLocal(key) || DEFAULTS[key] };
  }
};

export const getGeneral = async () => (await fetchOne(KEYS.GENERAL)).value;
export const getSurveyState = async () => (await fetchOne(KEYS.SURVEY_STATE)).value;

const upsert = async (key, value) => {
  // Mirror locally first so UI stays responsive even if PB write fails.
  writeLocal(key, value);
  try {
    const existing = await pb.collection('app_settings').getFirstListItem(`key="${key}"`, { $autoCancel: false }).catch(() => null);
    if (existing) {
      await pb.collection('app_settings').update(existing.id, { value }, { $autoCancel: false });
    } else {
      await pb.collection('app_settings').create({ key, value }, { $autoCancel: false });
    }
    return { ok: true, persisted: true };
  } catch (err) {
    if (isPocketBaseUnavailable(err)) {
      return { ok: true, persisted: false, error: err };
    }
    return { ok: false, persisted: false, error: err };
  }
};

export const saveGeneral = (value) => upsert(KEYS.GENERAL, value);
export const saveSurveyState = (value) => upsert(KEYS.SURVEY_STATE, value);

// ───────────── admin user management ─────────────

export const listAdmins = async () => {
  try {
    const data = await pb.collection('admin_users').getList(1, 100, { $autoCancel: false });
    const items = data?.items || [];
    return [...items].sort((a, b) => {
      const aDate = Date.parse(a?.createdAt || a?.created || '') || 0;
      const bDate = Date.parse(b?.createdAt || b?.created || '') || 0;
      if (aDate !== bDate) return bDate - aDate;
      return String(a?.email || '').localeCompare(String(b?.email || ''));
    });
  } catch (err) {
    logAdminError('listAdmins', err);
    throw new Error(getPbErrorMessage(err, 'فشل تحميل قائمة المدراء'));
  }
};

export const createAdmin = async ({ email, password, role = 'admin' }) => {
  const payload = { email, password, passwordConfirm: password, role, emailVisibility: true };
  try {
    return await pb.collection('admin_users').create(payload, { $autoCancel: false });
  } catch (err) {
    logAdminError('createAdmin', err);
    throw new Error(getPbErrorMessage(err, 'فشل إضافة المدير'));
  }
};

export const deleteAdmin = async (id) => {
  try {
    return await pb.collection('admin_users').delete(id, { $autoCancel: false });
  } catch (err) {
    logAdminError('deleteAdmin', err);
    throw new Error(getPbErrorMessage(err, 'فشل حذف المدير'));
  }
};

export const updateOwnAccount = async ({ id, email, oldPassword, newPassword }) => {
  const patch = {};
  if (email) patch.email = email;
  if (newPassword) {
    patch.password = newPassword;
    patch.passwordConfirm = newPassword;
    patch.oldPassword = oldPassword;
  }
  try {
    const updated = await pb.collection('admin_users').update(id, patch, { $autoCancel: false });
    if (pb.authStore.model?.id === id) {
      pb.authStore.save(pb.authStore.token, { ...pb.authStore.model, ...updated });
    }
    return updated;
  } catch (err) {
    logAdminError('updateOwnAccount', err);
    throw new Error(getPbErrorMessage(err, 'فشل تحديث الحساب'));
  }
};
