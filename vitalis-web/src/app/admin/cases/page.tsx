"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Search, 
  Filter, 
  Plus, 
  Calendar, 
  Building2, 
  Stethoscope, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileText,
  Plane,
  CreditCard,
  X,
  Send,
  Download,
  Eye,
  Edit,
  Trash2,
  Activity,
  Layers,
  Sparkles,
  MessageSquare,
  Shield,
  User,
  ChevronRight,
  TrendingUp,
  Tag
} from "lucide-react";

export type CaseStatus = 
  | "New"
  | "Under Review"
  | "Consultation Scheduled"
  | "Treatment Planned"
  | "Treatment in Progress"
  | "Completed"
  | "Cancelled";

interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  author: string;
}

interface StaffNote {
  id: string;
  author: string;
  date: string;
  text: string;
}

interface MedicalCase {
  id: string;
  patientId: string;
  patientName: string;
  country: string;
  condition: string;
  specialty: string;
  treatment: string;
  hospital: string;
  doctor: string;
  status: CaseStatus;
  estimatedCost: string;
  expectedTreatmentDate: string;
  coordinator: string;
  priority: "High" | "Medium" | "Low";
  notes: StaffNote[];
  timeline: TimelineEvent[];
}

const CASE_STATUSES: CaseStatus[] = [
  "New",
  "Under Review",
  "Consultation Scheduled",
  "Treatment Planned",
  "Treatment in Progress",
  "Completed",
  "Cancelled"
];

