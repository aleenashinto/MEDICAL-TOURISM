"use client";

import React from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ArrowUpRight, Globe, Plane, FileText, HeartPulse, Phone, Shield, CheckCircle, MapPin } from "lucide-react";

const COUNTRIES = [
  { name: "UAE", flag: "🇦🇪", patients: "42,000+", primary: "Dubai, Abu Dhabi, Sharjah" },
  { name: "Saudi Arabia", flag: "🇸🇦", patients: "31,000+", primary: "Riyadh, Jeddah, Dammam" },
  { name: "Qatar", flag: "🇶🇦", patients: "18,000+", primary: "Doha" },
  { name: "Oman", flag: "🇴🇲", patients: "14,000+", primary: "Muscat, Salalah" },
  { name: "Kuwait", flag: "🇰🇼", patients: "12,000+", primary: "Kuwait City" },
  { name: "Bahrain", flag: "🇧🇭", patients: "8,000+", primary: "Manama" },
  { name: "Maldives", flag: "🇲🇻", patients: "9,000+", primary: "Malé" },
  { name: "Sri Lanka", flag: "🇱🇰", patients: "11,000+", primary: "Colombo, Kandy" },
  { name: "United Kingdom", flag: "🇬🇧", patients: "7,500+", primary: "London, Birmingham" },
  { name: "United States", flag: "🇺🇸", patients: "5,200+", primary: "New York, Houston, Chicago" },
  { name: "Africa", flag: "🌍", patients: "16,000+", primary: "Nigeria, Kenya, Tanzania, Ethiopia" },
  { name: "Canada", flag: "🇨🇦", patients: "3,800+", primary: "Toronto, Vancouver" },
];

const JOURNEY_STEPS = [
  { step: "01", icon: "📋", title: "Submit Medical Enquiry", desc: "Share your medical reports and treatment needs via our secure encrypted portal. Available in English, Arabic, French, and Malayalam." },
  { step: "02", icon: "🩺", title: "Clinical Triage Review", desc: "Our medical coordinator reviews your case and matches you with the most suitable Kerala hospital and specialist within 24 hours." },
  { step: "03", icon: "💬", title: "Free Medical Consultation", desc: "Connect with your assigned Kerala specialist via video call for a preliminary case assessment, second opinion, and treatment roadmap." },
  { step: "04", icon: "📄", title: "Medical Visa Support", desc: "MAIDES prepares your hospital invitation letter, medical visa documentation, and embassy support letter within 4 hours of confirmation." },
  { step: "05", icon: "✈️", title: "Airport & Hotel Coordination", desc: "Our on-ground team receives you at Kochi (COK), Trivandrum (TRV), or Calicut (CCJ) airports and escorts you to your hospital or hotel." },
  { step: "06", icon: "🏥", title: "Treatment & Recovery", desc: "From admission to discharge, your MAIDES care coordinator is available 24/7 to handle communication, translation, and logistics." },
  { step: "07", icon: "🌿", title: "Post-Treatment Wellness", desc: "Optional Ayurveda recuperation at partner wellness resorts along Kerala's backwaters for holistic post-surgical healing." },
  { step: "08", icon: "🏠", title: "Follow-Up Care", desc: "After returning home, your coordinating doctor provides teleconsultation, prescription support, and lab result interpretation." },
];

