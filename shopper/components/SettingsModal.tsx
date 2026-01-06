
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { THEMES } from '../constants';
import { ThemeName } from '../types';
import { Button } from './ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const themeColors: Record<ThemeName, string> = {
    blue: 'bg-blue-500', green: 'bg-green-500', purple: 'bg-purple-500',
    orange: 'bg-orange-500', red: 'bg-red-500', pink: 'bg-pink-500',
    teal: 'bg-teal-500', yellow: 'bg-yellow-500', indigo: 'bg-indigo-500', gray: 'bg-gray-500',
}

interface LiquidToggleProps {
  checked: boolean;
  onChange: () => void;
}

function LiquidToggle({ checked, onChange }: LiquidToggleProps) {
  const { themeClasses, glassConfig } = useTheme();
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState({ x: 0, pullX: 0, pullY: 0 });

  const TRACK_W = 52;
  const TRACK_H = 26;
  const THUMB_W = 29;
  const THUMB_H = 18;
  const MAX_X = TRACK_W - THUMB_W - 8; 
  const STRETCH_STRENGTH = 0.4; // Slightly increased for more "honey" feel

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    updateDrag(e);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateDrag(e);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = MAX_X / 2;
    const newState = dragState.x > threshold;
    if (newState !== checked) {
        onChange();
    }
    
    setDragState({ x: newState ? MAX_X : 0, pullX: 0, pullY: 0 });
  };

  const updateDrag = (e: React.PointerEvent) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    
    const relX = e.clientX - rect.left - (THUMB_W / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    
    const constrainedX = Math.max(0, Math.min(relX, MAX_X));
    const pullX = relX < 0 ? relX : (relX > MAX_X ? relX - MAX_X : 0);
    const pullY = relY;

    setDragState({
        x: constrainedX,
        pullX: pullX,
        pullY: pullY
    });
  };

  const getScales = () => {
    // Honeylike mechanics: Base viscous expansion (active state)
    const baseExpansion = isDragging ? 1.55 : 1.0;
    
    // Core squish factor from global "honey" rules
    // Honey behaves elastically: stretches on X when compressed or moving fast
    const squishX = isDragging ? 1.12 : 1.0;
    const squishY = isDragging ? 0.88 : 1.0;

    const dx = dragState.pullX * STRETCH_STRENGTH;
    const dy = dragState.pullY * STRETCH_STRENGTH;
    const deformation = Math.abs(dx) - Math.abs(dy);
    
    // Combine base viscous state with movement deformation
    const sx = (baseExpansion * squishX) + (deformation * 0.06);
    const sy = (baseExpansion * squishY) - (deformation * 0.06);
    
    const minAllowed = 0.6;
    const maxAllowed = 2.2;

    return { 
        sx: Math.max(minAllowed, Math.min(sx, maxAllowed)), 
        sy: Math.max(minAllowed, Math.min(sy, maxAllowed)) 
    };
  };

  const { sx, sy } = getScales();
  const currentX = isDragging ? dragState.x : (checked ? MAX_X : 0);
  
  const isPastHalfway = dragState.x > MAX_X / 2;
  const isActivated = isDragging ? isPastHalfway : checked;

  // Optimized Honey Bezier for snappier (but viscous) response
  const HONEY_BEZIER = 'cubic-bezier(0.5, 0, 0.2, 1)';

  return (
    <div
      ref={trackRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ width: `${TRACK_W}px`, height: `${TRACK_H}px` }}
      className={`group relative rounded-full transition-colors duration-500 cursor-pointer overflow-visible shadow-inner flex items-center ${
        isActivated ? themeClasses.primaryBg : 'bg-black/10 dark:bg-white/10'
      }`}
    >
      <div
        style={{
          width: `${THUMB_W}px`,
          height: `${THUMB_H}px`,
          left: '4px',
          translate: `${currentX}px 0`,
          scale: `${sx} ${sy}`,
          transition: `
            translate ${isDragging ? '0s' : `0.5s ${HONEY_BEZIER}`},
            scale ${isDragging ? '0s' : `0.4s ${HONEY_BEZIER}`},
            background 0.3s ease,
            backdrop-filter 0.3s ease
          `,
          backdropFilter: isDragging ? `blur(${glassConfig.blurAmount}px)` : 'none',
          WebkitBackdropFilter: isDragging ? `blur(${glassConfig.blurAmount}px)` : 'none',
          borderRadius: '9999px',
          background: isDragging 
            ? 'rgba(255, 255, 255, 0.1)' 
            : '#ffffff',
          border: 'none',
          boxShadow: isDragging 
            ? '0 12px 32px rgba(0,0,0,0.15), inset 0 1px 1px rgba(255,255,255,0.08)' 
            : '0 4px 12px rgba(0,0,0,0.08)',
          willChange: 'translate, scale'
        }}
        className={`absolute flex items-center justify-center liquid-toggle-handle z-10`}
      />
    </div>
  );
}

interface LiquidRangeSliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (val: number) => void;
  label: string;
  valueDisplay: string;
}

