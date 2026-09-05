"use client";

import React, { useState } from "react";
import { 
  FileText, 
  Search, 
  Users, 
  DollarSign, 
  Plane, 
  Stethoscope, 
  Heart, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from "lucide-react";

interface Step {
  id: string;
  stepNumber: string;
  title: string;
  subtitle: string;
  icon: any;
  duration: string;
  badge: string;
  description: string;
  keyDeliverables: string[];
}

const JOURNEY_STEPS: Step[] = [
  {
    id: "enquire",
    stepNumber: "01",
    title: "ENQUIRE",
    subtitle: "Submit Medical Query",
    icon: FileText,
    duration: "Instant",
    badge: "100% Confidential",
    description: "Submit your clinical requirements, current symptoms, and preferred Kerala travel dates through our encrypted portal or direct WhatsApp desk.",
    keyDeliverables: [
      "Zero-knowledge encrypted upload",
      "Immediate case assignment",
      "Dedicated Kerala coordinator"
    ]
  },
  {
    id: "review",
    stepNumber: "02",
    title: "REVIEW",
    subtitle: "Clinical Analysis",
    icon: Search,
    duration: "Within 4 Hours",
    badge: "Expert Triage",
    description: "Our in-house clinical board reviews your medical records, scans, and pathology with leading hospital directors in Kochi and Trivandrum.",
    keyDeliverables: [
      "Cross-specialty triage",
      "Radiology DICOM review",
      "Preliminary suitability assessment"
    ]
  },
  {
    id: "match",
    stepNumber: "03",
    title: "MATCH",
    subtitle: "Doctor & Hospital Pairing",
    icon: Users,
    duration: "Same Day",
    badge: "JCI / NABH Specialists",
    description: "We match you with board-certified chief surgeons (FRCS, American Board, AIIMS, Ashtavaidya) tailored specifically to your clinical history.",
    keyDeliverables: [
      "Chief surgeon selection",
      "Hospital facility comparison",
      "Direct tele-consultation option"
    ]
  },
  {
    id: "quote",
    stepNumber: "04",
    title: "QUOTE",
    subtitle: "Transparent 3-Tier Quote",
    icon: DollarSign,
    duration: "24 Hours",
    badge: "Zero Hidden Fees",
    description: "Receive itemized hospital quotes with transparent tier options (VIP Suite, Deluxe, Private) comparing surgery, stay, implants, and airport transfers.",
    keyDeliverables: [
      "All-inclusive surgical pricing",
      "Tiered room & hospital options",
      "Up to 70% savings breakdown"
    ]
  },
  {
    id: "travel",
    stepNumber: "05",
    title: "TRAVEL",
    subtitle: "eVisa & VIP Arrival",
    icon: Plane,
    duration: "Fast-Track",
    badge: "Airport Escort",
    description: "Partner hospital issues official Medical eVisa Invitation Letters in 4 hours. On landing in Kerala, our tarmac concierge welcomes you directly.",
    keyDeliverables: [
      "4-Hour medical visa letter",
      "COK/TRV/CCJ Airport meet & greet",
      "Private sanitized hospital transfer"
    ]
  },
  {
    id: "treat",
    stepNumber: "06",
    title: "TREAT",
    subtitle: "World-Class Care",
    icon: Stethoscope,
    duration: "Hospital Stay",
    badge: "Accredited Excellence",
    description: "Undergo your advanced robotic surgery or treatment in ultra-clean Class 100 laminar flow OTs with dedicated 24/7 personal patient advocacy.",
    keyDeliverables: [
      "Da Vinci & MAKO robotics",
      "Dedicated nurse & translator",
      "Real-time family updates"
    ]
  },
  {
    id: "recover",
    stepNumber: "07",
    title: "RECOVER",
    subtitle: "Backwater Rejuvenation",
    icon: Heart,
    duration: "12-Month Support",
    badge: "Holistic Healing",
    description: "Heal gracefully along Kumarakom and Kovalam backwater sanatoriums, combining modern physiotherapy, Ayurveda, and continuous tele-monitoring.",
    keyDeliverables: [
      "Serene backwater resort stay",
      "Authentic herbal convalescence",
      "12-Month international tele-review"
    ]
  }
];

interface HorizontalJourneyTimelineProps {
  onOpenIntake: () => void;
}

export function HorizontalJourneyTimeline({ onOpenIntake }: HorizontalJourneyTimelineProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const activeStep = JOURNEY_STEPS[activeStepIndex];

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#0F2042] via-[#163868] to-[#0A182F] text-white p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/10 relative overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#0E82FD]/15 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-80 h-80 bg-emerald-500/10 rounded-full blur-[90px] pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 sm:mb-10">
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 border border-white/15 backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span className="text-[11px] font-black uppercase tracking-widest text-cyan-200">
              Interactive Patient Pathway
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            How Your Kerala Medical Journey Works
          </h2>
          <p className="text-xs sm:text-sm text-blue-100/80 mt-1 max-w-xl">
            A seamless 7-stage pathway designed for total peace of mind, from initial clinical enquiry to restorative backwater recovery.
          </p>
        </div>

        <button
          onClick={onOpenIntake}
          className="px-6 py-3.5 rounded-full bg-gradient-to-r from-[#0E82FD] to-cyan-400 hover:from-blue-600 hover:to-cyan-300 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25 shrink-0 flex items-center justify-center space-x-2 cursor-pointer"
        >
          <span>Start Your Journey</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Horizontal Steps Bar */}
      <div className="relative z-10 overflow-x-auto pb-4 pt-2 -mx-2 px-2 scrollbar-thin scrollbar-thumb-white/20">
        <div className="flex items-center min-w-[700px] lg:min-w-full justify-between relative">
          
          {/* Connector Line behind steps */}
          <div className="absolute top-1/2 left-6 right-6 -translate-y-1/2 h-1 bg-white/15 z-0" />
          <div 
            className="absolute top-1/2 left-6 -translate-y-1/2 h-1 bg-gradient-to-r from-[#0E82FD] to-cyan-400 z-0 transition-all duration-500"
            style={{ width: `${(activeStepIndex / (JOURNEY_STEPS.length - 1)) * 96}%` }}
          />

          {JOURNEY_STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = activeStepIndex === idx;
            const isCompleted = idx < activeStepIndex;

            return (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className="relative z-10 flex flex-col items-center group cursor-pointer focus:outline-none"
              >
                {/* Step Circle */}
                <div 
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    isActive 
                      ? "bg-gradient-to-tr from-[#0E82FD] to-cyan-400 text-white shadow-xl shadow-cyan-500/40 scale-110 ring-4 ring-white/20" 
                      : isCompleted
                      ? "bg-emerald-500 text-white shadow-md"
                      : "bg-[#183664] border border-white/20 text-blue-200 group-hover:border-cyan-400 group-hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>

                {/* Step Label */}
                <div className="mt-2.5 text-center">
                  <span className={`text-[10px] sm:text-[11px] font-black tracking-wider uppercase block transition-colors ${
                    isActive ? "text-cyan-300 font-bold" : isCompleted ? "text-emerald-300" : "text-blue-200/70"
                  }`}>
                    {step.title}
                  </span>
                  <span className="text-[9px] text-blue-200/50 hidden sm:block">
                    Step {step.stepNumber}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Step Detailed Card */}
      <div className="relative z-10 mt-6 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 p-5 sm:p-8 animate-in fade-in duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 text-xs font-bold">
                Step {activeStep.stepNumber} • {activeStep.subtitle}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
                {activeStep.badge}
              </span>
              <span className="text-xs text-blue-200/80 ml-auto">
                Typical Timeline: <strong className="text-white">{activeStep.duration}</strong>
              </span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white">
              {activeStep.title}: {activeStep.subtitle}
            </h3>

            <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
              {activeStep.description}
            </p>

            <div className="pt-2 grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
              {activeStep.keyDeliverables.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-300 shrink-0 mt-0.5" />
                  <span className="text-[11px] sm:text-xs text-white/90 font-medium leading-tight">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center items-center lg:items-end space-y-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l border-white/15 lg:pl-6">
            <div className="w-full text-center lg:text-right">
              <span className="text-xs text-blue-200">Ready to initiate this stage?</span>
              <div className="text-sm font-bold text-white mt-0.5">MAIDES Kerala Care Team Active Now</div>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              {activeStepIndex < JOURNEY_STEPS.length - 1 && (
                <button
                  onClick={() => setActiveStepIndex(prev => Math.min(JOURNEY_STEPS.length - 1, prev + 1))}
                  className="px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold transition-all flex items-center space-x-1 cursor-pointer"
                >
                  <span>Next Step</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onOpenIntake}
                className="px-6 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-md flex items-center space-x-1 cursor-pointer flex-1 sm:flex-none justify-center"
              >
                <span>Initiate Step {activeStep.stepNumber}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}
