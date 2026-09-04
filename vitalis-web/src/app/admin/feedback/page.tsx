"use client";

import React, { useState } from "react";
import { 
  Star, 
  Search, 
  CheckCircle2, 
  Eye, 
  Building2, 
  Stethoscope, 
  ThumbsUp,
  ThumbsDown,
  ShieldCheck
} from "lucide-react";

export default function FeedbackAdminPage() {
  const reviews = [
    {
      id: "REV-101",
      patient: "Sarah Jenkins",
      country: "United Kingdom",
      hospital: "Aster Medcity, Kochi",
      doctor: "Dr. Vijay Anand",
      treatment: "Total Knee Replacement",
      rating: 10,
      comment: "Outstanding surgical care and compassionate nursing. The airport pickup and Kochi Marriott stay made recovery effortless. Truly world-class healthcare!",
      isApproved: true,
      date: "2026-09-03",
    },
    {
      id: "REV-100",
      patient: "Elena Rostova",
      country: "Germany",
      hospital: "Somatheeram Ayurvedic Village",
      doctor: "Dr. Arya Varma",
      treatment: "Panchakarma Detox 14-Day",
      rating: 9,
      comment: "Authentic Ayurvedic healing by the Arabian sea. The diet and personalized therapies completely cured my chronic stress and fatigue.",
      isApproved: true,
      date: "2026-08-28",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">
            Patient Feedback & NPS Testimonial Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review and approve international patient feedback and Net Promoter Scores before displaying on the public website.
          </p>
        </div>
      </div>

      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="divide-y divide-slate-800/60">
          {reviews.map((rev) => (
            <div key={rev.id} className="p-5 hover:bg-slate-900/30 transition-colors space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600/20 text-blue-400 font-bold flex items-center justify-center text-xs">
                    {rev.patient.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="font-semibold text-xs text-slate-200">
                      {rev.patient} <span className="text-slate-500">({rev.country})</span>
                    </div>
                    <div className="text-[11px] text-blue-400">
                      {rev.hospital} • {rev.treatment}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-lg text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{rev.rating} / 10 NPS</span>
                  </div>
                  <span className="px-2 py-1 rounded-lg text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    APPROVED PUBLIC
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed italic bg-slate-900/60 p-3 rounded-xl border border-slate-800/60">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
