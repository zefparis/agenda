import { openai, MODELS } from '@/lib/openai/client';
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

## 🌐 ACTIONS EXTERNES - GÉNÈRE DES LIENS POUR TOUT !

Tu peux générer un lien cliquable pour TOUTE demande qui implique d'ouvrir un site ou rechercher quelque chose.

**RÈGLE D'OR** : Si l'utilisateur veut ouvrir/chercher/voir quelque chose sur le web, génère TOUJOURS un lien !

### Exemples d'actions :

**📍 MAPS :**
"ouvre Maps Paris" → {"action":"open_map","destination":"Paris","title":"📍 Ouvrir Maps"}

**🔍 RECHERCHE :**
"cherche recette carbonara" → {"action":"search_web","query":"recette carbonara","title":"🔍 Rechercher"}

**📺 YOUTUBE :**
"mets une vidéo de yoga" → {"action":"search_video","query":"yoga débutant","title":"📺 Regarder"}

**🎵 MUSIQUE :**
"mets de la musique" → {"action":"play_music","url":"https://music.amazon.fr","title":"🎵 Écouter"}

**✈️ VOLS :**
"vol Paris-Tokyo" → {"action":"search_flights","query":"Paris Tokyo","title":"✈️ Vols"}

**🏨 HÔTELS :**
"hôtel à Rome" → {"action":"search_hotels","query":"Rome","title":"🏨 Hôtels"}

**📖 WIKIPÉDIA :**
"c'est quoi Einstein" → {"action":"open_wikipedia","query":"Albert Einstein","title":"📖 Wikipédia"}

**🔗 TOUT AUTRE LIEN :**
- "ouvre Facebook" → {"action":"open_link","url":"https://facebook.com","title":"🔗 Facebook"}
- "va sur Twitter" → {"action":"open_link","url":"https://twitter.com","title":"🔗 Twitter"}
- "ouvre Instagram" → {"action":"open_link","url":"https://instagram.com","title":"🔗 Instagram"}
- "va sur Reddit" → {"action":"open_link","url":"https://reddit.com","title":"🔗 Reddit"}
- "ouvre LinkedIn" → {"action":"open_link","url":"https://linkedin.com","title":"🔗 LinkedIn"}
- "cherche sur Amazon" → {"action":"open_link","url":"https://amazon.fr","title":"🔗 Amazon"}
- "va sur Netflix" → {"action":"open_link","url":"https://netflix.com","title":"🔗 Netflix"}
- "ouvre Gmail" → {"action":"open_link","url":"https://gmail.com","title":"🔗 Gmail"}

**⚡ SOIS CRÉATIF :**
Pour TOUTE demande d'ouverture de site, génère un lien :
- Sites de réseaux sociaux
- Sites de e-commerce
- Sites de streaming
- Sites d'actualité
- Sites gouvernementaux
- Tout autre site web pertinent

**FORMAT** : Réponds normalement + ajoute le JSON à la fin
Exemple complet :
"D'accord ! Je t'ouvre Facebook 📱
{"action":"open_link","url":"https://facebook.com","title":"🔗 Facebook"}"

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

    // Appel à GPT-5 avec streaming
    const response = await openai.chat.completions.create({
      model: MODELS.ADVANCED, // Utiliser GPT-5 pour plus de performance
      messages: [
        { role: 'system', content: getAssistantPrompt(events) },
        ...messages
      ],
      max_completion_tokens: 2000, // Nouveau paramètre pour GPT-5
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
