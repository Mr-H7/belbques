
import React from 'react';
import { BenefitCard } from '@/components/common/BenefitCard.jsx';
import { Heart, Users, TrendingUp, Sparkles } from 'lucide-react';
import { useAnimation } from '@/hooks/useAnimation.js';

export function BenefitsSection() {
  const { ref, isVisible } = useAnimation();

  return (
    <section id="benefits" className="py-32 relative overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div 
          ref={ref}
          className={`text-center mb-20 transform transition-all duration-700 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
          }`}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            ليه رأيك مهم؟
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
            كل صوت بيساعدنا نفهم احتياجات المدينة ونبني مستقبل أفضل لبنها
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <BenefitCard
            icon={Heart}
            title="صوتك يهمنا"
            description="رأيك بيساعدنا نفهم احتياجاتك الحقيقية ونحسن الخدمات المقدمة بشكل مباشر"
            delay={100}
          />
          <BenefitCard
            icon={Users}
            title="مجتمع قوي"
            description="لما نشارك أفكارنا، بنبني مجتمع أقوى وأكثر تفاهم بين كل أفراده"
            delay={200}
          />
          <BenefitCard
            icon={TrendingUp}
            title="تطوير حقيقي"
            description="نتائج الاستبيان بتساعد المسؤولين في اتخاذ قرارات تطوير واقعية للمدينة"
            delay={300}
          />
          <BenefitCard
            icon={Sparkles}
            title="مستقبل أفضل"
            description="مشاركتك النهاردة هي الطوبة الأولى في بناء بنها بكرة اللي بنحلم بيها"
            delay={400}
          />
        </div>
      </div>

      {/* Abstract Backgrounds */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/4 pointer-events-none"></div>
    </section>
  );
}
