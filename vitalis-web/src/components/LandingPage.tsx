"use client";

import React, { useState } from "react";
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

interface LandingPageProps {
  onOpenIntake: () => void;
  onOpenConcierge: () => void;
}

export function LandingPage({ onOpenIntake, onOpenConcierge }: LandingPageProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>("All");
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

  const filteredHospitals = KERALA_HOSPITALS.filter((h) => {
    const matchesDistrict = selectedDistrict === "All" || h.district === selectedDistrict;
    const matchesSpecialty = selectedSpecialty === "All" || h.specialties.includes(selectedSpecialty);
    const matchesRegion = selectedRegion === "All" || h.region === selectedRegion;
    return matchesDistrict && matchesSpecialty && matchesRegion;
  });

  const filteredDistricts = KERALA_DISTRICTS.filter((d) => {
    return selectedRegion === "All" || d.region === selectedRegion;
  });

  // Section 11: 12 Medical Specialties
  const maidesSpecialties = [
    { icon: HeartPulse, title: "Cardiology & Bypass", desc: "Off-Pump CABG, TAVR, and pediatric cardiac surgery by senior directors.", count: "12 Specialists" },
    { icon: Activity, title: "Robotic Orthopaedics", desc: "MAKO robotic knee & anterior hip replacement with same-day ambulation.", count: "18 Specialists" },
    { icon: Microscope, title: "Comprehensive Oncology", desc: "TrueBeam radiation, surgical resection, and immunotherapy at RCC & Aster.", count: "15 Specialists" },
    { icon: Brain, title: "Neurology & Neurosurgery", desc: "Endoscopic skull base surgery, awake craniotomy, and robotic spine fusion.", count: "11 Specialists" },
    { icon: Leaf, title: "Classical Ayurveda", desc: "Authentic Ashtavaidya 14-21 day Panchakarma at Kottakkal Arya Vaidya Sala.", count: "24 Vaidyas" },
    { icon: Stethoscope, title: "Living-Donor Transplants", desc: "High-precision liver and kidney transplants with 96%+ survival record.", count: "9 Specialists" },
    { icon: Eye, title: "Ophthalmology", desc: "Advanced SMILE laser, robotic cataract, and vitreoretinal microsurgery.", count: "14 Specialists" },
    { icon: Syringe, title: "Fertility & IVF", desc: "ICSI, IMSI, blastocyst culture, and genetic screening with international protocols.", count: "8 Specialists" },
    { icon: Ambulance, title: "Gastroenterology", desc: "Therapeutic ERCP, endoscopic ultrasound, and advanced GI surgery.", count: "10 Specialists" },
    { icon: UserCheck, title: "Urology & Nephrology", desc: "Laser lithotripsy, robotic prostatectomy, and renal dialysis centers.", count: "12 Specialists" },
    { icon: Pill, title: "Dental Care", desc: "Full-mouth dental implants, digital smile design, and maxillofacial surgery.", count: "16 Specialists" },
    { icon: Palmtree, title: "Rehabilitation & Wellness", desc: "Backwater post-surgical physiotherapy, yoga, and holistic restorative care.", count: "20 Centers" }
  ];

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
      
      {/* 1. HERO SECTION (SPEC SECTION 9) */}
      <section className="relative min-h-[640px] lg:min-h-[720px] bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] overflow-hidden pt-28 pb-16 flex items-center">
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-1/4 right-10 w-96 h-96 rounded-full border border-white/40" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 rounded-full border border-white/30" />
          <div className="absolute bottom-10 left-10 w-80 h-80 rounded-full border border-white/20" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Eyebrow, Headline, Avatar Stat */}
            <div className="lg:col-span-4 space-y-6 text-white text-left z-20">
              <div className="space-y-2">
                <span className="text-xs font-bold tracking-wider text-blue-200 uppercase bg-white/10 px-3.5 py-1 rounded-full backdrop-blur-md inline-block">
                  MEDICAL TOURISM IN KERALA, INDIA
                </span>
                <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.08]">
                  Your Health Deserves <br />
                  <span className="text-white">the Right Journey</span>
                </h1>
              </div>

              <p className="text-xs sm:text-sm text-blue-100 font-medium max-w-sm leading-relaxed">
                Trusted healthcare coordination, personalised patient support and travel assistance for patients seeking medical care in Kerala.
              </p>

              <div className="pt-2 space-y-3">
                <div className="flex items-center -space-x-2">
                  <img src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=120&q=80" alt="Doctor 1" className="w-11 h-11 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1594824813581-2292f7b88496?auto=format&fit=crop&w=120&q=80" alt="Doctor 2" className="w-11 h-11 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=120&q=80" alt="Doctor 3" className="w-11 h-11 rounded-full border-2 border-white object-cover" />
                  <img src="https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=120&q=80" alt="Doctor 4" className="w-11 h-11 rounded-full border-2 border-white object-cover" />
                </div>

                <div>
                  <div className="text-3xl sm:text-4xl font-black text-white">220K+</div>
                  <p className="text-xs text-blue-100 font-medium max-w-xs mt-0.5">
                    Patients assisted worldwide across Kerala healthcare hubs.
                  </p>
                </div>
              </div>
            </div>

            {/* Center Column: Cutout Doctor Portrait with Arch */}
            <div className="lg:col-span-5 flex justify-center items-end relative min-h-[420px] lg:min-h-[560px]">
              <div className="relative z-10 w-full flex justify-center">
                <img 
                  src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80" 
                  alt="MAIDES Specialist Doctor" 
                  className="w-full max-w-[420px] h-[480px] lg:h-[580px] object-cover object-top drop-shadow-2xl rounded-t-full border-b-0 border-4 border-white/20"
                />
              </div>
            </div>

            {/* Right Column: Actions (CTAs from Section 9) */}
            <div className="lg:col-span-3 space-y-5 text-white text-left lg:pl-4 z-20">
              <div className="space-y-3">
                {/* Primary CTA: GET MEDICAL ASSISTANCE */}
                <button onClick={onOpenIntake} className="w-full flex items-center justify-between p-1.5 rounded-full bg-white hover:bg-slate-100 text-[#0F2042] font-bold text-xs uppercase tracking-wider transition-all shadow-xl group">
                  <span className="pl-4">Get Medical Assistance</span>
                  <div className="w-9 h-9 rounded-full bg-[#0E82FD] text-white flex items-center justify-center transition-all group-hover:rotate-45 shrink-0">
                    <ArrowUpRight className="w-4 h-4 text-white" />
                  </div>
                </button>

                {/* Secondary CTA: EXPLORE TREATMENTS */}
                <a href="#treatments" className="w-full block py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider text-center border border-white/20 transition-all">
                  Explore Treatments
                </a>

                {/* Additional CTA: CHAT ON WHATSAPP */}
                <a 
                  href="https://wa.me" 
                  target="_blank" 
                  rel="noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider text-center shadow-lg transition-all"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>

              <div className="pt-4 border-t border-white/15 flex items-center space-x-3 text-xs text-blue-200">
                <div className="w-6 h-6 rounded-full bg-white/15 flex items-center justify-center font-bold text-white text-[10px]">
                  ✓
                </div>
                <span>JCI & NABH Accredited Kerala Hospitals</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. INTRODUCTION TO MAIDES / ABOUT US (SECTION 10 & 4) */}
      <section id="about" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">ABOUT MAIDES</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-[#0F2042] tracking-tight leading-[1.15]">
              Restoring Life Healing <br />
              Care Hope in Kerala
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed font-normal">
              MAIDES simplifies the medical travel journey by bringing healthcare discovery, hospital coordination, and travel support together in one unified platform. We prioritize your comfort and safety at every stage.
            </p>

            <div className="space-y-6 pt-2">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#0E82FD] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <Award className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F2042]">Professional & Trustworthy</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Verified hospital partnerships across all 14 Kerala districts adhering to strict clinical ethics and transparent pricing.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#0E82FD] text-white flex items-center justify-center shadow-md shadow-blue-500/25 shrink-0">
                  <Heart className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-[#0F2042]">Personally Managed Support</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Dedicated 24/7 care coordinators handling airport reception, language translation, hospital admissions, and family accommodation.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex items-center space-x-2">
              <button onClick={onOpenIntake} className="flex items-center space-x-2 group">
                <div className="px-7 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25">
                  About More
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0E82FD] group-hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          <div className="lg:col-span-6 relative">
            <div className="relative">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=900&q=80" alt="Medical Team" className="w-full h-[440px] object-cover" />
              </div>

              <div className="absolute -top-6 -right-4 sm:-right-6 w-64 sm:w-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <div className="relative h-44 sm:h-48">
                  <img src="https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=600&q=80" alt="Doctor Consultation Video" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <div className="w-12 h-12 rounded-full bg-[#0E82FD] text-white flex items-center justify-center shadow-lg shadow-blue-500/40 hover:scale-110 transition-transform cursor-pointer">
                      <Play className="w-5 h-5 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="absolute -bottom-6 right-0 sm:right-4 p-5 rounded-2xl bg-white shadow-2xl border border-slate-100 space-y-2 text-left">
                <div className="flex items-center space-x-1 text-[#0E82FD]">
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <Star className="w-3.5 h-3.5 fill-[#0E82FD]" />
                </div>

                <div>
                  <h4 className="text-base font-black text-[#0F2042]">Dr. Muralidharan V. Nair</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Chief Cardiac Surgeon • Aster Medcity, Kochi</p>
                </div>

                <div className="pt-1 flex items-center space-x-2 text-xs font-bold text-[#0E82FD]">
                  <Phone className="w-3.5 h-3.5 fill-[#0E82FD]" />
                  <span>+91 (484) 290-8482</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. QUALITY MEDICAL SERVICES SECTION */}
      <section className="relative overflow-hidden pt-10 pb-6">
        <div className="relative rounded-3xl bg-gradient-to-b from-[#D4E8FC] via-[#E2F0FE] to-[#EFF7FF] p-8 sm:p-14 max-w-7xl mx-auto shadow-sm">
          
          <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
            <div className="inline-flex items-center space-x-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">OUR QUALITY SERVICE</span>
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-[#0F2042] tracking-tight">
              Quality Medical Services <br />
              Delivered With Compassion.
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: 4 Pill Selection Buttons */}
            <div className="lg:col-span-4 space-y-3.5">
              {qualityServices.map((srv, idx) => {
                const Icon = srv.icon;
                const isSelected = activeQualityTab === idx;
                return (
                  <button
                    key={srv.id}
                    onClick={() => setActiveQualityTab(idx)}
                    className={`w-full p-4 rounded-2xl flex items-center space-x-4 transition-all text-left shadow-sm ${
                      isSelected
                        ? "bg-white border-2 border-[#0E82FD] shadow-md ring-2 ring-blue-100"
                        : "bg-white/90 hover:bg-white border border-slate-200/80 hover:border-blue-200"
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-blue-50 text-[#0E82FD]" : "bg-slate-100 text-slate-600"
                    }`}>
                      <Icon className="w-5 h-5 text-[#0E82FD]" />
                    </div>
                    <span className="text-base font-bold text-[#0F2042]">
                      {srv.tabName}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Right Column: Solid Royal Blue Feature Banner */}
            <div className="lg:col-span-8">
              <div className="rounded-3xl overflow-hidden shadow-2xl bg-[#0E82FD] grid grid-cols-1 md:grid-cols-12 min-h-[380px]">
                
                <div className="md:col-span-6 p-8 sm:p-10 text-white flex flex-col justify-between space-y-6">
                  
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-full bg-white text-[#0E82FD] flex items-center justify-center shadow-lg">
                      {React.createElement(qualityServices[activeQualityTab].icon, { className: "w-7 h-7 text-[#0E82FD]" })}
                    </div>
                    <span className="text-4xl sm:text-5xl font-black text-white/90">
                      {qualityServices[activeQualityTab].id}
                    </span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-2xl sm:text-3xl font-black text-white leading-snug">
                      {qualityServices[activeQualityTab].title}
                    </h3>
                    <p className="text-xs sm:text-sm text-blue-100 leading-relaxed font-normal">
                      {qualityServices[activeQualityTab].description}
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={onOpenIntake}
                      className="inline-flex items-center space-x-2 text-white hover:text-blue-100 font-bold text-xs tracking-wider transition-all group"
                    >
                      <div className="w-8 h-8 rounded-full border-2 border-dashed border-white flex items-center justify-center group-hover:rotate-90 transition-transform">
                        <ArrowRight className="w-4 h-4 text-white" />
                      </div>
                      <span className="underline underline-offset-4">Explore More</span>
                    </button>
                  </div>

                </div>

                <div className="md:col-span-6 relative h-64 md:h-auto overflow-hidden">
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

      {/* 4. THE 10-STEP KERALA PATIENT JOURNEY (SECTION 19 & 2) */}
      <section id="journey" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-4">
        <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8 sm:p-12 space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">Seamless Coordination</span>
              <h2 className="text-3xl font-black text-[#0F2042] mt-1">How Your MAIDES Journey Works</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">From initial enquiry to return home, every step is coordinated by our dedicated healthcare desk.</p>
            </div>
            <button onClick={onOpenIntake} className="px-5 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all shrink-0">
              Start Step 01 Now
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {journeySteps.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:bg-blue-50/60 hover:border-[#0E82FD] transition-all flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-[#0E82FD]">{s.num}</span>
                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300 group-hover:bg-[#0E82FD] transition-colors" />
                  </div>
                  <h3 className="text-sm font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors mb-1.5">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. 12 MEDICAL SPECIALTIES (SECTION 11) */}
      <section id="treatments" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Clinical Disciplines
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">
            Comprehensive Medical Specialties in Kerala
          </h2>
          <p className="text-sm text-slate-600">
            Explore advanced surgical disciplines and holistic healing options coordinated across our verified network.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {maidesSpecialties.map((dept, idx) => {
            const Icon = dept.icon;
            return (
              <div key={idx} className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#0E82FD] transition-all group flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#0E82FD] group-hover:bg-[#0E82FD] group-hover:text-white transition-all flex items-center justify-center">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
                      {dept.count}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors mb-2">
                    {dept.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {dept.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <button onClick={onOpenIntake} className="text-xs font-bold text-[#0E82FD] group-hover:text-blue-700 flex items-center space-x-1">
                    <span>Request Assistance</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] text-slate-400">JCI / NABH</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. 14 KERALA DISTRICTS DIRECTORY (SECTION 15) */}
      <section id="destinations" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">14-District Network</span>
            <h2 className="text-3xl font-black text-[#0F2042] mt-1">Medical Destinations Across Kerala</h2>
            <p className="text-sm text-slate-600 mt-1">Covering quaternary institutions across South, Central, and North Kerala.</p>
          </div>
          
          <div className="flex gap-2">
            {(['All', 'South Kerala', 'Central Kerala', 'North Kerala'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setSelectedRegion(r)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedRegion === r ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredDistricts.slice(0, 6).map((d) => (
            <div key={d.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img src={d.image} alt={d.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-[#0E82FD]">{d.region}</div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-slate-900/80 text-white text-[10px] font-bold">{d.hospitalsCount} Hospitals</div>
                </div>

                <div className="p-5">
                  <h3 className="text-base font-bold text-[#0F2042] group-hover:text-[#0E82FD] transition-colors">{d.name}</h3>
                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed">{d.tagline}</p>
                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1">
                    <span className="text-slate-500 block font-semibold">Specialties:</span>
                    <span className="text-slate-800 font-medium">{d.topSpecialties.slice(0, 2).join(" • ")}</span>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
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
      <section id="ayurveda" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="rounded-3xl bg-gradient-to-br from-[#0F2042] via-[#17468A] to-[#0E82FD] text-white p-8 sm:p-12 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-blue-200 border border-white/20 text-xs font-bold">
                <Leaf className="w-3.5 h-3.5 text-blue-300" />
                <span>Authentic Ashtavaidya Healing • Kottakkal Lineage</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black leading-tight">
                Classical Panchakarma & Post-Surgical Convalescence
              </h2>

              <p className="text-sm text-blue-100 leading-relaxed font-normal">
                Kerala is the historic birthplace of classical Ayurveda. MAIDES coordinates genuine Panchakarma programs at prestigious institutions like Arya Vaidya Sala Kottakkal, paired with serene backwater recovery along the Vembanad and Ashtamudi lakes.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <strong className="block text-white mb-0.5 font-bold">Panchakarma Detox</strong>
                  <span className="text-blue-100 text-[11px]">14 to 21-day systemic rejuvenation</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <strong className="block text-white mb-0.5 font-bold">Joint & Spine Care</strong>
                  <span className="text-blue-100 text-[11px]">Pizhichil, Njavarakizhi, Kizhi</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white/10 border border-white/10">
                  <strong className="block text-white mb-0.5 font-bold">Kumarakom Suites</strong>
                  <span className="text-blue-100 text-[11px]">Bedside nurse & organic diet</span>
                </div>
              </div>

              <div className="pt-2">
                <button onClick={onOpenIntake} className="px-6 py-3.5 rounded-xl bg-white hover:bg-blue-50 text-[#0F2042] font-bold text-xs uppercase tracking-wider shadow-lg transition-all">
                  Explore Kerala Ayurveda Packages
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
                <img src="https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=800&q=80" alt="Ayurveda Herbal Therapy" className="w-full h-80 object-cover" />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 8. KERALA ACCREDITED HOSPITALS (SECTION 13) */}
      <section id="hospitals" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">Verified Network</span>
            <h2 className="text-3xl font-black text-[#0F2042] mt-1">Kerala Accredited Hospitals</h2>
            <p className="text-sm text-slate-600 mt-1">Explore quaternary hospital campuses in Kochi, Trivandrum, Kottayam, Kozhikode, and Malappuram.</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {["All", "Ernakulam / Kochi", "Thiruvananthapuram", "Kozhikode", "Kottayam", "Malappuram"].map((dist) => (
              <button
                key={dist}
                onClick={() => setSelectedDistrict(dist)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  selectedDistrict === dist ? "bg-[#0E82FD] text-white shadow-md shadow-blue-500/20" : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
                }`}
              >
                {dist}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHospitals.map((h) => (
            <div key={h.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-300 transition-all flex flex-col justify-between group">
              <div>
                <div className="relative h-48 overflow-hidden">
                  <img src={h.image} alt={h.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-md text-xs text-slate-800 font-bold flex items-center space-x-1 shadow-md">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{h.rating} ({h.reviewCount})</span>
                  </div>
                  <div className="absolute bottom-3 left-3 flex gap-1.5 flex-wrap">
                    {h.accreditations.map((acc, i) => (
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
                  <div className="pt-2 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-[#0E82FD] shrink-0" />
                      <span className="line-clamp-1">{h.internationalServices[0]}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <button onClick={onOpenIntake} className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-[#0E82FD] hover:text-white text-xs font-bold text-[#0E82FD] transition-all flex items-center justify-center space-x-2 shadow-sm">
                  <span>Select Hospital for Case Review</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. DOCTOR SPECIALIST ROSTER (SECTION 14) */}
      <section id="doctors" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="text-center max-w-3xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD] bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            Medical Specialists
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042]">
            Verified Senior Clinicians in Kerala
          </h2>
          <p className="text-sm text-slate-600">
            Chief surgeons and senior physicians with international qualifications (FRCS, American Board, AIIMS, Ashtavaidya).
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {KERALA_DOCTORS.map((doc) => (
            <div key={doc.id} className="rounded-3xl bg-white border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl hover:border-[#0E82FD] transition-all p-5 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden h-44">
                  <img src={doc.avatar} alt={doc.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-white/95 backdrop-blur-md text-[10px] font-bold text-slate-800 flex items-center space-x-1">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                    <span>{doc.rating}</span>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0F2042]">{doc.name}</h3>
                  <p className="text-[11px] text-[#0E82FD] font-semibold">{doc.title}</p>
                  <p className="text-[10px] text-slate-500 mt-1">{doc.hospitalName} • {doc.district}</p>
                </div>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600 space-y-1">
                  <div><strong>Qualifications:</strong> {doc.qualifications}</div>
                  <div><strong>Experience:</strong> {doc.experienceYears}+ Years</div>
                </div>
              </div>

              <button 
                onClick={onOpenIntake}
                className="w-full py-2.5 rounded-xl bg-blue-50 hover:bg-[#0E82FD] hover:text-white text-xs font-bold text-[#0E82FD] transition-all flex items-center justify-center space-x-1"
              >
                <span>Request Appointment</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FREQUENTLY ASKED QUESTIONS (SECTION 36) */}
      <section id="faq" className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto pt-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Card */}
          <div className="lg:col-span-4 rounded-3xl bg-white border border-slate-200 p-6 shadow-xl space-y-6">
            <div className="rounded-2xl overflow-hidden shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80" 
                alt="Doctor on phone consultation" 
                className="w-full h-56 object-cover"
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-black text-[#0F2042]">Have More Questions?</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                MAIDES coordinators provide personalized guidance on hospital selection, surgical estimates, medical visas, and accommodation in Kerala.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={onOpenIntake}
                className="flex items-center space-x-2 group"
              >
                <div className="px-6 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md shadow-blue-500/25">
                  Get Medical Assistance
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0E82FD] group-hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-md shadow-blue-500/25 group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          {/* Right Accordion Column */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="inline-flex items-center space-x-2">
                <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">COMMON QUESTIONS</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-[#0F2042] tracking-tight mt-1">
                Frequently Asked Questions <br />
                About Our Services
              </h2>
            </div>

            <div className="space-y-3 pt-2">
              {screenshotFaqs.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`rounded-2xl transition-all border ${
                    activeFaq === idx 
                      ? "bg-blue-50/70 border-blue-200 shadow-sm" 
                      : "bg-white border-slate-200 hover:border-blue-200"
                  }`}
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between font-bold text-sm text-[#0F2042] hover:text-[#0E82FD] transition-colors"
                  >
                    <span className={activeFaq === idx ? "text-[#0E82FD]" : "text-[#0F2042]"}>
                      {faq.q}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-transform ${activeFaq === idx ? "bg-[#0E82FD] text-white" : "bg-slate-100 text-slate-500"}`}>
                      {activeFaq === idx ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {activeFaq === idx && (
                    <div className="px-5 pb-5 pt-0 text-xs text-slate-600 leading-relaxed font-normal">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 11. "HEALTH SUPPORT FROM EXPERT DOCTORS" BANNER */}
      <section className="relative overflow-hidden pt-12 pb-0">
        <div className="relative rounded-t-[48px] bg-gradient-to-b from-[#D4E8FC] via-[#B9DCFE] to-[#0E82FD] pt-16 pb-0 px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="absolute top-12 left-6 lg:left-16 w-24 h-24 lg:w-32 lg:h-32 opacity-80 pointer-events-none animate-pulse">
            <img src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=300&q=80" alt="Molecule blue" className="w-full h-full object-cover rounded-full mix-blend-multiply" />
          </div>
          <div className="absolute top-12 right-6 lg:right-16 w-24 h-24 lg:w-32 lg:h-32 opacity-80 pointer-events-none animate-pulse">
            <img src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?auto=format&fit=crop&w=300&q=80" alt="Molecule red" className="w-full h-full object-cover rounded-full hue-rotate-180 mix-blend-multiply" />
          </div>

          <div className="max-w-4xl mx-auto space-y-4 relative z-10">
            <div className="inline-flex items-center space-x-2">
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">GET IN TOUCH</span>
              <span className="w-2.5 h-1.5 rounded-full bg-[#0E82FD]" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-[#0F2042] tracking-tight">
              Health Support From Expert <br />
              Doctors
            </h2>

            <div className="pt-2 flex justify-center">
              <button
                onClick={onOpenIntake}
                className="flex items-center space-x-2 group"
              >
                <div className="px-7 py-3 rounded-full bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-lg shadow-blue-500/25">
                  Get Medical Assistance
                </div>
                <div className="w-10 h-10 rounded-full bg-[#0E82FD] group-hover:bg-blue-600 text-white flex items-center justify-center transition-all shadow-lg shadow-blue-500/25 group-hover:rotate-45">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto mt-12 relative flex justify-center items-end">
            <div className="absolute inset-0 flex justify-center pointer-events-none">
              <div className="w-[600px] sm:w-[780px] h-[300px] sm:h-[390px] rounded-t-full border border-white/60 absolute bottom-0" />
              <div className="w-[450px] sm:w-[580px] h-[225px] sm:h-[290px] rounded-t-full border border-white/80 absolute bottom-0" />
            </div>

            <div className="absolute top-2 left-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white text-[#0E82FD] shadow-xl flex items-center justify-center font-bold z-20">
              <Heart className="w-5 h-5 fill-[#0E82FD]" />
            </div>
            <div className="absolute top-16 left-1/4 w-11 h-11 rounded-full bg-white text-[#0E82FD] shadow-xl flex items-center justify-center font-bold z-20">
              <Activity className="w-5 h-5" />
            </div>
            <div className="absolute top-16 right-1/4 w-11 h-11 rounded-full bg-white text-[#0E82FD] shadow-xl flex items-center justify-center font-bold z-20">
              <Eye className="w-5 h-5" />
            </div>
            <div className="absolute bottom-16 left-8 sm:left-16 w-11 h-11 rounded-full bg-white text-[#0E82FD] shadow-xl flex items-center justify-center font-bold z-20">
              <Brain className="w-5 h-5" />
            </div>
            <div className="absolute bottom-16 right-8 sm:right-16 w-11 h-11 rounded-full bg-white text-[#0E82FD] shadow-xl flex items-center justify-center font-bold z-20">
              <Bone className="w-5 h-5" />
            </div>

            <div className="relative z-10 w-full max-w-3xl flex justify-center -mb-1">
              <img 
                src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=1200&q=80" 
                alt="Medical Team Thumbs Up" 
                className="w-full max-h-[380px] sm:max-h-[440px] object-cover object-top drop-shadow-2xl rounded-t-3xl"
              />
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
