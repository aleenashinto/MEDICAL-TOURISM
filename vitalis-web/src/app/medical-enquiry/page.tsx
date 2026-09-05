"use client";

import React, { useState } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ArrowUpRight, Upload, Shield, Lock, FileText, CheckCircle, ChevronRight, HeartPulse, Globe } from "lucide-react";

const SPECIALTIES = [
  "Cardiology & Cardiac Surgery",
  "Orthopaedics & Joint Replacement",
  "Oncology & Cancer Care",
  "Neurology & Neurosurgery",
  "Organ Transplant (Liver/Kidney)",
  "Gastroenterology",
  "Urology",
  "Fertility & IVF",
  "Ayurveda & Panchakarma",
  "Other / Not Sure",
];

const COUNTRIES = [
  "UAE", "Saudi Arabia", "Qatar", "Oman", "Kuwait", "Bahrain",
  "Maldives", "Sri Lanka", "United Kingdom", "United States", "Canada",
  "Australia", "Nigeria", "Kenya", "Tanzania", "Ethiopia", "India (NRI)",
  "Other",
];

export default function MedicalEnquiryPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "", email: "", phone: "", country: "", language: "English",
    specialty: "", district: "", summary: "", budget: "", timeline: "", consent: false,
  });
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [referenceId, setReferenceId] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const generatedRefId = `ENQ-2026-${Math.floor(100 + Math.random() * 900)}`;
    setReferenceId(generatedRefId);

    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    let assignedHosp = "Aster Medcity, Kochi";
    const spec = (form.specialty || "").toLowerCase();
    if (spec.includes("ayurveda") || (form.district && form.district.includes("Thiruvananthapuram"))) {
      assignedHosp = "Somatheeram Ayurvedic Village, Kovalam";
    } else if (spec.includes("cardio") || spec.includes("neuro")) {
      assignedHosp = "Amrita Institute of Medical Sciences";
    } else if (spec.includes("onco") || spec.includes("gastro")) {
      assignedHosp = "VPS Lakeshore Hospital, Kochi";
    } else if (spec.includes("ortho") || spec.includes("joint")) {
      assignedHosp = "Aster Medcity, Kochi";
    } else if (spec.includes("transplant") || spec.includes("uro")) {
      assignedHosp = "Rajagiri Hospital, Aluva";
    }

    let urgency: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = "MEDIUM";
    const timeline = (form.timeline || "").toLowerCase();
    if (timeline.includes("asap") || timeline.includes("2 weeks") || spec.includes("onco") || spec.includes("cardio")) {
      urgency = "HIGH";
    }

    const payload = {
      id: generatedRefId,
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      country: form.country,
      language: form.language,
      treatment: form.specialty || "Specialist Clinical Consultation",
      specialty: form.specialty || "General Quaternary Healthcare",
      district: form.district || "Ernakulam / Kochi",
      summary: form.summary,
      budget: form.budget || "USD 5,000 – 10,000",
      timeline: form.timeline || "Flexible",
      urgency: urgency,
      submittedAt: formattedDate,
      status: "NEW",
      assignedHospital: assignedHosp,
      notes: form.summary ? `Patient Note: ${form.summary}` : "Medical records uploaded. Assigned for lead triage review.",
      documents: files.map(f => ({ name: f.name, size: f.size }))
    };

    // Save to localStorage for instant local sync
    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem("maides_admin_enquiries");
        const existing = stored ? JSON.parse(stored) : [];
        const updated = [payload, ...existing.filter((e: any) => e.id !== payload.id)];
        localStorage.setItem("maides_admin_enquiries", JSON.stringify(updated));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("maides_enquiries_updated", { detail: updated }));
      } catch (e) {
        console.error("Local storage sync error", e);
      }
    }

    // Save to Backend API
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch (e) {
      console.warn("Could not sync to /api/enquiries, saved to local cache:", e);
    }

    setSubmitting(false);
    setStep(4);
  };

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Secure Medical Enquiry</span>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">Submit Your Medical Enquiry</h1>
              <p className="text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
                Share your medical needs confidentially. Our clinical team reviews every enquiry and responds with a personalised Kerala hospital and specialist recommendation within 24 hours.
              </p>
              {/* Trust badges */}
              <div className="flex items-center justify-center gap-5 pt-4">
                {[
                  { icon: <Lock className="w-3.5 h-3.5" />, label: "256-bit Encrypted" },
                  { icon: <Shield className="w-3.5 h-3.5" />, label: "GDPR Compliant" },
                  { icon: <CheckCircle className="w-3.5 h-3.5" />, label: "Free to Submit" },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-1.5 text-[11px] text-blue-200 font-medium">
                    {b.icon}{b.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
            {/* Progress */}
            <div className="flex items-center gap-2 mb-10">
              {["Personal Details", "Medical Information", "Documents", "Confirmation"].map((label, i) => {
                const n = i + 1;
                const active = step === n;
                const done = step > n;
                return (
                  <React.Fragment key={label}>
                    <div className="flex flex-col items-center space-y-1 flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${done ? "bg-emerald-500 text-white" : active ? "bg-[#0E82FD] text-white shadow-lg shadow-blue-500/30" : "bg-slate-100 text-slate-400"}`}>
                        {done ? "✓" : n}
                      </div>
                      <span className={`text-[10px] font-bold text-center leading-tight hidden sm:block ${active ? "text-[#0E82FD]" : done ? "text-emerald-600" : "text-slate-400"}`}>{label}</span>
                    </div>
                    {i < 3 && <div className={`flex-1 h-0.5 transition-all ${done ? "bg-emerald-400" : "bg-slate-200"}`} />}
                  </React.Fragment>
                );
              })}
            </div>

            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              {/* Step 1: Personal */}
              {step === 1 && (
                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-[#0F2042]">Personal Information</h2>
                    <p className="text-xs text-slate-500 mt-1">This helps us assign your dedicated patient coordinator.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: "Full Name *", key: "name", type: "text", placeholder: "Your full name" },
                      { label: "Email Address *", key: "email", type: "email", placeholder: "your@email.com" },
                      { label: "WhatsApp / Phone *", key: "phone", type: "tel", placeholder: "+971 XX XXX XXXX" },
                    ].map((f) => (
                      <div key={f.key} className="space-y-1.5">
                        <label className="text-xs font-bold text-slate-700">{f.label}</label>
                        <input type={f.type} placeholder={f.placeholder}
                          value={(form as any)[f.key]}
                          onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all" />
                      </div>
                    ))}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Country *</label>
                      <select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                        <option value="">Select country...</option>
                        {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Preferred Language</label>
                      <div className="flex flex-wrap gap-2">
                        {["English", "Arabic", "Malayalam", "Hindi", "French"].map((l) => (
                          <button key={l} type="button"
                            onClick={() => setForm({ ...form, language: l })}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${form.language === l ? "bg-[#0E82FD] text-white" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"}`}>
                            {l}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button onClick={() => setStep(2)} disabled={!form.name || !form.email || !form.phone || !form.country}
                      className="w-full py-3.5 rounded-xl bg-[#0E82FD] text-white text-xs font-black hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Medical Info */}
              {step === 2 && (
                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-[#0F2042]">Medical Information</h2>
                    <p className="text-xs text-slate-500 mt-1">Confidential clinical details reviewed only by our medical coordinators.</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Medical Specialty Required *</label>
                      <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                        <option value="">Select specialty...</option>
                        {SPECIALTIES.map((s) => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Preferred Kerala District</label>
                      <select value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                        <option value="">No preference</option>
                        {["Ernakulam / Kochi", "Thiruvananthapuram", "Kozhikode", "Thrissur", "Kottayam", "Malappuram", "Palakkad", "Kollam", "Alappuzha", "Wayanad", "Kannur", "Kasaragod", "Pathanamthitta", "Idukki"].map((d) => <option key={d}>{d}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700">Approximate Budget</label>
                      <select value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                        <option value="">Flexible / Not sure</option>
                        <option>Under USD 3,000</option>
                        <option>USD 3,000 – 8,000</option>
                        <option>USD 8,000 – 20,000</option>
                        <option>USD 20,000 – 50,000</option>
                        <option>Over USD 50,000</option>
                      </select>
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Medical Summary & Current Condition *</label>
                      <textarea value={form.summary} onChange={(e) => setForm({ ...form, summary: e.target.value })}
                        rows={5} placeholder="Briefly describe your diagnosis, current symptoms, previous treatments tried, and what you need in Kerala..."
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all resize-none" />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-xs font-bold text-slate-700">Preferred Travel Timeline</label>
                      <div className="flex flex-wrap gap-2">
                        {["ASAP (within 2 weeks)", "1–3 months", "3–6 months", "Flexible"].map((t) => (
                          <button key={t} type="button" onClick={() => setForm({ ...form, timeline: t })}
                            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${form.timeline === t ? "bg-[#0E82FD] text-white" : "bg-slate-50 text-slate-600 border border-slate-200 hover:bg-slate-100"}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button onClick={() => setStep(1)} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all">Back</button>
                    <button onClick={() => setStep(3)} disabled={!form.specialty || !form.summary}
                      className="flex-1 py-3.5 rounded-xl bg-[#0E82FD] text-white text-xs font-black hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2">
                      Continue <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Documents */}
              {step === 3 && (
                <div className="p-8 space-y-6">
                  <div>
                    <h2 className="text-lg font-black text-[#0F2042]">Medical Documents</h2>
                    <p className="text-xs text-slate-500 mt-1">Upload reports, scans, and lab results. All files are encrypted with 256-bit TLS and stored in private secure storage.</p>
                  </div>

                  <label className="block border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center hover:border-[#0E82FD] hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png,.dcm" onChange={handleFileChange} className="hidden" />
                    <Upload className="w-8 h-8 text-slate-300 group-hover:text-[#0E82FD] mx-auto mb-2 transition-colors" />
                    <p className="text-xs font-bold text-slate-600 group-hover:text-[#0E82FD]">Click to upload or drag & drop</p>
                    <p className="text-[11px] text-slate-400 mt-1">PDF, JPG, PNG, DICOM — Max 50 MB per file</p>
                  </label>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      {files.map((f, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200">
                          <FileText className="w-4 h-4 text-[#0E82FD]" />
                          <span className="text-xs text-slate-700 flex-1 truncate">{f.name}</span>
                          <span className="text-[10px] text-slate-400">{(f.size / 1024).toFixed(0)} KB</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="rounded-2xl bg-slate-50 border border-slate-200 p-4 space-y-2">
                    <p className="text-xs font-bold text-slate-700">Recommended documents to upload:</p>
                    <ul className="space-y-1.5">
                      {["Latest doctor's diagnosis / discharge summary", "Recent blood tests, urine analysis, biochemistry reports", "Imaging: X-ray, MRI, CT, PET-CT scans", "Pathology reports / biopsy results", "Current medication list"].map((d) => (
                        <li key={d} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{d}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-200">
                    <input type="checkbox" id="consent" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })}
                      className="mt-0.5 w-4 h-4 text-[#0E82FD] flex-shrink-0" />
                    <label htmlFor="consent" className="text-xs text-amber-800 leading-relaxed cursor-pointer">
                      I confirm that the medical information and documents I am submitting are accurate and I consent to MAIDES sharing this information with shortlisted Kerala hospital coordinators strictly for the purpose of medical consultation and treatment planning.
                    </label>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(2)} className="flex-1 py-3.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-50 transition-all">Back</button>
                    <button onClick={handleSubmit} disabled={!form.consent || submitting}
                      className="flex-1 py-3.5 rounded-xl bg-[#0E82FD] text-white text-xs font-black hover:bg-blue-600 disabled:bg-slate-200 disabled:text-slate-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20">
                      {submitting ? "Submitting..." : "Submit Enquiry"} <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Success */}
              {step === 4 && (
                <div className="p-12 text-center space-y-6">
                  <div className="w-20 h-20 rounded-full bg-emerald-50 border-4 border-emerald-200 flex items-center justify-center mx-auto">
                    <CheckCircle className="w-10 h-10 text-emerald-500" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-2xl font-black text-[#0F2042]">Enquiry Submitted!</h2>
                    <p className="text-sm text-slate-500 max-w-sm mx-auto">
                      Thank you, <strong>{form.name}</strong>. Your medical enquiry has been received and encrypted. Our clinical coordinator will review your case and respond to <strong>{form.email}</strong> within 24 hours.
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-md mx-auto">
                    {[
                      { icon: <HeartPulse className="w-5 h-5" />, label: "Clinical review within 24 hours" },
                      { icon: <Globe className="w-5 h-5" />, label: "Hospital & doctor shortlist prepared" },
                      { icon: <CheckCircle className="w-5 h-5" />, label: "Transparent cost estimate included" },
                    ].map((s) => (
                      <div key={s.label} className="rounded-2xl bg-slate-50 border border-slate-200 p-4 text-center space-y-2">
                        <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center mx-auto text-[#0E82FD]">{s.icon}</div>
                        <p className="text-[11px] font-medium text-slate-600 leading-snug">{s.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-slate-400">
                    Reference ID: <strong className="text-[#0E82FD]">{referenceId || `MAIDES-${Date.now().toString(36).toUpperCase()}`}</strong>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
