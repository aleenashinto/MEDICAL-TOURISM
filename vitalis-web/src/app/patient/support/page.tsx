"use client";

import React, { useState } from "react";
import { 
  LifeBuoy, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle 
} from "lucide-react";

export default function PatientSupportPage() {
  const [showModal, setShowModal] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("TRAVEL_COORDINATION");
  const [description, setDescription] = useState("");

  const tickets = [
    {
      id: "TCK-801",
      category: "Travel & Airport Liaison",
      subject: "Requesting wheelchair accessible vehicle for COK airport pickup",
      status: "IN_PROGRESS",
      date: "Sep 04, 2026",
      response: "Coordinator assigned: Suresh Babu (+91 94470 12345) with AC Medical Escort.",
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Support Desk & Concierge Assistance
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit inquiries regarding flight changes, hotel extensions, or medical record assistance.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Support Ticket
        </button>
      </div>

      <div className="space-y-4">
        {tickets.map((t) => (
          <div
            key={t.id}
            className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs font-bold text-blue-600">{t.id}</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                {t.status}
              </span>
            </div>
            <h2 className="text-sm font-bold text-slate-900">{t.subject}</h2>
            <div className="text-xs text-slate-500">{t.category} • Submitted on {t.date}</div>
            {t.response && (
              <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100 text-xs text-blue-900">
                <strong>Admin Update:</strong> {t.response}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
