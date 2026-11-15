
"use client";

import React, { useState, useEffect } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Users, Key, ShieldCheck, Activity, Loader2, Link as LinkIcon, AlertCircle, Wallet, UserCircle } from 'lucide-react';
import { TradeHistory } from '@/components/dashboard/trade-history';
import { initializeFirebase, useUser, useDoc, setDocumentNonBlocking } from '@/firebase';
import { doc } from 'firebase/firestore';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export function CopyTradingView() {
  const { authState, login } = useDeriv();
  const { user } = useUser();
  const { firestore } = initializeFirebase();
  
  const [apiToken, setApiToken] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const userProfileQuery = React.useMemo(() => (firestore && user) ? doc(firestore, 'user_profiles', user.uid) : null, [firestore, user]);
  const { data: profile } = useDoc(userProfileQuery);

  const handleUpdateToken = async () => {
    if (!firestore || !user || !apiToken) return;
    setIsUpdating(true);
    
    try {
      const socket = new WebSocket(`wss://ws.binaryws.com/websockets/v3?app_id=74546`);
      
      socket.onopen = () => {
        socket.send(JSON.stringify({ authorize: apiToken }));
      };

      socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          if (data.msg_type === 'authorize' && !data.error) {
            const profileRef = doc(firestore, 'user_profiles', user.uid);
            const loginId = data.authorize.loginid;
            const userEmail = data.authorize.email;
            const isVirtual = loginId.startsWith('VRTC');
            
            setDocumentNonBlocking(profileRef, {
              id: user.uid,
              derivAccountId: loginId,
              email: userEmail || authState.email,
              copyTradingToken: apiToken,
              mirrorAccountName: isVirtual ? 'Demo Account' : 'Real Account',
              mirrorBalance: data.authorize.balance,
              isMasterTrader: false,
              isFollowing: profile?.isFollowing || false,
              updatedAt: Date.now()
            }, { merge: true });
            
            toast({ title: "Neural Link Established", description: "API authorized and identity synced." });
            if (!authState.isLoggedIn) login(apiToken, 'api');
            socket.close();
          } else if (data.error) {
            console.error('Copy trading authorization error:', data.error);
            toast({ variant: "destructive", title: "Auth Protocol Fault", description: data.error.message });
            socket.close();
          }
        } catch (parseErr) {
          console.error('Copy trading message parse error:', parseErr);
          toast({ variant: "destructive", title: "Protocol Fault", description: "Invalid response from Deriv stream." });
          socket.close();
        } finally {
          setIsUpdating(false);
        }
      };

      socket.onerror = (event) => {
        console.error('Copy trading WebSocket error:', event);
        toast({ variant: "destructive", title: "Connection Failed", description: "WebSocket connection failed." });
        setIsUpdating(false);
      };
    } catch (err) {
      console.error('Copy trading token update error:', err);
      toast({ variant: "destructive", title: "Connection Failed", description: "Could not authorize token." });
      setIsUpdating(false);
    }
  };

  const handleToggleFollowing = (val: boolean) => {
    if (!firestore || !user) return;
    const profileRef = doc(firestore, 'user_profiles', user.uid);
    setDocumentNonBlocking(profileRef, { isFollowing: val }, { merge: true });
    toast({
      title: val ? "Neural Mirror Active" : "Mirror Protocol Offline",
      description: val ? "Awaiting signals from authorized Master Node." : "Neural link severed."
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div className="lg:col-span-8 space-y-4 md:space-y-6">
        <Card className="shadow-md border-primary/20 bg-card overflow-hidden">
          <CardHeader className="p-4 md:p-6 border-b border-white/5 bg-background">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-black flex items-center gap-3 text-primary uppercase italic tracking-tight">
                <Users className="w-6 h-6" /> Neural Mirror Console
              </CardTitle>
              <div className={cn(
                "flex items-center gap-2 px-3 py-1 rounded-full border transition-colors",
                profile?.isFollowing ? "bg-primary/10 border-primary/20" : "bg-white/5 border-white/10"
              )}>
                <ShieldCheck className={cn("w-3 h-3", profile?.isFollowing ? "text-primary" : "text-muted-foreground")} />
                <span className={cn("text-[10px] font-black uppercase tracking-widest", profile?.isFollowing ? "text-primary" : "text-muted-foreground")}>
                  {profile?.isFollowing ? 'Link Live' : 'Link Offline'}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-8">
            {profile?.copyTradingToken && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                    <UserCircle className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Linked Account Type</span>
                    <span className="text-sm font-bold uppercase tracking-tight">{profile.mirrorAccountName || 'Real Account'}</span>
                  </div>
                </div>
                <div className="p-4 bg-white/5 rounded-xl border border-white/10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500/10 rounded-full flex items-center justify-center text-green-500">
                    <Wallet className="w-7 h-7" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-muted-foreground uppercase">Live Capital (API)</span>
                    <span className="text-sm font-code font-black text-green-400">
                      ${profile.mirrorBalance?.toLocaleString(undefined, { minimumFractionDigits: 2 }) || '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-foreground flex items-center gap-2">
                    <Key className="w-4 h-4 text-primary" /> Mirror Authentication Vault
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter your high-standard Deriv API token to initialize the neural link. Trades from your assigned Master Node will heart-touchingly replicate on this account using the proportional stake protocol.
                  </p>
                  <div className="space-y-2">
                    <Label className="text-[10px] font-black uppercase text-muted-foreground">Neural API Token</Label>
                    <div className="flex gap-2">
                      <Input 
                        type="password" 
                        placeholder="Paste your token here..." 
                        className="bg-background border-white/10 font-code text-xs"
                        value={apiToken}
                        onChange={(e) => setApiToken(e.target.value)}
                      />
                      <Button onClick={handleUpdateToken} disabled={isUpdating || !apiToken} className="bg-primary">
                        {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LinkIcon className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </div>

                <div className={cn(
                  "p-4 rounded-xl border-2 border-dashed transition-all duration-500",
                  profile?.copyTradingToken ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" : "bg-white/5 border-white/5 opacity-50 grayscale"
                )}>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black uppercase text-foreground">Mirror Execution Toggle</span>
                      <p className="text-[8px] text-muted-foreground uppercase italic leading-none">Activate automated neural mirroring</p>
                    </div>
                    <Switch checked={profile?.isFollowing || false} onCheckedChange={handleToggleFollowing} disabled={!profile?.copyTradingToken} />
                  </div>
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5"><Activity className="w-20 h-20 text-primary" /></div>
                <h3 className="text-xs font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> Protocol Integrity
                </h3>
                <ul className="space-y-4">
                  {[
                    { label: "Assigned Master", status: profile?.masterEmail || "Awaiting Admin" },
                    { label: "Capital Sync", status: profile?.mirrorBalance !== undefined ? "Online" : "Awaiting" },
                    { label: "Proportional Staking", status: "Active" }
                  ].map((req, i) => (
                    <li key={i} className="flex items-center justify-between border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase">{req.label}</span>
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-tighter px-2 py-0.5 rounded",
                        req.status.includes("@") || req.status === "Online" || req.status === "Active" ? "text-green-500 bg-green-500/10" : "text-orange-400 bg-orange-400/10"
                      )}>{req.status}</span>
                    </li>
                  ))}
                </ul>
                <p className="text-[9px] text-muted-foreground italic leading-relaxed text-center font-medium opacity-80">
                  "Neural mirroring provides absolute parity. Your proportional risk parameters are heart-touchingly managed by the Master Node."
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter className="bg-white/5 border-t border-white/5 flex justify-center py-4">
             <div className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.3em] animate-pulse">
                <Activity className="w-3 h-3" /> {profile?.isFollowing ? 'Synchronized with Neural Core' : 'Ready for Protocol Handshake'}
             </div>
          </CardFooter>
        </Card>
      </div>
      <div className="lg:col-span-4 flex flex-col">
         <TradeHistory className="flex-1" />
      </div>
    </div>
  );
}
