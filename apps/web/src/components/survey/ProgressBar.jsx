import React from 'react';

export function ProgressBar({ progress }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div className="w-full max-w-md mx-auto">
      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-l from-primary via-primary to-accent rounded-full transition-[width] duration-700 ease-out shadow-[0_0_12px_rgba(96,165,250,0.5)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
