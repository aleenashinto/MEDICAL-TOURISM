"use client";

import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("maides_user_name");
      const storedEmail = localStorage.getItem("maides_user_email");
      const storedLocation = localStorage.getItem("maides_user_location");
      const storedPhone = localStorage.getItem("maides_user_phone");

      if (storedName || storedEmail) {
        const parts = (storedName || "Sarah Jenkins").trim().split(" ");
        const first = parts[0] || "Aleena";
        const last = parts.slice(1).join(" ") || "";

        setProfile((prev) => ({
          ...prev,
          firstName: first,
          lastName: last,
          email: storedEmail || prev.email,
          country: storedLocation || prev.country,
          phone: storedPhone || prev.phone,
        }));
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_user_name", `${profile.firstName} ${profile.lastName}`.trim());
      localStorage.setItem("maides_user_email", profile.email);
      localStorage.setItem("maides_user_location", profile.country);
      localStorage.setItem("maides_user_phone", profile.phone);
    }
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
            <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
            <input
              type="text"
              required
              value={profile.firstName}
              onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
            <input
              type="text"
              value={profile.lastName}
              onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address (Registered)</label>
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
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
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Passport / National ID</label>
            <input
              type="text"
              value={profile.passportNo}
              onChange={(e) => setProfile({ ...profile, passportNo: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
            <select
              value={profile.gender}
              onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Contact</label>
          <input
            type="text"
            value={profile.emergencyContact}
            onChange={(e) => setProfile({ ...profile, emergencyContact: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
          />
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Profile synced with Indian Medical Visa portal</span>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Profile updated successfully!
              </span>
            )}
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
