
import pb from '@/utils/pocketbase';

const generateAnalyticsPayload = (eventType, eventData) => {
  return {
    eventType,
    userId: pb.authStore.isValid ? pb.authStore.model.id : 'anonymous',
    eventData,
    pageUrl: window.location.href
    // Note: timestamp field is an autodate field in PocketBase, 
    // so it will be automatically populated on creation.
  };
};

export const trackEvent = async (eventType, eventData = {}) => {
  try {
    const payload = generateAnalyticsPayload(eventType, {
      ...eventData,
      userAgent: navigator.userAgent,
      screenWidth: window.innerWidth
    });
    await pb.collection('analytics_events').create(payload, { $autoCancel: false });
  } catch (error) {
    console.warn("Analytics tracking failed:", error);
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
