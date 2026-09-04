"use client";

import React, { useState } from "react";
import Link from "next/link";
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
  Menu,
  X
} from "lucide-react";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Mobile Top Navigation Bar */}
      <div className="md:hidden bg-[#0F2042] text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 shadow-sm">
        <Link href="/patient/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-bold shadow-md text-sm">
            M
          </div>
          <div>
            <div className="font-bold text-sm leading-none tracking-tight">MAIDES</div>
            <div className="text-[10px] text-blue-300 font-medium">Patient Portal</div>
          </div>
        </Link>
        <button
          onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
          className="p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 border border-white/10"
          aria-label="Toggle navigation menu"
        >
          {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-72 md:w-64 bg-[#0F2042] text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out md:translate-x-0 shrink-0 ${
          mobileDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          <div className="p-6 border-b border-slate-700/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-bold shadow-md">
                M
              </div>
              <div>
                <div className="font-bold text-lg leading-none tracking-tight">MAIDES</div>
                <div className="text-[11px] text-blue-300 font-medium mt-1">Patient Portal</div>
              </div>
            </div>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-slate-300 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="p-4 space-y-1 max-h-[calc(100vh-140px)] overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || (item.href !== "/patient/dashboard" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileDrawerOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#0E82FD] text-white shadow-sm font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-blue-400"}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-700/60">
          <Link
            href="/auth/login"
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="hidden sm:flex bg-white border-b border-slate-200 px-6 py-4 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse"></span>
              Patient Journey Active
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
            >
              Public Website
            </Link>
            <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shadow-sm">
              PT
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
