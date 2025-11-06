import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  OpenAI API key missing - using simple parser');
}

// Create client only if API key is provided
export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const MODELS = {
  PARSING: 'gpt-4-turbo-preview', // Pour le parsing JSON structuré
  ADVANCED: 'gpt-4-turbo-preview', // Pour les conversations
} as const;

// Configuration commune pour éviter les erreurs
export const COMMON_CONFIG = {
  temperature: 0.7,
  max_tokens: 2000, // Utiliser max_tokens au lieu de max_completion_tokens
} as const;
