
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Sparkles, Gavel, Wallet, TrendingUp, TrendingDown, Play, Square, Loader2, Hash, Zap, Trophy, Ghost, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MagicBoxControls() {
  const { 
    placeTrade, authState, strategyType, setStrategyType, strategyParams, setStrategyParams, 
    isMonitoring, setIsMonitoring, executionSettings, setExecutionSettings, currentMartingaleLevel, protocolStatus
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
        return { up: 'even', down: 'odd', upLabel: 'BUY EVEN', downLabel: 'BUY ODD' };
    }
  };

  const labels = getButtonLabels();

  return (
    <Card className="shadow-md border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground uppercase tracking-tight">
            <Sparkles className="w-4 h-4 text-primary" />
            Magic Box Console
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
            <Wallet className="w-3 h-3 text-primary" />
            <span className="text-[11px] font-bold text-foreground">
              {authState.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
            <Input type="number" step="0.01" className="h-10 font-code font-bold bg-background border-white/10" value={executionSettings.stake} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Martingale</Label>
            <Input type="number" step="0.1" className="h-10 font-code font-bold bg-background border-white/10" value={executionSettings.martingale} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-green-500">Take Profit</Label>
            <Input type="number" className="h-10 font-code font-bold border-green-500/30 bg-background" value={executionSettings.takeProfit} onChange={(e) => setExecutionSettings({ takeProfit: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500">Stop Loss</Label>
            <Input type="number" className="h-10 font-code font-bold border-red-500/30 bg-background" value={executionSettings.stopLoss} onChange={(e) => setExecutionSettings({ stopLoss: e.target.value })} disabled={isMonitoring} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
           <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
                <Gavel className="w-3.5 h-3.5" /> Strike Protocol Selection
              </Label>
              <div className="grid grid-cols-2 gap-4">
                 <Button 
                   variant={strategyType === 'even_odd' ? 'default' : 'outline'}
                   className={cn("h-11 font-bold text-xs", strategyType === 'even_odd' ? "bg-primary" : "border-white/10")}
                   onClick={() => setStrategyType('even_odd')}
                   disabled={isMonitoring}
                 >
                   <Hash className="w-3.5 h-3.5 mr-2" /> EVEN/ODD
                 </Button>
                 <Button 
                   variant={strategyType === 'over_under' ? 'default' : 'outline'}
                   className={cn("h-11 font-bold text-xs", strategyType === 'over_under' ? "bg-primary" : "border-white/10")}
                   onClick={() => setStrategyType('over_under')}
                   disabled={isMonitoring}
                 >
                   <TrendingUp className="w-3.5 h-3.5 mr-2" /> OVER/UNDER
                 </Button>
              </div>
           </div>

           <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
                <Zap className="w-3.5 h-3.5" /> Analysis Window
              </Label>
              <div className="space-y-1.5">
                 <Label className="text-[9px] font-bold uppercase text-muted-foreground">Price Sample (Ticks)</Label>
                 <Input 
                   type="number" 
                   className="h-11 font-code font-bold bg-background border-white/10" 
                   value={executionSettings.tickSample} 
                   onChange={(e) => setExecutionSettings({ tickSample: e.target.value })} 
                   disabled={isMonitoring}
                 />
              </div>
           </div>
        </div>

        {/* VIRTUAL HOOK PROTOCOL SECTION */}
        <div className="space-y-4 border-t border-white/5 pt-4">
           <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
             <Ghost className="w-3.5 h-3.5" /> Virtual Hook Protocol
           </Label>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold uppercase">Enable Virtual Hook</span>
                    <span className="text-[8px] text-muted-foreground uppercase italic leading-none mt-1">Switches to virtual on real loss</span>
                 </div>
                 <Switch 
                   checked={executionSettings.isLossHookEnabled} 
                   onCheckedChange={(val) => setExecutionSettings({ isLossHookEnabled: val })} 
                   disabled={isMonitoring}
                 />
              </div>
              
              {executionSettings.isLossHookEnabled && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                   <Label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                      <ShieldAlert className="w-3 h-3 text-red-500" /> Real Loss Threshold
                   </Label>
                   <Input 
                     type="number" 
                     min="1" 
                     className="h-11 font-code font-black text-lg bg-background border-red-500/20" 
                     value={executionSettings.lossHook} 
                     onChange={(e) => setExecutionSettings({ lossHook: e.target.value })} 
                     disabled={isMonitoring}
                     placeholder="Number of losses..."
                   />
                   <p className="text-[7px] text-muted-foreground uppercase leading-tight italic">
                      After {executionSettings.lossHook} real loss(es), the system will switch to Virtual Mode until a win is achieved.
                   </p>
                </div>
              )}
           </div>
        </div>

        {strategyType === 'over_under' && (
          <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2 border-t border-white/5 pt-4">
             <div className="space-y-1.5">
               <Label className="text-[9px] font-bold uppercase text-primary">Over Barrier</Label>
               <Input type="number" min="0" max="8" className="h-10 bg-background border-primary/20" value={strategyParams.overBarrier} onChange={(e) => setStrategyParams({ overBarrier: e.target.value })} disabled={isMonitoring} />
             </div>
             <div className="space-y-1.5">
               <Label className="text-[9px] font-bold uppercase text-primary">Under Barrier</Label>
               <Input type="number" min="1" max="9" className="h-10 bg-background border-primary/20" value={strategyParams.underBarrier} onChange={(e) => setStrategyParams({ underBarrier: e.target.value })} disabled={isMonitoring} />
             </div>
          </div>
        )}

        {isMonitoring && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-widest">
                   <Trophy className="w-3 h-3" /> Cycle Intelligence
                </span>
                <span className={cn(
                  "text-[9px] font-black px-2 py-0.5 rounded-full border",
                  protocolStatus.message?.includes('VIRTUAL') ? "bg-orange-500/20 border-orange-500/30 text-orange-400" : "bg-green-500/20 border-green-500/30 text-green-400"
                )}>
                  {protocolStatus.message}
                </span>
             </div>
             <p className="text-[9px] font-bold text-foreground/90 uppercase italic">
                {currentMartingaleLevel > 0 ? `Recovery protocol level ${currentMartingaleLevel} in execution.` : 'Stable base strike authorization active.'}
             </p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
          <Button 
            className="bg-green-600 hover:bg-green-700 h-14 font-black uppercase tracking-widest shadow-lg shadow-green-900/20" 
            onClick={() => handleTrade(labels.up)}
          >
            <TrendingUp className="w-5 h-5 mr-2" /> {labels.upLabel}
          </Button>
          <Button 
            variant="destructive" 
            className="bg-red-600 hover:bg-red-700 h-14 font-black uppercase tracking-widest shadow-lg shadow-red-900/20" 
            onClick={() => handleTrade(labels.down)}
          >
            <TrendingDown className="w-5 h-5 mr-2" /> {labels.downLabel}
          </Button>
        </div>

        <Button 
          className={cn(
            "w-full h-16 text-lg font-black uppercase tracking-[0.2em] transition-all",
            isMonitoring ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          )} 
          onClick={() => setIsMonitoring(!isMonitoring)}
        >
          {isMonitoring ? <><Square className="w-5 h-5 mr-3" /> STOP PRICE WATCH</> : <><Play className="w-5 h-5 mr-3" /> START PRICE WATCH</>}
        </Button>

        {isMonitoring && (
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
               <Loader2 className="w-3 h-3 animate-spin" />
               Magic Box Analysis Active
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[200px]">
              {currentMartingaleLevel > 0 ? `RECOVERY LEVEL ${currentMartingaleLevel}` : 'Monitoring Neural Price Flux...'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
