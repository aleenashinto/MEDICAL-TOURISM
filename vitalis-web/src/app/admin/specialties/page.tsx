"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  HeartPulse, 
  Search, 
  Plus, 
  Activity, 
  Building2, 
  Stethoscope,
  Eye, 
  Edit, 
  Trash2, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  Layers, 
  Award, 
  ArrowRight,
  Globe,
  ShieldCheck,
  Filter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Brain,
  Leaf,
  Syringe,
  Ambulance,
  UserCheck,
  Pill,
  Palmtree,
  Microscope,
  Bone,
  EyeOff
} from "lucide-react";
import Link from "next/link";

export interface SpecialtyItem {
  id: string;
  name: string;
  code: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  image: string;
  displayOrder: number;
  status: "ACTIVE" | "INACTIVE";
  published: "PUBLISHED" | "DRAFT";
  hospitals: string[];
  doctors: string[];
  proceduresCount: number;
  keyProcedures: string[];
  accreditations: string[];
  leadDoctor: string;
  seoTitle?: string;
  seoDescription?: string;
}

const INITIAL_SPECIALTIES: SpecialtyItem[] = [
  {
    id: "SPEC-001",
    name: "Cardiology & Bypass",
    code: "CARDIO",
    category: "Interventional & Surgical",
    shortDescription: "Off-Pump CABG, TAVR, and pediatric cardiac surgery by senior directors.",
    fullDescription: "Cutting-edge cardiovascular institute equipped with hybrid catheterization labs, ECMO life support systems, and DaVinci surgical robotics for complex adult and congenital heart corrections.",
    iconName: "HeartPulse",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 18,
    hospitals: ["Aster Medcity, Kochi", "Amrita Institute of Medical Sciences", "Rajagiri Hospital, Aluva"],
    doctors: ["Dr. K. S. Muralidharan, DM, FACC", "Dr. Manoj P. Nair, MCh"],
    keyProcedures: [
      "Robotic Mitral & Aortic Valve Replacement",
      "Off-Pump Coronary Artery Bypass (CABG)",
      "Transcatheter Aortic Valve Implantation (TAVI)",
      "Complex Paediatric Congenital Heart Surgeries"
    ],
    accreditations: ["JCI Accredited", "NABH Digital Cardiology"],
    leadDoctor: "Dr. K. S. Muralidharan, DM, FACC",
    seoTitle: "Cardiology & Cardiac Surgery in Kerala - MAIDES Healthcare",
    seoDescription: "Affordable quaternary cardiology, bypass, and robotic valve replacements in Kerala accredited hospitals."
  },
  {
    id: "SPEC-002",
    name: "Robotic Orthopaedics",
    code: "ORTHO",
    category: "Surgical & Rehabilitation",
    shortDescription: "MAKO robotic knee & anterior hip replacement with same-day ambulation.",
    fullDescription: "World-class center of excellence for advanced musculoskeletal care, computer-navigated arthroplasty, sports injury reconstruction, and endoscopic spine decompression.",
    iconName: "Activity",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    displayOrder: 2,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 14,
    hospitals: ["Aster Medcity, Kochi", "VPS Lakeshore, Kochi", "Rajagiri Hospital, Aluva"],
    doctors: ["Dr. Vijay Anand, MS (Ortho), MCh", "Dr. Rajesh K. Varghese"],
    keyProcedures: [
      "Total Knee Replacement (Robotic & Minimally Invasive)",
      "Total Hip Arthroplasty (Bilateral / Unilateral)",
      "Arthroscopic ACL/PCL Ligament Reconstruction",
      "Spinal Decompression & Fusion Surgery"
    ],
    accreditations: ["JCI Accredited", "NABH Center of Excellence"],
    leadDoctor: "Dr. Vijay Anand, MS (Ortho), MCh",
    seoTitle: "Robotic Orthopedics & Joint Replacement Kerala",
    seoDescription: "Precision robotic knee and hip arthroplasty in Kerala with holistic physiotherapy recovery."
  },
  {
    id: "SPEC-003",
    name: "Comprehensive Oncology",
    code: "ONCO",
    category: "Medical, Surgical & Radiation",
    shortDescription: "TrueBeam radiation, surgical resection, and immunotherapy at RCC & Aster.",
    fullDescription: "Multidisciplinary comprehensive tumor boards, PET-CT fusion imaging, precision targeted biological therapies, robotic HIPEC, and organ-preserving oncology.",
    iconName: "Microscope",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    displayOrder: 3,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 15,
    hospitals: ["Amrita Institute of Medical Sciences", "Aster Medcity, Kochi", "VPS Lakeshore, Kochi"],
    doctors: ["Dr. Thomas Mathew, DM, MRCP", "Dr. Sanjeev Kumar, MCh"],
    keyProcedures: [
      "TrueBeam Stereotactic Radiotherapy",
      "Robotic HIPEC for Peritoneal Carcinomatosis",
      "Bone Marrow & Stem Cell Transplantation",
      "Precision Immunotherapy & Genomic Profiling"
    ],
    accreditations: ["JCI Comprehensive Cancer Center", "ESMO Recognized"],
    leadDoctor: "Dr. Thomas Mathew, DM, MRCP (Oncology)",
    seoTitle: "Cancer Care & Oncology in Kerala - MAIDES",
    seoDescription: "World-class cancer treatments, TrueBeam radiation, and bone marrow transplants in Kerala."
  },
  {
    id: "SPEC-004",
    name: "Neurology & Neurosurgery",
    code: "NEURO",
    category: "Neurosciences",
    shortDescription: "Endoscopic skull base surgery, awake craniotomy, and robotic spine fusion.",
    fullDescription: "Pioneering neurosciences institute delivering 24/7 hyperacute stroke thrombectomy, intraoperative neural navigation, DBS for Parkinson's, and microvascular decompression.",
    iconName: "Brain",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80",
    displayOrder: 4,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 11,
    hospitals: ["Rajagiri Hospital, Aluva", "Aster Medcity, Kochi", "Amrita Institute of Medical Sciences"],
    doctors: ["Dr. Harikrishnan Pillai, MCh", "Dr. George Joseph, DM"],
    keyProcedures: [
      "Endoscopic Skull Base & Brain Tumor Resection",
      "Deep Brain Stimulation (DBS) for Parkinson's",
      "Endovascular Coil Embolization for Aneurysms",
      "Microscopic Discectomy & Artificial Disc Replacement"
    ],
    accreditations: ["NABH Stroke Certified", "World Stroke Organization Center"],
    leadDoctor: "Dr. Harikrishnan Pillai, MCh (Neurosurgery)",
    seoTitle: "Neurosurgery & Neurology in Kerala",
    seoDescription: "Expert neurological surgery and brain tumor resection in Kerala quaternary centers."
  },
  {
    id: "SPEC-005",
    name: "Classical Ayurveda",
    code: "AYUR",
    category: "Holistic & Traditional",
    shortDescription: "Authentic Ashtavaidya 14-21 day Panchakarma at Kottakkal Arya Vaidya Sala.",
    fullDescription: "Authentic centuries-old Kerala Ayurvedic heritage delivered in serene NABH/Ayush Platinum accredited seaside hospitals and retreats for arthritis, neurological recovery, and deep detox.",
    iconName: "Leaf",
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
    displayOrder: 5,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 24,
    hospitals: ["Somatheeram Ayurvedic Village, Kovalam", "Vaidyaratnam Oushadhasala, Thrissur"],
    doctors: ["Dr. Arya Varma, BAMS, MD", "Dr. Sreedharan Vaidyan"],
    keyProcedures: [
      "Classical Panchakarma 21-Day Detoxification",
      "Shirodhara & Rasayana Rejuvenation Protocols",
      "Ayurvedic Arthritis & Spondylosis Management",
      "Neurological Rehabilitation & Paraplegia Care"
    ],
    accreditations: ["Ayush Platinum Certified", "Green Leaf Certified"],
    leadDoctor: "Dr. Arya Varma, BAMS, MD (Ayurveda)",
    seoTitle: "Authentic Kerala Ayurveda & Panchakarma Treatments",
    seoDescription: "Traditional Ashtavaidya Ayurvedic treatments, Panchakarma, and holistic wellness in Kerala."
  },
  {
    id: "SPEC-006",
    name: "Living-Donor Transplants",
    code: "TRANS",
    category: "Surgical & Intensive Care",
    shortDescription: "High-precision liver and kidney transplants with 96%+ survival record.",
    fullDescription: "One of South Asia's highest-volume living-donor liver and renal transplant units, offering laparoscopic donor hepatectomy, ABO-incompatible transplants, and pediatric organ recovery.",
    iconName: "Stethoscope",
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
    displayOrder: 6,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 9,
    hospitals: ["VPS Lakeshore, Kochi", "Aster Medcity, Kochi", "Amrita Institute of Medical Sciences"],
    doctors: ["Dr. Venugopal B., MS, MCh", "Dr. Aby Sankar, MS, FRCS"],
    keyProcedures: [
      "Living & Cadaveric Donor Liver Transplantation",
      "ABO-Incompatible Renal Transplantation",
      "Laparoscopic Living-Donor Hepatectomy",
      "Pancreatic Whipple & Complex Biliary Surgery"
    ],
    accreditations: ["Government Certified Transplant Center", "NABH Organ Unit"],
    leadDoctor: "Dr. Venugopal B., MS, MCh (GI Surgery)",
    seoTitle: "Liver & Kidney Transplants in Kerala",
    seoDescription: "Quaternary organ transplantation in Kerala with high success rates and international patient care."
  },
  {
    id: "SPEC-007",
    name: "Ophthalmology",
    code: "OPHTH",
    category: "Medical & Surgical",
    shortDescription: "Advanced SMILE laser, robotic cataract, and vitreoretinal microsurgery.",
    fullDescription: "State-of-the-art ophthalmic institute offering blade-free customized refractive correction, premium multifocal lens implants, and pediatric ophthalmology.",
    iconName: "Eye",
    image: "https://images.unsplash.com/photo-1579154204601-01588f351e67?auto=format&fit=crop&w=800&q=80",
    displayOrder: 7,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 14,
    hospitals: ["Aster Medcity, Kochi", "Amrita Institute of Medical Sciences"],
    doctors: ["Dr. Preethi Menon, MS, DNB", "Dr. Kiran Das, FRCS"],
    keyProcedures: [
      "SMILE Pro Blade-Free Laser Vision Correction",
      "Femtosecond Laser Robotic Cataract Surgery",
      "Vitreoretinal Microsurgery for Retinal Detachment",
      "Corneal Collagen Cross-Linking (C3R)"
    ],
    accreditations: ["NABH Eye Care", "ISO 9001"],
    leadDoctor: "Dr. Preethi Menon, MS, DNB (Ophthal)",
    seoTitle: "Ophthalmology & Laser Eye Surgery Kerala",
    seoDescription: "Blade-free laser vision and robotic cataract surgery in Kerala."
  },
  {
    id: "SPEC-008",
    name: "Fertility & IVF",
    code: "IVF",
    category: "Fertility & Reproductive",
    shortDescription: "ICSI, IMSI, blastocyst culture, and genetic screening with international protocols.",
    fullDescription: "High-success reproductive medicine and assisted reproduction center equipped with cleanroom IVF embryology labs, time-lapse embryo incubators, and fertility preservation.",
    iconName: "Syringe",
    image: "https://images.unsplash.com/photo-1597764690523-15bea4c581c9?auto=format&fit=crop&w=800&q=80",
    displayOrder: 8,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 8,
    hospitals: ["Aster Medcity, Kochi", "Amrita Institute of Medical Sciences", "Rajagiri Hospital, Aluva"],
    doctors: ["Dr. Deepa S., MD, DGO", "Dr. Rajeshwari K."],
    keyProcedures: [
      "Intracytoplasmic Sperm Injection (ICSI / IMSI)",
      "Laser-Assisted Hatching & Blastocyst Transfer",
      "Pre-Implantation Genetic Screening (PGD / PGS)",
      "Egg Freezing & Fertility Preservation"
    ],
    accreditations: ["NABH IVF Center", "ICMR Registered"],
    leadDoctor: "Dr. Deepa S., MD, DGO, FRCOG",
    seoTitle: "IVF & Fertility Treatments in Kerala",
    seoDescription: "Advanced assisted reproduction and IVF clinics in Kerala with high success rates."
  },
  {
    id: "SPEC-009",
    name: "Gastroenterology",
    code: "GASTRO",
    category: "Interventional & Surgical",
    shortDescription: "Therapeutic ERCP, endoscopic ultrasound, and advanced GI surgery.",
    fullDescription: "Comprehensive digestive disease center providing 24/7 GI bleed management, SpyGlass cholangioscopy, bariatric metabolic surgery, and colorectal oncology.",
    iconName: "Ambulance",
    image: "https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80",
    displayOrder: 9,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 10,
    hospitals: ["VPS Lakeshore, Kochi", "Aster Medcity, Kochi", "Amrita Institute of Medical Sciences"],
    doctors: ["Dr. Roy J. Mukkada, MD, DM", "Dr. Prakash K., MS, MCh"],
    keyProcedures: [
      "SpyGlass Single-Operator Cholangioscopy",
      "Endoscopic Retrograde Cholangiopancreatography (ERCP)",
      "Laparoscopic Sleeve Gastrectomy & Bypass",
      "Endoscopic Submucosal Dissection (ESD)"
    ],
    accreditations: ["NABH GI Center", "WGO Training Center"],
    leadDoctor: "Dr. Roy J. Mukkada, MD, DM (Gastro)",
    seoTitle: "Gastroenterology & GI Surgery in Kerala",
    seoDescription: "Advanced GI endoscopy, liver disease treatment, and digestive surgeries in Kerala."
  },
  {
    id: "SPEC-010",
    name: "Urology & Nephrology",
    code: "URO",
    category: "Surgical & Intensive Care",
    shortDescription: "Laser lithotripsy, robotic prostatectomy, and renal dialysis centers.",
    fullDescription: "Advanced urology department featuring Thulium laser stone removal, DaVinci robotic prostate surgery, pediatric reconstructive urology, and hemodialysis.",
    iconName: "UserCheck",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    displayOrder: 10,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 12,
    hospitals: ["Aster Medcity, Kochi", "Rajagiri Hospital, Aluva", "Amrita Institute of Medical Sciences"],
    doctors: ["Dr. Kishore T. A., MS, MCh", "Dr. Suresh Bhat, MS, MCh"],
    keyProcedures: [
      "Robotic Radical Prostatectomy & Partial Nephrectomy",
      "Flexible Ureteroscopy & Laser Lithotripsy (RIRS)",
      "Holmium Laser Enucleation of Prostate (HoLEP)",
      "Reconstructive Urethroplasty & Dialysis Access"
    ],
    accreditations: ["NABH Urology Center", "JCI Standards"],
    leadDoctor: "Dr. Kishore T. A., MS, MCh (Urology)",
    seoTitle: "Urology & Kidney Stone Treatments Kerala",
    seoDescription: "Robotic urology, laser kidney stone clearance, and renal care in Kerala."
  },
  {
    id: "SPEC-011",
    name: "Dental Care",
    code: "DENT",
    category: "Dental & Maxillofacial",
    shortDescription: "Full-mouth dental implants, digital smile design, and maxillofacial surgery.",
    fullDescription: "Cosmetic and reconstructive dental center utilizing 3D CBCT guided implantology, CAD/CAM ceramic crowns in 24 hours, and maxillofacial trauma reconstruction.",
    iconName: "Pill",
    image: "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80",
    displayOrder: 11,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 16,
    hospitals: ["Aster Medcity, Kochi", "Amrita Institute of Medical Sciences"],
    doctors: ["Dr. Mathew P. C., MDS, FIBOMS", "Dr. Anjana Nair, MDS"],
    keyProcedures: [
      "All-on-4 / All-on-6 Immediate Loading Implants",
      "Digital Smile Design (DSD) & Porcelain Veneers",
      "Orthognathic Corrective Jaw Surgery",
      "Laser Gum Contouring & Full Mouth Rehabilitation"
    ],
    accreditations: ["NABH Dental Center", "ISO 9001"],
    leadDoctor: "Dr. Mathew P. C., MDS, FIBOMS",
    seoTitle: "Dental Tourism & Implants in Kerala",
    seoDescription: "High-quality affordable dental implants and smile design in Kerala."
  },
  {
    id: "SPEC-012",
    name: "Rehabilitation & Wellness",
    code: "REHAB",
    category: "Holistic & Traditional",
    shortDescription: "Backwater post-surgical physiotherapy, yoga, and holistic restorative care.",
    fullDescription: "Dedicated convalescence center combining physical therapy, aquatic hydrotherapy, Ayurvedic recovery oils, and stress-reduction programs overlooking Kerala backwaters.",
    iconName: "Palmtree",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
    displayOrder: 12,
    status: "ACTIVE",
    published: "PUBLISHED",
    proceduresCount: 20,
    hospitals: ["Somatheeram Ayurvedic Village, Kovalam", "Aster Medcity, Kochi"],
    doctors: ["Dr. Lakshmi N., BPT, MPT", "Dr. Sreekumar P."],
    keyProcedures: [
      "Post-Joint Replacement Hydrotherapy & Mobility Rehab",
      "Neurological Stroke & Neuro-Restoration Program",
      "Post-Cardiac Rehabilitation & Aerobic Reconditioning",
      "Integrative Spine & Chronic Pain Management"
    ],
    accreditations: ["NABH Rehab Center", "Ayush Certified"],
    leadDoctor: "Dr. Lakshmi N., BPT, MPT (Neuro Rehab)",
    seoTitle: "Post-Surgical Rehabilitation & Wellness in Kerala",
    seoDescription: "Rejuvenating post-operative recovery and physiotherapy in Kerala backwater resorts."
  }
];

