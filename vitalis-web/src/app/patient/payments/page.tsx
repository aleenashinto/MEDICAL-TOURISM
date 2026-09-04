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
  Receipt,
  Check,
  X
} from "lucide-react";

export default function PatientPaymentsPage() {
  const [selectedMethod, setSelectedMethod] = useState("CARD");
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  const [invoice, setInvoice] = useState({
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
    status: "DEPOSIT_PAID",
    depositPaid: "$1,500",
    balanceDue: "$4,700",
  });

  const handleDownloadInvoice = () => {
    const content = `MAIDES KERALA MEDICAL TOURISM - OFFICIAL INVOICE
Invoice No: ${invoice.invoiceNo}
Treatment: ${invoice.treatment}
Hospital: ${invoice.hospital}

Itemized Breakdown:
- Surgical Procedure & Surgeon Fee: $3,400
- FDA Approved Titanium Knee Implant: $1,200
- 5 Days Private Room Hospital Stay: $800
- Post-Op Physiotherapy & Airport Transfers: $500
- Platform Escrow Guarantee Fee: $300

Total Package Cost: $6,200 (Approx ₹5,14,600)
Escrow Status: Secure Deposit Paid ($1,500). Remaining ($4,700).`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MAIDES-Invoice-${invoice.invoiceNo}.txt`;
    a.click();
  };

  const handlePayBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);
      setInvoice(prev => ({
        ...prev,
        status: "FULLY_PAID_ESCROW",
        depositPaid: "$6,200",
        balanceDue: "$0.00",
      }));
      setTimeout(() => setShowCheckoutModal(false), 1500);
    }, 1200);
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
            <button 
              onClick={handleDownloadInvoice}
              className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              Download PDF Invoice
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
                <span className="font-bold text-emerald-600">{invoice.depositPaid}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Remaining Balance:</span>
                <span className="font-bold text-slate-800">{invoice.balanceDue}</span>
              </div>
            </div>
          </div>

          {invoice.balanceDue !== "$0.00" ? (
            <button 
              onClick={() => setShowCheckoutModal(true)}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <CreditCard className="w-4 h-4" />
              Pay Balance via Card / Wire
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl text-xs font-bold text-center flex items-center justify-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              Package Fully Paid in Escrow
            </div>
          )}
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Escrow Checkout • $4,700</h3>
              <button 
                onClick={() => setShowCheckoutModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isPaid ? (
              <div className="py-6 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-900">Payment Successful!</h4>
                <p className="text-xs text-slate-500">Your escrow receipt has been generated.</p>
              </div>
            ) : (
              <form onSubmit={handlePayBalance} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 mb-1">Cardholder Name</label>
                  <input required defaultValue="Sarah Jenkins" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800" />
                </div>
                <div>
                  <label className="block text-slate-600 mb-1">Card Number</label>
                  <input required defaultValue="4242 •••• •••• 4242" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 mb-1">Expiry Date</label>
                    <input required defaultValue="12/28" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono" />
                  </div>
                  <div>
                    <label className="block text-slate-600 mb-1">CVC / CVV</label>
                    <input required defaultValue="888" className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 font-mono" />
                  </div>
                </div>

                <div className="pt-2">
                  <button 
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isProcessing ? "Authorizing Escrow..." : "Pay $4,700 into Escrow"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
