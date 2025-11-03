'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { motion } from 'framer-motion';

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState<boolean | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Détecter les préférences système
    const stored = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDark = stored !== null ? stored === 'true' : prefersDark;
    
    setIsDark(initialDark);
    if (initialDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDark === null) return;
    
    const newDark = !isDark;
    console.log('🌓 Toggling dark mode:', isDark, '->', newDark);
    
    setIsDark(newDark);
    localStorage.setItem('darkMode', String(newDark));
    
    if (newDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Éviter le flash pendant le chargement
  if (!mounted || isDark === null) {
    return (
      <div className="p-3 rounded-xl bg-gray-200 dark:bg-gray-700 shadow-lg border-2 border-gray-300 dark:border-gray-600 w-[52px] h-[52px]" />
    );
  }

  return (
    <motion.button
      onClick={toggleDarkMode}
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
