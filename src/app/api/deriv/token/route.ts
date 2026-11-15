
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { code, code_verifier, redirect_uri } = await request.json();

    // Unified high-standard token exchange node
    const response = await fetch('https://auth.deriv.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.DERIV_APP_ID || '33IM5dIMuFaBupAhk042L',
        code,
        code_verifier,
        redirect_uri,
      }),
    });

    const data = await response.json().catch(() => ({ error: 'Invalid response from Deriv OAuth server' }));

    if (data.error) {
      console.error('Deriv OAuth token exchange error:', data);
      return NextResponse.json({ error: data.error_description || data.error }, { status: 400 });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Deriv token route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
