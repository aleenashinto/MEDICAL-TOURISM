"use client";

import React, { useState, useEffect } from "react";
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
  X,
  Trash2,
  Edit,
  Eye,
  ShieldCheck,
  Globe
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const INITIAL_HOSPITALS = [
  {
    id: "HSP-01",
    name: "Aster Medcity",
    city: "Kochi, Kerala",
    district: "Ernakulam / Kochi",
    region: "Central Kerala",
    accreditations: ["JCI Accredited", "NABH", "GreenOT"],
    beds: "670 Beds",
    specialties: ["Cardiology & Bypass", "Robotic Orthopaedics", "Comprehensive Oncology", "Neurology & Neurosurgery"],
    casesActive: 24,
    image: "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600",
    status: "ACTIVE"
  },
  {
    id: "HSP-02",
    name: "Amrita Institute of Medical Sciences",
    city: "Kochi, Kerala",
    district: "Ernakulam / Kochi",
    region: "Central Kerala",
    accreditations: ["NABH", "NABL", "ISO 9001"],
    beds: "1,350 Beds",
    specialties: ["Robotic Cardiac Surgery", "Living-Donor Transplants", "Pediatric Cardiology", "Comprehensive Oncology"],
    casesActive: 19,
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=600",
    status: "ACTIVE"
  },
  {
    id: "HSP-03",
    name: "VPS Lakeshore Hospital",
    city: "Kochi, Kerala",
    district: "Ernakulam / Kochi",
    region: "Central Kerala",
    accreditations: ["NABH", "JCI Certified"],
    beds: "450 Beds",
    specialties: ["Gastroenterology", "Living-Donor Transplants", "Robotic Orthopaedics"],
    casesActive: 12,
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=600",
    status: "ACTIVE"
  },
  {
    id: "HSP-04",
    name: "Somatheeram Ayurvedic Village",
    city: "Kovalam, Trivandrum",
    district: "Thiruvananthapuram",
    region: "South Kerala",
    accreditations: ["NABH Ayush", "Green Leaf Certified"],
    beds: "120 Ayurvedic Cottages",
    specialties: ["Classical Ayurveda", "Rehabilitation & Wellness"],
    casesActive: 15,
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
    status: "ACTIVE"
  },
  {
    id: "HSP-05",
    name: "Aster MIMS Kozhikode",
    city: "Kozhikode, Kerala",
    district: "Kozhikode",
    region: "North Kerala",
    accreditations: ["NABH", "NABL"],
    beds: "600 Beds",
    specialties: ["Cardiology & Bypass", "Neurology & Neurosurgery", "Living-Donor Transplants"],
    casesActive: 8,
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600&q=80",
    status: "ACTIVE"
  }
];

