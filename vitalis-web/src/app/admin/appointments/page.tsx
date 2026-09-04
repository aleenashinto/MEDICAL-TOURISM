"use client";

import React, { useState } from "react";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Building2, 
  Stethoscope, 
  Plus, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ExternalLink
} from "lucide-react";

export default function AppointmentsAdminPage() {
  const [filter, setFilter] = useState("ALL");

  const appointments = [
    {
      id: "APT-2026-101",
      patient: "Sarah Jenkins",
      caseId: "CAS-2026-089",
      doctor: "Dr. Vijay Anand",
      hospital: "Aster Medcity, Kochi",
      type: "VIDEO_CONSULTATION",
      dateTime: "2026-09-06 14:00 IST",
      status: "CONFIRMED",
      meetLink: "https://vitalis.health/meet/apt-101",
    },
    {
      id: "APT-2026-102",
      patient: "Mohammed Al-Maktoum",
      caseId: "CAS-2026-088",
      doctor: "Dr. K. S. Muralidharan",
      hospital: "Amrita Institute",
      type: "SECOND_OPINION_TELEHEALTH",
      dateTime: "2026-09-07 11:30 IST",
      status: "REQUESTED",
      meetLink: "Pending Approval",
    },
    {
      id: "APT-2026-103",
      patient: "David Miller",
      caseId: "CAS-2026-087",
      doctor: "Dr. Rajesh K.",
      hospital: "Rajagiri Hospital",
      type: "IN_PERSON_SURGICAL_CONSULT",
      dateTime: "2026-09-08 09:00 IST",
      status: "CONFIRMED",
      meetLink: "Room 304, OPD Tower",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Specialist Appointments & Telemedicine Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Coordinate video consultations, cross-border second opinions, and in-person hospital consultations.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Schedule Consultation
        </button>
      </div>

      {/* Appointments List */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Appointment & Date</th>
                <th className="py-3 px-4">Patient & Case</th>
                <th className="py-3 px-4">Doctor & Hospital</th>
                <th className="py-3 px-4">Consultation Mode</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {appointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{apt.dateTime}</div>
                    <div className="text-[11px] text-blue-400 font-mono">{apt.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{apt.patient}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{apt.caseId}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300 font-medium">{apt.doctor}</div>
                    <div className="text-[11px] text-blue-400">{apt.hospital}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="flex items-center gap-1 text-slate-300 text-[11px]">
                      {apt.type.includes("VIDEO") || apt.type.includes("TELEHEALTH") ? (
                        <Video className="w-3.5 h-3.5 text-blue-400" />
                      ) : (
                        <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      {apt.type.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        apt.status === "CONFIRMED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white font-medium text-[11px] transition-all">
                      Manage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
