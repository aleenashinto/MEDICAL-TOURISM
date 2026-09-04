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
  FileSpreadsheet
} from "lucide-react";

export default function EnquiriesPage() {
  const [filter, setFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");

  const enquiries = [
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
    },
  ];

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
          <button className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all">
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
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                filter === st
                  ? "bg-[#0E82FD] text-white"
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
                        title="View details"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        title="Convert to Case"
                        className="px-2.5 py-1 rounded-lg bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
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
    </div>
  );
}
