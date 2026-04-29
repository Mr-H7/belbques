import React from 'react';
import { useAnimation } from '@/hooks/useAnimation.js';

export function FutureSection() {
  const { ref, isVisible } = useAnimation({ threshold: 0.3 });

  return (
    <section id="future" className="py-28 sm:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#102343]/35 to-transparent" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div
          ref={ref}
          className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="w-20 h-20 mx-auto rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md flex items-center justify-center mb-8 animate-breathe">
            <img src="/belb-logo.png" alt="شعار بنها" className="w-12 h-12 object-contain logo-mark" />
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-foreground mb-8">
            مستقبل بنها يبدأ من مشاركة الناس
          </h2>

          <div className="space-y-5 text-lg sm:text-xl text-foreground/80 leading-relaxed max-w-4xl mx-auto">
            <p>
              كل صوت يضيف بُعداً جديداً لفهم المدينة. عندما نجمع الآراء بوضوح ونحللها بدقة، تصبح قرارات التطوير أقرب لاحتياجات المواطنين.
            </p>
            <p className="text-base sm:text-lg text-foreground/67">
              شكراً لكل من يشارك في هذه المبادرة. مساهمتك ليست مجرد رأي، بل خطوة عملية نحو مدينة أكثر تنظيماً وكفاءة وجودة حياة.
            </p>
          </div>
        </div>
      </div>

      <div className="section-divider mt-16 sm:mt-20" />
    </section>
  );
}
