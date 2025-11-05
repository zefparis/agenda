# ❌ Erreur 404 : /models/hello_benji.ppn

## 🎯 Vous êtes ici

Vous avez cette erreur sur `/testWake` :
```
404 Not Found: /models/hello_benji.ppn
```

C'est **normal** ! Le fichier n'existe pas encore.

---

## ✅ DEUX OPTIONS pour résoudre

### Option A : Test rapide (2 min) - MOT-CLÉ INTÉGRÉ

Pour tester **immédiatement** sans créer de modèle :

```bash
# 1. Renommer les fichiers
cd src/app/testWake/
mv page.tsx page-custom.tsx
mv page-builtin.tsx.example page.tsx

# 2. Redémarrer
npm run dev

# 3. Tester sur /testWake
# Dire : "Porcupine" (prononcez "por-kiu-pain")
```

**Avantage** : Test immédiat de l'infrastructure  
**Inconvénient** : Pas le vrai mot-clé "Hello Benji"

---

### Option B : Configuration complète (5 min) - "HELLO BENJI"

Pour avoir le vrai mot-clé personnalisé :

#### 1. Créer un compte Picovoice

https://console.picovoice.ai/

#### 2. Créer le modèle "Hello Benji"

https://console.picovoice.ai/ppn

- **Wake Phrase** : `Hello Benji`
- **Language** : `French`
- **Platform** : `Web (WASM)`
- Cliquer **"Train"** (2-3 min)
- **Télécharger** le fichier `.ppn`

#### 3. Configurer localement

```bash
# Créer le dossier
mkdir -p public/models

# Copier le modèle téléchargé
cp ~/Downloads/hello_benji*.ppn public/models/hello_benji.ppn

# Ajouter la clé API dans .env.local
echo "NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=votre_clé_ici" >> .env.local

# Vérifier
ls public/models/hello_benji.ppn
cat .env.local | grep PICOVOICE
```

#### 4. Redémarrer et tester

```bash
npm run dev
# Ouvrir http://localhost:3000/testWake
# Dire "Hello Benji"
```

---

## 🤔 Quelle option choisir ?

### Si vous voulez tester MAINTENANT
→ **Option A** (mot-clé intégré)

### Si vous voulez le vrai "Hello Benji"
→ **Option B** (modèle personnalisé)

### Recommandation
1. Commencer par **Option A** pour valider que tout fonctionne
2. Puis passer à **Option B** pour avoir "Hello Benji"

---

## 📋 Checklist Option A (rapide)

```bash
- [ ] cd src/app/testWake/
- [ ] mv page.tsx page-custom.tsx
- [ ] mv page-builtin.tsx.example page.tsx
- [ ] npm run dev
- [ ] Ouvrir /testWake
- [ ] Dire "Porcupine"
- [ ] ✅ Validation que Porcupine fonctionne
```

## 📋 Checklist Option B (complète)

```bash
- [ ] Compte Picovoice créé
- [ ] Clé API copiée
- [ ] Modèle "Hello Benji" créé
- [ ] Fichier .ppn téléchargé
- [ ] cp ~/Downloads/hello*.ppn public/models/hello_benji.ppn
- [ ] echo "NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=..." >> .env.local
- [ ] npm run dev
- [ ] Ouvrir /testWake
- [ ] Dire "Hello Benji"
- [ ] ✅ Fonctionnel !
```

---

## 🔄 Basculer entre les versions

### Passer à la version intégrée (test rapide)
```bash
cd src/app/testWake/
mv page.tsx page-custom.tsx
mv page-builtin.tsx.example page.tsx
```

### Revenir à la version "Hello Benji"
```bash
cd src/app/testWake/
mv page.tsx page-builtin.tsx.example
mv page-custom.tsx page.tsx
```

---

## 💡 Comprendre l'erreur

```
404 Not Found: /models/hello_benji.ppn
```

**Pourquoi ?**
- Le fichier `public/models/hello_benji.ppn` n'existe pas
- Il doit être créé manuellement sur Picovoice Console
- Puis téléchargé et placé dans le projet

**Pas un bug** : C'est la configuration attendue

---

## 🎯 Résumé visuel

```
┌─────────────────────────────────────────┐
│  OPTION A : Test rapide                 │
├─────────────────────────────────────────┤
│  ✅ Immédiat (2 min)                    │
│  ✅ Mot-clé : "Porcupine"               │
│  ⚠️  Pas "Hello Benji"                  │
│                                         │
│  Usage : Valider l'infrastructure       │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  OPTION B : Configuration complète      │
├─────────────────────────────────────────┤
│  ⏱️  Setup 5 min                        │
│  ✅ Mot-clé : "Hello Benji"             │
│  ✅ Modèle personnalisé                 │
│                                         │
│  Usage : Production                     │
└─────────────────────────────────────────┘
```

---

## 🔗 Liens utiles

- **Option A** : [QUICK_TEST_BUILTIN.md](./QUICK_TEST_BUILTIN.md)
- **Option B** : [NEXT_STEPS_WAKE_WORD.md](./NEXT_STEPS_WAKE_WORD.md)
- **Picovoice Console** : https://console.picovoice.ai/
- **Créer modèle** : https://console.picovoice.ai/ppn

---

**Temps total** :
- Option A : 2 minutes
- Option B : 5 minutes

**Difficulté** :
- Option A : Très facile
- Option B : Facile

🚀 **Choisissez et lancez-vous !**
