"use client";

import React, { useState, useEffect } from "react";
import { 
  Calendar as CalendarIcon, 
  Video, 
  Clock, 
  Building2, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  X,
  ExternalLink,
  MapPin,
  Calendar
} from "lucide-react";

interface Hospital {
  id: string;
  name: string;
  location: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  hospital: Hospital;
  hospitalId: string;
}

interface Appointment {
  id: string;
  doctor?: Doctor;
  hospital?: Hospital;
  appointmentDate: string;
  type: string;
  status: "CONFIRMED" | "REQUESTED" | "COMPLETED" | "CANCELLED" | "RESCHEDULE_REQUESTED";
  meetLink?: string | null;
  notes?: string | null;
}

export default function PatientAppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "UPCOMING" | "REQUESTED" | "COMPLETED">("ALL");
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  // Form states
  const [selectedDoctorId, setSelectedDoctorId] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("11:00");
  const [consultType, setConsultType] = useState("VIDEO_CONSULTATION");
  const [patientNotes, setPatientNotes] = useState("");

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [apptsRes, docsRes] = await Promise.all([
          fetch("/api/appointments"),
          fetch("/api/doctors?public=true")
        ]);

        if (apptsRes.ok) {
          const apptsData = await apptsRes.json();
          if (apptsData.success) {
            setAppointments(apptsData.appointments || []);
          }
        }

        if (docsRes.ok) {
          const docsData = await docsRes.json();
          if (docsData.success) {
            setDoctors(docsData.doctors || []);
            if (docsData.doctors && docsData.doctors.length > 0) {
              setSelectedDoctorId(docsData.doctors[0].id);
            }
          }
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleRequestAppointment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDoctorId || !selectedDate || !selectedTime) return;
    
    setIsSubmitting(true);

    const selectedDoc = doctors.find(d => d.id === selectedDoctorId);
    if (!selectedDoc) {
      setIsSubmitting(false);
      return;
    }

    // Convert date + time to ISO string
    const isoDateTime = new Date(`${selectedDate}T${selectedTime}:00`).toISOString();

    const payload = {
      doctorId: selectedDoc.id,
      hospitalId: selectedDoc.hospitalId || selectedDoc.hospital?.id || (selectedDoc as any).hospitalName?.replace(/\s+/g, '-').toLowerCase(),
      appointmentDate: isoDateTime,
      type: consultType,
      notes: patientNotes.trim() ? patientNotes.trim() : null
    };

    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error("Failed to create appointment");
      
      const data = await res.json();
      if (data.success) {
        // Optimistically attach relations for immediate UI rendering
        const newApt = {
          ...data.appointment,
          doctor: selectedDoc,
          hospital: { name: (selectedDoc as any).hospitalName || selectedDoc.hospital, location: (selectedDoc as any).city || "Kerala" }
        };
        setAppointments([newApt, ...appointments]);
        setToast("Consultation request submitted! Your clinical coordinator will review and confirm.");
        setShowModal(false);
        setPatientNotes("");
      } else {
        throw new Error(data.error || "Failed");
      }
    } catch (e) {
      console.error(e);
      setToast("An error occurred while submitting the request. Please try again.");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const handleConfirmCancel = async (id: string) => {
    try {
      const res = await fetch("/api/appointments", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "CANCELLED" })
      });
      
      if (!res.ok) throw new Error("Failed to cancel");
      
      const updated = appointments.map((apt) =>
        apt.id === id ? { ...apt, status: "CANCELLED" as const } : apt
      );
      setAppointments(updated);
      setToast("Appointment cancelled successfully.");
    } catch (e) {
      setToast("Failed to cancel appointment. Please try again.");
    } finally {
      setCancelTarget(null);
      setTimeout(() => setToast(null), 4000);
    }
  };

  const filteredAppointments = appointments.filter((apt) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "UPCOMING") return apt.status === "CONFIRMED";
    if (activeTab === "REQUESTED") return apt.status === "REQUESTED";
    if (activeTab === "COMPLETED") return apt.status === "COMPLETED";
    return true;
  });

  const formatDisplayDate = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZoneName: "short"
      }).format(d);
    } catch {
      return isoString;
    }
  };

  const getConsultationTypeLabel = (val: string) => {
    if (val === "VIDEO_CONSULTATION") return "Live Video Consultation";
    if (val === "SECOND_OPINION") return "Second Opinion Case Review";
    if (val === "IN_PERSON_OPD") return "In-Person Hospital OPD Consult";
    return val;
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-800 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-400" />
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
        {isLoading ? (
          <div className="bg-white border border-slate-200 rounded-3xl p-10 text-center">
            <Clock className="w-10 h-10 text-blue-300 mx-auto animate-spin mb-3" />
            <h2 className="text-sm font-bold text-slate-800">Loading appointments...</h2>
          </div>
        ) : filteredAppointments.length === 0 ? (
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
                      <span className="font-mono text-xs font-bold text-blue-600 truncate max-w-[120px]">{apt.id}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs font-semibold text-slate-600">{getConsultationTypeLabel(apt.type)}</span>
                    </div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-0.5">
                      {apt.doctor ? apt.doctor.name : "Unassigned Doctor"}
                    </h2>
                    <div className="text-xs text-slate-500 font-medium flex flex-wrap items-center gap-2 mt-1">
                      <span>{apt.doctor ? apt.doctor.specialty : "General"}</span>
                      <span>•</span>
                      <span className="text-slate-700 font-semibold flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-blue-500" />
                        {apt.hospital ? apt.hospital.name : (apt.doctor as any)?.hospitalName || "Partner Hospital"}
                      </span>
                      <span>•</span>
                      <span className="text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {apt.hospital ? apt.hospital.location : (apt.doctor as any)?.city || "Kerala, India"}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`self-start sm:self-auto px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase shadow-xs ${
                    apt.status === "CONFIRMED"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : apt.status === "REQUESTED" || apt.status === "RESCHEDULE_REQUESTED"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-slate-100 text-slate-600 border border-slate-200"
                  }`}
                >
                  {apt.status.replace("_", " ")}
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
                  <span>{formatDisplayDate(apt.appointmentDate)}</span>
                </div>

                <div className="flex items-center gap-2">
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

                  {(apt.status === "REQUESTED" || apt.status === "RESCHEDULE_REQUESTED") && (
                    <div className="text-amber-700 font-semibold text-[11px] flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 animate-spin" />
                      <span>Awaiting coordinator time slot allocation</span>
                    </div>
                  )}

                  {apt.status === "CONFIRMED" && (
                    <button
                      onClick={() => {
                        // Reschedule stub logic
                        setToast("Reschedule workflow initiated. Please select a new date.");
                        setShowModal(true);
                        // In a real flow, you'd track which ID is being rescheduled
                      }}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold border border-blue-200 transition-all cursor-pointer shrink-0"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Reschedule</span>
                    </button>
                  )}

                  {(apt.status === "CONFIRMED" || apt.status === "REQUESTED" || apt.status === "RESCHEDULE_REQUESTED") && (
                    <button
                      onClick={() => setCancelTarget(apt.id)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold border border-rose-200 transition-all cursor-pointer shrink-0"
                      aria-label={`Cancel appointment ${apt.id}`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Cancel</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cancel Confirmation Dialog */}
      {cancelTarget && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in" role="dialog" aria-modal="true" aria-labelledby="cancel-dialog-title">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl space-y-4 animate-in zoom-in-95">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 id="cancel-dialog-title" className="font-bold text-slate-900 text-sm">Cancel Appointment?</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Are you sure you want to cancel this appointment? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-2">
              <button
                onClick={() => setCancelTarget(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Keep Appointment
              </button>
              <button
                onClick={() => handleConfirmCancel(cancelTarget)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors cursor-pointer"
              >
                Yes, Cancel It
              </button>
            </div>
          </div>
        </div>
      )}

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
                  value={selectedDoctorId}
                  onChange={(e) => setSelectedDoctorId(e.target.value)}
                  required 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium focus:ring-2 focus:ring-[#0E82FD] outline-none"
                >
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.id}>
                      {doc.name} — {doc.specialty} ({(doc as any).hospitalName || (doc.hospital && typeof doc.hospital === 'object' ? doc.hospital.name : doc.hospital)})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Preferred Date *</label>
                  <input 
                    type="date" 
                    required 
                    min={new Date().toISOString().split('T')[0]} // Prevent past dates
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
                    <option value="09:00">09:00 AM</option>
                    <option value="11:00">11:00 AM</option>
                    <option value="14:00">02:00 PM</option>
                    <option value="16:00">04:00 PM</option>
                    <option value="17:00">05:00 PM</option>
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
                  <option value="VIDEO_CONSULTATION">Live Telemedicine Video Consult (Google Meet / Zoom)</option>
                  <option value="SECOND_OPINION">Second Opinion Diagnostic Review</option>
                  <option value="IN_PERSON_OPD">In-Person Hospital OPD Consult in Kerala</option>
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
                  disabled={isSubmitting}
                  className="px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Submitting…" : "Submit Consultation Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
