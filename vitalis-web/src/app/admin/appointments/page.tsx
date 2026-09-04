"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowRight,
  ShieldCheck,
  Check,
  XCircle,
  Clock4,
  RefreshCw,
  Sparkles,
  Layers,
  Phone,
  Mail,
  UserX
} from "lucide-react";
import Link from "next/link";

export type AppointmentStatus = 
  | "REQUESTED"
  | "UNDER_REVIEW"
  | "APPROVED"
  | "SCHEDULED"
  | "CONFIRMED"
  | "COMPLETED"
  | "CANCELLED"
  | "REJECTED"
  | "RESCHEDULED"
  | "NO_SHOW";

export interface StatusHistoryEntry {
  status: AppointmentStatus;
  timestamp: string;
  updatedBy: string;
  notes?: string;
  previousDate?: string;
}

export interface AppointmentItem {
  id: string;
  patient: string;
  patientEmail?: string;
  patientPhone?: string;
  patientCountry?: string;
  caseId: string;
  specialty: string;
  service: string;
  hospital: string;
  doctor: string;
  packageId?: string;
  packageName?: string;
  type: "VIDEO_CONSULTATION" | "SECOND_OPINION_TELEHEALTH" | "IN_PERSON_SURGICAL_CONSULT" | "POST_OP_FOLLOWUP";
  dateTime: string;
  preferredTime?: string;
  status: AppointmentStatus;
  meetLink?: string;
  notes?: string;
  rescheduleReason?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
  consultationFeeUsd?: number;
  consultationFeeInr?: number;
  history?: StatusHistoryEntry[];
}

const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: "APT-2026-101",
    patient: "Sarah Jenkins",
    patientEmail: "sarah.jenkins@example.co.uk",
    patientPhone: "+44 7911 123456",
    patientCountry: "United Kingdom",
    caseId: "CAS-2026-089",
    specialty: "Orthopaedics & Joint Replacement",
    service: "Robotic Total Knee Replacement",
    hospital: "Aster Medcity, Kochi",
    doctor: "Dr. Alexander K. George",
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-10 14:00 IST",
    preferredTime: "14:00 IST",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/xyz-maides-101",
    notes: "Pre-admission knee joint review and robotic navigation briefing.",
    createdAt: "2026-09-02 10:15",
    updatedAt: "2026-09-03 14:20",
    consultationFeeUsd: 50,
    consultationFeeInr: 4200,
    history: [
      { status: "REQUESTED", timestamp: "2026-09-02 10:15", updatedBy: "Public Visitor" },
      { status: "APPROVED", timestamp: "2026-09-02 14:00", updatedBy: "Admin Hub", notes: "Doctor availability confirmed" },
      { status: "CONFIRMED", timestamp: "2026-09-03 14:20", updatedBy: "Admin Hub", notes: "Patient confirmed attendance and payment verified" }
    ]
  },
  {
    id: "APT-2026-102",
    patient: "Mohammed Al-Maktoum",
    patientEmail: "m.maktoum@example.ae",
    patientPhone: "+971 50 987 6543",
    patientCountry: "United Arab Emirates",
    caseId: "CAS-2026-088",
    specialty: "Cardiology & Cardiac Surgery",
    service: "Off-Pump Coronary Artery Bypass (CABG)",
    hospital: "Aster Medcity, Kochi",
    doctor: "Dr. Muralidharan V. Nair",
    type: "SECOND_OPINION_TELEHEALTH",
    dateTime: "2026-09-14 11:30 IST",
    preferredTime: "11:30 IST",
    status: "SCHEDULED",
    meetLink: "https://meet.google.com/xyz-maides-102",
    notes: "Cardiac catheterization report and bypass surgical navigation planning.",
    createdAt: "2026-09-03 09:00",
    updatedAt: "2026-09-03 16:30",
    consultationFeeUsd: 65,
    consultationFeeInr: 5400,
    history: [
      { status: "REQUESTED", timestamp: "2026-09-03 09:00", updatedBy: "Public Patient" },
      { status: "APPROVED", timestamp: "2026-09-03 12:00", updatedBy: "Admin Hub" },
      { status: "SCHEDULED", timestamp: "2026-09-03 16:30", updatedBy: "Admin Hub", notes: "Telehealth room configured" }
    ]
  },
  {
    id: "APT-2026-103",
    patient: "Elena Rostova",
    patientEmail: "elena.rostova@mail.ru",
    patientPhone: "+7 916 123 4567",
    patientCountry: "Russia",
    caseId: "CAS-2026-085",
    specialty: "Classical Ayurveda & Panchakarma",
    service: "Authentic 21-Day Panchakarma Detox",
    hospital: "Arya Vaidya Sala Kottakkal",
    doctor: "Aryavaidyan Dr. K. M. Namboothiri",
    type: "POST_OP_FOLLOWUP",
    dateTime: "2026-09-12 16:00 IST",
    preferredTime: "16:00 IST",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/xyz-maides-103",
    notes: "Review of herbal formulations and convalescence diet in Kottakkal.",
    createdAt: "2026-09-01 11:00",
    updatedAt: "2026-09-02 09:15",
    consultationFeeUsd: 35,
    consultationFeeInr: 2900,
    history: [
      { status: "REQUESTED", timestamp: "2026-09-01 11:00", updatedBy: "Public Patient" },
      { status: "CONFIRMED", timestamp: "2026-09-02 09:15", updatedBy: "Admin Hub" }
    ]
  },
  {
    id: "APT-2026-104",
    patient: "John O'Connor",
    patientEmail: "john.oconnor@aushealth.com.au",
    patientPhone: "+61 412 345 678",
    patientCountry: "Australia",
    caseId: "CAS-2026-092",
    specialty: "Oncology & Cancer Care",
    service: "Comprehensive Medical Oncology & Immunotherapy",
    hospital: "VPS Lakeshore Hospital, Kochi",
    doctor: "Dr. Deepa Pillai",
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-08 09:00 IST",
    preferredTime: "09:00 IST",
    status: "REQUESTED",
    meetLink: "https://meet.google.com/xyz-maides-104",
    notes: "Discussion of targeted immunotherapy fractions and medical visa clearance.",
    createdAt: "2026-09-04 08:30",
    updatedAt: "2026-09-04 08:30",
    consultationFeeUsd: 70,
    consultationFeeInr: 5800,
    history: [
      { status: "REQUESTED", timestamp: "2026-09-04 08:30", updatedBy: "Landing Page Booking" }
    ]
  }
];

