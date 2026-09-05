"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Video, 
  Clock, 
  Building2, 
  Stethoscope, 
  Plus, 
  CheckCircle2, 
  Download, 
  AlertCircle,
  X,
  Check,
  User,
  ExternalLink,
  MapPin,
  Calendar
} from "lucide-react";

interface Appointment {
  id: string;
  doctor: string;
  specialty: string;
  hospital: string;
  location: string;
  dateTime: string;
  type: string;
  status: "CONFIRMED" | "REQUESTED" | "COMPLETED" | "CANCELLED";
  meetLink?: string;
  notes?: string;
}

const DEFAULT_APPOINTMENTS: Appointment[] = [
  {
    id: "APT-2026-101",
    doctor: "Dr. Vijay Anand",
    specialty: "Chief Orthopedic Surgeon",
    hospital: "Aster Medcity",
    location: "Kochi, Kerala",
    dateTime: "Saturday, Sep 06, 2026 at 14:00 IST",
    type: "Live Video Consultation",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/xyz-maides-101",
    notes: "Pre-operative surgical evaluation and 3D MRI scan review."
  },
  {
    id: "APT-2026-092",
    doctor: "Dr. K. S. Muralidharan",
    specialty: "Chief Robotic Cardiac Surgeon",
    hospital: "Amrita Institute of Medical Sciences",
    location: "Kochi, Kerala",
    dateTime: "Thursday, Aug 28, 2026 at 11:00 IST",
    type: "Initial Telehealth Triage",
    status: "COMPLETED",
    meetLink: "#",
    notes: "Initial consultation concluded. Patient cleared for travel to Kerala."
  }
];

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(DEFAULT_APPOINTMENTS);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "REQUESTED" | "COMPLETED">("ALL");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Form states
  const [selectedDoctor, setSelectedDoctor] = useState("Dr. Vijay Anand (Chief Orthopedics, Aster Medcity)");
  const [selectedDate, setSelectedDate] = useState("2026-09-12");
  const [selectedTime, setSelectedTime] = useState("11:00 IST");
  const [consultType, setConsultType] = useState("Live Telemedicine Video Consult");
  const [patientNotes, setPatientNotes] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("maides_patient_appointments");
      if (stored) {
        try {
          setAppointments(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse appointments", e);
        }
      }
    }
  }, []);

  const saveAppointments = (updated: Appointment[]) => {
    setAppointments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_patient_appointments", JSON.stringify(updated));
    }
  };

  const handleRequestAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let doctorName = "Dr. Vijay Anand";
    let specialty = "Chief Orthopedic Surgeon";
    let hospital = "Aster Medcity";
    let loc = "Kochi, Kerala";

    if (selectedDoctor.includes("Muralidharan")) {
      doctorName = "Dr. K. S. Muralidharan";
      specialty = "Chief Robotic Cardiac Surgeon";
      hospital = "Amrita Institute of Medical Sciences";
    } else if (selectedDoctor.includes("Rajesh")) {
      doctorName = "Dr. Rajesh K.";
      specialty = "Senior Spine Specialist";
      hospital = "Rajagiri Hospital";
    }

    const newApt: Appointment = {
      id: `APT-2026-10${appointments.length + 1}`,
      doctor: doctorName,
      specialty,
      hospital,
      location: loc,
      dateTime: `${selectedDate} at ${selectedTime}`,
      type: consultType,
      status: "REQUESTED",
      meetLink: "https://meet.google.com/pending-approval",
      notes: patientNotes.trim() ? patientNotes.trim() : "Pending coordinator time slot confirmation."
    };

    const updatedList = [newApt, ...appointments];
    saveAppointments(updatedList);

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const adminApt = {
      id: newApt.id,
      patient: "Patient (Portal Request)",
      patientEmail: "patient@medical.travel",
      patientPhone: "+971 50 123 4567",
      patientCountry: "International Patient",
      caseId: `CAS-2026-0${Math.floor(80 + Math.random() * 20)}`,
      specialty: newApt.specialty,
      service: "Specialist Clinical Video Consultation",
      hospital: newApt.hospital,
      doctor: newApt.doctor,
      type: "VIDEO_CONSULTATION",
      dateTime: newApt.dateTime,
      status: "REQUESTED",
      meetLink: newApt.meetLink,
      notes: newApt.notes,
      createdAt: now,
      updatedAt: now,
      consultationFeeUsd: 60,
      consultationFeeInr: 5000,
      history: [
        { status: "REQUESTED", timestamp: now, updatedBy: "Patient Portal" }
      ]
    };

    if (typeof window !== "undefined") {
      const existingAdminAppts = localStorage.getItem("maides_admin_appointments");
      let adminApptList = [];
      if (existingAdminAppts) {
        try { adminApptList = JSON.parse(existingAdminAppts); } catch(e){}
      }
      localStorage.setItem("maides_admin_appointments", JSON.stringify([adminApt, ...adminApptList]));

      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new CustomEvent("maides_appointments_updated"));
      window.dispatchEvent(new CustomEvent("maides_enquiries_updated"));
    }

    try {
      fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminApt)
      }).catch(() => {});
    } catch(e) {}

    setToast("Consultation request submitted! Your clinical coordinator will review and confirm.");
    setShowModal(false);
    setPatientNotes("");
    setTimeout(() => setToast(null), 4000);
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "UPCOMING") return apt.status === "CONFIRMED";
    if (activeTab === "REQUESTED") return apt.status === "REQUESTED";
    if (activeTab === "COMPLETED") return apt.status === "COMPLETED";
    return true;
  });

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2042] to-[#1E3A8A] text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            Telehealth & In-Person Hospital Consultations
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">
            Specialist Consultations & Schedule
          </h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            View scheduled video appointments with Kerala surgeons, check hospital OPD timings, and request new second opinion reviews.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#0E82FD] hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Appointment</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 p-1.5 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-x-auto">
        {[
          { id: "ALL", label: `All Consultations (${appointments.length})` },
          { id: "UPCOMING", label: `Confirmed (${appointments.filter(a => a.status === "CONFIRMED").length})` },
          { id: "REQUESTED", label: `Pending Requests (${appointments.filter(a => a.status === "REQUESTED").length})` },
          { id: "COMPLETED", label: `Past Consults (${appointments.filter(a => a.status === "COMPLETED").length})` }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeTab === tab.id
                ? "bg-[#0E82FD] text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center space-y-3">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto" />
            <h2 className="text-sm font-bold text-slate-800">No appointments found in this view</h2>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              You do not have any consultations listed under this category. Click above to request a new consultation.
            </p>
          </div>
        ) : (
          filteredAppointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border border-slate-200/80 rounded-3xl p-5 sm:p-6 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-4"
            >
              {/* Top Row */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0E82FD] flex items-center justify-center font-bold shrink-0 shadow-xs border border-blue-100">
                    <Video className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{apt.id}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">{apt.type}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">{apt.doctor}</h2>
                    <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2 mt-1">
                      <span>{apt.specialty}</span>
                      <span>•</span>
                      <span className="text-slate-700 font-semibold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        {apt.hospital}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {apt.location}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-auto px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
                    apt.status === "CONFIRMED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : apt.status === "REQUESTED"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              {/* Notes if present */}
              {apt.notes && (
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-600">
                  <span className="font-bold text-slate-700">Clinical Focus / Notes:</span> {apt.notes}
                </div>
              )}

              {/* Bottom Schedule & Action Bar */}
              <div className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-slate-800 font-bold">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>{apt.dateTime}</span>
                </div>

                {apt.status === "CONFIRMED" && apt.meetLink && (
                  <a
                    href={apt.meetLink}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold transition-all shadow-md shadow-blue-500/20 cursor-pointer shrink-0"
                  >
                    <Video className="w-4 h-4" />
                    <span>Join Video Room</span>
                    <ExternalLink className="w-3 h-3 text-blue-200" />
                  </a>
                )}

                {apt.status === "REQUESTED" && (
                  <div className="text-amber-700 font-semibold text-[11px] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 animate-spin" />
                    <span>Awaiting coordinator time slot allocation</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Appointment Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white border border-slate-100 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0E82FD] flex items-center justify-center font-bold">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 leading-tight">Request Specialist Consultation</h3>
                  <p className="text-[11px] text-slate-500">Book telemedicine or in-person review in Kerala</p>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)} 
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Treating Specialist *</label>
                <select 
                  value={selectedDoctor}
                  onChange={(e) => setSelectedDoctor(e.target.value)}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0E82FD] outline-none"
                >
                  <option value="Dr. Vijay Anand (Chief Orthopedics, Aster Medcity)">Dr. Vijay Anand — Chief Orthopedic Surgeon (Aster Medcity, Kochi)</option>
                  <option value="Dr. K. S. Muralidharan (Robotic Cardiac, Amrita)">Dr. K. S. Muralidharan — Chief Cardiac Surgeon (Amrita Hospital, Kochi)</option>
                  <option value="Dr. Rajesh K. (Spine Surgery, Rajagiri)">Dr. Rajesh K. — Senior Spine Surgeon (Rajagiri Hospital, Aluva)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preferred Date *</label>
                  <input 
                    type="date" 
                    required 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0E82FD] outline-none" 
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preferred Time Slot *</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0E82FD] outline-none"
                  >
                    <option value="11:00 IST">Morning Slot (11:00 AM IST / 09:30 AM GST)</option>
                    <option value="14:00 IST">Afternoon Slot (02:00 PM IST / 12:30 PM GST)</option>
                    <option value="17:00 IST">Evening Slot (05:00 PM IST / 03:30 PM GST)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Consultation Mode *</label>
                <select 
                  value={consultType}
                  onChange={(e) => setConsultType(e.target.value)}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0E82FD] outline-none"
                >
                  <option value="Live Video Consultation">Live Telemedicine Video Consult (Google Meet / Zoom)</option>
                  <option value="Second Opinion Case Review">Second Opinion Diagnostic Review</option>
                  <option value="In-Person Hospital OPD Consult">In-Person Hospital OPD Consult in Kerala</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Specific Questions or Symptoms (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. Knee pain persists after physical therapy; looking to discuss robotic total knee replacement surgery."
                  value={patientNotes}
                  onChange={(e) => setPatientNotes(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0E82FD] outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Submit Consultation Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
