
"use client";

import React from 'react';
import { CalculationDexControls } from './calculation-dex-controls';
import { AnalysisResults } from './analysis-results';
import { TradeHistory } from '@/components/dashboard/trade-history';

export function CalculationDexView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6 items-start">
      {/* LEFT: Top 10 High-Confidence Patterns */}
      <div className="lg:col-span-3 flex flex-col">
         <AnalysisResults />
      </div>

      {/* CENTER: Neural Discovery Engine Controls */}
      <div className="lg:col-span-6 space-y-4 md:space-y-6">
         <CalculationDexControls />
      </div>

      {/* RIGHT: Trade History Pulse */}
      <div className="lg:col-span-3 flex flex-col h-full overflow-hidden">
         <TradeHistory className="flex-1" />
      </div>
    </div>
  );
}
