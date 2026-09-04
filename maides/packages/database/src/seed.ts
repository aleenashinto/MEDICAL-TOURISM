import { createDatabase } from "./index.js";
import { hospitals, doctors, users } from "./schema/index.js";
import { hashPassword } from "@maides/auth";
import * as dotenv from "dotenv";

dotenv.config({ path: "../../.env" });

const dbUrl = process.env.DATABASE_URL || "postgresql://maides:maides_dev_password@localhost:5432/maides";

async function seed() {
  console.log("Seeding database...");
  const db = createDatabase(dbUrl);

  // 1. Seed Admin & Coordinator Users
  const adminPassword = await hashPassword("Admin@123456");
  const [adminUser] = await db
    .insert(users)
    .values({
      email: "admin@maides.in",
      passwordHash: adminPassword,
      fullName: "Super Admin",
      role: "super_admin",
      country: "India",
      phone: "+91-9876543210",
      preferredLanguage: "English",
      emailVerified: true,
    })
    .onConflictDoNothing()
    .returning();

  // 2. Seed Hospitals
  const [aster] = await db
    .insert(hospitals)
    .values({
      slug: "aster-medcity-kochi",
      name: "Aster Medcity",
      tagline: "JCI-Accredited 670-bed waterfront quaternary healthcare destination",
      district: "Ernakulam",
      city: "Kochi",
      region: "central_kerala",
      type: "multispecialty",
      accreditations: ["JCI Accredited", "NABH Certified", "NABL Accredited"],
      specialties: ["Cardiology", "Organ Transplant", "Oncology", "Robotic Orthopaedics", "Neurology"],
      bedsCount: 670,
      internationalPatientsAnnual: 28000,
      rating: "4.94",
      reviewCount: 4210,
      imageUrl: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?auto=format&fit=crop&w=1200&q=80",
      description: "Situated on a tranquil 45-acre waterfront campus in Cheranalloor, Aster Medcity is Kerala’s foremost destination for international patients.",
      nearestAirport: "COK",
      airportDistanceKm: 24,
      vipRoomsAvailable: true,
      ayurvedaWingAvailable: true,
      featured: true,
    })
    .onConflictDoNothing()
    .returning();

  const [rajagiri] = await db
    .insert(hospitals)
    .values({
      slug: "rajagiri-hospital-aluva",
      name: "Rajagiri Hospital",
      tagline: "JCI-Accredited Quaternary Center with American Cardiac & Transplant Standards",
      district: "Ernakulam",
      city: "Aluva, Kochi",
      region: "central_kerala",
      type: "super_specialty",
      accreditations: ["JCI Accredited", "NABH", "NABL"],
      specialties: ["Cardiac Sciences", "Robotic Joint Arthroplasty", "Comprehensive Cancer Care"],
      bedsCount: 500,
      internationalPatientsAnnual: 19500,
      rating: "4.92",
      reviewCount: 3180,
      imageUrl: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
      description: "Located only 15 minutes from Cochin International Airport, Rajagiri Hospital blends world-class surgical protocols with compassionate care.",
      nearestAirport: "COK",
      airportDistanceKm: 14,
      vipRoomsAvailable: true,
      ayurvedaWingAvailable: true,
      featured: true,
    })
    .onConflictDoNothing()
    .returning();

  // 3. Seed Doctors
  if (aster) {
    await db
      .insert(doctors)
      .values({
        slug: "dr-muralidharan-nair",
        hospitalId: aster.id,
        name: "Dr. Muralidharan V. Nair",
        title: "Senior Director & Chief of Cardiothoracic & Vascular Surgery",
        specialty: "Cardiology",
        subSpecialty: "Minimally Invasive Beating-Heart CABG & Total Arterial Revascularization",
        qualifications: "MBBS, MS (Gen Surg), MCh (CTVS - AIIMS), FRCS (Edinburgh)",
        experienceYears: 27,
        languages: ["English", "Malayalam", "Hindi", "Arabic"],
        rating: "4.98",
        reviewCount: 940,
        consultationFeeUsd: 20,
        consultationFeeInr: 1500,
        avatarUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
        bio: "Pioneered over 11,000 beating-heart coronary bypass and complex valve repair surgeries with a 99.4% survival record.",
        areasOfExpertise: ["Off-Pump Beating Heart CABG", "Minimally Invasive Aortic Valve Replacement (MICS)", "TAVR"],
        publicationsCount: 42,
        videoConsultationAvailable: true,
        featured: true,
      })
      .onConflictDoNothing();
  }

  console.log("Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
