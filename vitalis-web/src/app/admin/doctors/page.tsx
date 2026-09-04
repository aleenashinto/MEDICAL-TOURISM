"use client";

import React, { useState } from "react";
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Award, 
  CheckCircle2,
  Star
} from "lucide-react";

export default function DoctorsAdminPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const doctors = [
    {
      name: "Dr. Vijay Anand",
      title: "Senior Consultant & Head of Orthopedics",
      specialty: "Joint Replacement & Arthroscopy",
      hospital: "Aster Medcity, Kochi",
      experience: "24+ Years Experience",
      education: "MBBS, MS (Ortho), MCh (UK), Fellowship Joint Surgery",
      casesHandled: 142,
      rating: "4.95",
      status: "ACTIVE",
    },
    {
      name: "Dr. K. S. Muralidharan",
      title: "Chief of Cardiothoracic & Vascular Surgery",
      specialty: "Robotic Cardiac Surgery & Valve Repair",
      hospital: "Amrita Institute of Medical Sciences",
      experience: "28+ Years Experience",
      education: "MBBS, MS, MCh (CTVS), FACS (USA)",
      casesHandled: 210,
      rating: "4.98",
      status: "ACTIVE",
    },
    {
      name: "Dr. Rajesh K.",
      title: "Lead Neuro & Spine Surgeon",
      specialty: "Endoscopic Spine Surgery",
      hospital: "Rajagiri Hospital, Aluva",
      experience: "19+ Years Experience",
      education: "MBBS, MS, MCh (Neurosurgery)",
      casesHandled: 98,
      rating: "4.90",
      status: "ACTIVE",
    },
    {
      name: "Dr. Arya Varma",
      title: "Chief Ayurvedic Physician",
      specialty: "Authentic Panchakarma & Chronic Disease Reversal",
      hospital: "Somatheeram Ayurvedic Village",
      experience: "16+ Years Experience",
      education: "BAMS, MD (Ayurveda)",
      casesHandled: 185,
      rating: "4.92",
      status: "ACTIVE",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Accredited Specialist Doctors & Clinical Faculty
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Kerala's top internationally credentialed medical specialists, surgeons, and department heads.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Add Doctor Profile
        </button>
      </div>

      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search doctors by name or specialty..."
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
                <th className="py-3 px-4">Doctor & Qualifications</th>
                <th className="py-3 px-4">Specialty</th>
                <th className="py-3 px-4">Hospital Affiliation</th>
                <th className="py-3 px-4">Experience & Cases</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {doctors.map((doc) => (
                <tr key={doc.name} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{doc.name}</div>
                    <div className="text-[11px] text-slate-400">{doc.title}</div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">{doc.education}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {doc.specialty}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300 font-medium">{doc.hospital}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300">{doc.experience}</div>
                    <div className="text-[11px] text-blue-400 font-semibold">{doc.casesHandled} Global Patients</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-1 text-amber-400 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{doc.rating}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white font-medium text-[11px] transition-all">
                      Edit Profile
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
