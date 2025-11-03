# 🚀 Setup Guide - Mon Agenda Intelligent

## Prérequis

- Node.js 18+
- Un compte Supabase (gratuit)
- Une clé API OpenAI

---

## 📦 Installation

```bash
npm install
```

---

## 🔧 Configuration

### 1. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```bash
cp env.example .env.local
```

Remplissez les variables :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=sk-...
```

### 2. Configuration Supabase

#### A. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Récupérez l'URL et les clés API dans **Settings > API**

#### B. Exécuter les migrations SQL

1. Dans le dashboard Supabase, allez dans **SQL Editor**
2. Copiez le contenu de `supabase/migrations/001_initial_schema.sql`
3. Exécutez la requête

Ou via la CLI Supabase :

```bash
npx supabase init
npx supabase link --project-ref your-project-ref
npx supabase db push
```

#### C. Activer l'authentification

1. Dans **Authentication > Providers**
2. Activez **Email** (ou les providers de votre choix)
3. Configurez l'URL de redirection : `http://localhost:3000`

### 3. Clé OpenAI

1. Créez un compte sur [platform.openai.com](https://platform.openai.com)
2. Générez une clé API dans **API Keys**
3. Ajoutez-la à `.env.local`

---

## 🏃 Lancer le projet

### Mode développement

```bash
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

### Mode production

```bash
npm run build
npm start
```

---

## 📁 Structure du projet

```
src/
├── app/
│   ├── api/              # API Routes
│   │   ├── parse/        # Parsing OpenAI
│   │   └── events/       # CRUD Events
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── CommandInput.tsx  # Input commande NL
│   ├── EventCard.tsx     # Card événement
│   ├── EventList.tsx     # Liste événements
│   └── Dashboard.tsx     # Dashboard principal
├── lib/
│   ├── openai/
│   │   ├── client.ts     # Client OpenAI
│   │   └── parser.ts     # Parser NL
│   ├── supabase/
│   │   ├── client.ts     # Client Supabase
│   │   ├── server.ts     # Admin Supabase
│   │   └── queries.ts    # Queries DB
│   └── utils.ts          # Utilitaires
└── types/
    └── index.ts          # Types TypeScript
```

---

## 🎯 Utilisation

### Exemples de commandes

```
planifie une réunion demain à 14h
ajoute acheter du pain à ma liste
rappelle-moi d'appeler Marie dans 2 heures
crée un événement urgent pour vendredi
```

### Fonctionnalités

- ✅ **Parsing NL** : Compréhension langage naturel
- ✅ **CRUD complet** : Créer, lire, modifier, supprimer
- ✅ **Types d'événements** : Events, tâches, rappels
- ✅ **Priorités** : Basse, moyenne, haute
- ✅ **Interface moderne** : Responsive, animations
- ✅ **Authentification** : Via Supabase Auth

---

## 🔐 Sécurité

- Les clés API ne doivent **jamais** être commitées
- Row Level Security (RLS) activé sur Supabase
- Authentification requise pour toutes les opérations

---

## 🐛 Debugging

### Problème de connexion Supabase

```bash
# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_SUPABASE_URL
```

### Problème OpenAI API

- Vérifiez que votre clé est valide
- Vérifiez que vous avez des crédits
- Regardez les logs dans `/api/parse`

---

## 📝 Développement

### Ajouter un nouveau type d'événement

1. Modifier `src/types/index.ts`
2. Mettre à jour le schema SQL
3. Adapter le parser OpenAI

### Personnaliser l'UI

- Composants dans `src/components/`
- Styles Tailwind inline
- Animations Framer Motion

---

## 🚢 Déploiement

### Vercel (recommandé)

```bash
vercel
```

Variables d'environnement à configurer :
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

---

## 📚 Stack

- **Next.js 16** (App Router)
- **React 19**
- **TypeScript 5**
- **Tailwind CSS v4**
- **Supabase** (PostgreSQL + Auth)
- **OpenAI API** (gpt-4o-mini)
- **Framer Motion**
- **date-fns**
- **zod**

---

## 🤝 Contribution

Pour contribuer au projet :

1. Fork le repo
2. Créer une branche feature
3. Commit les changements
4. Ouvrir une PR

---

Fait avec ❤️ par benji
