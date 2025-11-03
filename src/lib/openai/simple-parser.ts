import { ParsedCommand } from '@/types';

// Parser simple sans IA (fallback)
export function simpleParser(input: string): ParsedCommand {
  const lower = input.toLowerCase();
  
  // Détection de l'action
  let action: ParsedCommand['action'] = 'create';
  if (lower.includes('liste') || lower.includes('affiche') || lower.includes('montre')) {
    action = 'list';
  } else if (lower.includes('cherche') || lower.includes('trouve') || lower.includes('recherche')) {
    action = 'search';
  } else if (lower.includes('supprime') || lower.includes('efface') || lower.includes('retire')) {
    action = 'delete';
  } else if (lower.includes('modifie') || lower.includes('change') || lower.includes('update')) {
    action = 'update';
  }

  // Détection du type
  let type: ParsedCommand['type'] = 'event';
  if (lower.includes('tâche') || lower.includes('tache') || lower.includes('todo') || lower.includes('à faire')) {
    type = 'task';
  } else if (lower.includes('rappel') || lower.includes('reminder') || lower.includes('rappelle')) {
    type = 'reminder';
  }

  // Détection de la priorité
  let priority: ParsedCommand['priority'] = 'medium';
  if (lower.includes('urgent') || lower.includes('important') || lower.includes('critique')) {
    priority = 'high';
  } else if (lower.includes('faible') || lower.includes('low') || lower.includes('plus tard')) {
    priority = 'low';
  }

  // Extraction du titre (simplifiée)
  let title = input;
  const stopWords = ['planifie', 'ajoute', 'crée', 'créer', 'planifier', 'ajouter', 'une', 'un', 'le', 'la', 'les'];
  const words = input.split(' ').filter(w => !stopWords.includes(w.toLowerCase()));
  title = words.join(' ').substring(0, 50) || 'Nouvel événement';

  // Date par défaut: maintenant
  const start_date = new Date().toISOString();

  return {
    action,
    type,
    title,
    priority,
    start_date,
    all_day: false,
  };
}
