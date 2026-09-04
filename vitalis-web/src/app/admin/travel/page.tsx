"use client";

import React, { useState, useEffect } from "react";
import { 
  Plane, 
  FileText, 
  Calendar, 
  Hotel, 
  Car, 
  Plus, 
  Download, 
  CheckCircle2, 
  Clock, 
  Building2,
  Send,
  UserCheck,
  Search,
  Filter,
  Eye,
  Edit,
  Trash2,
  X,
  AlertTriangle,
  User,
  ShieldCheck,
  MapPin,
  Phone
} from "lucide-react";

interface VisaLetterItem {
  id: string;
  caseId: string;
  patient: string;
  country: string;
  hospital: string;
  attendant: string;
  passportNo: string;
  issueDate: string;
  treatment: string;
  status: "ISSUED_DOWNLOADED" | "GENERATED_PENDING_EMBASSY" | "PROCESSING" | "EXPIRED";
}

interface AirportTransferItem {
  id: string;
  patient: string;
  flight: string;
  arrivalAirport: string;
  arrivalDateTime: string;
  vehicleType: string;
  driverName: string;
  destination: string;
  status: "DISPATCHED" | "ASSIGNED" | "COMPLETED" | "SCHEDULED";
}

interface HotelStayItem {
  id: string;
  patient: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  hospitalProximity: string;
  status: "BOOKED_CONFIRMED" | "CHECKED_IN" | "CHECKED_OUT";
}

const INITIAL_VISAS: VisaLetterItem[] = [
  {
    id: "VISA-8821",
    caseId: "CAS-2026-089",
    patient: "Sarah Jenkins",
    country: "United Kingdom",
    hospital: "Aster Medcity, Kochi",
    attendant: "Mark Jenkins (Spouse)",
    passportNo: "UK9988221A",
    issueDate: "2026-09-02",
    treatment: "Total Knee Replacement",
    status: "ISSUED_DOWNLOADED"
  },
  {
    id: "VISA-8820",
    caseId: "CAS-2026-088",
    patient: "Mohammed Al-Maktoum",
    country: "United Arab Emirates",
    hospital: "Amrita Institute of Medical Sciences",
    attendant: "Ali Al-Maktoum (Brother)",
    passportNo: "AE4433221C",
    issueDate: "2026-09-04",
    treatment: "Robotic Cardiac Valve Repair",
    status: "GENERATED_PENDING_EMBASSY"
  },
  {
    id: "VISA-8819",
    caseId: "CAS-2026-085",
    patient: "Elena Rostova",
    country: "Germany",
    hospital: "Somatheeram Ayurvedic Village, Kovalam",
    attendant: "Hans Rostova (Husband)",
    passportNo: "DE66239104",
    issueDate: "2026-07-16",
    treatment: "Ayurvedic Panchakarma & Rejuvenation",
    status: "ISSUED_DOWNLOADED"
  }
];

const INITIAL_TRANSFERS: AirportTransferItem[] = [
  {
    id: "TRF-301",
    patient: "David Miller",
    flight: "EK 530 from Dubai (DXB)",
    arrivalAirport: "Cochin International Airport (COK)",
    arrivalDateTime: "2026-09-06 18:45 IST",
    vehicleType: "Toyota Innova Crysta (AC Medical Escort)",
    driverName: "Suresh Babu (+91 94470 12345)",
    destination: "Aster Medcity & Kochi Marriott Hotel",
    status: "DISPATCHED"
  },
  {
    id: "TRF-302",
    patient: "Fatima Al-Zahra",
    flight: "QR 514 from Doha (DOH)",
    arrivalAirport: "Cochin International Airport (COK)",
    arrivalDateTime: "2026-09-08 08:30 IST",
    vehicleType: "Luxury Mercedes Van (Wheelchair Accessible)",
    driverName: "Manoj Kumar (+91 94470 67890)",
    destination: "Amrita Institute & Grand Hyatt Kochi",
    status: "ASSIGNED"
  }
];

