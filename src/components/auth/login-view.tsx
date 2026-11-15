
"use client";

import React, { useState } from 'react';
import { useDeriv } from '@/components/deriv-provider';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { ShieldCheck, Key, Zap, Lock, ShieldAlert, Trash2, History } from 'lucide-react';
import { toast } from "@/hooks/use-toast";

export function LoginView() {
  const { login, adminLogin, isAuthorizing, savedTokens, removeSavedToken } = useDeriv();
  const [apiKey, setApiKey] = useState('');
  const [patKey, setPatKey] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPass, setAdminPass] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const handlePatLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patKey) return;
    try {
      await login(patKey, 'pat', rememberMe);
    } catch (err: any) {
      console.error('PAT login error:', err);
      toast({
        variant: "destructive",
        title: "PAT Link Fault",
        description: err.message || "Invalid PAT token or connection fault."
      });
    }
  };

  const handleApiLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey) return;
    try { 
      await login(apiKey, 'api', rememberMe); 
    } catch (err: any) { 
      console.error('API login error:', err);
      toast({
        variant: "destructive",
        title: "Connection Failed",
        description: err.message || "Invalid API token or connection error."
      });
    }
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = adminLogin(adminEmail, adminPass);
    if (!success) {
      console.error('Admin login failed: Invalid credentials for Admin Protocol.');
      toast({
        variant: "destructive",
        title: "Access Denied",
        description: "Invalid credentials for Admin Protocol."
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-2xl border-primary/10 overflow-hidden bg-card">
        <div className="bg-primary p-8 text-center text-primary-foreground relative">
          <Zap className="w-12 h-12 mx-auto mb-4 bg-white/20 p-2 rounded-2xl" />
          <h1 className="text-3xl font-bold tracking-tighter italic uppercase">DerivAlchemist</h1>
          <p className="text-sm opacity-80 mt-1 font-medium uppercase tracking-widest">Neural Market Intelligence</p>
        </div>

        {savedTokens.length > 0 && (
          <div className="px-6 pt-6 animate-in slide-in-from-top-2 duration-500">
             <div className="flex items-center gap-2 mb-3">
                <History className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Saved neural links</span>
             </div>
             <div className="flex flex-col gap-2">
                {savedTokens.map((st) => (
                  <div key={st.token} className="group relative flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-xl hover:border-primary/50 transition-all">
                    <button 
                      className="flex-1 text-left flex flex-col"
                      onClick={() => login(st.token, st.mode, false)}
                      disabled={isAuthorizing}
                    >
                      <span className="text-xs font-bold text-foreground">{st.label}</span>
                      <span className="text-[8px] font-black uppercase text-primary/70">{st.mode === 'pat' ? 'PAT Protocol' : 'Legacy API'}</span>
                    </button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeSavedToken(st.token)}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
             </div>
          </div>
        )}

        <Tabs defaultValue="pat" className="p-6">
          <TabsList className="grid grid-cols-3 mb-8 bg-background p-1 border border-white/10">
            <TabsTrigger value="pat">PAT Login</TabsTrigger>
            <TabsTrigger value="api">API Token</TabsTrigger>
            <TabsTrigger value="admin">Admin</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pat" className="space-y-4">
             <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-primary" /> Deriv PAT</CardTitle>
            </CardHeader>
            <form onSubmit={handlePatLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">PAT Token</Label>
                <Input 
                  type="password" 
                  value={patKey} 
                  onChange={(e) => setPatKey(e.target.value)} 
                  autoComplete="off"
                  placeholder="Paste your Deriv PAT token"
                  className="bg-background border-white/10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-pat" checked={rememberMe} onCheckedChange={(val) => setRememberMe(!!val)} />
                <Label htmlFor="remember-pat" className="text-xs font-bold text-muted-foreground uppercase cursor-pointer">Remember protocol key</Label>
              </div>
              <Button type="submit" className="w-full h-11 font-bold bg-primary" disabled={isAuthorizing || !patKey}>
                {isAuthorizing ? 'Synchronizing OTP...' : 'Authorize PAT'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="api" className="space-y-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl flex items-center gap-2"><Key className="w-5 h-5 text-primary" /> Legacy API</CardTitle>
            </CardHeader>
            <form onSubmit={handleApiLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">App Token</Label>
                <Input 
                  type="password" 
                  value={apiKey} 
                  onChange={(e) => setApiKey(e.target.value)} 
                  autoComplete="off"
                  placeholder="Paste your Deriv API token"
                  className="bg-background border-white/10"
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember-api" checked={rememberMe} onCheckedChange={(val) => setRememberMe(!!val)} />
                <Label htmlFor="remember-api" className="text-xs font-bold text-muted-foreground uppercase cursor-pointer">Remember neural link</Label>
              </div>
              <Button type="submit" className="w-full h-11 font-bold bg-primary" disabled={isAuthorizing || !apiKey}>
                {isAuthorizing ? 'Connecting Neural Link...' : 'Synchronize'}
              </Button>
            </form>
          </TabsContent>
          
          <TabsContent value="admin" className="space-y-4">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-xl flex items-center gap-2"><Lock className="w-5 h-5 text-primary" /> Master Link</CardTitle>
            </CardHeader>
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">User ID</Label>
                <Input 
                  type="email" 
                  value={adminEmail} 
                  onChange={(e) => setAdminEmail(e.target.value)} 
                  placeholder="Email or CR Number" 
                  autoComplete="off"
                  className="bg-background border-white/10"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Security Key</Label>
                <Input 
                  type="password" 
                  value={adminPass} 
                  onChange={(e) => setAdminPass(e.target.value)} 
                  placeholder="••••••••" 
                  autoComplete="off"
                  className="bg-background border-white/10"
                />
              </div>
              <Button type="submit" className="w-full h-11 font-bold bg-primary">
                Access Protocol
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        <CardFooter className="bg-background/50 border-t border-white/10 flex flex-col items-center py-4">
          <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-[0.2em]">Secured by AES-256 Neural Protocol</p>
        </CardFooter>
      </Card>
    </div>
  );
}
