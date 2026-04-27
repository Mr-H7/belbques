
import React from 'react';

export function Input({ 
  label, 
  error, 
  id, 
  className = '', 
  ...props 
}) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-foreground mb-2">
          {label}
        </label>
      )}
      <input
        id={id}
        className={`w-full px-4 py-3 rounded-xl bg-card border-2 transition-all duration-200 text-card-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 ${
          error ? 'border-destructive focus:border-destructive' : 'border-border focus:border-primary'
        } ${className}`}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
}
