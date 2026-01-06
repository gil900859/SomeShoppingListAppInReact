
export interface ShoppingListItem {
  id: string;
  name: string;
  icon: string;
  completed: boolean;
}

export interface CustomItem {
  id: string;
  name: string;
  icon: string;
}

export type ThemeName = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'pink' | 'teal' | 'yellow' | 'indigo' | 'gray';
export type ThemeMode = 'light' | 'dark';
export type RefractionMode = 'standard' | 'polar' | 'prominent';

export interface GlassConfig {
  refractionMode: RefractionMode;
  displacementScale: number;
  blurAmount: number;
  saturation: number;
  chromaticAberration: number;
  elasticity: number;
  overLight: boolean;
  frequency: number;
  amplitude: number;
  customBgImage?: string;
  useCustomBg: boolean;
  bgOpacity: number;
  showCheckerboard?: boolean;
}

export interface ThemeClasses {
  bg: string;
  text: string;
  primaryBg: string;
  primaryBgHover: string;
  primaryText: string;
  secondaryBg: string;
  secondaryBgHover: string;
  secondaryText: string;
  cardBg: string;
  cardBorder: string;
  inputBg: string;
  inputText: string;
  inputBorder: string;
  inputFocusBorder: string;
  ring: string;
}
