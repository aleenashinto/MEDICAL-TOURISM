"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { KERALA_DOCTORS } from "@/lib/mockData";
import { 
  Search, 
  Star, 
  Video, 
  Filter, 
  MapPin, 
  BookOpen, 
  ChevronRight,
  Stethoscope,
  Building2,
  Calendar,
  Clock,
  ShieldCheck,
  CheckCircle2,
  X,
  UserCheck,
  Award,
  Sparkles,
  ArrowUpRight
} from "lucide-react";

const SPECIALTIES = ["All", "Cardiology", "Orthopaedics", "Neurology", "Ayurveda & Wellness", "Oncology", "Gastroenterology", "Urology"];

export default function DoctorsPage() {
  const [query, setQuery] = useState("");
  const [specialty, setSpecialty] = useState("All");
  const [doctorsList, setDoctorsList] = useState<any[]>(KERALA_DOCTORS);
  const [selectedDoctorForBooking, setSelectedDoctorForBooking] = useState<any | null>(null);

  // Appointment Modal Form States
  const [patientName, setPatientName] = useState("");
  const [patientEmail, setPatientEmail] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientCountry, setPatientCountry] = useState("International Patient");
  const [preferredDate, setPreferredDate] = useState("2026-09-15");
  const [consultType, setConsultType] = useState<"VIDEO_CONSULTATION" | "SECOND_OPINION_TELEHEALTH" | "IN_PERSON_SURGICAL_CONSULT">("VIDEO_CONSULTATION");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const extractUsdFee = (feeStr?: string | number): number => {
    if (typeof feeStr === "number") return feeStr;
    if (!feeStr) return 60;
    const match = String(feeStr).match(/\$\s*(\d+)/);
    if (match) return parseInt(match[1]);
    const num = parseInt(String(feeStr).replace(/[^0-9]/g, ''));
    if (!num) return 60;
    return num > 1000 ? Math.round(num / 84) : num;
  };

  // Load from Admin Doctors storage or fallback to mock data
  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const res = await fetch("/api/doctors?public=true");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.doctors) && data.doctors.length > 0) {
            const formattedDocs = data.doctors.map((d: any, idx: number) => ({
              id: d.id || `admin-doc-${idx}`,
              name: d.name,
              title: d.title || "Senior Medical Consultant",
              specialty: d.specialty || "Medical Specialty",
              subSpecialty: d.bio || d.fullBiography || "Specialist clinical care and patient consultation.",
              qualifications: d.education || d.qualifications || d.certifications || "MBBS, MS, Board Certified",
              experienceYears: typeof d.experienceYears === "number" ? d.experienceYears : (parseInt(d.experience) || 15),
              hospitalName: d.hospital || d.hospitalName || "Aster Medcity, Kochi",
              city: d.city || (d.hospital?.includes("Kovalam") ? "Kovalam, Kerala" : d.hospital?.includes("Trivandrum") ? "Thiruvananthapuram, Kerala" : d.hospital?.includes("Calicut") ? "Kozhikode, Kerala" : "Kochi, Kerala"),
              avatar: d.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
              rating: d.rating || "4.95",
              reviewCount: d.casesHandled || 1420,
              languages: Array.isArray(d.languages) ? d.languages : (typeof d.languages === "string" ? d.languages.split(",").map((l: string) => l.trim()) : (d.languages || ["English", "Hindi", "Malayalam"])),
              consultationFeeUSD: extractUsdFee(d.consultationFee || d.consultationFeeUsd || d.consultationFeeInr),
              nextAvailableDate: "Tomorrow",
              videoConsultationAvailable: true,
              publicationsCount: 12,
              areasOfExpertise: ["Clinical Diagnostics", "Advanced Surgery", "Patient Care"],
              displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : (Number(d.displayOrder) || (idx + 1))
            }));

            formattedDocs.sort((a: any, b: any) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
            setDoctorsList(formattedDocs);
            return;
          }
        }
      } catch (err) {
        // Fallback to storage
      }

      try {
        const stored = typeof window !== "undefined" ? localStorage.getItem("maides_admin_doctors") : null;
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const formattedAdminDocs = parsed
              .filter((d: any) => {
                const s = (d.status || "ACTIVE").toUpperCase();
                const p = (d.published || "PUBLISHED").toUpperCase();
                return s === "ACTIVE" && p === "PUBLISHED";
              })
              .map((d: any, idx: number) => ({
                id: d.id || `admin-doc-${idx}`,
                name: d.name,
                title: d.title || "Senior Medical Consultant",
                specialty: d.specialty || "Medical Specialty",
                subSpecialty: d.bio || d.fullBiography || "Specialist clinical care and patient consultation.",
                qualifications: d.education || d.qualifications || d.certifications || "MBBS, MS, Board Certified",
                experienceYears: typeof d.experienceYears === "number" ? d.experienceYears : (parseInt(d.experience) || 15),
                hospitalName: d.hospital || d.hospitalName || "Aster Medcity, Kochi",
                city: d.city || (d.hospital?.includes("Kovalam") ? "Kovalam, Kerala" : d.hospital?.includes("Trivandrum") ? "Thiruvananthapuram, Kerala" : d.hospital?.includes("Calicut") ? "Kozhikode, Kerala" : "Kochi, Kerala"),
                avatar: d.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
                rating: d.rating || "4.95",
                reviewCount: d.casesHandled || 1420,
                languages: Array.isArray(d.languages) ? d.languages : (typeof d.languages === "string" ? d.languages.split(",").map((l: string) => l.trim()) : (d.languages || ["English", "Hindi", "Malayalam"])),
                consultationFeeUSD: extractUsdFee(d.consultationFee || d.consultationFeeUsd || d.consultationFeeInr),
                nextAvailableDate: "Tomorrow",
                videoConsultationAvailable: true,
                publicationsCount: 12,
                areasOfExpertise: ["Clinical Diagnostics", "Advanced Surgery", "Patient Care"],
                displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : (Number(d.displayOrder) || (idx + 1))
              }));

            if (formattedAdminDocs.length > 0) {
              formattedAdminDocs.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
              setDoctorsList(formattedAdminDocs);
            } else {
              setDoctorsList(KERALA_DOCTORS);
            }
          } else {
            setDoctorsList(KERALA_DOCTORS);
          }
        } else {
          setDoctorsList(KERALA_DOCTORS);
        }
      } catch (e) {
        setDoctorsList(KERALA_DOCTORS);
      }
    };

    loadDoctors();
    window.addEventListener("storage", loadDoctors);
    window.addEventListener("maides_doctors_updated", loadDoctors);
    return () => {
      window.removeEventListener("storage", loadDoctors);
      window.removeEventListener("maides_doctors_updated", loadDoctors);
    };
  }, []);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim() || !patientEmail.trim() || !selectedDoctorForBooking) return;

    setIsSubmitting(true);

    const apptId = "APT-" + Math.floor(1000 + Math.random() * 9000);
    const newAppt = {
      id: apptId,
      patient: patientName.trim(),
      caseId: "CAS-2026-0" + Math.floor(85 + Math.random() * 10),
      doctor: `${selectedDoctorForBooking.name} (${selectedDoctorForBooking.specialty})`,
      hospital: selectedDoctorForBooking.hospitalName || "Aster Medcity, Kochi",
      type: consultType,
      dateTime: `${preferredDate} 11:00 IST`,
      status: "REQUESTED",
      meetLink: `https://vitalis.health/meet/apt-${Math.floor(100 + Math.random() * 900)}`,
      notes: `Public website booking: ${notes.trim() || "Consultation request"} (Contact: ${patientPhone || "N/A"})`
    };

    const newEnquiry = {
      id: "ENQ-" + Math.floor(1000 + Math.random() * 9000),
      name: patientName.trim(),
      email: patientEmail.trim(),
      phone: patientPhone.trim() || "+971 50 123 4567",
      country: patientCountry.trim() || "International Patient",
      treatment: `${selectedDoctorForBooking.specialty} Consultation with ${selectedDoctorForBooking.name}`,
      budget: "$5,000",
      urgency: "HIGH",
      submittedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: "NEW",
      assignedHospital: selectedDoctorForBooking.hospitalName || "Aster Medcity, Kochi",
      notes: `Direct doctor consultation booking request for ${preferredDate}`
    };

    if (typeof window !== "undefined") {
      // 1. Sync to Admin Appointments
      const existingAppts = localStorage.getItem("maides_admin_appointments");
      let apptArr = [];
      if (existingAppts) {
        try { apptArr = JSON.parse(existingAppts); } catch (err) {}
      }
      localStorage.setItem("maides_admin_appointments", JSON.stringify([newAppt, ...apptArr]));

      // 2. Sync to Admin Enquiries
      const existingEnqs = localStorage.getItem("maides_admin_enquiries");
      let enqArr = [];
      if (existingEnqs) {
        try { enqArr = JSON.parse(existingEnqs); } catch (err) {}
      }
      localStorage.setItem("maides_admin_enquiries", JSON.stringify([newEnquiry, ...enqArr]));

      // 3. Dispatch global live events
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("maides_appointments_updated"));
      window.dispatchEvent(new CustomEvent("maides_enquiries_updated"));
    }

    // 4. Server API POST sync
    try {
      fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppt)
      }).catch(() => {});
      
      fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEnquiry)
      }).catch(() => {});
    } catch (e) {}

    setIsSubmitting(false);
    setSelectedDoctorForBooking(null);
    setToast(`Consultation request submitted with ${selectedDoctorForBooking.name}! Our medical team will confirm your slot within 2 hours.`);
    setPatientName("");
    setPatientEmail("");
    setPatientPhone("");
    setNotes("");
    setTimeout(() => setToast(null), 6000);
  };

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => {
        const filtered = doctorsList.filter((d) => {
          const q = query.toLowerCase().trim();
          const matchesSearch =
            q === "" ||
            d.name.toLowerCase().includes(q) ||
            d.specialty.toLowerCase().includes(q) ||
            (d.hospitalName && d.hospitalName.toLowerCase().includes(q)) ||
            (d.subSpecialty && d.subSpecialty.toLowerCase().includes(q)) ||
            (d.qualifications && d.qualifications.toLowerCase().includes(q));

          const dSpec = (d.specialty || "").toLowerCase();
          const matchesSpec =
            specialty === "All" ||
            dSpec.includes(specialty.toLowerCase()) ||
            (specialty === "Cardiology" && (dSpec.includes("cardio") || dSpec.includes("heart") || dSpec.includes("vascular"))) ||
            (specialty === "Orthopaedics" && (dSpec.includes("ortho") || dSpec.includes("joint") || dSpec.includes("spine") || dSpec.includes("bone"))) ||
            (specialty === "Neurology" && (dSpec.includes("neuro") || dSpec.includes("brain") || dSpec.includes("spine"))) ||
            (specialty.includes("Ayurveda") && (dSpec.includes("ayurved") || dSpec.includes("panchakarma") || dSpec.includes("wellness"))) ||
            (specialty === "Oncology" && (dSpec.includes("onco") || dSpec.includes("cancer") || dSpec.includes("tumor"))) ||
            (specialty === "Gastroenterology" && (dSpec.includes("gastro") || dSpec.includes("liver") || dSpec.includes("gi"))) ||
            (specialty === "Urology" && (dSpec.includes("uro") || dSpec.includes("nephro") || dSpec.includes("kidney")));

          return matchesSearch && matchesSpec;
        });

        return (
          <div className="min-h-screen relative">
            {/* Toast Notification */}
            {toast && (
              <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-emerald-500 max-w-md">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <span className="text-xs font-bold leading-relaxed">{toast}</span>
              </div>
            )}

            {/* Hero */}
            <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
              <div className="max-w-7xl mx-auto space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-200">
                    Accredited Specialist Doctors in Kerala
                  </span>
                  <Link
                    href="/admin/doctors"
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold text-white border border-white/20 transition-all"
                  >
                    <span>Admin Faculty Management</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
                
                <h1 className="text-4xl sm:text-5xl font-black leading-tight">
                  Kerala's Leading<br />Medical Specialists & Surgeons
                </h1>
                <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                  Internationally trained consultants, board-certified robotic surgeons, and Ashtavaidya Ayurvedic physicians across Kerala's top-ranked JCI and NABH accredited hospitals.
                </p>
                
                <div className="flex items-center max-w-xl bg-white rounded-2xl shadow-xl overflow-hidden mt-6">
                  <div className="pl-4 text-slate-400"><Search className="w-4 h-4" /></div>
                  <input
                    type="text"
                    placeholder="Search by doctor name, specialty, hospital..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1 px-4 py-3.5 text-xs text-slate-800 focus:outline-none"
                  />
                  <button onClick={onOpenIntake} className="m-1.5 px-4 py-2.5 rounded-xl bg-[#0E82FD] text-white text-xs font-bold whitespace-nowrap hover:bg-blue-600 transition-all">
                    Get Matched
                  </button>
                </div>
              </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
              {/* Specialty filters */}
              <div className="flex flex-wrap gap-2 items-center">
                <Filter className="w-4 h-4 text-slate-400" />
                {SPECIALTIES.map((s) => (
                  <button 
                    key={s} 
                    onClick={() => setSpecialty(s)} 
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      specialty === s ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="text-xs text-slate-500">
                <strong className="text-[#0E82FD]">{filtered.length}</strong> specialist{filtered.length !== 1 ? "s" : ""} available for consultation
              </div>

              {/* Doctor cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6">
                {filtered.map((d) => (
                  <div key={d.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group flex flex-col justify-between">
                    <div>
                      <div className="p-6 flex gap-5">
                        {/* Avatar */}
                        <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-4 border-white shadow-lg bg-slate-100">
                          <img src={d.avatar} alt={d.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-black text-[#0F2042] group-hover:text-[#0E82FD] transition-colors leading-tight">
                              {d.name}
                            </h3>
                            <div className="flex items-center gap-1 flex-shrink-0 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
                              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                              <span className="text-xs font-black text-slate-800">{d.rating}</span>
                            </div>
                          </div>
                          <p className="text-[11px] font-bold text-[#0E82FD]">{d.specialty}</p>
                          <p className="text-[11px] text-slate-600 font-medium line-clamp-1">{d.title}</p>
                          <p className="text-[10px] text-slate-400 font-medium">{d.qualifications}</p>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-0.5">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span>{d.hospitalName} · {d.city || "Kerala, India"}</span>
                          </div>
                        </div>
                      </div>

                      <div className="px-6 pb-3 space-y-3">
                        {/* Sub-specialty / Bio */}
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">{d.subSpecialty}</p>

                        {/* Stats row */}
                        <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span className="font-semibold text-slate-700">{d.experienceYears}+ years experience</span>
                          <span className="flex items-center gap-1 text-emerald-600 font-bold">
                            <Video className="w-3.5 h-3.5" />
                            Telehealth Ready
                          </span>
                        </div>

                        {/* Languages */}
                        <div className="flex flex-wrap gap-1 pt-0.5">
                          {d.languages && d.languages.map((l: string) => (
                            <span key={l} className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                              {l}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-5 border-t border-slate-100 pt-4 flex items-center justify-between bg-slate-50/50">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">Consultation Fee</div>
                        <div className="text-xs font-bold text-slate-800">
                          ${d.consultationFeeUSD || 60} (₹{(d.consultationFeeUSD || 60) * 84})
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedDoctorForBooking(d)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E82FD] text-white text-xs font-bold hover:bg-blue-600 transition-all shadow-sm shadow-blue-500/20 active:scale-95 cursor-pointer"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Book Consultation</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 text-center space-y-4 shadow-xl">
                <h2 className="text-2xl sm:text-3xl font-black">Need a personalized doctor recommendation?</h2>
                <p className="text-sm text-blue-100 max-w-lg mx-auto">
                  Our international clinical triage team will review your medical scans and connect you with the top Kerala specialist for your procedure.
                </p>
                <button onClick={onOpenIntake} className="inline-flex items-center space-x-2 px-6 py-3 rounded-full bg-white text-[#0F2042] font-bold text-xs uppercase tracking-wider hover:bg-blue-50 transition-all shadow-lg cursor-pointer">
                  <span>Get Clinical Recommendation</span>
                </button>
              </div>
            </div>

            {/* Direct Doctor Appointment Booking Modal */}
            {selectedDoctorForBooking && (
              <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95">
                  <button
                    onClick={() => setSelectedDoctorForBooking(null)}
                    className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-[#0E82FD]">
                      <Stethoscope className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Book Consultation with {selectedDoctorForBooking.name}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedDoctorForBooking.specialty} · {selectedDoctorForBooking.hospitalName}
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleBookSubmit} className="space-y-4 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Your Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mohammed Al-Fassi / Sarah Jenkins"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          placeholder="patient@email.com"
                          value={patientEmail}
                          onChange={(e) => setPatientEmail(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">WhatsApp / Phone *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+971 50 123 4567"
                          value={patientPhone}
                          onChange={(e) => setPatientPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Country of Origin</label>
                        <input
                          type="text"
                          placeholder="United Arab Emirates / UK"
                          value={patientCountry}
                          onChange={(e) => setPatientCountry(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                        />
                      </div>
                      <div>
                        <label className="block font-bold text-slate-700 mb-1">Preferred Date *</label>
                        <input
                          type="date"
                          required
                          value={preferredDate}
                          onChange={(e) => setPreferredDate(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Consultation Mode</label>
                      <select
                        value={consultType}
                        onChange={(e) => setConsultType(e.target.value as any)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                      >
                        <option value="VIDEO_CONSULTATION">Live Video Consultation (Telemedicine)</option>
                        <option value="SECOND_OPINION_TELEHEALTH">Second Opinion Case Review</option>
                        <option value="IN_PERSON_SURGICAL_CONSULT">In-Person Hospital Visit (Kerala)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">Medical Condition / Symptoms Brief</label>
                      <textarea
                        rows={3}
                        placeholder="Please describe symptoms, prior diagnoses, or treatment goals..."
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                      />
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedDoctorForBooking(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50"
                      >
                        {isSubmitting ? "Submitting..." : "Confirm & Send to Admin"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        );
      }}
    </PublicPageLayout>
  );
}

