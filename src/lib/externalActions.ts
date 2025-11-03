import { ExternalAction } from '@/types/actions';
import { parseActionFromGPT } from './actionHandler';

/**
 * Parse les actions externes depuis un message GPT
 * Recherche le pattern: 🔗 **ACTION: EXTERNAL** suivi d'un bloc JSON
 */
export function parseExternalActions(message: string): ExternalAction | null {
  try {
    // Rechercher le marker d'action externe
    const externalMarker = /🔗\s*\*\*ACTION:\s*EXTERNAL\*\*/i;
    
    if (!externalMarker.test(message)) {
      return null;
    }

    // Extraire le bloc JSON après le marker
    const jsonMatch = message.match(/```json\s*\n?\s*(\{[^`]+\})\s*\n?```/);
    
    if (!jsonMatch || !jsonMatch[1]) {
      console.warn('External action marker found but no valid JSON block');
      return null;
    }

    // Parser le JSON
    const actionData = JSON.parse(jsonMatch[1]);
    
    // Valider et transformer en ExternalAction
    const parsedAction = parseActionFromGPT(actionData);
    
    if (!parsedAction) {
      console.warn('Could not parse action from GPT response:', actionData);
      return null;
    }

    console.log('✅ External action parsed:', parsedAction);
    return parsedAction;

  } catch (error) {
    console.error('Error parsing external action:', error);
    return null;
  }
}

/**
 * Nettoie le message en retirant le bloc d'action pour l'affichage
 */
export function cleanExternalActionFromMessage(message: string): string {
  // Retirer le marker et le bloc JSON
  return message
    .replace(/🔗\s*\*\*ACTION:\s*EXTERNAL\*\*\s*/gi, '')
    .replace(/```json\s*\n?\s*\{[^`]+\}\s*\n?```/g, '')
    .trim();
}

/**
 * Vérifie si un message contient une action externe
 */
export function hasExternalAction(message: string): boolean {
  return /🔗\s*\*\*ACTION:\s*EXTERNAL\*\*/i.test(message);
}
