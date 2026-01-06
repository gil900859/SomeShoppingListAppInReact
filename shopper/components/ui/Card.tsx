
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';

interface CardProps {
  children?: React.ReactNode;
  className?: string;
  interactive?: boolean;
}

export function Card({ children, className = "", interactive = false }: CardProps) {
  const { themeClasses, glassConfig } = useTheme();
  
  return (
    <div
      className={`relative overflow-hidden rounded-[2.5rem] border shadow-2xl liquid-elastic 
        ${interactive ? 'hover:scale-[1.03] active:scale-[0.98] active:scale-x-[1.03] active:scale-y-[0.97]' : ''} 
        ${themeClasses.cardBorder} ${themeClasses.cardBg} ${className}`}
      style={{
        backdropFilter: `blur(${glassConfig.blurAmount}px)`,
        WebkitBackdropFilter: `blur(${glassConfig.blurAmount}px)`,
      }}
    >
      {/* Content container - no extra overlays to ensure pure transparency */}
      <div className="relative z-10 p-6 md:p-8">
        {children}
      </div>
    </div>
  );
}
