"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  ShieldCheck, 
  Lock,
  Calendar,
  Building2,
  Plus,
  Edit,
  Trash2,
  X,
  FileCheck2,
  Filter,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";

interface DocumentItem {
  id: string;
  name: string;
  patient: string;
  caseId: string;
  type: string;
  size: string;
  uploadedAt: string;
  status: "VERIFIED" | "PENDING_REVIEW" | "ARCHIVED";
  notes: string;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "DOC-991",
    patient: "Sarah Jenkins",
    caseId: "CAS-2026-089",
    name: "MRI Knee Joint & Orthopedic Radiograph.pdf",
    type: "Radiology / Imaging",
    size: "14.2 MB",
    uploadedAt: "2026-08-20",
    status: "VERIFIED",
    notes: "Approved by Dr. Vijay Anand for robotic knee replacement planning."
  },
  {
    id: "DOC-990",
    patient: "Mohammed Al-Maktoum",
    caseId: "CAS-2026-088",
    name: "Echocardiogram & Cardiac Catheterization Scan.pdf",
    type: "Cardiology",
    size: "18.5 MB",
    uploadedAt: "2026-08-25",
    status: "VERIFIED",
    notes: "Mitral regurgitation measurements verified by Amrita cardiology unit."
  },
  {
    id: "DOC-989",
    patient: "Elena Rostova",
    caseId: "CAS-2026-085",
    name: "Cervical Spine MRI & Functional Assessment.pdf",
    type: "Orthopedics & Spine",
    size: "8.9 MB",
    uploadedAt: "2026-07-16",
    status: "VERIFIED",
    notes: "Somatheeram Ayurvedic therapy regimen structured based on these scans."
  },
  {
    id: "DOC-988",
    patient: "John O'Connor",
    caseId: "CAS-2026-092",
    name: "PET-CT Whole Body Fusion & Histopathology.pdf",
    type: "Oncology & Pathology",
    size: "24.1 MB",
    uploadedAt: "2026-09-01",
    status: "PENDING_REVIEW",
    notes: "Awaiting review from Proton beam radiation oncology board."
  }
];

const CATEGORIES_LIST = [
  "All Types",
  "Radiology / Imaging",
  "Cardiology",
  "Orthopedics & Spine",
  "Oncology & Pathology",
  "Medical Visa / FRRO Letter",
  "Discharge Summary & Prescription"
];

