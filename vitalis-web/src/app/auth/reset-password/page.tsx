"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, Lock, CheckCircle2, ShieldAlert, KeyRound, ArrowLeft, Eye, EyeOff } from "lucide-react";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passStrength = calculatePasswordStrength(password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or expired reset link. Please request a new one.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 800);
  };

  if (!token) {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-red-500/20 text-red-400 mx-auto flex items-center justify-center">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-white">Invalid Reset Link</h3>
        <p className="text-xs text-slate-400">
          This password reset token is invalid, expired, or has already been used.
        </p>
        <div className="pt-2">
          <Link
            href="/auth/forgot-password"
            className="inline-block py-2.5 px-4 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs rounded-xl"
          >
            Request New Reset Link
          </Link>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="text-center space-y-5">
        <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">Password Updated</h3>
          <p className="text-xs text-slate-300">
            Your password has been successfully changed. You can now sign in with your new credentials.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href="/auth/login"
            className="block w-full text-center py-3 px-4 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all"
          >
            Sign In with New Password
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label htmlFor="reset-new-password" className="block text-xs font-medium text-slate-300">New Password</label>
        <div className="mt-1 relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="reset-new-password"
            name="new-password"
            autoComplete="new-password"
            type={showPassword ? "text" : "password"}
            required
            placeholder="At least 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {/* Password Strength Meter */}
        {password && (
          <div className="mt-1.5 flex items-center gap-1.5">
            <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden flex gap-1">
              <div className={`h-full flex-1 rounded-full ${passStrength >= 1 ? "bg-red-500" : "bg-transparent"}`} />
              <div className={`h-full flex-1 rounded-full ${passStrength >= 3 ? "bg-amber-400" : "bg-transparent"}`} />
              <div className={`h-full flex-1 rounded-full ${passStrength >= 4 ? "bg-emerald-400" : "bg-transparent"}`} />
            </div>
            <span className="text-[10px] text-slate-400">
              {passStrength < 2 ? "Weak" : passStrength < 4 ? "Medium" : "Strong"}
            </span>
          </div>
        )}
      </div>

      <div>
        <label htmlFor="reset-confirm-password" className="block text-xs font-medium text-slate-300">Confirm New Password</label>
        <div className="mt-1 relative rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
            <Lock className="h-4 w-4" />
          </div>
          <input
            id="reset-confirm-password"
            name="confirm-password"
            autoComplete="new-password"
            type={showConfirmPassword ? "text" : "password"}
            required
            placeholder="Re-enter password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
          />
          <button
            type="button"
            aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
          >
            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0E82FD] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E82FD] transition-all disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? "Updating Password..." : "Set New Password"}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export default function ResetPasswordPage() {
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
          Create New Password
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Choose a strong password with at least 8 characters.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          <Suspense fallback={<div className="text-center text-xs text-slate-400 py-6">Loading security verification...</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
