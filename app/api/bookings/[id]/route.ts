import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://privateproject-r0ry.onrender.com';

/**
 * GET handler to fetch individual booking details from the backend.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const res = await fetch(`${BACKEND_URL}/api/bookings/${id}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText || 'Failed to fetch booking' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

/**
 * PUT handler to update booking details.
 * Explicitly excludes the 'status' field as requested.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const body = await request.json();
    
    console.log(`[API] Updating booking ${id}.`);
    
    const res = await fetch(`${BACKEND_URL}/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json({ error: errorText || 'Failed to update booking' }, { status: res.status });
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
