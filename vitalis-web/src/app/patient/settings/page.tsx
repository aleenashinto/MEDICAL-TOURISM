"use client";

import React, { useState } from "react";
import { 
  Settings, 
  Lock, 
  Bell, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from "lucide-react";

export default function PatientSettingsPage() {
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Account Security & Preferences
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your notification channels and portal security settings.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
            Travel & Medical Alerts
          </h2>
          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-slate-700">Email notifications for Visa letter issuance & appointment links</span>
            </label>
            <label className="flex items-center gap-3">
              <input type="checkbox" defaultChecked className="rounded text-blue-600 focus:ring-blue-500" />
              <span className="text-slate-700">WhatsApp / SMS updates for flight landing & airport chauffeur contact</span>
            </label>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          {isSaved && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Preferences saved!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Save Preferences
          </button>
        </div>
      </form>
    </div>
  );
}
