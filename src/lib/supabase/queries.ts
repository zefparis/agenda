import { supabase } from './client';
import { Event, CreateEventInput, UpdateEventInput } from '@/types';
import { memoryStorage } from '../storage/memory';

// Utiliser memoryStorage si Supabase n'est pas configuré
const useMemory = !supabase;

export async function getEvents(userId: string): Promise<Event[]> {
  if (useMemory) return memoryStorage.getEvents(userId);
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getEventById(id: string, userId: string): Promise<Event | null> {
  if (useMemory) return memoryStorage.getEventById(id, userId);
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', id)
    .eq('user_id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function createEvent(userId: string, input: CreateEventInput): Promise<Event> {
  if (useMemory) return memoryStorage.createEvent(userId, input);
  
  const { data, error } = await supabase
    .from('events')
    .insert({
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
      tags: input.tags,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateEvent(input: UpdateEventInput, userId: string): Promise<Event> {
  if (useMemory) return memoryStorage.updateEvent(input, userId);
  
  const { id, ...updates } = input;
  
  const { data, error } = await supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteEvent(id: string, userId: string): Promise<void> {
  if (useMemory) return memoryStorage.deleteEvent(id, userId);
  
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) throw error;
}

export async function searchEvents(userId: string, query: string): Promise<Event[]> {
  if (useMemory) return memoryStorage.searchEvents(userId, query);
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getEventsByDateRange(
  userId: string,
  startDate: string,
  endDate: string
): Promise<Event[]> {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .gte('start_date', startDate)
    .lte('start_date', endDate)
    .order('start_date', { ascending: true });

  if (error) throw error;
  return data || [];
}

export async function getUpcomingEvents(userId: string, limit = 10): Promise<Event[]> {
  const now = new Date().toISOString();
  
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .gte('start_date', now)
    .order('start_date', { ascending: true })
    .limit(limit);

  if (error) throw error;
  return data || [];
}
