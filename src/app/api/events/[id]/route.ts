import { NextRequest, NextResponse } from 'next/server';
import { updateEvent, deleteEvent, getEventById } from '@/lib/supabase/queries';
import { ApiResponse, Event, UpdateEventInput } from '@/types';

// Default user ID (no auth required)
const DEFAULT_USER_ID = 'default-user';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const event = await getEventById(id, DEFAULT_USER_ID);

    if (!event) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<Event>>({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Get event error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to fetch event' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const updates = await request.json();
    const input: UpdateEventInput = { id, ...updates };

    const event = await updateEvent(input, DEFAULT_USER_ID);

    return NextResponse.json<ApiResponse<Event>>({
      success: true,
      data: event,
    });
  } catch (error) {
    console.error('Update event error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to update event' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await deleteEvent(id, DEFAULT_USER_ID);

    return NextResponse.json<ApiResponse>({
      success: true,
    });
  } catch (error) {
    console.error('Delete event error:', error);
    return NextResponse.json<ApiResponse>(
      { success: false, error: 'Failed to delete event' },
      { status: 500 }
    );
  }
}
