"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Force hard navigation to ensure middleware runs fresh
      window.location.href = "/admin";
    } catch (err: unknown) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
      setIsLoading(false); // Only stop loading on error, otherwise we navigate
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md p-8 relative z-10">
        <div className="mb-8 text-center">
          <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <Lock className="w-8 h-8 text-white/80" />
          </div>
          <h1 className="text-2xl font-semibold text-white tracking-tight">
            Restricted Access
          </h1>
          <p className="text-white/40 text-sm mt-2">
            Enter your credentials to access the command center.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Admin Email"
              aria-label="Admin Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              aria-label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder:text-white/20 focus:outline-none focus:border-white/30 transition-all"
              required
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black font-medium py-3.5 rounded-xl hover:bg-white/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Authenticate"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
