# 🌐 Actions Externes - Guide Développeur

## 📋 Vue d'ensemble

Le système d'actions externes permet à l'assistant conversationnel d'ouvrir des services tiers (Google Maps, YouTube, Amazon Music, etc.) directement depuis le chat.

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  USER: "ouvre Maps vers Lyon"                               │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  ChatAssistant.tsx                                           │
│  - Envoie le message à /api/chat                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  /api/chat/route.ts                                          │
│  - GPT-5 analyse l'intention                                │
│  - Génère une réponse avec action structurée                │
│  - Stream la réponse                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  externalActions.ts                                          │
│  - parseExternalActions(): détecte le bloc JSON             │
│  - cleanExternalActionFromMessage(): nettoie le message     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  actionHandler.ts                                            │
│  - parseActionFromGPT(): valide l'action                    │
│  - generateMapsUrl(): crée l'URL Maps                       │
│  - executeAction(): ouvre le lien                           │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│  ActionButton.tsx                                            │
│  - Affiche un bouton cliquable                              │
│  - Icône + label + lien externe                             │
└─────────────────────────────────────────────────────────────┘
```

## 📝 Format des actions GPT

L'assistant GPT doit répondre dans ce format :

```
🔗 **ACTION: EXTERNAL**
```json
{
  "action": "open_map",
  "destination": "Lyon",
  "title": "Ouvrir Maps vers Lyon"
}
```

Ensuite je t'ouvre Google Maps pour Lyon ! 📍
```

## 🎯 Types d'actions supportées

### 📍 Google Maps (`open_map`)
```json
{
  "action": "open_map",
  "destination": "Lyon",
  "title": "Ouvrir Maps vers Lyon"
}
```
**URL générée** : `https://www.google.com/maps/dir/?api=1&destination=Lyon`

### 🔍 Recherche Web (`search_web`)
```json
{
  "action": "search_web",
  "query": "recette carbonara",
  "title": "Rechercher sur Google"
}
```
**URL générée** : `https://www.google.com/search?q=recette+carbonara`

### 📺 YouTube (`search_video`)
```json
{
  "action": "search_video",
  "query": "yoga débutant",
  "title": "Regarder sur YouTube"
}
```
**URL générée** : `https://www.youtube.com/results?search_query=yoga+d%C3%A9butant`

### 🎵 Musique (`play_music`)
```json
{
  "action": "play_music",
  "url": "https://music.amazon.fr",
  "title": "Ouvrir Amazon Music"
}
```
**URLs disponibles** :
- Amazon Music : `https://music.amazon.fr`
- Spotify : `https://open.spotify.com`
- Deezer : `https://www.deezer.com`
- YouTube Music : `https://music.youtube.com`

### ✈️ Vols (`search_flights`)
```json
{
  "action": "search_flights",
  "query": "Paris Lisbonne",
  "title": "Rechercher des vols"
}
```
**URL générée** : `https://www.google.com/travel/flights?q=Paris+Lisbonne`

### 🏨 Hôtels (`search_hotels`)
```json
{
  "action": "search_hotels",
  "query": "Barcelone",
  "title": "Rechercher des hôtels"
}
```
**URL générée** : `https://www.google.com/travel/hotels?q=Barcelone`

### 📖 Wikipédia (`open_wikipedia`)
```json
{
  "action": "open_wikipedia",
  "query": "Albert Einstein",
  "title": "Consulter Wikipédia"
}
```
**URL générée** : `https://fr.wikipedia.org/wiki/Special:Search?search=Albert+Einstein`

### 🔗 Lien personnalisé (`open_link`)
```json
{
  "action": "open_link",
  "url": "https://example.com",
  "title": "Ouvrir le lien"
}
```

## 🛠️ Ajouter une nouvelle action

### 1. Ajouter le type dans `types/actions.ts`
```typescript
export type ActionType = 
  | 'open_map' 
  | 'search_web'
  | 'my_new_action' // ⬅️ Nouveau
  | 'none';
```

### 2. Créer la fonction dans `lib/actionHandler.ts`
```typescript
export function generateMyServiceUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://myservice.com/search?q=${encoded}`;
}
```

### 3. Ajouter le case dans `parseActionFromGPT`
```typescript
case 'my_new_action':
  if (actionData.query) {
    action.url = generateMyServiceUrl(actionData.query);
    action.query = actionData.query;
  }
  break;
```

### 4. Ajouter l'icône dans `ActionButton.tsx`
```typescript
import { MyIcon } from 'lucide-react';

const ACTION_ICONS = {
  // ...
  my_new_action: MyIcon,
};

const ACTION_LABELS = {
  // ...
  my_new_action: '🔥 Mon Service',
};
```

### 5. Mettre à jour le prompt GPT dans `/api/chat/route.ts`
```typescript
**🔥 MON SERVICE :**
- "recherche sur MonService" / "ouvre MonService"
→ 🔗 **ACTION: EXTERNAL**
\`\`\`json
{"action":"my_new_action","query":"terme recherché","title":"Rechercher sur MonService"}
\`\`\`
```

## 🧪 Tester une action

### Via le Chat
1. Ouvrir l'onglet "Chat Assistant"
2. Taper : `ouvre Maps vers Paris`
3. Vérifier que GPT renvoie une action
4. Cliquer sur le bouton généré
5. Vérifier que l'URL s'ouvre correctement

### Via la console
```javascript
// Ouvrir DevTools (F12)
// Vérifier les logs console :
console.log('🔗 Action externe détectée:', externalAction);
console.log('✅ External action parsed:', parsedAction);
console.log('🔗 Executing action:', action.action, action.url);
```

## 📊 Monitoring

Les actions sont loggées automatiquement :

```
✅ External action parsed: {
  action: 'open_map',
  destination: 'Lyon',
  url: 'https://www.google.com/maps/dir/?api=1&destination=Lyon',
  title: 'Ouvrir Maps vers Lyon'
}

🔗 Executing action: open_map https://www.google.com/maps/...
```

## 🐛 Débogage

### L'action ne se déclenche pas
1. Vérifier que GPT génère le bon format (marker `🔗 **ACTION: EXTERNAL**`)
2. Vérifier le bloc JSON (syntaxe valide)
3. Regarder les logs console pour les erreurs de parsing

### Le bouton n'apparaît pas
1. Vérifier que `message.externalAction` existe
2. Vérifier que l'URL est bien générée
3. Regarder le state React dans DevTools

### L'URL est incorrecte
1. Vérifier la fonction `generate*Url()` correspondante
2. Vérifier l'encodage des paramètres (`encodeURIComponent`)
3. Tester l'URL manuellement

## 🔒 Sécurité

- **Validation stricte** : Seules les actions définies dans `ActionType` sont acceptées
- **URL whitelist** : Pas de redirection vers des URLs arbitraires non validées
- **window.open avec noopener** : Protection contre les attaques de tabna pping
- **Encode des paramètres** : Protection XSS via `encodeURIComponent`

## 🚀 Améliorations futures

- [ ] Historique des actions exécutées
- [ ] Permissions utilisateur (popup de confirmation)
- [ ] Actions groupées (plusieurs liens en une fois)
- [ ] Deeplinks vers apps mobiles (Maps, YouTube, etc.)
- [ ] Intégration OAuth pour services authentifiés
- [ ] Metrics d'utilisation des actions

---

**Créé avec ❤️ pour Mon Agenda Intelligent**
