"use client";

import React, { useState, useEffect, useMemo } from "react";
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
  Mail,
  Globe,
  DollarSign,
  FileText,
  Filter,
  Check,
  Power,
  Upload,
  ArrowUpDown,
  BookOpen,
  Send,
  MessageSquare
} from "lucide-react";

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  experienceYears: number;
  education: string;
  certifications?: string;
  consultationFee: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  gender?: "Male" | "Female" | "Other";
  avatar: string;
  casesHandled: number;
  rating: string;
  languages: string[];
  department?: string;
  displayOrder: number;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  published: "PUBLISHED" | "DRAFT";
  bio: string;
  fullBiography?: string;
  availableDays?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const INITIAL_DOCTORS: Doctor[] = [
  {
    id: "DOC-101",
    name: "Dr. Vijay Anand",
    title: "Senior Consultant & Head of Orthopedics",
    specialty: "Orthopaedics & Joint Replacement",
    hospital: "Aster Medcity, Kochi",
    experienceYears: 24,
    education: "MBBS, MS (Ortho), MCh (UK), Fellowship Joint Surgery",
    certifications: "FRCS (Glasgow), AAOS International Fellow",
    consultationFee: "$60 (₹5,000)",
    registrationNumber: "KMC-48291",
    phone: "+91 484 669 9999",
    email: "vijay.anand@astermedcity.com",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    casesHandled: 1420,
    rating: "4.95",
    languages: ["English", "Hindi", "Malayalam", "Arabic"],
    department: "Institute of Orthopaedics & Trauma",
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Pioneer in robotic total knee and hip replacements in South India with over 2,000+ joint surgeries performed for international patients.",
    fullBiography: "Dr. Vijay Anand has over 24 years of surgical experience in primary, complex, and revision joint replacement surgeries. Trained at apex institutes in the UK and USA, he heads the Robotic Joint Center.",
    availableDays: ["Monday", "Wednesday", "Friday"]
  },
  {
    id: "DOC-102",
    name: "Dr. K. S. Muralidharan",
    title: "Chief of Cardiothoracic & Vascular Surgery",
    specialty: "Cardiology & Cardiac Surgery",
    hospital: "Amrita Institute of Medical Sciences",
    experienceYears: 28,
    education: "MBBS, MS, MCh (CTVS), FACS (USA)",
    certifications: "FACS (USA), Fellow Adult Cardiac Surgery (Cleveland)",
    consultationFee: "$75 (₹6,200)",
    registrationNumber: "KMC-39102",
    phone: "+91 484 285 1234",
    email: "muralidharan.ks@amrita.edu",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    casesHandled: 2100,
    rating: "4.98",
    languages: ["English", "Hindi", "Tamil", "Malayalam"],
    department: "Center for Advanced Cardiac Sciences",
    displayOrder: 2,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Renowned cardiothoracic surgeon specializing in minimally invasive coronary bypass (CABG), valve repairs, and robotic pediatric cardiac reconstructions.",
    fullBiography: "Chief Cardiac Surgeon with 28+ years of groundbreaking cardiovascular care. Leader of the Heart Transplant and Minimally Invasive Thoracic unit.",
    availableDays: ["Tuesday", "Thursday", "Saturday"]
  },
  {
    id: "DOC-103",
    name: "Dr. Rajesh K.",
    title: "Lead Neuro & Spine Surgeon",
    specialty: "Neurology & Spine Surgery",
    hospital: "Rajagiri Hospital, Aluva",
    experienceYears: 19,
    education: "MBBS, MS, MCh (Neurosurgery), FINR (Zurich)",
    certifications: "EANS Certified, WFNS Member",
    consultationFee: "$65 (₹5,400)",
    registrationNumber: "KMC-55901",
    phone: "+91 484 290 5000",
    email: "dr.rajeshk@rajagirihospital.com",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
    casesHandled: 980,
    rating: "4.90",
    languages: ["English", "Hindi", "Malayalam"],
    department: "Institute of Neurosciences",
    displayOrder: 3,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Expert in endoscopic spinal decompression, microscopic brain tumor resections, and complex spinal fusion procedures.",
    fullBiography: "Specialized in keyhole neurosurgery, brain tumor resections with intraoperative neuromonitoring, and motion-preserving disc surgeries.",
    availableDays: ["Monday", "Tuesday", "Thursday"]
  },
  {
    id: "DOC-104",
    name: "Dr. Arya Varma",
    title: "Chief Ayurvedic Physician",
    specialty: "Classical Ayurveda & Panchakarma",
    hospital: "Somatheeram Ayurvedic Village",
    experienceYears: 16,
    education: "BAMS, MD (Ayurveda - Kayachikitsa)",
    certifications: "Ayush Gold Standard, Traditional Vaidya lineage",
    consultationFee: "$45 (₹3,700)",
    registrationNumber: "KTC-12845",
    phone: "+91 471 226 6501",
    email: "arya.varma@somatheeram.in",
    gender: "Female",
    avatar: "https://images.unsplash.com/photo-1594824813626-d64e9a0f074d?auto=format&fit=crop&w=600&q=80",
    casesHandled: 1850,
    rating: "4.92",
    languages: ["English", "German", "Malayalam"],
    department: "Integrative Wellness & Panchakarma",
    displayOrder: 4,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Classical Ayurveda scholar focusing on authentic Panchakarma detoxification, lifestyle disease reversal, and customized Ayurvedic rehabilitation protocols.",
    fullBiography: "A fifth-generation Ayurvedic practitioner bridging ancient Charaka Samhita wisdom with modern clinical evidence for chronic immune and metabolic ailments.",
    availableDays: ["Monday", "Wednesday", "Friday", "Saturday"]
  },
  {
    id: "DOC-105",
    name: "Dr. Deepa Pillai",
    title: "Senior Consultant Medical Oncologist",
    specialty: "Oncology & Cancer Care",
    hospital: "VPS Lakeshore Hospital, Kochi",
    experienceYears: 21,
    education: "MBBS, MD, DM (Medical Oncology), ESMO Certified",
    certifications: "ESMO Fellow, ASCO Member",
    consultationFee: "$70 (₹5,800)",
    registrationNumber: "KMC-41920",
    phone: "+91 484 270 1011",
    email: "deepa.pillai@lakeshorehospital.com",
    gender: "Female",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    casesHandled: 1640,
    rating: "4.94",
    languages: ["English", "Hindi", "Malayalam"],
    department: "Comprehensive Cancer Care Center",
    displayOrder: 5,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Leading oncologist in targeted molecular therapy, immunotherapy, and comprehensive solid tumor treatment.",
    fullBiography: "Renowned expert in precision oncology, next-generation genomic sequencing for cancer treatment, and personalized chemotherapy regimens.",
    availableDays: ["Monday", "Wednesday", "Thursday"]
  }
];

