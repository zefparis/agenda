'use client';

import { EventType, EventStatus, EventPriority } from '@/types';
import { Filter, X } from 'lucide-react';

interface EventFiltersProps {
  selectedType: EventType | 'all';
  selectedStatus: EventStatus | 'all';
  selectedPriority: EventPriority | 'all';
  onTypeChange: (type: EventType | 'all') => void;
  onStatusChange: (status: EventStatus | 'all') => void;
  onPriorityChange: (priority: EventPriority | 'all') => void;
  onReset: () => void;
}

export function EventFilters({
  selectedType,
  selectedStatus,
  selectedPriority,
  onTypeChange,
  onStatusChange,
  onPriorityChange,
  onReset,
}: EventFiltersProps) {
  const hasActiveFilters = 
    selectedType !== 'all' || 
    selectedStatus !== 'all' || 
    selectedPriority !== 'all';

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-4 border-2 border-gray-200 dark:border-gray-700 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <h3 className="font-semibold text-gray-900 dark:text-white">Filtres</h3>
        </div>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <X className="w-4 h-4" />
            Réinitialiser
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Type Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Type
          </label>
          <select
            value={selectedType}
            onChange={(e) => onTypeChange(e.target.value as EventType | 'all')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-sm"
          >
            <option value="all">Tous</option>
            <option value="event">Événements</option>
            <option value="task">Tâches</option>
            <option value="reminder">Rappels</option>
          </select>
        </div>

        {/* Status Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Statut
          </label>
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value as EventStatus | 'all')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-sm"
          >
            <option value="all">Tous</option>
            <option value="pending">En cours</option>
            <option value="completed">Terminés</option>
            <option value="cancelled">Annulés</option>
          </select>
        </div>

        {/* Priority Filter */}
        <div>
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
            Priorité
          </label>
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityChange(e.target.value as EventPriority | 'all')}
            className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none text-sm"
          >
            <option value="all">Toutes</option>
            <option value="high">Haute</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
        </div>
      </div>
    </div>
  );
}
