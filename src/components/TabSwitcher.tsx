'use client';

import { Calendar as CalendarIcon, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

interface TabSwitcherProps {
  activeTab: 'agenda' | 'chat';
  onTabChange: (tab: 'agenda' | 'chat') => void;
}

export function TabSwitcher({ activeTab, onTabChange }: TabSwitcherProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-2 mb-6">
      <button
        onClick={() => onTabChange('agenda')}
        className="relative flex-1"
      >
        <motion.div
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl font-semibold transition-all ${
            activeTab === 'agenda'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Agenda</span>
        </motion.div>
      </button>

      <button
        onClick={() => onTabChange('chat')}
        className="relative flex-1"
      >
        <motion.div
          className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-xl font-semibold transition-all ${
            activeTab === 'chat'
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
              : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-2 border-gray-200 dark:border-gray-700'
          }`}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
          <span>Assistant IA</span>
        </motion.div>
      </button>
    </div>
  );
}
