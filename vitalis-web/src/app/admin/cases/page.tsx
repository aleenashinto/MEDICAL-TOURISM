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
  CreditCard,
  X,
  Send,
  Download
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CasesPage() {
  const router = useRouter();
  const [selectedCase, setSelectedCase] = useState<any | null>(null);
  const [modalType, setModalType] = useState<"MANAGE" | "QUOTATION" | "VISA" | "NEW" | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const [cases, setCases] = useState([
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
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const advanceStage = (caseId: string) => {
    setCases(prev => prev.map(c => {
      if (c.id === caseId && c.stageIndex < c.totalSteps) {
        return { ...c, stageIndex: c.stageIndex + 1 };
      }
      return c;
    }));
    showToast(`Case ${caseId} progressed to next journey step!`);
    setModalType(null);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

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
          <button 
            onClick={() => setModalType("NEW")}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
          >
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
                <button 
                  onClick={() => {
                    setSelectedCase(c);
                    setModalType("QUOTATION");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] font-medium transition-all cursor-pointer"
                >
                  Generate Quotation
                </button>
                <button 
                  onClick={() => {
                    setSelectedCase(c);
                    setModalType("VISA");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 text-[11px] font-medium transition-all cursor-pointer"
                >
                  Issue Visa Letter
                </button>
                <button 
                  onClick={() => {
                    setSelectedCase(c);
                    setModalType("MANAGE");
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#0E82FD] hover:bg-blue-600 text-white text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Manage Case
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Dynamic Action Modals */}
      {modalType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                {modalType === "QUOTATION" && `Quotation Generator • ${selectedCase?.id}`}
                {modalType === "VISA" && `Indian Medical Visa Letter • ${selectedCase?.id}`}
                {modalType === "MANAGE" && `Manage Case • ${selectedCase?.id}`}
                {modalType === "NEW" && "Create New International Medical Case"}
              </h3>
              <button 
                onClick={() => setModalType(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalType === "QUOTATION" && (
              <div className="space-y-3 text-xs text-slate-300">
                <p>Generating standardized multi-currency quotation for <strong>{selectedCase?.patientName}</strong>:</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div>Package: <strong>{selectedCase?.treatment}</strong></div>
                  <div>Base Estimate: <strong className="text-emerald-400">{selectedCase?.estimatedCost} (USD)</strong></div>
                  <div>Hospital: {selectedCase?.hospital}</div>
                </div>
                <button
                  onClick={() => {
                    showToast(`Quotation of ${selectedCase?.estimatedCost} dispatched to ${selectedCase?.patientName}!`);
                    setModalType(null);
                  }}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all shadow"
                >
                  Issue & Send Quotation to Patient
                </button>
              </div>
            )}

            {modalType === "VISA" && (
              <div className="space-y-3 text-xs text-slate-300">
                <p>Generate FRRO compliant Indian Medical Visa invitation letter for <strong>{selectedCase?.patientName}</strong>.</p>
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-1">
                  <div>Attending Hospital: <strong>{selectedCase?.hospital}</strong></div>
                  <div>Signing Doctor: <strong>{selectedCase?.doctor}</strong></div>
                  <div>Duration: <strong>90 Days Medical Visa (Triple Entry)</strong></div>
                </div>
                <button
                  onClick={() => {
                    showToast(`Official FRRO Medical Visa invitation issued for ${selectedCase?.patientName}!`);
                    setModalType(null);
                  }}
                  className="w-full py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl font-bold transition-all shadow flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Sign & Issue Visa Invitation
                </button>
              </div>
            )}

            {modalType === "MANAGE" && (
              <div className="space-y-4 text-xs text-slate-300">
                <div>Patient: <strong>{selectedCase?.patientName} ({selectedCase?.country})</strong></div>
                <div>Status: <span className="text-blue-400 font-bold">{selectedCase?.stageName}</span></div>
                <button
                  onClick={() => advanceStage(selectedCase.id)}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition-all shadow"
                >
                  Advance Case to Step {selectedCase?.stageIndex + 1}
                </button>
              </div>
            )}

            {modalType === "NEW" && (
              <form onSubmit={(e) => {
                e.preventDefault();
                showToast("New Medical Case registered successfully!");
                setModalType(null);
              }} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Patient Name</label>
                  <input required placeholder="e.g. David Brown" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Procedure</label>
                  <input required placeholder="e.g. Total Knee Arthroplasty" className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" />
                </div>
                <button type="submit" className="w-full py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl font-bold shadow">
                  Create Case
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
