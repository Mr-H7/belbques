import React from 'react';
import { Helmet } from 'react-helmet';
import { Layout } from '@/components/layout/Layout.jsx';
import { HeroSection } from '@/components/sections/HeroSection.jsx';
import { BenefitsSection } from '@/components/sections/BenefitsSection.jsx';
import { FutureSection } from '@/components/sections/FutureSection.jsx';
import { SuccessSection } from '@/components/sections/SuccessSection.jsx';
import { SurveySection } from '@/components/survey/SurveySection.jsx';
import { useSurvey, usePageView } from '@/hooks/useSurvey.js';
import { useAppSettings } from '@/context/AppSettingsContext.jsx';
import { Lock } from 'lucide-react';

const CLOSED_NOTICE = 'الاستبيان مغلق حالياً';

function ClosedNotice({ message }) {
  const details = (message || '').trim();
  return (
    <div className="max-w-xl mx-auto text-center px-6 py-16">
      <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10 border border-primary/20 mb-6">
        <Lock className="w-9 h-9 text-primary" />
      </div>
      <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{CLOSED_NOTICE}</h2>
      {details && details !== CLOSED_NOTICE ? (
        <p className="text-base md:text-lg text-foreground/75 leading-relaxed">{details}</p>
      ) : null}
    </div>
  );
}

function SurveyArea() {
  const { isSubmitted } = useSurvey();
  const { surveyState } = useAppSettings();

  return (
    <section id="survey-section" className="py-24 relative overflow-hidden min-h-[80vh] flex flex-col justify-center">
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-primary/5 rounded-full blur-[100px] animate-parallax"></div>
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] animate-parallax" style={{ animationDirection: 'reverse' }}></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {!surveyState.open
          ? <ClosedNotice message={surveyState.closedMessage || CLOSED_NOTICE} />
          : (isSubmitted ? <SuccessSection /> : <SurveySection />)}
      </div>
    </section>
  );
}

export default function HomePage() {
  usePageView('Home Landing Page');
  const { general } = useAppSettings();

  return (
    <Layout>
      <Helmet>
        <title>{general.title} - شاركنا رأيك لمستقبل أفضل</title>
        <meta name="description" content={general.subtitle} />
      </Helmet>

      <HeroSection />
      <BenefitsSection />
      <SurveyArea />
      <FutureSection />
    </Layout>
  );
}
