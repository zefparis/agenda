# 📅 Mon Agenda Intelligent

Agenda personnel intelligent avec assistant IA conversationnel, compréhension du langage naturel et commandes vocales pour gérer vos tâches, événements et rappels.

![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind](https://img.shields.io/badge/Tailwind-4-38bdf8)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black)

🔗 **Demo Live** : [agenda-bay-rho.vercel.app](https://agenda-bay-rho.vercel.app)

## ✨ Fonctionnalités

### 🤖 Intelligence Artificielle
- **Chat Assistant** : Conversez avec l'IA pour gérer votre agenda
- **Streaming GPT-4o-mini** : Réponses en temps réel
- **Compréhension NL** : Parsez vos commandes en langage naturel
- **Actions contextuelles** : L'IA comprend vos intentions

### 🎙️ Interaction Vocale
- **Commande vocale** : Dictez vos événements (Speech-to-Text)
- **Lecture audio** : Écoutez les réponses de l'assistant (Text-to-Speech)
- **Support français** : Reconnaissance vocale en français

### 📅 Gestion d'Agenda
- **3 types d'items** : Événements, tâches, rappels
- **CRUD complet** : Créez, modifiez, supprimez, complétez
- **Priorités** : Basse, moyenne, haute
- **Filtres avancés** : Par type, priorité, statut
- **Statistiques** : Vue d'ensemble de votre planning

### 🎨 Interface Utilisateur
- **Design moderne** : UI élégante avec Tailwind CSS v4
- **Mode sombre/clair** : Thème adaptatif avec détection système
- **Responsive** : Optimisé mobile, tablette, desktop
- **Animations fluides** : Transitions Framer Motion
- **Notifications** : Alertes navigateur pour les événements

### 🔐 Sécurité & Données
- **Sans authentification** : Mode simplifié en mémoire
- **Support Supabase** : Migration facile vers PostgreSQL
- **Persistence locale** : Vos données restent privées

## 🚀 Quick Start

```bash
# Installation
npm install

# Configuration
cp env.exemple .env.local
# Ajoutez votre clé OpenAI (requis)
# Supabase optionnel (mode mémoire par défaut)

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

### Via l'input texte ou vocal 🎤
```
Rdv dentiste demain à 14h
Ajoute acheter du pain comme tâche prioritaire
Rappelle-moi d'appeler Marie dans 2 heures
Crée un événement urgent pour vendredi
Marque "acheter du pain" comme terminé
```

### Via le Chat Assistant 💬
```
Qu'ai-je aujourd'hui ?
Montre-moi mes tâches en attente
Crée une réunion d'équipe lundi prochain à 10h
Quel est mon prochain événement ?
Supprime le rdv de demain
```

### Commandes vocales 🎙️
Cliquez sur le micro et parlez :
- "Réunion équipe jeudi 15h"
- "Tâche urgent finir le rapport"
- "Rappel appeler le médecin"

Cliquez sur "Écouter" pour entendre les réponses de l'IA ! 🔊

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
│   ├── Dashboard.tsx      # Container principal
│   ├── ChatAssistant.tsx  # Chat IA avec TTS
│   ├── CommandInput.tsx   # Input avec vocal
│   ├── VoiceInput.tsx     # Speech-to-Text
│   ├── DarkModeToggle.tsx # Thème clair/sombre
│   ├── EventCard.tsx      # Carte événement
│   ├── EventList.tsx      # Liste événements
│   ├── Calendar.tsx       # Vue calendrier
│   ├── TabSwitcher.tsx    # Navigation Agenda/Chat
│   └── NotificationBanner.tsx # Demande permissions
├── lib/                   # Logique métier
│   ├── openai/           # Client & Parser OpenAI
│   ├── supabase/         # Client & Queries Supabase
│   └── utils.ts
├── hooks/                # Custom hooks
│   └── useAuth.ts
└── types/                # Types TypeScript
    └── index.ts
```

## 🚀 Déploiement

### Vercel (Recommandé)

```bash
# Via CLI Vercel
npm i -g vercel
vercel --prod

# Ou connectez votre repo GitHub à Vercel
# Le déploiement est automatique à chaque push
```

**Variables d'environnement sur Vercel** :
```env
NEXT_PUBLIC_SUPABASE_URL=votre_url (optionnel)
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_key (optionnel)
OPENAI_API_KEY=votre_key_openai (requis)
```

## 🔒 Sécurité

- Clés API sécurisées dans variables d'environnement
- Mode mémoire par défaut (données privées locales)
- Support RLS Supabase si activé
- Validation stricte des inputs avec Zod
- Rate limiting sur API routes

## 🤝 Contribution

Les contributions sont les bienvenues !

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 License

MIT License - voir le fichier LICENSE

## 🐛 Problèmes connus

- La reconnaissance vocale nécessite HTTPS (fonctionne en local et sur Vercel)
- Le TTS (lecture audio) nécessite une interaction utilisateur préalable
- Les notifications nécessitent l'autorisation du navigateur

## 🎯 Roadmap

- [ ] Récurrence d'événements
- [ ] Partage d'agenda
- [ ] Export iCal/Google Calendar
- [ ] Application mobile (React Native)
- [ ] Intégration calendriers externes
- [ ] Support multi-langues

---

**Développé avec ❤️ et ☕**

[GitHub](https://github.com/zefparis/agenda) • [Demo Live](https://agenda-bay-rho.vercel.app)
