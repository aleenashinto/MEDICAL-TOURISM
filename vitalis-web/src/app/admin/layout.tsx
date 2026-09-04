"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Users,
  HeartPulse,
  Building2,
  Stethoscope,
  Activity,
  Calendar,
  Plane,
  CreditCard,
  MessageSquare,
  LifeBuoy,
  FileCheck2,
  FileText,
  ShieldAlert,
  Settings,
  LogOut,
  ExternalLink,
  Shield,
  Star,
  Menu,
  X
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  const navGroups = [
    {
      title: "Core Operations",
      items: [
        { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Enquiries & Leads", href: "/admin/enquiries", icon: Inbox, badge: "3 New" },
        { name: "Patient Cases", href: "/admin/cases", icon: HeartPulse },
        { name: "Patients Directory", href: "/admin/patients", icon: Users },
      ],
    },
    {
      title: "Clinical Network",
      items: [
        { name: "Hospitals", href: "/admin/hospitals", icon: Building2 },
        { name: "Doctors", href: "/admin/doctors", icon: Stethoscope },
        { name: "Treatments", href: "/admin/treatments", icon: Activity },
        { name: "Appointments", href: "/admin/appointments", icon: Calendar },
      ],
    },
    {
      title: "Logistics & Finance",
      items: [
        { name: "Travel & Visas", href: "/admin/travel", icon: Plane },
        { name: "Billing & Invoices", href: "/admin/payments", icon: CreditCard },
      ],
    },
    {
      title: "Engagement & Content",
      items: [
        { name: "Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
        { name: "Patient Feedback", href: "/admin/feedback", icon: Star },
        { name: "CMS & Knowledge", href: "/admin/cms", icon: FileText },
      ],
    },
    {
      title: "Governance",
      items: [
        { name: "Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
        { name: "Platform Settings", href: "/admin/settings", icon: Settings },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col lg:flex-row">
      {/* Mobile Top App Bar */}
      <div className="lg:hidden bg-slate-950 border-b border-slate-800 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-sm shadow-md shadow-blue-500/20">
            M
          </div>
          <div className="flex items-center gap-1.5 font-bold text-sm text-white">
            <span>MAIDES</span>
            <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#0E82FD] border border-blue-500/30">
              Admin
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800"
            aria-label="Toggle navigation menu"
          >
            {mobileDrawerOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Backdrop for Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileDrawerOpen(false)}
        />
      )}

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 shrink-0 ${
          mobileDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                M
              </div>
              <div>
                <div className="font-bold text-base leading-none tracking-tight text-white flex items-center gap-1.5">
                  MAIDES
                  <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#0E82FD] border border-blue-500/30">
                    Admin
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium mt-1">Platform Operations</div>
              </div>
            </Link>
            {/* Close button on mobile drawer */}
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-5 max-h-[calc(100vh-140px)] overflow-y-auto">
            {navGroups.map((group) => (
              <div key={group.title}>
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {group.title}
                </div>
                <div className="space-y-0.5">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href));
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#0E82FD] text-white shadow-sm"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* User Session Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">System Admin</div>
                <div className="text-[10px] text-slate-500">Super Administrator</div>
              </div>
            </div>
            <Link
              href="/auth/login"
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden">
        {/* Top Navbar */}
        <header className="hidden sm:flex bg-slate-950 border-b border-slate-800 px-6 py-3.5 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-[#0E82FD]" />
              <span className="font-semibold text-slate-200">Full Platform Management Mode</span>
              <span className="hidden md:inline-block px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
                System Healthy • 66/66 API Nodes Active
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
