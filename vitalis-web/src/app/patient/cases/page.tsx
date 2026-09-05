"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Building2, 
  Stethoscope, 
  FileText, 
  Download, 
  Plane,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Plus,
  RefreshCw,
  Eye,
  MessageSquare,
  AlertCircle
} from "lucide-react";

export default function PatientCasesPage() {
  const [selectedCaseId, setSelectedCaseId] = useState("CAS-2026-089");
  const [toast, setToast] = useState<string | null>(null);

  const [patientCases, setPatientCases] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await fetch('/api/cases');
        if (res.ok) {
          const data = await res.json();
          setPatientCases(data.cases || []);
          if (data.cases?.length > 0) {
            setSelectedCaseId(data.cases[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch cases", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCases();
  }, []);

  const activeCase = patientCases.find(c => c.id === selectedCaseId) || null;

  const handleDownloadProposal = () => {
    const text = `MAIDES KERALA MEDICAL TOURISM - OFFICIAL TREATMENT PLAN
Case ID: ${activeCase.id}
Treatment: ${activeCase.treatment}
Specialty: ${activeCase.specialty}
Hospital: ${activeCase.hospital}
Consultant: ${activeCase.doctor}
Estimated Treatment Package: ${activeCase.estimatedCost}

Clinical Milestones:
${activeCase.steps.map((s: any) => `[${s.status}] Step ${s.step}: ${s.name} (${s.date})`).join("\n")}

Accreditation: JCI / NABH Accredited Facility.
Helpline: +91 98470 11223 (24/7 International Liaison)`;

    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAIDES_Treatment_Plan_${activeCase.id}.txt`;
    a.click();
    setToast("Treatment proposal downloaded successfully!");
    setTimeout(() => setToast(null), 3000);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
      </div>
    );
  }

  if (!activeCase) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <div className="bg-white border border-slate-200 p-10 rounded-2xl shadow-sm text-center">
          <HeartPulse className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-900">No Medical Cases Found</h2>
          <p className="text-slate-500 mt-2 text-sm">You do not have any active medical cases in your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Case Selector Tabs */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Medical Cases & Clinical Care Pathways
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time milestone tracking for your surgeries, consultations, and post-op recovery in Kerala.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {patientCases.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCaseId(c.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCaseId === c.id
                  ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {c.id}
            </button>
          ))}
        </div>
      </div>

      {/* Top Overview Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                activeCase.status === "Completed"
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
                {activeCase.status}
              </span>
              <span className="text-xs text-slate-500 font-mono">{activeCase.id}</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-2">
              {activeCase.treatment}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
              <div className="flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                <span>{activeCase.hospital}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-600" />
                <span>{activeCase.doctor}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <div className="text-right">
              <div className="text-xs text-slate-500 font-medium">Progress Completion</div>
              <div className="text-2xl font-bold text-blue-600">{activeCase.progressPercent}%</div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadProposal}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Download className="w-3.5 h-3.5" />
                Treatment Proposal
              </button>
              <Link
                href="/patient/travel"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Plane className="w-3.5 h-3.5" />
                Travel & Visa
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 10-Step Timeline Journey Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h3 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-blue-600" />
          Healthcare Pathway Roadmap ({activeCase.steps.length} Milestones)
        </h3>

        <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
          {activeCase.steps.map((s: any) => (
            <div key={s.step} className="relative">
              {/* Node Icon */}
              <div
                className={`absolute -left-[35px] top-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.status === "COMPLETED"
                    ? "bg-emerald-500 text-white"
                    : (s as any).active
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {s.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </div>

              {/* Step Content */}
              <div
                className={`p-4 rounded-xl border ${
                  (s as any).active
                    ? "bg-blue-50/50 border-blue-200 ring-1 ring-blue-200"
                    : "bg-slate-50/60 border-slate-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-semibold text-sm text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{s.date}</div>
                </div>

                {(s as any).active && (
                  <div className="mt-3 pt-3 border-t border-blue-100 flex flex-wrap items-center justify-between gap-2">
                    <p className="text-xs text-blue-800">
                      <strong>Current Action:</strong> Your visa invitation letter is ready. Submit it at your local Indian Embassy or apply for an e-Medical Visa online.
                    </p>
                    <Link
                      href="/patient/travel"
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 inline-flex items-center gap-1"
                    >
                      View Visa Details <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

