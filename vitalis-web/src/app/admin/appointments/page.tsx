"use client";

import React, { useState, useEffect } from "react";
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
  ExternalLink,
  Eye,
  Edit,
  Trash2,
  X,
  Filter,
  User,
  HeartPulse,
  CalendarCheck2,
  AlertTriangle
} from "lucide-react";

interface AppointmentItem {
  id: string;
  patient: string;
  caseId: string;
  doctor: string;
  hospital: string;
  type: "VIDEO_CONSULTATION" | "SECOND_OPINION_TELEHEALTH" | "IN_PERSON_SURGICAL_CONSULT" | "POST_OP_FOLLOWUP";
  dateTime: string;
  status: "CONFIRMED" | "REQUESTED" | "COMPLETED" | "CANCELLED";
  meetLink: string;
  notes: string;
}

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: "APT-2026-101",
    patient: "Sarah Jenkins",
    caseId: "CAS-2026-089",
    doctor: "Dr. Vijay Anand (Orthopaedics)",
    hospital: "Aster Medcity, Kochi",
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-10 14:00 IST",
    status: "CONFIRMED",
    meetLink: "https://vitalis.health/meet/apt-101",
    notes: "Pre-admission knee joint review and surgical navigation protocol briefing."
  },
  {
    id: "APT-2026-102",
    patient: "Mohammed Al-Maktoum",
    caseId: "CAS-2026-088",
    doctor: "Dr. K. S. Muralidharan (Cardiology)",
    hospital: "Amrita Institute of Medical Sciences",
    type: "SECOND_OPINION_TELEHEALTH",
    dateTime: "2026-09-14 11:30 IST",
    status: "CONFIRMED",
    meetLink: "https://vitalis.health/meet/apt-102",
    notes: "Review of cardiac catheterization and DaVinci robotic valve repair plan."
  },
  {
    id: "APT-2026-103",
    patient: "Elena Rostova",
    caseId: "CAS-2026-085",
    doctor: "Dr. Arya Varma (Ayurveda)",
    hospital: "Somatheeram Ayurvedic Village, Kovalam",
    type: "POST_OP_FOLLOWUP",
    dateTime: "2026-09-12 16:00 IST",
    status: "CONFIRMED",
    meetLink: "https://vitalis.health/meet/apt-103",
    notes: "Post-rejuvenation dietary schedule and herbal replenishment dispatch."
  },
  {
    id: "APT-2026-104",
    patient: "John O'Connor",
    caseId: "CAS-2026-092",
    doctor: "Dr. Thomas Mathew (Oncology)",
    hospital: "Amrita Institute of Medical Sciences",
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-08 09:00 IST",
    status: "REQUESTED",
    meetLink: "https://vitalis.health/meet/apt-104",
    notes: "Discussion of Proton beam treatment fractions and medical visa clearance."
  }
];

const DOCTORS_LIST = [
  "Dr. Vijay Anand (Orthopaedics)",
  "Dr. K. S. Muralidharan (Cardiology)",
  "Dr. Arya Varma (Ayurveda)",
  "Dr. Thomas Mathew (Oncology)",
  "Dr. Harikrishnan Pillai (Neurosurgery)",
  "Dr. Rajesh K. (Spine Surgery)",
  "Dr. Venugopal B. (Transplant Surgery)"
];

const HOSPITALS_LIST = [
  "Aster Medcity, Kochi",
  "Amrita Institute of Medical Sciences",
  "VPS Lakeshore, Kochi",
  "Rajagiri Hospital, Aluva",
  "Apollo Adlux Hospital, Angamaly",
  "Somatheeram Ayurvedic Village, Kovalam",
  "Vaidyaratnam Oushadhasala, Thrissur"
];

