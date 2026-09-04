import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { RegisterSchema, LoginSchema, ChangePasswordSchema } from "@maides/validation";
import { hashPassword, verifyPassword, signToken } from "@maides/auth";
import { db } from "../../db.js";
import { users, eq } from "@maides/database";
import { config } from "../../config.js";
import { successResponse, errorResponse } from "../../utils/response.js";
import { requireAuth, requireRole } from "../../middleware/auth.js";
import { recordAuditLog } from "../../utils/audit.js";

export async function authRoutes(app: FastifyInstance) {
  // ─── Register ─────────────────────────────────────────────────────────────
  app.post("/register", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = RegisterSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
    }

    const { email, password, fullName, phone, country, preferredLanguage, role } = parseResult.data;

    // Check existing
    const existing = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (existing) {
      return reply.status(409).send(errorResponse("USER_EXISTS", "A user with this email already exists"));
    }

    const passwordHash = await hashPassword(password);
    const [newUser] = await db
      .insert(users)
      .values({
        email: email.toLowerCase(),
        passwordHash,
        fullName,
        phone,
        country,
        preferredLanguage,
        role: role || "patient",
      })
      .returning();

    // Record audit
    await recordAuditLog({
      userId: newUser.id,
      userEmail: newUser.email,
      userRole: newUser.role,
      action: "USER_REGISTERED",
      entityType: "USER",
      entityId: newUser.id,
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    const token = signToken(
      { sub: newUser.id, email: newUser.email, role: newUser.role },
      config.JWT_SECRET,
      config.JWT_EXPIRY
    );

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return reply.status(201).send(
      successResponse({
        user: {
          id: newUser.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          country: newUser.country,
          preferredLanguage: newUser.preferredLanguage,
        },
        token,
      })
    );
  });

  // ─── Login ────────────────────────────────────────────────────────────────
  app.post("/login", async (request: FastifyRequest, reply: FastifyReply) => {
    const parseResult = LoginSchema.safeParse(request.body);
    if (!parseResult.success) {
      return reply.status(400).send(errorResponse("VALIDATION_ERROR", "Invalid input", parseResult.error.format()));
    }

    const { email, password } = parseResult.data;

    const user = await db.query.users.findFirst({
      where: eq(users.email, email.toLowerCase()),
    });

    if (!user || !user.active) {
      return reply.status(401).send(errorResponse("INVALID_CREDENTIALS", "Invalid email or password"));
    }

    const validPassword = await verifyPassword(password, user.passwordHash);
    if (!validPassword) {
      return reply.status(401).send(errorResponse("INVALID_CREDENTIALS", "Invalid email or password"));
    }

    const token = signToken(
      { sub: user.id, email: user.email, role: user.role },
      config.JWT_SECRET,
      config.JWT_EXPIRY
    );

    // Record login in audit log
    await recordAuditLog({
      userId: user.id,
      userEmail: user.email,
      userRole: user.role,
      action: "USER_LOGIN",
      entityType: "USER",
      entityId: user.id,
      ipAddress: request.ip,
      userAgent: request.headers["user-agent"],
    });

    reply.setCookie("token", token, {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        preferredLanguage: user.preferredLanguage,
      },
      token,
    });
  });

  // ─── Logout ───────────────────────────────────────────────────────────────
  app.post("/logout", { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    if (request.user) {
      await recordAuditLog({
        userId: request.user.sub,
        userEmail: request.user.email,
        userRole: request.user.role,
        action: "USER_LOGOUT",
        entityType: "USER",
        entityId: request.user.sub,
        ipAddress: request.ip,
        userAgent: request.headers["user-agent"],
      });
    }

    reply.clearCookie("token", { path: "/" });
    return successResponse({ message: "Logged out successfully" });
  });

  // ─── Me ───────────────────────────────────────────────────────────────────
  app.get("/me", { preHandler: requireAuth }, async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) {
      return reply.status(401).send(errorResponse("UNAUTHORIZED", "Not authenticated"));
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, request.user.sub),
    });

    if (!user) {
      return reply.status(404).send(errorResponse("NOT_FOUND", "User not found"));
    }

    return successResponse({
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        country: user.country,
        phone: user.phone,
        preferredLanguage: user.preferredLanguage,
      },
    });
  });

  // ─── Admin User Management (List Users) ───────────────────────────────────
  app.get(
    "/users",
    { preHandler: requireRole("super_admin", "admin") },
    async () => {
      const userList = await db.query.users.findMany({
        columns: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          country: true,
          phone: true,
          preferredLanguage: true,
          emailVerified: true,
          active: true,
          createdAt: true,
        },
      });

      return successResponse({ users: userList });
    }
  );
}
