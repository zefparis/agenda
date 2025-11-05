# 🚀 Prochaines étapes - Activation du Wake Word "Hello Benji"

## ✅ Déjà fait

- ✅ Installation de `@picovoice/porcupine-web` et `@picovoice/web-voice-processor`
- ✅ Création du système de détection (`voiceWake.ts`)
- ✅ Hook React `useWakeWord` 
- ✅ Composant visuel `WakeIndicator`
- ✅ Intégration complète dans `ChatAssistant`
- ✅ Configuration des dossiers (`public/models/`, `public/porcupine/`)
- ✅ Documentation exhaustive

---

## 🎯 À faire maintenant (5 minutes)

### Étape 1 : Obtenir une clé Picovoice

1. Aller sur https://console.picovoice.ai/
2. Créer un compte gratuit
3. Générer une **Access Key**
4. Copier la clé

---

### Étape 2 : Créer le modèle "Hello Benji"

1. Aller sur https://console.picovoice.ai/ppn
2. Cliquer sur **"Create Custom Wake Word"**
3. Configurer :
   - **Wake Phrase** : `Hello Benji`
   - **Language** : `French` (Français)
   - **Platform** : `Web (WASM)`
4. Cliquer sur **"Train"** (quelques minutes)
5. Une fois prêt, **télécharger le fichier `.ppn`**

---

### Étape 3 : Configuration locale

#### 3.1 Ajouter la clé dans `.env.local`

Créer ou modifier `.env.local` et ajouter :

```bash
NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=votre_clé_picovoice_ici
```

#### 3.2 Placer le modèle

Copier le fichier téléchargé dans :

```
public/models/hello_benji.ppn
```

---

### Étape 4 : Tester

```bash
# Démarrer l'application
npm run dev
```

Puis :

1. Ouvrir http://localhost:3000
2. **Autoriser l'accès au microphone** (popup navigateur)
3. Regarder la console : vérifier "✅ Porcupine initialisé avec succès"
4. **Dire clairement** : "Hello Benji"
5. Observer :
   - 🌊 Animation WakeIndicator
   - 🔊 TTS : "Oui Benji, je t'écoute !"
   - 🎤 Micro activé automatiquement

---

## 🐛 Si ça ne marche pas

### Problème : "Access Key invalide"

```bash
# Vérifier le fichier .env.local
cat .env.local | grep PICOVOICE

# Doit contenir :
# NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=abc123...
```

**Solution** : Copier/coller la clé depuis Picovoice Console

---

### Problème : "Modèle introuvable"

```bash
# Vérifier que le fichier existe
ls -lh public/models/hello_benji.ppn

# Doit afficher :
# -rw-r--r-- 1 user user 50K ... hello_benji.ppn
```

**Solution** : Télécharger et placer le `.ppn` au bon endroit

---

### Problème : "Microphone non accessible"

**Solution** :
- Autoriser le micro dans le navigateur (icône 🎤 dans la barre d'adresse)
- Utiliser HTTPS ou localhost (HTTP non autorisé en production)
- Vérifier que le micro fonctionne (test système)

---

### Problème : Wake word ne détecte pas

**Solutions** :

1. **Ajuster la sensibilité** dans `ChatAssistant.tsx` :
   ```typescript
   const wakeWord = useWakeWord({
     // ...
     sensitivity: 0.3, // Plus bas = plus sensible
   });
   ```

2. **Parler clairement** :
   - Prononciation : "Hello Benji" (pas trop vite)
   - Distance : 30-50 cm du micro
   - Environnement : peu de bruit de fond

3. **Vérifier les logs console** :
   ```
   🎙️ Initialisation de Porcupine...
   ✅ Porcupine initialisé avec succès
   🎧 Écoute du wake word activée
   ```

---

## 📖 Documentation complète

- **Configuration** : `WAKE_WORD_SETUP.md`
- **Implémentation** : `IMPLEMENTATION_WAKE_WORD.md`
- **Changements** : `CHANGEMENTS_WAKE_WORD.md`

---

## 🎨 Personnalisation

### Changer le mot-clé

Pour utiliser un autre mot (ex: "Hey Assistant") :

1. Créer un nouveau modèle sur Picovoice Console
2. Télécharger le nouveau `.ppn`
3. Placer dans `public/models/` (ex: `hey_assistant.ppn`)
4. Modifier `ChatAssistant.tsx` :
   ```typescript
   modelPath: '/models/hey_assistant.ppn'
   ```

### Désactiver temporairement

Dans `ChatAssistant.tsx` :

```typescript
const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
```

Ou ajouter un toggle UI :

```typescript
<button onClick={() => setWakeWordEnabled(!wakeWordEnabled)}>
  {wakeWordEnabled ? 'Désactiver' : 'Activer'} Wake Word
</button>
```

---

## ✨ Après activation

Une fois le wake word fonctionnel, vous pouvez :

1. **Utiliser l'app mains-libres** :
   - Dire "Hello Benji"
   - Énoncer votre commande
   - L'assistant exécute

2. **Personnaliser l'UX** :
   - Changer les animations dans `WakeIndicator.tsx`
   - Modifier le message TTS
   - Ajuster le timeout (actuellement 10s)

3. **Améliorer la détection** :
   - Tester dans différents environnements
   - Ajuster la sensibilité
   - Entraîner un meilleur modèle

---

## 🎯 Commandes rapides

```bash
# Configuration initiale
npm run setup:wakeword

# Développement
npm run dev

# Build production
npm run build

# Vérifier TypeScript
npx tsc --noEmit
```

---

## 🔗 Liens utiles

- **Picovoice Console** : https://console.picovoice.ai/
- **Doc Porcupine** : https://picovoice.ai/docs/porcupine/web/
- **Support Picovoice** : https://picovoice.ai/support/

---

## 📞 Besoin d'aide ?

Regarder les logs console pour diagnostiquer :

```javascript
// Dans la console navigateur
localStorage.debug = '*'; // Activer tous les logs
```

Puis recharger la page et dire "Hello Benji".

---

**Temps estimé** : 5 minutes  
**Difficulté** : Facile  
**Prérequis** : Compte Picovoice (gratuit)  

🎤 **Bonne détection vocale !**
