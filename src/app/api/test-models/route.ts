import { NextResponse } from 'next/server';
import { openai, MODELS } from '@/lib/openai/client';

export async function GET() {
  if (!openai) {
    return NextResponse.json({
      success: false,
      error: 'OpenAI client not initialized - missing API key'
    }, { status: 500 });
  }

  try {
    // Tester GPT-4-Turbo
    const testResponse = await openai.chat.completions.create({
      model: MODELS.ADVANCED,
      messages: [
        { role: 'user', content: 'Hello, respond with just your model name and version' }
      ],
      max_tokens: 50,
      temperature: 0.1,
    });

    return NextResponse.json({
      success: true,
      model_used: MODELS.ADVANCED,
      model_response: testResponse.choices[0]?.message?.content || 'No response',
      response_model: testResponse.model,
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message || 'Unknown error',
      model_attempted: MODELS.ADVANCED,
      details: error.toString()
    }, { status: 500 });
  }
}
