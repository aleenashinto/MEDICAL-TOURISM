"use client";

import React, { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  Save, 
  CheckCircle2, 
  ShieldCheck 
} from "lucide-react";

export default function PatientProfilePage() {
  const [profile, setProfile] = useState({
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+44 7911 123456",
    country: "United Kingdom",
    dob: "1982-04-12",
    gender: "Female",
    passportNo: "UK9988221A",
    emergencyContact: "Mark Jenkins (+44 7911 654321)",
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
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Patient Profile & Personal Info
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Your personal details are used for official Indian Medical Visa invitation letters and hospital admission registration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">First Name</label>
            <input
              type="text"
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Residence</label>
            <input
              type="text"
              value={profile.country}
              onChange={(e) => setProfile({ ...profile, country: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Passport / National ID</label>
            <input
              type="text"
              value={profile.passportNo}
              onChange={(e) => setProfile({ ...profile, passportNo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
            <input
              type="text"
              value={profile.emergencyContact}
              onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          {isSaved && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
