
"use client";

import React, { useState } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Trash2, LogOut, ShieldAlert, Activity } from 'lucide-react';
import { BalanceOverride } from '@/lib/deriv-types';

export function AdminView() {
  const { overrides, updateOverride, deleteOverride, logout, authState } = useDeriv();
  const [newEmail, setNewEmail] = useState('');
  const [newBalance, setNewBalance] = useState('100');

  const handleAdd = () => {
    if (!newEmail) return;
    const newItem: BalanceOverride = {
      id: Math.random().toString(36).substring(2, 9),
      emailOrCr: newEmail.trim(),
      balance: parseFloat(newBalance),
      isSimulated: true
    };
    updateOverride(newItem);
    setNewEmail('');
  };

  return (
    <div className="min-h-screen bg-[#0B0D17] flex flex-col text-white">
      <header className="h-20 border-b border-white/5 bg-card/50 backdrop-blur-md flex items-center justify-between px-8 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="bg-primary p-2.5 rounded-2xl text-white shadow-lg shadow-primary/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tighter uppercase italic text-primary">Admin Control Protocol</h1>
            <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-[0.3em]">Neural Network Master Node</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-end">
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Active Master</span>
            <span className="text-sm font-code font-bold opacity-80">{authState.email || 'Root Admin'}</span>
          </div>
          <Button variant="ghost" className="text-red-500 font-black uppercase tracking-widest hover:bg-red-500/10 h-12 px-6 rounded-xl" onClick={logout}>
            <LogOut className="w-5 h-5 mr-2" /> Exit Panel
          </Button>
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6 border-t border-white/5">
          <div className="lg:col-span-4">
            <Card className="bg-card border-white/10 shadow-xl">
              <CardHeader>
                <CardTitle className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2 text-foreground">
                  Simulation Protocol
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Target Identifier</Label>
                  <Input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="email@example.com" className="h-12 bg-background border-white/10 font-bold" />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Neural Balance ($)</Label>
                  <Input type="number" value={newBalance} onChange={(e) => setNewBalance(e.target.value)} className="h-12 bg-background border-white/10 font-code font-black text-lg" />
                </div>
                <Button onClick={handleAdd} className="w-full h-14 font-black uppercase tracking-widest bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                  Authorize Protocol
                </Button>
              </CardContent>
            </Card>
          </div>
          <div className="lg:col-span-8">
            <Card className="bg-card border-white/10 shadow-xl overflow-hidden">
              <CardHeader className="bg-white/5 border-b border-white/5">
                <CardTitle className="text-lg font-black uppercase italic tracking-tighter flex items-center gap-2 text-foreground">
                  <Activity className="w-5 h-5 text-primary" /> Active Overrides
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black uppercase text-muted-foreground h-12">Account</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-muted-foreground h-12">Balance</TableHead>
                      <TableHead className="text-[10px] font-black uppercase text-muted-foreground h-12">Mode</TableHead>
                      <TableHead className="text-right h-12"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {overrides.length === 0 ? (
                      <TableRow><TableCell colSpan={4} className="text-center py-10 text-muted-foreground italic text-xs uppercase">No active overrides.</TableCell></TableRow>
                    ) : (
                      overrides.map((o) => (
                        <TableRow key={o.id} className="border-white/5 hover:bg-white/5 transition-colors">
                          <TableCell className="font-bold py-4">{o.emailOrCr}</TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-black text-primary">$</span>
                              <Input type="number" className="w-32 h-9 font-code font-black bg-background border-white/10" value={o.balance} onChange={(e) => updateOverride({ ...o, balance: parseFloat(e.target.value) || 0 })} />
                            </div>
                          </TableCell>
                          <TableCell className="py-4">
                            <div className="flex items-center gap-3">
                              <Switch checked={o.isSimulated} onCheckedChange={(val) => updateOverride({ ...o, isSimulated: val })} className="data-[state=checked]:bg-primary" />
                              <span className="text-[9px] font-black uppercase tracking-widest">{o.isSimulated ? 'SIM' : 'REAL'}</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right py-4">
                            <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteOverride(o.id)}><Trash2 className="w-4 h-4" /></Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
