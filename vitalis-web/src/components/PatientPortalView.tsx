"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Video, 
  Plane, 
  FileText, 
  Lock, 
  MessageSquare, 
  Download, 
  UploadCloud, 
  MapPin, 
  ChevronRight, 
  CreditCard, 
  Building2, 
  Stethoscope, 
  Phone, 
  Palmtree,
  Leaf
} from "lucide-react";
import { INITIAL_KERALA_PATIENT } from "@/lib/mockData";
import { CareConciergeDrawer } from "@/components/CareConciergeDrawer";

export function PatientPortalView() {
  const [patient, setPatient] = useState(INITIAL_KERALA_PATIENT);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'journey' | 'vault' | 'travel' | 'consultation'>('journey');

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-24">
      
      {/* Top Patient Header with Madies Blue Accent */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0E82FD] flex items-center justify-center text-white font-black text-2xl shadow-md">
                R
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-bold text-[#0F2042]">{patient.name}</h1>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                    Patient ID: {patient.patientId}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">
                  Origin: {patient.country} • Kerala Destination: <strong className="text-[#0F2042]">{patient.keralaDistrict}</strong>
                </p>
              </div>
            </div>

            {/* Dedicated Kerala Concierge Pill */}
            <div className="flex items-center space-x-3">
              <div 
                onClick={() => setConciergeOpen(true)}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 hover:border-blue-300 flex items-center space-x-3 cursor-pointer hover:bg-white transition-all shadow-sm"
              >
                <img 
                  src={patient.careManager.avatar} 
                  alt={patient.careManager.name} 
                  className="w-10 h-10 rounded-full object-cover ring-2 ring-[#0E82FD]" 
                />
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-xs font-bold text-[#0F2042]">{patient.careManager.name}</span>
                    <span className="w-2 h-2 rounded-full bg-[#0E82FD] animate-pulse" />
                  </div>
                  <span className="text-[10px] text-[#0E82FD] font-bold">Kerala Care Concierge (24/7)</span>
                </div>
              </div>

              <Link
                href="/"
                className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Public Website
              </Link>
            </div>

          </div>

          {/* Sub Tabs */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
            {[
              { id: 'journey', label: '10-Stage Kerala Journey Tracker', icon: Clock },
              { id: 'vault', label: 'My Medical Vault (4)', icon: Lock },
              { id: 'travel', label: 'Kerala Travel & Visa Desk', icon: Plane },
              { id: 'consultation', label: 'Doctor Teleconsultation Room', icon: Video }
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center space-x-2 transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-[#0E82FD] text-white shadow-md shadow-blue-500/20'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        
        {/* TAB 1: 10-STAGE JOURNEY TRACKER */}
        {activeTab === 'journey' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left 8 Cols: Step Progression */}
            <div className="lg:col-span-8 space-y-6">
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-lg font-bold text-[#0F2042]">Active Kerala Medical Journey Progression</h2>
                    <p className="text-xs text-slate-500">Current Stage: Step 04 — Second Opinion & Video Consult with Dr. Nair (Kochi)</p>
                  </div>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                    40% Completed
                  </span>
                </div>

                <div className="space-y-4">
                  {patient.steps.map((s) => (
                    <div 
                      key={s.stepNumber}
                      className={`p-4 rounded-2xl border transition-all flex items-start space-x-4 ${
                        s.status === 'completed'
                          ? 'bg-blue-50/40 border-blue-200'
                          : s.status === 'in_progress'
                          ? 'bg-blue-50/80 border-[#0E82FD] ring-2 ring-blue-100'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="mt-0.5">
                        {s.status === 'completed' ? (
                          <div className="w-7 h-7 rounded-full bg-[#0E82FD] text-white flex items-center justify-center text-xs font-bold shadow-sm">
                            ✓
                          </div>
                        ) : s.status === 'in_progress' ? (
                          <div className="w-7 h-7 rounded-full bg-[#0E82FD] text-white flex items-center justify-center text-xs font-bold animate-pulse shadow-sm">
                            {s.stepNumber}
                          </div>
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center text-xs font-bold">
                            {s.stepNumber}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`text-sm font-bold ${s.status === 'in_progress' ? 'text-[#0E82FD]' : 'text-[#0F2042]'}`}>
                            {s.stepNumber}. {s.title}
                          </h3>
                          {s.dateCompleted && (
                            <span className="text-[10px] text-[#0E82FD] font-bold">{s.dateCompleted}</span>
                          )}
                          {s.status === 'in_progress' && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-[#0E82FD]">
                              IN PROGRESS
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-600 mt-1 leading-relaxed">{s.description}</p>
                        {s.details && (
                          <div className="mt-2 text-[11px] text-slate-600 bg-white px-3 py-1.5 rounded-lg border border-slate-200 inline-block font-medium">
                            ℹ️ {s.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right 4 Cols: Quick Actions & Summary */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Selected Care Plan Card */}
              <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E82FD]">Active Treatment File</span>
                <h3 className="text-base font-bold text-[#0F2042]">{patient.treatment}</h3>
                
                <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Hospital:</span>
                    <span className="font-bold text-[#0F2042]">Aster Medcity, Kochi (JCI)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Chief Surgeon:</span>
                    <span className="font-bold text-[#0F2042]">Dr. Muralidharan V. Nair</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Care Tier:</span>
                    <span className="font-bold text-[#0E82FD]">Kochi Platinum VIP</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">All-Inclusive Cost:</span>
                    <span className="font-black text-[#0E82FD]">₹6,50,000 (~$7,400 USD)</span>
                  </div>
                </div>

                <div className="pt-3">
                  <button 
                    onClick={() => setActiveTab('consultation')}
                    className="w-full py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2 transition-all"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Pre-Travel Video Room</span>
                  </button>
                </div>
              </div>

              {/* Concierge Hotline Card */}
              <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-200 shadow-sm space-y-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={patient.careManager.avatar} 
                    alt="Kerala Care Concierge" 
                    className="w-12 h-12 rounded-full object-cover ring-2 ring-[#0E82FD]" 
                  />
                  <div>
                    <h4 className="text-sm font-bold text-[#0F2042]">{patient.careManager.name}</h4>
                    <p className="text-[11px] text-[#0E82FD] font-semibold">Your Personal Kerala Care Coordinator</p>
                    <p className="text-[10px] text-slate-500">Languages: Malayalam, English, Arabic, Hindi</p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  "I am actively coordinating Dr. Nair's second opinion note at Aster Medcity and ensuring your Cochin Airport (COK) VIP greeting is confirmed."
                </p>

                <div className="pt-2 flex gap-2">
                  <button 
                    onClick={() => setConciergeOpen(true)}
                    className="flex-1 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-[#0E82FD]" />
                    <span>Live Chat</span>
                  </button>
                  <a 
                    href="https://wa.me" 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex-1 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-xs font-bold text-white flex items-center justify-center space-x-1.5 shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* TAB 2: MY MEDICAL VAULT */}
        {activeTab === 'vault' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm">
              <div>
                <div className="flex items-center space-x-2">
                  <Lock className="w-5 h-5 text-[#0E82FD]" />
                  <h2 className="text-lg font-bold text-[#0F2042]">Patient Controlled Medical Vault</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">Encrypted zero-knowledge file repository accessible only to authorized Kerala hospital clinicians.</p>
              </div>

              <button className="px-5 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs flex items-center space-x-2 shadow-md shadow-blue-500/20">
                <UploadCloud className="w-4 h-4" />
                <span>Upload New Scan or Report</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {patient.vaultDocuments.map((doc) => (
                <div key={doc.id} className="p-5 rounded-2xl bg-white border border-slate-200 flex items-center justify-between shadow-sm hover:border-blue-300 transition-all">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#0E82FD] flex items-center justify-center">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#0F2042] font-mono">{doc.name}</h4>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-500 mt-0.5 font-medium">
                        <span className="px-1.5 py-0.5 rounded bg-slate-100 text-[#0E82FD] font-semibold">{doc.category}</span>
                        <span>•</span>
                        <span>{doc.size}</span>
                        <span>•</span>
                        <span>Uploaded {doc.dateUploaded}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                      Verified
                    </span>
                    <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: TRAVEL & VISA CONCIERGE */}
        {activeTab === 'travel' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Visa Module */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#0E82FD]" />
                <h3 className="text-base font-bold text-[#0F2042]">Kerala Medical eVisa</h3>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 space-y-2">
                <span className="text-[10px] font-bold text-[#0E82FD] uppercase tracking-wider block">Status</span>
                <div className="text-sm font-bold text-[#0F2042]">{patient.travelDetails.visaStatus}</div>
                <p className="text-xs text-slate-600">Official invitation letter stamped by Aster Medcity International Desk.</p>
              </div>

              <button className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 flex items-center justify-center space-x-2 transition-colors">
                <Download className="w-3.5 h-3.5 text-[#0E82FD]" />
                <span>Download Visa Invitation Letter</span>
              </button>
            </div>

            {/* Airport & Chauffeur */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Plane className="w-5 h-5 text-[#0E82FD]" />
                <h3 className="text-base font-bold text-[#0F2042]">Cochin Airport VIP Escort</h3>
              </div>

              <div className="space-y-3 text-xs text-slate-600">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Flight Coordinates</span>
                  <strong className="text-[#0F2042]">{patient.travelDetails.flightNumber}</strong>
                  <div className="text-[11px] text-slate-500">{patient.travelDetails.arrivalDate}</div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-500 block">Assigned Chauffeur (Kochi Desk)</span>
                  <strong className="text-[#0F2042]">{patient.travelDetails.airportPickupDriver}</strong>
                  <div className="text-[11px] text-[#0E82FD] font-mono font-bold">{patient.travelDetails.vehiclePlate}</div>
                </div>
              </div>
            </div>

            {/* Backwater Recovery Hotel */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#0E82FD]" />
                <h3 className="text-base font-bold text-[#0F2042]">Backwater Recovery Suite</h3>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <span className="text-[10px] text-[#0E82FD] font-bold uppercase tracking-wider block">Confirmed Reservation</span>
                <div className="text-sm font-bold text-[#0F2042]">{patient.travelDetails.hotelName}</div>
                <div className="text-xs text-slate-500">{patient.travelDetails.hotelRoomType}</div>
                <p className="text-[11px] text-slate-600 pt-2 border-t border-slate-200">
                  Includes on-call nurse visits, customized Kerala dietitian menu, and bedside physiotherapy.
                </p>
              </div>
            </div>

          </div>
        )}

        {/* TAB 4: TELECONSULTATION ROOM */}
        {activeTab === 'consultation' && (
          <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm max-w-3xl mx-auto space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#0E82FD]">Secure Telehealth Suite</span>
                <h2 className="text-xl font-bold text-[#0F2042]">Dr. Muralidharan V. Nair — Pre-Travel Consultation</h2>
                <p className="text-xs text-slate-500">Chief of Cardiothoracic & Vascular Surgery • Aster Medcity, Kochi</p>
              </div>
              <span className="w-3 h-3 rounded-full bg-[#0E82FD] animate-ping" />
            </div>

            <div className="relative rounded-2xl overflow-hidden bg-slate-900 aspect-video border border-slate-200 flex flex-col items-center justify-center p-6 text-center text-white">
              <img 
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80" 
                alt="Dr. Muralidharan Nair" 
                className="w-20 h-20 rounded-full object-cover ring-4 ring-[#0E82FD] mb-3"
              />
              <h3 className="text-base font-bold">Encrypted Kerala Video Room Ready</h3>
              <p className="text-xs text-slate-300 max-w-sm mt-1">
                Your medical angiography reports and AI-extracted clinical dossier are loaded on Dr. Nair's console in Kochi.
              </p>

              <button 
                onClick={() => alert("Launching Secure WebRTC Encrypted Clinical Room...")}
                className="mt-5 px-6 py-3 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-500/30 flex items-center space-x-2 transition-all"
              >
                <Video className="w-4 h-4" />
                <span>Enter Video Room with Dr. Nair</span>
              </button>
            </div>
          </div>
        )}

      </div>

      <CareConciergeDrawer 
        isOpen={conciergeOpen} 
        onClose={() => setConciergeOpen(false)} 
      />

    </div>
  );
}
