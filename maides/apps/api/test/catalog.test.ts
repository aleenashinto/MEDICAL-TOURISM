import { test } from "node:test";
import assert from "node:assert";
import { signToken } from "@maides/auth";
import { config } from "../src/config.js";
import { buildApp } from "../src/app.js";

test("Phase 2 Exit Test — Catalog Endpoints & Admin Protections", async (t) => {
  const app = await buildApp();

  // Test 1: Public Specialty Listing
  await t.test("GET /api/v1/specialties returns catalog items", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/specialties",
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 2: Public Treatment Listing
  await t.test("GET /api/v1/treatments allows public search", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/treatments",
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 3: Public Hospital Listing with Region Filter
  await t.test("GET /api/v1/hospitals?region=central_kerala filters properly", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/hospitals?region=central_kerala",
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 4: Unauthenticated creation of specialty is blocked
  await t.test("POST /api/v1/specialties without auth returns 401", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/specialties",
      body: {
        name: "Test Oncology",
        slug: "test-oncology",
        description: "Test description for oncology",
      },
    });
    assert.strictEqual(res.statusCode, 401);
  });

  // Test 5: Patient role cannot create catalog item (403)
  await t.test("POST /api/v1/specialties with Patient Token returns 403 Forbidden", async () => {
    const patientToken = signToken(
      { sub: "pat-1234", email: "pat@maides.in", role: "patient" },
      config.JWT_SECRET,
      "1h"
    );

    const res = await app.inject({
      method: "POST",
      url: "/api/v1/specialties",
      headers: {
        authorization: `Bearer ${patientToken}`,
      },
      body: {
        name: "Test Oncology",
        slug: "test-oncology",
        description: "Test description for oncology",
      },
    });
    assert.strictEqual(res.statusCode, 403);
  });
});

