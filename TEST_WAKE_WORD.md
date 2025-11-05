# 🧪 Page de test Wake Word

## 📍 Accès à la page

```
http://localhost:3000/testWake
```

ou en production :
```
https://votre-domaine.vercel.app/testWake
```

---

## 🎯 Objectif

Cette page permet de tester isolément le système de détection du wake word "Hello Benji" sans l'intégration complète du ChatAssistant.

---

## 🚀 Utilisation

### 1. Prérequis

Avant de tester, assurez-vous que :

- ✅ `NEXT_PUBLIC_PICOVOICE_ACCESS_KEY` est configurée dans `.env.local`
- ✅ Le fichier `hello_benji.ppn` est dans `public/models/`
- ✅ L'application tourne : `npm run dev`

### 2. Accès

```bash
# Démarrer l'app
npm run dev

# Ouvrir dans le navigateur
http://localhost:3000/testWake
```

### 3. Test

1. **Autoriser le microphone** quand le navigateur le demande
2. **Attendre** que le statut indique "🎧 En écoute du mot-clé : Hello Benji"
3. **Dire clairement** : "Hello Benji"
4. **Observer** l'animation ✅ et le message de confirmation

---

## 🎨 Interface

### État initial (En écoute)
```
┌─────────────────────────────────────────┐
│  🎤 Test Wake Word "Hello Benji"        │
├─────────────────────────────────────────┤
│  🎧 En écoute du mot-clé : Hello Benji  │
│                                         │
│           🎤                            │
│      (Animation pulse)                  │
│                                         │
│  📋 Instructions :                      │
│   1. Autoriser le micro                │
│   2. Attendre "En écoute"              │
│   3. Dire "Hello Benji"                │
│   4. Observer la confirmation           │
└─────────────────────────────────────────┘
```

### État détecté
```
┌─────────────────────────────────────────┐
│  🎤 Test Wake Word "Hello Benji"        │
├─────────────────────────────────────────┤
│  🎧 En écoute du mot-clé : Hello Benji  │
│                                         │
│           ✅                            │
│      (Animation ping)                   │
│                                         │
│  Wake Word Détecté !                    │
│  (Animation 2 secondes)                 │
└─────────────────────────────────────────┘
```

---

## 🐛 Dépannage

### ❌ "Clé API manquante"

**Cause** : `NEXT_PUBLIC_PICOVOICE_ACCESS_KEY` non configurée

**Solution** :
```bash
echo "NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=votre_clé" >> .env.local
npm run dev
```

### ❌ "Erreur d'initialisation"

**Causes possibles** :
1. Modèle `hello_benji.ppn` introuvable
2. Clé API invalide
3. Fichiers WASM manquants

**Solutions** :
```bash
# Vérifier le modèle
ls -lh public/models/hello_benji.ppn

# Vérifier les dossiers
npm run setup:wakeword

# Vérifier la clé
cat .env.local | grep PICOVOICE
```

### 🎤 Microphone bloqué

**Solution** :
- Autoriser dans le navigateur (icône 🔒 ou 🎤 dans la barre d'adresse)
- HTTPS requis (sauf localhost)
- Vérifier que le micro fonctionne (paramètres système)

### 🔇 Wake word ne détecte pas

**Solutions** :
1. **Parler plus clairement** : "Hello Benji" (pas trop vite)
2. **Ajuster la sensibilité** dans `page.tsx` :
   ```typescript
   sensitivity: 0.3  // Plus sensible (0.0 - 1.0)
   ```
3. **Vérifier la distance** : 30-50 cm du micro
4. **Réduire le bruit ambiant**

---

## 🔍 Logs Console

Ouvrir la console navigateur (F12) pour voir :

```javascript
🔧 Chargement du modèle…
✅ Porcupine initialisé avec succès
🎧 Écoute du wake word activée
🔥 Hello Benji détecté ! { label: 'hello_benji', ... }
```

---

## 🎛️ Personnalisation

### Changer la sensibilité

Dans `src/app/testWake/page.tsx` :
```typescript
{
  label: "hello_benji",
  publicPath: "/models/hello_benji.ppn",
  customWritePath: "/models/hello_benji.ppn",
  sensitivity: 0.5  // ← Modifier ici (0.0 = très sensible, 1.0 = peu sensible)
}
```

### Changer le modèle

Pour tester un autre wake word :
1. Créer un nouveau modèle sur Picovoice Console
2. Télécharger le `.ppn`
3. Placer dans `public/models/`
4. Modifier le chemin dans `page.tsx`

---

## 📊 Différences avec ChatAssistant

| Aspect | Page de test | ChatAssistant |
|--------|--------------|---------------|
| **Objectif** | Tester la détection seule | Usage complet |
| **UI** | Minimaliste | Intégrée |
| **Feedback** | Animation simple | TTS + VoiceInput |
| **Hook** | Code direct | `useWakeWord` |
| **Logs** | Console uniquement | Console + UI |

---

## 🔗 Intégration dans l'app

Une fois le test réussi, le même système fonctionne dans `ChatAssistant` via :
- `src/hooks/useWakeWord.ts`
- `src/lib/voiceWake.ts`
- `src/components/WakeIndicator.tsx`

---

## ✅ Checklist de test

- [ ] Page accessible sur `/testWake`
- [ ] Autorisation micro accordée
- [ ] Statut "En écoute" affiché
- [ ] Animation micro visible
- [ ] "Hello Benji" détecte correctement
- [ ] Animation ✅ apparaît
- [ ] Message "Wake Word Détecté !" visible
- [ ] Logs dans console F12
- [ ] Pas d'erreurs en console

---

## 🎯 Prochaines étapes

Une fois le test validé :

1. **Retourner à l'app principale** : `/`
2. **Tester dans ChatAssistant** : Dire "Hello Benji" dans l'interface normale
3. **Observer** : Animation WakeIndicator + TTS + Micro activé

---

## 📝 Notes techniques

### Architecture
```
page.tsx
  ↓
PorcupineWorker.create()
  ↓
WebVoiceProcessor.subscribe()
  ↓
Detection callback
  ↓
setDetected(true) → Animation
```

### Fichiers requis
```
public/
  ├── models/hello_benji.ppn     # Votre modèle
  └── porcupine/                 # Fichiers WASM (auto)
```

### Variables d'environnement
```bash
NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=xxx
```

---

**Temps de test** : ~2 minutes  
**Difficulté** : Facile  
**Prérequis** : Clé + modèle configurés  

🧪 **Bon test !**
