"use client";

import React from 'react';
import { DigitMatchControls } from './digit-match-controls';
import { DigitMatchAnalysisPanel } from './digit-match-analysis-panel';
import { TradeHistory } from '@/components/dashboard/trade-history';
import { useDeriv } from '@/components/deriv-provider';

export function DigitMatchView() {
  const { strategyParams, isMonitoring } = useDeriv();
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div className="lg:col-span-8 space-y-4 md:space-y-6">
         <DigitMatchControls />
      </div>
      <div className="lg:col-span-4 flex flex-col gap-4">
         {strategyParams.matchStrategy === 'scanner' && isMonitoring && <DigitMatchAnalysisPanel />}
         <TradeHistory className="flex-1" />
      </div>
    </div>
  );
}
