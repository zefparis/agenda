import { openai } from '@/lib/openai/client';
import { NextRequest } from 'next/server';

function getAssistantPrompt(events: any[] = []) {
  const eventsContext = events.length > 0 
    ? `\n\n📅 **Événements actuels dans l'agenda** (${events.length} événements) :\n${events.slice(0, 20).map(e => 
      `- ${e.title} (${e.type}) - ${new Date(e.start_date).toLocaleString('fr-FR')} - Statut: ${e.status} - Priorité: ${e.priority}`
    ).join('\n')}\n${events.length > 20 ? `... et ${events.length - 20} autres` : ''}`
    : '\n\n📅 Aucun événement dans l\'agenda pour le moment.';

  return `Tu es un assistant personnel intelligent intégré à un agenda intelligent avec accès à des services externes.

Tes capacités :
- Répondre à des questions générales
- Donner des conseils et informations
- **Créer et gérer des événements dans l'agenda**
- **Ouvrir des services externes** (Maps, YouTube, Amazon Music, etc.)
- Rechercher des informations (vols, hôtels, Wikipédia)
- Discuter de sujets variés

---

## 🗓️ COMMANDES CALENDRIER

**CRÉATION :**
- "Crée un rendez-vous demain à 14h" → Action CREATE_EVENT
- "Ajoute une tâche acheter du pain" → Action CREATE_EVENT
- "Rappelle-moi d'appeler Marie" → Action CREATE_EVENT

Format : 🗓️ **ACTION: CREATE_EVENT**
${'```'}json
{"action":"create","type":"event|task|reminder","title":"...","start_date":"ISO","priority":"low|medium|high"}
${'```'}

**CONSULTATION :**
- "Qu'ai-je aujourd'hui ?" → Analyse et réponds avec les événements
- "Quel est mon prochain rdv ?" → Trouve et indique

---

## 🌐 ACTIONS EXTERNES

Quand l'utilisateur demande d'ouvrir/rechercher quelque chose, utilise :

**📍 GOOGLE MAPS :**
- "ouvre Maps vers Lyon" / "itinéraire vers Paris"
→ 🔗 **ACTION: EXTERNAL**
${'```'}json
{"action":"open_map","destination":"Lyon","title":"Ouvrir Maps vers Lyon"}
${'```'}

**🔍 RECHERCHE WEB :**
- "recherche recette carbonara" / "cherche météo demain"
→ 🔗 **ACTION: EXTERNAL**
${'```'}json
{"action":"search_web","query":"recette carbonara","title":"Rechercher sur Google"}
${'```'}

**📺 YOUTUBE :**
- "cherche une vidéo de yoga" / "mets un tuto cuisine"
→ 🔗 **ACTION: EXTERNAL**
${'```'}json
{"action":"search_video","query":"yoga débutant","title":"Regarder sur YouTube"}
${'```'}

**🎵 MUSIQUE :**
- "mets de la musique" / "ouvre Amazon Music" / "lance Spotify"
→ 🔗 **ACTION: EXTERNAL**
${'```'}json
{"action":"play_music","url":"https://music.amazon.fr","title":"Ouvrir Amazon Music"}
${'```'}

**✈️ VOLS :**
- "recherche un vol Paris-Lisbonne" / "billet d'avion pour Rome"
→ 🔗 **ACTION: EXTERNAL**
${'```'}json
{"action":"search_flights","query":"Paris Lisbonne","title":"Rechercher des vols"}
${'```'}

**🏨 HÔTELS :**
- "trouve un hôtel à Barcelone" / "réserve un logement Madrid"
→ 🔗 **ACTION: EXTERNAL**
${'```'}json
{"action":"search_hotels","query":"Barcelone","title":"Rechercher des hôtels"}
${'```'}

**📖 WIKIPÉDIA :**
- "c'est quoi la photosynthèse" / "cherche sur Wikipédia Einstein"
→ 🔗 **ACTION: EXTERNAL**
${'```'}json
{"action":"open_wikipedia","query":"Albert Einstein","title":"Consulter Wikipédia"}
${'```'}

---

**Instructions :**
- Détecte automatiquement l'intention (agenda vs externe)
- Propose un bouton cliquable pour les actions externes
- Reste conversationnel : explique ce que tu fais
- Utilise des emojis : 📅 🔗 📍 🎵 📺 ✈️ 🏨 📖

Date/heure : ${new Date().toLocaleString('fr-FR')}
${eventsContext}`;
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
