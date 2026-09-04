"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Building2, 
  MapPin, 
  Award, 
  Plus, 
  ExternalLink, 
  CheckCircle2, 
  Search, 
  BedDouble, 
  Activity, 
  X, 
  Trash2, 
  Edit, 
  Eye, 
  ShieldCheck, 
  Globe,
  Phone,
  Mail,
  Plane,
  AlertTriangle,
  Star,
  Users,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  Filter,
  Sparkles,
  Stethoscope,
  Clock,
  Layers
} from "lucide-react";
import Link from "next/link";

export interface HospitalAdminItem {
  id: string;
  name: string;
  tagline: string;
  shortDescription: string;
  fullDescription: string;
  image: string;
  galleryImages: string[];
  address: string;
  city: string;
  district: string;
  region: "South Kerala" | "Central Kerala" | "North Kerala";
  state: string;
  country: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  emergencyPhone: string;
  beds: string;
  establishedYear: number;
  internationalPatientsAnnual: number;
  nearestAirport: string;
  airportDistanceKm: number;
  accreditations: string[];
  specialties: string[];
  doctors: string[];
  facilities: string[];
  internationalServices: string[];
  languages: string[];
  vipRoomsAvailable: boolean;
  ayurvedaWingAvailable: boolean;
  rating: number;
  reviewCount: number;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  published: "PUBLISHED" | "DRAFT";
  casesActive: number;
}

