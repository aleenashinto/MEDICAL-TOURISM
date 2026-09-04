"use client";

import React from "react";
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
  CreditCard
} from "lucide-react";

export default function PatientCasesPage() {
  const activeCase = {
    id: "CAS-2026-089",
    treatment: "Minimally Invasive Total Knee Arthroplasty",
    hospital: "Aster Medcity, Kochi, Kerala",
    doctor: "Dr. Vijay Anand (Chief Orthopedic Surgeon)",
    currentStepIndex: 5,
    totalSteps: 10,
    steps: [
      { step: 1, name: "Inquiry & Medical Records Submitted", status: "COMPLETED", date: "Aug 20, 2026" },
      { step: 2, name: "Clinical Assessment & Doctor Opinion", status: "COMPLETED", date: "Aug 22, 2026" },
      { step: 3, name: "Custom Treatment Plan & Quotation Accepted", status: "COMPLETED", date: "Aug 25, 2026" },
      { step: 4, name: "Video Consultation with Dr. Vijay Anand", status: "COMPLETED", date: "Aug 28, 2026" },
      { step: 5, name: "Indian Medical Visa Invitation Issued", status: "IN_PROGRESS", date: "Sep 02, 2026", active: true },
      { step: 6, name: "Flight Tickets & Kochi Marriott Booking", status: "UPCOMING", date: "Estimated Sep 15, 2026" },
      { step: 7, name: "Airport Pickup & Hospital Admission", status: "UPCOMING", date: "Estimated Sep 18, 2026" },
      { step: 8, name: "Knee Replacement Procedure Performed", status: "UPCOMING", date: "Estimated Sep 20, 2026" },
      { step: 9, name: "Physiotherapy & Discharge to Hotel", status: "UPCOMING", date: "Estimated Sep 25, 2026" },
      { step: 10, name: "Fit-to-Fly Certificate & Post-Op Follow-up", status: "UPCOMING", date: "Estimated Oct 02, 2026" },
    ],
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Overview Banner */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                Active Medical Case
              </span>
              <span className="text-xs text-slate-500 font-mono">{activeCase.id}</span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-2">
              {activeCase.treatment}
            </h1>
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
              <div className="text-xs text-slate-500 font-medium">Overall Progress</div>
              <div className="text-2xl font-bold text-blue-600">50%</div>
            </div>
            <Link
              href="/patient/travel"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Download className="w-3.5 h-3.5" />
              Download Visa Invitation
            </Link>
          </div>
        </div>
      </div>

      {/* 10-Step Timeline Journey Card */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm">
        <h2 className="text-base font-bold text-slate-900 mb-6 flex items-center gap-2">
          <HeartPulse className="w-5 h-5 text-blue-600" />
          Your 10-Step Healthcare Roadmap
        </h2>

        <div className="relative border-l-2 border-slate-100 ml-4 pl-6 space-y-6">
          {activeCase.steps.map((s) => (
            <div key={s.step} className="relative">
              {/* Node Icon */}
              <div
                className={`absolute -left-[35px] top-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                  s.status === "COMPLETED"
                    ? "bg-emerald-500 text-white"
                    : s.active
                    ? "bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse"
                    : "bg-slate-100 text-slate-400 border border-slate-200"
                }`}
              >
                {s.status === "COMPLETED" ? <CheckCircle2 className="w-4 h-4" /> : s.step}
              </div>

              {/* Step Content */}
              <div
                className={`p-4 rounded-xl border ${
                  s.active
                    ? "bg-blue-50/50 border-blue-200 ring-1 ring-blue-200"
                    : "bg-slate-50/60 border-slate-100"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="font-semibold text-sm text-slate-800">{s.name}</div>
                  <div className="text-xs text-slate-500 font-medium">{s.date}</div>
                </div>

                {s.active && (
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
