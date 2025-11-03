'use client';

import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Clock, MapPin, Tag, X, Plus } from 'lucide-react';
import { Event } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface DayViewProps {
  date: Date;
  events: Event[];
  onClose: () => void;
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onCreateNew?: () => void;
}

export function DayView({ date, events, onClose, onComplete, onDelete, onCreateNew }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  // Grouper les événements par heure
  const eventsByHour = events.reduce((acc, event) => {
    const hour = new Date(event.start_date).getHours();
    if (!acc[hour]) acc[hour] = [];
    acc[hour].push(event);
    return acc;
  }, {} as Record<number, Event[]>);

  const getEventColor = (type: Event['type']) => {
    switch (type) {
      case 'event': return 'bg-blue-500 dark:bg-blue-600';
      case 'task': return 'bg-green-500 dark:bg-green-600';
      case 'reminder': return 'bg-orange-500 dark:bg-orange-600';
    }
  };

  const getPriorityBorder = (priority: Event['priority']) => {
    switch (priority) {
      case 'high': return 'border-l-4 border-red-500';
      case 'medium': return 'border-l-4 border-yellow-500';
      case 'low': return 'border-l-4 border-gray-400';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-2xl">
            <div>
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">
                {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
              </h2>
              <p className="text-sm sm:text-base text-blue-100 mt-1">
                {events.length} événement{events.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              {onCreateNew && (
                <button
                  onClick={() => {
                    onClose();
                    onCreateNew();
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  title="Créer un événement"
                >
                  <Plus className="w-5 h-5" />
                  <span className="font-semibold">Nouveau</span>
                </button>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-4">
            {events.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-500 dark:text-gray-400 mb-4">
                  Aucun événement ce jour
                </div>
                {onCreateNew && (
                  <button
                    onClick={() => {
                      onClose();
                      onCreateNew();
                    }}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Créer un événement
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {hours.map((hour) => {
                  const hourEvents = eventsByHour[hour] || [];
                  const hasEvents = hourEvents.length > 0;

                  return (
                    <div
                      key={hour}
                      className={`flex gap-4 py-2 ${hasEvents ? 'bg-gray-50 dark:bg-gray-700/50 rounded-lg px-3' : ''}`}
                    >
                      {/* Hour label */}
                      <div className={`flex-shrink-0 w-16 text-sm font-semibold ${hasEvents ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-600'}`}>
                        {hour.toString().padStart(2, '0')}:00
                      </div>

                      {/* Events */}
                      <div className="flex-1 space-y-2">
                        {hourEvents.map((event) => (
                          <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className={`p-3 rounded-lg ${getPriorityBorder(event.priority)} bg-white dark:bg-gray-800 shadow-md hover:shadow-lg transition-all`}
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1">
                                {/* Title */}
                                <div className="flex items-center gap-2 mb-2">
                                  <span className={`w-2 h-2 rounded-full ${getEventColor(event.type)}`} />
                                  <h3 className="font-semibold text-gray-900 dark:text-white">
                                    {event.title}
                                  </h3>
                                </div>

                                {/* Time */}
                                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                                  <Clock className="w-4 h-4" />
                                  <span>
                                    {format(new Date(event.start_date), 'HH:mm')}
                                    {event.end_date && ` - ${format(new Date(event.end_date), 'HH:mm')}`}
                                  </span>
                                </div>

                                {/* Description */}
                                {event.description && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    {event.description}
                                  </p>
                                )}

                                {/* Location */}
                                {event.location && (
                                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                    <MapPin className="w-4 h-4" />
                                    <span>{event.location}</span>
                                  </div>
                                )}

                                {/* Tags */}
                                {event.tags && event.tags.length > 0 && (
                                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                                    <Tag className="w-4 h-4 text-gray-400" />
                                    {event.tags.map((tag) => (
                                      <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-xs rounded-full text-gray-700 dark:text-gray-300"
                                      >
                                        {tag}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Actions */}
                              <div className="flex gap-2">
                                {event.status !== 'completed' && onComplete && (
                                  <button
                                    onClick={() => onComplete(event.id)}
                                    className="px-3 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
                                  >
                                    ✓
                                  </button>
                                )}
                                {onDelete && (
                                  <button
                                    onClick={() => onDelete(event.id)}
                                    className="px-3 py-1 text-xs bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
                                  >
                                    ✕
                                  </button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
