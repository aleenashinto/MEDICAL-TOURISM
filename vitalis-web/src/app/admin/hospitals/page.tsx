"use client";

import React from "react";
import { 
  Building2, 
  MapPin, 
  Award, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Search,
  BedDouble,
  Activity
} from "lucide-react";

export default function HospitalsAdminPage() {
  const hospitals = [
    {
      name: "Aster Medcity",
      city: "Kochi, Kerala",
      accreditations: ["JCI Accredited", "NABH", "GreenOT"],
      beds: "670 Beds",
      specialties: ["Cardiology", "Orthopedics", "Oncology", "Neurology"],
      casesActive: 24,
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "Amrita Institute of Medical Sciences",
      city: "Kochi, Kerala",
      accreditations: ["NABH", "NABL", "ISO 9001"],
      beds: "1,350 Beds",
      specialties: ["Robotic Cardiac Surgery", "Organ Transplant", "Pediatric Cardiology"],
      casesActive: 19,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    },
    {
      name: "VPS Lakeshore Hospital",
      city: "Kochi, Kerala",
      accreditations: ["NABH", "JCI Certified"],
      beds: "450 Beds",
      specialties: ["Gastroenterology", "Liver Transplant", "Orthopedics"],
      casesActive: 12,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Accredited Partner Hospital Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Kerala's top JCI & NABH accredited tertiary and quaternary care medical institutions.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Add Hospital Partner
        </button>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hosp) => (
          <div
            key={hosp.name}
            className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-40 relative bg-slate-900 overflow-hidden">
                <img
                  src={hosp.image}
                  alt={hosp.name}
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-semibold text-emerald-400">
                  {hosp.casesActive} Active Cases
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h2 className="text-base font-bold text-white">{hosp.name}</h2>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{hosp.city}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hosp.accreditations.map((acc) => (
                    <span
                      key={acc}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {acc}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <div>Capacity: <strong className="text-slate-200">{hosp.beds}</strong></div>
                  <div>Key Units: <span className="text-slate-300">{hosp.specialties.join(", ")}</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between">
              <button className="text-xs text-blue-400 hover:text-blue-300 font-semibold">
                Edit Institutional Profile
              </button>
              <button className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-xs font-semibold transition-all">
                Manage Doctors
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
