import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'API is working',
    env: {
      hasOpenAI: !!process.env.OPENAI_API_KEY,
      hasSupabase: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    }
  });
}
