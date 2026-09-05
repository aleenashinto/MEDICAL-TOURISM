export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialty: string;
  subSpecialty: string;
  qualifications: string;
  experienceYears: number;
  hospitalId: string;
  hospitalName: string;
  district: string;
  city: string;
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFeeInr: number;
  consultationFeeUsd: number;
  avatar: string;
  bio: string;
  areasOfExpertise: string[];
  publicationsCount: number;
  nextAvailableDate: string;
  videoConsultationAvailable: boolean;
  featured: boolean;
}

export interface Hospital {
  id: string;
  name: string;
  tagline: string;
  accreditations: string[]; // e.g. ["JCI Accredited", "NABH", "NABL"]
  region: 'South Kerala' | 'Central Kerala' | 'North Kerala';
  district: string; // e.g. "Ernakulam", "Thiruvananthapuram", "Kozhikode", "Kottayam", "Thrissur", "Kollam", "Alappuzha", "Palakkad", "Malappuram", "Kannur", "Wayanad", "Kasaragod", "Pathanamthitta", "Idukki"
  city: string;
  type: 'Multispecialty' | 'Super Specialty' | 'Government Medical College' | 'Ayurveda & Wellness' | 'Specialized Institute';
  establishedYear: number;
  bedsCount: number;
  internationalPatientsAnnual: number;
  languages: string[];
  specialties: string[];
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
  internationalServices: string[];
  facilities: string[];
  nearestAirport: 'Cochin International Airport (COK)' | 'Trivandrum International Airport (TRV)' | 'Calicut International Airport (CCJ)' | 'Kannur International Airport (CNN)';
  airportDistanceKm: number;
  vipRoomsAvailable: boolean;
  ayurvedaWingAvailable: boolean;
  featured: boolean;
}

export interface Treatment {
  id: string;
  name: string;
  category: 'Cardiology' | 'Oncology' | 'Neurology' | 'Neurosurgery' | 'Orthopaedics' | 'Gastroenterology' | 'Urology' | 'Fertility' | 'Ayurveda & Wellness' | 'Organ Transplant';
  tagline: string;
  description: string;
  overview: string;
  whoRequires: string[];
  costRangeUsd: { min: number; max: number; averageUsComparison: number; averageInr: number };
  typicalStayDays: number;
  recoveryDays: number;
  topKeralaDistricts: string[];
  faqs: { question: string; answer: string }[];
  featured: boolean;
}

export interface PackageOffer {
  id: string;
  title: string;
  tier: 'Platinum VIP' | 'Premium Care' | 'Value Accredited' | 'Ayurvedic Rejuvenation';
  treatmentName: string;
  hospitalName: string;
  doctorName: string;
  district: string;
  city: string;
  priceUsd: number;
  priceInr: number;
  durationDays: number;
  highlights: string[];
  inclusions: string[];
  recommendedFor: string;
}

export interface KeralaDistrictInfo {
  id: string;
  name: string;
  region: 'South Kerala' | 'Central Kerala' | 'North Kerala';
  tagline: string;
  image: string;
  nearestAirport: string;
  topSpecialties: string[];
  hospitalsCount: number;
  featuredHospitals: string[];
  ayurvedaHeritage: string;
}

