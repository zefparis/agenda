# 🔔 Système de Notifications et Rappels

## 🎯 Fonctionnalités

### Notifications Automatiques
L'application vérifie automatiquement vos événements toutes les **30 secondes** et vous envoie des rappels.

### Types de rappels

#### 📅 **Événements** (type: `event`)
- Notification **5 minutes avant** l'événement
- Exemple : "Réunion client dans 5 minutes"

#### ⏰ **Rappels** (type: `reminder`)
- Notification **15 minutes avant** le rappel
- Exemple : "Appeler Marie dans 15 minutes"

#### ✅ **Tâches prioritaires** (type: `task` + priority: `high`)
- Notification **5 minutes avant** la tâche importante
- Exemple : "Envoyer rapport dans 5 minutes"

## 🔊 Son de notification
- Sonnerie automatique à chaque rappel
- Volume réglé à 50%
- Son court et discret

## 🖥️ Notifications Navigateur

### Caractéristiques
- ✅ Titre avec emoji 🔔
- ✅ Type d'événement (Événement/Tâche/Rappel)
- ✅ Temps restant
- ✅ Reste affichée jusqu'à interaction
- ✅ Clic sur notification = Focus sur l'app

### Activation

#### 1️⃣ **Premier lancement**
Un banner orange apparaît en haut de l'écran :
```
🔔 Activer les notifications
Recevez des rappels pour vos événements importants avec une sonnerie
[Activer] [Plus tard]
```

#### 2️⃣ **Autorisation navigateur**
Le navigateur demande la permission :
- **Autoriser** → Notifications activées ✅
- **Bloquer** → Vous devrez réactiver dans les paramètres du navigateur

#### 3️⃣ **Statut visible**
En haut à gauche, le statut s'affiche :
- 🔔 **Notifications activées** (vert)
- 🔕 **Notifications désactivées** (rouge)
- 🔔 **Non configurées** (orange, avec animation)

## 📱 Compatibilité

### ✅ Navigateurs supportés
- Chrome / Edge (Desktop & Mobile)
- Firefox (Desktop & Mobile)
- Safari (Desktop uniquement)
- Opera

### ❌ Non supportés
- Safari iOS (limitations Apple)
- Navigateurs en mode incognito

## 🚗 Usage en voiture

### Mode silencieux
Les notifications restent visibles mais **le son peut être coupé** :
1. Première notification → Coupez le son du navigateur
2. Les suivantes resteront silencieuses

### Focus conduite
- Les notifications n'interrompent **pas** la navigation
- Elles restent visibles dans le centre de notifications
- Consultez-les à l'arrêt

## ⚙️ Configuration

### Modifier les délais
Fichier : `src/hooks/useNotifications.ts`

```typescript
const in5Minutes = new Date(now.getTime() + 5 * 60 * 1000); // 5 min
const in15Minutes = new Date(now.getTime() + 15 * 60 * 1000); // 15 min
```

### Modifier la fréquence de vérification
```typescript
const interval = setInterval(checkNotifications, 30000); // 30 sec
```

### Modifier le volume du son
```typescript
audioRef.current.volume = 0.5; // 0 à 1 (0% à 100%)
```

## 🐛 Dépannage

### Pas de notifications ?

#### 1. Vérifier les permissions
- Chrome : `chrome://settings/content/notifications`
- Firefox : `about:preferences#privacy`
- Edge : `edge://settings/content/notifications`

#### 2. Vérifier le statut
- Regardez le statut en haut à gauche
- Si 🔕 rouge → Réactivez dans les paramètres navigateur

#### 3. Console de développement
Ouvrez la console (F12) :
```
🔔 Notification: [Titre] dans [Timing]
```

### Son ne fonctionne pas ?

#### Interaction nécessaire
Les navigateurs bloquent l'audio sans interaction utilisateur :
1. Cliquez n'importe où sur la page
2. Les prochains sons fonctionneront

#### Vérifier le volume
- Volume système activé
- Volume navigateur activé
- Pas de mode silencieux

### Notifications en double ?

#### Cause
L'événement a déjà été notifié.

#### Solution
Le système garde une trace des événements notifiés :
```typescript
notifiedEvents.current.has(eventId)
```

## 📊 Logs

### Console navigateur (F12)
```
🔔 Notification: Réunion client dans 5 minutes
🔔 Notification: Appeler Marie dans 15 minutes
```

## 🎨 Personnalisation

### Changer l'icône
Remplacez `/public/icon.png` par votre icône (192x192px recommandé)

### Modifier le message
```typescript
body: `Dans ${timing} - [Votre message personnalisé]`
```

### Ajouter des actions
```typescript
actions: [
  { action: 'view', title: 'Voir' },
  { action: 'dismiss', title: 'Ignorer' }
]
```

---

**Le système de notifications fonctionne en arrière-plan pour ne jamais manquer un événement ! 🚀**
