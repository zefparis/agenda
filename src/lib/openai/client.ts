import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  OpenAI API key missing - using simple parser');
}

// Create client only if API key is provided
export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const MODELS = {
  PARSING: 'gpt-4o-mini',
  ADVANCED: 'gpt-4o',
} as const;
