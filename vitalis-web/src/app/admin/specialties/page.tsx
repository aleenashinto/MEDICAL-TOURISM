"use client";

import React, { useState } from "react";
import { 
  HeartPulse, 
  Search, 
  Plus, 
  Activity, 
  Building2, 
  Stethoscope 
} from "lucide-react";

export default function SpecialtiesAdminPage() {
  const specialties = [
    { name: "Orthopedics & Joint Replacement", count: "14 Procedures", hospitals: "Aster, Lakeshore, Rajagiri" },
    { name: "Cardiology & Robotic Cardiac Surgery", count: "18 Procedures", hospitals: "Amrita, Aster Medcity" },
    { name: "Ayurveda & Integrative Medicine", count: "22 Programs", hospitals: "Somatheeram, Vaidyaratnam" },
    { name: "Oncology & Proton Beam Therapy", count: "12 Procedures", hospitals: "Amrita, Aster, Lakeshore" },
    { name: "Neurology & Spine Surgery", count: "16 Procedures", hospitals: "Rajagiri, Aster Medcity" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Medical Specialties & Centers of Excellence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure clinical specialty clusters and their linked partner hospitals.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Add Specialty
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {specialties.map((s) => (
          <div key={s.name} className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl space-y-3">
            <h2 className="text-sm font-bold text-white">{s.name}</h2>
            <div className="text-xs text-blue-400 font-semibold">{s.count}</div>
            <div className="text-xs text-slate-400">Available at: {s.hospitals}</div>
            <div className="pt-2 border-t border-slate-800 flex justify-end">
              <button className="px-3 py-1 bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-all">
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
