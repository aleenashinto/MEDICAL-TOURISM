"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LandingPage } from "@/components/LandingPage";
import { Footer } from "@/components/Footer";
import { AIIntakeModal } from "@/components/AIIntakeModal";
import { CareConciergeDrawer } from "@/components/CareConciergeDrawer";
import { FloatingConciergeWidget } from "@/components/FloatingConciergeWidget";
import { GlobalSearchOverlay } from "@/components/GlobalSearchOverlay";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const handleIntakeSuccess = (profile: any) => {
    // Redirect to patient portal with simulated data
    router.push("/portal");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar 
        onOpenIntake={() => setIntakeOpen(true)}
        onOpenConcierge={() => setConciergeOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <LandingPage 
        onOpenIntake={() => setIntakeOpen(true)}
        onOpenConcierge={() => setConciergeOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <Footer />

      <AIIntakeModal 
        isOpen={intakeOpen}
        onClose={() => setIntakeOpen(false)}
        onSuccess={handleIntakeSuccess}
      />

      <CareConciergeDrawer 
        isOpen={conciergeOpen}
        onClose={() => setConciergeOpen(false)}
        onOpenIntake={() => {
          setConciergeOpen(false);
          setIntakeOpen(true);
        }}
      />

      <FloatingConciergeWidget 
        onOpenIntake={() => setIntakeOpen(true)}
        onOpenConcierge={() => setConciergeOpen(true)}
      />

      <GlobalSearchOverlay
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onOpenIntake={() => {
          setSearchOpen(false);
          setIntakeOpen(true);
        }}
      />

      {/* Mobile Sticky Bottom Quick Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-200/80 p-2.5 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="grid grid-cols-2 gap-2">
          <a
            href="/doctors"
            className="flex items-center justify-center space-x-1.5 py-3 rounded-2xl bg-slate-100 text-slate-800 text-xs font-bold active:scale-98 transition-all"
          >
            <span>👨‍⚕️ Find Doctor</span>
          </a>
          <button
            onClick={() => setIntakeOpen(true)}
            className="flex items-center justify-center space-x-1.5 py-3 rounded-2xl bg-gradient-to-r from-[#0E82FD] to-[#0284C7] text-white text-xs font-black shadow-md shadow-blue-500/30 active:scale-98 transition-all cursor-pointer"
          >
            <span>💬 Enquire Now</span>
          </button>
        </div>
      </div>
    </main>
  );
}
