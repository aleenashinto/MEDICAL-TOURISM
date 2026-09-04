"use client";

import React, { useState } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  FileText, 
  HeartPulse, 
  ShieldCheck,
  ChevronRight
} from "lucide-react";

export default function PatientsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const patients = [
    {
      id: "PAT-001",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@example.com",
      phone: "+44 7911 123456",
      country: "United Kingdom",
      dob: "1982-04-12",
      gender: "Female",
      activeCase: "CAS-2026-089 (Knee Replacement)",
      status: "ACTIVE",
      totalSpent: "$6,200",
      joinedDate: "2026-08-20",
    },
    {
      id: "PAT-002",
      name: "Mohammed Al-Maktoum",
      email: "m.maktoum@example.ae",
      phone: "+971 50 987 6543",
      country: "United Arab Emirates",
      dob: "1975-11-03",
      gender: "Male",
      activeCase: "CAS-2026-088 (Cardiac Repair)",
      status: "ACTIVE",
      totalSpent: "$11,500",
      joinedDate: "2026-08-25",
    },
    {
      id: "PAT-003",
      name: "Elena Rostova",
      email: "elena.rostova@example.de",
      phone: "+49 170 555 1234",
      country: "Germany",
      dob: "1988-06-21",
      gender: "Female",
      activeCase: "CAS-2026-085 (Ayurvedic Detox)",
      status: "COMPLETED",
      totalSpent: "$4,200",
      joinedDate: "2026-07-14",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            International Patients Directory
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global patient accounts, medical history summaries, and case ownership records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5" />
            Add Patient
          </button>
        </div>
      </div>

      {/* Directory Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, email, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Country & DOB</th>
                <th className="py-3 px-4">Active Medical Case</th>
                <th className="py-3 px-4">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {patients.map((pat) => (
                <tr key={pat.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-blue-600/20 border border-blue-500/30 text-blue-400 font-bold flex items-center justify-center text-xs">
                        {pat.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-200">{pat.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{pat.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300">{pat.email}</div>
                    <div className="text-[11px] text-slate-500">{pat.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300">{pat.country}</div>
                    <div className="text-[11px] text-slate-500">{pat.dob} ({pat.gender})</div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-blue-400 font-medium">{pat.activeCase}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        pat.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      {pat.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white font-medium text-[11px] transition-all">
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
