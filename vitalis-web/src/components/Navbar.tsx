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
  Stethoscope, 
  MessageSquare,
  Search,
  Building2,
  Calculator,
  UserCheck,
  Calendar,
  Layers,
  LogOut,
  User
} from "lucide-react";

interface NavbarProps {
  onOpenIntake?: () => void;
  onOpenConcierge?: () => void;
  style?: "transparent" | "white";
}

export function Navbar({ onOpenIntake, onOpenConcierge, style = "transparent" }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentUser, setCurrentUser] = useState<any>(null);
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

    // Check logged in user state from localStorage
    const checkUser = () => {
      try {
        const stored = localStorage.getItem("vitalis_current_user") || localStorage.getItem("maides_user");
        if (stored) {
          setCurrentUser(JSON.parse(stored));
        } else {
          setCurrentUser(null);
        }
      } catch (e) {
        setCurrentUser(null);
      }
    };
    checkUser();
    window.addEventListener("storage", checkUser);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("storage", checkUser);
    };
  }, []);

  const [findCareOpen, setFindCareOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState("EN");

  const languages = [
    { code: "EN", name: "English", flag: "🇬🇧" },
    { code: "AR", name: "العربية (Arabic)", flag: "🇦🇪" },
    { code: "RU", name: "Русский (Russian)", flag: "🇷🇺" },
    { code: "FR", name: "Français (French)", flag: "🇫🇷" },
    { code: "DE", name: "Deutsch (German)", flag: "🇩🇪" },
  ];

  const findCareMenu = [
    { name: "Find a Doctor", icon: UserCheck, href: "/doctors", desc: "Top FRCS & Board-Certified Kerala Specialists" },
    { name: "Find a Hospital", icon: Building2, href: "/hospitals", desc: "JCI & NABH Accredited Quaternary Centers" },
    { name: "Explore Treatments", icon: Stethoscope, href: "/treatments", desc: "Robotic Surgery, Cardiology, Oncology & More" },
    { name: "Get Treatment Estimate", icon: Calculator, href: "#calculator", desc: "Transparent 3-Tier Procedure Cost Calculator" },
    { name: "Ayurveda & Panchakarma", icon: Sparkles, href: "/ayurveda", desc: "Authentic Ashtavaidya Vedic Rejuvenation" },
    { name: "Treatment Packages", icon: Layers, href: "/packages", desc: "All-Inclusive Surgery & Backwater Recovery" },
  ];

  // Task-oriented dynamic navigation depending on login status
  const navItems = currentUser ? [
    { name: "My Journey", href: "/portal" },
    { name: "Appointments", href: "/patient/appointments" },
    { name: "Medical Cases", href: "/patient/cases" },
    { name: "Messages", href: "/patient/messages" },
    { name: "Travel Desk", href: "/patient/travel" },
  ] : [
    { name: "Find Care", href: "/treatments", isFindCare: true },
    { name: "Hospitals", href: "/hospitals" },
    { name: "Doctors", href: "/doctors" },
    { name: "Packages", href: "/packages" },
    { name: "How It Works", href: "#journey" },
    { name: "Why Kerala", href: "#why-kerala" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("vitalis_current_user");
    localStorage.removeItem("maides_user");
    setCurrentUser(null);
    window.location.href = "/";
  };

  const isWhite = style === "white" || (style === "transparent" && scrolled);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isWhite 
          ? "bg-white/95 backdrop-blur-md shadow-[0_4px_25px_rgba(15,32,66,0.08)] border-b border-slate-100 py-3" 
          : "bg-gradient-to-b from-black/50 via-black/20 to-transparent py-4"
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

          {/* Smart Search Bar Pill */}
          <div className="hidden lg:flex items-center relative max-w-xs xl:max-w-sm w-full mx-4">
            <div className={`flex items-center w-full px-3.5 py-1.5 rounded-full border transition-all ${
              isWhite 
                ? "bg-slate-100/90 border-slate-200 text-slate-700 focus-within:bg-white focus-within:border-[#0E82FD] focus-within:shadow-md" 
                : "bg-white/10 backdrop-blur-md border-white/20 text-white placeholder-blue-200 focus-within:bg-white focus-within:text-slate-900"
            }`}>
              <Search className={`w-3.5 h-3.5 mr-2 shrink-0 ${isWhite ? "text-slate-400" : "text-blue-200"}`} />
              <input
                type="text"
                placeholder="Search Doctor, Hospital, or Treatment..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchQuery.trim()) {
                    window.location.href = `/treatments?q=${encodeURIComponent(searchQuery.trim())}`;
                  }
                }}
                className="w-full bg-transparent text-xs font-medium focus:outline-none placeholder:text-[11px]"
              />
            </div>
          </div>

          {/* Nav Pills Center - Task-Oriented Find Care Capsule */}
          <nav className={`hidden xl:flex items-center space-x-1 px-3 py-1.5 rounded-full transition-all duration-300 relative ${
            isWhite 
              ? "bg-slate-100/90 border border-slate-200/80 shadow-inner" 
              : "bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
          }`}>
            {navItems.map((item: any) => {
              const isActive = pathname === item.href;
              if (item.isFindCare) {
                return (
                  <div 
                    key={item.name}
                    className="relative"
                    onMouseEnter={() => setFindCareOpen(true)}
                    onMouseLeave={() => setFindCareOpen(false)}
                  >
                    <button
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 flex items-center space-x-1 cursor-pointer ${
                        isActive || findCareOpen
                          ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/30"
                          : isWhite
                          ? "text-slate-700 hover:text-[#0E82FD] hover:bg-white"
                          : "text-white/90 hover:text-white hover:bg-white/15"
                      }`}
                    >
                      <span>Find Care</span>
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${findCareOpen ? "rotate-180" : ""}`} />
                    </button>

                    {/* Find Care Mega Menu Panel */}
                    {findCareOpen && (
                      <div className="absolute top-full left-0 pt-3 w-[520px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-4 rounded-3xl bg-white shadow-2xl border border-slate-100 text-slate-800">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 px-2">
                            <div>
                              <span className="text-xs font-black text-[#0F2042] uppercase tracking-wider">Find Healthcare in Kerala</span>
                              <p className="text-[11px] text-slate-500">Explore accredited doctors, quaternary hospitals & packages</p>
                            </div>
                            <Link 
                              href="/treatments" 
                              className="text-xs font-bold text-[#0E82FD] hover:underline flex items-center space-x-1"
                            >
                              <span>Browse All</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            {findCareMenu.map((menuItem, idx) => {
                              const IconComponent = menuItem.icon;
                              return (
                                <Link
                                  key={idx}
                                  href={menuItem.href}
                                  onClick={() => setFindCareOpen(false)}
                                  className="p-2.5 rounded-2xl hover:bg-blue-50/70 border border-transparent hover:border-blue-100 transition-all flex items-start space-x-2.5 group/item"
                                >
                                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0E82FD] flex items-center justify-center shrink-0 group-hover/item:bg-[#0E82FD] group-hover/item:text-white transition-colors">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="min-w-0 text-left">
                                    <div className="text-xs font-bold text-[#0F2042] group-hover/item:text-[#0E82FD] transition-colors truncate">
                                      {menuItem.name}
                                    </div>
                                    <div className="text-[10px] text-slate-500 line-clamp-1">
                                      {menuItem.desc}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 bg-slate-50 rounded-2xl p-2.5 flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-[11px] text-slate-600 font-medium">
                              <Sparkles className="w-4 h-4 text-emerald-500" />
                              <span>Free Second Opinion from Chief Specialists</span>
                            </div>
                            <button
                              onClick={() => {
                                setFindCareOpen(false);
                                if (onOpenIntake) onOpenIntake();
                              }}
                              className="px-3 py-1 rounded-full bg-[#0E82FD] text-white text-[11px] font-bold shadow-sm hover:bg-blue-600 transition-all cursor-pointer"
                            >
                              Get Matched
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

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
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  isWhite 
                    ? "bg-slate-100 hover:bg-slate-200 text-slate-700" 
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/20"
                }`}
                aria-label="Select Language"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>{selectedLang}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl bg-white shadow-2xl border border-slate-100 py-1.5 z-50 text-slate-700 animate-in fade-in slide-in-from-top-2 duration-150">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => {
                        setSelectedLang(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center space-x-2.5 hover:bg-blue-50 hover:text-[#0E82FD] transition-colors cursor-pointer ${
                        selectedLang === l.code ? "bg-blue-50/80 text-[#0E82FD] font-bold" : ""
                      }`}
                    >
                      <span className="text-sm">{l.flag}</span>
                      <span>{l.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Profile or Patient Portal Link */}
            {currentUser ? (
              <div className="flex items-center space-x-2">
                <Link
                  href="/portal"
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-xs font-bold text-[#0E82FD]"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>{currentUser.name ? currentUser.name.split(" ")[0] : "My Portal"}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-full hover:bg-slate-100 text-slate-500 hover:text-red-500 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <Link
                href="/auth/login"
                className={`px-3.5 py-2 rounded-full text-xs font-bold transition-colors ${
                  isWhite ? "text-slate-700 hover:text-[#0E82FD]" : "text-white/90 hover:text-white"
                }`}
              >
                Patient Portal
              </Link>
            )}

            {/* Primary Action Button */}
            <button
              onClick={onOpenIntake}
              className="flex items-center pl-4 sm:pl-5 pr-1.5 py-1.5 rounded-full bg-gradient-to-r from-[#0E82FD] to-[#0284C7] hover:from-[#0360D9] hover:to-[#0E82FD] text-white text-xs font-black shadow-[0_8px_20px_rgba(14,130,253,0.35)] hover:shadow-[0_10px_25px_rgba(14,130,253,0.5)] hover:scale-[1.02] transition-all duration-300 group cursor-pointer"
            >
              <span className="mr-2.5 sm:mr-3">Start Medical Journey</span>
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#0E82FD] flex items-center justify-center transition-transform duration-300 group-hover:rotate-45 shadow-sm">
                <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
              </div>
            </button>
          </div>

          {/* Mobile Actions & Hamburger */}
          <div className="flex xl:hidden items-center space-x-2 shrink-0">
            <Link
              href="/auth/login"
              className="px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full bg-[#0E82FD] text-white text-[11px] font-bold shadow-md shadow-blue-500/30 active:scale-95 transition-all"
            >
              Portal
            </Link>
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

        {/* Mobile Dropdown Menu with Backdrop */}
        {mobileMenuOpen && (
          <>
            <div 
              className="fixed inset-0 bg-black/50 backdrop-blur-xs z-30 xl:hidden top-[60px]"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="xl:hidden relative z-40 mt-3 p-4 sm:p-5 rounded-3xl bg-[#0F2042]/98 backdrop-blur-2xl border border-white/15 shadow-2xl text-white space-y-3 animate-in fade-in slide-in-from-top-4 duration-300">
              <div className="grid grid-cols-2 gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
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
