"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  DollarSign, 
  Plus, 
  Download, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Building2, 
  ArrowUpRight,
  TrendingUp,
  Percent
} from "lucide-react";

export default function InvoicesAndPaymentsPage() {
  const [filter, setFilter] = useState("ALL");

  const invoices = [
    {
      invoiceNo: "INV-2026-042",
      caseId: "CAS-2026-089",
      patient: "Sarah Jenkins",
      amountUSD: "$6,200",
      amountINR: "₹5,14,600",
      hospital: "Aster Medcity, Kochi",
      treatment: "Total Knee Replacement Package",
      status: "PAID_ESCROW",
      issuedAt: "2026-09-01",
      paymentMethod: "International Wire Transfer",
    },
    {
      invoiceNo: "INV-2026-041",
      caseId: "CAS-2026-088",
      patient: "Mohammed Al-Maktoum",
      amountUSD: "$11,500",
      amountINR: "₹9,54,500",
      hospital: "Amrita Institute",
      treatment: "Robotic Mitral Valve Surgery",
      status: "DEPOSIT_PENDING",
      issuedAt: "2026-09-03",
      paymentMethod: "Direct Card Payment (Stripe Forex)",
    },
    {
      invoiceNo: "INV-2026-040",
      caseId: "CAS-2026-085",
      patient: "Elena Rostova",
      amountUSD: "$4,200",
      amountINR: "₹3,48,600",
      hospital: "Somatheeram Ayurvedic Village",
      treatment: "Ayurvedic Rejuvenation 14-Day",
      status: "DISBURSED_HOSPITAL",
      issuedAt: "2026-08-18",
      paymentMethod: "Multi-Currency Checkout",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Multi-Currency Billing, Invoices & Forex
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time multi-currency conversions (USD / EUR / GBP / AED $\to$ INR), escrow protection, and hospital disbursements.
          </p>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-sm transition-all">
          <Plus className="w-3.5 h-3.5" />
          Create Medical Invoice
        </button>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 font-semibold">Total Escrow Funds Held</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">$78,400</div>
          <div className="text-[11px] text-slate-500 mt-1">Safe deposit until patient admission</div>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 font-semibold">Disbursed to Kerala Hospitals</div>
          <div className="text-2xl font-bold text-white mt-2">$394,200</div>
          <div className="text-[11px] text-emerald-400 mt-1">Settled within 24h of discharge</div>
        </div>
        <div className="bg-slate-950 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs text-slate-400 font-semibold">Platform Fee Revenue (3%)</div>
          <div className="text-2xl font-bold text-blue-400 mt-2">$14,175</div>
          <div className="text-[11px] text-slate-400 mt-1">Includes 0% forex markup guarantee</div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Invoice # & Date</th>
                <th className="py-3 px-4">Patient & Case</th>
                <th className="py-3 px-4">Package & Hospital</th>
                <th className="py-3 px-4">USD / INR Equivalent</th>
                <th className="py-3 px-4">Escrow Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {invoices.map((inv) => (
                <tr key={inv.invoiceNo} className="hover:bg-slate-900/40 transition-colors">
                  <td className="py-3.5 px-4">
                    <div className="font-mono font-bold text-blue-400">{inv.invoiceNo}</div>
                    <div className="text-[11px] text-slate-500">{inv.issuedAt}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-slate-200">{inv.patient}</div>
                    <div className="text-[11px] text-slate-500 font-mono">{inv.caseId}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="text-slate-300 font-medium">{inv.treatment}</div>
                    <div className="text-[11px] text-blue-400">{inv.hospital}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-emerald-400">{inv.amountUSD}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{inv.amountINR}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        inv.status.includes("PAID") || inv.status.includes("DISBURSED")
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                      }`}
                    >
                      {inv.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-[#0E82FD] text-slate-200 hover:text-white text-[11px] font-medium transition-all">
                      <Download className="w-3 h-3" />
                      PDF
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
