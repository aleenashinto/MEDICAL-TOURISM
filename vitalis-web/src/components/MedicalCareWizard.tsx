"use client";

import React, { useState } from "react";
import { 
  HeartPulse, 
  Activity, 
  Brain, 
  Leaf, 
  Microscope, 
  Stethoscope, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  CheckCircle2, 
  Building2, 
  Clock, 
  Plane, 
  Award,
  ChevronRight,
  Calculator,
  UserCheck
} from "lucide-react";
import Link from "next/link";

interface MedicalCareWizardProps {
  onOpenIntake?: () => void;
}

const SPECIALTY_OPTIONS = [
  { id: "cardio", name: "Heart & Cardiology", icon: HeartPulse, desc: "Bypass CABG, Valve Repair, TAVR", color: "from-rose-500 to-red-600" },
  { id: "ortho", name: "Bone, Joint & Spine", icon: Activity, desc: "Robotic Knee, Hip, Endoscopic Spine", color: "from-blue-500 to-indigo-600" },
  { id: "onco", name: "Oncology & Cancer", icon: Microscope, desc: "TrueBeam Radiotherapy, Immunotherapy", color: "from-purple-500 to-pink-600" },
  { id: "ayur", name: "Ayurveda & Rejuvenation", icon: Leaf, desc: "14-21 Day Ashtavaidya Panchakarma", color: "from-emerald-500 to-teal-600" },
  { id: "neuro", name: "Neurology & Brain", icon: Brain, desc: "Skull Base, Micro-Discectomy", color: "from-amber-500 to-orange-600" },
  { id: "transplant", name: "Organ Transplants", icon: Stethoscope, desc: "Living Donor Liver & Renal Transplant", color: "from-cyan-500 to-blue-600" },
];

const CARE_GOALS = [
  { id: "consult", title: "Specialist Consultation", desc: "Detailed 45-min pre-travel video review with surgical director", badge: "Fast 24hr Scheduling" },
  { id: "surgery", title: "Surgical Treatment Plan", desc: "Quaternary procedure with priority OT booking & private ICU suite", badge: "70% Cost Savings" },
  { id: "second_opinion", title: "Official Second Opinion", desc: "Independent board evaluation of your MRI/PET/Angiography scans", badge: "Zero Obligation" },
  { id: "package", title: "All-Inclusive Recovery Package", desc: "Surgery + 5-star backwater convalescence + VIP airport limousine", badge: "Most Popular" },
];

const ORIGIN_COUNTRIES = [
  { id: "UAE", name: "United Arab Emirates", flag: "🇦🇪", flightTime: "3.5 hrs direct to COK/TRV", visa: "Kerala eVisa in 4 hours" },
  { id: "UK", name: "United Kingdom & Europe", flag: "🇬🇧", flightTime: "9.5 hrs direct / 1-stop", visa: "Fast-Track Medical e-Visa" },
  { id: "USA", name: "USA & Canada", flag: "🇺🇸", flightTime: "14-16 hrs (via Gulf Hubs)", visa: "60-day Multi-Entry Medical Visa" },
  { id: "SA", name: "Saudi Arabia & GCC", flag: "🇸🇦", flightTime: "4.5 hrs direct to Kerala", visa: "Dedicated Arabic Concierge" },
  { id: "OTHER", name: "Other International", flag: "🌍", flightTime: "Direct connections", visa: "Full Global Airport Escort" },
];

