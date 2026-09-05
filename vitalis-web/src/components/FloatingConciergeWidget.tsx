"use client";

import React, { useState } from "react";
import { 
  MessageSquare, 
  Sparkles, 
  X, 
  ChevronRight, 
  Stethoscope, 
  Building2, 
  Calculator, 
  FileText, 
  Plane, 
  ShieldCheck, 
  Phone,
  HelpCircle,
  ExternalLink
} from "lucide-react";

interface FloatingConciergeWidgetProps {
  onOpenIntake: () => void;
  onOpenConcierge: () => void;
}

export function FloatingConciergeWidget({ onOpenIntake, onOpenConcierge }: FloatingConciergeWidgetProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [pulseDismissed, setPulseDismissed] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end">
      
      {/* Expanded Quick Options Menu */}
      {isExpanded && (
        <div className="mb-3 w-80 sm:w-96 rounded-3xl bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl p-5 animate-in slide-in-from-bottom-5 duration-300 space-y-4">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80" 
                  alt="Concierge Avatar" 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0E82FD]"
                />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#0F2042]">MAIDES Care Concierge</h4>
                <p className="text-[11px] text-slate-500 font-medium">Kerala Medical Travel Assistant</p>
              </div>
            </div>
            <button 
              onClick={() => setIsExpanded(false)}
              className="p-1 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Action Buttons Grid */}
          <div className="space-y-2">
            <button
              onClick={() => {
                setIsExpanded(false);
                const docSection = document.getElementById("doctors");
                if (docSection) docSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between group text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-[#0E82FD] flex items-center justify-center shrink-0">
                  <Stethoscope className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F2042]">Find a Specialist Doctor</div>
                  <div className="text-[10px] text-slate-500">Search 500+ verified Kerala surgeons</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0E82FD] transition-colors" />
            </button>

            <button
              onClick={() => {
                setIsExpanded(false);
                const hospSection = document.getElementById("hospitals");
                if (hospSection) hospSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-blue-50 border border-slate-100 hover:border-blue-200 transition-all flex items-center justify-between group text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F2042]">Explore Accredited Hospitals</div>
                  <div className="text-[10px] text-slate-500">JCI & NABH quaternary campuses</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
            </button>

            <button
              onClick={() => {
                setIsExpanded(false);
                const calcSection = document.getElementById("corridor-telemetry");
                if (calcSection) calcSection.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full p-2.5 rounded-2xl bg-slate-50 hover:bg-emerald-50 border border-slate-100 hover:border-emerald-200 transition-all flex items-center justify-between group text-left cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#0F2042]">Calculate Treatment Cost</div>
                  <div className="text-[10px] text-slate-500">Compare vs UAE, UK & US prices</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
            </button>

            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenIntake();
              }}
              className="w-full p-2.5 rounded-2xl bg-gradient-to-r from-[#0E82FD] to-[#38BDF8] text-white hover:from-blue-600 hover:to-cyan-400 transition-all flex items-center justify-between group text-left shadow-md cursor-pointer"
            >
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-white/20 text-white flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Submit Medical Enquiry</div>
                  <div className="text-[10px] text-blue-100">Zero-fee clinical assessment</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Footer Direct Chat Links */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-600">
            <button
              onClick={() => {
                setIsExpanded(false);
                onOpenConcierge();
              }}
              className="text-[#0E82FD] font-bold flex items-center space-x-1 hover:underline cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Open Live Chat</span>
            </button>
            <a
              href="https://wa.me"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-600 font-bold flex items-center space-x-1 hover:underline"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Desk</span>
            </a>
          </div>

        </div>
      )}

      {/* Floating Main Trigger Button */}
      <div className="flex items-center space-x-3">
        
        {/* Subtle Greeting Pill */}
        {!isExpanded && !pulseDismissed && (
          <div className="hidden sm:flex items-center space-x-2 px-3.5 py-2 rounded-full bg-white/95 backdrop-blur-md shadow-xl border border-slate-200 text-xs font-bold text-[#0F2042] animate-bounce">
            <Sparkles className="w-3.5 h-3.5 text-[#0E82FD]" />
            <span>Need Help? Talk to Kerala Concierge</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setPulseDismissed(true);
              }}
              className="text-slate-400 hover:text-slate-600 ml-1"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <button
          onClick={() => setIsExpanded(!isExpanded)}
          aria-label="Kerala Medical Concierge Assistant"
          className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-r from-[#0E82FD] via-blue-600 to-[#163974] text-white shadow-2xl shadow-blue-500/40 hover:scale-105 active:scale-95 transition-all duration-300 flex items-center justify-center cursor-pointer group border-2 border-white/40"
        >
          {isExpanded ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <>
              <MessageSquare className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="absolute top-1 right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