const INITIAL_HOSPITALS: HospitalAdminItem[] = [
  {
    id: "HSP-01",
    name: "Aster Medcity",
    tagline: "JCI-Accredited 670-bed waterfront quaternary healthcare destination",
    shortDescription: "Kerala's foremost waterfront medical destination with Da Vinci robotics and comprehensive organ transplants.",
    fullDescription: "Situated on a tranquil 45-acre waterfront campus in Cheranalloor, Aster Medcity is Kerala's foremost destination for international patients seeking Da Vinci robotic surgeries, liver & heart transplants, and personalized clinical care.",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600",
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600"
    ],
    address: "Kuttisahib Road, Cheranalloor, South Chittoor",
    city: "Kochi",
    district: "Ernakulam / Kochi",
    region: "Central Kerala",
    state: "Kerala",
    country: "India",
    postalCode: "682027",
    phone: "+91 484 669 9999",
    email: "international@astermedcity.com",
    website: "https://astermedcity.com",
    emergencyPhone: "+91 484 669 9000",
    beds: "670 Beds",
    establishedYear: 2014,
    internationalPatientsAnnual: 28000,
    nearestAirport: "Cochin International Airport (COK)",
    airportDistanceKm: 24,
    accreditations: ["JCI Accredited", "NABH Certified", "NABL Accredited", "GreenOT"],
    specialties: ["Cardiology & Bypass", "Robotic Orthopaedics", "Comprehensive Oncology", "Neurology & Neurosurgery", "Living-Donor Transplants"],
    doctors: ["Dr. K. S. Muralidharan, DM, FACC", "Dr. Vijay Anand, MS (Ortho)", "Dr. Thomas Mathew, DM"],
    facilities: ["Da Vinci Xi Robotic Surgery System", "Hybrid Cardiac Cath Lab", "Integrated Bone Marrow Unit", "Private Water Taxi & Helipad", "Waterfront Convalescence Promenade"],
    internationalServices: [
      "24/7 International Patient Desk with Dedicated Relationship Manager",
      "Direct Chauffeur Escort from Cochin International Airport (25 mins)",
      "Medical eVisa Fast-Track Invitation Letter in 4 Hours",
      "Arabic & French Native Translators On-Site",
      "Luxury Presidential Waterfront Suites"
    ],
    languages: ["English", "Arabic", "Malayalam", "Hindi", "French", "Russian"],
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    rating: 4.94,
    reviewCount: 4210,
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    casesActive: 24
  },
  {
    id: "HSP-02",
    name: "Amrita Institute of Medical Sciences",
    tagline: "1,350-bed quaternary academic healthcare landmark and transplant pioneer",
    shortDescription: "Premier university hospital in South Asia with robotic surgeries, pediatric cardiology, and oncology.",
    fullDescription: "Founded by Mata Amritanandamayi Devi, Amrita Hospital is a premier university hospital equipped with 1,350 beds, robotic cardiac suites, and pioneering hand and multi-organ transplant programs.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600"
    ],
    address: "Ponekkara, AIMS P.O.",
    city: "Kochi",
    district: "Ernakulam / Kochi",
    region: "Central Kerala",
    state: "Kerala",
    country: "India",
    postalCode: "682041",
    phone: "+91 484 285 1234",
    email: "international@amrita.edu",
    website: "https://amritahospitals.org",
    emergencyPhone: "+91 484 285 2000",
    beds: "1,350 Beds",
    establishedYear: 1998,
    internationalPatientsAnnual: 35000,
    nearestAirport: "Cochin International Airport (COK)",
    airportDistanceKm: 26,
    accreditations: ["NABH Certified", "NABL Accredited", "ISO 9001", "Green Hospital"],
    specialties: ["Robotic Cardiac Surgery", "Living-Donor Transplants", "Pediatric Cardiology", "Comprehensive Oncology", "Neurology & Neurosurgery"],
    doctors: ["Dr. Harikrishnan Pillai, MCh", "Dr. Venugopal B., MS, MCh"],
    facilities: ["Stereotactic Radiosurgery", "Automated Robotic Surgery Suite", "Pediatric Cardiac Cath Lab", "Multi-Organ Transplant ICU"],
    internationalServices: [
      "Dedicated Global Patient Care Lounge",
      "Complimentary Airport Chauffeur Service",
      "Telemedicine Consultations before Arrival",
      "Multilingual Translation in 8 Languages"
    ],
    languages: ["English", "Arabic", "Malayalam", "Hindi", "French", "German"],
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    rating: 4.93,
    reviewCount: 5120,
    displayOrder: 2,
    status: "ACTIVE",
    published: "PUBLISHED",
    casesActive: 19
  },
  {
    id: "HSP-03",
    name: "VPS Lakeshore Hospital",
    tagline: "Leading 450-bed quaternary transplant & oncology center",
    shortDescription: "Renowned digestive disease, multi-organ transplant, and robotic surgical institution.",
    fullDescription: "VPS Lakeshore Hospital is an internationally acclaimed quaternary center in Kochi, recognized as one of India's leading centers for liver & renal transplants and comprehensive oncology.",
    image: "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600"
    ],
    address: "NH 66 Bypass, Nettoor, Maradu",
    city: "Kochi",
    district: "Ernakulam / Kochi",
    region: "Central Kerala",
    state: "Kerala",
    country: "India",
    postalCode: "682040",
    phone: "+91 484 270 1032",
    email: "international@lakeshorehospital.com",
    website: "https://vpslakeshore.com",
    emergencyPhone: "+91 484 270 1000",
    beds: "450 Beds",
    establishedYear: 2003,
    internationalPatientsAnnual: 16000,
    nearestAirport: "Cochin International Airport (COK)",
    airportDistanceKm: 32,
    accreditations: ["NABH", "JCI Certified", "NABL"],
    specialties: ["Gastroenterology", "Living-Donor Transplants", "Robotic Orthopaedics", "Comprehensive Oncology"],
    doctors: ["Dr. Roy J. Mukkada, MD, DM", "Dr. Venugopal B., MS, MCh"],
    facilities: ["Advanced GI Endoscopy Suite", "SpyGlass Cholangioscopy Unit", "Liver Transplant ICU", "Dedicated VIP Suites"],
    internationalServices: [
      "24/7 International Desk & Medical Visa Help",
      "Direct Airport Transfers",
      "Arabic & French Interpreters"
    ],
    languages: ["English", "Arabic", "Malayalam", "Hindi", "French"],
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: false,
    rating: 4.89,
    reviewCount: 2950,
    displayOrder: 3,
    status: "ACTIVE",
    published: "PUBLISHED",
    casesActive: 12
  },
  {
    id: "HSP-04",
    name: "Somatheeram Ayurvedic Village",
    tagline: "NABH Ayush Platinum Certified world-first Ayurveda beach resort hospital",
    shortDescription: "Seaside authentic Ashtavaidya Panchakarma and herbal wellness sanctuary in Kovalam.",
    fullDescription: "Somatheeram is the world's first Ayurvedic hospital resort set atop the picturesque Chowara Beach in Kovalam, delivering authentic 14-21 day Panchakarma, Rasayana, and restorative therapies.",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600"
    ],
    address: "Chowara P.O., South of Kovalam",
    city: "Kovalam",
    district: "Thiruvananthapuram",
    region: "South Kerala",
    state: "Kerala",
    country: "India",
    postalCode: "695501",
    phone: "+91 471 226 6501",
    email: "mail@somatheeram.in",
    website: "https://somatheeram.in",
    emergencyPhone: "+91 471 226 6500",
    beds: "120 Ayurvedic Cottages",
    establishedYear: 1985,
    internationalPatientsAnnual: 12500,
    nearestAirport: "Trivandrum International Airport (TRV)",
    airportDistanceKm: 18,
    accreditations: ["NABH Ayush Platinum", "Green Leaf Certified", "ISO 9001"],
    specialties: ["Classical Ayurveda", "Rehabilitation & Wellness"],
    doctors: ["Dr. Arya Varma, BAMS, MD", "Dr. Sreedharan Vaidyan"],
    facilities: ["30 Private Ayurveda Treatment Pavilions", "Sea-facing Yoga & Meditation Halls", "Herbal Pharmacy & Garden", "Organic Ayurvedic Kitchen"],
    internationalServices: [
      "Airport VIP Escort from TRV Airport",
      "German, Russian, French & Italian Interpreters",
      "Pre-Travel Dosha Consultation"
    ],
    languages: ["English", "German", "French", "Russian", "Italian", "Malayalam", "Hindi"],
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    rating: 4.97,
    reviewCount: 3880,
    displayOrder: 4,
    status: "ACTIVE",
    published: "PUBLISHED",
    casesActive: 15
  },
  {
    id: "HSP-05",
    name: "Rajagiri Hospital",
    tagline: "JCI-Accredited 500-bed quaternary center near Cochin Airport",
    shortDescription: "Quaternary multi-specialty hub only 15 minutes from Cochin International Airport.",
    fullDescription: "Located 15 minutes from Cochin Airport, Rajagiri Hospital blends world-class surgical protocols with compassionate Kerala care across cardiac, transplant, and robotic oncology programs.",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=600"
    ],
    address: "Chunangamvely, Edathala P.O., Aluva",
    city: "Aluva, Kochi",
    district: "Ernakulam / Kochi",
    region: "Central Kerala",
    state: "Kerala",
    country: "India",
    postalCode: "683112",
    phone: "+91 484 290 5000",
    email: "international@rajagirihospital.com",
    website: "https://rajagirihospital.com",
    emergencyPhone: "+91 484 290 5555",
    beds: "500 Beds",
    establishedYear: 2014,
    internationalPatientsAnnual: 19500,
    nearestAirport: "Cochin International Airport (COK)",
    airportDistanceKm: 14,
    accreditations: ["JCI Accredited", "NABH", "NABL"],
    specialties: ["Cardiology & Bypass", "Robotic Orthopaedics", "Comprehensive Oncology", "Neurology & Neurosurgery", "Living-Donor Transplants"],
    doctors: ["Dr. Harikrishnan Pillai, MCh", "Dr. Deepa S., MD, DGO"],
    facilities: ["Biplane Neuro Cath Lab", "TrueBeam Radiotherapy Suite", "Cardiac ICU with ECMO", "Luxury Guest Suites"],
    internationalServices: [
      "Express Airport Pickup in 15 Minutes",
      "Medical Visa Fast-Track Documentation Desk",
      "Arabic Translators On-Site"
    ],
    languages: ["English", "Arabic", "Malayalam", "Hindi", "French"],
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    rating: 4.92,
    reviewCount: 3180,
    displayOrder: 5,
    status: "ACTIVE",
    published: "PUBLISHED",
    casesActive: 10
  }
];

