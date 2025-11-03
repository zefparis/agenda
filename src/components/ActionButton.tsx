'use client';

import { ExternalLink, Map, Search, Music, Video, Plane, Hotel, BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';
import { ExternalAction } from '@/types/actions';
import { saveExternalAction } from '@/lib/supabase/memory';

interface ActionButtonProps {
  action: ExternalAction;
}

const ACTION_ICONS = {
  open_map: Map,
  search_web: Search,
  play_music: Music,
  search_video: Video,
  search_flights: Plane,
  search_hotels: Hotel,
  open_wikipedia: BookOpen,
  open_link: ExternalLink,
};

const ACTION_LABELS = {
  open_map: '📍 Ouvrir Maps',
  search_web: '🔍 Rechercher',
  play_music: '🎵 Écouter',
  search_video: '📺 Regarder',
  search_flights: '✈️ Vols',
  search_hotels: '🏨 Hôtels',
  open_wikipedia: '📖 Wikipédia',
  open_link: '🔗 Ouvrir le lien',
};

export function ActionButton({ action }: ActionButtonProps) {
  const Icon = ACTION_ICONS[action.action as keyof typeof ACTION_ICONS] || ExternalLink;
  const label = action.title || ACTION_LABELS[action.action as keyof typeof ACTION_LABELS] || 'Ouvrir';

  if (!action.url) {
    console.warn('No URL provided for action:', action);
    return null;
  }

  const handleClick = async () => {
    console.log('🔗 Opening link:', action.url);
    
    // Sauvegarder l'action dans la mémoire
    try {
      await saveExternalAction(
        action.url!,
        label,
        action.action
      );
      console.log('💾 Action saved to memory');
    } catch (error) {
      console.error('Failed to save action:', error);
    }
  };

  return (
    <motion.a
      href={action.url}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="mt-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2 text-sm no-underline"
      onClick={handleClick}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
      <ExternalLink className="w-3.5 h-3.5 opacity-70" />
    </motion.a>
  );
}
