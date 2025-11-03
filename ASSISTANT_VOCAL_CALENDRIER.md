# 🎤🗓️ Assistant Vocal avec Calendrier

## 🎯 Nouvelles fonctionnalités

### 1. Commande vocale dans le chat
L'assistant IA peut maintenant être contrôlé par la voix !

#### Comment utiliser
1. **Cliquez** sur l'onglet "Assistant IA"
2. **Cliquez** sur le bouton **micro violet/rose** 🎤
3. **Parlez** votre question ou commande
4. Le système **transcrit et envoie automatiquement**

### 2. Interaction avec le calendrier
L'assistant peut créer des événements directement dans votre agenda !

#### Commandes vocales supportées

##### 📅 Créer un événement
```
"Crée un rendez-vous demain à 14h"
"Planifie une réunion lundi à 10h avec le client"
"Ajoute un événement samedi 20h cinéma"
```

##### ✅ Créer une tâche
```
"Ajoute une tâche pour acheter du pain"
"Crée une tâche urgente : envoyer le rapport"
"Je dois appeler le dentiste"
```

##### ⏰ Créer un rappel
```
"Rappelle-moi d'appeler Marie dans 2 heures"
"Crée un rappel pour prendre mes médicaments à 18h"
"Rappel demain matin : réunion importante"
```

## 🤖 Comment ça fonctionne

### Workflow complet

1. **Vous parlez** : "Crée un rdv demain à 14h chez le dentiste"
2. **Transcription** : Le texte apparaît dans l'input
3. **Envoi auto** : La commande est envoyée à GPT-4o Mini
4. **Analyse IA** : L'assistant comprend qu'il faut créer un événement
5. **Action** : Il génère un objet JSON structuré
6. **Exécution** : L'événement est créé dans le calendrier
7. **Confirmation** : "✅ J'ai créé votre rendez-vous chez le dentiste pour demain 14h"

### Format de réponse de l'IA

Quand vous demandez une action calendrier, l'IA répond avec :

```
🗓️ **ACTION: CREATE_EVENT**
```json
{
  "action": "create",
  "type": "event",
  "title": "Rendez-vous dentiste",
  "start_date": "2025-11-04T14:00:00.000Z",
  "priority": "medium",
  "description": "Rendez-vous chez le dentiste"
}
```

✅ J'ai créé votre rendez-vous chez le dentiste pour demain à 14h. N'oubliez pas !
```

Le JSON est automatiquement **parsé et exécuté**, puis **retiré** du message affiché.

## 🎯 Exemples d'usage

### Conversation naturelle

#### Exemple 1 : Création simple
```
👤 Vous (voix): "Crée un rdv demain 17h"
🤖 IA: "✅ J'ai créé votre rendez-vous pour demain à 17h"
```

#### Exemple 2 : Avec détails
```
👤 Vous (voix): "Planifie une réunion d'équipe lundi à 10h en salle A"
🤖 IA: "✅ Parfait ! J'ai planifié votre réunion d'équipe pour lundi à 10h en salle A"
```

#### Exemple 3 : Tâche urgente
```
👤 Vous (voix): "Ajoute une tâche urgente pour envoyer le rapport"
🤖 IA: "✅ Tâche urgente ajoutée : Envoyer le rapport. Je l'ai marquée prioritaire !"
```

#### Exemple 4 : Rappel relatif
```
👤 Vous (voix): "Rappelle-moi dans 2 heures d'appeler Marie"
🤖 IA: "✅ Noté ! Je vous rappellerai dans 2 heures d'appeler Marie"
```

### Multitâche

Vous pouvez aussi **poser des questions** et **gérer l'agenda** dans la même conversation :

```
👤: "Quels sont les meilleurs conseils pour être productif ?"
🤖: [Répond avec conseils]

👤: "Ok, crée-moi un rappel pour appliquer ces conseils demain matin"
🤖: "✅ C'est fait ! Rappel créé pour demain matin"
```

## 🎨 Interface

### Boutons et contrôles

#### Onglet Assistant IA
- **🎤 Bouton micro** (violet/rose) : Commande vocale
- **📤 Bouton envoyer** (bleu/violet) : Envoi texte
- **🗑️ Bouton corbeille** : Nouvelle conversation

