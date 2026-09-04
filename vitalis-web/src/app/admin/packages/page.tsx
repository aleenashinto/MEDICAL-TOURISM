"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Layers, 
  Search, 
  Plus, 
  Building2, 
  Stethoscope, 
  Clock, 
  DollarSign, 
  Tag, 
  CheckCircle2,
  Star,
  Edit,
  Trash2,
  Eye,
  X,
  AlertTriangle,
  Upload,
  ArrowUpDown,
  Filter,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Plane,
  Home,
  ShieldCheck,
  Calendar,
  Percent,
  Sparkles,
  Award,
  BookOpen
} from "lucide-react";
import Link from "next/link";

export interface PackageOffer {
  id: string;
  title: string;
  tier: "Platinum VIP" | "Premium Care" | "Value Accredited" | "Ayurvedic Rejuvenation";
  treatmentName: string;
  specialty?: string;
  hospitalName: string;
  doctorName: string;
  district: string;
  city: string;
  priceUsd: number;
  priceInr: number;
  durationDays: number;
  recoveryDays?: number;
  highlights: string[];
  inclusions: string[];
  exclusions?: string[];
  accommodationType?: string;
  transportType?: string;
  recommendedFor?: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  published: "PUBLISHED" | "DRAFT";
  image?: string;
  taxIncluded?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

const INITIAL_PACKAGES: PackageOffer[] = [
  {
    id: "PKG-001",
    title: "Kochi Platinum Beating-Heart Cardiac Care Journey",
    tier: "Platinum VIP",
    treatmentName: "Off-Pump Coronary Artery Bypass (CABG)",
    specialty: "Cardiology & Cardiac Surgery",
    hospitalName: "Aster Medcity, Kochi",
    doctorName: "Dr. Muralidharan V. Nair",
    district: "Ernakulam / Kochi",
    city: "Kochi, Kerala",
    priceUsd: 7400,
    priceInr: 650000,
    durationDays: 14,
    recoveryDays: 10,
    highlights: [
      "Minimally Invasive Beating-Heart CABG by Senior Director Dr. Nair",
      "Presidential Waterfront Inpatient Suite with Attendant Bed & Halal Dining",
      "Fast-Track Kerala Medical eVisa Invitation Letter in 4 Hours",
      "7-Night 5-Star Backwater Resort Stay Post-Discharge (Grand Hyatt Kochi)",
      "VIP Airport Limousine Chauffeur from Cochin International Airport (COK)",
      "12 Months Complimentary Telemedicine Follow-Up"
    ],
    inclusions: [
      "Complete pre-op investigations (Coronary Angiogram, 2D Echo, Blood Panels)",
      "Surgery charges, OT fees, surgeon & cardiac anesthesia fees, ICU stay (2 nights)",
      "Inpatient stay (4 nights) in Super Deluxe Suite",
      "Airport transfers & daily hospital shuttle in private Mercedes / Innova Crysta",
      "Dedicated native Arabic / French medical coordinator",
      "Local 5G SIM/eSIM, local payment assistance & forex coordination"
    ],
    exclusions: [
      "International flight airfare",
      "Emergency blood transfusion units if beyond standard reserves",
      "Personal telephone calls and outside hotel laundry"
    ],
    accommodationType: "5-Star Waterfront Presidential Suite & Grand Hyatt Convalescence",
    transportType: "Private Mercedes Benz / Innova Crysta Limousine Transfer",
    recommendedFor: "International and NRI patients seeking top US/UK-trained surgical masters with luxury Kerala backwater convalescence.",
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    taxIncluded: true
  },
  {
    id: "PKG-002",
    title: "Authentic 21-Day Kottakkal Classical Panchakarma Sanctuary",
    tier: "Ayurvedic Rejuvenation",
    treatmentName: "Authentic 21-Day Panchakarma Detox",
    specialty: "Classical Ayurveda & Panchakarma",
    hospitalName: "Arya Vaidya Sala Kottakkal",
    doctorName: "Aryavaidyan Dr. K. M. Namboothiri",
    district: "Malappuram",
    city: "Kottakkal, Kerala",
    priceUsd: 2800,
    priceInr: 245000,
    durationDays: 21,
    recoveryDays: 7,
    highlights: [
      "Complete 5-fold Panchakarma administered by hereditary Ashtavaidya physicians",
      "Private Heritage Cottage Stay in peaceful medicinal herbal garden campus",
      "Daily 2-therapist herbal oil therapies (Pizhichil, Shirodhara, Kizhi)",
      "Calicut International Airport (CCJ) Private Meet & Greet Chauffeur (18 km)",
      "Customized organic farm-to-table Ayurvedic dietary regimen"
    ],
    inclusions: [
      "Initial and daily Ayurvedic diagnostic consultations & Nadi Pariksha",
      "All internal medicines and external herbal therapeutic oils",
      "21-night full-board cottage accommodation and all Sattvic meals",
      "Daily yoga & pranayama sessions with master instructors",
      "Post-discharge 3-month herbal medication supply couriered home"
    ],
    exclusions: [
      "Allopathic MRI/CT diagnostics if requested separately",
      "Personal sightseeing excursions"
    ],
    accommodationType: "Traditional Heritage Ayurvedic Cottage (Full Board)",
    transportType: "Private Air-Conditioned Sedan Airport Transfer (CCJ)",
    recommendedFor: "Discerning patients seeking authentic, unadulterated Ayurvedic healing for arthritis, spine disorders, and cellular rejuvenation.",
    displayOrder: 2,
    status: "ACTIVE",
    published: "PUBLISHED",
    image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=1200&q=80",
    taxIncluded: true
  },
  {
    id: "PKG-003",
    title: "Rajagiri MAKO Robotic Bilateral Knee Restoration",
    tier: "Premium Care",
    treatmentName: "Robotic Total Knee Replacement",
    specialty: "Orthopaedics & Joint Replacement",
    hospitalName: "Rajagiri Hospital, Aluva",
    doctorName: "Dr. Alexander K. George",
    district: "Ernakulam / Kochi",
    city: "Aluva, Kochi",
    priceUsd: 5400,
    priceInr: 475000,
    durationDays: 12,
    recoveryDays: 14,
    highlights: [
      "Bilateral Simultaneous Knee Replacement with MAKO Robotic Arm",
      "US FDA-approved Stryker Triathlon titanium implants",
      "Private Deluxe Room with dedicated physiotherapist twice daily",
      "Airport Pickup from Cochin International Airport (15 minutes away)",
      "5-Night recuperation stay in luxury boutique partner hotel"
    ],
    inclusions: [
      "All surgical, anesthesia, robotic calibration & implant costs",
      "4 nights inpatient hospital stay + 5 nights partner resort stay",
      "Comprehensive pre-op CT mapping & blood tests",
      "Customized daily physical rehabilitation sessions",
      "Complimentary walker, crutches & knee braces kit"
    ],
    exclusions: [
      "Unrelated co-morbidity ICU management",
      "Extra attendant personal meals"
    ],
    accommodationType: "Deluxe Single Hospital Room + 4-Star Hotel Convalescence",
    transportType: "Private Hospital Chauffeured Vehicle",
    recommendedFor: "Patients with severe osteoarthritis seeking sub-millimeter robotic precision and swift recovery.",
    displayOrder: 3,
    status: "ACTIVE",
    published: "PUBLISHED",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    taxIncluded: true
  },
  {
    id: "PKG-004",
    title: "KIMSHEALTH Endoscopic Skull Base & Spine Center",
    tier: "Value Accredited",
    treatmentName: "Minimally Invasive Spine & Brain Surgery",
    specialty: "Neurology & Spine Surgery",
    hospitalName: "KIMSHEALTH, Trivandrum",
    doctorName: "Dr. K. Suresh Kumar",
    district: "Thiruvananthapuram",
    city: "Thiruvananthapuram",
    priceUsd: 6800,
    priceInr: 595000,
    durationDays: 10,
    recoveryDays: 12,
    highlights: [
      "Neuronavigation guided micro-discectomy or skull base resection",
      "World-class neuro-intensive monitoring with 1:1 nurse ratio",
      "Trivandrum International Airport (TRV) direct reception (6 km)",
      "Kovalam beach recovery extension assistance"
    ],
    inclusions: [
      "Microscopic & Endoscopic neurosurgical instrumentation fees",
      "Pre-operative 3T MRI & neuro-radiology evaluations",
      "3 Nights Neuro-ICU + 4 Nights Executive Private Room",
      "Post-operative neurological rehabilitation & speech therapy"
    ],
    exclusions: [
      "Non-medical attendant local tourism expenses",
      "Extended ICU beyond standard protocol"
    ],
    accommodationType: "Executive Hospital Suite + Kovalam Seaside Resort",
    transportType: "Executive Airport Chauffeur (TRV)",
    recommendedFor: "Spinal stenosis, herniated disc, and brain tumor patients seeking minimally invasive neurosurgery.",
    displayOrder: 4,
    status: "ACTIVE",
    published: "PUBLISHED",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=1200&q=80",
    taxIncluded: true
  }
];

const TIERS: PackageOffer["tier"][] = [
  "Platinum VIP",
  "Premium Care",
  "Value Accredited",
  "Ayurvedic Rejuvenation"
];

const TIER_BADGES: Record<string, string> = {
  "Platinum VIP": "bg-amber-500/20 text-amber-300 border-amber-500/40",
  "Premium Care": "bg-blue-500/20 text-blue-300 border-blue-500/40",
  "Value Accredited": "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
  "Ayurvedic Rejuvenation": "bg-green-500/20 text-green-300 border-green-500/40"
};

const DEFAULT_SPECIALTIES = [
  "Cardiology & Cardiac Surgery",
  "Orthopaedics & Joint Replacement",
  "Neurology & Spine Surgery",
  "Classical Ayurveda & Panchakarma",
  "Oncology & Cancer Care",
  "Gastroenterology & Hepatology",
  "Urology & Nephrology",
  "Fertility & Reproductive Medicine (IVF)",
  "Ophthalmology & Refractive Surgery",
  "Dental Surgery & Implants"
];

const DEFAULT_HOSPITALS = [
  "Aster Medcity, Kochi",
  "Amrita Institute of Medical Sciences",
  "Rajagiri Hospital, Aluva",
  "Arya Vaidya Sala Kottakkal",
  "VPS Lakeshore Hospital, Kochi",
  "KIMSHEALTH, Trivandrum",
  "Somatheeram Ayurvedic Village",
  "Apollo Adlux Hospital, Angamaly"
];

const DEFAULT_DOCTORS = [
  "Dr. Muralidharan V. Nair",
  "Dr. Alexander K. George",
  "Dr. K. Suresh Kumar",
  "Aryavaidyan Dr. K. M. Namboothiri",
  "Dr. Arya Varma",
  "Dr. Deepa Pillai",
  "Dr. George Varghese"
];

const DEFAULT_SERVICES = [
  "Off-Pump Coronary Artery Bypass (CABG)",
  "Robotic Total Knee Replacement",
  "Authentic 21-Day Panchakarma Detox",
  "Minimally Invasive Spine & Brain Surgery",
  "Living-Donor Liver / Kidney Transplant",
  "Comprehensive Medical Oncology & Immunotherapy",
  "Robotic Mitral Valve Repair",
  "Full Mouth Dental Implant Rehabilitation"
];

export default function PackageManagementPage() {
  const [packages, setPackages] = useState<PackageOffer[]>(INITIAL_PACKAGES);
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState("ALL");
  const [specialtyFilter, setSpecialtyFilter] = useState("ALL");
  const [hospitalFilter, setHospitalFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "ACTIVE" | "INACTIVE">("ALL");
  const [publishedFilter, setPublishedFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");
  const [sortBy, setSortBy] = useState<"order" | "title" | "priceLow" | "priceHigh" | "duration">("order");

  // Sister Admin Stores Cross-links
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>(DEFAULT_SPECIALTIES);
  const [availableHospitals, setAvailableHospitals] = useState<string[]>(DEFAULT_HOSPITALS);
  const [availableDoctors, setAvailableDoctors] = useState<string[]>(DEFAULT_DOCTORS);
  const [availableServices, setAvailableServices] = useState<string[]>(DEFAULT_SERVICES);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageOffer | null>(null);

  // Toast & Validation
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<PackageOffer>>({
    title: "",
    tier: "Premium Care",
    treatmentName: DEFAULT_SERVICES[0],
    specialty: DEFAULT_SPECIALTIES[0],
    hospitalName: DEFAULT_HOSPITALS[0],
    doctorName: DEFAULT_DOCTORS[0],
    district: "Ernakulam / Kochi",
    city: "Kochi, Kerala",
    priceUsd: 5000,
    priceInr: 420000,
    durationDays: 10,
    recoveryDays: 7,
    highlights: [],
    inclusions: [],
    exclusions: [],
    accommodationType: "Deluxe Single Room with Patient Attendant Bed",
    transportType: "Private Chauffeured Airport Transfer",
    recommendedFor: "",
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    taxIncluded: true
  });

  const [highlightInput, setHighlightInput] = useState("");
  const [inclusionInput, setInclusionInput] = useState("");
  const [exclusionInput, setExclusionInput] = useState("");

  // Hydrate Data
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Load Packages
      const stored = localStorage.getItem("maides_admin_packages");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setPackages(parsed);
          }
        } catch (e) {
          console.error("Failed to parse packages from localStorage", e);
        }
      }

