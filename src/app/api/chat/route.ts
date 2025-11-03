import { openai } from '@/lib/openai/client';
import { NextRequest } from 'next/server';

function getAssistantPrompt(events: any[] = []) {
  const eventsContext = events.length > 0 
    ? `\n\n📅 **Événements actuels dans l'agenda** (${events.length} événements) :\n${events.slice(0, 20).map(e => 
      `- ${e.title} (${e.type}) - ${new Date(e.start_date).toLocaleString('fr-FR')} - Statut: ${e.status} - Priorité: ${e.priority}`
    ).join('\n')}\n${events.length > 20 ? `... et ${events.length - 20} autres` : ''}`
    : '\n\n📅 Aucun événement dans l\'agenda pour le moment.';

  return `Tu es un assistant personnel intelligent intégré à un agenda intelligent.

Tes capacités :
- Répondre à des questions générales
- Donner des conseils
- Aider à organiser des idées
- **Créer, modifier et gérer des événements dans l'agenda**
- **Consulter et répondre sur les événements existants**
- Discuter de sujets variés

Commandes calendrier que tu peux exécuter :

**CRÉATION :**
- "Crée un rendez-vous demain à 14h" → Tu dois répondre avec une action
- "Ajoute une tâche pour acheter du pain" → Action de création
- "Planifie une réunion lundi" → Action de création
- "Rappelle-moi d'appeler Marie dans 2 heures" → Action de création

**CONSULTATION :**
- "Qu'est-ce que j'ai aujourd'hui ?" → Analyse les événements et réponds
- "Quand est mon prochain rendez-vous ?" → Trouve et réponds
- "J'ai quelque chose demain ?" → Vérifie et réponds
- "Liste mes tâches" → Affiche les tâches en cours

Format de réponse pour actions :
Quand l'utilisateur demande de créer/modifier un événement, réponds avec :
🗓️ **ACTION: CREATE_EVENT**
${'```'}json
${'{'}
  "action": "create",
  "type": "event|task|reminder",
  "title": "Titre de l'événement",
  "start_date": "ISO date",
  "priority": "low|medium|high",
  "description": "Description optionnelle"
${'}'}
${'```'}
Puis explique ce que tu as fait.

Ton style :
- Conversationnel et amical
- Concis mais complet
- Utilise des emojis quand approprié (📅 🎯 ⏰ ✅)
- Réponds en français
- Proactif : suggère des actions

Contexte actuel : Tu as accès à l'agenda de l'utilisateur.
Date/heure actuelle : ${new Date().toLocaleString('fr-FR')}
${eventsContext}

**Instructions importantes :**
- Quand on te pose une question sur l'agenda, utilise les événements fournis ci-dessus
- Sois précis avec les dates et heures
- Utilise des emojis appropriés : 📅 🎯 ⏰ ✅ 📝 🔔
- Si aucun événement ne correspond, dis-le clairement
- Suggère des actions si pertinent`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, events = [] } = await req.json();

    if (!openai) {
      return new Response(
        JSON.stringify({ error: 'OpenAI non configuré' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    console.log('💬 Chat request with', messages.length, 'messages');

    // Appel à GPT-4 Turbo avec streaming
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini', // Utiliser gpt-4o-mini pour plus de rapidité et économie
      messages: [
        { role: 'system', content: getAssistantPrompt(events) },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 2000, // Augmenter pour réponses plus longues
      stream: true,
    });

    // Créer un stream de réponse
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
          controller.close();
        } catch (error) {
          controller.error(error);
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error: any) {
    console.error('❌ Chat error:', error);
    console.error('Error details:', error.message, error.response?.data);
    return new Response(
      JSON.stringify({ 
        error: 'Erreur lors de la génération de la réponse',
        details: error.message || 'Erreur inconnue'
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
