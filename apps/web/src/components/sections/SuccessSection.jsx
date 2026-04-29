import React, { useContext } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button.jsx';
import { SurveyContext } from '@/context/SurveyContext.jsx';

export function SuccessSection() {
  const { resetSurvey } = useContext(SurveyContext);

  return (
    <div className="max-w-3xl mx-auto w-full relative z-10 py-12">
      <div className="glass-card p-8 sm:p-10 md:p-14 rounded-[2rem] premium-shadow-lg text-center animate-fade-in border border-white/15">
        <div className="w-24 h-24 bg-primary/12 rounded-2xl border border-primary/35 flex items-center justify-center mx-auto mb-8 animate-breathe relative">
          <CheckCircle2 className="w-12 h-12 text-primary relative z-10" />
        </div>

        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-5">
          شكراً لمشاركتك!
        </h2>

        <p className="text-lg text-foreground/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          تم استلام إجاباتك بنجاح. مساهمتك تساعد في بناء صورة أوضح لاحتياجات المدينة ودعم قرارات تطوير أكثر فعالية.
        </p>

        <Button
          onClick={resetSurvey}
          variant="secondary"
          size="lg"
          className="font-bold px-10"
        >
          ملء استبيان جديد
        </Button>
      </div>
    </div>
  );
}
