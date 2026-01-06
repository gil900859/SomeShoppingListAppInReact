
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { ThemeName } from '../../types';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
};

export function Button({ children, variant = 'primary', className = '', onClick, ...props }: ButtonProps) {
  const { theme, themeClasses, glassConfig } = useTheme();
  const { disabled, ...rest } = props;

  /**
   * Calculates the dynamic solid color for destructive actions (Clear All)
   * based on the current theme's "opposite" color or specific requested exceptions.
   */
  const getDestructiveClasses = (currentTheme: ThemeName) => {
    switch (currentTheme) {
      case 'blue':
      case 'green':
      case 'gray':
      case 'teal':
        return 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/40';
      case 'red':
        return 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-cyan-900/40';
      case 'orange':
        return 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-900/40';
      case 'yellow':
        return 'bg-purple-600 text-white hover:bg-purple-700 shadow-purple-900/40';
      case 'purple':
      case 'pink':
      case 'indigo':
        return 'bg-amber-400 text-black hover:bg-amber-500 shadow-amber-900/40';
      default:
        return 'bg-red-600 text-white hover:bg-red-700 shadow-red-900/40';
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'secondary':
        return `bg-transparent ${themeClasses.secondaryText} hover:bg-white/10 dark:hover:bg-black/10 border ${themeClasses.cardBorder}`;
      case 'ghost':
        return `bg-transparent hover:bg-white/10 dark:hover:bg-black/10 ${themeClasses.text}`;
      case 'destructive':
          const dynamicColor = getDestructiveClasses(theme);
          return `${dynamicColor} shadow-lg border border-white/20`;
      case 'primary':
      default:
        return `${themeClasses.primaryBg} ${themeClasses.primaryText} ${themeClasses.primaryBgHover} shadow-lg shadow-current/20 border border-white/20`;
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  const glassStyle = variant === 'secondary' ? {
    backdropFilter: `blur(${glassConfig.blurAmount}px)`,
    WebkitBackdropFilter: `blur(${glassConfig.blurAmount}px)`,
  } : {};

  return (
    <button
      {...rest}
      onClick={handleClick}
      style={glassStyle}
      className={`inline-flex items-center justify-center rounded-full text-sm font-bold liquid-elastic px-6 py-2.5 hover:scale-[1.04] hover:shadow-xl ${getVariantClasses()} ${themeClasses.ring} ${disabled ? 'opacity-50 cursor-default' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
}