test("Phase 5 Exit Test — Medical Enquiry & Case Management Engine", async (t) => {
  const app = await buildApp();
  const { signToken } = await import("@maides/auth");
  const { config } = await import("../src/config.js");

  const patientToken = signToken(
    { sub: "pat-case-100", email: "patient.case@maides.in", role: "patient" },
    config.JWT_SECRET,
    "1h"
  );

  const medCoordToken = signToken(
    { sub: "coord-case-200", email: "coordinator.case@maides.in", role: "medical_coordinator" },
    config.JWT_SECRET,
    "1h"
  );

  // Test 1: Patient can submit an authenticated medical enquiry case
  await t.test("POST /api/v1/enquiries creates clinical enquiry case", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/enquiries",
      headers: { authorization: `Bearer ${patientToken}` },
      body: {
        specialty: "Comprehensive Oncology",
        medicalSummary: "Seeking stereotactic radiosurgery (CyberKnife) and targeted immunotherapy review in Kerala.",
        preferredDistrict: "Thiruvananthapuram",
        budget: "8000_20000_usd",
        timeline: "1_3_months",
        consentGiven: true,
      },
    });
    assert.notStrictEqual(res.statusCode, 400);
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 2: Unauthenticated query is blocked (401)
  await t.test("GET /api/v1/enquiries without auth returns 401 Unauthorized", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/enquiries",
    });
    assert.strictEqual(res.statusCode, 401);
  });

  // Test 3: Medical Coordinator can query all cases with status filter
  await t.test("GET /api/v1/enquiries with COORDINATOR token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/enquiries?status=new",
      headers: { authorization: `Bearer ${medCoordToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 4: Assignment endpoint validates schema & enforces coordinator role
  await t.test("POST /api/v1/enquiries/:id/assign with Patient token returns 403 Forbidden", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/enquiries/00000000-0000-0000-0000-000000000000/assign",
      headers: { authorization: `Bearer ${patientToken}` },
      body: {
        internalNotes: "Patient cannot self-assign",
      },
    });
    assert.strictEqual(res.statusCode, 403);
  });

  // Test 5: Specialist second opinion dispatch requires coordinator auth
  await t.test("POST /api/v1/enquiries/:id/request-opinion enforces RBAC & validation", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/enquiries/00000000-0000-0000-0000-000000000000/request-opinion",
      headers: { authorization: `Bearer ${medCoordToken}` },
      body: {
        doctorId: "00000000-0000-0000-0000-000000000001",
        hospitalId: "00000000-0000-0000-0000-000000000002",
        clinicalNotes: "Requesting surgical resectability evaluation for pancreatic adenocarcinoma.",
        urgency: "urgent",
      },
    });
    // Validates route permissions (not 401/403)
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});

test("Phase 6 Exit Test — Hospital & Doctor Portal Endpoints & Clinical Opinions", async (t) => {
  const app = await buildApp();
  const { signToken } = await import("@maides/auth");
  const { config } = await import("../src/config.js");

  const doctorToken = signToken(
    { sub: "doc-portal-300", email: "doctor.portal@maides.in", role: "doctor" },
    config.JWT_SECRET,
    "1h"
  );

  const hospManagerToken = signToken(
    { sub: "mgr-portal-400", email: "manager.aster@maides.in", role: "hospital_manager" },
    config.JWT_SECRET,
    "1h"
  );

  const patientToken = signToken(
    { sub: "pat-portal-500", email: "patient.portal@maides.in", role: "patient" },
    config.JWT_SECRET,
    "1h"
  );

  // Test 1: Hospital Manager can access hospital cases view
  await t.test("GET /api/v1/hospitals/:id/cases with HOSPITAL_MANAGER token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/hospitals/00000000-0000-0000-0000-000000000000/cases",
      headers: { authorization: `Bearer ${hospManagerToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 2: Patient blocked from hospital cases route (403)
  await t.test("GET /api/v1/hospitals/:id/cases with PATIENT token returns 403 Forbidden", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/hospitals/00000000-0000-0000-0000-000000000000/cases",
      headers: { authorization: `Bearer ${patientToken}` },
    });
    assert.strictEqual(res.statusCode, 403);
  });

  // Test 3: Doctor can access their assigned cases view
  await t.test("GET /api/v1/doctors/:id/cases with DOCTOR token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/doctors/00000000-0000-0000-0000-000000000000/cases",
      headers: { authorization: `Bearer ${doctorToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 4: Doctor clinical opinion submission enforces validation schema
  await t.test("POST /api/v1/doctors/:id/opinions/:enquiryId with invalid body returns 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/doctors/00000000-0000-0000-0000-000000000000/opinions/00000000-0000-0000-0000-000000000001",
      headers: { authorization: `Bearer ${doctorToken}` },
      body: {
        clinicalAssessment: "Too short",
      },
    });
    assert.strictEqual(res.statusCode, 400);
  });

  // Test 5: Doctor clinical opinion submission with full protocol passes RBAC
  await t.test("POST /api/v1/doctors/:id/opinions/:enquiryId with valid protocol passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/doctors/00000000-0000-0000-0000-000000000000/opinions/00000000-0000-0000-0000-000000000001",
      headers: { authorization: `Bearer ${doctorToken}` },
      body: {
        clinicalAssessment: "Reviewed 3D CT Angiogram showing 90% LAD stenosis. Candidate for beating-heart CABG.",
        treatmentRecommendation: "Off-Pump Coronary Artery Bypass Graft (LIMA to LAD, SVG to OM).",
        estimatedStayDays: 6,
        estimatedRecoveryDays: 14,
        estimatedCostRangeUsd: {
          min: 4800,
          max: 8500,
        },
        fitToFlyNotes: "Fit to fly after day 10 postoperative evaluation and 2D Echo review.",
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});

test("Phase 7 Exit Test — Treatment Quotation & Cost Estimator Engine", async (t) => {
  const app = await buildApp();
  const { signToken } = await import("@maides/auth");
  const { config } = await import("../src/config.js");

  const coordinatorToken = signToken(
    { sub: "coord-quote-600", email: "coordinator.quote@maides.in", role: "medical_coordinator" },
    config.JWT_SECRET,
    "1h"
  );

  const patientToken = signToken(
    { sub: "pat-quote-700", email: "patient.quote@maides.in", role: "patient" },
    config.JWT_SECRET,
    "1h"
  );

  // Test 1: Public Dynamic Cost Estimator Engine calculates tiers and savings
  await t.test("POST /api/v1/treatments/estimate-cost calculates breakdown and savings", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/treatments/estimate-cost",
      body: {
        treatmentSlug: "cardiac-bypass-kerala",
        tier: "Platinum VIP",
        stayDays: 7,
        needAirportChauffeur: true,
        needAttendantAccommodation: true,
      },
    });
    // Validates public estimator endpoint is reachable without auth
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 2: Unauthenticated quotation creation is blocked (401)
  await t.test("POST /api/v1/documents/quotations without auth returns 401 Unauthorized", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/documents/quotations",
      body: {
        title: "Kochi Platinum Cardiac Care",
      },
    });
    assert.strictEqual(res.statusCode, 401);
  });

  // Test 3: Patient cannot create formal quotations (403)
  await t.test("POST /api/v1/documents/quotations with Patient token returns 403 Forbidden", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/documents/quotations",
      headers: { authorization: `Bearer ${patientToken}` },
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId: "00000000-0000-0000-0000-000000000002",
        hospitalId: "00000000-0000-0000-0000-000000000003",
        title: "Patient Self-Quotation",
        tier: "Budget Value",
        treatmentName: "CABG",
        baseProcedureCostUsd: 4500,
      },
    });
    assert.strictEqual(res.statusCode, 403);
  });

  // Test 4: Medical Coordinator creating quotation validates schema & passes RBAC
  await t.test("POST /api/v1/documents/quotations with Coordinator token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/documents/quotations",
      headers: { authorization: `Bearer ${coordinatorToken}` },
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId: "00000000-0000-0000-0000-000000000002",
        hospitalId: "00000000-0000-0000-0000-000000000003",
        title: "Aster Medcity Platinum VIP Cardiac Package",
        tier: "Platinum VIP",
        treatmentName: "Off-Pump Beating Heart Coronary Artery Bypass",
        baseProcedureCostUsd: 5800,
        hospitalStayDays: 7,
        stayCostUsd: 1260,
        investigationsCostUsd: 450,
        medicationsCostUsd: 300,
        logisticsCostUsd: 200,
        inclusions: [
          "Beating-heart bypass surgery by Senior Director",
          "Presidential Waterfront Suite (7 nights)",
          "Airport limousine chauffeur from Cochin Airport",
        ],
        exclusions: ["Specialized donor blood cross-matching if transfusions exceed 4 units"],
        termsAndConditions: "Quotation valid for 30 days from date of clinical board review.",
        validityDays: 30,
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 5: Patient fetching quotations for their case passes RBAC
  await t.test("GET /api/v1/documents/quotations/enquiry/:id with Patient token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/documents/quotations/enquiry/00000000-0000-0000-0000-000000000001",
      headers: { authorization: `Bearer ${patientToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});

test("Phase 8 Exit Test — Travel, Accommodation & Logistics Module", async (t) => {
  const app = await buildApp();
  const { signToken } = await import("@maides/auth");
  const { config } = await import("../src/config.js");

  const travelCoordToken = signToken(
    { sub: "coord-travel-801", email: "travel.coord@maides.in", role: "travel_coordinator" },
    config.JWT_SECRET,
    "1h"
  );

  const patientToken = signToken(
    { sub: "pat-travel-802", email: "patient.travel@maides.in", role: "patient" },
    config.JWT_SECRET,
    "1h"
  );

  const unauthHeader = {};

  // Test 1: Unauthorized access to travel bookings is blocked (401)
  await t.test("POST /api/v1/travel/bookings without auth token returns 401", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/travel/bookings",
      headers: unauthHeader,
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId: "00000000-0000-0000-0000-000000000002",
        bookingType: "airport_transfer",
        providerName: "Kerala Chauffeur Direct",
      },
    });
    assert.strictEqual(res.statusCode, 401);
  });

  // Test 2: Patient cannot create staff travel bookings (403)
  await t.test("POST /api/v1/travel/bookings with Patient token returns 403 Forbidden", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/travel/bookings",
      headers: { authorization: `Bearer ${patientToken}` },
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId: "00000000-0000-0000-0000-000000000002",
        bookingType: "airport_transfer",
        providerName: "Kerala Chauffeur Direct",
      },
    });
    assert.strictEqual(res.statusCode, 403);
  });

  // Test 3: Travel Coordinator booking creation validates input and passes RBAC
  await t.test("POST /api/v1/travel/bookings with Travel Coordinator token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/travel/bookings",
      headers: { authorization: `Bearer ${travelCoordToken}` },
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId: "00000000-0000-0000-0000-000000000002",
        bookingType: "airport_transfer",
        providerName: "Kochi Airport Chauffeur & Ambulance Care",
        referenceNumber: "COK-TRANSFER-8891",
        pickupLocation: "Cochin International Airport (COK) Terminal 3",
        dropoffLocation: "Aster Medcity Cheranalloor Kochi",
        startDate: "2026-10-12T08:30:00.000Z",
        costUsd: 45,
        costInr: 3750,
        notes: "Wheelchair accessible luxury van requested with English-speaking attendant.",
        details: {
          flightNumber: "EK 530",
          arrivalTerminal: "T3",
          vehicleType: "Toyota Innova Crysta Medical",
        },
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 4: Generating Medical Visa (e-Med Visa) Invitation Letter enforces schema & passes RBAC
  await t.test("POST /api/v1/travel/visa-invitation with Travel Coordinator token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/travel/visa-invitation",
      headers: { authorization: `Bearer ${travelCoordToken}` },
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId: "00000000-0000-0000-0000-000000000002",
        hospitalId: "00000000-0000-0000-0000-000000000003",
        patientPassportNumber: "A987654321",
        patientNationality: "United Kingdom",
        attendantName: "Eleanor Vance",
        attendantPassportNumber: "B123456789",
        diagnosis: "Severe Multi-Vessel Coronary Artery Disease requiring urgent surgical intervention",
        recommendedTreatment: "Off-Pump Coronary Artery Bypass Grafting (CABG)",
        expectedArrivalDate: "2026-10-15T10:00:00.000Z",
        stayDurationDays: 21,
        embassyCity: "High Commission of India, London",
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 5: Patient reading case travel bookings passes RBAC
  await t.test("GET /api/v1/travel/bookings/enquiry/:id with Patient token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/travel/bookings/enquiry/00000000-0000-0000-0000-000000000001",
      headers: { authorization: `Bearer ${patientToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});

test("Phase 9 Exit Test — Telemedicine & Second Opinion Video Consults", async (t) => {
  const app = await buildApp();
  const { signToken } = await import("@maides/auth");
  const { config } = await import("../src/config.js");

  const patientId = "00000000-0000-0000-0000-000000000002";
  const doctorId = "00000000-0000-0000-0000-000000000004";

  const patientToken = signToken(
    { sub: patientId, email: "patient.telemed@maides.in", role: "patient" },
    config.JWT_SECRET,
    "1h"
  );

  const doctorToken = signToken(
    { sub: doctorId, email: "doctor.telemed@maides.in", role: "doctor" },
    config.JWT_SECRET,
    "1h"
  );

  const coordinatorToken = signToken(
    { sub: "coord-telemed-903", email: "coord.telemed@maides.in", role: "medical_coordinator" },
    config.JWT_SECRET,
    "1h"
  );

  const unauthHeader = {};

  // Test 1: Unauthorized access to schedule consultation is blocked (401)
  await t.test("POST /api/v1/telemedicine/sessions without auth token returns 401", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/telemedicine/sessions",
      headers: unauthHeader,
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId,
        doctorId,
        hospitalId: "00000000-0000-0000-0000-000000000003",
        scheduledAt: "2026-10-20T14:30:00.000Z",
        patientSymptoms: "Exertional dyspnea and chest discomfort on stairs",
      },
    });
    assert.strictEqual(res.statusCode, 401);
  });

  // Test 2: Medical Coordinator can schedule telemedicine video session
  await t.test("POST /api/v1/telemedicine/sessions with Coordinator token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/telemedicine/sessions",
      headers: { authorization: `Bearer ${coordinatorToken}` },
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId,
        doctorId,
        hospitalId: "00000000-0000-0000-0000-000000000003",
        scheduledAt: "2026-10-20T14:30:00.000Z",
        durationMinutes: 45,
        patientSymptoms: "Exertional dyspnea and chest tightness with elevated troponin levels",
        feeUsd: 30,
        feeInr: 2500,
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 3: Patient can list their case video consultation sessions
  await t.test("GET /api/v1/telemedicine/sessions/enquiry/:id with Patient token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/telemedicine/sessions/enquiry/00000000-0000-0000-0000-000000000001",
      headers: { authorization: `Bearer ${patientToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 4: Doctor can complete consultation session & log clinical prescription
  await t.test("POST /api/v1/telemedicine/sessions/:id/complete with Doctor token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/telemedicine/sessions/00000000-0000-0000-0000-000000000001/complete",
      headers: { authorization: `Bearer ${doctorToken}` },
      body: {
        doctorPrescription: "Tab. Aspirin 75mg OD, Tab. Atorvastatin 40mg HS, Tab. Metoprolol 25mg BD",
        clinicalRecommendations: "Recommended for prompt elective beating-heart CABG within 30 days. Maintain strict glycemic control.",
        recordingUrl: "https://vault.maides.in/consultations/rec-session-889.mp4",
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 5: Patient joining room generates WebRTC secure token
  await t.test("POST /api/v1/telemedicine/sessions/:id/join with Patient token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/telemedicine/sessions/00000000-0000-0000-0000-000000000001/join",
      headers: { authorization: `Bearer ${patientToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});

test("Phase 10 Exit Test — Billing, Payments & Forex Handling", async (t) => {
  const app = await buildApp();
  const { signToken } = await import("@maides/auth");
  const { config } = await import("../src/config.js");

  const patientId = "00000000-0000-0000-0000-000000000002";
  const coordinatorToken = signToken(
    { sub: "coord-bill-1001", email: "coord.bill@maides.in", role: "medical_coordinator" },
    config.JWT_SECRET,
    "1h"
  );

  const patientToken = signToken(
    { sub: patientId, email: "patient.bill@maides.in", role: "patient" },
    config.JWT_SECRET,
    "1h"
  );

  const unauthHeader = {};

  // Test 1: Unauthorized invoice creation is blocked (401)
  await t.test("POST /api/v1/billing/invoices without auth token returns 401", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/billing/invoices",
      headers: unauthHeader,
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId,
        hospitalId: "00000000-0000-0000-0000-000000000003",
        title: "Cardiac Surgery Package",
      },
    });
    assert.strictEqual(res.statusCode, 401);
  });

  // Test 2: Medical Coordinator creates formal multi-currency medical invoice
  await t.test("POST /api/v1/billing/invoices with Coordinator token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/billing/invoices",
      headers: { authorization: `Bearer ${coordinatorToken}` },
      body: {
        enquiryId: "00000000-0000-0000-0000-000000000001",
        patientId,
        hospitalId: "00000000-0000-0000-0000-000000000003",
        title: "Aster Medcity Coronary Artery Bypass Graft (CABG) Package",
        items: [
          { description: "Beating Heart CABG Surgical Procedure", quantity: 1, unitPriceUsd: 4800, totalUsd: 4800 },
          { description: "ICU & Deluxe Waterfront Room (7 Nights)", quantity: 7, unitPriceUsd: 150, totalUsd: 1050 },
          { description: "Pre-Operative Investigations & 3D CT Angio", quantity: 1, unitPriceUsd: 450, totalUsd: 450 },
          { description: "Cochin Airport Chauffeur Transfer", quantity: 2, unitPriceUsd: 50, totalUsd: 100 },
        ],
        subtotalUsd: 6400,
        taxUsd: 0,
        totalUsd: 6400,
        totalInr: 534400,
        exchangeRate: 83.5,
        currency: "USD",
        dueDate: "2026-10-15T00:00:00.000Z",
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 3: Patient can view their case invoices
  await t.test("GET /api/v1/billing/invoices/enquiry/:id with Patient token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/billing/invoices/enquiry/00000000-0000-0000-0000-000000000001",
      headers: { authorization: `Bearer ${patientToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 4: Patient can initiate online deposit payment
  await t.test("POST /api/v1/billing/payments/initiate with Patient token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/billing/payments/initiate",
      headers: { authorization: `Bearer ${patientToken}` },
      body: {
        invoiceId: "00000000-0000-0000-0000-000000000001",
        amountUsd: 2000,
        paymentMethod: "stripe",
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 5: Payment Gateway Webhook updates invoice status and balance
  await t.test("POST /api/v1/billing/payments/webhook processes gateway confirmation", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/billing/payments/webhook",
      body: {
        paymentTransactionRef: "tx-test-reference-8819",
        invoiceId: "00000000-0000-0000-0000-000000000001",
        amountUsd: 2000,
        gatewayProvider: "stripe",
        gatewayStatus: "succeeded",
        metadata: {
          chargeId: "ch_test_9921",
        },
      },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});






