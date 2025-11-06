# 🎤 Solutions Microphone PWA Mobile

## 🚨 Problème

Le microphone ne fonctionne pas sur mobile en PWA malgré les permissions accordées.

## 🔍 Causes Possibles

### 1. Contexte de Sécurité (HTTPS)
- ❌ **HTTP** : getUserMedia() bloqué
- ✅ **HTTPS** : getUserMedia() autorisé
- ✅ **localhost** : Autorisé pour dev uniquement

**Vérification** :
```javascript
console.log('Secure context:', window.isSecureContext);
console.log('Location:', window.location.protocol);
```

### 2. AudioContext Suspendu
- Sur mobile, AudioContext démarre en état "suspended"
- Il DOIT être repris après une interaction utilisateur

**Vérification** :
```javascript
console.log('AudioContext state:', audioContext.state);
// Doit être "running", pas "suspended"
```

### 3. Permissions Refusées
- Chrome Android peut refuser les permissions
- Paramètres du site peuvent bloquer le micro

**Vérification** :
```javascript
navigator.permissions.query({ name: 'microphone' })
  .then(result => console.log('Permission:', result.state));
```

### 4. WebVoiceProcessor Incompatible
- Certains navigateurs mobiles ne supportent pas bien WebVoiceProcessor
- Pas de fallback automatique

## ✅ Solutions Implémentées

### Solution 1️⃣ : Bouton Manual Override

Ajouter un bouton pour bypasser le wake word et utiliser directement le micro.

**Avantages** :
- Fonctionne même si wake word échoue
- Garantit l'accès au micro
- Meilleure UX sur mobile

### Solution 2️⃣ : Detection Améliorée

Améliorer la détection de support et afficher des messages clairs.

**Détections** :
- ✅ Secure context (HTTPS)
- ✅ getUserMedia support
- ✅ WebVoiceProcessor support
- ✅ AudioContext state
- ✅ Permissions micro

### Solution 3️⃣ : Reprise AudioContext Automatique

Reprendre AudioContext sur chaque interaction utilisateur.

**Events surveillés** :
- `click`, `touchstart`, `touchend`
- `visibilitychange` (retour au premier plan)

### Solution 4️⃣ : Fallback Simple

Si Porcupine échoue, utiliser uniquement Web Speech API.

**Mode dégradé** :
- Pas de wake word
- Bouton micro manuel
- Reconnaissance vocale directe

## 📱 Configuration Requise

### 1. HTTPS Obligatoire

**Production** :
```bash
# Déployer sur Vercel (HTTPS auto)
vercel --prod
```

**Local avec HTTPS** :
```bash
# Terminal 1
npm run build && npm run start

# Terminal 2
npx local-ssl-proxy --source 3001 --target 3000

# Accéder via https://localhost:3001
```

### 2. Headers Permissions-Policy

```typescript
// next.config.ts
{
  key: 'Permissions-Policy',
  value: 'microphone=(self), notifications=(self)'
}
```

### 3. Service Worker

Le Service Worker doit être enregistré correctement :
```javascript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js');
}
```

## 🧪 Tests à Effectuer

### Checklist Mobile

1. **Installation PWA**
   - [ ] App installée via Chrome menu
   - [ ] Icône sur écran d'accueil
   - [ ] Ouvre en mode standalone

2. **Contexte Sécurisé**
   - [ ] `window.isSecureContext === true`
   - [ ] URL commence par `https://`

3. **Permissions**
   - [ ] Prompt permission apparaît
   - [ ] Permission accordée (pas refusée)
   - [ ] Banner ne s'affiche plus après accord

4. **AudioContext**
   - [ ] AudioContext créé après interaction
   - [ ] State = "running" (pas "suspended")
   - [ ] Reprise automatique sur visibilitychange

5. **Microphone**
   - [ ] getUserMedia() réussit
   - [ ] Stream audio actif
   - [ ] Pas d'erreur NotAllowedError

6. **Wake Word (optionnel)**
   - [ ] Porcupine initialisé
   - [ ] "Hello Benji" détecté
   - [ ] Vibration + TTS

7. **Fallback Manual**
   - [ ] Bouton micro visible
   - [ ] Clic démarre Web Speech API
   - [ ] Reconnaissance vocale fonctionne

## 🔧 Dépannage

### Erreur: "NotAllowedError"
**Cause** : Permission micro refusée
**Solution** :
```
Chrome → ⓘ (info) → Paramètres du site → Microphone : Autoriser
```

### AudioContext "suspended"
**Cause** : Pas d'interaction utilisateur
**Solution** :
```javascript
// Reprendre sur première interaction
document.addEventListener('click', () => {
  if (audioContext.state === 'suspended') {
    audioContext.resume();
  }
}, { once: true });
```

### Wake word ne fonctionne pas
**Cause** : WebVoiceProcessor échoue
**Solution** :
- Utiliser le bouton micro manuel (fallback)
- Vérifier les fichiers modèles dans `/public/models/`

### PWA ne s'installe pas
**Cause** : Manifest ou Service Worker invalide
**Solution** :
```bash
# Vérifier dans Chrome DevTools
# Application → Manifest
# Application → Service Workers
```

## 📊 Monitoring

### Logs Console
```javascript
// Activer logs détaillés
localStorage.setItem('DEBUG_VOICE', 'true');

// Voir état complet
console.log({
  secureContext: window.isSecureContext,
  audioState: audioContext?.state,
  hasGetUserMedia: 'mediaDevices' in navigator,
  hasWakeWord: isWakeWordReady()
});
```

### Métriques à Surveiller
- Taux de succès getUserMedia()
- Taux de détection wake word
- Taux d'utilisation fallback manual
- Erreurs AudioContext suspended

## 🚀 Recommandations

### Pour Production
1. ✅ Déployer sur HTTPS (Vercel)
2. ✅ Toujours afficher bouton micro manuel
3. ✅ Reprendre AudioContext sur interactions
4. ✅ Afficher messages d'erreur clairs
5. ✅ Logger les échecs pour debugging

### Pour Développement
1. ✅ Tester sur appareil réel (pas émulateur)
2. ✅ Utiliser ngrok ou local-ssl-proxy
3. ✅ Vérifier console mobile via `chrome://inspect`
4. ✅ Tester avec/sans wake word

---

**Dernière mise à jour** : 6 novembre 2025
**Testé sur** : Samsung S23, Chrome Android 119+
