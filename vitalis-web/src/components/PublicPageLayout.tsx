"use client";

import React, { useState } from "react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AIIntakeModal } from "@/components/AIIntakeModal";
import { CareConciergeDrawer } from "@/components/CareConciergeDrawer";
import { useRouter } from "next/navigation";

interface PublicPageLayoutProps {
  children: (props: { onOpenIntake: () => void; onOpenConcierge: () => void }) => React.ReactNode;
  navbarStyle?: "transparent" | "white";
}

export function PublicPageLayout({ children, navbarStyle = "white" }: PublicPageLayoutProps) {
  const router = useRouter();
  const [intakeOpen, setIntakeOpen] = useState(false);
  const [conciergeOpen, setConciergeOpen] = useState(false);

  const handleIntakeSuccess = (profile: any) => {
    router.push("/portal");
  };

  return (
    <main className="min-h-screen bg-[#F8FAFC] flex flex-col justify-between">
      <Navbar
        onOpenIntake={() => setIntakeOpen(true)}
        onOpenConcierge={() => setConciergeOpen(true)}
        style={navbarStyle}
      />

      <div className="flex-1">
        {children({
          onOpenIntake: () => setIntakeOpen(true),
          onOpenConcierge: () => setConciergeOpen(true)
        })}
      </div>

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
    </main>
  );
}
