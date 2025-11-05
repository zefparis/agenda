import { openai, MODELS } from './client';
import { ParsedCommand } from '@/types';
import { simpleParser } from './simple-parser';

const SYSTEM_PROMPT = `Tu es un assistant intelligent qui parse les commandes en langage naturel pour un agenda.

Contexte actuel :
- Date et heure actuelles : ${new Date().toISOString()}
- Jour de la semaine : ${new Date().toLocaleDateString('fr-FR', { weekday: 'long' })}
- Date : ${new Date().toLocaleDateString('fr-FR')}

Ton rôle est de convertir des phrases comme "rdv demain à 17h" en JSON structuré avec des dates PRÉCISES calculées.

Format de sortie (JSON strict) :
{
  "action": "create" | "update" | "delete" | "list" | "search",
  "type": "event" | "task" | "reminder",
  "title": "string",
  "description": "string (optionnel)",
  "start_date": "ISO 8601 string (REQUIS pour events et reminders)",
  "end_date": "ISO 8601 string (optionnel)",
  "all_day": boolean (optionnel),
  "priority": "low" | "medium" | "high" (optionnel)",
  "location": "string (optionnel)",
  "tags": ["string"] (optionnel)"
}

Règles STRICTES :
1. **Calcul des dates** :
   - "demain" = date actuelle + 1 jour
   - "après-demain" = date actuelle + 2 jours
   - "dans X jours" = date actuelle + X jours
   - "lundi/mardi/etc prochain" = prochain jour de la semaine mentionné
   - "dans X heures" = heure actuelle + X heures

2. **Heures** : TOUJOURS en format 24h ISO 8601 avec timezone UTC
   - "17h" ou "17h00" = 17:00:00.000Z (ajusté pour timezone)
   - "9h30" = 09:30:00.000Z
   - Si pas d'heure = utiliser 09:00:00.000Z par défaut

3. **Type** : rdv/rendez-vous/réunion = "event", tâche/todo/acheter = "task", rappel = "reminder"

4. **Priorité** : urgent/important/critique = "high", sinon "medium"

5. **Titre** : Extraire le sujet principal (ex: "rdv dentiste" -> "Dentiste")

Exemples avec dates calculées :
- "rdv demain à 17h" -> {"action":"create","type":"event","title":"Rendez-vous","start_date":"2025-11-04T17:00:00.000Z","priority":"medium"}
- "réunion lundi à 14h30" -> {"action":"create","type":"event","title":"Réunion","start_date":"2025-11-04T14:30:00.000Z","priority":"medium"}
- "appeler Marie dans 2 heures" -> {"action":"create","type":"reminder","title":"Appeler Marie","start_date":"[HEURE_ACTUELLE+2h]","priority":"medium"}

IMPORTANT : Retourne UNIQUEMENT le JSON, sans explication.`;

export async function parseNaturalLanguage(input: string): Promise<ParsedCommand> {
  // Utiliser le parser simple si OpenAI n'est pas configuré
  if (!openai) {
    console.log('⚠️ OpenAI not configured, using simple parser');
    return simpleParser(input);
  }

  try {
    console.log('🤖 Parsing with OpenAI:', input);
    
    const completion = await openai.chat.completions.create({
      model: MODELS.PARSING,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: input }
      ],
      max_completion_tokens: 500, // Limite pour le parsing (GPT-5)
      response_format: { type: 'json_object' },
    });

    const content = completion.choices[0].message.content;
    if (!content) {
      throw new Error('No response from OpenAI');
    }

    const parsed = JSON.parse(content) as ParsedCommand;
    
    console.log('✅ OpenAI parsed:', parsed);
    
    // Validation basique
    if (!parsed.action || !parsed.type || !parsed.title) {
      throw new Error('Invalid parsed command structure');
    }

    return parsed;
  } catch (error) {
    console.error('❌ Error parsing with OpenAI:', error);
    console.log('🔄 Falling back to simple parser');
    // Fallback vers le parser simple en cas d'erreur
    return simpleParser(input);
  }
}
