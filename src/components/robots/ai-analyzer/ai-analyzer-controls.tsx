
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Microscope, Play, Square, Gavel, TrendingUp, Wallet, Hash, ShieldAlert, Loader2, Target, ArrowDownToLine, ArrowUpFromLine, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AIAnalyzerControls() {
  const { 
    executionSettings, setExecutionSettings, 
    isMonitoring, setIsMonitoring,
    authState, currentTicks,
    strategyParams, setStrategyParams, strategyType, setStrategyType
  } = useDeriv();

  const isBufferFull = currentTicks.length >= 10000;
  
  return (
    <Card className="shadow-md border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground uppercase tracking-tight">
            <Microscope className="w-4 h-4 text-primary" />
            AI Analyzer Console
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

        <div className="space-y-4 pt-2">
          <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
            <Gavel className="w-3.5 h-3.5" /> Protocol Selection Layer
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
             <Button 
               variant={strategyType === 'even_odd' ? 'default' : 'outline'}
               className={cn("h-12 font-bold text-xs", strategyType === 'even_odd' ? "bg-primary" : "border-white/10")}
               onClick={() => setStrategyType('even_odd')}
               disabled={isMonitoring}
             >
               <Hash className="w-3.5 h-3.5 mr-2" /> EVEN / ODD
             </Button>
             <Button 
               variant={strategyType === 'over_under' ? 'default' : 'outline'}
               className={cn("h-12 font-bold text-xs", strategyType === 'over_under' ? "bg-primary" : "border-white/10")}
               onClick={() => setStrategyType('over_under')}
               disabled={isMonitoring}
             >
               <TrendingUp className="w-3.5 h-3.5 mr-2" /> OVER / UNDER
             </Button>
             <Button 
               variant={strategyType === 'digit_match' ? 'default' : 'outline'}
               className={cn("h-12 font-bold text-xs", strategyType === 'digit_match' ? "bg-primary" : "border-white/10")}
               onClick={() => setStrategyType('digit_match')}
               disabled={isMonitoring}
             >
               <ShieldAlert className="w-3.5 h-3.5 mr-2" /> MATCHES
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-6">
          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
               <Target className="w-3.5 h-3.5" /> Threshold Intensity
             </Label>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <ArrowUpFromLine className="w-3 h-3 text-green-500" /> Greater
                  </Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="5"
                    className="h-10 font-code font-bold bg-background border-white/10" 
                    value={strategyParams.aiGreaterCount} 
                    onChange={(e) => setStrategyParams({ aiGreaterCount: e.target.value })} 
                    disabled={isMonitoring}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1">
                    <ArrowDownToLine className="w-3 h-3 text-red-500" /> Lesser
                  </Label>
                  <Input 
                    type="number" 
                    min="1" 
                    max="5"
                    className="h-10 font-code font-bold bg-background border-white/10" 
                    value={strategyParams.aiLesserCount} 
                    onChange={(e) => setStrategyParams({ aiLesserCount: e.target.value })} 
                    disabled={isMonitoring}
                  />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
               <Zap className="w-3.5 h-3.5" /> N3 Master Protocol
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase">Enable N3 Master</span>
                  <p className="text-[8px] text-muted-foreground uppercase italic leading-none mt-1">Uses weak digits as strong-side triggers</p>
                </div>
                <Switch 
                  checked={strategyParams.isN3MasterEnabled} 
                  onCheckedChange={(val) => setStrategyParams({ isN3MasterEnabled: val })}
                  disabled={isMonitoring}
                />
             </div>
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

        <div className="relative group pt-2">
          {!isBufferFull && !isMonitoring && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-lg animate-bounce">
              Neural Buffer Syncing: {currentTicks.length}/10000
            </div>
          )}
          <Button 
            className={cn(
              "w-full h-16 text-lg font-black uppercase tracking-[0.2em] transition-all",
              isMonitoring ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
              !isBufferFull && !isMonitoring && "opacity-50 grayscale cursor-not-allowed"
            )} 
            onClick={() => setIsMonitoring(!isMonitoring)}
            disabled={!isBufferFull && !isMonitoring}
          >
            {isMonitoring ? <><Square className="w-5 h-5 mr-3" /> STOP AI ANALYZER</> : <><Play className="w-5 h-5 mr-3" /> START AI ANALYZER</>}
          </Button>
        </div>

        {isMonitoring && (
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
               <Loader2 className="w-4 h-4 animate-spin" />
               Neural Scanning Mode Active
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[200px]">
              {strategyParams.isN3MasterEnabled ? 'N3 Master Contrarian Protocol Engaged' : 'Analyzing 10,000 Tick Dominance Protocol...'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
