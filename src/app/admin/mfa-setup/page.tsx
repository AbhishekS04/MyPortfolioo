"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import QRCode from "qrcode";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function MFASetupPage() {
  const [factorId, setFactorId] = useState<string>("");
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState("");
  const [setupError, setSetupError] = useState("");
  const [verifyError, setVerifyError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const setupMFA = async () => {
      try {
        // 1. Check user
        const {
          data: { user },
        } = await supabase.auth.getUser();
        if (!user) {
          router.push("/admin/login");
          return;
        }

        // 2. Check existing factors
        const { data: factors, error: listError } =
          await supabase.auth.mfa.listFactors();
        if (listError) throw listError;

        const totpFactors = factors.totp || [];
        console.log("Existing factors:", totpFactors);

        const verifiedFactor = totpFactors.find((f) => f.status === "verified");

        if (verifiedFactor) {
          setIsSuccess(true);
          return;
        }

        // 3. Clean up ANY unverified factors (stale setups)
        // We delete anything that is NOT verified to ensure a clean slate for the name "Admin Panel 2FA"
        const staleFactors = totpFactors.filter((f) => f.status !== "verified");

        for (const factor of staleFactors) {
          try {
            console.log("Unenrolling stale factor:", factor.id);
            await supabase.auth.mfa.unenroll({ factorId: factor.id });
          } catch (e) {
            console.error("Failed to unenroll factor:", factor.id, e);
          }
        }

        // 4. Enroll new factor
        const { data, error } = await supabase.auth.mfa.enroll({
          factorType: "totp",
          friendlyName: `Admin Panel 2FA (${new Date().getTime().toString().slice(-4)})`,
        });

        if (error) throw error;

        setFactorId(data.id);
        setSecret(data.totp.secret);

        // 5. Generate QR with Custom Branding
        const customIssuer = "Abhishek Portfolio";
        const accountName = "Admin"; // Cleaner look

        // Reconstruct the URI with custom issuer to ensure professional appearance
        const brandingUri = `otpauth://totp/${encodeURIComponent(customIssuer)}:${encodeURIComponent(accountName)}?secret=${data.totp.secret}&issuer=${encodeURIComponent(customIssuer)}&algorithm=SHA1&digits=6&period=30`;

        const qrUrl = await QRCode.toDataURL(brandingUri);
        setQrCodeUrl(qrUrl);
      } catch (err: unknown) {
        console.error("MFA Setup Error:", err);
        setSetupError(
          err instanceof Error ? err.message : "Failed to setup MFA. detailed error in console.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    setupMFA();
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setVerifyError("");

    try {
      const { data, error } = await supabase.auth.mfa.challengeAndVerify({
        factorId,
        code: verifyCode,
      });

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/admin");
      }, 2000);
    } catch (err: unknown) {
      setVerifyError(err instanceof Error ? err.message : "Invalid code. Try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <Loader2 className="animate-spin w-8 h-8 text-white/40" />
      </div>
    );
  }

  const handleReset = async () => {
    if (
      !confirm(
        "Are you sure? This will disable 2FA and you will need to scan a new QR code.",
      )
    )
      return;

    setIsLoading(true);
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors();
      const totpFactors = factors?.totp || [];

      for (const factor of totpFactors) {
        await supabase.auth.mfa.unenroll({ factorId: factor.id });
      }

      // Reload to triggers clean setup
      window.location.reload();
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-[#111] border border-white/10 rounded-3xl p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto text-emerald-500">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-2xl font-bold text-white">2FA is Active</h2>
          <p className="text-white/40">
            Your account is secured. You can reset it if you need to
            re-configure a new device.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => router.push("/admin")}
              className="w-full bg-white text-black hover:bg-white/90"
            >
              Continue to Dashboard
            </Button>
            <button
              onClick={handleReset}
              className="w-full py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
            >
              Reset Configuration
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 flex items-center justify-center">
      <div className="max-w-xl w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <Link
            href="/admin"
            className="inline-flex items-center text-sm text-white/40 hover:text-white transition-colors mb-4"
          >
            <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">
            Setup Two-Factor Auth
          </h1>
          <p className="text-white/40">
            Scan the QR code below with your authenticator app (e.g. Google
            Authenticator) to enable 2FA.
          </p>
        </div>

        <div className="bg-[#111] border border-white/10 rounded-3xl p-8 space-y-8">
          {/* QR Section (Only hidden on SETUP error) */}
          {setupError ? (
            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl text-center space-y-2">
              <AlertCircle className="mx-auto text-red-500" size={32} />
              <h3 className="text-red-400 font-medium">Setup Failed</h3>
              <pre className="text-left bg-black/50 p-4 rounded text-xs text-red-300 overflow-auto max-w-full whitespace-pre-wrap font-mono">
                {typeof setupError === "string"
                  ? setupError
                  : JSON.stringify(setupError, null, 2)}
              </pre>
              <p className="text-white/40 text-xs">
                Ensure &quot;Multi-Factor Authentication&quot; is enabled in your Supabase
                Project Settings.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-6 bg-white/5 p-8 rounded-2xl border border-dashed border-white/10">
              {qrCodeUrl ? (
                <div className="bg-white p-4 rounded-xl">
                  <Image
                    src={qrCodeUrl}
                    alt="QR Code"
                    width={180}
                    height={180}
                    className="rounded-lg mix-blend-multiply"
                  />
                </div>
              ) : (
                <div className="h-[180px] w-[180px] bg-white/5 rounded-xl animate-pulse flex items-center justify-center text-white/20">
                  QR Loading...
                </div>
              )}
              <div className="text-center space-y-2">
                <p className="text-xs uppercase tracking-widest text-white/40 font-bold">
                  Manual Entry Key
                </p>
                <code className="bg-black/50 px-3 py-1 rounded-lg text-emerald-400 font-mono text-sm block select-all">
                  {secret || "..."}
                </code>
              </div>
            </div>
          )}

          {/* Verification Form */}
          <form onSubmit={handleVerify} className="space-y-4">
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

            {verifyError && (
              <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 p-3 rounded-lg">
                <AlertCircle size={14} /> {verifyError}
              </div>
            )}

            <Button
              type="submit"
              disabled={isVerifying || verifyCode.length !== 6}
              className="w-full h-12 text-base bg-white text-black hover:bg-white/90 disabled:opacity-50"
            >
              {isVerifying ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Verify & Enable"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
