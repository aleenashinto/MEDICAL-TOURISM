import { NextResponse } from "next/server";

export interface ServerDoctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  hospital: string;
  hospitalName?: string;
  experienceYears: number;
  education: string;
  certifications?: string;
  consultationFee?: string;
  registrationNumber?: string;
  phone?: string;
  email?: string;
  gender?: string;
  avatar: string;
  casesHandled: number;
  rating: string | number;
  languages: string[];
  department?: string;
  displayOrder: number;
  status: "ACTIVE" | "ON_LEAVE" | "INACTIVE";
  published: "PUBLISHED" | "DRAFT";
  bio: string;
  fullBiography?: string;
  availableDays?: string[];
  district?: string;
  city?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Global server memory store seeded with default doctors
let globalDoctorsStore: ServerDoctor[] = [
  {
    id: "dr-muralidharan-nair",
    name: "Dr. Muralidharan V. Nair",
    title: "Senior Director & Chief of Cardiothoracic & Vascular Surgery",
    specialty: "Cardiology & Cardiac Surgery",
    hospital: "Aster Medcity, Kochi",
    hospitalName: "Aster Medcity",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 27,
    education: "MBBS, MS (Gen Surg), MCh (CTVS - AIIMS), FRCS (Edinburgh)",
    certifications: "FRCS (Edinburgh), Fellow Cardiothoracic Surgery (AIIMS)",
    consultationFee: "$60 (₹5,000)",
    registrationNumber: "KMC-48291",
    phone: "+91 484 669 9999",
    email: "muralidharan.nair@astermedcity.com",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
    casesHandled: 11000,
    rating: "4.98",
    languages: ["English", "Malayalam", "Hindi", "Arabic"],
    department: "Center for Advanced Cardiac Sciences",
    displayOrder: 1,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Pioneered over 11,000 beating-heart coronary bypass and complex valve repair surgeries with a 99.4% surgical survival record across international cohorts.",
    fullBiography: "Chief Cardiac Surgeon with 27+ years of groundbreaking cardiovascular care. Leader of the Heart Transplant and Minimally Invasive Thoracic unit.",
    availableDays: ["Monday", "Wednesday", "Friday"]
  },
  {
    id: "dr-alex-thomas",
    name: "Dr. Alexander K. George",
    title: "Chief Orthopaedic Surgeon & Director of Robotic Joint Reconstruction",
    specialty: "Orthopaedics & Joint Replacement",
    hospital: "Rajagiri Hospital, Aluva",
    hospitalName: "Rajagiri Hospital",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 24,
    education: "MBBS, MS (Ortho), Fellowship Adult Reconstruction (Mayo Clinic, USA), AO Fellow (Switzerland)",
    certifications: "AAOS International Fellow, AO Spine Member",
    consultationFee: "$60 (₹5,000)",
    registrationNumber: "KMC-39102",
    phone: "+91 484 290 5000",
    email: "alexander.george@rajagirihospital.com",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80",
    casesHandled: 4200,
    rating: "4.96",
    languages: ["English", "Malayalam", "Hindi", "French"],
    department: "Institute of Orthopaedics & Joint Reconstruction",
    displayOrder: 2,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Renowned joint replacement specialist utilizing MAKO robotic navigation for sub-millimeter precision, rapid mobilization within 12 hours, and 30-year implant longevity.",
    fullBiography: "Over 24 years of surgical experience in primary, complex, and revision joint replacement surgeries. Trained at apex institutes in the UK and USA.",
    availableDays: ["Tuesday", "Thursday", "Saturday"]
  },
  {
    id: "dr-suresh-kumar",
    name: "Dr. K. Suresh Kumar",
    title: "Director of Neurosciences & Endoscopic Skull Base Surgery",
    specialty: "Neurology & Spine Surgery",
    hospital: "KIMSHEALTH, Trivandrum",
    hospitalName: "KIMSHEALTH Trivandrum",
    district: "Thiruvananthapuram",
    city: "Thiruvananthapuram, Kerala",
    experienceYears: 26,
    education: "MBBS, MCh (Neurosurgery - SCTIMST), FACS (USA)",
    certifications: "FACS (USA), WFNS Certified Skull Base Surgeon",
    consultationFee: "$75 (₹6,200)",
    registrationNumber: "KMC-55901",
    phone: "+91 471 294 1000",
    email: "suresh.kumar@kimshealth.org",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80",
    casesHandled: 3600,
    rating: "4.95",
    languages: ["English", "Malayalam", "Hindi", "Arabic", "Tamil"],
    department: "Institute of Neurosciences & Skull Base Surgery",
    displayOrder: 3,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Internationally recognized neurosurgeon treating complex brain tumors, aneurysm coiling, and spinal cord pathologies with ultra-precision neuronavigation.",
    fullBiography: "Specialized in keyhole neurosurgery, brain tumor resections with intraoperative neuromonitoring, and motion-preserving disc surgeries.",
    availableDays: ["Monday", "Tuesday", "Thursday"]
  },
  {
    id: "dr-madhavan-namboothiri",
    name: "Aryavaidyan Dr. K. M. Namboothiri",
    title: "Senior Physician & Chief of Classical Panchakarma Therapeutics",
    specialty: "Classical Ayurveda & Panchakarma",
    hospital: "Arya Vaidya Sala Kottakkal",
    hospitalName: "Arya Vaidya Sala Kottakkal",
    district: "Malappuram",
    city: "Kottakkal, Kerala",
    experienceYears: 30,
    education: "BAMS, MD (Ayurveda - Kerala University), Traditional Ashtavaidya Disciple",
    certifications: "Ashtavaidya Lineage Gold Standard, Ayush Certified",
    consultationFee: "$45 (₹3,700)",
    registrationNumber: "KTC-12845",
    phone: "+91 483 280 8000",
    email: "dr.namboothiri@aryavaidyasala.com",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
    casesHandled: 8500,
    rating: "4.99",
    languages: ["English", "Malayalam", "Sanskrit", "Hindi"],
    department: "Department of Classical Panchakarma & Rasayana",
    displayOrder: 4,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Seventh-generation Ashtavaidya physician specializing in chronic arthritis management, neuro-rehabilitation, and authentic 21-day cleansing Panchakarma regimens.",
    fullBiography: "Deep lineage expertise combined with clinical documentation treating over 8,500 international patients for chronic auto-immune and metabolic conditions.",
    availableDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
  },
  {
    id: "dr-thomas-mathew",
    name: "Dr. Thomas Mathew",
    title: "Chief of Medical & Surgical Gastroenterology & Liver Transplant",
    specialty: "Gastroenterology & Hepatology",
    hospital: "Amrita Hospital, Kochi",
    hospitalName: "Amrita Hospital",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 22,
    education: "MBBS, MD (Internal Medicine), DM (Gastroenterology - CMC Vellore)",
    certifications: "ISG Fellow, American College of Gastroenterology (FACG)",
    consultationFee: "$55 (₹4,500)",
    registrationNumber: "KMC-41829",
    phone: "+91 484 285 1234",
    email: "thomasmathew@aims.amrita.edu",
    gender: "Male",
    avatar: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=600&q=80",
    casesHandled: 5800,
    rating: "4.94",
    languages: ["English", "Malayalam", "Hindi"],
    department: "Institute of Digestive Diseases & Liver Sciences",
    displayOrder: 5,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Pioneer in therapeutic endoscopy, liver transplantation, and management of acute-on-chronic liver failure.",
    fullBiography: "Over two decades of clinical leadership in gastroenterology with high success rates in living donor liver transplants.",
    availableDays: ["Monday", "Wednesday", "Friday"]
  },
  {
    id: "dr-mary-varghese",
    name: "Dr. Mary Varghese",
    title: "Senior Consultant Surgical Oncologist & Breast Disease Specialist",
    specialty: "Oncology & Surgical Oncology",
    hospital: "VPS Lakeshore Hospital, Kochi",
    hospitalName: "VPS Lakeshore Hospital",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 19,
    education: "MBBS, MS (Gen Surgery), MCh (Surgical Oncology - RCC Trivandrum)",
    certifications: "SSO International Fellow, European Board of Surgery Qualification (EBSQ)",
    consultationFee: "$60 (₹5,000)",
    registrationNumber: "KMC-47201",
    phone: "+91 484 270 1011",
    email: "mary.varghese@lakeshorehospital.com",
    gender: "Female",
    avatar: "https://images.unsplash.com/photo-1594824813583-b78f4a13d789?auto=format&fit=crop&w=600&q=80",
    casesHandled: 3200,
    rating: "4.97",
    languages: ["English", "Malayalam", "Hindi", "Tamil"],
    department: "Center for Comprehensive Cancer Care",
    displayOrder: 6,
    status: "ACTIVE",
    published: "PUBLISHED",
    bio: "Pioneering oncoplastic breast surgeon and specialist in organ-preserving oncological resections.",
    fullBiography: "Dedicated to cutting-edge minimally invasive cancer surgeries, multidisciplinary tumor boards, and genetic cancer risk assessments.",
    availableDays: ["Tuesday", "Thursday", "Saturday"]
  }
];

