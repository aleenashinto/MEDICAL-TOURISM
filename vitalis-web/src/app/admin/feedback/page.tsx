"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, 
  Search, 
  CheckCircle2, 
  Eye, 
  Building2, 
  Stethoscope, 
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Filter,
  Check,
  X,
  Send,
  MessageSquare,
  Archive,
  EyeOff,
  Globe2,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Calendar,
  User,
  Heart
} from "lucide-react";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "PUBLISHED" | "HIDDEN" | "ARCHIVED";

export interface PatientReview {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientCountry: string;
  category: "Hospital Care" | "Doctor / Surgeon" | "Appointment & Telehealth" | "MAIDES Concierge & Logistics" | "Ayurveda & Wellness";
  targetName: string; // Hospital / Doctor name
  treatment: string;
  rating: number; // 1 to 5 stars
  npsScore: number; // 0 to 10
  recommend: boolean;
  comment: string;
  status: ReviewStatus;
  isPublished: boolean;
  adminResponse?: string;
  adminResponseDate?: string;
  adminResponder?: string;
  submittedAt: string;
  updatedAt?: string;
}

export const DEFAULT_REVIEWS: PatientReview[] = [
  {
    id: "REV-101",
    patientId: "pat-101",
    patientName: "Sarah Jenkins",
    patientEmail: "sarah.jenkins@example.com",
    patientCountry: "United Kingdom",
    category: "Hospital Care",
    targetName: "Aster Medcity, Kochi",
    treatment: "Total Knee Replacement (Bilateral)",
    rating: 5,
    npsScore: 10,
    recommend: true,
    comment: "Outstanding surgical care and compassionate nursing. The airport pickup and Kochi Marriott stay made recovery effortless. Dr. Vijay Anand and the MAIDES team provided truly world-class healthcare!",
    status: "PUBLISHED",
    isPublished: true,
    adminResponse: "Thank you Sarah! We are thrilled to hear of your smooth recovery and mobility restoration. Safe travels back to London!",
    adminResponseDate: "2026-09-03 14:30",
    adminResponder: "MAIDES Patient Experience Desk",
    submittedAt: "2026-09-03 10:15"
  },
  {
    id: "REV-102",
    patientId: "pat-102",
    patientName: "Mohammed Al-Maktoum",
    patientEmail: "m.maktoum@example.ae",
    patientCountry: "United Arab Emirates",
    category: "Doctor / Surgeon",
    targetName: "Dr. Soman (Amrita Institute)",
    treatment: "Robotic Mitral Valve Surgery",
    rating: 5,
    npsScore: 10,
    recommend: true,
    comment: "The robotic cardiac team at Amrita Institute was exceptional. The Arabic translation desk and airport executive transfer made my family feel right at home.",
    status: "APPROVED",
    isPublished: true,
    adminResponse: "Shukran Mohammed! We are honored to have assisted you and your family.",
    adminResponseDate: "2026-09-02 16:00",
    adminResponder: "International Care Liaison",
    submittedAt: "2026-09-02 11:20"
  },
  {
    id: "REV-103",
    patientId: "pat-103",
    patientName: "Elena Rostova",
    patientEmail: "elena.rostova@example.de",
    patientCountry: "Germany",
    category: "Ayurveda & Wellness",
    targetName: "Somatheeram Ayurvedic Village, Kovalam",
    treatment: "Panchakarma Detox 14-Day",
    rating: 5,
    npsScore: 9,
    recommend: true,
    comment: "Authentic Ayurvedic healing by the Arabian sea. The organic vegetarian diet and personalized therapies completely relieved my chronic spine pain and fatigue.",
    status: "PUBLISHED",
    isPublished: true,
    submittedAt: "2026-08-28 09:40"
  },
  {
    id: "REV-104",
    patientId: "pat-104",
    patientName: "David Miller",
    patientEmail: "david.miller@austech.com.au",
    patientCountry: "Australia",
    category: "MAIDES Concierge & Logistics",
    targetName: "Rajagiri Hospital & Chauffeur Services",
    treatment: "Laser Spine Decompression",
    rating: 4,
    npsScore: 8,
    recommend: true,
    comment: "Very efficient surgery. Would recommend adding more English television channels in the executive private suite, but surgical results are top notch.",
    status: "PENDING",
    isPublished: false,
    submittedAt: "2026-09-04 07:30"
  }
];

