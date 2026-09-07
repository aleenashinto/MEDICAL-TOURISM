"use client";

import React, { useState, useEffect } from "react";
import { 
  HeartPulse, 
  Save, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";

export default function PatientMedicalInfoPage() {
  const [medicalInfo, setMedicalInfo] = useState({
    bloodType: "",
    allergies: "",
    medications: "",
    conditions: "",
    previousSurgeries: "",
  });
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMedicalInfo = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/patient/medical-info');
        const data = await res.json();
        if (data.success && data.medicalInfo) {
          const m = data.medicalInfo;
          setMedicalInfo({
            bloodType: m.bloodType || "",
            allergies: m.allergies || "",
            medications: m.medications || "",
            conditions: m.conditions || "",
            previousSurgeries: m.previousSurgeries || "",
          });
        }
      } catch (e) {
        console.error('Failed to load medical info', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMedicalInfo();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/patient/medical-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(medicalInfo),
      });
      const data = await res.json();
      if (data.success) {
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2500);
      } else {
        setError(data.error || 'Failed to save medical info.');
      }
    } catch (e) {
      setError('Network error. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <HeartPulse className="w-4 h-4" />
          Secure Clinical Record
        </div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Medical History & Clinical Background
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Self-reported health info reviewed by your treating surgeon prior to hospital admission.
        </p>
      </div>

      {isLoading ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center text-xs text-slate-400">
          Loading your medical information...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group / Type</label>
              <input
                type="text"
                placeholder="e.g. O Positive (O+)"
                value={medicalInfo.bloodType}
                onChange={(e) => setMedicalInfo({ ...medicalInfo, bloodType: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Known Drug Allergies</label>
              <input
                type="text"
                placeholder="e.g. Penicillin (Moderate rash)"
                value={medicalInfo.allergies}
                onChange={(e) => setMedicalInfo({ ...medicalInfo, allergies: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Current Daily Medications</label>
            <input
              type="text"
              placeholder="e.g. Paracetamol 500mg, Glucosamine Supplement"
              value={medicalInfo.medications}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, medications: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Chronic Conditions & Symptoms</label>
            <textarea
              rows={3}
              placeholder="e.g. Primary Osteoarthritis (Right Knee)"
              value={medicalInfo.conditions}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, conditions: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Previous Surgeries & Procedures</label>
            <textarea
              rows={2}
              placeholder="e.g. Appendectomy (2014), Knee Arthroscopy (2020)"
              value={medicalInfo.previousSurgeries}
              onChange={(e) => setMedicalInfo({ ...medicalInfo, previousSurgeries: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-xs text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-3 border-t border-slate-100">
            {isSaved && (
              <span className="text-xs text-emerald-600 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Medical history saved successfully!
              </span>
            )}
            <button
              type="submit"
              disabled={isSaving}
              className="ml-auto inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
            >
              <Save className="w-4 h-4" />
              {isSaving ? "Saving..." : "Update Medical Profile"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