const DISTRICTS_LIST = [
  "All Districts",
  "Ernakulam / Kochi",
  "Thiruvananthapuram",
  "Kozhikode",
  "Kottayam",
  "Malappuram",
  "Thrissur",
  "Palakkad",
  "Kollam",
  "Kannur",
  "Alappuzha",
  "Pathanamthitta",
  "Idukki",
  "Wayanad",
  "Kasaragod"
];

const REGIONS_LIST = ["Central Kerala", "South Kerala", "North Kerala"];

const ACCREDITATIONS_OPTIONS = [
  "JCI Accredited",
  "NABH Certified",
  "NABL Accredited",
  "GreenOT Certified",
  "Ayush Platinum",
  "ACHSI Accredited",
  "ISO 9001",
  "Green Leaf Certified"
];

const FACILITIES_OPTIONS = [
  "Da Vinci Xi Robotic Surgery System",
  "Hybrid Cardiac Cath Lab",
  "TrueBeam Radiotherapy Suite",
  "Integrated Bone Marrow Unit",
  "Biplane Neurovascular Cath Lab",
  "Private Water Taxi & Helipad",
  "Luxury Presidential Suites",
  "Halal Certified Dietary Kitchen",
  "24/7 International Concierge Desk",
  "Ayurveda Rejuvenation Wing",
  "Level 1 Emergency Trauma Center"
];

