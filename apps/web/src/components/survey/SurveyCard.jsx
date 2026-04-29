import React from 'react';
import { Card } from '@/components/common/Card.jsx';

export function SurveyCard({ children, title, description }) {
  return (
    <div className="relative">
      <div className="absolute -inset-5 sm:-inset-7 bg-primary/12 blur-3xl rounded-[2.8rem] -z-10 opacity-80" />
      <Card className="p-6 sm:p-8 md:p-10 premium-shadow-lg border border-white/15 bg-[#10213f]/72 backdrop-blur-2xl rounded-[2rem]">
        {(title || description) && (
          <div className="mb-6 sm:mb-8">
            {title && (
              <h3 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-foreground leading-snug">
                {title}
              </h3>
            )}
            {description && (
              <p className="mt-2.5 text-sm sm:text-base text-foreground/70">{description}</p>
            )}
          </div>
        )}
        {children}
      </Card>
    </div>
  );
}
