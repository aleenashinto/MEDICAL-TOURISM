"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Globe2, 
  Plane, 
  HeartPulse, 
  Award, 
  CheckCircle2, 
  Star, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ChevronLeft,
  PhoneCall, 
  Building2,
  Users,
  Stethoscope,
  Activity,
  Heart,
  Palmtree,
  Leaf,
  Microscope,
  Ambulance,
  Brain,
  Bone,
  Eye,
  MessageSquare,
  ArrowUpRight,
  ChevronUp,
  ChevronDown,
  UserCheck,
  Calendar,
  Layers,
  Compass,
  FileText,
  DollarSign
} from "lucide-react";
import Link from "next/link";
import { 
  KERALA_HOSPITALS, 
  KERALA_DOCTORS, 
  KERALA_TREATMENTS, 
  KERALA_SAMPLE_PACKAGES, 
  KERALA_DISTRICTS 
} from "@/lib/mockData";
import { ParticleBackground360 } from "@/components/ParticleBackground360";
import { VirtualTour360Viewer } from "@/components/VirtualTour360Viewer";
import { Kerala3DCorridorMap } from "@/components/Kerala3DCorridorMap";
import { CostCalculator360 } from "@/components/CostCalculator360";
import { HorizontalJourneyTimeline } from "@/components/HorizontalJourneyTimeline";
import { HospitalCompareModal } from "@/components/HospitalCompareModal";
import { DoctorCompareModal } from "@/components/DoctorCompareModal";
import { MedicalCareWizard } from "@/components/MedicalCareWizard";

interface LandingPageProps {
  onOpenIntake: () => void;
  onOpenConcierge: () => void;
}

const DEFAULT_SPECIALTIES = [
  { id: "SPEC-001", name: "Cardiology & Cardiac Surgery", iconName: "HeartPulse", desc: "Off-Pump CABG, TAVR, and beating-heart cardiac surgery by senior directors.", count: "18+ Procedures", displayOrder: 1 },
  { id: "SPEC-002", name: "Orthopaedics & Joint Replacement", iconName: "Activity", desc: "MAKO robotic knee & anterior hip replacement with same-day ambulation.", count: "14+ Procedures", displayOrder: 2 },
  { id: "SPEC-003", name: "Neurology & Spine Surgery", iconName: "Brain", desc: "Endoscopic skull base surgery, micro-discectomy, and neuronavigation spine surgery.", count: "11+ Procedures", displayOrder: 3 },
  { id: "SPEC-004", name: "Classical Ayurveda & Panchakarma", iconName: "Leaf", desc: "Authentic Ashtavaidya 14-21 day Panchakarma at Somatheeram Ayurvedic Village.", count: "24+ Procedures", displayOrder: 4 },
  { id: "SPEC-005", name: "Oncology & Cancer Care", iconName: "Microscope", desc: "Precision oncology, immunotherapy, and multi-organ cancer treatment at VPS Lakeshore.", count: "15+ Procedures", displayOrder: 5 },
  { id: "SPEC-006", name: "Gastroenterology & Hepatobiliary Sciences", iconName: "Ambulance", desc: "Advanced therapeutic endoscopy, ERCP, and comprehensive hepatobiliary surgical care.", count: "16+ Procedures", displayOrder: 6 },
  { id: "SPEC-007", name: "Organ Transplant (Liver, Kidney, Heart)", iconName: "Stethoscope", desc: "High-volume living donor liver and renal transplants with >95% success rates.", count: "9+ Procedures", displayOrder: 7 },
  { id: "SPEC-008", name: "Urology, Nephrology & Robotic Surgery", iconName: "UserCheck", desc: "DaVinci robotic prostatectomy, laser RIRS kidney stone clearance, and dialysis.", count: "14+ Procedures", displayOrder: 8 }
];

const getSpecialtyIcon = (iconName?: string) => {
  switch (iconName) {
    case "HeartPulse": return HeartPulse;
    case "Activity": return Activity;
    case "Microscope": return Microscope;
    case "Brain": return Brain;
    case "Leaf": return Leaf;
    case "Stethoscope": return Stethoscope;
    case "Eye": return Eye;
    case "Ambulance": return Ambulance;
    case "UserCheck": return UserCheck;
    case "Palmtree": return Palmtree;
    case "Bone": return Bone;
    case "Sparkles": return Sparkles;
    default: return HeartPulse;
  }
};

