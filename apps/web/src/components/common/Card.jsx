
import React from 'react';

export function Card({ 
  children, 
  variant = 'glass', 
  className = '', 
  ...props 
}) {
  const variants = {
    glass: 'glass-card text-foreground',
    solid: 'bg-card text-card-foreground border border-border',
    flat: 'bg-transparent text-foreground'
  };

  return (
    <div 
      className={`rounded-2xl overflow-hidden ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
