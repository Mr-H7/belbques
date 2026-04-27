
import React, { useContext } from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/common/Button.jsx';
import { SurveyContext } from '@/context/SurveyContext.jsx';

export function SuccessSection() {
  const { resetSurvey } = useContext(SurveyContext);

  return (
    <div className="max-w-3xl mx-auto w-full relative z-10 py-12">
      <div className="glass-card p-10 md:p-16 rounded-3xl premium-shadow-lg text-center transform animate-fade-in">
        <div className="w-28 h-28 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-10 animate-breathe relative">
          <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping"></div>
          <CheckCircle2 className="w-14 h-14 text-primary relative z-10" />
        </div>
        
        <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6">
          شكراً لمشاركتك!
        </h2>
        
        <p className="text-xl text-foreground/80 mb-12 max-w-2xl mx-auto leading-relaxed">
          رأيك مهم جداً لنا وهيساعدنا نبني بنها أفضل. تم تسجيل إجاباتك بنجاح وسنعمل على تحليلها.
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
      
      {/* Confetti / Particle placeholders */}
      <div className="absolute top-1/2 left-10 w-4 h-4 bg-primary rounded-full animate-float" style={{ animationDelay: '0.1s' }}></div>
      <div className="absolute top-1/3 right-10 w-6 h-6 bg-secondary rounded-full animate-float" style={{ animationDelay: '0.5s' }}></div>
      <div className="absolute bottom-10 left-1/4 w-5 h-5 bg-accent rounded-full animate-float" style={{ animationDelay: '1.2s' }}></div>
    </div>
  );
}
