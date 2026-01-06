
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import LiquidGlassEffect from './ui/LiquidGlassEffect';

export default function LiquidGlassBackground() {
  const { mode, glassConfig } = useTheme();
  
  return (
    <div className="fixed inset-0 -z-50 pointer-events-none transition-colors duration-1000 overflow-hidden">
        {/* Deep background color layer (always at bottom) */}
        <div 
          className={`absolute inset-0 transition-all duration-1000 ${mode === 'dark' ? 'bg-slate-950' : 'bg-slate-300'}`} 
        />

        {/* Custom Background Image layer */}
        {glassConfig.useCustomBg && glassConfig.customBgImage && (
            <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 animate-in fade-in duration-700"
                style={{ backgroundImage: `url(${glassConfig.customBgImage})` }}
            />
        )}

        {/* Ambient Overlays removed to prevent 'deglassing' and allow pure color output */}

        {/* Liquid Shader layer - acts as a refractive overlay */}
        <LiquidGlassEffect 
          variant="classic" 
          opacity={glassConfig.useCustomBg ? glassConfig.bgOpacity : 0.8} 
          className="z-0" 
        />
    </div>
  );
}
