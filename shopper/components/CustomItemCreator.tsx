
import { GoogleGenAI } from "@google/genai";
import React, { useState, useRef } from 'react';
import { CustomItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Card } from './ui/Card';
import { Button } from './ui/Button';

const removeBlackBackground = (base64: string): Promise<string> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                resolve(base64);
                return;
            }
            ctx.drawImage(img, 0, 0);
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const threshold = 45; 

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                if (r < threshold && g < threshold && b < threshold) {
                    data[i + 3] = 0;
                }
            }

            ctx.putImageData(imageData, 0, 0);
            const result = canvas.toDataURL('image/png');
            resolve(result);
        };
        img.onerror = () => {
            console.error("Failed to load image for background removal");
            resolve(base64);
        };
        img.src = base64;
    });
};

interface CustomItemCreatorProps {
  onItemCreated: (itemData: Omit<CustomItem, 'id'>, save: boolean) => void;
}

export default function CustomItemCreator({ onItemCreated }: CustomItemCreatorProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('');
  const [saveItem, setSaveItem] = useState(true);
  const [isSuggestingEmoji, setIsSuggestingEmoji] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const { themeClasses, setGenerationProgress, glassConfig } = useTheme();
  const progressIntervalRef = useRef<number | null>(null);

  const startProgress = () => {
      setGenerationProgress(10);
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = window.setInterval(() => {
          setGenerationProgress(prev => {
              if (prev >= 95) return 95;
              return prev + (98 - prev) * 0.12;
          });
      }, 400);
  };

  const endProgress = () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setGenerationProgress(100);
      setTimeout(() => setGenerationProgress(0), 600);
  };

  const handleSuggestIcon = async () => {
    if (!name.trim()) return alert('Please enter an item name first.');
    if (!process.env.API_KEY) return alert('API Key is missing. Please check your configuration.');
    setIsSuggestingEmoji(true);
    startProgress();
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Suggest a single, simple, common emoji for a shopping list item: "${name}". Respond with ONLY the emoji, no other characters or text.`,
        });
        const text = response.text || '';
        const emojiMatch = text.match(/\p{Emoji}/u);
        const suggestedIcon = emojiMatch ? emojiMatch[0] : '';
        if (suggestedIcon) setIcon(suggestedIcon);
    } catch (error) {
        console.error('Error suggesting icon:', error);
    } finally {
        setIsSuggestingEmoji(false);
        endProgress();
    }
  };

  const handleGenerateImage = async () => {
    if (!name.trim()) return alert('Please enter an item name first.');
    if (!process.env.API_KEY) return alert('API Key is missing. Please check your configuration.');
    setIsGeneratingImage(true);
    setIcon('');
    startProgress();
    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { 
                parts: [{ 
                    text: `A simple, vibrant, minimalist flat icon for "${name}". Professional clean design, centered on a solid, PURE PITCH BLACK background (#000000). No shadows, no gradients on the background, high contrast, bold colors.` 
                }] 
            },
        });
        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    const base64 = `data:image/png;base64,${part.inlineData.data}`;
                    const transparentBase64 = await removeBlackBackground(base64);
                    setIcon(transparentBase64);
                    break;
                }
            }
        }
    } catch(error) {
        console.error("Image generation error: ", error);
    } finally {
        setIsGeneratingImage(false);
        endProgress();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !icon.trim()) return;
    onItemCreated({ name, icon }, saveItem);
    setName('');
    setIcon('');
  };

  const inputGlassStyle = {
    backdropFilter: `blur(${glassConfig.blurAmount}px)`,
    WebkitBackdropFilter: `blur(${glassConfig.blurAmount}px)`,
  };

  const inputBaseClasses = `w-full p-3 border shadow-2xl transition-all duration-300 hover:scale-[1.065] focus:scale-[1.065] focus:outline-none focus:ring-2 rounded-full bg-transparent ${themeClasses.inputText} placeholder:text-current ${themeClasses.cardBorder} ${themeClasses.ring}`;

  const isLoading = isSuggestingEmoji || isGeneratingImage;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-4">Create Item</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label htmlFor="itemName" className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">Item Name</label>
          <input
            id="itemName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type name here..."
            className={inputBaseClasses}
            style={inputGlassStyle}
            required
          />
        </div>

        <div>
            <label className="block text-xs font-bold uppercase tracking-widest mb-2 ml-1">Icon Preview</label>
            <div className="flex items-center gap-4">
                <div 
                  className={`flex items-center justify-center w-24 h-24 rounded-[1.5rem] border shadow-2xl overflow-hidden transition-all duration-300 hover:scale-[1.065] ${themeClasses.cardBorder} bg-transparent`}
                  style={inputGlassStyle}
                >
                    {isLoading ? (
                        <div className="flex flex-col items-center gap-1">
                            <svg className={`animate-spin h-8 w-8 ${themeClasses.text}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                    ) : icon && icon.startsWith('data:image') ? (
                       <img src={icon} alt={name} className="w-full h-full object-contain p-2" />
                    ) : (
                       <span className="text-4xl">{icon || '📦'}</span>
                    )}
                </div>
                <div className="flex-grow space-y-3">
                    <input 
                      type="text" 
                      value={icon && icon.startsWith('data:image') ? 'AI Generated Icon' : icon} 
                      onChange={e => setIcon(e.target.value)} 
                      placeholder="Paste emoji or type here" 
                      className={inputBaseClasses}
                      style={inputGlassStyle}
                      disabled={icon && icon.startsWith('data:image')} 
                    />
                    <div className="flex gap-2">
                        <Button type="button" onClick={handleSuggestIcon} disabled={isLoading || !name} variant="secondary" className="text-[11px] py-2 px-3 flex-1">Emoji AI</Button>
                        <Button type="button" onClick={handleGenerateImage} disabled={isLoading || !name} variant="secondary" className="text-[11px] py-2 px-3 flex-1">Image AI</Button>
                    </div>
                </div>
            </div>
        </div>
        
        <div 
            className="flex items-center space-x-3 pt-2 group cursor-pointer"
            onClick={() => setSaveItem(!saveItem)}
        >
            <div className={`
                relative flex items-center justify-center h-6 w-6 rounded-full border-2 transition-all duration-500 liquid-elastic
                ${saveItem ? themeClasses.cardBorder + ' ' + themeClasses.primaryBg : 'border-black/20 dark:border-white/20'}
            `}>
                <div className={`
                    h-2.5 w-2.5 rounded-full bg-white transition-all duration-500 liquid-elastic
                    ${saveItem ? 'scale-100' : 'scale-0'}
                `} />
            </div>
            <label className="text-sm font-bold cursor-pointer select-none">Save to library</label>
        </div>

        <Button type="submit" className="w-full font-black py-4 shadow-xl" disabled={isLoading}>
          ADD TO LIST
        </Button>
      </form>
    </Card>
  );
}
