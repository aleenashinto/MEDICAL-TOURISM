"use client";

import React, { useState } from "react";
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
  Check
} from "lucide-react";

export default function PatientAppointmentsPage() {
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const [appointments, setAppointments] = useState([
    {
      id: "APT-2026-101",
      doctor: "Dr. Vijay Anand",
      specialty: "Chief Orthopedic Surgeon",
      hospital: "Aster Medcity, Kochi",
      dateTime: "Saturday, Sep 06, 2026 at 14:00 IST",
      type: "VIDEO_CONSULTATION",
      status: "CONFIRMED",
      meetLink: "https://vitalis.health/meet/apt-101",
    },
    {
      id: "APT-2026-092",
      doctor: "Dr. Vijay Anand",
      specialty: "Chief Orthopedic Surgeon",
      hospital: "Aster Medcity, Kochi",
      dateTime: "Thursday, Aug 28, 2026 at 11:00 IST",
      type: "INITIAL_TELEHEALTH_TRIAGE",
      status: "COMPLETED",
      meetLink: "#",
    },
  ]);

  const handleRequestAppointment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const doctor = (form.elements.namedItem("doctor") as HTMLSelectElement).value;
    const date = (form.elements.namedItem("date") as HTMLInputElement).value;
    const type = (form.elements.namedItem("type") as HTMLSelectElement).value;

    const newApt = {
      id: `APT-2026-10${appointments.length + 1}`,
      doctor: doctor.includes("Vijay") ? "Dr. Vijay Anand" : "Dr. K. S. Muralidharan",
      specialty: doctor.includes("Vijay") ? "Chief Orthopedic Surgeon" : "Chief Cardiac Surgeon",
      hospital: "Aster Medcity, Kochi",
      dateTime: `${date} at 11:00 IST`,
      type,
      status: "REQUESTED",
      meetLink: "https://vitalis.health/meet/pending",
    };

    setAppointments(prev => [newApt, ...prev]);
    setToast("Consultation request submitted! Your coordinator will confirm the time slot.");
    setShowModal(false);
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header with clear layout spacing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Consultations & Specialist Appointments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Access secure telemedicine video links and in-person hospital consult schedules in Kerala.
          </p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Request New Appointment</span>
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all space-y-4"
          >
            {/* Top Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">{apt.doctor}</h2>
                  <div className="text-xs text-slate-500 font-medium">{apt.specialty} • <span className="text-blue-600 font-semibold">{apt.hospital}</span></div>
                </div>
              </div>

              <span
                className={`self-start sm:self-auto px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                  apt.status === "CONFIRMED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : apt.status === "REQUESTED"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {apt.status}
              </span>
            </div>

            {/* Bottom Row */}
            <div className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{apt.dateTime}</span>
              </div>

              {apt.status === "CONFIRMED" && (
                <a
                  href={apt.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold transition-all shadow-xs cursor-pointer"
                >
                  <Video className="w-4 h-4" />
                  <span>Join Video Room</span>
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Appointment Request Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Request Specialist Consultation</h3>
              <button onClick={() => setShowModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestAppointment} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Select Treating Doctor</label>
                <select name="doctor" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium">
                  <option value="Dr. Vijay Anand (Chief Orthopedics)">Dr. Vijay Anand (Chief Orthopedics, Aster Medcity)</option>
                  <option value="Dr. K. S. Muralidharan (Cardiac Surgery)">Dr. K. S. Muralidharan (Robotic Cardiac, Amrita)</option>
                  <option value="Dr. Rajesh K. (Spine Surgery)">Dr. Rajesh K. (Spine Surgery, Rajagiri)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Preferred Date</label>
                <input name="date" type="date" required defaultValue="2026-09-12" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium" />
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Consultation Mode</label>
                <select name="type" required className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-medium">
                  <option value="VIDEO_CONSULTATION">Live Telemedicine Video Consult</option>
                  <option value="SECOND_OPINION_TELEHEALTH">Second Opinion Case Review</option>
                  <option value="IN_PERSON_SURGICAL_CONSULT">In-Person OPD Hospital Consult</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold rounded-xl shadow-md"
                >
                  Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
