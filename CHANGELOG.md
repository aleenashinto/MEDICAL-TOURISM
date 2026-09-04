# MAIDES Engineering Changelog

All notable changes and architectural decisions across phases are documented here.

## [Phase 2 — Catalog Data] - 2026-09-04
- Added `specialties` and `treatments` schema with PostgreSQL relationships, foreign keys, and cost ranges.
- Built public REST endpoints for querying Specialties and Treatments with multi-parameter filtering (region, specialty, search, featured).
- Implemented Admin CMS creation controllers for Specialties and Treatments with audit-log tracking.
- Verified test suite: 12/12 automated unit tests passing across RBAC and Catalog layers.

## [Phase 1 — Identity & RBAC] - 2026-09-04
- Implemented 9 distinct ecosystem roles: `SUPER_ADMIN`, `ADMIN`, `MEDICAL_COORDINATOR`, `TRAVEL_COORDINATOR`, `SUPPORT_AGENT`, `SALES_CRM_AGENT`, `HOSPITAL_MANAGER`, `DOCTOR`, `PATIENT`.
- Implemented JWT cookie-based session auth with password hashing (bcrypt, 12 rounds).
- Configured backend-enforced RBAC middleware (`requireRole`) with automatic audit-log recording for unauthorized 403 access breaches.
- Created seed seeder for all 9 user role personas.
- Automated exit test `rbac.test.ts` passed 100% (6/6 tests passing).

## [Phase 0 — Foundations] - 2026-09-04
- Initialized Monorepo with Turborepo & pnpm workspace.
- Defined PostgreSQL 16 schema with 22 entities and strict enums.
- Configured multi-container Docker Compose with PostgreSQL 16, Redis 7, MinIO S3, and Adminer.
- Established CI pipeline and baseline compliance rules (DPDP Act & cross-border PII protection).