export const KERALA_DISTRICTS: KeralaDistrictInfo[] = [
  // Central Kerala
  {
    id: "ernakulam",
    name: "Ernakulam / Kochi",
    region: "Central Kerala",
    tagline: "Kerala's Premier Quaternary Healthcare, Robotic Surgery & Transplant Hub",
    image: "https://shorturl.at/dxYEn",
    nearestAirport: "Cochin International Airport (COK) - 25km",
    topSpecialties: ["Robotic Joint Arthroplasty", "Cardiac Bypass & Valve Repair", "Liver & Kidney Transplant", "Comprehensive Oncology"],
    hospitalsCount: 18,
    featuredHospitals: ["Aster Medcity Kochi", "Rajagiri Hospital Aluva", "Lourdes Hospital", "Renai Medicity", "Amrita Institute of Medical Sciences"],
    ayurvedaHeritage: "Integrated post-op wellness resorts along the Cherai & Vembanad backwaters."
  },
  {
    id: "thrissur",
    name: "Thrissur",
    region: "Central Kerala",
    tagline: "Cultural Capital with Quaternary Multispecialty Excellence & Authentic Ayurveda",
    image: "https://shorturl.at/VaQvK",
    nearestAirport: "Cochin International Airport (COK) - 55km",
    topSpecialties: ["Multispecialty Care", "Orthopaedics & Spine", "Panchakarma & Classical Ayurveda", "Cardiology"],
    hospitalsCount: 12,
    featuredHospitals: ["Government Medical College Thrissur", "Amala Institute of Medical Sciences", "Jubilee Mission Medical College"],
    ayurvedaHeritage: "Home to centuries-old Ashtavaidya Ayurvedic traditions and classical Panchakarma institutions."
  },
  {
    id: "kottayam",
    name: "Kottayam",
    region: "Central Kerala",
    tagline: "Lake City Center for Quaternary Cardiology, Orthopaedics & Backwater Healing",
    image: "https://tinyurl.com/ytp2ynua",
    nearestAirport: "Cochin International Airport (COK) - 85km",
    topSpecialties: ["Multispecialty Care", "Cardiothoracic Surgery", "Joint Replacement", "Women's Health"],
    hospitalsCount: 9,
    featuredHospitals: ["Caritas Hospital Multispeciality", "Government Medical College Kottayam", "Bharat Hospital"],
    ayurvedaHeritage: "Kumarakom backwater wellness centers with integrated physical therapy and post-surgical recuperation."
  },
  {
    id: "palakkad",
    name: "Palakkad",
    region: "Central Kerala",
    tagline: "Gateway to Herbal Plantations, Traditional Ayurveda & Multispecialty Care",
    image: "https://tinyurl.com/4wevvevb",
    nearestAirport: "Coimbatore Airport (CJB) / Cochin Airport (COK)",
    topSpecialties: ["Classical Panchakarma", "Spine & Joint Rehabilitation", "General Medicine"],
    hospitalsCount: 7,
    featuredHospitals: ["Government Medical College Palakkad", "KIMS Alshifa Palakkad", "Keraleeya Ayurveda Samajam"],
    ayurvedaHeritage: "World-renowned Ayurvedic healing sanctuaries in Cherpulassery and Shoranur."
  },
  {
    id: "idukki",
    name: "Idukki",
    region: "Central Kerala",
    tagline: "High-Altitude Hill Sanatoriums, Medicinal Herbs & Post-Treatment Rehabilitation",
    image: "https://tinyurl.com/yc4ptn7t",
    nearestAirport: "Cochin International Airport (COK) - 110km",
    topSpecialties: ["Pulmonary Rehabilitation", "Herbal Wellness & Detox", "Stress Management"],
    hospitalsCount: 4,
    featuredHospitals: ["Government Medical College Idukki", "High Range Hospital Munnar"],
    ayurvedaHeritage: "Cool climate medicinal plant retreats in Munnar and Vagamon ideal for respiratory & joint recovery."
  },

  // South Kerala
  {
    id: "thiruvananthapuram",
    name: "Thiruvananthapuram",
    region: "South Kerala",
    tagline: "Kerala's Capital of Quaternary Cancer Institutes, Neurosciences & Royal Heritage",
    image: "https://tinyurl.com/2ew8u8m6",
    nearestAirport: "Trivandrum International Airport (TRV) - 6km",
    topSpecialties: ["Advanced Oncology & Radiotherapy", "Neurosciences & Stroke Care", "Cardiology", "Organ Transplant"],
    hospitalsCount: 16,
    featuredHospitals: ["Regional Cancer Centre (RCC)", "KIMSHEALTH Trivandrum", "Government Medical College Thiruvananthapuram", "Sree Chitra Tirunal Institute"],
    ayurvedaHeritage: "Kovalam and Chowara coastal Ayurvedic retreats with specialized medical supervision."
  },
  {
    id: "kollam",
    name: "Kollam",
    region: "South Kerala",
    tagline: "Coastal Healthcare Corridor with Ashtamudi Lake Wellness Sanctuary",
    image: "https://tinyurl.com/35tn5cea",
    nearestAirport: "Trivandrum International Airport (TRV) - 65km",
    topSpecialties: ["Orthopaedics", "Cardiology", "Nephrology & Dialysis", "Ayurvedic Convalescence"],
    hospitalsCount: 8,
    featuredHospitals: ["Government Medical College Kollam", "Travancore Medicity", "Bishop Benziger Hospital"],
    ayurvedaHeritage: "Ashtamudi lakefront retreats providing stress-relief, yoga, and neurological rejuvenation."
  },
  {
    id: "alappuzha",
    name: "Alappuzha",
    region: "South Kerala",
    tagline: "Venice of the East with Specialized Houseboat Convalescence & General Healthcare",
    image: "https://tinyurl.com/2s3aw772",
    nearestAirport: "Cochin International Airport (COK) - 75km",
    topSpecialties: ["General Medicine", "Panchakarma Detox", "Vascular Surgery", "Orthopaedic Rehabilitation"],
    hospitalsCount: 6,
    featuredHospitals: ["Government T.D. Medical College Alappuzha", "Sahrudaya Hospital"],
    ayurvedaHeritage: "Marari beachside wellness resorts offering authentic herbal oil therapies and backwater serenity."
  },
  {
    id: "pathanamthitta",
    name: "Pathanamthitta",
    region: "South Kerala",
    tagline: "Pilgrim Heartland with Specialized Geriatric & Multispecialty Care",
    image: "https://tinyurl.com/4v3fn5rf",
    nearestAirport: "Trivandrum (TRV) / Cochin (COK)",
    topSpecialties: ["Geriatric Care", "Cardiology", "Holistic Wellness"],
    hospitalsCount: 5,
    featuredHospitals: ["Government Medical College Konni", "Pushpagiri Medical College Hospital", "Muthoot Hospital"],
    ayurvedaHeritage: "Aranmula traditional wellness retreats known for rare medicinal herb formulations."
  },

  // North Kerala
  {
    id: "kozhikode",
    name: "Kozhikode",
    region: "North Kerala",
    tagline: "Malabar's Premier Medical City for Liver Transplants, Cardiology & Oncology",
    image: "https://tinyurl.com/sc9jntya",
    nearestAirport: "Calicut International Airport (CCJ) - 26km",
    topSpecialties: ["Living-Donor Liver Transplant", "Interventional Cardiology", "Surgical Oncology", "Urology & Nephrology"],
    hospitalsCount: 15,
    featuredHospitals: ["Baby Memorial Hospital (BMH)", "Aster MIMS Kozhikode", "Government Medical College Kozhikode", "Meitra Hospital"],
    ayurvedaHeritage: "Malabar Ayurveda sanatoriums offering therapeutic spinal and rheumatic treatments."
  },
  {
    id: "malappuram",
    name: "Malappuram",
    region: "North Kerala",
    tagline: "Pioneering Center for Kottakkal Arya Vaidya Sala & Modern Multispecialty",
    image: "https://tinyurl.com/4knjjxxa",
    nearestAirport: "Calicut International Airport (CCJ) - 18km",
    topSpecialties: ["Classical Ayurveda & Panchakarma", "Multispecialty Care", "Emergency Medicine"],
    hospitalsCount: 10,
    featuredHospitals: ["Arya Vaidya Sala Kottakkal (AVS)", "Government Medical College Manjeri", "Almas Hospital"],
    ayurvedaHeritage: "The undisputed global headquarters of authentic Ayurveda at Kottakkal Arya Vaidya Sala."
  },
  {
    id: "kannur",
    name: "Kannur",
    region: "North Kerala",
    tagline: "Northern Aviation Hub with Advanced Tertiary & Super-Specialty Institutions",
    image: "https://shorturl.at/iLUpk",
    nearestAirport: "Kannur International Airport (CNN) - 15km",
    topSpecialties: ["Advanced Oncology", "Cardiology", "Trauma & Joint Replacement"],
    hospitalsCount: 8,
    featuredHospitals: ["Government Medical College Kannur (Pariyaram)", "Aster MIMS Kannur", "Malabar Cancer Centre (MCC)"],
    ayurvedaHeritage: "Theyyam coastal wellness sanctuaries with specialized kalari marma bone-setting therapies."
  },
  {
    id: "wayanad",
    name: "Wayanad",
    region: "North Kerala",
    tagline: "Eco-Lush Rainforest Sanatoriums for Pulmonary Recovery & Stress Reversal",
    image: "https://shorturl.at/Jap19",
    nearestAirport: "Calicut International Airport (CCJ) - 85km",
    topSpecialties: ["Preventive Longevity", "Herbal Detoxification", "Holistic Rehabilitation"],
    hospitalsCount: 5,
    featuredHospitals: ["Wayanad Institute of Medical Sciences (DM WIMS)", "Government Medical College Mananthavady"],
    ayurvedaHeritage: "Organic forest retreats in Vythiri and Sultan Bathery utilizing wild Western Ghats herbs."
  },
  {
    id: "kasaragod",
    name: "Kasaragod",
    region: "North Kerala",
    tagline: "Northernmost Healthcare Frontier with Coastal Holistic Healing Centers",
    image: "https://shorturl.at/NgYhK",
    nearestAirport: "Mangalore International Airport (IXE) / Kannur (CNN)",
    topSpecialties: ["General Medicine", "Panchakarma", "Naturopathy"],
    hospitalsCount: 4,
    featuredHospitals: ["Government Medical College Kasaragod", "Malik Deenar Charitable Hospital"],
    ayurvedaHeritage: "Bekal coastal wellness sanctuaries providing deep detox and therapeutic massage programs."
  }
];

