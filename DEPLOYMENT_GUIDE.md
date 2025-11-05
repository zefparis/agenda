# 🚀 Guide de Déploiement - PWA Mobile Android

## ✅ Checklist Pré-Déploiement

### 1. Variables d'environnement

```bash
# .env.local (développement)
NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=votre_cle
OPENAI_API_KEY=votre_cle
NEXT_PUBLIC_SUPABASE_URL=votre_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle
```

### 2. Icônes PWA (IMPORTANT)

```bash
# Générer les SVG placeholder
node scripts/generate-icons.js

# Convertir en PNG (requis pour PWA)
cd public/icons
for file in *.svg; do
  convert "$file" "${file%.svg}.png"
done

# Vérifier
ls -la public/icons/*.png
# Doit avoir: 72, 96, 128, 144, 152, 192, 384, 512
```

### 3. Modèles Porcupine

```bash
# Vérifier présence
ls -la public/models/
# hello_benji.ppn (3KB)
# porcupine_params_fr.pv (962KB)
```

---

## 📦 Build Local

```bash
# Installer dépendances
npm install

# Build production
npm run build

# Tester
npm run start
```

---

## 🌐 Déploiement Vercel (Recommandé)

### Via CLI

```bash
# Installer Vercel
npm i -g vercel

# Login
vercel login

# Déployer
vercel --prod

# Configurer les variables d'env
vercel env add NEXT_PUBLIC_PICOVOICE_ACCESS_KEY
vercel env add OPENAI_API_KEY
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY

# Redéployer avec les vars
vercel --prod
```

### Via GitHub

1. Push sur GitHub
2. Importer projet sur vercel.com
3. Configurer variables d'env dans Settings → Environment Variables
4. Déployer

**URL finale:** `https://mon-agenda-intelligent.vercel.app`

---

## 🧪 Test sur Samsung S23

### 1. Test HTTPS Local (Développement)

```bash
# Terminal 1: Next.js
npm run dev

# Terminal 2: Tunnel HTTPS
npx ngrok http 3000
# ou
npx localtunnel --port 3000

# Ouvrir l'URL sur S23
```

### 2. Test Production (Vercel)

