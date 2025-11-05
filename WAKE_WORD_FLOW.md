# 🎤 Flux du Wake Word "Hello Benji"

## 📋 Vue d'ensemble

Le système de wake word permet d'activer l'assistant vocal en disant "Hello Benji" sans avoir à cliquer sur un bouton.

## 🔄 Flux complet

### 1️⃣ Initialisation (au chargement de l'app)

```typescript
// ChatAssistant.tsx
const wakeWord = useWakeWord({
  accessKey: process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY,
  modelPath: '/models/hello_benji.ppn',
  sensitivity: 0.5,
  enabled: true,
  onWake: handleWakeDetection,  // ← Callback appelé quand "Hello Benji" est détecté
  autoStart: true               // ← Démarre l'écoute automatiquement
});
```

**Résultat**: Porcupine écoute en permanence en arrière-plan pour détecter "Hello Benji"

---

### 2️⃣ Détection du Wake Word

Quand l'utilisateur dit **"Hello Benji"**:

```typescript
// hooks/useWakeWord.ts
handleWake = () => {
  setState(prev => ({ ...prev, isWakeDetected: true }));
  options.onWake(); // ← Appelle handleWakeDetection dans ChatAssistant
}
```

---

### 3️⃣ Activation de la commande vocale

```typescript
// ChatAssistant.tsx - handleWakeDetection()
const handleWakeDetection = () => {
  // 1. Confirmation vocale TTS
  speakConfirmation('Oui, je t\'écoute !');
  
  // 2. Afficher le composant VoiceInput
  setShowVoice(true);
  
  // 3. Activer le flag auto-start
  setAutoStartVoice(true);  // ← Important!
  
  // 4. Timeout de 15 secondes
  setTimeout(() => {
    setShowVoice(false);
    setAutoStartVoice(false);
  }, 15000);
};
```

**Résultat**: 
- L'utilisateur entend "Oui, je t'écoute !"
- L'interface vocale s'affiche
- Le microphone démarre automatiquement

---

### 4️⃣ Démarrage automatique de la reconnaissance vocale

```typescript
// VoiceInput.tsx - useEffect avec autoStart
useEffect(() => {
  if (autoStart && recognitionRef.current && !isListening && !disabled) {
    console.log('🎤 Auto-démarrage de la reconnaissance vocale...');
    recognitionRef.current.start();  // ← Démarre Web Speech API
    setIsListening(true);
  }
}, [autoStart]);
```

**Résultat**: Le microphone commence à écouter sans que l'utilisateur ait à cliquer

---

### 5️⃣ Capture de la commande vocale

L'utilisateur parle (ex: "Crée un rendez-vous demain à 14h")

```typescript
// VoiceInput.tsx - recognition.onresult
recognition.onresult = (event) => {
  const transcript = event.results[0].transcript;
  
  if (event.results[0].isFinal) {
    console.log('🎤 Final transcript:', transcript);
    onTranscript(transcript);  // ← Appelle handleVoiceTranscript
  }
};
```

---

### 6️⃣ Traitement de la transcription

```typescript
// ChatAssistant.tsx - handleVoiceTranscript()
const handleVoiceTranscript = (transcript) => {
  // 1. Nettoyer le timeout
  clearTimeout(voiceTimeoutRef.current);
  
  // 2. Mettre le transcript dans l'input
  setInput(transcript);
  
  // 3. Fermer le voice input
  setShowVoice(false);
  setAutoStartVoice(false);  // ← Réinitialiser
  
  // 4. Auto-submit vers l'API chat
  setTimeout(() => {
    handleSubmit(null, { data: transcript });
  }, 100);
};
```

**Résultat**: 
- La commande vocale est envoyée à l'API
- L'interface vocale se ferme
- L'assistant répond

---

## 🎯 Scénario complet

1. **Utilisateur**: "Hello Benji"
2. **Système**: Détecte le wake word
3. **TTS**: "Oui, je t'écoute !"
4. **Système**: Démarre automatiquement le micro
5. **Utilisateur**: "Crée un rendez-vous demain à 14h"
6. **Système**: 
   - Transcrit la commande
   - Envoie à l'API chat
   - Affiche la réponse de l'assistant
   - Ferme l'interface vocale

---

## 🔑 Points clés

### État `autoStartVoice`

Cet état contrôle si le microphone démarre automatiquement:

| Situation | `autoStartVoice` | Comportement |
|-----------|------------------|--------------|
| Wake word détecté | `true` | ✅ Démarre auto |
| Clic manuel sur bouton micro | `false` | ❌ Utilisateur doit cliquer sur le micro |
| Après transcription | `false` | Réinitialisé |
| Après timeout | `false` | Réinitialisé |

### Différence avec clic manuel

**Wake Word** → Ouvre ET démarre le micro
**Clic manuel** → Ouvre SEULEMENT (utilisateur clique ensuite sur le micro)

---

## 🛠️ Composants impliqués

1. **`hooks/useWakeWord.ts`** - Hook pour Porcupine wake word
2. **`lib/voiceWake.ts`** - Logique Porcupine (init, start, stop)
3. **`components/ChatAssistant.tsx`** - Orchestration principale
4. **`components/VoiceInput.tsx`** - Interface micro + Web Speech API
5. **`components/WakeIndicator.tsx`** - Indicateur visuel "En écoute..."

---

## 📊 Diagramme du flux

```
┌─────────────────────────────────────────────┐
│  1. Utilisateur dit "Hello Benji"           │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  2. Porcupine détecte le wake word          │
│     → onWake() appelé                       │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  3. handleWakeDetection()                   │
│     • TTS: "Oui, je t'écoute !"            │
│     • setShowVoice(true)                    │
│     • setAutoStartVoice(true)               │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  4. VoiceInput monte avec autoStart=true    │
│     → recognition.start() automatique       │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  5. Utilisateur parle                       │
│     → Web Speech API transcrit              │
└──────────────┬──────────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────────┐
│  6. handleVoiceTranscript()                 │
│     • Ferme voice input                     │
│     • Auto-submit à l'API                   │
└─────────────────────────────────────────────┘
```

---

## ✅ Tests

Pour vérifier que tout fonctionne:

1. Ouvrez l'app: http://localhost:3000
2. Vérifiez l'indicateur "En écoute..." en bas à droite
3. Dites clairement: **"Hello Benji"**
4. Vous devriez entendre: "Oui, je t'écoute !"
5. Le micro démarre automatiquement (bouton rouge pulsant)
6. Donnez votre commande vocale
7. La commande est envoyée automatiquement à l'assistant

---

**Fichiers modifiés**:
- ✅ `src/components/VoiceInput.tsx` - Ajout prop `autoStart`
- ✅ `src/components/ChatAssistant.tsx` - Gestion `autoStartVoice`
- ✅ `src/lib/voiceWake.ts` - Modèle français
- ✅ `src/app/testWake/page.tsx` - Page de test

**Date**: 5 novembre 2025
