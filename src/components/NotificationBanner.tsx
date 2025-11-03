'use client';

import { Bell, BellOff, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface NotificationBannerProps {
  permission: NotificationPermission;
  onRequestPermission: () => Promise<boolean>;
}

export function NotificationBanner({ permission, onRequestPermission }: NotificationBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const [loading, setLoading] = useState(false);

  if (permission === 'granted' || permission === 'denied' || dismissed) {
    return null;
  }

  const handleRequest = async () => {
    setLoading(true);
    await onRequestPermission();
    setLoading(false);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="mb-6 p-3 sm:p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl shadow-lg"
      >
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0 mt-0.5 animate-pulse" />
          <div className="flex-1">
            <h3 className="font-bold text-base sm:text-lg mb-1">Activer les notifications</h3>
            <p className="text-xs sm:text-sm text-white/90 mb-3">
              Recevez des rappels pour vos événements importants avec une sonnerie
            </p>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                onClick={handleRequest}
                disabled={loading}
                className="px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
              >
                {loading ? 'Activation...' : '🔔 Activer'}
              </button>
              <button
                onClick={() => setDismissed(true)}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
              >
                Plus tard
              </button>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

export function NotificationStatus({ permission }: { permission: NotificationPermission }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      {permission === 'granted' ? (
        <>
          <Bell className="w-4 h-4 text-green-500" />
          <span className="text-gray-600 dark:text-gray-400">Notifications activées</span>
        </>
      ) : permission === 'denied' ? (
        <>
          <BellOff className="w-4 h-4 text-red-500" />
          <span className="text-gray-600 dark:text-gray-400">Notifications désactivées</span>
        </>
      ) : (
        <>
          <Bell className="w-4 h-4 text-orange-500 animate-pulse" />
          <span className="text-gray-600 dark:text-gray-400">Notifications non configurées</span>
        </>
      )}
    </div>
  );
}
