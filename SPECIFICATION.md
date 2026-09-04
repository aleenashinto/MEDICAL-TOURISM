# MAIDES – Software Requirements Specification (SRS) & Architecture Blueprint
**Version:** 1.0  
**Project:** MAIDES – Kerala Medical Tourism & International Patient Assistance Platform  
**Target Market:** Kerala, India (International patients from GCC, UK, US, Maldives, Sri Lanka, Africa & Domestic/NRI travellers)

---

## 1. Executive Summary & Platform Overview

MAIDES is a healthcare coordination and medical travel management system connecting patients, accredited quaternary hospitals, and certified specialist physicians across Kerala's 14 districts.

### Core Ecosystem Roles
1. **Super Admin**: Complete administrative, financial, system governance, and audit authority.
2. **Admin**: Operational oversight across CRM leads, patient cases, hospital approvals, and staffing.
3. **Medical Coordinator**: Direct case management, clinical dossier triage, and specialist doctor matching.
4. **Travel Coordinator**: Non-medical logistics (Visa letters, Airport reception at COK/TRV/CCJ, and resort stays).
5. **Support Agent**: Multilingual patient communication and ticket resolution.
6. **Sales/CRM Agent**: Lead conversion, follow-up scheduling, and quotation delivery.
7. **Hospital Manager**: Partner hospital desk, bed availability, and quotation responses.
8. **Doctor**: Remote second opinions, availability schedules, and consultation dossiers.
9. **Patient**: Enquiry submission, encrypted medical vault uploads, journey tracker, and tele-consultations.

---

## 2. Technical Stack & Repository Architecture

```text
MEDICAL-TOURISM (Repository Root)
├── vitalis-web/                         # Next.js 16 + React + Tailwind CSS v4 Frontend
│   ├── src/app/                         # 23 Production App Router Routes
│   │   ├── (public)/                    # /, /about, /treatments, /hospitals, /doctors, /ayurveda, /packages
│   │   ├── destinations/                # 14 Kerala District Portals (COK/TRV/CCJ Gateways)
│   │   ├── portal/                      # Interactive Patient Portal & Medical Vault
│   │   ├── hospital/                    # Hospital Partner Quoting & Triage Desk
│   │   ├── admin/                       # Multi-District CRM Pipeline & Operations Center
│   │   ├── proposal/                    # Commercial Blueprint & Milestones
│   │   └── inventory/                   # 108-Module Interactive Feature Matrix
│   └── src/components/                  # Modular Component Library & Intake Engine
│
└── maides/                              # Fastify + TypeScript + Drizzle ORM Monorepo
    ├── apps/
    │   └── api/                         # Fastify REST API Service (/api/v1)
    ├── packages/
    │   ├── types/                       # Shared TypeScript Interfaces & Domain Enums
    │   ├── validation/                  # Isomorphic Zod Validation Schemas
    │   ├── auth/                        # bcrypt Hashing + JWT Cookie Verification
    │   └── database/                    # Drizzle ORM Schema, PostgreSQL Migrations & Seeders
    └── docker-compose.yml               # PostgreSQL 16, Redis 7, MinIO S3 & Adminer
```

---

## 3. End-to-End Operational Workflow (Definition of Done)

```text
Visitor / Patient
       │
       ▼
[ 1. Submit Medical Enquiry ] ───► Encrypted Medical Vault (S3 / MinIO)
       │
       ▼
[ 2. Lead Generated in CRM ] ───► Assigned to Sales / CRM Agent
       │
       ▼
[ 3. Lead Qualified ] ──────────► Assigned to Dedicated Medical Coordinator
       │
       ▼
[ 4. Clinical Review ] ─────────► Specialist Doctor Medical Opinion Requested
       │
       ▼
[ 5. Quotation Prepared ] ──────► 3-Tier Kerala Hospital Proposals Delivered
       │
       ▼
[ 6. Patient Acceptance ] ──────► Appointment & Admission Confirmed
       │
       ▼
[ 7. Travel Logistics ] ────────► Medical Visa Letter (4-Hr SLA), Airport Chauffeur (COK/TRV/CCJ)
       │
       ▼
[ 8. Treatment in Kerala ] ─────► Quaternary Surgery / Classical Ashtavaidya Panchakarma
       │
       ▼
[ 9. Convalescence & Recovery ] ─► Backwater Resort Convalescence & Fit-to-Fly Certification
       │
       ▼
[ 10. Post-Travel Follow-Up ] ──► 12-Month Teleconsultations & Digital Case Closure
```

---

## 4. Full Release Phase Map

### Phase 1: MVP Core (Completed & Functional)
- **Public Frontend**: Next.js 16 landing page, 23 routes, search, filters, and mobile drawer.
- **Security & Auth**: Fastify JWT authentication, HTTP-only session cookies, and RBAC guards.
- **Database Engine**: PostgreSQL with Drizzle ORM covering users, enquiries, hospitals, doctors, and documents.
- **Medical Vault**: Encrypted multipart file handling.

### Phase 2: Logistics & Commercial Engine
- Travel and Visa tracking endpoints (`/api/v1/travel`, `/api/v1/transportation`).
- Multi-currency quotes and invoices (`INR`, `USD`, `AED`, `SAR`, `EUR`, `GBP`).
- Support ticket resolution system.

### Phase 3: Automation & AI Telehealth
- Direct WhatsApp Business webhooks for real-time reminders.
- WebRTC peer-to-peer secure video consultation rooms.
- AI clinical dossier extraction (strictly human-supervised decision support).

---

## 5. Development Verification & Quickstart

```bash
# 1. Run local database and storage services
cd maides
docker compose up -d

# 2. Seed database with Kerala hospitals and doctors
pnpm --filter @maides/database db:seed

# 3. Start Fastify REST API (Port 4000)
pnpm --filter @maides/api dev

# 4. Start Next.js Web Frontend (Port 3000)
cd ../vitalis-web
npm run dev
```

* **Frontend**: `http://localhost:3000`
* **Swagger API Documentation**: `http://localhost:4000/docs`
* **Adminer Database GUI**: `http://localhost:8080`
