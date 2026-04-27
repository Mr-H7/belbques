import React from 'react';

export function QuestionButton({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full px-5 py-4 sm:py-[18px] rounded-2xl text-right font-semibold text-base sm:text-lg transition-all duration-200 border-2 flex items-center justify-between gap-4 ${
        selected
          ? 'bg-primary text-primary-foreground border-primary shadow-[0_10px_30px_-10px_rgba(96,165,250,0.5)] scale-[1.01]'
          : 'bg-card/40 text-card-foreground border-white/5 hover:bg-card hover:border-primary/40 hover:-translate-y-0.5 hover:shadow-md'
      } active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background`}
      aria-pressed={selected}
    >
      <span className="flex-1">{children}</span>
      <span
        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
          selected ? 'bg-white border-white' : 'border-white/30 group-hover:border-primary/60'
        }`}
      >
        {selected && <span className="w-2 h-2 rounded-full bg-primary" />}
      </span>
    </button>
  );
}
