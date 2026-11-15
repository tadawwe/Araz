
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { 
      account_id, 
      is_virtual, 
      contract_type, 
      symbol, 
      stake, 
      barrier, 
      currency = 'USD',
      duration = 1, 
      duration_unit = 't' 
    } = await request.json();

    // SECURE PAT RETRIEVAL FROM SERVER COOKIES OR BEARER FALLBACK
    const cookieStore = await cookies();
    const authHeader = request.headers.get('authorization');
    const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7).trim() : undefined;
    const token = cookieStore.get('deriv_pat')?.value || bearerToken;

    if (!token) {
      console.error('Deriv trade route error: Neural Session Expired (missing deriv_pat cookie and Authorization header)');
      return NextResponse.json({ error: 'Neural Session Expired' }, { status: 401 });
    }

    const DERIV_APP_ID = process.env.DERIV_APP_ID || '33IM5dIMuFaBupAhk042L';
    
    // Multi-pathing for Real vs Demo strikes
    const endpoint = is_virtual 
      ? 'https://api.derivws.com/trading/v1/options/contracts/bulk-purchase/demo' 
      : 'https://api.derivws.com/trading/v1/options/contracts/bulk-purchase/real';

    const barrierRequiredTypes = ['DIGITOVER', 'DIGITUNDER', 'DIGITMATCH', 'DIGITDIFF'];
    const needsBarrier = barrierRequiredTypes.includes(contract_type);

    const body = {
      contract_parameters: {
        contract_type,
        underlying_symbol: symbol,
        currency: currency,
        amount: parseFloat(String(stake)),
        basis: 'stake',
        duration: parseInt(String(duration)),
        duration_unit,
        ...(needsBarrier && barrier !== undefined && { barrier: String(barrier) })
      },
      accounts: [
        {
          token: token,
          account_id: account_id
        }
      ]
    };

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Deriv-App-ID': DERIV_APP_ID
      },
      body: JSON.stringify(body)
    });

    const json = await response.json().catch(() => ({ error: { message: response.statusText || 'Invalid broker response' } }));

    if (!response.ok) {
      const errorMsg = json.error?.message || json.message || json.error || `Handshake Error (${response.status})`;
      console.error('Deriv trade API error:', response.status, errorMsg, json);
      return NextResponse.json({ error: errorMsg, details: json }, { status: response.status });
    }

    const tx = json.data?.transactions?.[0];
    
    if (!tx) {
       console.error('Deriv trade audit failure: No transaction found', json);
       return NextResponse.json({ error: 'Broker Audit Failure: No transaction found', details: json }, { status: 502 });
    }

    if (tx.error) {
      console.error('Deriv trade transaction error:', tx.error);
      return NextResponse.json({ 
        error: tx.error.message || 'Trade Authorization Denied',
        code: tx.error.code,
        details: tx 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      ok: true, 
      data: {
        contract_id: tx.contract_id,
        transaction_id: tx.transaction_id,
        buy_price: tx.buy_price
      } 
    });
  } catch (error: any) {
    console.error('Deriv trade route error:', error);
    return NextResponse.json({ error: error.message || 'Neural Link Timeout' }, { status: 500 });
  }
}
