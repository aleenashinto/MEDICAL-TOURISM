"use client";

import React, { useState, useEffect } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { KERALA_SAMPLE_PACKAGES, PackageOffer } from "@/lib/mockData";
import { ArrowUpRight, CheckCircle, Clock, Filter, Star } from "lucide-react";

const TIERS = ["All", "Platinum VIP", "Premium Care", "Value Accredited", "Ayurvedic Rejuvenation"];

const TIER_COLORS: Record<string, string> = {
  "Platinum VIP": "bg-amber-50 border-amber-300 text-amber-700",
  "Premium Care": "bg-blue-50 border-blue-300 text-blue-700",
  "Value Accredited": "bg-emerald-50 border-emerald-300 text-emerald-700",
  "Ayurvedic Rejuvenation": "bg-green-50 border-green-300 text-green-700",
};

const TIER_BADGE: Record<string, string> = {
  "Platinum VIP": "bg-amber-500 text-white",
  "Premium Care": "bg-[#0E82FD] text-white",
  "Value Accredited": "bg-emerald-500 text-white",
  "Ayurvedic Rejuvenation": "bg-green-600 text-white",
};

export default function PackagesPage() {
  const [tier, setTier] = useState("All");
  const [packages, setPackages] = useState<any[]>(KERALA_SAMPLE_PACKAGES);

  // Synchronize dynamic packages from Admin Console
  useEffect(() => {
    const loadDynamicPackages = () => {
      try {
        const stored = localStorage.getItem("maides_admin_packages");
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Strict role boundary: Only ACTIVE & PUBLISHED packages appear on public portal
            const activeAdminPackages = parsed
              .filter((p: any) => p.status === "ACTIVE" && (p.published === "PUBLISHED" || !p.published))
              .sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99))
              .map((p: any) => ({
                id: p.id,
                title: p.title,
                tier: p.tier || "Premium Care",
                treatmentName: p.treatmentName,
                hospitalName: p.hospitalName,
                doctorName: p.doctorName,
                district: p.district || "Ernakulam / Kochi",
                city: p.city || "Kochi, Kerala",
                priceUsd: Number(p.priceUsd) || 5000,
                priceInr: Number(p.priceInr) || Math.round((Number(p.priceUsd) || 5000) * 87.5),
                durationDays: Number(p.durationDays) || 10,
                highlights: Array.isArray(p.highlights) && p.highlights.length > 0 ? p.highlights : ["All-inclusive medical care package in Kerala"],
                inclusions: Array.isArray(p.inclusions) && p.inclusions.length > 0 ? p.inclusions : ["Complete clinical and hospital stay care"],
                image: p.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
                displayOrder: Number(p.displayOrder) || 99
              }));

            // Merge Admin packages with sample packages, prioritizing Admin
            const merged: any[] = [...activeAdminPackages];
            KERALA_SAMPLE_PACKAGES.forEach(sp => {
              if (!merged.some(m => m.id === sp.id || m.title.toLowerCase() === sp.title.toLowerCase())) {
                merged.push({ ...sp, displayOrder: 99 });
              }
            });
            merged.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
            setPackages(merged);
            return;
          }
        }
        setPackages(KERALA_SAMPLE_PACKAGES);
      } catch (e) {
        setPackages(KERALA_SAMPLE_PACKAGES);
      }
    };

    loadDynamicPackages();
    window.addEventListener("storage", loadDynamicPackages);
    return () => window.removeEventListener("storage", loadDynamicPackages);
  }, []);

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => {
        const filtered = packages.filter((p) => tier === "All" || p.tier === tier);

        return (
          <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Kerala Medical & Wellness Packages</span>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">All-Inclusive<br />Medical Care Packages</h1>
                <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                  Transparent, all-inclusive packages from Kerala's best hospitals — covering surgery, hospital stay, diagnostics, airport transfers, and accommodation.
                </p>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              {/* Tier filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-slate-400" />
                {TIERS.map((t) => (
                  <button key={t} onClick={() => setTier(t)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${tier === t ? "bg-[#0E82FD] text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{t}</button>
                ))}
              </div>

              <div className="text-xs text-slate-500"><strong className="text-[#0E82FD]">{filtered.length}</strong> package{filtered.length !== 1 ? "s" : ""} available</div>

              {/* Package cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((p) => (
                  <div key={p.id} className={`rounded-3xl bg-white border-2 overflow-hidden shadow-sm hover:shadow-xl transition-all flex flex-col ${TIER_COLORS[p.tier] || "border-slate-200"}`}>
                    <div className={`px-5 py-3 flex items-center justify-between ${TIER_BADGE[p.tier] || "bg-slate-700 text-white"}`}>
                      <span className="text-xs font-black uppercase tracking-wider">{p.tier}</span>
                      <Star className="w-4 h-4 fill-current opacity-80" />
                    </div>
                    <div className="p-6 flex flex-col space-y-4 flex-1">
                      <div>
                        <h3 className="text-base font-black text-[#0F2042] leading-snug">{p.title}</h3>
                        <p className="text-xs text-slate-500 mt-1">{p.treatmentName}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-0.5">
                          <div className="text-[10px] text-slate-400">Hospital</div>
                          <div className="font-bold text-slate-700">{p.hospitalName}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-0.5">
                          <div className="text-[10px] text-slate-400">Lead Doctor</div>
                          <div className="font-bold text-slate-700">{p.doctorName}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-0.5">
                          <div className="text-[10px] text-slate-400">Location</div>
                          <div className="font-bold text-slate-700">{p.city}, {p.district}</div>
                        </div>
                        <div className="rounded-xl bg-slate-50 border border-slate-100 p-3 space-y-0.5">
                          <div className="text-[10px] text-slate-400">Duration</div>
                          <div className="font-bold text-slate-700 flex items-center gap-1"><Clock className="w-3 h-3" />{p.durationDays} days</div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="text-xs font-bold text-slate-700">Package Highlights</div>
                        <ul className="space-y-1.5">
                          {(p.highlights || []).slice(0, 4).map((h: string) => (
                            <li key={h} className="flex items-start gap-2 text-xs text-slate-600">
                              <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />{h}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                        <div>
                          <div className="text-[10px] text-slate-400">Package starting from</div>
                          <div className="text-xl font-black text-[#0F2042]">${p.priceUsd.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">≈ ₹{p.priceInr.toLocaleString()}</div>
                        </div>
                        <button
                          onClick={onOpenIntake}
                          className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#0E82FD] text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 cursor-pointer"
                        >
                          <span>Request Package</span> <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Custom package CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black">Need a Custom Package?</h2>
                <p className="text-sm text-blue-100 max-w-lg mx-auto">Our clinical coordinators will build a tailored package for your treatment, timeline, and budget — with full transparency before you travel.</p>
                <button onClick={onOpenIntake} className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-white text-[#0F2042] font-black text-sm hover:bg-blue-50 transition-all shadow-lg">
                  <span>Request Custom Package</span>
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
