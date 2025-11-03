import { NextRequest, NextResponse } from 'next/server';
import { parseNaturalLanguage } from '@/lib/openai/parser';
import { ApiResponse, ParsedCommand } from '@/types';

export const runtime = 'edge';

export async function POST(request: NextRequest) {
  try {
    const { command } = await request.json();

    if (!command || typeof command !== 'string') {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Invalid command' },
        { status: 400 }
      );
    }

    const parsed = await parseNaturalLanguage(command);

    return NextResponse.json<ApiResponse<ParsedCommand>>({
      success: true,
      data: parsed,
    });
  } catch (error) {
    console.error('Parse API error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to parse command' },
      { status: 500 }
    );
  }
}