1. Ouvrir Chrome sur S23
2. Aller sur `https://votre-app.vercel.app`
3. Vérifier console (chrome://inspect depuis PC)

### Checklist de vérification

```
✅ Page charge correctement
✅ Manifest détecté (DevTools → Application → Manifest)
✅ Service Worker actif (DevTools → Application → Service Workers)
✅ Icônes affichées
✅ Prompt "Installer l'application" apparaît
✅ Permission micro demandée
✅ Wake word détecté
✅ TTS fonctionne
✅ Vibration fonctionne
✅ Reconnaissance vocale OK
✅ API chat répond
```

---

## 📱 Installation PWA

### Chrome Android

1. Ouvrir `https://votre-app.vercel.app`
2. Menu Chrome (⋮) → **"Installer l'application"**
3. Confirmer → Icône sur écran d'accueil
4. Ouvrir l'app → Mode standalone

### Samsung Internet

1. Ouvrir l'URL
2. Menu → **"Ajouter à l'écran d'accueil"**
3. Confirmer

---

## 🔍 Vérification Console

### Logs attendus (Chrome DevTools)

```javascript
// Service Worker
✅ Service Worker enregistré: /
✅ Porcupine initialisé avec succès

// Wake Word Mobile
📱 Demande permission micro...
✅ AudioContext créé: running
🔓 Wake Lock activé
✅ Wake word mobile initialisé

// Détection
🔥 Wake word détecté (mobile)
🎤 Auto-démarrage de la reconnaissance vocale...
```

### Erreurs fréquentes

**❌ "Permission micro refusée"**
```
Solution: Chrome → i (info) → Paramètres → Microphone → Autoriser
```

**❌ "getUserMedia non supporté"**
```
Solution: Vérifier HTTPS actif (requis pour micro)
```

**❌ "Porcupine failed to load"**
```
Solution: Vérifier fichiers modèles dans public/models/
```

**❌ "Service Worker registration failed"**
```
Solution: Vérifier que sw.js est dans public/
```

---

## 🛠️ Debugging Android

### Via Chrome Desktop

1. Brancher S23 en USB
2. Activer "Débogage USB" sur S23
3. Chrome Desktop → `chrome://inspect`
4. Cliquer "Inspect" sur votre app
5. Console complète disponible

### Logs Service Worker

```javascript
// Dans DevTools
Application → Service Workers → sw.js → Console
```

### Forcer mise à jour SW

```javascript
// Console navigateur
navigator.serviceWorker.getRegistration().then(reg => {
  reg.update();
});
```

### Vider cache

```javascript
// Console
caches.keys().then(names => {
  names.forEach(name => caches.delete(name));
});
```

---

## 🔐 Permissions Android

### Gérer les permissions

**Via Chrome:**
```
Chrome → i (info) → Paramètres du site
→ Microphone: Autoriser
→ Notifications: Autoriser
```

**Via Android:**
```
Paramètres → Applications → Chrome → Autorisations
→ Microphone: Autoriser
→ Notifications: Autoriser
```

### Batterie optimisée

Pour éviter suspension:
```
Paramètres → Batterie → Utilisation batterie
→ Chrome → Non restreinte
```

---

## 📊 Monitoring Production

### Vercel Analytics

```bash
# Activer dans vercel.json
{
  "analytics": {
    "enable": true
  }
}
```

### Logs en temps réel

```bash
vercel logs
vercel logs --follow
```

### Erreurs

```bash
# Dashboard Vercel
vercel.com → Projet → Deployments → Logs
```

---

## 🔄 Mises à jour

### Mise à jour code

```bash
# Modifier le code
git add .
git commit -m "feat: nouvelle fonctionnalité"
git push

# Vercel redéploie automatiquement
```

### Mise à jour Service Worker

```javascript
// Incrémenter CACHE_NAME dans public/sw.js
const CACHE_NAME = 'agenda-ia-v2'; // v1 → v2

// Les utilisateurs recevront automatiquement la MAJ
```

### Force refresh utilisateurs

```javascript
// Dans PWAProvider.tsx
navigator.serviceWorker.addEventListener('controllerchange', () => {
  window.location.reload(); // Auto-reload
});
```

---

## 🎯 Performance

### Optimisations recommandées

1. **Compression Brotli** (Vercel auto)
2. **Image Optimization** (Next.js auto)
3. **Code Splitting** (Next.js auto)
4. **Lazy Loading Porcupine**

### Métriques cibles

```
First Contentful Paint: < 1.8s
Largest Contentful Paint: < 2.5s
Time to Interactive: < 3.8s
Total Bundle Size: < 500KB (sans WASM)
```

---

## ✅ Commandes Rapides

```bash
# Développement
npm run dev

# Build local
npm run build && npm start

# Test HTTPS local
npx ngrok http 3000

# Déployer Vercel
vercel --prod

# Logs production
vercel logs --follow

# Générer icônes
node scripts/generate-icons.js

# Vérifier build
npm run build
```

---

## 🆘 Support

### Problèmes fréquents

**Wake word ne fonctionne pas:**
1. Vérifier permissions micro
2. Vérifier modèles Porcupine présents
3. Vérifier clé API Picovoice valide
4. Tester en HTTPS

**PWA ne s'installe pas:**
1. Vérifier HTTPS actif
2. Vérifier manifest.json accessible
3. Vérifier icônes PNG présentes
4. Vérifier Service Worker enregistré

**App lente:**
1. Vérifier taille bundle
2. Activer compression
3. Optimiser images
4. Lazy load composants

---

## 📚 Documentation

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Vercel Docs](https://vercel.com/docs)
- [PWA Checklist](https://web.dev/pwa-checklist/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)

---

**Créé le**: 5 novembre 2025  
**Auteur**: Assistant IA  
**Version**: 1.0.0
