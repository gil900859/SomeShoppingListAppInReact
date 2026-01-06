
import type { ThemeName, ThemeMode, ThemeClasses } from './types';

export const THEMES: Record<ThemeName, Record<ThemeMode, ThemeClasses>> = {
  blue: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-blue-500/80', primaryBgHover: 'hover:bg-blue-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-blue-100/10', secondaryBgHover: 'hover:bg-blue-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-blue-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-blue-300/20', inputFocusBorder: 'focus:border-blue-500',
      ring: 'ring-blue-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-blue-600/80', primaryBgHover: 'hover:bg-blue-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-blue-900/10', secondaryBgHover: 'hover:bg-blue-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-blue-800/20',
      inputBg: 'bg-blue-950/10', inputText: 'text-white', inputBorder: 'border-blue-700/20', inputFocusBorder: 'focus:border-blue-500',
      ring: 'ring-blue-500'
    },
  },
  green: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-green-500/80', primaryBgHover: 'hover:bg-green-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-green-100/10', secondaryBgHover: 'hover:bg-green-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-green-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-green-300/20', inputFocusBorder: 'focus:border-green-500',
      ring: 'ring-green-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-green-600/80', primaryBgHover: 'hover:bg-green-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-green-900/10', secondaryBgHover: 'hover:bg-green-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-green-800/20',
      inputBg: 'bg-green-900/10', inputText: 'text-white', inputBorder: 'border-green-700/20', inputFocusBorder: 'focus:border-green-500',
      ring: 'ring-green-500'
    },
  },
  purple: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-purple-500/80', primaryBgHover: 'hover:bg-purple-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-purple-100/10', secondaryBgHover: 'hover:bg-purple-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-purple-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-purple-300/20', inputFocusBorder: 'focus:border-purple-500',
      ring: 'ring-purple-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-purple-600/80', primaryBgHover: 'hover:bg-purple-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-purple-900/10', secondaryBgHover: 'hover:bg-purple-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-purple-800/20',
      inputBg: 'bg-purple-900/10', inputText: 'text-white', inputBorder: 'border-purple-700/20', inputFocusBorder: 'focus:border-purple-500',
      ring: 'ring-purple-500'
    },
  },
  orange: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-orange-500/80', primaryBgHover: 'hover:bg-orange-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-orange-100/10', secondaryBgHover: 'hover:bg-orange-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-orange-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-orange-300/20', inputFocusBorder: 'focus:border-orange-500',
      ring: 'ring-orange-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-orange-600/80', primaryBgHover: 'hover:bg-orange-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-orange-900/10', secondaryBgHover: 'hover:bg-orange-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-orange-800/20',
      inputBg: 'bg-orange-900/10', inputText: 'text-white', inputBorder: 'border-orange-700/20', inputFocusBorder: 'focus:border-orange-500',
      ring: 'ring-orange-500'
    },
  },
  red: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-red-500/80', primaryBgHover: 'hover:bg-red-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-red-100/10', secondaryBgHover: 'hover:bg-red-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-red-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-red-300/20', inputFocusBorder: 'focus:border-red-500',
      ring: 'ring-red-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-red-600/80', primaryBgHover: 'hover:bg-red-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-red-900/10', secondaryBgHover: 'hover:bg-red-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-red-800/20',
      inputBg: 'bg-red-900/10', inputText: 'text-white', inputBorder: 'border-red-700/20', inputFocusBorder: 'focus:border-red-500',
      ring: 'ring-red-500'
    },
  },
  pink: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-pink-500/80', primaryBgHover: 'hover:bg-pink-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-pink-100/10', secondaryBgHover: 'hover:bg-pink-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-pink-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-pink-300/20', inputFocusBorder: 'focus:border-pink-500',
      ring: 'ring-pink-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-pink-600/80', primaryBgHover: 'hover:bg-pink-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-pink-900/10', secondaryBgHover: 'hover:bg-pink-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-pink-800/20',
      inputBg: 'bg-pink-900/10', inputText: 'text-white', inputBorder: 'border-pink-700/20', inputFocusBorder: 'focus:border-pink-500',
      ring: 'ring-pink-500'
    },
  },
  teal: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-teal-500/80', primaryBgHover: 'hover:bg-teal-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-teal-100/10', secondaryBgHover: 'hover:bg-teal-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-teal-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-teal-300/20', inputFocusBorder: 'focus:border-teal-500',
      ring: 'ring-teal-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-teal-600/80', primaryBgHover: 'hover:bg-teal-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-teal-900/10', secondaryBgHover: 'hover:bg-teal-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-teal-800/20',
      inputBg: 'bg-teal-900/10', inputText: 'text-white', inputBorder: 'border-teal-700/20', inputFocusBorder: 'focus:border-teal-500',
      ring: 'ring-teal-500'
    },
  },
  yellow: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-yellow-500/80', primaryBgHover: 'hover:bg-yellow-600/90', primaryText: 'text-black',
      secondaryBg: 'bg-yellow-100/10', secondaryBgHover: 'hover:bg-yellow-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-yellow-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-yellow-300/20', inputFocusBorder: 'focus:border-yellow-500',
      ring: 'ring-yellow-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-yellow-500/80', primaryBgHover: 'hover:bg-yellow-600/90', primaryText: 'text-black',
      secondaryBg: 'bg-yellow-900/10', secondaryBgHover: 'hover:bg-yellow-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-yellow-800/20',
      inputBg: 'bg-yellow-900/10', inputText: 'text-white', inputBorder: 'border-yellow-700/20', inputFocusBorder: 'focus:border-yellow-500',
      ring: 'ring-yellow-500'
    },
  },
  indigo: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-indigo-500/80', primaryBgHover: 'hover:bg-indigo-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-indigo-100/10', secondaryBgHover: 'hover:bg-indigo-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-indigo-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-indigo-300/20', inputFocusBorder: 'focus:border-indigo-500',
      ring: 'ring-indigo-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-indigo-600/80', primaryBgHover: 'hover:bg-indigo-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-indigo-900/10', secondaryBgHover: 'hover:bg-indigo-900/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-indigo-800/20',
      inputBg: 'bg-indigo-900/10', inputText: 'text-white', inputBorder: 'border-indigo-700/20', inputFocusBorder: 'focus:border-indigo-500',
      ring: 'ring-indigo-500'
    },
  },
  gray: {
    light: {
      bg: 'bg-transparent', text: 'text-black',
      primaryBg: 'bg-gray-500/80', primaryBgHover: 'hover:bg-gray-600/90', primaryText: 'text-white',
      secondaryBg: 'bg-gray-100/10', secondaryBgHover: 'hover:bg-gray-200/20', secondaryText: 'text-black',
      cardBg: 'bg-white/05', cardBorder: 'border-gray-200/20',
      inputBg: 'bg-white/05', inputText: 'text-black', inputBorder: 'border-gray-300/20', inputFocusBorder: 'focus:border-gray-500',
      ring: 'ring-gray-500'
    },
    dark: {
      bg: 'bg-transparent', text: 'text-white',
      primaryBg: 'bg-gray-600/80', primaryBgHover: 'hover:bg-gray-700/90', primaryText: 'text-white',
      secondaryBg: 'bg-gray-800/10', secondaryBgHover: 'hover:bg-gray-700/30', secondaryText: 'text-white',
      cardBg: 'bg-black/10', cardBorder: 'border-gray-800/20',
      inputBg: 'bg-gray-800/10', inputText: 'text-white', inputBorder: 'border-gray-700/20', inputFocusBorder: 'focus:border-gray-500',
      ring: 'ring-gray-500'
    },
  },
};
