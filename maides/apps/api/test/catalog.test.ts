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
