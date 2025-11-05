# ✅ Checklist Pré-Déploiement Samsung S23

## 🎯 À faire AVANT de tester sur Samsung S23

### 1️⃣ Icônes PWA (CRITIQUE ⚠️)

```bash
# Vérifier la présence des SVG
ls -la public/icons/*.svg
# Doit afficher 9 fichiers (72, 96, 128, 144, 152, 192, 384, 512, badge)

# Installer ImageMagick (si pas déjà fait)
# Ubuntu/Debian:
sudo apt install imagemagick

# macOS:
brew install imagemagick

# Convertir SVG → PNG
cd public/icons
for file in *.svg; do
  echo "Converting $file..."
  convert "$file" "${file%.svg}.png"
done

# Vérifier résultat
ls -la *.png
# Doit afficher 9 PNG

# Retour racine
cd ../..
```

**Sans PNG, la PWA ne s'installera PAS!**

---

### 2️⃣ Variables d'environnement

```bash
# Vérifier .env.local existe
ls -la .env.local

# Vérifier contenu (sans afficher valeurs)
grep -c "NEXT_PUBLIC_PICOVOICE_ACCESS_KEY" .env.local  # doit = 1
grep -c "OPENAI_API_KEY" .env.local                     # doit = 1
grep -c "NEXT_PUBLIC_SUPABASE_URL" .env.local          # doit = 1
grep -c "NEXT_PUBLIC_SUPABASE_ANON_KEY" .env.local     # doit = 1
```

**Si manquant:** Créer `.env.local` avec les clés nécessaires

---

### 3️⃣ Modèles Porcupine

```bash
# Vérifier présence modèles
ls -la public/models/

# Doit afficher:
# hello_benji.ppn (3 KB)
# porcupine_params_fr.pv (962 KB)

# Vérifier tailles
du -h public/models/hello_benji.ppn           # ~3.0K
du -h public/models/porcupine_params_fr.pv    # ~960K
```

**Si manquant:** Wake word ne fonctionnera PAS

---

### 4️⃣ Build test local

```bash
# Build production
npm run build

# Vérifier aucune erreur TypeScript
# ✓ Compiled successfully

# Vérifier bundle size
ls -lh .next/static/chunks/
# Rechercher les plus gros chunks

# Démarrer serveur production
npm run start
# Doit démarrer sur :3000
```

**Si erreurs:** Corriger avant de déployer

---

### 5️⃣ Test HTTPS local (optionnel mais recommandé)

```bash
# Option 1: ngrok
npx ngrok http 3000
# Copier URL HTTPS
# Ouvrir sur téléphone pour tester

# Option 2: localtunnel  
npx localtunnel --port 3000
# Copier URL
# Ouvrir sur téléphone

# Vérifier dans navigateur téléphone:
# - Page charge ✓
# - Pas d'erreurs console ✓
# - Prompt installation PWA ✓
```

---

### 6️⃣ Vérification fichiers Service Worker

```bash
# Vérifier présence
ls -la public/sw.js
ls -la public/manifest.json

# Vérifier syntaxe JavaScript
node -c public/sw.js
# Pas d'erreur = OK

# Vérifier JSON valide
cat public/manifest.json | jq .
# Doit afficher JSON formaté sans erreur
```

---

### 7️⃣ Configuration Vercel

```bash
# Installer Vercel CLI (si pas déjà fait)
npm i -g vercel

# Login
vercel login

# Link projet (première fois)
vercel link

# Configurer variables d'env
vercel env add NEXT_PUBLIC_PICOVOICE_ACCESS_KEY production
vercel env add OPENAI_API_KEY production
vercel env add NEXT_PUBLIC_SUPABASE_URL production
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY production

# Lister pour vérifier
vercel env ls
```

---

## 🚀 Déploiement

### Étape 1: Déployer sur Vercel

```bash
# Déploiement production
vercel --prod

# Note l'URL finale (ex: https://mon-agenda-intelligent.vercel.app)
```

### Étape 2: Vérifier déploiement

```bash
# Ouvrir dans navigateur desktop
# https://votre-url.vercel.app

# Vérifier DevTools:
# 1. Console → Pas d'erreurs rouges
# 2. Application → Manifest → Valide
# 3. Application → Service Workers → Activé
# 4. Network → Modèles Porcupine chargent
```

---

## 📱 Test sur Samsung S23

### Pré-requis téléphone

```
1. Chrome mis à jour (dernière version)
2. Connexion internet stable
3. Batterie > 50%
4. Espace stockage suffisant
```

### Installation PWA

1. **Ouvrir Chrome sur S23**
2. **Aller sur** `https://votre-url.vercel.app`
3. **Autoriser permissions:**
   - Notifications → Autoriser
   - Microphone → Autoriser
