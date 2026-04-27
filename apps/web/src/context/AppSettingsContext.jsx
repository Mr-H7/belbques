import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getGeneral, getSurveyState } from '@/services/settings';

const AppSettingsContext = createContext(null);

const DEFAULT_GENERAL = {
  title: 'بنها بتقول إيه؟',
  subtitle: 'شاركنا رأيك وساعدنا نفهم المدينة أكتر',
};
const DEFAULT_SURVEY_STATE = { open: true, closedMessage: 'الاستبيان مغلق حالياً' };

export function AppSettingsProvider({ children }) {
  const [general, setGeneral] = useState(DEFAULT_GENERAL);
  const [surveyState, setSurveyState] = useState(DEFAULT_SURVEY_STATE);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    const [g, s] = await Promise.all([getGeneral(), getSurveyState()]);
    setGeneral({ ...DEFAULT_GENERAL, ...(g || {}) });
    setSurveyState({ ...DEFAULT_SURVEY_STATE, ...(s || {}) });
    setLoaded(true);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  return (
    <AppSettingsContext.Provider value={{ general, surveyState, loaded, refresh }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const ctx = useContext(AppSettingsContext);
  if (!ctx) throw new Error('useAppSettings must be used within AppSettingsProvider');
  return ctx;
}
