import { test } from "node:test";
import assert from "node:assert";
import { signToken } from "@maides/auth";
import { config } from "../src/config.js";
import { buildApp } from "../src/app.js";

test("Phase 1 Exit Test — RBAC Guard Enforces Role Boundaries", async (t) => {
  const app = await buildApp();

  // Test 1: Public Health endpoint responds with 200
  await t.test("GET /api/v1/health allows public access", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/health",
    });
    assert.strictEqual(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.status, "ok");
  });

  // Test 2: Protected Admin Route without Token returns 401
  await t.test("GET /api/v1/auth/users without token returns 401 Unauthorized", async () => {
    const res = await app.inject({
      method: "GET",
      url: "/api/v1/auth/users",
    });
    assert.strictEqual(res.statusCode, 401);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, "UNAUTHORIZED");
  });

  // Test 3: Doctor Token hitting Admin-only endpoint returns 403 Forbidden
  await t.test("GET /api/v1/auth/users with DOCTOR token returns 403 Forbidden", async () => {
    const doctorToken = signToken(
      { sub: "doc-uuid-1234", email: "doctor@maides.in", role: "doctor" },
      config.JWT_SECRET,
      "1h"
    );

    const res = await app.inject({
      method: "GET",
      url: "/api/v1/auth/users",
      headers: {
        authorization: `Bearer ${doctorToken}`,
      },
    });

    assert.strictEqual(res.statusCode, 403);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, "FORBIDDEN");
  });

  // Test 4: Patient Token hitting Admin-only endpoint returns 403 Forbidden
  await t.test("GET /api/v1/auth/users with PATIENT token returns 403 Forbidden", async () => {
    const patientToken = signToken(
      { sub: "pat-uuid-5678", email: "patient@maides.in", role: "patient" },
      config.JWT_SECRET,
      "1h"
    );

    const res = await app.inject({
      method: "GET",
      url: "/api/v1/auth/users",
      headers: {
        authorization: `Bearer ${patientToken}`,
      },
    });

    assert.strictEqual(res.statusCode, 403);
    const body = JSON.parse(res.body);
    assert.strictEqual(body.success, false);
    assert.strictEqual(body.error.code, "FORBIDDEN");
  });

  // Test 5: Super Admin Token hitting RBAC guard allows execution
  await t.test("GET /api/v1/auth/users with SUPER_ADMIN token passes RBAC guard", async () => {
    const adminToken = signToken(
      { sub: "admin-uuid-9999", email: "superadmin@maides.in", role: "super_admin" },
      config.JWT_SECRET,
      "1h"
    );

    const res = await app.inject({
      method: "GET",
      url: "/api/v1/auth/users",
      headers: {
        authorization: `Bearer ${adminToken}`,
      },
    });

    // Validates that request did NOT get blocked by RBAC (status is not 401 or 403)
    assert.notStrictEqual(res.statusCode, 401);
    assert.notStrictEqual(res.statusCode, 403);
  });
});
