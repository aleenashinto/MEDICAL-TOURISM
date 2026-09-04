"use client";

import React from "react";
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Inbox, 
  HeartPulse, 
  Building2, 
  Calendar, 
  Download,
  Filter
} from "lucide-react";

export default function ReportsPage() {
  const metrics = [
    { title: "Enquiry-to-Case Conversion Rate", value: "32.4%", change: "+4.1% vs last quarter", icon: TrendingUp },
    { title: "Average Revenue Per Case", value: "$7,540", change: "+8.2% vs last quarter", icon: DollarSign },
    { title: "Top Origin Country", value: "United Kingdom (38%)", change: "Followed by UAE & Germany", icon: Users },
    { title: "Top Specialty By Volume", value: "Orthopedics & Joint Care", change: "42% of total cases", icon: HeartPulse },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Executive Analytics & Operational Reports
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Data insights on patient acquisition, hospital performance, treatment profitability, and country breakdown.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Download className="w-3.5 h-3.5" />
          Export Complete Report (PDF/CSV)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400">{m.title}</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-[#0E82FD]">
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl font-bold text-white mt-3">{m.value}</div>
              <div className="text-[11px] text-slate-400 mt-1">{m.change}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
