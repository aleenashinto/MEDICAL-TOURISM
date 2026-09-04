"use client";

import React, { useState, useEffect } from "react";
import { 
  Stethoscope, 
  Search, 
  Plus, 
  Building2, 
  GraduationCap, 
  Calendar, 
  Award, 
  CheckCircle2,
  Star,
  Edit,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  User,
  MapPin,
  Clock,
  Sparkles,
  Phone,
  Mail
} from "lucide-react";

interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  experience: string;
  education: string;
  consultationFee: string;
  casesHandled: number;
  rating: string;
  languages: string;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  bio?: string;
}

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "DOC-101",
    name: "Dr. Vijay Anand",
    title: "Senior Consultant & Head of Orthopedics",
    specialty: "Orthopaedics & Joint Replacement",
    hospital: "Aster Medcity, Kochi",
    experience: "24+ Years",
    education: "MBBS, MS (Ortho), MCh (UK), Fellowship Joint Surgery",
    consultationFee: "$60 (₹5,000)",
    casesHandled: 142,
    rating: "4.95",
    languages: "English, Hindi, Malayalam, Arabic",
    status: "ACTIVE",
    bio: "Pioneer in robotic total knee and hip replacements in South India with over 2,000+ joint surgeries performed for international patients from UAE, Oman, and the UK."
  },
  {
    id: "DOC-102",
    name: "Dr. K. S. Muralidharan",
    title: "Chief of Cardiothoracic & Vascular Surgery",
    specialty: "Cardiology & Cardiac Surgery",
    hospital: "Amrita Institute of Medical Sciences",
    experience: "28+ Years",
    education: "MBBS, MS, MCh (CTVS), FACS (USA)",
    consultationFee: "$75 (₹6,200)",
    casesHandled: 210,
    rating: "4.98",
    languages: "English, Hindi, Tamil, Malayalam",
    status: "ACTIVE",
    bio: "Renowned cardiothoracic surgeon specializing in minimally invasive coronary bypass (CABG), valve repairs, and robotic pediatric cardiac reconstructions."
  },
  {
    id: "DOC-103",
    name: "Dr. Rajesh K.",
    title: "Lead Neuro & Spine Surgeon",
    specialty: "Neurology & Spine Surgery",
    hospital: "Rajagiri Hospital, Aluva",
    experience: "19+ Years",
    education: "MBBS, MS, MCh (Neurosurgery)",
    consultationFee: "$65 (₹5,400)",
    casesHandled: 98,
    rating: "4.90",
    languages: "English, Hindi, Malayalam",
    status: "ACTIVE",
    bio: "Expert in endoscopic spinal decompression, microscopic brain tumor resections, and complex spinal fusion procedures."
  },
  {
    id: "DOC-104",
    name: "Dr. Arya Varma",
    title: "Chief Ayurvedic Physician",
    specialty: "Classical Ayurveda & Panchakarma",
    hospital: "Somatheeram Ayurvedic Village",
    experience: "16+ Years",
    education: "BAMS, MD (Ayurveda)",
    consultationFee: "$45 (₹3,700)",
    casesHandled: 185,
    rating: "4.92",
    languages: "English, German, Malayalam",
    status: "ACTIVE",
    bio: "Classical Ayurveda scholar focusing on authentic Panchakarma detoxification, lifestyle disease reversal, and customized Ayurvedic rehabilitation protocols."
  },
  {
    id: "DOC-105",
    name: "Dr. Deepa Pillai",
    title: "Senior Consultant Medical Oncologist",
    specialty: "Oncology & Cancer Care",
    hospital: "VPS Lakeshore Hospital, Kochi",
    experience: "21+ Years",
    education: "MBBS, MD, DM (Medical Oncology), ESMO Certified",
    consultationFee: "$70 (₹5,800)",
    casesHandled: 164,
    rating: "4.94",
    languages: "English, Hindi, Malayalam",
    status: "ACTIVE",
    bio: "Leading oncologist in targeted molecular therapy, immunotherapy, and comprehensive solid tumor treatment."
  }
];