const SPECIALTIES_LIST = [
  "Orthopedics & Joint Reconstruction",
  "Cardiology & Cardiothoracic",
  "Ayurveda & Integrative Medicine",
  "Oncology & Cancer Care",
  "Neurology & Spine Surgery",
  "Bariatric & Metabolic Surgery",
  "Organ Transplant & Nephrology",
  "Dental & Maxillofacial"
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

const DOCTORS_LIST = [
  "Dr. Vijay Anand (Orthopaedics)",
  "Dr. K. S. Muralidharan (Cardiology)",
  "Dr. Arya Varma (Ayurveda)",
  "Dr. Thomas Mathew (Oncology)",
  "Dr. Harikrishnan Pillai (Neurosurgery)",
  "Dr. Rajesh K. (Spine Surgery)",
  "Dr. Venugopal B. (Transplant Surgery)"
];

const INITIAL_CASES: MedicalCase[] = [
  {
    id: "CAS-2026-089",
    patientId: "PAT-001",
    patientName: "Sarah Jenkins",
    country: "United Kingdom",
    condition: "Severe Osteoarthritis Right Knee (Grade IV)",
    specialty: "Orthopedics & Joint Reconstruction",
    treatment: "Minimally Invasive Total Knee Replacement",
    hospital: "Aster Medcity, Kochi",
    doctor: "Dr. Vijay Anand (Orthopaedics)",
    status: "Treatment in Progress",
    estimatedCost: "$6,200",
    expectedTreatmentDate: "2026-09-18",
    coordinator: "Admin Primary",
    priority: "High",
    notes: [
      {
        id: "NOTE-1",
        author: "Admin Coordinator",
        date: "2026-08-25 11:30",
        text: "Knee MRI scans reviewed by Dr. Vijay Anand. Patient cleared for robotic sub-vastus arthroplasty."
      },
      {
        id: "NOTE-2",
        author: "Travel Desk",
        date: "2026-08-28 15:45",
        text: "Indian e-Medical Visa approved. Kochi airport private ambulance pickup confirmed."
      }
    ],
    timeline: [
      {
        id: "TL-1",
        title: "Medical Case Created",
        date: "2026-08-20",
        description: "Enquiry converted to active international case file.",
        author: "System Intake"
      },
      {
        id: "TL-2",
        title: "Consultation Scheduled",
        date: "2026-08-22",
        description: "Telehealth video evaluation completed with Dr. Vijay Anand.",
        author: "Care Coordinator"
      },
      {
        id: "TL-3",
        title: "Treatment Planned & Visa Issued",
        date: "2026-08-28",
        description: "Formal FRRO medical invitation issued, patient booked flight tickets.",
        author: "Admin Desk"
      },
      {
        id: "TL-4",
        title: "Treatment in Progress",
        date: "2026-09-02",
        description: "Patient admitted to Aster Medcity private suite. Pre-op diagnostics underway.",
        author: "Hospital Liaison"
      }
    ]
  },
  {
    id: "CAS-2026-088",
    patientId: "PAT-002",
    patientName: "Mohammed Al-Maktoum",
    country: "United Arab Emirates",
    condition: "Mitral Valve Prolapse with Degenerative Regurgitation",
    specialty: "Cardiology & Cardiothoracic",
    treatment: "Robotic-Assisted Mitral Valve Repair",
    hospital: "Amrita Institute of Medical Sciences",
    doctor: "Dr. K. S. Muralidharan (Cardiology)",
    status: "Treatment Planned",
    estimatedCost: "$11,500",
    expectedTreatmentDate: "2026-09-22",
    coordinator: "Care Specialist",
    priority: "High",
    notes: [
      {
        id: "NOTE-1",
        author: "Cardiac Liaison",
        date: "2026-08-26 14:00",
        text: "Pre-admission Echo readings forwarded to cardiology tumor/heart team."
      }
    ],
    timeline: [
      {
        id: "TL-1",
        title: "Medical Case Created",
        date: "2026-08-25",
        description: "Case registered from UAE patient inquiry.",
        author: "System"
      },
      {
        id: "TL-2",
        title: "Treatment Planned",
        date: "2026-08-29",
        description: "Robotic DaVinci suite booked at Amrita Institute.",
        author: "Dr. Muralidharan"
      }
    ]
  },
  {
    id: "CAS-2026-087",
    patientId: "PAT-003",
    patientName: "Elena Rostova",
    country: "Germany",
    condition: "Chronic Cervical Spondylosis & Stress Syndrome",
    specialty: "Ayurveda & Integrative Medicine",
    treatment: "Comprehensive Ayurvedic Panchakarma & Stress Detox",
    hospital: "Somatheeram Ayurvedic Village, Kovalam",
    doctor: "Dr. Arya Varma (Ayurveda)",
    status: "Completed",
    estimatedCost: "$4,200",
    expectedTreatmentDate: "2026-07-20",
    coordinator: "Admin Primary",
    priority: "Medium",
    notes: [
      {
        id: "NOTE-1",
        author: "Ayurveda Coordinator",
        date: "2026-08-10 10:00",
        text: "21-day program concluded with excellent functional spine mobility improvements."
      }
    ],
    timeline: [
      {
        id: "TL-1",
        title: "Case Created & Treatment Planned",
        date: "2026-07-15",
        description: "NABH Ayurvedic retreat package finalized.",
        author: "Somatheeram Liaison"
      },
      {
        id: "TL-2",
        title: "Treatment in Progress",
        date: "2026-07-20",
        description: "Admitted for residential detoxification therapies.",
        author: "Dr. Arya Varma"
      },
      {
        id: "TL-3",
        title: "Completed",
        date: "2026-08-10",
        description: "Discharged with 3-month herbal maintenance prescription.",
        author: "Ayurvedic Medical Director"
      }
    ]
  },
  {
    id: "CAS-2026-092",
    patientId: "PAT-004",
    patientName: "John O'Connor",
    country: "Ireland",
    condition: "Localized Prostate Carcinoma",
    specialty: "Oncology & Cancer Care",
    treatment: "Proton Beam Therapy & Precision Oncology",
    hospital: "Amrita Institute of Medical Sciences",
    doctor: "Dr. Thomas Mathew (Oncology)",
    status: "Consultation Scheduled",
    estimatedCost: "$18,000",
    expectedTreatmentDate: "2026-09-28",
    coordinator: "Oncology Desk",
    priority: "High",
    notes: [
      {
        id: "NOTE-1",
        author: "Oncology Team",
        date: "2026-09-02 09:15",
        text: "Virtual tumor board evaluation scheduled for Sept 08."
      }
    ],
    timeline: [
      {
        id: "TL-1",
        title: "New Case Created",
        date: "2026-09-01",
        description: "Patient submitted PET-CT and histopathology reports.",
        author: "Intake Specialist"
      },
      {
        id: "TL-2",
        title: "Consultation Scheduled",
        date: "2026-09-02",
        description: "Video consultation with Dr. Thomas Mathew fixed.",
        author: "Care Coordinator"
      }
    ]
  }
];

export default function CasesPage() {
  const [cases, setCases] = useState<MedicalCase[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [specialtyFilter, setSpecialtyFilter] = useState<string>("ALL");
  const [hospitalFilter, setHospitalFilter] = useState<string>("ALL");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeCase, setActiveCase] = useState<MedicalCase | null>(null);
  const [activeTab, setActiveTab] = useState<"DETAILS" | "TIMELINE" | "NOTES">("DETAILS");
  const [newNoteText, setNewNoteText] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    patientId: "PAT-001",
    patientName: "Sarah Jenkins",
    country: "United Kingdom",
    condition: "",
    specialty: "Orthopedics & Joint Reconstruction",
    treatment: "Minimally Invasive Total Knee Replacement",
    hospital: "Aster Medcity, Kochi",
    doctor: "Dr. Vijay Anand (Orthopaedics)",
    status: "New" as CaseStatus,
    estimatedCost: "$6,500",
    expectedTreatmentDate: "2026-09-25",
    coordinator: "Admin Primary",
    priority: "Medium" as "High" | "Medium" | "Low",
    initialNote: ""
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maides_admin_cases");
    if (saved) {
      try {
        setCases(JSON.parse(saved));
      } catch {
        setCases(INITIAL_CASES);
      }
    } else {
      setCases(INITIAL_CASES);
      localStorage.setItem("maides_admin_cases", JSON.stringify(INITIAL_CASES));
    }
  }, []);

  const saveCases = (updated: MedicalCase[]) => {
    setCases(updated);
    localStorage.setItem("maides_admin_cases", JSON.stringify(updated));
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Open Create Case
  const handleOpenAdd = () => {
    setFormData({
      patientId: `PAT-00${Math.floor(Math.random() * 8) + 1}`,
      patientName: "",
      country: "United Kingdom",
      condition: "",
      specialty: "Orthopedics & Joint Reconstruction",
      treatment: "Total Knee Arthroplasty",
      hospital: "Aster Medcity, Kochi",
      doctor: "Dr. Vijay Anand (Orthopaedics)",
      status: "New",
      estimatedCost: "$6,500",
      expectedTreatmentDate: new Date(Date.now() + 14 * 86400000).toISOString().split("T")[0],
      coordinator: "Admin Primary",
      priority: "Medium",
      initialNote: "Case file initialized by Admin Desk."
    });
    setIsAddModalOpen(true);
  };

  // Submit Create Case
  const handleCreateCase = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `CAS-2026-${String(cases.length + 90).padStart(3, "0")}`;
    const today = new Date().toISOString().split("T")[0];

    const newCase: MedicalCase = {
      id: newId,
      patientId: formData.patientId || "PAT-005",
      patientName: formData.patientName || "International Patient",
      country: formData.country || "United States",
      condition: formData.condition || "Clinical diagnosis pending",
      specialty: formData.specialty,
      treatment: formData.treatment,
      hospital: formData.hospital,
      doctor: formData.doctor,
      status: formData.status,
      estimatedCost: formData.estimatedCost,
      expectedTreatmentDate: formData.expectedTreatmentDate,
      coordinator: formData.coordinator,
      priority: formData.priority,
      notes: formData.initialNote ? [
        {
          id: `NOTE-${Date.now()}`,
          author: "Admin Coordinator",
          date: `${today} 10:00`,
          text: formData.initialNote
        }
      ] : [],
      timeline: [
        {
          id: `TL-${Date.now()}`,
          title: "Medical Case Created",
          date: today,
          description: `Assigned to ${formData.hospital} under ${formData.doctor}.`,
          author: formData.coordinator
        }
      ]
    };

    const updated = [newCase, ...cases];
    saveCases(updated);
    setIsAddModalOpen(false);
    showToast(`Medical Case ${newId} created and assigned successfully!`);
  };

  // Open Edit
  const handleOpenEdit = (c: MedicalCase) => {
    setActiveCase(c);
    setFormData({
      patientId: c.patientId,
      patientName: c.patientName,
      country: c.country,
      condition: c.condition,
      specialty: c.specialty,
      treatment: c.treatment,
      hospital: c.hospital,
      doctor: c.doctor,
      status: c.status,
      estimatedCost: c.estimatedCost,
      expectedTreatmentDate: c.expectedTreatmentDate,
      coordinator: c.coordinator,
      priority: c.priority,
      initialNote: ""
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdateCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCase) return;

    const statusChanged = activeCase.status !== formData.status;
    const today = new Date().toISOString().split("T")[0];

    const updatedTimeline = [...activeCase.timeline];
    if (statusChanged) {
      updatedTimeline.unshift({
        id: `TL-${Date.now()}`,
        title: `Status Updated to ${formData.status}`,
        date: today,
        description: `Case progressed to ${formData.status} stage by ${formData.coordinator}.`,
        author: formData.coordinator
      });
    }

    const updated = cases.map((c) => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          patientName: formData.patientName,
          country: formData.country,
          condition: formData.condition,
          specialty: formData.specialty,
          treatment: formData.treatment,
          hospital: formData.hospital,
          doctor: formData.doctor,
          status: formData.status,
          estimatedCost: formData.estimatedCost,
          expectedTreatmentDate: formData.expectedTreatmentDate,
          coordinator: formData.coordinator,
          priority: formData.priority,
          timeline: updatedTimeline
        };
      }
      return c;
    });

    saveCases(updated);
    if (activeCase) {
      setActiveCase({
        ...activeCase,
        patientName: formData.patientName,
        country: formData.country,
        condition: formData.condition,
        specialty: formData.specialty,
        treatment: formData.treatment,
        hospital: formData.hospital,
        doctor: formData.doctor,
        status: formData.status,
        estimatedCost: formData.estimatedCost,
        expectedTreatmentDate: formData.expectedTreatmentDate,
        coordinator: formData.coordinator,
        priority: formData.priority,
        timeline: updatedTimeline
      });
    }
    setIsEditModalOpen(false);
    showToast(`Case ${activeCase.id} updated successfully!`);
  };

  // Quick Status Update
  const handleQuickStatusChange = (caseId: string, newStatus: CaseStatus) => {
    const today = new Date().toISOString().split("T")[0];
    const updated = cases.map((c) => {
      if (c.id === caseId) {
        const newTimeline = [
          {
            id: `TL-${Date.now()}`,
            title: `Status: ${newStatus}`,
            date: today,
            description: `Quick status progression to ${newStatus}.`,
            author: "Admin Operations"
          },
          ...c.timeline
        ];
        return {
          ...c,
          status: newStatus,
          timeline: newTimeline
        };
      }
      return c;
    });
    saveCases(updated);
    if (activeCase && activeCase.id === caseId) {
      setActiveCase({
        ...activeCase,
        status: newStatus
      });
    }
    showToast(`Status updated to "${newStatus}"!`);
  };

  // Add Staff Note
  const handleAddNote = () => {
    if (!activeCase || !newNoteText.trim()) return;
    const today = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newNote: StaffNote = {
      id: `NOTE-${Date.now()}`,
      author: "Admin Staff",
      date: today,
      text: newNoteText.trim()
    };

    const updated = cases.map((c) => {
      if (c.id === activeCase.id) {
        return {
          ...c,
          notes: [newNote, ...(c.notes || [])]
        };
      }
      return c;
    });

    saveCases(updated);
    setActiveCase({
      ...activeCase,
      notes: [newNote, ...(activeCase.notes || [])]
    });
    setNewNoteText("");
    showToast("Internal staff note logged!");
  };

  // Delete Case
  const handleConfirmDelete = () => {
    if (!activeCase) return;
    const updated = cases.filter((c) => c.id !== activeCase.id);
    saveCases(updated);
    setIsDeleteModalOpen(false);
    showToast(`Case ${activeCase.id} deleted.`);
  };

  // Open View Dossier
  const handleOpenView = (c: MedicalCase, tab: "DETAILS" | "TIMELINE" | "NOTES" = "DETAILS") => {
    setActiveCase(c);
    setActiveTab(tab);
    setIsViewModalOpen(true);
  };

  // Filtered Cases
  const filteredCases = cases.filter((c) => {
    const matchesSearch =
      c.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.treatment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.hospital.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.doctor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || c.status === statusFilter;
    const matchesSpecialty = specialtyFilter === "ALL" || c.specialty === specialtyFilter;
    const matchesHospital = hospitalFilter === "ALL" || c.hospital === hospitalFilter;

    return matchesSearch && matchesStatus && matchesSpecialty && matchesHospital;
  });

  // Badge Color helper
  const getStatusBadge = (st: CaseStatus) => {
    switch (st) {
      case "New":
        return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "Under Review":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "Consultation Scheduled":
        return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "Treatment Planned":
        return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
      case "Treatment in Progress":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "Completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "Cancelled":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-800 text-slate-400 border-slate-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0E82FD] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-blue-400/30">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-xs font-bold">{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <HeartPulse className="w-5 h-5 text-[#0E82FD]" />
            Medical Cases Coordination & Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Assign cases to patients, link accredited hospitals, assign surgical leads, set treatment dates, and track timelines.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Medical Case
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Cases</div>
            <div className="text-lg font-bold text-white">{cases.length} Clinical Files</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">In Treatment / Active</div>
            <div className="text-lg font-bold text-emerald-400">
              {cases.filter((c) => c.status === "Treatment in Progress" || c.status === "Treatment Planned").length} Cases
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Pending Review</div>
            <div className="text-lg font-bold text-purple-400">
              {cases.filter((c) => c.status === "New" || c.status === "Under Review").length} Inquiries
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Completed Outcomes</div>
            <div className="text-lg font-bold text-green-400">
              {cases.filter((c) => c.status === "Completed").length} Recovered
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by case ID, patient, hospital, doctor..."
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
            {CASE_STATUSES.map((st) => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>

          <select
            value={specialtyFilter}
            onChange={(e) => setSpecialtyFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
          >
            <option value="ALL">All Specialties</option>
            {SPECIALTIES_LIST.map((sp) => (
              <option key={sp} value={sp}>{sp}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Cases Cards List */}
      <div className="space-y-4">
        {filteredCases.length === 0 ? (
          <div className="py-16 text-center text-slate-500 bg-slate-950 border border-slate-800/80 rounded-3xl">
            No medical cases match your filter criteria.
          </div>
        ) : (
          filteredCases.map((c) => (
            <div
              key={c.id}
              className="bg-slate-950 border border-slate-800/80 rounded-3xl p-5 hover:border-slate-700 transition-all space-y-4 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 group"
            >
              {/* Top Row: Case Header & Status Select */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-xs font-bold text-[#0E82FD] px-2.5 py-1 rounded-lg bg-blue-500/10 border border-blue-500/20">
                      {c.id}
                    </span>
                    <h2 className="text-base font-bold text-white group-hover:text-blue-400 transition-colors">
                      {c.patientName}
                    </h2>
                    <span className="text-xs text-slate-400">({c.country} • {c.patientId})</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      c.priority === "High" ? "bg-red-500/10 text-red-400 border border-red-500/20" : "bg-slate-800 text-slate-300"
                    }`}>
                      {c.priority} Priority
                    </span>
                  </div>
                  <div className="text-xs text-slate-300 font-medium mt-1.5 flex items-center gap-1.5">
                    <span className="text-slate-400">{c.condition}</span>
                    <span>•</span>
                    <span className="text-blue-300 font-semibold">{c.treatment}</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Status Dropdown Quick Update */}
                  <select
                    value={c.status}
                    onChange={(e) => handleQuickStatusChange(c.id, e.target.value as CaseStatus)}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border focus:outline-none transition-all cursor-pointer ${getStatusBadge(c.status)}`}
                  >
                    {CASE_STATUSES.map((st) => (
                      <option key={st} value={st} className="bg-slate-900 text-white">
                        {st}
                      </option>
                    ))}
                  </select>

                  <div className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-emerald-400 font-bold text-xs">
                    {c.estimatedCost}
                  </div>
                </div>
              </div>

              {/* Assignment Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-900/40 p-3.5 rounded-2xl border border-slate-800/60">
                <div className="flex items-center gap-2 text-slate-300">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Assigned Hospital</div>
                    <div className="font-medium text-white truncate">{c.hospital}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Stethoscope className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Attending Doctor</div>
                    <div className="font-medium text-white truncate">{c.doctor}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-300">
                  <Calendar className="w-4 h-4 text-purple-400 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-semibold">Expected Date</div>
                    <div className="font-medium text-white">{c.expectedTreatmentDate}</div>
                  </div>
                </div>
              </div>

              {/* Actions & Notes Footer */}
              <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-4 text-slate-400 text-[11px]">
                  <span>Specialty: <strong className="text-slate-200">{c.specialty}</strong></span>
                  <span>•</span>
                  <span>Coordinator: <strong className="text-slate-200">{c.coordinator}</strong></span>
                  <span>•</span>
                  <span>Notes: <strong className="text-blue-400">{c.notes ? c.notes.length : 0} logs</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenView(c, "DETAILS")}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-[11px] font-medium transition-all border border-slate-800 flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    View Case
                  </button>

                  <button
                    onClick={() => handleOpenView(c, "TIMELINE")}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-purple-600 text-slate-200 hover:text-white text-[11px] font-medium transition-all border border-slate-800 flex items-center gap-1.5"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    Timeline
                  </button>

                  <button
                    onClick={() => handleOpenView(c, "NOTES")}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-emerald-600 text-slate-200 hover:text-white text-[11px] font-medium transition-all border border-slate-800 flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Staff Notes
                  </button>

                  <button
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800 hover:border-blue-500/30"
                    title="Edit Case Details"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* CREATE CASE MODAL                                                         */}
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
                  <h2 className="text-base font-bold text-white">Create International Medical Case</h2>
                  <p className="text-xs text-slate-400">Assign case to patient and configure hospital/doctor matching</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCase} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
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
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Medical Diagnosis / Condition *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Severe Osteoarthritis Right Knee (Grade IV)"
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Medical Specialty Unit *</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {SPECIALTIES_LIST.map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Treatment / Procedure *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimally Invasive Total Knee Replacement"
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assign Partner Hospital *</label>
                  <select
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {HOSPITALS_LIST.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assign Attending Doctor *</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {DOCTORS_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Initial Case Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CASE_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expected Treatment Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expectedTreatmentDate}
                    onChange={(e) => setFormData({ ...formData, expectedTreatmentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Cost Package ($ USD)</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. $6,200"
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Internal Coordinator Note</label>
                  <textarea
                    rows={2}
                    placeholder="Clinical observations, translation requirements, pre-op tests..."
                    value={formData.initialNote}
                    onChange={(e) => setFormData({ ...formData, initialNote: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
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
                  Create & Assign Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT CASE MODAL                                                           */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Medical Case ({activeCase.id})</h2>
                  <p className="text-xs text-slate-400">Update case status, assigned doctor/hospital, and scheduling</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateCase} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Name</label>
                  <input
                    type="text"
                    required
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Case Status *</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as CaseStatus })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CASE_STATUSES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Diagnosis / Condition</label>
                  <input
                    type="text"
                    required
                    value={formData.condition}
                    onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Medical Specialty</label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {SPECIALTIES_LIST.map((sp) => (
                      <option key={sp} value={sp}>{sp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Treatment Package</label>
                  <input
                    type="text"
                    required
                    value={formData.treatment}
                    onChange={(e) => setFormData({ ...formData, treatment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Hospital</label>
                  <select
                    value={formData.hospital}
                    onChange={(e) => setFormData({ ...formData, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {HOSPITALS_LIST.map((h) => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Doctor</label>
                  <select
                    value={formData.doctor}
                    onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {DOCTORS_LIST.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expected Treatment Date</label>
                  <input
                    type="date"
                    required
                    value={formData.expectedTreatmentDate}
                    onChange={(e) => setFormData({ ...formData, expectedTreatmentDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Estimated Cost Package</label>
                  <input
                    type="text"
                    required
                    value={formData.estimatedCost}
                    onChange={(e) => setFormData({ ...formData, estimatedCost: e.target.value })}
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
                  Save Case Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW CASE DOSSIER (DETAILS, TIMELINE, STAFF NOTES)                        */}
      {/* ========================================================================= */}
      {isViewModalOpen && activeCase && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 flex flex-col">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{activeCase.id}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${getStatusBadge(activeCase.status)}`}>
                      {activeCase.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">
                    {activeCase.patientName} <span className="text-xs text-slate-400 font-normal">({activeCase.country})</span>
                  </h2>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setIsViewModalOpen(false);
                    handleOpenEdit(activeCase);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-800 transition-all flex items-center gap-1.5"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Case
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
            <div className="flex items-center gap-2 border-b border-slate-800 py-3 text-xs">
              <button
                onClick={() => setActiveTab("DETAILS")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "DETAILS"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                Case Dossier
              </button>

              <button
                onClick={() => setActiveTab("TIMELINE")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "TIMELINE"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                Case Timeline ({activeCase.timeline ? activeCase.timeline.length : 0})
              </button>

              <button
                onClick={() => setActiveTab("NOTES")}
                className={`px-3.5 py-1.5 rounded-xl font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === "NOTES"
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Internal Staff Notes ({activeCase.notes ? activeCase.notes.length : 0})
              </button>
            </div>

            {/* Tab Contents */}
            <div className="py-4 space-y-4">
              {/* TAB 1: DETAILS */}
              {activeTab === "DETAILS" && (
                <div className="space-y-4">
                  <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Package Cost</div>
                      <div className="text-lg font-extrabold text-emerald-400 mt-0.5">{activeCase.estimatedCost}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Expected Date</div>
                      <div className="text-xs font-bold text-white mt-1">{activeCase.expectedTreatmentDate}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase font-bold text-slate-500">Priority</div>
                      <div className="text-xs font-bold text-white mt-1">{activeCase.priority}</div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-bold text-white uppercase tracking-wider">Clinical Details</div>
                    <div className="bg-slate-900/40 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-2">
                      <div>Condition: <strong className="text-white">{activeCase.condition}</strong></div>
                      <div>Treatment: <strong className="text-blue-300">{activeCase.treatment}</strong></div>
                      <div>Specialty: <strong className="text-slate-200">{activeCase.specialty}</strong></div>
                      <div>Assigned Hospital: <strong className="text-slate-200">{activeCase.hospital}</strong></div>
                      <div>Attending Specialist: <strong className="text-slate-200">{activeCase.doctor}</strong></div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TIMELINE */}
              {activeTab === "TIMELINE" && (
                <div className="space-y-3">
                  {(!activeCase.timeline || activeCase.timeline.length === 0) ? (
                    <div className="py-12 text-center text-slate-500">No timeline events recorded.</div>
                  ) : (
                    activeCase.timeline.map((tl, i) => (
                      <div key={tl.id || i} className="flex gap-3 bg-slate-900/50 p-3.5 rounded-2xl border border-slate-800">
                        <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                          <Clock className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white">{tl.title}</h4>
                            <span className="text-[10px] text-slate-500 font-mono">{tl.date}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1">{tl.description}</p>
                          <div className="text-[10px] text-slate-500 mt-1">Logged by {tl.author}</div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB 3: STAFF NOTES */}
              {activeTab === "NOTES" && (
                <div className="space-y-4">
                  {/* Note Input */}
                  <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex gap-2">
                    <input
                      type="text"
                      placeholder="Add an internal coordinator note or clinical update..."
                      value={newNoteText}
                      onChange={(e) => setNewNoteText(e.target.value)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleAddNote(); }}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                    <button
                      type="button"
                      onClick={handleAddNote}
                      className="px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl text-xs font-semibold shadow transition-all"
                    >
                      Post Note
                    </button>
                  </div>

                  {/* Notes List */}
                  <div className="space-y-2">
                    {(!activeCase.notes || activeCase.notes.length === 0) ? (
                      <div className="py-8 text-center text-slate-500 text-xs">No internal notes logged yet.</div>
                    ) : (
                      activeCase.notes.map((n) => (
                        <div key={n.id} className="bg-slate-900/40 p-3 rounded-xl border border-slate-800/80 text-xs">
                          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                            <strong className="text-white">{n.author}</strong>
                            <span className="font-mono text-slate-500">{n.date}</span>
                          </div>
                          <p className="text-slate-300">{n.text}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-xs text-slate-500">Case Coordinator: {activeCase.coordinator}</span>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-xs font-semibold text-white transition-all shadow-md"
              >
                Close Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
