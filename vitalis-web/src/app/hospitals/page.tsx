"use client";

import React, { useState, useEffect } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { KERALA_HOSPITALS } from "@/lib/mockData";
import { Search, ArrowUpRight, Star, MapPin, Filter, BadgeCheck, Bed, Users } from "lucide-react";

const REGIONS = ["All", "Central Kerala", "South Kerala", "North Kerala"];
const TYPES = ["All", "Multispecialty", "Super Specialty", "Ayurveda & Wellness", "Government Medical College", "Specialized Institute"];

export default function HospitalsPage() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("All");
  const [type, setType] = useState("All");
  const [allHospitals, setAllHospitals] = useState<any[]>(KERALA_HOSPITALS);

  useEffect(() => {
    const loadHospitals = async () => {
      // 1. Fetch from server API
      try {
        const res = await fetch("/api/hospitals?public=true");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.hospitals) && data.hospitals.length > 0) {
            const mapped = data.hospitals.map((h: any, idx: number) => ({
              id: h.id || `hosp-${idx}`,
              name: h.name,
              tagline: h.tagline || `${h.accreditations?.[0] || "Accredited"} quaternary medical campus in ${h.city || "Kerala"}`,
              accreditations: Array.isArray(h.accreditations) ? h.accreditations : [h.accreditations || "NABH Certified"],
              region: h.region || "Central Kerala",
              district: h.district || "Ernakulam / Kochi",
              city: h.city || "Kochi",
              type: h.specialties?.includes("Classical Ayurveda") ? "Ayurveda & Wellness" : "Multispecialty",
              establishedYear: h.establishedYear || 2018,
              bedsCount: parseInt(h.beds) || 500,
              internationalPatientsAnnual: h.internationalPatientsAnnual || 18500,
              languages: h.languages || ["English", "Arabic", "Malayalam", "Hindi"],
              specialties: Array.isArray(h.specialties) ? h.specialties : ["Multispecialty Healthcare"],
              rating: h.rating || 4.92,
              reviewCount: h.reviewCount || 1280,
              image: h.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
              description: h.shortDescription || h.fullDescription || `${h.name} is a premier accredited hospital campus in Kerala.`,
              nearestAirport: h.nearestAirport || "Cochin International Airport (COK)",
              airportDistanceKm: h.airportDistanceKm || 25,
              vipRoomsAvailable: h.vipRoomsAvailable ?? true,
              ayurvedaWingAvailable: h.ayurvedaWingAvailable ?? true,
              displayOrder: Number(h.displayOrder) || (idx + 1),
              featured: true
            }));

            mapped.sort((a: any, b: any) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
            setAllHospitals(mapped);
            return;
          }
        }
      } catch (err) {
        // Fallback to localStorage / initial data
      }

      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("maides_admin_hospitals") : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          const activeHosps = parsed
            .filter((h: any) => {
              const s = (h.status || "ACTIVE").toUpperCase();
              const p = (h.published || "PUBLISHED").toUpperCase();
              return s === "ACTIVE" && p === "PUBLISHED";
            })
            .map((h: any, idx: number) => ({
              id: h.id || `hosp-${idx}`,
              name: h.name,
              tagline: h.tagline || `${h.accreditations?.[0] || "Accredited"} quaternary medical campus in ${h.city || "Kerala"}`,
              accreditations: Array.isArray(h.accreditations) ? h.accreditations : [h.accreditations || "NABH Certified"],
              region: h.region || "Central Kerala",
              district: h.district || "Ernakulam / Kochi",
              city: h.city || "Kochi",
              type: h.specialties?.includes("Classical Ayurveda") ? "Ayurveda & Wellness" : "Multispecialty",
              establishedYear: h.establishedYear || 2018,
              bedsCount: parseInt(h.beds) || 500,
              internationalPatientsAnnual: h.internationalPatientsAnnual || 18500,
              languages: h.languages || ["English", "Arabic", "Malayalam", "Hindi"],
              specialties: Array.isArray(h.specialties) ? h.specialties : ["Multispecialty Healthcare"],
              rating: h.rating || 4.92,
              reviewCount: h.reviewCount || 1280,
              image: h.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
              description: h.shortDescription || h.fullDescription || `${h.name} is a premier accredited hospital campus in Kerala.`,
              nearestAirport: h.nearestAirport || "Cochin International Airport (COK)",
              airportDistanceKm: h.airportDistanceKm || 25,
              vipRoomsAvailable: h.vipRoomsAvailable ?? true,
              ayurvedaWingAvailable: h.ayurvedaWingAvailable ?? true,
              displayOrder: Number(h.displayOrder) || (idx + 1),
              featured: true
            }));

          if (activeHosps.length > 0) {
            activeHosps.sort((a: any, b: any) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
            setAllHospitals(activeHosps);
            return;
          }
        }
      } catch (e) {}

      setAllHospitals(KERALA_HOSPITALS);
    };

    loadHospitals();
    window.addEventListener("storage", loadHospitals);
    window.addEventListener("maides_hospitals_updated", loadHospitals);
    return () => {
      window.removeEventListener("storage", loadHospitals);
      window.removeEventListener("maides_hospitals_updated", loadHospitals);
    };
  }, []);

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => {
        const filtered = allHospitals.filter((h) => {
          const matchesSearch =
            query === "" ||
            h.name.toLowerCase().includes(query.toLowerCase()) ||
            h.district.toLowerCase().includes(query.toLowerCase()) ||
            (h.specialties && h.specialties.some((s: string) => s.toLowerCase().includes(query.toLowerCase())));
          const matchesRegion = region === "All" || h.region === region;
          const matchesType = type === "All" || h.type === type;
          return matchesSearch && matchesRegion && matchesType;
        });

        return (
          <div className="min-h-screen">
            {/* Hero */}
            <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Accredited Hospitals in Kerala</span>
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">Find Your Kerala<br />Hospital Partner</h1>
                <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                  JCI, NABH and NABL accredited hospitals across Kerala's 14 districts — with dedicated international patient desks, VIP suites, and multilingual coordinators.
                </p>
                <div className="flex items-center max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
                  <div className="pl-4 text-slate-400"><Search className="w-4 h-4" /></div>
                  <input
                    type="text"
                    placeholder="Search hospitals, specialties, districts..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <button onClick={onOpenIntake} className="m-1.5 px-4 py-2.5 rounded-xl bg-[#0E82FD] text-white text-xs font-bold whitespace-nowrap">
                    Get Matched
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              {/* Filters */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2 items-center">
                  <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-500 mr-1">Region:</span>
                  {REGIONS.map((r) => (
                    <button key={r} onClick={() => setRegion(r)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${region === r ? "bg-[#0E82FD] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{r}</button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="w-4 h-4 flex-shrink-0" />
                  <span className="text-xs font-bold text-slate-500 mr-1">Type:</span>
                  {TYPES.map((t) => (
                    <button key={t} onClick={() => setType(t)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${type === t ? "bg-[#0F2042] text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{t}</button>
                  ))}
                </div>
              </div>

              <div className="text-xs text-slate-500"><strong className="text-[#0E82FD]">{filtered.length}</strong> hospital{filtered.length !== 1 ? "s" : ""} found</div>

              {/* Hospital cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filtered.map((h) => (
                  <div key={h.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col group">
                    <div className="relative h-52 overflow-hidden">
                      <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                        <div>
                          <h3 className="text-base font-black text-white">{h.name}</h3>
                          <div className="flex items-center gap-1.5 mt-1">
                            <MapPin className="w-3 h-3 text-blue-300" />
                            <span className="text-xs text-blue-100">{h.city}, {h.district}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-1 justify-end">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                            <span className="text-sm font-black text-white">{h.rating}</span>
                          </div>
                          <span className="text-[10px] text-blue-200">{h.reviewCount.toLocaleString()} reviews</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 space-y-4 flex-1 flex flex-col">
                      <div className="flex flex-wrap gap-1.5">
                        {h.accreditations.map((a: string) => (
                          <span key={a} className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                            <BadgeCheck className="w-3 h-3" />{a}
                          </span>
                        ))}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{h.tagline}</p>

                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1"><Bed className="w-3.5 h-3.5" />{h.bedsCount} Beds</span>
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{h.internationalPatientsAnnual.toLocaleString()} intl. patients/yr</span>
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {h.specialties.slice(0, 3).map((s: string) => (
                          <span key={s} className="text-[10px] font-medium text-[#0E82FD] bg-blue-50 px-2.5 py-1 rounded-full">{s}</span>
                        ))}
                        {h.specialties.length > 3 && (
                          <span className="text-[10px] font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full">+{h.specialties.length - 3} more</span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        <span>{h.nearestAirport} · {h.airportDistanceKm} km away</span>
                      </div>

                      <div className="pt-3 border-t border-slate-100 mt-auto flex items-center justify-between">
                        <div className="flex gap-2">
                          {h.vipRoomsAvailable && <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-100">VIP Rooms</span>}
                          {h.ayurvedaWingAvailable && <span className="text-[10px] font-bold text-green-700 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Ayurveda Wing</span>}
                        </div>
                        <button
                          onClick={onOpenIntake}
                          className="flex items-center gap-1 text-xs font-bold text-[#0E82FD] hover:text-blue-700 cursor-pointer"
                        >
                          <span>Explore Hospital</span>
                          <ArrowUpRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 text-center space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black">Need help choosing the right hospital?</h2>
                <p className="text-sm text-blue-100 max-w-lg mx-auto">Our patient coordinators will match you with the best-fit hospital based on your treatment, budget, and language requirements.</p>
                <button onClick={onOpenIntake} className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-[#0F2042] font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition-all shadow-lg">
                  <span>Get Personalized Match</span><ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      }}
    </PublicPageLayout>
  );
}
