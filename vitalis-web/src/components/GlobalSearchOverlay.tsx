"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Search, 
  X, 
  Stethoscope, 
  Building2, 
  HeartPulse, 
  Layers, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  Award,
  MapPin,
  Clock,
  RotateCcw
} from "lucide-react";
import Link from "next/link";
import { KERALA_DOCTORS, KERALA_HOSPITALS, KERALA_TREATMENTS, KERALA_SAMPLE_PACKAGES } from "@/lib/mockData";

interface GlobalSearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenIntake?: () => void;
}

export function GlobalSearchOverlay({ isOpen, onClose, onOpenIntake }: GlobalSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<any[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      try {
        const storedRecents = localStorage.getItem("maides_recent_searches");
        if (storedRecents) setRecentSearches(JSON.parse(storedRecents));

        const storedViews = localStorage.getItem("maides_recently_viewed");
        if (storedViews) setRecentlyViewed(JSON.parse(storedViews));
      } catch (e) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSearchSubmit = (itemTitle: string, itemType: string, href: string) => {
    try {
      // Save recent query
      const updatedQueries = [itemTitle, ...recentSearches.filter(q => q !== itemTitle)].slice(0, 5);
      setRecentSearches(updatedQueries);
      localStorage.setItem("maides_recent_searches", JSON.stringify(updatedQueries));

      // Save recently viewed
      const updatedViews = [
        { title: itemTitle, type: itemType, href, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
        ...recentlyViewed.filter(v => v.title !== itemTitle)
      ].slice(0, 6);
      setRecentlyViewed(updatedViews);
      localStorage.setItem("maides_recently_viewed", JSON.stringify(updatedViews));
    } catch (e) {}

    onClose();
  };

  const q = query.trim().toLowerCase();

  // Multi-Category Live Results Filtering
  const matchedDoctors = q ? KERALA_DOCTORS.filter(d => 
    d.name.toLowerCase().includes(q) || 
    d.specialty.toLowerCase().includes(q) || 
    d.hospitalName.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedHospitals = q ? KERALA_HOSPITALS.filter(h => 
    h.name.toLowerCase().includes(q) || 
    h.city.toLowerCase().includes(q) || 
    h.specialties.some(s => s.toLowerCase().includes(q))
  ).slice(0, 3) : [];

  const matchedTreatments = q ? KERALA_TREATMENTS.filter(t => 
    t.name.toLowerCase().includes(q) || 
    t.category.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const matchedPackages = q ? KERALA_SAMPLE_PACKAGES.filter(p => 
    p.title.toLowerCase().includes(q) || 
    p.treatmentName.toLowerCase().includes(q)
  ).slice(0, 3) : [];

  const totalMatches = matchedDoctors.length + matchedHospitals.length + matchedTreatments.length + matchedPackages.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-200">
      
      {/* Background Click dismiss */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[85vh] z-10">
        
        {/* Search Header Input Field */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center space-x-3.5 bg-slate-50/80">
          <Search className="w-5 h-5 text-[#0E82FD] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search doctors, treatments, hospitals, or specialties..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery("")}
              className="p-1 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button 
            onClick={onClose}
            className="px-3 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-all cursor-pointer"
          >
            Esc
          </button>
        </div>

        {/* Scrollable Results Area */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Default State: When Query is Empty (Show Recently Viewed & Quick Tags) */}
          {!query && (
            <div className="space-y-6">
              
              {/* Recently Viewed Strip */}
              {recentlyViewed.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Continue Exploring (Recently Viewed)</span>
                    </span>
                    <button 
                      onClick={() => {
                        setRecentlyViewed([]);
                        localStorage.removeItem("maides_recently_viewed");
                      }}
                      className="text-[11px] font-semibold text-slate-400 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      Clear History
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {recentlyViewed.map((v, i) => (
                      <Link
                        key={i}
                        href={v.href}
                        onClick={onClose}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <span className="text-[10px] font-bold text-[#0E82FD] uppercase">{v.type}</span>
                          <h4 className="text-xs font-bold text-[#0F2042] truncate group-hover:text-[#0E82FD] transition-colors">{v.title}</h4>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0E82FD] group-hover:translate-x-0.5 transition-all" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Discovery Shortcuts */}
              <div className="space-y-2.5">
                <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">Popular Healthcare Searches:</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Robotic Cardiac Bypass",
                    "Aster Medcity Kochi",
                    "MAKO Robotic Knee Replacement",
                    "Classical Ayurveda Panchakarma",
                    "Living-Donor Liver Transplant",
                    "Amrita Institute (AIMS)",
                    "Precision TrueBeam Oncology",
                    "VPS Lakeshore Hospital"
                  ].map((tag, idx) => (
                    <button
                      key={idx}
                      onClick={() => setQuery(tag)}
                      className="px-3.5 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-[#0E82FD] text-xs font-semibold text-slate-700 transition-all cursor-pointer border border-transparent hover:border-blue-200"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Active Query Matching Categories */}
          {query && totalMatches === 0 && (
            <div className="py-12 text-center space-y-2">
              <span className="text-3xl">🔍</span>
              <h4 className="text-base font-bold text-[#0F2042]">No direct medical matches found for "{query}"</h4>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Our clinical coordinators can match you with any unlisted surgery or specialist in Kerala.
              </p>
              <button
                onClick={() => {
                  onClose();
                  if (onOpenIntake) onOpenIntake();
                }}
                className="mt-3 px-5 py-2.5 rounded-full bg-[#0E82FD] text-white text-xs font-bold shadow-md cursor-pointer hover:bg-blue-600 transition-all"
              >
                Request Custom Specialist Match
              </button>
            </div>
          )}

          {query && totalMatches > 0 && (
            <div className="space-y-6">
              
              {/* 1. DOCTORS MATCH */}
              {matchedDoctors.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-black text-[#0E82FD] uppercase tracking-wider flex items-center space-x-1.5">
                      <Stethoscope className="w-3.5 h-3.5" />
                      <span>Doctors & Chief Specialists ({matchedDoctors.length})</span>
                    </span>
                    <Link href="/doctors" onClick={onClose} className="text-[11px] font-bold text-[#0E82FD] hover:underline">
                      View all doctors →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {matchedDoctors.map(doc => (
                      <Link
                        key={doc.id}
                        href={`/doctors`}
                        onClick={() => handleSearchSubmit(doc.name, "Doctor", "/doctors")}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-100 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img src={doc.avatar} alt={doc.name} className="w-10 h-10 rounded-xl object-cover border border-white shadow-xs" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors truncate">{doc.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{doc.specialty} • {doc.hospitalName}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-[#0E82FD] shrink-0 group-hover:translate-x-1 transition-transform">
                          Consult →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 2. HOSPITALS MATCH */}
              {matchedHospitals.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-black text-emerald-600 uppercase tracking-wider flex items-center space-x-1.5">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>Quaternary Hospitals ({matchedHospitals.length})</span>
                    </span>
                    <Link href="/hospitals" onClick={onClose} className="text-[11px] font-bold text-emerald-600 hover:underline">
                      View all hospitals →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {matchedHospitals.map(hosp => (
                      <Link
                        key={hosp.id}
                        href={`/hospitals`}
                        onClick={() => handleSearchSubmit(hosp.name, "Hospital", "/hospitals")}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-100 transition-all flex items-center justify-between group"
                      >
                        <div className="flex items-center space-x-3 min-w-0">
                          <img src={hosp.image} alt={hosp.name} className="w-10 h-10 rounded-xl object-cover border border-white shadow-xs" />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-[#0F2042] group-hover:text-emerald-700 transition-colors truncate">{hosp.name}</h4>
                            <p className="text-[11px] text-slate-500 truncate">{hosp.city}, {hosp.district} • {hosp.accreditations?.[0]}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold text-emerald-600 shrink-0 group-hover:translate-x-1 transition-transform">
                          Explore →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* 3. TREATMENTS MATCH */}
              {matchedTreatments.length > 0 && (
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                    <span className="text-xs font-black text-sky-600 uppercase tracking-wider flex items-center space-x-1.5">
                      <HeartPulse className="w-3.5 h-3.5" />
                      <span>Procedures & Specialities ({matchedTreatments.length})</span>
                    </span>
                    <Link href="/treatments" onClick={onClose} className="text-[11px] font-bold text-sky-600 hover:underline">
                      View all treatments →
                    </Link>
                  </div>

                  <div className="space-y-2">
                    {matchedTreatments.map(trt => (
                      <Link
                        key={trt.id}
                        href={`/treatments`}
                        onClick={() => handleSearchSubmit(trt.name, "Treatment", "/treatments")}
                        className="p-3 rounded-2xl bg-slate-50 hover:bg-sky-50 border border-slate-100 hover:border-sky-100 transition-all flex items-center justify-between group"
                      >
                        <div className="min-w-0 pr-2">
                          <h4 className="text-xs font-bold text-[#0F2042] group-hover:text-sky-700 transition-colors truncate">{trt.name}</h4>
                          <p className="text-[11px] text-slate-500 truncate">{trt.category} • Est. ${trt.costRangeUsd.min} - ${trt.costRangeUsd.max} USD</p>
                        </div>
                        <span className="text-xs font-bold text-sky-600 shrink-0 group-hover:translate-x-1 transition-transform">
                          Plan Treatment →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* Footer Quick Action */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-6">
          <span>Need immediate clinical triage?</span>
          <button
            onClick={() => {
              onClose();
              if (onOpenIntake) onOpenIntake();
            }}
            className="font-bold text-[#0E82FD] hover:underline cursor-pointer"
          >
            Start Intake Dossier →
          </button>
        </div>

      </div>
    </div>
  );
}