const DEFAULT_SPECIALTIES = [
  "Cardiology & Cardiac Surgery",
  "Orthopaedics & Joint Replacement",
  "Neurology & Spine Surgery",
  "Classical Ayurveda & Panchakarma",
  "Oncology & Cancer Care",
  "Gastroenterology & Hepatology",
  "Urology & Nephrology",
  "Fertility & Reproductive Medicine (IVF)"
];

const DEFAULT_HOSPITALS = [
  "Aster Medcity, Kochi",
  "Amrita Institute of Medical Sciences",
  "Rajagiri Hospital, Aluva",
  "Arya Vaidya Sala Kottakkal",
  "VPS Lakeshore Hospital, Kochi",
  "KIMSHEALTH, Trivandrum",
  "Somatheeram Ayurvedic Village"
];

const DEFAULT_DOCTORS = [
  { name: "Dr. Muralidharan V. Nair", specialty: "Cardiology & Cardiac Surgery", hospital: "Aster Medcity, Kochi" },
  { name: "Dr. Alexander K. George", specialty: "Orthopaedics & Joint Replacement", hospital: "Rajagiri Hospital, Aluva" },
  { name: "Dr. K. Suresh Kumar", specialty: "Neurology & Spine Surgery", hospital: "KIMSHEALTH, Trivandrum" },
  { name: "Aryavaidyan Dr. K. M. Namboothiri", specialty: "Classical Ayurveda & Panchakarma", hospital: "Arya Vaidya Sala Kottakkal" },
  { name: "Dr. Arya Varma", specialty: "Classical Ayurveda & Panchakarma", hospital: "Somatheeram Ayurvedic Village" },
  { name: "Dr. Deepa Pillai", specialty: "Oncology & Cancer Care", hospital: "VPS Lakeshore Hospital, Kochi" }
];

const STATUS_BADGES: Record<AppointmentStatus, { bg: string; text: string; border: string }> = {
  REQUESTED: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/30" },
  UNDER_REVIEW: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/30" },
  APPROVED: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/30" },
  SCHEDULED: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/30" },
  CONFIRMED: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/30" },
  COMPLETED: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/30" },
  CANCELLED: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/30" },
  REJECTED: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/30" },
  RESCHEDULED: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/30" },
  NO_SHOW: { bg: "bg-slate-700/30", text: "text-slate-400", border: "border-slate-700" }
};