export const KERALA_HOSPITALS: Hospital[] = [
  {
    id: 'aster-medcity-kochi',
    name: 'Aster Medcity',
    tagline: 'JCI-Accredited 670-bed waterfront quaternary healthcare destination',
    accreditations: ['JCI Accredited', 'NABH Certified', 'NABL Accredited', 'GreenOT'],
    region: 'Central Kerala',
    district: 'Ernakulam / Kochi',
    city: 'Kochi',
    type: 'Multispecialty',
    establishedYear: 2014,
    bedsCount: 670,
    internationalPatientsAnnual: 28000,
    languages: ['English', 'Arabic', 'Malayalam', 'Hindi', 'French', 'Russian'],
    specialties: ['Cardiology & Bypass', 'Robotic Orthopaedics', 'Comprehensive Oncology', 'Neurology & Neurosurgery', 'Living-Donor Transplants'],
    rating: 4.94,
    reviewCount: 4210,
    image: 'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80',
    description: 'Situated on a tranquil 45-acre waterfront campus in Cheranalloor, Aster Medcity is Kerala’s foremost destination for international patients seeking Da Vinci robotic surgeries, liver & heart transplants, and personalized clinical care.',
    internationalServices: [
      '24/7 International Patient Desk with Dedicated Relationship Manager',
      'Direct Chauffeur Escort from Cochin International Airport (25 mins)',
      'Medical eVisa Fast-Track Invitation Letter in 4 Hours',
      'Arabic & French Native Translators On-Site',
      'Luxury Presidential Waterfront Suites with Attendant Living Quarters',
      'Halal & Customized International Dietary Kitchen'
    ],
    facilities: ['Da Vinci Xi Robotic Surgery System', 'Hybrid Cardiac Cath Lab', 'Integrated Bone Marrow Unit', 'Private Water Taxi & Helipad', 'Waterfront Convalescence Promenade'],
    nearestAirport: 'Cochin International Airport (COK)',
    airportDistanceKm: 24,
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    featured: true
  },
  {
    id: 'amrita-institute-kochi',
    name: 'Amrita Institute of Medical Sciences',
    tagline: '1,350-bed quaternary academic healthcare landmark and transplant pioneer',
    accreditations: ['NABH Certified', 'NABL Accredited', 'ISO 9001', 'Green Hospital'],
    region: 'Central Kerala',
    district: 'Ernakulam / Kochi',
    city: 'Kochi',
    type: 'Super Specialty',
    establishedYear: 1998,
    bedsCount: 1350,
    internationalPatientsAnnual: 35000,
    languages: ['English', 'Arabic', 'Malayalam', 'Hindi', 'French', 'German'],
    specialties: ['Robotic Cardiac Surgery', 'Living-Donor Transplants', 'Pediatric Cardiology', 'Comprehensive Oncology', 'Neurology & Neurosurgery'],
    rating: 4.93,
    reviewCount: 5120,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Founded by Mata Amritanandamayi Devi, Amrita Hospital is a premier university hospital equipped with 1,350 beds, robotic cardiac suites, and pioneering hand and multi-organ transplant programs.',
    internationalServices: [
      'Dedicated Global Patient Care Lounge',
      'Complimentary Airport Chauffeur Service',
      'Telemedicine Consultations before Arrival',
      'Multilingual Translation in 8 Languages'
    ],
    facilities: ['Stereotactic Radiosurgery', 'Automated Robotic Surgery Suite', 'Pediatric Cardiac Cath Lab', 'Multi-Organ Transplant ICU'],
    nearestAirport: 'Cochin International Airport (COK)',
    airportDistanceKm: 26,
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    featured: true
  },
  {
    id: 'vps-lakeshore-kochi',
    name: 'VPS Lakeshore Hospital',
    tagline: 'Leading 450-bed quaternary transplant & oncology center',
    accreditations: ['NABH', 'JCI Certified', 'NABL'],
    region: 'Central Kerala',
    district: 'Ernakulam / Kochi',
    city: 'Kochi',
    type: 'Super Specialty',
    establishedYear: 2003,
    bedsCount: 450,
    internationalPatientsAnnual: 16000,
    languages: ['English', 'Arabic', 'Malayalam', 'Hindi', 'French'],
    specialties: ['Gastroenterology', 'Living-Donor Transplants', 'Robotic Orthopaedics', 'Comprehensive Oncology'],
    rating: 4.89,
    reviewCount: 2950,
    image: 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80',
    description: 'VPS Lakeshore Hospital is an internationally acclaimed quaternary center in Kochi, recognized as one of India’s leading centers for liver & renal transplants and comprehensive oncology.',
    internationalServices: [
      '24/7 International Desk & Medical Visa Help',
      'Direct Airport Transfers',
      'Arabic & French Interpreters'
    ],
    facilities: ['Advanced GI Endoscopy Suite', 'SpyGlass Cholangioscopy Unit', 'Liver Transplant ICU', 'Dedicated VIP Suites'],
    nearestAirport: 'Cochin International Airport (COK)',
    airportDistanceKm: 32,
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: false,
    featured: true
  },
  {
    id: 'somatheeram-ayurvedic-village',
    name: 'Somatheeram Ayurvedic Village',
    tagline: 'NABH Ayush Platinum Certified world-first Ayurveda beach resort hospital',
    accreditations: ['NABH Ayush Platinum', 'Green Leaf Certified', 'ISO 9001'],
    region: 'South Kerala',
    district: 'Thiruvananthapuram',
    city: 'Kovalam',
    type: 'Ayurveda & Wellness',
    establishedYear: 1985,
    bedsCount: 120,
    internationalPatientsAnnual: 12500,
    languages: ['English', 'German', 'French', 'Russian', 'Italian', 'Malayalam', 'Hindi'],
    specialties: ['Classical Ayurveda', 'Rehabilitation & Wellness'],
    rating: 4.97,
    reviewCount: 3880,
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    description: 'Somatheeram is the world’s first Ayurvedic hospital resort set atop the picturesque Chowara Beach in Kovalam, delivering authentic 14-21 day Panchakarma, Rasayana, and restorative therapies.',
    internationalServices: [
      'Airport VIP Escort from TRV Airport',
      'German, Russian, French & Italian Interpreters',
      'Pre-Travel Dosha Consultation'
    ],
    facilities: ['30 Private Ayurveda Treatment Pavilions', 'Sea-facing Yoga & Meditation Halls', 'Herbal Pharmacy & Garden', 'Organic Ayurvedic Kitchen'],
    nearestAirport: 'Trivandrum International Airport (TRV)',
    airportDistanceKm: 18,
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    featured: true
  },
  {
    id: 'rajagiri-hospital-aluva',
    name: 'Rajagiri Hospital',
    tagline: 'JCI-Accredited Quaternary Center with American Cardiac & Transplant Standards',
    accreditations: ['JCI Accredited', 'NABH', 'NABL'],
    region: 'Central Kerala',
    district: 'Ernakulam / Kochi',
    city: 'Aluva, Kochi',
    type: 'Super Specialty',
    establishedYear: 2014,
    bedsCount: 500,
    internationalPatientsAnnual: 19500,
    languages: ['English', 'Arabic', 'Malayalam', 'Hindi', 'French', 'German'],
    specialties: ['Cardiology & Bypass', 'Robotic Orthopaedics', 'Comprehensive Oncology', 'Neurology & Neurosurgery', 'Living-Donor Transplants'],
    rating: 4.92,
    reviewCount: 3180,
    image: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80',
    description: 'Located only 15 minutes from Cochin International Airport, Rajagiri Hospital blends world-class surgical protocols with compassionate Kerala care across multi-organ transplant and robotic oncology programs.',
    internationalServices: [
      'Express VIP Airport Pickup from Cochin Airport (15 km)',
      'Direct US/UK Board-Certified Doctor Teleconsultations',
      'Comprehensive Medical Visa Documentation Desk',
      'Arabic Translators & Attendant Guest Suites'
    ],
    facilities: ['Biplane Neurovascular Cath Lab', 'TrueBeam Radiotherapy Suite', 'Cardiac ICU with ECMO backup', 'Luxury Recovery Suites'],
    nearestAirport: 'Cochin International Airport (COK)',
    airportDistanceKm: 14,
    vipRoomsAvailable: true,
    ayurvedaWingAvailable: true,
    featured: true
  }
];

