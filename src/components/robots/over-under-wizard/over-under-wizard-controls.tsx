
"use client";

import React, { useEffect, useMemo } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Zap, Hash, Target as HunterIcon, TrendingUp, TrendingDown, Sparkles, ShieldCheck, Play, Square, Loader2, Divide, Binary, CircleDot, ShieldAlert, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { calculateSimulationProfit } from '@/lib/simulation-engine';

export function OverUnderWizardControls() {
  const { 
    placeTrade, strategyParams, setStrategyParams, 
    executionSettings, setExecutionSettings, 
    isHunterEnabled, setIsHunterEnabled, isMonitoring, setIsMonitoring,
    currentMartingaleLevel, dynamicOverPayouts, dynamicUnderPayouts,
    protocolStatus, fetchProposal
  } = useDeriv();
  
  const stakeValue = parseFloat(executionSettings.stake || '1');

  // Parse multiple barriers
  const overBarriers = useMemo(() => 
    (strategyParams.overBarrier || '').split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s)), 
    [strategyParams.overBarrier]
  );
  
  const underBarriers = useMemo(() => 
    (strategyParams.underBarrier || '').split(',').map(s => s.trim()).filter(s => s !== '').map(s => parseInt(s)), 
    [strategyParams.underBarrier]
  );

  // Sync proposals for all specified barriers
  useEffect(() => {
    overBarriers.forEach(b => fetchProposal('OVER', b));
    underBarriers.forEach(b => fetchProposal('UNDER', b));
  }, [stakeValue, overBarriers, underBarriers, fetchProposal]);

  const handleManualTrade = (type: string) => {
    const barriers = type === 'over' ? overBarriers : underBarriers;
    barriers.forEach((b, i) => placeTrade({ type, barrier: b }));
  };

  // Combined stats calculation
  const getStats = (type: 'over' | 'under') => {
    const barriers = type === 'over' ? overBarriers : underBarriers;
    const payouts = type === 'over' ? dynamicOverPayouts : dynamicUnderPayouts;
    
    if (barriers.length === 0) return { profit: 0, percent: "0" };
    
    let totalProfit = 0;
    barriers.forEach(b => {
      const payout = payouts[b];
      totalProfit += payout ? (payout - stakeValue) : calculateSimulationProfit(stakeValue, type, undefined, b);
    });
    
    const avgProfit = totalProfit / barriers.length;
    const percent = ((avgProfit / stakeValue) * 100).toFixed(1);
    
    return { profit: totalProfit, percent };
  };

  const overStats = getStats('over');
  const underStats = getStats('under');

  return (
    <Card className="shadow-md h-full border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground">
            <Zap className="w-4 h-4 text-primary" />
            Over Under Wizard Console
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
            <Input type="number" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.stake || ''} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Multiplier</Label>
            <Input type="number" step="0.1" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.martingale || ''} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <Label className="text-[9px] font-bold uppercase text-primary">Over Barriers</Label>
              <span className="text-[8px] font-bold text-green-500">{overStats.percent}% Avg</span>
            </div>
            <Input type="text" placeholder="e.g. 2,4,6" className="h-9 font-code font-bold border-primary/20 bg-background" value={strategyParams.overBarrier || ''} onChange={(e) => setStrategyParams({ overBarrier: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <Label className="text-[9px] font-bold uppercase text-primary">Under Barriers</Label>
              <span className="text-[8px] font-bold text-green-500">{underStats.percent}% Avg</span>
            </div>
            <Input type="text" placeholder="e.g. 7,8,9" className="h-9 font-code font-bold border-primary/20 bg-background" value={strategyParams.underBarrier || ''} onChange={(e) => setStrategyParams({ underBarrier: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-green-500">TP</Label>
            <Input type="number" className="h-9 font-code font-bold border-green-500/30 bg-background" value={executionSettings.takeProfit || ''} onChange={(e) => setExecutionSettings({ takeProfit: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500">SL</Label>
            <Input type="number" className="h-9 font-code font-bold border-red-500/30 bg-background" value={executionSettings.stopLoss || ''} onChange={(e) => setExecutionSettings({ stopLoss: e.target.value })} disabled={isMonitoring} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 py-3 bg-background rounded-xl p-3 border border-dashed border-primary/20">
           <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase">Single recovery</span>
              </div>
              <Switch 
                checked={executionSettings.singleMartingale} 
                onCheckedChange={(val) => {
                  if (val && (!executionSettings.tradeOver || !executionSettings.tradeUnder)) {
                    toast({ variant: "destructive", title: "Protocol Alert", description: "Wizard requires dual directions for Single Recovery." });
                    return;
                  }
                  setExecutionSettings({ singleMartingale: val });
                }} 
              />
           </div>
           <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
              <div className="flex flex-col">
                <span className="text-[9px] font-bold uppercase">Compounding Recovery</span>
              </div>
              <Switch 
                checked={executionSettings.isHedgeAddUpEnabled} 
                onCheckedChange={(val) => {
                  if (val && (!executionSettings.tradeOver || !executionSettings.tradeUnder)) {
                    toast({ variant: "destructive", title: "Protocol Alert", description: "Wizard requires dual directions for Compounding." });
                    return;
                  }
                  setExecutionSettings({ isHedgeAddUpEnabled: val });
                }} 
              />
           </div>
        </div>

        <div className="space-y-4 border-t border-white/5 pt-4">
           <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
             <ShieldAlert className="w-3.5 h-3.5" /> Recovery Digit Protocol
           </Label>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable Neural Shift</span>
                  <span className="text-[8px] text-muted-foreground uppercase italic leading-none mt-1">Shifts barrier targets during recovery</span>
                </div>
                <Switch 
                  checked={executionSettings.isRecoveryDigitEnabled || false} 
                  onCheckedChange={(val) => setExecutionSettings({ isRecoveryDigitEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
              
              <div className={cn("grid grid-cols-2 gap-4 transition-all duration-300", !executionSettings.isRecoveryDigitEnabled && "opacity-40 pointer-events-none")}>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-green-500">Over Recovery</Label>
                  <Input 
                    placeholder="e.g. 3" 
                    className="h-9 font-code text-xs bg-background border-green-500/20"
                    value={executionSettings.overRecoveryBarrier || ''}
                    onChange={(e) => setExecutionSettings({ overRecoveryBarrier: e.target.value })}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-red-500">Under Recovery</Label>
                  <Input 
                    placeholder="e.g. 5" 
                    className="h-9 font-code text-xs bg-background border-red-500/20"
                    value={executionSettings.underRecoveryBarrier || ''}
                    onChange={(e) => setExecutionSettings({ underRecoveryBarrier: e.target.value })}
                  />
                </div>
              </div>
           </div>
        </div>

        {isMonitoring && protocolStatus.message && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-widest">
                   <Binary className="w-3 h-3" /> Wizard Neural Stream
                </span>
             </div>
             <p className="text-[9px] font-bold text-foreground/90 uppercase italic">
                {protocolStatus.message}
             </p>
          </div>
        )}

        <div className="space-y-2 border-t border-white/5 pt-3">
           <Label className="text-[9px] font-bold uppercase text-primary flex items-center gap-1.5">
             <CircleDot className="w-3 h-3" /> Standard Compounding
           </Label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase">Enable Add Up</span>
                </div>
                <Switch 
                  checked={executionSettings.isAddUpEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isAddUpEnabled: val, isDivideMartingaleEnabled: val ? false : executionSettings.isDivideMartingaleEnabled })} 
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

        <div className="space-y-2 border-t border-white/5 pt-3">
           <Label className="text-[9px] font-bold uppercase text-primary flex items-center gap-1.5">
             <Divide className="w-3 h-3" /> Split Recovery Protocol
           </Label>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[9px] font-bold uppercase">Enable Split</span>
                </div>
                <Switch 
                  checked={executionSettings.isDivideMartingaleEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isDivideMartingaleEnabled: val, isAddUpEnabled: val ? false : executionSettings.isAddUpEnabled })} 
                />
              </div>
              <div className="space-y-1">
                 <Label className="text-[8px] font-bold uppercase text-muted-foreground">Divisions</Label>
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

        <div className="space-y-2 border-t border-white/5 pt-3">
           <Label className="text-[9px] font-bold uppercase text-primary flex items-center gap-1.5">
             <ShieldCheck className="w-3 h-3" /> Execution Gate
           </Label>
           <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <span className="text-[9px] font-bold uppercase">Over</span>
                <Switch 
                  checked={executionSettings.tradeOver} 
                  onCheckedChange={(val) => {
                    setExecutionSettings({ 
                      tradeOver: val,
                      singleMartingale: (val && executionSettings.tradeUnder) ? executionSettings.singleMartingale : false,
                      isHedgeAddUpEnabled: (val && executionSettings.tradeUnder) ? executionSettings.isHedgeAddUpEnabled : false
                    });
                  }} 
                />
              </div>
              <div className="flex items-center justify-between p-2 bg-white/5 rounded-lg border border-white/10">
                <span className="text-[9px] font-bold uppercase">Under</span>
                <Switch 
                  checked={executionSettings.tradeUnder} 
                  onCheckedChange={(val) => {
                    setExecutionSettings({ 
                      tradeUnder: val,
                      singleMartingale: (val && executionSettings.tradeOver) ? executionSettings.singleMartingale : false,
                      isHedgeAddUpEnabled: (val && executionSettings.tradeOver) ? executionSettings.isHedgeAddUpEnabled : false
                    });
                  }} 
                />
              </div>
           </div>
        </div>

        <div className="space-y-1.5">
           <Label className="text-[9px] font-bold uppercase text-muted-foreground">Consecutive Sequence</Label>
           <Input type="number" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.consecutiveCount || ''} onChange={(e) => setExecutionSettings({ consecutiveCount: e.target.value })} />
        </div>

        <div className="space-y-1.5 border-t border-white/5 pt-4">
           <Label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
             <Sparkles className="w-3 h-3" /> Neural Trigger Mask
           </Label>
           <Input type="text" placeholder="Digits: e.g. 1,5,9..." className="h-10 text-center font-code font-black text-lg tracking-[0.3em] bg-background border-white/10" value={executionSettings.entryDigits || ''} onChange={(e) => setExecutionSettings({ entryDigits: e.target.value })} />
        </div>

        <Button 
          className={cn(
            "w-full h-12 text-sm font-black uppercase tracking-widest transition-all",
            isMonitoring ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          )} 
          onClick={() => setIsMonitoring(!isMonitoring)}
        >
          {isMonitoring ? <><Square className="w-4 h-4 mr-2" /> STOP WIZARD</> : <><Play className="w-4 h-4 mr-2" /> START WIZARD</>}
        </Button>

        {isMonitoring && (
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
               <Loader2 className="w-3 h-3 animate-spin" /> Analyzing Wizard Flow
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[180px]">
              {currentMartingaleLevel > 0 ? `RECOVERY LVL ${currentMartingaleLevel}` : 'Waiting for Neural Confidence...'}
            </span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button className="bg-green-600 hover:bg-green-700 h-12 font-bold shadow-lg shadow-green-900/20" onClick={() => handleManualTrade('over')} disabled={isMonitoring || !executionSettings.tradeOver}>
            <TrendingUp className="w-4 h-4 mr-2" /> MANUAL CLUSTER OVER
          </Button>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 h-12 font-bold shadow-lg shadow-red-900/20" onClick={() => handleManualTrade('under')} disabled={isMonitoring || !executionSettings.tradeUnder}>
            <TrendingDown className="w-4 h-4 mr-2" /> MANUAL CLUSTER UNDER
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