const INITIAL_HOTELS: HotelStayItem[] = [
  {
    id: "HTL-101",
    patient: "Sarah Jenkins",
    hotelName: "Kochi Marriott Hotel, Edappally",
    roomType: "Executive Suite (Medical Recovery)",
    checkIn: "2026-09-15",
    checkOut: "2026-09-25",
    hospitalProximity: "10 mins to Aster Medcity",
    status: "BOOKED_CONFIRMED"
  },
  {
    id: "HTL-102",
    patient: "Mohammed Al-Maktoum",
    hotelName: "Grand Hyatt Kochi Bolgatty",
    roomType: "Waterfront Suite",
    checkIn: "2026-09-18",
    checkOut: "2026-09-30",
    hospitalProximity: "15 mins to Amrita Institute",
    status: "BOOKED_CONFIRMED"
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

export default function TravelVisasPage() {
  const [activeSubTab, setActiveSubTab] = useState<"VISAS" | "AIRPORT" | "HOTELS">("VISAS");
  const [visas, setVisas] = useState<VisaLetterItem[]>([]);
  const [transfers, setTransfers] = useState<AirportTransferItem[]>([]);
  const [hotels, setHotels] = useState<HotelStayItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals
  const [isGenerateVisaOpen, setIsGenerateVisaOpen] = useState(false);
  const [isEditVisaOpen, setIsEditVisaOpen] = useState(false);
  const [isViewVisaOpen, setIsViewVisaOpen] = useState(false);
  const [isAddTransferOpen, setIsAddTransferOpen] = useState(false);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);

  const [activeVisa, setActiveVisa] = useState<VisaLetterItem | null>(null);

  // Form State for Visa
  const [visaForm, setVisaForm] = useState({
    caseId: "CAS-2026-089",
    patient: "",
    country: "United Kingdom",
    hospital: "Aster Medcity, Kochi",
    attendant: "",
    passportNo: "",
    treatment: "Total Knee Replacement",
    status: "ISSUED_DOWNLOADED" as VisaLetterItem["status"]
  });

  // Form State for Transfer
  const [transferForm, setTransferForm] = useState({
    patient: "",
    flight: "EK 530 (DXB -> COK)",
    arrivalAirport: "Cochin International Airport (COK)",
    arrivalDateTime: "2026-09-10 18:30 IST",
    vehicleType: "Toyota Innova Crysta (AC Medical Escort)",
    driverName: "Rahul Nair (+91 98470 11223)",
    destination: "Aster Medcity & Marriott Hotel",
    status: "ASSIGNED" as AirportTransferItem["status"]
  });

  // Form State for Hotel
  const [hotelForm, setHotelForm] = useState({
    patient: "",
    hotelName: "Kochi Marriott Hotel",
    roomType: "Executive Recovery Suite",
    checkIn: "2026-09-12",
    checkOut: "2026-09-22",
    hospitalProximity: "10 mins from Hospital",
    status: "BOOKED_CONFIRMED" as HotelStayItem["status"]
  });

  // Load from localStorage
  useEffect(() => {
    const savedVisas = localStorage.getItem("maides_admin_visas");
    const savedTransfers = localStorage.getItem("maides_admin_transfers");
    const savedHotels = localStorage.getItem("maides_admin_hotels");

    setVisas(savedVisas ? JSON.parse(savedVisas) : INITIAL_VISAS);
    setTransfers(savedTransfers ? JSON.parse(savedTransfers) : INITIAL_TRANSFERS);
    setHotels(savedHotels ? JSON.parse(savedHotels) : INITIAL_HOTELS);
  }, []);

  const saveVisas = (updated: VisaLetterItem[]) => {
    setVisas(updated);
    localStorage.setItem("maides_admin_visas", JSON.stringify(updated));
  };

  const saveTransfers = (updated: AirportTransferItem[]) => {
    setTransfers(updated);
    localStorage.setItem("maides_admin_transfers", JSON.stringify(updated));
  };

  const saveHotels = (updated: HotelStayItem[]) => {
    setHotels(updated);
    localStorage.setItem("maides_admin_hotels", JSON.stringify(updated));
  };

  // Submit Generate Visa
  const handleCreateVisa = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `VISA-${Math.floor(8825 + Math.random() * 90)}`;
    const today = new Date().toISOString().split("T")[0];

    const newItem: VisaLetterItem = {
      id: newId,
      caseId: visaForm.caseId || "CAS-2026-090",
      patient: visaForm.patient || "International Patient",
      country: visaForm.country,
      hospital: visaForm.hospital,
      attendant: visaForm.attendant || "None",
      passportNo: visaForm.passportNo || "TBD",
      issueDate: today,
      treatment: visaForm.treatment,
      status: visaForm.status
    };

    const updated = [newItem, ...visas];
    saveVisas(updated);
    setIsGenerateVisaOpen(false);
  };

  // Submit Create Transfer
  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TRF-${Math.floor(305 + Math.random() * 50)}`;
    const newItem: AirportTransferItem = {
      id: newId,
      patient: transferForm.patient || "International Patient",
      flight: transferForm.flight,
      arrivalAirport: transferForm.arrivalAirport,
      arrivalDateTime: transferForm.arrivalDateTime,
      vehicleType: transferForm.vehicleType,
      driverName: transferForm.driverName,
      destination: transferForm.destination,
      status: transferForm.status
    };

    const updated = [newItem, ...transfers];
    saveTransfers(updated);
    setIsAddTransferOpen(false);
  };

  // Submit Create Hotel
  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `HTL-${Math.floor(105 + Math.random() * 50)}`;
    const newItem: HotelStayItem = {
      id: newId,
      patient: hotelForm.patient || "International Patient",
      hotelName: hotelForm.hotelName,
      roomType: hotelForm.roomType,
      checkIn: hotelForm.checkIn,
      checkOut: hotelForm.checkOut,
      hospitalProximity: hotelForm.hospitalProximity,
      status: hotelForm.status
    };

    const updated = [newItem, ...hotels];
    saveHotels(updated);
    setIsAddHotelOpen(false);
  };

  // Download Formal FRRO Visa Letter
  const handleDownloadVisaLetter = (v: VisaLetterItem) => {
    const content = `GOVERNMENT OF INDIA - MINISTRY OF HOME AFFAIRS (FRRO)\nOFFICIAL INDIAN MEDICAL VISA (MED & MED-X) INVITATION LETTER\n\nReference ID: ${v.id}\nCase Number: ${v.caseId}\nDate of Issuance: ${v.issueDate}\n\nTO: The Visa Consular Officer, Indian Embassy / Consulate\n\nPATIENT DETAILS:\nFull Legal Name: ${v.patient}\nCountry of Citizenship: ${v.country}\nPassport Number: ${v.passportNo}\nAccompanying Medical Attendant: ${v.attendant}\n\nACCREDITED HOSPITAL IN KERALA, INDIA:\nHealthcare Institution: ${v.hospital}\nRecommended Clinical Procedure: ${v.treatment}\n\nThis certifies that the above patient has been accepted for medical care at ${v.hospital}. We request the issuance of an Indian Medical Visa (MED) for the patient and Medical Attendant Visa (MED-X) for the attendant.`;

    const element = document.createElement("a");
    const file = new Blob([content], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `FRRO_Medical_Visa_Letter_${v.patient.replace(/\s+/g, "_")}_${v.id}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  // Filtered Visas
  const filteredVisas = visas.filter((v) =>
    v.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.caseId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.hospital.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Plane className="w-5 h-5 text-[#0E82FD]" />
            Logistics, Visas & Ground Transfers
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Generate FRRO compliant Indian Medical Visa invitation letters, schedule airport liaisons, and coordinate recovery hotel stays.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {activeSubTab === "VISAS" && (
            <button
              onClick={() => setIsGenerateVisaOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Generate Visa Letter
            </button>
          )}
          {activeSubTab === "AIRPORT" && (
            <button
              onClick={() => setIsAddTransferOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule Transfer
            </button>
          )}
          {activeSubTab === "HOTELS" && (
            <button
              onClick={() => setIsAddHotelOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Book Hotel Stay
            </button>
          )}
        </div>
      </div>

      {/* Sub Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: "VISAS", label: `Medical Visa Invitations (${visas.length})`, icon: FileText },
          { id: "AIRPORT", label: `COK Airport & Transfers (${transfers.length})`, icon: Car },
          { id: "HOTELS", label: `Partner Hotel Accommodations (${hotels.length})`, icon: Hotel },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20 font-bold"
                  : "text-slate-400 hover:text-white bg-slate-950 border border-slate-800"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: VISAS LIST                                                         */}
      {/* ========================================================================= */}
      {activeSubTab === "VISAS" && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/40">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search visa by patient, country, hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Case & Patient</th>
                  <th className="py-3 px-4">Origin Country & Passport</th>
                  <th className="py-3 px-4">Designated Kerala Hospital</th>
                  <th className="py-3 px-4">Accompanying Attendant</th>
                  <th className="py-3 px-4 text-center">Visa Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredVisas.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-12 text-center text-slate-500">
                      No visa records matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredVisas.map((v) => (
                    <tr key={v.id} className="hover:bg-slate-900/40 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {v.patient}
                        </div>
                        <div className="text-[11px] text-blue-400 font-mono">{v.caseId} • {v.id}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300 font-medium">{v.country}</div>
                        <div className="text-[11px] text-slate-500 font-mono">Doc: {v.passportNo}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">{v.hospital}</div>
                        <div className="text-[11px] text-blue-400">{v.treatment}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="text-slate-300">{v.attendant}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          {v.status.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDownloadVisaLetter(v)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-xs font-semibold transition-all border border-slate-800"
                        >
                          <Download className="w-3.5 h-3.5" />
                          Download Letter
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: AIRPORT TRANSFERS                                                  */}
      {/* ========================================================================= */}
      {activeSubTab === "AIRPORT" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transfers.map((tr) => (
            <div
              key={tr.id}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3 shadow-sm hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-white group-hover:text-[#0E82FD] transition-colors">
                    {tr.patient}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono ml-2">({tr.id})</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                  {tr.status}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <div>Flight: <strong className="text-slate-200">{tr.flight}</strong></div>
                <div>Landing: <span className="text-blue-300 font-semibold">{tr.arrivalDateTime}</span></div>
                <div>Vehicle: <span className="text-slate-300">{tr.vehicleType}</span></div>
                <div>Assigned Chauffeur: <span className="text-emerald-400 font-medium">{tr.driverName}</span></div>
                <div>Route: <span className="text-slate-300">{tr.destination}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: HOTEL STAYS                                                        */}
      {/* ========================================================================= */}
      {activeSubTab === "HOTELS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.map((htl) => (
            <div
              key={htl.id}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3 shadow-sm hover:border-slate-700 transition-all group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-sm text-white group-hover:text-[#0E82FD] transition-colors">
                    {htl.patient}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono ml-2">({htl.id})</span>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {htl.status.replace(/_/g, " ")}
                </span>
              </div>
              <div className="text-xs text-slate-400 space-y-1 bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800">
                <div className="text-sm font-semibold text-slate-200">{htl.hotelName}</div>
                <div>Room: <span className="text-slate-300">{htl.roomType}</span></div>
                <div>Duration: <span className="text-blue-300 font-medium">{htl.checkIn} to {htl.checkOut}</span></div>
                <div>Location: <span className="text-emerald-400 font-medium">{htl.hospitalProximity}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* GENERATE VISA LETTER MODAL                                                */}
      {/* ========================================================================= */}
      {isGenerateVisaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Generate Indian Medical Visa Invitation</h2>
                  <p className="text-xs text-slate-400">FRRO Ministry of Home Affairs compliant documentation</p>
                </div>
              </div>
              <button
                onClick={() => setIsGenerateVisaOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateVisa} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Legal Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={visaForm.patient}
                    onChange={(e) => setVisaForm({ ...visaForm, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country of Citizenship *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. United Kingdom"
                    value={visaForm.country}
                    onChange={(e) => setVisaForm({ ...visaForm, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passport Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UK9988221A"
                    value={visaForm.passportNo}
                    onChange={(e) => setVisaForm({ ...visaForm, passportNo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Accompanying Attendant Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Mark Jenkins (Spouse)"
                    value={visaForm.attendant}
                    onChange={(e) => setVisaForm({ ...visaForm, attendant: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Designated Hospital *</label>
                  <select
                    value={visaForm.hospital}
                    onChange={(e) => setVisaForm({ ...visaForm, hospital: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {HOSPITALS_LIST.map((hosp) => (
                      <option key={hosp} value={hosp}>{hosp}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Clinical Procedure *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Minimally Invasive Total Knee Replacement"
                    value={visaForm.treatment}
                    onChange={(e) => setVisaForm({ ...visaForm, treatment: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsGenerateVisaOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Generate Official Letter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SCHEDULE TRANSFER MODAL                                                   */}
      {/* ========================================================================= */}
      {isAddTransferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Car className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Schedule Airport Transfer</h2>
                  <p className="text-xs text-slate-400">Assign ground chauffeur and medical ambulance transfer</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddTransferOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. David Miller"
                    value={transferForm.patient}
                    onChange={(e) => setTransferForm({ ...transferForm, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Flight Number & Origin *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EK 530 from Dubai (DXB)"
                    value={transferForm.flight}
                    onChange={(e) => setTransferForm({ ...transferForm, flight: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Arrival Date & Time *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026-09-12 18:45 IST"
                    value={transferForm.arrivalDateTime}
                    onChange={(e) => setTransferForm({ ...transferForm, arrivalDateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={transferForm.vehicleType}
                    onChange={(e) => setTransferForm({ ...transferForm, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Chauffeur & Contact</label>
                  <input
                    type="text"
                    value={transferForm.driverName}
                    onChange={(e) => setTransferForm({ ...transferForm, driverName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Destination Route</label>
                  <input
                    type="text"
                    value={transferForm.destination}
                    onChange={(e) => setTransferForm({ ...transferForm, destination: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTransferOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Schedule Dispatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOOK HOTEL MODAL                                                          */}
      {/* ========================================================================= */}
      {isAddHotelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Hotel className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Book Partner Recovery Hotel</h2>
                  <p className="text-xs text-slate-400">Pre-op & post-op sanitized accommodation bookings</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddHotelOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateHotel} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={hotelForm.patient}
                    onChange={(e) => setHotelForm({ ...hotelForm, patient: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Partner Hotel</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.hotelName}
                    onChange={(e) => setHotelForm({ ...hotelForm, hotelName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Room Category</label>
                  <input
                    type="text"
                    required
                    value={hotelForm.roomType}
                    onChange={(e) => setHotelForm({ ...hotelForm, roomType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Check-in Date</label>
                  <input
                    type="date"
                    required
                    value={hotelForm.checkIn}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkIn: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Check-out Date</label>
                  <input
                    type="date"
                    required
                    value={hotelForm.checkOut}
                    onChange={(e) => setHotelForm({ ...hotelForm, checkOut: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddHotelOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Confirm Reservation
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
