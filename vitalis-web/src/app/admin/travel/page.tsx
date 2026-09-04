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
  Phone,
  LayoutDashboard,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from "lucide-react";

// --- Types ---
export type VisaStatus = 
  | "Not Started"
  | "Documents Required"
  | "Documents Submitted"
  | "Application Submitted"
  | "Under Review"
  | "Approved"
  | "Rejected"
  | "Expired"
  | "Cancelled";

interface VisaRequest {
  id: string;
  caseId: string;
  patientName: string;
  patientPassport: string;
  country: string;
  hospital: string;
  visaType: "Medical Visa (MED)" | "Medical Attendant (MED-X)" | "e-Medical Visa";
  applicationDate: string;
  expectedApprovalDate: string;
  status: VisaStatus;
  attendantName?: string;
  attendantPassport?: string;
  notes: string;
  documentsSubmitted: boolean;
}

interface TravelPlan {
  id: string;
  patientName: string;
  country: string;
  arrivalDate: string;
  departureDate: string;
  flightDetails: string;
  arrivalAirport: string;
  assignedCoordinator: string;
  status: "Scheduled" | "In Transit" | "Arrived" | "Departed" | "Cancelled";
  notes: string;
}

interface GroundTransfer {
  id: string;
  patientName: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupDateTime: string;
  vehicleType: string;
  driverName: string;
  driverPhone: string;
  routeChain: string;
  status: "Today" | "Upcoming" | "Completed" | "Cancelled" | "Dispatched";
}

interface AccommodationBooking {
  id: string;
  patientName: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  hospitalProximity: string;
  dailyRate: string;
  status: "Confirmed" | "Checked In" | "Checked Out" | "Cancelled";
}

// --- Initial Data ---
const INITIAL_VISAS: VisaRequest[] = [
  {
    id: "VISA-8821",
    caseId: "CAS-2026-089",
    patientName: "Sarah Jenkins",
    patientPassport: "UK9988221A",
    country: "United Kingdom",
    hospital: "Aster Medcity, Kochi",
    visaType: "Medical Visa (MED)",
    applicationDate: "2026-08-25",
    expectedApprovalDate: "2026-09-02",
    status: "Approved",
    attendantName: "Mark Jenkins",
    attendantPassport: "UK9988222B",
    notes: "FRRO invitation letter signed and medical visa stamp verified.",
    documentsSubmitted: true
  },
  {
    id: "VISA-8820",
    caseId: "CAS-2026-088",
    patientName: "Mohammed Al-Maktoum",
    patientPassport: "AE4433221C",
    country: "United Arab Emirates",
    hospital: "Amrita Institute of Medical Sciences",
    visaType: "Medical Visa (MED)",
    applicationDate: "2026-09-01",
    expectedApprovalDate: "2026-09-08",
    status: "Under Review",
    attendantName: "Ali Al-Maktoum",
    attendantPassport: "AE4433222D",
    notes: "Consulate requested additional hospital diagnostic estimate letter.",
    documentsSubmitted: true
  },
  {
    id: "VISA-8819",
    caseId: "CAS-2026-085",
    patientName: "Elena Rostova",
    patientPassport: "DE66239104",
    country: "Germany",
    hospital: "Somatheeram Ayurvedic Village, Kovalam",
    visaType: "e-Medical Visa",
    applicationDate: "2026-07-10",
    expectedApprovalDate: "2026-07-15",
    status: "Approved",
    attendantName: "Hans Rostova",
    attendantPassport: "DE66239105",
    notes: "21-day Ayush medical visa granted.",
    documentsSubmitted: true
  },
  {
    id: "VISA-8818",
    caseId: "CAS-2026-092",
    patientName: "John O'Connor",
    patientPassport: "IE44901822",
    country: "Ireland",
    hospital: "Amrita Institute of Medical Sciences",
    visaType: "Medical Visa (MED)",
    applicationDate: "2026-09-03",
    expectedApprovalDate: "2026-09-10",
    status: "Documents Submitted",
    attendantName: "Mary O'Connor",
    attendantPassport: "IE44901823",
    notes: "Oncology treatment plan submitted to Indian Embassy Dublin.",
    documentsSubmitted: true
  }
];

