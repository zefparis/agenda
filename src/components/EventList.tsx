'use client';

import { Event } from '@/types';
import { EventCard } from './EventCard';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar } from 'lucide-react';

interface EventListProps {
  events: Event[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EventList({ events, onComplete, onDelete }: EventListProps) {
  if (events.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-16 text-center"
      >
        <Calendar className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
        <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
          Aucun événement
        </h3>
        <p className="text-gray-400 dark:text-gray-500">
          Utilisez la commande ci-dessus pour créer votre premier événement
        </p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence mode="popLayout">
        {events.map((event) => (
          <EventCard
            key={event.id}
            event={event}
            onComplete={onComplete}
            onDelete={onDelete}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
