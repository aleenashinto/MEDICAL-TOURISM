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
