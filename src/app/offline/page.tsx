/**
 * Page offline affichée quand pas de connexion
 */

'use client';

import { WifiOff, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

export default function OfflinePage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 text-center"
      >
        {/* Icône */}
        <motion.div
          initial={{ rotate: 0 }}
          animate={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="inline-block p-6 bg-orange-500/20 rounded-full mb-6"
        >
          <WifiOff className="w-16 h-16 text-orange-400" />
        </motion.div>

        {/* Titre */}
        <h1 className="text-3xl font-bold mb-3">
          Vous êtes hors ligne
        </h1>

        {/* Description */}
        <p className="text-gray-300 mb-6">
          Impossible de se connecter au serveur. Vérifiez votre connexion internet et réessayez.
        </p>

        {/* Fonctionnalités disponibles */}
        <div className="bg-blue-500/20 border border-blue-400/30 rounded-xl p-4 mb-6 text-left">
          <h3 className="font-semibold text-blue-300 mb-2">
            Fonctionnalités hors ligne :
          </h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Wake word "Hello Benji" (local)</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-400">✓</span>
              <span>Reconnaissance vocale</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400">✗</span>
              <span>Assistant IA (nécessite connexion)</span>
            </li>
          </ul>
        </div>

        {/* Bouton refresh */}
        <button
          onClick={handleRefresh}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
        >
          <RefreshCw className="w-5 h-5" />
          <span>Réessayer</span>
        </button>

        {/* Info */}
        <p className="text-xs text-gray-400 mt-4">
          La page se rechargera automatiquement dès que la connexion sera rétablie
        </p>
      </motion.div>

      {/* Auto-refresh quand online */}
      <script dangerouslySetInnerHTML={{
        __html: `
          window.addEventListener('online', () => {
            console.log('Connexion rétablie, rechargement...');
            window.location.reload();
          });
        `
      }} />
    </main>
  );
}
