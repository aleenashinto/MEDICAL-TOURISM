"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ArrowUpRight,
  HeartPulse,
  ChevronDown,
  Sparkles,
  Phone,
  ShieldCheck,
  Globe2,
  Stethoscope
} from "lucide-react";

interface NavbarProps {
  onOpenIntake?: () => void;
  onOpenConcierge?: () => void;
  style?: "transparent" | "white";
}

export function Navbar({ onOpenIntake, onOpenConcierge, style = "transparent" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Our Hospitals", href: "/hospitals" },
    { name: "Services", href: "/treatments" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isWhite = style === "white" || (style === "transparent" && scrolled);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isWhite 
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_25px_rgba(15,32,66,0.08)] border-b border-slate-100 py-3.5" 
          : "bg-gradient-to-b from-black/40 via-black/10 to-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all duration-300">
                <HeartPulse className="w-5 h-5 animate-pulse text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className={`text-2xl font-black tracking-tight transition-colors ${
                  isWhite ? "text-[#0F2042]" : "text-white"
                }`}>
                  MAIDES
                </span>
              </div>
              <span className={`text-[9px] font-semibold tracking-wider uppercase ${
                isWhite ? "text-slate-500" : "text-blue-100/80"
              }`}>
                Medical Travel Assistance
              </span>
            </div>
          </Link>

          {/* Nav Pills Center - Sleek Glass Capsule */}
          <nav className={`hidden xl:flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
            isWhite 
              ? "bg-slate-100/90 border border-slate-200/80 shadow-inner" 
              : "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
          }`}>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 relative ${
                    isActive
                      ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30 scale-105"
                      : isWhite
                      ? "text-slate-600 hover:text-[#0E82FD] hover:bg-white"
                      : "text-white/90 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="hidden lg:flex items-center space-x-3">
            {/* Primary Action Button */}
            <button
              onClick={onOpenIntake}
              className="flex items-center pl-5 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-[#0E82FD] to-[#0284C7] hover:from-[#0360D9] hover:to-[#0E82FD] text-white text-xs font-black shadow-[0_8px_20px_rgba(14,130,253,0.35)] hover:shadow-[0_10px_25px_rgba(14,130,253,0.5)] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            >
              <span className="mr-3">Get Medical Assistance</span>
              <div className="w-8 h-8 rounded-full bg-white text-[#0E82FD] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shadow-sm">
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex xl:hidden items-center space-x-2">
            <button
              onClick={onOpenIntake}
              className="px-3.5 py-2 rounded-full bg-[#0E82FD] text-white text-[11px] font-bold shadow-md shadow-blue-500/30"
            >
              Assistance
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 rounded-xl transition-all ${
                isWhite 
                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200" 
                  : "bg-white/10 backdrop-blur-md text-white border border-white/20 hover:bg-white/20"
              }`}
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden mt-3 p-5 rounded-3xl bg-[#0F2042]/98 backdrop-blur-2xl border border-white/15 shadow-2xl text-white space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="grid grid-cols-2 gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      isActive 
                        ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30" 
                        : "text-slate-200 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex flex-col space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenIntake) onOpenIntake();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#0E82FD] to-[#38BDF8] text-white text-xs font-black text-center shadow-lg shadow-blue-500/40"
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
