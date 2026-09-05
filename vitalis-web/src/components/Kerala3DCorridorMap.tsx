"use client";

import React, { useState } from "react";
import { 
  Plane, 
  MapPin, 
  Building2, 
  ArrowRight, 
  Clock, 
  ShieldCheck, 
  Sparkles, 
  Globe2, 
  CheckCircle2,
  Users,
  Compass,
  ArrowUpRight
} from "lucide-react";

interface CorridorItem {
  id: string;
  sourceRegion: string;
  flag: string;
  majorCities: string;
  primaryAirport: string;
  targetKeralaAirport: string;
  flightDuration: string;
  fastTrackVisaHours: string;
  topSpecialties: string[];
  recommendedHospitals: string[];
  annualPatients: string;
  patientQuote: string;
}

const KERALA_GLOBAL_CORRIDORS: CorridorItem[] = [
  {
    id: "corridor-gcc",
    sourceRegion: "United Arab Emirates & GCC",
    flag: "🇦🇪 🇸🇦 🇶🇦 🇴🇲",
    majorCities: "Dubai, Abu Dhabi, Riyadh, Doha, Muscat",
    primaryAirport: "DXB / AUH / RUH",
    targetKeralaAirport: "Cochin (COK) & Calicut (CCJ)",
    flightDuration: "3 hrs 45 mins (Direct Daily Flights)",
    fastTrackVisaHours: "4 Hours e-Medical Visa",
    topSpecialties: ["Robotic Cardiac Surgery", "Comprehensive Oncology", "Classical Ayurveda Panchakarma"],
    recommendedHospitals: ["Aster Medcity (Kochi)", "Amrita Hospital", "Arya Vaidya Sala Kottakkal"],
    annualPatients: "18,400+ Patients",
    patientQuote: "Direct flights, Arabic-speaking concierge desks at Kochi airport, and world-class cardiac robotics made my surgery seamless."
  },
  {
    id: "corridor-uk",
    sourceRegion: "United Kingdom & Europe",
    flag: "🇬🇧 🇩🇪 🇫🇷 🇮🇪",
    majorCities: "London, Manchester, Frankfurt, Dublin",
    primaryAirport: "LHR / LGW / FRA",
    targetKeralaAirport: "Cochin International (COK)",
    flightDuration: "9 hrs 30 mins (Direct/1-Stop)",
    fastTrackVisaHours: "4 Hours Fast-Track",
    topSpecialties: ["Robotic Joint Replacement", "Ayurvedic Spine Rehabilitation", "Living-Donor Transplants"],
    recommendedHospitals: ["Aster Medcity", "KIMSHEALTH (Trivandrum)", "Somatheeram Ayurveda"],
    annualPatients: "9,200+ Patients",
    patientQuote: "NHS knee surgery waiting lists were 18 months. In Kerala, MAIDES arranged my robotic knee replacement in 4 days at 70% savings."
  },
  {
    id: "corridor-usa",
    sourceRegion: "United States & Canada (NRI & Expats)",
    flag: "🇺🇸 🇨🇦",
    majorCities: "New York, Chicago, Houston, Toronto",
    primaryAirport: "JFK / ORD / IAH / YYZ",
    targetKeralaAirport: "Cochin (COK) & Trivandrum (TRV)",
    flightDuration: "16 hrs (1-Stop Emirates/Qatar)",
    fastTrackVisaHours: "4 Hours e-Medical Visa",
    topSpecialties: ["Complex Neuro & Spine Surgery", "Full-Mouth Dental Implants", "Wellness & Rejuvenation"],
    recommendedHospitals: ["Rajagiri Hospital", "Caritas Hospital", "Baby Memorial Hospital"],
    annualPatients: "7,800+ Patients",
    patientQuote: "Even with insurance in the US, copays were enormous. In Kerala, the Da Vinci robotic surgery + 2-week backwater recovery was incredible."
  },
  {
    id: "corridor-africa",
    sourceRegion: "East & West Africa",
    flag: "🇳🇬 🇰🇪 🇹🇿 🇪🇹",
    majorCities: "Lagos, Nairobi, Dar es Salaam, Addis Ababa",
    primaryAirport: "LOS / NBO / DAR / ADD",
    targetKeralaAirport: "Cochin (COK) & Kozhikode (CCJ)",
    flightDuration: "7 hrs 15 mins (Direct Connection)",
    fastTrackVisaHours: "4 Hours Urgent FRRO Support",
    topSpecialties: ["Pediatric Cardiac Surgery", "Bone Marrow Transplants", "Kidney & Liver Transplants"],
    recommendedHospitals: ["Amrita Institute", "Aster Medcity", "MIMS Kozhikode"],
    annualPatients: "6,500+ Patients",
    patientQuote: "The dedicated international patient executive met us right at the aircraft gate and stayed with my son through his heart surgery."
  }
];

interface Kerala3DCorridorMapProps {
  onOpenIntake?: () => void;
}

