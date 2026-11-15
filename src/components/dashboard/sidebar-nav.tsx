
"use client";

import React, { useState } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarGroupContent, 
  SidebarGroupLabel, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { BrainCircuit, Wand2, Hash, ShieldCheck, BookOpen, Bot, Infinity, LogOut, Microscope, Sparkles, Calculator, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RobotId } from '@/lib/deriv-types';

const ROBOTS: { id: RobotId; name: string; icon: any; description: string }[] = [
  { id: 'ai_analyzer', name: 'AI Analyzer', icon: Microscope, description: 'Smart Market Analysis' },
  { id: 'ai_trade', name: 'AI Trade', icon: BrainCircuit, description: 'Neural Pattern Analysis' },
  { id: 'over_under_magic', name: 'Over Under Magic', icon: Bot, description: 'Neural Trigger Protocol' },
  { id: 'digit_match', name: 'Digit Match', icon: Hash, description: 'Sequence Synchronizer' },
  { id: 'continuity', name: 'Continuity', icon: Infinity, description: 'Continuous Flow Protocol' },
  { id: 'magic_box', name: 'Magic Box', icon: Sparkles, description: 'Price Dynamic Engine' },
  { id: 'calculation_dex', name: 'Calculation Dex', icon: Calculator, description: 'Deep Historical Sweep' }
];

export function SidebarNav() {
  const { activeRobotId, setActiveRobotId, isConnected, logout } = useDeriv();
  const [isStrategyListOpen, setIsStrategyListOpen] = useState(false);

  return (
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-card">
      <SidebarHeader className="h-16 flex items-center px-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shadow-lg shadow-primary/20 shrink-0">
             <Wand2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
             <span className="text-sm font-black tracking-tighter text-primary uppercase italic">Alchemist</span>
             <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Protocol V2.0</span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-2 py-1.5 mb-2">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground group-data-[collapsible=icon]:hidden">
              Strategy Selection
            </span>
            <button
              type="button"
              onClick={() => setIsStrategyListOpen((prev) => !prev)}
              aria-label="Toggle strategy selection"
              aria-expanded={isStrategyListOpen}
              title={isStrategyListOpen ? "Hide strategies" : "Show strategies"}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors shrink-0 group-data-[collapsible=icon]:mx-auto"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {isStrategyListOpen && ROBOTS.map((robot) => (
                <SidebarMenuItem key={robot.id}>
                  <SidebarMenuButton 
                    isActive={activeRobotId === robot.id} 
                    onClick={() => setActiveRobotId(robot.id)}
                    className={cn(
                      "transition-all duration-200 py-6",
                      activeRobotId === robot.id ? "bg-primary/20 text-primary shadow-sm" : "hover:bg-white/5"
                    )}
                    tooltip={robot.name}
                  >
                    <robot.icon className={cn("w-5 h-5", activeRobotId === robot.id ? "text-primary" : "text-muted-foreground")} />
                    <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden ml-1">
                       <span className="text-sm font-bold">{robot.name}</span>
                       <span className="text-[9px] opacity-60 font-medium">{robot.description}</span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}

              <SidebarMenuItem>
                <SidebarMenuButton 
                  onClick={logout}
                  className="hover:bg-red-500/10 hover:text-red-500 transition-all py-6 mt-2"
                  tooltip="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden ml-1">
                     <span className="text-sm font-bold">Sign Out</span>
                     <span className="text-[9px] opacity-60 font-medium">Terminate Session</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-auto">
          <SidebarGroupLabel className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground mb-2">Support & Safety</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-white/5" tooltip="Manuals">
                  <BookOpen className="w-4 h-4 text-muted-foreground" />
                  <span className="group-data-[collapsible=icon]:hidden text-xs font-bold">Documentation</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton className="hover:bg-white/5" tooltip="Security">
                  <ShieldCheck className="w-4 h-4 text-muted-foreground" />
                  <span className="group-data-[collapsible=icon]:hidden text-xs font-bold">Encryption Status</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 group-data-[collapsible=icon]:hidden">
        <div className="bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
           <div className="flex items-center justify-between">
              <span className="text-[9px] font-bold text-muted-foreground uppercase">Network Status</span>
              <div className={cn(
                "w-1.5 h-1.5 rounded-full animate-pulse",
                isConnected ? "bg-green-500" : "bg-red-500"
              )} />
           </div>
           <div className="flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", isConnected ? "bg-primary" : "bg-red-500")} />
              <span className="text-[10px] font-bold uppercase tracking-tight">
                {isConnected ? 'Secured AES-256' : 'Syncing Protocol...'}
              </span>
           </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
