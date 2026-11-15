"use client";

import React from 'react';
import { ContinuityControls } from './continuity-controls';
import { TradeHistory } from '@/components/dashboard/trade-history';

export function ContinuityView() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 md:gap-6">
      <div className="lg:col-span-8 space-y-4 md:space-y-6">
         <ContinuityControls />
      </div>
      <div className="lg:col-span-4 flex flex-col">
         <TradeHistory className="flex-1" />
      </div>
    </div>
  );
}
