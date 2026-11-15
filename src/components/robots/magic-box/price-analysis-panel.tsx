
"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, Microscope, Target, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getMarketPrecision } from '@/lib/simulation-engine';

export function PriceAnalysisPanel() {
  const { currentTicks, executionSettings, selectedSymbol, strategyParams, strategyType, isMonitoring, magicSignal } = useDeriv();
  const [cooldown, setCooldown] = useState(0);

  const analysis = useMemo(() => {
    if (currentTicks.length < 2) return null;

    const currentPrice = currentTicks[0].quote;
    const prevPrice = currentTicks[1].quote;
    const diff = currentPrice - prevPrice;

    const sampleSize = parseInt(executionSettings.tickSample || '100');
    const samples = currentTicks.slice(0, sampleSize);
    
    let totalAbsDiff = 0;
    let count = 0;

    for (let i = 0; i < samples.length - 1; i++) {
      totalAbsDiff += Math.abs(samples[i].quote - samples[i+1].quote);
      count++;
    }

    const avgDiff = count > 0 ? totalAbsDiff / count : 0;
    const precision = getMarketPrecision(selectedSymbol);

    const plusPrice = currentPrice + avgDiff;
    const minusPrice = currentPrice - avgDiff;

    const getDigitVal = (price: number) => {
      const str = price.toFixed(precision);
      return parseInt(str.charAt(str.length - 1));
    };

    const plusDigit = getDigitVal(plusPrice);
    const minusDigit = getDigitVal(minusPrice);

    return {
      currentPrice,
      prevPrice,
      diff,
      avgDiff,
      sampleCount: samples.length,
      plusPrice,
      minusPrice,
      plusDigit,
      minusDigit,
      precision
    };
  }, [currentTicks, executionSettings.tickSample, selectedSymbol]);

  // Handle Cooldown Visuals (5-Second Sync)
  useEffect(() => {
    if (magicSignal && cooldown === 0 && isMonitoring) {
      setCooldown(5);
    }
  }, [magicSignal, isMonitoring]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  if (!analysis) {
    return (
      <Card className="bg-card border-white/5 p-12 flex flex-col items-center justify-center text-center">
        <Activity className="w-12 h-12 text-primary/20 animate-pulse mb-4" />
        <h3 className="text-lg font-black uppercase text-muted-foreground tracking-widest">
          Syncing Magic Box Stream...
        </h3>
        <p className="text-xs text-muted-foreground/60 uppercase mt-2">Awaiting price handshake</p>
      </Card>
    );
  }

  const overB = parseInt(strategyParams.overBarrier || '4');
  const underB = parseInt(strategyParams.underBarrier || '5');

  const getShiftStatus = (digit: number) => {
    if (strategyType === 'even_odd') {
      return digit % 2 === 0 ? 'EVEN' : 'ODD';
    }
    if (digit > overB) return 'OVER';
    if (digit < underB) return 'UNDER';
    return 'NEUTRAL';
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Real Time Price */}
        <Card className="lg:col-span-4 bg-card border-primary/20 shadow-2xl overflow-hidden group">
          <CardHeader className="bg-background/50 border-b border-white/5 p-2 md:p-3">
            <CardTitle className="text-[9px] md:text-[10px] font-black uppercase text-primary tracking-widest flex items-center gap-2">
              <Activity className="w-3 h-3" /> Live Market Quote
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 space-y-4">
            <h2 className="text-2xl md:text-3xl font-code font-black text-foreground tracking-tighter tabular-nums truncate">
              {analysis.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 5 })}
            </h2>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase">Delta Pulse</span>
              <div className={cn(
                "flex items-center gap-1 font-code font-black text-[10px] md:text-xs tabular-nums",
                analysis.diff > 0 ? "text-green-500" : analysis.diff < 0 ? "text-red-500" : "text-muted-foreground"
              )}>
                {analysis.diff > 0 ? '+' : ''}{analysis.diff.toFixed(analysis.precision + 1)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Volatility Pulse */}
        <Card className="lg:col-span-3 bg-card border-accent/20 shadow-2xl overflow-hidden">
          <CardHeader className="bg-background/50 border-b border-white/5 p-2 md:p-3">
            <CardTitle className="text-[9px] md:text-[10px] font-black uppercase text-accent tracking-widest flex items-center gap-2">
              <TrendingUp className="w-3 h-3" /> Avg Velocity
            </CardTitle>
          </CardHeader>
          <CardContent className="p-3 md:p-4 space-y-4">
            <h2 className="text-2xl md:text-3xl font-code font-black text-accent tracking-tighter tabular-nums">
              {analysis.avgDiff.toFixed(analysis.precision + 1)}
            </h2>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-[7px] md:text-[8px] font-bold text-muted-foreground uppercase">Window</span>
              <span className="text-[10px] font-bold text-foreground">{analysis.sampleCount} Ticks</span>
            </div>
          </CardContent>
        </Card>

        {/* Neural Signal Directive */}
        <Card className={cn(
          "lg:col-span-5 bg-card border-2 shadow-2xl overflow-hidden transition-all duration-500",
          magicSignal?.type.match(/even|over/) ? "border-green-500/40 bg-green-500/5 shadow-green-900/10" :
          magicSignal?.type.match(/odd|under/) ? "border-red-500/40 bg-red-500/5 shadow-red-900/10" :
          "border-primary/20 bg-primary/5"
        )}>
          <CardHeader className="bg-white/5 border-b border-white/5 p-2 md:p-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                <Microscope className="w-3 h-3" /> Signal Authorization
              </CardTitle>
              {cooldown > 0 && (
                <Badge variant="outline" className="text-[8px] font-black uppercase border-orange-500/30 text-orange-400">
                  <Timer className="w-2 h-2 mr-1" /> RECAL: {cooldown}S
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="p-3 md:p-4 flex flex-col items-center justify-center min-h-[80px]">
            <span className={cn(
              "text-lg md:text-2xl font-black italic tracking-tighter text-center animate-in zoom-in-95 duration-500",
              magicSignal ? (magicSignal.type.match(/even|over/) ? "text-green-500" : "text-red-500") : "text-muted-foreground animate-pulse"
            )}>
              {cooldown > 0 ? 'SYNCHRONIZING PULSE...' : (magicSignal?.text || 'ANALYZING PATH PARITY...')}
            </span>
            {magicSignal && cooldown === 0 && (
              <div className="flex items-center gap-1.5 mt-1 px-2 py-0.5 bg-white/10 rounded-full border border-white/10">
                <Target className="w-2 h-2 text-primary" />
                <span className="text-[7px] md:text-[8px] font-black uppercase text-foreground">Authorized Pre-emption</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/5 border-white/10 shadow-sm overflow-hidden">
          <div className="p-2 md:p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Projection A</span>
              <span className="text-[9px] md:text-[10px] font-bold text-green-500 uppercase">Up-Shift</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[8px] md:text-[9px] font-bold text-foreground tabular-nums opacity-60">
                  {analysis.plusPrice.toFixed(analysis.precision)}
                </span>
                <Badge variant="outline" className={cn(
                  "text-[7px] md:text-[8px] font-black uppercase px-1 h-3 md:h-4",
                  getShiftStatus(analysis.plusDigit).match(/OVER|EVEN/) ? "text-green-400 border-green-500/20" : "text-red-400 border-red-500/20"
                )}>
                  {getShiftStatus(analysis.plusDigit)}
                </Badge>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg">
                <span className="text-lg md:text-xl font-code font-black text-primary">{analysis.plusDigit}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white/5 border-white/10 shadow-sm overflow-hidden">
          <div className="p-2 md:p-3 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[7px] md:text-[8px] font-black text-muted-foreground uppercase tracking-widest">Projection B</span>
              <span className="text-[9px] md:text-[10px] font-bold text-red-500 uppercase">Down-Shift</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[8px] md:text-[9px] font-bold text-foreground tabular-nums opacity-60">
                  {analysis.minusPrice.toFixed(analysis.precision)}
                </span>
                <Badge variant="outline" className={cn(
                  "text-[7px] md:text-[8px] font-black uppercase px-1 h-3 md:h-4",
                  getShiftStatus(analysis.minusDigit).match(/OVER|EVEN/) ? "text-green-400 border-green-500/20" : "text-red-400 border-red-500/20"
                )}>
                  {getShiftStatus(analysis.minusDigit)}
                </Badge>
              </div>
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/20 border border-primary/40 flex items-center justify-center shadow-lg">
                <span className="text-lg md:text-xl font-code font-black text-primary">{analysis.minusDigit}</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
