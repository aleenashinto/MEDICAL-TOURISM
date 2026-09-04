"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { LiveSupportChatWidget } from "@/components/LiveSupportChatWidget";
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
  X,
  User,
  ChevronDown,
  ChevronRight,
  Search,
  Sparkles,
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  PieChart,
  Layers
} from "lucide-react";

interface SubMenuItem {
  name: string;
  href: string;
}

interface MenuItem {
  name: string;
  href?: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  submenus?: SubMenuItem[];
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<{ [key: string]: boolean }>({
    "Reports & Analytics": true,
    "Clinical Catalog": true,
    "Patient Operations": false,
    "Logistics & Invoicing": false
  });

  const toggleSubmenu = (name: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  const navGroups: MenuGroup[] = [
    {
      title: "Core Operations",
      items: [
        { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Enquiries & Leads", href: "/admin/enquiries", icon: Inbox, badge: "3 New" },
        {
          name: "Patient Operations",
          icon: Users,
          submenus: [
            { name: "All Patient Cases", href: "/admin/cases" },
            { name: "Patients Master Directory", href: "/admin/patients" },
            { name: "Medical Records Locker", href: "/admin/documents" },
          ]
        },
      ],
    },
    {
      title: "Clinical Network",
      items: [
        {
          name: "Clinical Catalog",
          icon: Building2,
          submenus: [
            { name: "Hospitals Directory", href: "/admin/hospitals" },
            { name: "Specialists & Doctors", href: "/admin/doctors" },
            { name: "Treatments & Surgeries", href: "/admin/treatments" },
            { name: "Medical Specialties", href: "/admin/specialties" },
          ]
        },
        { name: "Appointments & Telehealth", href: "/admin/appointments", icon: Calendar },
      ],
    },
    {
      title: "Logistics & Finance",
      items: [
        {
          name: "Logistics & Invoicing",
          icon: Plane,
          submenus: [
            { name: "Travel & Medical Visas", href: "/admin/travel" },
            { name: "Billing & Invoices", href: "/admin/payments" },
          ]
        },
      ],
    },
    {
      title: "Engagement & Content",
      items: [
        { name: "Direct Messages", href: "/admin/messages", icon: MessageSquare },
        { name: "Support Tickets", href: "/admin/support", icon: LifeBuoy },
        { name: "Patient Reviews & Feedback", href: "/admin/feedback", icon: Star },
        { name: "CMS & Knowledge Base", href: "/admin/cms", icon: FileText },
        {
          name: "Reports & Analytics",
          icon: BarChart3,
          submenus: [
            { name: "Reports Overview", href: "/admin/reports" },
            { name: "Lead Conversions", href: "/admin/reports/enquiries" },
            { name: "Clinical Case Flow", href: "/admin/reports/cases" },
            { name: "Financial & Revenue", href: "/admin/reports/financial" },
            { name: "Patient Demographics", href: "/admin/reports/patients" },
          ]
        },
      ],
    },
    {
      title: "Governance & System",
      items: [
        { name: "Security Audit Logs", href: "/admin/audit-logs", icon: ShieldAlert },
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
          <Link
            href="/"
            onClick={() => { if (typeof window !== 'undefined') localStorage.removeItem('maides_user_role'); }}
            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </Link>
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="p-2 rounded-xl bg-slate-900 text-slate-300 hover:text-white border border-slate-800 cursor-pointer"
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
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 lg:w-68 bg-slate-950 border-r border-slate-800 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:translate-x-0 shrink-0 ${
          mobileDrawerOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Brand header */}
          <div className="p-4 border-b border-slate-800 flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-lg shadow-md shadow-blue-500/20">
                M
              </div>
              <div>
                <div className="font-bold text-sm leading-none tracking-tight text-white flex items-center gap-1.5">
                  MAIDES
                  <span className="text-[9px] uppercase font-extrabold px-1.5 py-0.5 rounded bg-blue-500/20 text-[#0E82FD] border border-blue-500/30">
                    Admin
                  </span>
                </div>
                <div className="text-[10px] text-slate-400 font-medium mt-1">Platform Operations</div>
              </div>
            </Link>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-900"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items with Menus & Submenus */}
          <nav className="p-3 space-y-4 flex-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {navGroups.map((group) => (
              <div key={group.title}>
                <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                  {group.title}
                </div>
                <div className="space-y-1">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const hasSubmenus = item.submenus && item.submenus.length > 0;
                    const isExpanded = expandedMenus[item.name];
                    const isSubmenuActive = hasSubmenus && item.submenus?.some(sub => pathname === sub.href);
                    const isActive = item.href ? (pathname === item.href || (item.href !== "/admin/dashboard" && pathname.startsWith(item.href))) : isSubmenuActive;

                    if (hasSubmenus) {
                      return (
                        <div key={item.name} className="space-y-0.5">
                          {/* Parent Menu with Toggle */}
                          <button
                            type="button"
                            onClick={() => toggleSubmenu(item.name)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              isSubmenuActive
                                ? "bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                            }`}
                          >
                            <div className="flex items-center gap-2.5">
                              <Icon className={`w-4 h-4 ${isSubmenuActive ? "text-[#0E82FD]" : "text-slate-400"}`} />
                              <span>{item.name}</span>
                            </div>
                            <ChevronDown
                              className={`w-3.5 h-3.5 text-slate-500 transition-transform duration-200 ${
                                isExpanded ? "transform rotate-180 text-blue-400" : ""
                              }`}
                            />
                          </button>

                          {/* Submenus List */}
                          {isExpanded && (
                            <div className="pl-6 pr-1 py-1 space-y-1 border-l-2 border-slate-800 ml-4 my-1 animate-in slide-in-from-top-1 fade-in duration-150">
                              {item.submenus?.map((sub) => {
                                const isSubActive = pathname === sub.href;
                                return (
                                  <Link
                                    key={sub.name}
                                    href={sub.href}
                                    onClick={() => setMobileDrawerOpen(false)}
                                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-all ${
                                      isSubActive
                                        ? "bg-[#0E82FD] text-white shadow-xs font-bold"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-900"
                                    }`}
                                  >
                                    <span>{sub.name}</span>
                                    {isSubActive && <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />}
                                  </Link>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={item.name}
                        href={item.href || "#"}
                        onClick={() => setMobileDrawerOpen(false)}
                        className={`flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isActive
                            ? "bg-[#0E82FD] text-white shadow-sm font-bold"
                            : "text-slate-400 hover:text-slate-100 hover:bg-slate-900"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-slate-400"}`} />
                          <span>{item.name}</span>
                        </div>
                        {item.badge && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}

            {/* Highly Visible Sign Out in Admin Navigation (Below Settings) */}
            <div className="pt-2 border-t border-slate-800">
              <div className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Session Control
              </div>
              <Link
                href="/"
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('maides_user_role');
                  }
                  setMobileDrawerOpen(false);
                }}
                className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-600 border border-rose-500/20 transition-all shadow-xs group"
              >
                <div className="flex items-center gap-2.5">
                  <LogOut className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
                  <span>Sign Out</span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 group-hover:bg-white/20 group-hover:text-white">
                  Exit
                </span>
              </Link>
            </div>
          </nav>
        </div>

        {/* User Session Footer */}
        <div className="p-3.5 border-t border-slate-800 bg-slate-950/90">
          <div className="flex items-center justify-between">
            <Link
              href="/admin/profile"
              className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-500/40 text-blue-400 font-bold flex items-center justify-center text-xs">
                AD
              </div>
              <div>
                <div className="text-xs font-semibold text-slate-200">System Admin</div>
                <div className="text-[10px] text-slate-500">Super Administrator</div>
              </div>
            </Link>
            <div className="flex items-center gap-1">
              <Link
                href="/admin/settings"
                title="Settings"
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-900 transition-colors"
              >
                <Settings className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-900 overflow-hidden">
        {/* Clean Topbar: Search Bar + Visible Sign Out Button ONLY */}
        <header className="hidden sm:flex bg-slate-950 border-b border-slate-800 px-6 py-3 items-center justify-between sticky top-0 z-30 shadow-sm">
          {/* Topbar Search Button / Input */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                placeholder="Search cases, patients, hospitals, enquiries, invoices..."
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Visible Sign Out Button Only */}
          <div className="flex items-center ml-4">
            <Link
              href="/"
              onClick={() => { if (typeof window !== 'undefined') localStorage.removeItem('maides_user_role'); }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-600 text-rose-400 hover:text-white border border-rose-500/20 hover:border-rose-600 text-xs font-bold transition-all shadow-xs group"
            >
              <LogOut className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors" />
              <span>Sign Out</span>
            </Link>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 max-w-7xl w-full mx-auto">{children}\n        <LiveSupportChatWidget userRole="admin" /></main>
      </div>
    </div>
  );
}
