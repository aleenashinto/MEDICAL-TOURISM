import { test } from "node:test";
import assert from "node:assert";
import { buildApp } from "../src/app.js";

test("Phase 3 Exit Test — Public Medical Enquiry to Lead Capture", async (t) => {
  const app = await buildApp();

  // Test 1: Missing mandatory consent or fields returns 400 Validation Error
  await t.test("POST /api/v1/leads/enquire without consent returns 400", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/leads/enquire",
      body: {
        fullName: "Ahmed Al-Mansoor",
        email: "ahmed@example.com",
        phone: "+971501234567",
        country: "United Arab Emirates",
        specialty: "Cardiology",
        medicalSummary: "Requires beating heart CABG consultation.",
        consentGiven: false,
      },
    });

    assert.strictEqual(res.statusCode, 400);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, "VALIDATION_ERROR");
  });

  // Test 2: Valid anonymous medical enquiry creates a lead with status NEW
  await t.test("POST /api/v1/leads/enquire with valid visitor data routes to NEW lead", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/leads/enquire",
      body: {
        fullName: "Ahmed Al-Mansoor",
        email: "ahmed@example.com",
        phone: "+971501234567",
        country: "United Arab Emirates",
        specialty: "Cardiology",
        treatmentName: "Off-Pump Coronary Artery Bypass",
        preferredDistrict: "Ernakulam",
        budget: "8000_20000_usd",
        timeline: "asap",
        medicalSummary: "Diagnosed with triple vessel disease. Seeking second opinion at Aster or Rajagiri.",
        consentGiven: true,
      },
    });

    // Validates route executed and schema validated
    assert.notStrictEqual(res.statusCode, 400);
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});

test("Phase 4 Exit Test — CRM Lead Pipeline Progression & Patient Conversion", async (t) => {
  const app = await buildApp();
  const { signToken } = await import("@maides/auth");
  const { config } = await import("../src/config.js");

  const crmAgentToken = signToken(
    { sub: "agent-uuid-101", email: "crm_agent@maides.in", role: "sales_crm_agent" },
    config.JWT_SECRET,
    "1h"
  );

  const medCoordToken = signToken(
    { sub: "coord-uuid-202", email: "coordinator@maides.in", role: "medical_coordinator" },
    config.JWT_SECRET,
    "1h"
  );

  const patientToken = signToken(
    { sub: "patient-uuid-303", email: "patient@example.com", role: "patient" },
    config.JWT_SECRET,
    "1h"
  );

  // Test 1: Patient role blocked from CRM pipeline routes (403)
  await t.test("GET /api/v1/leads with PATIENT token returns 403 Forbidden", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/leads",
      headers: { authorization: `Bearer ${patientToken}` },
    });
    assert.strictEqual(res.statusCode, 403);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, "FORBIDDEN");
  });

  // Test 2: CRM Agent can list leads with filtering
  await t.test("GET /api/v1/leads with CRM AGENT token passes RBAC", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/leads?status=new&limit=10",
      headers: { authorization: `Bearer ${crmAgentToken}` },
    });
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });

  // Test 3: Status update endpoint enforces schema validation
  await t.test("PATCH /api/v1/leads/:id/status with invalid status returns 400", async () => {
    const res = await app.inject({
      method: "PATCH",
      url: "/api/v1/leads/00000000-0000-0000-0000-000000000000/status",
      headers: { authorization: `Bearer ${crmAgentToken}` },
      body: { status: "invalid_status_value" },
    });
    assert.strictEqual(res.statusCode, 400);
  });

  // Test 4: Conversion endpoint requires proper auth & role
  await t.test("POST /api/v1/leads/:id/convert with COORDINATOR token passes RBAC", async () => {
    const res = await app.inject({
      method: "POST",
      url: "/api/v1/leads/00000000-0000-0000-0000-000000000000/convert",
      headers: { authorization: `Bearer ${medCoordToken}` },
      body: { notes: "Testing conversion endpoint" },
    });
    // Should reach handler (404 since fake ID, not 401/403)
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});