export const KERALA_DOCTORS: Doctor[] = [
  {
    id: 'DOC-101',
    name: 'Dr. Vijay Anand',
    title: 'Senior Consultant & Head of Orthopedics',
    specialty: 'Orthopaedics',
    subSpecialty: 'Robotic-Assisted Bilateral Knee & Anterior Hip Arthroplasty',
    qualifications: 'MBBS, MS (Ortho), MCh (UK), Fellowship Joint Reconstruction',
    experienceYears: 24,
    hospitalId: 'aster-medcity-kochi',
    hospitalName: 'Aster Medcity',
    district: 'Ernakulam / Kochi',
    city: 'Kochi',
    languages: ['English', 'Hindi', 'Malayalam', 'Arabic'],
    rating: 4.96,
    reviewCount: 1420,
    consultationFeeInr: 5000,
    consultationFeeUsd: 60,
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80',
    bio: 'Pioneer in robotic total knee and hip replacements in South India with over 2,000+ joint surgeries performed for international patients.',
    areasOfExpertise: ['Robotic Total Knee Replacement', 'Direct Anterior Hip Replacement', 'Complex Revision Arthroplasty', 'Cartilage Regeneration'],
    publicationsCount: 36,
    nextAvailableDate: 'Tomorrow, 11:30 AM IST (GMT+5:30)',
    videoConsultationAvailable: true,
    featured: true
  },
  {
    id: 'DOC-102',
    name: 'Dr. K. S. Muralidharan',
    title: 'Chief of Cardiothoracic & Vascular Surgery',
    specialty: 'Cardiology',
    subSpecialty: 'Minimally Invasive Beating-Heart CABG & Total Arterial Revascularization',
    qualifications: 'MBBS, MS, MCh (CTVS), FACC, FRCS (Edinburgh)',
    experienceYears: 28,
    hospitalId: 'amrita-hospital-kochi',
    hospitalName: 'Amrita Institute of Medical Sciences',
    district: 'Ernakulam / Kochi',
    city: 'Kochi',
    languages: ['English', 'Hindi', 'Tamil', 'Malayalam'],
    rating: 4.98,
    reviewCount: 2100,
    consultationFeeInr: 6200,
    consultationFeeUsd: 75,
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=600&q=80',
    bio: 'Renowned cardiothoracic surgeon specializing in minimally invasive coronary bypass (CABG), valve repairs, and robotic cardiac reconstructions.',
    areasOfExpertise: ['Off-Pump Beating Heart CABG', 'Minimally Invasive Aortic Valve Replacement (MICS)', 'TAVR', 'Aortic Aneurysm Repair'],
    publicationsCount: 48,
    nextAvailableDate: 'Thursday, 02:00 PM IST',
    videoConsultationAvailable: true,
    featured: true
  },
  {
    id: 'DOC-103',
    name: 'Dr. Rajesh K.',
    title: 'Lead Neuro & Spine Surgeon',
    specialty: 'Neurology',
    subSpecialty: 'Minimally Invasive Endoscopic Brain & Robotic Spine Surgery',
    qualifications: 'MBBS, MS, MCh (Neurosurgery), FACS (USA)',
    experienceYears: 19,
    hospitalId: 'rajagiri-hospital-aluva',
    hospitalName: 'Rajagiri Hospital',
    district: 'Ernakulam / Kochi',
    city: 'Kochi',
    languages: ['English', 'Hindi', 'Malayalam'],
    rating: 4.90,
    reviewCount: 980,
    consultationFeeInr: 5400,
    consultationFeeUsd: 65,
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&w=600&q=80',
    bio: 'Expert in endoscopic spinal decompression, microscopic brain tumor resections, and complex spinal fusion procedures with neuronavigation.',
    areasOfExpertise: ['Awake Brain Surgery', 'Endoscopic Pituitary Tumor Resection', 'Robotic Spine Fusion', 'Trigeminal Neuralgia'],
    publicationsCount: 29,
    nextAvailableDate: 'Friday, 10:00 AM IST',
    videoConsultationAvailable: true,
    featured: true
  },
  {
    id: 'DOC-104',
    name: 'Dr. Arya Varma',
    title: 'Chief Ayurvedic Physician',
    specialty: 'Ayurveda & Wellness',
    subSpecialty: 'Classical Panchakarma, Marma Chikitsa & Chronic Neuromuscular Rejuvenation',
    qualifications: 'BAMS, MD (Ayurveda - Kayachikitsa), Traditional Lineage',
    experienceYears: 16,
    hospitalId: 'somatheeram-ayurvedic-village',
    hospitalName: 'Somatheeram Ayurvedic Village',
    district: 'Thiruvananthapuram',
    city: 'Kovalam',
    languages: ['English', 'Malayalam', 'Hindi', 'German'],
    rating: 4.92,
    reviewCount: 1850,
    consultationFeeInr: 3700,
    consultationFeeUsd: 45,
    avatar: 'https://images.unsplash.com/photo-1594824813583-b78f4a13d789?auto=format&fit=crop&w=600&q=80',
    bio: 'Classical Ayurveda scholar focusing on authentic Panchakarma detoxification, chronic arthritis reversal, and neurological rehabilitation.',
    areasOfExpertise: ['Panchakarma Detox', 'Degenerative Joint Chikitsa', 'Neuro Rejuvenation', 'Stress Detox'],
    publicationsCount: 22,
    nextAvailableDate: 'Wednesday, 03:30 PM IST',
    videoConsultationAvailable: true,
    featured: true
  },
  {
    id: 'DOC-105',
    name: 'Dr. Deepa Pillai',
    title: 'Senior Consultant Medical Oncologist',
    specialty: 'Oncology',
    subSpecialty: 'Targeted Molecular Therapy, Precision Immunotherapy & Organ-Preserving Oncology',
    qualifications: 'MBBS, MD, DM (Medical Oncology - TMC Mumbai), ESMO Certified',
    experienceYears: 21,
    hospitalId: 'vps-lakeshore-hospital-kochi',
    hospitalName: 'VPS Lakeshore Hospital',
    district: 'Ernakulam / Kochi',
    city: 'Kochi',
    languages: ['English', 'Malayalam', 'Hindi', 'Tamil'],
    rating: 4.94,
    reviewCount: 1640,
    consultationFeeInr: 5800,
    consultationFeeUsd: 70,
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80',
    bio: 'Leading oncologist in targeted molecular therapy, precision immunotherapy, and organ-preserving multimodal cancer treatment protocols.',
    areasOfExpertise: ['Solid Tumor Oncology', 'Immunotherapy Protocols', 'Targeted Biological Agents', 'Cancer Risk Genetics'],
    publicationsCount: 31,
    nextAvailableDate: 'Tuesday, 01:00 PM IST',
    videoConsultationAvailable: true,
    featured: true
  }
];

