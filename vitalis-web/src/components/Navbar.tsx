"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, 
  X, 
  ArrowUpRight,
  HeartPulse, 
  Sparkles, 
  Phone, 
  MessageSquare
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

  // Requested navbar menu: Hospitals, Doctors, Specialities, Contact Us
  const navItems = [
    { name: "Hospitals", href: "/hospitals" },
    { name: "Doctors", href: "/doctors" },
    { name: "Specialities", href: "/treatments" },
    { name: "Contact Us", href: "/contact" },
  ];

  const isWhite = style === "white" || (style === "transparent" && scrolled);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isWhite 
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_25px_rgba(15,32,66,0.08)] border-b border-slate-100 py-3.5" 
          : "bg-gradient-to-b from-black/50 via-black/20 to-transparent py-4.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center space-x-2.5 sm:space-x-3 group shrink-0">
            <div className="relative flex items-center justify-center">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all duration-300">
                <HeartPulse className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-white" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center">
                <span className="w-1 h-1 rounded-full bg-white animate-ping" />
              </div>
            </div>
            
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className={`text-xl sm:text-2xl font-black tracking-tight transition-colors ${
                  isWhite ? "text-[#0F2042]" : "text-white"
                }`}>
                  MAIDES
                </span>
              </div>
              <span className={`text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase ${
                isWhite ? "text-slate-500" : "text-blue-100/80"
              }`}>
                Medical Travel Assistance
              </span>
            </div>
          </Link>

          {/* Nav Pills Center - Clean Capsule with requested 4 menus */}
          <nav className={`hidden md:flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-300 ${
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 relative ${
                    isActive
                      ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30 scale-105"
                      : isWhite
                      ? "text-slate-700 hover:text-[#0E82FD] hover:bg-white"
                      : "text-white/90 hover:text-white hover:bg-white/15"
                  }`}
                >
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Section */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onOpenIntake}
              className="flex items-center pl-4 sm:pl-5 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-[#0E82FD] to-[#0284C7] hover:from-[#0360D9] hover:to-[#0E82FD] text-white text-xs font-black shadow-[0_8px_20px_rgba(14,130,253,0.35)] hover:shadow-[0_10px_25px_rgba(14,130,253,0.5)] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            >
              <span className="mr-2.5 sm:mr-3">Get Assistance</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#0E82FD] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shadow-sm">
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex md:hidden items-center space-x-2 shrink-0">
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
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 md:hidden top-[60px]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="md:hidden relative z-40 mt-3 p-4 sm:p-5 rounded-3xl bg-[#0F2042]/98 backdrop-blur-2xl border border-white/15 shadow-2xl text-white space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3.5 py-3 rounded-xl text-xs font-bold transition-all text-center ${
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

              <div className="pt-3 border-t border-white/10 flex flex-col space-y-2.5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenIntake) onOpenIntake();
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#0E82FD] to-[#38BDF8] text-white text-xs font-black text-center shadow-lg shadow-blue-500/40 active:scale-98 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Get Medical Assistance</span>
                </button>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <a
                    href="https://wa.me"
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 rounded-xl bg-emerald-600/90 text-white font-bold flex items-center justify-center space-x-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>WhatsApp</span>
                  </a>
                  <a
                    href="tel:+914842908482"
                    className="py-2.5 rounded-xl bg-white/10 text-white font-bold flex items-center justify-center space-x-1.5"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call 24/7 Desk</span>
                  </a>
                </div>
              </div>
            </div>
          </>
        )}

      </div>
    </header>
  );
}
