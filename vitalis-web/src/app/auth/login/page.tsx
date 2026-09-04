"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Lock, Mail, CheckCircle2, User, KeyRound } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@vitalis.health");
  const [password, setPassword] = useState("â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢");
  const [role, setRole] = useState<"ADMIN" | "PATIENT">("ADMIN");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (typeof window !== "undefined") {
      const trimmedEmail = email.trim();
      localStorage.setItem("maides_user_email", trimmedEmail);

      // Extract username before @ and format cleanly, or use existing name if matches
      const rawPrefix = trimmedEmail.split("@")[0] || "User";
      const formattedName = rawPrefix
        .split(/[._-]/)
        .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" ");

      localStorage.setItem("maides_user_name", formattedName);
      if (!localStorage.getItem("maides_user_location")) {
        localStorage.setItem("maides_user_location", "India");
      }
    }

    setTimeout(() => {
      setIsLoading(false);
      if (role === "ADMIN") {
        router.push("/admin/dashboard");
      } else {
        router.push("/patient/dashboard");
      }
    }, 600);
  };

  const setDemoRole = (selectedRole: "ADMIN" | "PATIENT") => {
    setRole(selectedRole);
    if (selectedRole === "ADMIN") {
      setEmail("admin@vitalis.health");
    } else {
      setEmail("sarah.jenkins@example.com");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0E82FD]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            M
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">MAIDES</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
          Sign in to your account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Or{" "}
          <Link href="/auth/register" className="font-medium text-[#0E82FD] hover:text-blue-400">
            register for a new patient account
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {/* Quick Demo Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Demo Role Profile
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setDemoRole("ADMIN")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  role === "ADMIN"
                    ? "bg-[#0E82FD] text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Administrator
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("PATIENT")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all ${
                  role === "PATIENT"
                    ? "bg-[#0E82FD] text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Patient Portal
              </button>
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-medium text-slate-300">
                Email address
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                <Link
                  href="/auth/forgot-password"
                  className="text-xs text-[#0E82FD] hover:text-blue-400"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
                  placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  defaultChecked
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-[#0E82FD] focus:ring-[#0E82FD]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400">
                  Remember this device for 30 days
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0E82FD] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E82FD] transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In as {role === "ADMIN" ? "Administrator" : "Patient"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Info Box */}
          <div className="mt-6 p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl flex items-start gap-3">
            <KeyRound className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[12px] text-slate-400 leading-relaxed">
              <strong className="text-slate-200">2-Role Security Model:</strong> Admins gain complete platform oversight, while Patients access their private medical itinerary and records.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