export default function AppointmentManagementPage() {
  const [appointments, setAppointments] = useState<AppointmentItem[]>(INITIAL_APPOINTMENTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("ALL");
  const [hospitalFilter, setHospitalFilter] = useState<string>("ALL");

  // Sister Admin Stores
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>(DEFAULT_SPECIALTIES);
  const [availableHospitals, setAvailableHospitals] = useState<string[]>(DEFAULT_HOSPITALS);
  const [availableDoctors, setAvailableDoctors] = useState<any[]>(DEFAULT_DOCTORS);
  const [availablePackages, setAvailablePackages] = useState<any[]>([]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);

  const [activeAppointment, setActiveAppointment] = useState<AppointmentItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<AppointmentItem>>({
    patient: "",
    patientEmail: "",
    patientPhone: "",
    patientCountry: "International Patient",
    caseId: "CAS-2026-089",
    specialty: DEFAULT_SPECIALTIES[0],
    service: "Specialist Consultation",
    hospital: DEFAULT_HOSPITALS[0],
    doctor: DEFAULT_DOCTORS[0].name,
    type: "VIDEO_CONSULTATION",
    dateTime: "2026-09-18 11:00 IST",
    status: "CONFIRMED",
    meetLink: "https://meet.google.com/xyz-maides-live",
    notes: ""
  });

  const [rescheduleData, setRescheduleData] = useState({
    newDateTime: "2026-09-20 14:00 IST",
    newDoctor: "",
    newHospital: "",
    reason: ""
  });

  const [cancelReason, setCancelReason] = useState("");

  // Load and Hydrate Sister Stores
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Load Appointments
      const saved = localStorage.getItem("maides_admin_appointments");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            // Normalize entries
            const normalized = parsed.map((a: any) => ({
              ...a,
              specialty: a.specialty || "Specialty Consultation",
              service: a.service || a.treatment || "Specialist Clinical Review",
              patientEmail: a.patientEmail || a.email || "patient@example.com",
              patientPhone: a.patientPhone || a.phone || "+971 50 123 4567",
              patientCountry: a.patientCountry || a.country || "International",
              consultationFeeUsd: a.consultationFeeUsd || 50,
              consultationFeeInr: a.consultationFeeInr || 4200,
              createdAt: a.createdAt || "2026-09-04 10:00",
              updatedAt: a.updatedAt || new Date().toISOString().replace('T', ' ').substring(0, 16),
              history: Array.isArray(a.history) && a.history.length > 0 ? a.history : [
                { status: a.status || "REQUESTED", timestamp: a.createdAt || "2026-09-04 10:00", updatedBy: "System" }
              ]
            }));
            setAppointments(normalized);
          }
        } catch (e) {
          console.error("Failed to load appointments", e);
        }
      }

      // 2. Cross-link Doctors
      const storedDocs = localStorage.getItem("maides_admin_doctors");
      if (storedDocs) {
        try {
          const parsedDocs = JSON.parse(storedDocs);
          if (Array.isArray(parsedDocs) && parsedDocs.length > 0) {
            setAvailableDoctors(parsedDocs.map((d: any) => ({
              name: d.name,
              specialty: d.specialty,
              hospital: d.hospital
            })));
          }
        } catch (e) {}
      }

      // 3. Cross-link Hospitals
      const storedHosps = localStorage.getItem("maides_admin_hospitals");
      if (storedHosps) {
        try {
          const parsedHosps = JSON.parse(storedHosps);
          if (Array.isArray(parsedHosps) && parsedHosps.length > 0) {
            const hNames = parsedHosps.map((h: any) => h.name);
            setAvailableHospitals(Array.from(new Set([...hNames, ...DEFAULT_HOSPITALS])));
          }
        } catch (e) {}
      }

      // 4. Cross-link Specialties
      const storedSpecs = localStorage.getItem("maides_admin_specialties");
      if (storedSpecs) {
        try {
          const parsedSpecs = JSON.parse(storedSpecs);
          if (Array.isArray(parsedSpecs) && parsedSpecs.length > 0) {
            const sNames = parsedSpecs.map((s: any) => s.name);
            setAvailableSpecialties(Array.from(new Set([...sNames, ...DEFAULT_SPECIALTIES])));
          }
        } catch (e) {}
      }

      // 5. Cross-link Packages
      const storedPkgs = localStorage.getItem("maides_admin_packages");
      if (storedPkgs) {
        try {
          const parsedPkgs = JSON.parse(storedPkgs);
          if (Array.isArray(parsedPkgs) && parsedPkgs.length > 0) {
            setAvailablePackages(parsedPkgs);
          }
        } catch (e) {}
      }
    }
  }, []);

  const saveAppointmentsToStorage = (updated: AppointmentItem[]) => {
    setAppointments(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_admin_appointments", JSON.stringify(updated));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Filtered Doctors based on selected Hospital & Specialty
  const filteredDoctorsForForm = useMemo(() => {
    return availableDoctors.filter(d => {
      const matchHosp = !formData.hospital || d.hospital === formData.hospital || d.hospital.includes(formData.hospital);
      const matchSpec = !formData.specialty || d.specialty === formData.specialty || d.specialty.includes(formData.specialty);
      return matchHosp && matchSpec;
    });
  }, [availableDoctors, formData.hospital, formData.specialty]);

  // Validation
  const validateForm = (): boolean => {
    if (!formData.patient || !formData.patient.trim()) {
      setFormError("Patient full name is required.");
      return false;
    }
    if (!formData.doctor) {
      setFormError("Attending specialist doctor is required.");
      return false;
    }
    if (!formData.hospital) {
      setFormError("Partner hospital location is required.");
      return false;
    }
    if (!formData.dateTime || !formData.dateTime.trim()) {
      setFormError("Appointment date & time must be specified.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Open Create Modal
  const handleOpenAdd = () => {
    setFormError(null);
    const randomCase = "CAS-2026-0" + Math.floor(80 + Math.random() * 20);
    const initialDoc = availableDoctors[0] || DEFAULT_DOCTORS[0];
    setFormData({
      patient: "",
      patientEmail: "",
      patientPhone: "",
      patientCountry: "International Patient",
      caseId: randomCase,
      specialty: initialDoc.specialty || availableSpecialties[0],
      service: "Specialist Clinical Consultation",
      hospital: initialDoc.hospital || availableHospitals[0],
      doctor: initialDoc.name,
      type: "VIDEO_CONSULTATION",
      dateTime: "2026-09-18 11:00 IST",
      status: "CONFIRMED",
      meetLink: `https://meet.google.com/xyz-maides-${Math.floor(100 + Math.random() * 900)}`,
      notes: "Direct booking arranged via Admin Coordination Hub.",
      consultationFeeUsd: 50,
      consultationFeeInr: 4200
    });
    setIsAddModalOpen(true);
  };

  // Create Appointment
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const newId = `APT-2026-${String(appointments.length + 105).padStart(3, "0")}`;
    const newApt: AppointmentItem = {
      id: newId,
      patient: formData.patient!.trim(),
      patientEmail: formData.patientEmail || "patient@example.com",
      patientPhone: formData.patientPhone || "+971 50 123 4567",
      patientCountry: formData.patientCountry || "International",
      caseId: formData.caseId || `CAS-2026-0${Math.floor(85 + Math.random() * 10)}`,
      specialty: formData.specialty || availableSpecialties[0],
      service: formData.service || "Specialist Clinical Consultation",
      hospital: formData.hospital || availableHospitals[0],
      doctor: formData.doctor || availableDoctors[0]?.name || "Dr. Muralidharan V. Nair",
      type: formData.type || "VIDEO_CONSULTATION",
      dateTime: formData.dateTime!,
      status: formData.status || "CONFIRMED",
      meetLink: formData.meetLink || `https://meet.google.com/xyz-maides-${Math.floor(100 + Math.random() * 900)}`,
      notes: formData.notes || "Clinical consultation scheduled via Admin Hub.",
      createdAt: now,
      updatedAt: now,
      consultationFeeUsd: Number(formData.consultationFeeUsd) || 50,
      consultationFeeInr: Number(formData.consultationFeeInr) || 4200,
      history: [
        { status: formData.status || "CONFIRMED", timestamp: now, updatedBy: "Admin Hub", notes: "Appointment created" }
      ]
    };

    const updated = [newApt, ...appointments];
    saveAppointmentsToStorage(updated);
    setIsAddModalOpen(false);
    showToast(`Appointment ${newId} scheduled for ${newApt.patient}!`);
  };

  // Open Edit
  const handleOpenEdit = (apt: AppointmentItem) => {
    setFormError(null);
    setActiveAppointment(apt);
    setFormData({ ...apt });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointment || !validateForm()) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const statusChanged = formData.status !== activeAppointment.status;

    const updated = appointments.map((a) => {
      if (a.id === activeAppointment.id) {
        const historyList = [...(a.history || [])];
        if (statusChanged && formData.status) {
          historyList.push({
            status: formData.status,
            timestamp: now,
            updatedBy: "Admin Hub",
            notes: `Status changed to ${formData.status}`
          });
        }
        return {
          ...a,
          ...formData,
          updatedAt: now,
          history: historyList
        } as AppointmentItem;
      }
      return a;
    });

    saveAppointmentsToStorage(updated);
    setIsEditModalOpen(false);
    showToast(`Appointment ${activeAppointment.id} updated successfully!`);
  };

  // Status Transitions
  const handleTransitionStatus = (apt: AppointmentItem, newStatus: AppointmentStatus, transitionNote?: string) => {
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = appointments.map((a) => {
      if (a.id === apt.id) {
        const historyList = [...(a.history || [])];
        historyList.push({
          status: newStatus,
          timestamp: now,
          updatedBy: "Admin Hub",
          notes: transitionNote || `Status updated to ${newStatus}`
        });
        return {
          ...a,
          status: newStatus,
          updatedAt: now,
          history: historyList
        } as AppointmentItem;
      }
      return a;
    });

    saveAppointmentsToStorage(updated);
    showToast(`Appointment ${apt.id} marked as ${newStatus}`);
  };

  // Open Reschedule Modal
  const handleOpenReschedule = (apt: AppointmentItem) => {
    setActiveAppointment(apt);
    setRescheduleData({
      newDateTime: apt.dateTime,
      newDoctor: apt.doctor,
      newHospital: apt.hospital,
      reason: "Patient requested timing adjustment"
    });
    setIsRescheduleModalOpen(true);
  };

  // Submit Reschedule
  const handleConfirmReschedule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointment) return;

    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = appointments.map((a) => {
      if (a.id === activeAppointment.id) {
        const historyList = [...(a.history || [])];
        historyList.push({
          status: "RESCHEDULED",
          timestamp: now,
          updatedBy: "Admin Hub",
          previousDate: a.dateTime,
          notes: `Rescheduled to ${rescheduleData.newDateTime}. Reason: ${rescheduleData.reason}`
        });
        return {
          ...a,
          dateTime: rescheduleData.newDateTime,
          doctor: rescheduleData.newDoctor || a.doctor,
          hospital: rescheduleData.newHospital || a.hospital,
          status: "SCHEDULED" as AppointmentStatus,
          rescheduleReason: rescheduleData.reason,
          updatedAt: now,
          history: historyList
        } as AppointmentItem;
      }
      return a;
    });

    saveAppointmentsToStorage(updated);
    setIsRescheduleModalOpen(false);
    showToast(`Appointment ${activeAppointment.id} rescheduled to ${rescheduleData.newDateTime}`);
  };

  // Open Cancel Modal
  const handleOpenCancel = (apt: AppointmentItem) => {
    setActiveAppointment(apt);
    setCancelReason("Patient requested cancellation due to revised travel itinerary");
    setIsCancelModalOpen(true);
  };

  // Confirm Cancel
  const handleConfirmCancel = () => {
    if (!activeAppointment) return;
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);
    const updated = appointments.map((a) => {
      if (a.id === activeAppointment.id) {
        const historyList = [...(a.history || [])];
        historyList.push({
          status: "CANCELLED",
          timestamp: now,
          updatedBy: "Admin Hub",
          notes: `Cancelled. Reason: ${cancelReason}`
        });
        return { 
          ...a, 
          status: "CANCELLED" as AppointmentStatus, 
          cancellationReason: cancelReason,
          updatedAt: now,
          history: historyList
        };
      }
      return a;
    });
    saveAppointmentsToStorage(updated);
    setIsCancelModalOpen(false);
    showToast(`Appointment ${activeAppointment.id} has been cancelled.`);
  };

  // Connect to Medical Case / Invoicing Pipeline
  const handleCreateCaseFromAppointment = (apt: AppointmentItem) => {
    if (typeof window !== "undefined") {
      const existingCases = localStorage.getItem("maides_admin_cases");
      let caseList = [];
      if (existingCases) {
        try { caseList = JSON.parse(existingCases); } catch(e){}
      }

      const newCase = {
        id: apt.caseId || `CAS-2026-0${Math.floor(80 + Math.random() * 20)}`,
        patientName: apt.patient,
        patientCountry: apt.patientCountry || "International",
        specialty: apt.specialty,
        assignedDoctor: apt.doctor,
        assignedHospital: apt.hospital,
        treatment: apt.service,
        status: "ACTIVE_INPATIENT",
        consultationId: apt.id,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem("maides_admin_cases", JSON.stringify([newCase, ...caseList]));
      showToast(`Medical Case ${newCase.id} successfully created and linked to ${apt.patient}!`);
    }
  };

  // Filter & Search
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        apt.patient.toLowerCase().includes(q) ||
        apt.id.toLowerCase().includes(q) ||
        apt.doctor.toLowerCase().includes(q) ||
        apt.hospital.toLowerCase().includes(q) ||
        apt.specialty.toLowerCase().includes(q) ||
        apt.service.toLowerCase().includes(q) ||
        (apt.caseId && apt.caseId.toLowerCase().includes(q));

      const matchesStatus = statusFilter === "ALL" || apt.status === statusFilter;
      const matchesSpec = specialtyFilter === "ALL" || apt.specialty === specialtyFilter;
      const matchesHosp = hospitalFilter === "ALL" || apt.hospital === hospitalFilter;

      return matchesSearch && matchesStatus && matchesSpec && matchesHosp;
    });
  }, [appointments, searchTerm, statusFilter, specialtyFilter, hospitalFilter]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = appointments.length;
    const pending = appointments.filter(a => a.status === "REQUESTED" || a.status === "UNDER_REVIEW").length;
    const confirmed = appointments.filter(a => a.status === "CONFIRMED" || a.status === "SCHEDULED" || a.status === "APPROVED").length;
    const completed = appointments.filter(a => a.status === "COMPLETED").length;
    const cancelled = appointments.filter(a => a.status === "CANCELLED" || a.status === "REJECTED").length;
    return { total, pending, confirmed, completed, cancelled };
  }, [appointments]);

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <CalendarCheck2 className="w-5 h-5 text-[#0E82FD]" />
            Appointment & Specialist Consultation Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming consultation requests, enforce Doctor-Hospital-Specialty associations, manage status pipelines, and synchronize with patient portals.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/patient/appointments"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#0E82FD]" />
            <span>Patient Portal View</span>
          </Link>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Consultation</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Bookings</span>
            <CalendarIcon className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-1">All appointments</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Pending Review</span>
            <Clock4 className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.pending}</div>
          <div className="text-[10px] text-amber-400/80 mt-1">Requires coordinator review</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Confirmed / Active</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.confirmed}</div>
          <div className="text-[10px] text-slate-400 mt-1">Ready for consultation</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Completed</span>
            <Sparkles className="w-4 h-4 text-green-400" />
          </div>
          <div className="text-2xl font-black text-green-400">{stats.completed}</div>
          <div className="text-[10px] text-slate-400 mt-1">Cases transitioned</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Cancelled / No-show</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-rose-400">{stats.cancelled}</div>
          <div className="text-[10px] text-slate-400 mt-1">Slots released</div>
        </div>
      </div>

      {/* Filter & Search Controls */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search patient, doctor, hospital, case, ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Statuses</option>
              <option value="REQUESTED">REQUESTED (New Lead)</option>
              <option value="UNDER_REVIEW">UNDER REVIEW</option>
              <option value="APPROVED">APPROVED</option>
              <option value="SCHEDULED">SCHEDULED</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="RESCHEDULED">RESCHEDULED</option>
              <option value="CANCELLED">CANCELLED</option>
              <option value="NO_SHOW">NO SHOW</option>
            </select>
          </div>

          {/* Specialty Filter */}
          <div>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Specialties</option>
              {availableSpecialties.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Hospital Filter */}
          <div>
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Hospitals</option>
              {availableHospitals.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80">
          <span>Showing <strong className="text-white">{filteredAppointments.length}</strong> of {appointments.length} consultations</span>
          <span className="text-[11px] text-slate-500">Live synchronized with sister modules</span>
        </div>
      </div>

      {/* Appointments Master Table */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-semibold">
                <th className="py-3.5 px-4">Appointment & Date</th>
                <th className="py-3.5 px-4">Patient & Case</th>
                <th className="py-3.5 px-4">Specialty & Service</th>
                <th className="py-3.5 px-4">Hospital & Doctor</th>
                <th className="py-3.5 px-4 text-center">Status Flow</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No consultation records found matching your filters.
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((apt) => {
                  const badge = STATUS_BADGES[apt.status] || { bg: "bg-slate-800", text: "text-slate-300", border: "border-slate-700" };
                  return (
                    <tr key={apt.id} className="hover:bg-slate-950/40 transition-colors group">
                      {/* ID & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <CalendarIcon className="w-3.5 h-3.5 text-[#0E82FD]" />
                          <span>{apt.dateTime}</span>
                        </div>
                        <div className="text-[11px] text-blue-400 font-mono mt-0.5">{apt.id}</div>
                      </td>

                      {/* Patient & Case */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-200 group-hover:text-[#0E82FD] transition-colors">
                          {apt.patient}
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                          <span className="font-mono text-emerald-400">{apt.caseId}</span>
                          <span>•</span>
                          <span>{apt.patientCountry}</span>
                        </div>
                      </td>

                      {/* Specialty & Service */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 truncate max-w-[200px]">
                          {apt.service}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">
                          {apt.specialty}
                        </div>
                      </td>

                      {/* Hospital & Doctor */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium flex items-center gap-1">
                          <Stethoscope className="w-3 h-3 text-[#0E82FD]" />
                          <span>{apt.doctor}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate max-w-[200px]">
                          <Building2 className="w-3 h-3 text-slate-500" />
                          <span>{apt.hospital}</span>
                        </div>
                      </td>

                      {/* Status Flow Badge */}
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {apt.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Workflow Action Buttons */}
                          {apt.status === "REQUESTED" && (
                            <button
                              onClick={() => handleTransitionStatus(apt, "APPROVED", "Approved by coordinator")}
                              title="Approve Request"
                              className="px-2 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-[10px] font-bold transition"
                            >
                              Approve
                            </button>
                          )}

                          {apt.status === "APPROVED" && (
                            <button
                              onClick={() => handleTransitionStatus(apt, "CONFIRMED", "Confirmed schedule")}
                              title="Confirm Appointment"
                              className="px-2 py-1 rounded-lg bg-blue-500/10 hover:bg-[#0E82FD] text-blue-400 hover:text-white border border-blue-500/30 text-[10px] font-bold transition"
                            >
                              Confirm
                            </button>
                          )}

                          {apt.status === "CONFIRMED" && (
                            <button
                              onClick={() => handleTransitionStatus(apt, "COMPLETED", "Consultation completed")}
                              title="Mark Completed"
                              className="px-2 py-1 rounded-lg bg-green-500/10 hover:bg-green-600 text-green-400 hover:text-white border border-green-500/30 text-[10px] font-bold transition"
                            >
                              Complete
                            </button>
                          )}

                          {/* Action Dossier Buttons */}
                          <button
                            onClick={() => {
                              setActiveAppointment(apt);
                              setIsViewModalOpen(true);
                            }}
                            title="View Full Consultation Dossier & History"
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-[#0E82FD] text-slate-300 hover:text-white transition border border-slate-800"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenReschedule(apt)}
                            title="Reschedule Appointment"
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-amber-600 text-slate-300 hover:text-white transition border border-slate-800"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleOpenEdit(apt)}
                            title="Edit Details"
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-[#0E82FD] text-slate-300 hover:text-white transition border border-slate-800"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>

                          {apt.status !== "CANCELLED" && (
                            <button
                              onClick={() => handleOpenCancel(apt)}
                              title="Cancel Consultation"
                              className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-600 text-slate-300 hover:text-white transition border border-slate-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
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
      {/* CREATE APPOINTMENT MODAL                                                  */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0E82FD]" />
                Schedule Specialist Consultation
              </h2>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Patient Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Full name..."
                    value={formData.patient || ""}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="patient@example.com"
                    value={formData.patientEmail || ""}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Phone / WhatsApp
                  </label>
                  <input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={formData.patientPhone || ""}
                    onChange={(e) => setFormData({ ...formData, patientPhone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    placeholder="UAE, UK, USA, etc."
                    value={formData.patientCountry || ""}
                    onChange={(e) => setFormData({ ...formData, patientCountry: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              {/* Specialty & Hospital */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Specialty <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.specialty || availableSpecialties[0]}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableSpecialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Partner Hospital <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.hospital || availableHospitals[0]}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableHospitals.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Doctor & Service */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Attending Doctor <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.doctor || (filteredDoctorsForForm[0]?.name || availableDoctors[0]?.name)}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {filteredDoctorsForForm.length > 0 ? (
                      filteredDoctorsForForm.map(d => (
                        <option key={d.name} value={d.name}>{d.name} ({d.specialty})</option>
                      ))
                    ) : (
                      availableDoctors.map(d => (
                        <option key={d.name} value={d.name}>{d.name}</option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Consultation Procedure / Service
                  </label>
                  <input
                    type="text"
                    value={formData.service || ""}
                    onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                    placeholder="e.g. Cardiac Bypass Consultation"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              {/* Mode & Date/Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Consultation Mode
                  </label>
                  <select
                    value={formData.type || "VIDEO_CONSULTATION"}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="VIDEO_CONSULTATION">Live Video Telehealth</option>
                    <option value="SECOND_OPINION_TELEHEALTH">Second Opinion Evaluation</option>
                    <option value="IN_PERSON_SURGICAL_CONSULT">In-Person Hospital OPD</option>
                    <option value="POST_OP_FOLLOWUP">Post-Operative Followup</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Date & Time <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dateTime || "2026-09-18 11:00 IST"}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Initial Status
                  </label>
                  <select
                    value={formData.status || "CONFIRMED"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="REQUESTED">REQUESTED</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Clinical & Logistical Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Patient background, preliminary diagnoses, questions..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold shadow-lg shadow-blue-500/20"
                >
                  Schedule Consultation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL                                                                */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#0E82FD]" />
                Edit Consultation — {activeAppointment.id}
              </h2>
              <button onClick={() => setIsEditModalOpen(false)} className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.patient || ""}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Status Pipeline
                  </label>
                  <select
                    value={formData.status || "CONFIRMED"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="REQUESTED">REQUESTED</option>
                    <option value="UNDER_REVIEW">UNDER_REVIEW</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="RESCHEDULED">RESCHEDULED</option>
                    <option value="CANCELLED">CANCELLED</option>
                    <option value="NO_SHOW">NO_SHOW</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Attending Doctor
                  </label>
                  <select
                    value={formData.doctor || availableDoctors[0]?.name}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableDoctors.map(d => (
                      <option key={d.name} value={d.name}>{d.name} ({d.specialty})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Hospital Location
                  </label>
                  <select
                    value={formData.hospital || availableHospitals[0]}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableHospitals.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Date & Time
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dateTime || ""}
                    onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Telehealth Room URL
                  </label>
                  <input
                    type="text"
                    value={formData.meetLink || ""}
                    onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Clinical Notes
                </label>
                <textarea
                  rows={2}
                  value={formData.notes || ""}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* RESCHEDULE MODAL (PRESERVES AUDIT HISTORY)                                */}
      {/* ========================================================================= */}
      {isRescheduleModalOpen && activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-400" />
                Reschedule Appointment — {activeAppointment.id}
              </h2>
              <button onClick={() => setIsRescheduleModalOpen(false)} className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="text-slate-400">Current Slot: <strong className="text-white">{activeAppointment.dateTime}</strong></div>
              <div className="text-slate-400">Patient: <strong className="text-white">{activeAppointment.patient}</strong> ({activeAppointment.doctor})</div>
            </div>

            <form onSubmit={handleConfirmReschedule} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  New Appointment Date & Time *
                </label>
                <input
                  type="text"
                  required
                  value={rescheduleData.newDateTime}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, newDateTime: e.target.value })}
                  placeholder="e.g. 2026-09-22 15:30 IST"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Rescheduling Reason / Justification *
                </label>
                <textarea
                  rows={2}
                  required
                  value={rescheduleData.reason}
                  onChange={(e) => setRescheduleData({ ...rescheduleData, reason: e.target.value })}
                  placeholder="e.g. Doctor in emergency OT / Patient flight postponed..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              <p className="text-[11px] text-slate-400">
                Rescheduling will preserve previous appointment timestamps in the consultation audit trail and alert the patient portal.
              </p>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsRescheduleModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-lg shadow-amber-600/20"
                >
                  Confirm Reschedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW DOSSIER & HISTORY MODAL                                              */}
      {/* ========================================================================= */}
      {isViewModalOpen && activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-blue-400">{activeAppointment.id}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${STATUS_BADGES[activeAppointment.status]?.bg} ${STATUS_BADGES[activeAppointment.status]?.text}`}>
                  {activeAppointment.status}
                </span>
              </div>
              <button onClick={() => setIsViewModalOpen(false)} className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Patient</span>
                <span className="font-bold text-white">{activeAppointment.patient}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Date & Time</span>
                <span className="font-bold text-emerald-400">{activeAppointment.dateTime}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Case Reference</span>
                <span className="font-mono text-blue-300">{activeAppointment.caseId}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-400 block">Consultation Fee</span>
                <span className="font-bold text-white">${activeAppointment.consultationFeeUsd} (₹{activeAppointment.consultationFeeInr})</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Stethoscope className="w-4 h-4 text-[#0E82FD]" />
                <span>Specialist: <strong>{activeAppointment.doctor}</strong> ({activeAppointment.specialty})</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-4 h-4 text-[#0E82FD]" />
                <span>Hospital: <strong>{activeAppointment.hospital}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>Contact: {activeAppointment.patientPhone || "N/A"} • {activeAppointment.patientEmail || "N/A"}</span>
              </div>
              {activeAppointment.meetLink && (
                <div className="flex items-center gap-2 text-slate-300">
                  <Video className="w-4 h-4 text-blue-400" />
                  <span>Telehealth: <a href={activeAppointment.meetLink} target="_blank" rel="noreferrer" className="text-[#0E82FD] hover:underline font-mono">{activeAppointment.meetLink}</a></span>
                </div>
              )}
            </div>

            {/* Audit Trail & History */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Status Transition History</span>
              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {(activeAppointment.history || []).map((h, i) => (
                  <div key={i} className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs flex items-center justify-between">
                    <div>
                      <span className="font-bold text-white">{h.status}</span>
                      {h.notes && <span className="text-slate-400 ml-2">— {h.notes}</span>}
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono">{h.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Integration Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleCreateCaseFromAppointment(activeAppointment)}
                className="px-3 py-1.5 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 hover:bg-purple-600 hover:text-white text-xs font-semibold transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Link to Medical Case</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEdit(activeAppointment);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition"
                >
                  Edit Appointment
                </button>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* CANCEL MODAL                                                              */}
      {/* ========================================================================= */}
      {isCancelModalOpen && activeAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Cancel Consultation</h3>
                <p className="text-xs text-slate-400">Mark status as CANCELLED and free up slot</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="font-bold text-white">{activeAppointment.patient} ({activeAppointment.id})</div>
              <div className="text-slate-400">{activeAppointment.doctor} • {activeAppointment.hospital}</div>
              <div className="text-amber-400">{activeAppointment.dateTime}</div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Cancellation Reason
              </label>
              <textarea
                rows={2}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-rose-500"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsCancelModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
              >
                Keep Active
              </button>
              <button
                onClick={handleConfirmCancel}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/20"
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
