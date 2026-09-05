"use client";

import React, { useState } from "react";
import { 
  X, 
  Building2, 
  CheckCircle2, 
  Star, 
  MapPin, 
  Plane, 
  Award, 
  ShieldCheck, 
  ArrowRight,
  Plus,
  Trash2
} from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  city: string;
  district: string;
  accreditations: string[];
  specialties: string[];
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  internationalServices: string[];
}

interface HospitalCompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  hospitals: Hospital[];
  initialSelectedId?: string;
  onSelectHospitalForBooking: (hospitalName: string) => void;
}

export function HospitalCompareModal({
  isOpen,
  onClose,
  hospitals,
  initialSelectedId,
  onSelectHospitalForBooking
}: HospitalCompareModalProps) {
  const [selectedHospitalIds, setSelectedHospitalIds] = useState<string[]>(() => {
    const ids = initialSelectedId ? [initialSelectedId] : [];
    if (hospitals.length > 1 && ids.length < 2) {
      const nextHosp = hospitals.find(h => h.id !== initialSelectedId);
      if (nextHosp) ids.push(nextHosp.id);
    }
    return ids.length > 0 ? ids : (hospitals.slice(0, 2).map(h => h.id));
  });

  if (!isOpen) return null;

  const selectedHospitals = hospitals.filter(h => selectedHospitalIds.includes(h.id));

  const addHospital = (id: string) => {
    if (selectedHospitalIds.length < 3 && !selectedHospitalIds.includes(id)) {
      setSelectedHospitalIds([...selectedHospitalIds, id]);
    }
  };

  const removeHospital = (id: string) => {
    if (selectedHospitalIds.length > 1) {
      setSelectedHospitalIds(selectedHospitalIds.filter(hId => hId !== id));
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/70 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#0F2042] via-[#163974] to-[#0A1628] text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Building2 className="w-5 h-5 text-cyan-300" />
            </div>
            <div>
              <h3 className="text-base sm:text-xl font-black">Compare Kerala Hospitals</h3>
              <p className="text-[11px] sm:text-xs text-blue-200">Side-by-side infrastructure, accreditations, and international patient facilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Add hospital selector strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs font-bold text-slate-700">
            Comparing ({selectedHospitals.length}/3 Hospitals):
          </div>

          <div className="flex items-center space-x-2">
            {selectedHospitalIds.length < 3 && (
              <select
                onChange={(e) => {
                  if (e.target.value) {
                    addHospital(e.target.value);
                    e.target.value = "";
                  }
                }}
                defaultValue=""
                className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
              >
                <option value="" disabled>+ Add Hospital to Compare</option>
                {hospitals
                  .filter(h => !selectedHospitalIds.includes(h.id))
                  .map(h => (
                    <option key={h.id} value={h.id}>{h.name} ({h.district})</option>
                  ))}
              </select>
            )}
          </div>
        </div>

        {/* Comparison Grid Table */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {selectedHospitals.map((hosp) => (
              <div 
                key={hosp.id} 
                className="rounded-2xl border-2 border-slate-200 bg-white p-5 flex flex-col justify-between space-y-4 hover:border-blue-300 transition-all shadow-sm"
              >
                <div className="space-y-3">
                  
                  {/* Top Image & Remove */}
                  <div className="relative h-36 rounded-xl overflow-hidden bg-slate-100">
                    <img src={hosp.image} alt={hosp.name} className="w-full h-full object-cover" />
                    {selectedHospitalIds.length > 1 && (
                      <button
                        onClick={() => removeHospital(hosp.id)}
                        className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-red-600 text-white transition-colors cursor-pointer"
                        title="Remove from comparison"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-full bg-white/95 text-[10px] font-bold text-slate-800 flex items-center space-x-1 shadow-sm">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span>{hosp.rating} ({hosp.reviewCount} reviews)</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm sm:text-base font-black text-[#0F2042]">{hosp.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#0E82FD]" />
                      <span>{hosp.city}, {hosp.district}</span>
                    </p>
                  </div>

                  {/* Accreditations */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Accreditations</span>
                    <div className="flex flex-wrap gap-1">
                      {hosp.accreditations.map((acc, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-blue-50 text-[#0E82FD] font-bold text-[10px]">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Top Specialties */}
                  <div className="pt-2 border-t border-slate-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Key Specialties</span>
                    <p className="text-xs text-slate-700 font-medium line-clamp-2">
                      {Array.isArray(hosp.specialties) ? hosp.specialties.slice(0, 3).join(", ") : hosp.specialties}
                    </p>
                  </div>

                  {/* International Patient Care */}
                  <div className="pt-2 border-t border-slate-100 space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">International Support</span>
                    {(hosp.internationalServices || []).slice(0, 3).map((srv, i) => (
                      <div key={i} className="flex items-start space-x-1.5 text-xs text-slate-600">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{srv}</span>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Bottom CTA */}
                <div className="pt-3 border-t border-slate-100">
                  <button
                    onClick={() => {
                      onClose();
                      onSelectHospitalForBooking(hosp.name);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center space-x-1.5 cursor-pointer"
                  >
                    <span>Book at {hosp.name.split(" ")[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
