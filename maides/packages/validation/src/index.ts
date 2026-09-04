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
