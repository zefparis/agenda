export type EventType = 'event' | 'task' | 'reminder';

export type EventPriority = 'low' | 'medium' | 'high';

export type EventStatus = 'pending' | 'completed' | 'cancelled';

export interface Event {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  type: EventType;
  start_date: string;
  end_date?: string;
  all_day: boolean;
  priority: EventPriority;
  status: EventStatus;
  location?: string;
  tags?: string[];
  created_at: string;
  updated_at: string;
}

export interface ParsedCommand {
  action: 'create' | 'update' | 'delete' | 'list' | 'search';
  type: EventType;
  title: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  all_day?: boolean;
  priority?: EventPriority;
  location?: string;
  tags?: string[];
  event_id?: string;
}

export interface CreateEventInput {
  title: string;
  description?: string;
  type: EventType;
  start_date: string;
  end_date?: string;
  all_day?: boolean;
  priority?: EventPriority;
  location?: string;
  tags?: string[];
}

export interface UpdateEventInput {
  id: string;
  title?: string;
  description?: string;
  start_date?: string;
  end_date?: string;
  all_day?: boolean;
  priority?: EventPriority;
  status?: EventStatus;
  location?: string;
  tags?: string[];
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