const COMMON_SPECIALTIES = [
  "Cardiology & Cardiac Surgery",
  "Orthopaedics & Joint Replacement",
  "Neurology & Spine Surgery",
  "Oncology & Cancer Care",
  "Classical Ayurveda & Panchakarma",
  "Gastroenterology & Hepatology",
  "Urology & Nephrology",
  "Fertility & Reproductive Medicine (IVF)",
  "Ophthalmology & Refractive Surgery",
  "Dental Surgery & Implants",
  "Cosmetic & Plastic Surgery"
];

const COMMON_HOSPITALS = [
  "Aster Medcity, Kochi",
  "Amrita Institute of Medical Sciences",
  "Rajagiri Hospital, Aluva",
  "VPS Lakeshore Hospital, Kochi",
  "Somatheeram Ayurvedic Village",
  "KIMSHEALTH, Trivandrum",
  "Apollo Adlux Hospital, Angamaly",
  "Baby Memorial Hospital, Calicut"
];

export default function DoctorManagementPage() {
  const [doctors, setDoctors] = useState<Doctor[]>(INITIAL_DOCTORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("ALL");
  const [hospitalFilter, setHospitalFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "ON_LEAVE" | "INACTIVE">("ALL");
  const [publishedFilter, setPublishedFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [sortBy, setSortBy] = useState<"order" | "name" | "experience" | "rating" | "cases">("order");
  
  // Available Specialties & Hospitals loaded from sister Admin stores
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>(COMMON_SPECIALTIES);
  const [availableHospitals, setAvailableHospitals] = useState<string[]>(COMMON_HOSPITALS);

  // Modals & Active State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);

  // Form State & Validation
  const [formData, setFormData] = useState<Partial<Doctor>>({
    name: "",
    title: "Senior Consultant Specialist",
    specialty: COMMON_SPECIALTIES[0],
    hospital: COMMON_HOSPITALS[0],
    experienceYears: 15,
    education: "MBBS, MS, MCh, Board Certified",
    certifications: "FRCS, American Board",
    consultationFee: "$60 (₹5,000)",
    registrationNumber: "KMC-45921",
    phone: "+91 484 669 9000",
    email: "doctor@hospital.org",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    casesHandled: 450,
    rating: "4.95",
    languages: ["English", "Malayalam", "Hindi"],
    department: "Center of Excellence",
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Senior medical specialist delivering advanced international patient consultations.",
    fullBiography: "Distinguished clinician with extensive surgical and diagnostic expertise, holding international fellowships and academic board appointments.",
    availableDays: ["Monday", "Wednesday", "Friday"]
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Load from Storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Doctors
      const stored = localStorage.getItem("maides_admin_doctors");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const normalized = parsed.map((d: any) => ({
              ...d,
              experienceYears: typeof d.experienceYears === "number" 
                ? d.experienceYears 
                : parseInt(d.experience) || 15,
              languages: Array.isArray(d.languages) 
                ? d.languages 
                : typeof d.languages === "string" 
                  ? d.languages.split(",").map((s: string) => s.trim()) 
                  : ["English", "Malayalam", "Hindi"],
              displayOrder: d.displayOrder || 99,
              published: d.published || "PUBLISHED",
              status: d.status || "ACTIVE",
              avatar: d.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"
            }));
            setDoctors(normalized);
          }
        } catch (e) {
          console.error("Failed to parse doctors", e);
        }
      }

      // 2. Cross-link Medical Specialties
      const storedSpecs = localStorage.getItem("maides_admin_specialties");
      if (storedSpecs) {
        try {
          const parsedSpecs = JSON.parse(storedSpecs);
          if (Array.isArray(parsedSpecs) && parsedSpecs.length > 0) {
            const specNames = parsedSpecs.map((s: any) => s.name);
            setAvailableSpecialties(Array.from(new Set([...specNames, ...COMMON_SPECIALTIES])));
          }
        } catch (e) {
          console.error("Failed to parse specialties", e);
        }
      }

      // 3. Cross-link Hospitals
      const storedHosps = localStorage.getItem("maides_admin_hospitals");
      if (storedHosps) {
        try {
          const parsedHosps = JSON.parse(storedHosps);
          if (Array.isArray(parsedHosps) && parsedHosps.length > 0) {
            const hospNames = parsedHosps.map((h: any) => h.name);
            setAvailableHospitals(Array.from(new Set([...hospNames, ...COMMON_HOSPITALS])));
          }
        } catch (e) {
          console.error("Failed to parse hospitals", e);
        }
      }
    }
  }, []);

  const saveDoctorsToStorage = (updated: Doctor[]) => {
    setDoctors(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_admin_doctors", JSON.stringify(updated));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Validation
  const validateForm = (): boolean => {
    if (!formData.name || !formData.name.trim()) {
      setFormError("Doctor full name is required.");
      return false;
    }
    if (formData.name.trim().length < 3) {
      setFormError("Doctor name must be at least 3 characters long.");
      return false;
    }
    if (typeof formData.experienceYears !== "number" || formData.experienceYears < 0) {
      setFormError("Clinical experience must be a non-negative number of years.");
      return false;
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    if (!formData.specialty) {
      setFormError("Please select a medical specialty.");
      return false;
    }
    if (!formData.hospital) {
      setFormError("Please select an affiliated hospital.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormError(null);
    const nextOrder = doctors.length ? Math.max(...doctors.map(d => d.displayOrder || 0)) + 1 : 1;
    const randomKmc = "KMC-" + Math.floor(10000 + Math.random() * 90000);
    setFormData({
      name: "",
      title: "Senior Consultant Specialist",
      specialty: availableSpecialties[0] || "Cardiology & Cardiac Surgery",
      hospital: availableHospitals[0] || "Aster Medcity, Kochi",
      experienceYears: 15,
      education: "MBBS, MS, MCh, Board Certified",
      certifications: "FRCS, American Board",
      consultationFee: "$60 (₹5,000)",
      registrationNumber: randomKmc,
      phone: "+91 484 669 9000",
      email: "doctor@hospital.org",
      gender: "Male",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      casesHandled: 450,
      rating: "4.95",
      languages: ["English", "Malayalam", "Hindi"],
      department: "Center of Excellence",
      displayOrder: nextOrder,
      status: "ACTIVE",
      published: "PUBLISHED",
      bio: "Senior medical specialist delivering advanced international patient consultations.",
      fullBiography: "Distinguished clinician with extensive surgical and diagnostic expertise, holding international fellowships and academic board appointments.",
      availableDays: ["Monday", "Wednesday", "Friday"]
    });
    setIsAddModalOpen(true);
  };

  // Open Edit
  const handleOpenEdit = (doc: Doctor) => {
    setFormError(null);
    setSelectedDoctor(doc);
    setFormData({ ...doc });
    setIsEditModalOpen(true);
  };

  // Open View
  const handleOpenView = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setIsViewModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (doc: Doctor) => {
    setSelectedDoctor(doc);
    setIsDeleteModalOpen(true);
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newDoc: Doctor = {
      id: "DOC-" + Math.floor(100 + Math.random() * 900),
      name: formData.name!.trim(),
      title: formData.title || "Senior Consultant",
      specialty: formData.specialty || availableSpecialties[0],
      hospital: formData.hospital || availableHospitals[0],
      experienceYears: Number(formData.experienceYears) || 0,
      education: formData.education || "MBBS, MD",
      certifications: formData.certifications || "Board Certified",
      consultationFee: formData.consultationFee || "$60 (₹5,000)",
      registrationNumber: formData.registrationNumber || "KMC-" + Math.floor(10000 + Math.random() * 90000),
      phone: formData.phone || "+91 484 669 9000",
      email: formData.email || "doctor@hospital.org",
      gender: formData.gender || "Male",
      avatar: formData.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      casesHandled: Number(formData.casesHandled) || 0,
      rating: formData.rating || "4.95",
      languages: formData.languages && formData.languages.length > 0 ? formData.languages : ["English", "Malayalam"],
      department: formData.department || "Clinical Faculty",
      displayOrder: Number(formData.displayOrder) || (doctors.length + 1),
      status: formData.status || "ACTIVE",
      published: formData.published || "PUBLISHED",
      bio: formData.bio || "Senior clinical consultant at accredited medical hospital.",
      fullBiography: formData.fullBiography || formData.bio || "",
      availableDays: formData.availableDays || ["Monday", "Wednesday", "Friday"],
      createdAt: new Date().toISOString()
    };

    const updated = [newDoc, ...doctors];
    saveDoctorsToStorage(updated);
    setIsAddModalOpen(false);
    showToast(`Dr. ${newDoc.name} created and added to clinical directory!`);
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoctor || !validateForm()) return;

    const updated = doctors.map(d => {
      if (d.id === selectedDoctor.id) {
        return {
          ...d,
          ...formData,
          name: formData.name!.trim(),
          experienceYears: Number(formData.experienceYears) || 0,
          displayOrder: Number(formData.displayOrder) || d.displayOrder,
          casesHandled: Number(formData.casesHandled) || d.casesHandled,
          updatedAt: new Date().toISOString()
        } as Doctor;
      }
      return d;
    });

    saveDoctorsToStorage(updated);
    setIsEditModalOpen(false);
    showToast(`Profile for Dr. ${formData.name} updated successfully!`);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedDoctor) return;
    const updated = doctors.filter(d => d.id !== selectedDoctor.id);
    saveDoctorsToStorage(updated);
    setIsDeleteModalOpen(false);
    showToast(`Dr. ${selectedDoctor.name} removed from clinical faculty list.`);
    setSelectedDoctor(null);
  };

  // Quick Toggle Status
  const handleToggleStatus = (doc: Doctor) => {
    const nextStatus: "ACTIVE" | "ON_LEAVE" | "INACTIVE" = doc.status === "ACTIVE" ? "INACTIVE" : doc.status === "INACTIVE" ? "ON_LEAVE" : "ACTIVE";
    const updated = doctors.map(d => d.id === doc.id ? { ...d, status: nextStatus, updatedAt: new Date().toISOString() } as Doctor : d);
    saveDoctorsToStorage(updated);
    showToast(`Dr. ${doc.name} status updated to ${nextStatus}`);
  };

  // Quick Toggle Published
  const handleTogglePublished = (doc: Doctor) => {
    const nextPub: "PUBLISHED" | "DRAFT" = doc.published === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const updated = doctors.map(d => d.id === doc.id ? { ...d, published: nextPub, updatedAt: new Date().toISOString() } as Doctor : d);
    saveDoctorsToStorage(updated);
    showToast(`Dr. ${doc.name} ${nextPub === "PUBLISHED" ? "published to public website" : "unpublished (Draft mode)"}`);
  };

  // Filtered & Sorted Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(d => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        d.name.toLowerCase().includes(q) ||
        d.specialty.toLowerCase().includes(q) ||
        d.hospital.toLowerCase().includes(q) ||
        (d.education && d.education.toLowerCase().includes(q)) ||
        d.id.toLowerCase().includes(q);

      const matchesSpec = specialtyFilter === "ALL" || d.specialty === specialtyFilter;
      const matchesHosp = hospitalFilter === "ALL" || d.hospital === hospitalFilter;
      const matchesStatus = statusFilter === "ALL" || d.status === statusFilter;
      const matchesPub = publishedFilter === "ALL" || d.published === publishedFilter;

      return matchesSearch && matchesSpec && matchesHosp && matchesStatus && matchesPub;
    }).sort((a, b) => {
      if (sortBy === "order") return (a.displayOrder || 99) - (b.displayOrder || 99);
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "experience") return b.experienceYears - a.experienceYears;
      if (sortBy === "rating") return parseFloat(b.rating) - parseFloat(a.rating);
      if (sortBy === "cases") return b.casesHandled - a.casesHandled;
      return 0;
    });
  }, [doctors, searchTerm, specialtyFilter, hospitalFilter, statusFilter, publishedFilter, sortBy]);

  // Summary Metrics
  const stats = useMemo(() => {
    const total = doctors.length;
    const active = doctors.filter(d => d.status === "ACTIVE").length;
    const published = doctors.filter(d => d.published === "PUBLISHED").length;
    const livePublic = doctors.filter(d => d.status === "ACTIVE" && d.published === "PUBLISHED").length;
    const totalCases = doctors.reduce((acc, d) => acc + (d.casesHandled || 0), 0);
    return { total, active, published, livePublic, totalCases };
  }, [doctors]);

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-teal-950 to-emerald-950 rounded-3xl p-8 text-white border border-teal-800/30 shadow-2xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-3 border border-teal-500/30">
              <Stethoscope className="w-3.5 h-3.5" />
              <span>Medical Tourism Clinical Faculty Engine</span>
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight">Doctor & Specialist Management</h1>
            <p className="text-slate-300 text-sm mt-1 max-w-2xl">
              Manage senior clinicians, surgeons, and Ayurvedic vaidyas. Control qualifications, hospital attachments, specialties, and live visibility on the public portal.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-teal-500 text-slate-950 font-bold hover:bg-teal-400 transition shadow-lg shadow-teal-500/20 active:scale-95 text-xs uppercase tracking-wider"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Doctor</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-teal-800/40">
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-teal-700/20 backdrop-blur-sm">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Doctors</div>
            <div className="text-2xl font-black text-white mt-1">{stats.total}</div>
            <div className="text-slate-400 text-xs mt-0.5">Faculty profiles configured</div>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-teal-700/20 backdrop-blur-sm">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Active Faculty</div>
            <div className="text-2xl font-black text-emerald-400 mt-1">{stats.active}</div>
            <div className="text-slate-400 text-xs mt-0.5">Available for consultations</div>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-teal-700/20 backdrop-blur-sm">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Live On Public Website</div>
            <div className="text-2xl font-black text-teal-300 mt-1">{stats.livePublic}</div>
            <div className="text-slate-400 text-xs mt-0.5">Active & Published on Landing/Directory</div>
          </div>
          <div className="bg-slate-800/40 rounded-2xl p-4 border border-teal-700/20 backdrop-blur-sm">
            <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Surgeries & Cases Handled</div>
            <div className="text-2xl font-black text-amber-300 mt-1">{stats.totalCases.toLocaleString()}+</div>
            <div className="text-slate-400 text-xs mt-0.5">Cumulative clinical volume</div>
          </div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Search */}
          <div className="relative md:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by doctor name, specialty, hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            />
          </div>

          {/* Specialty Filter */}
          <div>
            <select
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            >
              <option value="ALL">All Specialties</option>
              {availableSpecialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
          </div>

          {/* Hospital Filter */}
          <div>
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            >
              <option value="ALL">All Hospitals</option>
              {availableHospitals.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Status & Pub Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="ON_LEAVE">On Leave</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 text-xs font-medium border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50"
            >
              <option value="order">Sort: Display Order</option>
              <option value="name">Sort: Name (A-Z)</option>
              <option value="experience">Sort: Experience (High to Low)</option>
              <option value="rating">Sort: Rating (High to Low)</option>
              <option value="cases">Sort: Handled Cases</option>
            </select>
          </div>
        </div>

        {/* Filter Badges Bar */}
        <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-slate-900">{filteredDoctors.length}</strong> of {doctors.length} doctors</span>
            {(searchTerm || specialtyFilter !== "ALL" || hospitalFilter !== "ALL" || statusFilter !== "ALL" || publishedFilter !== "ALL") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setSpecialtyFilter("ALL");
                  setHospitalFilter("ALL");
                  setStatusFilter("ALL");
                  setPublishedFilter("ALL");
                }}
                className="text-teal-600 hover:text-teal-700 font-bold ml-2 underline"
              >
                Clear all filters
              </button>
            )}
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Active ({doctors.filter(d => d.status === "ACTIVE").length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> On Leave ({doctors.filter(d => d.status === "ON_LEAVE").length})</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-300" /> Inactive ({doctors.filter(d => d.status === "INACTIVE").length})</span>
          </div>
        </div>
      </div>

      {/* Doctors Grid / Table View */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDoctors.map((doc) => (
          <div 
            key={doc.id}
            className={`bg-white rounded-3xl border transition-all duration-300 hover:shadow-xl hover:border-teal-400/50 flex flex-col justify-between overflow-hidden relative group ${
              doc.status === "INACTIVE" 
                ? "border-slate-200 opacity-60 bg-slate-50/50" 
                : doc.published === "DRAFT"
                  ? "border-amber-200"
                  : "border-slate-200"
            }`}
          >
            {/* Top Tag Bar */}
            <div className="p-5 pb-0">
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200 font-mono">
                  #{doc.displayOrder} • {doc.id}
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(doc)}
                    title="Click to toggle status (Active / On Leave / Inactive)"
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition cursor-pointer flex items-center gap-1 ${
                      doc.status === "ACTIVE"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        : doc.status === "ON_LEAVE"
                          ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                          : "bg-slate-100 text-slate-500 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      doc.status === "ACTIVE" ? "bg-emerald-500" : doc.status === "ON_LEAVE" ? "bg-amber-500" : "bg-slate-400"
                    }`} />
                    {doc.status}
                  </button>

                  {/* Published Toggle */}
                  <button
                    onClick={() => handleTogglePublished(doc)}
                    title="Click to toggle public portal publication"
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                      doc.published === "PUBLISHED"
                        ? "bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100"
                        : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                    }`}
                  >
                    {doc.published}
                  </button>
                </div>
              </div>

              {/* Doctor Avatar & Identity */}
              <div className="flex items-start gap-4">
                <div className="relative">
                  <img
                    src={doc.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80"}
                    alt={doc.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-sm shrink-0"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-amber-400 text-slate-950 font-black text-[9px] px-1.5 py-0.2 rounded-md shadow flex items-center gap-0.5">
                    <Star className="w-2.5 h-2.5 fill-slate-950" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="text-base font-bold text-slate-900 truncate group-hover:text-teal-700 transition">
                    {doc.name}
                  </h3>
                  <p className="text-xs font-semibold text-teal-700 truncate mt-0.5">
                    {doc.title}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                    <Building2 className="w-3 h-3 shrink-0 text-slate-400" />
                    <span className="truncate">{doc.hospital}</span>
                  </p>
                </div>
              </div>

              {/* Core Attributes */}
              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                    <span>Specialty</span>
                  </span>
                  <span className="font-semibold text-slate-800 truncate max-w-[170px] text-right">
                    {doc.specialty}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    <span>Experience</span>
                  </span>
                  <span className="font-bold text-slate-800">
                    {doc.experienceYears}+ Years ({doc.casesHandled}+ Cases)
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Qualifications</span>
                  </span>
                  <span className="font-medium text-slate-700 truncate max-w-[170px] text-right" title={doc.education}>
                    {doc.education}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Consultation</span>
                  </span>
                  <span className="font-bold text-emerald-700">
                    {doc.consultationFee}
                  </span>
                </div>
              </div>

              {/* Bio snippet */}
              <p className="text-xs text-slate-600 mt-3 line-clamp-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
                {doc.bio}
              </p>

              {/* Languages */}
              <div className="flex flex-wrap gap-1 mt-3">
                {doc.languages.map((lang, idx) => (
                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                    {lang}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Action Footer */}
            <div className="p-4 bg-slate-50/80 border-t border-slate-100 mt-4 flex items-center justify-between">
              <button
                onClick={() => handleOpenView(doc)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-teal-700 hover:bg-teal-50 transition"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>View Full</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(doc)}
                  className="p-1.5 rounded-xl text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition"
                  title="Edit Doctor Details"
                >
                  <Edit className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleOpenDelete(doc)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                  title="Remove Doctor"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="col-span-full py-16 text-center bg-white rounded-3xl border border-slate-200">
            <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-700">No doctors match your criteria</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
              Try changing your search terms, specialty selections, or status filters.
            </p>
            <button
              onClick={() => {
                setSearchTerm("");
                setSpecialtyFilter("ALL");
                setHospitalFilter("ALL");
                setStatusFilter("ALL");
                setPublishedFilter("ALL");
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-teal-50 text-teal-700 font-bold text-xs hover:bg-teal-100 transition"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-3xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-900 to-teal-950 px-6 py-5 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-500/30 flex items-center justify-center text-teal-300">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">
                    {isAddModalOpen ? "Add New Senior Clinician / Doctor" : `Edit Profile: Dr. ${formData.name}`}
                  </h2>
                  <p className="text-xs text-slate-300 mt-0.5">
                    {isAddModalOpen ? "Register senior consultant and associate with hospitals" : "Update credentials, fees, bio, and portal visibility"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Error Banner */}
            {formError && (
              <div className="mx-6 mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* Modal Body / Form */}
            <form onSubmit={isAddModalOpen ? handleCreateSubmit : handleEditSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Row 1: Doctor Name & Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Doctor Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Harikrishnan Nair"
                    value={formData.name || ""}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Consultant & Head of Cardiac Surgery"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Row 2: Specialty & Hospital Cross-Link */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Primary Medical Specialty <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.specialty || availableSpecialties[0]}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    {availableSpecialties.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Affiliated Hospital <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.hospital || availableHospitals[0]}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-white"
                  >
                    {availableHospitals.map(hosp => (
                      <option key={hosp} value={hosp}>{hosp}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Experience, Cases Handled, Display Order */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Experience (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="60"
                    required
                    value={formData.experienceYears ?? 15}
                    onChange={(e) => setFormData({ ...formData, experienceYears: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Surgeries / Cases Handled
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.casesHandled ?? 500}
                    onChange={(e) => setFormData({ ...formData, casesHandled: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Display Order (Sorting)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder ?? 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Row 4: Qualifications, Certifications, Medical Council Reg */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Education & Degrees <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="MBBS, MS, MCh (UK)"
                    value={formData.education || ""}
                    onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Certifications / Fellowships
                  </label>
                  <input
                    type="text"
                    placeholder="FRCS, FACS, ESMO Fellow"
                    value={formData.certifications || ""}
                    onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Medical Council Reg No.
                  </label>
                  <input
                    type="text"
                    placeholder="KMC-48291 / TCMC-991"
                    value={formData.registrationNumber || ""}
                    onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Row 5: Fee, Email, Phone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Consultation Fee
                  </label>
                  <input
                    type="text"
                    placeholder="$60 (₹5,000)"
                    value={formData.consultationFee || ""}
                    onChange={(e) => setFormData({ ...formData, consultationFee: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Direct Email
                  </label>
                  <input
                    type="email"
                    placeholder="doctor@hospital.org"
                    value={formData.email || ""}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Phone / Desk Ext.
                  </label>
                  <input
                    type="text"
                    placeholder="+91 484 669 9000"
                    value={formData.phone || ""}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Row 6: Avatar Image URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Doctor Profile Avatar (Image URL)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/photo-..."
                    value={formData.avatar || ""}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono text-slate-600"
                  />
                  {formData.avatar && (
                    <img 
                      src={formData.avatar} 
                      alt="Preview" 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0" 
                    />
                  )}
                </div>
              </div>

              {/* Row 7: Short Bio & Full Biography */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Executive Bio (Public Card Summary) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  placeholder="Concise 1-2 sentence overview for directory cards..."
                  value={formData.bio || ""}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Full Clinical Biography & Research
                </label>
                <textarea
                  rows={3}
                  placeholder="Comprehensive clinical achievements, international fellowships, and research background..."
                  value={formData.fullBiography || ""}
                  onChange={(e) => setFormData({ ...formData, fullBiography: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              {/* Row 8: Status & Published Radio Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Clinical Status
                  </label>
                  <div className="flex items-center gap-3">
                    {(["ACTIVE", "ON_LEAVE", "INACTIVE"] as const).map(s => (
                      <label key={s} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="status"
                          value={s}
                          checked={formData.status === s}
                          onChange={() => setFormData({ ...formData, status: s })}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>{s}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Portal Visibility
                  </label>
                  <div className="flex items-center gap-3">
                    {(["PUBLISHED", "DRAFT"] as const).map(p => (
                      <label key={p} className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 cursor-pointer">
                        <input
                          type="radio"
                          name="published"
                          value={p}
                          checked={formData.published === p}
                          onChange={() => setFormData({ ...formData, published: p })}
                          className="text-teal-600 focus:ring-teal-500"
                        />
                        <span>{p === "PUBLISHED" ? "Published (Live)" : "Draft (Hidden)"}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition shadow-lg shadow-teal-600/20"
                >
                  {isAddModalOpen ? "Create Doctor Profile" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full my-8 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="bg-gradient-to-r from-slate-900 to-teal-950 p-6 text-white relative">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-4">
                <img
                  src={selectedDoctor.avatar}
                  alt={selectedDoctor.name}
                  className="w-20 h-20 rounded-2xl object-cover border-2 border-teal-400/40 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-md bg-teal-500/20 text-teal-300 font-mono font-bold">
                      {selectedDoctor.id}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                      selectedDoctor.status === "ACTIVE" ? "bg-emerald-500/20 text-emerald-300" : "bg-amber-500/20 text-amber-300"
                    }`}>
                      {selectedDoctor.status}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold mt-1">{selectedDoctor.name}</h2>
                  <p className="text-xs text-teal-300">{selectedDoctor.title}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block font-semibold">Specialty:</span>
                  <span className="font-bold text-slate-800">{selectedDoctor.specialty}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Affiliated Hospital:</span>
                  <span className="font-bold text-slate-800">{selectedDoctor.hospital}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Clinical Experience:</span>
                  <span className="font-bold text-slate-800">{selectedDoctor.experienceYears}+ Years ({selectedDoctor.casesHandled}+ surgeries)</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Consultation Fee:</span>
                  <span className="font-bold text-emerald-700">{selectedDoctor.consultationFee}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Council Registration:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedDoctor.registrationNumber || "KMC-Verified"}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-semibold">Rating:</span>
                  <span className="font-bold text-amber-600 flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{selectedDoctor.rating} / 5.0</span>
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Education & Qualifications</h4>
                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100 font-medium">
                  {selectedDoctor.education}
                  {selectedDoctor.certifications && ` • ${selectedDoctor.certifications}`}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Clinical Biography</h4>
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {selectedDoctor.fullBiography || selectedDoctor.bio}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Direct Contact</h4>
                <div className="flex items-center gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" /> {selectedDoctor.email || "consult@hospital.org"}</span>
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" /> {selectedDoctor.phone || "+91 484 669 9000"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedDoctor);
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-bold hover:bg-teal-500 transition"
              >
                Edit Doctor
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {isDeleteModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full p-6 text-center animate-in fade-in zoom-in-95">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">Remove Doctor from Directory?</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Are you sure you want to remove <strong className="text-slate-800">Dr. {selectedDoctor.name}</strong> ({selectedDoctor.id})? This will also remove them from public landing and consultation matching.
            </p>

            <div className="flex items-center justify-center gap-3 mt-6">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold hover:bg-rose-500 transition shadow-lg shadow-rose-600/20"
              >
                Yes, Remove Doctor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
