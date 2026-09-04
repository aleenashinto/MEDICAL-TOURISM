"use client";

import React, { useState } from "react";
import { 
  Settings, 
  ShieldCheck, 
  Globe, 
  DollarSign, 
  Mail, 
  Bell, 
  Save, 
  CheckCircle2,
  Lock
} from "lucide-react";

export default function SettingsAdminPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Platform Settings & System Configuration
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure default base currencies, email notification webhooks, and 2-role system policies.
          </p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Forex & Currencies */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <h2 className="text-sm font-bold text-white">Forex & Multi-Currency Handling</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Base Platform Settlement Currency</label>
              <select className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white">
                <option value="INR">INR (Indian Rupee - ₹)</option>
                <option value="USD">USD (US Dollar - $)</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Supported International Currencies</label>
              <input 
                type="text" 
                defaultValue="USD, EUR, GBP, AED, SAR, OMR, AUD, CAD" 
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-white"
              />
            </div>
          </div>
        </div>

        {/* Security & Access Guard */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <ShieldCheck className="w-4 h-4 text-[#0E82FD]" />
            <h2 className="text-sm font-bold text-white">Security & 2-Role Ownership Enforcement</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="font-semibold text-slate-200">Enforce Strict Patient Record Isolation</div>
                <div className="text-[11px] text-slate-500">Rejects cross-patient data access requests with 403 Forbidden</div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                ACTIVE
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <div>
                <div className="font-semibold text-slate-200">Immutable Audit Logging (HIPAA & DPDP Compliant)</div>
                <div className="text-[11px] text-slate-500">Writes every administrative mutation to immutable audit storage</div>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 font-bold text-[10px]">
                ACTIVE
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> Configuration saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
