# 🧹 Nettoyage cache complet

## Problème

L'ancienne version du code (avec `publicPath`) est encore en cache, même après modification.

## ✅ Solution complète

### 1. Arrêter le serveur

Dans le terminal où tourne `npm run dev` :
```
Ctrl + C
```

### 2. Nettoyer le cache Next.js

```bash
rm -rf .next
```

### 3. Redémarrer le serveur

```bash
npm run dev
```

### 4. Vider le cache navigateur

**Chrome/Edge** :
1. F12 (ouvrir DevTools)
2. Clic droit sur le bouton refresh 🔄
3. Choisir "Vider le cache et effectuer une actualisation forcée"

**OU** utiliser le raccourci : `Ctrl + Shift + R`

**Firefox** :
1. F12 (ouvrir DevTools)
2. Réseau > Clic droit > "Vider le cache"
3. `Ctrl + F5` pour recharger

**OU** utiliser Navigation privée : `Ctrl + Shift + N/P`

### 5. Vérifier dans DevTools

**Onglet Network/Réseau** :
- Chercher `/models/hello_benji.ppn`
- Doit retourner **200 OK**
- Type : `application/octet-stream`
- Taille : ~3 KB

**Onglet Console** :
- Doit afficher : `🔧 Chargement du modèle…`
- Puis : `✅ Porcupine initialisé avec succès`

## 🔍 Test rapide du code

Pour vérifier que le nouveau code est bien chargé, cherchez dans la console :

```javascript
// ✅ Nouveau code (base64)
// Vous devriez voir un fetch vers /models/hello_benji.ppn

// ❌ Ancien code (publicPath)  
// Erreur "doesn't contain a valid publicPath"
```

## 💡 Alternative : Utiliser un autre navigateur

Si le cache persiste :
1. Ouvrir un navigateur différent (Firefox si vous étiez sur Chrome, etc.)
2. Aller sur http://localhost:3000/testWake
3. Tester

## 🎯 Commandes complètes

```bash
# Dans le terminal
cd /home/iasolution/Applications/mon-agenda-intelligent
rm -rf .next
npm run dev

# Dans le navigateur
# Ouvrir : http://localhost:3000/testWake
# Hard refresh : Ctrl+Shift+R
# F12 > Console
```

---

**Après ces étapes, l'erreur devrait disparaître !**
