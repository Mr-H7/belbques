import supabase, { getSupabaseErrorMessage, isSupabaseUnavailable } from '@/services/supabase';
import { PENDING_STORAGE_KEY, SURVEY_QUESTIONS } from '@/utils/constants.js';

const SURVEYS_TABLE = 'surveys';

const adaptSurveyRow = (row) => ({
  ...row,
  created: row?.created_at || row?.created || null,
  ipAddress: row?.ip_address || row?.ipAddress || null,
  userAgent: row?.user_agent || row?.userAgent || null,
});

const buildPayload = (submission) => {
  const reporter = submission.reporter || {};
  return {
    name: reporter.fullName || 'Anonymous',
    email: reporter.optionalContact?.includes('@') ? reporter.optionalContact : '',
    phone: reporter.phone || '',
    answers: {
      reporter,
      answers: submission.answers || {},
      metadata: submission.metadata || {},
    },
    ip_address: 'client-ip',
    user_agent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };
};

const queueLocally = (payload) => {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ payload, queuedAt: new Date().toISOString() });
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.warn('Could not queue submission locally:', err);
    return false;
  }
};

const extractSearchTerm = (filters = '') => {
  const match = String(filters).match(/"(.*?)"/);
  return match?.[1]?.trim() || '';
};

export const submitSurvey = async (submission) => {
  const payload = buildPayload(submission);
  try {
    const { error } = await supabase.from(SURVEYS_TABLE).insert(payload);
    if (error) throw error;
    return { ok: true, record: null, queued: false };
  } catch (error) {
    if (isSupabaseUnavailable(error)) {
      const queued = queueLocally(payload);
      if (queued) return { ok: true, record: null, queued: true };
    }
    // eslint-disable-next-line no-console
    console.error('Failed to submit survey:', error);
    throw new Error(getSupabaseErrorMessage(error, 'Failed to submit survey'));
  }
};

export const flushPendingSubmissions = async () => {
  if (typeof window === 'undefined') return { sent: 0, remaining: 0 };
  let raw;
  try {
    raw = localStorage.getItem(PENDING_STORAGE_KEY);
  } catch {
    return { sent: 0, remaining: 0 };
  }
  if (!raw) return { sent: 0, remaining: 0 };

  let list;
  try {
    list = JSON.parse(raw);
  } catch {
    localStorage.removeItem(PENDING_STORAGE_KEY);
    return { sent: 0, remaining: 0 };
  }
  if (!Array.isArray(list) || list.length === 0) {
    localStorage.removeItem(PENDING_STORAGE_KEY);
    return { sent: 0, remaining: 0 };
  }

  const remaining = [];
  let sent = 0;
  for (const item of list) {
    const { error } = await supabase.from(SURVEYS_TABLE).insert(item.payload);
    if (!error) {
      sent += 1;
      continue;
    }
    if (isSupabaseUnavailable(error)) {
      remaining.push(item);
    }
    // Validation / policy issues are dropped intentionally to avoid infinite retries.
  }

  if (remaining.length === 0) {
    localStorage.removeItem(PENDING_STORAGE_KEY);
  } else {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(remaining));
  }
  return { sent, remaining: remaining.length };
};

export const getSurveyResults = async (page = 1, perPage = 50, filters = '') => {
  const from = Math.max(0, (page - 1) * perPage);
  const to = from + perPage - 1;
  let query = supabase
    .from(SURVEYS_TABLE)
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  const searchTerm = extractSearchTerm(filters);
  if (searchTerm) {
    const escaped = searchTerm.replace(/,/g, '');
    query = query.or(`name.ilike.%${escaped}%,phone.ilike.%${escaped}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(getSupabaseErrorMessage(error, 'Failed to fetch survey results'));

  const totalItems = count || 0;
  const totalPages = Math.ceil(totalItems / perPage);
  return {
    items: (data || []).map(adaptSurveyRow),
    page,
    perPage,
    totalItems,
    totalPages,
  };
};

export const getSurveyStats = async () => {
  try {
    const { data, error, count } = await supabase
      .from(SURVEYS_TABLE)
      .select('id,answers', { count: 'exact' })
      .limit(1000);

    if (error) throw error;

    const total = count || 0;
    const requiredIds = SURVEY_QUESTIONS.filter((q) => q.required).map((q) => q.id);
    const completed = (data || []).filter((r) => {
      const a = r?.answers?.answers || {};
      return requiredIds.every((id) => {
        const v = a[id];
        if (Array.isArray(v)) return v.length > 0;
        return v !== undefined && v !== '' && v !== null;
      });
    }).length;

    return {
      total,
      completionRate: total > 0 ? ((completed / total) * 100).toFixed(1) : '0.0',
      avgTime: null,
    };
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to fetch survey stats:', error);
    return { total: 0, completionRate: '0.0', avgTime: null };
  }
};

export const deleteSurvey = async (id) => {
  const { error } = await supabase.from(SURVEYS_TABLE).delete().eq('id', id);
  if (error) throw new Error(getSupabaseErrorMessage(error, 'Failed to delete survey'));
  return true;
};
