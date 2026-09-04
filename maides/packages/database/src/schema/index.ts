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

// ─── Leads / CRM ──────────────────────────────────────────────────────────────

export const leads = pgTable("leads", {
  id: uuid("id").primaryKey().defaultRandom(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }).notNull(),
  country: varchar("country", { length: 100 }).notNull(),
  specialty: varchar("specialty", { length: 100 }).notNull(),
  treatmentName: varchar("treatment_name", { length: 255 }),
  preferredDistrict: varchar("preferred_district", { length: 100 }),
  budget: varchar("budget", { length: 50 }),
  timeline: varchar("timeline", { length: 50 }),
  medicalSummary: text("medical_summary").notNull(),
  status: leadStatusEnum("status").default("new").notNull(),
  source: varchar("source", { length: 100 }).default("website").notNull(),
  assignedAgentId: uuid("assigned_agent_id").references(() => users.id),
  convertedPatientId: uuid("converted_patient_id").references(() => users.id),
  notes: text("notes"),
  consentGiven: boolean("consent_given").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Specialties ─────────────────────────────────────────────────────────────

export const specialties = pgTable("specialties", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  iconName: varchar("icon_name", { length: 100 }),
  imageUrl: text("image_url"),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Treatments ──────────────────────────────────────────────────────────────

export const treatments = pgTable("treatments", {
  id: uuid("id").primaryKey().defaultRandom(),
  slug: varchar("slug", { length: 150 }).notNull().unique(),
  specialtyId: uuid("specialty_id").references(() => specialties.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  tagline: text("tagline").notNull(),
  description: text("description").notNull(),
  whoRequires: jsonb("who_requires").$type<string[]>().default([]).notNull(),
  procedureOverview: text("procedure_overview").notNull(),
  typicalStayDays: integer("typical_stay_days").default(7).notNull(),
  recoveryDays: integer("recovery_days").default(14).notNull(),
  minUsd: integer("min_usd").default(2000).notNull(),
  maxUsd: integer("max_usd").default(8000).notNull(),
  averageInr: integer("average_inr").default(250000).notNull(),
  usComparisonCostUsd: integer("us_comparison_cost_usd").default(45000),
  topKeralaDistricts: jsonb("top_kerala_districts").$type<string[]>().default([]).notNull(),
  faqs: jsonb("faqs").$type<{ question: string; answer: string }[]>().default([]).notNull(),
  featured: boolean("featured").default(false).notNull(),
  active: boolean("active").default(true).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
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

export const quotationStatusEnum = pgEnum("quotation_status", [
  "draft",
  "sent",
  "accepted",
  "rejected",
  "expired",
]);

// ─── Quotations & Treatment Proposals ───────────────────────────────────────

export const quotations = pgTable("quotations", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }).notNull(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
  doctorId: uuid("doctor_id").references(() => doctors.id),
  title: varchar("title", { length: 255 }).notNull(),
  tier: varchar("tier", { length: 100 }).default("Standard Care").notNull(),
  treatmentName: varchar("treatment_name", { length: 255 }).notNull(),
  baseProcedureCostUsd: integer("base_procedure_cost_usd").notNull(),
  hospitalStayDays: integer("hospital_stay_days").default(5).notNull(),
  stayCostUsd: integer("stay_cost_usd").default(0).notNull(),
  investigationsCostUsd: integer("investigations_cost_usd").default(0).notNull(),
  medicationsCostUsd: integer("medications_cost_usd").default(0).notNull(),
  logisticsCostUsd: integer("logistics_cost_usd").default(0).notNull(),
  totalCostUsd: integer("total_cost_usd").notNull(),
  totalCostInr: integer("total_cost_inr").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  inclusions: jsonb("inclusions").$type<string[]>().default([]).notNull(),
  exclusions: jsonb("exclusions").$type<string[]>().default([]).notNull(),
  termsAndConditions: text("terms_and_conditions"),
  status: quotationStatusEnum("status").default("draft").notNull(),
  validUntil: timestamp("valid_until", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Travel, Accommodation & Logistics ─────────────────────────────────────

export const travelBookingTypeEnum = pgEnum("travel_booking_type", [
  "flight",
  "airport_transfer",
  "hotel",
  "ayurvedic_resort",
  "local_transport",
  "sim_and_forex",
]);

export const travelBookingStatusEnum = pgEnum("travel_booking_status", [
  "requested",
  "confirmed",
  "in_transit",
  "completed",
  "cancelled",
]);

export const travelBookings = pgTable("travel_bookings", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }).notNull(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  coordinatorId: uuid("coordinator_id").references(() => users.id),
  bookingType: travelBookingTypeEnum("booking_type").notNull(),
  providerName: varchar("provider_name", { length: 255 }).notNull(),
  referenceNumber: varchar("reference_number", { length: 150 }),
  details: jsonb("details").default({}).notNull(),
  pickupLocation: varchar("pickup_location", { length: 255 }),
  dropoffLocation: varchar("dropoff_location", { length: 255 }),
  startDate: timestamp("start_date", { withTimezone: true }),
  endDate: timestamp("end_date", { withTimezone: true }),
  costUsd: integer("cost_usd").default(0).notNull(),
  costInr: integer("cost_inr").default(0).notNull(),
  status: travelBookingStatusEnum("status").default("requested").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const visaInvitations = pgTable("visa_invitations", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }).notNull(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
  doctorId: uuid("doctor_id").references(() => doctors.id),
  invitationNumber: varchar("invitation_number", { length: 100 }).notNull().unique(),
  patientPassportNumber: varchar("patient_passport_number", { length: 50 }).notNull(),
  patientNationality: varchar("patient_nationality", { length: 100 }).notNull(),
  attendantName: varchar("attendant_name", { length: 255 }),
  attendantPassportNumber: varchar("attendant_passport_number", { length: 50 }),
  diagnosis: text("diagnosis").notNull(),
  recommendedTreatment: text("recommended_treatment").notNull(),
  expectedArrivalDate: timestamp("expected_arrival_date", { withTimezone: true }).notNull(),
  stayDurationDays: integer("stay_duration_days").default(14).notNull(),
  embassyCity: varchar("embassy_city", { length: 100 }),
  status: varchar("status", { length: 50 }).default("issued").notNull(),
  documentPath: text("document_path"),
  issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Telemedicine & Video Consultations ────────────────────────────────────

export const consultationStatusEnum = pgEnum("consultation_status", [
  "scheduled",
  "in_progress",
  "completed",
  "cancelled",
  "no_show",
]);

export const consultationSessions = pgTable("consultation_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }).notNull(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  doctorId: uuid("doctor_id").references(() => doctors.id, { onDelete: "cascade" }).notNull(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").default(30).notNull(),
  status: consultationStatusEnum("status").default("scheduled").notNull(),
  meetingRoomId: varchar("meeting_room_id", { length: 150 }).notNull().unique(),
  meetingJoinUrl: text("meeting_join_url").notNull(),
  patientSymptoms: text("patient_symptoms"),
  doctorPrescription: text("doctor_prescription"),
  clinicalRecommendations: text("clinical_recommendations"),
  feeUsd: integer("fee_usd").default(25).notNull(),
  feeInr: integer("fee_inr").default(2000).notNull(),
  recordingUrl: text("recording_url"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  endedAt: timestamp("ended_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

// ─── Billing, Invoices & Payments ──────────────────────────────────────────

export const invoiceStatusEnum = pgEnum("invoice_status", [
  "draft",
  "issued",
  "partially_paid",
  "paid",
  "void",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "initiated",
  "successful",
  "failed",
  "refunded",
]);

export const paymentMethodEnum = pgEnum("payment_method", [
  "credit_card",
  "international_wire",
  "razorpay",
  "stripe",
  "upi",
  "cash_at_hospital",
]);

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceNumber: varchar("invoice_number", { length: 100 }).notNull().unique(),
  enquiryId: uuid("enquiry_id").references(() => enquiries.id, { onDelete: "cascade" }).notNull(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  hospitalId: uuid("hospital_id").references(() => hospitals.id, { onDelete: "cascade" }).notNull(),
  quotationId: uuid("quotation_id").references(() => quotations.id),
  title: varchar("title", { length: 255 }).notNull(),
  items: jsonb("items").$type<{ description: string; quantity: number; unitPriceUsd: number; totalUsd: number }[]>().default([]).notNull(),
  subtotalUsd: integer("subtotal_usd").notNull(),
  taxUsd: integer("tax_usd").default(0).notNull(),
  totalUsd: integer("total_usd").notNull(),
  totalInr: integer("total_inr").notNull(),
  exchangeRate: numeric("exchange_rate", { precision: 10, scale: 4 }).default("83.50").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  amountPaidUsd: integer("amount_paid_usd").default(0).notNull(),
  balanceDueUsd: integer("balance_due_usd").notNull(),
  status: invoiceStatusEnum("status").default("issued").notNull(),
  dueDate: timestamp("due_date", { withTimezone: true }).notNull(),
  issuedAt: timestamp("issued_at", { withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});

export const payments = pgTable("payments", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").references(() => invoices.id, { onDelete: "cascade" }).notNull(),
  patientId: uuid("patient_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  paymentTransactionRef: varchar("payment_transaction_ref", { length: 150 }).notNull().unique(),
  amountUsd: integer("amount_usd").notNull(),
  amountInr: integer("amount_inr").notNull(),
  currency: varchar("currency", { length: 10 }).default("USD").notNull(),
  paymentMethod: paymentMethodEnum("payment_method").notNull(),
  gatewayProvider: varchar("gateway_provider", { length: 50 }).default("stripe").notNull(),
  gatewayResponse: jsonb("gateway_response").default({}).notNull(),
  status: paymentStatusEnum("status").default("initiated").notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
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
