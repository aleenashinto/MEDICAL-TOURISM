"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, ShieldAlert, KeyRound, RefreshCw, ArrowLeft, Mail, Sparkles } from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState("your registered email");
  const [resendNotification, setResendNotification] = useState(false);

  useEffect(() => {
    router.replace("/patient/dashboard");
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleChange = (val: string, index: number) => {
    if (val.length > 1) val = val.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = val;
    setOtp(newOtp);

    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleAutoFill = () => {
    setOtp(["1", "2", "3", "4", "5", "6"]);
    setError("");
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const enteredOtp = otp.join("");

    if (enteredOtp.length !== 6) {
      setError("Please enter all 6 digits of the verification code.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Valid verification code
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/patient/dashboard");
      }, 1000);
    }, 600);
  };

  const handleResend = () => {
    if (!canResend) return;
    setTimer(60);
    setCanResend(false);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    setResendNotification(true);
    setTimeout(() => setResendNotification(false), 4000);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0E82FD]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            M
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">MAIDES</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
          Verify your Email
        </h2>
        <p className="mt-2 text-sm text-slate-400 max-w-sm mx-auto">
          We sent a 6-digit security code to{" "}
          <span className="text-[#38BDF8] font-semibold">{userEmail}</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {/* Sandbox Info Banner */}
          <div className="mb-5 p-3.5 bg-blue-500/10 border border-blue-500/30 rounded-xl flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <KeyRound className="w-4 h-4 text-blue-400 shrink-0" />
              <div className="text-xs text-slate-300">
                <span>Demo OTP Code: </span>
                <span className="font-mono font-bold text-white bg-blue-500/30 px-2 py-0.5 rounded border border-blue-400/40">123456</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-[11px] font-bold text-blue-300 hover:text-white bg-blue-600/40 hover:bg-blue-600 px-2.5 py-1 rounded-lg border border-blue-400/30 transition-all flex items-center gap-1 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3 h-3" />
              Auto-fill
            </button>
          </div>

          {resendNotification && (
            <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-center gap-2 text-emerald-400 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>A new 6-digit code has been dispatched to {userEmail}.</span>
            </div>
          )}

          {isSuccess ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white">Email Verified Successfully!</h3>
              <p className="text-xs text-slate-300">
                Redirecting you to your personal Patient Dashboard...
              </p>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleVerify}>
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-300 text-center mb-3">
                  Enter 6-digit verification code
                </label>
                <div className="flex justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, idx)}
                      onKeyDown={(e) => handleKeyDown(e, idx)}
                      className="w-11 h-12 text-center text-lg font-bold bg-slate-900/80 border border-slate-700 text-white rounded-xl focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent outline-none transition-all font-mono"
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {timer > 0 ? `Code expires in ${timer}s` : "Code expired"}
                </span>
                <button
                  type="button"
                  onClick={handleResend}
                  disabled={!canResend}
                  className="font-bold text-[#0E82FD] hover:text-blue-400 disabled:opacity-40 disabled:hover:text-[#0E82FD] flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0E82FD] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E82FD] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Verifying..." : "Verify & Access Account"}
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