export default function DoctorsAdminPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("ALL");
  const [toast, setToast] = useState<string | null>(null);

  // Modal States
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [viewDoctor, setViewDoctor] = useState<Doctor | null>(null);
  const [deleteDoctorConfirm, setDeleteDoctorConfirm] = useState<Doctor | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: "",
    title: "",
    specialty: "Orthopaedics & Joint Replacement",
    hospital: "Aster Medcity, Kochi",
    experience: "15+ Years",
    education: "MBBS, MS, MCh",
    consultationFee: "$60 (₹5,000)",
    casesHandled: 50,
    rating: "4.90",
    languages: "English, Hindi, Malayalam",
    status: "ACTIVE",
    bio: ""
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("maides_admin_doctors");
      if (stored) {
        try {
          setDoctors(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse doctors from localStorage", e);
        }
      }
    }
  }, []);

  const saveDoctors = (updated: Doctor[]) => {
    setDoctors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_admin_doctors", JSON.stringify(updated));
    }
  };

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentDoctor(null);
    setFormData({
      name: "",
      title: "Senior Consultant",
      specialty: "Orthopaedics & Joint Replacement",
      hospital: "Aster Medcity, Kochi",
      experience: "15+ Years",
      education: "MBBS, MS, MCh",
      consultationFee: "$60 (₹5,000)",
      casesHandled: 20,
      rating: "4.90",
      languages: "English, Hindi, Malayalam, Arabic",
      status: "ACTIVE",
      bio: ""
    });
    setShowCreateEditModal(true);
  };

  const handleOpenEdit = (doc: Doctor) => {
    setIsEditing(true);
    setCurrentDoctor(doc);
    setFormData({ ...doc });
    setShowCreateEditModal(true);
  };

  const handleSaveDoctor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name?.trim()) return;

    if (isEditing && currentDoctor) {
      const updatedList = doctors.map(d => d.id === currentDoctor.id ? { ...(formData as Doctor), id: currentDoctor.id } : d);
      saveDoctors(updatedList);
      setToast(`Doctor profile for ${formData.name} updated successfully!`);
    } else {
      const newDoc: Doctor = {
        ...(formData as Doctor),
        id: `DOC-${Math.floor(100 + Math.random() * 900)}`,
        casesHandled: Number(formData.casesHandled) || 0,
        rating: formData.rating || "4.90",
      };
      const updatedList = [newDoc, ...doctors];
      saveDoctors(updatedList);
      setToast(`New specialist doctor ${newDoc.name} added to clinical faculty directory!`);
    }

    setShowCreateEditModal(false);
    setTimeout(() => setToast(null), 4000);
  };

  const handleDeleteDoctor = () => {
    if (!deleteDoctorConfirm) return;
    const updatedList = doctors.filter(d => d.id !== deleteDoctorConfirm.id);
    saveDoctors(updatedList);
    setToast(`Doctor ${deleteDoctorConfirm.name} removed from active clinical directory.`);
    setDeleteDoctorConfirm(null);
    setTimeout(() => setToast(null), 4000);
  };

  const filteredDoctors = doctors.filter(d => {
    const matchesSearch = 
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === "ALL" || d.specialty.includes(selectedSpecialty);
    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Accredited Specialist Doctors & Clinical Faculty
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Create, view, edit, and manage Kerala's top internationally credentialed medical specialists, surgeons, and department heads.
          </p>
        </div>
        <button 
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Specialist Doctor</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search doctors by name, hospital, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "Orthopaedics", "Cardiology", "Neurology", "Oncology", "Ayurveda"].map((sp) => (
            <button
              key={sp}
              onClick={() => setSelectedSpecialty(sp)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedSpecialty === sp
                  ? "bg-[#0E82FD] text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Doctor Profile & Qualifications</th>
                <th className="py-3 px-4">Specialty & Department</th>
                <th className="py-3 px-4">Hospital Affiliation</th>
                <th className="py-3 px-4">Experience & Global Patients</th>
                <th className="py-3 px-4">Consult Fee</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDoctors.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No doctor profiles match your current search criteria.
                  </td>
                </tr>
              ) : (
                filteredDoctors.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-[#0E82FD] flex items-center justify-center font-bold text-xs shrink-0 border border-blue-500/30">
                          {doc.name.replace("Dr. ", "").charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-200 flex items-center gap-1.5">
                            <span>{doc.name}</span>
                            <span className="font-mono text-[10px] text-blue-400 px-1 rounded bg-blue-500/10 border border-blue-500/20">{doc.id}</span>
                          </div>
                          <div className="text-[11px] text-slate-400">{doc.title}</div>
                          <div className="text-[10px] text-slate-500 font-mono mt-0.5">{doc.education}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {doc.specialty}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium flex items-center gap-1">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span>{doc.hospital}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-300">{doc.experience}</div>
                      <div className="text-[11px] text-emerald-400 font-semibold">{doc.casesHandled} Treated Cases</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-bold">{doc.consultationFee}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        doc.status === "ACTIVE" 
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}>
                        {doc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* View Action */}
                        <button
                          onClick={() => setViewDoctor(doc)}
                          title="View Dossier"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-400" />
                        </button>

                        {/* Edit Action */}
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          title="Edit Profile"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-300 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Action */}
                        <button
                          onClick={() => setDeleteDoctorConfirm(doc)}
                          title="Delete Doctor"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-rose-600 text-slate-400 hover:text-white border border-slate-800 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE & EDIT MODAL */}
      {showCreateEditModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-2xl w-full space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-[#0E82FD] flex items-center justify-center font-bold border border-blue-500/20">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {isEditing ? `Edit Profile: ${currentDoctor?.name}` : "Add New Specialist Doctor"}
                  </h3>
                  <p className="text-[11px] text-slate-400">Clinical faculty profile and consultation parameters</p>
                </div>
              </div>
              <button 
                onClick={() => setShowCreateEditModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveDoctor} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Doctor Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Rajesh Kumar"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Designation & Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Consultant & Head of Neuro"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Specialty Department *</label>
                  <select
                    value={formData.specialty || ""}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Orthopaedics & Joint Replacement">Orthopaedics & Joint Replacement</option>
                    <option value="Cardiology & Cardiac Surgery">Cardiology & Cardiac Surgery</option>
                    <option value="Neurology & Spine Surgery">Neurology & Spine Surgery</option>
                    <option value="Oncology & Cancer Care">Oncology & Cancer Care</option>
                    <option value="Classical Ayurveda & Panchakarma">Classical Ayurveda & Panchakarma</option>
                    <option value="Organ Transplantation">Organ Transplantation</option>
                    <option value="Gastroenterology & Hepatology">Gastroenterology & Hepatology</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Affiliated Hospital in Kerala *</label>
                  <select
                    value={formData.hospital || ""}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Aster Medcity, Kochi">Aster Medcity, Kochi</option>
                    <option value="Amrita Institute of Medical Sciences">Amrita Institute of Medical Sciences</option>
                    <option value="Rajagiri Hospital, Aluva">Rajagiri Hospital, Aluva</option>
                    <option value="VPS Lakeshore Hospital, Kochi">VPS Lakeshore Hospital, Kochi</option>
                    <option value="Somatheeram Ayurvedic Village">Somatheeram Ayurvedic Village</option>
                    <option value="KIMSHEALTH, Trivandrum">KIMSHEALTH, Trivandrum</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Experience *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 20+ Years"
                    value={formData.experience || ""}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Consultation Fee *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $60 (₹5,000)"
                    value={formData.consultationFee || ""}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Account Status</label>
                  <select
                    value={formData.status || "ACTIVE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="ACTIVE">ACTIVE (Accepting Patients)</option>
                    <option value="ON_LEAVE">ON LEAVE (Temporary Hold)</option>
                    <option value="INACTIVE">INACTIVE (Archived)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Medical Degrees & Fellowships *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. MBBS, MS (Ortho), MCh (UK), Fellowship Joint Surgery"
                  value={formData.education || ""}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Languages Spoken</label>
                <input
                  type="text"
                  placeholder="e.g. English, Arabic, Hindi, Malayalam"
                  value={formData.languages || ""}
                  onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Clinical Biography & Highlights</label>
                <textarea
                  rows={3}
                  placeholder="Brief clinical background, surgical expertise, and international patient achievements..."
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowCreateEditModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {isEditing ? "Save Changes" : "Create Doctor Profile"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DOCTOR DOSSIER MODAL */}
      {viewDoctor && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-[#0E82FD] flex items-center justify-center font-bold border border-blue-500/20">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white flex items-center gap-2">
                    {viewDoctor.name}
                    <span className="font-mono text-xs text-blue-400 px-1.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">{viewDoctor.id}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">{viewDoctor.title}</p>
                </div>
              </div>
              <button 
                onClick={() => setViewDoctor(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Specialty</span>
                  <span className="font-semibold text-white">{viewDoctor.specialty}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Affiliation</span>
                  <span className="font-semibold text-blue-400">{viewDoctor.hospital}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Experience & Rating</span>
                  <span className="font-semibold text-white">{viewDoctor.experience} • ★ {viewDoctor.rating}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px] uppercase font-bold">Consultation Fee</span>
                  <span className="font-semibold text-emerald-400">{viewDoctor.consultationFee}</span>
                </div>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">Qualifications</span>
                <span className="text-slate-200 font-mono text-[11px]">{viewDoctor.education}</span>
              </div>

              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">Spoken Languages</span>
                <span className="text-slate-200 font-medium">{viewDoctor.languages}</span>
              </div>

              {viewDoctor.bio && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                  <span className="text-slate-500 block text-[10px] uppercase font-bold mb-0.5">Clinical Biography</span>
                  <p className="text-slate-300 leading-relaxed">{viewDoctor.bio}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setViewDoctor(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const d = viewDoctor;
                  setViewDoctor(null);
                  handleOpenEdit(d);
                }}
                className="px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow"
              >
                Edit Doctor
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteDoctorConfirm && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-sm w-full space-y-4 shadow-2xl animate-in zoom-in-95 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-500 border border-rose-500/20 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Delete Doctor Profile?</h3>
              <p className="text-xs text-slate-400 mt-1">
                Are you sure you want to remove <strong className="text-white">{deleteDoctorConfirm.name}</strong> from the clinical faculty directory? This action cannot be undone.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setDeleteDoctorConfirm(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteDoctor}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
