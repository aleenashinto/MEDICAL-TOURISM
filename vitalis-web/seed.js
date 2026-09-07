const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const doctors = [
  {
    id: "DOC-101",
    name: "Dr. Vijay Anand",
    title: "Senior Consultant & Head of Orthopedics",
    specialty: "Orthopaedics & Joint Replacement",
    hospital: "Aster Medcity, Kochi",
    hospitalName: "Aster Medcity, Kochi",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 24,
    education: "MBBS, MS (Ortho), MCh (UK), Fellowship Joint Reconstruction",
  },
  {
    id: "DOC-102",
    name: "Dr. K. S. Muralidharan",
    title: "Chief of Cardiothoracic & Vascular Surgery",
    specialty: "Cardiology & Cardiac Surgery",
    hospital: "Amrita Institute of Medical Sciences",
    hospitalName: "Amrita Institute of Medical Sciences",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 28,
    education: "MBBS, MS, MCh (CTVS), FACC, FRCS (Edinburgh)",
  },
  {
    id: "DOC-103",
    name: "Dr. Rajesh K.",
    title: "Lead Neuro & Spine Surgeon",
    specialty: "Neurology & Spine Surgery",
    hospital: "Rajagiri Hospital, Aluva",
    hospitalName: "Rajagiri Hospital, Aluva",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 19,
    education: "MBBS, MS, MCh (Neurosurgery), FACS (USA)",
  },
  {
    id: "DOC-104",
    name: "Dr. Arya Varma",
    title: "Chief Ayurvedic Physician",
    specialty: "Classical Ayurveda & Panchakarma",
    hospital: "Somatheeram Ayurvedic Village",
    hospitalName: "Somatheeram Ayurvedic Village",
    district: "Thiruvananthapuram",
    city: "Kovalam, Kerala",
    experienceYears: 16,
    education: "BAMS, MD (Ayurveda - Kayachikitsa), Traditional Lineage",
  },
  {
    id: "DOC-105",
    name: "Dr. Deepa Pillai",
    title: "Senior Consultant Medical Oncologist",
    specialty: "Oncology & Cancer Care",
    hospital: "VPS Lakeshore Hospital, Kochi",
    hospitalName: "VPS Lakeshore Hospital, Kochi",
    district: "Ernakulam",
    city: "Kochi, Kerala",
    experienceYears: 21,
    education: "MBBS, MD, DM (Medical Oncology - TMC Mumbai), ESMO Certified",
  }
];

async function main() {
  for (const doc of doctors) {
    // Upsert Hospital
    const hospId = doc.hospital.replace(/\s+/g, '-').toLowerCase();
    await prisma.hospital.upsert({
      where: { id: hospId },
      update: {},
      create: {
        id: hospId,
        name: doc.hospital,
        location: doc.city,
      }
    });

    // Upsert Doctor
    await prisma.doctor.upsert({
      where: { id: doc.id },
      update: {},
      create: {
        id: doc.id,
        hospitalId: hospId,
        name: doc.name,
        specialty: doc.specialty,
        qualifications: doc.education,
        experience: doc.experienceYears,
      }
    });
  }
  console.log("Seeding complete!");
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
