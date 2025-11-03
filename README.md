# 📅 Mon Agenda Intelligent

Agenda personnel intelligent capable de comprendre le langage naturel pour gérer vos tâches, événements et rappels.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)

## ✨ Fonctionnalités

- 🗣️ **Compréhension NL** : Parsez vos commandes en langage naturel
- 📝 **Gestion complète** : Créez, modifiez, supprimez vos événements
- 🎯 **3 types d'items** : Événements, tâches, rappels
- ⚡ **Priorités** : Basse, moyenne, haute
- 🎨 **UI moderne** : Interface élégante et responsive
- 🔐 **Authentification** : Sécurisé avec Supabase Auth
- 🤖 **IA intégrée** : Powered by OpenAI GPT-4o-mini

## 🚀 Quick Start

```bash
# Installation
npm install

# Configuration (voir SETUP.md pour les détails)
cp env.example .env.local
# Remplissez vos clés API

# Lancement
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000)

## 📖 Documentation complète

Consultez [SETUP.md](./SETUP.md) pour :
- Configuration détaillée
- Setup Supabase
- Migration de la base de données
- Variables d'environnement
- Déploiement

## 🛠️ Stack Technique

- **Frontend** : Next.js 16, React 19, TypeScript 5
- **Styling** : Tailwind CSS v4, Framer Motion
- **Backend** : Next.js API Routes (Edge Runtime)
- **Database** : Supabase (PostgreSQL)
- **Auth** : Supabase Auth
- **IA** : OpenAI API (gpt-4o-mini)
- **Utils** : date-fns, zod, react-hook-form, lucide-react

## 💬 Exemples de commandes

```
planifie une réunion demain à 14h
ajoute acheter du pain
rappelle-moi d'appeler Marie dans 2 heures
crée un événement urgent pour vendredi
marque la tâche comme terminée
```

## 📁 Structure du projet

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── parse/         # Parsing NL
│   │   └── events/        # CRUD Events
│   ├── layout.tsx
│   └── page.tsx
├── components/            # Composants React
│   ├── Dashboard.tsx
│   ├── CommandInput.tsx
│   ├── EventCard.tsx
│   ├── EventList.tsx
│   └── AuthButton.tsx
├── lib/                   # Logique métier
│   ├── openai/           # Client & Parser OpenAI
│   ├── supabase/         # Client & Queries Supabase
│   └── utils.ts
├── hooks/                # Custom hooks
│   └── useAuth.ts
└── types/                # Types TypeScript
    └── index.ts
```

## 🔒 Sécurité

- Row Level Security (RLS) activé sur Supabase
- Variables d'environnement isolées
- Authentification requise pour toutes les opérations
- Validation stricte des inputs

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

MIT License - voir le fichier LICENSE

---

Développé avec ❤️ par benji
