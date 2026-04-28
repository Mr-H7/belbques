import supabase from '@/services/supabase';

const generateAnalyticsPayload = async (eventType, eventData) => {
  const { data } = await supabase.auth.getUser();
  const userId = data?.user?.id || null;

  return {
    event_type: eventType,
    user_id: userId,
    event_data: eventData,
    page_url: window.location.href,
  };
};

export const trackEvent = async (eventType, eventData = {}) => {
  try {
    const payload = await generateAnalyticsPayload(eventType, {
      ...eventData,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth,
    });
    await supabase.from('analytics_events').insert(payload);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn('Analytics tracking failed:', error);
  }
};

export const trackPageView = async (pageName) => {
  await trackEvent('page_view', { pageName });
};

export const trackSurveyProgress = async (questionId, answerValue) => {
  await trackEvent('survey_progress', { questionId, answerValue });
};

export const trackFormSubmission = async (success, errorMessage = null) => {
  await trackEvent('survey_submitted', { success, errorMessage });
};

export const trackQuestionAnswered = async (questionNumber, answer, timeSpent) => {
  await trackEvent('question_answered', { questionNumber, answer, timeSpent });
};

export const trackInputFocus = async (inputName) => {
  await trackEvent('input_focus', { inputName });
};

export const trackSurveyStart = async () => {
  await trackEvent('survey_start');
};

export const trackSurveyComplete = async () => {
  await trackEvent('survey_complete');
};
