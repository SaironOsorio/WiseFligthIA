import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const backendUrl = process.env.BACKEND_URL ?? 'http://api:8080/api/chat';
    const body = await request.text();

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body,
      cache: 'no-store',
    });

    const responseBody = await response.text();

    return new NextResponse(responseBody, {
      status: response.status,
      headers: {
        'Content-Type': response.headers.get('Content-Type') ?? 'application/json',
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: true,
        message: `No se pudo conectar con el backend: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      { status: 502 }
    );
  }
}
