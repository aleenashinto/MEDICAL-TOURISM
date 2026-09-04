"use client";

import React, { useState } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ArrowUpRight, Leaf, CheckCircle, Star, Calendar } from "lucide-react";

const TREATMENTS = [
  {
    name: "Panchakarma",
    duration: "14–21 days",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    desc: "The authentic 5-fold Ayurvedic detoxification — Vamana, Virechana, Nasya, Basti, Raktamokshana — to eliminate metabolic toxins and restore systemic balance.",
    benefits: ["Deep cellular detoxification", "Joint & spinal rejuvenation", "Immune system strengthening", "Chronic stress reversal"],
    priceFrom: "$1,400"
  },
  {
    name: "Abhyangam",
    duration: "7–14 days",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=800&q=80",
    desc: "Full-body synchronized two-therapist warm herbal oil massage to stimulate marma points, improve circulation, and nourish the nervous system.",
    benefits: ["Relieves muscular fatigue", "Improves lymphatic drainage", "Reduces vata imbalance", "Skin nourishment"],
    priceFrom: "$480"
  },
  {
    name: "Shirodhara",
    duration: "7–14 days",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=800&q=80",
    desc: "A continuous stream of warm medicated oil poured onto the forehead (third eye) inducing deep meditative calm, reversing chronic insomnia and anxiety.",
    benefits: ["Chronic insomnia relief", "Migraine & headache management", "Anxiety reduction", "Deep nervous system calm"],
    priceFrom: "$380"
  },
  {
    name: "Pizhichil",
    duration: "14–21 days",
    image: "https://images.unsplash.com/photo-1487412840181-9af02abe45f6?auto=format&fit=crop&w=800&q=80",
    desc: "Royal oil bath — medicated warm oil poured continuously over the body by four therapists simultaneously, the ultimate treatment for paralytic and rheumatic conditions.",
    benefits: ["Stroke & hemiplegia rehabilitation", "Rheumatoid arthritis relief", "Post-surgical muscle recovery", "Complete nervous revitalization"],
    priceFrom: "$1,200"
  },
  {
    name: "Njavarakizhi",
    duration: "14–21 days",
    image: "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?auto=format&fit=crop&w=800&q=80",
    desc: "Medicated rice bolus (njavara) fomentation and massage — the only Ayurvedic treatment that simultaneously detoxes, nourishes, and builds deep muscle tissue.",
    benefits: ["Muscular dystrophy management", "Sports injury rehabilitation", "Anti-aging tissue rejuvenation", "Post-chemo body rebuilding"],
    priceFrom: "$950"
  },
  {
    name: "Kativasthi",
    duration: "7–14 days",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80",
    desc: "Warm medicated oil pooled on the lower back using a dough dam — the definitive Ayurvedic therapy for lumbar disc disease, sciatica, and chronic low back pain.",
    benefits: ["Lumbar disc herniation", "Sciatica nerve pain", "Degenerative disc disease", "Sacroiliac joint pain"],
    priceFrom: "$620"
  },
];

const CENTRES = [
  { name: "Arya Vaidya Sala Kottakkal (AVS)", location: "Malappuram", since: "1902", rating: 4.98, patients: "45,000+/yr" },
  { name: "Kottakkal Ayurveda Hospital", location: "Malappuram", since: "1944", rating: 4.95, patients: "30,000+/yr" },
  { name: "Somatheeram Ayurvedic Health Resort", location: "Thiruvananthapuram", since: "1991", rating: 4.93, patients: "12,000+/yr" },
  { name: "CGH Earth Ayurveda", location: "Ernakulam", since: "1988", rating: 4.91, patients: "9,500+/yr" },
];

