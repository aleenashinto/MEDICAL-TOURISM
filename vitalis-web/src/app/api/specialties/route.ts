import { NextResponse } from 'next/server';
import { verifyToken } from '@/lib/session';
import { cookies } from 'next/headers';

async function verifyAdmin() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('maides_session')?.value;
  if (!sessionCookie) return false;
  const session = await verifyToken(sessionCookie);
  return session && session.role === 'ADMIN';
}

export interface ServerSpecialty {
  id: string;
  name: string;
  code: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  image: string;
  displayOrder: number;
  status: 'ACTIVE' | 'INACTIVE';
  published: 'PUBLISHED' | 'DRAFT';
  hospitals: string[];
  doctors: string[];
  proceduresCount: number;
  keyProcedures: string[];
  accreditations: string[];
  leadDoctor: string;
  seoTitle?: string;
  seoDescription?: string;
}

let globalSpecialtiesStore: ServerSpecialty[] = [
  {
    id: 'SPEC-001',
    name: 'Cardiology & Cardiac Surgery',
    code: 'CARDIO',
    category: 'Interventional & Surgical',
    shortDescription: 'Off-Pump CABG, TAVR, and beating-heart cardiac surgery by senior directors.',
    fullDescription: 'Cutting-edge cardiovascular institute equipped with hybrid catheterization labs, ECMO life support systems, and DaVinci surgical robotics for complex adult and congenital heart corrections.',
    iconName: 'HeartPulse',
    image: 'https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80',
    displayOrder: 1,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 18,
    hospitals: ['Amrita Institute of Medical Sciences', 'Aster Medcity, Kochi'],
    doctors: ['Dr. K. S. Muralidharan, DM, FACC'],
    keyProcedures: [
      'Robotic Mitral & Aortic Valve Replacement',
      'Off-Pump Coronary Artery Bypass (CABG)',
      'Transcatheter Aortic Valve Implantation (TAVI)',
      'Complex Paediatric Congenital Heart Surgeries'
    ],
    accreditations: ['JCI Accredited', 'NABH Digital Cardiology'],
    leadDoctor: 'Dr. K. S. Muralidharan, DM, FACC',
    seoTitle: 'Cardiology & Cardiac Surgery in Kerala',
    seoDescription: 'Affordable quaternary cardiology, bypass, and robotic valve replacements in Kerala accredited hospitals.'
  },
  {
    id: 'SPEC-002',
    name: 'Orthopaedics & Joint Replacement',
    code: 'ORTHO',
    category: 'Surgical & Rehabilitation',
    shortDescription: 'MAKO robotic knee & anterior hip replacement with same-day ambulation.',
    fullDescription: 'World-class center of excellence for advanced musculoskeletal care, computer-navigated arthroplasty, sports injury reconstruction, and endoscopic spine decompression.',
    iconName: 'Activity',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    displayOrder: 2,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 14,
    hospitals: ['Aster Medcity, Kochi', 'Rajagiri Hospital, Aluva'],
    doctors: ['Dr. Vijay Anand, MS (Ortho), MCh'],
    keyProcedures: [
      'Total Knee Replacement (Robotic & Minimally Invasive)',
      'Total Hip Arthroplasty (Bilateral / Unilateral)',
      'Arthroscopic ACL/PCL Ligament Reconstruction',
      'Spinal Decompression & Fusion Surgery'
    ],
    accreditations: ['JCI Accredited', 'NABH Center of Excellence'],
    leadDoctor: 'Dr. Vijay Anand, MS (Ortho), MCh',
    seoTitle: 'Robotic Orthopedics & Joint Replacement Kerala',
    seoDescription: 'Precision robotic knee and hip arthroplasty in Kerala with holistic physiotherapy recovery.'
  },
  {
    id: 'SPEC-003',
    name: 'Neurology & Spine Surgery',
    code: 'NEURO',
    category: 'Neurosciences',
    shortDescription: 'Endoscopic skull base surgery, micro-discectomy, and neuronavigation spine surgery.',
    fullDescription: 'Pioneering neurosciences institute delivering 24/7 hyperacute stroke thrombectomy, intraoperative neural navigation, DBS for Parkinson\'s, and microvascular decompression.',
    iconName: 'Brain',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=800&q=80',
    displayOrder: 3,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 11,
    hospitals: ['Rajagiri Hospital, Aluva', 'Amrita Institute of Medical Sciences'],
    doctors: ['Dr. Rajesh K., MCh'],
    keyProcedures: [
      'Endoscopic Skull Base & Brain Tumor Resection',
      'Deep Brain Stimulation (DBS) for Parkinson\'s',
      'Endovascular Coil Embolization for Aneurysms',
      'Microscopic Discectomy & Artificial Disc Replacement'
    ],
    accreditations: ['NABH Stroke Certified', 'World Stroke Organization Center'],
    leadDoctor: 'Dr. Rajesh K., MCh',
    seoTitle: 'Neurosurgery & Neurology in Kerala',
    seoDescription: 'Expert neurological surgery and brain tumor resection in Kerala quaternary centers.'
  },
  {
    id: 'SPEC-004',
    name: 'Classical Ayurveda & Panchakarma',
    code: 'AYUR',
    category: 'Holistic & Traditional',
    shortDescription: 'Authentic Ashtavaidya 14-21 day Panchakarma at Somatheeram Ayurvedic Village.',
    fullDescription: 'Authentic centuries-old Kerala Ayurvedic heritage delivered in serene NABH/Ayush Platinum accredited seaside hospitals and retreats for arthritis, neurological recovery, and deep detox.',
    iconName: 'Leaf',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
    displayOrder: 4,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 24,
    hospitals: ['Somatheeram Ayurvedic Village, Kovalam'],
    doctors: ['Dr. Arya Varma, BAMS, MD'],
    keyProcedures: [
      'Classical Panchakarma 21-Day Detoxification',
      'Shirodhara & Rasayana Rejuvenation Protocols',
      'Ayurvedic Arthritis & Spondylosis Management',
      'Neurological Rehabilitation & Paraplegia Care'
    ],
    accreditations: ['Ayush Platinum Certified', 'Green Leaf Certified'],
    leadDoctor: 'Dr. Arya Varma, BAMS, MD',
    seoTitle: 'Authentic Kerala Ayurveda & Panchakarma Treatments',
    seoDescription: 'Traditional Ashtavaidya Ayurvedic treatments, Panchakarma, and holistic wellness in Kerala.'
  },
  {
    id: 'SPEC-005',
    name: 'Oncology & Cancer Care',
    code: 'ONCO',
    category: 'Medical, Surgical & Radiation',
    shortDescription: 'Precision oncology, immunotherapy, and multi-organ cancer treatment at VPS Lakeshore.',
    fullDescription: 'Multidisciplinary comprehensive tumor boards, PET-CT fusion imaging, precision targeted biological therapies, robotic HIPEC, and organ-preserving oncology.',
    iconName: 'Microscope',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    displayOrder: 5,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 15,
    hospitals: ['VPS Lakeshore Hospital, Kochi', 'Aster Medcity, Kochi', 'Amrita Institute of Medical Sciences'],
    doctors: ['Dr. Deepa Pillai, MD, DM'],
    keyProcedures: [
      'TrueBeam Stereotactic Radiotherapy',
      'Robotic HIPEC for Peritoneal Carcinomatosis',
      'Bone Marrow & Stem Cell Transplantation',
      'Precision Immunotherapy & Genomic Profiling'
    ],
    accreditations: ['JCI Comprehensive Cancer Center', 'ESMO Recognized'],
    leadDoctor: 'Dr. Deepa Pillai, MD, DM',
    seoTitle: 'Cancer Care & Oncology in Kerala - MAIDES',
    seoDescription: 'World-class cancer treatments, TrueBeam radiation, and bone marrow transplants in Kerala.'
  },
  {
    id: 'SPEC-006',
    name: 'Gastroenterology & Hepatobiliary Sciences',
    code: 'GASTRO',
    category: 'Medical & Surgical',
    shortDescription: 'Advanced therapeutic endoscopy, ERCP, and comprehensive hepatobiliary surgical care.',
    fullDescription: 'Premier digestive disease institute offering third-space endoscopy (POEM/ESD), endoscopic ultrasound, SpyGlass cholangioscopy, and laparoscopic gastrointestinal surgery.',
    iconName: 'Ambulance',
    image: 'https://images.unsplash.com/photo-1551076805-e1869033e561?auto=format&fit=crop&w=800&q=80',
    displayOrder: 6,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 16,
    hospitals: ['VPS Lakeshore Hospital, Kochi', 'Aster Medcity, Kochi', 'Rajagiri Hospital, Aluva'],
    doctors: ['Dr. Roy J. Mukkada, MD, DM'],
    keyProcedures: [
      'Peroral Endoscopic Myotomy (POEM) for Achalasia',
      'Endoscopic Retrograde Cholangiopancreatography (ERCP)',
      'Endoscopic Submucosal Dissection (ESD)',
      'Laparoscopic Bariatric & Metabolic Surgery'
    ],
    accreditations: ['JCI Accredited', 'NABH Center of Excellence'],
    leadDoctor: 'Dr. Roy J. Mukkada, MD, DM',
    seoTitle: 'Gastroenterology & Liver Care in Kerala',
    seoDescription: 'Comprehensive therapeutic endoscopy and digestive health care in accredited Kerala hospitals.'
  },
  {
    id: 'SPEC-007',
    name: 'Organ Transplant (Liver, Kidney, Heart)',
    code: 'TRANS',
    category: 'Surgical & Intensive Care',
    shortDescription: 'High-volume living donor liver and renal transplants with >95% success rates.',
    fullDescription: 'Dedicated multi-organ transplantation center with specialized transplant ICUs, HLA crossmatch matching labs, and international donor-recipient legal clearance desks.',
    iconName: 'Stethoscope',
    image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80',
    displayOrder: 7,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 9,
    hospitals: ['Aster Medcity, Kochi', 'Amrita Institute of Medical Sciences', 'VPS Lakeshore Hospital, Kochi'],
    doctors: ['Dr. Harikrishnan Pillai, MCh'],
    keyProcedures: [
      'Living Donor Liver Transplantation (Adult & Paediatric)',
      'ABO-Incompatible Kidney Transplantation',
      'Robotic Donor Nephrectomy',
      'Combined Kidney-Pancreas Transplantation'
    ],
    accreditations: ['State Approved Transplant Center', 'NOTTO Certified'],
    leadDoctor: 'Dr. Harikrishnan Pillai, MCh',
    seoTitle: 'Organ Transplantation in Kerala',
    seoDescription: 'World-recognized living donor liver, renal, and cardiac transplants in Kerala.'
  },
  {
    id: 'SPEC-008',
    name: 'Urology, Nephrology & Robotic Surgery',
    code: 'URO',
    category: 'Interventional & Surgical',
    shortDescription: 'DaVinci robotic prostatectomy, laser RIRS kidney stone clearance, and dialysis.',
    fullDescription: 'Comprehensive renal sciences and urology center providing advanced laser endourology, robotic uro-oncology, and maintenance hemodialysis.',
    iconName: 'UserCheck',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    displayOrder: 8,
    status: 'ACTIVE',
    published: 'PUBLISHED',
    proceduresCount: 14,
    hospitals: ['Aster Medcity, Kochi', 'Rajagiri Hospital, Aluva'],
    doctors: ['Dr. Kishore T. A., MS, MCh'],
    keyProcedures: [
      'Robotic Radical Prostatectomy & Partial Nephrectomy',
      'Retrograde Intrarenal Surgery (RIRS) Laser Lithotripsy',
      'Holmium Laser Enucleation of Prostate (HoLEP)',
      'Arteriovenous (AV) Fistula Creation & Dialysis'
    ],
    accreditations: ['NABH Nephrology Certified', 'JCI Accredited'],
    leadDoctor: 'Dr. Kishore T. A., MS, MCh',
    seoTitle: 'Urology & Kidney Care Kerala',
    seoDescription: 'Advanced robotic urology, laser kidney stone surgery, and dialysis in Kerala.'
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const isPublic = searchParams.get('public') === 'true';

    let result = [...globalSpecialtiesStore];

    if (isPublic) {
      result = result.filter(s => s.status === 'ACTIVE' && s.published === 'PUBLISHED');
    }

    result.sort((a, b) => (Number(a.displayOrder) || 99) - (Number(b.displayOrder) || 99));

    return NextResponse.json({
      success: true,
      count: result.length,
      specialties: result
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: 'Failed to fetch specialties', error: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();

    if (!body.name || !body.name.trim()) {
      return NextResponse.json({ success: false, error: "Specialty name is required." }, { status: 400 });
    }

    const newId = body.id || `SPEC-${String(globalSpecialtiesStore.length + 1).padStart(3, '0')}`;
    const newSpecialty: ServerSpecialty = {
      id: newId,
      name: body.name.trim(),
      code: body.code || newId,
      category: body.category || "Interventional & Surgical",
      shortDescription: body.shortDescription || `${body.name} center of excellence in Kerala.`,
      fullDescription: body.fullDescription || `${body.name} provides advanced clinical care in Kerala.`,
      iconName: body.iconName || "HeartPulse",
      image: body.image || "https://images.unsplash.com/photo-1559757175-5700dde675bc?auto=format&fit=crop&w=800&q=80",
      displayOrder: Number(body.displayOrder) || (globalSpecialtiesStore.length + 1),
      status: body.status || "ACTIVE",
      published: body.published || "PUBLISHED",
      proceduresCount: Number(body.proceduresCount) || 10,
      hospitals: Array.isArray(body.hospitals) ? body.hospitals : ["Aster Medcity, Kochi"],
      doctors: Array.isArray(body.doctors) ? body.doctors : ["Chief Clinical Consultant"],
      keyProcedures: Array.isArray(body.keyProcedures) ? body.keyProcedures : ["Standardized Clinical Treatments"],
      accreditations: Array.isArray(body.accreditations) ? body.accreditations : ["NABH Accredited"],
      leadDoctor: body.leadDoctor || "Chief Clinical Consultant",
      seoTitle: body.seoTitle || `${body.name} in Kerala - MAIDES Healthcare`,
      seoDescription: body.seoDescription || `World-class ${body.name} treatments in Kerala accredited hospitals.`
    };

    globalSpecialtiesStore = [newSpecialty, ...globalSpecialtiesStore.filter(s => s.id !== newSpecialty.id)];

    return NextResponse.json({
      success: true,
      specialty: newSpecialty,
      specialties: globalSpecialtiesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to create specialty" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: "Specialty ID required for update." }, { status: 400 });
    }

    const index = globalSpecialtiesStore.findIndex(s => s.id === body.id);
    if (index === -1) {
      globalSpecialtiesStore = [body, ...globalSpecialtiesStore];
    } else {
      globalSpecialtiesStore[index] = { ...globalSpecialtiesStore[index], ...body };
    }

    return NextResponse.json({
      success: true,
      specialty: body,
      specialties: globalSpecialtiesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to update specialty" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await verifyAdmin())) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: "Specialty ID parameter is required." }, { status: 400 });
    }

    globalSpecialtiesStore = globalSpecialtiesStore.filter(s => s.id !== id);

    return NextResponse.json({
      success: true,
      message: `Specialty ${id} removed successfully`,
      specialties: globalSpecialtiesStore
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || "Failed to delete specialty" }, { status: 500 });
  }
}