// GET: Fetch all doctors
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActivePublished = searchParams.get("public") === "true";

  let result = [...globalDoctorsStore];

  if (onlyActivePublished) {
    result = result.filter(
      (d) => (d.status || "ACTIVE").toUpperCase() === "ACTIVE" && (d.published || "PUBLISHED").toUpperCase() === "PUBLISHED"
    );
  }

  result.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));

  return NextResponse.json({
    success: true,
    total: result.length,
    doctors: result
  });
}

// POST: Create doctor
export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Doctor name is required." }, { status: 400 });
    }

    const newDoc: ServerDoctor = {
      id: body.id || "DOC-" + Date.now(),
      name: body.name.trim(),
      title: body.title || "Senior Consultant Specialist",
      specialty: body.specialty || "Cardiology & Cardiac Surgery",
      hospital: body.hospital || body.hospitalName || "Aster Medcity, Kochi",
      hospitalName: body.hospitalName || body.hospital || "Aster Medcity, Kochi",
      district: body.district || (body.hospital?.includes("Trivandrum") ? "Thiruvananthapuram" : body.hospital?.includes("Calicut") ? "Kozhikode" : "Ernakulam"),
      city: body.city || "Kochi, Kerala",
      experienceYears: Number(body.experienceYears) || 15,
      education: body.education || "MBBS, MD, Board Certified",
      certifications: body.certifications || "Board Certified",
      consultationFee: body.consultationFee || "$60 (₹5,000)",
      registrationNumber: body.registrationNumber || ("KMC-" + Math.floor(10000 + Math.random() * 90000)),
      phone: body.phone || "+91 484 669 9000",
      email: body.email || "doctor@hospital.org",
      gender: body.gender || "Male",
      avatar: body.avatar || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
      casesHandled: Number(body.casesHandled) || 0,
      rating: body.rating || "4.95",
      languages: Array.isArray(body.languages) && body.languages.length > 0 ? body.languages : ["English", "Malayalam"],
      department: body.department || "Clinical Faculty",
      displayOrder: Number(body.displayOrder) || 1,
      status: body.status || "ACTIVE",
      published: body.published || "PUBLISHED",
      bio: body.bio || "Senior medical specialist delivering advanced international patient consultations.",
      fullBiography: body.fullBiography || body.bio || "",
      availableDays: body.availableDays || ["Monday", "Wednesday", "Friday"],
      createdAt: new Date().toISOString()
    };

    globalDoctorsStore = [newDoc, ...globalDoctorsStore.filter(d => d.id !== newDoc.id)];

    return NextResponse.json({
      success: true,
      doctor: newDoc,
      doctors: globalDoctorsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to add doctor" }, { status: 500 });
  }
}

// PUT: Update doctor
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Doctor ID is required for update." }, { status: 400 });
    }

    const index = globalDoctorsStore.findIndex(d => d.id === body.id);
    if (index === -1) {
      globalDoctorsStore = [body, ...globalDoctorsStore];
    } else {
      globalDoctorsStore[index] = {
        ...globalDoctorsStore[index],
        ...body,
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({
      success: true,
      doctor: globalDoctorsStore[index >= 0 ? index : 0],
      doctors: globalDoctorsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update doctor" }, { status: 500 });
  }
}

// DELETE: Delete doctor
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Doctor ID required." }, { status: 400 });
    }

    globalDoctorsStore = globalDoctorsStore.filter(d => d.id !== id);

    return NextResponse.json({
      success: true,
      doctors: globalDoctorsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete doctor" }, { status: 500 });
  }
}
