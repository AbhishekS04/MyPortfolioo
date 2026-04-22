"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, ShieldCheck, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function MFAVerifyPage() {
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setError("");

    try {
      // 1. Get Assurance Level
      const { data: arrayFactors, error: listError } =
        await supabase.auth.mfa.listFactors();
      if (listError) throw listError;

      const totpFactor = arrayFactors.totp.find(
        (factor) => factor.status === "verified",
      );
      if (!totpFactor) {
        setError("No MFA factor found. Please contact support.");
        return;
      }

      // 2. Challenge
      const { data, error: challengeError } =
        await supabase.auth.mfa.challengeAndVerify({
          factorId: totpFactor.id,
          code: verifyCode,
        });

      if (challengeError) throw challengeError;

      // Success, redirect to admin
      router.push("/admin");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Invalid code. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-white">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-md w-full relative z-10 bg-[#111] border border-white/10 rounded-3xl p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-2xl border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-8 h-8 text-emerald-500" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-2">
            Security Check
          </h1>
          <p className="text-white/40 text-sm">
            Please enter the 6-digit code from your authenticator app to
            continue.
          </p>
        </div>

        <form onSubmit={handleVerify} className="space-y-6">
          <div className="flex justify-center">
            <InputOTP
              maxLength={6}
              value={verifyCode}
              onChange={(val) => setVerifyCode(val)}
            >
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm justify-center bg-red-500/10 p-3 rounded-lg border border-red-500/20">
              <AlertCircle size={14} /> {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isVerifying || verifyCode.length !== 6}
            className="w-full h-12 text-base bg-white text-black hover:bg-white/90 disabled:opacity-50 font-semibold"
          >
            {isVerifying ? (
              <Loader2 className="animate-spin" />
            ) : (
              "Verify Identity"
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              router.push("/admin/login");
            }}
            className="text-xs text-white/20 hover:text-white/60 transition-colors"
          >
            Sign out and try another account
          </button>
        </div>
      </div>
    </div>
  );
}
