"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Search, 
  Plus, 
  Activity, 
  Building2, 
  Stethoscope,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Layers,
  Award,
  ArrowRight
} from "lucide-react";

interface SpecialtyItem {
  id: string;
  name: string;
  code: string;
  category: string;
  proceduresCount: number;
  hospitals: string[];
  keyProcedures: string[];
  description: string;
  accreditations: string[];
  leadDoctor: string;
  status: "ACTIVE" | "INACTIVE";
}

const INITIAL_SPECIALTIES: SpecialtyItem[] = [
  {
    id: "SPEC-001",
    name: "Orthopedics & Joint Reconstruction",
    code: "ORTHO",
    category: "Surgical & Rehabilitation",
    proceduresCount: 14,
    hospitals: ["Aster Medcity, Kochi", "VPS Lakeshore, Kochi", "Rajagiri Hospital, Aluva"],
    keyProcedures: [
      "Total Knee Replacement (Robotic & Minimally Invasive)",
      "Total Hip Arthroplasty (Bilateral / Unilateral)",
      "Arthroscopic ACL/PCL Ligament Reconstruction",
      "Spinal Decompression & Fusion Surgery"
    ],
    description: "World-class center of excellence for advanced musculoskeletal care, computer-navigated arthroplasty, sports injury rehab, and spine corrections.",
    accreditations: ["JCI Accredited", "NABH Center of Excellence"],
    leadDoctor: "Dr. Vijay Anand, MS (Ortho), MCh",
    status: "ACTIVE"
  },
  {
    id: "SPEC-002",
    name: "Cardiology & Robotic Cardiothoracic Surgery",
    code: "CARDIO",
    category: "Interventional & Surgical",
    proceduresCount: 18,
    hospitals: ["Amrita Institute of Medical Sciences", "Aster Medcity, Kochi", "Apollo Adlux"],
    keyProcedures: [
      "Robotic Mitral & Aortic Valve Replacement",
      "Off-Pump Coronary Artery Bypass (CABG)",
      "Transcatheter Aortic Valve Implantation (TAVI)",
      "Complex Paediatric Congenital Heart Surgeries"
    ],
    description: "Cutting-edge cardiovascular institute equipped with hybrid catheterization labs, ECMO life support systems, and DaVinci surgical robotics.",
    accreditations: ["JCI Accredited", "NABH Digital Cardiology"],
    leadDoctor: "Dr. K. S. Muralidharan, DM, FACC",
    status: "ACTIVE"
  },
  {
    id: "SPEC-003",
    name: "Ayurveda & Integrative Holistic Medicine",
    code: "AYUR",
    category: "Holistic & Traditional",
    proceduresCount: 22,
    hospitals: ["Somatheeram Ayurvedic Village, Kovalam", "Vaidyaratnam Oushadhasala, Thrissur"],
    keyProcedures: [
      "Classical Panchakarma 21-Day Detoxification",
      "Shirodhara & Rasayana Rejuvenation Protocols",
      "Ayurvedic Arthritis & Spondylosis Management",
      "Neurological Rehabilitation & Paraplegia Care"
    ],
    description: "Authentic centuries-old Kerala Ayurvedic heritage delivered in serene NABH/Ayush Platinum accredited seaside hospitals and retreats.",
    accreditations: ["Ayush Platinum Certified", "Green Leaf Certified"],
    leadDoctor: "Dr. Arya Varma, BAMS, MD (Ayurveda)",
    status: "ACTIVE"
  },
  {
    id: "SPEC-004",
    name: "Oncology & Proton Beam Therapy",
    code: "ONCO",
    category: "Medical, Surgical & Radiation",
    proceduresCount: 12,
    hospitals: ["Amrita Institute of Medical Sciences", "Aster Medcity, Kochi", "VPS Lakeshore"],
    keyProcedures: [
      "Proton Beam Radiotherapy (Sub-millimeter targeting)",
      "Robotic HIPEC for Peritoneal Carcinomatosis",
      "Bone Marrow & Stem Cell Transplantation",
      "Precision Immunotherapy & Genomic Profiling"
    ],
    description: "Multidisciplinary comprehensive tumor boards, PET-CT fusion imaging, precision targeted biological therapies, and organ-preserving oncology.",
    accreditations: ["JCI Comprehensive Cancer Center", "ESMO Recognized"],
    leadDoctor: "Dr. Thomas Mathew, DM, MRCP (Oncology)",
    status: "ACTIVE"
  },
  {
    id: "SPEC-005",
    name: "Neurology & Minimally Invasive Spine Surgery",
    code: "NEURO",
    category: "Neurosciences",
    proceduresCount: 16,
    hospitals: ["Rajagiri Hospital, Aluva", "Aster Medcity, Kochi", "Amrita Institute"],
    keyProcedures: [
      "Endoscopic Skull Base & Brain Tumor Resection",
      "Deep Brain Stimulation (DBS) for Parkinson's",
      "Endovascular Coil Embolization for Aneurysms",
      "Microscopic Discectomy & Artificial Disc Replacement"
    ],
    description: "Pioneering neurosciences department providing 24/7 hyperacute stroke thrombectomy, neural navigation, and stereotactic radiosurgery.",
    accreditations: ["NABH Stroke Certified", "World Stroke Organization Center"],
    leadDoctor: "Dr. Harikrishnan Pillai, MCh (Neurosurgery)",
    status: "ACTIVE"
  },
  {
    id: "SPEC-006",
    name: "Organ Transplantation & Hepato-Pancreato-Biliary",
    code: "TRANS",
    category: "Surgical & Intensive Care",
    proceduresCount: 9,
    hospitals: ["VPS Lakeshore, Kochi", "Aster Medcity, Kochi", "Amrita Institute"],
    keyProcedures: [
      "Living & Cadaveric Donor Liver Transplantation",
      "ABO-Incompatible Renal Transplantation",
      "Laparoscopic Living-Donor Hepatectomy",
      "Pancreatic Whipple & Complex Biliary Surgery"
    ],
    description: "One of South Asia's highest-volume living donor liver and kidney transplant units with >95% graft survival and dedicated transplant ICUs.",
    accreditations: ["Government Certified Transplant Center", "NABH Organ Unit"],
    leadDoctor: "Dr. Venugopal B., MS, MCh (GI Surgery)",
    status: "ACTIVE"
  }
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

const CATEGORIES_LIST = [
  "All Categories",
  "Surgical & Rehabilitation",
  "Interventional & Surgical",
  "Holistic & Traditional",
  "Medical, Surgical & Radiation",
  "Neurosciences",
  "Surgical & Intensive Care",
  "Dental & Maxillofacial",
  "Fertility & Reproductive"
];

export default function SpecialtiesAdminPage() {
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeSpecialty, setActiveSpecialty] = useState<SpecialtyItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "Surgical & Rehabilitation",
    proceduresCount: 10,
    hospitals: ["Aster Medcity, Kochi"],
    keyProcedures: "",
    description: "",
    accreditations: "JCI Accredited, NABH Center",
    leadDoctor: "",
    status: "ACTIVE" as "ACTIVE" | "INACTIVE"
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maides_admin_specialties");
    if (saved) {
      try {
        setSpecialties(JSON.parse(saved));
      } catch {
        setSpecialties(INITIAL_SPECIALTIES);
      }
    } else {
      setSpecialties(INITIAL_SPECIALTIES);
      localStorage.setItem("maides_admin_specialties", JSON.stringify(INITIAL_SPECIALTIES));
    }
  }, []);

  const saveToStorage = (updated: SpecialtyItem[]) => {
    setSpecialties(updated);
    localStorage.setItem("maides_admin_specialties", JSON.stringify(updated));
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      code: `SPEC-${Math.floor(100 + Math.random() * 900)}`,
      category: "Surgical & Rehabilitation",
      proceduresCount: 8,
      hospitals: ["Aster Medcity, Kochi"],
      keyProcedures: "Specialized Diagnostic Assessments, Minimally Invasive Procedures, Outpatient Consultation",
      description: "",
      accreditations: "JCI Accredited, NABH Center of Excellence",
      leadDoctor: "Chief Medical Specialist",
      status: "ACTIVE"
    });
    setIsAddModalOpen(true);
  };

  // Submit Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `SPEC-${String(specialties.length + 1).padStart(3, "0")}`;
    const proceduresArr = formData.keyProcedures
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const accreditationsArr = formData.accreditations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newSpecialty: SpecialtyItem = {
      id: newId,
      name: formData.name,
      code: formData.code || newId,
      category: formData.category,
      proceduresCount: Number(formData.proceduresCount) || proceduresArr.length || 5,
      hospitals: formData.hospitals.length ? formData.hospitals : ["Aster Medcity, Kochi"],
      keyProcedures: proceduresArr.length ? proceduresArr : ["Standardized Clinical Treatments"],
      description: formData.description || "Comprehensive clinical specialty unit delivering world-standard international patient care.",
      accreditations: accreditationsArr.length ? accreditationsArr : ["NABH Accredited"],
      leadDoctor: formData.leadDoctor || "Lead Clinical Consultant",
      status: formData.status
    };

    const updated = [newSpecialty, ...specialties];
    saveToStorage(updated);
    setIsAddModalOpen(false);
  };

  // Open Edit
  const handleOpenEdit = (item: SpecialtyItem) => {
    setActiveSpecialty(item);
    setFormData({
      name: item.name,
      code: item.code,
      category: item.category,
      proceduresCount: item.proceduresCount,
      hospitals: item.hospitals,
      keyProcedures: item.keyProcedures.join(", "),
      description: item.description,
      accreditations: item.accreditations.join(", "),
      leadDoctor: item.leadDoctor,
      status: item.status
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSpecialty) return;

    const proceduresArr = formData.keyProcedures
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const accreditationsArr = formData.accreditations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = specialties.map((s) => {
      if (s.id === activeSpecialty.id) {
        return {
          ...s,
          name: formData.name,
          code: formData.code,
          category: formData.category,
          proceduresCount: Number(formData.proceduresCount) || proceduresArr.length || s.proceduresCount,
          hospitals: formData.hospitals,
          keyProcedures: proceduresArr,
          description: formData.description,
          accreditations: accreditationsArr,
          leadDoctor: formData.leadDoctor,
          status: formData.status
        };
      }
      return s;
    });

    saveToStorage(updated);
    setIsEditModalOpen(false);
  };

  // Open View
  const handleOpenView = (item: SpecialtyItem) => {
    setActiveSpecialty(item);
    setIsViewModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (item: SpecialtyItem) => {
    setActiveSpecialty(item);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeSpecialty) return;
    const updated = specialties.filter((s) => s.id !== activeSpecialty.id);
    saveToStorage(updated);
    setIsDeleteModalOpen(false);
  };

  // Hospital Toggle
  const toggleHospital = (hosp: string) => {
    if (formData.hospitals.includes(hosp)) {
      setFormData({
        ...formData,
        hospitals: formData.hospitals.filter((h) => h !== hosp)
      });
    } else {
      setFormData({
        ...formData,
        hospitals: [...formData.hospitals, hosp]
      });
    }
  };

  // Filter
  const filteredSpecialties = specialties.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.hospitals.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase())) ||
      s.leadDoctor.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <HeartPulse className="w-5 h-5 text-[#0E82FD]" />
            Medical Specialties & Centers of Excellence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure clinical specialty clusters, affiliated partner hospitals, procedures catalog, and clinical leads.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Specialty
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Specialties</div>
            <div className="text-lg font-bold text-white">{specialties.length} Centers</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Catalog Procedures</div>
            <div className="text-lg font-bold text-purple-400">
              {specialties.reduce((acc, curr) => acc + (curr.proceduresCount || 0), 0)}+ Surgeries
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Partner Hospitals</div>
            <div className="text-lg font-bold text-emerald-400">{HOSPITALS_LIST.length} JCI Networks</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">International Standards</div>
            <div className="text-lg font-bold text-amber-400">JCI & NABH</div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search specialties, doctors, hospitals..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
          >
            {CATEGORIES_LIST.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Specialty Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSpecialties.length === 0 ? (
          <div className="col-span-full py-16 text-center text-slate-500 bg-slate-950 border border-slate-800/80 rounded-3xl">
            No medical specialties found matching your filter criteria.
          </div>
        ) : (
          filteredSpecialties.map((s) => (
            <div 
              key={s.id} 
              className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-5 rounded-3xl flex flex-col justify-between space-y-4 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
            >
              <div className="space-y-3">
                {/* Header Badge */}
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {s.code}
                  </span>
                  <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    {s.proceduresCount} Procedures
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-base font-bold text-white group-hover:text-[#0E82FD] transition-colors line-clamp-1">
                  {s.name}
                </h2>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {s.description}
                </p>

                {/* Lead Doctor */}
                {s.leadDoctor && (
                  <div className="text-[11px] text-slate-300 flex items-center gap-1.5 bg-slate-900/60 p-2 rounded-xl border border-slate-800/60">
                    <Stethoscope className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span className="truncate">Lead: <strong className="text-white">{s.leadDoctor}</strong></span>
                  </div>
                )}

                {/* Hospitals List */}
                <div className="space-y-1.5 pt-1">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    Partner Network
                  </div>
                  <div className="text-xs text-slate-300 line-clamp-1">
                    {s.hospitals.join(", ")}
                  </div>
                </div>
              </div>

              {/* Action Buttons Footer */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => handleOpenView(s)}
                  className="text-xs font-semibold text-[#0E82FD] hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  View Details
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleOpenEdit(s)}
                    title="Edit Specialty"
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800 hover:border-blue-500/30"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(s)}
                    title="Delete Specialty"
                    className="p-1.5 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all border border-slate-800 hover:border-red-500/30"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* ========================================================================= */}
      {/* ADD SPECIALTY MODAL                                                       */}
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
                  <h2 className="text-base font-bold text-white">Add Medical Specialty Unit</h2>
                  <p className="text-xs text-slate-400">Configure a new clinical department and center of excellence</p>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specialty Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ophthalmology & Refractive Laser Surgery"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specialty Short Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. OPHTH"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Clinical Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CATEGORIES_LIST.filter(c => c !== "All Categories").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Total Surgeries / Procedures Count
                  </label>
                  <input
                    type="number"
                    value={formData.proceduresCount}
                    onChange={(e) => setFormData({ ...formData, proceduresCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Lead Clinical Director / Surgeon
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. K. Narayanan, MS, FRCS"
                    value={formData.leadDoctor}
                    onChange={(e) => setFormData({ ...formData, leadDoctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department Overview & Technology Focus
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe clinical capabilities, robotic suites, subspecialty units..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Key Procedures (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. SMILE Laser, Phacoemulsification, Corneal Transplant, Vitrectomy"
                    value={formData.keyProcedures}
                    onChange={(e) => setFormData({ ...formData, keyProcedures: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Quality Certifications & Accreditations
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. JCI Accredited, NABH Digital, ISO 9001"
                    value={formData.accreditations}
                    onChange={(e) => setFormData({ ...formData, accreditations: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Partner Hospitals with this Specialty
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {HOSPITALS_LIST.map((hosp) => (
                      <label key={hosp} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hospitals.includes(hosp)}
                          onChange={() => toggleHospital(hosp)}
                          className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-[#0E82FD]"
                        />
                        <span>{hosp}</span>
                      </label>
                    ))}
                  </div>
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
                  Create Specialty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT SPECIALTY MODAL                                                      */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Specialty Center</h2>
                  <p className="text-xs text-slate-400">Update specialty details, hospitals, and procedure linkages</p>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specialty Department Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specialty Short Code
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Clinical Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CATEGORIES_LIST.filter(c => c !== "All Categories").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Procedures Count
                  </label>
                  <input
                    type="number"
                    value={formData.proceduresCount}
                    onChange={(e) => setFormData({ ...formData, proceduresCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Lead Clinical Specialist
                  </label>
                  <input
                    type="text"
                    value={formData.leadDoctor}
                    onChange={(e) => setFormData({ ...formData, leadDoctor: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Department Overview
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Key Procedures (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.keyProcedures}
                    onChange={(e) => setFormData({ ...formData, keyProcedures: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Accreditations
                  </label>
                  <input
                    type="text"
                    value={formData.accreditations}
                    onChange={(e) => setFormData({ ...formData, accreditations: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Partner Hospitals
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {HOSPITALS_LIST.map((hosp) => (
                      <label key={hosp} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hospitals.includes(hosp)}
                          onChange={() => toggleHospital(hosp)}
                          className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-[#0E82FD]"
                        />
                        <span>{hosp}</span>
                      </label>
                    ))}
                  </div>
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
      {/* VIEW DOSSIER MODAL                                                        */}
      {/* ========================================================================= */}
      {isViewModalOpen && activeSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-blue-400 font-bold">{activeSpecialty.code}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {activeSpecialty.category}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{activeSpecialty.name}</h2>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-5 mt-5">
              {/* Highlight Metrics */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Catalog Surgeries</div>
                  <div className="text-xl font-extrabold text-blue-400 mt-0.5">
                    {activeSpecialty.proceduresCount} Procedures
                  </div>
                  <div className="text-[10px] text-slate-500">Standardized packages</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Lead Specialist</div>
                  <div className="text-xs font-bold text-white mt-1 truncate">
                    {activeSpecialty.leadDoctor || "Senior Medical Team"}
                  </div>
                  <div className="text-[10px] text-slate-500">Clinical Leadership</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Quality Accreditation</div>
                  <div className="text-xs font-bold text-emerald-400 mt-1">
                    {activeSpecialty.accreditations.join(", ") || "JCI / NABH"}
                  </div>
                  <div className="text-[10px] text-slate-500">International Gold Standard</div>
                </div>
              </div>

              {/* Department Overview */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Center of Excellence Overview
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                  {activeSpecialty.description}
                </p>
              </div>

              {/* Key Surgeries & Procedures */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Flagship Procedures & Surgeries
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {activeSpecialty.keyProcedures.map((proc, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-xs text-slate-300 bg-slate-900/60 px-3.5 py-2 rounded-xl border border-slate-800">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0E82FD] shrink-0" />
                      <span>{proc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hospitals Offering */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Accredited Hospital Network
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeSpecialty.hospitals.map((hosp, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-900 text-slate-200 border border-slate-800 flex items-center gap-1.5">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {hosp}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-6">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(activeSpecialty);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Specialty
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-xs font-semibold text-white transition-all shadow-md"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DELETE CONFIRMATION MODAL                                                 */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && activeSpecialty && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Specialty Center</h3>
                <p className="text-xs text-slate-400">Action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-5">
              Are you sure you want to permanently remove <span className="text-white font-bold">{activeSpecialty.name}</span> (<span className="font-mono text-blue-400">{activeSpecialty.code}</span>) and its hospital linkages?
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold shadow-lg shadow-red-600/20 transition-all"
              >
                Delete Specialty
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
