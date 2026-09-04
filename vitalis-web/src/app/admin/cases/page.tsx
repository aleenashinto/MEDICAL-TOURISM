"use client";

import React, { useState } from "react";
import { 
  HeartPulse, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Building2, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Plane,
  CreditCard
} from "lucide-react";

export default function CasesPage() {
  const [activeTab, setActiveTab] = useState("ALL");

  const cases = [
    {
      id: "CAS-2026-089",
      patientName: "Sarah Jenkins",
      country: "United Kingdom",
      condition: "Severe Osteoarthritis Right Knee",
      treatment: "Minimally Invasive Total Knee Arthroplasty",
      hospital: "Aster Medcity, Kochi",
      doctor: "Dr. Vijay Anand (Orthopedics)",
      stageIndex: 4,
      stageName: "VISA_LOGISTICS_COORDINATION",
      totalSteps: 10,
      estimatedCost: "$6,200",
      arrivalDate: "2026-09-18",
      coordinator: "Admin Primary",
    },
    {
      id: "CAS-2026-088",
      patientName: "Mohammed Al-Maktoum",
      country: "UAE",
      condition: "Mitral Valve Prolapse",
      treatment: "Robotic-Assisted Mitral Valve Repair",
      hospital: "Amrita Institute of Medical Sciences",
      doctor: "Dr. K. S. Muralidharan (Cardiac)",
      stageIndex: 2,
      stageName: "QUOTATION_ISSUANCE",
      totalSteps: 10,
      estimatedCost: "$11,500",
      arrivalDate: "Pending Confirmation",
      coordinator: "Admin Primary",
    },
    {
      id: "CAS-2026-087",
      patientName: "David Miller",
      country: "Australia",
      condition: "Lumbar Disc Herniation L4-L5",
      treatment: "Endoscopic Microdiscectomy",
      hospital: "Rajagiri Hospital, Aluva",
      doctor: "Dr. Rajesh K. (Spine Surgery)",
      stageIndex: 7,
      stageName: "TREATMENT_IN_PROGRESS",
      totalSteps: 10,
      estimatedCost: "$5,800",
      arrivalDate: "2026-09-02 (In Kochi)",
      coordinator: "Admin Primary",
    },
  ];

  const stepsList = [
    "1. Inquiry Received",
    "2. Clinical Triage",
    "3. Quotation Issued",
    "4. Teleconsult Completed",
    "5. Visa Letter Generated",
    "6. Flight & Hotel Booked",
    "7. Hospital Admission",
    "8. Surgery Performed",
    "9. Discharge & Recovery",
    "10. Follow-Up & Feedback",
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            10-Step Medical Case Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            End-to-end patient journey coordination from clinical matching to surgical recovery in Kerala.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
            <Plus className="w-3.5 h-3.5" />
            Create Medical Case
          </button>
        </div>
      </div>

      {/* Case Cards */}
      <div className="space-y-4">
        {cases.map((c) => (
          <div
            key={c.id}
            className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4"
          >
            {/* Top Row: Info + Stage */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#0E82FD] px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    {c.id}
                  </span>
                  <h2 className="text-base font-bold text-white">{c.patientName}</h2>
                  <span className="text-xs text-slate-400">({c.country})</span>
                </div>
                <div className="text-xs text-slate-300 font-medium mt-1">
                  {c.condition} • <span className="text-blue-300 font-semibold">{c.treatment}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>{c.hospital}</span>
                </div>
                <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-slate-300">
                  <Stethoscope className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{c.doctor}</span>
                </div>
                <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 flex items-center gap-2 text-emerald-300 font-bold">
                  <span>{c.estimatedCost}</span>
                </div>
              </div>
            </div>

            {/* 10-Step Progress Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <span className="font-semibold text-slate-300">
                  Step {c.stageIndex} of {c.totalSteps}: {c.stageName.replace(/_/g, " ")}
                </span>
                <span className="text-blue-400 font-bold">{Math.round((c.stageIndex / c.totalSteps) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                <div
                  className="h-full bg-gradient-to-r from-[#0E82FD] to-emerald-400 rounded-full"
                  style={{ width: `${(c.stageIndex / c.totalSteps) * 100}%` }}
                />
              </div>
            </div>

            {/* Actions Toolbar */}
            <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                <span>Arrival: <strong className="text-slate-200">{c.arrivalDate}</strong></span>
                <span>Coordinator: <strong className="text-slate-200">{c.coordinator}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] font-medium transition-all">
                  Generate Quotation
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] font-medium transition-all">
                  Issue Visa Letter
                </button>
                <button className="px-3 py-1.5 rounded-lg bg-[#0E82FD] hover:bg-blue-600 text-white text-[11px] font-semibold transition-all">
                  Manage Case
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
