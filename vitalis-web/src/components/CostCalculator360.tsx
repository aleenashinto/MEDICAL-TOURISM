"use client";

import React, { useState } from "react";
import { 
  DollarSign, 
  Sparkles, 
  TrendingDown, 
  ShieldCheck, 
  Clock, 
  HeartPulse, 
  Activity, 
  Microscope, 
  Leaf, 
  ArrowRight,
  CheckCircle2
} from "lucide-react";

interface ProcedureCost {
  id: string;
  name: string;
  category: string;
  usaCostUsd: number;
  ukCostGbp: number;
  uaeCostAed: number;
  keralaCostUsd: number;
  keralaCostInr: number;
  stayDays: number;
  recoveryDays: number;
  inclusions: string[];
}

const PROCEDURES_DATA: ProcedureCost[] = [
  {
    id: "p-cabg",
    name: "Robotic / Off-Pump Heart Bypass (CABG)",
    category: "Cardiology",
    usaCostUsd: 120000,
    ukCostGbp: 65000,
    uaeCostAed: 180000,
    keralaCostUsd: 7400,
    keralaCostInr: 650000,
    stayDays: 6,
    recoveryDays: 14,
    inclusions: ["Surgeon & Anesthesia fees", "Class 100 OT & Da Vinci console", "ICU & 5 days waterfront ward", "Pre-op Angiogram & post-op 2D Echo"]
  },
  {
    id: "p-knee",
    name: "Robotic Total Knee Replacement (Bilateral)",
    category: "Orthopaedics",
    usaCostUsd: 55000,
    ukCostGbp: 32000,
    uaeCostAed: 95000,
    keralaCostUsd: 5400,
    keralaCostInr: 475000,
    stayDays: 4,
    recoveryDays: 10,
    inclusions: ["FDA-approved Titanium Implants", "MAKO Robotic sub-millimeter cut", "Daily physiotherapist sessions", "VIP airport reception & limousine"]
  },
  {
    id: "p-panchakarma",
    name: "Authentic 21-Day Classical Panchakarma",
    category: "Ayurveda",
    usaCostUsd: 22000,
    ukCostGbp: 14000,
    uaeCostAed: 45000,
    keralaCostUsd: 2800,
    keralaCostInr: 245000,
    stayDays: 21,
    recoveryDays: 21,
    inclusions: ["Daily 2x Synchronized herbal therapies", "Organic custom Ayurvedic dietitian menu", "Ashtavaidya Vaidya daily Nadi Pariksha", "Western Ghats herbal oil prescriptions"]
  },
  {
    id: "p-oncology",
    name: "Precision TrueBeam Radiotherapy & Resection",
    category: "Oncology",
    usaCostUsd: 140000,
    ukCostGbp: 75000,
    uaeCostAed: 220000,
    keralaCostUsd: 9800,
    keralaCostInr: 860000,
    stayDays: 8,
    recoveryDays: 18,
    inclusions: ["Multi-disciplinary Tumor Board review", "TrueBeam Sub-millimeter stereotactic beams", "Onco-pathology & genetic profiling", "Dedicated oncology care coordinator"]
  },
  {
    id: "p-dental",
    name: "Full-Mouth Dental Implants (All-on-4/6)",
    category: "Dental Care",
    usaCostUsd: 38000,
    ukCostGbp: 22000,
    uaeCostAed: 65000,
    keralaCostUsd: 3200,
    keralaCostInr: 280000,
    stayDays: 5,
    recoveryDays: 7,
    inclusions: ["Straumann / Nobel Biocare Implants", "Digital Smile Design 3D CAD/CAM", "Zirconia permanent prosthetic bridges", "Airport pickup & hotel stay liaison"]
  }
];

interface CostCalculator360Props {
  onOpenIntake?: () => void;
}

