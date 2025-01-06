import React, { useState } from 'react';
import { ChevronDown, Book, Folder } from 'lucide-react';

interface NavigationItem {
  id: string;
  label: string;
  path: string;
  children?: NavigationItem[];
}

const navigationData: NavigationItem[] = [
  {
    id: 'ramayana',
    label: 'Ramayana',
    path: '/ramayana',
    children: [
      {
        id: 'bala-kanda',
        label: 'Bala Kanda',
        path: '/ramayana/bala-kanda',
        children: Array.from({ length: 10 }, (_, i) => ({
          id: `chapter-${i + 1}`,
          label: `Chapter ${i + 1}`,
          path: `/ramayana/bala-kanda/${i + 1}`
        }))
      }
      // Add more kandas as needed
    ]
  }
  // Add more texts as needed
];

export const Sidebar: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newExpanded = new Set(expandedItems);
    if (expandedItems.has(itemId)) {
      newExpanded.delete(itemId);
    } else {
      newExpanded.add(itemId);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavigationItem = (item: NavigationItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);

    return (
      <div key={item.id} className="select-none">
        <button
          onClick={() => toggleItem(item.id)}
          className={`w-full text-left px-3 py-2 flex items-center hover:bg-gray-100 rounded
            ${level === 0 ? 'text-gray-700' : 'text-gray-600 text-sm'}
          `}
          style={{ paddingLeft: `${level * 12 + 12}px` }}
        >
          {hasChildren ? (
            <ChevronDown
              className={`mr-2 h-4 w-4 transition-transform ${
                isExpanded ? 'transform rotate-0' : 'transform -rotate-90'
              }`}
            />
          ) : (
            <div className="w-4 h-4 mr-2" />
          )}
          {level === 0 ? <Book className="mr-2 h-4 w-4" /> : <Folder className="mr-2 h-4 w-4" />}
          <span>{item.label}</span>
        </button>
        {hasChildren && isExpanded && (
          <div className="ml-4">
            {item.children.map(child => renderNavigationItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
        NAVIGATION
      </h2>
      <div className="space-y-0.5">
        {navigationData.map(item => renderNavigationItem(item))}
      </div>
    </div>
  );
};
