export type ActionType = 
  | 'open_link' 
  | 'open_map' 
  | 'search_web' 
  | 'play_music'
  | 'search_video'
  | 'search_flights'
  | 'search_hotels'
  | 'open_wikipedia'
  | 'create_event'
  | 'none';

export interface ExternalAction {
  action: ActionType;
  url?: string;
  query?: string;
  destination?: string;
  title?: string;
  description?: string;
}

export interface ActionResponse {
  message: string;
  action?: ExternalAction;
}

/**
 * Mémoire des actions externes ouvertes
 * Stockage : Supabase (table external_action_memory) + fallback localStorage
 */
export interface ExternalActionMemory {
  id: string;
  url: string;
  label: string;
  action_type?: ActionType;
  is_favorite: boolean;
  created_at: string;
  used_count?: number;
}
