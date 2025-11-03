'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ExternalLink, Trash2, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { ExternalActionMemory } from '@/types/actions';
import { getFavorites, getActionHistory, toggleFavorite, deleteAction } from '@/lib/supabase/memory';

interface FavoriteLinksProps {
  onRefresh?: () => void;
}

export function FavoriteLinks({ onRefresh }: FavoriteLinksProps) {
  const [favorites, setFavorites] = useState<ExternalActionMemory[]>([]);
  const [history, setHistory] = useState<ExternalActionMemory[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [favData, histData] = await Promise.all([
        getFavorites(),
        getActionHistory(10),
      ]);
      setFavorites(favData);
      setHistory(histData.filter(h => !h.is_favorite));
    } catch (error) {
      console.error('Error loading favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleFavorite = async (id: string) => {
    const success = await toggleFavorite(id);
    if (success) {
      await loadData();
      onRefresh?.();
    }
  };

  const handleDelete = async (id: string) => {
    const success = await deleteAction(id);
    if (success) {
      await loadData();
      onRefresh?.();
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        <p className="text-sm mt-2">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Favoris */}
      {favorites.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-xl p-4 border-2 border-yellow-200 dark:border-yellow-800">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-5 h-5 text-yellow-600 dark:text-yellow-400 fill-current" />
            <h3 className="font-semibold text-gray-900 dark:text-white">Favoris rapides</h3>
            <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-0.5 rounded-full">
              {favorites.length}
            </span>
          </div>
          
          <div className="space-y-2">
            <AnimatePresence>
              {favorites.map((fav) => (
                <motion.div
                  key={fav.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 shadow-sm"
                >
                  <a
                    href={fav.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center gap-2 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline"
                  >
                    <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate font-medium">{fav.label}</span>
                    {fav.used_count && fav.used_count > 1 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        ×{fav.used_count}
                      </span>
                    )}
                  </a>
                  
                  <button
                    onClick={() => handleToggleFavorite(fav.id)}
                    className="p-1 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded transition-colors"
                    title="Retirer des favoris"
                  >
                    <Star className="w-4 h-4 text-yellow-600 dark:text-yellow-400 fill-current" />
                  </button>
                  
                  <button
                    onClick={() => handleDelete(fav.id)}
                    className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Historique récent */}
      {history.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="w-full flex items-center justify-between mb-2"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Historique récent</h3>
              <span className="text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                {history.length}
              </span>
            </div>
            {showHistory ? (
              <ChevronUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {showHistory && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-1.5 overflow-hidden"
              >
                {history.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-2 bg-white dark:bg-gray-800 rounded-lg p-2 text-sm"
                  >
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors no-underline"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate text-xs">{item.label}</span>
                    </a>
                    
                    <button
                      onClick={() => handleToggleFavorite(item.id)}
                      className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                      title="Ajouter aux favoris"
                    >
                      <Star className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-gray-400 dark:text-gray-500" />
                    </button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {favorites.length === 0 && history.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <ExternalLink className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p className="text-sm">Aucun lien ouvert pour le moment</p>
          <p className="text-xs mt-1">Demandez à l'assistant d'ouvrir un site !</p>
        </div>
      )}
    </div>
  );
}