export const KERALA_TREATMENTS: Treatment[] = [
  {
    id: 'cardiac-bypass-kerala',
    name: 'Off-Pump Coronary Artery Bypass (CABG)',
    category: 'Cardiology',
    tagline: 'Minimally Invasive Beating-Heart Surgery with Rapid Recovery in Kochi',
    description: 'Surgical restoration of blood flow to blocked coronary arteries without using a heart-lung machine, reducing ICU stay and postoperative complications.',
    overview: 'Kerala’s JCI-accredited cardiac centers boast a >99.4% survival rate for off-pump bypass surgeries performed by surgical teams with over 20+ years of international quaternary experience.',
    whoRequires: [
      'Multi-vessel coronary artery disease or Left Main stenosis',
      'Patients unsuitable for multiple stent angioplasties',
      'Diabetic patients seeking total arterial grafting for long-term survival'
    ],
    costRangeUsd: { min: 6500, max: 8500, averageUsComparison: 120000, averageInr: 650000 },
    typicalStayDays: 6,
    recoveryDays: 14,
    topKeralaDistricts: ['Ernakulam / Kochi'],
    faqs: [
      {
        question: 'How soon can international patients fly home after surgery in Kerala?',
        answer: 'Patients are typically cleared for comfortable international air travel between 10 to 14 days post-surgery, following fit-to-fly clinical certification and 2D Echo review.'
      },
      {
        question: 'Which Kerala airport is best for cardiac surgeries?',
        answer: 'Cochin International Airport (COK) offers direct international flights with express hospital transfers in 20 minutes.'
      }
    ],
    featured: true
  },
  {
    id: 'robotic-knee-kerala',
    name: 'Robotic Total Knee Replacement',
    category: 'Orthopaedics',
    tagline: 'Sub-Millimeter Robotic Alignment for Lifetime Joint Durability in Kochi',
    description: 'Joint replacement utilizing 3D CT-guided robotic arms (MAKO) and US FDA-approved titanium implants with same-day ambulation.',
    overview: 'Robotic knee arthroplasty preserves healthy collateral ligaments and bone stock, cutting blood loss and recovery time by 50% compared to traditional open procedures.',
    whoRequires: [
      'Severe osteoarthritis with chronic pain and knee stiffness',
      'Failed conservative therapies (injections, medications, physical therapy)',
      'Severe varus/valgus deformity requiring sub-millimeter anatomical alignment'
    ],
    costRangeUsd: { min: 4800, max: 6200, averageUsComparison: 45000, averageInr: 475000 },
    typicalStayDays: 4,
    recoveryDays: 14,
    topKeralaDistricts: ['Ernakulam / Kochi'],
    faqs: [
      {
        question: 'Can I do post-op physical therapy at a Kerala backwater resort?',
        answer: 'Yes! Our care concierge arranges dedicated bedside physiotherapists to accompany you during recuperation at 5-star partner resorts in Kochi.'
      }
    ],
    featured: true
  },
  {
    id: 'classical-panchakarma-wellness',
    name: 'Authentic 21-Day Panchakarma Detox',
    category: 'Ayurveda & Wellness',
    tagline: 'Centuries-Old Ashtavaidya Healing, Herbal Oils & Dosha Balancing in Kovalam',
    description: 'Complete 5-fold Ayurvedic detoxification including Abhyangam, Pizhichil, Njavarakizhi, Shirodhara, and Basti under senior Vaidya supervision.',
    overview: 'Kerala is the global home of classical Ayurveda. Authentic treatment programs eliminate deep metabolic toxins, rejuvenate connective tissues, and reverse chronic fatigue and joint inflammation.',
    whoRequires: [
      'Chronic rheumatologic, arthritis, and spine disorders',
      'Post-chemotherapy / post-surgical systemic revitalization',
      'Chronic stress, insomnia, burnout, and metabolic imbalance'
    ],
    costRangeUsd: { min: 2400, max: 3200, averageUsComparison: 16000, averageInr: 245000 },
    typicalStayDays: 21,
    recoveryDays: 0,
    topKeralaDistricts: ['Thiruvananthapuram'],
    faqs: [
      {
        question: 'Is accommodation and food included in the Ayurveda package?',
        answer: 'Yes. Packages include private seaside cottage stay, doctor consultations, daily two-therapist treatments, and customized organic Ayurvedic meals according to your Dosha.'
      }
    ],
    featured: true
  },
  {
    id: 'endoscopic-spine-surgery',
    name: 'Minimally Invasive Spine & Brain Surgery',
    category: 'Neurology',
    tagline: 'Neuronavigation-Guided Micro-Discectomy & Skull Base Resection in Aluva',
    description: 'Microscopic and endoscopic decompression and fusion for spinal herniation, stenosis, and neurological lesions.',
    overview: 'Pioneered by leading neurosurgeons in Kerala with real-time intraoperative neuromonitoring and sub-millimeter precision navigation.',
    whoRequires: [
      'Herniated lumbar/cervical discs with nerve root compression',
      'Spinal canal stenosis with mobility restriction',
      'Skull base and benign brain lesions requiring keyhole surgery'
    ],
    costRangeUsd: { min: 6200, max: 7800, averageUsComparison: 65000, averageInr: 595000 },
    typicalStayDays: 5,
    recoveryDays: 12,
    topKeralaDistricts: ['Ernakulam / Kochi'],
    faqs: [
      {
        question: 'What is the recovery time for endoscopic discectomy?',
        answer: 'Most patients walk on the evening of surgery and are discharged within 48 to 72 hours.'
      }
    ],
    featured: true
  },
  {
    id: 'living-donor-liver-transplant',
    name: 'Living-Donor Liver & Kidney Transplantation',
    category: 'Organ Transplant',
    tagline: 'World-Class Quaternary Transplant Excellence in Kochi',
    description: 'High-precision surgical transplant procedures with dedicated transplant ICUs, laparoscopic donor hepatectomy, and comprehensive immunosuppression protocol.',
    overview: 'Kerala hospitals maintain one of the highest living-donor organ transplant success rates (>95%) in Asia, backed by strict ethical governance and international organ committee compliance.',
    whoRequires: [
      'End-stage liver cirrhosis, hepatocellular carcinoma (HCC)',
      'End-stage renal disease (ESRD) requiring kidney transplant'
    ],
    costRangeUsd: { min: 22000, max: 32000, averageUsComparison: 350000, averageInr: 2100000 },
    typicalStayDays: 21,
    recoveryDays: 45,
    topKeralaDistricts: ['Ernakulam / Kochi'],
    faqs: [
      {
        question: 'What legal paperwork is required for international organ transplants in Kerala?',
        answer: 'All international donor-recipient pairs must undergo verification by the Kerala Government Authorization Committee for Organ Transplantation, which our concierge coordinates completely.'
      }
    ],
    featured: true
  }
];

