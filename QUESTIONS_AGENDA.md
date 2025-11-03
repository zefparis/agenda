# 🔍 Questions sur l'Agenda - Assistant IA

## 🎯 Nouvelle Fonctionnalité

L'assistant peut maintenant **consulter** vos événements et **répondre** à vos questions !

## 💬 Types de questions supportées

### 📅 Événements du jour
```
"Qu'est-ce que j'ai aujourd'hui ?"
"Mon programme du jour ?"
"Quels sont mes rendez-vous aujourd'hui ?"
"J'ai combien d'événements aujourd'hui ?"
```

**Exemple de réponse :**
```
📅 Aujourd'hui vous avez 3 événements :
1. ⏰ 09:00 - Réunion d'équipe (Événement)
2. ✅ 14:00 - Envoyer rapport (Tâche)
3. 🔔 18:00 - Appeler Marie (Rappel)
```

### 🔮 Événements futurs
```
"Qu'ai-je demain ?"
"Mon programme de la semaine ?"
"J'ai des rdv cette semaine ?"
"Quand est mon prochain rendez-vous ?"
```

**Exemple de réponse :**
```
🔮 Votre prochain rendez-vous est demain à 14h : "Rendez-vous dentiste"
```

### ✅ Tâches en cours
```
"Liste mes tâches"
"Quelles sont mes tâches en cours ?"
"Qu'est-ce que je dois faire ?"
"Mes tâches urgentes ?"
```

**Exemple de réponse :**
```
✅ Vous avez 2 tâches en cours :
1. 🔴 URGENT - Envoyer le rapport (priorité haute)
2. Acheter du pain
```

### ⏰ Rappels
```
"Mes rappels du jour ?"
"Quand dois-je appeler Marie ?"
"J'ai des rappels en attente ?"
```

**Exemple de réponse :**
```
⏰ Vous avez 1 rappel : Appeler Marie à 18h00
```

### 🔍 Recherche
```
"Quand est ma réunion avec le client ?"
"J'ai un rendez-vous dentiste ?"
"Cherche tous les événements avec Marie"
```

**Exemple de réponse :**
```
🔍 J'ai trouvé : "Réunion client" le lundi 4 novembre à 10h
```

### 📊 Statistiques
```
"Combien d'événements j'ai cette semaine ?"
"Je suis occupé demain ?"
"J'ai beaucoup de tâches ?"
```

**Exemple de réponse :**
```
📊 Cette semaine vous avez :
- 5 événements
- 3 tâches (1 urgente)
- 2 rappels
Vous êtes assez chargé ! 💪
```

## 🎤 Avec la voix

Utilisez le micro 🎤 pour poser vos questions :

```
🎤 "Qu'est-ce que j'ai aujourd'hui ?"
🤖 "Aujourd'hui vous avez 3 événements : ..."

🎤 "Quand est mon prochain rdv ?"
🤖 "Votre prochain rendez-vous est demain à 14h"

🎤 "Liste mes tâches urgentes"
🤖 "Vous avez 1 tâche urgente : Envoyer le rapport"
```

## 🔄 Questions + Actions

Combinez questions et actions dans la même conversation :

```
👤: "Qu'ai-je demain ?"
🤖: "Demain vous avez une réunion à 10h"

👤: "Ajoute un rappel pour préparer cette réunion à 9h"
🤖: "✅ Rappel créé pour demain 9h : Préparer la réunion"

👤: "Parfait, et après la réunion ?"
🤖: "Après la réunion à 10h, vous êtes libre jusqu'à 14h"
```

## 🧠 Intelligence contextuelle

L'assistant comprend le contexte :

```
👤: "J'ai des événements demain ?"
🤖: "Oui, vous avez 2 événements demain"

👤: "Lesquels ?"
🤖: "1. Réunion client à 10h
     2. Rendez-vous dentiste à 14h"

👤: "Ajoute un rappel 30 min avant le dentiste"
🤖: "✅ Rappel créé pour demain 13h30"
```

## 📋 Format des réponses

### Événement unique
```
📅 Rendez-vous dentiste
⏰ Demain à 14:00
📍 Cabinet Dr. Martin
🏷️ Événement - Priorité moyenne
```

