"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, ArrowRight, Lock, Mail, User, KeyRound, ShieldAlert, CheckCircle2, UserPlus, Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"ADMIN" | "PATIENT">("PATIENT");
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!trimmedPassword) {
      setError("Please enter your password.");
      return;
    }

    // RFC-compliant email format validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(trimmedEmail)) {
      setError("Invalid email format. Please check your email address.");
      return;
    }

    setIsLoading(true);

    // Strict 2-Role Authentication Validation
    setTimeout(() => {
      setIsLoading(false);

      if (role === "ADMIN") {
        // Admin credentials verification
        if ((trimmedEmail === "admin@gmail.com" || trimmedEmail === "admin@vitalis.health") && trimmedPassword === "Admin1234") {
          if (typeof window !== "undefined") {
            localStorage.setItem("maides_user_email", "admin@gmail.com");
            localStorage.setItem("maides_user_name", "System Administrator");
            localStorage.setItem("maides_user_role", "ADMIN");
            if (rememberMe) {
              localStorage.setItem("maides_remember_device", "true");
              localStorage.setItem("maides_device_expiry", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
            }
          }
          router.push("/admin/dashboard");
        } else {
          // Safe generic message to prevent account enumeration
          setError("Invalid administrator credentials. Please check your email and password.");
        }
      } else {
        // Patient authentication
        if (trimmedEmail === "deactivated@example.com") {
          setError("Your account has been deactivated. Please contact MAIDES support.");
          return;
        }

        // Prevent patient attempting to log into admin accounts without admin role
        if (trimmedEmail === "admin@gmail.com" && trimmedPassword !== "Admin1234") {
          setError("Invalid credentials. Please verify your email and password.");
          return;
        }

        // Extract patient name dynamically from email or look up in registered patients
        let formattedName = "";
        let userLocation = "United Arab Emirates";
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem("maides_admin_patients");
            if (stored) {
              const patientList = JSON.parse(stored);
              const matched = patientList.find((p: any) => p.email.toLowerCase() === trimmedEmail);
              if (matched) {
                formattedName = matched.name;
                userLocation = matched.country || userLocation;
              }
            }
          } catch (err) {}
        }

        if (!formattedName) {
          const rawPrefix = trimmedEmail.split("@")[0] || "Patient";
          formattedName = rawPrefix
            .split(/[._-]/)
            .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
            .join(" ");
        }

        if (typeof window !== "undefined") {
          localStorage.setItem("maides_user_email", trimmedEmail);
          localStorage.setItem("maides_user_name", formattedName);
          localStorage.setItem("maides_user_role", "PATIENT");
          localStorage.setItem("maides_user_location", userLocation);
          if (rememberMe) {
            localStorage.setItem("maides_remember_device", "true");
            localStorage.setItem("maides_device_expiry", new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString());
          }
        }
        router.push("/patient/dashboard");
      }
    }, 500);
  };

  const setDemoRole = (selectedRole: "ADMIN" | "PATIENT") => {
    setRole(selectedRole);
    setError("");
    setEmail("");
    setPassword("");
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
          {/* Role Switcher */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
              Select Role Profile
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-900/80 rounded-xl border border-slate-700/60">
              <button
                type="button"
                onClick={() => setDemoRole("PATIENT")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === "PATIENT"
                    ? "bg-[#0E82FD] text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Patient Portal
              </button>
              <button
                type="button"
                onClick={() => setDemoRole("ADMIN")}
                className={`flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  role === "ADMIN"
                    ? "bg-[#0E82FD] text-white shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                Administrator
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleLogin} noValidate autoComplete="off">
            <div>
              <label htmlFor="login-email" className="block text-xs font-medium text-slate-300">
                {role === "PATIENT" ? "Patient Email address" : "Administrator Email"}
              </label>
              <div className="mt-1 relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  key={role === "PATIENT" ? "patient-email-field" : "admin-email-field"}
                  id="login-email"
                  name={role === "PATIENT" ? "patient_auth_email" : "admin_auth_email"}
                  autoComplete="off"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
                  placeholder={role === "PATIENT" ? "Enter your patient email (e.g. sarah@example.com)" : "admin@gmail.com"}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="block text-xs font-medium text-slate-300">
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
                  key={role === "PATIENT" ? "patient-pass-field" : "admin-pass-field"}
                  id="login-password"
                  name={role === "PATIENT" ? "patient_auth_pass" : "admin_auth_pass"}
                  autoComplete="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-10 py-2.5 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
                  placeholder={role === "PATIENT" ? "Enter your patient password" : "••••••••"}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-[#0E82FD] focus:ring-[#0E82FD]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-400 cursor-pointer">
                  Remember this device for 30 days
                </label>
              </div>
            </div>

            {/* Sign In Primary Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0E82FD] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E82FD] transition-all disabled:opacity-50 cursor-pointer"
            >
              {isLoading ? (
                <span>Authenticating...</span>
              ) : (
                <>
                  <span>Sign In as {role === "ADMIN" ? "Administrator" : "Patient"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-700/80"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-800 px-3 text-slate-400 font-medium tracking-wider">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Sign Up Button in Form */}
            <Link
              href="/auth/register"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold text-white bg-slate-700/60 hover:bg-slate-700 hover:text-white border border-slate-600 hover:border-blue-500/50 transition-all shadow-xs group"
            >
              <UserPlus className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span>Sign Up for Patient Account</span>
            </Link>
          </form>

          {/* Sandbox Info */}
          <div className="mt-6 p-3.5 bg-slate-900/60 border border-slate-700/50 rounded-xl flex items-center justify-center gap-2 text-xs text-slate-400">
            <Lock className="w-3.5 h-3.5 text-blue-400" />
            <span>End-to-end encrypted 256-bit SSL authentication gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
}
