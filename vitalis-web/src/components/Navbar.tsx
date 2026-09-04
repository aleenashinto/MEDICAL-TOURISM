"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Menu, 
  X, 
  ArrowUpRight,
  HeartPulse,
  ChevronDown
} from "lucide-react";

interface NavbarProps {
  onOpenIntake?: () => void;
  onOpenConcierge?: () => void;
  style?: "transparent" | "white";
}

export function Navbar({ onOpenIntake, onOpenConcierge, style = "transparent" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>("Home");

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Treatments", href: "/treatments" },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Doctors", href: "/doctors" },
    { name: "International", href: "/international-patients" },
    { name: "Ayurveda", href: "/ayurveda" },
    { name: "Blog", href: "/blog" },
    { name: "14 Districts", href: "/destinations" },
  ];

  return (
    <header className={`${style === "white" ? "sticky top-0 bg-white border-b border-slate-200 shadow-sm" : "absolute top-0 left-0 right-0 bg-transparent"} z-50 w-full`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2.5 group">
            <div className="flex items-center">
              <div className="relative flex items-center justify-center w-8 h-8 mr-1">
                <div className="w-8 h-8 rounded-lg bg-[#0E82FD] flex items-center justify-center text-white shadow-lg">
                  <span className="text-xl font-black">+</span>
                </div>
              </div>
              <span className={`text-2xl font-black tracking-tight ${style === "white" ? "text-[#0F2042]" : "text-white"}`}>MAIDES</span>
              <span className={`text-[10px] font-bold uppercase tracking-widest ml-2 px-1.5 py-0.5 rounded ${style === "white" ? "text-[#0E82FD] bg-blue-50" : "text-blue-200 bg-white/10"}`}>KERALA</span>
            </div>
          </Link>

          {/* Nav Pills Center */}
          <nav className={`hidden lg:flex items-center space-x-1 px-2 py-1.5 rounded-full border ${style === "white" ? "bg-slate-50 border-slate-200" : "bg-black/25 backdrop-blur-md border-white/15"}`}>
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setActiveMenu(item.name)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  activeMenu === item.name
                    ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30"
                    : style === "white"
                    ? "text-slate-600 hover:text-[#0E82FD] hover:bg-blue-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right Action Button - GET MEDICAL ASSISTANCE */}
          <div className="hidden lg:flex items-center space-x-2">
            <button
              onClick={onOpenIntake}
              className="flex items-center space-x-2 group"
            >
              <div className="px-5 py-2.5 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/25">
                Get Medical Assistance
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0E82FD] group-hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 group-hover:rotate-45">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={onOpenIntake}
              className="px-3.5 py-1.5 rounded-full bg-[#0E82FD] text-white text-xs font-bold"
            >
              Get Assistance
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white/10 backdrop-blur-md text-white border border-white/20"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 p-4 rounded-3xl bg-[#0F2042]/95 backdrop-blur-xl border border-white/20 shadow-2xl text-white space-y-2 animate-in fade-in slide-in-from-top-4">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  setActiveMenu(item.name);
                  setMobileMenuOpen(false);
                }}
                className={`block px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors ${
                  activeMenu === item.name ? "bg-[#0E82FD] text-white" : "hover:bg-white/10"
                }`}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-2 border-t border-white/10">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenIntake) onOpenIntake();
                }}
                className="w-full py-3 rounded-2xl bg-[#0E82FD] text-white text-xs font-bold text-center shadow-lg shadow-blue-500/30"
              >
                Get Medical Assistance
              </button>
            </div>
          </div>
        )}

      </div>
    </header>
  );
}
