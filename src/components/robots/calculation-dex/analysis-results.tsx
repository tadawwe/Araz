
"use client";

import React, { useState } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart3, Binary, Target, Clock, Minimize2, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';

export function AnalysisResults() {
  const { historicalAnalysis, strategyParams, isMonitoringDex } = useDeriv();
  const [isMinimized, setIsMinimized] = useState(false);

  if (!historicalAnalysis) {
    return (
      <Card className={cn(
        "bg-card border-white/5 flex flex-col overflow-hidden transition-all duration-200",
        isMinimized ? "h-auto" : "h-full min-h-[600px]"
      )}>
        <CardHeader className="p-3 bg-background border-b border-white/5">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-[10px] font-black uppercase text-primary tracking-[0.15em] flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Top 10 Targets
            </CardTitle>
            <button
              type="button"
              onClick={() => setIsMinimized((prev) => !prev)}
              aria-label={isMinimized ? "Maximize Top 10 Targets" : "Minimize Top 10 Targets"}
              aria-expanded={!isMinimized}
              title={isMinimized ? "Maximize" : "Minimize"}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors shrink-0"
            >
              {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </CardHeader>
        {!isMinimized && (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center opacity-60">
            <Binary className="w-12 h-12 text-primary/20 animate-pulse mb-4" />
            <h3 className="text-sm font-black uppercase text-muted-foreground tracking-widest">
              Awaiting Discovery
            </h3>
            <p className="text-[9px] text-muted-foreground/60 uppercase mt-2 leading-relaxed">
              Initialize neural sweep to map<br/>top 10 winning patterns
            </p>
          </div>
        )}
      </Card>
    );
  }

  const { discoveredPatterns, totalSamples, lastDiscoveryEpoch } = historicalAnalysis;
  const bestPattern = discoveredPatterns[0];

  // Strictly limit to Top 10 high-winning patterns as requested
  const top10Patterns = discoveredPatterns.slice(0, 10);

  return (
    <Card className={cn(
      "bg-card border-primary/20 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-right-4 duration-500",
      isMinimized ? "h-auto" : "h-full min-h-[600px]"
    )}>
      <CardHeader className="p-3 bg-background border-b border-white/5">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <CardTitle className="text-[10px] font-black uppercase text-primary tracking-[0.15em] flex items-center gap-2">
              <BarChart3 className="w-3.5 h-3.5" /> Top 10 Targets
            </CardTitle>
            <div className="flex items-center gap-1.5">
              <Badge variant="outline" className="text-[8px] font-black border-primary/20 text-primary">
                SAMPLES: {totalSamples}
              </Badge>
              <button
                type="button"
                onClick={() => setIsMinimized((prev) => !prev)}
                aria-label={isMinimized ? "Maximize Top 10 Targets" : "Minimize Top 10 Targets"}
                aria-expanded={!isMinimized}
                title={isMinimized ? "Maximize" : "Minimize"}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors shrink-0"
              >
                {isMinimized ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
          {!isMinimized && (
            <div className="flex items-center gap-1.5 text-[8px] font-bold text-muted-foreground uppercase">
               <Clock className="w-2.5 h-2.5" />
               Last Discovery: {format(lastDiscoveryEpoch, 'HH:mm:ss')}
            </div>
          )}
        </div>
      </CardHeader>

      {!isMinimized && (
        <>
          {isMonitoringDex && bestPattern && (
            <div className="p-3 bg-primary/10 border-b border-primary/20 animate-pulse">
               <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] font-black text-primary uppercase flex items-center gap-1 tracking-widest">
                    <Target className="w-3 h-3" /> Hunt Active
                  </span>
               </div>
               <div className="flex items-center justify-between p-2 bg-background/50 rounded-lg border border-primary/30">
                  <div className="flex flex-col">
                    <span className="text-[7px] font-black text-muted-foreground uppercase">Sequence</span>
                    <span className="text-xs font-code font-black text-foreground tracking-[0.2em]">{bestPattern.sequence}</span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[7px] font-black text-muted-foreground uppercase">Target</span>
                    <span className={cn(
                      "text-[9px] font-black uppercase",
                      bestPattern.bestOutcome.match(/EVEN|OVER/) ? "text-green-500" : "text-red-500"
                    )}>{bestPattern.bestOutcome}</span>
                  </div>
               </div>
            </div>
          )}
          
          <ScrollArea className="flex-1">
            <Table>
              <TableHeader className="bg-background/80 sticky top-0 z-10 backdrop-blur-sm border-b border-white/5">
                <TableRow className="hover:bg-transparent border-white/5 h-8">
                  <TableHead className="text-[8px] font-black uppercase px-3">Seq</TableHead>
                  <TableHead className="text-[8px] font-black uppercase px-2 text-right">Rate</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {top10Patterns.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center py-20 text-muted-foreground italic text-[10px] uppercase">
                       No high-strength patterns
                    </TableCell>
                  </TableRow>
                ) : (
                  top10Patterns.map((p, idx) => (
                    <TableRow key={idx} className={cn(
                      "border-white/5 hover:bg-white/5 transition-colors group",
                      idx === 0 && isMonitoringDex && "bg-primary/5 border-primary/20"
                    )}>
                      <TableCell className="px-3 py-2.5">
                        <div className="flex flex-col gap-1">
                          <span className="font-code font-black text-sm text-foreground tracking-widest">
                            {p.sequence}
                          </span>
                          <div className="flex items-center gap-1.5">
                            <Badge variant="outline" className={cn(
                              "text-[7px] font-black uppercase h-3.5 px-1 border-none",
                              p.bestOutcome.match(/EVEN|OVER/) ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
                            )}>
                              {p.bestOutcome}
                            </Badge>
                            <span className="text-[7px] font-bold text-muted-foreground uppercase">({Math.floor(p.occurrences)}x)</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-3">
                        <span className={cn(
                          "font-code font-black text-xs",
                          p.confidence > 65 ? "text-green-500" : "text-primary/70"
                        )}>
                          {p.confidence.toFixed(1)}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>

          <div className="p-3 bg-white/5 border-t border-white/5">
             <p className="text-[7px] text-muted-foreground leading-relaxed italic text-center">
               Engine ranks top 10 sequences by winning rate.<br/>
               Recent patterns update heart-touchingly on play.
             </p>
          </div>
        </>
      )}
    </Card>
  );
}