      // 2. Cross-link Specialties
      const storedSpecs = localStorage.getItem("maides_admin_specialties");
      if (storedSpecs) {
        try {
          const parsedSpecs = JSON.parse(storedSpecs);
          if (Array.isArray(parsedSpecs) && parsedSpecs.length > 0) {
            const specNames = parsedSpecs.map((s: any) => s.name);
            setAvailableSpecialties(Array.from(new Set([...specNames, ...DEFAULT_SPECIALTIES])));
          }
        } catch (e) {}
      }

      // 3. Cross-link Hospitals
      const storedHosps = localStorage.getItem("maides_admin_hospitals");
      if (storedHosps) {
        try {
          const parsedHosps = JSON.parse(storedHosps);
          if (Array.isArray(parsedHosps) && parsedHosps.length > 0) {
            const hospNames = parsedHosps.map((h: any) => h.name);
            setAvailableHospitals(Array.from(new Set([...hospNames, ...DEFAULT_HOSPITALS])));
          }
        } catch (e) {}
      }

      // 4. Cross-link Doctors
      const storedDocs = localStorage.getItem("maides_admin_doctors");
      if (storedDocs) {
        try {
          const parsedDocs = JSON.parse(storedDocs);
          if (Array.isArray(parsedDocs) && parsedDocs.length > 0) {
            const docNames = parsedDocs.map((d: any) => d.name);
            setAvailableDoctors(Array.from(new Set([...docNames, ...DEFAULT_DOCTORS])));
          }
        } catch (e) {}
      }

