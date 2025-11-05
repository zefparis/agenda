/**
 * Provider PWA - Enregistre le Service Worker
 * À utiliser dans le layout racine
 */

'use client';

import { useEffect } from 'react';
import { PWAInstallBanner } from './PWAInstallBanner';

export function PWAProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Enregistrer le Service Worker
      navigator.serviceWorker
        .register('/sw.js', { scope: '/' })
        .then((registration) => {
          console.log('✅ Service Worker enregistré:', registration.scope);

          // Vérifier les mises à jour toutes les heures
          setInterval(() => {
            registration.update();
          }, 60 * 60 * 1000);

          // Écouter les messages du SW
          navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('[Client] Message du SW:', event.data);

            if (event.data.type === 'WAKEWORD_DETECTED') {
              // Le SW a détecté un wake word (depuis background)
              console.log('🔥 Wake word détecté par le SW');
              
              // Broadcaster aux composants React
              window.postMessage({ type: 'WAKEWORD', source: 'sw' }, '*');
            }
          });

          // Keep-alive ping toutes les 30 secondes
          setInterval(() => {
            if (navigator.serviceWorker.controller) {
              navigator.serviceWorker.controller.postMessage({
                type: 'KEEP_ALIVE'
              });
            }
          }, 30000);
        })
        .catch((error) => {
          console.error('❌ Erreur enregistrement SW:', error);
        });

      // Écouter les mises à jour du SW
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        console.log('🔄 Nouveau Service Worker actif');
        // Optionnel: recharger la page
        // window.location.reload();
      });

      // Détecter si on est en mode PWA installée
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('📱 Application installée en PWA');
        document.documentElement.classList.add('pwa-installed');
      }

      // Détecter online/offline
      window.addEventListener('online', () => {
        console.log('🌐 Connexion rétablie');
      });

      window.addEventListener('offline', () => {
        console.log('📡 Hors ligne');
      });
    }
  }, []);

  return (
    <>
      {children}
      <PWAInstallBanner />
    </>
  );
}
