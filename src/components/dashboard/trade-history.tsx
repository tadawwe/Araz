
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  History, 
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradeHistoryProps {
  className?: string;
}

export function TradeHistory({ className }: TradeHistoryProps) {
  const { history, clearHistory } = useDeriv();

  const realHistory = (history || []).filter(t => t && !t.is_virtual_trade && t.status !== 'nil');
  const wins = realHistory.filter(t => t.status === 'won').length;
  const losses = realHistory.filter(t => t.status === 'lost').length;
  
  const netProfit = Number(realHistory.reduce((acc, t) => acc + (Number(t.profit) || 0), 0));

  const formatContractType = (type: string) => {
    if (!type) return 'STRK';
    const clean = String(type).toUpperCase()
      .replace('DIGIT', '')
      .replace('MATCH', '')
      .replace('DIFF', '');
    
    if (clean.includes('EVEN')) return 'EVEN';
    if (clean.includes('ODD')) return 'ODD';
    if (clean.includes('OVER')) return 'OVER';
    if (clean.includes('UNDER')) return 'UNDER';
    
    return clean;
  };

  const formatMarket = (symbol: string) => {
    return symbol.replace('R_', '').replace('VOL', '').trim();
  };

  return (
    <div className={cn("bg-card border border-white/5 rounded-xl overflow-hidden shadow-sm h-full flex flex-col", className)}>
      <div className="px-3 py-2 border-b border-white/5 flex items-center justify-between bg-white/5">
        <h3 className="font-bold flex items-center gap-1.5 text-[9px] text-primary uppercase tracking-tight">
          <History className="w-3 h-3" />
          Audit Stream
        </h3>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-[7px] font-black uppercase tracking-tighter bg-white/10 text-foreground px-1 h-4">
            {history.length}
          </Badge>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearHistory}
            className="h-5 px-1 text-[7px] font-black uppercase tracking-widest text-muted-foreground hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-2 h-2 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 divide-x divide-white/5 border-b border-white/5 bg-background/50">
        <div className="p-1 flex flex-col items-center justify-center">
          <span className="text-[6px] font-black uppercase text-green-500 tracking-tighter leading-none mb-0.5">Won</span>
          <span className="text-[10px] font-black text-green-500">{wins}</span>
        </div>
        <div className="p-1 flex flex-col items-center justify-center">
          <span className="text-[6px] font-black uppercase text-red-500 tracking-tighter leading-none mb-0.5">Lost</span>
          <span className="text-[10px] font-black text-red-500">{losses}</span>
        </div>
        <div className="p-1 flex flex-col items-center justify-center bg-white/5">
          <span className="text-[6px] font-black uppercase text-primary tracking-tighter leading-none mb-0.5">Net</span>
          <span className={cn(
            "text-[10px] font-black tabular-nums",
            netProfit > 0 ? "text-green-500" : netProfit < 0 ? "text-red-500" : "text-muted-foreground"
          )}>
            {netProfit > 0 ? '+' : ''}{Number(netProfit).toFixed(2)}
          </span>
        </div>
      </div>

      <ScrollArea className="flex-1 w-full overflow-hidden">
        <Table className="w-full table-fixed">
          <TableHeader className="bg-background/90 sticky top-0 z-10 backdrop-blur-md border-b border-white/5">
            <TableRow className="hover:bg-transparent border-white/5 h-7">
              <TableHead className="text-[8px] font-black uppercase tracking-tighter h-7 text-muted-foreground px-1 w-[20%]">Mkt</TableHead>
              <TableHead className="text-[8px] font-black uppercase tracking-tighter h-7 text-muted-foreground px-1 w-[25%]">Type</TableHead>
              <TableHead className="text-[8px] font-black uppercase tracking-tighter h-7 text-muted-foreground px-1 w-[25%] text-center">Stake</TableHead>
              <TableHead className="text-[8px] font-black uppercase tracking-tighter text-right h-7 text-muted-foreground px-1 w-[30%]">P/L</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {history.length === 0 ? (
              <TableRow className="border-none">
                <TableCell colSpan={4} className="text-center py-16 text-muted-foreground text-[8px] font-black uppercase italic opacity-40">
                  Awaiting...
                </TableCell>
              </TableRow>
            ) : (
              history.map((trade) => (
                <TableRow key={trade.id} className="hover:bg-white/5 transition-colors border-white/5 last:border-0 h-9">
                  <TableCell className="py-1 px-1">
                    <span className="font-black text-[9px] uppercase text-foreground leading-none">
                      {formatMarket(trade.symbol)}
                    </span>
                  </TableCell>
                  <TableCell className="py-1 px-1">
                    <div className="flex flex-col">
                      <span className={cn(
                        "text-[9px] font-black uppercase leading-none",
                        trade.type.match(/even|over/) ? "text-green-500/90" : "text-red-500/90"
                      )}>
                        {formatContractType(trade.type)}
                      </span>
                      {trade.is_virtual_trade && (
                        <span className="text-[5px] font-black bg-orange-500/20 text-orange-400 px-0.5 rounded w-fit mt-0.5">VIRT</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-1 px-1 text-center">
                    <span className="font-code text-[9px] font-bold text-foreground tabular-nums">
                      {Number(trade.stake).toFixed(2)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-1 px-1">
                    {trade.status === 'nil' || trade.status === 'open' ? (
                       <div className="flex items-center justify-end gap-1">
                          <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
                          <span className="text-[7px] font-black text-primary uppercase">OPN</span>
                       </div>
                    ) : (
                      <span className={cn(
                        "font-code text-[10px] font-black tabular-nums",
                        trade.status === 'won' ? (trade.is_virtual_trade ? "text-green-500/40" : "text-green-500") : 
                        trade.status === 'lost' ? (trade.is_virtual_trade ? "text-red-500/40" : "text-red-500") : 
                        'text-muted-foreground'
                      )}>
                        {trade.profit !== undefined ? (Number(trade.profit) > 0 ? '+' : '') + Number(trade.profit).toFixed(2) : '0.00'}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </ScrollArea>
      <div className="p-1 bg-white/5 border-t border-white/5 flex justify-center items-center text-[7px] font-black text-primary/60 uppercase tracking-[0.2em]">
         Parity Secured
      </div>
    </div>
  );
}
