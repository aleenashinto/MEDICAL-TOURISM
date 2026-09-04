"use client";

import React from "react";
import Link from "next/link";
import {
  Users,
  Inbox,
  HeartPulse,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building2,
  FileCheck2
} from "lucide-react";

export default function AdminDashboardPage() {
  const kpis = [
    {
      title: "Total Active Patients",
      value: "142",
      change: "+12% this month",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "New International Enquiries",
      value: "28",
      change: "4 pending clinical triage",
      trend: "up",
      icon: Inbox,
      color: "emerald",
    },
    {
      title: "Active Medical Cases",
      value: "64",
      change: "18 in Kerala, 12 in flight",
      trend: "neutral",
      icon: HeartPulse,
      color: "purple",
    },
    {
      title: "Platform Gross Volume",
      value: "$482,500",
      change: "+18.4% vs last quarter",
      trend: "up",
      icon: DollarSign,
      color: "amber",
    },
  ];

  const recentEnquiries = [
    {
      id: "ENQ-2026-004",
      patient: "Sarah Jenkins",
      country: "United Kingdom",
      treatment: "Minimally Invasive Knee Replacement",
      hospital: "Aster Medcity, Kochi",
      priority: "HIGH",
      status: "CLINICAL_TRIAGE",
      time: "10 mins ago",
    },
    {
      id: "ENQ-2026-003",
      patient: "Mohammed Al-Maktoum",
      country: "United Arab Emirates",
      treatment: "Robotic Cardiac Valve Repair",
      hospital: "Amrita Institute, Kochi",
      priority: "CRITICAL",
      status: "QUOTATION_SENT",
      time: "2 hours ago",
    },
    {
      id: "ENQ-2026-002",
      patient: "Elena Rostova",
      country: "Germany",
      treatment: "Ayurvedic Rejuvenation & Panchakarma",
      hospital: "Somatheeram Ayurvedic Village",
      priority: "MEDIUM",
      status: "VISA_PROCESSING",
      time: "5 hours ago",
    },
    {
      id: "ENQ-2026-001",
      patient: "Kwame Mensah",
      country: "Ghana",
      treatment: "Advanced Proton Beam Oncology",
      hospital: "VPS Lakeshore Hospital",
      priority: "HIGH",
      status: "TREATMENT_IN_PROGRESS",
      time: "1 day ago",
    },
  ];

  const activeArrivals = [
    {
      patient: "David Miller",
      flight: "EK 530 (DXB -> COK)",
      arrival: "Today, 18:45 IST",
      hotel: "Kochi Marriott Hotel",
      hospital: "Aster Medcity",
      liaison: "Rahul Nair (+91 98470 11223)",
      status: "Transfer Scheduled",
    },
    {
      patient: "Fatima Al-Zahra",
      flight: "QR 514 (DOH -> COK)",
      arrival: "Tomorrow, 08:30 IST",
      hotel: "Grand Hyatt Kochi Bolgatty",
      hospital: "Amrita Institute",
      liaison: "Anjali Menon (+91 98470 44556)",
      status: "Driver Assigned",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-2xl">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Platform Command Center
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            2-Role Central Administrator Portal • Overseeing 14 partner hospitals & 60+ accredited specialists across Kerala.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/enquiries"
            className="px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
          >
            Review Enquiries (3)
          </Link>
          <Link
            href="/admin/cases"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            Case Pipeline
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div
              key={kpi.title}
              className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{kpi.title}</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-[#0E82FD]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl font-bold text-white mt-3">{kpi.value}</div>
              <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2 font-medium">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{kpi.change}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Pipeline + Arrivals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Enquiries Pipeline Table */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Live Patient Enquiries Triage</h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time incoming treatment requests</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs text-[#0E82FD] hover:text-blue-400 font-semibold flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Patient</th>
                  <th className="pb-3">Treatment & Destination</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-200">{enq.patient}</div>
                      <div className="text-[11px] text-slate-500">{enq.country}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="text-slate-300">{enq.treatment}</div>
                      <div className="text-[11px] text-blue-400">{enq.hospital}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {enq.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 text-[11px]">{enq.time}</td>
                    <td className="py-3.5 text-right">
                      <Link
                        href={`/admin/cases`}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#0E82FD] text-slate-200 hover:text-white font-medium text-[11px] transition-all"
                      >
                        Triage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Airport & Transfer Logistics */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white">Upcoming Arrivals (Cochin COK)</h2>
              <p className="text-xs text-slate-400 mt-0.5">Ground transfers & medical liaisons</p>
            </div>
            <Link
              href="/admin/travel"
              className="text-xs text-[#0E82FD] hover:text-blue-400 font-semibold"
            >
              Logistics
            </Link>
          </div>

          <div className="space-y-4">
            {activeArrivals.map((arrival, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 space-y-2.5"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200">
                    {arrival.patient}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
                    {arrival.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400">
                  <div className="flex items-center gap-1 text-blue-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{arrival.arrival}</span> • {arrival.flight}
                  </div>
                  <div className="mt-1 text-slate-300">
                    Destination: {arrival.hospital}
                  </div>
                  <div className="mt-0.5 text-slate-400 text-[11px]">
                    Hotel: {arrival.hotel}
                  </div>
                  <div className="mt-2 text-[11px] text-slate-400 pt-2 border-t border-slate-800 flex items-center justify-between">
                    <span>Liaison: {arrival.liaison}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
