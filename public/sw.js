/**
 * Service Worker pour Mon Agenda Intelligent
 * Gère le cache, les notifications et maintient le contexte audio
 * Compatible Android / Samsung S23
 * 
 * HISTORIQUE DES VERSIONS:
 * v6 (6 nov 2025) : GPT-4-Turbo + corrections OpenAI
 * v5 (6 nov 2025) : Fallback microphone mobile
 * v4 (5 nov 2025) : Wake word optimisé
 */

const CACHE_NAME = 'agenda-ia-v6'; // GPT-4-Turbo + corrections OpenAI
const OFFLINE_URL = '/offline';

// Fichiers à mettre en cache pour l'offline
const CRITICAL_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/models/porcupine_params_fr.pv',
  '/models/hello_benji.ppn'
];

// ========================================
// INSTALLATION
// ========================================
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Cache des ressources critiques');
      return cache.addAll(CRITICAL_ASSETS).catch(err => {
        console.warn('[SW] Erreur cache initial:', err);
      });
    })
  );
  
  // Force l'activation immédiate
  self.skipWaiting();
});

// ========================================
// ACTIVATION
// ========================================
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation v6 - GPT-4-Turbo');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('[SW] Suppression ancien cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // Forcer le refresh de tous les clients pour charger la nouvelle config OpenAI
      return self.clients.matchAll({ type: 'window' }).then(clients => {
        clients.forEach(client => {
          console.log('[SW] Demande de reload au client');
          client.postMessage({
            type: 'SW_UPDATED',
            version: 'v6',
            changes: 'GPT-4-Turbo activé'
          });
        });
      });
    })
  );
  
  // Prendre le contrôle immédiatement
  return self.clients.claim();
});

// ========================================
// FETCH - Stratégie Cache-First pour assets
// ========================================
self.addEventListener('fetch', (event) => {
  // Ignorer les requêtes non-GET
  if (event.request.method !== 'GET') return;
  
  // Ignorer les requêtes API (laisse passer en réseau)
  if (event.request.url.includes('/api/')) return;
  
  event.respondWith(
    caches.match(event.request).then((cached) => {
      // Si en cache, retourne, sinon fetch
      if (cached) {
        return cached;
      }
      
      return fetch(event.request)
        .then((response) => {
          // Ne pas cacher les erreurs
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          
          // Cloner la réponse pour la mettre en cache
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then((cache) => {
            // Cache dynamique pour les assets
            if (event.request.url.match(/\.(js|css|png|jpg|jpeg|svg|woff2?)$/)) {
              cache.put(event.request, responseToCache);
            }
          });
          
          return response;
        })
        .catch(() => {
          // Si offline, retourner page offline
          if (event.request.mode === 'navigate') {
            return caches.match(OFFLINE_URL);
          }
        });
    })
  );
});

// ========================================
// MESSAGES du client (Wake Word détecté)
// ========================================
self.addEventListener('message', (event) => {
  console.log('[SW] Message reçu:', event.data);
  
  if (event.data.type === 'WAKEWORD_DETECTED') {
    handleWakeWordDetection(event);
  }
  
  if (event.data.type === 'FALLBACK_MODE_ACTIVATED') {
    // Mode fallback activé (micro manuel)
    console.log('[SW] Mode fallback micro activé');
    handleFallbackMode(event);
  }
  
  if (event.data.type === 'KEEP_ALIVE') {
    // Ping pour maintenir le SW actif
    event.ports[0].postMessage({ type: 'PONG' });
  }
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// ========================================
// FALLBACK MODE (Micro manuel)
// ========================================
async function handleFallbackMode(event) {
  console.log('[SW] 🎤 Mode fallback micro activé');
  
  // Broadcaster à tous les clients
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });
  
  clients.forEach(client => {
    client.postMessage({
      type: 'FALLBACK_MODE_ACTIVE',
      timestamp: Date.now(),
      reason: event.data.reason || 'unknown'
    });
  });
}

// ========================================
// NOTIFICATION + VIBRATION
// ========================================
async function handleWakeWordDetection(event) {
  console.log('[SW] 🔥 Wake word détecté!');
  
  // 1. Vibration courte (si supporté)
  if ('vibrate' in navigator) {
    // Note: navigator.vibrate n'est pas disponible dans SW
    // On délègue au client
  }
  
  // 2. Notification push (si permission accordée)
  const permission = await self.registration.showNotification('Benji activé', {
    body: 'Je t\'écoute...',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    tag: 'wakeword',
    requireInteraction: false,
    silent: false,
    vibrate: [200, 100, 200],
    data: {
      timestamp: Date.now(),
      action: 'wakeword'
    }
  }).catch(err => {
    console.warn('[SW] Notification échouée:', err);
  });
  
  // 3. Broadcaster à tous les clients
  const clients = await self.clients.matchAll({
    type: 'window',
    includeUncontrolled: true
  });
  
  clients.forEach(client => {
    client.postMessage({
      type: 'WAKEWORD_DETECTED',
      timestamp: Date.now()
    });
  });
}

// ========================================
// BACKGROUND SYNC (si supporté)
// ========================================
self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag);
  
  if (event.tag === 'sync-events') {
    event.waitUntil(syncEvents());
  }
});

async function syncEvents() {
  // Sync des événements en attente
  console.log('[SW] Synchronisation des événements...');
  // TODO: implémenter si besoin de sync offline
}

// ========================================
// NOTIFICATION CLICK
// ========================================
self.addEventListener('notificationclick', (event) => {
  console.log('[SW] Notification cliquée:', event.notification.tag);
  
  event.notification.close();
  
  // Ouvrir ou focus sur la PWA
  event.waitUntil(
    self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then((clients) => {
      // Si une fenêtre existe déjà, la focus
      for (const client of clients) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) {
          return client.focus();
        }
      }
      
      // Sinon, ouvrir une nouvelle fenêtre
      if (self.clients.openWindow) {
        return self.clients.openWindow('/');
      }
    })
  );
});

// ========================================
// PUSH NOTIFICATION (pour futur)
// ========================================
self.addEventListener('push', (event) => {
  console.log('[SW] Push reçu:', event.data?.text());
  
  const data = event.data?.json() || {};
  
  const options = {
    body: data.body || 'Nouveau message',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [200, 100, 200],
    data: data
  };
  
  event.waitUntil(
    self.registration.showNotification(data.title || 'Mon Agenda', options)
  );
});

console.log('[SW] Service Worker chargé ✓');
