
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';

export default function DebugModal() {
  const { showDebug, setShowDebug, glassConfig, setGlassConfig, theme, mode, setGenerationProgress, setShoppingList } = useTheme();

  if (!showDebug) return null;

  const handlePurge = () => {
    if (confirm("DANGER: Purge all LocalStorage? This will delete your shopping list and custom items.")) {
      localStorage.clear();
      window.location.reload();
    }
  };

  const handleDumpState = () => {
    console.group('🛠 DEBUG STATE DUMP');
    console.log('Current Theme:', theme);
    console.log('Current Mode:', mode);
    console.log('Glass Config:', glassConfig);
    console.log('LocalStorage Usage:', JSON.stringify(localStorage).length, 'bytes');
    console.groupEnd();
    alert('State dumped to console. Check developer tools (F12).');
  };

  const handleMockItems = () => {
    const mockData = [
      { name: 'Oat Milk', icon: '🥛' },
      { name: 'Organic Eggs', icon: '🥚' },
      { name: 'Avocado', icon: '🥑' },
      { name: 'Fresh Sourdough', icon: '🍞' },
      { name: 'Coffee Beans', icon: '☕' },
      { name: 'Blueberries', icon: '🫐' },
      { name: 'Greek Yogurt', icon: '🍦' }
    ];

    setShoppingList(prev => [
      ...mockData.map(data => ({
        id: `mock-${Date.now()}-${Math.random()}`,
        name: data.name,
        icon: data.icon,
        completed: false
      })),
      ...prev
    ]);
    
    setShowDebug(false);
  };

  const handleSimulateProgress = () => {
    setGenerationProgress(10);
    const interval = setInterval(() => {
        setGenerationProgress(p => {
            if (p >= 100) {
                clearInterval(interval);
                setTimeout(() => setGenerationProgress(0), 1000);
                return 100;
            }
            return p + 5;
        });
    }, 100);
  };

  const resetGlass = () => {
    setGlassConfig({
        refractionMode: 'prominent',
        displacementScale: 45,
        blurAmount: 6,
        saturation: 100,
        chromaticAberration: 20,
        elasticity: 15,
        overLight: false,
        frequency: 2.5,
        amplitude: 0.5,
        useCustomBg: false,
        bgOpacity: 0.6,
        showCheckerboard: false
    });
  };

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : 'Unknown';
  const storageSize = (JSON.stringify(localStorage).length / 1024).toFixed(2);

  return (
    <div className="fixed inset-0 bg-black z-[200] flex justify-center items-center p-4 font-mono text-xs uppercase" onClick={() => setShowDebug(false)}>
      <div 
        className="bg-black border-2 border-green-500 p-6 w-full max-w-md rounded-none shadow-[0_0_20px_rgba(34,197,94,0.5)] animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6 border-b-2 border-green-500 pb-2">
            <h3 className="text-green-500 font-bold">System Debug Console_v1.1.2</h3>
            <button onClick={() => setShowDebug(false)} className="text-green-500 hover:text-white font-black">
                [CLOSE_X]
            </button>
        </div>

        <div className="space-y-6 text-green-500 overflow-y-auto max-h-[70vh] pr-2">
            <div className="space-y-2">
                <p className="text-[10px] font-black text-green-500">Persistence Integrity</p>
                <div className="grid grid-cols-2 gap-2 text-[10px]">
                    <div className="p-2 border border-green-900 bg-green-900/10">
                        <span className="block opacity-50">Storage Used</span>
                        <span className="font-bold">{storageSize} KB</span>
                    </div>
                    <div className="p-2 border border-green-900 bg-green-900/10">
                        <span className="block opacity-50">Status</span>
                        <span className="font-bold text-green-400">SYNCED_OK</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black text-green-500">Graphics Test</p>
                <div className="flex items-center justify-between">
                    <span className="font-bold">Lattice Pattern (Checkerboard)</span>
                    <button 
                        onClick={() => setGlassConfig({ ...glassConfig, showCheckerboard: !glassConfig.showCheckerboard })}
                        className={`px-2 py-1 border-2 ${glassConfig.showCheckerboard ? 'bg-green-500 text-black border-green-500' : 'border-green-500'}`}
                    >
                        {glassConfig.showCheckerboard ? 'ENABLED' : 'DISABLED'}
                    </button>
                </div>
                <div className="flex items-center justify-between">
                    <span className="font-bold">Simulate AI Progress Bar</span>
                    <button onClick={handleSimulateProgress} className="px-2 py-1 border-2 border-green-500 hover:bg-green-500 hover:text-black">RUN_SIM</button>
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-[10px] font-black text-green-500">Memory & Data Management</p>
                <div className="grid grid-cols-1 gap-2">
                    <button onClick={handleMockItems} className="w-full text-left p-2 border-2 border-green-500 hover:bg-green-500 hover:text-black font-bold">
                        > INJECT_MOCK_SHOPPING_LIST
                    </button>
                    <button onClick={handlePurge} className="w-full text-left p-2 border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-bold">
                        > PURGE_ALL_LOCAL_STORAGE
                    </button>
                    <button onClick={handleDumpState} className="w-full text-left p-2 border-2 border-green-500 hover:bg-green-500 hover:text-black font-bold">
                        > DUMP_APPLICATION_STATE
                    </button>
                    <button onClick={resetGlass} className="w-full text-left p-2 border-2 border-green-500 hover:bg-green-500 hover:text-black font-bold">
                        > RESET_GLASS_ENGINE
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-[10px] font-black text-green-500">System Information</p>
                <div className="space-y-3 font-bold lowercase">
                    <div className="flex flex-col gap-1">
                        <span className="text-[10px] text-green-500">System Agent (Host Info):</span>
                        <div className="p-2 border-2 border-green-500 bg-black rounded text-[10px] leading-tight break-all normal-case">
                            {userAgent}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
