
import React from 'react';
import { ShoppingListItem, ThemeName, ThemeMode, ThemeClasses, GlassConfig } from '../types';

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  glassConfig: GlassConfig;
  setGlassConfig: (config: GlassConfig) => void;
  themeClasses: ThemeClasses;
  generationProgress: number;
  setGenerationProgress: React.Dispatch<React.SetStateAction<number>>;
  showDebug: boolean;
  setShowDebug: (show: boolean) => void;
  setShoppingList: React.Dispatch<React.SetStateAction<ShoppingListItem[]>>;
}

export const ThemeContext = React.createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