const CATEGORIES_LIST = [
  "All Categories",
  "Interventional & Surgical",
  "Surgical & Rehabilitation",
  "Medical, Surgical & Radiation",
  "Neurosciences",
  "Holistic & Traditional",
  "Surgical & Intensive Care",
  "Medical & Surgical",
  "Fertility & Reproductive",
  "Dental & Maxillofacial"
];

const ICON_OPTIONS = [
  { name: "HeartPulse", label: "Heart Pulse (Cardiology)", icon: HeartPulse },
  { name: "Activity", label: "Activity (Orthopaedics/Diagnostics)", icon: Activity },
  { name: "Microscope", label: "Microscope (Oncology)", icon: Microscope },
  { name: "Brain", label: "Brain (Neurology)", icon: Brain },
  { name: "Leaf", label: "Leaf (Ayurveda)", icon: Leaf },
  { name: "Stethoscope", label: "Stethoscope (Transplants/General)", icon: Stethoscope },
  { name: "Eye", label: "Eye (Ophthalmology)", icon: Eye },
  { name: "Syringe", label: "Syringe (Fertility/IVF)", icon: Syringe },
  { name: "Ambulance", label: "Ambulance (Gastro/Emergency)", icon: Ambulance },
  { name: "UserCheck", label: "User Check (Urology/Nephrology)", icon: UserCheck },
  { name: "Pill", label: "Pill (Dental/Pharmacy)", icon: Pill },
  { name: "Palmtree", label: "Palm Tree (Wellness/Rehab)", icon: Palmtree },
  { name: "Bone", label: "Bone (Spine/Bone)", icon: Bone },
  { name: "Sparkles", label: "Sparkles (Cosmetic)", icon: Sparkles }
];

