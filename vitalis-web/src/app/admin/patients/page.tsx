"use client";

import React, { useState, useEffect } from "react";
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  FileText, 
  HeartPulse, 
  ShieldCheck,
  ChevronRight,
  Eye,
  Edit,
  Power,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  MessageSquare,
  LifeBuoy,
  Briefcase,
  Clock,
  Building2,
  DollarSign,
  User,
  Shield,
  Activity,
  ArrowUpRight
} from "lucide-react";

interface PatientCase {
  id: string;
  treatment: string;
  hospital: string;
  doctor: string;
  status: "IN_PROGRESS" | "COMPLETED" | "SCHEDULED" | "CONSULTATION";
  startDate: string;
  cost: string;
}

interface PatientAppointment {
  id: string;
  doctor: string;
  hospital: string;
  dateTime: string;
  type: "IN_PERSON" | "TELEHEALTH";
  status: "CONFIRMED" | "COMPLETED" | "PENDING";
}

interface PatientTicket {
  id: string;
  subject: string;
  category: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  status: "OPEN" | "RESOLVED" | "IN_PROGRESS";
  date: string;
}

interface PatientMessage {
  id: string;
  sender: string;
  preview: string;
  timestamp: string;
  unread: boolean;
}

interface PatientProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  dob: string;
  gender: "Female" | "Male" | "Other";
  passportNumber: string;
  bloodGroup: string;
  address: string;
  emergencyContact: string;
  registeredDate: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  totalSpent: string;
  medicalHistory: string;
  cases: PatientCase[];
  appointments: PatientAppointment[];
  tickets: PatientTicket[];
  messages: PatientMessage[];
}