export default function FeedbackAdminPage() {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [ratingFilter, setRatingFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Interaction State
  const [selectedReview, setSelectedReview] = useState<PatientReview | null>(null);
  const [responseText, setResponseText] = useState("");

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maides_patient_reviews_v3");
      if (saved) {
        setReviews(JSON.parse(saved));
      } else {
        setReviews(DEFAULT_REVIEWS);
        localStorage.setItem("maides_patient_reviews_v3", JSON.stringify(DEFAULT_REVIEWS));
      }
    } catch (e) {
      setReviews(DEFAULT_REVIEWS);
    }
  }, []);

  const saveReviews = (data: PatientReview[]) => {
    setReviews(data);
    localStorage.setItem("maides_patient_reviews_v3", JSON.stringify(data));
    if (selectedReview) {
      const updatedSel = data.find(r => r.id === selectedReview.id) || null;
      setSelectedReview(updatedSel);
    }
  };

  // Moderate Status
  const handleUpdateStatus = (id: string, newStatus: ReviewStatus, isPublished: boolean) => {
    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updated = reviews.map(r => r.id === id ? {
      ...r,
      status: newStatus,
      isPublished: isPublished,
      updatedAt: timeStr
    } : r);
    saveReviews(updated);
  };

  // Submit Official Admin Response
  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!responseText.trim() || !selectedReview) return;

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updated = reviews.map(r => r.id === selectedReview.id ? {
      ...r,
      adminResponse: responseText.trim(),
      adminResponseDate: timeStr,
      adminResponder: "MAIDES Executive Desk",
      updatedAt: timeStr
    } : r);

    saveReviews(updated);
    setResponseText("");
  };

  // Filter Reviews
  const filteredReviews = reviews.filter(r => {
    const matchSearch = 
      r.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.comment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.targetName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.treatment.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === "ALL" || r.status === statusFilter;
    const matchRating = ratingFilter === "ALL" || r.rating.toString() === ratingFilter;
    const matchCat = categoryFilter === "ALL" || r.category === categoryFilter;
    return matchSearch && matchStatus && matchRating && matchCat;
  });

  // Calculate Average Rating & NPS
  const totalReviews = reviews.length;
  const avgRating = totalReviews > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1) : "5.0";
  const promoters = reviews.filter(r => r.npsScore >= 9).length;
  const detractors = reviews.filter(r => r.npsScore <= 6).length;
  const npsScore = totalReviews > 0 ? Math.round(((promoters - detractors) / totalReviews) * 100) : 100;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <Star className="w-4 h-4 fill-blue-400 text-blue-400" />
            MAIDES Patient Experience & Quality Assurance
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Patient Reviews, Testimonials & NPS Moderation
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Monitor clinical ratings, moderate patient testimonials, respond to feedback, and publish verified international healthcare outcomes.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Average Patient Rating</div>
          <div className="text-2xl font-bold text-amber-400 mt-2 flex items-center gap-1.5">
            <Star className="w-5 h-5 fill-amber-400" /> {avgRating} / 5.0
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Based on {totalReviews} patient submissions</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Net Promoter Score (NPS)</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">+{npsScore} NPS</div>
          <div className="text-[11px] text-emerald-500/80 mt-1">World-class patient advocacy</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Pending Moderation</div>
          <div className="text-2xl font-bold text-blue-400 mt-2">
            {reviews.filter(r => r.status === "PENDING").length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Requires coordinator verification</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Published Testimonials</div>
          <div className="text-2xl font-bold text-purple-400 mt-2">
            {reviews.filter(r => r.isPublished).length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Visible on global public portal</div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-slate-950/80 p-4 rounded-2xl border border-slate-800/80">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search patient, hospital, doctor, feedback..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Moderation Status</option>
            <option value="PENDING">Pending Approval</option>
            <option value="APPROVED">Approved</option>
            <option value="PUBLISHED">Published Live</option>
            <option value="HIDDEN">Hidden</option>
            <option value="REJECTED">Rejected</option>
          </select>

          <select
            value={ratingFilter}
            onChange={e => setRatingFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Star Ratings</option>
            <option value="5">★★★★★ (5 Stars)</option>
            <option value="4">★★★★☆ (4 Stars)</option>
            <option value="3">★★★☆☆ (3 Stars)</option>
            <option value="2">★★☆☆☆ (2 Stars)</option>
            <option value="1">★☆☆☆☆ (1 Star)</option>
          </select>

          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Categories</option>
            <option value="Hospital Care">Hospital Care</option>
            <option value="Doctor / Surgeon">Doctor / Surgeon</option>
            <option value="Ayurveda & Wellness">Ayurveda & Wellness</option>
            <option value="MAIDES Concierge & Logistics">Concierge & Logistics</option>
          </select>
        </div>
      </div>

      {/* Reviews Master Grid */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500 bg-slate-950/80 rounded-2xl border border-slate-800">
            No patient reviews match the selected filters.
          </div>
        ) : (
          filteredReviews.map((rev) => (
            <div 
              key={rev.id} 
              className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all space-y-4 shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/60 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-blue-600/20 text-[#0E82FD] font-bold text-sm flex items-center justify-center border border-blue-500/20">
                    {rev.patientName.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-white">{rev.patientName}</span>
                      <span className="text-[11px] text-slate-400 font-normal">({rev.patientCountry})</span>
                      <span className="font-mono text-[10px] text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded">
                        {rev.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-blue-400" />
                      <strong className="text-slate-300">{rev.targetName}</strong>
                      <span>•</span>
                      <span>{rev.treatment}</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Star Rating Display */}
                  <div className="flex items-center gap-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2.5 py-1 rounded-xl text-xs font-bold">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`} 
                        />
                      ))}
                    </div>
                    <span className="ml-1">({rev.rating}/5)</span>
                  </div>

                  {/* NPS Badge */}
                  <span className="px-2 py-1 rounded-xl text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20">
                    {rev.npsScore}/10 NPS
                  </span>

                  {/* Status Badge */}
                  <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold uppercase ${
                    rev.status === "PUBLISHED" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                    rev.status === "APPROVED" ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                    rev.status === "PENDING" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                    "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                  }`}>
                    {rev.status}
                  </span>
                </div>
              </div>

              {/* Patient Comment Body */}
              <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800/60 text-xs text-slate-200 leading-relaxed italic">
                "{rev.comment}"
              </div>

              {/* Admin Response if present */}
              {rev.adminResponse && (
                <div className="bg-blue-950/30 border border-blue-500/20 p-3.5 rounded-xl space-y-1 text-xs">
                  <div className="flex items-center justify-between text-[10px] text-blue-400 font-semibold">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Official MAIDES Response ({rev.adminResponder})
                    </span>
                    <span className="text-slate-500">{rev.adminResponseDate}</span>
                  </div>
                  <p className="text-slate-300">{rev.adminResponse}</p>
                </div>
              )}

              {/* Action Buttons & Moderation Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
                <div className="text-[11px] text-slate-500">
                  Submitted: {rev.submittedAt} • Category: <strong className="text-slate-400">{rev.category}</strong>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => {
                      setSelectedReview(rev);
                      setResponseText(rev.adminResponse || "");
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 font-medium text-[11px] flex items-center gap-1.5 transition-all"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    {rev.adminResponse ? "Edit Reply" : "Reply to Patient"}
                  </button>

                  {rev.status !== "PUBLISHED" && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, "PUBLISHED", true)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <Globe2 className="w-3.5 h-3.5" />
                      Approve & Publish
                    </button>
                  )}

                  {rev.status === "PUBLISHED" && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, "HIDDEN", false)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 text-[11px] flex items-center gap-1.5 transition-all"
                    >
                      <EyeOff className="w-3.5 h-3.5" />
                      Unpublish / Hide
                    </button>
                  )}

                  {rev.status !== "REJECTED" && (
                    <button
                      onClick={() => handleUpdateStatus(rev.id, "REJECTED", false)}
                      className="px-2.5 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-400 border border-rose-500/20 text-[11px] transition-all"
                      title="Reject Review"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL: ADMIN RESPONSE */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Official Reply to Patient Review</h3>
                <div className="text-xs text-slate-400">Patient: <strong className="text-white">{selectedReview.patientName}</strong> ({selectedReview.id})</div>
              </div>
              <button onClick={() => setSelectedReview(null)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 text-xs italic text-slate-300">
              "{selectedReview.comment}"
            </div>

            <form onSubmit={handleSendResponse} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Your Response (Visible on Patient Portal & Public Testimonials)</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Thank you for sharing your experience with our surgical team..."
                  value={responseText}
                  onChange={e => setResponseText(e.target.value)}
                  className="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white resize-none focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedReview(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold rounded-xl shadow-md"
                >
                  Save & Post Reply
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
