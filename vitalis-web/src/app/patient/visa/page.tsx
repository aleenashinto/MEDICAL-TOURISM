"use client";

import React, { useState } from "react";
import { 
  Plane, 
  FileCheck,
  Download,
  Check,
  MapPin,
  Building2,
  Calendar,
  AlertCircle
} from "lucide-react";

export default function MedicalVisaPage() {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const visaDetails = {
    status: "Letter Issued",
    refNo: "KL-MEDVISA-2026-8891",
    issuedDate: "Sep 02, 2026",
    validUntil: "Dec 02, 2026",
    hospital: "Aster Medcity, Kochi",
    doctor: "Dr. Manoj Joseph",
    attendant: "Michael Jenkins (Spouse)",
    frroStatus: "Pending Registration on Arrival"
  };

  const handleDownloadVisa = () => {
    setIsDownloaded(true);
    const content = `GOVERNMENT OF INDIA - EMBASSY VISA INVITATION SUPPORT
Ref No: ${visaDetails.refNo}
Date: ${visaDetails.issuedDate}

This is to certify that Sarah Jenkins has been accepted for medical treatment at ${visaDetails.hospital} under the care of ${visaDetails.doctor}.

Attendant: ${visaDetails.attendant}
Validity: ${visaDetails.validUntil}
Accreditation: Joint Commission International (JCI) Accredited Hospital.`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAIDES-Visa-Letter-${visaDetails.refNo}.txt`;
    a.click();
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Medical Visa Assistance
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Access your official medical visa invitation letter and FRRO registration details.
        </p>
      </div>

      <div className="bg-gradient-to-r from-emerald-600 to-teal-800 text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-emerald-100 text-xs font-semibold backdrop-blur-md">
              Status: {visaDetails.status}
            </span>
            <h2 className="text-lg font-bold text-white mt-2">
              Indian Medical Visa Support Document
            </h2>
            <p className="text-xs text-emerald-100 mt-0.5">
              Ref No: {visaDetails.refNo} • Issued for {visaDetails.hospital}
            </p>
          </div>
          <button 
            onClick={handleDownloadVisa}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-bold transition-all shadow shrink-0 cursor-pointer"
          >
            {isDownloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-emerald-600" />}
            {isDownloaded ? "Downloaded!" : "Download Visa Letter (PDF)"}
          </button>
        </div>

        <div className="pt-3 border-t border-white/10 text-xs text-emerald-100 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          <div>Treating Hospital: <br/><strong className="text-white">{visaDetails.hospital}</strong></div>
          <div>Physician: <br/><strong className="text-white">{visaDetails.doctor}</strong></div>
          <div>Issue Date: <br/><strong className="text-white">{visaDetails.issuedDate}</strong></div>
          <div>Validity: <br/><strong className="text-white">{visaDetails.validUntil}</strong></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">FRRO Registration</h2>
              <div className="text-xs text-slate-500">Foreigners Regional Registration Office</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="font-semibold text-slate-800 text-sm">Status: {visaDetails.frroStatus}</div>
            <p className="text-slate-600 leading-relaxed">
              Medical Visa holders are required to register with the FRRO within 14 days of arrival. Your MAIDES care coordinator will assist you with this process upon your admission to the hospital.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Required Documents</h2>
              <div className="text-xs text-slate-500">Please carry physical copies</div>
            </div>
          </div>

          <ul className="space-y-2 text-xs text-slate-600">
            <li className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Original Passport (valid for 6 months minimum)</span>
            </li>
            <li className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Printed copy of Medical Visa & Invitation Letter</span>
            </li>
            <li className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>4 Passport Size Photographs</span>
            </li>
            <li className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Proof of Address & Yellow Fever Certificate (if applicable)</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
