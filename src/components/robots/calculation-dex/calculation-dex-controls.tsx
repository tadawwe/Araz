
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calculator, Play, Loader2, Binary, Layers, Target, Microscope, Hash, TrendingUp, Square, Zap, History, ShieldAlert, Ghost } from 'lucide-react';
import { cn } from '@/lib/utils';

export function CalculationDexControls() {
  const { 
    strategyParams, setStrategyParams, 
    isAnalyzingDex, fetchHistoricalData,
    selectedSymbol, isMonitoringDex, setIsMonitoringDex,
    historicalAnalysis, executionSettings, setExecutionSettings,
    protocolStatus
  } = useDeriv();

  const handleRunDiscovery = () => {
    const count = parseInt(strategyParams.dexTickCount || '1000');
    fetchHistoricalData(count);
  };

  const hasPatterns = historicalAnalysis && historicalAnalysis.discoveredPatterns.length > 0;

  return (
    <Card className="shadow-md h-full border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-4 border-b border-white/5 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground uppercase tracking-tight">
            <Calculator className="w-4 h-4 text-primary" />
            Neural Discovery Engine
          </CardTitle>
          <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
             <span className="text-[10px] font-black uppercase text-primary tracking-widest">{selectedSymbol.replace('R_', 'VOL ')}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:p-6 space-y-8">
        {/* Step 1: Core Financial Parameters */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
           <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
              <Input type="number" step="0.01" className="h-10 font-code font-bold bg-background border-white/10" value={executionSettings.stake} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isMonitoringDex} />
           </div>
           <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground">Martingale</Label>
              <Input type="number" step="0.1" className="h-10 font-code font-bold bg-background border-white/10" value={executionSettings.martingale} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isMonitoringDex || executionSettings.isAutoMartingaleEnabled} />
           </div>
           <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-green-500">Take Profit</Label>
              <Input type="number" className="h-10 font-code font-bold border-green-500/30 bg-background" value={executionSettings.takeProfit} onChange={(e) => setExecutionSettings({ takeProfit: e.target.value })} disabled={isMonitoringDex} />
           </div>
           <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-red-500">Stop Loss</Label>
              <Input type="number" className="h-10 font-code font-bold border-red-500/30 bg-background" value={executionSettings.stopLoss} onChange={(e) => setExecutionSettings({ stopLoss: e.target.value })} disabled={isMonitoringDex} />
           </div>
        </div>

        {/* Step 2: Auto Martingale Toggle */}
        <div className="space-y-4 border-t border-white/5 pt-4">
           <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
             <ShieldAlert className="w-3.5 h-3.5" /> Auto Martingale Protocol (86% Recovery)
           </Label>
           <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase text-foreground">Enable Recovery Only Mode</span>
                <p className="text-[8px] text-muted-foreground uppercase italic leading-none mt-1">Calculates stake to recoup losses without seeking extra profit</p>
              </div>
              <Switch 
                checked={executionSettings.isAutoMartingaleEnabled} 
                onCheckedChange={(val) => setExecutionSettings({ isAutoMartingaleEnabled: val })}
                disabled={isMonitoringDex}
              />
           </div>
        </div>

        {/* Step 3: Virtual Hook Protocol */}
        <div className="space-y-4 border-t border-white/5 pt-4">
           <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
             <Ghost className="w-3.5 h-3.5" /> Virtual Hook Protocol
           </Label>
           <div className="p-4 bg-white/5 rounded-2xl border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold uppercase text-foreground">Enable Protocol</span>
                  <p className="text-[8px] text-muted-foreground uppercase italic leading-none mt-1">Wait for Virtual losses before trading Real</p>
                </div>
                <Switch 
                  checked={executionSettings.isLossHookEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isLossHookEnabled: val })}
                  disabled={isMonitoringDex}
                />
              </div>
              
              {executionSettings.isLossHookEnabled && (
                <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
                  <Label className="text-[9px] font-bold uppercase text-muted-foreground flex items-center gap-1.5">
                    Consecutive Virtual Losses
                  </Label>
                  <Input 
                    type="number" 
                    min="1"
                    className="h-11 font-code font-black text-lg bg-background border-primary/20" 
                    value={executionSettings.lossHook} 
                    onChange={(e) => setExecutionSettings({ lossHook: e.target.value })} 
                    disabled={isMonitoringDex}
                    placeholder="e.g. 3"
                  />
                  <p className="text-[7px] text-muted-foreground uppercase italic leading-tight">
                    System will switch to REAL after {executionSettings.lossHook} virtual losses. Returns to Virtual on REAL win.
                  </p>
                </div>
              )}
           </div>
        </div>

        {/* Step 4: Protocol Mode Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
           <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
                <Layers className="w-3.5 h-3.5" /> Discovery Protocol
              </Label>
              <Select 
                value={strategyParams.dexAnalysisMode} 
                onValueChange={(val: any) => setStrategyParams({ dexAnalysisMode: val })}
                disabled={isAnalyzingDex || isMonitoringDex}
              >
                <SelectTrigger className="h-12 bg-background border-white/10 font-bold">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="even_odd">
                    <div className="flex items-center gap-2">
                      <Hash className="w-3.5 h-3.5 text-primary" /> EVEN / ODD GAPS
                    </div>
                  </SelectItem>
                  <SelectItem value="over_under">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-accent" /> OVER / UNDER GAPS
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
           </div>

           <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
                <History className="w-3.5 h-3.5" /> Tick Sample Size
              </Label>
              <div className="space-y-1.5">
                 <Label className="text-[9px] font-bold uppercase text-muted-foreground">Historical Window</Label>
                 <Input 
                   type="number" 
                   min="100"
                   max="10000"
                   className="h-12 font-code font-black text-lg bg-background border-white/10" 
                   value={strategyParams.dexTickCount || '1000'} 
                   onChange={(e) => setStrategyParams({ dexTickCount: e.target.value })} 
                   disabled={isAnalyzingDex || isMonitoringDex}
                 />
              </div>
           </div>
        </div>

        {/* Step 5: Depth & Barrier Logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-white/5">
           <div className="space-y-4">
              <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
                <Microscope className="w-3.5 h-3.5" /> Pattern Depth Range
              </Label>
              <div className="grid grid-cols-2 gap-4">
                 <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">Min Length</Label>
                    <Input 
                      type="number" min="2" max="7"
                      className="h-12 font-code font-black bg-background border-white/10" 
                      value={strategyParams.dexPatternMinLen || '2'} 
                      onChange={(e) => setStrategyParams({ dexPatternMinLen: e.target.value })} 
                      disabled={isMonitoringDex}
                    />
                 </div>
                 <div className="space-y-1.5">
                    <Label className="text-[9px] font-bold uppercase text-muted-foreground">Max Length</Label>
                    <Input 
                      type="number" min="3" max="8"
                      className="h-12 font-code font-black bg-background border-white/10" 
                      value={strategyParams.dexPatternMaxLen || '4'} 
                      onChange={(e) => setStrategyParams({ dexPatternMaxLen: e.target.value })} 
                      disabled={isMonitoringDex}
                    />
                 </div>
              </div>
           </div>

           {strategyParams.dexAnalysisMode === 'over_under' && (
             <div className="space-y-4">
                <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
                  <Target className="w-3.5 h-3.5" /> Neural Analysis Barrier
                </Label>
                <div className="space-y-1.5">
                   <Label className="text-[9px] font-bold uppercase text-muted-foreground">Target Digit Barrier</Label>
                   <Input 
                     type="number" min="0" max="8"
                     className="h-12 font-code font-black text-lg bg-background border-accent/20" 
                     value={strategyParams.dexBarrier || '4'} 
                     onChange={(e) => setStrategyParams({ dexBarrier: e.target.value })} 
                     disabled={isAnalyzingDex || isMonitoringDex}
                   />
                   <p className="text-[8px] text-muted-foreground uppercase italic leading-tight">
                     Hunting for Over {strategyParams.dexBarrier} vs Under {parseInt(strategyParams.dexBarrier || '4') + 1}
                   </p>
                </div>
             </div>
           )}
        </div>

        {/* Step 6: Multi-Play Authorization */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button 
            className={cn(
              "w-full h-16 text-md font-black uppercase tracking-[0.1em] transition-all bg-secondary hover:bg-secondary/80 border border-white/5",
              isAnalyzingDex && "opacity-50 cursor-not-allowed"
            )} 
            onClick={handleRunDiscovery}
            disabled={isAnalyzingDex || isMonitoringDex}
          >
            {isAnalyzingDex ? <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> DISCOVERING...</> : <><Microscope className="w-5 h-5 mr-3" /> ANALYZE PATTERNS</>}
          </Button>

          <Button 
            className={cn(
              "w-full h-16 text-md font-black uppercase tracking-[0.1em] transition-all",
              isMonitoringDex ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20",
              !hasPatterns && !isMonitoringDex && "opacity-50 grayscale cursor-not-allowed"
            )} 
            onClick={() => setIsMonitoringDex(!isMonitoringDex)}
            disabled={!hasPatterns && !isMonitoringDex}
          >
            {isMonitoringDex ? <><Square className="w-5 h-5 mr-3" /> STOP AUTO-TRADE</> : <><Play className="w-5 h-5 mr-3" /> START AUTO-TRADE</>}
          </Button>
        </div>

        {/* Neural Monitoring Status */}
        {isMonitoringDex && (
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between w-full border-b border-white/5 pb-2 mb-1">
               <span className="text-[10px] font-black text-primary uppercase flex items-center gap-1.5">
                  <Zap className="w-4 h-4 animate-pulse" /> Neural Cycle Watch
               </span>
               <span className={cn(
                 "text-[9px] font-black px-2 py-0.5 rounded-full border",
                 protocolStatus.message?.includes('VIRTUAL') ? "bg-orange-500/20 border-orange-500/30 text-orange-400" : "bg-green-500/20 border-green-500/30 text-green-400"
               )}>
                 {protocolStatus.message}
               </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
               <span className="text-[9px] font-black text-muted-foreground uppercase">HUNTING:</span>
               <span className="text-xs font-code font-black text-primary tracking-[0.2em]">"{historicalAnalysis?.discoveredPatterns[0]?.sequence}"</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
