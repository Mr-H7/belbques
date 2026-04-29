import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  className = '',
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-bold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none';

  const variants = {
    primary: 'bg-gradient-to-l from-[#2a8ee7] via-[#35bdf5] to-[#2a8ee7] bg-[length:170%_170%] text-primary-foreground border border-cyan-200/25 hover:shadow-[0_14px_34px_-14px_rgba(56,189,248,0.65)] hover:-translate-y-0.5',
    secondary: 'bg-secondary/95 text-secondary-foreground border border-white/35 hover:bg-secondary hover:-translate-y-0.5 shadow',
    ghost: 'bg-transparent text-foreground hover:bg-white/10 border border-transparent hover:border-white/15',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-10 py-5 text-lg rounded-2xl',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4zm2 5.29A7.96 7.96 0 014 12H0c0 3.04 1.13 5.82 3 7.94l3-2.65z" />
          </svg>
          جاري التحميل...
        </span>
      ) : children}
    </button>
  );
}