const INITIAL_TRAVEL_PLANS: TravelPlan[] = [
  {
    id: "TRV-101",
    patientName: "Sarah Jenkins",
    country: "United Kingdom",
    arrivalDate: "2026-09-15 18:45 IST",
    departureDate: "2026-09-28 04:30 IST",
    flightDetails: "EK 530 (London -> Dubai -> Cochin COK)",
    arrivalAirport: "Cochin International Airport (COK)",
    assignedCoordinator: "Rahul Nair (Senior Logistics Lead)",
    status: "Scheduled",
    notes: "Special wheelchair assistance booked with Emirates airlines."
  },
  {
    id: "TRV-102",
    patientName: "Mohammed Al-Maktoum",
    country: "United Arab Emirates",
    arrivalDate: "2026-09-18 11:30 IST",
    departureDate: "2026-10-02 22:00 IST",
    flightDetails: "QR 514 (Doha DOH -> Cochin COK)",
    arrivalAirport: "Cochin International Airport (COK)",
    assignedCoordinator: "Anjali Menon (Concierge Desk)",
    status: "Scheduled",
    notes: "Direct VIP tarmac transfer requested."
  }
];

const INITIAL_TRANSFERS: GroundTransfer[] = [
  {
    id: "TRF-301",
    patientName: "David Miller",
    pickupLocation: "Cochin Airport (COK) Terminal 3",
    dropoffLocation: "Aster Medcity & Kochi Marriott",
    pickupDateTime: "2026-09-06 18:45 IST",
    vehicleType: "Toyota Innova Crysta (AC Medical Escort)",
    driverName: "Suresh Babu",
    driverPhone: "+91 94470 12345",
    routeChain: "Airport → Hotel → Hospital",
    status: "Today"
  },
  {
    id: "TRF-302",
    patientName: "Fatima Al-Zahra",
    pickupLocation: "Cochin Airport (COK)",
    dropoffLocation: "Amrita Institute & Grand Hyatt",
    pickupDateTime: "2026-09-08 08:30 IST",
    vehicleType: "Luxury Mercedes Van (Wheelchair Accessible)",
    driverName: "Manoj Kumar",
    driverPhone: "+91 94470 67890",
    routeChain: "Airport → Hospital",
    status: "Upcoming"
  }
];

