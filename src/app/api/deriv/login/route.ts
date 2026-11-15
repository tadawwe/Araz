
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('deriv_pat')?.value;
    return NextResponse.json({ authenticated: Boolean(token) });
  } catch (error: any) {
    console.error('Deriv session check error:', error);
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('deriv_pat');
    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Deriv logout route error:', error);
    return NextResponse.json({ error: error.message || 'Logout Error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { token } = await request.json();
    const DERIV_APP_ID = process.env.DERIV_APP_ID || '33IM5dIMuFaBupAhk042L';

    // Step 1: Discover All Trading Accounts (High-Standard Pulse)
    const response = await fetch('https://api.derivws.com/trading/v1/options/accounts', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Deriv-App-ID': DERIV_APP_ID
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('Deriv login identity verification failed:', response.status, errorData);
      return NextResponse.json({ error: errorData.message || 'Identity Verification Failed' }, { status: response.status });
    }

    const json = await response.json();
    const accounts = (json.data || []).map((a: any) => ({
      account_id: a.account_id,
      account_type: a.account_type,
      currency: a.currency || 'USD',
      balance: parseFloat(a.balance || 0),
      is_virtual: a.account_type === 'demo' || a.account_id.startsWith('VRTC'),
      displayName: a.account_type === 'demo' ? 'Demo Wallet' : `${a.currency} Wallet`
    }));

    // Step 2: Secure PAT in HTTP-only Cookie (iframe-safe over HTTPS)
    const isHttps =
      request.headers.get('x-forwarded-proto') === 'https' ||
      request.url.startsWith('https://') ||
      (request.headers.get('origin') || '').startsWith('https://') ||
      (request.headers.get('referer') || '').startsWith('https://');
    const cookieStore = await cookies();
    cookieStore.set('deriv_pat', token, {
      httpOnly: true,
      secure: isHttps,
      sameSite: isHttps ? 'none' : 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 // 1 day
    });

    return NextResponse.json({ ok: true, accounts });
  } catch (error: any) {
    console.error('Deriv login route error:', error);
    return NextResponse.json({ error: error.message || 'Neural Link Error' }, { status: 500 });
  }
}
