"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  ShieldCheck, 
  KeyRound, 
  Save, 
  CheckCircle2, 
  Lock,
  Building2,
  Calendar
} from "lucide-react";

export default function AdminProfilePage() {
  const [profile, setProfile] = useState({
    name: "System Administrator",
    email: "admin@vitalis.health",
    role: "SUPER_ADMIN",
    phone: "+91 484 285 1000",
    department: "Clinical Operations & Platform Governance",
    location: "Kochi, Kerala, India",
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-white tracking-tight">
          Admin Profile & Security Credentials
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your administrator identity, platform permissions, and authentication credentials.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
              AD
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white">{profile.name}</h2>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-blue-500/20 text-[#0E82FD] border border-blue-500/30">
                  {profile.role}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">{profile.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Email (System Principal)</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3 py-2 bg-slate-900/60 border border-slate-800 rounded-xl text-slate-500 cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">Operational Department</label>
              <input
                type="text"
                value={profile.department}
                onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">HQ Location</label>
              <input
                type="text"
                value={profile.location}
                onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-slate-800">
            <Lock className="w-4 h-4 text-[#0E82FD]" />
            <h3 className="text-sm font-bold text-white">Security & Password</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-medium text-slate-300 mb-1">Current Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>
            <div>
              <label className="block font-medium text-slate-300 mb-1">New Secure Password</label>
              <input
                type="password"
                placeholder="At least 12 characters"
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          {isSaved && (
            <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Admin profile saved successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Save Profile Changes
          </button>
        </div>
      </form>
    </div>
  );
}