const RECOMMENDATION_PROFILES: Record<string, any> = {
  cardio: {
    hospital: "Aster Medcity, Kochi",
    doctor: "Dr. K. S. Muralidharan",
    designation: "Chief Cardiac Surgeon & Director of Interventional Cardiology",
    experience: "24+ Years",
    rating: "4.96",
    accreditation: "JCI & NABH Accredited",
    estCost: "$4,500 – $6,200",
    savings: "72% vs UAE & UK",
    stay: "4 Days Hospital + 4 Days Resort Recovery",
    inclusions: ["Pre-op Angiogram", "Off-Pump Surgery", "Post-op ICU", "Backwater Convalescence"]
  },
  ortho: {
    hospital: "Amrita Institute of Medical Sciences (AIMS), Kochi",
    doctor: "Dr. Rajeev Ramanathan",
    designation: "Director of Robotic Joint Replacement & Arthroscopy",
    experience: "22+ Years",
    rating: "4.94",
    accreditation: "NABH, NABL & ISO 9001",
    estCost: "$3,800 – $5,400",
    savings: "68% vs UAE & UK",
    stay: "3 Days Hospital + 5 Days Backwater Rehab",
    inclusions: ["MAKO Sub-mm Robotic Alignment", "Stryker High-Flex Implant", "Daily Physiotherapy", "Fit-to-Fly Certificate"]
  },
  onco: {
    hospital: "VPS Lakeshore Hospital, Kochi",
    doctor: "Dr. Susan George",
    designation: "Head of Medical Oncology & Precision Therapeutics",
    experience: "20+ Years",
    rating: "4.95",
    accreditation: "JCI & NABH Accredited",
    estCost: "$4,200 – $7,500",
    savings: "75% vs US & UK",
    stay: "Custom 5-10 Days Protocol",
    inclusions: ["TrueBeam Radiotherapy", "Molecular Biomarker Testing", "Oncology Board Review", "VIP Recovery Suite"]
  },
  ayur: {
    hospital: "Somatheeram Ayurvedic Health Resort, Kovalam",
    doctor: "Dr. C. Raman Namboodiri",
    designation: "Chief Ashtavaidya Ayurveda Physician",
    experience: "30+ Years",
    rating: "4.98",
    accreditation: "Kerala Green Leaf Certified & NABH",
    estCost: "$1,800 – $3,200",
    savings: "Authentic Vedic Care",
    stay: "14-21 Days Holistic Panchakarma",
    inclusions: ["Daily Abhyangam & Shirodhara", "Custom Organic Diet", "Daily Yoga & Meditation", "Beachfront Cottage"]
  },
  neuro: {
    hospital: "Aster Medcity & AIMS, Kochi",
    doctor: "Dr. Anand Kumar",
    designation: "Senior Consultant Neurosurgeon & Spine Specialist",
    experience: "19+ Years",
    rating: "4.92",
    accreditation: "JCI & NABH Accredited",
    estCost: "$4,000 – $5,800",
    savings: "70% vs International",
    stay: "3 Days Hospital + 4 Days Recovery",
    inclusions: ["Neuronavigation Guided Surgery", "Minimally Invasive Discectomy", "24/7 Neuro ICU", "Airport Escort"]
  },
  transplant: {
    hospital: "VPS Lakeshore & Aster Medcity, Kochi",
    doctor: "Dr. K. S. Muralidharan & Multi-Organ Board",
    designation: "Director of Living-Donor Liver & Renal Transplantation",
    experience: "25+ Years",
    rating: "4.97",
    accreditation: "JCI Accredited Quaternary Center",
    estCost: "$18,000 – $24,000",
    savings: "80% vs US ($200k+)",
    stay: "14 Days Quaternary Stay",
    inclusions: ["Donor & Recipient Pre-op Workup", "HEPA Filtered Transplant ICU", "Immunosuppression Protocol", "3-Month Tele-monitoring"]
  }
};

