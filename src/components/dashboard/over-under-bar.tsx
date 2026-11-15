
"use client";

import React, { useMemo } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { TrendingUp, TrendingDown, Activity, CircleDot, Binary } from 'lucide-react';
import { cn } from '@/lib/utils';

export function OverUnderBar() {
  const { currentTicks, selectedSymbol, strategyParams, activeRobotId } = useDeriv();

  const stats = useMemo(() => {
    // High-Standard 10,000 Tick Dominance Sweep
    const stream = currentTicks.slice(0, 10000);
    
    // Determine mode
    const isContinuity = activeRobotId === 'continuity';
    const isEvenOddMode = isContinuity && strategyParams.continuityContract === 'even_odd';
    
    if (stream.length === 0) {
      return { 
        left: 0, right: 0, total: 0, 
        leftLabel: isEvenOddMode ? 'Even' : 'Over', 
        rightLabel: isEvenOddMode ? 'Odd' : 'Under' 
      };
    }

    // Barrier parsing
    const overBarrierStr = (strategyParams.overBarrier || '4').split(',')[0].trim();
    const underBarrierStr = (strategyParams.underBarrier || '5').split(',')[0].trim();
    const overBarrier = parseInt(overBarrierStr);
    const underBarrier = parseInt(underBarrierStr);
    
    const precision = selectedSymbol.includes('100') ? 2 : 3;
    
    let leftCount = 0;
    let rightCount = 0;

    stream.forEach(tick => {
      const str = tick.quote.toFixed(precision);
      const digit = parseInt(str.charAt(str.length - 1));
      if (!isNaN(digit)) {
        if (isEvenOddMode) {
          if (digit % 2 === 0) leftCount++;
          else rightCount++;
        } else {
          if (digit > overBarrier) leftCount++;
          if (digit < underBarrier) rightCount++;
        }
      }
    });

    return {
      left: (leftCount / stream.length) * 100,
      right: (rightCount / stream.length) * 100,
      total: stream.length,
      leftLabel: isEvenOddMode ? 'Even' : `Over ${overBarrier}`,
      rightLabel: isEvenOddMode ? 'Odd' : `Under ${underBarrier}`
    };
  }, [currentTicks, selectedSymbol, strategyParams.overBarrier, strategyParams.underBarrier, strategyParams.continuityContract, activeRobotId]);

  // Show dominance stats for Magic and Continuity
  if (activeRobotId !== 'over_under_magic' && activeRobotId !== 'continuity') return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
      <div className="bg-card border border-white/5 rounded-xl p-3 md:p-4 space-y-3 shadow-sm hover:border-primary/20 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
              {stats.leftLabel.includes('Even') ? <CircleDot className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-foreground/90 tracking-widest leading-none">{stats.leftLabel} Dominance</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">Samples: {stats.total}/10000 Ticks</span>
            </div>
          </div>
          <span className="text-sm font-code font-black text-green-500 tabular-nums">{stats.left.toFixed(1)}%</span>
        </div>
        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)] transition-all duration-700 ease-out"
            style={{ width: `${stats.left}%` }}
          />
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-xl p-3 md:p-4 space-y-3 shadow-sm hover:border-primary/20 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
              {stats.rightLabel.includes('Odd') ? <Binary className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] font-black uppercase text-foreground/90 tracking-widest leading-none">{stats.rightLabel} Dominance</span>
              <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-tighter mt-1">Samples: {stats.total}/10000 Ticks</span>
            </div>
          </div>
          <span className="text-sm font-code font-black text-red-500 tabular-nums">{stats.right.toFixed(1)}%</span>
        </div>
        <div className="relative h-2 w-full bg-white/5 rounded-full overflow-hidden">
          <div 
            className="absolute top-0 left-0 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)] transition-all duration-700 ease-out"
            style={{ width: `${stats.right}%` }}
          />
        </div>
      </div>
    </div>
  );
}
