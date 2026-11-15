"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Gavel, TrendingUp, TrendingDown, Wallet, Loader2, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';

export function TradeControls() {
  const { 
    placeTrade, authState, strategyType, strategyParams, setStrategyParams, isAutoTrading, 
    executionSettings, setExecutionSettings 
  } = useDeriv();
  
  const handleTrade = (type: string) => {
    let barrier: number | undefined;
    if (type === 'over') barrier = parseInt(strategyParams.overBarrier || '4');
    if (type === 'under') barrier = parseInt(strategyParams.underBarrier || '5');
    placeTrade({ type, barrier });
  };

  const getButtonLabels = () => {
    switch (strategyType) {
      case 'even_odd':
        return { up: 'even', down: 'odd', upLabel: 'BUY EVEN', downLabel: 'BUY ODD' };
      case 'over_under':
        return { up: 'over', down: 'under', upLabel: `BUY OVER ${strategyParams.overBarrier || '4'}`, downLabel: `BUY UNDER ${strategyParams.underBarrier || '5'}` };
      default:
        return { up: 'rise', down: 'fall', upLabel: 'BUY / RISE', downLabel: 'SELL / FALL' };
    }
  };

  const labels = getButtonLabels();

  return (
    <Card className="shadow-md h-full border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-3 border-b border-white/5 bg-background rounded-t-xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm md:text-md font-bold flex items-center gap-2 text-foreground">
            <Gavel className="w-4 h-4 text-primary" />
            Console
          </CardTitle>
          <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10 shadow-sm">
            <Wallet className="w-3 h-3 text-primary" />
            <span className="text-[9px] md:text-[11px] font-bold text-foreground">
              {authState.balance?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0.00'}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-3 md:pt-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Stake ($)</Label>
            <Input type="number" className="h-9 text-xs md:text-sm font-code font-bold bg-background border-white/10" value={executionSettings.stake} onChange={(e) => setExecutionSettings({ stake: e.target.value })} disabled={isAutoTrading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground">Matica</Label>
            <Input type="number" step="0.1" className="h-9 text-xs md:text-sm font-code font-bold bg-background border-white/10" value={executionSettings.martingale} onChange={(e) => setExecutionSettings({ martingale: e.target.value })} disabled={isAutoTrading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-primary">Hook</Label>
            <Input type="number" min="0" className="h-9 text-xs md:text-sm font-code font-bold border-primary/20 bg-background" value={executionSettings.virtualHook} onChange={(e) => setExecutionSettings({ virtualHook: e.target.value })} disabled={isAutoTrading} />
          </div>
          
          {strategyType === 'over_under' && (
            <>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold uppercase text-primary">Over Pred.</Label>
                <Input type="number" min="0" max="9" className="h-9 text-xs md:text-sm font-code font-bold border-primary/20 bg-background" value={strategyParams.overBarrier} onChange={(e) => setStrategyParams({ overBarrier: e.target.value })} disabled={isAutoTrading} />
              </div>
              <div className="space-y-1.5">
                <Label className="text-[9px] font-bold uppercase text-primary">Under Pred.</Label>
                <Input type="number" min="0" max="9" className="h-9 text-xs md:text-sm font-code font-bold border-primary/20 bg-background" value={strategyParams.underBarrier} onChange={(e) => setStrategyParams({ underBarrier: e.target.value })} disabled={isAutoTrading} />
              </div>
            </>
          )}

          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-green-500">TP</Label>
            <Input type="number" className="h-9 text-xs md:text-sm border-green-500/30 font-code font-bold bg-background" value={executionSettings.takeProfit} onChange={(e) => setExecutionSettings({ takeProfit: e.target.value })} disabled={isAutoTrading} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-red-500">SL</Label>
            <Input type="number" className="h-9 text-xs md:text-sm border-red-500/30 font-code font-bold bg-background" value={executionSettings.stopLoss} onChange={(e) => setExecutionSettings({ stopLoss: e.target.value })} disabled={isAutoTrading} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <Button variant="default" className="bg-green-600 hover:bg-green-700 h-12 text-sm font-bold shadow-lg shadow-green-900/20" onClick={() => handleTrade(labels.up)} disabled={isAutoTrading}>
            {isAutoTrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingUp className="w-4 h-4 mr-2" />}
            {labels.upLabel}
          </Button>
          <Button variant="destructive" className="bg-red-600 hover:bg-red-700 h-12 text-sm font-bold shadow-lg shadow-red-900/20" onClick={() => handleTrade(labels.down)} disabled={isAutoTrading}>
            {isAutoTrading ? <Loader2 className="w-4 h-4 animate-spin" /> : <TrendingDown className="w-4 h-4 mr-2" />}
            {labels.downLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
