/**
 * Banner pour demander les permissions micro sur mobile
 * Affiche un CTA si permission refusée
 */

'use client';

import { useState, useEffect } from 'react';
import { Mic, X, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface PermissionBannerProps {
  hasPermission: boolean;
  onRequestPermission: () => Promise<boolean>;
  platform: 'android' | 'ios' | 'desktop';
}

export function PermissionBanner({ hasPermission, onRequestPermission, platform }: PermissionBannerProps) {
  const [isVisible, setIsVisible] = useState(!hasPermission);
  const [isLoading, setIsLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    setIsVisible(!hasPermission && !isDismissed);
  }, [hasPermission, isDismissed]);

  const handleRequestPermission = async () => {
    setIsLoading(true);
    try {
      const granted = await onRequestPermission();
      if (granted) {
        setIsVisible(false);
      }
    } catch (error) {
      console.error('Erreur demande permission:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg"
        >
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-3">
              {/* Icône */}
              <div className="flex-shrink-0 p-2 bg-white/20 rounded-full">
                <AlertTriangle className="w-6 h-6" />
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">
                  Permission micro requise
                </h3>
                <p className="text-sm text-white/90 mb-3">
                  Pour utiliser le wake word "Hello Benji", l'application a besoin d'accéder à votre microphone.
                  {platform === 'android' && (
                    <span className="block mt-1">
                      Sur Android, vous pouvez aussi gérer les permissions dans les paramètres de Chrome.
                    </span>
                  )}
                </p>

                <div className="flex gap-2">
                  {/* Bouton Autoriser */}
                  <button
                    onClick={handleRequestPermission}
                    disabled={isLoading}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                        <span>Demande...</span>
                      </>
                    ) : (
                      <>
                        <Mic className="w-4 h-4" />
                        <span>Autoriser le micro</span>
                      </>
                    )}
                  </button>

                  {/* Bouton Plus tard */}
                  <button
                    onClick={handleDismiss}
                    className="px-4 py-2 bg-white/20 text-white font-semibold rounded-lg hover:bg-white/30 transition-colors"
                  >
                    Plus tard
                  </button>
                </div>
              </div>

              {/* Bouton fermer */}
              <button
                onClick={handleDismiss}
                className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
