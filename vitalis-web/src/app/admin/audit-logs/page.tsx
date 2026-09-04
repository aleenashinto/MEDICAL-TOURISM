"use client";

import React, { useState } from "react";
import { 
  ShieldAlert, 
  Search, 
  Filter, 
  CheckCircle, 
  AlertTriangle, 
  Lock, 
  Eye, 
  KeyRound,
  FileCheck
} from "lucide-react";

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const logs = [
    {
      id: "AUD-9982",
      event: "ROLE_BASED_ACCESS_EVALUATED",
      role: "ADMIN",
      actor: "admin@vitalis.health",
      target: "/api/v1/cases/CAS-2026-089",
      ipAddress: "192.168.1.100",
      status: "200_OK",
      timestamp: "2026-09-04 10:45:12 UTC",
    },
    {
      id: "AUD-9981",
      event: "CROSS_PATIENT_ACCESS_BLOCKED",
      role: "PATIENT",
      actor: "patient-112@example.com",
      target: "/api/v1/cases/CAS-2026-088 (Owner: patient-111)",
      ipAddress: "86.134.20.11",
      status: "403_FORBIDDEN_OWNERSHIP_GUARD",
      timestamp: "2026-09-04 09:22:04 UTC",
    },
    {
      id: "AUD-9980",
      event: "MEDICAL_VISA_LETTER_GENERATED",
      role: "ADMIN",
      actor: "admin@vitalis.health",
      target: "Visa Invitation Ref: MED-VISA-8821",
      ipAddress: "192.168.1.100",
      status: "SUCCESS",
      timestamp: "2026-09-04 08:15:30 UTC",
    },
    {
      id: "AUD-9979",
      event: "ESCROW_PAYMENT_CONFIRMED",
      role: "SYSTEM_WEBHOOK",
      actor: "Stripe_Forex_Webhook",
      target: "Invoice: INV-2026-042 ($6,200)",
      ipAddress: "54.187.205.23",
      status: "ESCROW_LOCKED",
      timestamp: "2026-09-03 22:11:45 UTC",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Security & Ownership Audit Trail
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            HIPAA-compliant immutable logs verifying 2-Role boundary enforcement and cross-tenant data isolation.
          </p>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Event ID & Time</th>
                <th className="py-3 px-4">Security Action</th>
                <th className="py-3 px-4">Role & User Principal</th>
                <th className="py-3 px-4">Resource Target</th>
                <th className="py-3 px-4">Enforcement Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-400">{log.id}</div>
                    <div className="text-[11px] text-slate-500">{log.timestamp}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{log.event}</div>
                    <div className="text-[11px] text-slate-500 font-mono">IP: {log.ipAddress}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-mono text-xs text-slate-300 font-semibold">{log.role}</span>
                    <div className="text-[11px] text-slate-400">{log.actor}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300 font-mono text-[11px]">{log.target}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        log.status.includes("403")
                          ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}
                    >
                      {log.status}
                    </span>
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