const INITIAL_PATIENTS: PatientProfile[] = [
  {
    id: "PAT-001",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+44 7911 123456",
    country: "United Kingdom",
    dob: "1982-04-12",
    gender: "Female",
    passportNumber: "GB98214589",
    bloodGroup: "O+",
    address: "24 Kensington Road, London, UK",
    emergencyContact: "David Jenkins (+44 7911 998877)",
    registeredDate: "2026-08-20",
    status: "ACTIVE",
    totalSpent: "$6,200",
    medicalHistory: "Bilateral Osteoarthritis of knees, mild hypertension controlled with medication. No drug allergies.",
    cases: [
      {
        id: "CAS-2026-089",
        treatment: "Minimally Invasive Total Knee Replacement",
        hospital: "Aster Medcity, Kochi",
        doctor: "Dr. Vijay Anand",
        status: "IN_PROGRESS",
        startDate: "2026-08-22",
        cost: "$6,200"
      }
    ],
    appointments: [
      {
        id: "APT-101",
        doctor: "Dr. Vijay Anand (Orthopaedics)",
        hospital: "Aster Medcity, Kochi",
        dateTime: "2026-09-10 at 10:30 AM IST",
        type: "TELEHEALTH",
        status: "CONFIRMED"
      },
      {
        id: "APT-088",
        doctor: "Dr. Rajesh K. (Physiotherapy)",
        hospital: "Aster Medcity",
        dateTime: "2026-08-25 at 02:00 PM IST",
        type: "IN_PERSON",
        status: "COMPLETED"
      }
    ],
    tickets: [
      {
        id: "TCK-401",
        subject: "Medical Visa Invitation Letter Assistance",
        category: "Visa & Travel",
        priority: "HIGH",
        status: "RESOLVED",
        date: "2026-08-21"
      }
    ],
    messages: [
      {
        id: "MSG-01",
        sender: "Dr. Vijay Anand",
        preview: "Your pre-operative knee X-ray scans have been reviewed and approved.",
        timestamp: "2 hours ago",
        unread: false
      },
      {
        id: "MSG-02",
        sender: "Kerala Care Coordinator",
        preview: "Airport VIP pickup from Cochin International Airport is scheduled.",
        timestamp: "Yesterday",
        unread: false
      }
    ]
  },
  {
    id: "PAT-002",
    firstName: "Mohammed",
    lastName: "Al-Maktoum",
    email: "m.maktoum@example.ae",
    phone: "+971 50 987 6543",
    country: "United Arab Emirates",
    dob: "1975-11-03",
    gender: "Male",
    passportNumber: "AE77412988",
    bloodGroup: "A+",
    address: "Jumeirah 2, Villa 41, Dubai, UAE",
    emergencyContact: "Fatima Al-Maktoum (+971 50 112 3344)",
    registeredDate: "2026-08-25",
    status: "ACTIVE",
    totalSpent: "$11,500",
    medicalHistory: "Mitral valve prolapse with moderate regurgitation. Non-smoker, no diabetic history.",
    cases: [
      {
        id: "CAS-2026-088",
        treatment: "Robotic-Assisted Mitral Valve Repair",
        hospital: "Amrita Institute of Medical Sciences",
        doctor: "Dr. K. S. Muralidharan",
        status: "SCHEDULED",
        startDate: "2026-09-15",
        cost: "$11,500"
      }
    ],
    appointments: [
      {
        id: "APT-104",
        doctor: "Dr. K. S. Muralidharan (Cardiac Sciences)",
        hospital: "Amrita Institute",
        dateTime: "2026-09-14 at 11:00 AM IST",
        type: "IN_PERSON",
        status: "CONFIRMED"
      }
    ],
    tickets: [
      {
        id: "TCK-405",
        subject: "Arabic Translator requirement at hospital",
        category: "Hospitality & Language",
        priority: "MEDIUM",
        status: "OPEN",
        date: "2026-09-02"
      }
    ],
    messages: [
      {
        id: "MSG-10",
        sender: "Amrita International Desk",
        preview: "Dedicated Arabic executive assigned to assist your consultation.",
        timestamp: "3 hours ago",
        unread: true
      }
    ]
  },
  {
    id: "PAT-003",
    firstName: "Elena",
    lastName: "Rostova",
    email: "elena.rostova@example.de",
    phone: "+49 170 555 1234",
    country: "Germany",
    dob: "1988-06-21",
    gender: "Female",
    passportNumber: "DE66239104",
    bloodGroup: "B+",
    address: "Schillerstraße 18, Munich, Germany",
    emergencyContact: "Hans Rostova (+49 170 998 7766)",
    registeredDate: "2026-07-14",
    status: "ACTIVE",
    totalSpent: "$4,200",
    medicalHistory: "Chronic cervical spondylosis, migraine headaches, stress-induced insomnia.",
    cases: [
      {
        id: "CAS-2026-085",
        treatment: "Ayurvedic Panchakarma & Spine Rejuvenation",
        hospital: "Somatheeram Ayurvedic Village",
        doctor: "Dr. Arya Varma",
        status: "COMPLETED",
        startDate: "2026-07-20",
        cost: "$4,200"
      }
    ],
    appointments: [
      {
        id: "APT-070",
        doctor: "Dr. Arya Varma (Ayurveda)",
        hospital: "Somatheeram Village",
        dateTime: "2026-08-05 at 04:00 PM IST",
        type: "IN_PERSON",
        status: "COMPLETED"
      }
    ],
    tickets: [
      {
        id: "TCK-380",
        subject: "Post-treatment herbal medicine dispatch to Munich",
        category: "Pharmacy & Courier",
        priority: "LOW",
        status: "RESOLVED",
        date: "2026-08-08"
      }
    ],
    messages: [
      {
        id: "MSG-15",
        sender: "Somatheeram Pharmacy",
        preview: "DHL tracking number for your 3-month herbal course: 981248921.",
        timestamp: "Aug 10",
        unread: false
      }
    ]
  },
  {
    id: "PAT-004",
    firstName: "John",
    lastName: "O'Connor",
    email: "j.oconnor@example.ie",
    phone: "+353 87 123 4567",
    country: "Ireland",
    dob: "1969-09-15",
    gender: "Male",
    passportNumber: "IE44901822",
    bloodGroup: "O-",
    address: "12 Grafton Street, Dublin, Ireland",
    emergencyContact: "Mary O'Connor (+353 87 887 6655)",
    registeredDate: "2026-08-28",
    status: "ACTIVE",
    totalSpent: "$18,000",
    medicalHistory: "Prostate cancer localized, candidate for proton beam radiation therapy.",
    cases: [
      {
        id: "CAS-2026-092",
        treatment: "Proton Beam Radiotherapy",
        hospital: "Amrita Institute of Medical Sciences",
        doctor: "Dr. Thomas Mathew",
        status: "IN_PROGRESS",
        startDate: "2026-09-01",
        cost: "$18,000"
      }
    ],
    appointments: [
      {
        id: "APT-112",
        doctor: "Dr. Thomas Mathew (Oncology)",
        hospital: "Amrita Institute",
        dateTime: "2026-09-08 at 09:00 AM IST",
        type: "TELEHEALTH",
        status: "CONFIRMED"
      }
    ],
    tickets: [],
    messages: [
      {
        id: "MSG-22",
        sender: "Oncology Care Coordinator",
        preview: "4D-CT simulation appointment locked for September 12.",
        timestamp: "Yesterday",
        unread: false
      }
    ]
  }
];

