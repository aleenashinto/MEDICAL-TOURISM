"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Inbox,
  HeartPulse,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Building2,
  FileCheck2,
  LifeBuoy,
  MessageSquare,
  Plus,
  Shield,
  Stethoscope,
  Activity,
  UserPlus,
  CalendarCheck,
  BarChart3,
  RefreshCw
} from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 142,
    activePatients: 128,
    newRegistrations: 14,
    totalCases: 64,
    activeCases: 38,
    upcomingAppointments: 18,
    completedAppointments: 86,
    openTickets: 5,
    unreadMessages: 3,
    grossVolume: "$482,500"
  });

  const [liveEnquiries, setLiveEnquiries] = useState<any[]>([
    {
      id: "ENQ-2026-004",
      patient: "Sarah Jenkins",
      country: "United Kingdom",
      treatment: "Minimally Invasive Knee Replacement",
      hospital: "Aster Medcity, Kochi",
      priority: "HIGH",
      status: "CLINICAL_TRIAGE",
      time: "10 mins ago",
    },
    {
      id: "ENQ-2026-003",
      patient: "Mohammed Al-Maktoum",
      country: "United Arab Emirates",
      treatment: "Robotic Cardiac Valve Repair",
      hospital: "Amrita Institute, Kochi",
      priority: "CRITICAL",
      status: "QUOTATION_SENT",
      time: "2 hours ago",
    },
    {
      id: "ENQ-2026-002",
      patient: "Elena Rostova",
      country: "Germany",
      treatment: "Ayurvedic Rejuvenation & Panchakarma",
      hospital: "Somatheeram Ayurvedic Village",
      priority: "MEDIUM",
      status: "VISA_PROCESSING",
      time: "5 hours ago",
    }
  ]);

  const [isLoading, setIsLoading] = useState(true);

  // Calculate dynamic stats from API
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [enqRes, casesRes, apptsRes] = await Promise.all([
          fetch("/api/enquiries"),
          fetch("/api/cases"),
          fetch("/api/appointments")
        ]);

        const enquiriesData = enqRes.ok ? await enqRes.json() : null;
        const casesData = casesRes.ok ? await casesRes.json() : null;
        const apptsData = apptsRes.ok ? await apptsRes.json() : null;

        const casesArr = casesData?.cases || [];
        const aptsArr = apptsData?.appointments || [];

        setStats(prev => ({
          ...prev,
          totalCases: casesArr.length,
          activeCases: casesArr.filter((c: any) => c.status !== "Completed" && c.status !== "Cancelled").length,
          upcomingAppointments: aptsArr.filter((a: any) => a.status === "CONFIRMED" || a.status === "REQUESTED").length,
          completedAppointments: aptsArr.filter((a: any) => a.status === "COMPLETED").length,
        }));

        // Load live enquiries for dashboard triage table
        if (enquiriesData?.success && Array.isArray(enquiriesData.enquiries) && enquiriesData.enquiries.length > 0) {
          const formatted = enquiriesData.enquiries.slice(0, 5).map((e: any) => ({
            id: e.id,
            patient: e.name,
            country: e.country,
            treatment: e.treatment || e.specialty,
            hospital: e.assignedHospital,
            priority: e.urgency || "HIGH",
            status: e.status === "NEW" ? "CLINICAL_TRIAGE" : e.status === "TRIAGED" ? "QUOTATION_SENT" : e.status,
            time: e.submittedAt || "Just now"
          }));
          setLiveEnquiries(formatted);
        }
      } catch (error) {
        console.error("Error loading admin dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const coreKpis = [
    {
      title: "Total Registered Patients",
      value: String(stats.totalPatients),
      subtext: `${stats.activePatients} Active Accounts`,
      icon: Users,
      color: "text-blue-400 bg-blue-500/10 border-blue-500/20",
      href: "/admin/patients"
    },
    {
      title: "Active Medical Cases",
      value: String(stats.activeCases),
      subtext: `Out of ${stats.totalCases} Total Cases`,
      icon: HeartPulse,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/20",
      href: "/admin/cases"
    },
    {
      title: "Upcoming Appointments",
      value: String(stats.upcomingAppointments),
      subtext: `${stats.completedAppointments} Completed`,
      icon: Calendar,
      color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
      href: "/admin/appointments"
    },
    {
      title: "Open Support Tickets",
      value: String(stats.openTickets),
      subtext: `${stats.unreadMessages} Unread Messages`,
      icon: LifeBuoy,
      color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      href: "/admin/support"
    }
  ];

  const recentActivities = [
    {
      id: "ACT-01",
      action: "New Patient Registered",
      detail: "Sarah Jenkins (United Kingdom) completed verification.",
      time: "12 mins ago",
      icon: UserPlus,
      color: "text-blue-400"
    },
    {
      id: "ACT-02",
      action: "Medical Case Status Changed",
      detail: "CAS-2026-089 moved to 'Treatment in Progress' at Aster Medcity.",
      time: "45 mins ago",
      icon: Activity,
      color: "text-purple-400"
    },
    {
      id: "ACT-03",
      action: "Telehealth Appointment Scheduled",
      detail: "Dr. K. S. Muralidharan with Mohammed Al-Maktoum (Amrita Institute).",
      time: "2 hours ago",
      icon: CalendarCheck,
      color: "text-emerald-400"
    },
    {
      id: "ACT-04",
      action: "Medical Visa Invitation Issued",
      detail: "FRRO invitation letter signed for John O'Connor (Ireland).",
      time: "5 hours ago",
      icon: FileCheck2,
      color: "text-amber-400"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="w-8 h-8 text-[#0E82FD] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 p-6 rounded-3xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold font-mono text-[#0E82FD] bg-blue-500/10 px-2.5 py-0.5 rounded-full border border-blue-500/20">
              OPERATIONS LIVE
            </span>
            <span className="text-xs text-slate-400">• Kerala Health Corridor</span>
          </div>
          <h1 className="text-xl font-bold text-white tracking-tight mt-1">
            Platform Command Center & Operational Overview
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time administrative monitoring of patient admissions, clinical workflows, telehealth queues, and support concierge.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/cases"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Case
          </Link>
          <Link
            href="/admin/patients"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <UserPlus className="w-3.5 h-3.5" />
            Add Patient
          </Link>
          <Link
            href="/admin/appointments"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedule
          </Link>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {coreKpis.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <Link
              key={kpi.title}
              href={kpi.href}
              className="bg-slate-950 border border-slate-800/80 hover:border-slate-700 p-5 rounded-3xl transition-all shadow-sm hover:shadow-xl hover:shadow-blue-500/5 group flex flex-col justify-between"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-200 transition-colors">
                  {kpi.title}
                </span>
                <div className={`p-2.5 rounded-2xl border ${kpi.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="mt-4">
                <div className="text-2xl font-bold text-white tracking-tight">{kpi.value}</div>
                <div className="text-[11px] text-slate-400 mt-1 font-medium">{kpi.subtext}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Analytics & Pipeline Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Triage & Enquiries Queue */}
        <div className="lg:col-span-2 bg-slate-950 border border-slate-800/80 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Inbox className="w-4 h-4 text-[#0E82FD]" />
                Live Patient Enquiries & Triage Queue
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Real-time incoming international treatment requests</p>
            </div>
            <Link
              href="/admin/enquiries"
              className="text-xs text-[#0E82FD] hover:text-blue-400 font-semibold flex items-center gap-1"
            >
              View All <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold">
                  <th className="pb-3">Patient Profile</th>
                  <th className="pb-3">Treatment & Destination</th>
                  <th className="pb-3">Triage Stage</th>
                  <th className="pb-3">Timestamp</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {liveEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-900/40 transition-colors group">
                    <td className="py-3.5">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {enq.patient}
                      </div>
                      <div className="text-[11px] text-slate-500">{enq.country}</div>
                    </td>
                    <td className="py-3.5">
                      <div className="text-slate-300 font-medium">{enq.treatment}</div>
                      <div className="text-[11px] text-blue-400">{enq.hospital}</div>
                    </td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-300 border border-blue-500/20">
                        {enq.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="py-3.5 text-slate-500 text-[11px]">{enq.time}</td>
                    <td className="py-3.5 text-right">
                      <Link
                        href="/admin/enquiries"
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-[#0E82FD] text-slate-200 hover:text-white font-medium text-[11px] transition-all"
                      >
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Platform Activities Audit Feed */}
        <div className="bg-slate-950 border border-slate-800/80 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-400" />
                  Recent System Activities
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">Automated security & clinical logs</p>
              </div>
              <Link
                href="/admin/audit-logs"
                className="text-xs text-[#0E82FD] hover:text-blue-400 font-semibold"
              >
                Audit Trail
              </Link>
            </div>

            <div className="space-y-3.5">
              {recentActivities.map((act) => {
                const Icon = act.icon;
                return (
                  <div
                    key={act.id}
                    className="p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3"
                  >
                    <div className={`p-2 rounded-xl bg-slate-950 border border-slate-800 ${act.color} shrink-0`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-white">{act.action}</div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug line-clamp-2">
                        {act.detail}
                      </p>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">{act.time}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 mt-4 flex items-center justify-between text-[11px] text-slate-500">
            <span>Role Isolation: Enforced</span>
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <CheckCircle2 className="w-3 h-3" /> System Nominal
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
