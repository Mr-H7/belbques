import React from 'react';
import { Button } from '@/components/common/Button.jsx';
import { useAppSettings } from '@/context/AppSettingsContext.jsx';

const DEFAULT_TITLE = 'بنها بتقول إيه؟';
const DEFAULT_SUBTITLE = 'شاركنا رأيك وساعدنا نفهم المدينة أكتر';

export function HeroSection() {
  const { general, surveyState } = useAppSettings();
  const title = general?.title?.trim() || DEFAULT_TITLE;
  const subtitle = general?.subtitle?.trim() || DEFAULT_SUBTITLE;
  const scrollToSurvey = () => {
    const section = document.getElementById('survey-section');
    if (section) section.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">
      {/* Background gradient + glow blobs */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-background via-[#162033] to-background" />
      <div className="absolute -top-32 -right-32 w-[520px] h-[520px] bg-primary/10 rounded-full blur-[140px] -z-10 animate-parallax" />
      <div className="absolute -bottom-32 -left-32 w-[520px] h-[520px] bg-accent/10 rounded-full blur-[140px] -z-10 animate-parallax" style={{ animationDirection: 'reverse' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Copy */}
        <div className="text-center md:text-right order-2 md:order-1">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-card border border-white/10 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
            <span className="text-foreground/90 text-sm font-bold tracking-wide">صوت بنها</span>
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-7xl font-extrabold text-foreground mb-6 animate-fade-in text-glow leading-[1.05]"
            style={{ letterSpacing: '-0.02em', animationDelay: '0.15s' }}
          >
            {title}
          </h1>

          <p
            className="text-lg md:text-2xl text-foreground/85 mb-10 max-w-xl mx-auto md:mx-0 leading-relaxed animate-fade-in"
            style={{ animationDelay: '0.3s' }}
          >
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 animate-fade-in" style={{ animationDelay: '0.45s' }}>
            <Button
              onClick={scrollToSurvey}
              size="lg"
              disabled={!surveyState.open}
              className={`font-extrabold w-full sm:w-auto ${surveyState.open ? 'animate-glow' : ''}`}
            >
              {surveyState.open ? 'ابدأ الاستبيان' : 'الاستبيان مغلق حالياً'}
            </Button>
            <div className="flex items-center gap-4 text-sm text-foreground/60">
              <span>⏱ ~3 دقائق</span>
              <span className="w-1 h-1 bg-foreground/30 rounded-full" />
              <span>🔒 مجهول الهوية</span>
            </div>
          </div>
        </div>

        {/* Floating image */}
        <div className="order-1 md:order-2 flex justify-center md:justify-end">
          <div className="relative w-full max-w-[440px]">
            <div className="absolute -inset-6 bg-primary/20 blur-3xl rounded-[2.5rem] -z-10" />
            <div
              className="animate-float-vertical relative w-full rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] glass-card aspect-[4/5]"
            >
              <img
                src="/benha-hero.jpg"
                alt="مدينة بنها"
                className="absolute inset-0 w-full h-full object-cover object-center select-none"
                loading="eager"
                decoding="async"
                draggable="false"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-5 right-5 left-5 flex items-center justify-between text-xs text-foreground/90">
                <span className="px-3 py-1 rounded-full glass-card border border-white/10 backdrop-blur-md">القليوبية · بنها</span>
                <span className="opacity-70">2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-breathe opacity-60">
        <span className="text-xs uppercase tracking-widest">تمرير</span>
        <div className="w-px h-10 bg-gradient-to-b from-foreground to-transparent" />
      </div>
    </section>
  );
}
