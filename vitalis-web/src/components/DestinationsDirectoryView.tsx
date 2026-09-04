"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Search, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Plane, 
  Hotel, 
  FileText, 
  PhoneCall, 
  CheckCircle2, 
  Globe2,
  Calendar,
  Sparkles,
  Palmtree,
  Leaf
} from "lucide-react";
import { KERALA_DISTRICTS, KeralaDistrictInfo } from "@/lib/mockData";

export function DestinationsDirectoryView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'South Kerala' | 'Central Kerala' | 'North Kerala'>('All');
  const [selectedDistrict, setSelectedDistrict] = useState<KeralaDistrictInfo>(KERALA_DISTRICTS[0]);

  const filteredDistricts = KERALA_DISTRICTS.filter((d) => {
    const matchesRegion = selectedRegion === 'All' || d.region === selectedRegion;
    const matchesSearch = 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.topSpecialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRegion && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-24">
      
      {/* Top Banner with Madies Royal Blue Theme */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-xs font-bold text-[#0E82FD] mb-2">
                <Palmtree className="w-3.5 h-3.5 text-[#0E82FD]" />
                <span>Kerala Medical Tourism Destinations</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F2042]">
                Medical Destinations in Kerala
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Explore quaternary hospitals, government medical colleges, and Ayurveda sanatoriums across all 14 districts.
              </p>
            </div>

            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search district or specialty..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
              />
            </div>
          </div>

          {/* Region Tabs */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
            {(['All', 'South Kerala', 'Central Kerala', 'North Kerala'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedRegion === r
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* District Selector (Left 5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Select Kerala District ({filteredDistricts.length})
          </h2>
          
          <div className="space-y-3">
            {filteredDistricts.map((d) => (
              <div
                key={d.id}
                onClick={() => setSelectedDistrict(d)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between shadow-sm ${
                  selectedDistrict.id === d.id
                    ? "bg-blue-50/80 border-[#0E82FD] ring-2 ring-blue-100"
                    : "bg-white border-slate-200 hover:border-blue-300"
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-base font-bold text-[#0F2042]">{d.name}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {d.region}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 line-clamp-1">{d.tagline}</p>
                  <div className="text-[11px] text-[#0E82FD] font-semibold">
                    {d.hospitalsCount} Hospitals & Medical Centers
                  </div>
                </div>
                <ArrowRight className={`w-4 h-4 ${selectedDistrict.id === d.id ? "text-[#0E82FD]" : "text-slate-300"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Detailed District Dossier (Right 7 Cols) */}
        <div className="lg:col-span-7">
          <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden space-y-6">
            
            {/* Hero Image */}
            <div className="relative h-64 overflow-hidden">
              <img 
                src={selectedDistrict.image} 
                alt={selectedDistrict.name}
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2042]/90 via-[#0F2042]/30 to-transparent" />
              
              <div className="absolute bottom-5 left-6 right-6 text-white">
                <span className="text-xs font-bold text-blue-300 block mb-1">
                  {selectedDistrict.region} • Kerala
                </span>
                <h3 className="text-2xl font-black">{selectedDistrict.name}</h3>
                <p className="text-xs text-slate-200 mt-1">{selectedDistrict.tagline}</p>
              </div>
            </div>

            {/* Dossier Details */}
            <div className="p-6 sm:p-8 space-y-6 pt-0 text-xs">
              
              {/* Featured Hospitals in District */}
              <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
                <h4 className="font-bold text-[#0F2042] uppercase tracking-wider">
                  Accredited Healthcare Institutions in {selectedDistrict.name}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDistrict.featuredHospitals.map((hosp, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-white border border-blue-100 font-semibold text-slate-800 flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-[#0E82FD] shrink-0" />
                      <span className="truncate">{hosp}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ayurveda & Convalescence Heritage */}
              <div className="p-5 rounded-2xl bg-blue-50/40 border border-blue-200 space-y-2">
                <div className="flex items-center space-x-2 text-[#0E82FD] font-bold">
                  <Leaf className="w-4 h-4" />
                  <span>Ayurveda & Recovery Heritage</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-normal">
                  {selectedDistrict.ayurvedaHeritage}
                </p>
              </div>

              {/* Logistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block">✈️ Airport Connectivity</span>
                  <p className="text-slate-800 font-semibold">{selectedDistrict.nearestAirport}</p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <span className="text-slate-500 font-bold block">🩺 Core Clinical Strengths</span>
                  <p className="text-[#0E82FD] font-semibold">{selectedDistrict.topSpecialties.slice(0, 2).join(" • ")}</p>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-2">
                <Link
                  href="/portal"
                  className="w-full py-3.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all"
                >
                  <span>Start Patient Case in {selectedDistrict.name}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
