import { type ClassValue, clsx } from 'clsx';
import { format, parseISO, isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';
import { fr } from 'date-fns/locale';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function formatEventDate(dateString: string, allDay = false): string {
  const date = parseISO(dateString);
  
  if (isToday(date)) {
    return allDay ? "Aujourd'hui" : `Aujourd'hui à ${format(date, 'HH:mm')}`;
  }
  
  if (isTomorrow(date)) {
    return allDay ? 'Demain' : `Demain à ${format(date, 'HH:mm')}`;
  }
  
  if (isThisWeek(date)) {
    return allDay 
      ? format(date, 'EEEE', { locale: fr })
      : format(date, "EEEE 'à' HH:mm", { locale: fr });
  }
  
  return allDay
    ? format(date, 'dd/MM/yyyy', { locale: fr })
    : format(date, "dd/MM/yyyy 'à' HH:mm", { locale: fr });
}

export function formatRelativeDate(dateString: string): string {
  const date = parseISO(dateString);
  
  if (isToday(date)) return "Aujourd'hui";
  if (isTomorrow(date)) return 'Demain';
  if (isThisWeek(date)) return format(date, 'EEEE', { locale: fr });
  
  return format(date, 'dd MMMM yyyy', { locale: fr });
}

export function isEventPast(dateString: string): boolean {
  return isPast(parseISO(dateString));
}

export function getPriorityColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'medium':
      return 'text-orange-600 bg-orange-50 border-orange-200';
    case 'low':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getTypeIcon(type: string): string {
  switch (type) {
    case 'event':
      return '📅';
    case 'task':
      return '✓';
    case 'reminder':
      return '🔔';
    default:
      return '📌';
  }
}

export function getTypeLabel(type: string): string {
  switch (type) {
    case 'event':
      return 'Événement';
    case 'task':
      return 'Tâche';
    case 'reminder':
      return 'Rappel';
    default:
      return 'Autre';
  }
}