export default function HospitalsAdminPage() {
  const router = useRouter();
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHosp, setEditingHosp] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [hospitals, setHospitals] = useState<any[]>(INITIAL_HOSPITALS);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("maides_admin_hospitals");
      if (stored) {
        setHospitals(JSON.parse(stored));
      } else {
        setHospitals(INITIAL_HOSPITALS);
        localStorage.setItem("maides_admin_hospitals", JSON.stringify(INITIAL_HOSPITALS));
      }
    } catch (e) {
      setHospitals(INITIAL_HOSPITALS);
    }
  }, []);

  const saveHospitals = (updated: any[]) => {
    setHospitals(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_admin_hospitals", JSON.stringify(updated));
    }
  };

  const handleSaveHospital = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const city = (form.elements.namedItem("city") as HTMLInputElement).value;
    const district = (form.elements.namedItem("district") as HTMLSelectElement).value;
    const region = (form.elements.namedItem("region") as HTMLSelectElement).value;
    const beds = (form.elements.namedItem("beds") as HTMLInputElement).value;
    const image = (form.elements.namedItem("image") as HTMLInputElement).value || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600";

    if (editingHosp) {
      const updated = hospitals.map(h => h.id === editingHosp.id ? { 
        ...h, 
        name, 
        city, 
        district, 
        region, 
        beds: beds.includes("Beds") ? beds : `${beds} Beds`,
        image 
      } : h);
      saveHospitals(updated);
      setToast(`Hospital ${name} updated successfully!`);
      setEditingHosp(null);
    } else {
      const newHosp = {
        id: `HSP-${Math.floor(10 + Math.random() * 90)}`,
        name,
        city,
        district,
        region,
        accreditations: ["NABH Accredited", "JCI Accredited"],
        beds: beds.includes("Beds") ? beds : `${beds} Beds`,
        specialties: ["Cardiology & Bypass", "Robotic Orthopaedics", "Comprehensive Oncology"],
        casesActive: 0,
        image,
        status: "ACTIVE"
      };
      const updated = [newHosp, ...hospitals];
      saveHospitals(updated);
      setToast(`Hospital ${name} published to accredited network!`);
      setShowAddModal(false);
    }
    setTimeout(() => setToast(null), 3500);
  };

  const handleDeleteHospital = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove ${name} from accredited network?`)) {
      const updated = hospitals.filter(h => h.id !== id);
      saveHospitals(updated);
      setToast(`Hospital ${name} removed.`);
      setTimeout(() => setToast(null), 3500);
    }
  };

  const filteredHospitals = hospitals.filter(h => 
    h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (h.district && h.district.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4 border border-emerald-500 max-w-md">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="text-xs font-bold">{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Accredited Partner Hospital Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage Kerala's top JCI & NABH accredited tertiary and quaternary care medical institutions.
          </p>
        </div>
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="/hospitals"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            <Eye className="w-4 h-4 text-[#0E82FD]" />
            <span>View Public Directory</span>
          </a>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Add Hospital Partner
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hospitals by name, city, district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold">{filteredHospitals.length} Hospitals Registered</span>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHospitals.map((hosp) => (
          <div
            key={hosp.id}
            className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-44 relative bg-slate-900 overflow-hidden">
                <img
                  src={hosp.image}
                  alt={hosp.name}
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-slate-800 text-[11px] font-semibold text-emerald-400">
                  {hosp.casesActive || 0} Active Cases
                </div>
              </div>

              <div className="p-5 space-y-3">
                <div>
                  <h2 className="text-base font-bold text-white">{hosp.name}</h2>
                  <div className="flex items-center gap-1 text-slate-400 text-xs mt-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{hosp.city} ({hosp.district || "Kerala"})</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {hosp.accreditations && hosp.accreditations.map((acc: string) => (
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
                  <div>Key Units: <span className="text-slate-300">{Array.isArray(hosp.specialties) ? hosp.specialties.join(", ") : hosp.specialties}</span></div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-900/40 border-t border-slate-800/80 flex items-center justify-between">
              <button 
                onClick={() => setEditingHosp(hosp)}
                className="text-xs text-blue-400 hover:text-blue-300 font-semibold cursor-pointer"
              >
                Edit Profile
              </button>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => router.push("/admin/doctors")}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                >
                  Doctors
                </button>
                <button
                  onClick={() => handleDeleteHospital(hosp.id, hosp.name)}
                  className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(showAddModal || editingHosp) && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
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
                <label className="block text-slate-400 mb-1">Hospital Name *</label>
                <input 
                  name="name" 
                  required 
                  defaultValue={editingHosp?.name || ""} 
                  placeholder="e.g. Aster Medcity / Apollo Adlux"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]" 
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">City / Address *</label>
                <input 
                  name="city" 
                  required 
                  defaultValue={editingHosp?.city || "Kochi, Kerala"} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">District</label>
                  <select
                    name="district"
                    defaultValue={editingHosp?.district || "Ernakulam / Kochi"}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="Ernakulam / Kochi">Ernakulam / Kochi</option>
                    <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                    <option value="Kozhikode">Kozhikode</option>
                    <option value="Kottayam">Kottayam</option>
                    <option value="Malappuram">Malappuram</option>
                    <option value="Thrissur">Thrissur</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Region</label>
                  <select
                    name="region"
                    defaultValue={editingHosp?.region || "Central Kerala"}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none"
                  >
                    <option value="Central Kerala">Central Kerala</option>
                    <option value="South Kerala">South Kerala</option>
                    <option value="North Kerala">North Kerala</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Bed Capacity *</label>
                <input 
                  name="beds" 
                  required 
                  defaultValue={editingHosp?.beds?.replace(" Beds", "") || "650"} 
                  placeholder="e.g. 650"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]" 
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Cover Image URL</label>
                <input 
                  name="image" 
                  defaultValue={editingHosp?.image || "https://images.unsplash.com/photo-1587351021759-3e566b6af7cc?auto=format&fit=crop&q=80&w=600"} 
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none" 
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button 
                  type="button"
                  onClick={() => { setShowAddModal(false); setEditingHosp(null); }}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl font-bold shadow-md shadow-blue-500/20"
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

