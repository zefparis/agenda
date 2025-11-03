-- Migration: Système de mémoire des actions externes
-- Créé: 2025-11-03
-- Description: Table pour stocker l'historique et les favoris des liens ouverts

-- Créer la table external_action_memory
CREATE TABLE IF NOT EXISTS external_action_memory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    url TEXT NOT NULL,
    label TEXT NOT NULL,
    action_type TEXT,
    is_favorite BOOLEAN DEFAULT false,
    used_count INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_external_action_memory_created_at ON external_action_memory(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_external_action_memory_is_favorite ON external_action_memory(is_favorite) WHERE is_favorite = true;
CREATE INDEX IF NOT EXISTS idx_external_action_memory_url ON external_action_memory(url);

-- Fonction pour mettre à jour updated_at automatiquement
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger pour updated_at
DROP TRIGGER IF EXISTS update_external_action_memory_updated_at ON external_action_memory;
CREATE TRIGGER update_external_action_memory_updated_at
    BEFORE UPDATE ON external_action_memory
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Commentaires pour documentation
COMMENT ON TABLE external_action_memory IS 'Stockage de l''historique et favoris des actions externes ouvertes par l''assistant';
COMMENT ON COLUMN external_action_memory.url IS 'URL complète du lien ouvert';
COMMENT ON COLUMN external_action_memory.label IS 'Label affiché (ex: "📍 Ouvrir Maps")';
COMMENT ON COLUMN external_action_memory.action_type IS 'Type d''action (open_map, search_web, etc.)';
COMMENT ON COLUMN external_action_memory.is_favorite IS 'Lien marqué comme favori';
COMMENT ON COLUMN external_action_memory.used_count IS 'Nombre de fois que le lien a été ouvert';
COMMENT ON COLUMN external_action_memory.created_at IS 'Date de première ouverture';
COMMENT ON COLUMN external_action_memory.updated_at IS 'Date de dernière mise à jour';
