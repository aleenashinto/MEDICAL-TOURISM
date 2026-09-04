"use client";

import React, { useState } from "react";
import { 
  Star, 
  Send, 
  CheckCircle2, 
  Heart, 
  MessageSquare, 
  ShieldCheck,
  Award
} from "lucide-react";

export default function PatientFeedbackPage() {
  const [rating, setRating] = useState(10);
  const [comment, setComment] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div>
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">
          Treatment Feedback & Net Promoter Score (NPS)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Help future international patients by sharing your clinical and hospitality experience in Kerala.
        </p>
      </div>

      {isSubmitted ? (
        <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-4 shadow-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Thank You for Your Review!</h2>
          <p className="text-xs text-slate-600 max-w-md mx-auto">
            Your feedback has been recorded. It directly helps prospective global patients choose the right doctors and accredited hospitals in Kerala.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 p-6 rounded-2xl space-y-6 shadow-sm">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              How likely are you to recommend MAIDES & Kerala Medical Tourism to friends or family? (0 = Not Likely, 10 = Extremely Likely)
            </label>
            <div className="grid grid-cols-11 gap-1.5 pt-2">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setRating(score)}
                  className={`py-2.5 rounded-lg text-xs font-bold transition-all ${
                    rating === score
                      ? "bg-blue-600 text-white shadow"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {score}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Detailed Hospital & Clinical Experience
            </label>
            <textarea
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about the surgical care, hospital cleanliness, nursing staff, and airport liaison..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all flex items-center justify-center gap-2"
          >
            <Send className="w-4 h-4" />
            Submit Patient Review
          </button>
        </form>
      )}
    </div>
  );
}
