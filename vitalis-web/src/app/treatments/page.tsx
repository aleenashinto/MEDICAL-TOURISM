"use client";

import React, { useState } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { KERALA_TREATMENTS } from "@/lib/mockData";
import { ChevronRight, Search, ArrowUpRight, Filter, Clock, MapPin, DollarSign } from "lucide-react";

const CATEGORIES = ["All", "Cardiology", "Orthopaedics", "Oncology", "Neurology", "Ayurveda & Wellness", "Organ Transplant", "Fertility", "Urology", "Gastroenterology"];

const CATEGORY_IMAGES: Record<string, string> = {
  "Cardiology": "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
  "Orthopaedics": "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
  "Oncology": "https://images.unsplash.com/photo-1631815589968-fdb09a223b1e?auto=format&fit=crop&w=800&q=80",
  "Neurology": "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
  "Ayurveda & Wellness": "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  "Organ Transplant": "https://images.unsplash.com/photo-1582560475093-ba66accbc095?auto=format&fit=crop&w=800&q=80",
  "Fertility": "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?auto=format&fit=crop&w=800&q=80",
  "Urology": "https://images.unsplash.com/photo-1576669801775-b95ce3fb4e62?auto=format&fit=crop&w=800&q=80",
  "Gastroenterology": "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
  "Neurosurgery": "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
};

export default function TreatmentsPage() {
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => {
        const filtered = KERALA_TREATMENTS.filter((t) => {
          const matchesSearch =
            query === "" ||
            t.name.toLowerCase().includes(query.toLowerCase()) ||
            t.category.toLowerCase().includes(query.toLowerCase()) ||
            t.tagline.toLowerCase().includes(query.toLowerCase());
          const matchesCat = selectedCategory === "All" || t.category === selectedCategory;
          return matchesSearch && matchesCat;
        });

        return (
          <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Medical Treatments in Kerala</span>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                  Treatments &<br />Clinical Specialties
                </h1>
                <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                  From robotic cardiac bypass to classical Panchakarma — discover the full spectrum of medical care available across Kerala's accredited hospital network.
                </p>
                {/* Search */}
                <div className="flex items-center max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
                  <div className="pl-4 text-slate-400"><Search className="w-4 h-4" /></div>
                  <input
                    type="text"
                    placeholder="Search treatments, procedures, conditions..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <button onClick={onOpenIntake} className="m-1.5 px-4 py-2.5 rounded-xl bg-[#0E82FD] text-white text-xs font-bold whitespace-nowrap">
                    Get Assistance
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              {/* Category filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                        : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Showing <strong className="text-[#0E82FD]">{filtered.length}</strong> treatment{filtered.length !== 1 ? "s" : ""}
              </div>

              {/* Treatment cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filtered.map((t) => (
                  <div key={t.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex group">
                    <div className="w-48 flex-shrink-0 overflow-hidden hidden sm:block">
                      <img
                        src={CATEGORY_IMAGES[t.category] || CATEGORY_IMAGES["Cardiology"]}
                        alt={t.category}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 flex flex-col space-y-3 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0E82FD] text-[10px] font-bold">{t.category}</span>
                        {t.featured && <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 text-[10px] font-bold border border-amber-200">Featured</span>}
                      </div>
                      <h3 className="text-sm font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors leading-snug">{t.name}</h3>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{t.tagline}</p>

                      <div className="flex items-center gap-4 text-[11px] text-slate-500">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{t.typicalStayDays} day stay</span>
                        <span className="flex items-center gap-1"><DollarSign className="w-3 h-3" />\${t.costRangeUsd.min.toLocaleString()}–\${t.costRangeUsd.max.toLocaleString()}</span>
                      </div>

                      <div className="flex items-center gap-1 flex-wrap">
                        {t.topKeralaDistricts.slice(0, 2).map((d) => (
                          <span key={d} className="flex items-center gap-0.5 text-[10px] text-slate-500 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                            <MapPin className="w-2.5 h-2.5" />{d}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        <button
                          onClick={onOpenIntake}
                          className="inline-flex items-center space-x-1 text-xs font-bold text-[#0E82FD] hover:text-blue-700"
                        >
                          <span>Request Assistance</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bottom CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black">Can't find your treatment?</h2>
                <p className="text-sm text-blue-100 max-w-lg mx-auto">Our medical coordinators will review your specific condition and identify the right Kerala specialist for you.</p>
                <button
                  onClick={onOpenIntake}
                  className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-[#0F2042] font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition-all shadow-lg"
                >
                  <span>Get Medical Assistance</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </PublicPageLayout>
  );
}
