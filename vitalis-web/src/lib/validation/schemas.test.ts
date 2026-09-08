import { describe, it, expect } from 'vitest';
import { doctorSchema, hospitalSchema, enquirySchema, validateBody } from './schemas';

describe('Validation Schemas (Zod)', () => {
  it('should validate a valid Doctor payload', () => {
    const validDoctor = {
      name: 'Dr. Vijay Anand',
      specialty: 'Orthopedics',
      hospitalId: 'hosp-101',
      experience: 15,
      rating: 4.9,
    };
    const result = validateBody(doctorSchema, validDoctor);
    expect(result.success).toBe(true);
  });

  it('should reject a Doctor payload missing required fields', () => {
    const invalidDoctor = {
      experience: 10,
    };
    const result = validateBody(doctorSchema, invalidDoctor);
    expect(result.success).toBe(false);
    expect(result.errors).toBeDefined();
  });

  it('should validate a valid Hospital payload', () => {
    const validHospital = {
      name: 'Aster Medcity',
      location: 'Kochi, Kerala',
      city: 'Kochi',
      country: 'India',
      rating: 4.8,
    };
    const result = validateBody(hospitalSchema, validHospital);
    expect(result.success).toBe(true);
  });

  it('should validate a valid Enquiry payload', () => {
    const validEnquiry = {
      name: 'Sarah Jenkins',
      email: 'sarah.j@example.com',
      phone: '+44 7911 123456',
      treatment: 'Total Knee Replacement',
    };
    const result = validateBody(enquirySchema, validEnquiry);
    expect(result.success).toBe(true);
  });
});
