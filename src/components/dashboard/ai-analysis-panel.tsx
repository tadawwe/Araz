
"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { BrainCircuit, Timer, Play, Square, Zap, Bot, TrendingUp, Loader2, Target as HunterIcon } from 'lucide-react';
import { calculateSimulationProfit } from '@/lib/simulation-engine';
import { cn } from '@/lib/utils';

const DigitScrambler = () => {
  const [digit, setDigit] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setDigit(Math.floor(Math.random() * 10));
    }, 40); 
    return () => clearInterval(interval);
  }, []);
  return <span className="text-2xl font-code font-black text-primary/30 tabular-nums select-none">{digit}</span>;
};

export function AIAnalysisPanel() {
  const { 
    currentTicks, selectedSymbol, strategyType, setStrategyType, strategyParams, setStrategyParams,
    placeTrade, isBotEnabled, setIsBotEnabled, isHunterEnabled, setIsHunterEnabled, dynamicPayout, 
    fetchProposal, isMonitoring, setIsMonitoring, isAutoTrading, currentMartingaleLevel, isWaitingForSignal
  } = useDeriv();
  const [ticksCount, setTicksCount] = useState<string>('25');
  const [prediction, setPrediction] = useState<string | null>(null);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [predictionStatus, setPredictionStatus] = useState<'pending' | 'success' | 'missed' | null>(null);
  const [signalLashed, setSignalLashed] = useState(false);
  const lastProcessedEpoch = useRef<number | null>(null);

  // Sync internal state with provider's signal readiness
  useEffect(() => {
    if (isWaitingForSignal && predictionStatus !== null) {
      setPredictionStatus(null);
      setPrediction(null);
      setCountdown(null);
      setSignalLashed(false);
    }
  }, [isWaitingForSignal, predictionStatus]);

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (countdown !== null && countdown > 0 && predictionStatus === 'pending') {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && predictionStatus === 'pending') {
      setPredictionStatus('missed');
      const resetTimer = setTimeout(() => { 
        setPrediction(null); 
        setPredictionStatus(null); 
        setCountdown(null); 
      }, 3000);
      return () => clearTimeout(resetTimer);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, predictionStatus]);

  useEffect(() => {
    if (!isMonitoring || currentTicks.length < parseInt(ticksCount)) {
      setSignalLashed(false);
      return;
    }
    
    // Only block if a trade is currently executing
    if (predictionStatus === 'pending' || (isAutoTrading && !isWaitingForSignal)) return;

    const currentTick = currentTicks[0];
    if (!currentTick || currentTick.epoch === lastProcessedEpoch.current) return;
    lastProcessedEpoch.current = currentTick.epoch;

    const tickValues = currentTicks.slice(0, parseInt(ticksCount)).map(t => t.quote);
    const lastDigits = tickValues.map(v => {
      const precision = selectedSymbol.includes('100') ? 2 : 3;
      const str = v.toFixed(precision);
      return parseInt(str.charAt(str.length - 1));
    });

    const total = lastDigits.length;
    if (total === 0) return;

    let currentSignalType: string | null = null;

    if (strategyType === 'even_odd') {
      const evenCount = lastDigits.filter(d => d % 2 === 0).length;
      const oddCount = total - evenCount;
      if (evenCount / total >= 0.7) {
        currentSignalType = 'EVEN';
      } else if (oddCount / total >= 0.7) {
        currentSignalType = 'ODD';
      }
    } else if (strategyType === 'over_under') {
      const overBarrier = parseInt(strategyParams.overBarrier || '4');
      const underBarrier = parseInt(strategyParams.underBarrier || '5');
      const overCount = lastDigits.filter(d => d > overBarrier).length;
      const underCount = lastDigits.filter(d => d < underBarrier).length;

      if (overCount / total >= 0.7) {
        currentSignalType = 'OVER';
      } else if (underCount / total >= 0.7) {
        currentSignalType = 'UNDER';
      }
    }

    if (currentSignalType && !signalLashed) {
      setSignalLashed(true);
      triggerPrediction(currentSignalType);
    } else if (!currentSignalType) {
      setSignalLashed(false);
    }
  }, [currentTicks, isMonitoring, predictionStatus, strategyType, strategyParams, selectedSymbol, ticksCount, isAutoTrading, isWaitingForSignal, signalLashed]);

  const triggerPrediction = (type: string) => {
    setPrediction(type); 
    setPredictionStatus('pending'); 
    setCountdown(10);
    
    let barrier: number | undefined;
    if (type === 'OVER') barrier = parseInt(strategyParams.overBarrier || '4');
    if (type === 'UNDER') barrier = parseInt(strategyParams.underBarrier || '5');
    
    fetchProposal(type, barrier);
    
    if (isBotEnabled) {
      placeTrade({ type: type.toLowerCase(), barrier });
    }
  };

  const currentStake = parseFloat((1 * Math.pow(2.1, currentMartingaleLevel)).toFixed(2));
  const activeBarrier = prediction === 'OVER' ? parseInt(strategyParams.overBarrier || '4') : 
                        prediction === 'UNDER' ? parseInt(strategyParams.underBarrier || '5') : undefined;
  const netProfit = calculateSimulationProfit(currentStake, prediction || 'even', dynamicPayout || undefined, activeBarrier);

  return (
    <Card className="shadow-lg border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-2 bg-background border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-sm md:text-lg font-bold flex items-center gap-2 text-primary">
            <BrainCircuit className="w-4 h-4 md:w-5 h-5" /> 
            AI Intel
          </CardTitle>
          <div className="flex items-center gap-3">
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/10 shadow-sm">
               <Bot className={cn("w-3 h-3", isBotEnabled ? "text-primary" : "text-muted-foreground")} />
               <span className="text-[8px] font-bold uppercase text-foreground/80">Bot</span>
               <Switch checked={isBotEnabled} onCheckedChange={setIsBotEnabled} className="h-4 w-8" />
             </div>
             <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/5 rounded-full border border-white/10 shadow-sm">
               <HunterIcon className={cn("w-3 h-3", isHunterEnabled ? "text-primary" : "text-muted-foreground")} />
               <span className="text-[8px] font-bold uppercase text-foreground/80">Hunter</span>
               <Switch checked={isHunterEnabled} onCheckedChange={setIsHunterEnabled} className="h-4 w-8" />
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:pt-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Samples</Label>
            <Select value={ticksCount} onValueChange={setTicksCount} disabled={isMonitoring}>
              <SelectTrigger className="h-9 text-xs font-medium bg-background border-white/10"><SelectValue /></SelectTrigger>
              <SelectContent>
                {['10', '15', '20', '25', '30'].map(s => <SelectItem key={s} value={s} className="text-xs">{s} Ticks</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Pattern</Label>
            <Select value={strategyType} onValueChange={(v: any) => setStrategyType(v)} disabled={isMonitoring}>
              <SelectTrigger className="h-9 text-xs font-medium bg-background border-white/10"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="even_odd" className="text-xs">Even/Odd</SelectItem>
                <SelectItem value="over_under" className="text-xs">Over/Under</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button className={cn("w-full h-10 text-xs font-bold", isMonitoring ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20")} onClick={() => setIsMonitoring(!isMonitoring)}>
          {isMonitoring ? <><Square className="w-3.5 h-3.5 mr-2" /> STOP</> : <><Play className="w-3.5 h-3.5 mr-2" /> START</>}
        </Button>

        {isMonitoring && !predictionStatus && (
          <div className="p-4 rounded-xl border-2 border-dashed border-primary/20 bg-background flex flex-col items-center justify-center gap-3 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2 text-[10px] font-bold text-primary uppercase tracking-[0.2em] animate-pulse">
               <Loader2 className="w-3 h-3 animate-spin" />
               Scanning Stream
            </div>
            <div className="flex gap-2">
               {[...Array(8)].map((_, i) => (
                 <DigitScrambler key={i} />
               ))}
            </div>
            <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest text-center border-t border-dashed border-white/10 pt-2 w-full max-w-[180px]">
              {currentMartingaleLevel > 0 ? (isWaitingForSignal ? 'Waiting for New Signal...' : `RECOVERY LEVEL ${currentMartingaleLevel}`) : 'Analyzing Trend Confidence...'}
            </span>
          </div>
        )}

        {predictionStatus && (
          <div className={cn(
            "p-3 md:p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 animate-in zoom-in-95 duration-300",
            predictionStatus === 'missed' ? "bg-background border-white/10 opacity-70" : "bg-primary/10 border-primary/30"
          )}>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              {predictionStatus === 'missed' ? 'Signal Expired' : 'Anomaly Detected'}
            </span>
            <span className={cn(
              "text-xl font-black uppercase tracking-tighter",
              predictionStatus === 'missed' ? "text-muted-foreground" : "text-primary"
            )}>
              {prediction} Expected
            </span>
            
            {predictionStatus !== 'missed' && (
              <div className="flex items-center gap-1.5 px-3 py-1 bg-green-500/20 rounded-full text-green-400 font-bold text-[10px] uppercase">
                <TrendingUp className="w-3 h-3" /> Potential Profit: ${netProfit.toFixed(2)}
              </div>
            )}

            <div className="grid grid-cols-2 w-full gap-2 mt-1">
               <div className="bg-background p-2 rounded-lg border border-white/10 shadow-sm flex flex-col items-center">
                  <span className="text-[8px] font-bold uppercase opacity-50 flex items-center gap-1"><Timer className="w-2.5 h-2.5" /> Window</span>
                  <span className="text-lg font-code font-bold text-primary">{countdown ?? (predictionStatus === 'missed' ? '0' : '10')}s</span>
               </div>
               <div className="bg-background p-2 rounded-lg border border-white/10 shadow-sm flex flex-col items-center">
                  <span className="text-[8px] font-bold uppercase opacity-50 flex items-center gap-1"><Zap className="w-2.5 h-2.5" /> Live</span>
                  <span className="text-lg font-code font-bold text-primary">
                    {(() => {
                      const quote = currentTicks[0]?.quote;
                      if (!quote) return '-';
                      const precision = selectedSymbol.includes('100') ? 2 : 3;
                      const str = quote.toFixed(precision);
                      return str.charAt(str.length - 1);
                    })()}
                  </span>
               </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
