"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LiveSupportChatWidget } from "@/components/LiveSupportChatWidget";
import { usePathname } from "next/navigation";
import { 
  HeartPulse, 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Plane, 
  CreditCard, 
  MessageSquare, 
  LifeBuoy, 
  Star, 
  Settings, 
  User, 
  LogOut,
  Search,
  Menu,
  X,
  ChevronRight,
  MapPin
} from "lucide-react";

/** Keys to purge on sign-out so no session data lingers */
const SESSION_KEYS = [
  "maides_user_role",
  "maides_user_email",
  "maides_user_name",
  "maides_user_location",
  "maides_user_phone",
  "maides_user_photo",
  "maides_remember_device",
  "maides_device_expiry",
];

function clearSession() {
  if (typeof window !== "undefined") {
    SESSION_KEYS.forEach((k) => localStorage.removeItem(k));
  }
}

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [user, setUser] = useState({
    name: "",
    email: "",
    location: "",
    initials: "",
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const role = localStorage.getItem("maides_user_role");

    // PP-043: Admin must go to admin panel
    if (role === "ADMIN") {
      router.replace("/admin/dashboard");
      return;
    }

    // PP-042: Unauthenticated users must login
    if (role !== "PATIENT") {
      router.replace("/auth/login");
      return;
    }

    // PP-040/091: Check session expiry
    const expiry = localStorage.getItem("maides_device_expiry");
    if (expiry && new Date(expiry) < new Date()) {
      clearSession();
      router.replace("/auth/login");
      return;
    }

    // Authorized — load user info
    const storedName = localStorage.getItem("maides_user_name") || "";
    const storedEmail = localStorage.getItem("maides_user_email") || "";
    const storedLocation = localStorage.getItem("maides_user_location") || "";

    const name = storedName || "Patient";
    const parts = name.trim().split(" ");
    const initials =
      parts.length > 1
        ? `${parts[0][0]}${parts[1][0]}`.toUpperCase()
        : name.slice(0, 2).toUpperCase();

    setUser({
      name,
      email: storedEmail,
      location: storedLocation,
      initials: initials || "PT",
    });
    setIsAuthorized(true);
    setIsLoaded(true);
  }, [router]);

  const navItems = [
    { name: "Dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
    { name: "My Cases", href: "/patient/cases", icon: HeartPulse },
    { name: "Medical Records", href: "/patient/documents", icon: FileText },
    { name: "Appointments", href: "/patient/appointments", icon: Calendar },
    { name: "Travel & Itinerary", href: "/patient/travel", icon: Plane },
    { name: "Billing & Payments", href: "/patient/payments", icon: CreditCard },
    { name: "Messages", href: "/patient/messages", icon: MessageSquare },
    { name: "Support Tickets", href: "/patient/support", icon: LifeBuoy },
    { name: "Treatment Feedback", href: "/patient/feedback", icon: Star },
    { name: "My Profile", href: "/patient/profile", icon: User },
    { name: "Settings", href: "/patient/settings", icon: Settings },
  ];

  // PP-042/043: Don't render portal UI until authorization is confirmed
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-xl animate-pulse shadow-lg">
            M
          </div>
          <span className="text-slate-400 text-sm font-medium">Verifying session…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#0F2042] text-white px-4 py-3.5 flex items-center justify-between sticky top-0 z-40 shadow-md">
        <Link href="/patient/dashboard" className="flex items-center gap-2.5" aria-label="MAIDES Patient Portal home">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black shadow-md text-sm">
            M
          </div>
          <div>
            <div className="font-bold text-sm leading-none tracking-tight">MAIDES</div>
            <div className="text-[10px] text-blue-300 font-medium mt-0.5">Patient Portal</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => { clearSession(); router.push("/"); }}
            title="Sign Out"
            aria-label="Sign out of patient portal"
            className="p-2 rounded-xl bg-white/10 text-rose-300 hover:bg-white/20 border border-white/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10 cursor-pointer"
            aria-label={mobileDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileDrawerOpen}
            aria-controls="patient-sidebar"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        id="patient-sidebar"
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-[#0F2042] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 shrink-0 ${
          mobileDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
        aria-label="Patient portal sidebar navigation"
      >
        <div className="flex flex-col h-full">
          {/* Header Brand */}
          <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
            <Link href="/patient/dashboard" className="flex items-center gap-2.5" aria-label="Go to dashboard">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black shadow-md text-sm">
                M
              </div>
              <div>
                <div className="font-bold text-sm leading-none tracking-tight">MAIDES</div>
                <div className="text-[10px] text-blue-300 font-medium mt-0.5">Patient Portal</div>
              </div>
            </Link>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white cursor-pointer"
              aria-label="Close navigation menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Card */}
          <div className="px-3.5 py-2.5 mx-3 mt-3 bg-white/5 border border-white/10 rounded-xl flex items-center gap-2.5">
            {/* Loading skeleton or real user */}
            {!isLoaded ? (
              <div className="flex items-center gap-2.5 w-full animate-pulse">
                <div className="w-8 h-8 rounded-lg bg-slate-700 shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <div className="h-2.5 bg-slate-700 rounded w-3/4" />
                  <div className="h-2 bg-slate-700 rounded w-1/2" />
                </div>
              </div>
            ) : (
              <>
                <div
                  className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] text-white font-bold flex items-center justify-center text-xs shadow-sm shrink-0"
                  aria-hidden="true"
                >
                  {user.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">{user.name}</div>
                  <div className="text-[10px] text-blue-200 truncate">{user.email}</div>
                  {user.location && (
                    <div className="text-[9px] text-slate-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-blue-400" aria-hidden="true" />
                      <span className="truncate">{user.location}</span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Scrollable Navigation */}
          <nav className="p-3 space-y-1 flex-1 overflow-y-auto mt-2" role="navigation" aria-label="Patient portal main navigation">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/patient/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-[#0E82FD] text-white shadow-sm font-bold"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-400"}`} aria-hidden="true" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-blue-200" aria-hidden="true" />}
                </Link>
              );
            })}

            {/* Sign Out */}
            <div className="pt-2 border-t border-slate-700/60 mt-2">
              <button
                onClick={() => {
                  clearSession();
                  setMobileDrawerOpen(false);
                  router.push("/");
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-rose-300 hover:text-white bg-rose-500/15 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-500 transition-all shadow-xs group cursor-pointer"
                aria-label="Sign out"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" aria-hidden="true" />
                  <span>Sign Out</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-200 group-hover:bg-white/20 group-hover:text-white">
                  Exit
                </span>
              </button>
            </div>
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-700/60 text-center">
          <span className="text-[10px] text-slate-400 font-medium">MAIDES Kerala Healthcare Gateway</span>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
        {/* Topbar */}
        <header className="hidden sm:flex bg-white border-b border-slate-200 px-6 py-3 items-center justify-between sticky top-0 z-30 shadow-xs" role="banner">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400" aria-hidden="true">
                <Search className="w-4 h-4" />
              </div>
              <label htmlFor="portal-search" className="sr-only">Search portal</label>
              <input
                id="portal-search"
                type="search"
                placeholder="Search appointments, doctors, cases, documents..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
                aria-label="Search the patient portal"
              />
            </div>
          </div>

          {/* Sign Out Button */}
          <div className="flex items-center ml-4">
            <button
              onClick={() => { clearSession(); router.push("/"); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white border border-rose-200 hover:border-rose-600 text-xs font-bold transition-all shadow-xs group cursor-pointer"
              aria-label="Sign out of patient portal"
            >
              <LogOut className="w-4 h-4 text-rose-500 group-hover:text-white transition-colors" aria-hidden="true" />
              <span>Sign Out</span>
            </button>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto" id="main-content">
          {children}
        </main>
        <LiveSupportChatWidget userRole="patient" />
      </div>
    </div>
  );
}

