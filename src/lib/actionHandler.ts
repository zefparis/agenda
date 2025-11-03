import { ExternalAction } from '@/types/actions';

/**
 * Génère l'URL pour Google Maps avec destination
 */
export function generateMapsUrl(destination: string): string {
  const encoded = encodeURIComponent(destination);
  return `https://www.google.com/maps/dir/?api=1&destination=${encoded}`;
}

/**
 * Génère l'URL de recherche Google
 */
export function generateSearchUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://www.google.com/search?q=${encoded}`;
}

/**
 * Génère l'URL de recherche YouTube
 */
export function generateYouTubeUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://www.youtube.com/results?search_query=${encoded}`;
}

/**
 * Génère l'URL de recherche de vols Google Flights
 */
export function generateFlightsUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://www.google.com/travel/flights?q=${encoded}`;
}

/**
 * Génère l'URL de recherche d'hôtels Google Hotels
 */
export function generateHotelsUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://www.google.com/travel/hotels?q=${encoded}`;
}

/**
 * Génère l'URL Wikipédia
 */
export function generateWikipediaUrl(query: string): string {
  const encoded = encodeURIComponent(query);
  return `https://fr.wikipedia.org/wiki/Special:Search?search=${encoded}`;
}

/**
 * URLs des services de musique
 */
export const MUSIC_SERVICES = {
  amazon: 'https://music.amazon.fr',
  spotify: 'https://open.spotify.com',
  deezer: 'https://www.deezer.com',
  youtube_music: 'https://music.youtube.com',
};

/**
 * URLs des sites populaires pour génération automatique
 */
export const POPULAR_SITES: Record<string, string> = {
  // Réseaux sociaux
  facebook: 'https://facebook.com',
  twitter: 'https://twitter.com',
  instagram: 'https://instagram.com',
  linkedin: 'https://linkedin.com',
  tiktok: 'https://tiktok.com',
  snapchat: 'https://snapchat.com',
  reddit: 'https://reddit.com',
  pinterest: 'https://pinterest.com',
  
  // E-commerce
  amazon: 'https://amazon.fr',
  ebay: 'https://ebay.fr',
  aliexpress: 'https://aliexpress.com',
  cdiscount: 'https://cdiscount.com',
  fnac: 'https://fnac.com',
  
  // Streaming
  netflix: 'https://netflix.com',
  disney: 'https://disneyplus.com',
  primevideo: 'https://primevideo.com',
  youtube: 'https://youtube.com',
  twitch: 'https://twitch.tv',
  
  // Email & Productivité
  gmail: 'https://gmail.com',
  outlook: 'https://outlook.com',
  yahoo: 'https://yahoo.com',
  
  // Actualités
  lemonde: 'https://lemonde.fr',
  lefigaro: 'https://lefigaro.fr',
  liberation: 'https://liberation.fr',
  franceinfo: 'https://francetvinfo.fr',
  
  // Utilitaires
  google: 'https://google.com',
  drive: 'https://drive.google.com',
  dropbox: 'https://dropbox.com',
  github: 'https://github.com',
  stackoverflow: 'https://stackoverflow.com',
};

/**
 * Détecte et retourne l'URL d'un site populaire
 */
export function getPopularSiteUrl(siteName: string): string | null {
  const normalized = siteName.toLowerCase().replace(/\s+/g, '');
  return POPULAR_SITES[normalized] || null;
}

/**
 * Exécute une action externe (ouvre un lien dans un nouvel onglet)
 */
export function executeAction(action: ExternalAction): void {
  if (!action.url) {
    console.warn('No URL provided for action:', action);
    return;
  }

  console.log('🔗 Executing action:', action.action, action.url);
  
  // Ouvrir dans un nouvel onglet
  window.open(action.url, '_blank', 'noopener,noreferrer');
}

/**
 * Parse une action depuis le message GPT et génère l'URL appropriée
 */
export function parseActionFromGPT(actionData: Partial<ExternalAction>): ExternalAction | null {
  if (!actionData.action || actionData.action === 'none') {
    return null;
  }

  const action: ExternalAction = {
    action: actionData.action,
    title: actionData.title,
    description: actionData.description,
  };

  // Générer l'URL selon le type d'action
  switch (actionData.action) {
    case 'open_map':
      if (actionData.destination) {
        action.url = generateMapsUrl(actionData.destination);
        action.destination = actionData.destination;
      }
      break;

    case 'search_web':
      if (actionData.query) {
        action.url = generateSearchUrl(actionData.query);
        action.query = actionData.query;
      }
      break;

    case 'search_video':
      if (actionData.query) {
        action.url = generateYouTubeUrl(actionData.query);
        action.query = actionData.query;
      }
      break;

    case 'search_flights':
      if (actionData.query) {
        action.url = generateFlightsUrl(actionData.query);
        action.query = actionData.query;
      }
      break;

    case 'search_hotels':
      if (actionData.query) {
        action.url = generateHotelsUrl(actionData.query);
        action.query = actionData.query;
      }
      break;

    case 'open_wikipedia':
      if (actionData.query) {
        action.url = generateWikipediaUrl(actionData.query);
        action.query = actionData.query;
      }
      break;

    case 'play_music':
      // Par défaut Amazon Music, mais peut être personnalisé
      action.url = actionData.url || MUSIC_SERVICES.amazon;
      break;

    case 'open_link':
      if (actionData.url) {
        action.url = actionData.url;
      }
      break;

    default:
      return null;
  }

  // Vérifier qu'on a bien une URL
  if (!action.url) {
    console.warn('Could not generate URL for action:', actionData);
    return null;
  }

  return action;
}
