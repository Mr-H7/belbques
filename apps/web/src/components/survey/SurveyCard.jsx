import React from 'react';
import { Card } from '@/components/common/Card.jsx';

export function SurveyCard({ children, title, description }) {
  return (
    <div className="relative">
      <div className="absolute -inset-4 sm:-inset-6 bg-primary/10 blur-3xl rounded-[2.5rem] -z-10 opacity-60" />
      <Card className="p-6 sm:p-8 md:p-10 premium-shadow border border-white/5 bg-card/60 backdrop-blur-xl">
        {(title || description) && (
          <div className="mb-6 sm:mb-8">
            {title && (
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-2 text-sm sm:text-base text-foreground/65">{description}</p>
            )}
          </div>
        )}
        {children}
      </Card>
    </div>
  );
}
