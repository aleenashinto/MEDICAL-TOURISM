"use client";

import React, { useState } from "react";
import { 
  Building2, 
  MapPin, 
  Award, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Search,
  BedDouble,
  Activity,
  X
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function HospitalsAdminPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHosp, setEditingHosp] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [hospitals, setHospitals] = useState([
    {
      id: "HSP-01",
      name: "Aster Medcity",
      city: "Kochi, Kerala",
      accreditations: ["JCI Accredited", "NABH", "GreenOT"],
      beds: "670 Beds",
      specialties: ["Cardiology", "Orthopedics", "Oncology", "Neurology"],
      casesActive: 24,
      image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "HSP-02",
      name: "Amrita Institute of Medical Sciences",
      city: "Kochi, Kerala",
      accreditations: ["NABH", "NABL", "ISO 9001"],
      beds: "1,350 Beds",
      specialties: ["Robotic Cardiac Surgery", "Organ Transplant", "Pediatric Cardiology"],
      casesActive: 19,
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    },
    {
      id: "HSP-03",
      name: "VPS Lakeshore Hospital",
      city: "Kochi, Kerala",
      accreditations: ["NABH", "JCI Certified"],
      beds: "450 Beds",
      specialties: ["Gastroenterology", "Liver Transplant", "Orthopedics"],
      casesActive: 12,
      image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    },
  ]);

  const handleSaveHospital = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const city = (form.elements.namedItem("city") as HTMLInputElement).value;
    const beds = (form.elements.namedItem("beds") as HTMLInputElement).value;

    if (editingHosp) {
      setHospitals(prev => prev.map(h => h.id === editingHosp.id ? { ...h, name, city, beds } : h));
      setToast(`Hospital ${name} updated successfully!`);
      setEditingHosp(null);
    } else {
      const newHosp = {
        id: `HSP-0${hospitals.length + 1}`,
        name,
        city,
        accreditations: ["NABH Accredited"],
        beds: `${beds} Beds`,
        specialties: ["Multi-Specialty"],
        casesActive: 0,
        image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600",
      };
      setHospitals(prev => [...prev, newHosp]);
      setToast(`Hospital ${name} added to accredited network!`);
      setShowAddModal(false);
    }
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Accredited Partner Hospital Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Kerala's top JCI & NABH accredited tertiary and quaternary care medical institutions.
          </p>
        </div>
        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Hospital Partner
        </button>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-40 relative bg-slate-900 overflow-hidden">
                <img
                  src={hosp.image}
                  alt={hosp.name}
                  className="w-full h-full object-cover opacity-80 hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-semibold text-emerald-400">
                  {hosp.casesActive} Active Cases
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h2 className="text-base font-bold text-white">{hosp.name}</h2>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{hosp.city}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hosp.accreditations.map((acc) => (
                    <span
                      key={acc}
                      className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20"
                    >
                      {acc}
                    </span>
                  ))}
                </div>

                <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 space-y-1">
                  <div>Capacity: <strong className="text-slate-200">{hosp.beds}</strong></div>
                  <div>Key Units: <span className="text-slate-300">{hosp.specialties.join(", ")}</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between">
              <button 
                onClick={() => setEditingHosp(hosp)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Edit Institutional Profile
              </button>
              <button 
                onClick={() => router.push("/admin/doctors")}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Manage Doctors
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingHosp) && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-sm text-white">
                {editingHosp ? `Edit ${editingHosp.name}` : "Add Partner Hospital"}
              </h3>
              <button 
                onClick={() => { setShowAddModal(false); setEditingHosp(null); }}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveHospital} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Hospital Name</label>
                <input 
                  name="name" 
                  required 
                  defaultValue={editingHosp?.name || ""} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" 
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">City / Region</label>
                <input 
                  name="city" 
                  required 
                  defaultValue={editingHosp?.city || "Kochi, Kerala"} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" 
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Bed Capacity</label>
                <input 
                  name="beds" 
                  required 
                  defaultValue={editingHosp?.beds?.replace(" Beds", "") || "500"} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2 text-white" 
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingHosp(null); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl font-bold"
                >
                  Save Partner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
