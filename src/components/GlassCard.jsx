import React from 'react';

export function GlassCard({ children, className = '', ...props }) {
  return (
    <div className={`glass-panel p-6 ${className}`} {...props}>
      {children}
    </div>
  );
}
