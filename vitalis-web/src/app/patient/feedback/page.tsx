"use client";

import React, { useState, useEffect } from "react";
import { 
  Star, 
  Send, 
  CheckCircle2, 
  Heart, 
  MessageSquare, 
  ShieldCheck,
  Building2,
  Stethoscope,
  ThumbsUp,
  Clock,
  Sparkles,
  ChevronRight,
  UserCheck
} from "lucide-react";

export type ReviewStatus = "PENDING" | "APPROVED" | "REJECTED" | "PUBLISHED" | "HIDDEN" | "ARCHIVED";

export interface PatientReview {
  id: string;
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientCountry: string;
  category: "Hospital Care" | "Doctor / Surgeon" | "Appointment & Telehealth" | "MAIDES Concierge & Logistics" | "Ayurveda & Wellness";
  targetName: string;
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
}

const DEFAULT_PATIENT_REVIEWS: PatientReview[] = [
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
  }
];

export default function PatientFeedbackPage() {
  const [reviews, setReviews] = useState<PatientReview[]>([]);
  const [rating, setRating] = useState(5);
  const [npsScore, setNpsScore] = useState(10);
  const [recommend, setRecommend] = useState(true);
  const [category, setCategory] = useState<PatientReview["category"]>("Hospital Care");
  const [targetName, setTargetName] = useState("Aster Medcity, Kochi");
  const [treatment, setTreatment] = useState("Total Knee Replacement");
  const [comment, setComment] = useState("");
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);

  // Load reviews from shared store
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maides_patient_reviews_v3");
      if (saved) {
        const parsed: PatientReview[] = JSON.parse(saved);
        // Filter only current patient reviews (Sarah Jenkins)
        const patientReviews = parsed.filter(r => r.patientName === "Sarah Jenkins" || r.patientEmail === "sarah.jenkins@example.com");
        setReviews(patientReviews.length > 0 ? patientReviews : parsed.slice(0, 1));
      } else {
        setReviews(DEFAULT_PATIENT_REVIEWS);
        localStorage.setItem("maides_patient_reviews_v3", JSON.stringify(DEFAULT_PATIENT_REVIEWS));
      }
    } catch (e) {
      setReviews(DEFAULT_PATIENT_REVIEWS);
    }
  }, []);

  // Submit Feedback
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) {
      alert("Please enter your feedback comments.");
      return;
    }

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newRev: PatientReview = {
      id: "REV-" + Math.floor(100 + Math.random() * 900),
      patientId: "pat-101",
      patientName: "Sarah Jenkins",
      patientEmail: "sarah.jenkins@example.com",
      patientCountry: "United Kingdom",
      category,
      targetName,
      treatment,
      rating,
      npsScore,
      recommend,
      comment: comment.trim(),
      status: "PENDING",
      isPublished: false,
      submittedAt: timeStr
    };

    // Update patient list
    const updatedPatientList = [newRev, ...reviews];
    setReviews(updatedPatientList);

    // Sync to shared store for Admin
    try {
      const saved = localStorage.getItem("maides_patient_reviews_v3");
      const allReviews: PatientReview[] = saved ? JSON.parse(saved) : [];
      localStorage.setItem("maides_patient_reviews_v3", JSON.stringify([newRev, ...allReviews]));
    } catch (err) {
      console.error(err);
    }

    setIsSubmittedSuccess(true);
    setComment("");
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-16">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <Heart className="w-4 h-4 fill-blue-600" />
          Patient Advocacy & Quality Assurance
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Treatment Feedback & Experience Reviews
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Share your clinical, hospital, and travel coordination experience to help prospective international patients and guide continuous quality improvement.
        </p>
      </div>

      {/* Submission Success Alert */}
      {isSubmittedSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 p-5 rounded-3xl flex items-start gap-4">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-sm text-emerald-900">Review Submitted for Verification!</h3>
            <p className="text-xs text-emerald-700">
              Thank you for sharing your journey. Your review has been submitted to the MAIDES Experience Desk with status <strong className="font-bold">PENDING</strong> and will be approved and published shortly.
            </p>
          </div>
        </div>
      )}

      {/* Review Submission Form */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h2 className="font-bold text-base text-slate-900">Submit New Patient Testimonial</h2>
          <span className="flex items-center gap-1 text-xs text-emerald-600 font-semibold">
            <ShieldCheck className="w-4 h-4" /> Verified Patient Review
          </span>
        </div>

        <form onSubmit={handleSubmitReview} className="space-y-5 text-xs">
          {/* Star Rating Selector */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-2">
              Overall Clinical & Coordination Rating:
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setRating(s)}
                  className="p-2 rounded-xl hover:bg-slate-50 transition-all active:scale-95"
                >
                  <Star 
                    className={`w-8 h-8 transition-colors ${
                      s <= rating 
                        ? "fill-amber-400 text-amber-400" 
                        : "text-slate-300"
                    }`} 
                  />
                </button>
              ))}
              <span className="text-sm font-bold text-slate-800 ml-2">
                {rating} of 5 Stars {rating === 5 ? "— Outstanding" : rating >= 4 ? "— Excellent" : "— Satisfactory"}
              </span>
            </div>
          </div>

          {/* NPS Score Selector */}
          <div>
            <label className="block text-slate-700 font-bold uppercase tracking-wider mb-2">
              How likely are you to recommend MAIDES & Kerala Hospitals to friends or family? (0 = Not Likely, 10 = Highly Likely)
            </label>
            <div className="grid grid-cols-11 gap-1.5 pt-1">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setNpsScore(score)}
                  className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                    npsScore === score
                      ? "bg-blue-600 text-white shadow-md shadow-blue-500/20 scale-105"
                      : "bg-slate-50 text-slate-700 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          {/* Category & Hospital Target */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 font-semibold mb-1">Feedback Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as any)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              >
                <option value="Hospital Care">Hospital Care & Nursing</option>
                <option value="Doctor / Surgeon">Doctor / Surgeon Excellence</option>
                <option value="Ayurveda & Wellness">Ayurveda & Post-Op Wellness</option>
                <option value="MAIDES Concierge & Logistics">MAIDES Concierge, Visa & Transfers</option>
                <option value="Appointment & Telehealth">Appointment & Telehealth</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold mb-1">Hospital / Doctor Evaluated</label>
              <input
                type="text"
                required
                value={targetName}
                onChange={e => setTargetName(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>

          {/* Detailed Comment */}
          <div>
            <label className="block text-slate-700 font-semibold mb-1">Detailed Patient Review</label>
            <textarea
              rows={4}
              required
              placeholder="Describe the medical care, surgeon consultation, facility hygiene, nursing compassion, and logistics support..."
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-600 leading-relaxed"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 active:scale-95"
          >
            <Send className="w-4 h-4" />
            Submit Patient Review & Testimonial
          </button>
        </form>
      </div>

      {/* Previous Submitted Reviews History */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900">Your Submitted Reviews & Moderation History</h2>

        {reviews.map((rev) => (
          <div 
            key={rev.id} 
            className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-900">{rev.targetName}</span>
                  <span className="font-mono text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-semibold">
                    {rev.id}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Category: {rev.category} • Submitted on {rev.submittedAt}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Star display */}
                <div className="flex items-center gap-1 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-xl text-xs font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-300"}`} 
                    />
                  ))}
                  <span className="ml-1">({rev.rating}/5)</span>
                </div>

                {/* Status Badge */}
                <span className={`px-2.5 py-1 rounded-xl text-xs font-bold uppercase ${
                  rev.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" :
                  rev.status === "APPROVED" ? "bg-blue-50 text-blue-700 border border-blue-200" :
                  rev.status === "PENDING" ? "bg-amber-50 text-amber-700 border border-amber-200" :
                  "bg-rose-50 text-rose-700 border border-rose-200"
                }`}>
                  {rev.status}
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-700 italic leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
              "{rev.comment}"
            </p>

            {/* Official Admin Reply from MAIDES */}
            {rev.adminResponse && (
              <div className="bg-blue-50/70 border border-blue-200 p-4 rounded-2xl space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px] font-bold text-blue-900">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                    Official Response from {rev.adminResponder || "MAIDES Care Team"}
                  </span>
                  <span className="text-slate-500 font-normal">{rev.adminResponseDate}</span>
                </div>
                <p className="text-slate-800 leading-relaxed">{rev.adminResponse}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
