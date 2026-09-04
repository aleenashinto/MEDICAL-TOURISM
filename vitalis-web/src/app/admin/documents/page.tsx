"use client";

import React from "react";
import { 
  FileText, 
  Search, 
  Download, 
  Eye, 
  ShieldCheck, 
  Lock,
  Calendar,
  Building2 
} from "lucide-react";

export default function DocumentsAdminPage() {
  const documents = [
    {
      id: "DOC-991",
      patient: "Sarah Jenkins",
      caseId: "CAS-2026-089",
      name: "MRI Knee Scan & Radiology Report.pdf",
      type: "Radiology / Imaging",
      size: "14.2 MB",
      uploadedAt: "Aug 20, 2026",
    },
    {
      id: "DOC-990",
      patient: "Mohammed Al-Maktoum",
      caseId: "CAS-2026-088",
      name: "Echocardiogram & Coronary Angiogram.pdf",
      type: "Cardiology",
      size: "18.5 MB",
      uploadedAt: "Aug 25, 2026",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Patient Medical Records & Clinical Documents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            HIPAA-compliant administrative review of global patient DICOM scans, surgical reports, and pathology.
          </p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Document & File Name</th>
                <th className="py-3 px-4">Patient & Case</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Size & Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{doc.name}</div>
                    <div className="text-[11px] text-blue-400 font-mono">{doc.id}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{doc.patient}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{doc.caseId}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {doc.type}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-400">
                    <div>{doc.size}</div>
                    <div className="text-[10px] text-slate-500">{doc.uploadedAt}</div>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-xs font-semibold transition-all">
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
