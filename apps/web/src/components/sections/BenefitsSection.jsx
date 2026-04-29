import React from 'react';
import { BenefitCard } from '@/components/common/BenefitCard.jsx';
import { Heart, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useAnimation } from '@/hooks/useAnimation.js';

export function BenefitsSection() {
  const { ref, isVisible } = useAnimation();

  return (
    <section id="benefits" className="py-28 sm:py-32 relative overflow-hidden">
      <div className="section-divider mb-16 sm:mb-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          ref={ref}
          className={`text-center mb-14 sm:mb-16 transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <p className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold bg-white/5 border border-white/10 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            لماذا المشاركة مهمة؟
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-foreground mb-5">
            رأيك يصنع فرقاً حقيقياً
          </h2>
          <p className="text-lg sm:text-xl text-foreground/72 max-w-2xl mx-auto leading-relaxed">
            كل إجابة تساعدنا نفهم الاحتياجات الفعلية لسكان بنها، ونحوّلها إلى قرارات تطوير مدروسة.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 sm:gap-8">
          <BenefitCard
            icon={Heart}
            title="صوتك مهم"
            description="اقتراحاتك وملاحظاتك ترسم أولويات واضحة لتحسين الخدمات الأساسية."
            delay={80}
          />
          <BenefitCard
            icon={Users}
            title="مشاركة مجتمعية"
            description="نجمع آراء شرائح مختلفة من السكان لضمان قرارات عادلة ومتوازنة."
            delay={160}
          />
          <BenefitCard
            icon={TrendingUp}
            title="تطوير مبني على بيانات"
            description="النتائج تتحول إلى مؤشرات تساعد الجهات المعنية على التخطيط بثقة."
            delay={240}
          />
          <BenefitCard
            icon={Sparkles}
            title="رؤية مستقبلية"
            description="بمساهمتك اليوم، نقترب خطوة من مدينة أكثر كفاءة وجودة حياة."
            delay={320}
          />
        </div>
      </div>

      <div className="absolute top-0 right-0 w-[420px] h-[420px] bg-primary/8 rounded-full blur-[110px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
    </section>
  );
}
