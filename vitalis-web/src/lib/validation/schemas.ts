import { z } from "zod";

export const doctorSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  specialty: z.string().optional(),
  hospital: z.string().optional(), // For backward compatibility / UI
  hospitalId: z.string().optional(),
  experienceYears: z.coerce.number().min(0).max(60).optional(),
  education: z.string().optional(),
  certifications: z.string().optional(),
  consultationFee: z.string().optional(),
  registrationNumber: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("Invalid email format").optional().or(z.literal("")),
  gender: z.string().optional(),
  avatar: z.string().optional(),
  casesHandled: z.coerce.number().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  languages: z.array(z.string()).optional(),
  department: z.string().optional(),
  displayOrder: z.coerce.number().optional(),
  status: z.enum(["ACTIVE", "ON_LEAVE", "INACTIVE"]).optional(),
  published: z.enum(["PUBLISHED", "DRAFT"]).optional(),
  bio: z.string().optional(),
  fullBiography: z.string().optional(),
  availableDays: z.array(z.string()).optional(),
  district: z.string().optional(),
  city: z.string().optional(),
}).refine(data => data.hospital || data.hospitalId, {
  message: "Either hospital or hospitalId is required",
  path: ["hospitalId"]
});

export const hospitalSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().max(1000, "Description too long").optional(),
  accreditation: z.string().max(500, "Accreditation string too long").optional(),
  image: z.string().optional(),
  rating: z.coerce.number().min(0).max(5).optional(),
  established: z.coerce.number().optional(),
  beds: z.coerce.number().optional(),
  specialties: z.array(z.string()).optional(),
  contactEmail: z.string().email("Invalid email").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const specialtySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Specialty name is required"),
  description: z.string().optional(),
  icon: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  displayOrder: z.coerce.number().optional()
});

export const treatmentSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Treatment name is required"),
  hospitalId: z.string().min(1, "Hospital ID is required"),
  specialtyId: z.string().optional(),
  description: z.string().optional(),
  estimatedCost: z.string().optional(),
  duration: z.string().optional(),
  successRate: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});

export const packageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Package name is required"),
  treatmentId: z.string().min(1, "Treatment ID is required"),
  hospitalId: z.string().min(1, "Hospital ID is required"),
  costRange: z.string().min(1, "Cost range is required"),
  description: z.string().optional(),
  inclusions: z.array(z.string()).optional(),
  exclusions: z.array(z.string()).optional(),
  durationDays: z.coerce.number().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
  isPopular: z.boolean().optional()
});

export const enquirySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Patient name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  country: z.string().optional(),
  treatment: z.string().min(1, "Treatment/Specialty is required"),
  specialty: z.string().optional(),
  budget: z.string().optional(),
  timeline: z.string().optional(),
  urgency: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  status: z.enum(["NEW", "TRIAGED", "QUOTED", "CONVERTED"]).optional(),
  assignedHospital: z.string().optional(),
  assignedHospitalId: z.string().optional(),
  summary: z.string().optional(),
  notes: z.string().optional()
});

export function validateBody<T>(schema: z.ZodType<T>, body: any) {
  const result = schema.safeParse(body);
  if (result.success) {
    return { success: true, data: result.data as T };
  } else {
    return { 
      success: false, 
      errors: result.error.issues.map((err: any) => ({ field: err.path.join('.'), message: err.message }))
    };
  }
}
