
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
      <Card className="p-8 h-full premium-shadow hover:premium-shadow-lg hover:-translate-y-2 transition-all duration-300">
        <div className="flex flex-col items-center text-center">
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
            <Icon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3">
            {title}
          </h3>
          <p className="text-foreground/80 leading-relaxed">
            {description}
          </p>
        </div>
      </Card>
    </div>
  );
}
