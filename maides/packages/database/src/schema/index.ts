import {
  pgTable,
  uuid,
  varchar,
  text,
  boolean,
  timestamp,
  integer,
  numeric,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";

// ─── Enums ───────────────────────────────────────────────────────────────────

export const userRoleEnum = pgEnum("user_role", [
  "super_admin",
  "admin",
  "medical_coordinator",
  "travel_coordinator",
  "support_agent",
  "sales_crm_agent",
  "hospital_manager",
  "doctor",
  "patient",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "medical_review",
  "hospital_matching",
  "quotation_sent",
  "appointment_requested",
  "converted",
  "lost",
  "closed",
]);

export const caseStatusEnum = pgEnum("case_status", [
  "new",
  "medical_review",
  "document_review",
  "doctor_assigned",
  "opinion_requested",
  "opinion_received",
  "hospital_selected",
  "treatment_planned",
  "appointment_scheduled",
  "treatment_in_progress",
  "treatment_completed",
  "follow_up",
  "closed",
  "cancelled",
]);

export const hospitalTypeEnum = pgEnum("hospital_type", [
  "multispecialty",
  "super_specialty",
  "government_medical_college",
  "ayurveda_wellness",
  "specialized_institute",
]);

export const keralaRegionEnum = pgEnum("kerala_region", [
  "south_kerala",
  "central_kerala",
  "north_kerala",
]);

export const documentTypeEnum = pgEnum("document_type", [
  "diagnosis_report",
  "lab_results",
  "imaging",
  "prescription",
  "discharge_summary",
  "referral_letter",
  "insurance_document",
  "passport_visa",
  "other",
]);

// ─── Users & Profiles ─────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  role: userRoleEnum("role").default("patient").notNull(),
  country: varchar("country", { length: 100 }),
  phone: varchar("phone", { length: 50 }),
  preferredLanguage: varchar("preferred_language", { length: 50 }).default("English").notNull(),
  emailVerified: boolean("email_verified").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Hospitals ───────────────────────────────────────────────────────────────

export const hospitals = pgTable("hospitals", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: text("tagline").notNull(),
  district: varchar("district", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  region: keralaRegionEnum("region").notNull(),
  type: hospitalTypeEnum("type").default("multispecialty").notNull(),
  accreditations: jsonb("accreditations").$type<string[]>().default([]).notNull(),
  specialties: jsonb("specialties").$type<string[]>().default([]).notNull(),
  bedsCount: integer("beds_count").default(0).notNull(),
  internationalPatientsAnnual: integer("international_patients_annual").default(0).notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.9").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  imageUrl: text("image_url"),
  description: text("description").notNull(),
  nearestAirport: varchar("nearest_airport", { length: 20 }).default("COK").notNull(),
  airportDistanceKm: integer("airport_distance_km").default(0).notNull(),
  vipRoomsAvailable: boolean("vip_rooms_available").default(false).notNull(),
  ayurvedaWingAvailable: boolean("ayurveda_wing_available").default(false).notNull(),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Doctors ─────────────────────────────────────────────────────────────────

export const doctors = pgTable("doctors", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  title: text("title").notNull(),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  subSpecialty: text("sub_specialty").notNull(),
  qualifications: text("qualifications").notNull(),
  experienceYears: integer("experience_years").default(0).notNull(),
  languages: jsonb("languages").$type<string[]>().default([]).notNull(),
  rating: numeric("rating", { precision: 3, scale: 2 }).default("4.9").notNull(),
  reviewCount: integer("review_count").default(0).notNull(),
  consultationFeeUsd: integer("consultation_fee_usd").default(20).notNull(),
  consultationFeeInr: integer("consultation_fee_inr").default(1500).notNull(),
  avatarUrl: text("avatar_url"),
  bio: text("bio").notNull(),
  areasOfExpertise: jsonb("areas_of_expertise").$type<string[]>().default([]).notNull(),
  publicationsCount: integer("publications_count").default(0).notNull(),
  videoConsultationAvailable: boolean("video_consultation_available").default(true).notNull(),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Enquiries / Cases ───────────────────────────────────────────────────────

export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  status: caseStatusEnum("status").default("new").notNull(),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  medicalSummary: text("medical_summary").notNull(),
  preferredDistrict: varchar("preferred_district", { length: 100 }),
  budget: varchar("budget", { length: 50 }),
  timeline: varchar("timeline", { length: 50 }),
  assignedCoordinatorId: uuid("assigned_coordinator_id").references(() => users.id),
  assignedHospitalId: uuid("assigned_hospital_id").references(() => hospitals.id),
  assignedDoctorId: uuid("assigned_doctor_id").references(() => doctors.id),
  internalNotes: text("internal_notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Documents ───────────────────────────────────────────────────────────────

export const enquiryDocuments = pgTable("enquiry_documents", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }).notNull(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  documentType: documentTypeEnum("document_type").default("other").notNull(),
  originalFileName: varchar("original_file_name", { length: 255 }).notNull(),
  storagePath: text("storage_path").notNull(),
  fileSizeBytes: integer("file_size_bytes").notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  uploadedAt: timestamp("uploaded_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Audit Logs ──────────────────────────────────────────────────────────────

export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id),
  userEmail: varchar("user_email", { length: 255 }),
  userRole: userRoleEnum("user_role"),
  action: varchar("action", { length: 100 }).notNull(),
  entityType: varchar("entity_type", { length: 100 }).notNull(),
  entityId: varchar("entity_id", { length: 100 }).notNull(),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});
