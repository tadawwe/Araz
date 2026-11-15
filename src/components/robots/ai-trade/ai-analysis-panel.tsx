
"use client";

import React from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BrainCircuit, Bot, Target as HunterIcon, Search, Crosshair } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function AIAnalysisPanel() {
  const { 
    strategyParams, setStrategyParams,
    isBotEnabled, setIsBotEnabled, isHunterEnabled, setIsHunterEnabled, 
    isMonitoring, setIsMonitoring,
    executionSettings, setExecutionSettings, aiGaps
  } = useDeriv();

  const isEvenOddMode = strategyParams.aiScannerMode === 'even_odd';

  return (
    <Card className="shadow-lg border-primary/20 bg-card overflow-hidden">
      <CardHeader className="p-3 md:pb-2 bg-background border-b border-white/5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-sm md:text-lg font-bold flex items-center gap-2 text-primary">
            <BrainCircuit className="w-4 h-4 md:w-5 h-5" /> AI Neural Scanner
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-[9px] font-black uppercase text-primary tracking-wider">Scanner Strategy</Label>
            <Select 
              value={strategyParams.aiScannerMode} 
              onValueChange={(val: any) => setStrategyParams({ aiScannerMode: val })}
              disabled={isMonitoring}
            >
              <SelectTrigger className="h-10 text-xs font-bold bg-background border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="over_under" className="text-xs">Over / Under Anomaly</SelectItem>
                <SelectItem value="even_odd" className="text-xs">Even / Odd Anomaly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label className="text-[9px] font-bold uppercase text-muted-foreground tracking-wider">Analysis Window</Label>
            <Input 
              type="number" 
              className="h-10 text-xs font-bold bg-background border-white/10" 
              value={executionSettings.tickSample} 
              onChange={(e) => setExecutionSettings({ tickSample: e.target.value })} 
              disabled={isMonitoring}
              placeholder="e.g. 20"
            />
          </div>
        </div>

        <div className="space-y-4 border-t border-white/5 pt-4">
           <Label className="text-[10px] font-black uppercase text-primary tracking-wider flex items-center gap-1.5">
             <Crosshair className="w-3.5 h-3.5" /> Analysis Threshold
           </Label>
           <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-muted-foreground">Missing Digits Target</Label>
              <Input 
                type="number" 
                className="h-10 text-xs font-bold bg-background border-primary/20" 
                value={strategyParams.aiMissingDigitsCount} 
                onChange={(e) => setStrategyParams({ aiMissingDigitsCount: e.target.value })} 
                disabled={isMonitoring}
                placeholder="e.g. 3"
              />
           </div>
        </div>

        {!isEvenOddMode && (
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-primary tracking-wider">Over Barrier (0-8)</Label>
              <Input 
                type="number" min="0" max="8"
                className="h-10 text-xs font-bold bg-background border-white/10" 
                value={strategyParams.overBarrier} 
                onChange={(e) => setStrategyParams({ overBarrier: e.target.value })} 
                disabled={isMonitoring}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[9px] font-bold uppercase text-primary tracking-wider">Under Barrier (1-9)</Label>
              <Input 
                type="number" min="1" max="9"
                className="h-10 text-xs font-bold bg-background border-white/10" 
                value={strategyParams.underBarrier} 
                onChange={(e) => setStrategyParams({ underBarrier: e.target.value })} 
                disabled={isMonitoring}
              />
            </div>
          </div>
        )}

        <div className="space-y-4 py-3 bg-background rounded-xl p-3 border border-dashed border-white/10">
           <div className="flex flex-col gap-3">
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-green-500 uppercase flex items-center gap-1.5">
                       <Search className="w-3 h-3" /> {isEvenOddMode ? 'Even' : 'Over'} Gap Analysis
                    </span>
                    <Badge variant="outline" className="text-[8px] font-bold border-green-500/30 text-green-400">
                       MISSING: {aiGaps.over.length}
                    </Badge>
                 </div>
                 <div className="flex flex-wrap gap-1.5 min-h-8 p-2 bg-white/5 rounded-lg border border-white/5">
                    {aiGaps.over.length > 0 ? aiGaps.over.map(d => (
                      <span key={d} className="w-6 h-6 rounded flex items-center justify-center bg-green-500/20 text-green-400 font-code font-bold text-xs border border-green-500/30">
                        {d}
                      </span>
                    )) : (
                      <span className="text-[8px] text-muted-foreground italic uppercase">No Gaps Detected...</span>
                    )}
                 </div>
              </div>

              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                    <span className="text-[9px] font-black text-red-500 uppercase flex items-center gap-1.5">
                       <Search className="w-3 h-3" /> {isEvenOddMode ? 'Odd' : 'Under'} Gap Analysis
                    </span>
                    <Badge variant="outline" className="text-[8px] font-bold border-red-500/30 text-red-400">
                       MISSING: {aiGaps.under.length}
                    </Badge>
                 </div>
                 <div className="flex flex-wrap gap-1.5 min-h-8 p-2 bg-white/5 rounded-lg border border-white/5">
                    {aiGaps.under.length > 0 ? aiGaps.under.map(d => (
                      <span key={d} className="w-6 h-6 rounded flex items-center justify-center bg-red-500/20 text-red-400 font-code font-bold text-xs border border-red-500/30">
                        {d}
                      </span>
                    )) : (
                      <span className="text-[8px] text-muted-foreground italic uppercase">No Gaps Detected...</span>
                    )}
                 </div>
              </div>
           </div>
        </div>
        
        <Button 
          className={cn(
            "w-full h-12 text-sm font-black uppercase tracking-widest", 
            isMonitoring ? "bg-red-500 hover:bg-red-600 shadow-lg shadow-red-900/20" : "bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          )} 
          onClick={() => setIsMonitoring(!isMonitoring)}
        >
          {isMonitoring ? "STOP AI SCANNER" : "START AI SCANNER"}
        </Button>
      </CardContent>
    </Card>
  );
}