### Liste d'événements
```
📅 Vos événements de la journée :

1. 09:00 - Réunion d'équipe
   📍 Salle A
   
2. 14:00 - Rendez-vous client
   🔴 Priorité haute
   
3. 18:00 - Rappel : Appeler Marie
```

### Aucun événement
```
📅 Vous n'avez rien de prévu aujourd'hui.
Profitez-en pour vous reposer ! 😊

💡 Voulez-vous que je vous suggère des tâches ?
```

## 🎯 Exemples de conversations

### Conversation 1 : Planning du jour
```
👤: "Bonjour, c'est quoi mon programme aujourd'hui ?"
🤖: "Bonjour ! 👋 Aujourd'hui vous avez 3 événements :
     • 09:00 - Réunion d'équipe
     • 14:00 - Rendez-vous client (priorité haute)
     • 18:00 - Rappel : Appeler Marie
     Bonne journée productive ! 💪"
```

### Conversation 2 : Recherche
```
👤: "Quand est ma réunion avec le client Acme ?"
🤖: "🔍 Votre réunion avec le client est prévue lundi à 10h"

👤: "Ajoute un rappel pour préparer la présentation la veille"
🤖: "✅ Parfait ! J'ai créé un rappel pour dimanche 18h :
     'Préparer présentation client Acme'"
```

### Conversation 3 : Gestion proactive
```
👤: "Je suis libre cet après-midi ?"
🤖: "Oui ! Vous êtes libre après 15h. Vous avez :
     • 09:00 - Réunion
     • 14:00 - Rendez-vous
     Puis plus rien 😊"

👤: "Parfait, bloque 16h pour du sport"
🤖: "✅ C'est noté ! Événement créé : Sport à 16h"
```

## ⚙️ Fonctionnement technique

### Contexte transmis
À chaque question, l'assistant reçoit :
- **Tous vos événements** (jusqu'à 20 affichés dans le prompt)
- **Date et heure actuelles**
- **Historique de conversation**

### Format des données
```javascript
{
  title: "Réunion client",
  type: "event",
  start_date: "2025-11-04T10:00:00Z",
  status: "pending",
  priority: "high",
  description: "Présentation Q4"
}
```

### Analyse intelligente
L'IA peut :
- ✅ Filtrer par date
- ✅ Filtrer par type (event/task/reminder)
- ✅ Trier par priorité
- ✅ Chercher par titre/description
- ✅ Calculer des statistiques

## 🚀 Conseils d'utilisation

### ✅ Bonnes pratiques
1. **Soyez naturel** : Parlez comme à un assistant humain
2. **Contexte clair** : "aujourd'hui", "demain", "cette semaine"
3. **Précisez si besoin** : "mes tâches urgentes" vs "toutes mes tâches"
4. **Combinez** : Questions + actions dans la même conversation

### ❌ À éviter
1. Trop de précision : ~~"événement du 04/11/2025 à 14:00:00"~~
2. Commandes techniques : ~~"SELECT * FROM events"~~
3. Questions vagues : ~~"quoi ?"~~

## 🔧 Dépannage

### L'assistant ne voit pas mes événements
1. Vérifiez que les événements sont créés
2. Rafraîchissez la page
3. Console (F12) : Cherchez `events` dans la requête

### Réponses incorrectes
1. L'IA peut se tromper sur les dates relatives
2. Vérifiez toujours dans le calendrier
3. Reformulez votre question différemment

### Pas de réponse aux questions
1. Vérifiez la connexion OpenAI
2. Le prompt doit contenir les événements
3. Regardez les logs console

## 📊 Logs de debugging

### Console navigateur
```javascript
💬 Chat request with events: 5
// Les 5 événements sont envoyés avec la requête
```

### Prompt système
```
📅 **Événements actuels dans l'agenda** (5 événements) :
- Réunion équipe (event) - 04/11/2025 09:00...
- Tâche urgente (task) - 04/11/2025 14:00...
...
```

---

**L'assistant peut maintenant répondre à toutes vos questions sur votre agenda ! 🎉📅🔍**
