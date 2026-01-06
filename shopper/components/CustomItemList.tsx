
import React from 'react';
import { CustomItem } from '../types';
import { Card } from './ui/Card';
import { useTheme } from '../contexts/ThemeContext';

interface CustomItemListProps {
  customItems: CustomItem[];
  onAddItem: (item: CustomItem) => void;
  onRemoveCustomItem: (id: string) => void;
}

export default function CustomItemList({ customItems, onAddItem, onRemoveCustomItem }: CustomItemListProps) {
  const { themeClasses } = useTheme();

  return (
    <Card interactive>
      <h2 className="text-xl font-semibold mb-4">Library</h2>
      {customItems.length === 0 ? (
        <p className={`text-sm`}>Create and save custom items to see them here.</p>
      ) : (
        <ul className="space-y-2 max-h-[20rem] overflow-y-auto pr-2">
          {customItems.map(item => (
            <li key={item.id} className={`flex items-center justify-between p-2 rounded-2xl liquid-elastic hover:scale-[1.02] ${themeClasses.secondaryBg}`}>
              <div className="flex items-center gap-3">
                 {item.icon.startsWith('data:image') ? (
                    <img src={item.icon} alt={item.name} className="w-8 h-8 rounded-md object-cover" />
                ) : (
                    <span className="text-2xl select-none">{item.icon}</span>
                )}
                <span className="font-medium">{item.name}</span>
              </div>
              <div className="flex items-center gap-2">
                 <button 
                    onClick={() => onAddItem(item)} 
                    className={`p-1.5 rounded-full liquid-elastic hover:scale-110 hover:shadow-lg ${themeClasses.primaryBg} ${themeClasses.primaryText} ${themeClasses.primaryBgHover}`} 
                    aria-label={`Add ${item.name} to shopping list`}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                 </button>
                 <button 
                    onClick={() => onRemoveCustomItem(item.id)} 
                    className={`p-1.5 rounded-full liquid-elastic hover:scale-110 hover:shadow-lg bg-red-500 text-white hover:bg-red-600`} 
                    aria-label={`Remove ${item.name} from library`}
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                    </svg>
                 </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}
