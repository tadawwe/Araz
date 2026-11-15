
"use client";

import React from 'react';
import { useDeriv, DerivProvider } from '@/components/deriv-provider';
import { LoginView } from '@/components/auth/login-view';
import { Header } from '@/components/dashboard/header';
import { SidebarNav } from '@/components/dashboard/sidebar-nav';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { TickTape } from '@/components/dashboard/tick-tape';
import { OverUnderBar } from '@/components/dashboard/over-under-bar';
import { AdminView } from '@/components/admin/admin-view';
import { Loader2, PartyPopper, ShieldAlert } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

// Isolated Robot Views
import { AIAnalyzerView } from '@/components/robots/ai-analyzer/ai-analyzer-view';
import { AITradeView } from '@/components/robots/ai-trade/ai-trade-view';
import { OverUnderMagicView } from '@/components/robots/over-under-magic/over-under-magic-view';
import { DigitMatchView } from '@/components/robots/digit-match/digit-match-view';
import { ContinuityView } from '@/components/robots/continuity/continuity-view';
import { MagicBoxView } from '@/components/robots/magic-box/magic-box-view';
import { CalculationDexView } from '@/components/robots/calculation-dex/calculation-dex-view';

function RobotView() {
  const { activeRobotId } = useDeriv();

  switch (activeRobotId) {
    case 'ai_analyzer':
      return <AIAnalyzerView />;
    case 'ai_trade':
      return <AITradeView />;
    case 'over_under_magic':
      return <OverUnderMagicView />;
    case 'digit_match':
      return <DigitMatchView />;
    case 'continuity':
      return <ContinuityView />;
    case 'magic_box':
      return <MagicBoxView />;
    case 'calculation_dex':
      return <CalculationDexView />;
    default:
      return (
        <div className="flex flex-col items-center justify-center p-20 border-2 border-dashed border-white/5 rounded-3xl bg-white/5 opacity-60">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <h3 className="text-xl font-black uppercase italic tracking-tighter text-foreground">
            Initializing Protocol...
          </h3>
        </div>
      );
  }
}

function AppContent() {
  const { authState, isInitializing, isAuthorizing, terminalMessage, acknowledgeTerminalMessage } = useDeriv();

  if (isInitializing || isAuthorizing) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">
          {isAuthorizing ? 'Authenticating Protocol...' : 'Synchronizing Protocol...'}
        </p>
      </div>
    );
  }

  if (!authState.isLoggedIn) return <LoginView />;
  if (authState.isAdmin) return <AdminView />;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background overflow-hidden">
        <SidebarNav />
        <SidebarInset className="flex flex-col overflow-hidden bg-background">
          <Header />
          <main className="flex-1 p-3 md:p-8 max-w-7xl mx-auto w-full space-y-4 md:space-y-6 overflow-y-auto">
            <section><TickTape /></section>
            <section><OverUnderBar /></section>
            <RobotView />
          </main>
          <footer className="border-t border-white/5 bg-card py-6 mt-auto">
            <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                 <div className="w-6 h-6 bg-white/5 rounded flex items-center justify-center text-primary font-bold text-[10px]">AL</div>
                 <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Alchemist Intelligence &copy; 2024</p>
              </div>
            </div>
          </footer>
        </SidebarInset>
      </div>

      <AlertDialog open={terminalMessage !== null} onOpenChange={(open) => !open && acknowledgeTerminalMessage()}>
        <AlertDialogContent className="border-2 border-primary/20 shadow-2xl bg-[#0B0D17] text-white max-w-[500px] p-0 overflow-hidden">
          <div className="p-8">
            <AlertDialogHeader className="space-y-4">
              <AlertDialogTitle className="flex items-start gap-4 text-2xl font-black italic tracking-tighter text-left">
                {terminalMessage?.type === 'tp' ? (
                  <PartyPopper className="w-10 h-10 text-green-500 shrink-0" />
                ) : (
                  <ShieldAlert className="w-10 h-10 text-red-500 shrink-0" />
                )}
                <span>{terminalMessage?.title}</span>
              </AlertDialogTitle>
              <AlertDialogDescription className="text-md font-medium leading-relaxed pt-2 text-slate-400 text-left">
                {terminalMessage?.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="pt-8">
              <AlertDialogAction onClick={acknowledgeTerminalMessage} className="w-full h-14 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 text-white text-lg rounded-xl">OKAY</AlertDialogAction>
            </AlertDialogFooter>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
}

export default function Home() {
  return (
    <DerivProvider>
      <AppContent />
    </DerivProvider>
  );
}
