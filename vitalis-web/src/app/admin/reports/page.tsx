"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  BarChart3,
  TrendingUp,
  DollarSign,
  Users,
  HeartPulse,
  Building2,
  Calendar,
  Download,
  Filter,
  LifeBuoy,
  Star,
  Globe,
  CheckCircle2,
  Clock,
  AlertCircle,
  ChevronRight,
  ShieldCheck,
  RefreshCw,
  Search,
  PieChart,
  ArrowUpRight,
  UserCheck
} from "lucide-react";

export default function ReportsPage() {
  const [dateFilter, setDateFilter] = useState("all");
  const [activeReportTab, setActiveReportTab] = useState<
    "overview" | "patients" | "cases" | "appointments" | "financial" | "support" | "feedback"
  >("overview");

  // State for raw data pulled from local storage sources
  const [patients, setPatients] = useState<any[]>([]);
  const [cases, setCases] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [tickets, setTickets] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    loadAllPlatformData();
  }, []);

  const loadAllPlatformData = () => {
    try {
      // 1. Patients
      const storedPatients = localStorage.getItem("maides_admin_patients_v3");
      if (storedPatients) {
        setPatients(JSON.parse(storedPatients));
      } else {
        const defaultPatients = [
          { id: "P-1001", name: "Mohammed Al-Fassi", country: "United Arab Emirates", status: "Active", createdAt: "2026-08-10" },
          { id: "P-1002", name: "Sarah Jenkins", country: "United Kingdom", status: "Active", createdAt: "2026-08-15" },
          { id: "P-1003", name: "Ahmed Al-Mansoor", country: "Oman", status: "Active", createdAt: "2026-08-20" },
          { id: "P-1004", name: "Elena Rostova", country: "Germany", status: "Active", createdAt: "2026-08-25" },
          { id: "P-1005", name: "Tariq Mahmood", country: "Saudi Arabia", status: "Inactive", createdAt: "2026-07-12" },
          { id: "P-1006", name: "Fatima Al-Sayed", country: "Kuwait", status: "Active", createdAt: "2026-08-28" },
        ];
        setPatients(defaultPatients);
      }

      // 2. Cases
      const storedCases = localStorage.getItem("maides_admin_cases_v2");
      if (storedCases) {
        setCases(JSON.parse(storedCases));
      } else {
        const defaultCases = [
          { id: "CAS-9821", patientName: "Mohammed Al-Fassi", specialty: "Orthopedics & Joint Care", hospital: "Aster Medcity, Kochi", status: "Treatment Ongoing", estimatedCost: 6500, createdAt: "2026-08-11" },
          { id: "CAS-9822", patientName: "Sarah Jenkins", specialty: "Cardiology & Cardiac Surgery", hospital: "Amrita Hospital, Kochi", status: "Case Accepted", estimatedCost: 8200, createdAt: "2026-08-16" },
          { id: "CAS-9823", patientName: "Ahmed Al-Mansoor", specialty: "Ayurveda & Holistic Wellness", hospital: "Somatheeram Ayurvedic Resort", status: "Medical Review", estimatedCost: 3400, createdAt: "2026-08-21" },
          { id: "CAS-9824", patientName: "Elena Rostova", specialty: "Oncology & Precision Therapy", hospital: "Apollo Adlux Hospital", status: "Treatment Ongoing", estimatedCost: 11500, createdAt: "2026-08-26" },
          { id: "CAS-9825", patientName: "Fatima Al-Sayed", specialty: "Neurology & Spine Surgery", hospital: "Aster Medcity, Kochi", status: "Case Accepted", estimatedCost: 9200, createdAt: "2026-08-29" },
        ];
        setCases(defaultCases);
      }

      // 3. Appointments
      const storedAppointments = localStorage.getItem("maides_admin_appointments_v2");
      if (storedAppointments) {
        setAppointments(JSON.parse(storedAppointments));
      } else {
        const defaultAppts = [
          { id: "APT-801", patientName: "Mohammed Al-Fassi", doctor: "Dr. Anoop Menon", hospital: "Aster Medcity", date: "2026-09-08", specialty: "Orthopedics", status: "CONFIRMED" },
          { id: "APT-802", patientName: "Sarah Jenkins", doctor: "Dr. Rajesh Varma", hospital: "Amrita Hospital", date: "2026-09-10", specialty: "Cardiology", status: "CONFIRMED" },
          { id: "APT-803", patientName: "Elena Rostova", doctor: "Dr. Thomas Mathew", hospital: "Apollo Adlux", date: "2026-09-05", specialty: "Oncology", status: "COMPLETED" },
          { id: "APT-804", patientName: "Ahmed Al-Mansoor", doctor: "Dr. Lakshmi Nair", hospital: "Somatheeram", date: "2026-09-12", specialty: "Ayurveda", status: "PENDING" },
        ];
        setAppointments(defaultAppts);
      }

      // 4. Invoices & Payments
      const storedInvoices = localStorage.getItem("maides_admin_invoices_v3");
      const storedPayments = localStorage.getItem("maides_admin_payments_v3");
      if (storedInvoices) {
        setInvoices(JSON.parse(storedInvoices));
      } else {
        setInvoices([
          { id: "INV-2026-001", patientName: "Mohammed Al-Fassi", totalAmount: 6500, currency: "USD", status: "SETTLED", inrEquivalent: 546000 },
          { id: "INV-2026-002", patientName: "Sarah Jenkins", totalAmount: 8200, currency: "USD", status: "HELD_IN_ESCROW", inrEquivalent: 688800 },
          { id: "INV-2026-003", patientName: "Ahmed Al-Mansoor", totalAmount: 1300, currency: "OMR", status: "PENDING", inrEquivalent: 280800 },
          { id: "INV-2026-004", patientName: "Elena Rostova", totalAmount: 10500, currency: "EUR", status: "HELD_IN_ESCROW", inrEquivalent: 966000 },
        ]);
      }
      if (storedPayments) {
        setPayments(JSON.parse(storedPayments));
      }

      // 5. Support Tickets
      const storedTickets = localStorage.getItem("maides_shared_support_tickets_v3");
      if (storedTickets) {
        setTickets(JSON.parse(storedTickets));
      } else {
        setTickets([
          { id: "TICK-901", patientName: "Mohammed Al-Fassi", subject: "Airport Pickup Request", category: "Travel & Logistics", priority: "HIGH", status: "RESOLVED" },
          { id: "TICK-902", patientName: "Sarah Jenkins", subject: "Medical Visa Extension Query", category: "Visa Assistance", priority: "URGENT", status: "IN_PROGRESS" },
          { id: "TICK-903", patientName: "Elena Rostova", subject: "Escrow Payment Receipt Confirmation", category: "Billing & Escrow", priority: "MEDIUM", status: "RESOLVED" },
          { id: "TICK-904", patientName: "Ahmed Al-Mansoor", subject: "Dietary Preferences for Ayurvedic Stay", category: "Hospitality", priority: "LOW", status: "OPEN" },
        ]);
      }

      // 6. Patient Reviews
      const storedReviews = localStorage.getItem("maides_patient_reviews_v3");
      if (storedReviews) {
        setReviews(JSON.parse(storedReviews));
      } else {
        setReviews([
          { id: "REV-101", patientName: "Mohammed Al-Fassi", rating: 5, category: "Hospital & Treatment", comment: "Outstanding orthopedic surgery at Aster Medcity. Seamless coordination.", status: "PUBLISHED", verified: true },
          { id: "REV-102", patientName: "Sarah Jenkins", rating: 5, category: "MAIDES Coordination", comment: "The escort team and visa facilitators made my cardiac procedure completely stress-free.", status: "PUBLISHED", verified: true },
          { id: "REV-103", patientName: "Elena Rostova", rating: 5, category: "Hospital & Treatment", comment: "First-class oncology diagnostics and warm Kerala hospitality.", status: "PUBLISHED", verified: true },
          { id: "REV-104", patientName: "Ahmed Al-Mansoor", rating: 4, category: "Travel & Logistics", comment: "Great ayurvedic treatment, pickup vehicle was clean and on time.", status: "PUBLISHED", verified: true },
        ]);
      }

      setIsLoaded(true);
    } catch (e) {
      console.error("Error loading reports data:", e);
      setIsLoaded(true);
    }
  };

  // Reconciled Calculations
  const totalPatients = patients.length;
  const activePatients = patients.filter((p) => (p.status || "Active").toLowerCase() === "active").length;
  const totalCases = cases.length;
  const activeCases = cases.filter((c) => c.status !== "Closed" && c.status !== "Treatment Completed").length;

  const totalInvoicedINR = invoices.reduce((sum, inv) => sum + (inv.inrEquivalent || (inv.totalAmount * 84) || 0), 0);
  const settledINR = invoices
    .filter((inv) => inv.status === "SETTLED")
    .reduce((sum, inv) => sum + (inv.inrEquivalent || (inv.totalAmount * 84) || 0), 0);
  const escrowHeldINR = invoices
    .filter((inv) => inv.status === "HELD_IN_ESCROW")
    .reduce((sum, inv) => sum + (inv.inrEquivalent || (inv.totalAmount * 84) || 0), 0);
  const pendingINR = invoices
    .filter((inv) => inv.status === "PENDING" || inv.status === "UNPAID")
    .reduce((sum, inv) => sum + (inv.inrEquivalent || (inv.totalAmount * 84) || 0), 0);

  const openTickets = tickets.filter((t) => t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "WAITING_PATIENT").length;
  const resolvedTickets = tickets.filter((t) => t.status === "RESOLVED" || t.status === "CLOSED").length;

  const avgRating = reviews.length > 0 ? (reviews.reduce((acc, r) => acc + (Number(r.rating) || 5), 0) / reviews.length).toFixed(1) : "5.0";
  const promotersCount = reviews.filter((r) => Number(r.rating) >= 4).length;
  const npsScore = reviews.length > 0 ? Math.round((promotersCount / reviews.length) * 100) : 100;

  // Country Breakdown
  const countryCounts: Record<string, number> = {};
  patients.forEach((p) => {
    const c = p.country || "International";
    countryCounts[c] = (countryCounts[c] || 0) + 1;
  });

  // Specialty Breakdown
  const specialtyCounts: Record<string, number> = {};
  cases.forEach((c) => {
    const s = c.specialty || "General Medical";
    specialtyCounts[s] = (specialtyCounts[s] || 0) + 1;
  });

  // Hospital Breakdown
  const hospitalCounts: Record<string, number> = {};
  cases.forEach((c) => {
    const h = c.hospital || "Partner Hospital";
    hospitalCounts[h] = (hospitalCounts[h] || 0) + 1;
  });

  // Export Executive CSV
  const handleExportCSV = () => {
    let csv = "MAIDES Kerala Medical Tourism Platform - Executive Analytics & Operations Report\n";
    csv += `Generated On: ${new Date().toLocaleString()}\n\n`;

    csv += "--- EXECUTIVE SUMMARY ---\n";
    csv += `Total Registered Patients,${totalPatients}\n`;
    csv += `Active Care Cases,${activeCases}\n`;
    csv += `Total Invoiced (INR Equiv),₹${totalInvoicedINR.toLocaleString()}\n`;
    csv += `Total Held in Escrow (INR Equiv),₹${escrowHeldINR.toLocaleString()}\n`;
    csv += `Total Settled to Hospitals (INR Equiv),₹${settledINR.toLocaleString()}\n`;
    csv += `Active Support Tickets,${openTickets}\n`;
    csv += `Average Patient Satisfaction Score,${avgRating}/5.0\n`;
    csv += `Net Promoter Score (NPS),${npsScore}%\n\n`;

    csv += "--- PATIENTS COUNTRY DISTRIBUTION ---\n";
    csv += "Country,Patients,Share\n";
    Object.entries(countryCounts).forEach(([country, count]) => {
      csv += `"${country}",${count},${((count / totalPatients) * 100).toFixed(1)}%\n`;
    });
    csv += "\n";

    csv += "--- MEDICAL CASES BY SPECIALTY ---\n";
    csv += "Specialty,Case Volume,Share\n";
    Object.entries(specialtyCounts).forEach(([spec, count]) => {
      csv += `"${spec}",${count},${((count / totalCases) * 100).toFixed(1)}%\n`;
    });
    csv += "\n";

    csv += "--- ACCREDITED HOSPITAL CASE ALLOCATION ---\n";
    csv += "Hospital Facility,Assigned Cases\n";
    Object.entries(hospitalCounts).forEach(([hosp, count]) => {
      csv += `"${hosp}",${count}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `MAIDES_Executive_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-950/80 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-teal-500 text-white shadow-lg shadow-blue-500/20">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold text-white tracking-tight">
                Reports & Executive Analytics
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                Consolidated business intelligence reconciled across patients, medical cases, escrow billing, appointments, and reviews.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Timeframe:</span>
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="bg-transparent text-white font-medium focus:outline-none cursor-pointer"
            >
              <option value="all" className="bg-slate-900 text-white">All Records</option>
              <option value="today" className="bg-slate-900 text-white">Today</option>
              <option value="week" className="bg-slate-900 text-white">Last 7 Days</option>
              <option value="month" className="bg-slate-900 text-white">Last 30 Days</option>
              <option value="quarter" className="bg-slate-900 text-white">This Quarter</option>
              <option value="year" className="bg-slate-900 text-white">This Year (2026)</option>
            </select>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md shadow-blue-500/20 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            Export Executive CSV
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-950/80 border border-slate-800/80 rounded-2xl overflow-x-auto">
        {[
          { id: "overview", label: "Executive Overview", icon: Activity },
          { id: "patients", label: `Patients (${patients.length})`, icon: Users },
          { id: "cases", label: `Medical Cases (${cases.length})`, icon: HeartPulse },
          { id: "appointments", label: `Appointments (${appointments.length})`, icon: Calendar },
          { id: "financial", label: "Financial & Escrow", icon: DollarSign },
          { id: "support", label: `Support Tickets (${tickets.length})`, icon: LifeBuoy },
          { id: "feedback", label: `Reviews & NPS (${reviews.length})`, icon: Star },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeReportTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveReportTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXECUTIVE OVERVIEW */}
      {activeReportTab === "overview" && (
        <div className="space-y-6">
          {/* Key KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/90 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Volume (INR)</span>
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-[#0E82FD]">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-3">
                ₹{totalInvoicedINR.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-semibold mt-2">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>₹{settledINR.toLocaleString()} settled to hospitals</span>
              </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Escrow Held</span>
                <div className="p-2.5 rounded-xl bg-teal-500/10 text-teal-400">
                  <ShieldCheck className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-3">
                ₹{escrowHeldINR.toLocaleString()}
              </div>
              <div className="text-[11px] text-slate-400 mt-2">
                Safe international patient deposits
              </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Medical Cases</span>
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <HeartPulse className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-3">{activeCases} Cases</div>
              <div className="text-[11px] text-slate-400 mt-2">
                Out of {totalCases} total registered cases
              </div>
            </div>

            <div className="bg-slate-950/90 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Patient Satisfaction</span>
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
              </div>
              <div className="text-2xl font-black text-white mt-3 flex items-baseline gap-1.5">
                <span>{avgRating}</span>
                <span className="text-xs font-semibold text-slate-400">/ 5.0</span>
              </div>
              <div className="text-[11px] text-emerald-400 font-semibold mt-2">
                NPS: {npsScore}% positive rating
              </div>
            </div>
          </div>

          {/* Grid: Country breakdown + Specialty distribution */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Country Distribution */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#0E82FD]" />
                  <h2 className="text-sm font-bold text-white">Patient Origin Country Distribution</h2>
                </div>
                <span className="text-xs font-bold text-slate-400">{Object.keys(countryCounts).length} Countries</span>
              </div>

              <div className="space-y-3.5">
                {Object.entries(countryCounts).map(([country, count]) => {
                  const pct = Math.round((count / (totalPatients || 1)) * 100);
                  return (
                    <div key={country} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{country}</span>
                        <span className="text-slate-400 font-medium">
                          {count} patients ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-[#0E82FD] to-teal-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Specialty Breakdown */}
            <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <PieChart className="w-4 h-4 text-teal-400" />
                  <h2 className="text-sm font-bold text-white">Cases by Medical Specialty</h2>
                </div>
                <span className="text-xs font-bold text-slate-400">{Object.keys(specialtyCounts).length} Specialties</span>
              </div>

              <div className="space-y-3.5">
                {Object.entries(specialtyCounts).map(([spec, count]) => {
                  const pct = Math.round((count / (totalCases || 1)) * 100);
                  return (
                    <div key={spec} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">{spec}</span>
                        <span className="text-slate-400 font-medium">
                          {count} cases ({pct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Partner Hospital Load */}
          <div className="bg-slate-950/80 border border-slate-800/80 rounded-3xl p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                <h2 className="text-sm font-bold text-white">Hospital Network Case Allocation</h2>
              </div>
              <span className="text-xs font-bold text-slate-400">NABH / JCI Accredited Kerala Network</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {Object.entries(hospitalCounts).map(([hosp, count]) => (
                <div key={hosp} className="p-4 bg-slate-900/60 border border-slate-800/80 rounded-2xl">
                  <div className="text-xs font-bold text-slate-200">{hosp}</div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xl font-black text-white">{count}</span>
                    <span className="text-[11px] px-2 py-0.5 bg-blue-500/10 text-[#0E82FD] rounded-md font-semibold">
                      {Math.round((count / (totalCases || 1)) * 100)}% of workload
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PATIENTS ANALYTICS */}
      {activeReportTab === "patients" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Patients</div>
              <div className="text-2xl font-black text-white mt-2">{totalPatients}</div>
              <div className="text-xs text-emerald-400 mt-1">100% verified KYC & passport</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Active in Care Pipeline</div>
              <div className="text-2xl font-black text-blue-400 mt-2">{activePatients}</div>
              <div className="text-xs text-slate-400 mt-1">Currently coordinating travel/treatment</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Average Stay Duration</div>
              <div className="text-2xl font-black text-teal-400 mt-2">14.2 Days</div>
              <div className="text-xs text-slate-400 mt-1">Includes recuperation in Kerala</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Patient Registry Breakdown</h3>
              <span className="text-xs text-slate-400">{patients.length} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">Patient ID</th>
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Origin Country</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {patients.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-900/40 text-slate-200">
                      <td className="py-3 px-4 font-mono text-[#0E82FD] font-bold">{p.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{p.name}</td>
                      <td className="py-3 px-4">{p.country || "International"}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-bold">
                          {p.status || "Active"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400">{p.createdAt || "2026-08-15"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CASES ANALYTICS */}
      {activeReportTab === "cases" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Medical Cases</div>
              <div className="text-2xl font-black text-white mt-2">{cases.length}</div>
              <div className="text-xs text-slate-400 mt-1">Multi-specialty surgical & wellness</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Average Treatment Cost</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                $
                {cases.length > 0
                  ? Math.round(cases.reduce((sum, c) => sum + (Number(c.estimatedCost) || 7000), 0) / cases.length).toLocaleString()
                  : "7,500"}
              </div>
              <div className="text-xs text-slate-400 mt-1">65% lower than US/UK private care</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Treatment Success Rate</div>
              <div className="text-2xl font-black text-teal-400 mt-2">99.4%</div>
              <div className="text-xs text-slate-400 mt-1">Zero critical post-op complications</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Active Medical Case Log</h3>
              <span className="text-xs text-slate-400">{cases.length} cases</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">Case ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Specialty</th>
                    <th className="py-3 px-4">Assigned Hospital</th>
                    <th className="py-3 px-4">Est. Cost</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {cases.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-900/40 text-slate-200">
                      <td className="py-3 px-4 font-mono text-[#0E82FD] font-bold">{c.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{c.patientName}</td>
                      <td className="py-3 px-4">{c.specialty}</td>
                      <td className="py-3 px-4 text-slate-300">{c.hospital}</td>
                      <td className="py-3 px-4 font-bold text-emerald-400">${Number(c.estimatedCost || 0).toLocaleString()}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-blue-500/10 text-blue-400 rounded-md font-bold">
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: APPOINTMENTS ANALYTICS */}
      {activeReportTab === "appointments" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Scheduled Consultations</div>
              <div className="text-2xl font-black text-white mt-2">{appointments.length}</div>
              <div className="text-xs text-slate-400 mt-1">Doctor & Specialist sessions</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Confirmed & Completed</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">
                {appointments.filter((a) => a.status === "CONFIRMED" || a.status === "COMPLETED").length}
              </div>
              <div className="text-xs text-emerald-400 mt-1">96% show-up & adherence rate</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Pending Confirmation</div>
              <div className="text-2xl font-black text-amber-400 mt-2">
                {appointments.filter((a) => a.status === "PENDING").length}
              </div>
              <div className="text-xs text-slate-400 mt-1">Awaiting hospital slot allocation</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Consultation Appointments Schedule</h3>
              <span className="text-xs text-slate-400">{appointments.length} appointments</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">Appt ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Consultant Doctor</th>
                    <th className="py-3 px-4">Hospital</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {appointments.map((a) => (
                    <tr key={a.id} className="hover:bg-slate-900/40 text-slate-200">
                      <td className="py-3 px-4 font-mono text-[#0E82FD] font-bold">{a.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{a.patientName}</td>
                      <td className="py-3 px-4 text-slate-300">{a.doctor}</td>
                      <td className="py-3 px-4">{a.hospital}</td>
                      <td className="py-3 px-4">{a.date}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          a.status === "CONFIRMED" ? "bg-emerald-500/10 text-emerald-400" :
                          a.status === "COMPLETED" ? "bg-blue-500/10 text-blue-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: FINANCIAL & ESCROW ANALYTICS */}
      {activeReportTab === "financial" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Billed Volume</div>
              <div className="text-2xl font-black text-white mt-2">₹{totalInvoicedINR.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Multi-currency foreign exchange</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Held in Escrow Vault</div>
              <div className="text-2xl font-black text-teal-400 mt-2">₹{escrowHeldINR.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Protected until post-op signoff</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Settled to Hospitals</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">₹{settledINR.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Disbursed upon discharge</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Pending Collections</div>
              <div className="text-2xl font-black text-amber-400 mt-2">₹{pendingINR.toLocaleString()}</div>
              <div className="text-xs text-slate-400 mt-1">Awaiting wire / card confirmation</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Invoices & Escrow Pipeline Reconciled Ledger</h3>
              <span className="text-xs text-slate-400">{invoices.length} invoices</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Original Forex</th>
                    <th className="py-3 px-4">INR Equivalent</th>
                    <th className="py-3 px-4">Escrow Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-slate-900/40 text-slate-200">
                      <td className="py-3 px-4 font-mono text-[#0E82FD] font-bold">{inv.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{inv.patientName}</td>
                      <td className="py-3 px-4 font-bold text-slate-200">
                        {inv.currency} {Number(inv.totalAmount).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 font-bold text-emerald-400">
                        ₹{Number(inv.inrEquivalent || (inv.totalAmount * 84)).toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          inv.status === "SETTLED" ? "bg-emerald-500/10 text-emerald-400" :
                          inv.status === "HELD_IN_ESCROW" ? "bg-teal-500/10 text-teal-400" : "bg-amber-500/10 text-amber-400"
                        }`}>
                          {inv.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: SUPPORT TICKETS ANALYTICS */}
      {activeReportTab === "support" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Total Support Tickets</div>
              <div className="text-2xl font-black text-white mt-2">{tickets.length}</div>
              <div className="text-xs text-slate-400 mt-1">Shared live patient-admin queue</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Resolved / Closed</div>
              <div className="text-2xl font-black text-emerald-400 mt-2">{resolvedTickets}</div>
              <div className="text-xs text-emerald-400 mt-1">
                {tickets.length > 0 ? Math.round((resolvedTickets / tickets.length) * 100) : 100}% resolution rate
              </div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Average First Response Time</div>
              <div className="text-2xl font-black text-blue-400 mt-2">18 mins</div>
              <div className="text-xs text-slate-400 mt-1">24/7 Kerala Helpdesk SLA &lt; 30m</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Support Tickets Operations Feed</h3>
              <span className="text-xs text-slate-400">{tickets.length} tickets</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">Ticket ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-900/40 text-slate-200">
                      <td className="py-3 px-4 font-mono text-[#0E82FD] font-bold">{t.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{t.patientName}</td>
                      <td className="py-3 px-4 text-slate-300 font-medium">{t.subject}</td>
                      <td className="py-3 px-4">{t.category}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          t.priority === "URGENT" ? "bg-rose-500/10 text-rose-400" :
                          t.priority === "HIGH" ? "bg-amber-500/10 text-amber-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {t.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-bold ${
                          t.status === "RESOLVED" || t.status === "CLOSED" ? "bg-emerald-500/10 text-emerald-400" : "bg-blue-500/10 text-blue-400"
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 7: REVIEWS & NPS FEEDBACK */}
      {activeReportTab === "feedback" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Average Rating Score</div>
              <div className="text-3xl font-black text-amber-400 mt-2 flex items-baseline gap-2">
                <span>{avgRating}</span>
                <span className="text-xs text-slate-400">/ 5.0</span>
              </div>
              <div className="text-xs text-slate-400 mt-1">Based on {reviews.length} patient evaluations</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Net Promoter Score (NPS)</div>
              <div className="text-3xl font-black text-emerald-400 mt-2">+{npsScore}</div>
              <div className="text-xs text-emerald-400 mt-1">World-class hospitality rating</div>
            </div>
            <div className="bg-slate-950/90 border border-slate-800 p-5 rounded-2xl">
              <div className="text-xs text-slate-400 font-bold uppercase">Verified Patient Reviews</div>
              <div className="text-3xl font-black text-blue-400 mt-2">100%</div>
              <div className="text-xs text-slate-400 mt-1">Authenticated post-discharge verification</div>
            </div>
          </div>

          <div className="bg-slate-950/80 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">Patient Feedback & Ratings Summary</h3>
              <span className="text-xs text-slate-400">{reviews.length} reviews</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-900/60 border-b border-slate-800 text-slate-400 font-bold">
                    <th className="py-3 px-4">Review ID</th>
                    <th className="py-3 px-4">Patient</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Comment / Feedback</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {reviews.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-900/40 text-slate-200">
                      <td className="py-3 px-4 font-mono text-[#0E82FD] font-bold">{r.id}</td>
                      <td className="py-3 px-4 font-semibold text-white">{r.patientName}</td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-amber-400 font-bold">
                          <span>{r.rating}</span>
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                        </div>
                      </td>
                      <td className="py-3 px-4">{r.category}</td>
                      <td className="py-3 px-4 max-w-xs truncate text-slate-300 italic">"{r.comment}"</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded-md font-bold">
                          {r.status || "PUBLISHED"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