const INITIAL_HOTELS: AccommodationBooking[] = [
  {
    id: "HTL-101",
    patientName: "Sarah Jenkins",
    hotelName: "Kochi Marriott Hotel, Edappally",
    roomType: "Executive Recovery Suite (Sanitized)",
    checkIn: "2026-09-15",
    checkOut: "2026-09-28",
    hospitalProximity: "10 mins to Aster Medcity",
    dailyRate: "$120 / night",
    status: "Confirmed"
  },
  {
    id: "HTL-102",
    patientName: "Mohammed Al-Maktoum",
    hotelName: "Grand Hyatt Kochi Bolgatty",
    roomType: "Waterfront Suite",
    checkIn: "2026-09-18",
    checkOut: "2026-10-02",
    hospitalProximity: "15 mins to Amrita Institute",
    dailyRate: "$180 / night",
    status: "Confirmed"
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

export default function LogisticsPage() {
  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "VISAS" | "TRAVEL" | "TRANSFERS" | "HOTELS">("DASHBOARD");
  
  // State Collections
  const [visas, setVisas] = useState<VisaRequest[]>([]);
  const [travelPlans, setTravelPlans] = useState<TravelPlan[]>([]);
  const [transfers, setTransfers] = useState<GroundTransfer[]>([]);
  const [hotels, setHotels] = useState<AccommodationBooking[]>([]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Modals
  const [isAddVisaOpen, setIsAddVisaOpen] = useState(false);
  const [isEditVisaOpen, setIsEditVisaOpen] = useState(false);
  const [isAddTravelOpen, setIsAddTravelOpen] = useState(false);
  const [isAddTransferOpen, setIsAddTransferOpen] = useState(false);
  const [isAddHotelOpen, setIsAddHotelOpen] = useState(false);
  const [activeVisa, setActiveVisa] = useState<VisaRequest | null>(null);

  // Forms
  const [visaForm, setVisaForm] = useState({
    caseId: "CAS-2026-089",
    patientName: "",
    patientPassport: "",
    country: "United Kingdom",
    hospital: "Aster Medcity, Kochi",
    visaType: "Medical Visa (MED)" as VisaRequest["visaType"],
    applicationDate: new Date().toISOString().split("T")[0],
    expectedApprovalDate: new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0],
    status: "Documents Submitted" as VisaStatus,
    attendantName: "",
    attendantPassport: "",
    notes: ""
  });

  const [travelForm, setTravelForm] = useState({
    patientName: "",
    country: "United Kingdom",
    arrivalDate: "2026-09-20 18:30 IST",
    departureDate: "2026-10-04 06:00 IST",
    flightDetails: "EK 530 (London -> Dubai -> Cochin)",
    arrivalAirport: "Cochin International Airport (COK)",
    assignedCoordinator: "Rahul Nair",
    status: "Scheduled" as TravelPlan["status"],
    notes: ""
  });

  const [transferForm, setTransferForm] = useState({
    patientName: "",
    pickupLocation: "Cochin Airport (COK)",
    dropoffLocation: "Aster Medcity & Marriott Hotel",
    pickupDateTime: "2026-09-20 19:00 IST",
    vehicleType: "Toyota Innova Crysta (AC Medical Escort)",
    driverName: "Suresh Babu",
    driverPhone: "+91 94470 12345",
    routeChain: "Airport → Hotel → Hospital",
    status: "Upcoming" as GroundTransfer["status"]
  });

  const [hotelForm, setHotelForm] = useState({
    patientName: "",
    hotelName: "Kochi Marriott Hotel, Edappally",
    roomType: "Executive Recovery Suite",
    checkIn: "2026-09-20",
    checkOut: "2026-10-04",
    hospitalProximity: "10 mins to Aster Medcity",
    dailyRate: "$120 / night",
    status: "Confirmed" as AccommodationBooking["status"]
  });

  // Load / Save
  useEffect(() => {
    const svVisas = localStorage.getItem("maides_admin_visas_v2");
    const svTravel = localStorage.getItem("maides_admin_travel_v2");
    const svTrans = localStorage.getItem("maides_admin_transfers_v2");
    const svHotels = localStorage.getItem("maides_admin_hotels_v2");

    setVisas(svVisas ? JSON.parse(svVisas) : INITIAL_VISAS);
    setTravelPlans(svTravel ? JSON.parse(svTravel) : INITIAL_TRAVEL_PLANS);
    setTransfers(svTrans ? JSON.parse(svTrans) : INITIAL_TRANSFERS);
    setHotels(svHotels ? JSON.parse(svHotels) : INITIAL_HOTELS);
  }, []);

  const saveVisas = (updated: VisaRequest[]) => {
    setVisas(updated);
    localStorage.setItem("maides_admin_visas_v2", JSON.stringify(updated));
  };
  const saveTravel = (updated: TravelPlan[]) => {
    setTravelPlans(updated);
    localStorage.setItem("maides_admin_travel_v2", JSON.stringify(updated));
  };
  const saveTransfers = (updated: GroundTransfer[]) => {
    setTransfers(updated);
    localStorage.setItem("maides_admin_transfers_v2", JSON.stringify(updated));
  };
  const saveHotels = (updated: AccommodationBooking[]) => {
    setHotels(updated);
    localStorage.setItem("maides_admin_hotels_v2", JSON.stringify(updated));
  };

  // Submit Visa Create
  const handleCreateVisa = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `VISA-${Math.floor(8825 + Math.random() * 90)}`;
    const newV: VisaRequest = {
      id: newId,
      caseId: visaForm.caseId || "CAS-2026-090",
      patientName: visaForm.patientName || "International Patient",
      patientPassport: visaForm.patientPassport || "TBD",
      country: visaForm.country,
      hospital: visaForm.hospital,
      visaType: visaForm.visaType,
      applicationDate: visaForm.applicationDate,
      expectedApprovalDate: visaForm.expectedApprovalDate,
      status: visaForm.status,
      attendantName: visaForm.attendantName,
      attendantPassport: visaForm.attendantPassport,
      notes: visaForm.notes || "Official medical visa request logged.",
      documentsSubmitted: true
    };
    const updated = [newV, ...visas];
    saveVisas(updated);
    setIsAddVisaOpen(false);
  };

  // Submit Visa Update
  const handleUpdateVisa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVisa) return;
    const updated = visas.map((v) => {
      if (v.id === activeVisa.id) {
        return {
          ...v,
          patientName: visaForm.patientName,
          patientPassport: visaForm.patientPassport,
          country: visaForm.country,
          hospital: visaForm.hospital,
          visaType: visaForm.visaType,
          applicationDate: visaForm.applicationDate,
          expectedApprovalDate: visaForm.expectedApprovalDate,
          status: visaForm.status,
          attendantName: visaForm.attendantName,
          attendantPassport: visaForm.attendantPassport,
          notes: visaForm.notes
        };
      }
      return v;
    });
    saveVisas(updated);
    setIsEditVisaOpen(false);
  };

  // Archive / Cancel Visa
  const handleArchiveVisa = (id: string) => {
    const updated = visas.map((v) => {
      if (v.id === id) {
        return { ...v, status: "Cancelled" as const };
      }
      return v;
    });
    saveVisas(updated);
  };

  // Submit Travel Plan
  const handleCreateTravel = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TRV-${Math.floor(105 + Math.random() * 50)}`;
    const newT: TravelPlan = {
      id: newId,
      patientName: travelForm.patientName || "International Patient",
      country: travelForm.country,
      arrivalDate: travelForm.arrivalDate,
      departureDate: travelForm.departureDate,
      flightDetails: travelForm.flightDetails,
      arrivalAirport: travelForm.arrivalAirport,
      assignedCoordinator: travelForm.assignedCoordinator,
      status: travelForm.status,
      notes: travelForm.notes || "Flight & travel schedule confirmed."
    };
    const updated = [newT, ...travelPlans];
    saveTravel(updated);
    setIsAddTravelOpen(false);
  };

  // Cancel Travel Plan
  const handleCancelTravel = (id: string) => {
    const updated = travelPlans.map((t) => (t.id === id ? { ...t, status: "Cancelled" as const } : t));
    saveTravel(updated);
  };

  // Submit Transfer
  const handleCreateTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TRF-${Math.floor(305 + Math.random() * 50)}`;
    const newTr: GroundTransfer = {
      id: newId,
      patientName: transferForm.patientName || "International Patient",
      pickupLocation: transferForm.pickupLocation,
      dropoffLocation: transferForm.dropoffLocation,
      pickupDateTime: transferForm.pickupDateTime,
      vehicleType: transferForm.vehicleType,
      driverName: transferForm.driverName,
      driverPhone: transferForm.driverPhone,
      routeChain: transferForm.routeChain,
      status: transferForm.status
    };
    const updated = [newTr, ...transfers];
    saveTransfers(updated);
    setIsAddTransferOpen(false);
  };

  // Cancel Transfer
  const handleCancelTransfer = (id: string) => {
    const updated = transfers.map((tr) => (tr.id === id ? { ...tr, status: "Cancelled" as const } : tr));
    saveTransfers(updated);
  };

  // Submit Hotel Booking
  const handleCreateHotel = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `HTL-${Math.floor(105 + Math.random() * 50)}`;
    const newH: AccommodationBooking = {
      id: newId,
      patientName: hotelForm.patientName || "International Patient",
      hotelName: hotelForm.hotelName,
      roomType: hotelForm.roomType,
      checkIn: hotelForm.checkIn,
      checkOut: hotelForm.checkOut,
      hospitalProximity: hotelForm.hospitalProximity,
      dailyRate: hotelForm.dailyRate,
      status: hotelForm.status
    };
    const updated = [newH, ...hotels];
    saveHotels(updated);
    setIsAddHotelOpen(false);
  };

  // Cancel Hotel Booking
  const handleCancelHotel = (id: string) => {
    const updated = hotels.map((h) => (h.id === id ? { ...h, status: "Cancelled" as const } : h));
    saveHotels(updated);
  };

  // Download FRRO Letter
  const handleDownloadFRRO = (v: VisaRequest) => {
    const content = `GOVERNMENT OF INDIA - MINISTRY OF HOME AFFAIRS (FRRO)\nOFFICIAL INDIAN MEDICAL VISA (MED & MED-X) INVITATION LETTER\n\nReference: ${v.id}\nCase Number: ${v.caseId}\nIssued On: ${v.applicationDate}\nExpected Travel: ${v.expectedApprovalDate}\n\nPATIENT PROFILE:\nName: ${v.patientName}\nPassport No: ${v.patientPassport}\nCountry: ${v.country}\nVisa Type: ${v.visaType}\nAccompanying Attendant: ${v.attendantName || "None"} (Doc: ${v.attendantPassport || "N/A"})\n\nACCREDITED HEALTHCARE INSTITUTION IN KERALA:\nHospital: ${v.hospital}\n\nThis document confirms that ${v.patientName} is scheduled for clinical evaluation and surgical procedures at ${v.hospital}. We request the Embassy / Consulate to grant Medical Visa clearance.`;

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `FRRO_Visa_Invitation_${v.patientName.replace(/\s+/g, "_")}_${v.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Plane className="w-5 h-5 text-[#0E82FD]" />
            Logistics, Visas & Ground Transfers Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete management of Indian Medical Visas (FRRO), flight itineraries, airport transfers, and partner hotel recoveries.
          </p>
        </div>

        {/* Global Action Buttons based on Tab */}
        <div className="flex items-center gap-2">
          {activeTab === "VISAS" && (
            <button
              onClick={() => setIsAddVisaOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Create Visa Request
            </button>
          )}
          {activeTab === "TRAVEL" && (
            <button
              onClick={() => setIsAddTravelOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Travel Plan
            </button>
          )}
          {activeTab === "TRANSFERS" && (
            <button
              onClick={() => setIsAddTransferOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Schedule Transfer
            </button>
          )}
          {activeTab === "HOTELS" && (
            <button
              onClick={() => setIsAddHotelOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              Book Accommodation
            </button>
          )}
        </div>
      </div>

      {/* Primary Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-3 overflow-x-auto text-xs">
        {[
          { id: "DASHBOARD", label: "Logistics Dashboard", icon: LayoutDashboard },
          { id: "VISAS", label: `Visa Requests (${visas.length})`, icon: FileText },
          { id: "TRAVEL", label: `Travel Plans & Flights (${travelPlans.length})`, icon: Plane },
          { id: "TRANSFERS", label: `Ground Transfers (${transfers.length})`, icon: Car },
          { id: "HOTELS", label: `Hotel Accommodations (${hotels.length})`, icon: Hotel },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl font-semibold transition-all ${
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
      {/* 1. LOGISTICS DASHBOARD                                                    */}
      {/* ========================================================================= */}
      {activeTab === "DASHBOARD" && (
        <div className="space-y-6">
          {/* Main KPI Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Total Visa Applications</span>
                <div className="p-2.5 rounded-2xl bg-blue-500/10 text-[#0E82FD] border border-blue-500/20">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{visas.length} Visas</div>
              <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{visas.filter((v) => v.status === "Approved").length} Approved • {visas.filter((v) => v.status === "Under Review" || v.status === "Documents Submitted").length} Pending</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Upcoming Patient Arrivals</span>
                <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
                  <Plane className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{travelPlans.length} Flight Plans</div>
              <div className="text-[11px] text-purple-300 font-medium">Cochin International (COK) Hub</div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Ground Transfers Scheduled</span>
                <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <Car className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{transfers.length} Transfers</div>
              <div className="text-[11px] text-emerald-400 font-medium">
                {transfers.filter((t) => t.status === "Today").length} Today • {transfers.filter((t) => t.status === "Upcoming").length} Upcoming
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">Recovery Hotel Bookings</span>
                <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  <Hotel className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white">{hotels.length} Suites</div>
              <div className="text-[11px] text-amber-400 font-medium">Marriott & Grand Hyatt Kochi</div>
            </div>
          </div>

          {/* Quick Route Chain Architecture & Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-[#0E82FD]" />
                Standard Kerala Medical Tourism Transit Chain
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Coordinated hospital limousine and sanitized ambulance flow connecting international arrivals with NABH centers.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 bg-slate-900/60 p-4 rounded-2xl border border-slate-800 text-xs font-mono">
                <span className="text-blue-400 font-bold">COK Airport</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-purple-400 font-bold">Partner Hotel</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-emerald-400 font-bold">Hospital OPD / Surgery</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-amber-400 font-bold">Recovery</span>
                <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-blue-400 font-bold">Airport Departure</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Logistics Compliance & Patient Isolation
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                All patient flight details, visa registration records, and hotel bookings are role-isolated. International patients can exclusively access their own itinerary, while Admins hold multi-hospital coordination authority.
              </p>
              <div className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>FRRO e-Medical Visa Protocol V2.4 Active</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. VISA MANAGEMENT (CRUD & 9 STATUSES)                                    */}
      {/* ========================================================================= */}
      {activeTab === "VISAS" && (
        <div className="bg-slate-950 border border-slate-800/80 rounded-3xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900/40">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search visas by patient, passport, country..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              />
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
              >
                <option value="ALL">All Visa Statuses</option>
                <option value="Not Started">Not Started</option>
                <option value="Documents Required">Documents Required</option>
                <option value="Documents Submitted">Documents Submitted</option>
                <option value="Application Submitted">Application Submitted</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Rejected">Rejected</option>
                <option value="Expired">Expired</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                  <th className="py-3 px-4">Patient & Passport</th>
                  <th className="py-3 px-4">Origin & Hospital</th>
                  <th className="py-3 px-4">Visa Category</th>
                  <th className="py-3 px-4">Dates (Applied / Expected)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {visas
                  .filter((v) => {
                    const matchSearch =
                      v.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      v.patientPassport.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      v.country.toLowerCase().includes(searchTerm.toLowerCase());
                    const matchStatus = statusFilter === "ALL" || v.status === statusFilter;
                    return matchSearch && matchStatus;
                  })
                  .map((v) => (
                    <tr key={v.id} className="hover:bg-slate-900/40 transition-colors group">
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                          {v.patientName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Passport: {v.patientPassport} • {v.id}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="text-slate-200 font-medium">{v.country}</div>
                        <div className="text-[11px] text-blue-400">{v.hospital}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {v.visaType}
                        </span>
                        {v.attendantName && (
                          <div className="text-[10px] text-slate-500 mt-1">
                            Attendant: {v.attendantName}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-slate-300">
                        <div>Applied: <span className="font-mono text-[11px]">{v.applicationDate}</span></div>
                        <div className="text-[11px] text-slate-500">Exp: {v.expectedApprovalDate}</div>
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            v.status === "Approved"
                              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                              : v.status === "Under Review" || v.status === "Documents Submitted"
                              ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                              : v.status === "Rejected" || v.status === "Cancelled"
                              ? "bg-red-500/10 text-red-400 border border-red-500/20"
                              : "bg-slate-800 text-slate-400"
                          }`}
                        >
                          {v.status}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleDownloadFRRO(v)}
                            title="Download FRRO Official Invitation Letter"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-300 hover:text-white transition-all border border-slate-800"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              setActiveVisa(v);
                              setVisaForm({
                                caseId: v.caseId,
                                patientName: v.patientName,
                                patientPassport: v.patientPassport,
                                country: v.country,
                                hospital: v.hospital,
                                visaType: v.visaType,
                                applicationDate: v.applicationDate,
                                expectedApprovalDate: v.expectedApprovalDate,
                                status: v.status,
                                attendantName: v.attendantName || "",
                                attendantPassport: v.attendantPassport || "",
                                notes: v.notes
                              });
                              setIsEditVisaOpen(true);
                            }}
                            title="Edit Visa Record"
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          {v.status !== "Cancelled" && (
                            <button
                              onClick={() => handleArchiveVisa(v.id)}
                              title="Archive / Cancel Visa Request"
                              className="p-1.5 rounded-lg bg-slate-900 hover:bg-red-500/20 text-slate-300 hover:text-red-400 transition-all border border-slate-800"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. TRAVEL / FLIGHT PLANS                                                  */}
      {/* ========================================================================= */}
      {activeTab === "TRAVEL" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {travelPlans.map((trv) => (
            <div
              key={trv.id}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3 shadow-sm hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-white group-hover:text-[#0E82FD] transition-colors">
                      {trv.patientName}
                    </span>
                    <span className="text-xs text-slate-400">({trv.country})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {trv.status}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs text-slate-300">
                  <div>Flight Route: <strong className="text-white">{trv.flightDetails}</strong></div>
                  <div>Airport Hub: <span className="text-blue-400 font-mono">{trv.arrivalAirport}</span></div>
                  <div>Arrival Time: <span className="text-emerald-400 font-semibold">{trv.arrivalDate}</span></div>
                  <div>Departure Time: <span className="text-slate-400">{trv.departureDate}</span></div>
                  <div className="pt-1 text-[11px] text-slate-500">Coordinator: {trv.assignedCoordinator}</div>
                </div>

                {trv.notes && (
                  <div className="text-[11px] text-slate-400 italic bg-slate-900/40 p-2.5 rounded-xl border border-slate-800/60">
                    {trv.notes}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                {trv.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelTravel(trv.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold border border-slate-800 transition-all"
                  >
                    Cancel Plan
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. GROUND TRANSFERS & ROUTE CHAINS                                        */}
      {/* ========================================================================= */}
      {activeTab === "TRANSFERS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {transfers.map((tr) => (
            <div
              key={tr.id}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3 shadow-sm hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-[#0E82FD] transition-colors">
                      {tr.patientName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">({tr.id})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {tr.status}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 text-blue-300 font-semibold">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{tr.pickupDateTime}</span>
                  </div>
                  <div>Pickup: <span className="text-white">{tr.pickupLocation}</span></div>
                  <div>Dropoff: <span className="text-white">{tr.dropoffLocation}</span></div>
                  <div>Vehicle: <span className="text-slate-400">{tr.vehicleType}</span></div>
                  <div>Chauffeur: <span className="text-emerald-400 font-medium">{tr.driverName} ({tr.driverPhone})</span></div>
                  <div className="pt-1 text-[11px] text-purple-400 font-mono">Route Chain: {tr.routeChain}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                {tr.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelTransfer(tr.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold border border-slate-800 transition-all"
                  >
                    Cancel Transfer
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 5. HOTEL ACCOMMODATIONS & BOOKINGS                                        */}
      {/* ========================================================================= */}
      {activeTab === "HOTELS" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.map((htl) => (
            <div
              key={htl.id}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-3xl space-y-3 shadow-sm hover:border-slate-700 transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-sm text-white group-hover:text-[#0E82FD] transition-colors">
                      {htl.patientName}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono ml-2">({htl.id})</span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {htl.status}
                  </span>
                </div>

                <div className="bg-slate-900/60 p-3.5 rounded-2xl border border-slate-800 space-y-1 text-xs text-slate-300">
                  <div className="text-sm font-semibold text-white">{htl.hotelName}</div>
                  <div>Room Category: <span className="text-slate-300">{htl.roomType}</span></div>
                  <div>Stay Duration: <span className="text-blue-300 font-medium">{htl.checkIn} to {htl.checkOut}</span></div>
                  <div>Hospital Proximity: <span className="text-emerald-400 font-medium">{htl.hospitalProximity}</span></div>
                  <div className="text-[11px] text-slate-400 font-mono">Agreed Rate: {htl.dailyRate}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                {htl.status !== "Cancelled" && (
                  <button
                    onClick={() => handleCancelHotel(htl.id)}
                    className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-red-500/10 text-slate-400 hover:text-red-400 text-xs font-semibold border border-slate-800 transition-all"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: CREATE VISA REQUEST                                                */}
      {/* ========================================================================= */}
      {isAddVisaOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Create Indian Medical Visa Request</h2>
                  <p className="text-xs text-slate-400">FRRO Ministry of Home Affairs compliant documentation</p>
                </div>
              </div>
              <button onClick={() => setIsAddVisaOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900">
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
                    value={visaForm.patientName}
                    onChange={(e) => setVisaForm({ ...visaForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passport Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. UK9988221A"
                    value={visaForm.patientPassport}
                    onChange={(e) => setVisaForm({ ...visaForm, patientPassport: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Country of Origin *</label>
                  <input
                    type="text"
                    required
                    value={visaForm.country}
                    onChange={(e) => setVisaForm({ ...visaForm, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Visa Category</label>
                  <select
                    value={visaForm.visaType}
                    onChange={(e) => setVisaForm({ ...visaForm, visaType: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Medical Visa (MED)">Medical Visa (MED)</option>
                    <option value="Medical Attendant (MED-X)">Medical Attendant (MED-X)</option>
                    <option value="e-Medical Visa">e-Medical Visa</option>
                  </select>
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
                  <label className="block text-xs font-medium text-slate-300 mb-1">Visa Processing Status</label>
                  <select
                    value={visaForm.status}
                    onChange={(e) => setVisaForm({ ...visaForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Documents Required">Documents Required</option>
                    <option value="Documents Submitted">Documents Submitted</option>
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Attendant Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Mark Jenkins"
                    value={visaForm.attendantName}
                    onChange={(e) => setVisaForm({ ...visaForm, attendantName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Attendant Passport</label>
                  <input
                    type="text"
                    placeholder="e.g. UK9988222B"
                    value={visaForm.attendantPassport}
                    onChange={(e) => setVisaForm({ ...visaForm, attendantPassport: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Logistics Notes</label>
                  <textarea
                    rows={2}
                    placeholder="Consulate instructions or medical visa prerequisites..."
                    value={visaForm.notes}
                    onChange={(e) => setVisaForm({ ...visaForm, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddVisaOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Visa Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: EDIT VISA REQUEST                                                  */}
      {/* ========================================================================= */}
      {isEditVisaOpen && activeVisa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Visa Request ({activeVisa.id})</h2>
                  <p className="text-xs text-slate-400">Update consular status, passport numbers, or dates</p>
                </div>
              </div>
              <button onClick={() => setIsEditVisaOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdateVisa} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    required
                    value={visaForm.patientName}
                    onChange={(e) => setVisaForm({ ...visaForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Passport Number</label>
                  <input
                    type="text"
                    required
                    value={visaForm.patientPassport}
                    onChange={(e) => setVisaForm({ ...visaForm, patientPassport: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Visa Processing Status</label>
                  <select
                    value={visaForm.status}
                    onChange={(e) => setVisaForm({ ...visaForm, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="Documents Required">Documents Required</option>
                    <option value="Documents Submitted">Documents Submitted</option>
                    <option value="Application Submitted">Application Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="Expired">Expired</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Expected Approval Date</label>
                  <input
                    type="date"
                    value={visaForm.expectedApprovalDate}
                    onChange={(e) => setVisaForm({ ...visaForm, expectedApprovalDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Logistics Notes</label>
                  <textarea
                    rows={2}
                    value={visaForm.notes}
                    onChange={(e) => setVisaForm({ ...visaForm, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditVisaOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900"
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
      {/* MODAL: ADD TRAVEL PLAN                                                    */}
      {/* ========================================================================= */}
      {isAddTravelOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Plane className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Create Patient Travel & Flight Plan</h2>
                  <p className="text-xs text-slate-400">Record international flight itineraries and airport liaisons</p>
                </div>
              </div>
              <button onClick={() => setIsAddTravelOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTravel} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={travelForm.patientName}
                    onChange={(e) => setTravelForm({ ...travelForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Origin Country</label>
                  <input
                    type="text"
                    value={travelForm.country}
                    onChange={(e) => setTravelForm({ ...travelForm, country: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Flight Number & Routing *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. EK 530 (London -> Dubai -> Cochin COK)"
                    value={travelForm.flightDetails}
                    onChange={(e) => setTravelForm({ ...travelForm, flightDetails: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Arrival Date & Time *</label>
                  <input
                    type="text"
                    required
                    value={travelForm.arrivalDate}
                    onChange={(e) => setTravelForm({ ...travelForm, arrivalDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Departure Date & Time</label>
                  <input
                    type="text"
                    value={travelForm.departureDate}
                    onChange={(e) => setTravelForm({ ...travelForm, departureDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Travel Coordinator</label>
                  <input
                    type="text"
                    value={travelForm.assignedCoordinator}
                    onChange={(e) => setTravelForm({ ...travelForm, assignedCoordinator: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTravelOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Schedule Flight Plan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD TRANSFER                                                      */}
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
                  <h2 className="text-base font-bold text-white">Schedule Ground Transfer</h2>
                  <p className="text-xs text-slate-400">Assign chauffeur & vehicle between airport, hotel & hospital</p>
                </div>
              </div>
              <button onClick={() => setIsAddTransferOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransfer} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    value={transferForm.patientName}
                    onChange={(e) => setTransferForm({ ...transferForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pickup Date & Time *</label>
                  <input
                    type="text"
                    required
                    value={transferForm.pickupDateTime}
                    onChange={(e) => setTransferForm({ ...transferForm, pickupDateTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Pickup Location *</label>
                  <input
                    type="text"
                    required
                    value={transferForm.pickupLocation}
                    onChange={(e) => setTransferForm({ ...transferForm, pickupLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Dropoff Location *</label>
                  <input
                    type="text"
                    required
                    value={transferForm.dropoffLocation}
                    onChange={(e) => setTransferForm({ ...transferForm, dropoffLocation: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Vehicle Type</label>
                  <input
                    type="text"
                    value={transferForm.vehicleType}
                    onChange={(e) => setTransferForm({ ...transferForm, vehicleType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Chauffeur & Phone</label>
                  <input
                    type="text"
                    value={transferForm.driverName}
                    onChange={(e) => setTransferForm({ ...transferForm, driverName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Route Chain</label>
                  <input
                    type="text"
                    value={transferForm.routeChain}
                    onChange={(e) => setTransferForm({ ...transferForm, routeChain: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddTransferOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Schedule Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL: ADD HOTEL ACCOMMODATION                                            */}
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
              <button onClick={() => setIsAddHotelOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900">
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
                    value={hotelForm.patientName}
                    onChange={(e) => setHotelForm({ ...hotelForm, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
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
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900"
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
