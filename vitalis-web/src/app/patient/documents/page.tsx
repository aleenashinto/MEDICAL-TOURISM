"use client";

import React, { useState, useRef } from "react";
import { 
  FileText, 
  UploadCloud, 
  Download, 
  Lock, 
  Eye, 
  ShieldCheck, 
  FileCheck,
  Calendar,
  X,
  CheckCircle2
} from "lucide-react";

export default function PatientDocumentsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [viewingDoc, setViewingDoc] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [documents, setDocuments] = useState([
    {
      id: "DOC-001",
      name: "MRI Knee Scan & Radiology Report.pdf",
      type: "Radiology / Imaging",
      size: "14.2 MB",
      uploadedAt: "Aug 20, 2026",
      verified: true,
      content: "Patient MRI shows high-grade cartilage defect at medial femoral condyle. Recommended for Total Knee Arthroplasty under Dr. Vijay Anand."
    },
    {
      id: "DOC-002",
      name: "Pre-Operative Blood Profile & ECG.pdf",
      type: "Pathology",
      size: "2.8 MB",
      uploadedAt: "Aug 22, 2026",
      verified: true,
      content: "Hemoglobin: 13.8 g/dL, Fasting Glucose: 92 mg/dL. ECG indicates normal sinus rhythm. Cleared for surgery."
    },
    {
      id: "DOC-003",
      name: "Indian Medical Visa Invitation Letter.pdf",
      type: "Travel / Visa",
      size: "840 KB",
      uploadedAt: "Sep 02, 2026",
      verified: true,
      content: "Government of India approved medical visa invitation from Aster Medcity, Kochi."
    },
  ]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      const newDoc = {
        id: `DOC-00${documents.length + 1}`,
        name: files[0].name,
        type: "Clinical Upload",
        size: `${(files[0].size / (1024 * 1024)).toFixed(1)} MB`,
        uploadedAt: "Just Now",
        verified: true,
        content: `Uploaded file content for ${files[0].name}. Verified by automated DICOM/PDF parser.`
      };
      setDocuments(prev => [newDoc, ...prev]);
      setToast(`Document "${files[0].name}" uploaded to encrypted locker!`);
      setTimeout(() => setToast(null), 3000);
    }
  };

  const handleDownload = (doc: any) => {
    const blob = new Blob([doc.content || `MAIDES Medical Record Document: ${doc.name}`], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = doc.name.replace(".pdf", ".txt");
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Medical Records & Secure Document Locker
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            HIPAA-compliant encrypted storage for clinical reports, DICOM scans, and visa paperwork.
          </p>
        </div>
      </div>

      {/* Upload Dropzone */}
      <div 
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white p-8 rounded-2xl text-center transition-colors cursor-pointer group"
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileUpload} 
          className="hidden" 
          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
        />
        <div className="w-12 h-12 rounded-full bg-blue-50 group-hover:bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3 transition-colors">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Upload New Medical Record or Scan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Drag and drop PDF, DICOM, JPG, or PNG files up to 50MB
        </p>
        <button 
          type="button"
          className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm cursor-pointer"
        >
          Browse Files
        </button>
      </div>

      {/* Document List */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="text-sm font-bold text-slate-800">Uploaded Documents ({documents.length})</div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium">
            <ShieldCheck className="w-4 h-4" />
            <span>256-Bit Encrypted Vault</span>
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {documents.map((doc) => (
            <div key={doc.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 shrink-0 mt-0.5">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-800">{doc.name}</div>
                  <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                    <span>{doc.type}</span>
                    <span>•</span>
                    <span>{doc.size}</span>
                    <span>•</span>
                    <span>Uploaded {doc.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={() => setViewingDoc(doc)}
                  title="Preview Document"
                  className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDownload(doc)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Document Preview Modal */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">{viewingDoc.name}</h3>
              <button onClick={() => setViewingDoc(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-xs text-slate-700 leading-relaxed font-mono">
              {viewingDoc.content}
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button 
                onClick={() => handleDownload(viewingDoc)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
