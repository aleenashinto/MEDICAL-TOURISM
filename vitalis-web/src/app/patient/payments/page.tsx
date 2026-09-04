"use client";

import React, { useState } from "react";
import { 
  CreditCard, 
  DollarSign, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  Lock, 
  AlertCircle,
  Building2,
  Receipt
} from "lucide-react";

export default function PatientPaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState("CARD");

  const invoice = {
    invoiceNo: "INV-2026-042",
    treatment: "Total Knee Replacement All-Inclusive Package",
    hospital: "Aster Medcity, Kochi",
    breakdown: [
      { item: "Surgical Procedure & Surgeon Fee (Dr. Vijay Anand)", amount: "$3,400" },
      { item: "US FDA Approved Titanium Knee Implant (Stryker / Zimmer)", amount: "$1,200" },
      { item: "5 Days Private Deluxe Room Hospital Stay & Nursing", amount: "$800" },
      { item: "Post-Op Physiotherapy, Medicines & Airport Transfers", amount: "$500" },
      { item: "Vitalis Platform Escrow & Coordination Fee (Included)", amount: "$300" },
    ],
    totalUSD: "$6,200",
    totalINR: "₹5,14,600",
    status: "ESCROW_PAID",
    depositRequired: "$1,500 (Paid Aug 28)",
    balanceDue: "$4,700 (Due upon Hospital Admission)",
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Billing, Invoices & Escrow Checkout
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Zero-hidden-fee pricing with secure escrow protection. Your funds are only released to the hospital upon your admission.
        </p>
      </div>

      {/* Escrow Guarantee Banner */}
      <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
        <div className="text-xs text-emerald-800">
          <strong>100% Escrow Protection:</strong> Your initial deposit is securely held in an accredited escrow account until you land in Kerala and verify your hospital admission.
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Itemized Breakdown */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <div className="font-mono text-xs text-blue-600 font-bold">{invoice.invoiceNo}</div>
              <h2 className="text-sm font-bold text-slate-900">{invoice.treatment}</h2>
            </div>
            <button className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold">
              <Download className="w-3.5 h-3.5" />
              PDF Invoice
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {invoice.breakdown.map((b, idx) => (
              <div key={idx} className="py-2.5 flex items-center justify-between">
                <span className="text-slate-600">{b.item}</span>
                <span className="font-semibold text-slate-800">{b.amount}</span>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t-2 border-slate-100 flex items-center justify-between text-sm">
            <span className="font-bold text-slate-900">Total Package Cost (USD)</span>
            <div className="text-right">
              <div className="font-bold text-lg text-slate-900">{invoice.totalUSD}</div>
              <div className="text-[11px] text-slate-400 font-mono">Approx. {invoice.totalINR}</div>
            </div>
          </div>
        </div>

        {/* Payment Status / Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Payment Status</h3>
            <div className="mt-4 p-4 rounded-xl bg-blue-50 border border-blue-100 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Deposit Paid:</span>
                <span className="font-bold text-emerald-600">$1,500</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Remaining Balance:</span>
                <span className="font-bold text-slate-800">$4,700</span>
              </div>
            </div>
          </div>

          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pay Balance via Card / Wire
          </button>
        </div>
      </div>
    </div>
  );
}
