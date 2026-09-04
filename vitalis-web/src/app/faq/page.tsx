"use client";

import React, { useState } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ChevronDown, Search } from "lucide-react";

const FAQS = [
  {
    category: "Getting Started",
    items: [
      { q: "What exactly is MAIDES?", a: "MAIDES is a Kerala-based Medical Tourism & International Patient Assistance Platform. We are not a hospital — we are your independent coordinator who connects you with the right Kerala hospital, specialist, and travel logistics from your first enquiry to post-treatment follow-up." },
      { q: "Is MAIDES free to use?", a: "Submitting a medical enquiry and receiving a hospital/doctor recommendation is completely free. MAIDES earns a facilitation fee from partner hospitals once you confirm treatment — this fee is disclosed upfront and does not increase your treatment cost." },
      { q: "What countries do you serve?", a: "We serve patients from 50+ countries, with dedicated coordinators for the GCC (UAE, Saudi Arabia, Qatar, Oman, Kuwait, Bahrain), Maldives, Sri Lanka, UK, USA, Canada, Australia, and across Africa. We have Arabic, French, and Malayalam interpreters on staff." },
    ]
  },
  {
    category: "Medical Enquiry & Documents",
    items: [
      { q: "How do I submit a medical enquiry?", a: "Click 'Get Medical Assistance' on any page and complete our secure 4-step intake form: personal details, medical summary, document upload, and hospital preference. Our clinical team reviews your case within 24 hours." },
      { q: "What medical documents should I send?", a: "Please share your latest medical reports, lab results, imaging (X-ray, MRI, CT, PET scans), diagnosis letters, and current medication list. All documents are encrypted and handled under our strict privacy protocol." },
      { q: "Is my medical data secure?", a: "Yes. All documents are uploaded via encrypted S3-compatible private object storage and are never shared with any third party without your explicit written consent. MAIDES operates under GDPR-aligned data protection standards." },
      { q: "Can I get a second opinion from a Kerala specialist?", a: "Yes! Once you submit your enquiry, we can arrange a preliminary video consultation with a Kerala specialist as a formal second opinion, usually within 3–5 working days of document review." },
    ]
  },
  {
    category: "Treatment & Hospitals",
    items: [
      { q: "Which hospitals in Kerala does MAIDES work with?", a: "We work exclusively with JCI-accredited, NABH-certified, and NABL-accredited hospitals across all 14 Kerala districts including Aster Medcity, Rajagiri Hospital, KIMSHEALTH Trivandrum, Baby Memorial Hospital Kozhikode, Caritas Hospital, and Arya Vaidya Sala Kottakkal." },
      { q: "How does MAIDES match me with a hospital?", a: "Our clinical coordinators analyse your diagnosis, required treatment, medical history, preferred district, budget range, and language requirements. We then shortlist 3 hospitals across different tiers (Platinum/Premium/Value) and present them with full transparent cost estimates." },
      { q: "Can I choose my own hospital or doctor?", a: "Absolutely. You can specify a preferred hospital or doctor name in your enquiry. MAIDES will coordinate your admission, appointment, and logistics accordingly." },
      { q: "Does MAIDES guarantee treatment outcomes?", a: "No. MAIDES is a coordination platform — not a medical provider. We do not provide independent diagnoses, prescriptions, or guarantees of any specific clinical outcome. All medical decisions are made by your treating Kerala physician." },
    ]
  },
  {
    category: "Travel & Logistics",
    items: [
      { q: "Can MAIDES help with my medical visa?", a: "Yes. We prepare your hospital invitation letter, medical visa documentation package, and embassy support letter within 4 hours of your hospital confirmation. We also provide guidance on the Indian e-Medical Visa application process." },
      { q: "Which airports serve Kerala?", a: "Kerala has 3 international airports: Cochin International Airport (COK) serving Central Kerala, Trivandrum International Airport (TRV) serving South Kerala, and Calicut International Airport (CCJ) serving North Kerala. All have direct flights from the Middle East, UK, and Southeast Asia." },
      { q: "Does MAIDES arrange airport pickup?", a: "Yes. Our ground team provides VIP meet & greet service at all 3 Kerala airports, with direct chauffeur transfer to your hospital or hotel. This is included in our standard coordination package." },
      { q: "Can my family accompany me?", a: "Yes. MAIDES coordinates hotel accommodation for attendants, hospital guest room bookings, and local travel arrangements for your family members throughout your Kerala stay." },
    ]
  },
  {
    category: "Costs & Payments",
    items: [
      { q: "How much does treatment cost in Kerala vs. my home country?", a: "Kerala healthcare costs are typically 60–80% lower than equivalent care in the UK, USA, or GCC countries, with no reduction in clinical quality. For example, cardiac bypass surgery that costs USD 120,000 in the US is available in Kerala for USD 4,800–8,500 at JCI-accredited hospitals." },
      { q: "Does MAIDES provide cost estimates before travel?", a: "Yes. Before you travel, we provide a detailed transparent cost estimate covering surgical fees, hospital stay, investigations, anaesthesia, medication, and post-surgical consultations — itemised in USD, AED, and INR." },
      { q: "Does MAIDES work with insurance?", a: "MAIDES can facilitate insurance pre-authorisation and direct billing coordination with selected partner hospitals. Please share your insurance details in your enquiry and we will confirm eligibility." },
    ]
  },
  {
    category: "Ayurveda & Wellness",
    items: [
      { q: "Is Ayurveda the right treatment for me?", a: "Ayurveda can be highly effective for chronic musculoskeletal conditions (arthritis, spine disorders), neurological rehabilitation, post-surgical recovery, metabolic disorders, stress-related illnesses, and general wellness. Our clinical team will assess your suitability during the initial consultation." },
      { q: "How long should I stay for Panchakarma?", a: "Authentic classical Panchakarma requires a minimum of 14–21 days for meaningful therapeutic results. Shorter programmes of 7 days are available for relaxation and rejuvenation but are not sufficient for treating chronic conditions." },
      { q: "Are MAIDES Ayurveda centres genuine?", a: "We partner only with NABH-accredited Ayush hospitals and traditional institutions under Government of Kerala regulation, including Arya Vaidya Sala Kottakkal (established 1902) and other heritage centres under licensed Ashtavaidya physicians." },
    ]
  },
];

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [query, setQuery] = useState("");

  const toggle = (key: string) => {
    const next = new Set(openItems);
    next.has(key) ? next.delete(key) : next.add(key);
    setOpenItems(next);
  };

  const filteredFaqs = FAQS.map((cat) => ({
    ...cat,
    items: cat.items.filter(
      (item) =>
        query === "" ||
        item.q.toLowerCase().includes(query.toLowerCase()) ||
        item.a.toLowerCase().includes(query.toLowerCase())
    ),
  })).filter((cat) => cat.items.length > 0);

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-4 text-center">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Frequently Asked Questions</span>
              <h1 className="text-4xl sm:text-5xl font-black">Everything You Need to Know</h1>
              <p className="text-sm text-blue-100 max-w-xl mx-auto leading-relaxed">
                Answers to the most common questions about MAIDES, Kerala medical tourism, treatment costs, visa, and Ayurveda.
              </p>
              <div className="flex items-center max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden mt-4">
                <div className="pl-4 text-slate-400"><Search className="w-4 h-4" /></div>
                <input
                  type="text"
                  placeholder="Search FAQs..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="flex-1 px-4 py-3.5 text-xs text-slate-800 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
            {filteredFaqs.map((cat) => (
              <div key={cat.category} className="space-y-3">
                <h2 className="text-sm font-black text-[#0F2042] uppercase tracking-wider border-b border-slate-200 pb-2">{cat.category}</h2>
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = openItems.has(key);
                  return (
                    <div key={key} className={`rounded-2xl border transition-all ${isOpen ? "border-[#0E82FD] bg-blue-50" : "border-slate-200 bg-white"} overflow-hidden`}>
                      <button
                        onClick={() => toggle(key)}
                        className="w-full px-5 py-4 flex items-center justify-between text-left gap-4"
                      >
                        <span className={`text-sm font-bold ${isOpen ? "text-[#0E82FD]" : "text-[#0F2042]"}`}>{item.q}</span>
                        <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform ${isOpen ? "rotate-180 text-[#0E82FD]" : "text-slate-400"}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-4 text-xs text-slate-600 leading-relaxed border-t border-blue-100 pt-3">
                          {item.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {filteredFaqs.length === 0 && (
              <div className="text-center py-12 space-y-3">
                <div className="text-4xl">🔍</div>
                <p className="text-sm text-slate-500">No results found for "<strong>{query}</strong>"</p>
                <button onClick={() => setQuery("")} className="text-xs font-bold text-[#0E82FD] hover:underline">Clear search</button>
              </div>
            )}

            <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 text-center space-y-4">
              <h2 className="text-xl sm:text-2xl font-black">Didn't find your answer?</h2>
              <p className="text-sm text-blue-100">Speak to our medical coordination team directly — 24/7 international desk available.</p>
              <button onClick={onOpenIntake} className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#0F2042] font-bold text-xs hover:bg-blue-50 transition-all shadow-lg">
                Contact Our Team
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
