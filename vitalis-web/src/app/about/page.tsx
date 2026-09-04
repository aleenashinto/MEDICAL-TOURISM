"use client";

import React from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ArrowUpRight, Heart, Users, Globe, Award, Target, CheckCircle, MapPin } from "lucide-react";

const TEAM = [
  { name: "Dr. Priya Menon", role: "Chief Medical Coordinator", exp: "18 years", img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=400&q=80" },
  { name: "Anwar Hussain", role: "International Patient Liaison — GCC", exp: "12 years", img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80" },
  { name: "Rachel Thomas", role: "Clinical Documentation Specialist", exp: "9 years", img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" },
  { name: "Mohammed Al-Rashidi", role: "Arabic Patient Coordinator", exp: "11 years", img: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80" },
];

const STATS = [
  { num: "220,000+", label: "Patients Assisted" },
  { num: "50+", label: "Countries Served" },
  { num: "6+", label: "Years of Operation" },
  { num: "14", label: "Kerala Districts" },
  { num: "98.7%", label: "Patient Satisfaction" },
  { num: "24/7", label: "Coordination Desk" },
];

const VALUES = [
  { icon: <Heart className="w-5 h-5" />, title: "Compassion First", desc: "Every patient interaction is guided by empathy, respect, and culturally sensitive care." },
  { icon: <Award className="w-5 h-5" />, title: "Clinical Excellence", desc: "We partner only with JCI, NABH, and NABL accredited institutions to maintain the highest standards." },
  { icon: <Globe className="w-5 h-5" />, title: "Global Accessibility", desc: "Multilingual support in Arabic, English, French, and Malayalam ensures no patient is lost in translation." },
  { icon: <Target className="w-5 h-5" />, title: "Transparency", desc: "Honest cost estimates, clear timelines, and no hidden fees — before you travel, during care, and after." },
];

export default function AboutPage() {
  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-5">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">About MAIDES</span>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight max-w-3xl">
                Kerala's Dedicated Medical Tourism & Patient Assistance Platform
              </h1>
              <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                MAIDES was founded with a single purpose: to make world-class medical care in Kerala truly accessible to patients everywhere — no matter where they are in the world, what language they speak, or what they can afford.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

            {/* Mission */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD]">Our Mission</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042] leading-snug">
                  Your Health Deserves<br />the Right Journey
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  MAIDES bridges the gap between international patients and Kerala's world-class healthcare infrastructure. We are not a hospital — we are your independent medical travel partner, working exclusively on your behalf.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  From initial enquiry to post-treatment follow-up, every step of your Kerala medical journey is personally coordinated by our clinical team — ensuring you receive the right care, at the right hospital, from the right specialist, at the right price.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-xs text-amber-800 leading-relaxed">
                  <strong className="font-bold">Medical Disclaimer:</strong> MAIDES functions exclusively as a Medical Tourism Coordination & Patient Assistance Platform. We do not provide independent diagnosis, prescriptions, or treatment outcome guarantees.
                </div>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl h-80">
                <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80" alt="MAIDES Mission" className="w-full h-full object-cover" />
              </div>
            </section>

            {/* Stats */}
            <section className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
                {STATS.map((s) => (
                  <div key={s.label} className="space-y-2">
                    <div className="text-3xl sm:text-4xl font-black">{s.num}</div>
                    <div className="text-xs text-blue-200">{s.label}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* Values */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD]">Our Values</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">What We Stand For</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {VALUES.map((v) => (
                  <div key={v.title} className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-lg hover:border-blue-200 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0E82FD]">{v.icon}</div>
                    <h3 className="text-sm font-black text-[#0F2042]">{v.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Team */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-[#0E82FD]">Our Team</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">The MAIDES Coordination Team</h2>
                <p className="text-sm text-slate-500 max-w-xl mx-auto">Experienced healthcare professionals, patient liaisons, and cultural coordinators serving patients from 50+ countries.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {TEAM.map((m) => (
                  <div key={m.name} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-lg transition-all group">
                    <div className="h-48 overflow-hidden">
                      <img src={m.img} alt={m.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-4 space-y-1">
                      <h3 className="text-sm font-black text-[#0F2042]">{m.name}</h3>
                      <p className="text-[11px] font-semibold text-[#0E82FD]">{m.role}</p>
                      <p className="text-[10px] text-slate-400">{m.exp} experience</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* What MAIDES is not */}
            <section className="rounded-3xl bg-slate-50 border border-slate-200 p-8 sm:p-12 space-y-6">
              <h2 className="text-2xl sm:text-3xl font-black text-[#0F2042]">What MAIDES Is & Is Not</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-emerald-700">✅ What MAIDES Does</h3>
                  <ul className="space-y-2">
                    {[
                      "Connects patients with accredited Kerala hospitals",
                      "Coordinates appointments and specialist referrals",
                      "Assists with medical visa documentation",
                      "Arranges airport reception and hotel transfers",
                      "Provides multilingual patient support",
                      "Facilitates second opinion teleconsultations",
                      "Manages post-treatment follow-up coordination",
                    ].map((i) => <li key={i} className="flex items-center gap-2 text-xs text-slate-700"><CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{i}</li>)}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-red-600">❌ What MAIDES Does NOT Do</h3>
                  <ul className="space-y-2">
                    {[
                      "Provide independent medical diagnoses",
                      "Issue prescriptions or medications",
                      "Guarantee specific treatment outcomes",
                      "Replace the treating hospital or physician",
                      "Act as an insurance provider",
                      "Operate any hospital, clinic, or pharmacy",
                    ].map((i) => <li key={i} className="flex items-center gap-2 text-xs text-slate-700"><span className="w-3.5 h-3.5 flex-shrink-0 text-red-500">✕</span>{i}</li>)}
                  </ul>
                </div>
              </div>
            </section>

            {/* CTA */}
            <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black">Start Your MAIDES Journey</h2>
              <p className="text-sm text-blue-100 max-w-lg mx-auto">Submit a free medical enquiry and our coordination team will respond within 24 hours with a personalised recommendation.</p>
              <button onClick={onOpenIntake} className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-white text-[#0F2042] font-black text-sm hover:bg-blue-50 transition-all shadow-lg">
                <span>Get Medical Assistance</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
