"use client";

import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  CheckCircle2, 
  HeartPulse, 
  UserCheck, 
  Building2, 
  Plane, 
  ArrowRight, 
  ArrowLeft, 
  Download, 
  Share2, 
  ShieldCheck,
  Calendar,
  Layers,
  Clock,
  MapPin
} from "lucide-react";
import { KERALA_TREATMENTS, KERALA_DOCTORS, KERALA_HOSPITALS } from "@/lib/mockData";

interface CustomCarePlanBuilderProps {
  onOpenIntake?: () => void;
}

export function CustomCarePlanBuilder({ onOpenIntake }: CustomCarePlanBuilderProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedCategory, setSelectedCategory] = useState<string>("Cardiology");
  const [selectedTreatment, setSelectedTreatment] = useState<string>("Robotic Cardiac Bypass (CABG)");
  const [selectedDoctor, setSelectedDoctor] = useState<string>("Dr. K. S. Muralidharan");
  const [selectedHospital, setSelectedHospital] = useState<string>("Aster Medcity, Kochi");
  const [selectedTravelTier, setSelectedTravelTier] = useState<string>("VIP Limousine & 5-Star Backwater Suite");
  const [carePlanSuccess, setCarePlanSuccess] = useState(false);

  const categories = ["Cardiology", "Orthopaedics", "Oncology", "Ayurveda & Wellness", "Neurology", "Organ Transplant"];

  const treatmentsForCat = KERALA_TREATMENTS.filter(t => t.category === selectedCategory);
  const matchedDoctors = KERALA_DOCTORS.filter(d => d.specialty.includes(selectedCategory.split(" ")[0]));
  const doctorsToShow = matchedDoctors.length > 0 ? matchedDoctors : KERALA_DOCTORS.slice(0, 3);
  const hospitalsToShow = KERALA_HOSPITALS.slice(0, 3);

  const handleGeneratePlan = () => {
    setStep(5);
    setCarePlanSuccess(true);
  };

  return (
    <section id="care-plan-builder" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12">
      <div className="rounded-3xl bg-gradient-to-br from-[#0F2042] via-[#153460] to-[#0A182F] text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/15 relative overflow-hidden">
        
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E82FD]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto space-y-2.5 mb-8 sm:mb-10 relative z-10">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 text-cyan-300 text-[11px] font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Care Plan Architect</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Build Your Personalized Kerala Care Plan
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed">
            Customize your specialty, chief surgeon, quaternary hospital campus, and luxury backwater travel support into a comprehensive clinical dossier.
          </p>

          {/* Stepper Progress Indicator */}
          <div className="flex items-center justify-center space-x-2 sm:space-x-3 pt-4">
            {[
              { num: 1, label: "Specialty" },
              { num: 2, label: "Doctor" },
              { num: 3, label: "Hospital" },
              { num: 4, label: "Travel & Stay" },
              { num: 5, label: "Care Dossier" }
            ].map(s => (
              <div 
                key={s.num} 
                className={`flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-bold transition-all ${
                  step === s.num
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30"
                    : step > s.num
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-400/40"
                    : "bg-white/5 text-slate-400"
                }`}
              >
                <span>{s.num}. {s.label}</span>
                {step > s.num && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Step Content */}
        <div className="relative z-10 bg-white/5 rounded-3xl p-5 sm:p-8 border border-white/10 backdrop-blur-md">
          
          {/* STEP 1: Specialty & Procedure */}
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-cyan-300 uppercase">Step 1 of 4</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">Select Medical Specialty & Procedure</h3>
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      const matched = KERALA_TREATMENTS.find(t => t.category === cat);
                      if (matched) setSelectedTreatment(matched.name);
                    }}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                      selectedCategory === cat
                        ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30 scale-105"
                        : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Procedures Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {treatmentsForCat.map((t, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedTreatment(t.name)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                      selectedTreatment === t.name
                        ? "bg-[#0E82FD]/20 border-cyan-400 shadow-md"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <HeartPulse className="w-5 h-5 text-cyan-300" />
                      {selectedTreatment === t.name && <CheckCircle2 className="w-4 h-4 text-cyan-300" />}
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold text-white mt-2">{t.name}</h4>
                    <p className="text-[11px] text-blue-200 mt-1 line-clamp-2">{t.tagline}</p>
                  </button>
                ))}
              </div>

              <div className="flex justify-end pt-4 border-t border-white/10">
                <button
                  onClick={() => setStep(2)}
                  className="px-6 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-blue-500/30"
                >
                  <span>Continue to Specialist Matching</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Doctor Selection */}
          {step === 2 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-cyan-300 uppercase">Step 2 of 4</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">Select Chief Specialist for {selectedCategory}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {doctorsToShow.map(doc => (
                  <button
                    key={doc.id}
                    onClick={() => setSelectedDoctor(doc.name)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      selectedDoctor === doc.name
                        ? "bg-[#0E82FD]/20 border-cyan-400 shadow-md scale-102"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <img src={doc.avatar} alt={doc.name} className="w-12 h-12 rounded-xl object-cover border border-white/20" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white truncate">{doc.name}</h4>
                        <p className="text-[11px] text-cyan-200">{doc.title || doc.specialty}</p>
                      </div>
                    </div>

                    <div className="text-[11px] text-blue-200 space-y-0.5 pt-2 border-t border-white/10">
                      <div>✓ {doc.experienceYears}+ Years Clinical Practice</div>
                      <div className="truncate">✓ {doc.hospitalName}</div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setStep(1)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-blue-500/30"
                >
                  <span>Continue to Quaternary Hospital</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Hospital Selection */}
          {step === 3 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-cyan-300 uppercase">Step 3 of 4</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">Select Hospital Campus in Kerala</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {hospitalsToShow.map(hosp => (
                  <button
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp.name)}
                    className={`p-4 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      selectedHospital === hosp.name
                        ? "bg-[#0E82FD]/20 border-cyan-400 shadow-md scale-102"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div className="relative h-28 rounded-xl overflow-hidden">
                      <img src={hosp.image} alt={hosp.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-black/70 text-[10px] text-white font-bold">
                        {hosp.accreditations[0]}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-white truncate">{hosp.name}</h4>
                      <p className="text-[11px] text-cyan-200">{hosp.city}, {hosp.district}</p>
                      <p className="text-[10px] text-blue-200 mt-1">✈️ {hosp.nearestAirport?.split(" ")[0]} Airport ({hosp.airportDistanceKm || 25} km)</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setStep(2)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold flex items-center space-x-2 cursor-pointer shadow-lg shadow-blue-500/30"
                >
                  <span>Continue to Travel & Convalescence</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Travel & Recovery Tier */}
          {step === 4 && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div>
                <span className="text-xs font-bold text-cyan-300 uppercase">Step 4 of 4</span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">Select Travel & Convalescence Tier</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  {
                    title: "Executive Medical Travel",
                    desc: "Airport VIP greeting, private sedan hospital transfers, standard single recovery room, 24/7 coordinator.",
                    tier: "Standard"
                  },
                  {
                    title: "VIP Limousine & 5-Star Backwater Suite",
                    desc: "Mercedes airport limousine, presidential hospital suite, 4-day Kumarakom backwater resort convalescence.",
                    tier: "Signature VIP"
                  },
                  {
                    title: "Ayurvedic Integrated Wellness Suite",
                    desc: "Full surgical stay + 14-day authentic Ashtavaidya Panchakarma retreat with organic Vedic nutrition.",
                    tier: "Holistic"
                  }
                ].map((tierItem, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedTravelTier(tierItem.title)}
                    className={`p-5 rounded-2xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                      selectedTravelTier === tierItem.title
                        ? "bg-[#0E82FD]/20 border-cyan-400 shadow-md scale-102"
                        : "bg-white/5 border-white/10 hover:border-white/30"
                    }`}
                  >
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 text-[10px] font-bold uppercase">
                        {tierItem.tier}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-2">{tierItem.title}</h4>
                      <p className="text-xs text-blue-200 mt-1 leading-relaxed">{tierItem.desc}</p>
                    </div>

                    <div className="text-xs font-bold text-cyan-300 flex items-center space-x-1 pt-2 border-t border-white/10">
                      <span>Select Tier</span>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  onClick={() => setStep(3)}
                  className="px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back</span>
                </button>
                <button
                  onClick={handleGeneratePlan}
                  className="px-7 py-3.5 rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-600 hover:to-teal-500 text-white text-xs font-black uppercase tracking-wider flex items-center space-x-2 cursor-pointer shadow-xl shadow-emerald-500/30"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Complete Care Dossier</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Generated Care Plan Dossier Summary */}
          {step === 5 && (
            <div className="space-y-6 animate-in zoom-in-95 duration-300">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                    ✓
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-black text-white">Your Tailored Kerala Care Dossier</h3>
                    <p className="text-xs text-cyan-200">Generated on {new Date().toLocaleDateString()}</p>
                  </div>
                </div>

                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-bold text-cyan-300 hover:underline cursor-pointer"
                >
                  Customize Again ↺
                </button>
              </div>

              {/* Dossier Grid Summary */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase">1. Procedure & Specialty</span>
                  <h4 className="text-xs font-bold text-white">{selectedTreatment}</h4>
                  <p className="text-[11px] text-slate-300">{selectedCategory} Excellence</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase">2. Matched Specialist</span>
                  <h4 className="text-xs font-bold text-white">{selectedDoctor}</h4>
                  <p className="text-[11px] text-slate-300">Quaternary Board Director</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase">3. Hospital Campus</span>
                  <h4 className="text-xs font-bold text-white">{selectedHospital}</h4>
                  <p className="text-[11px] text-slate-300">JCI / NABH Quaternary Wing</p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <span className="text-[10px] font-bold text-cyan-300 uppercase">4. Recovery & Logistics</span>
                  <h4 className="text-xs font-bold text-white">{selectedTravelTier.split("&")[0]}</h4>
                  <p className="text-[11px] text-slate-300">Fast-Track Kerala eVisa + Escort</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 text-xs text-blue-200">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Zero upfront payment required. Case reviewed by MAIDES medical board within 4 hours.</span>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      if (onOpenIntake) onOpenIntake();
                    }}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-blue-500/40 cursor-pointer transition-all active:scale-95 text-center"
                  >
                    Request This Care Plan →
                  </button>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </section>
  );
}
