# Configuration du système d'activation vocale "Hello Benji"

## 🎯 Vue d'ensemble

Le système d'activation vocale utilise **Porcupine** de Picovoice pour détecter localement le mot-clé "Hello Benji" sans envoyer d'audio au cloud.

## 📋 Prérequis

1. **Clé d'accès Picovoice**
   - Créer un compte gratuit sur [Picovoice Console](https://console.picovoice.ai/)
   - Générer une clé d'accès (Access Key)

2. **Modèle personnalisé "Hello Benji"**
   - Aller sur [Picovoice Console - Porcupine](https://console.picovoice.ai/ppn)
   - Créer un nouveau modèle de wake word
   - Phrase : "Hello Benji"
   - Langage : Français
   - Plateforme : Web (WASM)
   - Télécharger le fichier `.ppn` généré

## ⚙️ Configuration

### 1. Variables d'environnement

Ajouter dans `.env.local` :

```bash
# Picovoice Access Key pour le wake word "Hello Benji"
NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=your_access_key_here
```

### 2. Fichiers requis

Créer la structure suivante dans `/public` :

```
public/
├── models/
│   └── hello_benji.ppn          # Modèle personnalisé téléchargé
└── porcupine/
    ├── porcupine_params.pv      # Fourni par @picovoice/porcupine-web
    └── porcupine_worker.js      # Fourni par @picovoice/porcupine-web
```

### 3. Installation des fichiers Porcupine

Les fichiers WASM de Porcupine sont automatiquement copiés depuis `node_modules` :

```bash
# Créer les dossiers
mkdir -p public/models
mkdir -p public/porcupine

# Copier les fichiers Porcupine depuis node_modules
cp node_modules/@picovoice/porcupine-web/lib/porcupine_params.pv public/porcupine/
cp node_modules/@picovoice/web-voice-processor/dist/*.* public/porcupine/
```

### 4. Placer le modèle personnalisé

Copier votre fichier `hello_benji.ppn` téléchargé dans :

```
public/models/hello_benji.ppn
```

## 🚀 Utilisation

### Activation automatique

Le système s'active automatiquement au chargement de `ChatAssistant` :

1. L'utilisateur dit : **"Hello Benji"**
2. Le système détecte le mot-clé localement (sans cloud)
3. Animation visuelle `WakeIndicator` s'affiche
4. TTS répond : "Oui Benji, je t'écoute !"
5. `SpeechRecognition` s'active pour la commande
6. La commande est envoyée à GPT-5
7. Timeout automatique après 10 secondes de silence

### Désactivation

Pour désactiver le wake word temporairement dans `ChatAssistant.tsx` :

```typescript
const [wakeWordEnabled, setWakeWordEnabled] = useState(false);
```

## 🔧 Configuration avancée

### Sensibilité

Ajuster la sensibilité de détection (0.0 à 1.0) :

```typescript
const wakeWord = useWakeWord({
  // ...
  sensitivity: 0.7, // Plus élevé = moins sensible
});
```

### Fallback

Si Porcupine n'est pas disponible, le système utilise automatiquement le bouton micro classique sans wake word.

## 🐛 Dépannage

### Erreur "Access Key invalide"

- Vérifier que `NEXT_PUBLIC_PICOVOICE_ACCESS_KEY` est correctement configurée
- La clé doit être valide et active sur Picovoice Console

### Erreur "Modèle introuvable"

- Vérifier que `hello_benji.ppn` existe dans `/public/models/`
- Le nom du fichier doit correspondre exactement

### Erreur "Microphone non accessible"

- Autoriser l'accès au micro dans le navigateur
- Vérifier que le site est en HTTPS (requis pour microphone)
- Sur localhost, HTTP est accepté

### Wake word ne détecte pas

1. Vérifier la sensibilité (réduire à 0.3-0.4)
2. Parler clairement et distinctement : "Hello Benji"
3. Vérifier que le micro fonctionne
4. Regarder les logs console pour les erreurs

## 📊 Monitoring

Le système log tous les événements dans la console :

- 🎙️ Initialisation de Porcupine
- 🎧 Écoute activée
- 🔥 Wake word détecté
- ❌ Erreurs

## 🔒 Sécurité et confidentialité

- ✅ Détection **100% locale** (WASM dans le navigateur)
- ✅ Aucune donnée audio envoyée au cloud avant détection
- ✅ Conforme RGPD
- ✅ Pas de serveur tiers impliqué

## 📚 Ressources

- [Documentation Porcupine Web](https://picovoice.ai/docs/porcupine/web/)
- [Console Picovoice](https://console.picovoice.ai/)
- [Exemples Porcupine](https://github.com/Picovoice/porcupine/tree/master/demo/web)

## ✨ Fonctionnalités

- 🎤 Détection locale temps réel
- 🌊 Animation visuelle immersive
- 🔊 Confirmation TTS
- ⏱️ Timeout automatique (10s)
- 🔄 Fallback si non supporté
- 🌙 Mode dark supporté
- 📱 Compatible PWA / mobile

---

**Créé pour mon-agenda-intelligent**  
**Stack**: Next.js 16 / React 19 / TypeScript 5 / Porcupine Web
