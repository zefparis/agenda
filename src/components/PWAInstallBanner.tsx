/**
 * Banner pour installer la PWA
 * Détecte beforeinstallprompt et affiche le CTA
 */

'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Vérifier si déjà installé
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Écouter l'événement beforeinstallprompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsVisible(true);
      console.log('📱 PWA installable détectée');
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Écouter appinstalled
    window.addEventListener('appinstalled', () => {
      console.log('✅ PWA installée');
      setIsInstalled(true);
      setIsVisible(false);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    // Afficher le prompt natif
    await deferredPrompt.prompt();

    // Attendre le choix utilisateur
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Choix utilisateur: ${outcome}`);
    
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    
    // Réinitialiser le prompt
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    // Cacher pour 7 jours
    localStorage.setItem('pwa-install-dismissed', Date.now().toString());
  };

  // Ne pas afficher si installé
  if (isInstalled) return null;

  return (
    <AnimatePresence>
      {isVisible && deferredPrompt && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96"
        >
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl shadow-2xl p-4">
            <div className="flex items-start gap-3">
              {/* Icône */}
              <div className="flex-shrink-0 p-2 bg-white/20 rounded-full">
                <Smartphone className="w-6 h-6" />
              </div>

              {/* Contenu */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">
                  Installer l'application
                </h3>
                <p className="text-sm text-white/90 mb-3">
                  Accédez plus rapidement à votre agenda intelligent et utilisez "Hello Benji" en mode hors ligne.
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={handleInstall}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    <span>Installer</span>
                  </button>

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
