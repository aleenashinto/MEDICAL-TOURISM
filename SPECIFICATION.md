# MAIDES — Kerala Medical Tourism & International Patient Assistance Platform
## Master Technical Specification & Execution Roadmap

This document captures the complete end-to-end architecture, database schema, REST API blueprint, and system state for MAIDES.

---

## 1. System Inventory & Repository Structure

```text
MEDICAL-TOURISM (Root)
│
├── vitalis-web/                         # Next.js 16 + React + Tailwind v4 Web Application
│   ├── src/app/
│   │   ├── (public pages)               # /, /about, /treatments, /hospitals, /doctors, /ayurveda, etc.
│   │   ├── destinations/                # 14 Kerala Districts Interactive Directory
│   │   ├── portal/                      # Patient Dashboard, Medical Vault, Journey Stepper
│   │   ├── hospital/                    # Hospital Partner Quotation & Admission Desk
│   │   ├── admin/                       # Multi-District CRM Pipeline, SLA Triage & Analytics
│   │   ├── proposal/                    # Full Commercial Architecture Blueprint
│   │   └── inventory/                   # 43-Module Interactive Screen Inventory
│   └── src/components/                  # Modular UI Architecture & AI Intake Engine
│
└── maides/                              # Fastify + TypeScript + Drizzle ORM Monorepo
    ├── apps/
    │   └── api/                         # Fastify REST API Service (/api/v1)
    ├── packages/
    │   ├── types/                       # Shared TypeScript domain models & enums
    │   ├── validation/                  # Zod validation schemas (isomorphic)
    │   ├── auth/                        # Password hashing (bcrypt) & JWT verification
    │   └── database/                    # Drizzle ORM schema, migrations & seed scripts
    └── docker-compose.yml               # PostgreSQL 16, Redis 7, MinIO S3, Adminer
```

---

## 2. 43-Module Implementation Status Matrix

