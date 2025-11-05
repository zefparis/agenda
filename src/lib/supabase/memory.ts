import { supabase } from './client';
import { ExternalActionMemory, ActionType } from '@/types/actions';

const STORAGE_KEY = 'external_actions_memory';
const FAVORITES_KEY = 'external_actions_favorites';

/**
 * Vérifie si Supabase est actif
 */
function isSupabaseActive(): boolean {
  return !!supabase;
}

/**
 * FALLBACK : Sauvegarde dans localStorage
 */
function saveToLocalStorage(action: Omit<ExternalActionMemory, 'id' | 'created_at'>): ExternalActionMemory {
  const stored = localStorage.getItem(STORAGE_KEY);
  const memory: ExternalActionMemory[] = stored ? JSON.parse(stored) : [];
  
  // Vérifier si l'URL existe déjà
  const existing = memory.find(m => m.url === action.url);
  
  if (existing) {
    // Incrémenter le compteur d'utilisation
    existing.used_count = (existing.used_count || 1) + 1;
    existing.created_at = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
    return existing;
  }
  
  // Créer nouvelle entrée
  const newAction: ExternalActionMemory = {
    id: crypto.randomUUID(),
    url: action.url,
    label: action.label,
    action_type: action.action_type,
    is_favorite: action.is_favorite,
    created_at: new Date().toISOString(),
    used_count: 1,
  };
  
  memory.unshift(newAction);
  
  // Garder seulement les 100 derniers
  const trimmed = memory.slice(0, 100);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
  
  return newAction;
}

/**
 * FALLBACK : Récupérer depuis localStorage
 */
function getFromLocalStorage(limit?: number): ExternalActionMemory[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const memory: ExternalActionMemory[] = JSON.parse(stored);
  return limit ? memory.slice(0, limit) : memory;
}

/**
 * FALLBACK : Toggle favori dans localStorage
 */
function toggleFavoriteLocalStorage(id: string): boolean {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return false;
  
  const memory: ExternalActionMemory[] = JSON.parse(stored);
  const action = memory.find(m => m.id === id);
  
  if (!action) return false;
  
  action.is_favorite = !action.is_favorite;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(memory));
  
  return true;
}

/**
 * FALLBACK : Récupérer favoris depuis localStorage
 */
function getFavoritesLocalStorage(): ExternalActionMemory[] {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  
  const memory: ExternalActionMemory[] = JSON.parse(stored);
  return memory.filter(m => m.is_favorite);
}

/**
 * Sauvegarder une action externe
 * @param url - URL ouverte
 * @param label - Label affiché (ex: "📍 Ouvrir Maps")
 * @param actionType - Type d'action
 */
export async function saveExternalAction(
  url: string,
  label: string,
  actionType?: ActionType
): Promise<ExternalActionMemory | null> {
  try {
    // Fallback localStorage si Supabase inactif
    if (!isSupabaseActive()) {
      return saveToLocalStorage({ url, label, action_type: actionType, is_favorite: false });
    }

    // Vérifier si l'action existe déjà
    const { data: existing } = await supabase!
      .from('external_action_memory')
      .select('*')
      .eq('url', url)
      .single();

    if (existing) {
      // Mettre à jour le compteur d'utilisation
      const { data: updated } = await supabase!
        .from('external_action_memory')
        .update({
          used_count: (existing.used_count || 1) + 1,
          created_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();

      return updated as ExternalActionMemory;
    }

    // Créer nouvelle entrée
    const { data, error } = await supabase!
      .from('external_action_memory')
      .insert({
        url,
        label,
        action_type: actionType,
        is_favorite: false,
        used_count: 1,
      })
      .select()
      .single();

    if (error) throw error;

    return data as ExternalActionMemory;
  } catch (error) {
    console.error('Error saving action:', error);
    // Fallback localStorage en cas d'erreur
    return saveToLocalStorage({ url, label, action_type: actionType, is_favorite: false });
  }
}

/**
 * Récupérer l'historique des actions
 * @param limit - Nombre max d'actions à retourner
 */
export async function getActionHistory(limit: number = 50): Promise<ExternalActionMemory[]> {
  try {
    if (!isSupabaseActive()) {
      return getFromLocalStorage(limit);
    }

    const { data, error } = await supabase!
      .from('external_action_memory')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;

    return (data as ExternalActionMemory[]) || [];
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching history:', error);
    return getFromLocalStorage(limit);
  }
}

/**
 * Toggle le statut favori d'une action
 * @param id - ID de l'action
 */
export async function toggleFavorite(id: string): Promise<boolean> {
  try {
    if (!isSupabaseActive()) {
      return toggleFavoriteLocalStorage(id);
    }

    // Récupérer l'état actuel
    const { data: current } = await supabase!
      .from('external_action_memory')
      .select('is_favorite')
      .eq('id', id)
      .single();

    if (!current) return false;

    // Toggle
    const { error } = await supabase!
      .from('external_action_memory')
      .update({ is_favorite: !current.is_favorite })
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return toggleFavoriteLocalStorage(id);
  }
}

/**
 * Récupérer les favoris
 */
export async function getFavorites(): Promise<ExternalActionMemory[]> {
  try {
    if (!isSupabaseActive()) {
      return getFavoritesLocalStorage();
    }

    const { data, error } = await supabase!
      .from('external_action_memory')
      .select('*')
      .eq('is_favorite', true)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data as ExternalActionMemory[]) || [];
  } catch (error) {
    console.error('Error fetching favorites:', error);
    return getFavoritesLocalStorage();
  }
}

/**
 * Supprimer une action de l'historique
 * @param id - ID de l'action
 */
export async function deleteAction(id: string): Promise<boolean> {
  try {
    if (!isSupabaseActive()) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      
      const memory: ExternalActionMemory[] = JSON.parse(stored);
      const filtered = memory.filter(m => m.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return true;
    }

    const { error } = await supabase!
      .from('external_action_memory')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error deleting action:', error);
    return false;
  }
}

/**
 * Nettoyer l'historique (garder seulement les favoris + 20 derniers)
 */
export async function cleanHistory(): Promise<boolean> {
  try {
    if (!isSupabaseActive()) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return false;
      
      const memory: ExternalActionMemory[] = JSON.parse(stored);
      const favorites = memory.filter(m => m.is_favorite);
      const recent = memory.filter(m => !m.is_favorite).slice(0, 20);
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites, ...recent]));
      return true;
    }

    // Garder les favoris + 20 derniers non-favoris
    const { data: toKeep } = await supabase!
      .from('external_action_memory')
      .select('id')
      .or('is_favorite.eq.true,created_at.gte.' + new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

    if (!toKeep) return false;

    const keepIds = toKeep.map((a: any) => a.id);

    const { error } = await supabase!
      .from('external_action_memory')
      .delete()
      .not('id', 'in', `(${keepIds.join(',')})`);

    if (error) throw error;

    return true;
  } catch (error) {
    console.error('Error cleaning history:', error);
    return false;
  }
}