export function MedicalCareWizard({ onOpenIntake }: MedicalCareWizardProps) {
  const [step, setStep] = useState<number>(1);
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("cardio");
  const [selectedGoal, setSelectedGoal] = useState<string>("surgery");
  const [selectedCountry, setSelectedCountry] = useState<string>("UAE");

  const rec = RECOMMENDATION_PROFILES[selectedSpecialty] || RECOMMENDATION_PROFILES.cardio;
  const spec = SPECIALTY_OPTIONS.find(s => s.id === selectedSpecialty) || SPECIALTY_OPTIONS[0];
  const country = ORIGIN_COUNTRIES.find(c => c.id === selectedCountry) || ORIGIN_COUNTRIES[0];
  const goal = CARE_GOALS.find(g => g.id === selectedGoal) || CARE_GOALS[1];

  return (
    <section id="care-wizard" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 pb-6">
      
      {/* Header with Eyebrow */}
      <div className="text-center space-y-3 mb-8 sm:mb-10">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-100 text-[#0E82FD]">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="text-[11px] font-black uppercase tracking-wider">Interactive Care Recommendation Engine</span>
        </div>
        <h2 className="text-2xl sm:text-4xl font-black text-[#0F2042] tracking-tight">
          Tell Us What You Need. <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0E82FD] to-[#38BDF8]">
            We Design Your Personalized Kerala Pathway.
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
          In 3 simple clicks, get verified hospital matches, chief specialist profiles, transparent price benchmarks, and medical travel coordination.
        </p>

        {/* Wizard Step Progress Pills */}
        <div className="flex items-center justify-center space-x-2 sm:space-x-4 pt-4">
          {[
            { num: 1, label: "1. Medical Specialty" },
            { num: 2, label: "2. Care Requirement" },
            { num: 3, label: "3. Origin Country" },
            { num: 4, label: "4. Your Care Plan" }
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num < step) setStep(s.num);
              }}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                step === s.num
                  ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/25 scale-105"
                  : step > s.num
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-pointer"
                  : "bg-slate-100 text-slate-400"
              }`}
            >
              <span className="text-[11px]">{s.label}</span>
              {step > s.num && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
            </button>
          ))}
        </div>
      </div>

      {/* Wizard Main Card Frame */}
      <div className="rounded-3xl bg-white shadow-xl border border-slate-100 p-5 sm:p-8 lg:p-10 transition-all duration-300">
        
        {/* STEP 1: CHOOSE MEDICAL SPECIALTY */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0E82FD] uppercase tracking-wider">Step 1 of 4</span>
                <h3 className="text-lg sm:text-xl font-black text-[#0F2042]">What type of medical care do you require?</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {SPECIALTY_OPTIONS.map((specItem) => {
                const IconComp = specItem.icon;
                const isSelected = selectedSpecialty === specItem.id;
                return (
                  <button
                    key={specItem.id}
                    onClick={() => setSelectedSpecialty(specItem.id)}
                    className={`p-4 sm:p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                      isSelected
                        ? "border-[#0E82FD] bg-blue-50/50 shadow-md shadow-blue-500/10 scale-[1.02]"
                        : "border-slate-100 bg-slate-50/60 hover:border-blue-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-tr ${specItem.color} text-white flex items-center justify-center shadow-md`}>
                        <IconComp className="w-5 h-5" />
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? "border-[#0E82FD] bg-[#0E82FD] text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors">
                        {specItem.name}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {specItem.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-blue-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <span>Continue to Care Goal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CHOOSE CARE REQUIREMENT / GOAL */}
        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0E82FD] uppercase tracking-wider">Step 2 of 4</span>
                <h3 className="text-lg sm:text-xl font-black text-[#0F2042]">What is your primary care objective?</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4">
              {CARE_GOALS.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                      isSelected
                        ? "border-[#0E82FD] bg-blue-50/50 shadow-md shadow-blue-500/10 scale-[1.02]"
                        : "border-slate-100 bg-slate-50/60 hover:border-blue-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="px-2.5 py-1 rounded-full bg-blue-100 text-[#0E82FD] text-[10px] font-bold uppercase tracking-wider">
                        {g.badge}
                      </span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? "border-[#0E82FD] bg-[#0E82FD] text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors">
                        {g.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {g.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(3)}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-blue-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <span>Continue to Travel Origin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: ORIGIN COUNTRY */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#0E82FD] uppercase tracking-wider">Step 3 of 4</span>
                <h3 className="text-lg sm:text-xl font-black text-[#0F2042]">Where will you be travelling from?</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
              {ORIGIN_COUNTRIES.map((c) => {
                const isSelected = selectedCountry === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCountry(c.id)}
                    className={`p-5 rounded-2xl text-left border-2 transition-all flex flex-col justify-between space-y-3 cursor-pointer group ${
                      isSelected
                        ? "border-[#0E82FD] bg-blue-50/50 shadow-md shadow-blue-500/10 scale-[1.02]"
                        : "border-slate-100 bg-slate-50/60 hover:border-blue-200 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-3xl">{c.flag}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                        isSelected ? "border-[#0E82FD] bg-[#0E82FD] text-white" : "border-slate-300 bg-white"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm sm:text-base font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors">
                        {c.name}
                      </h4>
                      <div className="mt-2 space-y-1 text-[11px] text-slate-500 font-medium">
                        <div className="flex items-center space-x-1.5">
                          <Plane className="w-3.5 h-3.5 text-[#0E82FD]" />
                          <span>{c.flightTime}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{c.visa}</span>
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setStep(2)}
                className="px-5 py-3 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center space-x-1.5 cursor-pointer transition-all"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>

              <button
                onClick={() => setStep(4)}
                className="px-6 sm:px-8 py-3.5 rounded-full bg-gradient-to-r from-[#0E82FD] to-[#38BDF8] hover:from-blue-600 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-lg shadow-blue-500/25 cursor-pointer hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Recommended Care Plan</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: GENERATED CARE PLAN SUMMARY & INSTANT ACTION */}
        {step === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
              <div>
                <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-black uppercase tracking-wider inline-flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Your Curated Kerala Care Dossier</span>
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#0F2042] mt-1.5">
                  Recommended Treatment Pathway for {country.name}
                </h3>
              </div>

              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#0E82FD] hover:underline cursor-pointer"
              >
                Modify Selection ↺
              </button>
            </div>

            {/* Detailed Result Card Breakdown */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Matched Provider & Doctor (7 cols) */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <span className="text-[10px] font-black text-[#0E82FD] uppercase tracking-wider block">1. Recommended Quaternary Hospital</span>
                  
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-blue-100 text-[#0E82FD] flex items-center justify-center shrink-0">
                      <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-base font-black text-[#0F2042]">{rec.hospital}</h4>
                      <p className="text-xs text-slate-500">{rec.accreditation} • Dedicated International Patient Wing</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-3xl bg-slate-50 border border-slate-100 space-y-4">
                  <span className="text-[10px] font-black text-[#0E82FD] uppercase tracking-wider block">2. Leading Specialist Board Director</span>
                  
                  <div className="flex items-start space-x-3.5">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-base font-black text-[#0F2042]">{rec.doctor}</h4>
                        <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 text-[10px] font-bold">⭐ {rec.rating}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{rec.designation}</p>
                      <p className="text-[11px] text-slate-400 font-medium mt-1">✓ {rec.experience} Experience • English & Arabic translation team</p>
                    </div>
                  </div>
                </div>

                {/* Inclusions checklist */}
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <span className="text-xs font-bold text-[#0F2042] block mb-2">Package Inclusions:</span>
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 font-medium">
                    {rec.inclusions.map((inc: string, idx: number) => (
                      <div key={idx} className="flex items-center space-x-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span className="truncate">{inc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Right Column: Cost Benchmark, Stay & Action CTA (5 cols) */}
              <div className="lg:col-span-5 flex flex-col justify-between p-6 rounded-3xl bg-[#0F2042] text-white space-y-6 shadow-xl">
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="text-xs text-blue-200 font-bold uppercase">Estimated Procedure Cost</span>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[10px] font-black">
                      {rec.savings}
                    </span>
                  </div>

                  <div className="mt-3">
                    <div className="text-3xl font-black text-white">{rec.estCost}</div>
                    <p className="text-[11px] text-blue-200 mt-1">Includes hospital OT, surgeon fee, pre-op workup & hospital room</p>
                  </div>

                  <div className="mt-5 space-y-2.5 border-t border-white/10 pt-4 text-xs text-blue-100">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>Duration:</strong> {rec.stay}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Plane className="w-4 h-4 text-cyan-400 shrink-0" />
                      <span><strong>Travel:</strong> {country.visa}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span><strong>Coordinator:</strong> Dedicated 24/7 on-ground liaison</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2.5 pt-4">
                  <button
                    onClick={() => {
                      if (onOpenIntake) onOpenIntake();
                    }}
                    className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0E82FD] to-[#38BDF8] hover:from-blue-600 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider text-center shadow-lg shadow-blue-500/40 active:scale-95 transition-all cursor-pointer flex items-center justify-center space-x-2"
                  >
                    <span>Request Official Hospital Quote</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs text-center border border-white/15 flex items-center justify-center space-x-1.5 transition-colors"
                  >
                    <span>Chat with Medical Coordinator on WhatsApp</span>
                  </a>
                </div>

              </div>

            </div>

          </div>
        )}

      </div>

    </section>
  );
}
