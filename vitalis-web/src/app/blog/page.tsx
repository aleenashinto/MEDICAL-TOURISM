"use client";

import React from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { ArrowUpRight, Clock, Tag, ChevronRight } from "lucide-react";

const POSTS = [
  {
    id: "kerala-medical-tourism-guide-2025",
    title: "The Complete Guide to Medical Tourism in Kerala 2025",
    excerpt: "Everything international patients need to know about travelling to Kerala for medical treatment — from choosing a hospital to post-treatment recovery.",
    category: "Medical Tourism Guide",
    date: "2 Sep 2025",
    readTime: "12 min read",
    image: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=800&q=80",
    featured: true,
  },
  {
    id: "cardiac-surgery-kerala-vs-uk",
    title: "Cardiac Surgery in Kerala vs UK: Cost, Quality & Outcomes Compared",
    excerpt: "A detailed clinical comparison of cardiac bypass surgery at Kerala's JCI-accredited hospitals vs NHS and private providers in the UK.",
    category: "Cost Comparison",
    date: "28 Aug 2025",
    readTime: "8 min read",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: "panchakarma-treatment-guide",
    title: "What to Expect from a 21-Day Panchakarma Programme in Kerala",
    excerpt: "A step-by-step patient diary from pre-assessment to final Dosha review — what authentic Panchakarma feels like and what it treats.",
    category: "Ayurveda Guide",
    date: "22 Aug 2025",
    readTime: "10 min read",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: "robotic-knee-replacement-kerala",
    title: "Robotic Knee Replacement in Kerala: MAKO Technology & Rapid Recovery",
    excerpt: "How MAKO robotic-assisted arthroplasty at Kerala hospitals delivers sub-millimeter precision and same-day walking for international patients.",
    category: "Orthopaedics",
    date: "18 Aug 2025",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: "medical-visa-india-guide",
    title: "India Medical Visa: Complete Application Guide for International Patients",
    excerpt: "Step-by-step instructions for applying for an Indian Medical Visa (e-MV/MV category), required documents, timelines, and MAIDES support.",
    category: "Visa & Travel",
    date: "14 Aug 2025",
    readTime: "9 min read",
    image: "https://images.unsplash.com/photo-1533928298208-27ff66555d8d?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
  {
    id: "nri-healthcare-kerala",
    title: "NRI Healthcare in Kerala: How MAIDES Coordinates Care for Overseas Keralites",
    excerpt: "A dedicated guide for Non-Resident Indians across the Gulf, UK, and USA who need to arrange healthcare for parents and relatives in Kerala.",
    category: "NRI Patients",
    date: "10 Aug 2025",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1609137144813-7d9921338f24?auto=format&fit=crop&w=800&q=80",
    featured: false,
  },
];

const CATEGORIES = ["All", "Medical Tourism Guide", "Cost Comparison", "Ayurveda Guide", "Orthopaedics", "Visa & Travel", "NRI Patients", "Patient Stories"];

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = React.useState("All");

  const filtered = POSTS.filter((p) => activeCategory === "All" || p.category === activeCategory);

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">MAIDES Patient Resources</span>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">Medical Tourism<br />Guides & Insights</h1>
              <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                Expert guides on Kerala medical tourism, treatment cost comparisons, Ayurveda programmes, visa support, and patient stories from international patients.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
            {/* Category filter */}
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button key={c} onClick={() => setActiveCategory(c)} className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${activeCategory === c ? "bg-[#0E82FD] text-white shadow-md" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>{c}</button>
              ))}
            </div>

            {/* Featured post */}
            {activeCategory === "All" && (
              <div className="rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group cursor-pointer grid grid-cols-1 lg:grid-cols-2">
                <div className="h-64 lg:h-auto overflow-hidden">
                  <img src={POSTS[0].image} alt={POSTS[0].title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-8 flex flex-col justify-center space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-full bg-[#0E82FD] text-white text-[10px] font-bold">Featured</span>
                    <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#0E82FD] text-[10px] font-bold border border-blue-100">{POSTS[0].category}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-black text-[#0F2042] group-hover:text-[#0E82FD] transition-colors leading-snug">{POSTS[0].title}</h2>
                  <p className="text-xs text-slate-600 leading-relaxed">{POSTS[0].excerpt}</p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{POSTS[0].readTime}</span>
                    <span>{POSTS[0].date}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E82FD] hover:text-blue-700">
                    Read Article <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            )}

            {/* Post grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.slice(activeCategory === "All" ? 1 : 0).map((post) => (
                <div key={post.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all group cursor-pointer flex flex-col">
                  <div className="h-48 overflow-hidden">
                    <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <div className="p-5 flex flex-col space-y-3 flex-1">
                    <div className="flex items-center gap-1.5">
                      <Tag className="w-3 h-3 text-[#0E82FD]" />
                      <span className="text-[10px] font-bold text-[#0E82FD]">{post.category}</span>
                    </div>
                    <h3 className="text-sm font-black text-[#0F2042] group-hover:text-[#0E82FD] transition-colors leading-snug flex-1">{post.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />{post.readTime}
                      </div>
                      <span>{post.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter */}
            <div className="rounded-3xl bg-gradient-to-r from-[#0F2042] to-[#17468A] text-white p-8 sm:p-12 flex flex-col sm:flex-row gap-8 items-center">
              <div className="flex-1 space-y-2">
                <h2 className="text-xl sm:text-2xl font-black">Get Kerala Medical Tourism Updates</h2>
                <p className="text-sm text-blue-100">Hospital news, treatment cost updates, and patient guides delivered to your inbox monthly.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <input type="email" placeholder="your@email.com" className="flex-1 sm:w-64 px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-xs placeholder-blue-200 focus:outline-none focus:border-white" />
                <button className="px-4 py-3 rounded-xl bg-[#0E82FD] text-white text-xs font-bold hover:bg-blue-600 transition-all flex-shrink-0 flex items-center gap-1.5">
                  Subscribe <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
