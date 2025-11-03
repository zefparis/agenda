'use client';

import { useState, useEffect, useMemo } from 'react';
import { Event, CreateEventInput, ParsedCommand, EventType, EventStatus, EventPriority } from '@/types';
import { CommandInput } from './CommandInput';
import { EventList } from './EventList';
import { EventFilters } from './EventFilters';
import { EventStats } from './EventStats';
import { Calendar } from './Calendar';
import { DarkModeToggle } from './DarkModeToggle';
import { ChatAssistant } from './ChatAssistant';
import { TabSwitcher } from './TabSwitcher';
import { NotificationBanner, NotificationStatus } from './NotificationBanner';
import { useNotifications } from '@/hooks/useNotifications';
import { Sparkles, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState<'agenda' | 'chat'>('agenda');
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Notifications hook
  const { permission, requestPermission } = useNotifications(events);
  
  // Filters
  const [selectedType, setSelectedType] = useState<EventType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<EventStatus | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<EventPriority | 'all'>('all');

  // Filtered events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      if (selectedType !== 'all' && event.type !== selectedType) return false;
      if (selectedStatus !== 'all' && event.status !== selectedStatus) return false;
      if (selectedPriority !== 'all' && event.priority !== selectedPriority) return false;
      return true;
    });
  }, [events, selectedType, selectedStatus, selectedPriority]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/events');
      const result = await response.json();

      if (result.success) {
        setEvents(result.data || []);
      } else {
        setError(result.error || 'Erreur lors du chargement');
      }
    } catch (err) {
      setError('Impossible de charger les événements');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommandSubmit = async (command: string) => {
    try {
      setError(null);

      // Parse command with OpenAI
      const parseResponse = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const parseResult = await parseResponse.json();

      if (!parseResult.success) {
        throw new Error(parseResult.error || 'Erreur de parsing');
      }

      const parsed: ParsedCommand = parseResult.data;

      // Handle different actions
      if (parsed.action === 'create') {
        const eventInput: CreateEventInput = {
          title: parsed.title,
          description: parsed.description,
          type: parsed.type,
          start_date: parsed.start_date || new Date().toISOString(),
          end_date: parsed.end_date,
          all_day: parsed.all_day,
          priority: parsed.priority,
          location: parsed.location,
          tags: parsed.tags,
        };

        const createResponse = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(eventInput),
        });

        const createResult = await createResponse.json();

        if (createResult.success) {
          setEvents((prev) => [...prev, createResult.data]);
        } else {
          throw new Error(createResult.error || 'Erreur de création');
        }
      } else if (parsed.action === 'list' || parsed.action === 'search') {
        await loadEvents();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      console.error(err);
    }
  };

  const handleComplete = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' }),
      });

      const result = await response.json();

      if (result.success) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? result.data : e))
        );
      }
    } catch (err) {
      console.error('Error completing event:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
      }
    } catch (err) {
      console.error('Error deleting event:', err);
    }
  };

  const handleResetFilters = () => {
    setSelectedType('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
  };

  const handleQuickCreate = async (data: any) => {
    try {
      setError(null);
      
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        setEvents(prev => [...prev, result.data]);
        console.log('✅ Event created:', result.data);
      } else {
        throw new Error(result.error || 'Erreur de création');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors de la création');
      console.error('Error creating event:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-6">
          <NotificationStatus permission={permission} />
          <DarkModeToggle />
        </div>

        {/* Tab Switcher */}
        <TabSwitcher activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Notification Banner */}
        {activeTab === 'agenda' && (
          <NotificationBanner 
            permission={permission}
            onRequestPermission={requestPermission}
          />
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8 md:mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Sparkles className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
              Mon Agenda Intelligent
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Gérez vos événements en langage naturel
          </p>
        </motion.div>

        {/* Chat Assistant */}
        {activeTab === 'chat' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ChatAssistant 
              events={events}
              onEventAction={async (action) => {
                if (action.action === 'create') {
                  await handleQuickCreate(action);
                }
              }}
            />
          </motion.div>
        )}

        {/* Agenda Section */}
        {activeTab === 'agenda' && (
          <>
            {/* Command Input */}
            <div className="mb-8">
              <CommandInput onCommandSubmit={handleCommandSubmit} />
            </div>

            {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl flex items-center gap-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-red-800 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Stats */}
        {!isLoading && events.length > 0 && (
          <div className="mb-6">
            <EventStats events={events} />
          </div>
        )}

        {/* Filters */}
        {!isLoading && events.length > 0 && (
          <div className="mb-6">
            <EventFilters
              selectedType={selectedType}
              selectedStatus={selectedStatus}
              selectedPriority={selectedPriority}
              onTypeChange={setSelectedType}
              onStatusChange={setSelectedStatus}
              onPriorityChange={setSelectedPriority}
              onReset={handleResetFilters}
            />
          </div>
        )}

        {/* Calendar - Toujours visible */}
        {!isLoading && (
          <div className="mb-8">
            <Calendar 
              events={events}
              onComplete={handleComplete}
              onDelete={handleDelete}
              onQuickCreate={handleQuickCreate}
            />
          </div>
        )}

        {/* Events List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {isLoading ? (
            <div className="flex justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
            </div>
          ) : (
            <EventList
              events={filteredEvents}
              onComplete={handleComplete}
              onDelete={handleDelete}
            />
          )}
        </motion.div>
          </>
        )}
      </div>
    </div>
  );
}
