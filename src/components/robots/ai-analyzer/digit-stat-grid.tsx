
"use client";

import React, { useMemo } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardContent } from '@/components/ui/card';
import { getDigit } from '@/lib/simulation-engine';
import { cn } from '@/lib/utils';
import { Activity, Target, ShieldAlert, TrendingUp } from 'lucide-react';

export function DigitStatGrid() {
  const { currentTicks, selectedSymbol, isMonitoring, strategyType, strategyParams } = useDeriv();

  const stats = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 0; i < 10; i++) counts[i] = 0;

    const samples = currentTicks.slice(0, 10000);
    samples.forEach(t => {
      const d = getDigit(t.quote, selectedSymbol);
      if (!isNaN(d)) counts[d]++;
    });

    const total = samples.length || 1;
    return Object.entries(counts).map(([digit, count]) => ({
      digit: parseInt(digit),
      count,
      percentage: (count / total) * 100
    }));
  }, [currentTicks, selectedSymbol]);

  const lastDigit = useMemo(() => {
    if (currentTicks.length === 0) return null;
    return getDigit(currentTicks[0].quote, selectedSymbol);
  }, [currentTicks, selectedSymbol]);

  return (
    <Card className="bg-card border-white/5 shadow-2xl overflow-hidden">
      <div className="bg-white/5 px-4 py-3 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
           <h3 className="text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" /> Neural statistical matrix
          </h3>
          <div className="px-2 py-0.5 rounded bg-primary/20 border border-primary/30 text-[8px] font-black text-primary uppercase">
            Window: {currentTicks.length}/10000 Ticks
          </div>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-1.5">
             <div className={cn("w-2 h-2 rounded-full", currentTicks.length >= 10000 ? "bg-green-500 animate-pulse" : "bg-orange-400")} />
             <span className="text-[9px] font-bold text-muted-foreground uppercase">
               {currentTicks.length >= 10000 ? 'Analysis Ready' : 'Syncing Neural Buffer'}
             </span>
           </div>
        </div>
      </div>
      <CardContent className="p-4 md:p-6 space-y-6">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2 md:gap-3">
          {stats.map(({ digit, percentage }) => {
            const isActive = lastDigit === digit;
            
            // Apply highlighting logic during active monitoring
            let highlightClass = "bg-background border-white/5 opacity-80";
            if (isMonitoring) {
              if (percentage >= 10) {
                highlightClass = "bg-green-500/10 border-green-500/30 text-green-400 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
              } else {
                highlightClass = "bg-red-500/10 border-red-500/30 text-red-400";
              }
            }

            return (
              <div 
                key={digit}
                className={cn(
                  "relative flex flex-col items-center justify-center p-3 rounded-xl border transition-all duration-300",
                  isActive && !isMonitoring ? "bg-primary/20 border-primary scale-105 z-10" : highlightClass
                )}
              >
                {isActive && (
                  <div className="absolute -top-1.5 -right-1.5">
                    <div className="bg-primary p-0.5 rounded-full shadow-lg">
                      <Target className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                )}
                <span className={cn(
                  "text-xl md:text-2xl font-code font-black mb-1",
                  isActive ? "text-primary" : ""
                )}>
                  {digit}
                </span>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold tabular-nums">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {isMonitoring && (
          <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShieldAlert className="w-5 h-5" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase text-foreground">AI Intelligence Stream</span>
                  <p className="text-[8px] text-muted-foreground uppercase font-medium">
                    Looking for {strategyParams.aiGreaterCount} digits {"≥"} 10% and {strategyParams.aiLesserCount} failing digits
                  </p>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="flex flex-col items-end">
                  <span className="text-[8px] font-bold text-green-500 uppercase tracking-widest">Target Mode</span>
                  <span className="text-xs font-black uppercase text-foreground">{strategyType.replace('_', ' ')} Protocol</span>
               </div>
               <TrendingUp className="w-4 h-4 text-primary animate-pulse" />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