export const KERALA_SAMPLE_PACKAGES: PackageOffer[] = [
  {
    id: 'pkg-kochi-cardiac-platinum',
    title: 'Kochi Platinum Beating-Heart Cardiac Care Journey',
    tier: 'Platinum VIP',
    treatmentName: 'Off-Pump Coronary Artery Bypass (CABG)',
    hospitalName: 'Amrita Institute of Medical Sciences',
    doctorName: 'Dr. K. S. Muralidharan',
    district: 'Ernakulam / Kochi',
    city: 'Kochi, Kerala',
    priceUsd: 7400,
    priceInr: 650000,
    durationDays: 14,
    highlights: [
      'Minimally Invasive Beating-Heart CABG by Senior Director Dr. K. S. Muralidharan',
      'Presidential Waterfront Inpatient Suite with Attendant Bed & Halal / Continental Dining',
      'Fast-Track Kerala Medical eVisa Invitation Letter in 4 Hours',
      '7-Night 5-Star Backwater Resort Stay Post-Discharge (Grand Hyatt Kochi)',
      'VIP Airport Limousine Chauffeur from Cochin International Airport (COK)',
      '12 Months Complimentary Telemedicine Follow-Up'
    ],
    inclusions: [
      'Complete pre-op investigations (Coronary Angiogram, 2D Echo, Blood Panels)',
      'Surgery charges, OT fees, surgeon & cardiac anesthesia fees, ICU stay (2 nights)',
      'Inpatient stay (4 nights) in Super Deluxe Suite',
      'Airport transfers & daily hospital shuttle in private Mercedes / Innova Crysta',
      'Dedicated native Arabic / French medical coordinator',
      'Local 5G SIM/eSIM, local payment assistance & forex coordination'
    ],
    recommendedFor: 'International and NRI patients seeking top US/UK-trained surgical masters with luxury Kerala backwater convalescence.'
  },
  {
    id: 'pkg-somatheeram-panchakarma-elite',
    title: 'Authentic 21-Day Somatheeram Classical Panchakarma Sanctuary',
    tier: 'Ayurvedic Rejuvenation',
    treatmentName: 'Authentic 21-Day Panchakarma Detox',
    hospitalName: 'Somatheeram Ayurvedic Village',
    doctorName: 'Dr. Arya Varma',
    district: 'Thiruvananthapuram',
    city: 'Kovalam, Kerala',
    priceUsd: 2800,
    priceInr: 245000,
    durationDays: 21,
    highlights: [
      'Complete 5-fold Panchakarma administered by Chief Ayurvedic Physician Dr. Arya Varma',
      'Private Heritage Seaside Cottage Stay in peaceful medicinal herbal garden campus',
      'Daily 2-therapist herbal oil therapies (Pizhichil, Shirodhara, Kizhi)',
      'Trivandrum International Airport (TRV) Private Meet & Greet Chauffeur (18 km)',
      'Customized organic farm-to-table Ayurvedic dietary regimen'
    ],
    inclusions: [
      'Initial and daily Ayurvedic diagnostic consultations & Nadi Pariksha',
      'All internal medicines and external herbal therapeutic oils',
      '21-night full-board cottage accommodation and all Sattvic meals',
      'Daily yoga & pranayama sessions with master instructors',
      'Post-discharge 3-month herbal medication supply couriered home'
    ],
    recommendedFor: 'Discerning patients seeking authentic, unadulterated Ayurvedic healing for arthritis, spine disorders, and cellular rejuvenation.'
  },
  {
    id: 'pkg-kochi-ortho-robotic',
    title: 'Aster MAKO Robotic Bilateral Knee Restoration',
    tier: 'Premium Care',
    treatmentName: 'Robotic Total Knee Replacement',
    hospitalName: 'Aster Medcity, Kochi',
    doctorName: 'Dr. Vijay Anand',
    district: 'Ernakulam / Kochi',
    city: 'Kochi, Kerala',
    priceUsd: 5400,
    priceInr: 475000,
    durationDays: 12,
    highlights: [
      'Bilateral Simultaneous Knee Replacement with MAKO Robotic Arm by Dr. Vijay Anand',
      'US FDA-approved Stryker Triathlon titanium implants',
      'Private Deluxe Room with dedicated physiotherapist twice daily',
      'Airport Pickup from Cochin International Airport (15 minutes away)',
      '5-Night recuperation stay in luxury boutique partner hotel'
    ],
    inclusions: [
      'Pre-op 3D CT scan modeling and cardiology clearances',
      'Surgery charges, OT, robotic disposables & surgeon fees',
      '3 nights inpatient hospital stay & 5 nights hotel recuperation',
      'Daily in-room physical therapy sessions'
    ],
    recommendedFor: 'Patients seeking world-standard robotic joint precision at 85% savings compared to Western hospitals.'
  },
  {
    id: 'pkg-rajagiri-spine-neuro',
    title: 'Rajagiri Endoscopic Skull Base & Spine Center',
    tier: 'Value Accredited',
    treatmentName: 'Minimally Invasive Spine & Brain Surgery',
    hospitalName: 'Rajagiri Hospital, Aluva',
    doctorName: 'Dr. Rajesh K.',
    district: 'Ernakulam / Kochi',
    city: 'Aluva, Kochi',
    priceUsd: 6800,
    priceInr: 595000,
    durationDays: 10,
    highlights: [
      'Neuronavigation guided micro-discectomy by Senior Surgeon Dr. Rajesh K.',
      'World-class neuro-intensive monitoring with 1:1 nurse ratio',
      'Cochin International Airport (COK) direct reception (15 km)',
      'Post-operative recovery & physical rehabilitation'
    ],
    inclusions: [
      'Microscopic & Endoscopic neurosurgical instrumentation fees',
      'Pre-operative 3T MRI & neuro-radiology evaluations',
      '3 Nights Neuro-ICU + 4 Nights Executive Private Room',
      'Post-operative neurological rehabilitation & speech therapy'
    ],
    recommendedFor: 'Spinal stenosis, herniated disc, and brain tumor patients seeking minimally invasive neurosurgery.'
  }
];