export default function AppointmentsAdminPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const [activeAppointment, setActiveAppointment] = useState<AppointmentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patient: "",
    caseId: "CAS-2026-089",
    doctor: "Dr. Vijay Anand (Orthopaedics)",
    hospital: "Aster Medcity, Kochi",
    type: "VIDEO_CONSULTATION" as "VIDEO_CONSULTATION" | "SECOND_OPINION_TELEHEALTH" | "IN_PERSON_SURGICAL_CONSULT" | "POST_OP_FOLLOWUP",
    dateTime: "2026-09-15 10:30 IST",
    status: "CONFIRMED" as "CONFIRMED" | "REQUESTED" | "COMPLETED" | "CANCELLED",
    meetLink: "https://vitalis.health/meet/apt-live",
    notes: ""
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maides_admin_appointments");
    if (saved) {
      try {
        setAppointments(JSON.parse(saved));
      } catch {
        setAppointments(INITIAL_APPOINTMENTS);
      }
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
      localStorage.setItem("maides_admin_appointments", JSON.stringify(INITIAL_APPOINTMENTS));
    }
  }, []);

  const saveAppointments = (updated: AppointmentItem[]) => {
    setAppointments(updated);
    localStorage.setItem("maides_admin_appointments", JSON.stringify(updated));
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormData({
      patient: "",
      caseId: `CAS-2026-0${Math.floor(85 + Math.random() * 10)}`,
      doctor: "Dr. Vijay Anand (Orthopaedics)",
      hospital: "Aster Medcity, Kochi",
      type: "VIDEO_CONSULTATION",
      dateTime: "2026-09-16 11:00 IST",
      status: "CONFIRMED",
      meetLink: `https://vitalis.health/meet/apt-${Math.floor(100 + Math.random() * 900)}`,
      notes: ""
    });
    setIsAddModalOpen(true);
  };

  // Submit Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `APT-2026-${String(appointments.length + 105).padStart(3, "0")}`;
    const newApt: AppointmentItem = {
      id: newId,
      patient: formData.patient || "International Patient",
      caseId: formData.caseId,
      doctor: formData.doctor,
      hospital: formData.hospital,
      type: formData.type,
      dateTime: formData.dateTime,
      status: formData.status,
      meetLink: formData.meetLink,
      notes: formData.notes || "Clinical consultation scheduled via Admin Hub."
    };

    const updated = [newApt, ...appointments];
    saveAppointments(updated);
    setIsAddModalOpen(false);
  };

  // Open Edit
  const handleOpenEdit = (apt: AppointmentItem) => {
    setActiveAppointment(apt);
    setFormData({
      patient: apt.patient,
      caseId: apt.caseId,
      doctor: apt.doctor,
      hospital: apt.hospital,
      type: apt.type,
      dateTime: apt.dateTime,
      status: apt.status,
      meetLink: apt.meetLink,
      notes: apt.notes
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointment) return;

    const updated = appointments.map((a) => {
      if (a.id === activeAppointment.id) {
        return {
          ...a,
          patient: formData.patient,
          caseId: formData.caseId,
          doctor: formData.doctor,
          hospital: formData.hospital,
          type: formData.type,
          dateTime: formData.dateTime,
          status: formData.status,
          meetLink: formData.meetLink,
          notes: formData.notes
        };
      }
      return a;
    });

    saveAppointments(updated);
    setIsEditModalOpen(false);
  };

  // Open View
  const handleOpenView = (apt: AppointmentItem) => {
    setActiveAppointment(apt);
    setIsViewModalOpen(true);
  };

  // Open Cancel / Soft Delete
  const handleOpenCancel = (apt: AppointmentItem) => {
    setActiveAppointment(apt);
    setIsCancelModalOpen(true);
  };

  // Confirm Cancel
  const handleConfirmCancel = () => {
    if (!activeAppointment) return;
    const updated = appointments.map((a) => {
      if (a.id === activeAppointment.id) {
        return { ...a, status: "CANCELLED" as const };
      }
      return a;
    });
    saveAppointments(updated);
    setIsCancelModalOpen(false);
  };

  // Filtered
  const filteredAppointments = appointments.filter((apt) => {
    const matchesSearch =
      apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.doctor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.hospital.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck2 className="w-5 h-5 text-[#0E82FD]" />
            Specialist Appointments & Telemedicine Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Coordinate video consultations, cross-border second opinions, and in-person hospital consultations.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Schedule Consultation
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <CalendarCheck2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Consultations</div>
            <div className="text-lg font-bold text-white">{appointments.length} Bookings</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Confirmed / Active</div>
            <div className="text-lg font-bold text-emerald-400">
              {appointments.filter((a) => a.status === "CONFIRMED").length} Confirmed
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Video className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Telehealth Mode</div>
            <div className="text-lg font-bold text-purple-400">
              {appointments.filter((a) => a.type.includes("VIDEO") || a.type.includes("TELEHEALTH")).length} Video Calls
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Pending Requests</div>
            <div className="text-lg font-bold text-amber-400">
              {appointments.filter((a) => a.status === "REQUESTED").length} Pending
            </div>
          </div>
        </div>
      </div>

      {/* Table & Filters */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient, doctor, hospital, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Statuses</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="REQUESTED">REQUESTED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Appointment & Date</th>
                <th className="py-3 px-4">Patient & Case</th>
                <th className="py-3 px-4">Doctor & Hospital</th>
                <th className="py-3 px-4">Consultation Mode</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No consultations found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => (
                  <tr key={apt.id} className="hover:bg-slate-900/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{apt.dateTime}</div>
                      <div className="text-[11px] text-blue-400 font-mono mt-0.5">{apt.id}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {apt.patient}
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono">{apt.caseId}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium">{apt.doctor}</div>
                      <div className="text-[11px] text-blue-400">{apt.hospital}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="flex items-center gap-1.5 text-slate-300 text-[11px]">
                        {apt.type.includes("VIDEO") || apt.type.includes("TELEHEALTH") ? (
                          <Video className="w-3.5 h-3.5 text-blue-400" />
                        ) : (
                          <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                        )}
                        {apt.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : apt.status === "REQUESTED"
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : apt.status === "CANCELLED"
                            ? "bg-red-500/10 text-red-400 border border-red-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(apt)}
                          title="View Consultation Dossier"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-300 hover:text-white transition-all border border-slate-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(apt)}
                          title="Reschedule / Edit"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800 hover:border-blue-500/30"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        {apt.status !== "CANCELLED" && (
                          <button
                            onClick={() => handleOpenCancel(apt)}
                            title="Cancel Consultation"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all border border-slate-800 hover:border-red-500/30"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD APPOINTMENT MODAL                                                     */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Schedule Specialist Consultation</h2>
                  <p className="text-xs text-slate-400">Book Telehealth or in-person hospital appointment</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Attending Specialist *</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {DOCTORS_LIST.map((doc) => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hospital Location *</label>
                  <select
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {HOSPITALS_LIST.map((hosp) => (
                      <option key={hosp} value={hosp}>{hosp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Consultation Mode</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="VIDEO_CONSULTATION">Video Consultation (Telehealth)</option>
                    <option value="SECOND_OPINION_TELEHEALTH">Second Opinion Evaluation</option>
                    <option value="IN_PERSON_SURGICAL_CONSULT">In-Person Hospital Consult</option>
                    <option value="POST_OP_FOLLOWUP">Post-Operative Followup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Appointment Date & Time</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-09-18 11:00 IST"
                    value={formData.dateTime}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Secure Video Link / Venue</label>
                  <input
                    type="text"
                    value={formData.meetLink}
                    onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Consultation Clinical Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Provide briefing for attending doctor or patient prerequisites..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Confirm Appointment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT / RESCHEDULE MODAL                                                   */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Reschedule / Edit Consultation</h2>
                  <p className="text-xs text-slate-400">Modify appointment slot, doctor, or status</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Attending Specialist</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {DOCTORS_LIST.map((doc) => (
                      <option key={doc} value={doc}>{doc}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Hospital Location</label>
                  <select
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {HOSPITALS_LIST.map((hosp) => (
                      <option key={hosp} value={hosp}>{hosp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date & Time</label>
                  <input
                    type="text"
                    required
                    value={formData.dateTime}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="REQUESTED">REQUESTED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Secure Video Link / Venue</label>
                  <input
                    type="text"
                    value={formData.meetLink}
                    onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Clinical Notes</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW MODAL                                                                */}
      {/* ========================================================================= */}
      {isViewModalOpen && activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <CalendarCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-blue-400 font-bold">{activeAppointment.id}</span>
                  <h3 className="text-base font-bold text-white">{activeAppointment.patient}</h3>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 mt-4">
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Doctor:</span>
                  <span className="text-white font-semibold">{activeAppointment.doctor}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Hospital:</span>
                  <span className="text-blue-400">{activeAppointment.hospital}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Time:</span>
                  <span className="text-emerald-400 font-semibold">{activeAppointment.dateTime}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Case ID:</span>
                  <span className="font-mono text-slate-300">{activeAppointment.caseId}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-400">{activeAppointment.status}</span>
                </div>
              </div>

              {activeAppointment.meetLink && (
                <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Telehealth Link</div>
                  <a 
                    href={activeAppointment.meetLink} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="text-xs text-[#0E82FD] hover:underline flex items-center gap-1.5 break-all font-mono"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    {activeAppointment.meetLink}
                  </a>
                </div>
              )}

              {activeAppointment.notes && (
                <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Clinical Notes</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeAppointment.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-5">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(activeAppointment);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit / Reschedule
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-xs font-semibold text-white transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCEL MODAL                                                              */}
      {/* ========================================================================= */}
      {isCancelModalOpen && activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Cancel Appointment</h3>
                <p className="text-xs text-slate-400">Soft deactivation / status cancellation</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-5">
              Are you sure you want to cancel consultation <span className="font-mono text-blue-400">{activeAppointment.id}</span> for <span className="text-white font-bold">{activeAppointment.patient}</span>?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                Keep Active
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-all"
              >
                Cancel Appointment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
