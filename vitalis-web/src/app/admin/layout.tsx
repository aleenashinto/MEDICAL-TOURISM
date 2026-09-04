"use client";

import React from "react";
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
  Star
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

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
    <div className="min-h-screen bg-slate-900 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col justify-between hidden lg:flex shrink-0">
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
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-6 max-h-[calc(100vh-140px)] overflow-y-auto">
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
        <header className="bg-slate-950 border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Shield className="w-4 h-4 text-[#0E82FD]" />
              <span className="font-semibold text-slate-200">Full Platform Management Mode</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono">
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

        <main className="flex-1 overflow-y-auto p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
