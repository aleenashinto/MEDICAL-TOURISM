import React from "react";
import Link from "next/link";
import { ArrowLeft, Home, HeartPulse } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center px-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/20 mb-6">
        M
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD] bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20 mb-3">
        404 — Page Not Found
      </span>
      <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
        Looking for a Medical Pathway?
      </h1>
      <p className="text-sm text-slate-400 max-w-md mb-8 leading-relaxed">
        The page you are looking for might have been moved or does not exist. Return to the portal or browse our healthcare network.
      </p>

      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-lg shadow-blue-500/30"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </Link>
        <Link
          href="/patient/dashboard"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition-all"
        >
          <HeartPulse className="w-4 h-4" />
          <span>Patient Dashboard</span>
        </Link>
      </div>
    </div>
  );
}
