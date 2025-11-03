'use client';

import { useState } from 'react';
import { X, Clock, MapPin, Tag } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface QuickEventModalProps {
  date: Date;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    type: 'event' | 'task' | 'reminder';
    start_date: string;
    priority: 'low' | 'medium' | 'high';
    description?: string;
    location?: string;
  }) => void;
}

export function QuickEventModal({ date, onClose, onSubmit }: QuickEventModalProps) {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'event' | 'task' | 'reminder'>('event');
  const [time, setTime] = useState('09:00');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) return;

    // Créer la date avec l'heure
    const [hours, minutes] = time.split(':');
    const startDate = new Date(date);
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

    const eventData = {
      title: title.trim(),
      type,
      start_date: startDate.toISOString(),
      priority,
      description: description.trim() || undefined,
      location: location.trim() || undefined,
    };

    console.log('📝 Submitting event:', eventData);
    onSubmit(eventData);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full p-4 sm:p-6 mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
              Nouvel événement
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1">
              {format(date, 'EEEE d MMMM yyyy', { locale: fr })}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Titre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Titre *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Réunion avec client"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              autoFocus
              required
            />
          </div>

          {/* Type et Heure */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              >
                <option value="event">Événement</option>
                <option value="task">Tâche</option>
                <option value="reminder">Rappel</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Clock className="w-4 h-4 inline mr-1" />
                Heure
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Priorité */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Priorité
            </label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                    priority === p
                      ? p === 'high' ? 'bg-red-500 text-white' :
                        p === 'medium' ? 'bg-yellow-500 text-white' :
                        'bg-gray-500 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}
                >
                  {p === 'high' ? 'Haute' : p === 'medium' ? 'Moyenne' : 'Basse'}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Détails supplémentaires..."
              rows={2}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors resize-none"
            />
          </div>

          {/* Lieu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Lieu
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Adresse ou lieu"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none transition-colors"
            />
          </div>

          {/* Boutons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={!title.trim()}
              className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold hover:from-blue-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
            >
              Créer
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