export default function AyurvedaPage() {
  const [selected, setSelected] = useState(0);

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="relative bg-gradient-to-br from-[#0F2042] via-[#1a5c2a] to-[#2d8a50] text-white pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <img src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1800&q=80" alt="Ayurveda" className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#0F2042]/80 via-[#1a5c2a]/70 to-[#2d8a50]/60" />
            <div className="max-w-7xl mx-auto relative space-y-5">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20">
                <Leaf className="w-4 h-4 text-green-300" />
                <span className="text-xs font-bold text-green-200 uppercase tracking-wider">Ayurveda & Panchakarma in Kerala</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight max-w-3xl">
                The Global Home<br />of Authentic Ayurveda
              </h1>
              <p className="text-base text-green-100 max-w-2xl leading-relaxed">
                Kerala is the only place in the world where classical Ayurveda has been practised continuously for 5,000 years. Experience authentic healing under Ashtavaidya physicians using centuries-old Panchakarma protocols and Kerala's unique biodiversity of medicinal herbs.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button onClick={onOpenIntake} className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-[#1a5c2a] font-black text-sm hover:bg-green-50 transition-all shadow-xl">
                  <span>Book Ayurveda Programme</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">

            {/* Why Kerala */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Why Kerala</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042] leading-snug">5,000 Years of Unbroken Healing Tradition</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Kerala's unique climate, biodiversity, and the living lineage of Ashtavaidya physician families make it the only authentic source of classical Ayurvedic treatment in the world. Kerala's monsoon season (Karkidakam) is considered the most potent period for Panchakarma, when the body's pores are naturally open and receptive to herbal medicine.
                </p>
                <ul className="space-y-3">
                  {[
                    "Only state with unbroken Ashtavaidya hereditary physician tradition",
                    "Home to 1,800+ species of medicinal herbs in Western Ghats forests",
                    "Government-regulated Ayurveda physician licensing and hospital accreditation",
                    "NABH-accredited Ayush hospitals with international patient coordination",
                    "Post-treatment backwater recovery resorts for holistic convalescence",
                  ].map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-xs text-slate-700">
                      <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-3xl overflow-hidden shadow-2xl h-80 lg:h-full min-h-64">
                <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80" alt="Kerala Ayurveda" className="w-full h-full object-cover" />
              </div>
            </section>

            {/* Treatments */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Classical Therapies</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">Authentic Panchakarma Therapies</h2>
                <p className="text-sm text-slate-500 max-w-xl mx-auto">Each therapy is prescribed individually based on your Dosha constitution, medical history, and treatment goal by a qualified Vaidya.</p>
              </div>

              <div className="flex flex-wrap gap-2 justify-center">
                {TREATMENTS.map((t, i) => (
                  <button key={t.name} onClick={() => setSelected(i)} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${selected === i ? "bg-emerald-600 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{t.name}</button>
                ))}
              </div>

              <div className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-2">
                <div className="h-72 lg:h-auto overflow-hidden">
                  <img src={TREATMENTS[selected].image} alt={TREATMENTS[selected].name} className="w-full h-full object-cover" />
                </div>
                <div className="p-8 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-[#0F2042]">{TREATMENTS[selected].name}</h3>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">{TREATMENTS[selected].duration}</span>
                  </div>
                  <p className="text-sm text-slate-600 leading-relaxed">{TREATMENTS[selected].desc}</p>
                  <div className="space-y-2">
                    <div className="text-xs font-bold text-slate-700">Key Benefits</div>
                    <ul className="space-y-1.5">
                      {TREATMENTS[selected].benefits.map((b) => (
                        <li key={b} className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />{b}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400">Starting from</div>
                      <div className="text-lg font-black text-[#0E82FD]">{TREATMENTS[selected].priceFrom}</div>
                    </div>
                    <button onClick={onOpenIntake} className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-all">
                      Book Programme
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Centres */}
            <section className="space-y-8">
              <div className="text-center space-y-2">
                <span className="text-xs font-bold uppercase tracking-widest text-emerald-600">Authentic Centres</span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">Kerala's Premier Ayurveda Institutions</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {CENTRES.map((c) => (
                  <div key={c.name} className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                      <Leaf className="w-5 h-5 text-emerald-600" />
                    </div>
                    <h3 className="text-xs font-black text-[#0F2042] leading-snug">{c.name}</h3>
                    <div className="text-[10px] text-slate-500">{c.location} · Est. {c.since}</div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                        <span className="text-xs font-bold text-slate-700">{c.rating}</span>
                      </div>
                      <span className="text-[10px] text-emerald-600 font-bold">{c.patients}</span>
                    </div>
                    <button onClick={onOpenIntake} className="w-full py-2 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold hover:bg-emerald-100 transition-all border border-emerald-100">
                      View Programmes
                    </button>
                  </div>
                ))}
              </div>
            </section>

            {/* CTA */}
            <div className="rounded-3xl bg-gradient-to-r from-[#1a5c2a] to-[#2d8a50] text-white p-8 sm:p-12 text-center space-y-4">
              <h2 className="text-2xl sm:text-3xl font-black">Begin Your Ayurveda Healing Journey</h2>
              <p className="text-sm text-green-100 max-w-lg mx-auto">Share your health concerns and our Ayurveda coordinators will recommend a personalised Panchakarma programme with the right Kerala institution.</p>
              <button onClick={onOpenIntake} className="inline-flex items-center space-x-2 px-8 py-3.5 rounded-full bg-white text-[#1a5c2a] font-black text-sm hover:bg-green-50 transition-all shadow-lg">
                <span>Book My Ayurveda Programme</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
