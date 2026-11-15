
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { account_id } = await request.json();
    const DERIV_APP_ID = process.env.DERIV_APP_ID || '33IM5dIMuFaBupAhk042L';
    
    const cookieStore = await cookies();
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
    const token = cookieStore.get('deriv_pat')?.value || bearerToken;

    if (!token) {
      console.error('Deriv ws-otp route error: Neural Session Expired (missing deriv_pat cookie and Authorization header)');
      return NextResponse.json({ error: 'Neural Session Expired' }, { status: 401 });
    }

    // Step 3: Request Account-Specific OTP (High-Standard Security)
    const response = await fetch(`https://api.derivws.com/trading/v1/options/accounts/${encodeURIComponent(account_id)}/otp`, {
      method: 'POST',
      headers: {
        'Deriv-App-ID': DERIV_APP_ID,
        'Authorization': `Bearer ${token}`
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: response.statusText }));
      console.error('Deriv ws-otp generation failed:', response.status, errorData);
      return NextResponse.json({ error: errorData.message || 'OTP generation failed' }, { status: response.status });
    }

    const json = await response.json();
    // Return the authorized WebSocket URL containing the OTP
    return NextResponse.json({ ws_url: json.data.url });
  } catch (error: any) {
    console.error('Deriv ws-otp route error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
