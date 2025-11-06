# 🎤 Guide d'Intégration - Fallback Microphone

Ce guide explique comment intégrer le nouveau système de fallback microphone pour améliorer la fiabilité sur mobile/PWA.

## 📦 Composants Ajoutés

### 1. `MicrophoneFallback.tsx`
Composant de secours qui permet d'utiliser directement le micro sans passer par le wake word.

**Fonctionnalités** :
- ✅ Accès direct au microphone via Web Speech API
- ✅ Diagnostic automatique du système
- ✅ Messages d'erreur détaillés
- ✅ Test des permissions en temps réel
- ✅ Reprise automatique de l'AudioContext

### 2. `useWakeWordMobile` (amélioré)
Hook enrichi avec diagnostic et mode fallback.

**Nouvelles propriétés** :
- `diagnosticInfo`: État complet du système (HTTPS, permissions, AudioContext)
- `fallbackMode`: Mode dégradé activé automatiquement si problèmes détectés

## 🚀 Intégration dans ChatAssistant

### Étape 1 : Importer le composant

```typescript
// src/components/ChatAssistant.tsx
import { MicrophoneFallback } from './MicrophoneFallback';
```

### Étape 2 : Utiliser le hook amélioré

Le hook `useWakeWordMobile` retourne maintenant plus d'informations :

```typescript
const wakeWordMobile = useWakeWordMobile({
  accessKey: process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY || '',
  modelPath: '/models/hello_benji.ppn',
  sensitivity: 0.5,
  enabled: isMounted && isMobile,
  autoStart: true,
  onWake: handleWakeWord,
  onError: handleWakeError
});

// Nouvelles propriétés disponibles
const { diagnosticInfo, fallbackMode } = wakeWordMobile;
```

### Étape 3 : Afficher le fallback si nécessaire

```tsx
{/* Si wake word ne fonctionne pas, afficher le fallback */}
{fallbackMode && (
  <div className="mb-4">
    <MicrophoneFallback 
      onTranscript={handleVoiceCommand}
      enabled={!isProcessing}
    />
  </div>
)}

{/* Ou afficher systématiquement les deux options */}
<div className="space-y-4">
  {/* Wake word (si supporté) */}
  {!fallbackMode && (
    <div>
      <p className="text-sm text-gray-600 mb-2">
        Dites "Hello Benji" pour activer la commande vocale
      </p>
      <WakeIndicator 
        isListening={wakeWordMobile.isListening}
        isDetected={wakeWordMobile.isWakeDetected}
      />
    </div>
  )}
  
  {/* Fallback manuel (toujours disponible) */}
  <div>
    <p className="text-sm text-gray-600 mb-2">
      Ou utilisez le bouton micro :
    </p>
    <MicrophoneFallback 
      onTranscript={handleVoiceCommand}
      enabled={!isProcessing}
    />
  </div>
</div>
```

### Étape 4 : Afficher les informations de diagnostic (optionnel)

```tsx
{/* Afficher le diagnostic pour debugging */}
{process.env.NODE_ENV === 'development' && (
  <div className="mt-4 p-3 bg-gray-100 rounded-lg text-xs">
    <h4 className="font-bold mb-2">Diagnostic</h4>
    <ul className="space-y-1">
      <li>HTTPS: {diagnosticInfo.isSecureContext ? '✅' : '❌'}</li>
      <li>getUserMedia: {diagnosticInfo.hasGetUserMedia ? '✅' : '❌'}</li>
      <li>AudioContext: {diagnosticInfo.hasAudioContext ? '✅' : '❌'}</li>
      {diagnosticInfo.audioContextState && (
        <li>AudioContext state: {diagnosticInfo.audioContextState}</li>
      )}
      {diagnosticInfo.permissionState && (
        <li>Permission: {diagnosticInfo.permissionState}</li>
      )}
    </ul>
  </div>
)}
```

## 📱 Stratégies d'Affichage

### Stratégie 1 : Fallback Automatique (Recommandé)
Afficher automatiquement le composant fallback si le wake word ne peut pas s'initialiser.

```tsx
function ChatAssistant() {
  const wakeWordMobile = useWakeWordMobile({...});
  
  return (
    <div>
      {wakeWordMobile.fallbackMode ? (
        <MicrophoneFallback onTranscript={handleVoiceCommand} />
      ) : (
        <WakeIndicator isListening={wakeWordMobile.isListening} />
      )}
    </div>
  );
}
```

**Avantages** :
- ✅ Simple et automatique
- ✅ Garantit que le micro fonctionne toujours
- ❌ Pas de wake word hands-free

### Stratégie 2 : Les Deux Options (UX Optimale)
Afficher à la fois le wake word ET le fallback manuel.

```tsx
function ChatAssistant() {
  const wakeWordMobile = useWakeWordMobile({...});
  
  return (
    <div className="space-y-4">
      {/* Option 1: Wake word hands-free */}
      {!wakeWordMobile.fallbackMode && (
        <div>
          <h3 className="font-semibold mb-2">Mode mains libres</h3>
          <p className="text-sm text-gray-600 mb-2">
            Dites "Hello Benji"
          </p>
          <WakeIndicator isListening={wakeWordMobile.isListening} />
        </div>
      )}
      
      {/* Option 2: Bouton manuel */}
      <div>
        <h3 className="font-semibold mb-2">Commande manuelle</h3>
        <MicrophoneFallback onTranscript={handleVoiceCommand} />
      </div>
    </div>
  );
}
```

**Avantages** :
- ✅ Meilleure UX : deux façons d'utiliser le micro
- ✅ Wake word si disponible
- ✅ Fallback toujours accessible
- ❌ Interface plus chargée

