"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Gavel, TrendingUp, TrendingDown, Wallet, Loader2, ShieldAlert, Divide, CircleDot, Binary, Ghost, Zap, Crosshair, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TradeControls() {
  const { 
    placeTrade, authState, strategyType, strategyParams, setStrategyParams, isAutoTrading, 
    executionSettings, setExecutionSettings, isMonitoring, currentMartingaleLevel, protocolStatus
  } = useDeriv();
  
  const handleTrade = (type: string) => {
    let barrier: number | undefined;
    if (type === 'over') barrier = parseInt(strategyParams.overBarrier || '4');
    if (type === 'under') barrier = parseInt(strategyParams.underBarrier || '5');
    placeTrade({ type, barrier });
  };

  const getButtonLabels = () => {
    switch (strategyType) {
      case 'even_odd':
        return { up: 'even', down: 'odd', upLabel: 'BUY EVEN', downLabel: 'BUY ODD' };
      case 'over_under':
        return { up: 'over', down: 'under', upLabel: `BUY OVER ${strategyParams.overBarrier || '4'}`, downLabel: `BUY UNDER ${strategyParams.underBarrier || '5'}` };
      default:
        return { up: 'rise', down: 'fall', upLabel: 'BUY / RISE', downLabel: 'SELL / FALL' };
    }
  };

  const labels = getButtonLabels();

  return (
    <Card className="shadow-md h-full border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background rounded-t-xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground">
            <Gavel className="w-4 h-4 text-primary" />
            Console
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
            <Wallet className="w-3 h-3 text-primary" />
            <span className="text-[9px] md:text-[11px] font-bold text-foreground">
              {authState.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:pt-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
            <Input type="number" className="h-9 text-xs md:text-sm font-code font-bold bg-background border-white/10" value={executionSettings.stake || ''} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isAutoTrading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Matica</Label>
            <Input type="number" step="0.1" className="h-9 text-xs md:text-sm font-code font-bold bg-background border-white/10" value={executionSettings.martingale || ''} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isAutoTrading || executionSettings.isAutoMartingaleEnabled} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Max Matica
            </Label>
            <Input type="number" min="1" className="h-9 text-xs md:text-sm font-code font-bold border-red-500/20 bg-background" value={executionSettings.maxMartingale || ''} onChange={(e) => setExecutionSettings({ maxMartingale: e.target.value })} disabled={isAutoTrading} />
          </div>
          
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-green-500">TP</Label>
            <Input type="number" className="h-9 text-xs md:text-sm border-green-500/30 font-code font-bold bg-background" value={executionSettings.takeProfit || ''} onChange={(e) => setExecutionSettings({ takeProfit: e.target.value })} disabled={isAutoTrading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500">SL</Label>
            <Input type="number" className="h-9 text-xs md:text-sm border-red-500/30 font-code font-bold bg-background" value={executionSettings.stopLoss || ''} onChange={(e) => setExecutionSettings({ stopLoss: e.target.value })} disabled={isAutoTrading} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <Zap className="w-3.5 h-3.5" /> Auto Martingale Protocol
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable Auto Recovery</span>
                  <span className="text-[7px] text-muted-foreground uppercase italic leading-none mt-1">Solves stake for 100% recovery</span>
                </div>
                <Switch 
                  checked={executionSettings.isAutoMartingaleEnabled || false} 
                  onCheckedChange={(val) => setExecutionSettings({ isAutoMartingaleEnabled: val, isDivideMartingaleEnabled: val ? false : executionSettings.isDivideMartingaleEnabled })} 
                  disabled={isMonitoring}
                />
              </div>
          </div>

          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <ShieldAlert className="w-3.5 h-3.5" /> Step Martingale Protocol
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable Step Mode</span>
                  <span className="text-[7px] text-muted-foreground uppercase italic leading-none mt-1">Full recovery before reset</span>
                </div>
                <Switch 
                  checked={executionSettings.isStepMartingaleEnabled || false} 
                  onCheckedChange={(val) => setExecutionSettings({ isStepMartingaleEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
           <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <Crosshair className="w-3.5 h-3.5" /> Hunter Count Protocol
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable Count</span>
                  <span className="text-[7px] text-muted-foreground uppercase italic leading-none mt-1">Stops aggressive strikes after limit</span>
                </div>
                <Switch 
                  checked={executionSettings.isHunterCountEnabled || false} 
                  onCheckedChange={(val) => setExecutionSettings({ isHunterCountEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
              <div className="space-y-1.5">
                 <Label className="text-[9px] font-bold uppercase text-muted-foreground">Strike Limit</Label>
                 <Input 
                   type="number" 
                   min="1"
                   className="h-10 font-code font-bold bg-background border-white/10" 
                   value={executionSettings.hunterCount || ''} 
                   onChange={(e) => setExecutionSettings({ hunterCount: e.target.value })} 
                   disabled={isMonitoring}
                 />
              </div>
          </div>

          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <Ghost className="w-3.5 h-3.5" /> Virtual Loss Hook Protocol
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable Hook</span>
                  <span className="text-[7px] text-muted-foreground uppercase italic leading-none mt-1">Wait for failures</span>
                </div>
                <Switch 
                  checked={executionSettings.isLossHookEnabled || false} 
                  onCheckedChange={(val) => setExecutionSettings({ isLossHookEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
              <div className="space-y-1.5">
                 <Label className="text-[9px] font-bold uppercase text-muted-foreground">Required Losses</Label>
                 <Input 
                   type="number" 
                   min="1"
                   className="h-10 font-code font-bold bg-background border-white/10" 
                   value={executionSettings.lossHook || ''} 
                   onChange={(e) => setExecutionSettings({ lossHook: e.target.value })} 
                   disabled={isMonitoring}
                 />
              </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <Trophy className="w-3.5 h-3.5" /> Virtual Win Hook Protocol
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable Win Hook</span>
                  <span className="text-[7px] text-muted-foreground uppercase italic leading-none mt-1">Wait for successes</span>
                </div>
                <Switch 
                  checked={executionSettings.isVirtualHookEnabled || false} 
                  onCheckedChange={(val) => setExecutionSettings({ isVirtualHookEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
              <div className="space-y-1.5">
                 <Label className="text-[9px] font-bold uppercase text-muted-foreground">Required Wins</Label>
                 <Input 
                   type="number" 
                   min="1"
                   className="h-10 font-code font-bold bg-background border-white/10" 
                   value={executionSettings.virtualHook || ''} 
                   onChange={(e) => setExecutionSettings({ virtualHook: e.target.value })} 
                   disabled={isMonitoring}
                 />
              </div>
          </div>

          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
               <Divide className="w-3.5 h-3.5" /> Divide Martingale
             </Label>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-[9px] font-bold uppercase">Enable</span>
                  <Switch 
                    checked={executionSettings.isDivideMartingaleEnabled || false} 
                    onCheckedChange={(val) => setExecutionSettings({ isDivideMartingaleEnabled: val, isAddUpEnabled: val ? false : executionSettings.isAddUpEnabled, isAutoMartingaleEnabled: val ? false : executionSettings.isAutoMartingaleEnabled })} 
                    disabled={isMonitoring}
                  />
                </div>
                <div className="space-y-1">
                   <Label className="text-[8px] font-bold uppercase text-muted-foreground">Steps</Label>
                   <Input 
                     type="number" 
                     min="2"
                     className="h-8 font-code text-xs bg-background border-white/10" 
                     value={executionSettings.divideMartingaleSteps || ''} 
                     onChange={(e) => setExecutionSettings({ divideMartingaleSteps: e.target.value })} 
                     disabled={isMonitoring}
                   />
                </div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
               <CircleDot className="w-3.5 h-3.5" /> Add Up Protocol
             </Label>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-[9px] font-bold uppercase">Enable</span>
                  <Switch 
                    checked={executionSettings.isAddUpEnabled || false} 
                    onCheckedChange={(val) => setExecutionSettings({ isAddUpEnabled: val, isDivideMartingaleEnabled: val ? false : executionSettings.isDivideMartingaleEnabled })} 
                    disabled={isMonitoring}
                  />
                </div>
                <div className="space-y-1">
                   <Label className="text-[8px] font-bold uppercase text-muted-foreground">Steps</Label>
                   <Input 
                     type="number" 
                     min="1"
                     className="h-8 font-code text-xs bg-background border-white/10" 
                     value={executionSettings.addUpSteps || ''} 
                     onChange={(e) => setExecutionSettings({ addUpSteps: e.target.value })} 
                     disabled={isMonitoring}
                   />
                </div>
             </div>
          </div>
        </div>

        {isMonitoring && protocolStatus.message && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-widest">
                   <Binary className="w-3 h-3" /> Cycle Status
                </span>
             </div>
             <p className="text-[9px] font-bold text-foreground/90 uppercase italic">
                {protocolStatus.message}
             </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="default" className="bg-green-600 hover:bg-green-700 h-12 text-sm font-bold shadow-lg shadow-green-900/20" onClick={() => handleTrade(labels.up)} disabled={isAutoTrading}>
            {isAutoTrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            {labels.upLabel}
          </Button>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 h-12 text-sm font-bold shadow-lg shadow-red-900/20" onClick={() => handleTrade(labels.down)} disabled={isAutoTrading}>
            {isAutoTrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingDown className="w-4 h-4 mr-2" />}
            {labels.downLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
