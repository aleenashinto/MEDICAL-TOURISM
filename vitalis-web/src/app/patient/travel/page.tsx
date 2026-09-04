"use client";

import React, { useState } from "react";
import { 
  Plane, 
  FileText, 
  Download, 
  Building2, 
  MapPin, 
  Car, 
  Hotel, 
  CheckCircle2,
  Calendar,
  Phone,
  UserCheck,
  Check
} from "lucide-react";

export default function PatientTravelPage() {
  const [isDownloaded, setIsDownloaded] = useState(false);

  const travelDetails = {
    destination: "Kochi (Cochin), Kerala, India",
    airport: "Cochin International Airport (COK)",
    flight: "Flight details will be updated once booked",
    visaLetter: {
      refNo: "MED-VISA-2026-089",
      issuedDate: "Sep 02, 2026",
      hospital: "Aster Medcity, Kochi",
      doctor: "Dr. Vijay Anand",
      validUntil: "Dec 02, 2026",
    },
    hotel: {
      name: "Kochi Marriott Hotel (Lulu Campus)",
      address: "Edappally, Kochi, Kerala 682024",
      stayDuration: "14 Nights (Post-discharge recovery)",
      distanceToHospital: "4.5 km (10 mins by patient shuttle)",
    },
    liaison: {
      name: "Rahul Nair",
      role: "Senior International Patient Coordinator",
      phone: "+91 98470 11223",
      email: "rahul.nair@vitalis.health",
      languages: "English, Arabic, Hindi, Malayalam",
    },
  };

  const handleDownloadVisa = () => {
    setIsDownloaded(true);
    const content = `GOVERNMENT OF INDIA - EMBASSY VISA INVITATION SUPPORT
Ref No: ${travelDetails.visaLetter.refNo}
Date: ${travelDetails.visaLetter.issuedDate}

This is to certify that Sarah Jenkins (UK Passport: UK9988221A) has been accepted for medical treatment (Minimally Invasive Knee Replacement) at ${travelDetails.visaLetter.hospital} under the care of ${travelDetails.visaLetter.doctor}.

Validity: ${travelDetails.visaLetter.validUntil}
Accreditation: Joint Commission International (JCI) Accredited Hospital.`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAIDES-Visa-Letter-${travelDetails.visaLetter.refNo}.txt`;
    a.click();
    setTimeout(() => setIsDownloaded(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Travel Itinerary & Medical Visa Hub
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Everything you need for your medical journey to Kerala: visa invitation letter, hotel details, and ground support.
        </p>
      </div>

      {/* Visa Invitation Card */}
      <div className="bg-gradient-to-r from-blue-600 to-[#0F2042] text-white p-6 rounded-2xl shadow-md space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-blue-100 text-xs font-semibold backdrop-blur-md">
              Official FRRO Visa Invitation Letter
            </span>
            <h2 className="text-lg font-bold text-white mt-2">
              Indian Medical Visa Support Document
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              Ref No: {travelDetails.visaLetter.refNo} • Issued for Aster Medcity
            </p>
          </div>
          <button 
            onClick={handleDownloadVisa}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white text-blue-900 hover:bg-blue-50 text-xs font-bold transition-all shadow shrink-0 cursor-pointer"
          >
            {isDownloaded ? <Check className="w-4 h-4 text-emerald-600" /> : <Download className="w-4 h-4 text-blue-600" />}
            {isDownloaded ? "Downloaded!" : "Download Visa Letter (PDF/Doc)"}
          </button>
        </div>

        <div className="pt-3 border-t border-white/10 text-xs text-blue-100 grid grid-cols-1 sm:grid-cols-3 gap-2">
          <div>Treating Hospital: <strong className="text-white">{travelDetails.visaLetter.hospital}</strong></div>
          <div>Physician: <strong className="text-white">{travelDetails.visaLetter.doctor}</strong></div>
          <div>Validity: <strong className="text-white">{travelDetails.visaLetter.validUntil}</strong></div>
        </div>
      </div>

      {/* 2-Column Grid: Airport & Liaison + Hotel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Dedicated Liaison */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Your Kerala Patient Liaison</h2>
              <div className="text-xs text-slate-500">Available 24/7 for airport pickup & translation</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs">
            <div className="font-semibold text-slate-800 text-sm">{travelDetails.liaison.name}</div>
            <div className="text-slate-600">{travelDetails.liaison.role}</div>
            <a 
              href={`tel:${travelDetails.liaison.phone}`}
              className="text-slate-700 flex items-center gap-1.5 pt-1 hover:text-blue-600 font-semibold"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              <span>{travelDetails.liaison.phone}</span>
            </a>
            <div className="text-slate-500 text-[11px]">
              Fluent in: {travelDetails.liaison.languages}
            </div>
          </div>
        </div>

        {/* Hotel Accommodation */}
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Hotel className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800">Recovery Hotel Accommodation</h2>
              <div className="text-xs text-slate-500">Pre-booked for post-discharge rehabilitation</div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
            <div className="font-semibold text-slate-800 text-sm">{travelDetails.hotel.name}</div>
            <div className="text-slate-600">{travelDetails.hotel.address}</div>
            <div className="text-blue-600 font-medium pt-1">{travelDetails.hotel.distanceToHospital}</div>
            <div className="text-emerald-600 font-semibold text-[11px]">{travelDetails.hotel.stayDuration}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
