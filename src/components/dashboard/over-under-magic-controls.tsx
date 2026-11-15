
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Wand2, Hash, Target as HunterIcon, TrendingUp, TrendingDown, Sparkles, ShieldCheck, Play, Square, Loader2, GitMerge, Plus, Divide, Binary, Info, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OverUnderMagicControls() {
  const { 
    placeTrade, strategyParams, setStrategyParams, 
    executionSettings, setExecutionSettings, 
    isHunterEnabled, setIsHunterEnabled, isMonitoring, setIsMonitoring,
    currentMartingaleLevel, dynamicOverPayout, dynamicUnderPayout,
    protocolStatus
  } = useDeriv();
  
  const handleTrade = (type: string) => {
    let barrier: number | undefined;
    if (type === 'over') barrier = parseInt(strategyParams.overBarrier || '4');
    if (type === 'under') barrier = parseInt(strategyParams.underBarrier || '5');
    placeTrade({ type, barrier });
  };

  const overStake = parseFloat(executionSettings.stake || '1');
  const overProfit = dynamicOverPayout ? (dynamicOverPayout - overStake) : (overStake * 1.15);
  const overPercent = ((overProfit / overStake) * 100).toFixed(0);

  const underStake = parseFloat(executionSettings.stake || '1');
  const underProfit = dynamicUnderPayout ? (dynamicUnderPayout - underStake) : (underStake * 1.15);
  const underPercent = ((underProfit / underStake) * 100).toFixed(0);

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
                <HunterIcon className={cn("w-3 h-3", isHunterEnabled ? 'text-primary' : 'text-muted-foreground')} />
                <span className="text-[9px] font-bold uppercase text-foreground/80">Hunter</span>
                <Switch checked={isHunterEnabled} onCheckedChange={setIsHunterEnabled} className="h-4 w-8" />
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:pt-6 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
            <Input type="number" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.stake} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Matica (Multiplier)</Label>
            <Input type="number" step="0.1" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.martingale} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <Label className="text-[9px] font-bold uppercase text-primary">Over Prediction</Label>
              <span className="text-[8px] font-bold text-green-500">{overPercent}% Net</span>
            </div>
            <Input type="number" min="0" max="9" className="h-9 font-code font-bold border-primary/20 bg-background" value={strategyParams.overBarrier} onChange={(e) => setStrategyParams({ overBarrier: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <Label className="text-[9px] font-bold uppercase text-primary">Under Prediction</Label>
              <span className="text-[8px] font-bold text-green-500">{underPercent}% Net</span>
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

        <div className="grid grid-cols-2 gap-4 py-3 bg-background rounded-xl p-3 border border-dashed border-primary/20">
           <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase">Single Martingale</span>
                <span className="text-[7px] text-muted-foreground uppercase italic">Basic recovery multiplier</span>
              </div>
              <Switch checked={executionSettings.singleMartingale} onCheckedChange={(val) => setExecutionSettings({ singleMartingale: val, doubleMartingale: val ? false : executionSettings.doubleMartingale })} />
           </div>
           <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase">Double Martingale</span>
                <span className="text-[7px] text-muted-foreground uppercase italic">Aggressive recovery multiplier</span>
              </div>
              <Switch checked={executionSettings.doubleMartingale} onCheckedChange={(val) => setExecutionSettings({ doubleMartingale: val, singleMartingale: val ? false : executionSettings.singleMartingale })} />
           </div>
        </div>

        {isMonitoring && protocolStatus.message && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-widest">
                   <Binary className="w-3 h-3" /> Neural Cycle Dashboard
                </span>
                {protocolStatus.splitProgress && (
                  <span className="text-[10px] font-bold text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                    {protocolStatus.splitProgress}
                  </span>
                )}
             </div>
             <p className="text-[9px] font-bold text-foreground/90 uppercase italic">
                {protocolStatus.message}
             </p>
          </div>
        )}

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
             <Divide className="w-3 h-3" /> Divide Martingale Protocol
           </Label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase">Enable Protocol</span>
                  <span className="text-[7px] text-muted-foreground uppercase italic">Splits recovery across multiple trades</span>
                </div>
                <Switch 
                  checked={executionSettings.isDivideMartingaleEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isDivideMartingaleEnabled: val })} 
                />
              </div>
              <div className="space-y-1">
                 <Label className="text-[8px] font-bold uppercase text-muted-foreground">Steps (Split Into)</Label>
                 <Input 
                   type="number" 
                   min="2"
                   className="h-8 font-code text-xs bg-background border-white/10" 
                   value={executionSettings.divideMartingaleSteps} 
                   onChange={(e) => setExecutionSettings({ divideMartingaleSteps: e.target.value })} 
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
                  <span className="text-[7px] text-green-500 uppercase">Est. +${overProfit.toFixed(2)}</span>
                </div>
                <Switch checked={executionSettings.tradeOver} onCheckedChange={(val) => setExecutionSettings({ tradeOver: val })} />
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase">Trade Under</span>
                  <span className="text-[7px] text-green-500 uppercase">Est. +${underProfit.toFixed(2)}</span>
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
             <Sparkles className="w-3 h-3" /> Entry Digits (Manual Input)
           </Label>
           <Input type="text" placeholder="Leave blank for automatic signal..." className="h-10 text-center font-code font-black text-lg tracking-[0.3em] bg-background border-white/10" value={executionSettings.entryDigits} onChange={(e) => setExecutionSettings({ entryDigits: e.target.value })} />
        </div>

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
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
               <Loader2 className="w-3 h-3 animate-spin" />
               Scanning Stream for {executionSettings.entryDigits || 'Signals'}
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[180px]">
              {currentMartingaleLevel > 0 ? `RECOVERY LEVEL ${currentMartingaleLevel}` : 'Waiting for High-Confidence Sequence...'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button className="bg-green-600 hover:bg-green-700 h-12 font-bold shadow-lg shadow-green-900/20" onClick={() => handleTrade('over')} disabled={isMonitoring || !executionSettings.tradeOver}>
            <TrendingUp className="w-4 h-4 mr-2" /> MANUAL OVER {strategyParams.overBarrier}
          </Button>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 h-12 font-bold shadow-lg shadow-green-900/20" onClick={() => handleTrade('under')} disabled={isMonitoring || !executionSettings.tradeUnder}>
            <TrendingDown className="w-4 h-4 mr-2" /> MANUAL UNDER {strategyParams.underBarrier}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
