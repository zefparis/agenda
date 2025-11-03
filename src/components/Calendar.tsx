'use client';

import { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, isToday, startOfWeek, endOfWeek, addMonths, subMonths } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Plus } from 'lucide-react';
import { Event } from '@/types';
import { motion } from 'framer-motion';
import { DayView } from './DayView';
import { QuickEventModal } from './QuickEventModal';

interface CalendarProps {
  events: Event[];
  onComplete?: (id: string) => void;
  onDelete?: (id: string) => void;
  onQuickCreate?: (data: any) => void;
}

export function Calendar({ events, onComplete, onDelete, onQuickCreate }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [quickCreateDate, setQuickCreateDate] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start: startDate, end: endDate });
  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

  const eventsMap = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach(event => {
      if (event.start_date) {
        const dateKey = format(new Date(event.start_date), 'yyyy-MM-dd');
        const existing = map.get(dateKey) || [];
        map.set(dateKey, [...existing, event]);
      }
    });
    return map;
  }, [events]);

  const getEventsForDay = (date: Date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    return eventsMap.get(dateKey) || [];
  };

  const handlePrevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const handleNextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  
  const handleDayClick = (date: Date, isDoubleClick: boolean = false) => {
    if (isDoubleClick) {
      // Double-clic = création rapide
      setQuickCreateDate(date);
    } else {
      // Simple clic = voir les événements
      setSelectedDate(date);
    }
  };
  
  const selectedDayEvents = selectedDate 
    ? getEventsForDay(selectedDate)
    : [];

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-3 sm:p-4 md:p-6 border-2 border-gray-200 dark:border-gray-700"
      >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600 dark:text-blue-400" />
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
            {format(currentMonth, 'MMMM yyyy', { locale: fr })}
          </h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Mois précédent"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
            aria-label="Mois suivant"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
        {weekDays.map(day => (
          <div
            key={day}
            className="text-center text-sm font-semibold text-gray-600 dark:text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Days */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = day.getMonth() === currentMonth.getMonth();
          const isDayToday = isToday(day);

          return (
            <motion.button
              key={day.toISOString()}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.01 }}
              onClick={() => handleDayClick(day, false)}
              onDoubleClick={() => handleDayClick(day, true)}
              className={`
                group relative min-h-20 p-2 rounded-xl border-2 transition-all
                ${isCurrentMonth ? 'bg-white dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'}
                ${isDayToday ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/30' : 'border-gray-200 dark:border-gray-600'}
                ${dayEvents.length > 0 ? 'border-purple-300 dark:border-purple-500' : ''}
                hover:border-blue-400 hover:shadow-md
              `}
            >
              {/* Bouton + au survol */}
              <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Plus className="w-4 h-4 text-blue-500 dark:text-blue-400" />
              </div>
              <div className={`
                text-sm font-semibold mb-1
                ${isCurrentMonth ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-600'}
                ${isDayToday ? 'text-blue-600 dark:text-blue-400' : ''}
              `}>
                {format(day, 'd')}
              </div>

              {/* Event indicators */}
              {dayEvents.length > 0 && (
                <div className="flex flex-col gap-0.5">
                  {dayEvents.slice(0, 2).map((event, idx) => (
                    <div
                      key={event.id}
                      className={`
                        text-xs px-1 py-0.5 rounded truncate
                        ${event.type === 'event' ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : ''}
                        ${event.type === 'task' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : ''}
                        ${event.type === 'reminder' ? 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300' : ''}
                      `}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      +{dayEvents.length - 2}
                    </div>
                  )}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
    
    {/* Day View Modal */}
    {selectedDate && (
      <DayView
        date={selectedDate}
        events={selectedDayEvents}
        onClose={() => setSelectedDate(null)}
        onComplete={onComplete}
        onDelete={onDelete}
        onCreateNew={() => {
          setSelectedDate(null);
          setQuickCreateDate(selectedDate);
        }}
      />
    )}

    {/* Quick Create Modal */}
    {quickCreateDate && onQuickCreate && (
      <QuickEventModal
        date={quickCreateDate}
        onClose={() => setQuickCreateDate(null)}
        onSubmit={onQuickCreate}
      />
    )}
    </>
  );
}
