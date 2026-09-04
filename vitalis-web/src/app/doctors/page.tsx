"use client";

import React, { useState } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { KERALA_DOCTORS } from "@/lib/mockData";
import { Search, Star, Video, Filter, MapPin, BookOpen, ChevronRight } from "lucide-react";

const SPECIALTIES = ["All", "Cardiology", "Orthopaedics", "Neurology", "Ayurveda & Wellness", "Oncology", "Gastroenterology", "Urology"];

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => {
        const filtered = KERALA_DOCTORS.filter((d) => {
          const matchesSearch =
            query === "" ||
            d.name.toLowerCase().includes(query.toLowerCase()) ||
            d.specialty.toLowerCase().includes(query.toLowerCase()) ||
            d.hospitalName.toLowerCase().includes(query.toLowerCase()) ||
            d.subSpecialty.toLowerCase().includes(query.toLowerCase());
          const matchesSpec = specialty === "All" || d.specialty === specialty;
          return matchesSearch && matchesSpec;
        });

        return (
          <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Specialist Doctors in Kerala</span>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">Kerala's Leading<br />Medical Specialists</h1>
                <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                  Internationally trained consultants, board-certified surgeons, and Ashtavaidya Ayurvedic physicians across Kerala's top-ranked hospitals.
                </p>
                <div className="flex items-center max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
                  <div className="pl-4 text-slate-400"><Search className="w-4 h-4" /></div>
                  <input
                    type="text"
                    placeholder="Search by name, specialty, hospital..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <button onClick={onOpenIntake} className="m-1.5 px-4 py-2.5 rounded-xl bg-[#0E82FD] text-white text-xs font-bold whitespace-nowrap">
                    Book Consultation
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              {/* Specialty filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-slate-400" />
                {SPECIALTIES.map((s) => (
                  <button key={s} onClick={() => setSpecialty(s)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${specialty === s ? "bg-[#0E82FD] text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{s}</button>
                ))}
              </div>

              <div className="text-xs text-slate-500"><strong className="text-[#0E82FD]">{filtered.length}</strong> specialist{filtered.length !== 1 ? "s" : ""} found</div>

              {/* Doctor cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filtered.map((d) => (
                  <div key={d.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group">
                    <div className="p-6 flex gap-5">
                      {/* Avatar */}
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white shadow-lg">
                        <img src={d.avatar} alt={d.name} className="w-full h-full object-cover" />
                      </div>
                      {/* Info */}
                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="text-sm font-black text-[#0F2042] group-hover:text-[#0E82FD] transition-colors leading-tight">{d.name}</h3>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-xs font-black text-slate-700">{d.rating}</span>
                          </div>
                        </div>
                        <p className="text-[11px] font-semibold text-[#0E82FD]">{d.specialty}</p>
                        <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-1">{d.title}</p>
                        <p className="text-[10px] text-slate-400">{d.qualifications}</p>
                        <div className="flex items-center gap-1 text-[10px] text-slate-500">
                          <MapPin className="w-3 h-3" />{d.hospitalName} · {d.city}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-3 space-y-3">
                      {/* Sub-specialty */}
                      <p className="text-[11px] text-slate-600 leading-relaxed">{d.subSpecialty}</p>

                      {/* Expertise tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {d.areasOfExpertise.slice(0, 3).map((e) => (
                          <span key={e} className="text-[10px] font-medium text-slate-600 bg-slate-50 px-2.5 py-0.5 rounded-full border border-slate-100">{e}</span>
                        ))}
                      </div>

                      {/* Stats row */}
                      <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                        <span>{d.experienceYears}+ years exp.</span>
                        <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{d.publicationsCount} publications</span>
                        {d.videoConsultationAvailable && (
                          <span className="flex items-center gap-1 text-emerald-600 font-semibold"><Video className="w-3 h-3" />Video Consult</span>
                        )}
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-1">
                        {d.languages.map((l) => (
                          <span key={l} className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">{l}</span>
                        ))}
                      </div>
                    </div>

                    <div className="px-6 pb-5 border-t border-slate-100 pt-4 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-slate-400">Next Available</div>
                        <div className="text-xs font-bold text-slate-700">{d.nextAvailableDate}</div>
                      </div>
                      <button
                        onClick={onOpenIntake}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E82FD] text-white text-xs font-bold hover:bg-blue-600 transition-all"
                      >
                        Book <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black">Need a specialist recommendation?</h2>
                <p className="text-sm text-blue-100 max-w-lg mx-auto">Our clinical team will review your medical reports and recommend the right Kerala specialist for your case.</p>
                <button onClick={onOpenIntake} className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-[#0F2042] font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition-all shadow-lg">
                  <span>Get Doctor Recommendation</span>
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </PublicPageLayout>
  );
}
