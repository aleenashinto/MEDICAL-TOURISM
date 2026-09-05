"use client";

import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Star, 
  Award, 
  ShieldCheck, 
  Building2, 
  Calendar, 
  ArrowRight,
  Stethoscope,
  Globe2,
  PhoneCall
} from "lucide-react";
import { KERALA_DOCTORS } from "@/lib/mockData";

interface DoctorCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIntake?: () => void;
  initialDoctorId?: string;
}

export function DoctorCompareModal({
  isOpen,
  onClose,
  onOpenIntake,
  initialDoctorId
}: DoctorCompareModalProps) {
  const [selectedDocIds, setSelectedDocIds] = useState<string[]>([
    initialDoctorId || KERALA_DOCTORS[0]?.id || "DOC-001",
    KERALA_DOCTORS[1]?.id || "DOC-002"
  ]);

  if (!isOpen) return null;

  const doc1 = KERALA_DOCTORS.find(d => d.id === selectedDocIds[0]) || KERALA_DOCTORS[0];
  const doc2 = KERALA_DOCTORS.find(d => d.id === selectedDocIds[1]) || KERALA_DOCTORS[1];

  const handleSelectDoc = (slotIndex: 0 | 1, docId: string) => {
    const updated = [...selectedDocIds];
    updated[slotIndex] = docId;
    setSelectedDocIds(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Top Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0F2042] to-[#1E3A8A] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-cyan-300">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base sm:text-lg font-black tracking-tight">Specialist Side-by-Side Comparison</h3>
                <span className="px-2 py-0.5 rounded-full bg-cyan-400/20 text-cyan-200 text-[10px] font-bold">
                  Verified Credentials
                </span>
              </div>
              <p className="text-xs text-blue-200">Compare clinical experience, hospital affiliations, ratings & consultation slots</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close Comparison"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="p-5 sm:p-8 overflow-y-auto space-y-6">
          
          {/* Doctor Dropdown Selector Bars */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                Doctor 1:
              </label>
              <select
                value={selectedDocIds[0]}
                onChange={(e) => handleSelectDoc(0, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0E82FD]"
              >
                {KERALA_DOCTORS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-wider block">
                Doctor 2:
              </label>
              <select
                value={selectedDocIds[1]}
                onChange={(e) => handleSelectDoc(1, e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-3.5 py-2.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-[#0E82FD]"
              >
                {KERALA_DOCTORS.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Side-by-Side Comparison Columns */}
          <div className="grid grid-cols-2 gap-4 sm:gap-6 border-t border-slate-100 pt-6">
            
            {/* DOCTOR 1 COLUMN */}
            <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-5">
              <div className="flex items-start space-x-3.5">
                <img 
                  src={doc1?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=200"} 
                  alt={doc1?.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">● Available</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">⭐ {doc1?.rating || "4.95"}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#0F2042] mt-1 truncate">{doc1?.name}</h4>
                  <p className="text-xs text-[#0E82FD] font-bold">{doc1?.specialty}</p>
                </div>
              </div>

              {/* Specs List */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hospital Affiliation</span>
                  <p className="font-bold text-[#0F2042] mt-0.5">{doc1?.hospitalName || "Aster Medcity, Kochi"}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Experience</span>
                  <p className="font-bold text-[#0F2042] mt-0.5">{doc1?.experienceYears || 20}+ Years Active Practice</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Qualifications & Fellowships</span>
                  <p className="font-bold text-slate-700 mt-0.5">{doc1?.qualifications || "MBBS, MS, MCh, FRCS (UK)"}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Expertise</span>
                  <p className="font-semibold text-slate-600 mt-0.5">{doc1?.title || "Director of Surgical Sciences"}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenIntake) onOpenIntake();
                }}
                className="w-full py-3 rounded-2xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
              >
                Book with {doc1?.name?.split(" ")[1] || "Specialist"} →
              </button>
            </div>

            {/* DOCTOR 2 COLUMN */}
            <div className="p-5 rounded-3xl bg-slate-50/80 border border-slate-200/80 space-y-5">
              <div className="flex items-start space-x-3.5">
                <img 
                  src={doc2?.avatar || "https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=200"} 
                  alt={doc2?.name} 
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-md"
                />
                <div className="min-w-0">
                  <div className="flex items-center space-x-1.5">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 text-[10px] font-bold">● Available</span>
                    <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">⭐ {doc2?.rating || "4.92"}</span>
                  </div>
                  <h4 className="text-sm sm:text-base font-black text-[#0F2042] mt-1 truncate">{doc2?.name}</h4>
                  <p className="text-xs text-[#0E82FD] font-bold">{doc2?.specialty}</p>
                </div>
              </div>

              {/* Specs List */}
              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hospital Affiliation</span>
                  <p className="font-bold text-[#0F2042] mt-0.5">{doc2?.hospitalName || "Amrita Institute (AIMS), Kochi"}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Clinical Experience</span>
                  <p className="font-bold text-[#0F2042] mt-0.5">{doc2?.experienceYears || 18}+ Years Active Practice</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Qualifications & Fellowships</span>
                  <p className="font-bold text-slate-700 mt-0.5">{doc2?.qualifications || "MBBS, MD, DNB, Fellowship (USA)"}</p>
                </div>

                <div className="p-3 rounded-2xl bg-white border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Expertise</span>
                  <p className="font-semibold text-slate-600 mt-0.5">{doc2?.title || "Senior Consultant Physician"}</p>
                </div>
              </div>

              <button
                onClick={() => {
                  onClose();
                  if (onOpenIntake) onOpenIntake();
                }}
                className="w-full py-3 rounded-2xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/25 active:scale-98 transition-all cursor-pointer"
              >
                Book with {doc2?.name?.split(" ")[1] || "Specialist"} →
              </button>
            </div>

          </div>

        </div>

        {/* Modal Bottom Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-6 shrink-0">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Need independent guidance choosing a specialist? Talk to our Chief Medical Officer.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