      // 5. Cross-link Treatments/Services
      const storedTrts = localStorage.getItem("maides_admin_treatments");
      if (storedTrts) {
        try {
          const parsedTrts = JSON.parse(storedTrts);
          if (Array.isArray(parsedTrts) && parsedTrts.length > 0) {
            const trtNames = parsedTrts.map((t: any) => t.name);
            setAvailableServices(Array.from(new Set([...trtNames, ...DEFAULT_SERVICES])));
          }
        } catch (e) {}
      }
    }
  }, []);

  const savePackagesToStorage = (updated: PackageOffer[]) => {
    setPackages(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_admin_packages", JSON.stringify(updated));
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Image Upload Handler (FileReader Base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFormError("Please select a valid image file (PNG, JPG, JPEG, WebP).");
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setFormError("Image file size exceeds 8MB. Please select a smaller photo.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setFormData(prev => ({
          ...prev,
          image: reader.result as string
        }));
        setFormError(null);
        showToast("Package banner photo selected successfully!");
      }
    };
    reader.onerror = () => {
      setFormError("Failed to read image file. Please try another image.");
    };
    reader.readAsDataURL(file);
  };

  // Validation
  const validateForm = (): boolean => {
    if (!formData.title || !formData.title.trim()) {
      setFormError("Package title is required.");
      return false;
    }
    if (formData.title.trim().length < 5) {
      setFormError("Package title must be at least 5 characters long.");
      return false;
    }
    if (!formData.treatmentName) {
      setFormError("Please specify the primary medical service/treatment.");
      return false;
    }
    if (!formData.hospitalName) {
      setFormError("Please assign an accredited partner hospital.");
      return false;
    }
    if (!formData.doctorName) {
      setFormError("Please assign a primary specialist doctor.");
      return false;
    }
    if (typeof formData.priceUsd !== "number" || formData.priceUsd <= 0) {
      setFormError("Package price (USD) must be greater than zero.");
      return false;
    }
    if (typeof formData.durationDays !== "number" || formData.durationDays <= 0) {
      setFormError("Treatment duration (days) must be at least 1 day.");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Open Create Modal
  const handleOpenAdd = () => {
    setFormError(null);
    const nextOrder = packages.length ? Math.max(...packages.map(p => p.displayOrder || 0)) + 1 : 1;
    setFormData({
      title: "",
      tier: "Premium Care",
      treatmentName: availableServices[0] || DEFAULT_SERVICES[0],
      specialty: availableSpecialties[0] || DEFAULT_SPECIALTIES[0],
      hospitalName: availableHospitals[0] || DEFAULT_HOSPITALS[0],
      doctorName: availableDoctors[0] || DEFAULT_DOCTORS[0],
      district: "Ernakulam / Kochi",
      city: "Kochi, Kerala",
      priceUsd: 5500,
      priceInr: 480000,
      durationDays: 10,
      recoveryDays: 7,
      highlights: [
        "JCI/NABH Quaternary Care Hospital Treatment",
        "Lead Specialist Consultation & Procedure",
        "Private Inpatient Suite with Attendant Bed",
        "Airport Limousine Chauffeur Meet & Greet"
      ],
      inclusions: [
        "Complete pre-operative investigations & diagnostic imaging",
        "Surgeon, anesthesia, and OT charges",
        "Inpatient hospital stay with dietitian meals",
        "Airport transfers and local logistics coordination"
      ],
      exclusions: [
        "International flight tickets",
        "Personal telephone and luxury hotel room service"
      ],
      accommodationType: "Deluxe Single Private Room + Attendant Bed",
      transportType: "Private Air-Conditioned Airport Limousine Chauffeur",
      recommendedFor: "International medical travelers seeking all-inclusive transparent clinical care in Kerala.",
      displayOrder: nextOrder,
      status: "ACTIVE",
      published: "PUBLISHED",
      image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      taxIncluded: true
    });
    setHighlightInput("");
    setInclusionInput("");
    setExclusionInput("");
    setIsAddModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (pkg: PackageOffer) => {
    setFormError(null);
    setSelectedPackage(pkg);
    setFormData({ ...pkg });
    setHighlightInput("");
    setInclusionInput("");
    setExclusionInput("");
    setIsEditModalOpen(true);
  };

  // Open View Modal
  const handleOpenView = (pkg: PackageOffer) => {
    setSelectedPackage(pkg);
    setIsViewModalOpen(true);
  };

  // Open Delete Modal
  const handleOpenDelete = (pkg: PackageOffer) => {
    setSelectedPackage(pkg);
    setIsDeleteModalOpen(true);
  };

  // Add Item to arrays
  const handleAddHighlight = () => {
    if (highlightInput.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...(prev.highlights || []), highlightInput.trim()]
      }));
      setHighlightInput("");
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      highlights: (prev.highlights || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddInclusion = () => {
    if (inclusionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        inclusions: [...(prev.inclusions || []), inclusionInput.trim()]
      }));
      setInclusionInput("");
    }
  };

  const handleRemoveInclusion = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      inclusions: (prev.inclusions || []).filter((_, i) => i !== idx)
    }));
  };

  const handleAddExclusion = () => {
    if (exclusionInput.trim()) {
      setFormData(prev => ({
        ...prev,
        exclusions: [...(prev.exclusions || []), exclusionInput.trim()]
      }));
      setExclusionInput("");
    }
  };

  const handleRemoveExclusion = (idx: number) => {
    setFormData(prev => ({
      ...prev,
      exclusions: (prev.exclusions || []).filter((_, i) => i !== idx)
    }));
  };

  // Submit Create
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const newPkg: PackageOffer = {
      id: "PKG-" + Math.floor(100 + Math.random() * 900),
      title: formData.title!.trim(),
      tier: formData.tier || "Premium Care",
      treatmentName: formData.treatmentName || DEFAULT_SERVICES[0],
      specialty: formData.specialty || availableSpecialties[0],
      hospitalName: formData.hospitalName || availableHospitals[0],
      doctorName: formData.doctorName || availableDoctors[0],
      district: formData.district || "Ernakulam / Kochi",
      city: formData.city || "Kochi, Kerala",
      priceUsd: Number(formData.priceUsd) || 5000,
      priceInr: Number(formData.priceInr) || Math.round((Number(formData.priceUsd) || 5000) * 87.5),
      durationDays: Number(formData.durationDays) || 10,
      recoveryDays: Number(formData.recoveryDays) || 7,
      highlights: formData.highlights && formData.highlights.length > 0 ? formData.highlights : ["All-inclusive medical care package"],
      inclusions: formData.inclusions && formData.inclusions.length > 0 ? formData.inclusions : ["Full surgical & hospital coverage"],
      exclusions: formData.exclusions || ["International flights"],
      accommodationType: formData.accommodationType || "Deluxe Private Suite",
      transportType: formData.transportType || "Private Airport Chauffeur",
      recommendedFor: formData.recommendedFor || "International patients seeking coordinated healthcare in Kerala.",
      displayOrder: Number(formData.displayOrder) || (packages.length + 1),
      status: formData.status || "ACTIVE",
      published: formData.published || "PUBLISHED",
      image: formData.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      taxIncluded: formData.taxIncluded ?? true,
      createdAt: new Date().toISOString()
    };

    const updated = [newPkg, ...packages];
    savePackagesToStorage(updated);
    setIsAddModalOpen(false);
    showToast("Package '" + newPkg.title + "' created and published to catalog!");
  };

  // Submit Edit
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPackage || !validateForm()) return;

    const updated = packages.map(p => {
      if (p.id === selectedPackage.id) {
        return {
          ...p,
          ...formData,
          title: formData.title!.trim(),
          priceUsd: Number(formData.priceUsd) || p.priceUsd,
          priceInr: Number(formData.priceInr) || p.priceInr,
          durationDays: Number(formData.durationDays) || p.durationDays,
          displayOrder: Number(formData.displayOrder) || p.displayOrder,
          updatedAt: new Date().toISOString()
        } as PackageOffer;
      }
      return p;
    });

    savePackagesToStorage(updated);
    setIsEditModalOpen(false);
    showToast("Package '" + formData.title + "' updated successfully!");
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!selectedPackage) return;
    const updated = packages.filter(p => p.id !== selectedPackage.id);
    savePackagesToStorage(updated);
    setIsDeleteModalOpen(false);
    showToast("Package '" + selectedPackage.title + "' removed from system.");
    setSelectedPackage(null);
  };

  // Quick Toggle Status
  const handleToggleStatus = (pkg: PackageOffer) => {
    const nextStatus: "ACTIVE" | "INACTIVE" = pkg.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const updated = packages.map(p => p.id === pkg.id ? { ...p, status: nextStatus, updatedAt: new Date().toISOString() } as PackageOffer : p);
    savePackagesToStorage(updated);
    showToast("Package " + pkg.id + " status updated to " + nextStatus);
  };

  // Quick Toggle Published
  const handleTogglePublished = (pkg: PackageOffer) => {
    const nextPub: "PUBLISHED" | "DRAFT" = pkg.published === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
    const updated = packages.map(p => p.id === pkg.id ? { ...p, published: nextPub, updatedAt: new Date().toISOString() } as PackageOffer : p);
    savePackagesToStorage(updated);
    showToast("Package " + pkg.id + " " + (nextPub === "PUBLISHED" ? "published to public portal" : "unpublished (Draft mode)"));
  };

  // Filter & Sort
  const filteredPackages = useMemo(() => {
    return packages.filter(p => {
      const q = searchTerm.toLowerCase();
      const matchesSearch = 
        p.title.toLowerCase().includes(q) ||
        p.treatmentName.toLowerCase().includes(q) ||
        p.hospitalName.toLowerCase().includes(q) ||
        p.doctorName.toLowerCase().includes(q) ||
        (p.specialty && p.specialty.toLowerCase().includes(q)) ||
        p.id.toLowerCase().includes(q);

      const matchesTier = tierFilter === "ALL" || p.tier === tierFilter;
      const matchesSpec = specialtyFilter === "ALL" || p.specialty === specialtyFilter;
      const matchesHosp = hospitalFilter === "ALL" || p.hospitalName === hospitalFilter;
      const matchesStatus = statusFilter === "ALL" || p.status === statusFilter;
      const matchesPub = publishedFilter === "ALL" || p.published === publishedFilter;

      return matchesSearch && matchesTier && matchesSpec && matchesHosp && matchesStatus && matchesPub;
    }).sort((a, b) => {
      if (sortBy === "order") return (a.displayOrder || 99) - (b.displayOrder || 99);
      if (sortBy === "title") return a.title.localeCompare(b.title);
      if (sortBy === "priceLow") return a.priceUsd - b.priceUsd;
      if (sortBy === "priceHigh") return b.priceUsd - a.priceUsd;
      if (sortBy === "duration") return b.durationDays - a.durationDays;
      return 0;
    });
  }, [packages, searchTerm, tierFilter, specialtyFilter, hospitalFilter, statusFilter, publishedFilter, sortBy]);

  // Statistics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter(p => p.status === "ACTIVE").length;
    const published = packages.filter(p => p.published === "PUBLISHED").length;
    const livePublic = packages.filter(p => p.status === "ACTIVE" && p.published === "PUBLISHED").length;
    const avgUsd = Math.round(packages.reduce((acc, p) => acc + p.priceUsd, 0) / (packages.length || 1));
    return { total, active, published, livePublic, avgUsd };
  }, [packages]);

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Layers className="w-5 h-5 text-[#0E82FD]" />
            Treatment Packages & Bundled Care
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Create and orchestrate end-to-end medical tourism bundles linking medical services, specialties, hospitals, doctors, accommodation, and airport logistics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/packages"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#0E82FD]" />
            <span>Public Packages</span>
          </Link>
          <button
            onClick={handleOpenAdd}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Package</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Banner */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5">
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Total Bundles</span>
            <Layers className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-white">{stats.total}</div>
          <div className="text-[10px] text-slate-400 mt-1">Configured in system</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Live on Portal</span>
            <Sparkles className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.livePublic}</div>
          <div className="text-[10px] text-emerald-400/80 mt-1">Active & Published</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Published</span>
            <CheckCircle2 className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-400">{stats.published}</div>
          <div className="text-[10px] text-slate-400 mt-1">Ready for patient view</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Active Status</span>
            <ShieldCheck className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-400">{stats.active}</div>
          <div className="text-[10px] text-slate-400 mt-1">Operational packages</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800/80 shadow-sm col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-slate-400 text-xs mb-1">
            <span>Avg Package Cost</span>
            <DollarSign className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl font-black text-purple-400">${stats.avgUsd.toLocaleString()}</div>
          <div className="text-[10px] text-slate-400 mt-1">≈ ₹{(stats.avgUsd * 87.5).toLocaleString()}</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {/* Search Box */}
          <div className="relative lg:col-span-2">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search package title, treatment, doctor, hospital..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          {/* Tier Filter */}
          <div>
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Tiers</option>
              {TIERS.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Hospital Filter */}
          <div>
            <select
              value={hospitalFilter}
              onChange={(e) => setHospitalFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Hospitals</option>
              {availableHospitals.map(h => (
                <option key={h} value={h}>{h}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="order">Sort: Custom Order</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="priceLow">Sort: Price (Low → High)</option>
              <option value="priceHigh">Sort: Price (High → Low)</option>
              <option value="duration">Sort: Duration</option>
            </select>
          </div>
        </div>

        {/* Quick Filter Counts */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/80 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white">{filteredPackages.length}</strong> of {packages.length} packages</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setPublishedFilter(publishedFilter === "ALL" ? "PUBLISHED" : publishedFilter === "PUBLISHED" ? "DRAFT" : "ALL")}
              className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 transition text-[11px]"
            >
              Publication: <strong className="text-[#0E82FD]">{publishedFilter}</strong>
            </button>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-5">
        {filteredPackages.map((pkg) => (
          <div
            key={pkg.id}
            className="group rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 p-5 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between"
          >
            <div className="space-y-4">
              {/* Header / Badges */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${TIER_BADGES[pkg.tier] || "bg-slate-800 text-slate-300 border-slate-700"}`}>
                    {pkg.tier}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-950 text-slate-400 border border-slate-800 font-mono">
                    {pkg.id}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {/* Status Toggle */}
                  <button
                    onClick={() => handleToggleStatus(pkg)}
                    title="Click to toggle Active / Inactive"
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                      pkg.status === "ACTIVE"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20"
                    }`}
                  >
                    {pkg.status}
                  </button>

                  {/* Published Toggle */}
                  <button
                    onClick={() => handleTogglePublished(pkg)}
                    title="Click to toggle public portal visibility"
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border transition cursor-pointer ${
                      pkg.published === "PUBLISHED"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                        : "bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700"
                    }`}
                  >
                    {pkg.published}
                  </button>
                </div>
              </div>

              {/* Banner & Title */}
              <div className="flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 border border-slate-800 bg-slate-950">
                  <img
                    src={pkg.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"}
                    alt={pkg.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute bottom-1 right-1 bg-slate-950/90 text-amber-400 text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5">
                    <Clock className="w-2.5 h-2.5" />
                    <span>{pkg.durationDays}d</span>
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-white group-hover:text-[#0E82FD] transition-colors line-clamp-2">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-blue-400 font-medium mt-1 truncate">
                    {pkg.treatmentName}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1 truncate">
                    <Building2 className="w-3 h-3 shrink-0 text-slate-500" />
                    <span>{pkg.hospitalName}</span>
                  </p>
                  <p className="text-[11px] text-slate-400 flex items-center gap-1 truncate mt-0.5">
                    <Stethoscope className="w-3 h-3 shrink-0 text-[#0E82FD]" />
                    <span>{pkg.doctorName}</span>
                  </p>
                </div>
              </div>

              {/* Price & Specs Banner */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Package Pricing</span>
                  <div className="text-base font-black text-white flex items-baseline gap-1">
                    <span>${pkg.priceUsd.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-400 font-normal">USD</span>
                  </div>
                  <div className="text-[10px] text-emerald-400 font-medium">≈ ₹{pkg.priceInr.toLocaleString()}</div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">Duration & Stay</span>
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1 mt-0.5">
                    <Calendar className="w-3 h-3 text-[#0E82FD]" />
                    <span>{pkg.durationDays} Days Clinical Stay</span>
                  </div>
                  {pkg.recoveryDays && (
                    <div className="text-[10px] text-slate-400 mt-0.5">+ {pkg.recoveryDays} Days Recovery</div>
                  )}
                </div>
              </div>

              {/* Highlights List */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Key Highlights</span>
                <ul className="space-y-1">
                  {pkg.highlights.slice(0, 3).map((h, i) => (
                    <li key={i} className="text-xs text-slate-300 flex items-start gap-1.5 line-clamp-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[10px] text-slate-500">Order: #{pkg.displayOrder}</span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleOpenView(pkg)}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:text-white transition"
                  title="View Full Package Dossier"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenEdit(pkg)}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-[#0E82FD] text-slate-300 border border-slate-800 hover:text-white transition"
                  title="Edit Package"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => handleOpenDelete(pkg)}
                  className="p-1.5 rounded-lg bg-slate-950 hover:bg-rose-600 text-slate-300 border border-slate-800 hover:text-white transition"
                  title="Delete Package"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPackages.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl space-y-3">
          <Layers className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-sm font-bold text-white">No Treatment Packages Match Filter</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting search terms or tier filters, or click create to construct a new medical-tourism package.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E82FD] text-white text-xs font-bold rounded-xl"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Package</span>
          </button>
        </div>
      )}

      {/* CREATE MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#0E82FD]" />
                Create New Treatment Package
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="mt-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
              {/* Row 1: Title & Tier */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Package Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kochi Platinum Beating-Heart Cardiac Care Journey"
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Package Tier <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.tier || "Premium Care"}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {TIERS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 2: Service & Specialty */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Medical Service / Treatment <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    list="services-list"
                    placeholder="Search or enter medical procedure..."
                    value={formData.treatmentName || ""}
                    onChange={(e) => setFormData({ ...formData, treatmentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                  <datalist id="services-list">
                    {availableServices.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Medical Specialty <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.specialty || availableSpecialties[0]}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableSpecialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 3: Hospital & Doctor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Accredited Partner Hospital <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.hospitalName || availableHospitals[0]}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableHospitals.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Primary Specialist Doctor <span className="text-rose-400">*</span>
                  </label>
                  <select
                    value={formData.doctorName || availableDoctors[0]}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableDoctors.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Pricing (USD & INR), Duration, Recovery */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Price (USD $) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="100"
                    required
                    value={formData.priceUsd ?? 5000}
                    onChange={(e) => {
                      const usd = parseInt(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        priceUsd: usd, 
                        priceInr: Math.round(usd * 87.5) 
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    min="1000"
                    value={formData.priceInr ?? 420000}
                    onChange={(e) => setFormData({ ...formData, priceInr: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Duration (Days) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={formData.durationDays ?? 10}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Recovery (Days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.recoveryDays ?? 7}
                    onChange={(e) => setFormData({ ...formData, recoveryDays: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              {/* Row 5: Accommodation & Transport */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Accommodation Details
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Deluxe Single Suite + 4-Star Backwater Resort Convalescence"
                    value={formData.accommodationType || ""}
                    onChange={(e) => setFormData({ ...formData, accommodationType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Transportation & Airport
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Private Mercedes / Innova Limousine Transfer"
                    value={formData.transportType || ""}
                    onChange={(e) => setFormData({ ...formData, transportType: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              {/* Row 6: Image Upload File Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Package Banner Photo (Upload Image File) <span className="text-rose-400">*</span>
                </label>
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="relative group shrink-0">
                    <img 
                      src={formData.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"} 
                      alt="Package Preview" 
                      className="w-24 h-20 rounded-xl object-cover border-2 border-slate-700 shadow-md group-hover:border-[#0E82FD] transition-colors" 
                    />
                    {formData.image && (
                      <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 p-0.5 rounded-full shadow">
                        <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                      </span>
                    )}
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-blue-500/20 active:scale-95">
                        <Upload className="w-4 h-4" />
                        <span>Upload Image File</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageFileChange}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[11px] text-slate-400">PNG, JPG, WebP up to 8MB</span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      Image will be bundled directly into package listings across the public catalog and landing page.
                    </p>
                  </div>
                </div>
              </div>

              {/* Row 7: Highlights Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Package Highlights
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add bullet highlight..."
                    value={highlightInput}
                    onChange={(e) => setHighlightInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddHighlight(); } }}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                  <button
                    type="button"
                    onClick={handleAddHighlight}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {(formData.highlights || []).map((h, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
                      <span>• {h}</span>
                      <button type="button" onClick={() => handleRemoveHighlight(i)} className="text-slate-500 hover:text-rose-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 8: Inclusions Builder */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                  Included Services & Tests
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    placeholder="Add clinical inclusion..."
                    value={inclusionInput}
                    onChange={(e) => setInclusionInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddInclusion(); } }}
                    className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                  <button
                    type="button"
                    onClick={handleAddInclusion}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-1 max-h-28 overflow-y-auto">
                  {(formData.inclusions || []).map((inc, i) => (
                    <div key={i} className="flex items-center justify-between px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
                      <span>✓ {inc}</span>
                      <button type="button" onClick={() => handleRemoveInclusion(i)} className="text-slate-500 hover:text-rose-400">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Row 9: Display Order, Status & Published */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.displayOrder ?? 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Operation Status
                  </label>
                  <select
                    value={formData.status || "ACTIVE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="ACTIVE">ACTIVE (Operational)</option>
                    <option value="INACTIVE">INACTIVE (Hidden)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Portal Publication
                  </label>
                  <select
                    value={formData.published || "PUBLISHED"}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="PUBLISHED">PUBLISHED (Public View)</option>
                    <option value="DRAFT">DRAFT (Internal)</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
                >
                  Create & Save Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {isEditModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-200">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Edit className="w-5 h-5 text-[#0E82FD]" />
                Edit Package — {selectedPackage.id}
              </h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleEditSubmit} className="mt-4 space-y-4 max-h-[72vh] overflow-y-auto pr-1">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Package Title <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ""}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Package Tier
                  </label>
                  <select
                    value={formData.tier || "Premium Care"}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {TIERS.map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Medical Service / Treatment
                  </label>
                  <input
                    type="text"
                    list="services-edit-list"
                    value={formData.treatmentName || ""}
                    onChange={(e) => setFormData({ ...formData, treatmentName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                  <datalist id="services-edit-list">
                    {availableServices.map(s => <option key={s} value={s} />)}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Medical Specialty
                  </label>
                  <select
                    value={formData.specialty || availableSpecialties[0]}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableSpecialties.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Accredited Partner Hospital
                  </label>
                  <select
                    value={formData.hospitalName || availableHospitals[0]}
                    onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableHospitals.map(h => (
                      <option key={h} value={h}>{h}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Primary Specialist Doctor
                  </label>
                  <select
                    value={formData.doctorName || availableDoctors[0]}
                    onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {availableDoctors.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Price (USD $)
                  </label>
                  <input
                    type="number"
                    value={formData.priceUsd ?? 5000}
                    onChange={(e) => {
                      const usd = parseInt(e.target.value) || 0;
                      setFormData({ 
                        ...formData, 
                        priceUsd: usd, 
                        priceInr: Math.round(usd * 87.5) 
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Price (INR ₹)
                  </label>
                  <input
                    type="number"
                    value={formData.priceInr ?? 420000}
                    onChange={(e) => setFormData({ ...formData, priceInr: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.durationDays ?? 10}
                    onChange={(e) => setFormData({ ...formData, durationDays: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Recovery (Days)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.recoveryDays ?? 7}
                    onChange={(e) => setFormData({ ...formData, recoveryDays: parseInt(e.target.value) || 0 })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              {/* Image Upload File Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                  Package Banner Photo
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                  <div className="relative group shrink-0">
                    <img 
                      src={formData.image || selectedPackage.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600&q=80"} 
                      alt="Package Preview" 
                      className="w-24 h-20 rounded-xl object-cover border-2 border-slate-700 shadow-md group-hover:border-[#0E82FD] transition-colors" 
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-blue-500/20 active:scale-95">
                      <Upload className="w-4 h-4" />
                      <span>Upload New Image from Device</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageFileChange}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-400">Select replacement banner photo from your local files</p>
                  </div>
                </div>
              </div>

              {/* Status & Published */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2 border-t border-slate-800">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={formData.displayOrder ?? 1}
                    onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status || "ACTIVE"}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="ACTIVE">ACTIVE</option>
                    <option value="INACTIVE">INACTIVE</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                    Portal Publication
                  </label>
                  <select
                    value={formData.published || "PUBLISHED"}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value as any })}
                    className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="PUBLISHED">PUBLISHED</option>
                    <option value="DRAFT">DRAFT</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition shadow-lg shadow-blue-500/20"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW DOSSIER MODAL */}
      {isViewModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 my-8 text-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${TIER_BADGES[selectedPackage.tier]}`}>
                  {selectedPackage.tier}
                </span>
                <span className="text-xs font-mono text-slate-400">{selectedPackage.id}</span>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative h-48 rounded-xl overflow-hidden border border-slate-800">
              <img
                src={selectedPackage.image || "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80"}
                alt={selectedPackage.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex items-end p-4">
                <div>
                  <h3 className="text-base font-bold text-white">{selectedPackage.title}</h3>
                  <p className="text-xs text-blue-300">{selectedPackage.treatmentName}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">USD Estimate</span>
                <span className="text-base font-black text-white">${selectedPackage.priceUsd.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">INR Value</span>
                <span className="text-base font-black text-emerald-400">₹{selectedPackage.priceInr.toLocaleString()}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Stay Duration</span>
                <span className="text-sm font-bold text-white">{selectedPackage.durationDays} Days</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-[10px] text-slate-400 block">Recovery Period</span>
                <span className="text-sm font-bold text-white">{selectedPackage.recoveryDays || 7} Days</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-4 h-4 text-[#0E82FD]" />
                <span>Hospital: <strong>{selectedPackage.hospitalName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Stethoscope className="w-4 h-4 text-[#0E82FD]" />
                <span>Lead Specialist: <strong>{selectedPackage.doctorName}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Home className="w-4 h-4 text-amber-400" />
                <span>Accommodation: {selectedPackage.accommodationType || "Deluxe Suite"}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Plane className="w-4 h-4 text-sky-400" />
                <span>Logistics: {selectedPackage.transportType || "Airport Chauffeur"}</span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Highlights & Inclusions</span>
              <ul className="space-y-1 max-h-32 overflow-y-auto">
                {selectedPackage.highlights.map((h, i) => (
                  <li key={i} className="text-slate-300 flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(selectedPackage);
                }}
                className="px-4 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold transition"
              >
                Edit Package
              </button>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {isDeleteModalOpen && selectedPackage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 text-slate-200 space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Delete Treatment Package</h3>
                <p className="text-xs text-slate-400">Are you sure you want to remove this bundle?</p>
              </div>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs space-y-1">
              <div className="font-bold text-white">{selectedPackage.title}</div>
              <div className="text-slate-400">{selectedPackage.treatmentName} • {selectedPackage.hospitalName}</div>
              <div className="text-emerald-400 font-bold">${selectedPackage.priceUsd.toLocaleString()} USD</div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              This action will remove the package offer from both the Admin Console and the public healthcare catalog.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition shadow-lg shadow-rose-600/20"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
