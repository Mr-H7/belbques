import React, { createContext, useState, useCallback, useEffect, useMemo } from 'react';
import {
  submitSurvey as apiSubmitSurvey,
  getSurveyResults,
  deleteSurvey as apiDeleteSurvey,
  flushPendingSubmissions,
} from '@/services/api';
import { trackFormSubmission } from '@/services/analytics';
import { toast } from 'sonner';
import { SURVEY_QUESTIONS, TOTAL_STEPS, EGY_PHONE_REGEX, normalizeEgPhone } from '@/utils/constants.js';

export const SurveyContext = createContext(null);

const REPORTER_DEFAULTS = { fullName: '', phone: '', ageGroup: '', optionalContact: '' };

const isAnswered = (q, value) => {
  if (!q.required) return true;
  if (q.type === 'multi') return Array.isArray(value) && value.length > 0;
  if (typeof value === 'string') return value.trim().length > 0;
  return value !== undefined && value !== null && value !== '';
};

export function SurveyProvider({ children }) {
  // Public flow state
  const [reporter, setReporterState] = useState(REPORTER_DEFAULTS);
  const [reporterErrors, setReporterErrors] = useState({});
  const [answers, setAnswers] = useState({});
  const [step, setStep] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Admin results state
  const [surveyResults, setSurveyResults] = useState([]);
  const [totalResults, setTotalResults] = useState(0);
  const [resultsLoading, setResultsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState('');

  const questions = SURVEY_QUESTIONS;

  useEffect(() => {
    // Try to flush queued submissions once on mount.
    flushPendingSubmissions().then(({ sent }) => {
      if (sent > 0) toast.success(`تم إرسال ${sent} استبيان محفوظ مؤقتًا`);
    }).catch(() => {});
  }, []);

  const setReporter = useCallback((patch) => {
    setReporterState((prev) => ({ ...prev, ...patch }));
    setReporterErrors((prev) => {
      const next = { ...prev };
      Object.keys(patch || {}).forEach((k) => delete next[k]);
      return next;
    });
  }, []);

  const validateReporter = useCallback(() => {
    const errs = {};
    if (!reporter.fullName?.trim()) errs.fullName = 'الاسم مطلوب';
    const phone = normalizeEgPhone(reporter.phone);
    if (!phone) errs.phone = 'رقم الموبايل مطلوب';
    else if (!EGY_PHONE_REGEX.test(phone)) errs.phone = 'رقم موبايل مصري غير صحيح';
    if (!reporter.ageGroup) errs.ageGroup = 'اختر الفئة العمرية';
    setReporterErrors(errs);
    return Object.keys(errs).length === 0;
  }, [reporter]);

  const updateAnswer = useCallback((questionId, value) => {
    if (!questionId) return;
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  }, []);

  const toggleMultiAnswer = useCallback((questionId, optionId) => {
    if (!questionId || !optionId) return;
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const next = current.includes(optionId)
        ? current.filter((x) => x !== optionId)
        : [...current, optionId];
      return { ...prev, [questionId]: next };
    });
  }, []);

  const answeredCount = useMemo(
    () => questions.filter((q) => isAnswered(q, answers[q.id])).length,
    [questions, answers]
  );

  const progress = ((step) / (TOTAL_STEPS - 1)) * 100;

  const isComplete = answeredCount === questions.filter((q) => q.required).length;

  const canAdvance = useCallback(
    (s = step) => {
      if (s === 0) {
        const errs = {};
        if (!reporter.fullName?.trim()) errs.fullName = 'الاسم مطلوب';
        const phone = normalizeEgPhone(reporter.phone);
        if (!phone) errs.phone = 'رقم الموبايل مطلوب';
        else if (!EGY_PHONE_REGEX.test(phone)) errs.phone = 'رقم موبايل مصري غير صحيح';
        if (!reporter.ageGroup) errs.ageGroup = 'اختر الفئة العمرية';
        return Object.keys(errs).length === 0;
      }
      if (s >= 1 && s <= questions.length) {
        const q = questions[s - 1];
        return isAnswered(q, answers[q.id]);
      }
      return true;
    },
    [step, reporter, questions, answers]
  );

  const goNext = useCallback(() => {
    if (step === 0 && !validateReporter()) return;
    if (!canAdvance(step)) return;
    setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
  }, [step, validateReporter, canAdvance]);

  const goPrev = useCallback(() => setStep((s) => Math.max(s - 1, 0)), []);

  const goToStep = useCallback((target) => {
    if (typeof target !== 'number') return;
    setStep(Math.max(0, Math.min(target, TOTAL_STEPS - 1)));
  }, []);

  const submitSurvey = async () => {
    if (!validateReporter()) {
      toast.error('من فضلك راجع بيانات التواصل');
      setStep(0);
      return false;
    }
    setIsSubmitting(true);
    try {
      const result = await apiSubmitSurvey({
        reporter: { ...reporter, phone: normalizeEgPhone(reporter.phone) },
        answers,
        metadata: {
          submittedAt: new Date().toISOString(),
          userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
          source: 'web',
        },
      });
      setIsSubmitted(true);
      await trackFormSubmission(true);
      if (result.queued) {
        toast.success('حُفظت محليًا — سنرسلها لما السيرفر يرجع');
      } else {
        toast.success('تم إرسال الاستبيان بنجاح!');
      }
      return true;
    } catch (error) {
      console.error('Submission failed', error);
      await trackFormSubmission(false, error.message);
      toast.error('حدث خطأ أثناء الإرسال. حاول مرة أخرى.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetSurvey = useCallback(() => {
    setReporterState(REPORTER_DEFAULTS);
    setReporterErrors({});
    setAnswers({});
    setStep(0);
    setIsSubmitted(false);
  }, []);

  const fetchResults = useCallback(async (page = 1, queryFilters = '') => {
    setResultsLoading(true);
    try {
      const data = await getSurveyResults(page, 20, queryFilters);
      setSurveyResults(data?.items || []);
      setTotalResults(data?.totalItems || 0);
      setCurrentPage(data?.page || 1);
    } catch (error) {
      toast.error('فشل في جلب نتائج الاستبيان');
    } finally {
      setResultsLoading(false);
    }
  }, []);

  const deleteSurvey = async (id) => {
    if (!id) return;
    try {
      await apiDeleteSurvey(id);
      setSurveyResults((prev) => (prev || []).filter((r) => r.id !== id));
      setTotalResults((prev) => Math.max(0, (prev || 0) - 1));
      toast.success('تم حذف الاستبيان بنجاح');
    } catch (error) {
      toast.error('فشل الحذف');
    }
  };

  const updateFilters = useCallback((newFilters) => {
    setFilters(newFilters || '');
    setCurrentPage(1);
    fetchResults(1, newFilters || '');
  }, [fetchResults]);

  const value = {
    // Public
    questions,
    reporter,
    reporterErrors,
    setReporter,
    answers,
    updateAnswer,
    toggleMultiAnswer,
    step,
    totalSteps: TOTAL_STEPS,
    progress,
    canAdvance,
    goNext,
    goPrev,
    goToStep,
    answeredCount,
    isComplete,
    isSubmitted,
    isSubmitting,
    submitSurvey,
    resetSurvey,

    // Admin
    surveyResults,
    totalResults,
    resultsLoading,
    currentPage,
    filters,
    fetchResults,
    deleteSurvey,
    updateFilters,
    setCurrentPage: (p) => {
      const validPage = Math.max(1, p || 1);
      setCurrentPage(validPage);
      fetchResults(validPage, filters);
    },
  };

  return <SurveyContext.Provider value={value}>{children}</SurveyContext.Provider>;
}
