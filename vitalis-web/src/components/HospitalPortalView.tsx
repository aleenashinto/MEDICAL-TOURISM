"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  FileText, 
  CheckCircle2, 
  Clock, 
  UploadCloud, 
  DollarSign, 
  Calendar, 
  Send, 
  ShieldCheck, 
  User, 
  ChevronRight, 
  Download, 
  Palmtree,
  Leaf
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface HospitalCase {
  id: string;
  patientName: string;
  patientAge: number;
  country: string;
  condition: string;
  requestedProcedure: string;
  status: 'Awaiting Quote' | 'Quote Submitted' | 'Admission Scheduled' | 'Discharge Issued';
  dateReceived: string;
  summary: string;
  scansCount: number;
  quotedAmountInr?: number;
  quotedAmountUsd?: number;
  tentativeAdmissionDate?: string;
}

export function HospitalPortalView() {
  const [selectedHospital, setSelectedHospital] = useState("Aster Medcity (Ernakulam / Kochi 🌴)");
  const [activeTab, setActiveTab] = useState<'inquiries' | 'quotations' | 'admissions'>('inquiries');
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [activeCase, setActiveCase] = useState<HospitalCase | null>(null);

  const [quoteInput, setQuoteInput] = useState({
    amountInr: "650000",
    stayDays: "6",
    icuDays: "2",
    doctor: "Dr. Muralidharan V. Nair",
    notes: "Includes Da Vinci Robotic console charges, titanium graft disposables, presidential waterfront suite with attendant bed, and Halal / Continental dining."
  });

  const [cases, setCases] = useState<HospitalCase[]>([
    {
      id: "KL-HOSP-901",
      patientName: "Rashid Al-Maktoum",
      patientAge: 58,
      country: "UAE 🇦🇪",
      condition: "Severe Multi-Vessel CAD",
      requestedProcedure: "Off-Pump Beating-Heart CABG",
      status: "Awaiting Quote",
      dateReceived: "Today, 09:15 AM",
      summary: "Proximal LAD 85% occlusion, RCA 90%. Preserved LVEF 50%. Non-smoker, Type II Diabetic.",
      scansCount: 3
    },
    {
      id: "KL-HOSP-902",
      patientName: "David H. Sterling",
      patientAge: 64,
      country: "USA 🇺🇸",
      condition: "Severe Bilateral Osteoarthritis",
      requestedProcedure: "Robotic Total Knee Replacement",
      status: "Quote Submitted",
      dateReceived: "Yesterday",
      summary: "MAKO robotic pre-planning CT reviewed. Prescribed Stryker Triathlon titanium prosthetic.",
      scansCount: 4,
      quotedAmountInr: 475000,
      quotedAmountUsd: 5400
    },
    {
      id: "KL-HOSP-903",
      patientName: "Fatima Al-Zahrani",
      patientAge: 47,
      country: "Saudi Arabia 🇸🇦",
      condition: "Chronic Rheumatoid Arthritis & Lumbar Spondylosis",
      requestedProcedure: "Authentic 21-Day Panchakarma & Pizhichil",
      status: "Admission Scheduled",
      dateReceived: "Aug 28, 2026",
      summary: "Kerala medical visa letter dispatched. Patient flight arriving at Calicut Airport (CCJ) Sept 16.",
      scansCount: 5,
      quotedAmountInr: 245000,
      quotedAmountUsd: 2800,
      tentativeAdmissionDate: "Sept 17, 2026"
    }
  ]);

  const handleOpenQuote = (c: HospitalCase) => {
    setActiveCase(c);
    setQuoteModalOpen(true);
  };

  const handleSubmitQuote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    setCases((prev) =>
      prev.map((item) =>
        item.id === activeCase.id
          ? {
              ...item,
              status: 'Quote Submitted',
              quotedAmountInr: parseInt(quoteInput.amountInr) || 650000,
              quotedAmountUsd: Math.round((parseInt(quoteInput.amountInr) || 650000) / 88)
            }
          : item
      )
    );
    setQuoteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20">
      
      {/* Top Hospital Partner Header with Madies Blue Theme */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0E82FD] flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-[#0F2042]">Kerala Hospital Partner Portal</h1>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#0E82FD]">
                    Kerala JCI / NABH Network
                  </span>
                </div>
                <p className="text-xs text-slate-500">International Patient Coordination & Quotation Desk</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select 
                value={selectedHospital}
                onChange={(e) => setSelectedHospital(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-[#0E82FD]"
              >
                <option>Aster Medcity (Ernakulam / Kochi 🌴)</option>
                <option>Rajagiri Hospital (Aluva, Kochi)</option>
                <option>KIMSHEALTH (Thiruvananthapuram)</option>
                <option>Baby Memorial Hospital (Kozhikode)</option>
                <option>Caritas Hospital (Kottayam)</option>
                <option>Arya Vaidya Sala (Kottakkal, Malappuram 🌿)</option>
              </select>

              <Link 
                href="/admin"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                CRM
              </Link>
            </div>

          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-100">
            {[
              { id: 'inquiries', label: `Pending Medical Reviews (${cases.filter(c => c.status === 'Awaiting Quote').length})` },
              { id: 'quotations', label: 'Active Quotations & Plans' },
              { id: 'admissions', label: 'Confirmed International Admissions' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#0E82FD] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Metric Strips */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Incoming Kerala Cases (Last 7 Days)</span>
            <div className="text-2xl font-black text-[#0F2042] mt-1">16 Inquiries</div>
            <span className="text-[10px] text-[#0E82FD] font-bold">100% DICOM reports attached</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Avg Quotation Turnaround</span>
            <div className="text-2xl font-black text-[#0E82FD] mt-1">2.1 Hours</div>
            <span className="text-[10px] text-slate-500 font-bold">Target SLA: &lt; 4 Hours</span>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Confirmed Kerala Admissions</span>
            <div className="text-2xl font-black text-[#0F2042] mt-1">9 Scheduled</div>
            <span className="text-[10px] text-[#0E82FD] font-bold">Kerala medical visas issued</span>
          </div>
        </div>

        {/* Cases List */}
        <div className="space-y-4">
          {cases.map((c) => (
            <div 
              key={c.id}
              className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:border-blue-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <span className="text-base font-bold text-[#0F2042]">{c.patientName}</span>
                  <span className="text-xs text-slate-500 font-semibold">({c.patientAge} yrs)</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium">
                    {c.country}
                  </span>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${
                    c.status === 'Awaiting Quote'
                      ? 'bg-blue-50 text-[#0E82FD] border border-blue-200'
                      : c.status === 'Quote Submitted'
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'bg-blue-100 text-[#0F2042] border border-blue-300'
                  }`}>
                    {c.status}
                  </span>
                </div>

                <div className="text-xs text-slate-700 font-semibold">
                  🩺 Procedure: <strong className="text-[#0E82FD]">{c.requestedProcedure}</strong>
                </div>

                <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 leading-relaxed">
                  <strong>Clinical Summary:</strong> {c.summary}
                </p>

                <div className="flex items-center space-x-4 text-[11px] text-slate-500 font-medium">
                  <span>ID: {c.id}</span>
                  <span>•</span>
                  <span>Received: {c.dateReceived}</span>
                  <span>•</span>
                  <span className="text-[#0E82FD] font-bold">📁 {c.scansCount} Verified DICOM Scans</span>
                  {c.quotedAmountInr && (
                    <>
                      <span>•</span>
                      <span className="text-[#0E82FD] font-bold">Quoted: ₹{c.quotedAmountInr.toLocaleString('en-IN')} (~${c.quotedAmountUsd})</span>
                    </>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2 shrink-0">
                {c.status === 'Awaiting Quote' ? (
                  <button
                    onClick={() => handleOpenQuote(c)}
                    className="px-5 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>Upload Official Quotation</span>
                  </button>
                ) : (
                  <button
                    onClick={() => alert(`Reviewing clinical chart for ${c.patientName}`)}
                    className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center space-x-2 transition-colors"
                  >
                    <Download className="w-3.5 h-3.5 text-[#0E82FD]" />
                    <span>View Clinical Dossier</span>
                  </button>
                )}

                <button 
                  onClick={() => alert("Kerala Medical eVisa invitation letter dispatched.")}
                  className="px-4 py-2 rounded-xl bg-white text-slate-600 hover:text-[#0E82FD] border border-slate-200 text-xs font-semibold"
                >
                  Generate eVisa Letter
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* Official Quotation Modal */}
      {quoteModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-base font-bold text-[#0F2042]">Submit Official Kerala Clinical Quotation</h3>
                <p className="text-xs text-slate-500">Patient: {activeCase.patientName} • Case: {activeCase.id}</p>
              </div>
              <button onClick={() => setQuoteModalOpen(false)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
            </div>

            <form onSubmit={handleSubmitQuote} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Total Procedure Estimate (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input 
                    type="number"
                    value={quoteInput.amountInr}
                    onChange={(e) => setQuoteInput({ ...quoteInput, amountInr: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-8 pr-4 py-2.5 text-slate-900 font-bold text-sm focus:border-[#0E82FD] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hospital Ward Stay (Days)</label>
                  <input 
                    type="number"
                    value={quoteInput.stayDays}
                    onChange={(e) => setQuoteInput({ ...quoteInput, stayDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-[#0E82FD] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">ICU Stay (Days)</label>
                  <input 
                    type="number"
                    value={quoteInput.icuDays}
                    onChange={(e) => setQuoteInput({ ...quoteInput, icuDays: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-[#0E82FD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Lead Operating Surgeon / Vaidya</label>
                <input 
                  type="text"
                  value={quoteInput.doctor}
                  onChange={(e) => setQuoteInput({ ...quoteInput, doctor: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:border-[#0E82FD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Inclusions & Inpatient Scope</label>
                <textarea 
                  rows={3}
                  value={quoteInput.notes}
                  onChange={(e) => setQuoteInput({ ...quoteInput, notes: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:border-[#0E82FD] focus:outline-none"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all"
                >
                  Submit Official Proposal to Concierge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