export function LandingPage({ onOpenIntake, onOpenConcierge }: LandingPageProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
  const [apptFullName, setApptFullName] = useState("");
  const [apptSpecialty, setApptSpecialty] = useState("Cardiology & Bypass");
  const [apptService, setApptService] = useState("Specialist Consultation");
  const [apptHospital, setApptHospital] = useState("");
  const [apptDoctor, setApptDoctor] = useState("");
  const [apptEmail, setApptEmail] = useState("");
  const [apptDate, setApptDate] = useState("2026-09-15");
  const [apptTime, setApptTime] = useState("10:00 IST");
  const [apptPhone, setApptPhone] = useState("");
  const [apptSuccess, setApptSuccess] = useState("");

  const [landingDoctors, setLandingDoctors] = useState<any[]>(KERALA_DOCTORS);
  const [landingHospitals, setLandingHospitals] = useState<any[]>(KERALA_HOSPITALS);
  const [landingSpecialties, setLandingSpecialties] = useState<any[]>(DEFAULT_SPECIALTIES.map(s => ({ ...s, title: s.name })));
  const [landingPackages, setLandingPackages] = useState<any[]>(KERALA_SAMPLE_PACKAGES);

  const [compareModalOpen, setCompareModalOpen] = useState(false);
  const [compareInitialHospitalId, setCompareInitialHospitalId] = useState<string | undefined>(undefined);
  const [docCompareModalOpen, setDocCompareModalOpen] = useState(false);
  const [docCompareInitialId, setDocCompareInitialId] = useState<string | undefined>(undefined);

  // Cinematic Hero Mouse Parallax State
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [activeDoctorIndex, setActiveDoctorIndex] = useState(0);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Mouse move listener for cinematic hero camera reaction
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 20;
      const y = (e.clientY / innerHeight - 0.5) * 20;
      setMousePos({ x, y });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Hydrate Dynamic Data from Server API & Storage
  useEffect(() => {
    const loadDynamicData = () => {
      const fetchLiveDoctors = async () => {
        try {
          const res = await fetch("/api/doctors?public=true");
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.doctors) && data.doctors.length > 0) {
              const activeDocs = data.doctors.map((d: any, idx: number) => ({
                id: d.id || `admin-doc-${idx}`,
                name: d.name,
                title: d.title || "Senior Specialist Doctor",
                qualifications: d.education || d.qualifications || d.certifications || "MBBS, MS, Board Certified",
                hospitalName: d.hospital || d.hospitalName || "Aster Medcity, Kochi",
                district: d.district || "Ernakulam",
                experienceYears: typeof d.experienceYears === "number" ? d.experienceYears : (parseInt(d.experience) || 15),
                rating: d.rating || "4.95",
                avatar: d.avatar || d.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400",
                specialty: d.specialty || "Specialty",
                displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : (Number(d.displayOrder) || (idx + 1))
              }));

              activeDocs.sort((a: any, b: any) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
              setLandingDoctors(activeDocs);
              return;
            }
          }
        } catch (err) {}

        try {
          const stored = typeof window !== "undefined" ? localStorage.getItem("maides_admin_doctors") : null;
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const activeAdminDocs = parsed
                .filter((d: any) => (d.status || "ACTIVE").toUpperCase() === "ACTIVE")
                .map((d: any, idx: number) => ({
                  id: d.id || `admin-doc-${idx}`,
                  name: d.name,
                  title: d.title || "Senior Specialist Doctor",
                  qualifications: d.education || d.qualifications || d.certifications || "MBBS, MS, Board Certified",
                  hospitalName: d.hospital || d.hospitalName || "Aster Medcity, Kochi",
                  district: d.district || "Ernakulam",
                  experienceYears: typeof d.experienceYears === "number" ? d.experienceYears : (parseInt(d.experience) || 15),
                  rating: d.rating || "4.95",
                  avatar: d.avatar || d.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400",
                  specialty: d.specialty || "Specialty",
                  displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : (Number(d.displayOrder) || (idx + 1))
                }));
              
              if (activeAdminDocs.length > 0) {
                activeAdminDocs.sort((a: any, b: any) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
                setLandingDoctors(activeAdminDocs);
                return;
              }
            }
          }
        } catch (e) {}

        setLandingDoctors(KERALA_DOCTORS);
      };

      fetchLiveDoctors();
    };

    loadDynamicData();
  }, []);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptFullName.trim() || !apptEmail.trim()) return;

    const assignedHosp = apptHospital || landingHospitals[0]?.name || "Aster Medcity, Kochi";
    const assignedDoc = apptDoctor || landingDoctors[0]?.name || "Dr. K. S. Muralidharan";
    const selectedSpec = apptSpecialty || "Cardiology & Bypass";
    const selectedSrv = apptService || "Specialist Clinical Consultation";

    setApptSuccess(`Thank you ${apptFullName.trim()}! Your consultation request with ${assignedDoc} at ${assignedHosp} on ${apptDate} (${apptTime}) has been scheduled. Your MAIDES Clinical Coordinator will confirm your slot.`);
    setApptFullName("");
    setApptEmail("");
    setApptPhone("");
    setTimeout(() => setApptSuccess(""), 7000);
  };

  const screenshotFaqs = [
    {
      q: "What is medical tourism in Kerala with MAIDES?",
      a: "MAIDES provides comprehensive healthcare coordination and patient travel assistance connecting domestic and international patients with verified hospitals, leading doctors, and authentic Ayurveda sanatoriums across all 14 districts in Kerala."
    },
    {
      q: "Can MAIDES help me find a healthcare provider and schedule appointments?",
      a: "Yes. Our clinical coordinators assess your medical reports, match you with certified specialists (FRCS, American Board, AIIMS, Ashtavaidya), obtain transparent 3-tier hospital quotations, and schedule consultations."
    },
    {
      q: "Do you support international patients with visas, airports, and hotels?",
      a: "Absolutely. Our partner hospitals issue fast-track Medical Visa Invitation Letters within 4 hours. We arrange airport meet-and-greet at Cochin (COK), Trivandrum (TRV), and Calicut (CCJ), private limousine transfers, and 5-star recovery accommodations."
    },
    {
      q: "Can I submit my medical reports and scans securely online?",
      a: "Yes. Patients can upload DICOM scans, lab reports, and prescriptions directly into the zero-knowledge encrypted MAIDES Medical Vault, accessible only to authorized Kerala hospital clinicians."
    },
    {
      q: "Can I combine modern medical treatment with authentic Kerala Ayurveda?",
      a: "Yes. We coordinate quaternary surgery followed by classical Ashtavaidya convalescence and herbal oil rejuvenation along the serene backwaters of Kumarakom, Alleppey, and Kovalam."
    }
  ];

  return (
    <div className="space-y-24 pb-0 bg-[#F8FAFC]">
      
      {/* 1. CINEMATIC 3D HERO OPENING (APPLE & LUXURY HEALTHCARE MOTION) */}
      <section className="relative min-h-[720px] lg:min-h-[880px] bg-gradient-to-br from-[#071120] via-[#0D2140] to-[#050D18] overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-24 flex items-center">
        
        {/* Interactive 360-Degree Ambient Particle Web */}
        <ParticleBackground360 />

        {/* Ambient Atmospheric Lighting & Volumetric Glows with Mouse Parallax */}
        <div 
          className="absolute inset-0 pointer-events-none overflow-hidden transition-transform duration-700 ease-out"
          style={{ transform: `translate3d(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px, 0)` }}
        >
          <div className="absolute -top-40 -left-40 w-96 sm:w-[600px] h-96 sm:h-[600px] rounded-full bg-[#0E82FD]/20 blur-[140px]" />
          <div className="absolute top-1/3 -right-20 w-96 sm:w-[650px] h-96 sm:h-[650px] rounded-full bg-[#38BDF8]/15 blur-[150px]" />
          <div className="absolute bottom-0 left-1/3 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-[#10B981]/15 blur-[120px]" />
          
          {/* Subtle Kerala Backwater Mist Geometry */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Hero Narrative, Badges & CTAs */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-white text-left z-20">
              
              {/* Eyebrow Pill with Live Telemetry Pulse */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-cyan-200 uppercase">
                  Kerala Quaternary Network • JCI & NABH Certified
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[66px] font-black text-white tracking-tight leading-[1.08] sm:leading-[1.04]">
                  World-Class Healthcare. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-emerald-300">
                    A Journey Designed
                  </span> <br />
                  Around You.
                </h1>
                <p className="text-xs sm:text-base text-blue-100/90 font-normal max-w-lg leading-relaxed">
                  Seamless medical travel coordination connecting international patients with accredited surgical directors, quaternary hospital suites, and serene backwater recovery sanatoriums in Kerala.
                </p>
              </div>

              {/* Magnetic Action Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={onOpenIntake}
                  className="px-7 sm:px-9 py-4 rounded-full bg-gradient-to-r from-[#0E82FD] via-blue-500 to-[#38BDF8] hover:from-blue-600 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider text-center shadow-xl shadow-blue-500/35 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer group"
                >
                  <span>Start Your Medical Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#care-wizard"
                  className="px-6 sm:px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm uppercase tracking-wider text-center backdrop-blur-md transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.03]"
                >
                  <span>Explore Care Plan</span>
                  <ChevronRight className="w-4 h-4 text-cyan-300" />
                </a>
              </div>

              {/* 3 Floating Glass Info Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-3">
                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white truncate">✓ Verified Specialists</div>
                    <div className="text-[9px] text-blue-200 truncate">FRCS & American Board</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Building2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white truncate">🏥 JCI & NABH</div>
                    <div className="text-[9px] text-blue-200 truncate">Accredited Network</div>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-sm flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-300 flex items-center justify-center shrink-0">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-white truncate">🌍 24/7 International</div>
                    <div className="text-[9px] text-blue-200 truncate">Airport & Visa Desk</div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Layered Depth Composition with Active Camera Parallax */}
            <div 
              className="lg:col-span-6 relative flex justify-center items-center mt-6 lg:mt-0"
              style={{ transform: `translate3d(${-mousePos.x * 0.4}px, ${-mousePos.y * 0.4}px, 0)` }}
            >
              
              {/* Outer Glowing Concentric Rings */}
              <div className="absolute w-[360px] h-[360px] sm:w-[480px] sm:h-[480px] lg:w-[580px] lg:h-[580px] rounded-full border border-blue-400/20 animate-[spin_45s_linear_infinite]" />
              <div className="absolute w-[290px] h-[290px] sm:w-[400px] sm:h-[400px] lg:w-[480px] lg:h-[480px] rounded-full border border-sky-300/15 animate-[spin_35s_linear_infinite_reverse]" />

              {/* Main Cutout Doctor Frame with Subtle Breathing Motion */}
              <div className="relative z-10 w-full max-w-[320px] sm:max-w-[420px] rounded-t-[160px] sm:rounded-t-[200px] rounded-b-3xl bg-gradient-to-b from-blue-500/25 via-white/5 to-white/10 p-2 sm:p-2.5 backdrop-blur-xl border border-white/25 shadow-2xl overflow-hidden animate-float-slow">
                <div className="w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-t-[150px] sm:rounded-t-[190px] rounded-b-2xl overflow-hidden relative">
                  <img 
                    src={landingDoctors[0]?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"} 
                    alt={landingDoctors[0]?.name || "MAIDES Kerala Senior Specialist"} 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071120]/95 via-transparent to-transparent" />
                  
                  {/* Overlay Bottom Doctor Card */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-3.5 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-black truncate">{landingDoctors[0]?.name || "Dr. Muralidharan V. Nair"}</div>
                      <div className="text-[10px] text-cyan-200 truncate">{landingDoctors[0]?.title || "Chief Specialist"} • {landingDoctors[0]?.hospitalName || "Aster Medcity, Kochi"}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center space-x-1 shrink-0 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Available</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Dynamic Badge 1: Verified Experience */}
              <div 
                className="absolute top-2 left-0 sm:-top-4 sm:-left-6 z-20 p-2.5 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 flex items-center space-x-2.5 sm:space-x-3 transition-transform duration-500"
                style={{ transform: `translate3d(${mousePos.x * 0.8}px, ${mousePos.y * 0.8}px, 0)` }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0E82FD] shadow-inner shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-[#0F2042]">✓ Verified 20+ Years</div>
                  <div className="text-[9px] sm:text-[10px] font-semibold text-slate-500">Board-Certified Specialists</div>
                </div>
              </div>

              {/* Floating Dynamic Badge 2: Real Cost Advantage */}
              <div 
                className="absolute bottom-6 left-0 sm:bottom-12 sm:-left-8 z-20 p-2.5 sm:p-3.5 rounded-2xl bg-[#0F2042]/95 backdrop-blur-xl shadow-2xl border border-white/20 text-white flex items-center space-x-2.5 sm:space-x-3 transition-transform duration-500"
                style={{ transform: `translate3d(${-mousePos.x * 0.8}px, ${-mousePos.y * 0.8}px, 0)` }}
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-white">Up to 70% Savings</div>
                  <div className="text-[9px] sm:text-[10px] text-blue-200">vs UAE, UK & US Pricing</div>
                </div>
              </div>

              {/* Floating Dynamic Badge 3: 4.95 Rating */}
              <div 
                className="absolute top-1/2 right-0 sm:-right-8 -translate-y-1/2 z-20 p-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 flex items-center space-x-2.5 hidden sm:flex transition-transform duration-500"
                style={{ transform: `translate3d(${mousePos.x * 0.6}px, ${mousePos.y * 0.6}px, 0)` }}
              >
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-500 flex items-center justify-center shrink-0">
                  <Star className="w-4 h-4 fill-amber-400" />
                </div>
                <div>
                  <div className="text-xs font-black text-[#0F2042]">⭐ 4.95 Rating</div>
                  <div className="text-[10px] font-semibold text-slate-500">99.2% Clinical Success</div>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 2. GLOBAL TRUST BAR — Dedicated Country Corridors & Accreditations */}
      <section className="-mt-14 sm:-mt-16 relative z-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-white/95 backdrop-blur-xl shadow-[0_15px_40px_rgba(15,32,66,0.1)] border border-slate-100 p-5 sm:p-7">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            
            {/* Left: Corridor Header with Pulse */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#0E82FD] flex items-center justify-center font-bold">
                <Globe2 className="w-5 h-5 animate-spin-slow" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-black text-[#0F2042] uppercase tracking-wider">Trusted Global Patient Corridors</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Daily medical arrivals to Kochi (COK) & Trivandrum (TRV)</p>
              </div>
            </div>

            {/* Middle: Country Badges */}
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
              {[
                { flag: "🇦🇪", name: "UAE (Dubai & Abu Dhabi)" },
                { flag: "🇬🇧", name: "United Kingdom" },
                { flag: "🇺🇸", name: "USA & Canada" },
                { flag: "🇸🇦", name: "Saudi Arabia" },
                { flag: "🇶🇦", name: "Qatar" },
                { flag: "🇴🇲", name: "Oman" },
                { flag: "🇰🇼", name: "Kuwait" },
                { flag: "🇲🇻", name: "Maldives" }
              ].map((c, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 text-slate-700 hover:text-[#0E82FD] text-xs font-bold transition-all shadow-2xs"
                >
                  <span className="text-sm">{c.flag}</span>
                  <span className="text-[11px]">{c.name}</span>
                </div>
              ))}
            </div>

            {/* Right: JCI / NABH Badges */}
            <div className="flex items-center space-x-3 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-100 pt-4 lg:pt-0 lg:pl-6">
              <div className="text-center sm:text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Accreditation</span>
                <span className="text-xs font-black text-emerald-600">JCI & NABH Certified</span>
              </div>
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black text-xs shadow-inner">
                ✓
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. CONCIERGE "HOW CAN WE HELP YOU?" ACTION TRIAD */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4">
        <div className="text-center mb-6">
          <span className="text-[10px] font-black tracking-widest text-[#0E82FD] uppercase">Instant Access</span>
          <h2 className="text-xl sm:text-2xl font-black text-[#0F2042] mt-0.5">How Can MAIDES Help You Today?</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          
          {/* Card 1: Find Doctor */}
          <Link
            href="/doctors"
            className="p-6 rounded-3xl bg-white border-2 border-slate-100 hover:border-[#0E82FD] shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0E82FD] group-hover:bg-[#0E82FD] group-hover:text-white transition-colors flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-blue-50 text-slate-400 group-hover:text-[#0E82FD] flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0F2042] group-hover:text-[#0E82FD] transition-colors">Find a Doctor</h3>
              <p className="text-xs text-slate-500 mt-1">Browse 120+ verified chief surgeons, cardiac directors & Ayurveda Ashtavaidyas in Kerala.</p>
            </div>
            <div className="text-xs font-bold text-[#0E82FD] pt-2 border-t border-slate-100 flex items-center space-x-1">
              <span>View Specialists Directory</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 2: Find Hospital */}
          <Link
            href="/hospitals"
            className="p-6 rounded-3xl bg-white border-2 border-slate-100 hover:border-emerald-500 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-emerald-50 text-slate-400 group-hover:text-emerald-600 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0F2042] group-hover:text-emerald-600 transition-colors">Find a Hospital</h3>
              <p className="text-xs text-slate-500 mt-1">Explore JCI & NABH accredited quaternary medical centers across Cochin, Trivandrum & Calicut.</p>
            </div>
            <div className="text-xs font-bold text-emerald-600 pt-2 border-t border-slate-100 flex items-center space-x-1">
              <span>Explore Kerala Hospitals</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </Link>

          {/* Card 3: Estimate Cost */}
          <a
            href="#care-wizard"
            className="p-6 rounded-3xl bg-white border-2 border-slate-100 hover:border-sky-500 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 group-hover:bg-sky-600 group-hover:text-white transition-colors flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="w-8 h-8 rounded-full bg-slate-100 group-hover:bg-sky-50 text-slate-400 group-hover:text-sky-600 flex items-center justify-center transition-colors">
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-black text-[#0F2042] group-hover:text-sky-600 transition-colors">Estimate Treatment Cost</h3>
              <p className="text-xs text-slate-500 mt-1">Get an instant transparent price benchmark comparing Kerala quaternary care vs UAE, UK & USA.</p>
            </div>
            <div className="text-xs font-bold text-sky-600 pt-2 border-t border-slate-100 flex items-center space-x-1">
              <span>Launch Care Plan Wizard</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </div>
          </a>

        </div>
      </section>

      {/* 4. SIGNATURE INTERACTIVE "TELL US WHAT YOU NEED" MEDICAL CARE WIZARD */}
      <MedicalCareWizard onOpenIntake={onOpenIntake} />

      {/* 5. 360° INTERACTIVE VIRTUAL REALITY TOUR & HOSPITAL IMMERSION */}
      <section id="virtual-tour-360" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10">
        <VirtualTour360Viewer onBookConsultation={onOpenIntake} />
      </section>

      {/* 6. 3D FLIGHT CORRIDOR TELEMETRY & 360° GLOBAL BENCHMARK CALCULATOR */}
      <section id="calculator" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 sm:pt-12 space-y-12">
        <Kerala3DCorridorMap onOpenIntake={onOpenIntake} />
        <CostCalculator360 onOpenIntake={onOpenIntake} />
      </section>

      {/* 7. THE INTERACTIVE KERALA PATIENT JOURNEY PATHWAY (3D TIMELINE) */}
      <section id="journey" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4">
        <HorizontalJourneyTimeline onOpenIntake={onOpenIntake} />
      </section>

      {/* 8. MEDICAL SPECIALTIES DIRECTORY */}
      <section id="treatments" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Clinical Disciplines
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F2042]">
            Comprehensive Medical Specialties in Kerala
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Explore advanced surgical disciplines and holistic healing options coordinated across our verified network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {landingSpecialties.map((dept, idx) => {
            const Icon = getSpecialtyIcon(dept.iconName);
            return (
              <div key={dept.id || idx} className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-xs hover:shadow-xl hover:border-[#0E82FD] transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-[#0E82FD] group-hover:bg-[#0E82FD] group-hover:text-white transition-all flex items-center justify-center">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </div>
                    <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {dept.count}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors mb-1.5 sm:mb-2">
                    {dept.title || dept.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dept.desc}
                  </p>
                </div>

                <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button onClick={onOpenIntake} className="text-xs font-bold text-[#0E82FD] group-hover:text-blue-700 flex items-center space-x-1 cursor-pointer">
                    <span>Consult Specialist</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-[10px] sm:text-[11px] text-slate-400">JCI / NABH Accredited</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 9. DOCTOR SPECIALIST DISCOVERY & COMPARISON ROSTER */}
      <section id="doctors" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Medical Specialists
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F2042]">
            Verified Senior Clinicians in Kerala
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Chief surgeons and senior physicians with international qualifications (FRCS, American Board, AIIMS, Ashtavaidya).
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {landingDoctors.map((doc) => (
            <div key={doc.id} className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-[#0E82FD] transition-all duration-300 p-5 flex flex-col justify-between space-y-4 group">
              <div className="space-y-3.5">
                
                {/* Doctor Avatar with Smooth Hover Zoom and Live Status */}
                <div className="relative rounded-2xl overflow-hidden h-48 bg-slate-100">
                  <img 
                    src={doc.avatar} 
                    alt={doc.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                  
                  {/* Rating Tag */}
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 flex items-center space-x-1 shadow-sm">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{doc.rating}</span>
                  </div>

                  {/* Availability Indicator */}
                  <div className="absolute bottom-2.5 left-2.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md text-emerald-300 text-[10px] font-bold flex items-center space-x-1.5 shadow-sm border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Available for Consultation</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-black text-[#0F2042] group-hover:text-[#0E82FD] transition-colors line-clamp-1">{doc.name}</h3>
                  <p className="text-xs text-[#0E82FD] font-bold mt-0.5 line-clamp-1">{doc.title || doc.specialty}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{doc.hospitalName} • {doc.district || "Kerala"}</p>
                </div>

                <div className="pt-2.5 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div className="line-clamp-1"><strong>Degrees:</strong> {doc.qualifications}</div>
                  <div><strong>Experience:</strong> {doc.experienceYears}+ Years Quaternary Practice</div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2">
                <button 
                  onClick={() => {
                    setDocCompareInitialId(doc.id);
                    setDocCompareModalOpen(true);
                  }}
                  className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center cursor-pointer"
                >
                  Compare
                </button>
                <button 
                  onClick={onOpenIntake}
                  className="py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                >
                  <span>Book</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/doctors"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-900 hover:bg-[#0E82FD] text-white text-xs font-bold transition-all shadow-md hover:shadow-blue-500/20"
          >
            <span>Explore Full Kerala Medical Faculty Directory</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 10. KERALA HOSPITALS DIRECTORY & COMPARISON */}
      <section id="hospitals" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Quaternary Institutions
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F2042]">
            Accredited Hospitals in Kerala
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            JCI & NABH accredited quaternary medical centers across Kochi, Trivandrum, and Calicut.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {landingHospitals.slice(0, 6).map((h) => {
            const airportCode = h.nearestAirport?.includes("Cochin") ? "COK" : h.nearestAirport?.includes("Trivandrum") ? "TRV" : "CCJ";
            return (
              <div key={h.id} className="rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#0E82FD] transition-all overflow-hidden flex flex-col justify-between group">
                <div>
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img 
                      src={h.image} 
                      alt={h.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    
                    {/* Airport Distance Chip */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#0F2042]/90 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1.5 shadow-md border border-white/20">
                      <Plane className="w-3 h-3 text-cyan-300" />
                      <span>{airportCode} • {h.airportDistanceKm || 28} km</span>
                    </div>

                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-[#0E82FD] text-[10px] font-black uppercase tracking-wider shadow-sm">
                      {h.accreditations[0]}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center space-x-1.5 text-xs text-slate-500 font-semibold">
                      <MapPin className="w-3.5 h-3.5 text-[#0E82FD]" />
                      <span>{h.city}, {h.district}</span>
                    </div>
                    
                    <h3 className="text-base font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors">{h.name}</h3>
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{h.description}</p>
                    
                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-600">
                      <div className="flex items-center space-x-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span className="line-clamp-1">{h.internationalServices[0]}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-slate-500">
                        <ShieldCheck className="w-4 h-4 text-[#0E82FD] shrink-0" />
                        <span className="line-clamp-1">Fast-Track Medical eVisa in 4h</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => {
                      setCompareInitialHospitalId(h.id);
                      setCompareModalOpen(true);
                    }}
                    className="py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all text-center cursor-pointer"
                  >
                    Compare
                  </button>
                  <button 
                    onClick={onOpenIntake} 
                    className="py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition-all flex items-center justify-center space-x-1 shadow-sm cursor-pointer"
                  >
                    <span>View Profile</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/hospitals"
            className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-white hover:bg-blue-50 text-[#0E82FD] font-bold text-xs sm:text-sm border border-blue-200 shadow-sm hover:shadow transition-all group"
          >
            <span>Explore Complete Kerala Hospital Network & Quaternary Centers</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 11. "HEAL IN KERALA" & AYURVEDIC BACKWATER REJUVENATION */}
      <section id="why-kerala" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10">
        <div className="relative rounded-3xl overflow-hidden bg-[#0A182F] text-white p-8 sm:p-14 shadow-2xl">
          <div className="absolute inset-0 opacity-25">
            <img 
              src="https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1600&q=80" 
              alt="Kerala Backwaters"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A182F] via-[#0A182F]/90 to-transparent" />

          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5" />
              <span>Care That Extends Beyond The Hospital</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Restore Mind & Body in God’s Own Country
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
              Combine world-class robotic surgeries and cardiac procedures with authentic 5,000-year-old Ashtavaidya Ayurveda convalescence along the serene backwaters of Kumarakom, Alleppey, and Kovalam.
            </p>

            <div className="grid grid-cols-2 gap-4 pt-2 text-xs text-blue-100 font-medium">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Private Backwater Recovery Suites</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Organic Vedic Nutritional Menus</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Certified Ashtavaidya Vaidyas</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Dedicated Limousine & Airport Escort</span>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center gap-3">
              <Link
                href="/ayurveda"
                className="px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-emerald-500/25"
              >
                Explore Ayurveda Packages
              </Link>
              <button
                onClick={onOpenIntake}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs uppercase tracking-wider transition-all backdrop-blur-md cursor-pointer"
              >
                Consult Ayurvedic Director
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 12. FREQUENTLY ASKED QUESTIONS */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12">
          
          <div className="lg:col-span-4 space-y-4">
            <div className="inline-flex items-center space-x-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">SUPPORT & GUIDANCE</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-black text-[#0F2042] tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Find instant answers to common questions about hospital admissions, medical e-visas, costs, and backwater recovery.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenConcierge}
                className="px-6 py-3 rounded-full bg-[#0F2042] hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 text-cyan-300" />
                <span>Ask Kerala Concierge 24/7</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-3">
            {screenshotFaqs.map((faq, idx) => (
              <div 
                key={idx}
                className={`rounded-2xl transition-all border ${
                  activeFaq === idx 
                    ? "bg-blue-50/70 border-blue-200 shadow-xs" 
                    : "bg-white border-slate-200 hover:border-blue-200"
                }`}
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-[#0F2042] hover:text-[#0E82FD] transition-colors cursor-pointer"
                >
                  <span className={`pr-3 ${activeFaq === idx ? "text-[#0E82FD]" : "text-[#0F2042]"}`}>
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform shrink-0 ${activeFaq === idx ? "bg-[#0E82FD] text-white" : "bg-slate-100 text-slate-500"}`}>
                    {activeFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {activeFaq === idx && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-0 text-xs text-slate-600 leading-relaxed font-normal">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 13. HIGH-TRUST FINAL CLOSING CTA SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0F2042] via-[#163868] to-[#0A182F] text-white p-8 sm:p-14 shadow-2xl border border-white/15 overflow-hidden">
          
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0E82FD]/20 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-[90px] pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span className="text-[11px] font-black uppercase tracking-widest text-cyan-200">
                Begin Your Journey With Zero Obligation
              </span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              Ready to Experience World-Class Care in Kerala?
            </h2>

            <p className="text-xs sm:text-base text-blue-100/90 leading-relaxed max-w-2xl mx-auto">
              Our clinical desk connects you directly with chief surgeons and accredited hospital boards. Receive transparent quotes, fast-track medical eVisas, and personal concierge support.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs font-semibold text-blue-200">
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero upfront consultation fees</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Dedicated 24/7 personal concierge</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Encrypted medical records vault</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
              <button
                onClick={onOpenIntake}
                className="w-full sm:w-auto px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-[#0E82FD] via-blue-500 to-[#38BDF8] hover:from-blue-600 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider text-center shadow-xl shadow-blue-500/35 hover:scale-[1.03] transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <span>Submit Your Case For Free Review</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onOpenConcierge}
                className="w-full sm:w-auto px-6 sm:px-8 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm uppercase tracking-wider text-center backdrop-blur-md transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 text-cyan-300" />
                <span>Talk to Kerala Concierge</span>
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Hospital Comparison Modal */}
      <HospitalCompareModal 
        isOpen={compareModalOpen}
        onClose={() => setCompareModalOpen(false)}
        hospitals={landingHospitals}
        initialSelectedId={compareInitialHospitalId}
        onSelectHospitalForBooking={(hospitalName) => {
          setApptHospital(hospitalName);
          onOpenIntake();
        }}
      />

      {/* Doctor Comparison Modal */}
      <DoctorCompareModal
        isOpen={docCompareModalOpen}
        onClose={() => setDocCompareModalOpen(false)}
        initialDoctorId={docCompareInitialId}
        onOpenIntake={onOpenIntake}
      />

    </div>
  );
}
