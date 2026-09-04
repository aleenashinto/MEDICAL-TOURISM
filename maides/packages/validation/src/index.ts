import { z } from "zod";

// ─── Roles ───────────────────────────────────────────────────────────────────

export const UserRoleSchema = z.enum([
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

// ─── Auth Schemas ─────────────────────────────────────────────────────────────

export const RegisterSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
  fullName: z.string().min(2, "Full name is required").max(100),
  phone: z.string().optional(),
  country: z.string().min(2).max(80).optional(),
  role: UserRoleSchema.default("patient"),
  preferredLanguage: z
    .enum(["English", "Arabic", "Malayalam", "Hindi", "French", "Dhivehi", "Urdu"])
    .default("English"),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export const ChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z
      .string()
      .min(8)
      .regex(/[A-Z]/)
      .regex(/[0-9]/),
    confirmPassword: z.string().min(1),
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ─── Enquiry Schemas ──────────────────────────────────────────────────────────

export const EnquiryCreateSchema = z.object({
  specialty: z.string().min(2, "Specialty is required").max(100),
  medicalSummary: z
    .string()
    .min(20, "Please provide at least 20 characters describing your condition")
    .max(5000),
  preferredDistrict: z.string().max(80).optional(),
  budget: z
    .enum([
      "under_3000_usd",
      "3000_8000_usd",
      "8000_20000_usd",
      "20000_50000_usd",
      "over_50000_usd",
      "flexible",
    ])
    .optional(),
  timeline: z
    .enum(["asap", "1_3_months", "3_6_months", "flexible"])
    .optional(),
  consentGiven: z.literal(true, {
    errorMap: () => ({
      message: "You must provide consent to submit an enquiry",
    }),
  }),
});

export const EnquiryQuerySchema = z.object({
  status: z
    .enum([
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
    ])
    .optional(),
  specialty: z.string().max(100).optional(),
  patientId: z.string().uuid().optional(),
  assignedCoordinatorId: z.string().uuid().optional(),
  assignedHospitalId: z.string().uuid().optional(),
  assignedDoctorId: z.string().uuid().optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const EnquiryStatusUpdateSchema = z.object({
  status: z.enum([
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
  ]),
  internalNotes: z.string().max(2000).optional(),
  assignedCoordinatorId: z.string().uuid().optional(),
  assignedHospitalId: z.string().uuid().optional(),
  assignedDoctorId: z.string().uuid().optional(),
});

export const EnquiryAssignSchema = z.object({
  assignedCoordinatorId: z.string().uuid().optional(),
  assignedHospitalId: z.string().uuid().optional(),
  assignedDoctorId: z.string().uuid().optional(),
  internalNotes: z.string().max(2000).optional(),
});

export const EnquiryOpinionRequestSchema = z.object({
  doctorId: z.string().uuid("Doctor ID is required"),
  hospitalId: z.string().uuid("Hospital ID is required"),
  clinicalNotes: z.string().min(10, "Clinical case notes required for specialist review"),
  urgency: z.enum(["routine", "urgent", "emergency"]).default("routine"),
});


// ─── Hospital Schemas ─────────────────────────────────────────────────────────

export const HospitalQuerySchema = z.object({
  region: z
    .enum(["south_kerala", "central_kerala", "north_kerala"])
    .optional(),
  type: z
    .enum([
      "multispecialty",
      "super_specialty",
      "government_medical_college",
      "ayurveda_wellness",
      "specialized_institute",
    ])
    .optional(),
  search: z.string().max(100).optional(),
  featured: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const HospitalCreateSchema = z.object({
  name: z.string().min(2, "Hospital name is required").max(255),
  slug: z.string().min(2).max(150),
  tagline: z.string().min(5).max(500),
  district: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  region: z.enum(["south_kerala", "central_kerala", "north_kerala"]),
  type: z.enum([
    "multispecialty",
    "super_specialty",
    "government_medical_college",
    "ayurveda_wellness",
    "specialized_institute",
  ]).default("multispecialty"),
  accreditations: z.array(z.string()).default([]),
  specialties: z.array(z.string()).default([]),
  bedsCount: z.number().int().min(0).default(0),
  internationalPatientsAnnual: z.number().int().min(0).default(0),
  rating: z.string().default("4.9"),
  imageUrl: z.string().url().optional(),
  description: z.string().min(20),
  nearestAirport: z.string().default("COK"),
  airportDistanceKm: z.number().int().min(0).default(0),
  vipRoomsAvailable: z.boolean().default(false),
  ayurvedaWingAvailable: z.boolean().default(false),
  featured: z.boolean().default(false),
});

export const HospitalUpdateSchema = HospitalCreateSchema.partial();

// ─── Doctor Schemas ───────────────────────────────────────────────────────────

export const DoctorQuerySchema = z.object({
  specialty: z.string().max(100).optional(),
  hospitalId: z.string().uuid().optional(),
  district: z.string().max(80).optional(),
  videoConsult: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  search: z.string().max(100).optional(),
  featured: z
    .string()
    .transform((v) => v === "true")
    .optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(20),
});

export const DoctorCreateSchema = z.object({
  hospitalId: z.string().uuid("Hospital ID is required"),
  name: z.string().min(2).max(255),
  slug: z.string().min(2).max(150),
  title: z.string().min(2),
  specialty: z.string().min(2).max(100),
  subSpecialty: z.string().min(2),
  qualifications: z.string().min(2),
  experienceYears: z.number().int().min(0).default(0),
  languages: z.array(z.string()).default(["English", "Malayalam"]),
  consultationFeeUsd: z.number().int().min(0).default(20),
  consultationFeeInr: z.number().int().min(0).default(1500),
  avatarUrl: z.string().url().optional(),
  bio: z.string().min(20),
  areasOfExpertise: z.array(z.string()).default([]),
  publicationsCount: z.number().int().min(0).default(0),
  videoConsultationAvailable: z.boolean().default(true),
  featured: z.boolean().default(false),
});

export const DoctorUpdateSchema = DoctorCreateSchema.partial();

export const DoctorOpinionResponseSchema = z.object({
  clinicalAssessment: z.string().min(20, "Detailed clinical evaluation is required"),
  treatmentRecommendation: z.string().min(10, "Recommended procedure/treatment protocol is required"),
  estimatedStayDays: z.number().int().min(1).default(7),
  estimatedRecoveryDays: z.number().int().min(0).default(14),
  estimatedCostRangeUsd: z.object({
    min: z.number().int().min(100),
    max: z.number().int().min(100),
  }),
  fitToFlyNotes: z.string().optional(),
});


// ─── Document Schemas ─────────────────────────────────────────────────────────

export const DocumentUploadSchema = z.object({
  enquiryId: z.string().uuid("Invalid enquiry ID"),
  documentType: z.enum([
    "diagnosis_report",
    "lab_results",
    "imaging",
    "prescription",
    "discharge_summary",
    "referral_letter",
    "insurance_document",
    "passport_visa",
    "other",
  ]),
});

// ─── Pagination Schema ────────────────────────────────────────────────────────

export const PaginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().max(50).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

// ─── CRM Lead Schemas ─────────────────────────────────────────────────────────

export const LeadStatusEnumSchema = z.enum([
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

export const LeadQuerySchema = z.object({
  status: LeadStatusEnumSchema.optional(),
  specialty: z.string().max(100).optional(),
  country: z.string().max(100).optional(),
  assignedAgentId: z.string().uuid().optional(),
  search: z.string().max(100).optional(),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const LeadStatusUpdateSchema = z.object({
  status: LeadStatusEnumSchema,
  notes: z.string().max(2000).optional(),
});

export const LeadAssignSchema = z.object({
  assignedAgentId: z.string().uuid("Valid agent ID is required"),
  notes: z.string().max(2000).optional(),
});

export const LeadNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty").max(2000),
});

export const LeadConvertSchema = z.object({
  assignedCoordinatorId: z.string().uuid().optional(),
  assignedHospitalId: z.string().uuid().optional(),
  assignedDoctorId: z.string().uuid().optional(),
  notes: z.string().max(2000).optional(),
});

// ─── Quotation & Cost Estimator Schemas ───────────────────────────────────────

export const QuotationCreateSchema = z.object({
  enquiryId: z.string().uuid("Enquiry ID is required"),
  patientId: z.string().uuid("Patient ID is required"),
  hospitalId: z.string().uuid("Hospital ID is required"),
  doctorId: z.string().uuid().optional(),
  title: z.string().min(3).max(255),
  tier: z.enum(["Budget Value", "Standard Care", "Platinum VIP", "Ayurvedic Rejuvenation"]).default("Standard Care"),
  treatmentName: z.string().min(2).max(255),
  baseProcedureCostUsd: z.number().int().min(0),
  hospitalStayDays: z.number().int().min(1).default(5),
  stayCostUsd: z.number().int().min(0).default(0),
  investigationsCostUsd: z.number().int().min(0).default(0),
  medicationsCostUsd: z.number().int().min(0).default(0),
  logisticsCostUsd: z.number().int().min(0).default(0),
  inclusions: z.array(z.string()).default([]),
  exclusions: z.array(z.string()).default([]),
  termsAndConditions: z.string().optional(),
  validityDays: z.number().int().min(1).max(180).default(30),
});

export const QuotationUpdateSchema = z.object({
  status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).optional(),
  termsAndConditions: z.string().optional(),
});

export const CostEstimateCalculatorSchema = z.object({
  treatmentSlug: z.string().min(2),
  tier: z.enum(["Budget Value", "Standard Care", "Platinum VIP", "Ayurvedic Rejuvenation"]).default("Standard Care"),
  stayDays: z.number().int().min(1).optional(),
  needAirportChauffeur: z.boolean().default(true),
  needAttendantAccommodation: z.boolean().default(true),
});

// ─── Travel, Accommodation & Logistics Schemas ─────────────────────────────

export const TravelBookingCreateSchema = z.object({
  enquiryId: z.string().uuid("Enquiry ID is required"),
  patientId: z.string().uuid("Patient ID is required"),
  bookingType: z.enum([
    "flight",
    "airport_transfer",
    "hotel",
    "ayurvedic_resort",
    "local_transport",
    "sim_and_forex",
  ]),
  providerName: z.string().min(2).max(255),
  referenceNumber: z.string().max(150).optional(),
  details: z.record(z.any()).default({}),
  pickupLocation: z.string().max(255).optional(),
  dropoffLocation: z.string().max(255).optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  costUsd: z.number().int().min(0).default(0),
  costInr: z.number().int().min(0).default(0),
  notes: z.string().max(2000).optional(),
});

export const TravelBookingUpdateSchema = z.object({
  status: z.enum(["requested", "confirmed", "in_transit", "completed", "cancelled"]).optional(),
  referenceNumber: z.string().max(150).optional(),
  notes: z.string().max(2000).optional(),
  details: z.record(z.any()).optional(),
});

export const VisaInvitationCreateSchema = z.object({
  enquiryId: z.string().uuid("Enquiry ID is required"),
  patientId: z.string().uuid("Patient ID is required"),
  hospitalId: z.string().uuid("Hospital ID is required"),
  doctorId: z.string().uuid().optional(),
  patientPassportNumber: z.string().min(4).max(50),
  patientNationality: z.string().min(2).max(100),
  attendantName: z.string().max(255).optional(),
  attendantPassportNumber: z.string().max(50).optional(),
  diagnosis: z.string().min(5).max(1000),
  recommendedTreatment: z.string().min(5).max(1000),
  expectedArrivalDate: z.string().datetime(),
  stayDurationDays: z.number().int().min(1).max(180).default(14),
  embassyCity: z.string().max(100).optional(),
});

// ─── Telemedicine & Video Consultations ────────────────────────────────────

export const TelemedicineScheduleSchema = z.object({
  enquiryId: z.string().uuid("Enquiry ID is required"),
  patientId: z.string().uuid("Patient ID is required"),
  doctorId: z.string().uuid("Doctor ID is required"),
  hospitalId: z.string().uuid("Hospital ID is required"),
  scheduledAt: z.string().datetime(),
  durationMinutes: z.number().int().min(15).max(120).default(30),
  patientSymptoms: z.string().min(5).max(2000),
  feeUsd: z.number().int().min(0).default(25),
  feeInr: z.number().int().min(0).default(2000),
});

export const TelemedicineCompleteSchema = z.object({
  doctorPrescription: z.string().min(5).max(3000),
  clinicalRecommendations: z.string().min(5).max(3000),
  recordingUrl: z.string().url().optional(),
});

// ─── Billing, Invoices & Payments ──────────────────────────────────────────

export const InvoiceItemSchema = z.object({
  description: z.string().min(2).max(255),
  quantity: z.number().int().min(1).default(1),
  unitPriceUsd: z.number().int().min(0),
  totalUsd: z.number().int().min(0),
});

export const InvoiceCreateSchema = z.object({
  enquiryId: z.string().uuid("Enquiry ID is required"),
  patientId: z.string().uuid("Patient ID is required"),
  hospitalId: z.string().uuid("Hospital ID is required"),
  quotationId: z.string().uuid().optional(),
  title: z.string().min(3).max(255),
  items: z.array(InvoiceItemSchema).min(1, "At least one billing line item is required"),
  subtotalUsd: z.number().int().min(0),
  taxUsd: z.number().int().min(0).default(0),
  totalUsd: z.number().int().min(0),
  totalInr: z.number().int().min(0),
  exchangeRate: z.number().positive().default(83.5),
  currency: z.enum(["USD", "INR", "AED", "EUR", "GBP"]).default("USD"),
  dueDate: z.string().datetime(),
});

export const PaymentInitiateSchema = z.object({
  invoiceId: z.string().uuid("Invoice ID is required"),
  amountUsd: z.number().int().positive("Payment amount must be greater than zero"),
  paymentMethod: z.enum([
    "credit_card",
    "international_wire",
    "razorpay",
    "stripe",
    "upi",
    "cash_at_hospital",
  ]).default("stripe"),
});

export const PaymentWebhookSchema = z.object({
  paymentTransactionRef: z.string().min(3),
  invoiceId: z.string().uuid(),
  amountUsd: z.number().int().positive(),
  gatewayProvider: z.string().default("stripe"),
  gatewayStatus: z.enum(["succeeded", "paid", "failed"]),
  metadata: z.record(z.any()).default({}),
});

// ─── Post-Treatment, Discharge & Follow-Up ─────────────────────────────────

export const MedicationPrescriptionSchema = z.object({
  name: z.string().min(2).max(150),
  dosage: z.string().min(1).max(100),
  frequency: z.string().min(1).max(100),
  duration: z.string().min(1).max(100),
});

export const DischargeSummaryCreateSchema = z.object({
  enquiryId: z.string().uuid("Enquiry ID is required"),
  patientId: z.string().uuid("Patient ID is required"),
  hospitalId: z.string().uuid("Hospital ID is required"),
  doctorId: z.string().uuid("Doctor ID is required"),
  admissionDate: z.string().datetime(),
  dischargeDate: z.string().datetime(),
  finalDiagnosis: z.string().min(5).max(1000),
  procedurePerformed: z.string().min(5).max(1000),
  hospitalCourse: z.string().min(10).max(3000),
  medicationsOnDischarge: z.array(MedicationPrescriptionSchema).default([]),
  dietaryInstructions: z.string().max(1000).optional(),
  activityRestrictions: z.string().max(1000).optional(),
  emergencyWarningSigns: z.array(z.string()).default([]),
  fitToFlyDate: z.string().datetime().optional(),
  fitToFlyCertified: z.boolean().default(true),
  nextFollowupDate: z.string().datetime().optional(),
});

export const PatientFeedbackCreateSchema = z.object({
  enquiryId: z.string().uuid("Enquiry ID is required"),
  patientId: z.string().uuid("Patient ID is required"),
  hospitalId: z.string().uuid("Hospital ID is required"),
  doctorId: z.string().uuid().optional(),
  overallRating: z.number().int().min(1).max(5),
  hospitalRating: z.number().int().min(1).max(5),
  doctorRating: z.number().int().min(1).max(5),
  coordinatorRating: z.number().int().min(1).max(5),
  npsScore: z.number().int().min(0).max(10),
  reviewComments: z.string().max(2000).optional(),
  testimonialPermissionGranted: z.boolean().default(false),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof RegisterSchema>;
export type LoginInput = z.infer<typeof LoginSchema>;
export type ChangePasswordInput = z.infer<typeof ChangePasswordSchema>;
export type EnquiryCreateInput = z.infer<typeof EnquiryCreateSchema>;
export type EnquiryStatusUpdateInput = z.infer<typeof EnquiryStatusUpdateSchema>;
export type HospitalQueryInput = z.infer<typeof HospitalQuerySchema>;
export type DoctorQueryInput = z.infer<typeof DoctorQuerySchema>;
export type DocumentUploadInput = z.infer<typeof DocumentUploadSchema>;
export type PaginationInput = z.infer<typeof PaginationSchema>;
export type LeadQueryInput = z.infer<typeof LeadQuerySchema>;
export type LeadStatusUpdateInput = z.infer<typeof LeadStatusUpdateSchema>;
export type LeadAssignInput = z.infer<typeof LeadAssignSchema>;
export type LeadNoteInput = z.infer<typeof LeadNoteSchema>;
export type LeadConvertInput = z.infer<typeof LeadConvertSchema>;
export type QuotationCreateInput = z.infer<typeof QuotationCreateSchema>;
export type QuotationUpdateInput = z.infer<typeof QuotationUpdateSchema>;
export type CostEstimateCalculatorInput = z.infer<typeof CostEstimateCalculatorSchema>;
export type TravelBookingCreateInput = z.infer<typeof TravelBookingCreateSchema>;
export type TravelBookingUpdateInput = z.infer<typeof TravelBookingUpdateSchema>;
export type VisaInvitationCreateInput = z.infer<typeof VisaInvitationCreateSchema>;
export type TelemedicineScheduleInput = z.infer<typeof TelemedicineScheduleSchema>;
export type TelemedicineCompleteInput = z.infer<typeof TelemedicineCompleteSchema>;
export type InvoiceCreateInput = z.infer<typeof InvoiceCreateSchema>;
export type PaymentInitiateInput = z.infer<typeof PaymentInitiateSchema>;
export type PaymentWebhookInput = z.infer<typeof PaymentWebhookSchema>;
export type DischargeSummaryCreateInput = z.infer<typeof DischargeSummaryCreateSchema>;
export type PatientFeedbackCreateInput = z.infer<typeof PatientFeedbackCreateSchema>;





