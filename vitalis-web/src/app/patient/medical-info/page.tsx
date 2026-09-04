"use client";

import React, { useState } from "react";
import { 
  HeartPulse, 
  FileText, 
  AlertCircle, 
  Plus, 
  ShieldCheck, 
  Save, 
  CheckCircle2 
} from "lucide-react";

export default function PatientMedicalInfoPage() {
  const [medicalInfo, setMedicalInfo] = useState({
    bloodGroup: "O Positive (O+)",
    allergies: "Penicillin (Moderate rash)",
    currentMedications: "Paracetamol 500mg, Glucosamine Supplement",
    chronicConditions: "Primary Osteoarthritis (Right Knee)",
    previousSurgeries: "Appendectomy (2014)",
  });
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Medical History & Clinical Background
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Self-reported health info reviewed by your treating surgeon prior to hospital admission.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
            <input
              type="text"
              value={medicalInfo.bloodGroup}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodGroup: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Known Drug Allergies</label>
            <input
              type="text"
              value={medicalInfo.allergies}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Current Daily Medications</label>
          <input
            type="text"
            value={medicalInfo.currentMedications}
            onChange={(e) => setMedicalInfo({ ...medicalInfo, currentMedications: e.target.value })}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Chronic Conditions & Symptoms</label>
          <textarea
            rows={3}
            value={medicalInfo.chronicConditions}
            onChange={(e) => setMedicalInfo({ ...medicalInfo, chronicConditions: e.target.value })}
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
          />
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
          {isSaved && (
            <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-4 h-4" /> Medical history saved!
            </span>
          )}
          <button
            type="submit"
            className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            <Save className="w-4 h-4" />
            Update Medical Profile
          </button>
        </div>
      </form>
    </div>
  );
}
