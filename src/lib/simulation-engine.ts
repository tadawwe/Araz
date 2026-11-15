
/**
 * @fileOverview Dedicated engine for Alchemist Profit Calculation.
 * Handles trade settlement with zero deductions, matching exact broker payouts.
 */

import { TradeHistoryItem } from './deriv-types';

// Use higher precision for internal math to prevent rounding of coefficients
export const INTERNAL_PRECISION = 8;
export const ROUNDING_PRECISION = 3; 

export interface SimulationResult {
  won: boolean;
  profit: number;
  newBalance: number;
  exitDigit: number;
}

/**
 * FIXED ALCHEMIST YIELDS (NET PROFIT FOR $1 STAKE)
 */
export const TARGET_NET_YIELDS: Record<string, number> = {
  // Over Protocol Fixed Yields - High Precision
  'over_0': 0.096,
  'over_1': 0.232,
  'over_2': 0.404,
  'over_3': 0.634,
  'over_4': 0.88, // Updated to 88% as requested
  'over_5': 1.427,
  'over_6': 2.205,
  'over_7': 3.717,
  'over_8': 7.929,
  'over_9': 0.00,
  
  // Under Protocol Fixed Yields - High Precision Mirror
  'under_9': 0.096, 
  'under_8': 0.232,
  'under_7': 0.404,
  'under_6': 0.634,
  'under_5': 0.88, // Updated to 88% as requested
  'under_4': 1.427,
  'under_3': 2.205,
  'under_2': 3.717,
  'under_1': 7.929,
  'under_0': 0.00,
  
  // Digit Match/Diff (Fixed Alchemist Standard - 790%)
  'match_any': 7.90, // CALIBRATED TO EXACTLY 790% AS REQUESTED
  'diff_any': 0.091
};

export function getMarketPrecision(symbol: string): number {
  const s = symbol.toUpperCase();
  if (s.includes('100')) return 2;
  if (s.includes('75') || s.includes('50')) return 4;
  if (s.includes('10') || s.includes('25')) return 3;
  return 2;
}

export function getDigit(quote: number, symbol: string): number {
  const precision = getMarketPrecision(symbol);
  const str = quote.toFixed(precision);
  return parseInt(str.charAt(str.length - 1));
}

export function calculateSimulationProfit(stake: number, type: string, dynamicPayout?: number, barrier?: number): number {
  const normalizedType = type.toLowerCase();
  const isEvenOdd = normalizedType.includes('even') || normalizedType.includes('odd');
  const isMatch = normalizedType.includes('match');
  const isDiff = normalizedType.includes('diff');
  
  let netProfit: number;

  if (isEvenOdd) {
    netProfit = stake * 0.88; // Updated to 88% as requested
  } else if (isMatch) {
    netProfit = stake * 7.90; // EXACTLY 790% AS REQUESTED
  } else if (isDiff) {
    netProfit = stake * 0.091;
  } else if (normalizedType.includes('over') || normalizedType.includes('under')) {
    const cleanType = normalizedType.includes('over') ? 'over' : 'under';
    const bValue = barrier !== undefined ? Math.floor(barrier) : 4;
    const key = `${cleanType}_${bValue}`;
    const baseYield = TARGET_NET_YIELDS[key] !== undefined ? TARGET_NET_YIELDS[key] : 0.88;
    netProfit = stake * baseYield;
  } else if (dynamicPayout && dynamicPayout > stake) {
    netProfit = dynamicPayout - stake;
  } else {
    netProfit = stake * 0.88; // Updated to 88% as requested
  }

  return Math.round(netProfit * 1000) / 1000;
}

export function settleSimulatedTrade(
  trade: TradeHistoryItem, 
  exitQuote: number, 
  currentBalance: number,
  symbol: string
): SimulationResult {
  let won = false;
  const contract = trade.contract_type;
  const barrier = trade.barrier !== undefined ? Number(trade.barrier) : 0;
  const lastDigit = getDigit(exitQuote, symbol);

  if (contract === 'DIGITEVEN') won = lastDigit % 2 === 0;
  else if (contract === 'DIGITODD') won = lastDigit % 2 !== 0;
  else if (contract === 'DIGITOVER') won = lastDigit > barrier;
  else if (contract === 'DIGITUNDER') won = lastDigit < barrier;
  else if (contract === 'DIGITMATCH') won = lastDigit === barrier;
  else if (contract === 'DIGITDIFF') won = lastDigit !== barrier;

  const profit = won 
    ? calculateSimulationProfit(trade.stake, trade.type, trade.dynamic_payout, trade.barrier)
    : -trade.stake;
    
  let newBalance = currentBalance;
  if (won) {
    newBalance = currentBalance + trade.stake + profit;
  }

  return {
    won,
    profit: Math.round(profit * 1000) / 1000,
    newBalance: Math.round(newBalance * 1000) / 1000,
    exitDigit: lastDigit
  };
}
