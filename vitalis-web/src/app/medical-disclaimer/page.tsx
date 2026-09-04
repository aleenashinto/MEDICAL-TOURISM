"use client";

import React from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";

export default function MedicalDisclaimerPage() {
  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Legal</span>
              <h1 className="text-4xl sm:text-5xl font-black">Medical Disclaimer</h1>
              <p className="text-sm text-blue-100">All users of MAIDES must read and acknowledge this disclaimer.</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 space-y-6">
            <div className="rounded-3xl bg-amber-50 border-2 border-amber-300 p-8 space-y-4">
              <h2 className="text-lg font-black text-amber-900">⚠️ Important Medical Disclaimer</h2>
              <p className="text-sm text-amber-800 leading-relaxed font-bold">
                MAIDES is a Medical Tourism Coordination & International Patient Assistance Platform — not a hospital, clinic, medical practice, or healthcare provider.
              </p>
            </div>

            <div className="space-y-4">
              {[
                {
                  title: "No Independent Medical Advice",
                  body: "The information provided on the MAIDES platform — including treatment descriptions, hospital profiles, doctor biographies, Ayurveda therapy information, and medical travel guides — is for general informational purposes only. It does not constitute independent medical advice, diagnosis, or treatment recommendations."
                },
                {
                  title: "No Diagnosis or Prescription",
                  body: "MAIDES does not diagnose medical conditions, prescribe medications, recommend specific treatment protocols, or provide any clinical opinion independent of the treating physician at a Kerala hospital. All medical decisions are made solely by qualified, licensed medical professionals at partner institutions."
                },
                {
                  title: "No Treatment Outcome Guarantees",
                  body: "MAIDES makes no warranty, expressed or implied, regarding the outcome, success, safety, or suitability of any medical treatment, surgical procedure, or Ayurvedic therapy arranged through our coordination services. All treatments carry inherent medical risks that must be discussed directly with your treating physician."
                },
                {
                  title: "Coordination Role Only",
                  body: "MAIDES acts exclusively as an intermediary coordination platform, connecting patients with independently operating, accredited Kerala hospitals and specialist physicians. The contractual and clinical relationship for treatment is between the patient and the treating hospital/physician — not MAIDES."
                },
                {
                  title: "Emergency Situations",
                  body: "MAIDES is not an emergency medical service. In the event of a medical emergency, call your local emergency services immediately. Do not use the MAIDES platform for emergency medical situations."
                },
                {
                  title: "Accuracy of Information",
                  body: "While MAIDES takes reasonable care to ensure accuracy of hospital and treatment information, medical knowledge evolves rapidly. Always verify treatment details, costs, accreditation status, and physician qualifications directly with the treating hospital before making any medical decision."
                },
                {
                  title: "Limitation of Liability",
                  body: "To the maximum extent permitted by applicable law, MAIDES Platform Pvt. Ltd. shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from the use of our coordination services, reliance on information provided on our platform, or the outcomes of medical treatment received at Kerala institutions."
                },
                {
                  title: "Consult Your Own Physician",
                  body: "Before travelling to Kerala for medical treatment, we strongly recommend consulting your own physician or specialist in your home country. MAIDES encourages second opinions and supports arranging video consultations with Kerala specialists to supplement — not replace — your home country physician's assessment."
                },
              ].map((section) => (
                <div key={section.title} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
                  <h2 className="text-sm font-black text-[#0F2042]">{section.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl bg-slate-50 border border-slate-200 p-5 text-xs text-slate-500 leading-relaxed">
              This Medical Disclaimer was last reviewed and updated in September 2025. For queries regarding this disclaimer, contact legal@maides.in.
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
