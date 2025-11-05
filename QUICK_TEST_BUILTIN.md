# 🚀 Test rapide avec mot-clé intégré

Si vous voulez tester **immédiatement** sans créer de modèle personnalisé, vous pouvez utiliser un mot-clé Porcupine intégré.

## ⚡ Option rapide : "Porcupine"

### Modifier temporairement la page de test

Dans `src/app/testWake/page.tsx`, remplacer :

```typescript
// ❌ Ancien (nécessite modèle personnalisé)
{
  label: "hello_benji",
  publicPath: "/models/hello_benji.ppn",
  customWritePath: "/models/hello_benji.ppn",
  sensitivity: 0.5
}
```

Par :

```typescript
// ✅ Nouveau (mot-clé intégré)
{
  builtin: "Porcupine",
  sensitivity: 0.5
}
```

### Tester avec "Porcupine"

Dire : **"Porcupine"** (prononcez "por-kiu-pain")

### Autres mots-clés intégrés disponibles

- `Alexa`
- `Jarvis`
- `Computer`
- `Hey Google`
- `Hey Siri`
- `Ok Google`
- `Porcupine`
- `Americano`
- `Blueberry`
- `Bumblebee`
- `Grapefruit`
- `Grasshopper`
- `Picovoice`
- `Terminator`

## ⚠️ Important

Cette méthode est **uniquement pour tester** que Porcupine fonctionne.

Pour le vrai mot-clé "Hello Benji", vous devez :
1. Créer le modèle personnalisé sur Picovoice Console
2. Le télécharger
3. Le placer dans `public/models/hello_benji.ppn`

## 🔄 Revenir au modèle personnalisé

Après avoir validé que Porcupine fonctionne, remettre le code original avec le modèle personnalisé.

---

**Utilité** : Test rapide de l'infrastructure Porcupine sans attendre la création du modèle.
