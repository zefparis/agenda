'use client';

import { Event } from '@/types';
import { formatEventDate, getPriorityColor, getTypeIcon } from '@/lib/utils';
import { Calendar, MapPin, CheckCircle2, Trash2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventCardProps {
  event: Event;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export function EventCard({ event, onComplete, onDelete }: EventCardProps) {
  const priorityColor = getPriorityColor(event.priority);
  const typeIcon = getTypeIcon(event.type);
  const isCompleted = event.status === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={`p-5 rounded-2xl border-2 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all ${
        isCompleted ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-2">
          {/* Header */}
          <div className="flex items-center gap-2">
            <span className="text-2xl">{typeIcon}</span>
            <h3 className={`font-semibold text-lg text-gray-900 dark:text-white ${isCompleted ? 'line-through' : ''}`}>
              {event.title}
            </h3>
          </div>

          {/* Description */}
          {event.description && (
            <p className="text-gray-600 dark:text-gray-400 text-sm">{event.description}</p>
          )}

          {/* Date & Time */}
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{formatEventDate(event.start_date, event.all_day)}</span>
          </div>

          {/* Location */}
          {event.location && (
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <MapPin className="w-4 h-4" />
              <span>{event.location}</span>
            </div>
          )}

          {/* Tags & Priority */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${priorityColor}`}
            >
              {event.priority === 'high' && 'Priorité haute'}
              {event.priority === 'medium' && 'Priorité moyenne'}
              {event.priority === 'low' && 'Priorité basse'}
            </span>
            {event.tags?.map((tag, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2">
          {event.type === 'task' && !isCompleted && onComplete && (
            <button
              onClick={() => onComplete(event.id)}
              className="p-2 rounded-lg hover:bg-green-50 text-green-600 transition-colors"
              title="Marquer comme terminé"
            >
              <CheckCircle2 className="w-5 h-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