### Stratégie 3 : Toggle Utilisateur
Laisser l'utilisateur choisir entre wake word et manuel.

```tsx
function ChatAssistant() {
  const [useWakeWord, setUseWakeWord] = useState(true);
  const wakeWordMobile = useWakeWordMobile({
    ...options,
    enabled: useWakeWord
  });
  
  return (
    <div>
      {/* Toggle */}
      <div className="mb-4">
        <button 
          onClick={() => setUseWakeWord(!useWakeWord)}
          className="text-sm underline"
        >
          {useWakeWord ? 'Utiliser le bouton micro' : 'Activer "Hello Benji"'}
        </button>
      </div>
      
      {/* Affichage conditionnel */}
      {useWakeWord && !wakeWordMobile.fallbackMode ? (
        <WakeIndicator isListening={wakeWordMobile.isListening} />
      ) : (
        <MicrophoneFallback onTranscript={handleVoiceCommand} />
      )}
    </div>
  );
}
```

**Avantages** :
- ✅ Contrôle utilisateur
- ✅ Interface épurée
- ❌ Nécessite une action supplémentaire

## 🛠️ Configuration Recommandée

### Pour Production
```typescript
// Toujours afficher le fallback sur mobile pour garantir la fonctionnalité
const shouldShowFallback = isMobile || wakeWordMobile.fallbackMode || wakeWordMobile.error;

return (
  <div>
    {/* Wake word si possible */}
    {!shouldShowFallback && (
      <WakeIndicator isListening={wakeWordMobile.isListening} />
    )}
    
    {/* Fallback systématiquement sur mobile */}
    {shouldShowFallback && (
      <MicrophoneFallback onTranscript={handleVoiceCommand} />
    )}
  </div>
);
```

### Pour Développement
```typescript
// Afficher les deux + diagnostic
return (
  <div>
    {/* Wake word */}
    <div className="mb-4">
      <WakeIndicator isListening={wakeWordMobile.isListening} />
    </div>
    
    {/* Fallback */}
    <div className="mb-4">
      <MicrophoneFallback onTranscript={handleVoiceCommand} />
    </div>
    
    {/* Diagnostic */}
    <DiagnosticPanel info={wakeWordMobile.diagnosticInfo} />
  </div>
);
```

## 🧪 Tests

### Test 1 : HTTPS
```bash
# Vérifier que l'app est en HTTPS
curl -I https://votre-app.vercel.app
# HTTP/2 200
```

### Test 2 : Permissions
```javascript
// Console navigateur
navigator.permissions.query({ name: 'microphone' })
  .then(result => console.log('Permission:', result.state));
```

### Test 3 : AudioContext
```javascript
// Console navigateur
const audioContext = new AudioContext();
console.log('State:', audioContext.state); // doit être "running"
```

### Test 4 : Fallback
1. Ouvrir l'app sur mobile
2. Refuser les permissions micro
3. Le composant MicrophoneFallback doit s'afficher
4. Cliquer sur "Autoriser le micro"
5. Accepter les permissions
6. Le micro doit fonctionner

### Test 5 : Wake Word
1. Ouvrir l'app sur mobile en HTTPS
2. Accepter les permissions
3. Dire "Hello Benji"
4. Le micro doit démarrer automatiquement

## 📚 Documentation API

### MicrophoneFallback Props

```typescript
interface MicrophoneFallbackProps {
  onTranscript: (text: string) => void;  // Callback avec le texte transcrit
  enabled?: boolean;                      // Active/désactive le composant
  className?: string;                     // Classes CSS custom
}
```

### useWakeWordMobile Return

```typescript
interface UseWakeWordMobileReturn {
  // États existants
  isInitialized: boolean;
  isListening: boolean;
  isWakeDetected: boolean;
  error: string | null;
  
  // Méthodes
  start: () => Promise<boolean>;
  stop: () => Promise<void>;
  requestPermission: () => Promise<boolean>;
  
  // Informations système
  isSupported: boolean;
  isMobile: boolean;
  platform: 'android' | 'ios' | 'desktop';
  
  // 🆕 Nouvelles propriétés
  diagnosticInfo: DiagnosticInfo;
  fallbackMode: boolean;
}

interface DiagnosticInfo {
  isSecureContext: boolean;        // HTTPS activé
  hasGetUserMedia: boolean;        // API disponible
  hasAudioContext: boolean;        // AudioContext disponible
  audioContextState?: string;      // 'suspended' | 'running' | 'closed'
  permissionState?: PermissionState; // 'granted' | 'denied' | 'prompt'
}
```

## ⚠️ Problèmes Connus

### 1. AudioContext Suspendu
**Symptôme** : Le micro ne démarre pas, AudioContext en état "suspended"
**Solution** : Le composant MicrophoneFallback reprend automatiquement l'AudioContext au clic

### 2. Permissions Refusées
**Symptôme** : Erreur "NotAllowedError"
**Solution** : Le composant affiche un message clair et un bouton pour réessayer

### 3. HTTP Non Sécurisé
**Symptôme** : getUserMedia() bloqué
**Solution** : Le diagnostic détecte le problème et affiche un warning

### 4. Navigateur Incompatible
**Symptôme** : Web Speech API non disponible
**Solution** : Le composant détecte l'incompatibilité et affiche un message

## 🚀 Prochaines Améliorations

- [ ] Support offline pour transcription (WebAssembly)
- [ ] Recording audio buffer pour retry
- [ ] Meilleure gestion du bruit de fond
- [ ] Support multi-langues
- [ ] Analytics des erreurs

---

**Créé le** : 6 novembre 2025  
**Auteur** : Cascade AI  
**Version** : 1.0.0
