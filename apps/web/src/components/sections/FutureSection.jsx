
import React from 'react';
import { useAnimation } from '@/hooks/useAnimation.js';

export function FutureSection() {
  const { ref, isVisible } = useAnimation({ threshold: 0.3 });

  return (
    <section id="future" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-card/30"></div>
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <div 
          ref={ref}
          className={`transform transition-all duration-1000 ease-out ${
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
        >
          <div className="w-20 h-20 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-8 animate-breathe">
            <span className="text-3xl font-bold text-primary">ب</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-8">
            مستقبل بنها في إيدينا
          </h2>
          <div className="space-y-6 text-xl md:text-2xl text-foreground/80 leading-relaxed max-w-4xl mx-auto">
            <p>
              كل صوت بيساهم في بناء مستقبل أفضل لمدينتنا. معاً نقدر نخلي بنها المكان اللي كلنا نفتخر بيه.
            </p>
            <p className="text-lg md:text-xl text-foreground/60">
              شكراً لكل واحد شارك وساهم في تطوير بنها. رأيك مش مجرد كلام، ده خطوة حقيقية نحو التغيير وبناء رؤية مستقبلية.
            </p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
    </section>
  );
}
