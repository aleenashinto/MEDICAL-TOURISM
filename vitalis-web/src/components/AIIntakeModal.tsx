"use client";

import React, { useState } from "react";
import { 
  X, 
  UploadCloud, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Globe, 
  Clock, 
  DollarSign, 
  UserCheck,
  AlertCircle,
  Palmtree,
  ShieldCheck
} from "lucide-react";
import confetti from "canvas-confetti";

interface AIIntakeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (structuredProfile: any) => void;
}

export function AIIntakeModal({ isOpen, onClose, onSuccess }: AIIntakeModalProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john@example.com");
  const [phone, setPhone] = useState("+971 50 123 4567");
  const [whatsapp, setWhatsapp] = useState("+971 50 123 4567");
  const [condition, setCondition] = useState("Cardiology (Off-Pump CABG)");
  const [country, setCountry] = useState("United Arab Emirates 🇦🇪");
  const [district, setDistrict] = useState("Ernakulam / Kochi (Aster / Rajagiri)");
  const [preferredTier, setPreferredTier] = useState("Platinum VIP Concierge (Backwater Suite)");
  const [language, setLanguage] = useState("English / Arabic");
  const [travelWindow, setTravelWindow] = useState("Within next 30 days");
  const [numberOfPatients, setNumberOfPatients] = useState(1);
  const [accompanyingPersons, setAccompanyingPersons] = useState(1);
  const [medicalSummary, setMedicalSummary] = useState("Diagnosed with multi-vessel CAD. Seeking second opinion and minimally invasive beating-heart surgery in Kochi.");
  const [consent, setConsent] = useState(true);
  
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "Coronary_Angiogram_DICOM_Summary.pdf",
    "Comprehensive_Metabolic_Panel.pdf"
  ]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  if (!isOpen) return null;

  const handleRunAIAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setStep(3);
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }, 1800);
  };

  const handleFinish = () => {
    onClose();
    if (onSuccess) {
      onSuccess({
        name,
        email,
        phone,
        whatsapp,
        condition,
        country,
        district,
        preferredTier,
        language,
        travelWindow,
        numberOfPatients,
        accompanyingPersons,
        medicalSummary,
        consent,
        uploadedFiles
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden my-auto max-h-[94vh] flex flex-col text-slate-800">
        
        {/* Header with MAIDES Medical Branding */}
        <div className="flex items-center justify-between px-4 sm:px-8 py-3.5 sm:py-5 border-b border-slate-100 bg-slate-50/80 shrink-0">
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-blue-100 text-[#0E82FD] flex items-center justify-center font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E82FD]" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-sm sm:text-base font-bold text-[#0F2042]">MAIDES Medical Enquiry & Triage</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0E82FD] border border-blue-200">
                  Step {step}/4
                </span>
              </div>
              <p className="text-[10px] sm:text-xs text-slate-500 line-clamp-1 sm:line-clamp-none">Structured patient intake & scan upload</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors shrink-0 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Indicator */}
        <div className="px-4 sm:px-8 pt-3 sm:pt-6 pb-2 shrink-0">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 -translate-y-1/2 z-0" />
            
            {[
              { num: 1, label: "1. Personal & Need" },
              { num: 2, label: "2. Medical Scans" },
              { num: 3, label: "3. Triage & Match" },
              { num: 4, label: "4. Proposals" }
            ].map((s) => (
              <div key={s.num} className="relative z-10 flex flex-col items-center">
                <div 
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[11px] sm:text-xs font-bold transition-all ${
                    step >= s.num 
                      ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30" 
                      : "bg-slate-100 text-slate-400 border border-slate-300"
                  }`}
                >
                  {s.num}
                </div>
                <span className="text-[10px] sm:text-[11px] font-semibold text-slate-600 mt-1 hidden sm:block">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-8 space-y-4 sm:space-y-6 overflow-y-auto flex-1">
          
          {/* STEP 1: PERSONAL & TREATMENT REQUIREMENT (SECTION 18) */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Country of Origin</label>
                  <select 
                    value={country} 
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                  >
                    <option>United Arab Emirates 🇦🇪</option>
                    <option>Saudi Arabia 🇸🇦</option>
                    <option>Qatar 🇶🇦</option>
                    <option>Oman 🇴🇲</option>
                    <option>Kuwait 🇰🇼</option>
                    <option>United States 🇺🇸 / NRI</option>
                    <option>United Kingdom 🇬🇧</option>
                    <option>Canada 🇨🇦</option>
                    <option>Australia 🇦🇺</option>
                    <option>Africa (Nigeria / Kenya / Ghana)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">WhatsApp Phone Number</label>
                  <input 
                    type="text" 
                    value={whatsapp} 
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Specialty Requirement</label>
                  <select 
                    value={condition} 
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                  >
                    <option>Cardiology (Off-Pump CABG / TAVR)</option>
                    <option>Robotic Orthopaedics (MAKO Knee & Hip)</option>
                    <option>Oncology (TrueBeam Radiation / Surgery)</option>
                    <option>Classical Ayurveda (Arya Vaidya Sala Panchakarma)</option>
                    <option>Living-Donor Liver / Kidney Transplant</option>
                    <option>Neurology & Minimally Invasive Spine</option>
                    <option>Fertility & IVF</option>
                    <option>Dental Rehabilitation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Preferred Kerala District</label>
                  <select 
                    value={district} 
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                  >
                    <option>Ernakulam / Kochi (Aster Medcity / Rajagiri)</option>
                    <option>Thiruvananthapuram (KIMSHEALTH / RCC)</option>
                    <option>Kozhikode (Baby Memorial Hospital / MIMS)</option>
                    <option>Malappuram (Arya Vaidya Sala Kottakkal)</option>
                    <option>Kottayam (Caritas / Bharat Hospital)</option>
                    <option>Any Verified Kerala Quaternary Center</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Brief Medical History / Symptoms</label>
                <textarea 
                  rows={2}
                  value={medicalSummary}
                  onChange={(e) => setMedicalSummary(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input 
                  type="checkbox" 
                  id="consent" 
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="rounded text-[#0E82FD] focus:ring-0"
                />
                <label htmlFor="consent" className="text-[11px] text-slate-500">
                  I consent to sharing this medical enquiry with verified healthcare providers in Kerala under MAIDES privacy policy.
                </label>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all"
                >
                  <span>Continue to Document Upload</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: ENCRYPTED MEDICAL VAULT UPLOAD (SECTION 23) */}
          {step === 2 && (
            <div className="space-y-5">
              <div className="p-6 rounded-2xl bg-blue-50/50 border-2 border-dashed border-[#0E82FD]/40 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-white text-[#0E82FD] mx-auto flex items-center justify-center shadow-md">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F2042]">Upload Scans & Lab Reports</h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                    Upload DICOM studies, angiography reports, blood tests, or previous doctor notes. Zero-knowledge encrypted storage.
                  </p>
                </div>
                <button 
                  type="button"
                  onClick={() => setUploadedFiles([...uploadedFiles, `Report_Upload_${Date.now().toString().slice(-4)}.pdf`])}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                >
                  Browse Files from Device
                </button>
              </div>

              {/* Uploaded files list */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Uploaded Records ({uploadedFiles.length})</span>
                {uploadedFiles.map((file, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-[#0E82FD]" />
                      <span className="font-mono text-slate-700">{file}</span>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                      ✓ Encrypted S3
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={handleRunAIAnalysis}
                  disabled={isAnalyzing}
                  className="px-6 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all disabled:opacity-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Sparkles className="w-4 h-4 animate-spin" />
                      <span>Analyzing Clinical Scans...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Generate Kerala Specialist Match</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: MATCHED KERALA CLINICAL DOSSIER */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-[#0E82FD] text-white flex items-center justify-center shrink-0 shadow-md">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0F2042]">AI Clinical Dossier Structured</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    Matched with <strong>Aster Medcity</strong> (Ernakulam) and <strong>Dr. Muralidharan V. Nair</strong> (Director CTVS). Treatment protocol: Off-Pump Beating Heart Bypass with expedited 4-hour medical visa invitation.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block font-bold">Suggested Stay:</span>
                  <strong className="text-slate-800">6 Days Inpatient</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block font-bold">Recovery Window:</span>
                  <strong className="text-slate-800">14 Days Fit-to-Fly</strong>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-slate-500 block font-bold">Nearest Airport:</span>
                  <strong className="text-[#0E82FD]">Cochin Airport (COK)</strong>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-800 text-xs font-bold"
                >
                  Back
                </button>

                <button
                  type="button"
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all"
                >
                  <span>View 3-Tier Kerala Hospital Proposals</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: 3-TIER HOSPITAL PROPOSALS (VALUE / PREMIUM / VIP) */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="text-center space-y-1">
                <h3 className="text-base font-bold text-[#0F2042]">Select Preferred Kerala Care Level</h3>
                <p className="text-xs text-slate-500">Transparent pricing including hospital fees, accommodation & personal coordinator</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Option 1: Platinum VIP */}
                <div className="rounded-2xl bg-blue-50/50 border-2 border-[#0E82FD] p-4 flex flex-col justify-between shadow-md relative">
                  <div className="absolute -top-3 right-3 px-2 py-0.5 rounded-full bg-[#0E82FD] text-white text-[9px] font-bold uppercase">
                    Recommended
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-[#0E82FD] uppercase">Option 1 — Platinum VIP</span>
                    <h4 className="text-sm font-bold text-[#0F2042] mt-1">Aster Medcity Waterfront</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Kochi Backwater Campus</p>
                    
                    <div className="mt-3 pt-3 border-t border-blue-100 space-y-1.5 text-[11px] text-slate-600">
                      <div>✨ <strong>Hospital:</strong> Presidential Waterfront Suite</div>
                      <div>🚗 <strong>Travel:</strong> Airport Chauffeur (Innova Crysta)</div>
                      <div>🏨 <strong>Hotel:</strong> Grand Hyatt Bolgatty 7-Night Stay</div>
                      <div>👩‍⚕️ <strong>Care:</strong> 24/7 Dedicated Concierge</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-blue-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-slate-500">All-Inclusive</span>
                      <span className="text-base font-black text-[#0E82FD]">₹6,50,000 (~$7,400)</span>
                    </div>
                    <button 
                      onClick={handleFinish}
                      className="w-full py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition-colors shadow-md shadow-blue-500/20"
                    >
                      Select & Enter Portal
                    </button>
                  </div>
                </div>

                {/* Option 2: Premium Care */}
                <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Option 2 — Premium Care</span>
                    <h4 className="text-sm font-bold text-[#0F2042] mt-1">Rajagiri Hospital Aluva</h4>
                    <p className="text-[11px] text-slate-500 mt-1">15 mins from Cochin Airport (COK)</p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                      <div>✨ <strong>Hospital:</strong> Private Deluxe Room</div>
                      <div>🚗 <strong>Travel:</strong> Airport Pickup & Transfers</div>
                      <div>🏨 <strong>Hotel:</strong> 5-Night Boutique Recovery Stay</div>
                      <div>👩‍⚕️ <strong>Care:</strong> Hospital Coordinator Desk</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-slate-500">Estimate</span>
                      <span className="text-base font-bold text-[#0F2042]">₹4,75,000 (~$5,400)</span>
                    </div>
                    <button 
                      onClick={handleFinish}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0E82FD] hover:text-white text-slate-700 text-xs font-bold transition-colors"
                    >
                      Select & Enter Portal
                    </button>
                  </div>
                </div>

                {/* Option 3: Ayurveda Post-Recovery */}
                <div className="rounded-2xl bg-white border border-slate-200 p-4 flex flex-col justify-between shadow-sm">
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Option 3 — Ayurveda Convalescence</span>
                    <h4 className="text-sm font-bold text-[#0F2042] mt-1">Arya Vaidya Sala Kottakkal</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Malappuram (Classical Panchakarma)</p>
                    
                    <div className="mt-3 pt-3 border-t border-slate-100 space-y-1.5 text-[11px] text-slate-600">
                      <div>🌿 <strong>Chikitsa:</strong> Authentic Herbal Rehabilitation</div>
                      <div>🚗 <strong>Travel:</strong> Calicut Airport Chauffeur</div>
                      <div>🏡 <strong>Stay:</strong> Medicinal Garden Cottage</div>
                      <div>🥗 <strong>Diet:</strong> Organic Customized Sattvic Meal</div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100">
                    <div className="flex items-baseline justify-between mb-3">
                      <span className="text-xs text-slate-500">21-Day Package</span>
                      <span className="text-base font-bold text-[#0F2042]">₹2,45,000 (~$2,800)</span>
                    </div>
                    <button 
                      onClick={handleFinish}
                      className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0E82FD] hover:text-white text-slate-700 text-xs font-bold transition-colors"
                    >
                      Select & Enter Portal
                    </button>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
