"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  HeartPulse, 
  Calendar, 
  FileText, 
  Plane, 
  CreditCard, 
  ArrowRight,
  Clock, 
  CheckCircle2,
  Building2,
  Stethoscope,
  AlertCircle,
  MapPin,
  Mail,
  UserCheck
} from "lucide-react";

export default function PatientDashboardPage() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    location: "",
    patientId: "MED-2026-00125"
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("maides_user_name") || "";
      const storedEmail = localStorage.getItem("maides_user_email") || "";
      const storedLocation = localStorage.getItem("maides_user_location") || "";
      setUser({
        name: storedName || "Patient",
        email: storedEmail,
        location: storedLocation,
        patientId: "MED-2026-00125"
      });
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#0F2042] via-[#1E3A8A] to-[#0E82FD] rounded-3xl p-6 md:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white backdrop-blur-md">
              Patient ID: {user.patientId}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5" />
              Verified Patient
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-black tracking-tight">
            Welcome back, {user.name}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-blue-100">
            <div className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-300" />
              <span>{user.email}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-300" />
              <span>Location: {user.location}</span>
            </div>
          </div>

          <p className="text-blue-100 text-xs md:text-sm pt-1 leading-relaxed">
            Your cardiac surgery pathway with Aster Medcity Kochi is currently in{" "}
            <span className="font-bold text-white underline decoration-sky-400 decoration-2">Travel & Logistics Planning</span>.
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Active Case
            </span>
            <HeartPulse className="w-5 h-5 text-rose-500" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-slate-900">Off-Pump CABG</div>
            <div className="text-xs text-blue-600 font-medium mt-0.5">Aster Medcity, Kochi</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Next Appointment
            </span>
            <Calendar className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-slate-900">15 Oct 2026 • 10:30 AM</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Video Pre-Op Review</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Medical Visa
            </span>
            <Plane className="w-5 h-5 text-emerald-500" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-emerald-600">Letter Issued</div>
            <div className="text-xs text-slate-500 font-medium mt-0.5">Ref: KL-MEDVISA-2026-8891</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Payment Status
            </span>
            <CreditCard className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3">
            <div className="text-base font-bold text-slate-900">$2,000 Paid</div>
            <div className="text-xs text-amber-600 font-medium mt-0.5">$4,400 Balance on Admission</div>
          </div>
        </div>
      </div>

      {/* Journey Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-base font-bold text-slate-900">Medical Journey Timeline</h2>
            <p className="text-xs text-slate-500">Track your treatment milestones step-by-step</p>
          </div>
          <Link
            href="/patient/cases"
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            View Full Case <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
              1
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Enquiry Submitted & Qualified</div>
              <div className="text-xs text-slate-500 mt-0.5">Clinical records reviewed by Medical Board</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
              2
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Doctor Second Opinion & Protocol Approved</div>
              <div className="text-xs text-slate-500 mt-0.5">Dr. Manoj Joseph — Beating Heart OPCABG plan confirmed</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
              3
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-900">Treatment Quotation Accepted</div>
              <div className="text-xs text-slate-500 mt-0.5">Platinum VIP Package with 7-day waterfront suite stay</div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-blue-600 ring-4 ring-blue-100 flex items-center justify-center text-white text-[10px] font-bold">
              4
            </div>
            <div>
              <div className="text-sm font-bold text-blue-600">Travel, Visa & Airport Logistics (Current)</div>
              <div className="text-xs text-slate-600 mt-0.5">Airport transfer confirmed with Cochin International Airport (COK)</div>
            </div>
          </div>

          <div className="relative opacity-50">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px]">
              5
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">Hospital Admission & Treatment</div>
              <div className="text-xs text-slate-400 mt-0.5">Aster Medcity, Cheranalloor, Kochi</div>
            </div>
          </div>

          <div className="relative opacity-50">
            <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-slate-300 text-white flex items-center justify-center text-[10px]">
              6
            </div>
            <div>
              <div className="text-sm font-semibold text-slate-700">Discharge, Fit-to-Fly & Follow-Up</div>
              <div className="text-xs text-slate-400 mt-0.5">Post-operative tele-consultations</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