export function Kerala3DCorridorMap({ onOpenIntake }: Kerala3DCorridorMapProps = {}) {
  const [selectedCorridor, setSelectedCorridor] = useState<CorridorItem>(KERALA_GLOBAL_CORRIDORS[0]);

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0F2042] via-[#122A56] to-[#0A1628] border border-slate-800 p-6 sm:p-10 text-white shadow-2xl overflow-hidden relative">
      
      {/* Background World Grid Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-10 bg-[radial-gradient(#38BDF8_1px,transparent_1px)] [background-size:24px_24px]" />
      
      <div className="relative z-10 space-y-8">
        {/* Header Strip */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 text-[#38BDF8] border border-blue-500/30 text-[10px] font-bold uppercase tracking-wider">
              <Plane className="w-3 h-3" />
              <span>Global Patient Telemetry</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              International Patient Corridors to Kerala
            </h3>
            <p className="text-xs sm:text-sm text-blue-200/80 max-w-xl">
              Real-time flight routes, airport limousine escort coordination, and 4-hour medical visa processing times.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center space-x-4 bg-white/5 border border-white/10 p-3 px-4 rounded-2xl">
            <div>
              <div className="text-lg font-black text-[#38BDF8]">4 Hours</div>
              <div className="text-[10px] text-slate-300 font-semibold">Medical Visa Turnaround</div>
            </div>
            <div className="h-8 w-[1px] bg-white/10" />
            <div>
              <div className="text-lg font-black text-emerald-400">3 Airports</div>
              <div className="text-[10px] text-slate-300 font-semibold">COK • TRV • CCJ Gates</div>
            </div>
          </div>
        </div>

        {/* 4 Regional Corridor Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {KERALA_GLOBAL_CORRIDORS.map((c) => {
            const isSelected = selectedCorridor.id === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setSelectedCorridor(c)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                  isSelected
                    ? "bg-gradient-to-tr from-[#0E82FD]/30 to-[#38BDF8]/20 border-[#38BDF8] shadow-lg shadow-blue-500/20 ring-1 ring-[#38BDF8]"
                    : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg">{c.flag}</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-200 border border-blue-500/30 font-bold">
                    {c.annualPatients}
                  </span>
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{c.sourceRegion}</div>
                  <div className="text-[10px] text-slate-400 truncate">{c.majorCities}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Corridor Telemetry Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-slate-950/60 backdrop-blur-xl border border-white/10 p-6 rounded-3xl items-center">
          
          {/* Flight Path Visualizer (Left 6 Cols) */}
          <div className="lg:col-span-6 space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-bold text-blue-200 uppercase">
                  Active Corridor: {selectedCorridor.sourceRegion}
                </span>
              </div>
              <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                {selectedCorridor.fastTrackVisaHours}
              </span>
            </div>

            {/* Flight Path Graphic */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Origin Airport</span>
                <div className="text-sm font-black text-white">{selectedCorridor.primaryAirport}</div>
                <div className="text-[10px] text-blue-300">{selectedCorridor.majorCities.split(",")[0]}</div>
              </div>

              {/* Animated Flight Center Line */}
              <div className="flex-1 px-4 flex flex-col items-center">
                <div className="text-[10px] font-mono font-bold text-[#38BDF8] mb-1">
                  ✈️ {selectedCorridor.flightDuration}
                </div>
                <div className="w-full h-1 bg-blue-500/30 rounded-full relative overflow-hidden">
                  <div className="absolute inset-y-0 bg-[#38BDF8] w-1/3 animate-[marquee_2s_linear_infinite]" />
                </div>
                <span className="text-[9px] text-slate-400 mt-1">Direct Quaternary Escort</span>
              </div>

              <div className="space-y-1 text-right">
                <span className="text-[10px] text-slate-400 uppercase font-bold">Destination Gate</span>
                <div className="text-sm font-black text-emerald-400">{selectedCorridor.targetKeralaAirport}</div>
                <div className="text-[10px] text-slate-300">Kerala Health Corridor</div>
              </div>
            </div>

            {/* Patient Testimonial Quote */}
            <div className="p-3.5 rounded-xl bg-blue-950/40 border border-blue-500/20 text-xs italic text-blue-100/90 leading-relaxed">
              "{selectedCorridor.patientQuote}"
            </div>
          </div>

          {/* Clinical Matching & Inclusions (Right 6 Cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Specialized Clinical Matching
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedCorridor.topSpecialties.map((spec, i) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 text-xs font-semibold text-blue-200">
                    🩺 {spec}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Direct Receiving Institutions
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {selectedCorridor.recommendedHospitals.map((hosp, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-center space-x-2 text-xs font-semibold text-white">
                    <Building2 className="w-3.5 h-3.5 text-[#38BDF8] shrink-0" />
                    <span className="truncate">{hosp}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2">
              <a
                href="#appointment-form"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0E82FD] to-[#38BDF8] hover:from-[#0360D9] hover:to-[#0E82FD] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-blue-500/30 transition-all cursor-pointer"
              >
                <span>Initiate Clinical Case for {selectedCorridor.sourceRegion}</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
