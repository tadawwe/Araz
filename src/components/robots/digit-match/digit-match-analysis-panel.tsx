
"use client";

import React, { useMemo } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Binary, Search, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function DigitMatchAnalysisPanel() {
  const { currentTicks, selectedSymbol, executionSettings, matchedDigits, isMonitoring, strategyParams } = useDeriv();
  
  const analysis = useMemo(() => {
    const samplesCount = parseInt(executionSettings.tickSample || '30');
    const analyzeCount = parseInt(executionSettings.digitsToAnalyze || '1');
    const stream = currentTicks.slice(0, samplesCount);
    
    const counts: Record<number, number> = {};
    for (let i = 0; i < 10; i++) counts[i] = 0;
    
    const precision = selectedSymbol.includes('100') ? 2 : 3;
    
    stream.forEach(tick => {
      const str = tick.quote.toFixed(precision);
      const digit = parseInt(str.charAt(str.length - 1));
      if (!isNaN(digit)) counts[digit]++;
    });
    
    // Determine target digits based on matched (missing) digits
    const targetDigits = matchedDigits.slice(0, analyzeCount);
    const isReady = matchedDigits.length >= analyzeCount;
    
    return { counts, samplesLoaded: stream.length, samplesRequired: samplesCount, analyzeCount, targetDigits, isReady };
  }, [currentTicks, selectedSymbol, executionSettings.tickSample, executionSettings.digitsToAnalyze, matchedDigits]);

  if (!isMonitoring || strategyParams.matchStrategy !== 'scanner') return null;

  return (
    <Card className="shadow-lg border-primary/20 bg-card overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500">
      <CardHeader className="p-3 bg-background border-b border-white/5">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2 text-primary">
            <Search className="w-4 h-4" />
            Missing Digit Scanner
          </CardTitle>
          <Badge variant="outline" className="text-[9px] font-bold border-primary/20 text-primary">
            WINDOW: {analysis.samplesLoaded}/{analysis.samplesRequired}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-5 gap-2">
          {[...Array(10)].map((_, i) => {
            const count = analysis.counts[i];
            const isTarget = analysis.targetDigits.includes(i);
            const isMissing = count === 0;
            
            return (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col items-center justify-center p-2 rounded-lg border transition-all duration-300",
                  isTarget ? "bg-primary/20 border-primary shadow-lg shadow-primary/10" : 
                  isMissing ? "bg-white/5 border-dashed border-white/40" : 
                  "bg-background border-white/5 opacity-40"
                )}
              >
                <span className={cn(
                  "text-lg font-code font-black",
                  isTarget ? "text-primary" : "text-foreground"
                )}>
                  {i}
                </span>
                <span className="text-[8px] font-bold uppercase opacity-60">
                  {count}x
                </span>
              </div>
            );
          })}
        </div>

        <div className="pt-2 border-t border-dashed border-white/10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                <Binary className="w-3 h-3" /> Targeted Sequence
              </span>
              {analysis.isReady ? (
                <span className="flex items-center gap-1 text-[8px] font-bold text-green-500 uppercase">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Ready to Hunt
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[8px] font-bold text-orange-400 uppercase">
                  <AlertCircle className="w-2.5 h-2.5" /> Waiting for {analysis.analyzeCount} Missing
                </span>
              )}
            </div>
            <div className="h-10 px-3 bg-background rounded-xl border border-white/10 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {analysis.targetDigits.length > 0 ? (
                analysis.targetDigits.map(d => (
                  <div key={d} className="flex items-center gap-1 bg-primary/20 px-3 py-1 rounded border border-primary/30 shrink-0">
                    <span className="text-xs font-black text-primary uppercase">Match {d}</span>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 text-[9px] font-bold text-muted-foreground uppercase italic">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
                  Analyzing {analysis.samplesRequired} Ticks for Patterns...
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
