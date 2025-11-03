import { NextRequest, NextResponse } from 'next/server';
import { createEvent, getEvents } from '@/lib/supabase/queries';
import { ApiResponse, Event, CreateEventInput } from '@/types';

// Default user ID (no auth required)
const DEFAULT_USER_ID = 'default-user';

export async function GET(request: NextRequest) {
  try {
    const events = await getEvents(DEFAULT_USER_ID);

    return NextResponse.json<ApiResponse<Event[]>>({
      success: true,
      data: events,
    });
  } catch (error) {
    console.error('Get events error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const input: CreateEventInput = await request.json();

    if (!input.title || !input.type || !input.start_date) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const event = await createEvent(DEFAULT_USER_ID, input);

    return NextResponse.json<ApiResponse<Event>>({
      success: true,
      data: event,
    }, { status: 201 });
  } catch (error) {
    console.error('Create event error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
