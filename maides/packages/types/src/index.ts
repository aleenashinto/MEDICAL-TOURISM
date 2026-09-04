// ─── User & Auth ──────────────────────────────────────────────────────────────

export type UserRole =
  | "super_admin"
  | "admin"
  | "medical_coordinator"
  | "travel_coordinator"
  | "support_agent"
  | "sales_crm_agent"
  | "hospital_manager"
  | "doctor"
  | "patient";

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  country: string | null;
  phone: string | null;
  preferredLanguage: string;
  emailVerified: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthTokenPayload {
  sub: string;         // user id
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}

// ─── Specialty ────────────────────────────────────────────────────────────────

export interface Specialty {
  id: string;
  slug: string;
  name: string;
  description: string;
  iconName?: string | null;
  imageUrl?: string | null;
  active: boolean;
  createdAt: Date;
}

// ─── Treatment ────────────────────────────────────────────────────────────────

export interface TreatmentCostRange {
  minUsd: number;
  maxUsd: number;
  averageInr: number;
  usComparisonCostUsd?: number;
}

export interface Treatment {
  id: string;
  slug: string;
  specialtyId: string;
  name: string;
  tagline: string;
  description: string;
  whoRequires: string[];
  procedureOverview: string;
  typicalStayDays: number;
  recoveryDays: number;
  costRange: TreatmentCostRange;
  topKeralaDistricts: string[];
  faqs: { question: string; answer: string }[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
}

// ─── Hospital ─────────────────────────────────────────────────────────────────

export type HospitalType =
  | "multispecialty"
  | "super_specialty"
  | "government_medical_college"
  | "ayurveda_wellness"
  | "specialized_institute";

export type KeralaRegion = "south_kerala" | "central_kerala" | "north_kerala";

export type KeralaAirport = "COK" | "TRV" | "CCJ" | "CNN";

export interface Hospital {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  district: string;
  city: string;
  region: KeralaRegion;
  type: HospitalType;
  accreditations: string[];
  specialties: string[];
  bedsCount: number;
  internationalPatientsAnnual: number;
  rating: number;
  reviewCount: number;
  imageUrl: string | null;
  description: string;
  nearestAirport: KeralaAirport;
  airportDistanceKm: number;
  vipRoomsAvailable: boolean;
  ayurvedaWingAvailable: boolean;
  featured: boolean;
  active: boolean;
  createdAt: Date;
}

// ─── Doctor ───────────────────────────────────────────────────────────────────

export interface Doctor {
  id: string;
  slug: string;
  hospitalId: string;
  name: string;
  title: string;
  specialty: string;
  subSpecialty: string;
  qualifications: string;
  experienceYears: number;
  languages: string[];
  rating: number;
  reviewCount: number;
  consultationFeeUsd: number;
  consultationFeeInr: number;
  avatarUrl: string | null;
  bio: string;
  areasOfExpertise: string[];
  publicationsCount: number;
  videoConsultationAvailable: boolean;
  featured: boolean;
  active: boolean;
  createdAt: Date;
}

// ─── Enquiry & Cases ──────────────────────────────────────────────────────────

export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "medical_review"
  | "hospital_matching"
  | "quotation_sent"
  | "appointment_requested"
  | "converted"
  | "lost"
  | "closed";

export type CaseStatus =
  | "new"
  | "medical_review"
  | "document_review"
  | "doctor_assigned"
  | "opinion_requested"
  | "opinion_received"
  | "hospital_selected"
  | "treatment_planned"
  | "appointment_scheduled"
  | "treatment_in_progress"
  | "treatment_completed"
  | "follow_up"
  | "closed"
  | "cancelled";

export type EnquiryBudget =
  | "under_3000_usd"
  | "3000_8000_usd"
  | "8000_20000_usd"
  | "20000_50000_usd"
  | "over_50000_usd"
  | "flexible";

export type EnquiryTimeline =
  | "asap"
  | "1_3_months"
  | "3_6_months"
  | "flexible";

export interface Enquiry {
  id: string;
  patientId: string;
  status: CaseStatus;
  specialty: string;
  medicalSummary: string;
  preferredDistrict: string | null;
  budget: EnquiryBudget | null;
  timeline: EnquiryTimeline | null;
  assignedCoordinatorId: string | null;
  assignedHospitalId: string | null;
  assignedDoctorId: string | null;
  internalNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Document ─────────────────────────────────────────────────────────────────

export type DocumentType =
  | "diagnosis_report"
  | "lab_results"
  | "imaging"
  | "prescription"
  | "discharge_summary"
  | "referral_letter"
  | "insurance_document"
  | "passport_visa"
  | "other";

export interface EnquiryDocument {
  id: string;
  enquiryId: string;
  patientId: string;
  documentType: DocumentType;
  originalFileName: string;
  storagePath: string;
  fileSizeBytes: number;
  mimeType: string;
  uploadedAt: Date;
}

// ─── Audit Log ────────────────────────────────────────────────────────────────

export interface AuditLog {
  id: string;
  userId: string | null;
  userEmail?: string | null;
  userRole?: UserRole | null;
  action: string;
  entityType: string;
  entityId: string;
  details?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date;
}

// ─── API Envelope ─────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}
