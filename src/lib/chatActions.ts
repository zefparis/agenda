/**
 * Parse les actions du chat et les exécute
 */

export interface ChatAction {
  action: 'create' | 'update' | 'delete';
  type?: 'event' | 'task' | 'reminder';
  title?: string;
  start_date?: string;
  priority?: 'low' | 'medium' | 'high';
  description?: string;
  location?: string;
  id?: string;
}

/**
 * Détecte si un message contient une action à exécuter
 */
export function parseAction(message: string): ChatAction | null {
  // Chercher le marqueur d'action
  const actionMatch = message.match(/ACTION:\s*(\w+)/i);
  if (!actionMatch) return null;

  // Chercher le bloc JSON
  const jsonMatch = message.match(/```json\s*(\{[\s\S]*?\})\s*```/);
  if (!jsonMatch) return null;

  try {
    const action = JSON.parse(jsonMatch[1]);
    return action;
  } catch (error) {
    console.error('Error parsing action:', error);
    return null;
  }
}

/**
 * Nettoie le message pour l'affichage (retire le JSON)
 */
export function cleanMessage(message: string): string {
  return message
    .replace(/🗓️\s*\*\*ACTION:.*?\*\*/i, '')
    .replace(/```json[\s\S]*?```/, '')
    .trim();
}
