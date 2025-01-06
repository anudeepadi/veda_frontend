import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Cloud, Network, BarChart, Flower } from 'lucide-react';

const tabIcons = {
  VERSES: BookOpen,
  WORD_CLOUD: Cloud, 
  RELATIONSHIPS: Network,
  ANALYSIS: BarChart,
  MEDITATION: Flower 
};

const TabLayout = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto">
        <nav className="flex space-x-8 px-4" aria-label="Tabs">
          {tabs.map((tab) => {
            const Icon = tabIcons[tab.id];
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`
                  relative py-4 px-1 flex items-center text-sm font-medium 
                  ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-gray-700'}
                  focus:outline-none transition-colors
                `}
              >
                <Icon className="mr-2" size={20} />
                <span>{tab.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500"
                    initial={false}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default TabLayout;