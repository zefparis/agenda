# 🎯 Guide d'utilisation - Mon Agenda Intelligent

## 🎤 Commande Vocale

### Activation
1. Cliquez sur le bouton **violet avec l'icône micro** 🎤
2. Autorisez l'accès au microphone si demandé
3. Parlez naturellement en français
4. Le système transcrit et exécute automatiquement

### Exemples de commandes vocales
```
"rdv demain à 17 heures"
"réunion lundi à 14h30"
"rappelle-moi d'appeler Marie dans 2 heures"
"acheter du pain"
"rendez-vous dentiste vendredi à 9h"
```

### Navigation en voiture 🚗
- **Mains libres** : Utilisez uniquement la voix
- **Sécurité** : Pas besoin de toucher l'écran
- Le bouton micro pulse en rouge pendant l'écoute

## 🤖 Intelligence OpenAI

### Compréhension contextuelle
L'IA comprend automatiquement :
- **Date du jour** : "demain" = date actuelle + 1 jour
- **Jours de la semaine** : "lundi prochain" calcule le bon lundi
- **Heures relatives** : "dans 2 heures" = heure actuelle + 2h
- **Type d'événement** : rdv/réunion = event, tâche/acheter = task, rappel = reminder
- **Priorité** : urgent/important = haute, sinon moyenne

### Exemples intelligents

#### "rdv demain à 17h"
```json
{
  "type": "event",
  "title": "Rendez-vous",
  "start_date": "2025-11-04T17:00:00.000Z",
  "priority": "medium"
}
```

#### "acheter du pain urgent"
```json
{
  "type": "task", 
  "title": "Acheter du pain",
  "priority": "high"
}
```

#### "réunion lundi à 14h30"
```json
{
  "type": "event",
  "title": "Réunion", 
  "start_date": "2025-11-04T14:30:00.000Z"
}
```

## 📅 Calendrier Interactif

### Vue mensuelle
- Cliquez sur un jour pour voir le détail horaire
- Couleurs :
  - 🔵 Bleu = Événements
  - 🟢 Vert = Tâches
  - 🟠 Orange = Rappels

### Vue détaillée (Timeline 24h)
- Timeline de 00:00 à 23:00
- Affichage de tous les détails :
  - ⏰ Heure de début/fin
  - 📝 Description
  - 📍 Localisation
  - 🏷️ Tags
  - ⚡ Priorité (bordure colorée)
- Actions directes : ✓ Compléter | ✕ Supprimer

## 🌓 Mode Sombre

- **Activé par défaut** pour réduire la fatigue oculaire
- Bouton ☀️/🌙 en haut à droite pour basculer
- Préférence sauvegardée

## 💡 Astuces

### Commandes rapides
- **Voix** : Pour ajouter rapidement en conduisant
- **Texte** : Pour des détails plus précis
- **Calendrier** : Pour visualiser et gérer

### Formats acceptés
```
✅ "rdv demain 17h"
✅ "rdv demain à 17h"  
✅ "rdv demain 17 heures"
✅ "rendez-vous demain dix-sept heures"
```

### Priorités
- Mots-clés : **urgent**, **important**, **critique** → Priorité haute
- Par défaut → Priorité moyenne

### Types automatiques
- rdv, rendez-vous, réunion, meeting → **Événement**
- tâche, todo, acheter, faire → **Tâche**
- rappel, reminder, rappelle-moi → **Rappel**

## 🔧 Dépannage

### Le micro ne fonctionne pas
1. Vérifiez les permissions du navigateur
2. Utilisez Chrome, Edge, ou Safari (pas Firefox)
3. Vérifiez que le micro n'est pas utilisé par une autre app

### OpenAI ne répond pas
- Un fallback simple est automatiquement utilisé
- Vérifiez votre clé API dans `.env.local`
- Consultez les logs de la console du navigateur (F12)

### Les dates sont incorrectes
- OpenAI calcule depuis la date/heure actuelle
- Vérifiez que l'heure système est correcte
- Format: "demain" = J+1, "dans 2 jours" = J+2

## 📱 Compatible Mobile

L'interface s'adapte aux petits écrans :
- Boutons tactiles optimisés
- Commande vocale idéale pour mobile
- Calendrier responsive

## 🎨 Personnalisation

### Filtres
Utilisez les filtres pour trier par :
- Type (événement/tâche/rappel)
- Statut (en cours/terminé/annulé)
- Priorité (haute/moyenne/basse)

### Actions rapides
- ✓ Marquer comme terminé (tâches)
- ✕ Supprimer
- 📅 Voir détails (clic sur jour)

---

**Bon usage de votre agenda intelligent ! 🚀**