export function CostCalculator360({ onOpenIntake }: CostCalculator360Props = {}) {
  const [selectedProcedure, setSelectedProcedure] = useState<ProcedureCost>(PROCEDURES_DATA[0]);
  const [currency, setCurrency] = useState<"USD" | "GBP" | "AED" | "INR">("USD");

  const currencySymbol = 
    currency === "USD" ? "$" :
    currency === "GBP" ? "£" :
    currency === "AED" ? "AED " : "₹";

  const getConvertedPrice = (usd: number): number => {
    switch(currency) {
      case "USD": return usd;
      case "GBP": return Math.round(usd * 0.79);
      case "AED": return Math.round(usd * 3.67);
      case "INR": return Math.round(usd * 84);
    }
  };

  const internationalCostInCurr = getConvertedPrice(selectedProcedure.usaCostUsd);
  const keralaCostInCurr = getConvertedPrice(selectedProcedure.keralaCostUsd);
  const savingsPercent = Math.round(((internationalCostInCurr - keralaCostInCurr) / internationalCostInCurr) * 100);
  const savingsAmountInCurr = internationalCostInCurr - keralaCostInCurr;

  return (
    <div className="rounded-3xl bg-white border border-slate-200 shadow-xl p-6 sm:p-10 space-y-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <div className="inline-flex items-center space-x-2 text-[#0E82FD] text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Cost & Quality Benchmarking</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#0F2042] tracking-tight">
            Transparent Treatment Cost Benchmark
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Compare all-inclusive Kerala package estimates vs average healthcare costs in the USA, UK, and UAE.
          </p>
        </div>

        {/* Currency Switcher */}
        <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200 self-start sm:self-auto">
          {(["USD", "GBP", "AED", "INR"] as const).map((curr) => (
            <button
              key={curr}
              onClick={() => setCurrency(curr)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                currency === curr 
                  ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/25" 
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {curr}
            </button>
          ))}
        </div>
      </div>

      {/* Procedure Selector Horizontal Strip */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        {PROCEDURES_DATA.map((proc) => {
          const isSelected = selectedProcedure.id === proc.id;
          return (
            <button
              key={proc.id}
              onClick={() => setSelectedProcedure(proc)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center space-x-2 ${
                isSelected
                  ? "bg-[#0F2042] text-white shadow-lg shadow-navy-500/30"
                  : "bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200"
              }`}
            >
              <span>{proc.name.split(" ")[0]} {proc.name.split(" ")[1]}</span>
            </button>
          );
        })}
      </div>

      {/* Main Comparative Metric Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gradient-to-br from-blue-50/70 via-slate-50 to-white p-6 sm:p-8 rounded-3xl border border-blue-100">
        
        {/* Left 7 Cols: Price Comparison Columns */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E82FD]">
              {selectedProcedure.category} Package
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-[#0F2042]">
              {selectedProcedure.name}
            </h4>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* International Cost Card */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-xs font-bold text-slate-500">
                Avg USA / UK / UAE Hospital Cost
              </span>
              <div className="text-2xl sm:text-3xl font-black text-slate-400 line-through">
                {currencySymbol}{internationalCostInCurr.toLocaleString()} {currency}
              </div>
              <span className="text-[10px] text-slate-400 block font-medium">Excludes international flight & logistics</span>
            </div>

            {/* Kerala Cost Card */}
            <div className="p-5 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] text-white shadow-xl shadow-blue-500/25 space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-100">Kerala All-Inclusive Cost</span>
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-black uppercase tracking-wider">
                  Save {savingsPercent}%
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {currencySymbol}{keralaCostInCurr.toLocaleString()} {currency}
              </div>
              <span className="text-[10px] text-blue-100 block font-mono">
                ₹{selectedProcedure.keralaCostInr.toLocaleString('en-IN')} INR
              </span>
            </div>
          </div>

          {/* Savings Highlight Banner */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs">
                ✓
              </div>
              <div>
                <div className="text-xs font-bold">Estimated Out-of-Pocket Savings</div>
                <div className="text-[11px] text-emerald-600">Full JCI-accredited clinical care included</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-base sm:text-lg font-black text-emerald-600">
                {currencySymbol}{savingsAmountInCurr.toLocaleString()} {currency}
              </div>
              <span className="text-[10px] font-bold text-emerald-700">~{savingsPercent}% Lower</span>
            </div>
          </div>
        </div>

        {/* Right 5 Cols: Inclusions & Timeline */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h5 className="text-xs font-bold uppercase tracking-wider text-[#0F2042] border-b border-slate-100 pb-2">
            What's Included in Your Kerala Stay
          </h5>

          <div className="space-y-2.5 text-xs text-slate-700">
            {selectedProcedure.inclusions.map((inc, i) => (
              <div key={i} className="flex items-start space-x-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0E82FD] mt-0.5 shrink-0" />
                <span className="leading-snug">{inc}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 block font-bold">Hospital Stay</span>
              <strong className="text-[#0F2042]">{selectedProcedure.stayDays} Days</strong>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <span className="text-[10px] text-slate-500 block font-bold">Total Recovery</span>
              <strong className="text-[#0E82FD]">{selectedProcedure.recoveryDays} Days</strong>
            </div>
          </div>

          <a
            href="#appointment-form"
            className="w-full py-3 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <span>Request Exact Quote</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>

    </div>
  );
}
