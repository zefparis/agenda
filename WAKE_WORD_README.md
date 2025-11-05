# 🎤 Wake Word "Hello Benji" - README

> Système d'activation vocale pour **mon-agenda-intelligent**

---

## 🎯 En bref

Dites **"Hello Benji"** → L'assistant s'active automatiquement et attend votre commande vocale.

- ✅ Détection **100% locale** (WASM, pas de cloud)
- ✅ Animation visuelle immersive
- ✅ Confirmation vocale TTS
- ✅ Timeout automatique (10s)
- ✅ Conforme RGPD

---

## 🚀 Quick Start (5 min)

### 1. Obtenir une clé Picovoice

https://console.picovoice.ai/ → Créer un compte → Générer une Access Key

### 2. Créer le modèle "Hello Benji"

https://console.picovoice.ai/ppn → Nouvelle phrase → "Hello Benji" (Français, Web) → Télécharger `.ppn`

### 3. Configuration

```bash
# Créer les dossiers
npm run setup:wakeword

# Ajouter la clé dans .env.local
echo "NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=votre_clé" >> .env.local

# Placer le modèle téléchargé
cp ~/Downloads/hello_benji_fr_wasm_v3_0_0.ppn public/models/hello_benji.ppn

# Démarrer
npm run dev
```

### 4. Tester

Ouvrir http://localhost:3000 → Autoriser micro → Dire **"Hello Benji"** → 🎉

---

## 📁 Fichiers créés

```
src/
├── types/wakeword.ts                  # Types TypeScript
├── lib/voiceWake.ts                   # Système Porcupine
├── hooks/useWakeWord.ts               # Hook React
└── components/WakeIndicator.tsx       # Indicateur visuel

Documentation :
├── WAKE_WORD_README.md                # Ce fichier
├── NEXT_STEPS_WAKE_WORD.md            # Guide pas-à-pas
├── WAKE_WORD_SETUP.md                 # Configuration détaillée
├── IMPLEMENTATION_WAKE_WORD.md        # Doc technique
└── CHANGEMENTS_WAKE_WORD.md           # Résumé des modifs
```

---

## 🎬 Workflow

```
1. "Hello Benji" 
   ↓
2. Détection locale (Porcupine WASM)
   ↓
3. Animation WakeIndicator
   ↓
4. TTS : "Oui Benji, je t'écoute !"
   ↓
5. Micro activé (Web Speech API)
   ↓
6. Commande envoyée à GPT-5
   ↓
7. Exécution via ActionHandler
```

---

## 🛠️ Stack technique

- **Porcupine Web 3.0** : Détection du wake word
- **Web Voice Processor** : Accès micro
- **Web Speech API** : Reconnaissance vocale
- **Framer Motion** : Animations
- **TypeScript** : Typage strict
- **React 19** : Hooks & composants

---

## 📖 Documentation

| Fichier | Contenu |
|---------|---------|
| `NEXT_STEPS_WAKE_WORD.md` | **⭐ Commencer ici** - Guide pas-à-pas |
| `WAKE_WORD_SETUP.md` | Configuration complète |
| `IMPLEMENTATION_WAKE_WORD.md` | Détails techniques |
| `CHANGEMENTS_WAKE_WORD.md` | Liste des fichiers modifiés |

---

## 🐛 Dépannage rapide

### "Access Key invalide"
→ Vérifier `NEXT_PUBLIC_PICOVOICE_ACCESS_KEY` dans `.env.local`

### "Modèle introuvable"
→ Placer `hello_benji.ppn` dans `public/models/`

### Wake word ne détecte pas
→ Ajuster `sensitivity: 0.3` dans `ChatAssistant.tsx` (plus sensible)

### Microphone bloqué
→ Autoriser dans le navigateur (HTTPS requis sauf localhost)

---

## 💡 Personnalisation

### Désactiver temporairement

Dans `ChatAssistant.tsx` :
```typescript
const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
```

### Changer la sensibilité

```typescript
const wakeWord = useWakeWord({
  sensitivity: 0.5, // 0.0 = très sensible, 1.0 = peu sensible
  // ...
});
```

### Modifier le timeout

```typescript
voiceTimeoutRef.current = setTimeout(() => {
  setShowVoice(false);
}, 15000); // 15 secondes au lieu de 10
```

---

## 🎨 Architecture

```
┌──────────────────────────────────────┐
│        ChatAssistant.tsx             │
│  ┌────────────────────────────────┐  │
│  │   useWakeWord Hook             │  │
│  │  - État (listening, detected)  │  │
│  │  - Méthodes (start, stop)      │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   voiceWake.ts                 │  │
│  │  - initWakeWord()              │  │
│  │  - startListening()            │  │
│  │  - Porcupine Worker (WASM)     │  │
│  └────────────┬───────────────────┘  │
│               │                      │
│  ┌────────────▼───────────────────┐  │
│  │   WakeIndicator.tsx            │  │
│  │  - Halos pulsants              │  │
│  │  - Animations Framer Motion    │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

---

## ✅ Checklist

- [x] Installation des packages
- [x] Création du code source
- [x] Intégration dans ChatAssistant
- [x] Documentation complète
- [ ] **Obtenir clé Picovoice** ← À faire
- [ ] **Créer modèle "Hello Benji"** ← À faire
- [ ] **Configurer .env.local** ← À faire
- [ ] **Placer le modèle .ppn** ← À faire

---

## 🎯 Commandes

```bash
# Setup initial
npm run setup:wakeword

# Développement
npm run dev

# Build
npm run build

# TypeScript check
npx tsc --noEmit
```

---

## 📊 Statut

| Composant | Statut |
|-----------|--------|
| Code source | ✅ Complet |
| Types TypeScript | ✅ Complet |
| Documentation | ✅ Complète |
| Tests manuels | ⏳ En attente config |
| Configuration | ⚠️ Requiert clé + modèle |

---

## 🔗 Liens rapides

- **Picovoice Console** : https://console.picovoice.ai/
- **Créer modèle** : https://console.picovoice.ai/ppn
- **Doc Porcupine** : https://picovoice.ai/docs/porcupine/web/
- **Support** : https://picovoice.ai/support/

---

## 🎤 Exemple d'utilisation

```typescript
// Dans n'importe quel composant React
import { useWakeWord } from '@/hooks/useWakeWord';

function MyComponent() {
  const wakeWord = useWakeWord({
    accessKey: process.env.NEXT_PUBLIC_PICOVOICE_ACCESS_KEY!,
    modelPath: '/models/hello_benji.ppn',
    sensitivity: 0.5,
    enabled: true,
    onWake: () => {
      console.log('Wake word détecté !');
      // Votre logique ici
    },
    autoStart: true
  });

  return (
    <div>
      <p>En écoute : {wakeWord.isListening ? 'Oui' : 'Non'}</p>
      <button onClick={wakeWord.start}>Démarrer</button>
      <button onClick={wakeWord.stop}>Arrêter</button>
    </div>
  );
}
```

---

## 🚀 Prochaines étapes

1. **Lire** : `NEXT_STEPS_WAKE_WORD.md`
2. **Configurer** : Clé + modèle
3. **Tester** : "Hello Benji"
4. **Profiter** ! 🎉

---

**Développé pour mon-agenda-intelligent**  
*Next.js 16 • React 19 • TypeScript 5 • Porcupine Web 3.0*

🎤 **Prêt à dire "Hello Benji" ?**