4. **Menu Chrome (⋮)** → "Installer l'application"
5. **Confirmer** → Icône sur écran d'accueil
6. **Ouvrir l'app** depuis l'écran d'accueil

### Tests fonctionnels

#### ✅ Test 1: Installation
- [ ] PWA s'installe sans erreur
- [ ] Icône apparaît sur écran d'accueil
- [ ] Ouverture en mode standalone (plein écran)

#### ✅ Test 2: Permissions
- [ ] Prompt permission micro affiché
- [ ] Permission accordée
- [ ] Banner permission disparaît
- [ ] Pas d'erreur console

#### ✅ Test 3: Wake Word (App ouverte)
- [ ] Indicateur "En écoute..." visible
- [ ] Dire "Hello Benji"
- [ ] Vibration courte
- [ ] TTS "Oui, je t'écoute !"
- [ ] Microphone démarre automatiquement
- [ ] Bouton micro rouge pulsant

#### ✅ Test 4: Commande vocale
- [ ] Après wake word, donner commande (ex: "Quel temps fait-il ?")
- [ ] Transcription affichée
- [ ] Envoi auto à GPT-5
- [ ] Réponse assistant reçue
- [ ] Action exécutée si applicable

#### ✅ Test 5: Wake Word (Arrière-plan)
- [ ] Minimiser l'app (retour écran accueil)
- [ ] Attendre 5 secondes
- [ ] Dire "Hello Benji"
- [ ] App revient au premier plan
- [ ] Wake word détecté

#### ✅ Test 6: Offline
- [ ] Activer mode avion
- [ ] Ouvrir app
- [ ] Page offline s'affiche
- [ ] Désactiver mode avion
- [ ] Page se recharge auto

#### ✅ Test 7: Notifications
- [ ] Wake word détecté → notification push
- [ ] Cliquer notification → app s'ouvre

---

## 🐛 Dépannage

### ❌ PWA ne s'installe pas

**Vérifier:**
1. HTTPS actif (https://)
2. manifest.json accessible (`/manifest.json`)
3. Icônes PNG présentes (pas SVG)
4. Service Worker enregistré

**Solution:**
```bash
# Vérifier dans Chrome Desktop
curl -I https://votre-url.vercel.app/manifest.json
curl -I https://votre-url.vercel.app/icons/icon-192x192.png
```

### ❌ Wake word ne fonctionne pas

**Vérifier:**
1. Permission micro accordée
2. Modèles Porcupine chargent (Network tab)
3. Clé Picovoice valide
4. Console pas d'erreurs

**Solution:**
```javascript
// Console Chrome Desktop (connecté au S23)
// chrome://inspect → Inspect
console.log('Test permissions:', await navigator.permissions.query({name: 'microphone'}));
```

### ❌ Vibration ne fonctionne pas

**Normal sur:**
- Chrome Desktop
- Simulateur

**Doit fonctionner sur:**
- Samsung S23 réel uniquement

### ❌ App lente

**Vérifier:**
1. Bundle size (< 500KB)
2. Images optimisées
3. Lazy loading actif

**Solution:**
```bash
# Analyser bundle
npm run build
# Vérifier taille dans output
```

---

## 📊 Métriques à surveiller

### Performance (Lighthouse)

```bash
# Depuis Chrome Desktop
# https://votre-url.vercel.app
# DevTools → Lighthouse → Analyze

Cibles:
- Performance: > 90
- Accessibility: > 90
- Best Practices: > 90
- SEO: > 90
- PWA: > 90
```

### Vercel Analytics

```
Dashboard Vercel → Projet → Analytics
- Visites
- Temps chargement
- Erreurs
- Géolocalisation
```

---

## ✅ Validation finale

Une fois TOUS les tests passés:

```
✅ Icônes PNG générées
✅ Variables d'env configurées
✅ Modèles Porcupine présents
✅ Build production OK
✅ Déployé sur Vercel
✅ Installation PWA S23 OK
✅ Permissions accordées
✅ Wake word fonctionne (app ouverte)
✅ Wake word fonctionne (arrière-plan limité)
✅ Commande vocale → GPT-5 OK
✅ TTS confirmations audibles
✅ Vibration native fonctionne
✅ Mode offline OK
✅ Performance acceptable
```

**Status:** 🎉 PRODUCTION READY

---

## 📞 Support

Si problème persistant:

1. **Console Chrome:** `chrome://inspect` (USB debugging)
2. **Logs Vercel:** `vercel logs --follow`
3. **Documentation:** Lire `PWA_MOBILE_README.md`
4. **GitHub Issues:** Créer ticket avec logs

---

**Dernière mise à jour:** 5 novembre 2025  
**Version checklist:** 1.0.0
