"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { LandingPage } from "@/components/LandingPage";
import { Footer } from "@/components/Footer";
import { AIIntakeModal } from "@/components/AIIntakeModal";
import { CareConciergeDrawer } from "@/components/CareConciergeDrawer";
import { FloatingConciergeWidget } from "@/components/FloatingConciergeWidget";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);

  const handleIntakeSuccess = (profile: any) => {
    // Redirect to patient portal with simulated data
    router.push("/portal");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar 
        onOpenIntake={() => setIntakeOpen(true)}
        onOpenConcierge={() => setConciergeOpen(true)}
      />

      <LandingPage 
        onOpenIntake={() => setIntakeOpen(true)}
        onOpenConcierge={() => setConciergeOpen(true)}
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
    </main>
  );
}
