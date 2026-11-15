
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { MarketSelector } from './market-selector';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LogOut, Zap, ShieldCheck, RefreshCw, Timer } from 'lucide-react';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function Header() {
  const { authState, logout, switchAccount, isConnected, isReconnecting, networkGlitch, refreshCountdown } = useDeriv();
  const activeAccount = authState.accounts[authState.activeAccountIndex];

  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur-md flex items-center justify-between px-4 md:px-8 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-4">
        <SidebarTrigger className="h-10 w-10 hover:bg-white/10 rounded-lg text-foreground" />
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20">
            <Zap className="w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight text-primary uppercase italic select-none hidden sm:block leading-none">Alchemist</h1>
            {networkGlitch && (
              <span className="text-[7px] font-black text-red-500 uppercase tracking-widest animate-pulse mt-1">Handshake Stall Detected</span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-6 ml-auto">
        {refreshCountdown !== null && (
          <Badge variant="destructive" className="bg-red-500/20 text-red-500 border-red-500/30 text-[9px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-2 animate-in slide-in-from-top-2">
            <Timer className="w-3 h-3 animate-pulse" />
            Auto-Refresh in {refreshCountdown}s
          </Badge>
        )}

        {isReconnecting && !networkGlitch && (
          <Badge variant="outline" className="border-primary/20 text-primary text-[9px] font-black uppercase tracking-widest px-3 py-1 flex items-center gap-2">
            <RefreshCw className="w-3 h-3 animate-spin" />
            Syncing Link...
          </Badge>
        )}

        <MarketSelector />
        
        {authState.accounts.length > 0 && (
          <Select value={authState.activeAccountIndex.toString()} onValueChange={(val) => switchAccount(parseInt(val))}>
            <SelectTrigger className="w-[120px] md:w-[180px] h-10 text-[10px] font-bold uppercase bg-white/5 border-white/10 text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {authState.accounts.map((acc, idx) => (
                <SelectItem key={acc.account_id} value={idx.toString()}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-2 h-2 rounded-full shrink-0", acc.is_virtual ? "bg-orange-400" : "bg-green-500")} />
                    <div className="flex flex-col items-start">
                      <span className="text-[8px] font-black uppercase opacity-60 leading-none">
                        {acc.is_virtual ? 'Demo' : 'Real'}
                      </span>
                      <span className="font-code text-[11px]">{acc.account_id}</span>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:flex flex-col">
            <div className="flex items-center gap-1 justify-end">
              <ShieldCheck className={cn("w-3 h-3", authState.isVirtual ? "text-orange-400" : "text-green-500")} />
              <span className={cn("text-[9px] font-black uppercase tracking-tighter", authState.isVirtual ? "text-orange-400" : "text-green-500")}>
                {authState.isVirtual ? 'Demo' : 'Real'} Account
              </span>
            </div>
            <p className="text-sm font-code font-black text-foreground tracking-tight">
              {authState.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </p>
          </div>
          <Avatar className="w-10 h-10 border-2 border-primary/20 ring-2 ring-background ring-offset-2 ring-offset-primary/20">
            <AvatarImage src={`https://picsum.photos/seed/${activeAccount?.account_id || 'trader'}/40/40`} />
            <AvatarFallback className="bg-primary text-white font-bold text-xs">
              {authState.isVirtual ? 'DEMO' : 'REAL'}
            </AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={logout} className="h-10 w-10 hover:bg-red-500/10 hover:text-red-500 transition-all rounded-full">
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </header>
  );
}
