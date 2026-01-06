
import React, { useState, useMemo, useEffect } from 'react';
import { ShoppingListItem, CustomItem, ThemeName, ThemeMode, GlassConfig } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { ThemeContext } from './contexts/ThemeContext';
import { THEMES } from './constants';
import Header from './components/Header';
import ShoppingList from './components/ShoppingList';
import CustomItemCreator from './components/CustomItemCreator';
import CustomItemList from './components/CustomItemList';
import LiquidGlassBackground from './components/LiquidGlassBackground';
import DebugModal from './components/DebugModal';
import { Card } from './components/ui/Card';

const DEFAULT_GLASS_CONFIG: GlassConfig = {
  refractionMode: 'prominent',
  displacementScale: 45,
  blurAmount: 6, // Default updated to 6px
  saturation: 100,
  chromaticAberration: 20,
  elasticity: 15,
  overLight: false,
  frequency: 2.5,
  amplitude: 0.5,
  useCustomBg: false,
  bgOpacity: 0.6,
  showCheckerboard: false
};

export default function App() {
  const [shoppingList, setShoppingList] = useLocalStorage<ShoppingListItem[]>('shoppingList', []);
  const [customItems, setCustomItems] = useLocalStorage<CustomItem[]>('customItems', []);
  const [theme, setTheme] = useLocalStorage<ThemeName>('theme', 'blue');
  const [mode, setMode] = useLocalStorage<ThemeMode>('mode', 'light');
  const [glassConfig, setGlassConfig] = useLocalStorage<GlassConfig>('glassConfig', DEFAULT_GLASS_CONFIG);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [showDebug, setShowDebug] = useState(false);

  const handleAddItemFromCustom = (item: CustomItem) => {
    const newItem: ShoppingListItem = {
      ...item,
      id: `shop-${Date.now()}`,
      completed: false,
    };
    setShoppingList(prev => [newItem, ...prev]);
  };

  const handleToggleItem = (id: string) => {
    setShoppingList(prev =>
      prev.map(item => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleRemoveItem = (id: string) => {
    setShoppingList(prev => prev.filter(item => item.id !== id));
  };

  const handleClearCompleted = () => {
    setShoppingList(prev => prev.filter(item => !item.completed));
  };
  
  const handleClearAll = () => {
    setShoppingList([]);
  };

  const handleItemCreated = (itemData: Omit<CustomItem, 'id'>, save: boolean) => {
    const newShoppingItem: ShoppingListItem = {
        id: `shop-${Date.now()}`,
        ...itemData,
        completed: false
    };
    setShoppingList(prev => [newShoppingItem, ...prev]);

    if (save) {
        if (customItems.some(i => i.name.toLowerCase() === itemData.name.toLowerCase())) {
            alert("An item with this name already exists in your saved items.");
            return;
        }
        const newCustomItem: CustomItem = {
            id: `custom-${Date.now()}`,
            ...itemData,
        };
        setCustomItems(prev => [newCustomItem, ...prev]);
    }
  };

  const handleRemoveCustomItem = (id: string) => {
    setCustomItems(prev => prev.filter(item => item.id !== id));
  };
  
  const themeClasses = useMemo(() => THEMES[theme][mode], [theme, mode]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ 
      theme, setTheme, 
      mode, setMode, 
      glassConfig, setGlassConfig,
      themeClasses, 
      generationProgress, setGenerationProgress,
      showDebug, setShowDebug,
      setShoppingList
    }}>
      <div className={`min-h-screen font-sans transition-colors duration-500 ${themeClasses.text} selection:bg-current selection:text-white overflow-hidden`}>
        <LiquidGlassBackground />
        <Header />
        
        <main className="container mx-auto p-4 md:p-8 lg:p-12 relative z-10 pt-32 md:pt-40">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 order-1 space-y-8">
               <Card interactive>
                    <ShoppingList
                        items={shoppingList}
                        onToggle={handleToggleItem}
                        onRemove={handleRemoveItem}
                        onClearCompleted={handleClearCompleted}
                        onClearAll={handleClearAll}
                    />
                </Card>
            </div>
            <div className="lg:col-span-1 flex flex-col gap-8 order-2 sticky top-40">
              <CustomItemList
                customItems={customItems}
                onAddItem={handleAddItemFromCustom}
                onRemoveCustomItem={handleRemoveCustomItem}
              />
              <CustomItemCreator onItemCreated={handleItemCreated} />
            </div>
          </div>
        </main>
        
        <DebugModal />
      </div>
      <style>{`
        body {
          overflow-x: hidden;
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        body::-webkit-scrollbar {
          display: none;
        }
        
        /* Universal Liquid Elastic Viscous Physics */
        .liquid-elastic {
          /* Faster speed (0.5s) while keeping the viscous honey feel (bezier) */
          transition: transform 0.5s cubic-bezier(0.5, 0, 0.2, 1), 
                      box-shadow 0.4s cubic-bezier(0.5, 0, 0.2, 1), 
                      background 0.4s ease, 
                      border-color 0.4s ease;
          will-change: transform;
        }
        
        /* Toned down stretch with heavy resistance but faster response */
        .liquid-elastic:active {
          transform: scale(0.96) scaleX(1.03) scaleY(0.97);
          transition-duration: 0.7s; 
        }

        * {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </ThemeContext.Provider>
  );
}