#### Suggestions rapides
Au démarrage, 3 suggestions :
1. 📅 **Crée un rdv demain 14h** (exemple calendrier)
2. 💡 **Conseils productivité** (exemple question)
3. ⏰ **Rappelle-moi dans 1h** (exemple rappel)

## 🚗 Usage en voiture

### Scénario idéal

1. **Main libre** : Cliquez sur le micro avant de conduire
2. **Parlez** : "Crée un rappel pour acheter du pain à 18h"
3. **Confirmation vocale** : L'IA confirme (lisible sur l'écran)
4. **Notification** : Vous recevrez le rappel à 18h avec sonnerie

### Sécurité
- Ne manipulez pas le téléphone en conduisant
- Activez le micro **avant** de partir
- Utilisez un support de téléphone
- Les notifications sonores vous alertent

## ⚙️ Configuration

### Modifier le prompt IA

Fichier : `src/app/api/chat/route.ts`

```typescript
function getAssistantPrompt() {
  return `Tu es un assistant...
  
  // Ajoutez vos propres règles ici
  `;
}
```

### Ajouter des types d'actions

Fichier : `src/lib/chatActions.ts`

```typescript
export interface ChatAction {
  action: 'create' | 'update' | 'delete' | 'search'; // Ajoutez 'search'
  // ...
}
```

### Personnaliser les suggestions

Fichier : `src/components/ChatAssistant.tsx`

```typescript
{[
  '📅 Votre suggestion 1',
  '💡 Votre suggestion 2',
  '⏰ Votre suggestion 3'
].map((suggestion) => ...)}
```

## 🔧 Dépannage

### Le micro ne fonctionne pas dans le chat
1. Vérifiez que le composant `VoiceInput` est bien importé
2. Testez d'abord dans l'onglet Agenda
3. Permissions micro doivent être accordées

### L'événement n'est pas créé
1. **Ouvrez la console** (F12)
2. Cherchez : `🗓️ Action détectée:`
3. Vérifiez le JSON retourné par l'IA
4. L'IA doit respecter le format exact

### Le message contient du JSON visible
L'IA n'a pas bien formaté. Elle doit utiliser :
```
🗓️ **ACTION: CREATE_EVENT**
```json
{ ... }
```
```

Avec les triple backticks et le marqueur exact.

## 📊 Logs de debugging

### Console navigateur
```javascript
💬 Chat request with 2 messages
🗓️ Action détectée: {action: "create", type: "event", ...}
✅ Event created: {id: "...", title: "..."}
```

### Parser d'action
```javascript
import { parseAction, cleanMessage } from '@/lib/chatActions';

const action = parseAction(aiMessage);
// action = { action: 'create', type: 'event', ... } ou null

const clean = cleanMessage(aiMessage);
// Message sans le JSON technique
```

## 🎓 Bonnes pratiques

### Pour l'utilisateur
1. **Soyez précis** : "Rdv demain 14h" plutôt que "un rdv"
2. **Donnez le contexte** : "Réunion client chez Acme à 10h"
3. **Confirmez toujours** : Vérifiez dans le calendrier après création

### Pour le développeur
1. **Testez le prompt** : Modifiez pour votre cas d'usage
2. **Gérez les erreurs** : L'IA peut se tromper
3. **Validez le JSON** : Vérifiez les champs obligatoires
4. **Logs partout** : Facilitez le debugging

## 🚀 Prochaines étapes

### Fonctionnalités à ajouter
- [ ] **Modifier** des événements via chat
- [ ] **Supprimer** des événements via chat
- [ ] **Rechercher** dans l'agenda via chat
- [ ] **Lister** les événements d'une journée
- [ ] **Synthèse vocale** (Text-to-Speech) pour les réponses
- [ ] **Mode conversation** : Poser des questions sur les événements

### Améliorations possibles
- [ ] Meilleur parsing des dates relatives
- [ ] Support des événements récurrents
- [ ] Détection automatique de conflits
- [ ] Suggestions proactives de l'IA

---

**L'assistant vocal est maintenant totalement intégré au calendrier ! 🎉🗓️🎤**
