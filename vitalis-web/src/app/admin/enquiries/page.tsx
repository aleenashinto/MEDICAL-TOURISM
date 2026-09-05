"use client";

import React, { useState } from "react";
import { 
  Inbox, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  ArrowRight, 
  Eye, 
  Send,
  AlertCircle,
  FileSpreadsheet,
  X,
  Building2,
  Stethoscope,
  DollarSign
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EnquiriesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEnquiry, setSelectedEnquiry] = useState<any | null>(null);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const [enquiries, setEnquiries] = useState([
    {
      id: "ENQ-2026-004",
      name: "Sarah Jenkins",
      email: "sarah.jenkins@example.com",
      phone: "+44 7911 123456",
      country: "United Kingdom",
      treatment: "Minimally Invasive Knee Replacement",
      budget: "$6,500",
      urgency: "HIGH",
      submittedAt: "2026-09-04 09:30",
      status: "NEW",
      assignedHospital: "Aster Medcity, Kochi",
      notes: "Patient has knee cartilage wear and prefers Dr. Vijay Anand.",
    },
    {
      id: "ENQ-2026-003",
      name: "Mohammed Al-Maktoum",
      email: "m.maktoum@example.ae",
      phone: "+971 50 987 6543",
      country: "United Arab Emirates",
      treatment: "Robotic Cardiac Valve Repair",
      budget: "$12,000",
      urgency: "CRITICAL",
      submittedAt: "2026-09-04 07:15",
      status: "TRIAGED",
      assignedHospital: "Amrita Institute of Medical Sciences",
      notes: "Echo scans received, cardiology board review requested.",
    },
    {
      id: "ENQ-2026-002",
      name: "Elena Rostova",
      email: "elena.rostova@example.de",
      phone: "+49 170 555 1234",
      country: "Germany",
      treatment: "Ayurvedic Panchakarma & Stress Detox",
      budget: "$4,200",
      urgency: "MEDIUM",
      submittedAt: "2026-09-03 16:45",
      status: "QUOTED",
      assignedHospital: "Somatheeram Ayurvedic Village",
      notes: "14-day rejuvenation package selected.",
    },
    {
      id: "ENQ-2026-001",
      name: "Kwame Mensah",
      email: "kwame.mensah@example.gh",
      phone: "+233 24 123 4567",
      country: "Ghana",
      treatment: "Oncology Second Opinion & PET-CT",
      budget: "$9,500",
      urgency: "HIGH",
      submittedAt: "2026-09-03 11:20",
      status: "CONVERTED",
      assignedHospital: "VPS Lakeshore Hospital",
      notes: "Converted to Case CAS-2026-085.",
    },
  ]);

  React.useEffect(() => {
    const fetchEnquiries = async () => {
      // 1. Try fetching from server API
      try {
        const res = await fetch("/api/enquiries");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.enquiries) && data.enquiries.length > 0) {
            setEnquiries(data.enquiries);
            if (typeof window !== "undefined") {
              localStorage.setItem("maides_admin_enquiries", JSON.stringify(data.enquiries));
            }
            return;
          }
        }
      } catch (e) {
        console.warn("Could not fetch enquiries from server API, falling back to local cache", e);
      }

      // 2. Fallback to localStorage
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("maides_admin_enquiries");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setEnquiries(parsed);
              return;
            }
          } catch(e) {}
        }
      }
    };

    fetchEnquiries();

    const handleStorageUpdate = () => {
      if (typeof window !== "undefined") {
        const stored = localStorage.getItem("maides_admin_enquiries");
        if (stored) {
          try {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setEnquiries(parsed);
            }
          } catch (e) {}
        }
      }
    };

    window.addEventListener("storage", handleStorageUpdate);
    window.addEventListener("maides_enquiries_updated", handleStorageUpdate);
    return () => {
      window.removeEventListener("storage", handleStorageUpdate);
      window.removeEventListener("maides_enquiries_updated", handleStorageUpdate);
    };
  }, []);

  const handleConvertCase = async (enq: any) => {
    const updated = enquiries.map(item => item.id === enq.id ? { ...item, status: "CONVERTED" } : item);
    setEnquiries(updated);

    if (typeof window !== "undefined") {
      localStorage.setItem("maides_admin_enquiries", JSON.stringify(updated));

      // Also create an active case in maides_admin_cases
      try {
        const storedCases = localStorage.getItem("maides_admin_cases");
        const existingCases = storedCases ? JSON.parse(storedCases) : [];
        const newCaseId = `CAS-2026-${Math.floor(100 + Math.random() * 900)}`;
        const newCase = {
          id: newCaseId,
          patientId: `PAT-${Math.floor(100 + Math.random() * 900)}`,
          patientName: enq.name,
          country: enq.country,
          condition: enq.summary || enq.notes || enq.treatment,
          specialty: enq.specialty || enq.treatment,
          treatment: enq.treatment,
          hospital: enq.assignedHospital || "Aster Medcity, Kochi",
          doctor: "Senior Specialist Consultant",
          status: "Under Review",
          estimatedCost: enq.budget || "$6,500",
          expectedTreatmentDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
          coordinator: "Admin Primary",
          priority: enq.urgency === "CRITICAL" ? "High" : enq.urgency === "HIGH" ? "High" : "Medium",
          notes: [
            {
              id: "NOTE-1",
              author: "System Intake Coordinator",
              date: new Date().toISOString().replace("T", " ").substring(0, 16),
              text: `Enquiry ${enq.id} converted into active medical case. Clinical summary: ${enq.summary || enq.notes}`
            }
          ],
          timeline: [
            {
              id: "TL-1",
              title: "Case Created from Enquiry",
              date: new Date().toISOString().split("T")[0],
              description: `Converted from international lead ${enq.id} (${enq.name}).`,
              author: "Admin Desk"
            }
          ]
        };

        const updatedCases = [newCase, ...existingCases.filter((c: any) => c.id !== newCase.id)];
        localStorage.setItem("maides_admin_cases", JSON.stringify(updatedCases));
      } catch (e) {
        console.error("Error creating case", e);
      }
    }

    // Sync to API
    try {
      await fetch("/api/enquiries", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...enq, status: "CONVERTED" })
      });
    } catch (e) {}

    setSuccessToast(`Enquiry ${enq.id} for ${enq.name} successfully converted to an Active Medical Case!`);
    setTimeout(() => {
      setSuccessToast(null);
      router.push("/admin/cases");
    }, 1200);
  };

  const handleExportCSV = () => {
    const headers = "ID,Name,Email,Phone,Country,Treatment,Budget,Urgency,Status,Hospital\n";
    const rows = enquiries.map(e => `"${e.id}","${e.name}","${e.email}","${e.phone}","${e.country}","${e.treatment}","${e.budget}","${e.urgency}","${e.status}","${e.assignedHospital}"`).join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAIDES-Enquiries-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  const filteredEnquiries = enquiries.filter((item) => {
    if (filter !== "ALL" && item.status !== filter) return false;
    if (
      searchTerm &&
      !item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.treatment.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !item.country.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-4">
          <CheckCircle className="w-5 h-5" />
          <span className="text-xs font-bold">{successToast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            International Enquiries & Lead Triage
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review incoming medical inquiries, assess clinical urgency, and match patients with partner hospitals.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={async () => {
              try {
                const res = await fetch("/api/enquiries");
                if (res.ok) {
                  const data = await res.json();
                  if (data.success && Array.isArray(data.enquiries)) {
                    setEnquiries(data.enquiries);
                    if (typeof window !== "undefined") {
                      localStorage.setItem("maides_admin_enquiries", JSON.stringify(data.enquiries));
                    }
                    setSuccessToast("Enquiries updated with live submissions.");
                    setTimeout(() => setSuccessToast(null), 3000);
                  }
                }
              } catch (e) {}
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <Clock className="w-3.5 h-3.5 text-[#0E82FD]" />
            Refresh Leads
          </button>
          <button 
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-slate-950 border border-slate-800/80 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search patient, country, or procedure..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "NEW", "TRIAGED", "QUOTED", "CONVERTED"].map((st) => (
            <button
              key={st}
              onClick={() => setFilter(st)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                filter === st
                  ? "bg-[#0E82FD] text-white shadow-sm"
                  : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Triage Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Lead ID & Date</th>
                <th className="py-3 px-4">Patient Demographics</th>
                <th className="py-3 px-4">Requested Treatment</th>
                <th className="py-3 px-4">Assigned Hospital</th>
                <th className="py-3 px-4">Urgency</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEnquiries.map((enq) => (
                <tr key={enq.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="font-mono font-bold text-blue-400">{enq.id}</div>
                    <div className="text-[11px] text-slate-500">{enq.submittedAt}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="font-semibold text-slate-200">{enq.name}</div>
                    <div className="text-[11px] text-slate-400">{enq.country} • {enq.phone}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300 font-medium">{enq.treatment}</div>
                    <div className="text-[11px] text-emerald-400 font-semibold">Budget: {enq.budget}</div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-slate-300">{enq.assignedHospital}</div>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        enq.urgency === "CRITICAL"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : enq.urgency === "HIGH"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {enq.urgency}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                      {enq.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setSelectedEnquiry(enq)}
                        title="View details"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleConvertCase(enq)}
                        title="Convert to Case"
                        className="px-2.5 py-1 rounded-lg bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Convert Case
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-xs text-blue-400 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                  {selectedEnquiry.id}
                </span>
                <h3 className="font-bold text-sm text-white">{selectedEnquiry.name}</h3>
              </div>
              <button 
                onClick={() => setSelectedEnquiry(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-300">
              <div><strong>Country & Contact:</strong> {selectedEnquiry.country} • {selectedEnquiry.email} • {selectedEnquiry.phone}</div>
              <div><strong>Requested Treatment:</strong> {selectedEnquiry.treatment}</div>
              <div><strong>Matched Hospital:</strong> {selectedEnquiry.assignedHospital}</div>
              <div><strong>Urgency:</strong> <span className="text-amber-400 font-bold">{selectedEnquiry.urgency}</span> • <strong>Budget:</strong> {selectedEnquiry.budget}</div>
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800">
                <strong className="text-slate-400 block mb-1">Clinical Triage Notes:</strong>
                {selectedEnquiry.notes}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const enq = selectedEnquiry;
                  setSelectedEnquiry(null);
                  handleConvertCase(enq);
                }}
                className="px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow"
              >
                Convert to Medical Case
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
