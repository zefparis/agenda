import { ExternalAction } from '@/types/actions';
import { parseActionFromGPT } from './actionHandler';

/**
 * Parse les actions externes depuis un message GPT
 * Recherche plusieurs patterns possibles pour plus de robustesse
 */
export function parseExternalActions(message: string): ExternalAction | null {
  try {
    // Pattern 1: Avec marker 🔗 **ACTION: EXTERNAL**
    const jsonMatch1 = message.match(/🔗\s*\*\*ACTION:\s*EXTERNAL\*\*\s*```json\s*\n?\s*(\{[^`]+\})\s*\n?```/i);
    
    // Pattern 2: Juste un bloc ```json avec "action"
    const jsonMatch2 = message.match(/```json\s*\n?\s*(\{[^`]+?"action"\s*:\s*"[^"]+[^`]+\})\s*\n?```/);
    
    // Pattern 3: JSON inline sans backticks mais avec "action":
    const jsonMatch3 = message.match(/\{[^}]*"action"\s*:\s*"(open_map|search_web|search_video|play_music|search_flights|search_hotels|open_wikipedia|open_link)"[^}]*\}/);

    const jsonText = jsonMatch1?.[1] || jsonMatch2?.[1] || jsonMatch3?.[0];
    
    if (!jsonText) {
      return null;
    }

    // Parser le JSON
    const actionData = JSON.parse(jsonText);
    
    // Vérifier que c'est bien une action externe (pas une action d'événement)
    if (actionData.action === 'create' || actionData.action === 'update' || actionData.action === 'delete') {
      return null; // C'est une action d'événement, pas externe
    }
    
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
 * Nettoie le message en retirant tous les blocs d'action pour l'affichage
 */
export function cleanExternalActionFromMessage(message: string): string {
  return message
    // Retirer le marker avec bloc JSON
    .replace(/🔗\s*\*\*ACTION:\s*EXTERNAL\*\*\s*```json\s*\n?\s*\{[^`]+\}\s*\n?```/gi, '')
    // Retirer les blocs JSON génériques avec "action"
    .replace(/```json\s*\n?\s*\{[^`]*"action"\s*:\s*"[^"]+[^`]*\}\s*\n?```/g, '')
    // Retirer JSON inline avec action externe
    .replace(/\{[^}]*"action"\s*:\s*"(open_map|search_web|search_video|play_music|search_flights|search_hotels|open_wikipedia|open_link)"[^}]*\}/g, '')
    .trim();
}

/**
 * Vérifie si un message contient une action externe (plus permissif)
 */
export function hasExternalAction(message: string): boolean {
  // Vérifier plusieurs patterns
  const hasMarker = /🔗\s*\*\*ACTION:\s*EXTERNAL\*\*/i.test(message);
  const hasActionJson = /"action"\s*:\s*"(open_map|search_web|search_video|play_music|search_flights|search_hotels|open_wikipedia|open_link)"/i.test(message);
  
  return hasMarker || hasActionJson;
}
