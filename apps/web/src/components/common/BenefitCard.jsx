import React from 'react';
import { Card } from './Card.jsx';
import { useAnimation } from '@/hooks/useAnimation.js';

export function BenefitCard({ icon: Icon, title, description, delay = 0 }) {
  const { ref, isVisible } = useAnimation();

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transform transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}
    >
      <Card className="p-7 sm:p-8 h-full premium-shadow hover:premium-shadow-lg hover:-translate-y-1.5 transition-all duration-300 border border-white/15 bg-[#112244]/65 backdrop-blur-xl">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-xl bg-primary/14 border border-primary/30 flex items-center justify-center mb-5">
            <Icon className="w-7 h-7 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">
            {title}
          </h3>
          <p className="text-foreground/78 leading-relaxed text-sm sm:text-base">
            {description}
          </p>
        </div>
      </Card>
    </div>
  );
}
