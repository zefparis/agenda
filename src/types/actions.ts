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