export interface PatientJourneyState {
  patientId: string;
  name: string;
  email: string;
  phone: string;
  country: string;
  keralaDistrict: string;
  condition: string;
  treatment: string;
  currentStep: number; // 1 to 10
  steps: {
    stepNumber: number;
    title: string;
    description: string;
    status: 'completed' | 'in_progress' | 'pending';
    dateCompleted?: string;
    details?: string;
  }[];
  careManager: {
    name: string;
    title: string;
    avatar: string;
    phone: string;
    whatsapp: string;
    email: string;
    rating: number;
    languages: string[];
  };
  travelDetails: {
    visaStatus: 'Approved (Kerala Medical eVisa Issued)' | 'Processing' | 'Documents Required';
    visaInvitationDocUrl?: string;
    flightNumber?: string;
    arrivalAirport?: 'Cochin International Airport (COK)' | 'Trivandrum International Airport (TRV)' | 'Calicut International Airport (CCJ)';
    arrivalDate?: string;
    hotelName?: string;
    hotelRoomType?: string;
    airportPickupDriver?: string;
    driverPhone?: string;
    vehiclePlate?: string;
  };
  vaultDocuments: {
    id: string;
    name: string;
    category: 'Medical Scan' | 'Lab Report' | 'Visa Document' | 'Prescription' | 'Quotation' | 'Discharge Summary';
    size: string;
    dateUploaded: string;
    verified: boolean;
    fileUrl: string;
  }[];
}

export const INITIAL_KERALA_PATIENT: PatientJourneyState = {
  patientId: 'KER-89210',
  name: 'Rashid Al-Maktoum',
  email: 'rashid.m@example.com',
  phone: '+971 50 839 2190',
  country: 'United Arab Emirates 🇦🇪',
  keralaDistrict: 'Ernakulam / Kochi 🌴',
  condition: 'Severe Multi-Vessel Coronary Artery Disease',
  treatment: 'Off-Pump Coronary Artery Bypass Graft (CABG)',
  currentStep: 4,
  steps: [
    {
      stepNumber: 1,
      title: 'Tell Us Your Medical Need',
      description: 'Submitted cardiac symptoms, previous angiography, and preferred travel window to Kerala.',
      status: 'completed',
      dateCompleted: 'Aug 26, 2026',
      details: 'Inquiry received via WhatsApp Concierge'
    },
    {
      stepNumber: 2,
      title: 'Medical Record Review',
      description: 'DICOM Angiogram reviewed by Aster Medcity cardiac clinical board in Kochi.',
      status: 'completed',
      dateCompleted: 'Aug 27, 2026',
      details: 'AI Summary verified by senior cardiologist'
    },
    {
      stepNumber: 3,
      title: 'Kerala Specialist Matching',
      description: 'Matched with Dr. Muralidharan V. Nair (Senior Director CTVS, Aster Medcity).',
      status: 'completed',
      dateCompleted: 'Aug 28, 2026',
      details: 'Specialist profile approved by patient'
    },
    {
      stepNumber: 4,
      title: 'Second Opinion & Video Consult',
      description: 'Live HD video consultation scheduled with Dr. Nair for surgical walkthrough.',
      status: 'in_progress',
      details: 'Video room open: Tomorrow, 11:30 AM IST (GMT+5:30)'
    },
    {
      stepNumber: 5,
      title: 'Treatment Proposal & Quotation',
      description: 'Receive 3-tier hospital quotations (Kochi Platinum vs Value).',
      status: 'pending'
    },
    {
      stepNumber: 6,
      title: 'Choose Hospital & Lock In Care',
      description: 'Select preferred room, recovery hotel in Kochi, and secure deposit.',
      status: 'pending'
    },
    {
      stepNumber: 7,
      title: 'Plan Your Journey to Kerala',
      description: 'Medical eVisa invitation letter from Kerala hospital, flights to Cochin (COK), and hotel confirmation.',
      status: 'pending'
    },
    {
      stepNumber: 8,
      title: 'Arrive in Kerala & Hospital Admission',
      description: 'Dedicated patient coordinator escorts patient from Cochin Airport to private inpatient suite.',
      status: 'pending'
    },
    {
      stepNumber: 9,
      title: 'Surgery & Backwater Recovery',
      description: 'Hospital recuperation followed by 5-star backwater resort physiotherapy and fit-to-fly sign-off.',
      status: 'pending'
    },
    {
      stepNumber: 10,
      title: 'Return Home & 12-Month Follow-Up',
      description: 'Telemedicine follow-ups, medical vault sync, and home doctor coordination.',
      status: 'pending'
    }
  ],
  careManager: {
    name: 'Anjali Menon',
    title: 'Senior Kerala Patient Concierge & Navigator',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=500&q=80',
    phone: '+91 484 290 8482',
    whatsapp: '+91 98470 12345',
    email: 'anjali.menon@vitaliskerala.com',
    rating: 4.99,
    languages: ['Arabic (Fluent)', 'English (Fluent)', 'Malayalam (Native)', 'Hindi']
  },
  travelDetails: {
    visaStatus: 'Approved (Kerala Medical eVisa Issued)',
    visaInvitationDocUrl: '#',
    flightNumber: 'Emirates EK-530 (DXB → COK)',
    arrivalAirport: 'Cochin International Airport (COK)',
    arrivalDate: 'Sept 14, 2026 • 08:45 AM IST',
    hotelName: 'Grand Hyatt Kochi Bolgatty (Waterfront Suite)',
    hotelRoomType: 'Executive Lagoon View Suite with Attendant Bed',
    airportPickupDriver: 'Mr. Unnikrishnan (Vitalis Kerala Chauffeur #12)',
    driverPhone: '+91 98460 33921',
    vehiclePlate: 'KL-07-CC-8888 (Toyota Innova Crysta VIP)'
  },
  vaultDocuments: [
    {
      id: 'doc-1',
      name: 'Coronary_Angiography_Report_2026.pdf',
      category: 'Medical Scan',
      size: '14.2 MB',
      dateUploaded: 'Aug 26, 2026',
      verified: true,
      fileUrl: '#'
    },
    {
      id: 'doc-2',
      name: 'Comprehensive_Cardiac_Metabolic_Panel.pdf',
      category: 'Lab Report',
      size: '2.8 MB',
      dateUploaded: 'Aug 26, 2026',
      verified: true,
      fileUrl: '#'
    },
    {
      id: 'doc-3',
      name: 'Aster_Medcity_Official_Visa_Invitation.pdf',
      category: 'Visa Document',
      size: '1.1 MB',
      dateUploaded: 'Aug 28, 2026',
      verified: true,
      fileUrl: '#'
    },
    {
      id: 'doc-4',
      name: 'Kochi_Platinum_Care_Treatment_Quotation.pdf',
      category: 'Quotation',
      size: '3.4 MB',
      dateUploaded: 'Aug 29, 2026',
      verified: true,
      fileUrl: '#'
    }
  ]
};

