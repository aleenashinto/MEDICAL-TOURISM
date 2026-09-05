"use client";

import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Search, 
  Plus, 
  Building2, 
  Clock, 
  DollarSign, 
  Tag, 
  Stethoscope,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  TrendingDown,
  ShieldCheck,
  FileText
} from "lucide-react";

interface TreatmentItem {
  id: string;
  name: string;
  code: string;
  specialty: string;
  duration: string;
  costUSD: number;
  costINR: number;
  usCostUSD: number;
  usSavings: string;
  description: string;
  inclusions: string[];
  hospitals: string[];
  status: "ACTIVE" | "INACTIVE" | "SPECIALIZED";
}

const INITIAL_TREATMENTS: TreatmentItem[] = [
  {
    id: "TRT-001",
    name: "Minimally Invasive Total Knee Replacement",
    code: "ORTHO-TKR-01",
    specialty: "Orthopedics & Joint Reconstruction",
    duration: "4 - 5 Days Hospital Stay",
    costUSD: 5400,
    costINR: 475000,
    usCostUSD: 45000,
    usSavings: "Save 88% vs US ($45,000)",
    description: "High-precision computer and MAKO robotic navigated arthroplasty using US-FDA approved titanium and ceramic implants with rapid recovery protocols.",
    inclusions: ["Surgeon & Anaesthetist fees", "Implant costs", "5 days private room stay", "Pre-op evaluations", "Post-op physiotherapy"],
    hospitals: ["Aster Medcity, Kochi", "Rajagiri Hospital, Aluva"],
    status: "ACTIVE"
  },
  {
    id: "TRT-002",
    name: "Off-Pump Coronary Artery Bypass (CABG)",
    code: "CARD-CABG-02",
    specialty: "Cardiology & Cardiothoracic",
    duration: "6 - 7 Days Hospital Stay",
    costUSD: 7400,
    costINR: 650000,
    usCostUSD: 120000,
    usSavings: "Save 93% vs US ($120,000)",
    description: "Minimally invasive beating-heart coronary bypass revascularization under Senior Director Dr. K. S. Muralidharan with rapid mobilization.",
    inclusions: ["Cardiothoracic surgical team", "ICU & Cardiac monitoring (2 days)", "Private room (5 days)", "Intraoperative TEE echo"],
    hospitals: ["Amrita Institute of Medical Sciences", "Aster Medcity, Kochi"],
    status: "ACTIVE"
  },
  {
    id: "TRT-003",
    name: "Comprehensive Ayurvedic Panchakarma & Stress Detox",
    code: "AYUR-PK-03",
    specialty: "Ayurveda & Integrative Medicine",
    duration: "14 - 21 Days Stay",
    costUSD: 2800,
    costINR: 245000,
    usCostUSD: 16000,
    usSavings: "Save 82% vs US ($16,000)",
    description: "Traditional 5-action Ayurvedic detoxification, Abhyangam, Shirodhara, customized herbal pharmacology, and seaside organic wellness regimen.",
    inclusions: ["Ayurvedic physician consultation", "Daily 2-hour dual-therapist treatments", "Custom herbal medicines", "Ayurvedic sattvic diet & seaside accommodation"],
    hospitals: ["Somatheeram Ayurvedic Village, Kovalam"],
    status: "ACTIVE"
  },
  {
    id: "TRT-004",
    name: "Endoscopic Spine & Skull Base Surgery",
    code: "NEURO-ESS-04",
    specialty: "Neurology & Neurosurgery",
    duration: "4 - 6 Days Hospital Stay",
    costUSD: 6800,
    costINR: 595000,
    usCostUSD: 65000,
    usSavings: "Save 89% vs US ($65,000)",
    description: "High-definition neuronavigation guided micro-discectomy and skull base resection by Lead Surgeon Dr. Rajesh K.",
    inclusions: ["Neurosurgical instrumentation fees", "Pre-op 3T MRI", "Neuro-ICU stay", "Post-op rehabilitation"],
    hospitals: ["Rajagiri Hospital, Aluva", "Amrita Institute of Medical Sciences"],
    status: "ACTIVE"
  },
  {
    id: "TRT-005",
    name: "Living-Donor Liver & Renal Transplantation",
    code: "TRAN-LVR-05",
    specialty: "Organ Transplant & Nephrology",
    duration: "14 - 21 Days Hospital Stay",
    costUSD: 24000,
    costINR: 2100000,
    usCostUSD: 350000,
    usSavings: "Save 93% vs US ($350,000)",
    description: "Quaternary multi-organ transplant procedures with dedicated transplant ICUs, laparoscopic donor hepatectomy, and comprehensive immunosuppression.",
    inclusions: ["Surgical & anaesthesia team", "Donor & Recipient ICU care", "Immunosuppression protocol", "Post-op monitoring"],
    hospitals: ["VPS Lakeshore, Kochi", "Aster Medcity, Kochi", "Amrita Institute of Medical Sciences"],
    status: "ACTIVE"
  }
];