| # | Module Name | Specification Phase | Web App Prototype (`vitalis-web`) | Backend REST API (`maides/api`) |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Public Website Pages (23 Routes) | Phase 2 | ✅ Full 23 Dedicated Pages | ✅ Static Content Delivery |
| **2** | Authentication & Sessions | Phase 1 | ✅ Auth Flow UI Components | ✅ Fastify JWT + HTTP-only Cookies |
| **3** | Role & Permission Management (RBAC) | Phase 1 | ✅ 5-Role Switcher Simulation | ✅ `requireRole()` Guard Middleware |
| **4** | Patient Management & Profile | Phase 4 | ✅ Patient Portal Profile UI | ✅ `/api/v1/auth/me` Endpoint |
| **5** | Medical Enquiry (13-Stage Workflow) | Phase 3 | ✅ 4-Step Intake Modal & Views | ✅ `/api/v1/enquiries` CRUD + Status |
| **6** | Lead & CRM Management | Phase 3 | ✅ Admin CRM Kanban & Table | ✅ Lead Tracking Data Model |
| **7** | Follow-Up Scheduling Desk | Phase 3 | ✅ Follow-up Scheduler UI | ⏳ Phase 2 Fastify Extension |
| **8** | Medical Document Vault (Private S3) | Phase 5 | ✅ Document Locker & Preview | ✅ S3 Multipart Upload Route |
| **9** | Specialty Management (12 Specialties)| Phase 2 | ✅ 12 Specialty Grid + Filters | ✅ `/api/v1/hospitals` & Doctors API |
| **10** | Treatment Directory | Phase 2 | ✅ `/treatments` with Search | ✅ Treatment Schema Models |
| **11** | Hospital Partner Directory | Phase 5 | ✅ `/hospitals` Region Filters | ✅ `/api/v1/hospitals` Route + Seed |
| **12** | Specialist Doctor Roster | Phase 5 | ✅ `/doctors` Video Consult Filter | ✅ `/api/v1/doctors` Route + Seed |
| **13** | Appointment Coordination | Phase 5 | ✅ Portal Appointment Requests | ⏳ Phase 2 Fastify Extension |
| **14** | 10-Step Treatment Journey Stepper | Phase 4 | ✅ Visual Journey Progress Bar | ✅ `enquiry_status_history` Model |
| **15** | Travel Logistics Management | Phase 6 | ✅ Travel Desk Flight Tracker | ⏳ Travel Entity Routes |
| **16** | Airport Pickup & Chauffeur Desk | Phase 6 | ✅ COK, TRV, CCJ Airport Views | ⏳ Transport Request Routes |
| **17** | Hospital / Hotel Transportation | Phase 6 | ✅ Vehicle & Distance Matrix | ⏳ Transport Dispatch Routes |
| **18** | Accommodation & Resort Desk | Phase 6 | ✅ Backwater Resort Booking UI | ⏳ Accommodation Entity Routes |
| **19** | International Patients Experience | Phase 2 | ✅ `/international-patients` Page | ✅ Global Patient Support Enums |
| **20** | Secure Patient-Staff Messaging | Phase 4 | ✅ Real-time Concierge Drawer | ⏳ WebSocket / Redis Queue |
| **21** | Multi-Channel Notifications | Phase 4 | ✅ In-App Notification Center | ⏳ BullMQ / Redis Notification Worker |
| **22** | Content Management System (CMS) | Phase 7 | ✅ Dynamic Inventory Catalog | ⏳ Admin CMS CRUD Routes |
| **23** | Blog & Medical Travel Guides | Phase 8 | ✅ `/blog` Featured Posts & Tags | ⏳ Blog Entity Fastify Routes |
| **24** | FAQ Search Engine | Phase 2 | ✅ `/faq` Live Query Accordion | ⏳ FAQ Category Routes |
| **25** | Patient Testimonials | Phase 8 | ✅ Verified Review Carousel | ⏳ Testimonials Data Model |
| **26** | Medical Travel Packages (4 Tiers) | Phase 2 | ✅ `/packages` (USD + INR) | ⏳ Package Catalog Schema |
| **27** | Contact & Inquiry Dispatch | Phase 2 | ✅ `/contact` Form + WhatsApp | ⏳ Contact Submission Endpoint |
| **28** | SEO & Schema.org Structured Data | Phase 8 | ✅ Semantic HTML, Metadata, OG | ✅ Auto-Generated Sitemap / Robots |
| **29** | Search & Universal Filtering | Phase 2 | ✅ District, Region & Price Filter | ✅ SQL `ilike` & Multi-param Filters |
| **30** | Patient Dashboard | Phase 4 | ✅ `/portal` Interactive View | ✅ Patient Protected Endpoints |
| **31** | Executive Admin Dashboard | Phase 7 | ✅ `/admin` Analytics & Pipelines | ✅ Staff-gated Data APIs |
| **32** | Administrative Operations Center | Phase 7 | ✅ Role, Hospital & Doctor Views | ✅ Database Seed & Config Controls |
| **33** | Analytics & SLA Reporting | Phase 7 | ✅ Visual Metrics & SLA Triage | ⏳ Aggregation Pipeline Queries |
| **34** | Audit Log & Security Trail | Phase 9 | ✅ Audit Trail Screen Mock | ✅ `audit_logs` Schema & Recorder |
| **35** | Site Settings & Brand Tokens | Phase 7 | ✅ Central Theme & Footer Config | ✅ Environment Variable Registry |
| **36** | Security (XSS, CSRF, Rate-Limit) | Phase 9 | ✅ Input Sanitization & Disclaimers | ✅ Helmet, Rate-Limit, Strict Cookies |
| **37** | Versioned REST API Architecture | Phase 1 | ✅ Connected Frontend Types | ✅ `/api/v1` Fastify App Builder |
| **38** | PostgreSQL 37-Table Schema | Phase 1 | ✅ Schema Visualizer in `/proposal` | ✅ Drizzle ORM Schema & Migrations |
| **39** | Isomorphic Technology Stack | Phase 1 | ✅ Next.js 16 + Tailwind v4 + TS | ✅ Node.js + Fastify + Drizzle + Zod |
| **40** | Functional & Security QA Suites | Phase 9 | ✅ Zero TypeScript Compile Errors | ✅ Monorepo Strict Typecheck Passed |
| **41** | Docker Multi-Container Platform | Phase 10 | ✅ Vercel Deployable Frontend | ✅ `docker-compose.yml` (4 Services) |
| **42** | 10-Phase Project Delivery Roadmap | Phase 10 | ✅ 28-Week Plan in `/proposal` | ✅ Phase 1 & 2 Execution Complete |
| **43** | AI Intake & Future Telehealth | Future | ✅ AI Clinical Dossier Triaging | ⏳ WebRTC & WhatsApp Webhooks |

---

## 3. Database Entity Map (PostgreSQL 16)

```text
┌──────────────┐       ┌─────────────────┐       ┌──────────────────┐
│    users     │──────<│  patient_info   │       │    hospitals     │
└──────┬───────┘       └─────────────────┘       └────────┬─────────┘
       │                                                  │
       │ (1:N)                                            │ (1:N)
       ▼                                                  ▼
┌──────────────┐ (N:1) ┌─────────────────┐ (N:1) ┌──────────────────┐
│  enquiries   │>──────│   crm_leads     │──────<│     doctors      │
└──────┬───────┘       └─────────────────┘       └──────────────────┘
       │
       │ (1:N)
       ├─────────────────────────┬────────────────────────┐
       ▼                         ▼                        ▼
┌──────────────────┐    ┌──────────────────┐    ┌───────────────────┐
│ enquiry_documents│    │ treatment_journey│    │   appointments    │
└──────────────────┘    └──────────────────┘    └───────────────────┘
```

---

## 4. Next Engineering Steps

1. **Local Database Verification**: Run `docker compose up -d` in `maides/` to start PostgreSQL, Redis, and MinIO.
2. **Apply Migrations & Seed**: Run `pnpm --filter @maides/database db:seed` to seed Aster Medcity, Rajagiri Hospital, Dr. Muralidharan Nair, and the Super Admin user.
3. **Connect Frontend to Backend**: Wire `vitalis-web` form submissions (e.g. `/medical-enquiry`) to `http://localhost:4000/api/v1/enquiries` using the shared `@maides/validation` schemas.
4. **Deploy Frontend to Vercel**: Connect the repository to Vercel with root directory set to `vitalis-web`.