export interface CRMLead {
  id: string;
  patientName: string;
  country: string;
  source: 'WhatsApp' | 'Web Concierge' | 'Doctor Referral' | 'NRI Desk';
  treatment: string;
  targetDistrict: string;
  preferredHospital: string;
  stage: 'New Inquiry' | 'Qualified' | 'Records Received' | 'Clinical Review' | 'Provider Matched' | 'Quote Sent' | 'Consultation' | 'Treatment Confirmed' | 'Visa & Travel' | 'In Treatment' | 'Follow-up' | 'Completed';
  caseOwner: string;
  slaRemainingHours: number;
  estimatedRevenueInr: number;
  estimatedRevenueUsd: number;
  priority: 'VIP' | 'High' | 'Standard';
  lastActivity: string;
}

export const INITIAL_KERALA_CRM_LEADS: CRMLead[] = [
  {
    id: 'KL-8801',
    patientName: 'Rashid Al-Maktoum',
    country: 'United Arab Emirates 🇦🇪',
    source: 'WhatsApp',
    treatment: 'Off-Pump Beating-Heart CABG',
    targetDistrict: 'Ernakulam / Kochi',
    preferredHospital: 'Aster Medcity Kochi',
    stage: 'Consultation',
    caseOwner: 'Anjali Menon',
    slaRemainingHours: 4,
    estimatedRevenueInr: 650000,
    estimatedRevenueUsd: 7400,
    priority: 'VIP',
    lastActivity: '10 mins ago - Video consult pre-check'
  },
  {
    id: 'KL-8802',
    patientName: 'David H. Sterling',
    country: 'United States 🇺🇸',
    source: 'Web Concierge',
    treatment: 'Robotic Total Knee Replacement',
    targetDistrict: 'Ernakulam / Kochi',
    preferredHospital: 'Rajagiri Hospital Aluva',
    stage: 'Quote Sent',
    caseOwner: 'Rahul Varma',
    slaRemainingHours: 8,
    estimatedRevenueInr: 475000,
    estimatedRevenueUsd: 5400,
    priority: 'High',
    lastActivity: '1 hour ago - Comparing 3-tier proposals'
  },
  {
    id: 'KL-8803',
    patientName: 'Fatima Al-Zahrani',
    country: 'Saudi Arabia 🇸🇦',
    source: 'NRI Desk',
    treatment: 'Authentic 21-Day Panchakarma Detox',
    targetDistrict: 'Malappuram',
    preferredHospital: 'Arya Vaidya Sala Kottakkal',
    stage: 'Clinical Review',
    caseOwner: 'Dr. K. M. Namboothiri',
    slaRemainingHours: 2,
    estimatedRevenueInr: 245000,
    estimatedRevenueUsd: 2800,
    priority: 'VIP',
    lastActivity: '3 hours ago - Medical history reviewed'
  },
  {
    id: 'KL-8804',
    patientName: 'Claire Duhamel',
    country: 'France 🇫🇷',
    source: 'Web Concierge',
    treatment: 'Advanced Oncology & Precision Radiotherapy',
    targetDistrict: 'Thiruvananthapuram',
    preferredHospital: 'Regional Cancer Centre (RCC)',
    stage: 'Visa & Travel',
    caseOwner: 'Anjali Menon',
    slaRemainingHours: 18,
    estimatedRevenueInr: 950000,
    estimatedRevenueUsd: 10800,
    priority: 'High',
    lastActivity: 'Yesterday - Kerala eVisa issued'
  },
  {
    id: 'KL-8805',
    patientName: 'Dr. Kofi Mensah',
    country: 'Ghana 🇬🇭',
    source: 'Doctor Referral',
    treatment: 'Living-Donor Liver Transplantation',
    targetDistrict: 'Kozhikode',
    preferredHospital: 'Baby Memorial Hospital (BMH)',
    stage: 'New Inquiry',
    caseOwner: 'Anjali Menon',
    slaRemainingHours: 1,
    estimatedRevenueInr: 2200000,
    estimatedRevenueUsd: 25000,
    priority: 'VIP',
    lastActivity: 'Just now - Donor & recipient scans loaded'
  }
];
