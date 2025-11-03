# 🚀 Quick Start - Sans Authentification

## 1. Configuration Supabase

### Exécuter les migrations SQL

Allez dans votre dashboard Supabase : https://app.supabase.com

1. **SQL Editor** → Nouvelle requête
2. Copiez et exécutez le contenu de `supabase/migrations/001_initial_schema.sql`
3. Puis exécutez le contenu de `supabase/migrations/002_remove_auth.sql`

Ou en une seule fois :

```sql
-- 1. Initial schema
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('event', 'task', 'reminder')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ,
  all_day BOOLEAN DEFAULT FALSE,
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
  location TEXT,
  tags TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- 2. Policies sans auth
CREATE POLICY "Allow all select on events"
  ON events FOR SELECT
  USING (true);

CREATE POLICY "Allow all insert on events"
  ON events FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow all update on events"
  ON events FOR UPDATE
  USING (true);

CREATE POLICY "Allow all delete on events"
  ON events FOR DELETE
  USING (true);
```

## 2. Lancer l'application

```bash
npm run dev
```

Ouvrez http://localhost:3000

## 3. Tester

Essayez ces commandes :

- "Ajoute réunion demain à 14h"
- "Crée une tâche acheter du pain"
- "Rappelle-moi d'appeler Marie"

## ✅ Checklist

- [x] Clés Supabase dans `.env.local`
- [x] Clé OpenAI dans `.env.local`
- [ ] Migrations SQL exécutées sur Supabase
- [ ] Serveur Next.js lancé
- [ ] Calendrier affiché avec événements

## 🔧 Debugging

Si vous voyez "Failed to fetch events" :
- Vérifiez que les migrations SQL sont exécutées
- Vérifiez les credentials Supabase
- Regardez la console du navigateur pour les erreurs

Si le parsing ne fonctionne pas :
- Le fallback simple parser sera utilisé automatiquement
- Pour utiliser OpenAI, vérifiez votre clé API et vos crédits
