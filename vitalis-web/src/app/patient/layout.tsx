import React from "react";
import Link from "next/link";
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
  ShieldAlert
} from "lucide-react";

export default function PatientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0F2042] text-white flex flex-col justify-between hidden md:flex">
        <div>
          <div className="p-6 border-b border-slate-700/60 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-bold shadow-md">
              M
            </div>
            <div>
              <div className="font-bold text-lg leading-none tracking-tight">MAIDES</div>
              <div className="text-[11px] text-blue-300 font-medium mt-1">Patient Portal</div>
            </div>
          </div>

          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <Icon className="w-4 h-4 text-blue-400" />
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
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
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

        <main className="flex-1 p-6 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