export default function PatientsPage() {
  const [patients, setPatients] = useState<PatientProfile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [countryFilter, setCountryFilter] = useState("ALL");

  // Modals & Active State
  const [activePatient, setActivePatient] = useState<PatientProfile | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"PROFILE" | "CASES" | "APPOINTMENTS" | "TICKETS" | "MESSAGES">("PROFILE");

  // Form State
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "United Kingdom",
    dob: "1985-01-01",
    gender: "Female" as "Female" | "Male" | "Other",
    passportNumber: "",
    bloodGroup: "O+",
    address: "",
    emergencyContact: "",
    medicalHistory: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SUSPENDED"
  });

  // Load from LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("maides_admin_patients");
    if (saved) {
      try {
        setPatients(JSON.parse(saved));
      } catch {
        setPatients(INITIAL_PATIENTS);
      }
    } else {
      setPatients(INITIAL_PATIENTS);
      localStorage.setItem("maides_admin_patients", JSON.stringify(INITIAL_PATIENTS));
    }
  }, []);

  const savePatients = (updated: PatientProfile[]) => {
    setPatients(updated);
    localStorage.setItem("maides_admin_patients", JSON.stringify(updated));
  };

  // Toggle Status (Activate / Deactivate)
  const handleToggleStatus = (patientId: string) => {
    const updated = patients.map((p) => {
      if (p.id === patientId) {
        const nextStatus = p.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        return { ...p, status: nextStatus as "ACTIVE" | "INACTIVE" };
      }
      return p;
    });
    savePatients(updated);
    if (activePatient && activePatient.id === patientId) {
      setActivePatient({
        ...activePatient,
        status: activePatient.status === "ACTIVE" ? "INACTIVE" : "ACTIVE"
      });
    }
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      country: "United Kingdom",
      dob: "1990-01-01",
      gender: "Female",
      passportNumber: "",
      bloodGroup: "O+",
      address: "",
      emergencyContact: "",
      medicalHistory: "",
      status: "ACTIVE"
    });
    setIsAddModalOpen(true);
  };

  // Submit Create
  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `PAT-${String(patients.length + 1).padStart(3, "0")}`;
    const newPatient: PatientProfile = {
      id: newId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      country: formData.country,
      dob: formData.dob,
      gender: formData.gender,
      passportNumber: formData.passportNumber || "TBD",
      bloodGroup: formData.bloodGroup,
      address: formData.address || "International Address",
      emergencyContact: formData.emergencyContact || "Not provided",
      registeredDate: new Date().toISOString().split("T")[0],
      status: formData.status,
      totalSpent: "$0",
      medicalHistory: formData.medicalHistory || "No pre-existing conditions recorded.",
      cases: [],
      appointments: [],
      tickets: [],
      messages: []
    };

    const updated = [newPatient, ...patients];
    savePatients(updated);
    setIsAddModalOpen(false);
  };

  // Open Edit
  const handleOpenEdit = (p: PatientProfile) => {
    setActivePatient(p);
    setFormData({
      firstName: p.firstName,
      lastName: p.lastName,
      email: p.email,
      phone: p.phone,
      country: p.country,
      dob: p.dob,
      gender: p.gender,
      passportNumber: p.passportNumber,
      bloodGroup: p.bloodGroup,
      address: p.address,
      emergencyContact: p.emergencyContact,
      medicalHistory: p.medicalHistory,
      status: p.status
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activePatient) return;

    const updated = patients.map((p) => {
      if (p.id === activePatient.id) {
        return {
          ...p,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          country: formData.country,
          dob: formData.dob,
          gender: formData.gender,
          passportNumber: formData.passportNumber,
          bloodGroup: formData.bloodGroup,
          address: formData.address,
          emergencyContact: formData.emergencyContact,
          medicalHistory: formData.medicalHistory,
          status: formData.status
        };
      }
      return p;
    });

    savePatients(updated);
    if (activePatient) {
      setActivePatient({
        ...activePatient,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        country: formData.country,
        dob: formData.dob,
        gender: formData.gender,
        passportNumber: formData.passportNumber,
        bloodGroup: formData.bloodGroup,
        address: formData.address,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
        status: formData.status
      });
    }
    setIsEditModalOpen(false);
  };

  // Open Full Profile Dossier
  const handleOpenView = (p: PatientProfile, defaultTab: "PROFILE" | "CASES" | "APPOINTMENTS" | "TICKETS" | "MESSAGES" = "PROFILE") => {
    setActivePatient(p);
    setActiveTab(defaultTab);
    setIsViewModalOpen(true);
  };

  // Filtered Patients
  const countries = Array.from(new Set(patients.map((p) => p.country)));
  const filteredPatients = patients.filter((p) => {
    const fullName = `${p.firstName} ${p.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.passportNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
    const matchesCountry = countryFilter === "ALL" || p.country === countryFilter;

    return matchesSearch && matchesStatus && matchesCountry;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Users className="w-5 h-5 text-[#0E82FD]" />
            International Patient Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Access secure medical records, active surgical cases, telehealth schedules, support tickets, and account permissions.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Patient
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Registered Patients</div>
            <div className="text-lg font-bold text-white">{patients.length} Accounts</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Accounts</div>
            <div className="text-lg font-bold text-emerald-400">
              {patients.filter((p) => p.status === "ACTIVE").length} Active
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Countries Represented</div>
            <div className="text-lg font-bold text-white">{countries.length} Nations</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Data Privacy</div>
            <div className="text-lg font-bold text-amber-400">Role-Isolated</div>
          </div>
        </div>
      </div>

      {/* Directory Table & Filters */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        {/* Search & Filters */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient name, ID, email, country, passport..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
              <option value="SUSPENDED">SUSPENDED</option>
            </select>

            <select
              value={countryFilter}
              onChange={(e) => setCountryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Countries</option>
              {countries.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Contact Info</th>
                <th className="py-3 px-4">Country & DOB</th>
                <th className="py-3 px-4">Registration Date</th>
                <th className="py-3 px-4">Medical Cases</th>
                <th className="py-3 px-4 text-center">Account Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No patient records found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredPatients.map((pat) => {
                  const initials = `${pat.firstName[0] || ""}${pat.lastName[0] || ""}`.toUpperCase();
                  return (
                    <tr key={pat.id} className="hover:bg-slate-900/40 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 text-[#0E82FD] font-bold flex items-center justify-center text-xs">
                            {initials}
                          </div>
                          <div>
                            <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                              {pat.firstName} {pat.lastName}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                              <span>{pat.id}</span>
                              <span>•</span>
                              <span>{pat.gender}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 flex items-center gap-1.5">
                          <Mail className="w-3 h-3 text-slate-500" />
                          <span>{pat.email}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-500" />
                          <span>{pat.phone}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium flex items-center gap-1.5">
                          <Globe className="w-3 h-3 text-blue-400" />
                          <span>{pat.country}</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          DOB: {pat.dob} (Blood: {pat.bloodGroup})
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-mono text-[11px] flex items-center gap-1.5">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{pat.registeredDate}</span>
                        </div>
                        <div className="text-[10px] text-emerald-400/80 font-medium mt-0.5">
                          Spent: {pat.totalSpent}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        {pat.cases && pat.cases.length > 0 ? (
                          <div>
                            <span className="text-blue-400 font-medium text-xs line-clamp-1">
                              {pat.cases[0].treatment}
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              {pat.cases[0].id} • {pat.cases[0].status}
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-[11px] italic">No active cases</span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(pat.id)}
                          title={`Click to ${pat.status === "ACTIVE" ? "Deactivate" : "Activate"}`}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold border transition-all ${
                            pat.status === "ACTIVE"
                              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20"
                              : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-emerald-500/10 hover:text-emerald-400"
                          }`}
                        >
                          {pat.status}
                        </button>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenView(pat)}
                            title="View Complete Patient Dossier"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-300 hover:text-white transition-all border border-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleOpenEdit(pat)}
                            title="Edit Patient Information"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800 hover:border-blue-500/30"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(pat.id)}
                            title={pat.status === "ACTIVE" ? "Deactivate Account" : "Activate Account"}
                            className={`p-1.5 rounded-lg bg-slate-900 transition-all border border-slate-800 ${
                              pat.status === "ACTIVE" 
                                ? "text-slate-400 hover:text-amber-400 hover:bg-amber-500/10" 
                                : "text-slate-400 hover:text-emerald-400 hover:bg-emerald-500/10"
                            }`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* ADD PATIENT MODAL                                                         */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Add International Patient</h2>
                  <p className="text-xs text-slate-400">Register a new patient profile and medical account</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreatePatient} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jenkins"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah.jenkins@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number (with Country Code) *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. +44 7911 123456"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country of Origin *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date of Birth *</label>
                  <input
                    type="date"
                    required
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Gender</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Female">Female</option>
                    <option value="Male">Male</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passport / National ID</label>
                  <input
                    type="text"
                    placeholder="e.g. GB98214589"
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    placeholder="e.g. 24 Kensington Road, London, UK"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Medical Background & Allergies</label>
                  <textarea
                    rows={2}
                    placeholder="Pre-existing medical conditions, chronic illnesses, drug allergies..."
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
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
                  Create Patient Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT PATIENT MODAL                                                        */}
      {/* ========================================================================= */}
      {isEditModalOpen && activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Patient Record ({activePatient.id})</h2>
                  <p className="text-xs text-slate-400">Modify patient contact details, status, and clinical background</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdatePatient} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Last Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country *</label>
                  <input
                    type="text"
                    required
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="ACTIVE">ACTIVE (Authorized)</option>
                    <option value="INACTIVE">INACTIVE (Disabled)</option>
                    <option value="SUSPENDED">SUSPENDED (Restricted)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passport / National ID</label>
                  <input
                    type="text"
                    value={formData.passportNumber}
                    onChange={(e) => setFormData({ ...formData, passportNumber: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Blood Group</label>
                  <input
                    type="text"
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Residential Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Medical Background</label>
                  <textarea
                    rows={2}
                    value={formData.medicalHistory}
                    onChange={(e) => setFormData({ ...formData, medicalHistory: e.target.value })}
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
      {/* VIEW PATIENT DOSSIER (PROFILE, CASES, APPOINTMENTS, TICKETS, MESSAGES)   */}
      {/* ========================================================================= */}
      {isViewModalOpen && activePatient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 flex flex-col">
            {/* Dossier Top Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-[#0E82FD] font-extrabold flex items-center justify-center text-lg">
                  {`${activePatient.firstName[0] || ""}${activePatient.lastName[0] || ""}`}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{activePatient.id}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        activePatient.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-slate-800 text-slate-400 border border-slate-700"
                      }`}
                    >
                      {activePatient.status}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-white mt-0.5">
                    {activePatient.firstName} {activePatient.lastName}
                  </h2>
                  <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                    <span>{activePatient.country}</span>
                    <span>•</span>
                    <span>Registered on {activePatient.registeredDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => handleToggleStatus(activePatient.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                    activePatient.status === "ACTIVE"
                      ? "bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20"
                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                  }`}
                >
                  <Power className="w-3.5 h-3.5" />
                  {activePatient.status === "ACTIVE" ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEdit(activePatient);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-800 transition-all flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Record
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-2 border-b border-slate-800 py-3 overflow-x-auto text-xs">
              <button
                onClick={() => setActiveTab("PROFILE")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "PROFILE"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <User className="w-3.5 h-3.5" />
                Profile & Medical Info
              </button>

              <button
                onClick={() => setActiveTab("CASES")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "CASES"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <HeartPulse className="w-3.5 h-3.5" />
                Medical Cases ({activePatient.cases ? activePatient.cases.length : 0})
              </button>

              <button
                onClick={() => setActiveTab("APPOINTMENTS")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "APPOINTMENTS"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Appointments ({activePatient.appointments ? activePatient.appointments.length : 0})
              </button>

              <button
                onClick={() => setActiveTab("TICKETS")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "TICKETS"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <LifeBuoy className="w-3.5 h-3.5" />
                Support Tickets ({activePatient.tickets ? activePatient.tickets.length : 0})
              </button>

              <button
                onClick={() => setActiveTab("MESSAGES")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "MESSAGES"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Messages ({activePatient.messages ? activePatient.messages.length : 0})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-5 space-y-5">
              {/* TAB 1: PROFILE & MEDICAL INFO */}
              {activeTab === "PROFILE" && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Contact Details</div>
                      <div className="text-xs text-white font-medium mt-2">{activePatient.email}</div>
                      <div className="text-xs text-slate-300 mt-1">{activePatient.phone}</div>
                      <div className="text-xs text-slate-400 mt-2 line-clamp-2">{activePatient.address}</div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Identity & Demographics</div>
                      <div className="text-xs text-white font-medium mt-2">DOB: {activePatient.dob} ({activePatient.gender})</div>
                      <div className="text-xs text-slate-300 mt-1">Passport: <strong className="text-white font-mono">{activePatient.passportNumber}</strong></div>
                      <div className="text-xs text-slate-300 mt-1">Blood Group: <strong className="text-emerald-400">{activePatient.bloodGroup}</strong></div>
                    </div>

                    <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Emergency Contact</div>
                      <div className="text-xs text-white font-medium mt-2">{activePatient.emergencyContact}</div>
                      <div className="text-[11px] text-emerald-400 font-semibold mt-2">Lifetime Billed: {activePatient.totalSpent}</div>
                      <div className="text-[10px] text-slate-500 mt-1">Security: HIPAA / Role-Isolated Access</div>
                    </div>
                  </div>

                  <div className="bg-slate-900/40 border border-slate-800 p-4 rounded-2xl">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-2 flex items-center gap-1.5">
                      <HeartPulse className="w-3.5 h-3.5 text-red-400" />
                      Pre-Existing Medical Conditions & Health History
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                      {activePatient.medicalHistory || "No specific chronic ailments or medical contraindications documented."}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 2: MEDICAL CASES */}
              {activeTab === "CASES" && (
                <div className="space-y-3">
                  {(!activePatient.cases || activePatient.cases.length === 0) ? (
                    <div className="py-12 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800">
                      No medical cases currently recorded for this patient.
                    </div>
                  ) : (
                    activePatient.cases.map((cs) => (
                      <div key={cs.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-blue-400">{cs.id}</span>
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                              {cs.status}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white mt-1">{cs.treatment}</h4>
                          <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                            <span>Hospital: <strong className="text-slate-200">{cs.hospital}</strong></span>
                            <span>•</span>
                            <span>Doctor: <strong className="text-slate-200">{cs.doctor}</strong></span>
                          </div>
                        </div>

                        <div className="text-left sm:text-right">
                          <div className="text-sm font-extrabold text-emerald-400">{cs.cost}</div>
                          <div className="text-[11px] text-slate-500">Initiated: {cs.startDate}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: APPOINTMENTS */}
              {activeTab === "APPOINTMENTS" && (
                <div className="space-y-3">
                  {(!activePatient.appointments || activePatient.appointments.length === 0) ? (
                    <div className="py-12 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800">
                      No scheduled or previous consultations found.
                    </div>
                  ) : (
                    activePatient.appointments.map((apt) => (
                      <div key={apt.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                            <Calendar className="w-5 h-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-white">{apt.doctor}</span>
                              <span className="text-[10px] font-bold bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                                {apt.type}
                              </span>
                            </div>
                            <div className="text-xs text-slate-400 mt-0.5">{apt.hospital}</div>
                            <div className="text-[11px] text-blue-400 font-medium mt-0.5">{apt.dateTime}</div>
                          </div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          apt.status === "CONFIRMED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}>
                          {apt.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 4: TICKETS */}
              {activeTab === "TICKETS" && (
                <div className="space-y-3">
                  {(!activePatient.tickets || activePatient.tickets.length === 0) ? (
                    <div className="py-12 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800">
                      No support tickets logged for this account.
                    </div>
                  ) : (
                    activePatient.tickets.map((tck) => (
                      <div key={tck.id} className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl flex items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-400">{tck.id}</span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                              {tck.category}
                            </span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">{tck.subject}</h4>
                          <div className="text-[11px] text-slate-500 mt-0.5">Submitted: {tck.date}</div>
                        </div>

                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          tck.status === "RESOLVED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}>
                          {tck.status}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 5: MESSAGES */}
              {activeTab === "MESSAGES" && (
                <div className="space-y-3">
                  {(!activePatient.messages || activePatient.messages.length === 0) ? (
                    <div className="py-12 text-center text-slate-500 bg-slate-900/20 rounded-2xl border border-slate-800">
                      No communication logs available.
                    </div>
                  ) : (
                    activePatient.messages.map((msg) => (
                      <div key={msg.id} className="bg-slate-900/60 border border-slate-800 p-3.5 rounded-2xl flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <MessageSquare className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white">{msg.sender}</div>
                            <p className="text-xs text-slate-300 mt-1">{msg.preview}</p>
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-500 whitespace-nowrap">{msg.timestamp}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Dossier Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-blue-400" />
                <span>Admin Access Token Authenticated</span>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-xs font-semibold text-white transition-all shadow-md"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
