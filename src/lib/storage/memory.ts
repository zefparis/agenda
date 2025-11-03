import { Event, CreateEventInput, UpdateEventInput } from '@/types';

// Stockage temporaire en mémoire (pour dev/test)
let events: Event[] = [];
let nextId = 1;

export const memoryStorage = {
  async getEvents(userId: string): Promise<Event[]> {
    return events.filter(e => e.user_id === userId);
  },

  async getEventById(id: string, userId: string): Promise<Event | null> {
    return events.find(e => e.id === id && e.user_id === userId) || null;
  },

  async createEvent(userId: string, input: CreateEventInput): Promise<Event> {
    const event: Event = {
      id: `event-${nextId++}`,
      user_id: userId,
      title: input.title,
      description: input.description,
      type: input.type,
      start_date: input.start_date,
      end_date: input.end_date,
      all_day: input.all_day || false,
      priority: input.priority || 'medium',
      status: 'pending',
      location: input.location,
      tags: input.tags || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    events.push(event);
    return event;
  },

  async updateEvent(input: UpdateEventInput, userId: string): Promise<Event> {
    const index = events.findIndex(e => e.id === input.id && e.user_id === userId);
    if (index === -1) throw new Error('Event not found');
    
    events[index] = {
      ...events[index],
      ...input,
      updated_at: new Date().toISOString(),
    };
    return events[index];
  },

  async deleteEvent(id: string, userId: string): Promise<void> {
    events = events.filter(e => !(e.id === id && e.user_id === userId));
  },

  async searchEvents(userId: string, query: string): Promise<Event[]> {
    const lowerQuery = query.toLowerCase();
    return events.filter(e => 
      e.user_id === userId &&
      (e.title.toLowerCase().includes(lowerQuery) ||
       e.description?.toLowerCase().includes(lowerQuery))
    );
  },
};
