import React from 'react';
import { Button } from '@/components/common/Button.jsx';
import { useAppSettings } from '@/context/AppSettingsContext.jsx';
import { Clock3, ShieldCheck, Sparkles } from 'lucide-react';

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
    <section className="relative min-h-[96vh] flex items-center overflow-hidden pt-32 pb-20">
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#152c52]/20 via-transparent to-transparent" />
      <div className="absolute -top-24 -right-20 w-[540px] h-[540px] rounded-full bg-cyan-300/10 blur-[140px] animate-parallax -z-10" />
      <div
        className="absolute -bottom-24 -left-20 w-[520px] h-[520px] rounded-full bg-blue-500/10 blur-[130px] animate-parallax -z-10"
        style={{ animationDirection: 'reverse' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
        <div className="text-center lg:text-right order-2 lg:order-1">
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full glass-card border border-white/20 animate-fade-in">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-foreground/90 text-sm font-bold tracking-wide">منصة مدنية رقمية</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl xl:text-7xl font-extrabold text-foreground mb-6 animate-fade-in text-glow leading-[1.05]">
            {title}
          </h1>

          <p className="text-lg md:text-2xl text-foreground/83 mb-9 max-w-2xl mx-auto lg:mx-0 leading-relaxed animate-fade-in">
            {subtitle}
          </p>

          <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4 animate-fade-in">
            <Button
              onClick={scrollToSurvey}
              size="lg"
              disabled={!surveyState.open}
              className={`w-full sm:w-auto px-10 ${surveyState.open ? 'animate-glow' : ''}`}
            >
              {surveyState.open ? 'ابدأ الاستبيان الآن' : 'الاستبيان مغلق حالياً'}
            </Button>
            <a
              href="#benefits"
              className="inline-flex items-center justify-center rounded-2xl h-[62px] px-7 border border-white/20 bg-white/5 text-foreground/90 font-semibold hover:bg-white/10 w-full sm:w-auto"
            >
              تعرّف على أهمية المشاركة
            </a>
          </div>

          <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-3 text-sm text-foreground/75">
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10">
              <Clock3 className="w-4 h-4 text-primary" />
              أقل من 3 دقائق
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-primary" />
              خصوصية المشاركين محفوظة
            </div>
          </div>
        </div>

        <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
          <div className="relative w-full max-w-[480px]">
            <div className="absolute -inset-6 rounded-[2.3rem] bg-primary/12 blur-3xl -z-10" />
            <div className="rounded-[2rem] overflow-hidden border border-white/15 bg-[#0f203f]/65 backdrop-blur-md premium-shadow-lg">
              <div className="p-3 border-b border-white/10">
                <div className="flex items-center justify-between text-xs text-foreground/70">
                  <span className="px-2.5 py-1 rounded-full bg-white/10 border border-white/15">القليوبية · بنها</span>
                  <span>استبيان مجتمعي 2026</span>
                </div>
              </div>
              <div className="relative aspect-[4/5]">
                <img
                  src="/benha-hero.jpg"
                  alt="مدينة بنها"
                  className="absolute inset-0 w-full h-full object-cover object-center select-none"
                  loading="eager"
                  decoding="async"
                  draggable="false"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a1428]/75 via-[#0a1428]/10 to-transparent pointer-events-none" />
                <div className="absolute bottom-5 right-5 left-5">
                  <div className="glass-card rounded-xl px-4 py-3 border-white/15">
                    <p className="text-sm text-foreground/85">
                      منصة موثوقة لقياس آراء المواطنين ودعم القرار المحلي ببيانات واضحة.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-[78%] h-8 rounded-full bg-cyan-300/25 blur-2xl -z-10" />
          </div>
        </div>
      </div>
    </section>
  );
}
