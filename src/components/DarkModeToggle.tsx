'use client';

import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export function DarkModeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <motion.button
      onClick={toggleTheme}
      whileTap={{ scale: 0.95 }}
      className="p-3 rounded-xl bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all border-2 border-gray-200 dark:border-gray-700"
      aria-label="Toggle dark mode"
      title={isDark ? 'Mode clair' : 'Mode sombre'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: isDark ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {isDark ? (
          <Sun className="w-5 h-5 text-yellow-500" />
        ) : (
          <Moon className="w-5 h-5 text-blue-600" />
        )}
      </motion.div>
    </motion.button>
  );
}
