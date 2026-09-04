"use client";

import React from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ArrowUpRight, Shield, Lock, FileText, Eye } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Legal</span>
              <h1 className="text-4xl sm:text-5xl font-black">Privacy Policy</h1>
              <p className="text-sm text-blue-100">Last updated: September 2025</p>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
            <div className="flex gap-4 mb-8">
              {[
                { icon: <Shield className="w-5 h-5" />, label: "GDPR Aligned" },
                { icon: <Lock className="w-5 h-5" />, label: "256-bit Encryption" },
                { icon: <Eye className="w-5 h-5" />, label: "No Third-Party Sale" },
              ].map((b) => (
                <div key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-[#0E82FD] text-xs font-bold">
                  {b.icon}{b.label}
                </div>
              ))}
            </div>

            <div className="prose prose-sm max-w-none space-y-8">
              {[
                {
                  title: "1. Who We Are",
                  body: "MAIDES Platform Pvt. Ltd. ('MAIDES', 'we', 'us', 'our') operates the MAIDES Medical Tourism & International Patient Assistance Platform available at maides.in. We are registered in Kochi, Kerala, India. For data protection enquiries, contact privacy@maides.in."
                },
                {
                  title: "2. Information We Collect",
                  body: "We collect personal information you provide when submitting a medical enquiry: full name, email address, WhatsApp/phone number, country of residence, medical condition summary, and medical documents (reports, imaging, lab results). We also collect technical data automatically: IP address, browser type, device type, pages visited, and session duration."
                },
                {
                  title: "3. How We Use Your Information",
                  body: "Your personal and medical data is used exclusively to: (a) review your medical case and prepare a hospital/specialist recommendation; (b) coordinate your Kerala medical journey including appointments, visa support, and travel logistics; (c) communicate with you via email, WhatsApp, and video call; (d) improve our coordination services. We do not use your data for marketing purposes without explicit consent."
                },
                {
                  title: "4. Medical Data Protection",
                  body: "All medical documents uploaded to MAIDES are encrypted in transit (TLS 1.3) and at rest (AES-256) in private S3-compatible object storage. Medical records are never shared with any hospital, doctor, or third party without your explicit written consent obtained at the time of enquiry submission. Medical data is retained for a maximum of 7 years after case closure, after which it is permanently deleted."
                },
                {
                  title: "5. Third-Party Sharing",
                  body: "MAIDES shares your information with: (a) partner Kerala hospitals and specialist doctors, strictly with your consent; (b) airport transfer and hotel partners, only the minimum data required for coordination; (c) our technology service providers (cloud hosting, email delivery) under strict data processing agreements. We never sell your data to any third party."
                },
                {
                  title: "6. Cookies",
                  body: "We use essential cookies for website functionality, session management, and security. Optional analytics cookies help us understand site usage. You may disable non-essential cookies via your browser settings without affecting core website functionality."
                },
                {
                  title: "7. Your Rights",
                  body: "You have the right to: access a copy of all personal data we hold about you; rectify inaccurate data; request erasure of your data (subject to legal retention obligations); restrict or object to data processing; data portability in a machine-readable format; withdraw consent at any time. To exercise any right, email privacy@maides.in."
                },
                {
                  title: "8. Data Retention",
                  body: "Active patient enquiry data: retained for the duration of your MAIDES relationship plus 7 years. Medical documents: retained per your consent agreement, maximum 7 years. Website analytics data: retained for 13 months. You may request early deletion at any time."
                },
                {
                  title: "9. Children's Privacy",
                  body: "MAIDES does not knowingly collect personal data from children under 16 without parental consent. Parents submitting enquiries on behalf of a child patient must confirm consent on behalf of the minor."
                },
                {
                  title: "10. Changes to This Policy",
                  body: "We may update this Privacy Policy from time to time. Significant changes will be notified to registered users via email. Continued use of MAIDES services after such notification constitutes acceptance of the revised policy."
                },
                {
                  title: "11. Contact",
                  body: "For all privacy enquiries: privacy@maides.in | MAIDES Platform Pvt. Ltd., Infopark, Kakkanad, Kochi, Kerala — 682 030, India."
                },
              ].map((section) => (
                <div key={section.title} className="rounded-2xl bg-white border border-slate-200 p-6 space-y-3">
                  <h2 className="text-sm font-black text-[#0F2042]">{section.title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{section.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
