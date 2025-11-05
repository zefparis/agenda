import OpenAI from 'openai';

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  console.warn('⚠️  OpenAI API key missing - using simple parser');
}

// Create client only if API key is provided
export const openai = apiKey ? new OpenAI({ apiKey }) : null;

export const MODELS = {
  PARSING: 'gpt-5',
  ADVANCED: 'gpt-5',
} as const;
