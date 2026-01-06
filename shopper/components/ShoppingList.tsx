
import React from 'react';
import { ShoppingListItem } from '../types';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/Button';

interface ShoppingListProps {
  items: ShoppingListItem[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onClearCompleted: () => void;
  onClearAll: () => void;
}

export default function ShoppingList({ items, onToggle, onRemove, onClearCompleted, onClearAll }: ShoppingListProps) {
    const { themeClasses } = useTheme();
    const completedCount = items.filter(item => item.completed).length;

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                <h2 className="text-2xl font-bold">Shopping List</h2>
                <div className="flex gap-2 flex-wrap">
                    <Button onClick={onClearCompleted} variant="secondary" disabled={completedCount === 0}>
                        Clear Completed
                    </Button>
                    <Button onClick={onClearAll} variant="destructive" disabled={items.length === 0}>
                        Clear All
                    </Button>
                </div>
            </div>
            {items.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg font-bold">Your shopping list is empty.</p>
                    <p className="font-bold">Add your items to get started.</p>
                </div>
            ) : (
                <ul className="space-y-3">
                    {items.map(item => (
                        <li
                            key={item.id}
                            className={`flex items-center p-3 rounded-xl cursor-pointer hover:shadow-md liquid-elastic hover:scale-[1.015] ${item.completed ? `${themeClasses.secondaryBg}` : `${themeClasses.cardBg} shadow-sm border ${themeClasses.cardBorder}`}`}
                            onClick={() => onToggle(item.id)}
                            aria-label={`Toggle completion for ${item.name}`}
                        >
                            <div className="flex items-center flex-grow">
                                {item.icon && item.icon.startsWith('data:image') ? (
                                    <img src={item.icon} alt={item.name} className="w-10 h-10 mr-4 rounded-md object-contain" />
                                ) : (
                                    <span className="text-3xl mr-4 select-none">{item.icon || '📦'}</span>
                                )}
                                <span className={`text-lg font-bold ${item.completed ? 'line-through' : ''}`}>
                                    {item.name}
                                </span>
                            </div>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRemove(item.id);
                                }}
                                className={`p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/50 text-red-500 transition-transform hover:scale-125 liquid-elastic active:scale-90`}
                                aria-label={`Remove ${item.name}`}
                            >
                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4 0a1 1 0 012 0v6a1 1 0 11-2 0V8z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
