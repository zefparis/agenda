# 🐛 Journal des Erreurs et Solutions - Porcupine

## Erreur #1: `The provided model doesn't contain a valid publicPath or base64 value`

### ❌ Symptôme
```
Error: The provided model doesn't contain a valid publicPath or base64 value
```

### 🔍 Cause
Le 4ème paramètre de `PorcupineWorker.create()` était incorrect. On passait `{}` (options) au lieu du modèle Porcupine principal (`.pv`).

### ✅ Solution
1. Télécharger le modèle Porcupine principal
2. Passer le modèle en 4ème paramètre (pas en 5ème)

```typescript
// ❌ AVANT
porcupineInstance = await PorcupineWorker.create(
  accessKey,
  keywords,
  callback,
  {}  // ❌ Ce sont les options!
);

// ✅ APRÈS
porcupineInstance = await PorcupineWorker.create(
  accessKey,
  keywords,
  callback,
  { publicPath: "/models/porcupine_params_fr.pv" },  // ✅ Modèle principal
  {}  // Options
);
```

---

## Erreur #2: `Keyword file (.ppn) and model file (.pv) should belong to the same language`

### ❌ Symptôme
```
Initialization failed: 
  [0] Keyword file (.ppn) and model file (.pv) should belong to the same language. 
  File belongs to `fr` while model file (.pv) belongs to `en`.
```

### 🔍 Cause
Le keyword `hello_benji.ppn` a été créé en **français** sur Picovoice Console, mais on utilisait le modèle **anglais** (`porcupine_params.pv`).

### ✅ Solution
Utiliser le modèle Porcupine correspondant à la langue du keyword:

```bash
# Télécharger le modèle FRANÇAIS
curl -o public/models/porcupine_params_fr.pv \
  https://raw.githubusercontent.com/Picovoice/porcupine/master/lib/common/porcupine_params_fr.pv
```

```typescript
// ✅ Code corrigé
porcupineInstance = await PorcupineWorker.create(
  accessKey,
  keywords,
  callback,
  { publicPath: "/models/porcupine_params_fr.pv" },  // ✅ Français!
  {}
);
```

### 📋 Correspondance des langues

| Langue Keyword | Modèle à utiliser |
|----------------|-------------------|
| Français (`fr`) | `porcupine_params_fr.pv` |
| Anglais (`en`) | `porcupine_params.pv` |
| Espagnol (`es`) | `porcupine_params_es.pv` |
| Allemand (`de`) | `porcupine_params_de.pv` |
| Italien (`it`) | `porcupine_params_it.pv` |

[Liste complète des modèles](https://github.com/Picovoice/porcupine/tree/master/lib/common)

---

## 📚 Leçons apprises

### 1. Signature correcte de `PorcupineWorker.create()`
```typescript
static async create(
  accessKey: string,           // 1. Clé API Picovoice
  keywords: PorcupineKeyword[], // 2. Keywords (built-in ou custom)
  callback: DetectionCallback,  // 3. Callback de détection
  model: PorcupineModel,        // 4. MODÈLE PRINCIPAL (.pv) ← Important!
  options?: PorcupineOptions    // 5. Options (facultatif)
): Promise<PorcupineWorker>
```

### 2. Porcupine nécessite 2 fichiers
- **Modèle principal** (`.pv`) - Neural network de base (~962KB)
- **Keyword custom** (`.ppn`) - Pattern du wake word (~3KB)

### 3. La langue doit correspondre
Le keyword `.ppn` et le modèle `.pv` doivent être créés/téléchargés pour la **même langue**.

### 4. Conversion base64 robuste
Pour les données binaires, utiliser la conversion par chunks:
```typescript
const bytes = new Uint8Array(arrayBuffer);
let binary = '';
const chunkSize = 0x8000; // 32KB chunks
for (let i = 0; i < bytes.length; i += chunkSize) {
  const chunk = bytes.subarray(i, Math.min(i + chunkSize, bytes.length));
  binary += String.fromCharCode.apply(null, Array.from(chunk));
}
const base64 = btoa(binary);
```

---

## ✅ État final

**Fichiers requis:**
```
public/models/
├── hello_benji.ppn           (3 KB)   - Keyword français
└── porcupine_params_fr.pv    (962 KB) - Modèle Porcupine français
```

**Code fonctionnel:**
- ✅ `/src/app/testWake/page.tsx` - Page de test
- ✅ `/src/lib/voiceWake.ts` - Bibliothèque wake word
- ✅ `/src/app/testDiag/page.tsx` - Page de diagnostic

**Résultat:**
- ✅ Wake word "Hello Benji" détecté correctement
- ✅ Pas d'erreur de modèle ou de langue
- ✅ Logs console propres

---

**Date**: 5 novembre 2025  
**Status**: ✅ Résolu
