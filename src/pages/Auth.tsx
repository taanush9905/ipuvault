import { useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { GraduationCap, Loader2 } from "lucide-react";
import { HoverButton } from "@/components/ui/hover-button";

export default function Auth() {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  const [busy, setBusy] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  useEffect(() => { if (user) nav("/"); }, [user, nav]);
  if (loading) return null;
  if (user) return <Navigate to="/" replace />;

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim().toLowerCase(),
      password,
    });
    setBusy(false);
    if (error) {
      if (error.message.toLowerCase().includes("invalid login")) {
        toast.error("Invalid email or password. If you just signed up, confirm your email or use the admin account from setup-admin.sql.");
      } else {
        toast.error(error.message);
      }
      return;
    }
    toast.success("Welcome back");
  }

  async function signUp(e: React.FormEvent) {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setBusy(true);
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase.auth.signUp({
      email: normalizedEmail,
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: name.trim() || normalizedEmail.split("@")[0] },
      },
    });

    if (error) {
      setBusy(false);
      return toast.error(error.message);
    }

    if (data.session) {
      setBusy(false);
      toast.success("Account created — you're signed in");
      return;
    }

    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });
    setBusy(false);

    if (!signInErr) {
      toast.success("Account created — you're signed in");
      return;
    }

    toast.info(
      "Account may be created. If sign-in fails, open Supabase → Authentication → Providers → Email and turn OFF «Confirm email», then try Sign in.",
      { duration: 8000 }
    );
  }

  return (
    <div className="min-h-[calc(100vh-12rem)] grid place-items-center px-4">
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 shadow-elegant relative overflow-hidden">
        <div className="absolute top-0 right-0 h-28 w-28 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="text-center mb-6 relative z-10">
          <div className="h-12 w-12 mx-auto rounded-xl bg-foreground text-background grid place-items-center mb-3 shadow-soft">
            <GraduationCap className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Welcome to IPU Vault</h1>
          <p className="text-xs text-muted-foreground mt-1">Sign in for profile settings, admin features, and voting.</p>
          <p className="text-[10px] text-muted-foreground/80 mt-1">Contributing academic resources does not require an account.</p>
        </div>

        <Tabs defaultValue="signin" className="relative z-10">
          <TabsList className="grid grid-cols-2 w-full rounded-xl bg-secondary/50 p-1">
            <TabsTrigger value="signin" className="rounded-lg text-xs font-semibold">Sign in</TabsTrigger>
            <TabsTrigger value="signup" className="rounded-lg text-xs font-semibold">Sign up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="signin">
            <form onSubmit={signIn} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="rounded-xl h-11 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" className="rounded-xl h-11 text-xs" />
              </div>
              <HoverButton type="submit" className="w-full h-11 rounded-xl font-bold mt-2 shadow-soft" disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Sign in
              </HoverButton>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={signUp} className="space-y-4 mt-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Rahul Sharma" autoComplete="name" className="rounded-xl h-11 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address</Label>
                <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" className="rounded-xl h-11 text-xs" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Password (min 6 characters)</Label>
                <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" className="rounded-xl h-11 text-xs" />
              </div>
              <HoverButton type="submit" className="w-full h-11 rounded-xl font-bold mt-2 shadow-soft" disabled={busy}>
                {busy && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                Create account
              </HoverButton>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
