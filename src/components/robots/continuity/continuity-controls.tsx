
"use client";

import React, { useEffect } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Infinity, Play, Square, Loader2, Wallet, Target as HunterIcon, CircleDot, Binary, Divide, ShieldAlert, Percent, Zap, Layers, Hash, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TARGET_NET_YIELDS } from '@/lib/simulation-engine';

export function ContinuityControls() {
  const { 
    strategyParams, setStrategyParams, 
    executionSettings, setExecutionSettings, 
    isMonitoring, setIsMonitoring,
    currentMartingaleLevel, authState,
    isHunterEnabled, setIsHunterEnabled,
    protocolStatus, fetchProposal, selectedSymbol
  } = useDeriv();
  
  const stakeValue = parseFloat(executionSettings.stake || '1');
  const overBarrierValue = parseInt(strategyParams.overBarrier || '4');
  const underBarrierValue = parseInt(strategyParams.underBarrier || '5');

  useEffect(() => {
    if (strategyParams.continuityContract === 'over_under') {
      fetchProposal('OVER', overBarrierValue);
      fetchProposal('UNDER', underBarrierValue);
    }
  }, [stakeValue, overBarrierValue, underBarrierValue, strategyParams.continuityContract, fetchProposal]);

  const overYield = TARGET_NET_YIELDS[`over_${overBarrierValue}`] ?? 0.88;
  const overPercent = (overYield * 100).toFixed(1);

  const underYield = TARGET_NET_YIELDS[`under_${underBarrierValue}`] ?? 0.88;
  const underPercent = (underYield * 100).toFixed(1);

  const evenOddPercent = (0.88 * 100).toFixed(1);

  const isPatternMode = strategyParams.continuityStrategy === 'pattern';
  const isEvenOdd = strategyParams.continuityContract === 'even_odd';

  return (
    <Card className="shadow-md h-full border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground uppercase tracking-tight">
            <Infinity className="w-4 h-4 text-primary" />
            Continuity Flow Console
          </CardTitle>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
                <HunterIcon className={cn("w-3 h-3", isHunterEnabled ? "text-primary" : "text-muted-foreground")} />
                <span className="text-[9px] font-bold uppercase text-foreground/80">Hunter</span>
                <Switch checked={isHunterEnabled} onCheckedChange={setIsHunterEnabled} className="h-4 w-8" />
             </div>
             <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
                <Wallet className="w-3 h-3 text-primary" />
                <span className="text-[11px] font-bold text-foreground">
                  {authState.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
                </span>
              </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:pt-6 space-y-6">
        <div className="space-y-4">
           <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
             <Layers className="w-3.5 h-3.5" /> Strategy Selection Layer
           </Label>
           <Select value={strategyParams.continuityStrategy} onValueChange={(val: any) => setStrategyParams({ continuityStrategy: val })} disabled={isMonitoring}>
             <SelectTrigger className="h-11 text-xs font-bold bg-background border-white/10">
               <SelectValue />
             </SelectTrigger>
             <SelectContent>
               <SelectItem value="continuous" className="text-xs">Continuous Strategy Protocol</SelectItem>
               <SelectItem value="pattern" className="text-xs">Pattern Strategy Protocol</SelectItem>
             </SelectContent>
           </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
            <Input type="number" className="h-10 font-code font-bold bg-background border-white/10" value={executionSettings.stake || ''} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Multiplier</Label>
            <Input type="number" step="0.1" className="h-10 font-code font-bold bg-background border-white/10" value={executionSettings.martingale || ''} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isMonitoring || executionSettings.isAutoMartingaleEnabled} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-green-500">Take Profit</Label>
            <Input type="number" className="h-10 font-code font-bold border-green-500/30 bg-background" value={executionSettings.takeProfit || ''} onChange={(e) => setExecutionSettings({ takeProfit: e.target.value })} disabled={isMonitoring} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500">Stop Loss</Label>
            <Input type="number" className="h-10 font-code font-bold border-red-500/30 bg-background" value={executionSettings.stopLoss || ''} onChange={(e) => setExecutionSettings({ stopLoss: e.target.value })} disabled={isMonitoring} />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between mb-0.5">
              <Label className="text-[9px] font-bold uppercase text-primary">Contract Selection</Label>
              {isEvenOdd && <span className="text-[8px] font-bold text-green-500">{evenOddPercent}% Fixed</span>}
            </div>
            <Select value={strategyParams.continuityContract} onValueChange={(val: any) => setStrategyParams({ continuityContract: val })} disabled={isMonitoring}>
              <SelectTrigger className="h-11 text-xs font-bold bg-background border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="even_odd" className="text-xs">Even / Odd Protocol</SelectItem>
                <SelectItem value="over_under" className="text-xs">Over / Under Protocol</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!isPatternMode && (
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-primary flex items-center gap-1.5">
                <Percent className="w-3 h-3" /> Min. % Difference
              </Label>
              <Input 
                type="number" 
                min="0" 
                max="100" 
                className="h-11 font-code font-bold bg-background border-white/10" 
                value={executionSettings.continuityDiffThreshold || ''} 
                onChange={(e) => setExecutionSettings({ continuityDiffThreshold: e.target.value })} 
                disabled={isMonitoring}
              />
            </div>
          )}
        </div>

        {!isEvenOdd && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-0.5">
                <Label className="text-[9px] font-bold uppercase text-primary">Over Barrier</Label>
                <span className="text-[8px] font-bold text-green-500">{overPercent}% Net</span>
              </div>
              <Input type="number" min="0" max="9" className="h-10 font-code font-bold border-primary/20 bg-background" value={strategyParams.overBarrier || ''} onChange={(e) => setStrategyParams({ overBarrier: e.target.value })} disabled={isMonitoring} />
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between mb-0.5">
                <Label className="text-[9px] font-bold uppercase text-primary">Under Barrier</Label>
                <span className="text-[8px] font-bold text-green-500">{underPercent}% Net</span>
              </div>
              <Input type="number" min="0" max="9" className="h-10 font-code font-bold border-primary/20 bg-background" value={strategyParams.underBarrier || ''} onChange={(e) => setStrategyParams({ underBarrier: e.target.value })} disabled={isMonitoring} />
            </div>
          </div>
        )}

        {isPatternMode && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
            <Card className="bg-white/5 border-white/10 p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase text-foreground">Pattern Box 1</span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[8px] font-bold uppercase text-muted-foreground">Neural Sequence</Label>
                <Input 
                  placeholder={isEvenOdd ? "e.g. E,E,E" : "e.g. O4,O4,O4"} 
                  className="h-9 font-code text-xs bg-background border-white/10"
                  value={strategyParams.continuityPattern1 || ''}
                  onChange={(e) => setStrategyParams({ continuityPattern1: e.target.value })}
                  disabled={isMonitoring}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[8px] font-bold uppercase text-muted-foreground">Strike Direction</Label>
                <Select 
                  value={strategyParams.continuityDirection1} 
                  onValueChange={(val) => setStrategyParams({ continuityDirection1: val })}
                  disabled={isMonitoring}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isEvenOdd ? (
                      <>
                        <SelectItem value="even">Trade EVEN</SelectItem>
                        <SelectItem value="odd">Trade ODD</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="over">Trade OVER</SelectItem>
                        <SelectItem value="under">Trade UNDER</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </Card>

            <Card className="bg-white/5 border-white/10 p-3 space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase text-foreground">Pattern Box 2</span>
              </div>
              <div className="space-y-1.5">
                <Label className="text-[8px] font-bold uppercase text-muted-foreground">Neural Sequence</Label>
                <Input 
                  placeholder={isEvenOdd ? "e.g. O,O,O" : "e.g. U5,U5,U5"} 
                  className="h-9 font-code text-xs bg-background border-white/10"
                  value={strategyParams.continuityPattern2 || ''}
                  onChange={(e) => setStrategyParams({ continuityPattern2: e.target.value })}
                  disabled={isMonitoring}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[8px] font-bold uppercase text-muted-foreground">Strike Direction</Label>
                <Select 
                  value={strategyParams.continuityDirection2} 
                  onValueChange={(val) => setStrategyParams({ continuityDirection2: val })}
                  disabled={isMonitoring}
                >
                  <SelectTrigger className="h-9 text-xs bg-background border-white/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {isEvenOdd ? (
                      <>
                        <SelectItem value="even">Trade EVEN</SelectItem>
                        <SelectItem value="odd">Trade ODD</SelectItem>
                      </>
                    ) : (
                      <>
                        <SelectItem value="over">Trade OVER</SelectItem>
                        <SelectItem value="under">Trade UNDER</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-white/5 pt-4">
          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
               <CircleDot className="w-3.5 h-3.5" /> Add Up Protocol
             </Label>
             <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-[10px] font-bold uppercase">Enable Add Up</span>
                  <Switch 
                    checked={executionSettings.isAddUpEnabled} 
                    onCheckedChange={(val) => setExecutionSettings({ isAddUpEnabled: val, isDivideMartingaleEnabled: val ? false : executionSettings.isDivideMartingaleEnabled })} 
                    disabled={isMonitoring}
                  />
                </div>
                <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                  <span className="text-[10px] font-bold uppercase">Partial Add Up</span>
                  <Switch 
                    checked={executionSettings.isPartialAddUpEnabled} 
                    onCheckedChange={(val) => setExecutionSettings({ isPartialAddUpEnabled: val })} 
                    disabled={isMonitoring || !executionSettings.isAddUpEnabled}
                  />
                </div>
                <div className="space-y-1.5">
                   <Label className="text-[9px] font-bold uppercase text-muted-foreground">Steps to Win</Label>
                   <Input 
                     type="number" 
                     min="1"
                     className="h-10 font-code font-bold bg-background border-white/10" 
                     value={executionSettings.addUpSteps || ''} 
                     onChange={(e) => setExecutionSettings({ addUpSteps: e.target.value })} 
                     disabled={isMonitoring}
                   />
                </div>
             </div>
          </div>

          <div className="space-y-4">
             <Label className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-wider">
               <Divide className="w-3.5 h-3.5" /> Divide Martingale
             </Label>
             <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
                <span className="text-[10px] font-bold uppercase">Enable Split</span>
                <Switch 
                  checked={executionSettings.isDivideMartingaleEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isDivideMartingaleEnabled: val, isAddUpEnabled: val ? false : executionSettings.isAddUpEnabled, isAutoMartingaleEnabled: val ? false : executionSettings.isAutoMartingaleEnabled })} 
                  disabled={isMonitoring}
                />
              </div>
              <div className="space-y-1.5">
                 <Label className="text-[9px] font-bold uppercase text-muted-foreground">Split steps</Label>
                 <Input 
                   type="number" 
                   min="2"
                   className="h-10 font-code font-bold bg-background border-white/10" 
                   value={executionSettings.divideMartingaleSteps || ''} 
                   onChange={(e) => setExecutionSettings({ divideMartingaleSteps: e.target.value })} 
                   disabled={isMonitoring}
                 />
              </div>
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
                  checked={executionSettings.isAutoMartingaleEnabled} 
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
                  checked={executionSettings.isStepMartingaleEnabled} 
                  onCheckedChange={(val) => setExecutionSettings({ isStepMartingaleEnabled: val })} 
                  disabled={isMonitoring}
                />
              </div>
          </div>
        </div>

        <div className="space-y-4 border-t border-white/5 pt-4">
           <Label className="text-[10px] font-black uppercase text-accent flex items-center gap-1.5 tracking-wider">
             <Crosshair className="w-3.5 h-3.5" /> Virtual Win Protocol
           </Label>
           <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold uppercase">Enable Protocol</span>
                <span className="text-[7px] text-muted-foreground uppercase italic leading-none mt-1">Virtual hunt on real loss</span>
              </div>
              <Switch 
                checked={executionSettings.isVirtualHookEnabled} 
                onCheckedChange={(val) => setExecutionSettings({ isVirtualHookEnabled: val })} 
                disabled={isMonitoring}
              />
            </div>
            <div className="space-y-1.5">
               <Label className="text-[9px] font-bold uppercase text-muted-foreground">Required Virtual Wins</Label>
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

        {isMonitoring && protocolStatus.message && (
          <div className="p-3 rounded-xl bg-primary/10 border border-primary/30 animate-in fade-in slide-in-from-top-2 duration-300">
             <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-black uppercase text-primary flex items-center gap-1.5 tracking-widest">
                   <Binary className="w-3 h-3" /> Neural Cycle Dashboard
                </span>
             </div>
             <p className="text-[9px] font-bold text-foreground/90 uppercase italic">
                {protocolStatus.message}
             </p>
          </div>
        )}

        <Button 
          className={cn(
            "w-full h-14 text-sm font-black uppercase tracking-widest transition-all",
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
               {isPatternMode ? 'Syncing Sequence Matrix' : isHunterEnabled ? 'Executing Hunter Overdrive' : 'Monitoring Sequential Flow'}
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[180px]">
              {currentMartingaleLevel > 0 ? `RECOVERY LEVEL ${currentMartingaleLevel}` : 'Monitoring Protocol Stability...'}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