export default function SpecialtiesAdminPage() {
  const [specialties, setSpecialties] = useState<SpecialtyItem[]>(INITIAL_SPECIALTIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedStatus, setSelectedStatus] = useState<"All" | "ACTIVE" | "INACTIVE">("All");
  const [selectedPublished, setSelectedPublished] = useState<"All" | "PUBLISHED" | "DRAFT">("All");
  const [sortBy, setSortBy] = useState<"order" | "name" | "procedures" | "status">("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Available Hospitals & Doctors for dynamic association
  const [availableHospitals, setAvailableHospitals] = useState<string[]>([
    "Aster Medcity, Kochi",
    "Amrita Institute of Medical Sciences",
    "VPS Lakeshore, Kochi",
    "Rajagiri Hospital, Aluva",
    "Apollo Adlux Hospital, Angamaly",
    "Somatheeram Ayurvedic Village, Kovalam",
    "Vaidyaratnam Oushadhasala, Thrissur"
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
  const [activeSpecialty, setActiveSpecialty] = useState<SpecialtyItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    category: "Interventional & Surgical",
    shortDescription: "",
    fullDescription: "",
    iconName: "HeartPulse",
    image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
    displayOrder: 1,
    status: "ACTIVE" as "ACTIVE" | "INACTIVE",
    published: "PUBLISHED" as "PUBLISHED" | "DRAFT",
    hospitals: [] as string[],
    doctors: [] as string[],
    proceduresCount: 10,
    keyProcedures: "",
    accreditations: "JCI Accredited, NABH Center of Excellence",
    leadDoctor: "",
    seoTitle: "",
    seoDescription: ""
  });

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maides_admin_specialties");
      if (saved) {
        setSpecialties(JSON.parse(saved));
      } else {
        setSpecialties(INITIAL_SPECIALTIES);
        localStorage.setItem("maides_admin_specialties", JSON.stringify(INITIAL_SPECIALTIES));
      }
    } catch {
      setSpecialties(INITIAL_SPECIALTIES);
    }

    // Load available hospitals
    try {
      const storedHosps = localStorage.getItem("maides_admin_hospitals");
      if (storedHosps) {
        const parsed = JSON.parse(storedHosps);
        const names = parsed.map((h: any) => h.name || h.hospitalName).filter(Boolean);
        if (names.length) {
          setAvailableHospitals(Array.from(new Set([...names, ...availableHospitals])));
        }
      }
    } catch {}

    // Load available doctors
    try {
      const storedDocs = localStorage.getItem("maides_admin_doctors");
      if (storedDocs) {
        const parsed = JSON.parse(storedDocs);
        const names = parsed.map((d: any) => d.name).filter(Boolean);
        if (names.length) {
          setAvailableDoctors(Array.from(new Set([...names, ...availableDoctors])));
        }
      }
    } catch {}
  }, []);

  const saveToStorage = (updated: SpecialtyItem[]) => {
    setSpecialties(updated);
    localStorage.setItem("maides_admin_specialties", JSON.stringify(updated));
    window.dispatchEvent(new Event("storage"));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormError(null);
    const nextOrder = specialties.length ? Math.max(...specialties.map(s => s.displayOrder || 0)) + 1 : 1;
    setFormData({
      name: "",
      code: `SPEC-${String(specialties.length + 1).padStart(3, "0")}`,
      category: "Interventional & Surgical",
      shortDescription: "",
      fullDescription: "",
      iconName: "HeartPulse",
      image: "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
      displayOrder: nextOrder,
      status: "ACTIVE",
      published: "PUBLISHED",
      hospitals: [availableHospitals[0] || "Aster Medcity, Kochi"],
      doctors: [availableDoctors[0] || "Senior Specialist Doctor"],
      proceduresCount: 8,
      keyProcedures: "Specialized Diagnostic Assessment, Minimally Invasive Procedures, Outpatient Consultation",
      accreditations: "JCI Accredited, NABH Center of Excellence",
      leadDoctor: availableDoctors[0] || "Chief Medical Consultant",
      seoTitle: "",
      seoDescription: ""
    });
    setIsAddModalOpen(true);
  };

  // Validation function
  const validateForm = (isEdit: boolean = false, currentId?: string): boolean => {
    const trimmedName = formData.name.trim();
    if (!trimmedName) {
      setFormError("Specialty name is required and cannot be empty.");
      return false;
    }
    if (trimmedName.length < 3) {
      setFormError("Specialty name must be at least 3 characters long.");
      return false;
    }
    // Duplicate check
    const duplicate = specialties.find(
      (s) => s.name.toLowerCase() === trimmedName.toLowerCase() && (!isEdit || s.id !== currentId)
    );
    if (duplicate) {
      setFormError(`A specialty named "${trimmedName}" already exists.`);
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

    const newId = `SPEC-${String(specialties.length + 1).padStart(3, "0")}`;
    const proceduresArr = formData.keyProcedures
      .split(",")
      .map((s) => s.trim().replace(/<[^>]*>?/gm, ''))
      .filter(Boolean);
    const accreditationsArr = formData.accreditations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const newSpecialty: SpecialtyItem = {
      id: newId,
      name: formData.name.trim().replace(/<[^>]*>?/gm, ''),
      code: formData.code.trim() || newId,
      category: formData.category,
      shortDescription: formData.shortDescription.trim() || `Premier center for ${formData.name.trim()} in Kerala.`,
      fullDescription: formData.fullDescription.trim() || `Comprehensive ${formData.name.trim()} department delivering world-standard international patient care with top medical specialists.`,
      iconName: formData.iconName,
      image: formData.image.trim() || "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
      displayOrder: Number(formData.displayOrder) || (specialties.length + 1),
      status: formData.status,
      published: formData.published,
      proceduresCount: Number(formData.proceduresCount) || proceduresArr.length || 5,
      hospitals: formData.hospitals.length ? formData.hospitals : ["Aster Medcity, Kochi"],
      doctors: formData.doctors.length ? formData.doctors : ["Chief Clinical Consultant"],
      keyProcedures: proceduresArr.length ? proceduresArr : ["Standardized Clinical Treatments"],
      accreditations: accreditationsArr.length ? accreditationsArr : ["NABH Accredited"],
      leadDoctor: formData.leadDoctor.trim() || "Chief Clinical Consultant",
      seoTitle: formData.seoTitle.trim() || `${formData.name.trim()} in Kerala - MAIDES Medical Tourism`,
      seoDescription: formData.seoDescription.trim() || `Explore affordable world-class ${formData.name.trim()} treatments in Kerala.`
    };

    const updated = [newSpecialty, ...specialties];
    saveToStorage(updated);
    setIsAddModalOpen(false);
    showToast(`Specialty "${newSpecialty.name}" created successfully and synced to the landing page.`);
  };

  // Open Edit
  const handleOpenEdit = (item: SpecialtyItem) => {
    setActiveSpecialty(item);
    setFormError(null);
    setFormData({
      name: item.name,
      code: item.code,
      category: item.category,
      shortDescription: item.shortDescription || "",
      fullDescription: item.fullDescription || "",
      iconName: item.iconName || "HeartPulse",
      image: item.image || "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
      displayOrder: item.displayOrder || 1,
      status: item.status,
      published: item.published || "PUBLISHED",
      hospitals: item.hospitals || [],
      doctors: item.doctors || [],
      proceduresCount: item.proceduresCount || 10,
      keyProcedures: item.keyProcedures ? item.keyProcedures.join(", ") : "",
      accreditations: item.accreditations ? item.accreditations.join(", ") : "NABH Accredited",
      leadDoctor: item.leadDoctor || "",
      seoTitle: item.seoTitle || "",
      seoDescription: item.seoDescription || ""
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSpecialty) return;
    if (!validateForm(true, activeSpecialty.id)) return;

    const proceduresArr = formData.keyProcedures
      .split(",")
      .map((s) => s.trim().replace(/<[^>]*>?/gm, ''))
      .filter(Boolean);
    const accreditationsArr = formData.accreditations
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const updated = specialties.map((s) => {
      if (s.id === activeSpecialty.id) {
        return {
          ...s,
          name: formData.name.trim().replace(/<[^>]*>?/gm, ''),
          code: formData.code.trim() || s.code,
          category: formData.category,
          shortDescription: formData.shortDescription.trim() || s.shortDescription,
          fullDescription: formData.fullDescription.trim() || s.fullDescription,
          iconName: formData.iconName,
          image: formData.image.trim() || s.image,
          displayOrder: Number(formData.displayOrder) || s.displayOrder,
          status: formData.status,
          published: formData.published,
          proceduresCount: Number(formData.proceduresCount) || proceduresArr.length || s.proceduresCount,
          hospitals: formData.hospitals,
          doctors: formData.doctors,
          keyProcedures: proceduresArr.length ? proceduresArr : s.keyProcedures,
          accreditations: accreditationsArr.length ? accreditationsArr : s.accreditations,
          leadDoctor: formData.leadDoctor.trim() || s.leadDoctor,
          seoTitle: formData.seoTitle.trim() || s.seoTitle,
          seoDescription: formData.seoDescription.trim() || s.seoDescription
        };
      }
      return s;
    });

    saveToStorage(updated);
    setIsEditModalOpen(false);
    showToast(`Specialty "${formData.name}" updated successfully.`);
  };

  // Quick Toggle Status
  const handleToggleStatus = (id: string) => {
    const updated = specialties.map((s) => {
      if (s.id === id) {
        const nextStatus = s.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        showToast(`Specialty "${s.name}" is now ${nextStatus}.`);
        return { ...s, status: nextStatus as "ACTIVE" | "INACTIVE" };
      }
      return s;
    });
    saveToStorage(updated);
  };

  // Quick Toggle Published
  const handleTogglePublished = (id: string) => {
    const updated = specialties.map((s) => {
      if (s.id === id) {
        const nextPub = s.published === "PUBLISHED" ? "DRAFT" : "PUBLISHED";
        showToast(`Specialty "${s.name}" set to ${nextPub}.`);
        return { ...s, published: nextPub as "PUBLISHED" | "DRAFT" };
      }
      return s;
    });
    saveToStorage(updated);
  };

  // Open View
  const handleOpenView = (item: SpecialtyItem) => {
    setActiveSpecialty(item);
    setIsViewModalOpen(true);
  };

  // Open Delete
  const handleOpenDelete = (item: SpecialtyItem) => {
    setActiveSpecialty(item);
    setIsDeleteModalOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = () => {
    if (!activeSpecialty) return;
    const name = activeSpecialty.name;
    const updated = specialties.filter((s) => s.id !== activeSpecialty.id);
    saveToStorage(updated);
    setIsDeleteModalOpen(false);
    showToast(`Specialty "${name}" permanently removed.`);
  };

  // Hospital Toggle
  const toggleHospital = (hosp: string) => {
    if (formData.hospitals.includes(hosp)) {
      setFormData({
        ...formData,
        hospitals: formData.hospitals.filter((h) => h !== hosp)
      });
    } else {
      setFormData({
        ...formData,
        hospitals: [...formData.hospitals, hosp]
      });
    }
  };

  // Doctor Toggle
  const toggleDoctor = (doc: string) => {
    if (formData.doctors.includes(doc)) {
      setFormData({
        ...formData,
        doctors: formData.doctors.filter((d) => d !== doc)
      });
    } else {
      setFormData({
        ...formData,
        doctors: [...formData.doctors, doc]
      });
    }
  };

  // Filter and Sort
  const processedSpecialties = useMemo(() => {
    let list = specialties.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.hospitals.some((h) => h.toLowerCase().includes(searchTerm.toLowerCase())) ||
        s.leadDoctor.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All Categories" || s.category === selectedCategory;

      const matchesStatus =
        selectedStatus === "All" || s.status === selectedStatus;

      const matchesPublished =
        selectedPublished === "All" || (s.published || "PUBLISHED") === selectedPublished;

      return matchesSearch && matchesCategory && matchesStatus && matchesPublished;
    });

    list.sort((a, b) => {
      let comp = 0;
      if (sortBy === "order") {
        comp = (a.displayOrder || 999) - (b.displayOrder || 999);
      } else if (sortBy === "name") {
        comp = a.name.localeCompare(b.name);
      } else if (sortBy === "procedures") {
        comp = (b.proceduresCount || 0) - (a.proceduresCount || 0);
      } else if (sortBy === "status") {
        comp = a.status.localeCompare(b.status);
      }
      return sortOrder === "asc" ? comp : -comp;
    });

    return list;
  }, [specialties, searchTerm, selectedCategory, selectedStatus, selectedPublished, sortBy, sortOrder]);

  const totalPages = Math.ceil(processedSpecialties.length / pageSize) || 1;
  const paginatedSpecialties = processedSpecialties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const getIconComponent = (iconName: string) => {
    const found = ICON_OPTIONS.find((i) => i.name === iconName);
    return found ? found.icon : HeartPulse;
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            <HeartPulse className="w-5 h-5 text-[#0E82FD]" />
            Medical Specialties & Centers of Excellence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage clinical specialty clusters, display orders, published status, and affiliated partner hospitals/doctors.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Link
            href="/#treatments"
            target="_blank"
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold rounded-xl transition-all"
          >
            <Globe className="w-3.5 h-3.5 text-[#0E82FD]" />
            <span>View Public Landing</span>
            <ExternalLink className="w-3 h-3 text-slate-500" />
          </Link>
          <button 
            onClick={handleOpenAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Specialty
          </button>
        </div>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <HeartPulse className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Specialties</div>
            <div className="text-lg font-bold text-white">{specialties.length} Centers</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Publicly Published</div>
            <div className="text-lg font-bold text-emerald-400">
              {specialties.filter(s => s.status === "ACTIVE" && s.published !== "DRAFT").length} Live
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Procedures Catalog</div>
            <div className="text-lg font-bold text-purple-400">
              {specialties.reduce((acc, curr) => acc + (curr.proceduresCount || 0), 0)}+ Surgeries
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Connected Networks</div>
            <div className="text-lg font-bold text-amber-400">{availableHospitals.length} Quaternary Hubs</div>
          </div>
        </div>
      </div>

      {/* Search, Filter and Sort Bar */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-4 space-y-3">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by specialty name, code, hospital, doctor or surgery..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
              className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
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

            {/* Sort Filter */}
            <div className="flex items-center gap-1 bg-slate-900 border border-slate-800 rounded-xl px-2 py-1">
              <span className="text-[11px] text-slate-400 font-medium">Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
              >
                <option value="order" className="bg-slate-900">Display Order</option>
                <option value="name" className="bg-slate-900">Name (A-Z)</option>
                <option value="procedures" className="bg-slate-900">Procedures Count</option>
                <option value="status" className="bg-slate-900">Status</option>
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
          <span>Showing <strong className="text-white">{processedSpecialties.length}</strong> matching specialties</span>
          {searchTerm && (
            <button
              onClick={() => { setSearchTerm(""); setSelectedCategory("All Categories"); setSelectedStatus("All"); setSelectedPublished("All"); }}
              className="text-[#0E82FD] hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>
      </div>

      {/* Specialties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {paginatedSpecialties.map((spec) => {
          const Icon = getIconComponent(spec.iconName);
          const isLive = spec.status === "ACTIVE" && spec.published !== "DRAFT";

          return (
            <div
              key={spec.id}
              className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD] group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{spec.code}</span>
                        <span className="text-[10px] text-slate-600">·</span>
                        <span className="text-[10px] text-blue-400 font-semibold">Order #{spec.displayOrder || 1}</span>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-[#0E82FD] transition-colors line-clamp-1">
                        {spec.name}
                      </h3>
                    </div>
                  </div>

                  {/* Status & Published Badges */}
                  <div className="flex flex-col items-end gap-1">
                    <button
                      onClick={() => handleToggleStatus(spec.id)}
                      title="Click to toggle Active/Inactive status"
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        spec.status === "ACTIVE"
                          ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                          : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                      }`}
                    >
                      {spec.status}
                    </button>
                    <button
                      onClick={() => handleTogglePublished(spec.id)}
                      title="Click to toggle Public Published / Draft"
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors ${
                        spec.published === "DRAFT"
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20 hover:bg-amber-500/20"
                          : "bg-blue-500/10 text-blue-400 border border-blue-500/20 hover:bg-blue-500/20"
                      }`}
                    >
                      {spec.published || "PUBLISHED"}
                    </button>
                  </div>
                </div>

                {/* Category & Procedures Tag */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 text-[10px] font-medium">
                    {spec.category}
                  </span>
                  <span className="px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-300 text-[10px] font-medium border border-purple-500/20">
                    {spec.proceduresCount || spec.keyProcedures?.length || 8} Procedures
                  </span>
                  {isLive && (
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-medium border border-emerald-500/20 flex items-center gap-1">
                      <Globe className="w-2.5 h-2.5" /> Landing Live
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {spec.shortDescription || spec.fullDescription}
                </p>

                {/* Lead Doctor & Partner Count */}
                <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/60 space-y-1.5 text-[11px] text-slate-400 mb-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Lead Specialist:</span>
                    <span className="font-medium text-slate-200 line-clamp-1">{spec.leadDoctor || "Chief Consultant"}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Partner Hospitals:</span>
                    <span className="font-medium text-[#0E82FD]">{spec.hospitals?.length || 1} Hospitals</span>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenView(spec)}
                    className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                    title="View Specialty Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenEdit(spec)}
                    className="p-1.5 text-slate-400 hover:text-[#0E82FD] hover:bg-slate-800 rounded-lg transition-colors"
                    title="Edit Specialty"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(spec)}
                    className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="Delete / Archive Specialty"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={() => handleOpenView(spec)}
                  className="text-xs font-semibold text-[#0E82FD] hover:text-blue-400 flex items-center gap-1 transition-colors"
                >
                  <span>Procedures</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {processedSpecialties.length === 0 && (
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <HeartPulse className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No specialties found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or create a new medical specialty center.
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] text-white text-xs font-semibold rounded-xl"
          >
            <Plus className="w-3.5 h-3.5" />
            Add First Specialty
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
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <h2 className="text-base font-bold text-white">
                  {isAddModalOpen ? "Add Medical Specialty" : `Edit Specialty: ${formData.name}`}
                </h2>
              </div>
              <button
                onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={isAddModalOpen ? handleCreate : handleUpdate} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Specialty Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">
                    Specialty Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Cardiology & Bypass"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                {/* Code */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Code / Identifier</label>
                  <input
                    type="text"
                    placeholder="e.g., CARDIO"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Category Cluster</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CATEGORIES_LIST.filter(c => c !== "All Categories").map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                {/* Display Order */}
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

                {/* Icon Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Icon</label>
                  <select
                    value={formData.iconName}
                    onChange={(e) => setFormData({ ...formData, iconName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {ICON_OPTIONS.map((opt) => (
                      <option key={opt.name} value={opt.name}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                {/* Lead Doctor */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Lead Consultant / Director</label>
                  <input
                    type="text"
                    placeholder="e.g., Dr. K. S. Muralidharan, DM"
                    value={formData.leadDoctor}
                    onChange={(e) => setFormData({ ...formData, leadDoctor: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                {/* Status */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Operational Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="ACTIVE">ACTIVE (Enabled)</option>
                    <option value="INACTIVE">INACTIVE (Disabled)</option>
                  </select>
                </div>

                {/* Published */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">Public Visibility</label>
                  <select
                    value={formData.published}
                    onChange={(e) => setFormData({ ...formData, published: e.target.value as any })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="PUBLISHED">PUBLISHED (Live on Website)</option>
                    <option value="DRAFT">DRAFT (Internal Only)</option>
                  </select>
                </div>
              </div>

              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Short Description (Landing Card)</label>
                <input
                  type="text"
                  placeholder="e.g., Off-Pump CABG, TAVR, and pediatric cardiac surgery by senior directors."
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              {/* Full Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Full Description</label>
                <textarea
                  rows={3}
                  placeholder="Detailed overview of clinical capabilities, technology, ICU support, and patient care standards..."
                  value={formData.fullDescription}
                  onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              {/* Key Procedures */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">Key Procedures (Comma separated)</label>
                <textarea
                  rows={2}
                  placeholder="Robotic Mitral Valve, Off-Pump CABG, TAVI, Paediatric Congenital Corrections"
                  value={formData.keyProcedures}
                  onChange={(e) => setFormData({ ...formData, keyProcedures: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
              </div>

              {/* Associate Partner Hospitals */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Associate Accredited Hospitals ({formData.hospitals.length} selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-36 overflow-y-auto">
                  {availableHospitals.map((hosp) => (
                    <label key={hosp} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={formData.hospitals.includes(hosp)}
                        onChange={() => toggleHospital(hosp)}
                        className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-0"
                      />
                      <span className="line-clamp-1">{hosp}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Associate Doctors */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Associate Specialists & Faculty ({formData.doctors.length} selected)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl max-h-36 overflow-y-auto">
                  {availableDoctors.map((doc) => (
                    <label key={doc} className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer hover:text-white">
                      <input
                        type="checkbox"
                        checked={formData.doctors.includes(doc)}
                        onChange={() => toggleDoctor(doc)}
                        className="rounded border-slate-700 bg-slate-900 text-[#0E82FD] focus:ring-0"
                      />
                      <span className="line-clamp-1">{doc}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* SEO Title & Description */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Cardiology Treatments in Kerala | MAIDES"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-300">SEO Meta Description</label>
                  <input
                    type="text"
                    placeholder="e.g., Explore accredited cardiac care in Kerala."
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              {/* Form Actions */}
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
                  {isAddModalOpen ? "Create & Publish Specialty" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* VIEW MODAL */}
      {isViewModalOpen && activeSpecialty && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-scale-up">
            <div className="sticky top-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-b border-slate-800 flex items-center justify-between z-10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">{activeSpecialty.name}</h2>
                  <span className="text-xs text-slate-400">{activeSpecialty.category} · Code: {activeSpecialty.code}</span>
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
                  activeSpecialty.status === "ACTIVE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  Status: {activeSpecialty.status}
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                  activeSpecialty.published === "DRAFT" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                }`}>
                  Visibility: {activeSpecialty.published || "PUBLISHED"}
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                  Landing Order #{activeSpecialty.displayOrder || 1}
                </span>
              </div>

              {/* Description */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Clinical Description</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {activeSpecialty.fullDescription || activeSpecialty.shortDescription}
                </p>
              </div>

              {/* Procedures List */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Key Procedures & Surgeries</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeSpecialty.keyProcedures?.map((proc, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-center gap-2 text-xs text-slate-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0E82FD] shrink-0" />
                      <span>{proc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Affiliated Hospitals */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Affiliated Partner Hospitals</h4>
                <div className="flex flex-wrap gap-2">
                  {activeSpecialty.hospitals?.map((hosp, idx) => (
                    <span key={idx} className="px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-medium flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-[#0E82FD]" />
                      {hosp}
                    </span>
                  ))}
                </div>
              </div>

              {/* Affiliated Doctors */}
              {activeSpecialty.doctors && activeSpecialty.doctors.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Associated Medical Specialists</h4>
                  <div className="flex flex-wrap gap-2">
                    {activeSpecialty.doctors.map((doc, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-medium flex items-center gap-1.5">
                        <Stethoscope className="w-3.5 h-3.5 text-purple-400" />
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* SEO Meta */}
              {activeSpecialty.seoTitle && (
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1 text-slate-400">
                  <div><strong>SEO Title:</strong> {activeSpecialty.seoTitle}</div>
                  <div><strong>SEO Description:</strong> {activeSpecialty.seoDescription}</div>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-slate-900/95 backdrop-blur-md px-6 py-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleOpenEdit(activeSpecialty);
                }}
                className="px-4 py-2 bg-[#0E82FD] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Specialty
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE / ARCHIVE MODAL */}
      {isDeleteModalOpen && activeSpecialty && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-bold text-white">Delete Specialty?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Are you sure you want to delete <strong className="text-white">"{activeSpecialty.name}"</strong>? This specialty is currently connected to {activeSpecialty.hospitals?.length || 0} hospitals and procedures.
              </p>
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] text-left">
                <strong>Best Practice:</strong> Deactivate or set to Draft instead of permanent deletion to preserve historical appointment records.
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                onClick={() => {
                  handleToggleStatus(activeSpecialty.id);
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
