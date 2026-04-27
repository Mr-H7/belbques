import React from 'react';

export function SurveyInput({ value, onChange, placeholder, error }) {
  return (
    <div className="w-full">
      <textarea
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        className={`w-full p-4 sm:p-5 rounded-2xl bg-card/40 border-2 text-base sm:text-lg leading-relaxed transition-all duration-200 text-card-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:bg-card focus:ring-4 focus:ring-primary/15 resize-y ${
          error ? 'border-destructive' : 'border-white/5 focus:border-primary'
        }`}
      />
      {error && <p className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}
