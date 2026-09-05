import { NextResponse } from "next/server";

export interface ServerHospital {
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
  createdAt?: string;
  updatedAt?: string;
}

let globalHospitalsStore: ServerHospital[] = [
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
    specialties: ["Robotic Orthopaedics", "Cardiology & Bypass", "Living-Donor Transplants", "Comprehensive Oncology"],
    doctors: ["Dr. Alexander K. George, MS (Ortho)", "Dr. Rajesh K., MCh"],
    facilities: ["Biplane Neurovascular Cath Lab", "TrueBeam Radiotherapy Suite", "Cardiac ICU with ECMO backup", "Luxury Recovery Suites"],
    internationalServices: [
      "Express VIP Airport Pickup from Cochin Airport (15 mins)",
      "Direct US/UK Board-Certified Doctor Teleconsultations",
      "Comprehensive Medical Visa Documentation Desk",
      "Arabic Translators & Attendant Guest Suites"
    ],
    languages: ["English", "Arabic", "Malayalam", "Hindi", "French", "German"],
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    rating: 4.92,
    reviewCount: 3180,
    displayOrder: 5,
    status: "ACTIVE",
    published: "PUBLISHED",
    casesActive: 16
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const onlyActivePublished = searchParams.get("public") === "true";

  let result = [...globalHospitalsStore];

  if (onlyActivePublished) {
    result = result.filter(
      (h) => (h.status || "ACTIVE").toUpperCase() === "ACTIVE" && (h.published || "PUBLISHED").toUpperCase() === "PUBLISHED"
    );
  }

  result.sort((a, b) => (Number(a.displayOrder) || 999) - (Number(b.displayOrder) || 999));

  return NextResponse.json({
    success: true,
    total: result.length,
    hospitals: result
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Hospital name is required." }, { status: 400 });
    }

    const newHosp: ServerHospital = {
      id: body.id || "HSP-" + Date.now(),
      name: body.name.trim(),
      tagline: body.tagline || "Accredited Quaternary Healthcare Institution in Kerala",
      shortDescription: body.shortDescription || body.description || `${body.name} is a leading hospital destination in Kerala.`,
      fullDescription: body.fullDescription || body.description || "",
      image: body.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      galleryImages: Array.isArray(body.galleryImages) ? body.galleryImages : [body.image || "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=600"],
      address: body.address || "Kerala, India",
      city: body.city || "Kochi",
      district: body.district || "Ernakulam / Kochi",
      region: body.region || "Central Kerala",
      state: "Kerala",
      country: "India",
      postalCode: body.postalCode || "682001",
      phone: body.phone || "+91 484 669 9000",
      email: body.email || "international@hospital.org",
      website: body.website || "https://keralamedical.gov.in",
      emergencyPhone: body.emergencyPhone || "+91 484 669 9999",
      beds: body.beds || "500 Beds",
      establishedYear: Number(body.establishedYear) || 2015,
      internationalPatientsAnnual: Number(body.internationalPatientsAnnual) || 15000,
      nearestAirport: body.nearestAirport || "Cochin International Airport (COK)",
      airportDistanceKm: Number(body.airportDistanceKm) || 20,
      accreditations: Array.isArray(body.accreditations) && body.accreditations.length > 0 ? body.accreditations : ["NABH Certified", "JCI Accredited"],
      specialties: Array.isArray(body.specialties) && body.specialties.length > 0 ? body.specialties : ["Cardiology & Bypass", "Robotic Orthopaedics", "Comprehensive Oncology"],
      doctors: Array.isArray(body.doctors) ? body.doctors : [],
      facilities: Array.isArray(body.facilities) ? body.facilities : ["Advanced Robotic Surgery Suite", "24/7 International Desk"],
      internationalServices: Array.isArray(body.internationalServices) ? body.internationalServices : ["24/7 International Desk", "Airport Chauffeur", "eVisa Assistance"],
      languages: Array.isArray(body.languages) ? body.languages : ["English", "Arabic", "Malayalam", "Hindi"],
      vipRoomsAvailable: body.vipRoomsAvailable ?? true,
      ayurvedaWingAvailable: body.ayurvedaWingAvailable ?? true,
      rating: Number(body.rating) || 4.92,
      reviewCount: Number(body.reviewCount) || 1200,
      displayOrder: Number(body.displayOrder) || 1,
      status: body.status || "ACTIVE",
      published: body.published || "PUBLISHED",
      casesActive: Number(body.casesActive) || 10,
      createdAt: new Date().toISOString()
    };

    globalHospitalsStore = [newHosp, ...globalHospitalsStore.filter(h => h.id !== newHosp.id)];

    return NextResponse.json({
      success: true,
      hospital: newHosp,
      hospitals: globalHospitalsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create hospital" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Hospital ID required for update." }, { status: 400 });
    }

    const index = globalHospitalsStore.findIndex(h => h.id === body.id);
    if (index === -1) {
      globalHospitalsStore = [body, ...globalHospitalsStore];
    } else {
      globalHospitalsStore[index] = {
        ...globalHospitalsStore[index],
        ...body,
        updatedAt: new Date().toISOString()
      };
    }

    return NextResponse.json({
      success: true,
      hospital: globalHospitalsStore[index >= 0 ? index : 0],
      hospitals: globalHospitalsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update hospital" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Hospital ID required." }, { status: 400 });
    }

    globalHospitalsStore = globalHospitalsStore.filter(h => h.id !== id);

    return NextResponse.json({
      success: true,
      hospitals: globalHospitalsStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete hospital" }, { status: 500 });
  }
}