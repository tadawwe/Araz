
"use client";

import React, { useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const storedState = sessionStorage.getItem('pkce_state');
    const storedVerifier = sessionStorage.getItem('pkce_verifier');

    if (code && state) {
      if (state !== storedState) {
        console.error('Deriv OAuth callback error: CSRF state mismatch.');
        toast({ variant: "destructive", title: "Security Fault", description: "CSRF state mismatch." });
        router.replace('/');
        return;
      }

      processed.current = true;

      const exchangeToken = async () => {
        try {
          const res = await fetch('/api/deriv/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code,
              code_verifier: storedVerifier,
              redirect_uri: process.env.NEXT_PUBLIC_DERIV_REDIRECT_URI || `${window.location.origin}/callback`
            }),
          });
          
          const data = await res.json();
          
          if (data.access_token) {
            const loginRes = await fetch('/api/deriv/login', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ token: data.access_token }),
            });
            if (!loginRes.ok) {
              const loginErr = await loginRes.json().catch(() => ({}));
              console.error('Deriv OAuth session cookie sync failed:', loginErr);
            }

            const accounts = [{ account_id: data.account_list?.[0]?.loginid || 'API_USER', account: data.account_list?.[0]?.loginid || 'API_USER', token: data.access_token, currency: 'USD', is_virtual: (data.account_list?.[0]?.loginid || '').startsWith('VRTC') }];
            localStorage.setItem('deriv_accounts', JSON.stringify(accounts));
            localStorage.setItem('deriv_token', data.access_token);
            sessionStorage.setItem('deriv_pat_session', data.access_token);
            
            toast({ title: "Neural Link Secured", description: "Authorized and identity synchronized." });
            
            sessionStorage.removeItem('pkce_state');
            sessionStorage.removeItem('pkce_verifier');
            
            window.location.assign('/');
          } else {
            console.error('Deriv OAuth token exchange failed:', data.error);
            toast({ variant: "destructive", title: "Auth Protocol Fault", description: data.error });
            router.replace('/');
          }
        } catch (err) {
          console.error('Deriv OAuth handshake failed:', err);
          toast({ variant: "destructive", title: "Handshake Failed", description: "Network error during token exchange." });
          router.replace('/');
        }
      };

      exchangeToken();
    } else {
      router.replace('/');
    }
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-[#0B0D17] flex flex-col items-center justify-center gap-6">
      <div className="relative">
         <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse"></div>
         <Loader2 className="w-16 h-16 text-primary animate-spin relative z-10" />
      </div>
      <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-1000">
         <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white">Verifying Protocol</h2>
         <p className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground animate-pulse">Synchronizing Neural Link...</p>
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0B0D17] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-xs font-bold uppercase text-muted-foreground tracking-widest">Loading Neural Hook...</p>
      </div>
    }>
      <CallbackContent />
    </Suspense>
  );
}
