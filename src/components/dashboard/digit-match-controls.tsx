"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Hash, Target as HunterIcon, Play, Square, Loader2, BarChart3, Settings2 } from 'lucide-react';
import { DigitMatchAnalysisPanel } from './digit-match-analysis-panel';
import { cn } from '@/lib/utils';

export function DigitMatchControls() {
  const { 
    isAutoTrading, executionSettings, setExecutionSettings, 
    isHunterEnabled, setIsHunterEnabled, isMonitoring, setIsMonitoring,
    currentMartingaleLevel, matchedDigits, strategyParams, setStrategyParams
  } = useDeriv();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
      <Card className="shadow-md h-full border-primary/20 bg-card overflow-hidden">
        <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground">
              <Hash className="w-4 h-4 text-primary" />
              Digit Match Synchronizer
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
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
               <Label className="text-[9px] font-bold uppercase text-primary flex items-center gap-1.5">
                  <Settings2 className="w-3 h-3" /> Execution Strategy
               </Label>
               <Select value={strategyParams.matchStrategy} onValueChange={(val: any) => setStrategyParams({ matchStrategy: val })} disabled={isMonitoring}>
                  <SelectTrigger className="h-9 text-xs font-bold bg-background border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="scanner" className="text-xs">Missing Digit Scanner</SelectItem>
                    <SelectItem value="input" className="text-xs">Input Strategy Protocol</SelectItem>
                  </SelectContent>
               </Select>
             </div>
             <div className="space-y-1.5">
                <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
                <Input type="number" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.stake} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isMonitoring} />
             </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground">Multiplier</Label>
              <Input type="number" step="0.1" className="h-9 font-code font-bold bg-background border-white/10" value={executionSettings.martingale} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isMonitoring} />
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

          {strategyParams.matchStrategy === 'scanner' ? (
            <div className="grid grid-cols-2 gap-4 py-3 bg-background rounded-xl p-3 border border-dashed border-white/10">
               <div className="space-y-1.5">
                <Label className="text-[9px] font-bold uppercase text-primary">Digits to Analyze</Label>
                <Input type="number" min="1" max="5" className="h-9 font-code font-bold border-primary/20 bg-background" value={executionSettings.digitsToAnalyze} onChange={(e) => setExecutionSettings({ digitsToAnalyze: e.target.value })} disabled={isMonitoring} />
              </div>
              <div className="space-y-1.5">
                  <Label className="text-[8px] font-bold uppercase text-muted-foreground flex items-center gap-1"><BarChart3 className="w-2.5 h-2.5" /> Tick Sample Size</Label>
                  <Input type="number" className="h-9 text-xs font-bold bg-background border-white/10" value={executionSettings.tickSample} onChange={(e) => setExecutionSettings({ tickSample: e.target.value })} disabled={isMonitoring} />
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-3 bg-background rounded-xl p-3 border border-dashed border-primary/20">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-primary">Digits to Trade</Label>
                    <Input placeholder="e.g. 0,1" className="h-9 text-xs font-bold bg-background border-white/10" value={strategyParams.matchDigitsToTrade} onChange={(e) => setStrategyParams({ matchDigitsToTrade: e.target.value })} disabled={isMonitoring} />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-accent">Entry Digits</Label>
                    <Input placeholder="e.g. 5,7,3" className="h-9 text-xs font-bold bg-background border-white/10" value={strategyParams.matchEntryDigits} onChange={(e) => setStrategyParams({ matchEntryDigits: e.target.value })} disabled={isMonitoring} />
                  </div>
               </div>
               <div className="space-y-1.5">
                  <Label className="text-[9px] font-bold uppercase text-muted-foreground">Entry Count Before Trigger</Label>
                  <Input type="number" min="1" className="h-9 text-xs font-bold bg-background border-white/10" value={strategyParams.matchEntryCount} onChange={(e) => setStrategyParams({ matchEntryCount: e.target.value })} disabled={isMonitoring} />
               </div>
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
            <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
                 <Loader2 className="w-3 h-3 animate-spin" />
                 {strategyParams.matchStrategy === 'scanner' ? (matchedDigits.length > 0 ? 'Executing Hunt Strategy' : 'Scanning Stream Data') : 'Monitoring Entry Triggers'}
              </div>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[180px]">
                {currentMartingaleLevel > 0 ? `RECOVERY LEVEL ${currentMartingaleLevel}` : 'Waiting for High-Confidence Sequence...'}
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {strategyParams.matchStrategy === 'scanner' && <DigitMatchAnalysisPanel />}
    </div>
  );
}
