"use client";

import React from "react";
import { 
  FileText, 
  UploadCloud, 
  Download, 
  Lock, 
  Eye, 
  ShieldCheck, 
  FileCheck,
  Calendar
} from "lucide-react";

export default function PatientDocumentsPage() {
  const documents = [
    {
      id: "DOC-001",
      name: "MRI Knee Scan & Radiology Report.pdf",
      type: "Radiology / Imaging",
      size: "14.2 MB",
      uploadedAt: "Aug 20, 2026",
      verified: true,
    },
    {
      id: "DOC-002",
      name: "Pre-Operative Blood Profile & ECG.pdf",
      type: "Pathology",
      size: "2.8 MB",
      uploadedAt: "Aug 22, 2026",
      verified: true,
    },
    {
      id: "DOC-003",
      name: "Indian Medical Visa Invitation Letter.pdf",
      type: "Travel / Visa",
      size: "840 KB",
      uploadedAt: "Sep 02, 2026",
      verified: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
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
      <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 bg-white p-8 rounded-2xl text-center transition-colors">
        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>
        <h2 className="text-sm font-bold text-slate-800">Upload New Medical Record or Scan</h2>
        <p className="text-xs text-slate-500 mt-1">
          Drag and drop PDF, DICOM, JPG, or PNG files up to 50MB
        </p>
        <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl transition-all shadow-sm">
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
                <button className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-all">
                  <Eye className="w-4 h-4" />
                </button>
                <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-all">
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
