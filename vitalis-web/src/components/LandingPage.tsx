"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  PhoneCall, 
  Building2,
  Users,
  Stethoscope,
  BadgeCheck,
  Calendar,
  Activity,
  Heart,
  Compass,
  Palmtree,
  Leaf,
  Play,
  Microscope,
  Ambulance,
  Syringe,
  Pill,
  UserCheck,
  Shield,
  Clock4,
  Quote,
  Check,
  ArrowUpRight,
  Phone,
  ChevronDown,
  ChevronUp,
  Eye,
  Brain,
  Bone,
  MessageSquare
} from "lucide-react";
import { 
  KERALA_HOSPITALS, 
  KERALA_DOCTORS, 
  KERALA_TREATMENTS, 
  KERALA_SAMPLE_PACKAGES, 
  KERALA_DISTRICTS 
} from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";
import { ParticleBackground360 } from "@/components/ParticleBackground360";
import { VirtualTour360Viewer } from "@/components/VirtualTour360Viewer";
import { Kerala3DCorridorMap } from "@/components/Kerala3DCorridorMap";
import { CostCalculator360 } from "@/components/CostCalculator360";
import { HorizontalJourneyTimeline } from "@/components/HorizontalJourneyTimeline";
import { HospitalCompareModal } from "@/components/HospitalCompareModal";

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
    case "Syringe": return Syringe;
    case "Ambulance": return Ambulance;
    case "UserCheck": return UserCheck;
    case "Pill": return Pill;
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

  // Load and hydrate Admin-uploaded doctors, hospitals, specialties & packages in real-time
  useEffect(() => {
    const loadDynamicData = () => {
      // 1. Load Admin Doctors (Active & Published from Server API & Storage)
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
                district: d.district || (d.hospital?.includes("Kovalam") || d.hospital?.includes("Trivandrum") ? "Thiruvananthapuram" : d.hospital?.includes("Calicut") ? "Kozhikode" : "Ernakulam"),
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
        } catch (err) {
          // Network fallback to local storage
        }

        try {
          const stored = typeof window !== "undefined" ? localStorage.getItem("maides_admin_doctors") : null;
          if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const activeAdminDocs = parsed
                .filter((d: any) => {
                  const s = (d.status || "ACTIVE").toUpperCase();
                  const p = (d.published || "PUBLISHED").toUpperCase();
                  return s === "ACTIVE" && p === "PUBLISHED";
                })
                .map((d: any, idx: number) => ({
                  id: d.id || `admin-doc-${idx}`,
                  name: d.name,
                  title: d.title || "Senior Specialist Doctor",
                  qualifications: d.education || d.qualifications || d.certifications || "MBBS, MS, Board Certified",
                  hospitalName: d.hospital || d.hospitalName || "Aster Medcity, Kochi",
                  district: d.district || (d.hospital?.includes("Kovalam") || d.hospital?.includes("Trivandrum") ? "Thiruvananthapuram" : d.hospital?.includes("Calicut") ? "Kozhikode" : "Ernakulam"),
                  experienceYears: typeof d.experienceYears === "number" ? d.experienceYears : (parseInt(d.experience) || 15),
                  rating: d.rating || "4.95",
                  avatar: d.avatar || d.image || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400",
                  specialty: d.specialty || "Specialty",
                  displayOrder: typeof d.displayOrder === "number" ? d.displayOrder : (Number(d.displayOrder) || (idx + 1))
                }));
              
              if (activeAdminDocs.length > 0) {
                activeAdminDocs.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
                setLandingDoctors(activeAdminDocs);
                return;
              }
            }
          }
        } catch (e) {}

        const fallback = KERALA_DOCTORS.map((d: any) => ({
          ...d,
          displayOrder: 1
        }));
        setLandingDoctors(fallback);
      };

      fetchLiveDoctors();

      // 2. Load Admin Hospitals (Active & Published Only from Server API & Storage)
      const fetchLiveHospitals = async () => {
        try {
          const res = await fetch("/api/hospitals?public=true");
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.hospitals) && data.hospitals.length > 0) {
              const activeHosps = data.hospitals.map((h: any, idx: number) => ({
                id: h.id || `admin-hosp-${idx}`,
                name: h.name,
                city: h.city || "Kochi, Kerala",
                district: h.district || "Ernakulam / Kochi",
                region: h.region || "Central Kerala",
                accreditations: Array.isArray(h.accreditations) ? h.accreditations : [h.accreditations || "NABH Accredited"],
                specialties: Array.isArray(h.specialties) ? h.specialties : (typeof h.specialties === "string" ? h.specialties.split(",").map((s: string) => s.trim()) : ["Multispecialty Healthcare"]),
                rating: h.rating || 4.92,
                reviewCount: h.reviewCount || 1450,
                image: h.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
                description: h.shortDescription || h.fullDescription || `${h.name} is a leading NABH/JCI accredited quaternary healthcare destination in Kerala providing world-class medical tourism care.`,
                internationalServices: Array.isArray(h.internationalServices) && h.internationalServices.length > 0 ? h.internationalServices : [
                  "24/7 International Patient Concierge Desk",
                  "Direct Airport Limousine Escort",
                  "Medical eVisa Fast-Track Letter in 4 Hours"
                ],
                displayOrder: typeof h.displayOrder === "number" ? h.displayOrder : (Number(h.displayOrder) || (idx + 1))
              }));

              activeHosps.sort((a: any, b: any) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
              setLandingHospitals(activeHosps);
              return;
            }
          }
        } catch (err) {
          // Network fallback to local storage
        }

        try {
          const storedHosps = typeof window !== "undefined" ? localStorage.getItem("maides_admin_hospitals") : null;
          if (storedHosps) {
            const parsed = JSON.parse(storedHosps);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const activeAdminHosps = parsed
                .filter((h: any) => {
                  const s = (h.status || "ACTIVE").toUpperCase();
                  const p = (h.published || "PUBLISHED").toUpperCase();
                  return s === "ACTIVE" && p === "PUBLISHED";
                })
                .map((h: any, idx: number) => ({
                  id: h.id || `admin-hosp-${idx}`,
                  name: h.name,
                  city: h.city || "Kochi, Kerala",
                  district: h.district || "Ernakulam",
                  region: h.region || "Central Kerala",
                  accreditations: Array.isArray(h.accreditations) ? h.accreditations : [h.accreditations || "NABH Accredited"],
                  specialties: Array.isArray(h.specialties) ? h.specialties : (typeof h.specialties === "string" ? h.specialties.split(",").map((s: string) => s.trim()) : ["Multispecialty Healthcare"]),
                  rating: h.rating || 4.92,
                  reviewCount: h.reviewCount || 1450,
                  image: h.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
                  description: h.shortDescription || h.fullDescription || `${h.name} is a leading NABH/JCI accredited quaternary healthcare destination in Kerala providing world-class medical tourism care.`,
                  internationalServices: Array.isArray(h.internationalServices) && h.internationalServices.length > 0 ? h.internationalServices : [
                    "24/7 International Patient Concierge Desk",
                    "Direct Airport Limousine Escort",
                    "Medical eVisa Fast-Track Letter in 4 Hours"
                  ],
                  displayOrder: typeof h.displayOrder === "number" ? h.displayOrder : (Number(h.displayOrder) || (idx + 1))
                }));

              if (activeAdminHosps.length > 0) {
                activeAdminHosps.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));
                setLandingHospitals(activeAdminHosps);
                return;
              }
            }
          }
        } catch (e) {}

        const fallbackHosps = KERALA_HOSPITALS.map((h: any, idx: number) => ({
          ...h,
          displayOrder: idx + 1
        }));
        setLandingHospitals(fallbackHosps);
      };

      fetchLiveHospitals();

      // 3. Load Admin Specialties (Active & Published Only from Server API & Storage)
      const fetchLiveSpecialties = async () => {
        try {
          const res = await fetch("/api/specialties?public=true");
          if (res.ok) {
            const data = await res.json();
            if (data.success && Array.isArray(data.specialties) && data.specialties.length > 0) {
              const activeSpecs = data.specialties.map((s: any) => ({
                id: s.id,
                name: s.name,
                title: s.name,
                desc: s.shortDescription || s.fullDescription || `${s.name} center of excellence in Kerala.`,
                iconName: s.iconName || "HeartPulse",
                count: `${s.proceduresCount || s.keyProcedures?.length || 10}+ Procedures`,
                displayOrder: Number(s.displayOrder) || 99
              }));

              activeSpecs.sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99));
              setLandingSpecialties(activeSpecs);
              return;
            }
          }
        } catch (err) {}

        try {
          const storedSpecs = localStorage.getItem("maides_admin_specialties");
          if (storedSpecs) {
            const parsed = JSON.parse(storedSpecs);
            if (Array.isArray(parsed) && parsed.length > 0) {
              const activeAdminSpecs = parsed
                .filter((s: any) => (s.status === "ACTIVE" || !s.status) && (s.published === "PUBLISHED" || !s.published))
                .map((s: any) => ({
                  id: s.id,
                  name: s.name,
                  title: s.name,
                  desc: s.shortDescription || s.fullDescription || `${s.name} center of excellence in Kerala.`,
                  iconName: s.iconName || "HeartPulse",
                  count: `${s.proceduresCount || s.keyProcedures?.length || 10}+ Procedures`,
                  displayOrder: Number(s.displayOrder) || 99
                }));

              if (activeAdminSpecs.length > 0) {
                activeAdminSpecs.sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99));
                setLandingSpecialties(activeAdminSpecs);
                return;
              }
            }
          }
        } catch (e) {}

        setLandingSpecialties(DEFAULT_SPECIALTIES.map(s => ({ ...s, title: s.name })));
      };

      fetchLiveSpecialties();

      // 4. Load Admin Packages (Active & Published Only)
      try {
        const storedPkgs = localStorage.getItem("maides_admin_packages");
        if (storedPkgs) {
          const parsed = JSON.parse(storedPkgs);
          if (Array.isArray(parsed) && parsed.length > 0) {
            const activeAdminPackages = parsed
              .filter((p: any) => p.status === "ACTIVE" && (p.published === "PUBLISHED" || !p.published))
              .sort((a: any, b: any) => (a.displayOrder || 99) - (b.displayOrder || 99))
              .map((p: any) => ({
                id: p.id,
                title: p.title,
                tier: p.tier || "Premium Care",
                treatmentName: p.treatmentName,
                hospitalName: p.hospitalName,
                doctorName: p.doctorName,
                district: p.district || "Ernakulam",
                city: p.city || "Kochi, Kerala",
                priceUsd: Number(p.priceUsd) || 5000,
                priceInr: Number(p.priceInr) || Math.round((Number(p.priceUsd) || 5000) * 87.5),
                durationDays: Number(p.durationDays) || 10,
                highlights: Array.isArray(p.highlights) && p.highlights.length > 0 ? p.highlights : ["All-inclusive medical care package in Kerala"],
                inclusions: Array.isArray(p.inclusions) && p.inclusions.length > 0 ? p.inclusions : ["Complete clinical and hospital stay care"],
                image: p.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
                displayOrder: Number(p.displayOrder) || 99
              }));

            const mergedPkgs: any[] = [...activeAdminPackages];
            KERALA_SAMPLE_PACKAGES.forEach(sp => {
              if (!mergedPkgs.some(m => m.id === sp.id || m.title.toLowerCase() === sp.title.toLowerCase())) {
                mergedPkgs.push({ 
                  ...sp, 
                  image: (sp as any).image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
                  displayOrder: 99 
                });
              }
            });
            mergedPkgs.sort((a, b) => (a.displayOrder || 99) - (b.displayOrder || 99));
            setLandingPackages(mergedPkgs);
          } else {
            setLandingPackages(KERALA_SAMPLE_PACKAGES);
          }
        } else {
          setLandingPackages(KERALA_SAMPLE_PACKAGES);
        }
      } catch (e) {
        setLandingPackages(KERALA_SAMPLE_PACKAGES);
      }
    };

    loadDynamicData();
    window.addEventListener("storage", loadDynamicData);
    window.addEventListener("maides_doctors_updated", loadDynamicData);
    window.addEventListener("maides_hospitals_updated", loadDynamicData);
    window.addEventListener("maides_packages_updated", loadDynamicData);
    window.addEventListener("maides_specialties_updated", loadDynamicData);
    return () => {
      window.removeEventListener("storage", loadDynamicData);
      window.removeEventListener("maides_doctors_updated", loadDynamicData);
      window.removeEventListener("maides_hospitals_updated", loadDynamicData);
      window.removeEventListener("maides_packages_updated", loadDynamicData);
      window.removeEventListener("maides_specialties_updated", loadDynamicData);
    };
  }, []);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apptFullName.trim() || !apptEmail.trim()) return;

    const assignedHosp = apptHospital || landingHospitals[0]?.name || "Aster Medcity, Kochi";
    const assignedDoc = apptDoctor || landingDoctors[0]?.name || "Dr. K. S. Muralidharan";
    const selectedSpec = apptSpecialty || "Cardiology & Cardiac Surgery";
    const selectedSrv = apptService || "Specialist Clinical Consultation";
    const appointmentId = "APT-" + Math.floor(1000 + Math.random() * 9000);
    const caseId = "CAS-2026-0" + Math.floor(85 + Math.random() * 10);
    const now = new Date().toISOString().replace('T', ' ').substring(0, 16);

    const newEnq = {
      id: "ENQ-" + Math.floor(1000 + Math.random() * 9000),
      name: apptFullName.trim(),
      email: apptEmail.trim(),
      phone: apptPhone.trim() || "+971 50 123 4567",
      country: "International Patient",
      treatment: `${selectedSpec} — ${selectedSrv}`,
      specialty: selectedSpec,
      district: "Ernakulam / Kochi",
      budget: "$5,000",
      urgency: "HIGH",
      submittedAt: now,
      status: "NEW",
      assignedHospital: assignedHosp,
      notes: `Direct consultation request submitted from Homepage for ${assignedDoc} on ${apptDate} at ${apptTime}`
    };

    const newAppt = {
      id: appointmentId,
      patient: apptFullName.trim(),
      patientEmail: apptEmail.trim(),
      patientPhone: apptPhone.trim() || "+971 50 123 4567",
      patientCountry: "International Patient",
      caseId: caseId,
      specialty: selectedSpec,
      service: selectedSrv,
      hospital: assignedHosp,
      doctor: assignedDoc,
      type: "VIDEO_CONSULTATION",
      dateTime: `${apptDate} ${apptTime}`,
      preferredTime: apptTime,
      status: "REQUESTED",
      meetLink: `https://meet.google.com/xyz-maides-${Math.floor(100 + Math.random() * 900)}`,
      notes: `Landing page booking request: ${selectedSpec} / ${selectedSrv} (${apptPhone || "No Phone"})`,
      createdAt: now,
      updatedAt: now,
      consultationFeeUsd: 50,
      consultationFeeInr: 4200,
      history: [
        { status: "REQUESTED", timestamp: now, updatedBy: "Public Visitor", notes: "Submitted via Homepage Consultation Form" }
      ]
    };

    if (typeof window !== "undefined") {
      // 1. Enquiries Queue
      try {
        const existingEnq = localStorage.getItem("maides_admin_enquiries");
        const enqList = existingEnq ? JSON.parse(existingEnq) : [];
        const updatedEnqs = [newEnq, ...enqList.filter((e: any) => e.id !== newEnq.id)];
        localStorage.setItem("maides_admin_enquiries", JSON.stringify(updatedEnqs));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("maides_enquiries_updated", { detail: updatedEnqs }));
      } catch (err) {}

      // 2. Appointments Queue
      try {
        const existingAppt = localStorage.getItem("maides_admin_appointments");
        const apptList = existingAppt ? JSON.parse(existingAppt) : [];
        const updatedAppts = [newAppt, ...apptList.filter((a: any) => a.id !== newAppt.id)];
        localStorage.setItem("maides_admin_appointments", JSON.stringify(updatedAppts));
        window.dispatchEvent(new Event("storage"));
        window.dispatchEvent(new CustomEvent("maides_appointments_updated", { detail: updatedAppts }));
      } catch (err) {}
    }

    // Sync to Server APIs
    try {
      await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEnq)
      });
      await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAppt)
      });
    } catch (e) {}

    setApptSuccess(`Thank you ${apptFullName.trim()}! Your consultation request with ${assignedDoc} at ${assignedHosp} on ${apptDate} (${apptTime}) has been scheduled. Your MAIDES Clinical Coordinator will confirm your slot.`);
    setApptFullName("");
    setApptEmail("");
    setApptPhone("");
    setTimeout(() => setApptSuccess(""), 7000);
  };
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>("All");
  const [selectedRegion, setSelectedRegion] = useState<'All' | 'South Kerala' | 'Central Kerala' | 'North Kerala'>('All');
  
  // Interactive tab state for "Our Quality Service"
  const [activeQualityTab, setActiveQualityTab] = useState<number>(0);

  // FAQ state
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const qualityServices = [
    {
      id: "01",
      tabName: "Women’s Health.",
      title: "Maternity & Reproductive Health in Kerala",
      description: "Comprehensive fertility, gynecological surgery, and prenatal care coordinated with premier quaternary centers across Kerala.",
      icon: Heart,
      image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "02",
      tabName: "Medical Services.",
      title: "Quaternary Healthcare & Surgical Robotics",
      description: "State-of-the-art diagnostic imaging, Da Vinci robotic surgery, and dedicated international patient suites in Kochi and Trivandrum.",
      icon: Stethoscope,
      image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "03",
      tabName: "Specialized care.",
      title: "Comprehensive Oncology & Organ Transplants",
      description: "Precision TrueBeam radiotherapy, bone marrow transplants, and living-donor liver & renal transplantation with top survival rates.",
      icon: Microscope,
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=900&q=80"
    },
    {
      id: "04",
      tabName: "Orthopedics.",
      title: "Robotic Joint Replacement & Spine Care",
      description: "MAKO robotic sub-millimeter knee/hip arthroplasty, endoscopic spinal decompression, and backwater physiotherapy convalescence.",
      icon: Bone,
      image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=900&q=80"
    }
  ];

  // 10-Step Journey (Section 19: Workflow from Discover -> Enquire -> Follow Up)
  const journeySteps = [
    { num: "01", title: "Submit Medical Enquiry", desc: "Share your clinical requirement, symptoms, and travel window to Kerala." },
    { num: "02", title: "Share Medical Reports", desc: "Upload DICOM scans, lab reports, and prescriptions to your secure Medical Vault." },
    { num: "03", title: "MAIDES Review", desc: "Our clinical coordinators analyze your medical dossier with Kerala hospital boards." },
    { num: "04", title: "Provider Coordination", desc: "Direct matching with accredited chief surgeons, professors, or Ashtavaidya Vaidyas." },
    { num: "05", title: "Treatment Plan & Quote", desc: "Receive transparent hospital quotations comparing hospital stay, OT, and inclusions." },
    { num: "06", title: "Schedule Appointment", desc: "Confirm your hospital admission and pre-travel WebRTC video consultation." },
    { num: "07", title: "Plan Journey to Kerala", desc: "Official Kerala Medical eVisa invitation in 4 hours, flight booking & 5-star hotel." },
    { num: "08", title: "Airport VIP Assistance", desc: "Personal coordinator greets you at Cochin, Trivandrum, or Calicut airport gate." },
    { num: "09", title: "Hospital Treatment", desc: "Inpatient quaternary surgery or classical Panchakarma with full on-ground support." },
    { num: "10", title: "Follow-Up & Convalescence", desc: "Backwater resort recovery, fit-to-fly clearance, and 12-month tele-reviews." }
  ];

  // Dynamic available districts from all active hospitals
  const availableDistricts = React.useMemo(() => {
    const rawDistricts = Array.from(new Set(landingHospitals.map(h => h.district).filter(Boolean)));
    const corePriority = ["Ernakulam", "Thiruvananthapuram", "Kozhikode", "Kottayam", "Malappuram", "Thrissur", "Palakkad", "Alappuzha", "Kollam", "Kannur"];
    const ordered = ["All"];
    
    corePriority.forEach(d => {
      if (rawDistricts.some(rd => rd.toLowerCase().includes(d.toLowerCase())) && !ordered.includes(d)) {
        ordered.push(d);
      }
    });

    rawDistricts.forEach(d => {
      const cleanD = d.replace(" / Kochi", "");
      if (!ordered.some(o => o.toLowerCase() === cleanD.toLowerCase() || o.toLowerCase() === d.toLowerCase())) {
        ordered.push(d);
      }
    });

    return ordered;
  }, [landingHospitals]);

  const filteredHospitals = landingHospitals.filter((h) => {
    const hospDist = (h.district || "").toLowerCase();
    const selDist = selectedDistrict.toLowerCase();
    
    const matchesDistrict = selectedDistrict === "All" || 
      hospDist === selDist || 
      (selDist === "ernakulam" && (hospDist.includes("ernakulam") || hospDist.includes("kochi"))) ||
      (selDist === "thiruvananthapuram" && (hospDist.includes("thiruvananthapuram") || hospDist.includes("trivandrum"))) ||
      (selDist === "kozhikode" && (hospDist.includes("kozhikode") || hospDist.includes("calicut"))) ||
      hospDist.includes(selDist);

    const matchesSpecialty = selectedSpecialty === "All" || (h.specialties && (Array.isArray(h.specialties) ? h.specialties.some((s: string) => s.toLowerCase().includes(selectedSpecialty.toLowerCase())) : true));
    const matchesRegion = selectedRegion === "All" || h.region === selectedRegion;
    return matchesDistrict && matchesSpecialty && matchesRegion;
  });

  const filteredDistricts = KERALA_DISTRICTS.filter((d) => {
    return selectedRegion === "All" || d.region === selectedRegion;
  });

  // Section 11: Dynamic Medical Specialties from Admin

  // Section 36: Dynamic FAQs matching specification
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
      
      {/* 1. HERO SECTION (CINEMATIC WORLD-CLASS HEALTHCARE REDESIGN) */}
      <section className="relative min-h-[660px] lg:min-h-[840px] bg-gradient-to-br from-[#0A1628] via-[#102A54] to-[#071120] overflow-hidden pt-28 sm:pt-32 pb-16 sm:pb-20 flex items-center">
        
        {/* Interactive 360-Degree Particle Canvas */}
        <ParticleBackground360 />

        {/* Background Radial Glows & Grid Mesh */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 -left-32 w-80 sm:w-[500px] h-80 sm:h-[500px] rounded-full bg-[#0E82FD]/25 blur-[120px]" />
          <div className="absolute top-1/3 -right-20 w-80 sm:w-[550px] h-80 sm:h-[550px] rounded-full bg-[#38BDF8]/20 blur-[130px]" />
          <div className="absolute bottom-0 left-1/3 w-72 sm:w-[450px] h-72 sm:h-[450px] rounded-full bg-[#10B981]/15 blur-[100px]" />
          
          {/* Subtle Grid Accent */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:3rem_3rem] sm:bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            
            {/* Left Column: Eyebrow, Main Headline, Subtext, CTAs, Trust Grid */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7 text-white text-left z-20">
              
              {/* Eyebrow Pill with Pulse */}
              <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md shadow-inner">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#38BDF8]"></span>
                </span>
                <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-cyan-200 uppercase">
                  Kerala Medical Tourism Gateway • JCI & NABH Network
                </span>
              </div>

              {/* Main Headline */}
              <div className="space-y-3 sm:space-y-3.5">
                <h1 className="text-3xl sm:text-5xl lg:text-6xl xl:text-[66px] font-black text-white tracking-tight leading-[1.08] sm:leading-[1.04]">
                  World-Class Healthcare. <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-sky-200 to-emerald-300">
                    A Journey Designed
                  </span> <br />
                  Around You.
                </h1>
                <p className="text-xs sm:text-base text-blue-100/90 font-normal max-w-lg leading-relaxed">
                  Seamless medical travel coordination connecting international patients with accredited Kerala surgical directors, quaternary hospitals, and restorative Ayurveda backwater sanatoriums.
                </p>
              </div>

              {/* Action Buttons: 1 Primary CTA + 1 Secondary CTA */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
                <button
                  onClick={onOpenIntake}
                  className="px-7 sm:px-9 py-4 rounded-full bg-gradient-to-r from-[#0E82FD] via-blue-500 to-[#38BDF8] hover:from-blue-600 hover:to-cyan-400 text-white font-black text-xs sm:text-sm uppercase tracking-wider text-center shadow-xl shadow-blue-500/35 hover:shadow-blue-500/50 hover:scale-[1.03] transition-all duration-300 flex items-center justify-center space-x-2 cursor-pointer group"
                >
                  <span>Start Your Medical Journey</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#journey"
                  className="px-6 sm:px-7 py-4 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/25 font-bold text-xs sm:text-sm uppercase tracking-wider text-center backdrop-blur-md transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:scale-[1.03]"
                >
                  <span>Explore Pathway</span>
                  <ChevronRight className="w-4 h-4 text-cyan-300" />
                </a>
              </div>

              {/* 3 Glass Info Trust Credentials */}
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

              {/* Patient Trust Stats */}
              <div className="pt-2 border-t border-white/15 flex flex-wrap items-center gap-4 sm:gap-6">
                <div className="flex items-center -space-x-2.5 sm:-space-x-3">
                  <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80" alt="Specialist 1" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0F2042] object-cover ring-2 ring-blue-400/30" />
                  <img src="https://images.unsplash.com/photo-1622902046580-2b47f47f5471?auto=format&fit=crop&w=120&q=80" alt="Specialist 2" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0F2042] object-cover ring-2 ring-blue-400/30" />
                  <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80" alt="Specialist 3" className="w-10 h-10 sm:w-11 sm:h-11 rounded-full border-2 border-[#0F2042] object-cover ring-2 ring-blue-400/30" />
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] border-2 border-[#0F2042] flex items-center justify-center text-white text-[11px] sm:text-xs font-black ring-2 ring-blue-400/30">
                    500+
                  </div>
                </div>

                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-lg sm:text-xl font-black text-white">4.95 / 5.0</span>
                    <div className="flex text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                  </div>
                  <p className="text-[11px] sm:text-xs text-blue-200/90 font-medium">
                    Over 25,000+ international patients assisted across Kerala
                  </p>
                </div>
              </div>

            </div>

            {/* Right Column: Cinematic Doctor Visual Frame with Subtle Independent Floating Cards */}
            <div className="lg:col-span-6 relative flex justify-center items-center mt-6 lg:mt-0">
              
              {/* Outer Glowing Rings */}
              <div className="absolute w-[340px] h-[340px] sm:w-[460px] sm:h-[460px] lg:w-[560px] lg:h-[560px] rounded-full border border-blue-400/20 animate-[spin_45s_linear_infinite]" />
              <div className="absolute w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] lg:w-[460px] lg:h-[460px] rounded-full border border-sky-300/15 animate-[spin_35s_linear_infinite_reverse]" />

              {/* Main Cutout Doctor Frame with Subtle Breathing Motion */}
              <div className="relative z-10 w-full max-w-[320px] sm:max-w-[420px] rounded-t-[160px] sm:rounded-t-[200px] rounded-b-3xl bg-gradient-to-b from-blue-500/25 via-white/5 to-white/10 p-2 sm:p-2.5 backdrop-blur-xl border border-white/25 shadow-2xl overflow-hidden animate-float-slow">
                <div className="w-full h-[360px] sm:h-[460px] lg:h-[540px] rounded-t-[150px] sm:rounded-t-[190px] rounded-b-2xl overflow-hidden relative">
                  <img 
                    src={landingDoctors[0]?.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=1000&q=80"} 
                    alt={landingDoctors[0]?.name || "MAIDES Kerala Senior Specialist"} 
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A1628]/95 via-transparent to-transparent" />
                  
                  {/* Overlay Bottom Doctor Label */}
                  <div className="absolute bottom-3 left-3 right-3 sm:bottom-4 sm:left-4 sm:right-4 p-3 sm:p-3.5 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 text-white flex items-center justify-between">
                    <div className="min-w-0 pr-2">
                      <div className="text-xs font-black truncate">{landingDoctors[0]?.name || "Dr. Muralidharan V. Nair"}</div>
                      <div className="text-[10px] text-cyan-200 truncate">{landingDoctors[0]?.title || landingDoctors[0]?.specialty || "Senior Specialist Doctor"} • {landingDoctors[0]?.hospitalName || "Aster Medcity, Kochi"}</div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500 text-[10px] font-bold text-white flex items-center space-x-1 shrink-0 shadow-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      <span>Available</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Badge 1: Verified Experience (Moves Independently) */}
              <div className="absolute top-2 left-0 sm:-top-4 sm:-left-6 z-20 p-2.5 sm:p-3.5 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 flex items-center space-x-2.5 sm:space-x-3 animate-float-slow">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 flex items-center justify-center text-[#0E82FD] shadow-inner shrink-0">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2.5]" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-[#0F2042]">✓ Verified 20+ Years</div>
                  <div className="text-[9px] sm:text-[10px] font-semibold text-slate-500">Board-Certified Specialists</div>
                </div>
              </div>

              {/* Floating Badge 2: Real Cost Advantage (Reverse Float Motion) */}
              <div className="absolute bottom-6 left-0 sm:bottom-12 sm:-left-8 z-20 p-2.5 sm:p-3.5 rounded-2xl bg-[#0F2042]/95 backdrop-blur-xl shadow-2xl border border-white/20 text-white flex items-center space-x-2.5 sm:space-x-3 animate-float-reverse">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Sparkles className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div>
                  <div className="text-[11px] sm:text-xs font-black text-white">Up to 70% Savings</div>
                  <div className="text-[9px] sm:text-[10px] text-blue-200">vs UAE, UK & US Pricing</div>
                </div>
              </div>

              {/* Floating Badge 3: 4.9 Rating (Independent Motion) */}
              <div className="absolute top-1/2 right-0 sm:-right-8 -translate-y-1/2 z-20 p-3 rounded-2xl bg-white/95 backdrop-blur-xl shadow-2xl border border-slate-100 flex items-center space-x-2.5 hidden sm:flex animate-float-slow">
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

      {/* 2. INTRODUCTION TO MAIDES / ABOUT US (SECTION 10 & 4) */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center space-x-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">ABOUT MAIDES</span>
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F2042] tracking-tight leading-[1.18] sm:leading-[1.15]">
              Restoring Life Healing <br className="hidden sm:inline" />
              Care Hope in Kerala
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
              MAIDES simplifies the medical travel journey by bringing healthcare discovery, hospital coordination, and travel support together in one unified platform. We prioritize your comfort and safety at every stage.
            </p>

            <div className="space-y-4 sm:space-y-6 pt-1">
              <div className="flex items-start space-x-3.5 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E82FD] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-[#0F2042]">Professional & Trustworthy</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verified hospital partnerships across all 14 Kerala districts adhering to strict clinical ethics and transparent pricing.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3.5 sm:space-x-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#0E82FD] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="space-y-0.5 sm:space-y-1">
                  <h3 className="text-sm sm:text-base font-bold text-[#0F2042]">Personally Managed Support</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dedicated 24/7 care coordinators handling airport reception, language translation, hospital admissions, and family accommodation.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 sm:pt-4 flex items-center space-x-2">
              <button onClick={onOpenIntake} className="flex items-center space-x-2 group cursor-pointer">
                <div className="px-6 sm:px-7 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25">
                  About More
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0E82FD] group-hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative mt-4 sm:mt-0">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80" alt="Medical Team" className="w-full h-72 sm:h-[440px] object-cover" />
              </div>

              {/* Doctor Consultation Video Floating Preview */}
              <div className="absolute -top-4 -right-2 sm:-top-6 sm:-right-6 w-48 sm:w-80 rounded-2xl overflow-hidden shadow-xl border-2 sm:border-4 border-white bg-white">
                <div className="relative h-28 sm:h-48">
                  <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80" alt="Doctor Consultation Video" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-[#0E82FD] text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Doctor Badge */}
              <div className="relative sm:absolute sm:-bottom-6 sm:right-4 mt-3 sm:mt-0 p-3.5 sm:p-5 rounded-2xl bg-white shadow-xl border border-slate-100 space-y-1.5 sm:space-y-2 text-left">
                <div className="flex items-center space-x-1 text-[#0E82FD]">
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                </div>

                <div>
                  <h4 className="text-sm sm:text-base font-black text-[#0F2042]">{landingDoctors[0]?.name || "Dr. Muralidharan V. Nair"}</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium">{landingDoctors[0]?.title || landingDoctors[0]?.specialty || "Chief Cardiac Surgeon"} • {landingDoctors[0]?.hospitalName || "Aster Medcity, Kochi"}</p>
                </div>

                <div className="pt-1 flex items-center space-x-2 text-[11px] sm:text-xs font-bold text-[#0E82FD]">
                  <Phone className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <span>+91 (484) 290-8482</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. QUALITY MEDICAL SERVICES SECTION */}
      <section className="relative overflow-hidden pt-6 sm:pt-10 pb-4 sm:pb-6">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#D4E8FC] via-[#E2F0FE] to-[#EFF7FF] p-5 sm:p-14 max-w-7xl mx-auto shadow-xs">
          
          <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
            <div className="inline-flex items-center space-x-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">OUR QUALITY SERVICE</span>
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
            </div>

            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-[#0F2042] tracking-tight">
              Quality Medical Services <br />
              Delivered With Compassion.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            {/* Left Column: 4 Pill Selection Buttons */}
            <div className="lg:col-span-4 grid grid-cols-2 lg:grid-cols-1 gap-2.5 sm:gap-3.5">
              {qualityServices.map((srv, idx) => {
                const Icon = srv.icon;
                const isSelected = activeQualityTab === idx;
                return (
                  <button
                    key={srv.id}
                    onClick={() => setActiveQualityTab(idx)}
                    className={`w-full p-3 sm:p-4 rounded-2xl flex items-center space-x-3 sm:space-x-4 transition-all text-left shadow-xs cursor-pointer ${
                      isSelected
                        ? "bg-white border-2 border-[#0E82FD] shadow-md ring-2 ring-blue-100"
                        : "bg-white/90 hover:bg-white border border-slate-200/80 hover:border-blue-200"
                    }`}
                  >
                    <div className={`w-9 h-9 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-blue-50 text-[#0E82FD]" : "bg-slate-100 text-slate-600"
                    }`}>
                      <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#0E82FD]" />
                    </div>
                    <span className="text-xs sm:text-base font-bold text-[#0F2042] line-clamp-1 sm:line-clamp-none">
                      {srv.tabName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Solid Royal Blue Feature Banner */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl overflow-hidden shadow-xl bg-[#0E82FD] grid grid-cols-1 md:grid-cols-12 min-h-[340px] sm:min-h-[380px]">
                
                <div className="md:col-span-6 p-6 sm:p-10 text-white flex flex-col justify-between space-y-5 sm:space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-white text-[#0E82FD] flex items-center justify-center shadow-lg">
                      {React.createElement(qualityServices[activeQualityTab].icon, { className: "w-6 h-6 sm:w-7 sm:h-7 text-[#0E82FD]" })}
                    </div>
                    <span className="text-3xl sm:text-5xl font-black text-white/90">
                      {qualityServices[activeQualityTab].id}
                    </span>
                  </div>

                  <div className="space-y-2 sm:space-y-3">
                    <h3 className="text-xl sm:text-3xl font-black text-white leading-snug">
                      {qualityServices[activeQualityTab].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                      {qualityServices[activeQualityTab].description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenIntake}
                      className="inline-flex items-center space-x-2 text-white hover:text-blue-100 font-bold text-xs tracking-wider transition-all group cursor-pointer"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-white flex items-center justify-center group-hover:rotate-90 transition-transform">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                      <span className="underline underline-offset-4">Explore More</span>
                    </button>
                  </div>

                </div>

                <div className="md:col-span-6 relative h-48 sm:h-64 md:h-auto overflow-hidden">
                  <img 
                    src={qualityServices[activeQualityTab].image} 
                    alt={qualityServices[activeQualityTab].title}
                    className="w-full h-full object-cover" 
                  />
                </div>

              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3.5 360° INTERACTIVE VIRTUAL REALITY TOUR & HOSPITAL IMMERSION */}
      <section id="virtual-tour-360" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6 sm:pt-10">
        <VirtualTour360Viewer onBookConsultation={onOpenIntake} />
      </section>

      {/* 3.6 3D FLIGHT CORRIDOR TELEMETRY & 360° GLOBAL BENCHMARK CALCULATOR */}
      <section id="corridor-telemetry" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-8 sm:pt-12 space-y-12">
        <Kerala3DCorridorMap onOpenIntake={onOpenIntake} />
        <CostCalculator360 onOpenIntake={onOpenIntake} />
      </section>

      {/* 4. THE INTERACTIVE KERALA PATIENT JOURNEY PATHWAY */}
      <section id="journey" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4">
        <HorizontalJourneyTimeline onOpenIntake={onOpenIntake} />
      </section>

      {/* 5. 12 MEDICAL SPECIALTIES (SECTION 11) */}
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

      {/* 6. 14 KERALA DISTRICTS DIRECTORY (SECTION 15) */}
      <section id="destinations" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">14-District Network</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2042] mt-1">Medical Destinations Across Kerala</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Covering quaternary institutions across South, Central, and North Kerala.</p>
          </div>
          
          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {(['All', 'South Kerala', 'Central Kerala', 'North Kerala'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  selectedRegion === r ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {filteredDistricts.slice(0, 6).map((d) => (
            <div key={d.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="relative h-40 sm:h-44 overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0E82FD]">{d.region}</div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold">{d.hospitalsCount} Hospitals</div>
                </div>

                <div className="p-4 sm:p-5">
                  <h3 className="text-base font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors">{d.name}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{d.tagline}</p>
                  <div className="mt-3 sm:mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                    <span className="text-slate-500 block font-semibold">Specialties:</span>
                    <span className="text-slate-800 font-medium line-clamp-1">{d.topSpecialties.slice(0, 2).join(" • ")}</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 pt-0">
                <Link href="/destinations" className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-[#0E82FD] hover:text-white text-xs font-bold text-slate-800 flex items-center justify-center space-x-1.5 transition-all">
                  <span>Explore {d.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. AYURVEDA & PANCHAKARMA REJUVENATION (SECTION 62) */}
      <section id="ayurveda" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#0F2042] via-[#17468A] to-[#0E82FD] text-white p-5 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/20 text-xs font-bold">
                <Leaf className="w-3.5 h-3.5 text-blue-300" />
                <span>Authentic Ashtavaidya Healing • Kottakkal Lineage</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black leading-tight">
                Classical Panchakarma & Post-Surgical Convalescence
              </h2>

              <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                Kerala is the historic birthplace of classical Ayurveda. MAIDES coordinates genuine Panchakarma programs at prestigious institutions like Arya Vaidya Sala Kottakkal, paired with serene backwater recovery along the Vembanad and Ashtamudi lakes.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 pt-2 text-xs">
                <div className="p-3 sm:p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <strong className="block text-white mb-0.5 font-bold">Panchakarma Detox</strong>
                  <span className="text-blue-100 text-[11px]">14 to 21-day systemic rejuvenation</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <strong className="block text-white mb-0.5 font-bold">Joint & Spine Care</strong>
                  <span className="text-blue-100 text-[11px]">Pizhichil, Njavarakizhi, Kizhi</span>
                </div>
                <div className="p-3 sm:p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <strong className="block text-white mb-0.5 font-bold">Kumarakom Suites</strong>
                  <span className="text-blue-100 text-[11px]">Bedside nurse & organic diet</span>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={onOpenIntake} className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-[#0F2042] font-bold text-xs uppercase tracking-wider shadow-lg transition-all cursor-pointer text-center">
                  Explore Kerala Ayurveda Packages
                </button>
              </div>
            </div>

            <div className="lg:col-span-5 mt-4 lg:mt-0">
              <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img src="https://media.istockphoto.com/id/468945616/photo/woman-having-massage-with-pouch.jpg?s=612x612&w=0&k=20&c=_jL4fYTtDMnJ4_lqhL9m154AdeTSOfQ_aU3GYvuJpF4=" alt="Ayurveda Herbal Therapy" className="w-full h-56 sm:h-80 object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. KERALA ACCREDITED HOSPITALS (SECTION 13) */}
      <section id="hospitals" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">Verified Network</span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2042] mt-1">Kerala Accredited Hospitals</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Explore quaternary hospital campuses in Kochi, Trivandrum, Kottayam, Kozhikode, and Malappuram.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setCompareInitialHospitalId(filteredHospitals[0]?.id);
                setCompareModalOpen(true);
              }}
              className="px-4 py-2 rounded-full bg-slate-900 hover:bg-[#0E82FD] text-white text-xs font-bold transition-all shadow-sm flex items-center space-x-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Compare Hospitals Side-by-Side</span>
            </button>

            <div className="flex flex-wrap gap-1.5">
              {availableDistricts.map((dist) => (
                <button
                  key={dist}
                  onClick={() => setSelectedDistrict(dist)}
                  className={`px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    selectedDistrict === dist ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                  }`}
                >
                  {dist}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((h) => {
            const airportDistance = h.district?.includes("Ernakulam") || h.district?.includes("Kochi") 
              ? "25 min to COK Airport" 
              : h.district?.includes("Thiruvananthapuram") 
              ? "20 min to TRV Airport" 
              : h.district?.includes("Kozhikode") 
              ? "30 min to CCJ Airport" 
              : "Direct Highway Corridor";

            return (
              <div key={h.id} className="rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all duration-300 flex flex-col justify-between group">
                <div>
                  <div className="relative h-48 sm:h-52 overflow-hidden bg-slate-100">
                    <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    
                    {/* Top rating badge */}
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs text-slate-800 font-bold flex items-center space-x-1 shadow-md">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span>{h.rating} ({h.reviewCount})</span>
                    </div>

                    {/* Airport distance tag */}
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-bold flex items-center space-x-1 shadow-md">
                      <Plane className="w-3 h-3 text-cyan-300" />
                      <span>{airportDistance}</span>
                    </div>

                    {/* Accreditations bar */}
                    <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                      {h.accreditations.map((acc: string, i: number) => (
                        <span key={i} className="px-2.5 py-0.5 rounded-full bg-[#0E82FD] text-white text-[10px] font-bold shadow-sm">
                          {acc}
                        </span>
                      ))}
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

      {/* 9. DOCTOR SPECIALIST ROSTER (SECTION 14) */}
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

              <div className="pt-2 border-t border-slate-100">
                <button 
                  onClick={onOpenIntake}
                  className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-[#0E82FD] hover:text-white text-xs font-bold text-[#0E82FD] transition-all flex items-center justify-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <span>View Profile & Book</span>
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

      {/* 9.2 PREMIUM REAL PATIENT STORIES ("Real Patients. Real Journeys.") */}
      <section id="patient-stories" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-2.5 sm:space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2">
            <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">GLOBAL TESTIMONIALS</span>
            <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-[#0F2042] tracking-tight">
            Real Patients. Real Journeys.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            Hear from international patients who chose Kerala for precision robotic surgeries and authentic healing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              patient: "Tariq Al-Mansoor",
              city: "Dubai, UAE",
              flag: "🇦🇪",
              procedure: "Off-Pump Beating Heart Bypass (CABG)",
              hospital: "Aster Medcity, Kochi",
              surgeon: "Dr. Muralidharan V. Nair",
              quote: "The care at Aster Medcity was outstanding. From my VIP airport pickup at Cochin to the robotic bypass surgery, everything was flawless. I saved $85,000 compared to private treatment quotes in the UAE.",
              savings: "$85,000 Saved",
              avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80"
            },
            {
              patient: "Eleanor Vance",
              city: "London, UK",
              flag: "🇬🇧",
              procedure: "Bilateral Robotic Knee Replacement",
              hospital: "VPS Lakeshore Hospital, Kochi",
              surgeon: "Dr. Jacob Varghese",
              quote: "Instead of waiting 18 months on NHS lists, I flew to Kochi. Within 48 hours of surgery I was walking with sub-millimeter MAKO robotics. The 10-day backwater recovery in Kumarakom made it feel like a holiday.",
              savings: "Zero NHS Wait Time",
              avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80"
            },
            {
              patient: "Marcus Sterling",
              city: "Austin, Texas, USA",
              flag: "🇺🇸",
              procedure: "Minimally Invasive Spine & Panchakarma",
              hospital: "Rajagiri Hospital & Somatheeram",
              surgeon: "Dr. K. S. Muralidharan",
              quote: "Combining modern micro-discectomy with classical Ashtavaidya Panchakarma healed my chronic spinal stenosis. The transparency of MAIDES quotes gave my family total confidence from day one.",
              savings: "$68,000 Saved",
              avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80"
            }
          ].map((story, i) => (
            <div key={i} className="rounded-3xl bg-white border border-slate-200/90 p-6 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                
                {/* Header with Patient Flag & Procedure Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={story.avatar} alt={story.patient} className="w-12 h-12 rounded-full object-cover ring-2 ring-blue-100" />
                    <div>
                      <div className="text-sm font-bold text-[#0F2042] flex items-center space-x-1.5">
                        <span>{story.patient}</span>
                        <span title={story.city}>{story.flag}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium">{story.city}</span>
                    </div>
                  </div>
                </div>

                <div className="inline-block px-2.5 py-1 rounded-full bg-blue-50 text-[#0E82FD] font-bold text-[10px]">
                  {story.procedure}
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{story.quote}"
                </p>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-500 space-y-0.5">
                  <div><strong>Hospital:</strong> {story.hospital}</div>
                  <div><strong>Chief Surgeon:</strong> {story.surgeon}</div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[11px]">
                  ✓ {story.savings}
                </span>
                <button
                  onClick={onOpenIntake}
                  className="text-xs font-bold text-[#0E82FD] hover:underline flex items-center space-x-1 cursor-pointer"
                >
                  <span>Plan Similar Journey</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9.5 FEATURED ALL-INCLUSIVE KERALA TREATMENT PACKAGES */}
      <section id="packages" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 sm:mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">ALL-INCLUSIVE PACKAGES</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#0F2042] mt-1">Featured Kerala Treatment Packages</h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">Hospital stay, surgery, VIP airport transfers, recovery lodging & dedicated interpreter.</p>
          </div>
          
          <Link
            href="/packages"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0E82FD] hover:text-blue-700 transition-colors"
          >
            <span>View All Packages</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {landingPackages.slice(0, 6).map((pkg) => {
            const tierStyle = pkg.tier === "Platinum VIP" 
              ? "bg-amber-500 text-white" 
              : pkg.tier === "Ayurvedic Rejuvenation" 
                ? "bg-emerald-600 text-white" 
                : pkg.tier === "Value Accredited" 
                  ? "bg-teal-600 text-white" 
                  : "bg-[#0E82FD] text-white";

            return (
              <div key={pkg.id} className="card-3d-tilt rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-2xl hover:border-blue-300 transition-all flex flex-col justify-between group">
                <div>
                  <div className="relative h-44 sm:h-48 overflow-hidden">
                    <img 
                      src={pkg.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"} 
                      alt={pkg.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3">
                      <span className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] font-bold shadow-md ${tierStyle}`}>
                        {pkg.tier || "Premium Care"}
                      </span>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <div className="text-base sm:text-lg font-black leading-tight">{formatCurrency(pkg.priceUsd || 5000, "USD")}</div>
                      <div className="text-[10px] sm:text-[11px] text-blue-100 font-medium">₹{(pkg.priceInr || 437500).toLocaleString('en-IN')} • {pkg.durationDays || 7} Days Inpatient & Stay</div>
                    </div>
                  </div>

                  <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3">
                    <h3 className="text-base font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors line-clamp-1">{pkg.title}</h3>
                    
                    <div className="space-y-1 text-xs text-slate-600">
                      <div className="flex items-center space-x-1.5 font-medium text-slate-700">
                        <Building2 className="w-3.5 h-3.5 text-[#0E82FD] shrink-0" />
                        <span className="line-clamp-1">{pkg.hospitalName}</span>
                      </div>
                      {pkg.doctorName && (
                        <div className="flex items-center space-x-1.5 font-medium text-slate-500">
                          <Stethoscope className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="line-clamp-1">{pkg.doctorName}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1 text-[11px] text-slate-600">
                      {(pkg.inclusions || pkg.highlights || []).slice(0, 2).map((inc: string, i: number) => (
                        <div key={i} className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                          <span className="line-clamp-1">{inc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-4 sm:p-5 pt-0">
                  <button 
                    onClick={() => {
                      setApptHospital(pkg.hospitalName || "");
                      setApptDoctor(pkg.doctorName || "");
                      setApptSpecialty(pkg.treatmentName || "Cardiology & Bypass");
                      const apptSection = document.getElementById("booking-form");
                      if (apptSection) {
                        apptSection.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        onOpenIntake();
                      }
                    }} 
                    className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-[#0E82FD] hover:text-white text-xs font-bold text-[#0E82FD] transition-all flex items-center justify-center space-x-1.5 shadow-xs cursor-pointer"
                  >
                    <span>Book Package Consultation</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 sm:mt-8 text-center">
          <Link
            href="/packages"
            className="inline-flex items-center space-x-2 px-5 sm:px-6 py-3 rounded-xl bg-white hover:bg-blue-50 text-[#0E82FD] font-bold text-xs sm:text-sm border border-blue-200 shadow-xs hover:shadow transition-all group"
          >
            <span>Explore All Kerala All-Inclusive Packages</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS (SECTION 36) */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4 sm:pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-start">
          
          {/* Left Card */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200 p-5 sm:p-6 shadow-xl space-y-4 sm:space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80" 
                alt="Doctor on phone consultation" 
                className="w-full h-44 sm:h-56 object-cover"
              />
            </div>

            <div className="space-y-1.5 sm:space-y-2">
              <h3 className="text-base sm:text-lg font-black text-[#0F2042]">Have More Questions?</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                MAIDES coordinators provide personalized guidance on hospital selection, surgical estimates, medical visas, and accommodation in Kerala.
              </p>
            </div>

            <div className="pt-1 sm:pt-2">
              <button
                onClick={onOpenIntake}
                className="flex items-center space-x-2 group cursor-pointer"
              >
                <div className="px-5 sm:px-6 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/25">
                  Get Medical Assistance
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0E82FD] group-hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-md shadow-blue-500/25 group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Accordion Column */}
          <div className="lg:col-span-8 space-y-4 sm:space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2">
                <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">COMMON QUESTIONS</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-black text-[#0F2042] tracking-tight mt-1">
                Frequently Asked Questions <br />
                About Our Services
              </h2>
            </div>

            <div className="space-y-2.5 sm:space-y-3 pt-2">
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

        </div>
      </section>

      {/* 10.5 BOOK AN APPOINTMENT & EMERGENCY MEDICAL SERVICE CONTAINER */}
      <section id="booking-form" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left Card: Get Emergency Medical Service */}
          <div className="lg:col-span-4 relative rounded-3xl overflow-hidden min-h-[260px] sm:min-h-[380px] shadow-xl flex flex-col justify-end p-6 sm:p-8 text-white group">
            {/* Background Image with Deep Blue Overlay */}
            <img 
              src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80" 
              alt="Emergency Medical Doctors" 
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#081B38]/95 via-[#0E4B94]/60 to-transparent" />

            <div className="relative z-10 space-y-2 sm:space-y-3">
              <h3 className="text-xl sm:text-3xl font-black text-white leading-tight">
                Get Emergency<br />Medical Service
              </h3>
              <p className="text-xs sm:text-sm text-blue-100/90 leading-relaxed max-w-xs">
                Our Emergency and Critical Care Department is attention to patients conditions.
              </p>
            </div>
          </div>

          {/* Right Card: Book An Appointment Form Banner */}
          <div className="lg:col-span-8 relative rounded-3xl bg-gradient-to-br from-[#12396B] via-[#0F2D54] to-[#0A1D36] p-5 sm:p-10 shadow-xl overflow-hidden flex flex-col justify-between text-white">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Header Row */}
            <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5 sm:gap-2 mb-6 sm:mb-8 relative z-10">
              <h2 className="text-xl sm:text-3xl font-black text-white tracking-tight">
                Book An Appointment
              </h2>
              <p className="text-xs sm:text-sm text-blue-200/90 font-medium">
                Schedule an appointment to have emergency healthcare
              </p>
            </div>

            {apptSuccess && (
              <div className="mb-4 p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs sm:text-sm font-semibold flex items-center gap-3 relative z-10 animate-in fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>{apptSuccess}</span>
              </div>
            )}

            {/* 2-Column Responsive Appointment Input Form */}
            <form onSubmit={handleBookAppointment} className="space-y-3.5 sm:space-y-4 relative z-10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={apptFullName}
                    onChange={(e) => setApptFullName(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-blue-200/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:bg-white/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={apptEmail}
                    onChange={(e) => setApptEmail(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-blue-200/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] focus:bg-white/15 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Medical Specialty</label>
                  <select
                    value={apptSpecialty}
                    onChange={(e) => setApptSpecialty(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#163863] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] transition-all"
                  >
                    {landingSpecialties.map((spec) => (
                      <option key={spec.id || spec.name} value={spec.name || spec.title} className="bg-[#0F2D54] text-white">
                        {spec.name || spec.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Partner Hospital</label>
                  <select
                    value={apptHospital}
                    onChange={(e) => setApptHospital(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#163863] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] transition-all"
                  >
                    <option value="">First Available Hospital</option>
                    {landingHospitals.map((hosp) => (
                      <option key={hosp.id || hosp.name} value={hosp.name} className="bg-[#0F2D54] text-white">
                        {hosp.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Preferred Doctor</label>
                  <select
                    value={apptDoctor}
                    onChange={(e) => setApptDoctor(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#163863] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] transition-all"
                  >
                    <option value="">Department Chief</option>
                    {landingDoctors.map((doc) => (
                      <option key={doc.id || doc.name} value={doc.name} className="bg-[#0F2D54] text-white">
                        {doc.name} ({doc.specialty})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-3.5">
                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Preferred Date *</label>
                  <input
                    type="date"
                    required
                    value={apptDate}
                    onChange={(e) => setApptDate(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] transition-all [color-scheme:dark]"
                  />
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Preferred Time *</label>
                  <select
                    value={apptTime}
                    onChange={(e) => setApptTime(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-[#163863] border border-white/15 text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] transition-all"
                  >
                    <option value="10:00 IST" className="bg-[#0F2D54] text-white">10:00 AM IST (Morning Slot)</option>
                    <option value="11:30 IST" className="bg-[#0F2D54] text-white">11:30 AM IST (Late Morning)</option>
                    <option value="14:00 IST" className="bg-[#0F2D54] text-white">02:00 PM IST (Afternoon Slot)</option>
                    <option value="16:00 IST" className="bg-[#0F2D54] text-white">04:00 PM IST (Evening Telehealth)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] sm:text-[11px] font-bold text-blue-200 uppercase tracking-wider mb-1">Phone / WhatsApp</label>
                  <input
                    type="tel"
                    placeholder="+971 50 123 4567"
                    value={apptPhone}
                    onChange={(e) => setApptPhone(e.target.value)}
                    className="w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder-blue-200/60 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#0E82FD] transition-all"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full py-3.5 sm:py-4 px-6 rounded-xl bg-[#0E82FD] hover:bg-blue-500 text-white font-black text-xs sm:text-sm uppercase tracking-wider transition-all shadow-xl shadow-blue-500/30 flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
                >
                  <span>Request Specialist Appointment</span>
                </button>
              </div>
            </form>

          </div>

        </div>
      </section>

      {/* 11. HIGH-TRUST FINAL CLOSING CTA SECTION */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto py-8 sm:py-12">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#0F2042] via-[#163868] to-[#0A182F] text-white p-8 sm:p-14 shadow-2xl border border-white/15 overflow-hidden">
          
          {/* Background Ambient Glows */}
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

            {/* Trust Assurance Bullet Points */}
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

            {/* Action Buttons */}
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
          const apptSection = document.getElementById("booking-form");
          if (apptSection) {
            apptSection.scrollIntoView({ behavior: 'smooth' });
          } else {
            onOpenIntake();
          }
        }}
      />

    </div>
  );
}