export default function HospitalsAdminPage() {
  const [hospitals, setHospitals] = useState<HospitalAdminItem[]>(INITIAL_HOSPITALS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("All Districts");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "ACTIVE" | "INACTIVE">("All");
  const [selectedPublished, setSelectedPublished] = useState<"All" | "PUBLISHED" | "DRAFT">("All");
  const [selectedSpecialtyFilter, setSelectedSpecialtyFilter] = useState("All");
  const [sortBy, setSortBy] = useState<"order" | "name" | "beds" | "rating">("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;

  // Available Specialties & Doctors from Admin modules
  const [availableSpecialties, setAvailableSpecialties] = useState<string[]>([
    "Cardiology & Bypass",
    "Robotic Orthopaedics",
    "Comprehensive Oncology",
    "Neurology & Neurosurgery",
    "Classical Ayurveda",
    "Living-Donor Transplants",
    "Ophthalmology",
    "Fertility & IVF",
    "Gastroenterology",
    "Urology & Nephrology",
    "Dental Care",
    "Rehabilitation & Wellness"
  ]);

  const [availableDoctors, setAvailableDoctors] = useState<string[]>([
    "Dr. K. S. Muralidharan, DM, FACC",
    "Dr. Vijay Anand, MS (Ortho), MCh",
    "Dr. Thomas Mathew, DM, MRCP",
    "Dr. Harikrishnan Pillai, MCh",
    "Dr. Arya Varma, BAMS, MD",
    "Dr. Venugopal B., MS, MCh",
    "Dr. Preethi Menon, MS, DNB",
    "Dr. Deepa S., MD, DGO",
    "Dr. Roy J. Mukkada, MD, DM",
    "Dr. Kishore T. A., MS, MCh",
    "Dr. Mathew P. C., MDS, FIBOMS",
    "Dr. Lakshmi N., BPT, MPT"
  ]);

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [activeHospital, setActiveHospital] = useState<HospitalAdminItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    shortDescription: "",
    fullDescription: "",
    image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
    address: "",
    city: "Kochi",
    district: "Ernakulam / Kochi",
    region: "Central Kerala" as "South Kerala" | "Central Kerala" | "North Kerala",
    postalCode: "682027",
    phone: "+91 484 669 9999",
    email: "international@hospital.com",
    website: "https://hospital.com",
    emergencyPhone: "+91 484 669 9000",
    beds: "500 Beds",
    establishedYear: 2014,
    internationalPatientsAnnual: 18000,
    nearestAirport: "Cochin International Airport (COK)",
    airportDistanceKm: 20,
    accreditations: ["JCI Accredited", "NABH Certified"],
    specialties: ["Cardiology & Bypass", "Robotic Orthopaedics"],
    doctors: ["Dr. K. S. Muralidharan, DM, FACC"],
    facilities: ["Da Vinci Xi Robotic Surgery System", "Hybrid Cardiac Cath Lab"],
    internationalServices: [
      "24/7 International Patient Desk with Dedicated Relationship Manager",
      "Medical eVisa Fast-Track Invitation Letter in 4 Hours"
    ],
    languages: ["English", "Arabic", "Malayalam", "Hindi"],
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    displayOrder: 1,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    published: "PUBLISHED" as "PUBLISHED" | "DRAFT"
  });

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("maides_admin_hospitals");
      if (stored) {
        setHospitals(JSON.parse(stored));
      } else {
        setHospitals(INITIAL_HOSPITALS);
        localStorage.setItem("maides_admin_hospitals", JSON.stringify(INITIAL_HOSPITALS));
      }
    } catch {
      setHospitals(INITIAL_HOSPITALS);
    }

    // Load available specialties
    try {
      const storedSpecs = localStorage.getItem("maides_admin_specialties");
      if (storedSpecs) {
        const parsed = JSON.parse(storedSpecs);
        const specNames = parsed.map((s: any) => s.name).filter(Boolean);
        if (specNames.length) {
          setAvailableSpecialties(Array.from(new Set([...specNames, ...availableSpecialties])));
        }
      }
    } catch {}

    // Load available doctors
    try {
      const storedDocs = localStorage.getItem("maides_admin_doctors");
      if (storedDocs) {
        const parsed = JSON.parse(storedDocs);
        const docNames = parsed.map((d: any) => d.name).filter(Boolean);
        if (docNames.length) {
          setAvailableDoctors(Array.from(new Set([...docNames, ...availableDoctors])));
        }
      }
    } catch {}
  }, []);

  const saveToStorage = (updated: HospitalAdminItem[]) => {
    setHospitals(updated);
    localStorage.setItem("maides_admin_hospitals", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormError(null);
    const nextOrder = hospitals.length ? Math.max(...hospitals.map(h => h.displayOrder || 0)) + 1 : 1;
    setFormData({
      name: "",
      tagline: "",
      shortDescription: "",
      fullDescription: "",
      image: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      address: "Marine Drive / Healthcare Corridor",
      city: "Kochi",
      district: "Ernakulam / Kochi",
      region: "Central Kerala",
      postalCode: "682031",
      phone: "+91 484 220 0000",
      email: "international@hospital.org",
      website: "https://keralahospital.org",
      emergencyPhone: "+91 484 220 1111",
      beds: "450 Beds",
      establishedYear: 2016,
      internationalPatientsAnnual: 15000,
      nearestAirport: "Cochin International Airport (COK)",
      airportDistanceKm: 25,
      accreditations: ["JCI Accredited", "NABH Certified"],
      specialties: [availableSpecialties[0] || "Cardiology & Bypass", availableSpecialties[1] || "Robotic Orthopaedics"],
      doctors: [availableDoctors[0] || "Senior Specialist"],
      facilities: ["Da Vinci Xi Robotic Surgery System", "Hybrid Cardiac Cath Lab", "Luxury Presidential Suites"],
      internationalServices: [
        "24/7 International Patient Desk with Dedicated Relationship Manager",
        "Direct Chauffeur Escort from Airport",
        "Medical eVisa Fast-Track Invitation Letter in 4 Hours"
      ],
      languages: ["English", "Arabic", "Malayalam", "Hindi"],
      vipRoomsAvailable: true,
      ayurvedaWingAvailable: true,
      displayOrder: nextOrder,
      status: "ACTIVE",
      published: "PUBLISHED"
    });
    setIsAddModalOpen(true);
  };

  // Form Validation
  const validateForm = (isEdit: boolean = false, currentId?: string): boolean => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setFormError("Hospital name is required and cannot be empty.");
      return false;
    }
    if (trimmedName.length < 3) {
      setFormError("Hospital name must be at least 3 characters.");
      return false;
    }
    const duplicate = hospitals.find(
      (h) => h.name.toLowerCase() === trimmedName.toLowerCase() && (!isEdit || h.id !== currentId)
    );
    if (duplicate) {
      setFormError('A hospital named "' + trimmedName + '" is already registered.');
      return false;
    }
    if (formData.email && !/^[^s@]+@[^s@]+.[^s@]+$/.test(formData.email.trim())) {
      setFormError("Please enter a valid international contact email address.");
      return false;
    }
    if (Number(formData.displayOrder) < 1) {
      setFormError("Display order must be a positive integer (1 or higher).");
      return false;
    }
    setFormError(null);
    return true;
  };

  // Submit Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm(false)) return;

    const newId = `HSP-${String(hospitals.length + 1).padStart(2, "0")}`;
    const cleanName = formData.name.trim().replace(/<[^>]*>?/gm, '');

    const newHosp: HospitalAdminItem = {
      id: newId,
      name: cleanName,
      tagline: formData.tagline.trim() || `${formData.accreditations[0] || "Accredited"} quaternary healthcare destination in ${formData.city}`,
      shortDescription: formData.shortDescription.trim() || `${cleanName} is an accredited quaternary medical campus in ${formData.city}, Kerala.`,
      fullDescription: formData.fullDescription.trim() || `${cleanName} delivers internationally accredited clinical care, surgical robotics, and dedicated international patient services.`,
      image: formData.image.trim() || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      galleryImages: [formData.image.trim()],
      address: formData.address.trim(),
      city: formData.city.trim(),
      district: formData.district,
      region: formData.region,
      state: "Kerala",
      country: "India",
      postalCode: formData.postalCode.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      website: formData.website.trim(),
      emergencyPhone: formData.emergencyPhone.trim(),
      beds: formData.beds.includes("Beds") ? formData.beds.trim() : `${formData.beds.trim()} Beds`,
      establishedYear: Number(formData.establishedYear) || 2015,
      internationalPatientsAnnual: Number(formData.internationalPatientsAnnual) || 12000,
      nearestAirport: formData.nearestAirport.trim(),
      airportDistanceKm: Number(formData.airportDistanceKm) || 25,
      accreditations: formData.accreditations.length ? formData.accreditations : ["NABH Certified"],
      specialties: formData.specialties.length ? formData.specialties : ["Multispecialty Healthcare"],
      doctors: formData.doctors.length ? formData.doctors : ["Senior Clinical Consultant"],
      facilities: formData.facilities.length ? formData.facilities : ["Advanced Diagnostic Imaging"],
      internationalServices: formData.internationalServices.length ? formData.internationalServices : ["24/7 International Desk"],
      languages: formData.languages,
      vipRoomsAvailable: formData.vipRoomsAvailable,
      ayurvedaWingAvailable: formData.ayurvedaWingAvailable,
      rating: 4.92,
      reviewCount: 1540,
      displayOrder: Number(formData.displayOrder) || (hospitals.length + 1),
      status: formData.status,
      published: formData.published,
      casesActive: 0
    };

    const updated = [newHosp, ...hospitals];
    saveToStorage(updated);
    setIsAddModalOpen(false);
    showToast(`Hospital "${newHosp.name}" successfully registered and published to public landing.`);
  };

  // Open Edit
  const handleOpenEdit = (hosp: HospitalAdminItem) => {
    setActiveHospital(hosp);
    setFormError(null);
    setFormData({
      name: hosp.name,
      tagline: hosp.tagline || "",
      shortDescription: hosp.shortDescription || "",
      fullDescription: hosp.fullDescription || "",
      image: hosp.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      address: hosp.address || "",
      city: hosp.city || "Kochi",
      district: hosp.district || "Ernakulam / Kochi",
      region: hosp.region || "Central Kerala",
      postalCode: hosp.postalCode || "",
      phone: hosp.phone || "",
      email: hosp.email || "",
      website: hosp.website || "",
      emergencyPhone: hosp.emergencyPhone || "",
      beds: hosp.beds || "500 Beds",
      establishedYear: hosp.establishedYear || 2014,
      internationalPatientsAnnual: hosp.internationalPatientsAnnual || 15000,
      nearestAirport: hosp.nearestAirport || "Cochin International Airport (COK)",
      airportDistanceKm: hosp.airportDistanceKm || 20,
      accreditations: hosp.accreditations || ["NABH Certified"],
      specialties: hosp.specialties || [],
      doctors: hosp.doctors || [],
      facilities: hosp.facilities || [],
      internationalServices: hosp.internationalServices || [],
      languages: hosp.languages || ["English", "Arabic", "Malayalam"],
      vipRoomsAvailable: hosp.vipRoomsAvailable ?? true,
      ayurvedaWingAvailable: hosp.ayurvedaWingAvailable ?? true,
      displayOrder: hosp.displayOrder || 1,
      status: hosp.status || "ACTIVE",
      published: hosp.published || "PUBLISHED"
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeHospital) return;
    if (!validateForm(true, activeHospital.id)) return;

    const cleanName = formData.name.trim().replace(/<[^>]*>?/gm, '');

    const updated = hospitals.map((h) => {
      if (h.id === activeHospital.id) {
        return {
          ...h,
          name: cleanName,
          tagline: formData.tagline.trim() || h.tagline,
          shortDescription: formData.shortDescription.trim() || h.shortDescription,
          fullDescription: formData.fullDescription.trim() || h.fullDescription,
          image: formData.image.trim() || h.image,
          address: formData.address.trim() || h.address,
          city: formData.city.trim() || h.city,
          district: formData.district,
          region: formData.region,
          postalCode: formData.postalCode.trim() || h.postalCode,
          phone: formData.phone.trim() || h.phone,
          email: formData.email.trim() || h.email,
          website: formData.website.trim() || h.website,
          emergencyPhone: formData.emergencyPhone.trim() || h.emergencyPhone,
          beds: formData.beds.includes("Beds") ? formData.beds.trim() : `${formData.beds.trim()} Beds`,
          establishedYear: Number(formData.establishedYear) || h.establishedYear,
          internationalPatientsAnnual: Number(formData.internationalPatientsAnnual) || h.internationalPatientsAnnual,
          nearestAirport: formData.nearestAirport.trim() || h.nearestAirport,
          airportDistanceKm: Number(formData.airportDistanceKm) || h.airportDistanceKm,
          accreditations: formData.accreditations,
          specialties: formData.specialties,
          doctors: formData.doctors,
          facilities: formData.facilities,
          internationalServices: formData.internationalServices,
          languages: formData.languages,
          vipRoomsAvailable: formData.vipRoomsAvailable,
          ayurvedaWingAvailable: formData.ayurvedaWingAvailable,
          displayOrder: Number(formData.displayOrder) || h.displayOrder,
          status: formData.status,
          published: formData.published
        };
      }
      return h;
    });

    saveToStorage(updated);
    setIsEditModalOpen(false);
    showToast(`Hospital "${formData.name}" updated successfully.`);
  };

  // Toggle Status
  const handleToggleStatus = (id: string) => {
    const updated = hospitals.map((h) => {
      if (h.id === id) {
        const nextStatus = h.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        showToast(`Hospital "${h.name}" status changed to ${nextStatus}.`);
        return { ...h, status: nextStatus as "ACTIVE" | "INACTIVE" };
      }
      return h;
    });
    saveToStorage(updated);
  };

  // Toggle Published
  const handleTogglePublished = (id: string) => {
    const updated = hospitals.map((h) => {
      if (h.id === id) {
        const nextPub = h.published === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        showToast(`Hospital "${h.name}" public visibility set to ${nextPub}.`);
        return { ...h, published: nextPub as "PUBLISHED" | "DRAFT" };
      }
      return h;
    });
    saveToStorage(updated);
  };

  // Open View
  const handleOpenView = (hosp: HospitalAdminItem) => {
    setActiveHospital(hosp);
    setIsViewModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (hosp: HospitalAdminItem) => {
    setActiveHospital(hosp);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeHospital) return;
    const name = activeHospital.name;
    const updated = hospitals.filter((h) => h.id !== activeHospital.id);
    saveToStorage(updated);
    setIsDeleteModalOpen(false);
    showToast(`Hospital "${name}" removed from accredited database.`);
  };

  // Multi-select toggles
  const toggleArrayItem = (list: string[], item: string, setter: (val: string[]) => void) => {
    if (list.includes(item)) {
      setter(list.filter(i => i !== item));
    } else {
      setter([...list, item]);
    }
  };

  // Filter & Sort
  const processedHospitals = useMemo(() => {
    let list = hospitals.filter((h) => {
      const matchesSearch =
        h.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (h.district && h.district.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (h.specialties && h.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()))) ||
        (h.facilities && h.facilities.some(f => f.toLowerCase().includes(searchTerm.toLowerCase())));

      const matchesDistrict =
        selectedDistrict === "All Districts" || h.district === selectedDistrict || (selectedDistrict === "Ernakulam / Kochi" && (h.district === "Ernakulam" || h.district === "Ernakulam / Kochi"));

      const matchesRegion =
        selectedRegion === "All" || h.region === selectedRegion;

      const matchesStatus =
        selectedStatus === "All" || h.status === selectedStatus;

      const matchesPublished =
        selectedPublished === "All" || (h.published || "PUBLISHED") === selectedPublished;

      const matchesSpecialty =
        selectedSpecialtyFilter === "All" || (h.specialties && h.specialties.includes(selectedSpecialtyFilter));

      return matchesSearch && matchesDistrict && matchesRegion && matchesStatus && matchesPublished && matchesSpecialty;
    });

    list.sort((a, b) => {
      let comp = 0;
      if (sortBy === "order") {
        comp = (a.displayOrder || 99) - (b.displayOrder || 99);
      } else if (sortBy === "name") {
        comp = a.name.localeCompare(b.name);
      } else if (sortBy === "beds") {
        comp = (parseInt(b.beds) || 0) - (parseInt(a.beds) || 0);
      } else if (sortBy === "rating") {
        comp = (b.rating || 0) - (a.rating || 0);
      }
      return sortOrder === "asc" ? comp : -comp;
    });

    return list;
  }, [hospitals, searchTerm, selectedDistrict, selectedRegion, selectedStatus, selectedPublished, selectedSpecialtyFilter, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedHospitals.length / pageSize) || 1;
  const paginatedHospitals = processedHospitals.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/50 text-emerald-300 text-xs font-semibold shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-[#0E82FD]" />
            Accredited Partner Hospital Network
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Configure Kerala quaternary institutions, JCI/NABH accreditations, international facilities, and doctor faculties.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/hospitals"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#0E82FD]" />
            <span>Public Directory</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Hospital Partner
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Registered</div>
            <div className="text-lg font-bold text-white">{hospitals.length} Campuses</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Publicly Live</div>
            <div className="text-lg font-bold text-emerald-400">
              {hospitals.filter(h => h.status === "ACTIVE" && h.published !== "DRAFT").length} Live
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <BedDouble className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Inpatient Beds</div>
            <div className="text-lg font-bold text-purple-400">
              {hospitals.reduce((acc, curr) => acc + (parseInt(curr.beds) || 500), 0).toLocaleString()}+ Beds
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">JCI / NABH Rate</div>
            <div className="text-lg font-bold text-amber-400">100% Accredited</div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by hospital name, city, district, specialties, facilities..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* District Filter */}
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              {DISTRICTS_LIST.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>

            {/* Region Filter */}
            <select
              value={selectedRegion}
              onChange={(e) => { setSelectedRegion(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="All">Region: All</option>
              {REGIONS_LIST.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value as any); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="All">Status: All</option>
              <option value="ACTIVE">Active Only</option>
              <option value="INACTIVE">Inactive Only</option>
            </select>

            {/* Published Filter */}
            <select
              value={selectedPublished}
              onChange={(e) => { setSelectedPublished(e.target.value as any); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="All">Publish: All</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft / Hidden</option>
            </select>

            {/* Specialty Filter */}
            <select
              value={selectedSpecialtyFilter}
              onChange={(e) => { setSelectedSpecialtyFilter(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="All">Specialty: All</option>
              {availableSpecialties.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
              <span className="text-[11px] text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="order" className="bg-slate-900">Display Order</option>
                <option value="name" className="bg-slate-900">Name (A-Z)</option>
                <option value="beds" className="bg-slate-900">Bed Capacity</option>
                <option value="rating" className="bg-slate-900">Rating</option>
              </select>
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="p-1 text-slate-400 hover:text-white"
                title="Toggle Sort Order"
              >
                <ArrowUpDown className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-900">
          <span>Showing <strong className="text-white">{processedHospitals.length}</strong> hospitals</span>
          {(searchTerm || selectedDistrict !== "All Districts" || selectedRegion !== "All" || selectedStatus !== "All" || selectedPublished !== "All" || selectedSpecialtyFilter !== "All") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setSelectedDistrict("All Districts");
                setSelectedRegion("All");
                setSelectedStatus("All");
                setSelectedPublished("All");
                setSelectedSpecialtyFilter("All");
              }}
              className="text-[#0E82FD] hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>
      </div>

      {/* Hospitals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedHospitals.map((hosp) => {
          const isLive = hosp.status === "ACTIVE" && hosp.published !== "DRAFT";

          return (
            <div
              key={hosp.id}
              className="bg-slate-900/90 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
            >
              <div>
                {/* Cover Image & Badges */}
                <div className="relative h-48 bg-slate-950 overflow-hidden">
                  <img
                    src={hosp.image}
                    alt={hosp.name}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5">
                    <button
                      onClick={() => handleToggleStatus(hosp.id)}
                      title="Toggle Active/Inactive"
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors ${
                        hosp.status === "ACTIVE"
                          ? "bg-emerald-500/90 text-white border border-emerald-400/50"
                          : "bg-red-500/90 text-white border border-red-400/50"
                      }`}
                    >
                      {hosp.status}
                    </button>
                    <button
                      onClick={() => handleTogglePublished(hosp.id)}
                      title="Toggle Published/Draft"
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md transition-colors ${
                        hosp.published === "DRAFT"
                          ? "bg-amber-500/90 text-white border border-amber-400/50"
                          : "bg-blue-500/90 text-white border border-blue-400/50"
                      }`}
                    >
                      {hosp.published || "PUBLISHED"}
                    </button>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                        {hosp.region} · #{hosp.displayOrder || 1}
                      </span>
                      <h3 className="text-base font-bold text-white group-hover:text-[#0E82FD] transition-colors line-clamp-1">
                        {hosp.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 bg-slate-950/80 px-2 py-0.5 rounded-md border border-slate-800 text-[11px] text-amber-400 font-bold">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span>{hosp.rating || 4.9}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#0E82FD] shrink-0" />
                      <span className="line-clamp-1">{hosp.city}, {hosp.district}</span>
                    </div>
                    <span className="font-semibold text-slate-300">{hosp.beds}</span>
                  </div>

                  {/* Accreditations */}
                  <div className="flex flex-wrap gap-1.5">
                    {hosp.accreditations?.slice(0, 3).map((acc, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-blue-500/10 text-blue-300 text-[10px] font-semibold border border-blue-500/20">
                        {acc}
                      </span>
                    ))}
                    {hosp.accreditations?.length > 3 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 text-[10px]">
                        +{hosp.accreditations.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {hosp.shortDescription || hosp.tagline || hosp.fullDescription}
                  </p>

                  {/* Specialties & Doctors overview */}
                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5 text-[11px] text-slate-400">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Specialties:</span>
                      <span className="font-medium text-slate-200">{hosp.specialties?.length || 0} Clinical Centers</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Airport Distance:</span>
                      <span className="font-medium text-[#0E82FD]">{hosp.airportDistanceKm || 25} km from COK/TRV</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-5 pt-0 border-t border-slate-800/80 flex items-center justify-between gap-2 mt-2">
                <div className="flex items-center gap-1 pt-3">
                  <button
                    onClick={() => handleOpenView(hosp)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="View Hospital Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(hosp)}
                    className="p-1.5 text-slate-400 hover:text-[#0E82FD] hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Hospital"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(hosp)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete / Archive Hospital"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-3">
                  <button
                    onClick={() => handleOpenView(hosp)}
                    className="text-xs font-semibold text-[#0E82FD] hover:text-blue-400 flex items-center gap-1 transition-colors"
                  >
                    <span>Full Profile</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {processedHospitals.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No hospital campuses found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or register a new accredited hospital campus.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Hospital
          </button>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-slate-950 border border-slate-800/80 rounded-2xl p-3 px-4 text-xs text-slate-400">
          <div>
            Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === i + 1
                    ? "bg-[#0E82FD] text-white"
                    : "bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-800"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Building2 className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">
                  {isAddModalOpen ? "Register Accredited Hospital Partner" : `Edit Hospital: ${formData.name}`}
                </h2>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleCreate : handleUpdate} className="p-6 space-y-5">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* 1. BASIC INFORMATION */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#0E82FD] uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" />
                  1. Basic Institutional Profile
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Hospital Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Aster Medcity"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Tagline</label>
                    <input
                      type="text"
                      placeholder="e.g., JCI-Accredited Quaternary Waterfront Hospital"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Cover Image URL</label>
                    <input
                      type="text"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Bed Capacity</label>
                    <input
                      type="text"
                      placeholder="e.g., 670 Beds"
                      value={formData.beds}
                      onChange={(e) => setFormData({ ...formData, beds: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Short Summary</label>
                  <input
                    type="text"
                    placeholder="Brief description for directory card"
                    value={formData.shortDescription}
                    onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Full Description</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive overview of quaternary campus, infrastructure, surgical wings, and patient care..."
                    value={formData.fullDescription}
                    onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              {/* 2. LOCATION & CONTACT */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-[#0E82FD] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  2. Location & International Contact
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">City / Municipality</label>
                    <input
                      type="text"
                      placeholder="e.g., Kochi"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Kerala District</label>
                    <select
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    >
                      {DISTRICTS_LIST.filter(d => d !== "All Districts").map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Region</label>
                    <select
                      value={formData.region}
                      onChange={(e) => setFormData({ ...formData, region: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    >
                      {REGIONS_LIST.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Street Address</label>
                    <input
                      type="text"
                      placeholder="e.g., Cheranalloor, South Chittoor"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Phone</label>
                    <input
                      type="text"
                      placeholder="+91 484 669 9999"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">International Email</label>
                    <input
                      type="email"
                      placeholder="international@hospital.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Nearest Airport</label>
                    <input
                      type="text"
                      placeholder="Cochin International Airport (COK)"
                      value={formData.nearestAirport}
                      onChange={(e) => setFormData({ ...formData, nearestAirport: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Airport Distance (km)</label>
                    <input
                      type="number"
                      value={formData.airportDistanceKm}
                      onChange={(e) => setFormData({ ...formData, airportDistanceKm: parseInt(e.target.value) || 20 })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Website URL</label>
                    <input
                      type="text"
                      placeholder="https://hospital.com"
                      value={formData.website}
                      onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>
                </div>
              </div>

              {/* 3. ACCREDITATIONS & SPECIALTIES */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-[#0E82FD] uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" />
                  3. Accreditations, Specialties & Facilities
                </h4>

                {/* Accreditations */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Quality Accreditations ({formData.accreditations.length} selected)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                    {ACCREDITATIONS_OPTIONS.map((acc) => (
                      <label key={acc} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={formData.accreditations.includes(acc)}
                          onChange={() => toggleArrayItem(formData.accreditations, acc, (val) => setFormData({ ...formData, accreditations: val }))}
                          className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-0"
                        />
                        <span className="line-clamp-1">{acc}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Specialties Multi-select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Assigned Medical Specialties ({formData.specialties.length} selected)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-36 overflow-y-auto">
                    {availableSpecialties.map((spec) => (
                      <label key={spec} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={formData.specialties.includes(spec)}
                          onChange={() => toggleArrayItem(formData.specialties, spec, (val) => setFormData({ ...formData, specialties: val }))}
                          className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-0"
                        />
                        <span className="line-clamp-1">{spec}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Facilities Multi-select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Hospital Facilities & Infrastructure ({formData.facilities.length} selected)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-32 overflow-y-auto">
                    {FACILITIES_OPTIONS.map((fac) => (
                      <label key={fac} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                        <input
                          type="checkbox"
                          checked={formData.facilities.includes(fac)}
                          onChange={() => toggleArrayItem(formData.facilities, fac, (val) => setFormData({ ...formData, facilities: val }))}
                          className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-0"
                        />
                        <span className="line-clamp-1">{fac}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. MANAGEMENT & VISIBILITY */}
              <div className="space-y-3 pt-3 border-t border-slate-800">
                <h4 className="text-xs font-bold text-[#0E82FD] uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  4. Management & Visibility Controls
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      Display Order on Landing Page <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={formData.displayOrder}
                      onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 1 })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    >
                      <option value="ACTIVE">ACTIVE (Operational)</option>
                      <option value="INACTIVE">INACTIVE (Disabled)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-300">Public Visibility</label>
                    <select
                      value={formData.published}
                      onChange={(e) => setFormData({ ...formData, published: e.target.value as any })}
                      className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                    >
                      <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                      <option value="DRAFT">DRAFT (Hidden / Internal)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all"
                >
                  {isAddModalOpen ? "Register & Publish Hospital" : "Save Hospital Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewModalOpen && activeHospital && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Building2 className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{activeHospital.name}</h2>
                  <span className="text-xs text-slate-400">{activeHospital.city}, {activeHospital.district} · {activeHospital.beds}</span>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Badges */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  activeHospital.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  Status: {activeHospital.status}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  activeHospital.published === "DRAFT" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  Visibility: {activeHospital.published || "PUBLISHED"}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                  Landing Order #{activeHospital.displayOrder || 1}
                </span>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hospital Overview</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeHospital.fullDescription || activeHospital.shortDescription || activeHospital.tagline}
                </p>
              </div>

              {/* Accreditations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Accreditations & Certifications</h4>
                <div className="flex flex-wrap gap-2">
                  {activeHospital.accreditations?.map((acc, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium flex items-center gap-1.5">
                      <BadgeCheck className="w-3.5 h-3.5 text-[#0E82FD]" />
                      {acc}
                    </span>
                  ))}
                </div>
              </div>

              {/* Specialties */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {activeHospital.specialties?.map((spec, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1.5">
                      <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
                      {spec}
                    </span>
                  ))}
                </div>
              </div>

              {/* Facilities */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Advanced Facilities & Tech</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeHospital.facilities?.map((fac, i) => (
                    <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0E82FD]" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs text-slate-400">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Contact & Logistics</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div><strong>Address:</strong> {activeHospital.address || "Kochi, Kerala"}</div>
                  <div><strong>Phone:</strong> {activeHospital.phone}</div>
                  <div><strong>Email:</strong> {activeHospital.email}</div>
                  <div><strong>Airport:</strong> {activeHospital.nearestAirport} ({activeHospital.airportDistanceKm} km)</div>
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(activeHospital);
                }}
                className="px-4 py-2 bg-[#0E82FD] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Hospital
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE MODAL */}
      {isDeleteModalOpen && activeHospital && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white">Remove Hospital Partner?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to remove <strong className="text-white">"{activeHospital.name}"</strong>? This institution may have associated appointments, medical cases, or doctors.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] text-left">
                <strong>Best Practice:</strong> Deactivate or set to Draft instead of permanent deletion to preserve historical patient case continuity.
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  handleToggleStatus(activeHospital.id);
                  setIsDeleteModalOpen(false);
                }}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all"
              >
                Deactivate Instead (Recommended)
              </button>
              <button
                onClick={handleConfirmDelete}
                className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-all"
              >
                Confirm Permanent Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="w-full py-2 rounded-xl text-slate-400 hover:text-white text-xs font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
