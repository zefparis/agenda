# 🚀 Déploiement Vercel - Wake Word

## ✅ Code poussé vers GitHub

```
Commit : 0329605
Message : Page de test wake word + chargement modèle en base64
```

Vercel déploie automatiquement maintenant.

---

## 🔍 Vérifier le déploiement

### 1. Dashboard Vercel

Aller sur : https://vercel.com/dashboard

Vous devriez voir :
- **Building...** (en cours)
- Puis **Ready** (terminé)

### 2. URL de production

Une fois déployé, votre app sera accessible sur :
```
https://votre-projet.vercel.app
```

---

## ⚙️ Configuration Vercel (Important !)

### Variables d'environnement

Vercel a besoin de la clé Picovoice en production.

**Étapes** :

1. Aller sur : https://vercel.com/dashboard
2. Sélectionner votre projet
3. **Settings** > **Environment Variables**
4. Ajouter :
   ```
   Name:  NEXT_PUBLIC_PICOVOICE_ACCESS_KEY
   Value: QWcv7vbIxm6T8Xgeveq6tonPIyfhRtNs+8eokGzYTdQaf1FEh/eTqA==
   ```
5. **Scope** : Production, Preview, Development
6. Cliquer **Save**

### Redéployer après ajout de la variable

Si vous ajoutez la variable après le premier déploiement :
1. **Deployments** > Latest deployment
2. Clic sur **⋯** (trois points)
3. **Redeploy**

---

## 🧪 Tester en production

### URL de test

```
https://votre-projet.vercel.app/testWake
```

### Étapes

1. Ouvrir l'URL
2. Autoriser le microphone
3. Attendre "🎧 En écoute"
4. Dire **"Hello Benji"**
5. Observer l'animation ✅

---

## 📊 Fichiers déployés

### Page de test
```
/testWake → src/app/testWake/page.tsx
```

### Modèle
```
/models/hello_benji.ppn → public/models/hello_benji.ppn (3 KB)
```

### Code wake word
- `src/lib/voiceWake.ts`
- `src/hooks/useWakeWord.ts`
- `src/components/WakeIndicator.tsx`

---

## 🔍 Logs de déploiement

Si le déploiement échoue :

1. **Vercel Dashboard** > Votre projet
2. **Deployments** > Latest
3. Cliquer sur le déploiement
4. **Build Logs** pour voir les erreurs

### Erreurs possibles

**❌ Module not found**
→ Vérifier que `@picovoice/porcupine-web` est dans `package.json`

**❌ Build failed**
→ Vérifier les logs de compilation TypeScript

**❌ Modèle introuvable**
→ Vérifier que `public/models/hello_benji.ppn` existe dans le repo

---

## ✅ Checklist déploiement

- [x] Code pushé vers GitHub
- [ ] Vercel déploie (vérifier dashboard)
- [ ] Variable `NEXT_PUBLIC_PICOVOICE_ACCESS_KEY` ajoutée
- [ ] Déploiement terminé avec succès
- [ ] Test sur `/testWake` en production
- [ ] Wake word "Hello Benji" fonctionne

---

## 🌐 URLs utiles

- **Vercel Dashboard** : https://vercel.com/dashboard
- **GitHub Repo** : https://github.com/zefparis/agenda
- **App Production** : https://[votre-projet].vercel.app
- **Page Test** : https://[votre-projet].vercel.app/testWake

---

## 💡 Avantages production vs local

### ✅ Production (Vercel)
- Pas de problème de cache navigateur
- HTTPS par défaut (requis pour micro)
- CDN global
- URL partageable

### ⚠️ Local (localhost)
- Cache navigateur agressif
- HTTP (micro peut être bloqué sur certains navigateurs)
- Nécessite serveur dev actif

---

## 🎯 Prochaines étapes

1. **Attendre** que Vercel finisse le déploiement (2-3 min)
2. **Vérifier** sur le dashboard que c'est "Ready"
3. **Ajouter** la variable d'environnement si pas fait
4. **Tester** sur `https://votre-projet.vercel.app/testWake`
5. **Dire** "Hello Benji"
6. **Valider** que ça fonctionne en prod ! 🎉

---

**Vercel est en train de déployer...**  
**Vérifiez le dashboard : https://vercel.com/dashboard**

🚀 **Déploiement en cours !**
