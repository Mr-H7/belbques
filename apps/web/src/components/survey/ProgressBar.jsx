import React from 'react';

export function ProgressBar({ progress }) {
  const pct = Math.max(0, Math.min(100, Math.round(progress)));
  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="h-3 w-full bg-white/8 rounded-full overflow-hidden border border-white/10">
        <div
          className="h-full bg-gradient-to-l from-[#24b8f3] via-[#3b9ff1] to-[#4d84f7] rounded-full transition-[width] duration-700 ease-out shadow-[0_0_18px_rgba(56,189,248,0.45)]"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
