
"use client";

import React, { useEffect } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Wand2, Target as HunterIcon, TrendingUp, TrendingDown, Play, Square, Loader2, Binary, CircleDot, ShieldAlert, Zap, Bot, Hash, Sparkles, ShieldCheck, Globe, Percent } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TARGET_NET_YIELDS } from '@/lib/simulation-engine';

export function OverUnderMagicControls() {
  const { 
    placeTrade, strategyParams, setStrategyParams, 
    executionSettings, setExecutionSettings, 
    isBotEnabled, setIsBotEnabled,
    isHunterEnabled, setIsHunterEnabled, isMonitoring, setIsMonitoring,
    currentMartingaleLevel, protocolStatus, fetchProposal
  } = useDeriv();
  
  const handleTrade = (type: string) => {
    let barrier: number | undefined;
    if (type === 'over') barrier = parseInt(strategyParams.overBarrier || '4');
    if (type === 'under') barrier = parseInt(strategyParams.underBarrier || '5');
    placeTrade({ type, barrier });
  };

  const overBarrierValue = parseInt(strategyParams.overBarrier || '4');
  const underBarrierValue = parseInt(strategyParams.underBarrier || '5');

  useEffect(() => {
    fetchProposal('OVER', overBarrierValue);
    fetchProposal('UNDER', underBarrierValue);
  }, [overBarrierValue, underBarrierValue, fetchProposal]);

  const overYield = TARGET_NET_YIELDS[`over_${overBarrierValue}`] ?? 0.82;
  const overPercent = (overYield * 100).toFixed(1);

  const underYield = TARGET_NET_YIELDS[`under_${underBarrierValue}`] ?? 0.82;
  const underPercent = (underYield * 100).toFixed(1);

  const multiMarketOptions = [
    { id: 'R_10', label: 'Vol 10' },
    { id: 'R_25', label: 'Vol 25' },
    { id: 'R_50', label: 'Vol 50' },
    { id: 'R_75', label: 'Vol 75' },
    { id: 'R_100', label: 'Vol 100' },
  ];

  const handleToggleMarket = (symbol: string) => {
    const current = strategyParams.magicSelectedMarkets || [];
    if (current.includes(symbol)) {
      setStrategyParams({ magicSelectedMarkets: current.filter(s => s !== symbol) });
    } else {
      setStrategyParams({ magicSelectedMarkets: [...current, symbol] });
    }
  };

  return (
    <Card className="shadow-md h-full border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground">
            <Wand2 className="w-4 h-4 text-primary" />
            Magic Wizard Console
          </CardTitle>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
                <Bot className={cn("w-3 h-3", isBotEnabled ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-[9px] font-bold uppercase text-foreground/80">Bot</span>
                <Switch checked={isBotEnabled} onCheckedChange={setIsBotEnabled} className="h-4 w-8" />
             </div>
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
                <HunterIcon className={cn("w-3 h-3", isHunterEnabled ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-[9px] font-bold uppercase text-foreground/80">Hunter</span>
                <Switch checked={isHunterEnabled} onCheckedChange={setIsHunterEnabled} className="h-4 w-8" />
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:pt-6 space-y-4">
        <div className="space-y-4 border-b border-white/5 pb-4">
           <div className="flex items-center justify-between">
              <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
                <Globe className="w-3.5 h-3.5" /> Trade All Market Protocol
              </Label>
              <Switch 
                checked={strategyParams.magicMultiMarketEnabled} 
                onCheckedChange={(val) => setStrategyParams({ magicMultiMarketEnabled: val })}
                disabled={isMonitoring}
              />
           </div>
           
           {strategyParams.magicMultiMarketEnabled && (
             <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 animate-in slide-in-from-top-2 duration-300">
               {multiMarketOptions.map((opt) => (
                 <div 
                   key={opt.id} 
                   className={cn(
                     "flex flex-col items-center justify-center p-2 rounded-lg border transition-all cursor-pointer",
                     strategyParams.magicSelectedMarkets.includes(opt.id) 
                       ? "bg-primary/20 border-primary shadow-sm" 
                       : "bg-white/5 border-white/10 opacity-60 grayscale"
                   )}
                   onClick={() => !isMonitoring && handleToggleMarket(opt.id)}
                 >
                   <Checkbox 
                     checked={strategyParams.magicSelectedMarkets.includes(opt.id)}
                     className="sr-only"
                   />
                   <span className="text-[9px] font-black uppercase tracking-tight">{opt.label}</span>
                 </div>
               ))}
             </div>
           )}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
            <Input type="number" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.stake} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Multiplier</Label>
            <Input type="number" step="0.1" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.martingale} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Max Martingale
            </Label>
            <Input type="number" min="1" className="h-9 font-code font-bold border-red-500/20 bg-background" value={executionSettings.maxMartingale} onChange={(e) => setExecutionSettings({ maxMartingale: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <Label className="text-[9px] font-bold uppercase text-primary">Over Pred.</Label>
              <span className="text-[8px] font-bold text-green-500">{overPercent}%</span>
            </div>
            <Input type="number" min="0" max="9" className="h-9 font-code font-bold border-primary/20 bg-background" value={strategyParams.overBarrier} onChange={(e) => setStrategyParams({ overBarrier: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <Label className="text-[9px] font-bold uppercase text-primary">Under Pred.</Label>
              <span className="text-[8px] font-bold text-green-500">{underPercent}%</span>
            </div>
            <Input type="number" min="0" max="9" className="h-9 font-code font-bold border-primary/20 bg-background" value={strategyParams.underBarrier} onChange={(e) => setStrategyParams({ underBarrier: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-green-500">Take Profit</Label>
            <Input type="number" className="h-9 font-code font-bold border-green-500/30 bg-background" value={executionSettings.takeProfit} onChange={(e) => setExecutionSettings({ takeProfit: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500">Stop Loss</Label>
            <Input type="number" className="h-9 font-code font-bold border-red-500/30 bg-background" value={executionSettings.stopLoss} onChange={(e) => setExecutionSettings({ stopLoss: e.target.value })} disabled={isMonitoring} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <Zap className="w-3.5 h-3.5" /> Auto Martingale
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-[10px] font-bold uppercase">Enable Auto Recovery</span>
                <Switch 
                  checked={executionSettings.isAutoMartingaleEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isAutoMartingaleEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
          </div>
          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <Percent className="w-3.5 h-3.5" /> Dominance Alpha Filter
             </Label>
             <div className="space-y-1.5">
                <Label className="text-[8px] font-bold uppercase text-muted-foreground">Min. Dominance Diff (%)</Label>
                <Input 
                  type="number" 
                  min="0" 
                  max="100" 
                  className="h-10 font-code font-bold bg-background border-white/10" 
                  value={strategyParams.magicDominanceDiffThreshold} 
                  onChange={(e) => setStrategyParams({ magicDominanceDiffThreshold: e.target.value })} 
                  disabled={isMonitoring}
                />
             </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/5 pt-4">
           <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
             <ShieldAlert className="w-3.5 h-3.5" /> Recovery Barrier Protocol
           </Label>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable Dual Recovery</span>
                  <span className="text-[8px] text-muted-foreground uppercase italic leading-none mt-1">Independent barriers for Over/Under recovery</span>
                </div>
                <Switch 
                  checked={executionSettings.isRecoveryBarrierEnabled || false} 
                  onCheckedChange={(val) => setExecutionSettings({ isRecoveryBarrierEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
              
              <div className={cn("grid grid-cols-2 gap-4 transition-all duration-300", !executionSettings.isRecoveryBarrierEnabled && "opacity-40 pointer-events-none")}>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-primary">Over Recovery Barrier</Label>
                  <Input 
                    type="number" min="0" max="9"
                    className="h-9 font-code text-xs bg-background border-white/10"
                    value={executionSettings.overRecoveryBarrier || ''}
                    onChange={(e) => setExecutionSettings({ overRecoveryBarrier: e.target.value })}
                    disabled={isMonitoring}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-primary">Under Recovery Barrier</Label>
                  <Input 
                    type="number" min="0" max="9"
                    className="h-9 font-code text-xs bg-background border-white/10"
                    value={executionSettings.underRecoveryBarrier || ''}
                    onChange={(e) => setExecutionSettings({ underRecoveryBarrier: e.target.value })}
                    disabled={isMonitoring}
                  />
                </div>
              </div>
           </div>
        </div>

        <div className="space-y-2 border-t border-white/5 pt-3">
           <Label className="text-[9px] font-bold uppercase text-primary flex items-center gap-1.5">
             <CircleDot className="w-3 h-3" /> Add Up Protocol (Compounding)
           </Label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase">Enable Add Up</span>
                  <span className="text-[7px] text-muted-foreground uppercase italic">Compounds win profit into next stake</span>
                </div>
                <Switch 
                  checked={executionSettings.isAddUpEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isAddUpEnabled: val })} 
                />
              </div>
              <div className="space-y-1">
                 <Label className="text-[8px] font-bold uppercase text-muted-foreground">Steps to Win</Label>
                 <Input 
                   type="number" 
                   min="1"
                   className="h-8 font-code text-xs bg-background border-white/10" 
                   value={executionSettings.addUpSteps} 
                   onChange={(e) => setExecutionSettings({ addUpSteps: e.target.value })} 
                   disabled={isMonitoring}
                 />
              </div>
           </div>
        </div>

        <div className="space-y-2 border-t border-white/5 pt-3">
           <Label className="text-[9px] font-bold uppercase text-primary flex items-center gap-1.5">
             <ShieldCheck className="w-3 h-3" /> Directional Execution (Hedge Selector)
           </Label>
           <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase">Trade Over</span>
                </div>
                <Switch checked={executionSettings.tradeOver} onCheckedChange={(val) => setExecutionSettings({ tradeOver: val })} />
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase">Trade Under</span>
                </div>
                <Switch checked={executionSettings.tradeUnder} onCheckedChange={(val) => setExecutionSettings({ tradeUnder: val })} />
              </div>
           </div>
        </div>

        <div className="space-y-1.5">
           <Label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
             <Hash className="w-3 h-3" /> Classic Trigger (Consecutive Count)
           </Label>
           <Input type="number" placeholder="Trigger after X digits..." className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.consecutiveCount} onChange={(e) => setExecutionSettings({ consecutiveCount: e.target.value })} />
        </div>

        <div className="space-y-1.5 border-t border-white/5 pt-4">
           <Label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
             <Sparkles className="w-3 h-3" /> Neural Trigger Mask
           </Label>
           <Input type="text" placeholder="Leave blank for every tick (All digits)..." className="h-10 text-center font-code font-black text-lg tracking-[0.3em] bg-background border-white/10" value={executionSettings.entryDigits} onChange={(e) => setExecutionSettings({ entryDigits: e.target.value })} />
        </div>

        {isMonitoring && protocolStatus.message && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-widest">
                   <Binary className="w-3 h-3" /> Neural Dashboard
                </span>
             </div>
             <p className="text-[9px] font-bold text-foreground/90 uppercase italic">
                {protocolStatus.message}
             </p>
          </div>
        )}

        <Button 
          className={cn(
            "w-full h-12 text-sm font-black uppercase tracking-widest transition-all",
            isMonitoring ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          )} 
          onClick={() => setIsMonitoring(!isMonitoring)}
        >
          {isMonitoring ? <><Square className="w-4 h-4 mr-2" /> STOP PROTOCOL</> : <><Play className="w-4 h-4 mr-2" /> START PROTOCOL</>}
        </Button>

        {isMonitoring && (
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
               <Loader2 className="w-3 h-3 animate-spin" />
               {strategyParams.magicMultiMarketEnabled ? 'Scanning Parallel Market Pulse' : 'Scanning Market Dominance'}
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[180px]">
              {currentMartingaleLevel > 0 ? `RECOVERY LEVEL ${currentMartingaleLevel}` : 'Waiting for Neural Confidence...'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button className="bg-green-600 hover:bg-green-700 h-12 font-bold shadow-lg shadow-green-900/20" onClick={() => handleTrade('over')} disabled={isMonitoring}>
            <TrendingUp className="w-4 h-4 mr-2" /> MANUAL OVER {strategyParams.overBarrier}
          </Button>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 h-12 font-bold shadow-lg shadow-green-900/20" onClick={() => handleTrade('under')} disabled={isMonitoring}>
            <TrendingDown className="w-4 h-4 mr-2" /> MANUAL UNDER {strategyParams.underBarrier}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