export default function InternationalPatientsPage() {
  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="relative bg-gradient-to-br from-[#0F2042] via-[#17468A] to-[#1E5DAE] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-20 right-20 w-64 h-64 rounded-full bg-white blur-3xl" />
              <div className="absolute bottom-10 left-10 w-40 h-40 rounded-full bg-blue-300 blur-2xl" />
            </div>
            <div className="max-w-7xl mx-auto relative space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Globe className="w-4 h-4 text-blue-300" />
                <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">International Patient Services</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight max-w-3xl">
                Your Kerala Medical<br />Journey Starts Here
              </h1>
              <p className="text-base text-blue-100 max-w-2xl leading-relaxed">
                MAIDES coordinates end-to-end medical care for patients from the Middle East, Africa, UK, USA, and across the globe — from first enquiry to follow-up care at home.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={onOpenIntake} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#0F2042] font-black text-sm hover:bg-blue-50 transition-all shadow-xl">
                  <span>Start My Medical Journey</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
                <a href="tel:+91-XXX-XXX-XXXX" className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 border border-white/30 text-white font-bold text-sm hover:bg-white/20 transition-all">
                  <Phone className="w-4 h-4" />
                  <span>24/7 International Desk</span>
                </a>
              </div>

              {/* Stats bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-8 border-t border-white/10">
                {[
                  { num: "220,000+", label: "Int'l Patients Served" },
                  { num: "50+", label: "Countries Represented" },
                  { num: "3", label: "International Airports" },
                  { num: "14", label: "Kerala Districts Covered" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-black text-white">{s.num}</div>
                    <div className="text-xs text-blue-200 mt-0.5">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

            {/* Patient Journey Steps */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD]">How It Works</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">Your End-to-End Kerala Journey</h2>
                <p className="text-sm text-slate-500 max-w-xl mx-auto">Every step personally coordinated by our clinical team, from enquiry to return home.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
                {JOURNEY_STEPS.map((s) => (
                  <div key={s.step} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-3xl">{s.icon}</span>
                      <span className="text-3xl font-black text-slate-100">{s.step}</span>
                    </div>
                    <h3 className="text-sm font-black text-[#0F2042]">{s.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Countries We Serve */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD]">Global Reach</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">Patients We Serve Worldwide</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {COUNTRIES.map((c) => (
                  <div key={c.name} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all space-y-1.5">
                    <div className="text-2xl">{c.flag}</div>
                    <div className="text-xs font-black text-[#0F2042]">{c.name}</div>
                    <div className="text-[11px] font-bold text-[#0E82FD]">{c.patients} patients</div>
                    <div className="text-[10px] text-slate-400 leading-relaxed">{c.primary}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Services grid */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD]">Our Services</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">Complete Patient Support</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { icon: <FileText className="w-5 h-5" />, title: "Medical Visa Documentation", desc: "Hospital invitation letters, visa application guidance, and embassy support letters prepared within 4 hours." },
                  { icon: <Plane className="w-5 h-5" />, title: "Airport Reception", desc: "VIP meet & greet services at Kochi, Trivandrum, and Calicut airports with direct hospital or hotel transfers." },
                  { icon: <HeartPulse className="w-5 h-5" />, title: "Clinical Coordination", desc: "Dedicated patient coordinator manages all hospital appointments, specialist referrals, and test scheduling." },
                  { icon: <Globe className="w-5 h-5" />, title: "Multilingual Support", desc: "Arabic, English, Malayalam, Hindi, French, and Dhivehi interpreters available 24/7 throughout your stay." },
                  { icon: <Shield className="w-5 h-5" />, title: "Insurance & Billing", desc: "Direct insurance billing, cost estimation before treatment, and transparent itemized invoicing in USD/AED/INR." },
                  { icon: <CheckCircle className="w-5 h-5" />, title: "Post-Treatment Follow-Up", desc: "Teleconsultation, prescription support, and lab result review after returning to your home country." },
                ].map((s) => (
                  <div key={s.title} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0E82FD]">{s.icon}</div>
                    <h3 className="text-sm font-black text-[#0F2042]">{s.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Airports */}
            <section className="rounded-3xl bg-[#F8FAFC] border border-slate-200 p-8 sm:p-12 space-y-6">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD]">Kerala Airports</span>
                <h2 className="text-2xl sm:text-3xl font-black text-[#0F2042]">3 International Gateways to Kerala</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                {[
                  { code: "COK", name: "Cochin International Airport", city: "Kochi", routes: "Dubai, Doha, Riyadh, Muscat, London, Frankfurt, Singapore", badge: "Busiest Gateway" },
                  { code: "TRV", name: "Trivandrum International Airport", city: "Thiruvananthapuram", routes: "Dubai, Abu Dhabi, Colombo, Malé, Sharjah, Doha", badge: "South Kerala Hub" },
                  { code: "CCJ", name: "Calicut International Airport", city: "Kozhikode", routes: "Dubai, Muscat, Doha, Riyadh, Sharjah, Kuwait, Bahrain", badge: "North Kerala Hub" },
                ].map((a) => (
                  <div key={a.code} className="rounded-2xl bg-white border border-slate-200 p-5 space-y-3 shadow-sm">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[#0F2042] flex items-center justify-center text-white font-black text-sm">{a.code}</div>
                      <div>
                        <div className="text-xs font-black text-[#0F2042]">{a.city}</div>
                        <div className="text-[10px] text-[#0E82FD] font-bold">{a.badge}</div>
                      </div>
                    </div>
                    <p className="text-[11px] font-medium text-slate-700">{a.name}</p>
                    <p className="text-[10px] text-slate-500 leading-relaxed">Direct routes: {a.routes}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Bottom CTA */}
            <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black">Ready to Begin Your Kerala Medical Journey?</h2>
              <p className="text-sm text-blue-100 max-w-lg mx-auto">Submit a free medical enquiry and receive a personalized Kerala hospital and specialist recommendation within 24 hours.</p>
              <button onClick={onOpenIntake} className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-white text-[#0F2042] font-black text-sm hover:bg-blue-50 transition-all shadow-lg">
                <span>Start My Medical Journey</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
