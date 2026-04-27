import { useContext, useEffect } from 'react';
import { SurveyContext } from '@/context/SurveyContext.jsx';
import { trackPageView, trackEvent } from '@/services/analytics';

export function useSurvey() {
  const context = useContext(SurveyContext);
  if (!context) throw new Error('useSurvey must be used within a SurveyProvider');
  return context;
}

export function useAnalytics() {
  return { trackPageView, trackEvent };
}

export function usePageView(pageName) {
  useEffect(() => {
    if (pageName) trackPageView(pageName);
  }, [pageName]);
}
