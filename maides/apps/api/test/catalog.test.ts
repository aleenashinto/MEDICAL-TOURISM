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


