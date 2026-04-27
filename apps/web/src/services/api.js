import pb from '@/utils/pocketbase';
import { PENDING_STORAGE_KEY, SURVEY_QUESTIONS } from '@/utils/constants.js';

/**
 * Survey submission shape:
 * {
 *   reporter:  { fullName, phone, ageGroup, optionalContact },
 *   answers:   { q1, q2, ... q20 },
 *   metadata:  { submittedAt, userAgent, source }
 * }
 *
 * The PocketBase `surveys` collection has flat name/email/phone columns plus
 * a JSON `answers` field — we mirror reporter into the flat columns so the
 * existing admin filters keep working, and we store the full structured
 * payload inside `answers` for richness.
 */

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
    ipAddress: 'client-ip',
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
  };
};

const isNetworkError = (err) => {
  if (!err) return false;
  if (err.isAbort) return false;
  // PocketBase wraps fetch errors; the ClientResponseError has status 0 when
  // the network call never reached the server.
  if (err.status === 0) return true;
  const msg = (err.message || '').toLowerCase();
  return (
    msg.includes('failed to fetch') ||
    msg.includes('networkerror') ||
    msg.includes('load failed')
  );
};

const queueLocally = (payload) => {
  try {
    const raw = localStorage.getItem(PENDING_STORAGE_KEY);
    const list = raw ? JSON.parse(raw) : [];
    list.push({ payload, queuedAt: new Date().toISOString() });
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(list));
    return true;
  } catch (err) {
    console.warn('Could not queue submission locally:', err);
    return false;
  }
};

export const submitSurvey = async (submission) => {
  const payload = buildPayload(submission);
  try {
    const record = await pb.collection('surveys').create(payload, { $autoCancel: false });
    return { ok: true, record, queued: false };
  } catch (error) {
    if (isNetworkError(error)) {
      const queued = queueLocally(payload);
      if (queued) return { ok: true, record: null, queued: true };
    }
    console.error('Failed to submit survey:', error);
    throw new Error(error?.message || 'Failed to submit survey');
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
    try {
      await pb.collection('surveys').create(item.payload, { $autoCancel: false });
      sent += 1;
    } catch (err) {
      if (isNetworkError(err)) {
        remaining.push(item);
      }
      // For non-network errors (e.g. validation), drop the item — keeping it
      // would just retry forever.
    }
  }

  if (remaining.length === 0) {
    localStorage.removeItem(PENDING_STORAGE_KEY);
  } else {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(remaining));
  }
  return { sent, remaining: remaining.length };
};

export const getSurveyResults = async (page = 1, perPage = 50, filters = '') => {
  const resultList = await pb.collection('surveys').getList(page, perPage, {
    filter: filters,
    sort: '-created',
    $autoCancel: false,
  });
  return resultList;
};

export const getSurveyStats = async () => {
  try {
    const results = await pb.collection('surveys').getList(1, 1000, {
      fields: 'id,created,answers',
      $autoCancel: false,
    });
    const total = results.totalItems;
    const requiredIds = SURVEY_QUESTIONS.filter((q) => q.required).map((q) => q.id);
    const completed = (results.items || []).filter((r) => {
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
      avgTime: null, // not tracked yet
    };
  } catch (error) {
    console.error('Failed to fetch survey stats:', error);
    return { total: 0, completionRate: '0.0', avgTime: null };
  }
};

export const deleteSurvey = async (id) => {
  await pb.collection('surveys').delete(id, { $autoCancel: false });
  return true;
};
