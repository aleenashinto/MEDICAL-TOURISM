"use client";

import React, { useState } from "react";
import { 
  Activity, 
  Search, 
  Plus, 
  Building2, 
  Clock, 
  DollarSign, 
  Tag, 
  Stethoscope,
  Filter
} from "lucide-react";

export default function TreatmentsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const treatments = [
    {
      id: "TRT-001",
      name: "Minimally Invasive Total Knee Replacement",
      specialty: "Orthopedics & Joint Reconstruction",
      duration: "4 - 5 Days Hospital Stay",
      costUSD: "$6,200",
      costINR: "₹5,14,600",
      usSavings: "Save 75% vs US ($45,000)",
      hospitals: ["Aster Medcity", "VPS Lakeshore", "Rajagiri Hospital"],
      doctors: ["Dr. Vijay Anand", "Dr. Rajesh K."],
      status: "ACTIVE",
    },
    {
      id: "TRT-002",
      name: "Robotic-Assisted Mitral Valve Repair",
      specialty: "Cardiology & Cardiothoracic",
      duration: "6 - 7 Days Hospital Stay",
      costUSD: "$11,500",
      costINR: "₹9,54,500",
      usSavings: "Save 80% vs US ($120,000)",
      hospitals: ["Amrita Institute", "Aster Medcity"],
      doctors: ["Dr. K. S. Muralidharan"],
      status: "ACTIVE",
    },
    {
      id: "TRT-003",
      name: "Comprehensive Ayurvedic Panchakarma & Stress Detox",
      specialty: "Ayurveda & Integrative Medicine",
      duration: "14 - 21 Days Stay",
      costUSD: "$4,200",
      costINR: "₹3,48,600",
      usSavings: "Authentic NABH-Accredited Care",
      hospitals: ["Somatheeram Ayurvedic Village", "Vaidyaratnam"],
      doctors: ["Dr. Arya Varma"],
      status: "ACTIVE",
    },
    {
      id: "TRT-004",
      name: "Proton Beam Therapy & Precision Oncology",
      specialty: "Oncology & Cancer Care",
      duration: "Outpatient / Short Stay",
      costUSD: "$18,000",
      costINR: "₹14,94,000",
      usSavings: "Save 65% vs US ($85,000)",
      hospitals: ["Amrita Institute", "Aster Medcity"],
      doctors: ["Dr. Thomas Mathew"],
      status: "ACTIVE",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Medical Treatments & Surgical Procedures Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage procedures, standardized package prices, US/UK cost comparisons, and hospital linkages.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Add Treatment Package
        </button>
      </div>

      {/* Treatments List */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatments or specialties..."
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
                <th className="py-3 px-4">Treatment Name & Code</th>
                <th className="py-3 px-4">Specialty Unit</th>
                <th className="py-3 px-4">Standard Cost (USD/INR)</th>
                <th className="py-3 px-4">Cost Savings vs US</th>
                <th className="py-3 px-4">Offered At Hospitals</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {treatments.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{t.name}</div>
                    <div className="text-[11px] text-blue-400 font-mono">{t.id} • {t.duration}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {t.specialty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-400">{t.costUSD}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{t.costINR}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="text-emerald-400 font-medium text-[11px]">{t.usSavings}</span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300 text-[11px]">{t.hospitals.join(", ")}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white font-medium text-[11px] transition-all">
                      Edit
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
