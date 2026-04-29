import React from 'react';

export function QuestionButton({ children, selected, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full px-5 py-4 sm:py-[18px] rounded-2xl text-right font-semibold text-base sm:text-lg transition-all duration-200 border-2 flex items-center justify-between gap-4 ${
        selected
          ? 'bg-primary/15 text-foreground border-primary shadow-[0_14px_34px_-14px_rgba(56,189,248,0.55)] scale-[1.01]'
          : 'bg-[#0f213f]/65 text-card-foreground border-white/10 hover:bg-[#132a4d] hover:border-primary/35 hover:-translate-y-0.5 hover:shadow-md'
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
