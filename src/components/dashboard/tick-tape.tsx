
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, Minus, Activity } from 'lucide-react';

export function TickTape() {
  const { currentTicks, selectedSymbol } = useDeriv();
  const displayTicks = currentTicks.slice(0, 10);

  const getMarketPrecision = (symbol: string): number => {
    if (symbol.includes('100')) return 2;
    if (symbol.includes('75') || symbol.includes('50')) return 4;
    if (symbol.includes('10') || symbol.includes('25')) return 3;
    return 2;
  };

  const renderTick = (tick: any, index: number) => {
    const globalIndex = currentTicks.indexOf(tick);
    const prevTick = currentTicks[globalIndex + 1];
    const isUp = prevTick ? tick.quote > prevTick.quote : null;
    
    const precision = getMarketPrecision(selectedSymbol);
    const str = tick.quote.toFixed(precision);
    const digit = str.charAt(str.length - 1);
    
    return (
      <div 
        key={`${tick.id || tick.epoch}-${index}`} 
        className={cn(
          "flex-1 min-w-0 h-14 md:h-16 rounded-lg border flex flex-col items-center justify-center transition-all duration-300",
          isUp === true ? "bg-green-500/10 border-green-500/20 text-green-500" : 
          isUp === false ? "bg-red-500/10 border-red-500/20 text-red-500" : 
          "bg-white/5 border-white/10 text-muted-foreground"
        )}
      >
        <span className="text-[8px] md:text-[10px] font-bold leading-none mb-0.5">
          {isUp === true ? <TrendingUp className="w-2.5 h-2.5" /> : 
           isUp === false ? <TrendingDown className="w-2.5 h-2.5" /> : 
           <Minus className="w-2.5 h-2.5" />}
        </span>
        <span className="text-lg md:text-xl font-code font-bold leading-none tabular-nums">{digit}</span>
        <span className="text-[7px] md:text-[8px] opacity-60 mt-0.5 font-mono">
          .{str.split('.')[1]}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="bg-card border border-white/5 rounded-xl p-2 md:p-5 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between mb-2 md:mb-4 px-1">
          <h3 className="text-[9px] md:text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></div>
            Live Stream
          </h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-1 text-[8px] md:text-[10px] text-green-500 font-bold uppercase">
               <TrendingUp className="w-3 h-3" /> Bull
            </div>
            <div className="flex items-center gap-1 text-[8px] md:text-[10px] text-red-500 font-bold uppercase">
               <TrendingDown className="w-3 h-3" /> Bear
            </div>
          </div>
        </div>
        
        <div className="space-y-1.5 md:space-y-3">
          {displayTicks.length === 0 ? (
            <div className="w-full flex justify-center py-6 text-[10px] text-muted-foreground animate-pulse font-medium">
              Syncing {selectedSymbol} stream...
            </div>
          ) : (
            <div className="grid grid-cols-5 md:grid-cols-10 gap-1 md:gap-2">
              {displayTicks.map((tick, i) => renderTick(tick, i))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
