"use client";

import React, { useState } from "react";
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  MessageSquare,
  ArrowRight
} from "lucide-react";

export default function SupportAdminPage() {
  const [filter, setFilter] = useState("ALL");

  const tickets = [
    {
      id: "TCK-801",
      patient: "Sarah Jenkins",
      category: "TRAVEL_COORDINATION",
      subject: "Requesting wheelchair accessible airport vehicle",
      priority: "HIGH",
      status: "IN_PROGRESS",
      createdAt: "2026-09-04 08:30",
    },
    {
      id: "TCK-800",
      patient: "Mohammed Al-Maktoum",
      category: "BILLING_INVOICE",
      subject: "Tax residency certificate clarification for forex wire",
      priority: "MEDIUM",
      status: "OPEN",
      createdAt: "2026-09-03 15:45",
    },
    {
      id: "TCK-799",
      patient: "David Miller",
      category: "CLINICAL_OPINION",
      subject: "Uploaded additional MRI report for review",
      priority: "HIGH",
      status: "RESOLVED",
      createdAt: "2026-09-01 10:20",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Patient Support Tickets & Concierge Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Resolve patient logistics inquiries, medical record requests, and billing support questions.
          </p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Ticket ID & Date</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Category & Subject</th>
                <th className="py-3 px-4">Priority</th>
                <th className="py-3 px-4">Ticket Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {tickets.map((t) => (
                <tr key={t.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-400">{t.id}</div>
                    <div className="text-[11px] text-slate-500">{t.createdAt}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{t.patient}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-200">{t.subject}</div>
                    <div className="text-[11px] text-slate-400">{t.category.replace(/_/g, " ")}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.priority === "HIGH"
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}
                    >
                      {t.priority}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === "RESOLVED"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {t.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="px-2.5 py-1 rounded-lg bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold text-[11px] transition-colors">
                      Respond
                    </button>
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
