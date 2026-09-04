# MAIDES Engineering Changelog

All notable changes and architectural decisions across phases are documented here.

## [Phase 6 — Hospital & Doctor Portal] - 2026-09-04
- Implemented Hospital Partner Management APIs (`POST /api/v1/hospitals`, `PATCH /api/v1/hospitals/:id`, `GET /api/v1/hospitals/:id/cases`) with RBAC restrictions (`hospital_manager`, `super_admin`).
- Built Doctor Management & Profile Configuration APIs (`POST /api/v1/doctors`, `PATCH /api/v1/doctors/:id`, `GET /api/v1/doctors/:id/cases`).
- Built Doctor Second Opinion & Treatment Protocol Submission Engine (`POST /api/v1/doctors/:id/opinions/:enquiryId`) with structured clinical assessment, procedure recommendations, stay length, cost estimation, and fit-to-fly sign-off.
- Verified test suite: 32/32 automated unit & integration tests passing across all layers.

## [Phase 5 — Medical Enquiry & Case Management Engine] - 2026-09-04
- Implemented comprehensive Case Management Engine across the 10-step Kerala medical tourism lifecycle (`GET /api/v1/enquiries`, `GET /api/v1/enquiries/:id`, `POST /api/v1/enquiries`).
- Implemented multi-scoped access controls: Patient view restricted to personal cases; Super Admin / Medical Coordinator access across all Kerala cases.
- Engineered Case Lifecycle Status Progression (`PATCH /api/v1/enquiries/:id/status`) with stage tracking (`new` → `medical_review` → `document_review` → `doctor_assigned` → `opinion_requested` → `opinion_received` → `hospital_selected` → `treatment_planned` → `appointment_scheduled` → `treatment_in_progress` → `treatment_completed` → `follow_up`).
- Built Hospital & Specialist Case Assignment Controller (`POST /api/v1/enquiries/:id/assign`).
- Built Specialist Second Opinion Request Dispatcher (`POST /api/v1/enquiries/:id/request-opinion`) with urgency triage (`routine` / `urgent` / `emergency`).
- Verified test suite: 26/26 automated unit & integration tests passing across all layers.

## [Phase 4 — CRM & Lead Pipeline] - 2026-09-04
- Implemented full CRM Lead qualification, query, and search endpoints (`GET /api/v1/leads`, `GET /api/v1/leads/:id`).
- Built lead pipeline status progression endpoint (`PATCH /api/v1/leads/:id/status`) with strict stage transitions (`new` → `contacted` → `qualified` → `medical_review` → `hospital_matching` → `quotation_sent` → `appointment_requested` → `converted`).
- Built lead assignment endpoint (`POST /api/v1/leads/:id/assign`) linking leads to sales agents or medical coordinators with audit trail.
- Implemented coordinator note logging endpoint (`POST /api/v1/leads/:id/notes`).
- Engineered seamless Lead-to-Patient conversion engine (`POST /api/v1/leads/:id/convert`) that auto-provisions patient user accounts and spawns official clinical enquiry cases with immutable audit logging.
- Verified test suite: 20/20 automated tests passing across RBAC, Catalog, Lead Capture, and CRM Lead Pipeline.

## [Phase 3 — Public Website & Lead Capture] - 2026-09-04
- Built public medical enquiry endpoint `POST /api/v1/leads/enquire` with DPDP-compliant consent validation.
- Created `leads` schema in PostgreSQL storing clinical requests, budget, timeline, and lead source.
- Wired audit trail logging for public lead capture and built staff CRM lead query route `GET /api/v1/leads`.
- Verified test suite: 15/15 automated unit tests passing across RBAC, Catalog, and Lead Capture layers.

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
