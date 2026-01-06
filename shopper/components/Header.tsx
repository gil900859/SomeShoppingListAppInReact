
import React, { useState, useRef } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import SettingsModal from './SettingsModal';

export default function Header() {
  const { themeClasses, generationProgress, glassConfig, setShowDebug } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<number | null>(null);

  const handleSecretClick = () => {
    clickCountRef.current += 1;
    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    
    if (clickCountRef.current >= 7) {
      setShowDebug(true);
      clickCountRef.current = 0;
    } else {
      clickTimerRef.current = window.setTimeout(() => {
        clickCountRef.current = 0;
      }, 3000);
    }
  };

  return (
    <>
      <header 
        className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${themeClasses.cardBorder}`}
        style={{
          backdropFilter: `blur(${glassConfig.blurAmount}px)`,
          WebkitBackdropFilter: `blur(${glassConfig.blurAmount}px)`,
          backgroundColor: 'transparent'
        }}
      >
        <div 
          className="absolute top-0 left-0 h-1 bg-current transition-all duration-300 ease-out z-20 pointer-events-none" 
          style={{ 
            width: `${generationProgress}%`, 
            opacity: generationProgress > 0 && generationProgress < 100 ? 1 : 0,
          }}
        />
        
        <div className="container mx-auto flex justify-between items-center px-4 md:px-8 h-20 relative z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-black tracking-tighter">
              SHOPPING<span className="font-thin italic">LIST</span>
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Secret Debug Trigger */}
            <button 
              onClick={handleSecretClick}
              className="w-10 h-10 opacity-0 cursor-default"
              aria-hidden="true"
            />
            
            <button
              onClick={() => setIsSettingsOpen(true)}
              style={{
                backdropFilter: `blur(${glassConfig.blurAmount}px)`,
                WebkitBackdropFilter: `blur(${glassConfig.blurAmount}px)`,
              }}
              className={`p-3 rounded-full liquid-elastic bg-transparent hover:scale-[1.13] border ${themeClasses.cardBorder} shadow-lg group`}
              aria-label="Open customization settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42" />
              </svg>
            </button>
          </div>
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
}
