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
  AlertCircle
} from "lucide-react";

export default function PatientAppointmentsPage() {
  const appointments = [
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
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Consultations & Specialist Appointments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access secure telemedicine video links and in-person hospital consult schedules.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Request New Appointment
        </button>
      </div>

      <div className="space-y-4">
        {appointments.map((apt) => (
          <div
            key={apt.id}
            className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm hover:border-slate-300 transition-all space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-slate-900">{apt.doctor}</h2>
                  <div className="text-xs text-slate-500">{apt.specialty} • {apt.hospital}</div>
                </div>
              </div>

              <span
                className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  apt.status === "CONFIRMED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {apt.status}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>{apt.dateTime}</span>
              </div>

              {apt.status === "CONFIRMED" && (
                <a
                  href={apt.meetLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-all shadow-sm"
                >
                  <Video className="w-3.5 h-3.5" />
                  Join Video Room
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
