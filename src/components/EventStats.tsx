'use client';

import { Event } from '@/types';
import { Calendar, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface EventStatsProps {
  events: Event[];
}

export function EventStats({ events }: EventStatsProps) {
  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'completed').length;
  const pendingEvents = events.filter(e => e.status === 'pending').length;
  const highPriorityEvents = events.filter(e => e.priority === 'high' && e.status === 'pending').length;

  const stats = [
    {
      label: 'Total',
      value: totalEvents,
      icon: Calendar,
      color: 'bg-blue-500 dark:bg-blue-600',
      textColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/30',
    },
    {
      label: 'En cours',
      value: pendingEvents,
      icon: Clock,
      color: 'bg-orange-500 dark:bg-orange-600',
      textColor: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/30',
    },
    {
      label: 'Terminés',
      value: completedEvents,
      icon: CheckCircle2,
      color: 'bg-green-500 dark:bg-green-600',
      textColor: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/30',
    },
    {
      label: 'Urgents',
      value: highPriorityEvents,
      icon: AlertCircle,
      color: 'bg-red-500 dark:bg-red-600',
      textColor: 'text-red-600 dark:text-red-400',
      bgColor: 'bg-red-50 dark:bg-red-900/30',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className={`${stat.bgColor} rounded-2xl p-4 border-2 border-gray-300 dark:border-gray-700`}
        >
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${stat.color}`}>
              <stat.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              <p className={`text-sm ${stat.textColor} font-medium`}>{stat.label}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