export default function DocumentsAdminPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Types");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [activeDoc, setActiveDoc] = useState<DocumentItem | null>(null);

  // Form
  const [formData, setFormData] = useState({
    name: "",
    patient: "",
    caseId: "CAS-2026-089",
    type: "Radiology / Imaging",
    size: "5.4 MB",
    status: "VERIFIED" as "VERIFIED" | "PENDING_REVIEW" | "ARCHIVED",
    notes: ""
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maides_admin_documents");
    if (saved) {
      try {
        setDocuments(JSON.parse(saved));
      } catch {
        setDocuments(INITIAL_DOCUMENTS);
      }
    } else {
      setDocuments(INITIAL_DOCUMENTS);
      localStorage.setItem("maides_admin_documents", JSON.stringify(INITIAL_DOCUMENTS));
    }
  }, []);

  const saveDocs = (updated: DocumentItem[]) => {
    setDocuments(updated);
    localStorage.setItem("maides_admin_documents", JSON.stringify(updated));
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormData({
      name: "",
      patient: "",
      caseId: `CAS-2026-0${Math.floor(85 + Math.random() * 10)}`,
      type: "Radiology / Imaging",
      size: "6.2 MB",
      status: "VERIFIED",
      notes: ""
    });
    setIsAddModalOpen(true);
  };

  // Submit Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `DOC-${Math.floor(900 + Math.random() * 99)}`;
    const today = new Date().toISOString().split("T")[0];

    const newDoc: DocumentItem = {
      id: newId,
      name: formData.name.endsWith(".pdf") ? formData.name : `${formData.name}.pdf`,
      patient: formData.patient || "International Patient",
      caseId: formData.caseId,
      type: formData.type,
      size: formData.size,
      uploadedAt: today,
      status: formData.status,
      notes: formData.notes || "Uploaded to secure patient records vault."
    };

    const updated = [newDoc, ...documents];
    saveDocs(updated);
    setIsAddModalOpen(false);
  };

  // Open Edit
  const handleOpenEdit = (doc: DocumentItem) => {
    setActiveDoc(doc);
    setFormData({
      name: doc.name,
      patient: doc.patient,
      caseId: doc.caseId,
      type: doc.type,
      size: doc.size,
      status: doc.status,
      notes: doc.notes
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDoc) return;

    const updated = documents.map((d) => {
      if (d.id === activeDoc.id) {
        return {
          ...d,
          name: formData.name,
          patient: formData.patient,
          caseId: formData.caseId,
          type: formData.type,
          status: formData.status,
          notes: formData.notes
        };
      }
      return d;
    });

    saveDocs(updated);
    setIsEditModalOpen(false);
  };

  // Open View
  const handleOpenView = (doc: DocumentItem) => {
    setActiveDoc(doc);
    setIsViewModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (doc: DocumentItem) => {
    setActiveDoc(doc);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeDoc) return;
    const updated = documents.filter((d) => d.id !== activeDoc.id);
    saveDocs(updated);
    setIsDeleteModalOpen(false);
  };

  // Download Simulation
  const handleDownload = (doc: DocumentItem) => {
    const element = document.createElement("a");
    const file = new Blob([`MAIDES Healthcare Document Vault\nDocument: ${doc.name}\nPatient: ${doc.patient}\nCase ID: ${doc.caseId}\nType: ${doc.type}\nNotes: ${doc.notes}`], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = doc.name;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtered
  const filteredDocs = documents.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = categoryFilter === "All Types" || d.type === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <FileText className="w-5 h-5 text-[#0E82FD]" />
            Patient Medical Records & Clinical Documents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            HIPAA-compliant administrative review of global patient DICOM scans, surgical reports, pathology, and visa letters.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Upload Record
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Encrypted Vault Records</div>
            <div className="text-lg font-bold text-white">{documents.length} Files</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Verified Records</div>
            <div className="text-lg font-bold text-emerald-400">
              {documents.filter((d) => d.status === "VERIFIED").length} Verified
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Encryption Standard</div>
            <div className="text-lg font-bold text-amber-400">AES-256 GCM</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Hospital Linkages</div>
            <div className="text-lg font-bold text-purple-400">Direct DICOM</div>
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
              placeholder="Search documents, patients, cases..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Document & File Name</th>
                <th className="py-3 px-4">Patient & Case</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Size & Upload Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredDocs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    No clinical documents found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                        <span className="truncate max-w-[260px]">{doc.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">{doc.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{doc.patient}</div>
                      <div className="text-[11px] text-blue-400 font-mono">{doc.caseId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 inline-block">
                        {doc.type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-400">
                      <div>{doc.size}</div>
                      <div className="text-[10px] text-slate-500">{doc.uploadedAt}</div>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          doc.status === "VERIFIED"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleDownload(doc)}
                          title="Download Document"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-300 hover:text-white transition-all border border-slate-800"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenView(doc)}
                          title="View Details"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-all border border-slate-800"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          title="Edit Metadata"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleOpenDelete(doc)}
                          title="Delete / Archive"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all border border-slate-800"
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
      {/* ADD DOCUMENT MODAL                                                        */}
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
                  <h2 className="text-base font-bold text-white">Upload Medical Record / Scan</h2>
                  <p className="text-xs text-slate-400">Save patient DICOM imaging or pathology file</p>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Brain MRI Contrast Scan.pdf"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Name *</label>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Case ID *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CAS-2026-089"
                    value={formData.caseId}
                    onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Document Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CATEGORIES_LIST.filter(c => c !== "All Types").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Verification Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING_REVIEW">PENDING REVIEW</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Clinical Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Medical analysis notes from reviewing radiologist / surgeon..."
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
                  Save to Vault
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT MODAL                                                                */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Document Metadata ({activeDoc.id})</h2>
                  <p className="text-xs text-slate-400">Update file association, category, or notes</p>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Document Title</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient</label>
                  <input
                    type="text"
                    required
                    value={formData.patient}
                    onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Case ID</label>
                  <input
                    type="text"
                    required
                    value={formData.caseId}
                    onChange={(e) => setFormData({ ...formData, caseId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CATEGORIES_LIST.filter(c => c !== "All Types").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="VERIFIED">VERIFIED</option>
                    <option value="PENDING_REVIEW">PENDING REVIEW</option>
                    <option value="ARCHIVED">ARCHIVED</option>
                  </select>
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
      {isViewModalOpen && activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-blue-400 font-bold">{activeDoc.id}</span>
                  <h3 className="text-base font-bold text-white truncate max-w-[280px]">{activeDoc.name}</h3>
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
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">Patient:</span>
                  <span className="text-white font-semibold">{activeDoc.patient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Associated Case:</span>
                  <span className="font-mono text-blue-400">{activeDoc.caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Category:</span>
                  <span className="text-slate-200">{activeDoc.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">File Size:</span>
                  <span className="text-slate-200">{activeDoc.size}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Upload Date:</span>
                  <span className="text-slate-200">{activeDoc.uploadedAt}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Status:</span>
                  <span className="font-bold text-emerald-400">{activeDoc.status}</span>
                </div>
              </div>

              {activeDoc.notes && (
                <div className="bg-slate-900/40 border border-slate-800 p-3.5 rounded-2xl">
                  <div className="text-[11px] text-slate-400 uppercase font-semibold tracking-wider mb-1">Clinical Notes</div>
                  <p className="text-xs text-slate-300 leading-relaxed">{activeDoc.notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-5 border-t border-slate-800 mt-5">
              <button
                onClick={() => handleDownload(activeDoc)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-white border border-slate-700 transition-all flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download
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
      {/* DELETE MODAL                                                              */}
      {/* ========================================================================= */}
      {isDeleteModalOpen && activeDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Archive / Delete Record</h3>
                <p className="text-xs text-slate-400">HIPAA vault record removal</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3.5 rounded-xl border border-slate-800 mb-5">
              Are you sure you want to remove <span className="text-white font-bold">{activeDoc.name}</span> (<span className="font-mono text-blue-400">{activeDoc.id}</span>) from the active document vault?
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
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