const SPECIALTIES_LIST = [
  "All Specialties",
  "Orthopedics & Joint Reconstruction",
  "Cardiology & Cardiothoracic",
  "Ayurveda & Integrative Medicine",
  "Oncology & Cancer Care",
  "Bariatric & Metabolic Surgery",
  "Dental & Maxillofacial",
  "Neurology & Neurosurgery",
  "Organ Transplant & Nephrology"
];

const HOSPITALS_LIST = [
  "Aster Medcity, Kochi",
  "Amrita Institute of Medical Sciences",
  "VPS Lakeshore, Kochi",
  "Somatheeram Ayurvedic Village, Kovalam",
  "Rajagiri Hospital, Aluva"
];

export default function TreatmentsAdminPage() {
  const [treatments, setTreatments] = useState<TreatmentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("All Specialties");

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeTreatment, setActiveTreatment] = useState<TreatmentItem | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    specialty: "Orthopedics & Joint Reconstruction",
    duration: "4 - 5 Days Hospital Stay",
    costUSD: 5000,
    costINR: 415000,
    usCostUSD: 35000,
    usSavings: "Save 75% vs US",
    description: "",
    inclusions: "",
    hospitals: ["Aster Medcity, Kochi"],
    status: "ACTIVE" as "ACTIVE" | "INACTIVE" | "SPECIALIZED"
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maides_admin_treatments");
    if (saved) {
      try {
        setTreatments(JSON.parse(saved));
      } catch {
        setTreatments(INITIAL_TREATMENTS);
      }
    } else {
      setTreatments(INITIAL_TREATMENTS);
      localStorage.setItem("maides_admin_treatments", JSON.stringify(INITIAL_TREATMENTS));
    }
  }, []);

  const saveTreatmentsToStorage = (updatedList: TreatmentItem[]) => {
    setTreatments(updatedList);
    localStorage.setItem("maides_admin_treatments", JSON.stringify(updatedList));
  };

  // Open Create Modal
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      code: `TRT-${Math.floor(100 + Math.random() * 900)}`,
      specialty: "Orthopedics & Joint Reconstruction",
      duration: "3 - 5 Days Hospital Stay",
      costUSD: 4500,
      costINR: 373500,
      usCostUSD: 30000,
      usSavings: "Save 75% vs US ($30,000)",
      description: "",
      inclusions: "Surgeon fees, Private Room Stay, Standard Medications, Pre-op Diagnostics",
      hospitals: ["Aster Medcity, Kochi"],
      status: "ACTIVE"
    });
    setIsAddModalOpen(true);
  };

  // Submit Create
  const handleCreateTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TRT-${String(treatments.length + 1).padStart(3, "0")}`;
    const inclusionsArr = formData.inclusions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const calculatedSavings = formData.usCostUSD > 0
      ? `Save ${Math.round(((formData.usCostUSD - formData.costUSD) / formData.usCostUSD) * 100)}% vs US ($${formData.usCostUSD.toLocaleString()})`
      : "High Cost Advantage";

    const newTreatment: TreatmentItem = {
      id: newId,
      name: formData.name,
      code: formData.code || `MED-${newId}`,
      specialty: formData.specialty,
      duration: formData.duration,
      costUSD: Number(formData.costUSD),
      costINR: Number(formData.costINR) || Number(formData.costUSD) * 83,
      usCostUSD: Number(formData.usCostUSD),
      usSavings: calculatedSavings,
      description: formData.description || "Comprehensive clinical package offered across Kerala's accredited medical centers.",
      inclusions: inclusionsArr.length ? inclusionsArr : ["Hospital stay", "Specialist surgeon fees", "Initial medicines"],
      hospitals: formData.hospitals.length ? formData.hospitals : ["Aster Medcity, Kochi"],
      status: formData.status
    };

    const updated = [newTreatment, ...treatments];
    saveTreatmentsToStorage(updated);
    setIsAddModalOpen(false);
  };

  // Open Edit Modal
  const handleOpenEdit = (treatment: TreatmentItem) => {
    setActiveTreatment(treatment);
    setFormData({
      name: treatment.name,
      code: treatment.code,
      specialty: treatment.specialty,
      duration: treatment.duration,
      costUSD: treatment.costUSD,
      costINR: treatment.costINR,
      usCostUSD: treatment.usCostUSD,
      usSavings: treatment.usSavings,
      description: treatment.description,
      inclusions: treatment.inclusions.join(", "),
      hospitals: treatment.hospitals,
      status: treatment.status
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdateTreatment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTreatment) return;

    const inclusionsArr = formData.inclusions
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const calculatedSavings = formData.usCostUSD > 0
      ? `Save ${Math.round(((formData.usCostUSD - formData.costUSD) / formData.usCostUSD) * 100)}% vs US ($${formData.usCostUSD.toLocaleString()})`
      : formData.usSavings;

    const updated = treatments.map((t) => {
      if (t.id === activeTreatment.id) {
        return {
          ...t,
          name: formData.name,
          code: formData.code,
          specialty: formData.specialty,
          duration: formData.duration,
          costUSD: Number(formData.costUSD),
          costINR: Number(formData.costINR) || Number(formData.costUSD) * 83,
          usCostUSD: Number(formData.usCostUSD),
          usSavings: calculatedSavings,
          description: formData.description,
          inclusions: inclusionsArr,
          hospitals: formData.hospitals,
          status: formData.status
        };
      }
      return t;
    });

    saveTreatmentsToStorage(updated);
    setIsEditModalOpen(false);
  };

  // Open View Modal
  const handleOpenView = (treatment: TreatmentItem) => {
    setActiveTreatment(treatment);
    setIsViewModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (treatment: TreatmentItem) => {
    setActiveTreatment(treatment);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeTreatment) return;
    const updated = treatments.filter((t) => t.id !== activeTreatment.id);
    saveTreatmentsToStorage(updated);
    setIsDeleteModalOpen(false);
  };

  // Hospital Checkbox Toggle
  const toggleHospitalSelection = (hosp: string) => {
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

  // Filter treatments
  const filteredTreatments = treatments.filter((t) => {
    const matchesSearch =
      t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.hospitals.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecialty =
      selectedSpecialty === "All Specialties" || t.specialty === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Activity className="w-5 h-5 text-[#0E82FD]" />
            Medical Treatments & Surgical Procedures Catalog
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage procedures, standardized package prices, US/UK cost comparisons, and hospital linkages.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Treatment Package
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Active Procedures</div>
            <div className="text-lg font-bold text-white">{treatments.length} Procedures</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <TrendingDown className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Avg. Patient Savings</div>
            <div className="text-lg font-bold text-emerald-400">70% – 85% vs US</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Hospital Networks</div>
            <div className="text-lg font-bold text-white">{HOSPITALS_LIST.length} JCI/NABH Centers</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Price Transparency</div>
            <div className="text-lg font-bold text-amber-400">100% Fixed Quote</div>
          </div>
        </div>
      </div>

      {/* Treatments List & Filters */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        {/* Search and Filters Bar */}
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search treatments, codes, hospitals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              {SPECIALTIES_LIST.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Treatment Name & Code</th>
                <th className="py-3 px-4">Specialty Unit</th>
                <th className="py-3 px-4">Standard Package (USD/INR)</th>
                <th className="py-3 px-4">US Cost & Savings</th>
                <th className="py-3 px-4">Offered At Hospitals</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTreatments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No medical treatments found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTreatments.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {t.name}
                      </div>
                      <div className="text-[11px] text-blue-400 font-mono mt-0.5 flex items-center gap-1.5">
                        <span>{t.id}</span>
                        <span>•</span>
                        <span className="text-slate-400">{t.duration}</span>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-slate-900 text-slate-300 border border-slate-800 inline-block">
                        {t.specialty}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-emerald-400 text-sm">
                        ${t.costUSD.toLocaleString()}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        ₹{t.costINR.toLocaleString()}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                        <TrendingDown className="w-3 h-3" />
                        {t.usSavings}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        US Benchmark: ~${t.usCostUSD ? t.usCostUSD.toLocaleString() : "N/A"}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 text-[11px] line-clamp-2 max-w-[200px]">
                        {t.hospitals.join(", ")}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.status === "ACTIVE"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : t.status === "SPECIALIZED"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-slate-800 text-slate-400"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(t)}
                          title="View Procedure Details"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Procedure"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800 hover:border-blue-500/30"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(t)}
                          title="Delete Procedure"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all border border-slate-800 hover:border-red-500/30"
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

      {/* ========================================================================= */}
      {/* ADD TREATMENT MODAL                                                       */}
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
                  <h2 className="text-base font-bold text-white">Add Medical Treatment Package</h2>
                  <p className="text-xs text-slate-400">Publish a standardized surgical procedure to the catalog</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTreatment} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Treatment / Procedure Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimally Invasive Total Hip Replacement"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Specialty Category *
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {SPECIALTIES_LIST.filter(s => s !== "All Specialties").map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Clinical Duration / Hospital Stay
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 4 - 5 Days Hospital Stay"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kerala Package Cost (USD $) *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 6200"
                    value={formData.costUSD}
                    onChange={(e) => {
                      const usd = Number(e.target.value);
                      setFormData({ 
                        ...formData, 
                        costUSD: usd,
                        costINR: Math.round(usd * 83)
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    US Standard Benchmark Cost (USD $)
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 45000"
                    value={formData.usCostUSD}
                    onChange={(e) => setFormData({ ...formData, usCostUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Clinical Overview & Technology
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe surgical technique, implants used, rehabilitation benefits..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Package Inclusions (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Surgeon Fees, Titanium Implant, 5-Day Private Suite, Post-Op Physio"
                    value={formData.inclusions}
                    onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Available At Hospitals (Select all that apply)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {HOSPITALS_LIST.map((hosp) => (
                      <label key={hosp} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hospitals.includes(hosp)}
                          onChange={() => toggleHospitalSelection(hosp)}
                          className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-[#0E82FD]"
                        />
                        <span>{hosp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="ACTIVE">ACTIVE (Published)</option>
                    <option value="SPECIALIZED">SPECIALIZED (On Request)</option>
                    <option value="INACTIVE">INACTIVE (Archived)</option>
                  </select>
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
                  Create Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT TREATMENT MODAL                                                      */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Treatment Package</h2>
                  <p className="text-xs text-slate-400">Modify package pricing, hospital partners, and details</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateTreatment} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Treatment / Procedure Name *
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
                    Specialty Category *
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {SPECIALTIES_LIST.filter(s => s !== "All Specialties").map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Clinical Duration
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Kerala Package Cost (USD $) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.costUSD}
                    onChange={(e) => {
                      const usd = Number(e.target.value);
                      setFormData({ 
                        ...formData, 
                        costUSD: usd,
                        costINR: Math.round(usd * 83)
                      });
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    US Standard Benchmark (USD $)
                  </label>
                  <input
                    type="number"
                    value={formData.usCostUSD}
                    onChange={(e) => setFormData({ ...formData, usCostUSD: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Clinical Overview & Highlights
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
                    Package Inclusions (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.inclusions}
                    onChange={(e) => setFormData({ ...formData, inclusions: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Available At Hospitals
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                    {HOSPITALS_LIST.map((hosp) => (
                      <label key={hosp} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.hospitals.includes(hosp)}
                          onChange={() => toggleHospitalSelection(hosp)}
                          className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-[#0E82FD]"
                        />
                        <span>{hosp}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Publication Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="ACTIVE">ACTIVE (Published)</option>
                    <option value="SPECIALIZED">SPECIALIZED (On Request)</option>
                    <option value="INACTIVE">INACTIVE (Archived)</option>
                  </select>
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
      {isViewModalOpen && activeTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono text-blue-400 font-bold">{activeTreatment.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {activeTreatment.specialty}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{activeTreatment.name}</h2>
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
              {/* Cost & Savings Summary Card */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-3 gap-4 text-center sm:text-left">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Kerala Package Price</div>
                  <div className="text-xl font-extrabold text-emerald-400 mt-0.5">
                    ${activeTreatment.costUSD.toLocaleString()}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    ₹{activeTreatment.costINR.toLocaleString()}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 font-medium">US Benchmark Price</div>
                  <div className="text-lg font-bold text-slate-300 mt-0.5">
                    ~${activeTreatment.usCostUSD ? activeTreatment.usCostUSD.toLocaleString() : "45,000"}
                  </div>
                  <div className="text-[10px] text-slate-500">Uninsured US Cost</div>
                </div>

                <div>
                  <div className="text-[11px] text-slate-400 font-medium">Patient Value Savings</div>
                  <div className="text-base font-bold text-emerald-400 mt-0.5 flex items-center justify-center sm:justify-start gap-1">
                    <TrendingDown className="w-4 h-4" />
                    {activeTreatment.usSavings}
                  </div>
                  <div className="text-[10px] text-emerald-500/80">Inclusive Care</div>
                </div>
              </div>

              {/* Procedure Overview */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-[#0E82FD]" />
                  Clinical Procedure Overview
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/40 p-3.5 rounded-xl border border-slate-800">
                  {activeTreatment.description || "Comprehensive clinical package offered across Kerala's top tertiary hospitals."}
                </p>
              </div>

              {/* Inclusions */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Package Inclusions & Clinical Amenities
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeTreatment.inclusions.map((inc, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-900/60 px-3 py-2 rounded-xl border border-slate-800/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>{inc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Partner Hospitals */}
              <div>
                <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 text-purple-400" />
                  Available At Accredited Hospitals
                </h3>
                <div className="flex flex-wrap gap-2">
                  {activeTreatment.hospitals.map((hosp, i) => (
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
                  handleOpenEdit(activeTreatment);
                }}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-medium text-white border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Procedure
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
      {isDeleteModalOpen && activeTreatment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Delete Treatment Procedure</h3>
                <p className="text-xs text-slate-400">Action cannot be undone</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-5">
              Are you sure you want to permanently remove <span className="text-white font-bold">{activeTreatment.name}</span> (<span className="font-mono text-blue-400">{activeTreatment.id}</span>) from the medical catalog?
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
                Delete Procedure
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
