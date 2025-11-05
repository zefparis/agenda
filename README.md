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
- **Actions externes** : Ouvrez N'IMPORTE QUEL site web depuis le chat

### 🌐 Actions Externes Universelles
- **30+ sites pré-configurés** : Facebook, Netflix, Amazon, Gmail, YouTube, etc.
- **Génération automatique** : L'IA crée des liens pour TOUTE demande web
- **Catégories supportées** :
  - 📱 Réseaux sociaux (Facebook, Instagram, Twitter, LinkedIn, TikTok, Reddit)
  - 📺 Streaming (Netflix, Disney+, Prime Video, YouTube, Twitch)
  - 🛒 E-commerce (Amazon, eBay, AliExpress, Cdiscount, Fnac)
  - 📧 Email (Gmail, Outlook, Yahoo)
  - 📰 Actualités (Le Monde, Le Figaro, Libération, France Info)
  - 📍 Maps & Navigation (Google Maps avec destinations)
  - ✈️ Voyage (Google Flights, Hotels)
  - 📚 Recherche (Google, Wikipédia)
- **Liens cliquables** : Tous les URLs transformés en boutons
- **Mobile-friendly** : Navigation native sans blocage popup

### 🎙️ Interaction Vocale
- **Wake Word "Hello Benji"** : Activation vocale mains-libres (Porcupine)
- **Détection locale** : 100% offline, aucune donnée envoyée au cloud
- **Commande vocale** : Dictez vos événements (Speech-to-Text)
- **Lecture audio** : Écoutez les réponses de l'assistant (Text-to-Speech)
- **Support français** : Reconnaissance vocale en français
- **Animation visuelle** : Indicateur d'écoute avec halos pulsants

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

### 🎤 Wake Word "Hello Benji"

Pour activer la détection vocale mains-libres :
- **[WAKE_WORD_README.md](./WAKE_WORD_README.md)** : Vue d'ensemble et quick start
- **[NEXT_STEPS_WAKE_WORD.md](./NEXT_STEPS_WAKE_WORD.md)** : Guide pas-à-pas (5 min)
- **[WAKE_WORD_SETUP.md](./WAKE_WORD_SETUP.md)** : Configuration détaillée
- **[IMPLEMENTATION_WAKE_WORD.md](./IMPLEMENTATION_WAKE_WORD.md)** : Documentation technique

**Setup rapide** :
```bash
# 1. Configurer les dossiers
npm run setup:wakeword

# 2. Obtenir une clé gratuite sur console.picovoice.ai
# 3. Créer le modèle "Hello Benji" (Français, Web)
# 4. Ajouter dans .env.local :
NEXT_PUBLIC_PICOVOICE_ACCESS_KEY=votre_clé

# 5. Placer le modèle téléchargé :
public/models/hello_benji.ppn
```

Dites **"Hello Benji"** → L'assistant s'active ! 🎉

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

**Gestion d'agenda :**
```
Qu'ai-je aujourd'hui ?
Montre-moi mes tâches en attente
Crée une réunion d'équipe lundi prochain à 10h
Quel est mon prochain événement ?
Supprime le rdv de demain
```

**Ouverture de sites web (actions externes) :**
```
📱 Réseaux sociaux :
"ouvre Facebook" → Bouton Facebook
"va sur Instagram" → Bouton Instagram  
"lance Twitter" → Bouton Twitter
"ouvre LinkedIn" → Bouton LinkedIn

📺 Streaming :
"ouvre Netflix" → Bouton Netflix
"va sur Disney+" → Bouton Disney+
"lance Prime Video" → Bouton Prime Video

🛒 Shopping :
"ouvre Amazon" → Bouton Amazon
"va sur eBay" → Bouton eBay
"cherche sur Cdiscount" → Bouton Cdiscount

📧 Email :
"ouvre Gmail" → Bouton Gmail
"va sur Outlook" → Bouton Outlook

📍 Navigation :
"ouvre Maps vers Paris" → Bouton Google Maps
"itinéraire vers Lyon" → Bouton Google Maps

🔍 Recherche :
"cherche recette carbonara" → Bouton Google Search
"recherche vidéo yoga" → Bouton YouTube
"c'est quoi Einstein" → Bouton Wikipédia

✈️ Voyage :
"recherche vol Paris-Tokyo" → Bouton Google Flights
"trouve hôtel à Rome" → Bouton Google Hotels

🎵 Musique :
"mets de la musique" → Bouton Amazon Music
"ouvre Spotify" → Bouton Spotify

✨ Et N'IMPORTE QUEL autre site !
"ouvre [nom du site]" → L'IA génère le lien automatiquement
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
│   ├── actionHandler.ts  # Générateurs d'URLs externes
│   ├── externalActions.ts # Parser d'actions externes
│   ├── linkify.ts        # Transformation URLs en liens
│   └── utils.ts
├── hooks/                # Custom hooks
│   └── useAuth.ts
└── types/                # Types TypeScript
    ├── index.ts
    └── actions.ts        # Types pour actions externes
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

## 🎯 Fonctionnalités Uniques

### 🌐 Système d'Actions Externes Universel

L'assistant peut **ouvrir N'IMPORTE QUEL site web** depuis le chat :

1. **Détection intelligente** : L'IA comprend "ouvre [site]" automatiquement
2. **Génération de lien** : Crée l'URL appropriée
3. **Bouton cliquable** : Affiche un bouton sous le message
4. **Navigation native** : Utilise `<a href>` pour éviter les blocages mobile

**Architecture :**
```
User: "ouvre Facebook"
  ↓
GPT: Génère {"action":"open_link","url":"https://facebook.com"}
  ↓
externalActions.ts: Parse le JSON
  ↓
actionHandler.ts: Valide et génère l'URL
  ↓
ActionButton.tsx: Affiche le bouton cliquable
  ↓
Navigateur: Ouvre le site dans nouvel onglet
```

**Sites supportés nativement :**
- 📱 **30+ réseaux sociaux** (Facebook, Instagram, Twitter, LinkedIn, TikTok...)
- 📺 **Services streaming** (Netflix, Disney+, YouTube, Twitch...)
- 🛒 **E-commerce** (Amazon, eBay, Cdiscount, Fnac...)
- 📧 **Webmail** (Gmail, Outlook, Yahoo...)
- 📰 **Médias** (Le Monde, Le Figaro, Libération...)
- ✨ **+ toute URL personnalisée !**

Voir [ACTIONS_EXTERNES.md](./ACTIONS_EXTERNES.md) pour la doc complète.

## 🐛 Problèmes connus

- La reconnaissance vocale nécessite HTTPS (fonctionne en local et sur Vercel)
- Le TTS (lecture audio) nécessite une interaction utilisateur préalable
- Les notifications nécessitent l'autorisation du navigateur

## 🎯 Roadmap

- [x] ✅ Actions externes universelles (FAIT !)
- [x] ✅ Auto-linkify des URLs (FAIT !)
- [x] ✅ Support mobile sans blocage popup (FAIT !)
- [ ] Récurrence d'événements
- [ ] Partage d'agenda
- [ ] Export iCal/Google Calendar
- [ ] Application mobile (React Native)
- [ ] Intégration calendriers externes
- [ ] Support multi-langues
- [ ] Deeplinks vers apps natives mobile
- [ ] Historique des actions externes
- [ ] Favoris de liens rapides

---

**Développé avec ❤️ et ☕**

[GitHub](https://github.com/zefparis/agenda) • [Demo Live](https://agenda-bay-rho.vercel.app)