function LiquidRangeSlider({ min, max, step = 1, value, onChange, label, valueDisplay }: LiquidRangeSliderProps) {
  const { mode, glassConfig, themeClasses } = useTheme();
  const [isDragging, setIsDragging] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  
  const [dragInfo, setDragInfo] = useState({ 
    percentage: ((value - min) / (max - min)) * 100,
    velocity: 0,
    lastX: 0
  });

  useEffect(() => {
    setDragInfo(prev => ({
        ...prev,
        percentage: ((value - min) / (max - min)) * 100
    }));
  }, [value, min, max]);

  const updateValue = useCallback((clientX: number, isEnding: boolean = false) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = (x / rect.width) * 100;
    
    const rawValue = (x / rect.width) * (max - min) + min;
    const steppedValue = Math.round(rawValue / step) * step;
    const finalValue = Math.max(min, Math.min(steppedValue, max));

    const dx = clientX - dragInfo.lastX;
    const velocity = Math.min(Math.max(dx, -30), 30); 

    setDragInfo({
        percentage,
        velocity: isEnding ? 0 : velocity,
        lastX: clientX
    });

    if (finalValue !== value) {
        onChange(finalValue);
    }
  }, [min, max, step, value, onChange, dragInfo.lastX]);

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragInfo(prev => ({ ...prev, lastX: e.clientX }));
    updateValue(e.clientX);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    updateValue(e.clientX);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    updateValue(e.clientX, true);
  };

  // Viscous honey mechanics for the slider ball
  const baseScale = isDragging ? 1.6 : 1.0;
  const stretchFactor = Math.abs(dragInfo.velocity) * 0.04;
  
  // Stretching along movement vector, squishing on perpendicular
  const sx = baseScale + stretchFactor;
  const sy = baseScale - (stretchFactor * 0.45);

  const HONEY_BEZIER = 'cubic-bezier(0.5, 0, 0.2, 1)';

  return (
    <div className="space-y-2 select-none">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-bold tracking-tight">{label}</span>
        <span className="text-xs font-black">{valueDisplay}</span>
      </div>
      
      <div 
        ref={trackRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative h-8 flex items-center cursor-pointer touch-none"
      >
        <div className={`w-full h-3 rounded-full overflow-hidden ${mode === 'dark' ? 'bg-white/10' : 'bg-black/10'}`}>
            <div 
              className={`h-full transition-all duration-300 ${themeClasses.primaryBg}`}
              style={{ width: `${dragInfo.percentage}%` }}
            />
        </div>

        <div 
          style={{
            left: `${dragInfo.percentage}%`,
            width: '22px',
            height: '22px',
            translate: '-50% -50%',
            scale: `${sx} ${sy}`,
            transition: `
              left ${isDragging ? '0s' : `0.5s ${HONEY_BEZIER}`},
              scale ${isDragging ? '0s' : `0.4s ${HONEY_BEZIER}`},
              background 0.3s ease,
              backdrop-filter 0.3s ease
            `,
            background: isDragging 
              ? 'rgba(255, 255, 255, 0.1)' 
              : '#ffffff',
            backdropFilter: isDragging ? `blur(${glassConfig.blurAmount}px)` : 'none',
            WebkitBackdropFilter: isDragging ? `blur(${glassConfig.blurAmount}px)` : 'none',
            borderRadius: '50%',
            boxShadow: isDragging 
                ? '0 12px 32px rgba(0,0,0,0.2), inset 0 1px 1px rgba(255,255,255,0.08)' 
                : '0 4px 12px rgba(0,0,0,0.1)',
            willChange: 'left, scale'
          }}
          className="absolute top-1/2 z-20 pointer-events-none"
        />
      </div>
    </div>
  );
}

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { theme, setTheme, mode, setMode, glassConfig, setGlassConfig, themeClasses } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large. Please use a file smaller than 2MB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setGlassConfig({
          ...glassConfig,
          customBgImage: reader.result as string,
          useCustomBg: true
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const inputGlassStyle = {
    backdropFilter: `blur(${glassConfig.blurAmount}px)`,
    WebkitBackdropFilter: `blur(${glassConfig.blurAmount}px)`,
  };

  const inputBaseClasses = `w-full p-3 border shadow-2xl transition-all duration-300 hover:scale-[1.065] focus:scale-[1.065] focus:outline-none focus:ring-2 rounded-full bg-transparent ${themeClasses.inputText} placeholder:text-current ${themeClasses.cardBorder} ${themeClasses.ring}`;

  return (
    <div className="fixed inset-0 bg-black/30 z-[100] flex justify-center items-center backdrop-blur-sm" onClick={onClose}>
      <div 
        className={`relative rounded-[2.5rem] border shadow-2xl w-full max-w-md m-4 transition-all duration-300 ${themeClasses.cardBorder} ${themeClasses.cardBg} overflow-hidden flex flex-col`} 
        style={{
            backdropFilter: `blur(${glassConfig.blurAmount}px)`,
            WebkitBackdropFilter: `blur(${glassConfig.blurAmount}px)`,
            maxHeight: '90vh'
        }}
        onClick={e => e.stopPropagation()}
      >
        <div className="relative z-10 overflow-y-auto overflow-x-hidden p-8 flex-grow">
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-3xl font-black tracking-tighter uppercase">Customization</h2>
                <button 
                  onClick={onClose} 
                  className={`p-2 rounded-full liquid-elastic transition-all hover:scale-125 active:scale-90 hover:bg-black/5 dark:hover:bg-white/10 ${themeClasses.text}`}
                  aria-label="Close customization panel"
                >
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            <div className="space-y-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <span className="font-bold text-lg tracking-tight">Dark Mode</span>
                        <LiquidToggle 
                          checked={mode === 'dark'} 
                          onChange={() => setMode(mode === 'light' ? 'dark' : 'light')} 
                        />
                    </div>

                    <div>
                        <span className="text-xs font-black uppercase tracking-widest block mb-4">Accent Color</span>
                        <div className="grid grid-cols-5 gap-3 px-2">
                            {(Object.keys(THEMES) as ThemeName[]).map(t => (
                                <button 
                                    key={t} 
                                    onClick={() => setTheme(t)} 
                                    className={`w-full aspect-square rounded-2xl transition-all duration-300 ${themeColors[t]} ${theme === t ? 'ring-4 ring-offset-2 ring-current scale-125 shadow-xl z-10' : 'hover:scale-110'}`} 
                                />
                            ))}
                        </div>
                    </div>

                    <LiquidRangeSlider 
                      label="UI Blur Intensity"
                      min={0}
                      max={64}
                      value={glassConfig.blurAmount}
                      onChange={val => setGlassConfig({ ...glassConfig, blurAmount: val })}
                      valueDisplay={`${glassConfig.blurAmount}px`}
                    />
                </div>

                <div className="pt-8 border-t border-black/10 dark:border-white/20 space-y-4">
                    <span className="text-xs font-black uppercase tracking-widest block">Custom Background</span>
                    
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-bold tracking-tight">Use Custom Image</span>
                        <LiquidToggle 
                          checked={glassConfig.useCustomBg} 
                          onChange={() => setGlassConfig({ ...glassConfig, useCustomBg: !glassConfig.useCustomBg })} 
                        />
                    </div>

                    {glassConfig.useCustomBg && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div>
                                <label className="block text-xs font-black mb-1">Image URL</label>
                                <input 
                                    type="text" 
                                    value={glassConfig.customBgImage?.startsWith('data:') ? '' : glassConfig.customBgImage || ''} 
                                    onChange={e => setGlassConfig({ ...glassConfig, customBgImage: e.target.value })} 
                                    placeholder="Paste URL here..."
                                    className={inputBaseClasses}
                                    style={inputGlassStyle}
                                />
                            </div>
                            
                            <div className="flex gap-2">
                                <Button 
                                    onClick={() => fileInputRef.current?.click()} 
                                    variant="secondary" 
                                    className="text-[10px] py-1.5 px-3 flex-1"
                                >
                                    Upload Local File
                                </Button>
                                {glassConfig.customBgImage && (
                                    <Button 
                                        onClick={() => setGlassConfig({ ...glassConfig, customBgImage: undefined })} 
                                        variant="destructive" 
                                        className="text-[10px] py-1.5 px-3 flex-1"
                                    >
                                        Clear Image
                                    </Button>
                                )}
                            </div>
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                onChange={handleFileUpload} 
                                accept="image/*" 
                                className="hidden" 
                            />

                            <LiquidRangeSlider 
                                label="Liquid Overlay Opacity"
                                min={0}
                                max={1}
                                step={0.01}
                                value={glassConfig.bgOpacity}
                                onChange={val => setGlassConfig({ ...glassConfig, bgOpacity: val })}
                                valueDisplay={`${Math.round(glassConfig.bgOpacity * 100)}%`}
                            />
                        </div>
                    )}
                </div>

                <div className="pt-8 border-t border-black/10 dark:border-white/20 space-y-6 pb-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] block -mb-2">Liquid Background Engine</span>
                    
                    <LiquidRangeSlider 
                        label="Noise Scale (Frequency)"
                        min={0.1}
                        max={10}
                        step={0.1}
                        value={glassConfig.frequency}
                        onChange={val => setGlassConfig({ ...glassConfig, frequency: val })}
                        valueDisplay={glassConfig.frequency.toFixed(1)}
                    />

                    <LiquidRangeSlider 
                        label="Viscosity (Displacement)"
                        min={0}
                        max={100}
                        value={glassConfig.displacementScale}
                        onChange={val => setGlassConfig({ ...glassConfig, displacementScale: val })}
                        valueDisplay={glassConfig.displacementScale.toString()}
                    />

                    <LiquidRangeSlider 
                        label="Color Bleed (Aberration)"
                        min={0}
                        max={100}
                        value={glassConfig.chromaticAberration}
                        onChange={val => setGlassConfig({ ...glassConfig, chromaticAberration: val })}
                        valueDisplay={glassConfig.chromaticAberration.toString()}
                    />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
