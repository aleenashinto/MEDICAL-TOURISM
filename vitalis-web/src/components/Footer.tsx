"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowUpRight, 
  MapPin, 
  Mail, 
  Headphones, 
  ArrowUp, 
  ChevronRight,
  Send,
  ShieldCheck,
  Phone
} from "lucide-react";

export function Footer() {
  const [emailInput, setEmailInput] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput) return;

    if (typeof window !== "undefined") {
      const existing = localStorage.getItem("maides_admin_subscribers");
      let list = [];
      if (existing) {
        try { list = JSON.parse(existing); } catch(err){}
      }
      const newSub = {
        email: emailInput.trim(),
        subscribedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        source: "Public Landing Page Footer",
        status: "ACTIVE"
      };
      localStorage.setItem("maides_admin_subscribers", JSON.stringify([newSub, ...list]));
    }

    setSubscribed(true);
    setTimeout(() => setSubscribed(false), 3000);
    setEmailInput("");
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full">
      
      {/* 1. TOP BRIGHT ROYAL BLUE SECTION */}
      <div className="bg-[#0E82FD] text-white pt-16 pb-14 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-16">
          
          {/* 4-Column Grid: Newsletter, Categories, Useful links, Opening Hour */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10">
            
            {/* Column 1: Newsletter (4 Cols) */}
            <div className="lg:col-span-4 space-y-5">
              <div>
                <h3 className="text-2xl font-black tracking-tight text-white">Newsletter</h3>
                <div className="w-10 h-1 bg-white mt-2 rounded-full" />
              </div>

              <form onSubmit={handleSubscribe} className="flex items-center space-x-2">
                <div className="relative flex-1">
                  <input 
                    type="email" 
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email..."
                    className="w-full bg-white text-slate-800 placeholder-slate-400 rounded-2xl px-5 py-4 text-xs focus:outline-none shadow-md font-medium"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-14 h-14 rounded-2xl bg-[#0F2042] hover:bg-slate-900 text-white flex items-center justify-center transition-transform hover:scale-105 shadow-md shrink-0"
                >
                  <ArrowUpRight className="w-5 h-5 text-white" />
                </button>
              </form>

              {subscribed && (
                <div className="text-xs font-bold text-emerald-200">
                  ✓ Thank you for subscribing!
                </div>
              )}

              <p className="text-xs text-blue-100 font-medium">
                Stay Tuned and Subscribe to Our Kerala Medical Travel Newsletter
              </p>
            </div>

            {/* Column 2: Categories (3 Cols) */}
            <div className="lg:col-span-3 space-y-4 lg:pl-6">
              <h3 className="text-xl font-bold text-white">Specialties</h3>
              
              <ul className="space-y-3 text-xs font-medium text-blue-50">
                {[
                  { name: "Cardiology & Bypass", href: "/treatments" },
                  { name: "Robotic Orthopedics", href: "/treatments" },
                  { name: "Oncology & Radiation", href: "/treatments" },
                  { name: "Classical Ayurveda", href: "/ayurveda" },
                  { name: "Neurology & Spine", href: "/treatments" },
                  { name: "Organ Transplants", href: "/treatments" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="flex items-center space-x-1.5 hover:text-white transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3: Useful links (3 Cols) */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-xl font-bold text-white">Quick Links</h3>
              
              <ul className="space-y-3 text-xs font-medium text-blue-50">
                {[
                  { name: "About MAIDES", href: "/about" },
                  { name: "International Patients", href: "/international-patients" },
                  { name: "Hospitals Directory", href: "/hospitals" },
                  { name: "Specialist Doctors", href: "/doctors" },
                  { name: "Medical Packages", href: "/packages" },
                  { name: "Medical Enquiry", href: "/medical-enquiry" },
                  { name: "Blog & Guides", href: "/blog" },
                  { name: "FAQ", href: "/faq" },
                  { name: "Contact Us", href: "/contact" },
                ].map((item, idx) => (
                  <li key={idx}>
                    <Link href={item.href} className="flex items-center space-x-1.5 hover:text-white transition-colors">
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 4: Opening Hour (2 Cols) */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold text-white">Support Hours</h3>
              
              <div className="space-y-2.5 text-xs font-medium text-blue-50">
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <span>Mon – Fri:</span>
                  <span className="font-bold">24 / 7 Care</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <span>Saturday:</span>
                  <span className="font-bold">24 / 7 Care</span>
                </div>
                <div className="flex justify-between border-b border-white/20 pb-1.5">
                  <span>Sunday:</span>
                  <span className="font-bold">24 / 7 Care</span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-blue-100">
                Kerala Concierge desk available round-the-clock for international arrivals.
              </div>
            </div>

          </div>

          {/* Contact Details Strip (3 Columns with dividers) */}
          <div className="pt-10 border-t border-white/20 grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Office Address */}
            <div className="flex items-center space-x-4 md:border-r border-white/20 pr-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <MapPin className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold block">Office Address</span>
                <p className="text-sm font-bold text-white">Infopark Phase II, Kochi, Kerala, India</p>
              </div>
            </div>

            {/* Email Address */}
            <div className="flex items-center space-x-4 md:border-r border-white/20 pr-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <Mail className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold block">Email Address</span>
                <p className="text-sm font-bold text-white">care@maides.com</p>
              </div>
            </div>

            {/* For Support */}
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-white shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[11px] uppercase tracking-wider text-blue-200 font-bold block">24/7 International Desk</span>
                <p className="text-sm font-bold text-white">+91 (484) 290-8482 / WhatsApp</p>
              </div>
            </div>

          </div>

          {/* Medical Disclaimer Note (Section 4 & 65) */}
          <div className="p-4 rounded-2xl bg-white/10 text-xs text-blue-100 leading-relaxed border border-white/15">
            <strong className="text-white block mb-1">⚖️ Medical Disclaimer:</strong>
            MAIDES functions exclusively as a Medical Tourism Coordination & Patient Assistance Platform connecting patients with accredited hospitals in Kerala. MAIDES does not independently diagnose patients, provide prescriptions, or guarantee medical treatment outcomes. Clinical decisions remain solely with qualified healthcare professionals.
          </div>

        </div>
      </div>

      {/* 2. FLOATING BOTTOM WHITE CARD */}
      <div className="bg-[#0E82FD] px-4 sm:px-6 lg:px-8 pb-10 pt-2">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
            
            {/* Left: MAIDES Brand + Social Buttons */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-8">
              {/* MAIDES Wordmark */}
              <Link href="/" className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#0E82FD] flex items-center justify-center text-white font-black text-sm shadow-md">
                  +
                </div>
                <span className="text-2xl font-black text-[#0F2042] tracking-tight">MAIDES</span>
              </Link>

              {/* Social Pills */}
              <div className="flex items-center space-x-2">
                {["Facebook", "Instagram", "(x)Twitter", "LinkedIn"].map((platform) => (
                  <a
                    key={platform}
                    href={`https://${platform.toLowerCase().replace(/[^a-z]/g, '')}.com`}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3.5 py-1.5 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-[11px] transition-colors shadow-sm"
                  >
                    {platform}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Copyright, Legal Links, Scroll to Top */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 text-xs text-slate-500 font-medium">
              <div className="text-center sm:text-right space-y-1">
                <p className="text-slate-700 font-bold">© 2026 MAIDES. All Rights Reserved.</p>
                <div className="space-x-2 text-[11px] text-slate-500">
                  <Link href="/privacy-policy" className="hover:text-[#0E82FD]">Privacy Policy</Link>
                  <span>/</span>
                  <Link href="/medical-disclaimer" className="hover:text-[#0E82FD]">Medical Disclaimer</Link>
                  <span>/</span>
                  <Link href="/faq" className="hover:text-[#0E82FD]">FAQ</Link>
                  <span>/</span>
                  <Link href="/contact" className="hover:text-[#0E82FD]">Contact</Link>
                </div>
              </div>

              {/* Scroll to Top Circular Button */}
              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="w-12 h-12 rounded-full bg-[#0F2042] hover:bg-slate-900 text-white flex items-center justify-center transition-transform hover:-translate-y-1 shadow-lg shrink-0"
              >
                <ArrowUp className="w-5 h-5 text-white" />
              </button>
            </div>

          </div>
        </div>
      </div>

    </footer>
  );
}
