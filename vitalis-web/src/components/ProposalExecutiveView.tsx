"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Building2, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Layers, 
  Users, 
  ShieldCheck, 
  ArrowRight, 
  Download, 
  Briefcase, 
  FileCheck2, 
  Sparkles, 
  ExternalLink, 
  Palmtree,
  Leaf,
  Database,
  Server,
  Cpu,
  Lock
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export function ProposalExecutiveView() {
  const [activeTab, setActiveTab] = useState<'architecture' | 'database' | 'api' | 'commercials' | 'timeline'>('architecture');

  const milestones = [
    { code: "M1", title: "Discovery & Architecture Sign-Off", weeks: "Weeks 1–2", pct: "15%", amountInr: "₹6,37,500", deliverables: "SRS, MAIDES PostgreSQL schemas, Fastify API routes, 14-district mapping" },
    { code: "M2", title: "UX/UI Design System Sign-Off", weeks: "Weeks 3–5", pct: "15%", amountInr: "₹6,37,500", deliverables: "MAIDES healthcare design system, responsive UI kit, high-fi prototype" },
    { code: "M3", title: "Public MAIDES Portal & SEO Engine", weeks: "Weeks 6–8", pct: "20%", amountInr: "₹8,50,000", deliverables: "14-district destination guides, Ayurveda vertical, hospital & doctor directories" },
    { code: "M4", title: "Patient Portal & CRM Pipeline", weeks: "Weeks 9–16", pct: "20%", amountInr: "₹8,50,000", deliverables: "10-stage journey tracker, Private S3 Medical Vault, multi-district SLA triage" },
    { code: "M5", title: "Hospital Partner Desk & Appointments", weeks: "Weeks 13–18", pct: "15%", amountInr: "₹6,37,500", deliverables: "Hospital quotation desk, WebRTC video consultation suite, payment escrow" },
    { code: "M6", title: "Travel Desk, WhatsApp & Redis Queue", weeks: "Weeks 16–23", pct: "10%", amountInr: "₹4,25,000", deliverables: "Kerala Medical eVisa letters, airport chauffeur booking, notification workers" },
    { code: "M7", title: "UAT, Security Audit & Launch", weeks: "Weeks 26–28", pct: "5%", amountInr: "₹2,12,500", deliverables: "Security penetration testing, hypercare launch, administrator training" }
  ];

  const dbTables = [
    { category: "Auth & RBAC", tables: "users, roles, permissions, user_roles, role_permissions", count: 5 },
    { category: "Patient Domain", tables: "patients, patient_profiles, patient_accommodations, travel_details, transport_requests", count: 5 },
    { category: "Enquiries & CRM", tables: "enquiries, enquiry_status_history, leads, lead_notes, followups", count: 5 },
    { category: "Clinical & Providers", tables: "specialties, treatments, locations, hospitals, hospital_specialties, hospital_treatments, doctors", count: 7 },
    { category: "Appointments & Care", tables: "appointments, appointment_status_history, medical_documents", count: 3 },
    { category: "Logistics & Stay", tables: "accommodations, packages", count: 2 },
    { category: "Messaging & Comms", tables: "messages, notifications, contact_submissions", count: 3 },
    { category: "Content & SEO", tables: "blog_categories, blog_posts, faqs, testimonials, seo_metadata", count: 5 },
    { category: "System & Governance", tables: "audit_logs, site_settings", count: 2 }
  ];

  const apiGroups = [
    { group: "Auth (/api/v1/auth)", endpoints: "POST /register, POST /login, POST /logout, GET /me, POST /forgot-password, POST /reset-password, POST /verify-email" },
    { group: "Patient Portal (/api/v1/patient)", endpoints: "GET/PATCH /profile, GET/POST /enquiries, GET/POST/DELETE /documents, GET /appointments, GET /travel, GET/POST /messages, GET /notifications" },
    { group: "Public Content (/api/v1)", endpoints: "GET /treatments, GET /specialties, GET /hospitals, GET /doctors, GET /locations, GET /blog, GET /faqs, POST /contact, POST /enquiries" },
    { group: "Staff Admin (/api/v1/admin)", endpoints: "GET /dashboard, CRUD /patients, CRUD /enquiries, CRUD /leads, CRUD /hospitals, CRUD /doctors, CRUD /treatments, CRUD /appointments, CRUD /travel, CRUD /blog, CRUD /staff, PATCH /seo" }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-24">
      
      {/* Header */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                  MAIDES Technical Blueprint
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                  Version 1.0 Production Spec
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#0F2042] mt-2">
                MAIDES — Complete Technical Architecture & Development Blueprint
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Next.js + Fastify/Node.js + PostgreSQL (37 Tables) + Redis + Private S3 Storage • Fixed Estimate: <strong className="text-[#0E82FD]">₹42,50,000 (~$48,300 USD)</strong>
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link 
                href="/inventory" 
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                77-Screen Inventory
              </Link>
              <Link 
                href="/" 
                className="px-4 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all"
              >
                Public Website
              </Link>
            </div>

          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
            {[
              { id: 'architecture', label: '1. Architecture & Tech Stack' },
              { id: 'database', label: '2. PostgreSQL Schemas (37 Tables)' },
              { id: 'api', label: '3. REST API Specification (/api/v1)' },
              { id: 'commercials', label: '4. Commercials & Milestones' },
              { id: 'timeline', label: '5. 28-Week Master Delivery' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#0E82FD] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        
        {/* TAB 1: ARCHITECTURE */}
        {activeTab === 'architecture' && (
          <div className="space-y-6">
            
            {/* Tech Stack Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-[#0E82FD]">
                  <Cpu className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Frontend Web & Portals</span>
                </div>
                <h3 className="text-base font-bold text-[#0F2042]">Next.js 16 (App Router)</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  React + TypeScript + Tailwind CSS with SSR/SSG for technical SEO and sub-second Core Web Vitals.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-[#0E82FD]">
                  <Server className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Backend API Gateway</span>
                </div>
                <h3 className="text-base font-bold text-[#0F2042]">Node.js + Fastify</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  High-throughput REST API with schema validation, JWT / HTTP-only sessions, and RBAC middleware.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-[#0E82FD]">
                  <Database className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Relational Database</span>
                </div>
                <h3 className="text-base font-bold text-[#0F2042]">PostgreSQL 16</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  37 normalized tables with UUID keys, Timestamptz UTC, indexes on lead/enquiry queues, and audit logs.
                </p>
              </div>

              <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center space-x-2 text-[#0E82FD]">
                  <Lock className="w-5 h-5" />
                  <span className="text-xs font-bold uppercase tracking-wider">Storage & Cache</span>
                </div>
                <h3 className="text-base font-bold text-[#0F2042]">Redis + Private S3</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Zero-knowledge signed URLs for DICOM medical scans and BullMQ background notification jobs.
                </p>
              </div>
            </div>

            {/* Architecture Diagram Description */}
            <div className="p-8 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD]">Data Flow & User Roles</span>
              <h2 className="text-xl font-bold text-[#0F2042]">
                End-to-End Medical Travel Orchestration
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                MAIDES brings together <strong>Public Lead Discovery</strong>, <strong>Patient Journey Management</strong>, <strong>Hospital Provider Triage</strong>, <strong>Travel Concierge Logistics</strong>, and <strong>Super Admin CRM</strong> into an integrated ecosystem.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <strong className="text-xs font-bold text-[#0E82FD] block">1. Public Visitor Domain</strong>
                  <p className="text-xs text-slate-600">SEO-driven specialty & location pages, treatment pricing comparisons, and multi-step enquiry form.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <strong className="text-xs font-bold text-[#0E82FD] block">2. Patient & Care Coordinator</strong>
                  <p className="text-xs text-slate-600">Encrypted DICOM upload, 3-tier quotation reviews, WebRTC video rooms, and travel desk sync.</p>
                </div>

                <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200 space-y-1">
                  <strong className="text-xs font-bold text-[#0E82FD] block">3. Hospital Partner & Admin CRM</strong>
                  <p className="text-xs text-slate-600">SLA-bound lead triage, quotation builders, appointment rotas, and corridor revenue analytics.</p>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: DATABASE */}
        {activeTab === 'database' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-[#0F2042]">PostgreSQL Schema Architecture (37 Core Tables)</h3>
                  <p className="text-xs text-slate-500">Fully normalized with UUID primary keys, Timestamptz UTC, and indexed query paths.</p>
                </div>
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                  37 Tables Configured
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {dbTables.map((d, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <strong className="text-xs font-bold text-[#0F2042]">{d.category}</strong>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-[#0E82FD]">{d.count} tables</span>
                    </div>
                    <p className="text-[11px] font-mono text-slate-600 leading-relaxed break-words bg-white p-2.5 rounded-xl border border-slate-200">
                      {d.tables}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: API SPEC */}
        {activeTab === 'api' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#0F2042]">MAIDES REST API Routes (/api/v1)</h3>
              <p className="text-xs text-slate-500">Standardized JSON envelope response with role-based JWT authorization.</p>

              <div className="space-y-3 pt-2">
                {apiGroups.map((g, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <strong className="text-xs font-bold text-[#0E82FD] block">{g.group}</strong>
                    <p className="text-[11px] font-mono text-slate-700 bg-white p-3 rounded-xl border border-slate-200 leading-relaxed">
                      {g.endpoints}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: COMMERCIALS */}
        {activeTab === 'commercials' && (
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-[#0F2042]">7 Milestone Sign-Off Gates & Payment Schedule</h3>
              <p className="text-xs text-slate-500">Payments are tied strictly to signed off deliverables at each stage.</p>

              <div className="space-y-3 pt-2">
                {milestones.map((m) => (
                  <div key={m.code} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0E82FD] font-black text-xs flex items-center justify-center shrink-0">
                        {m.code}
                      </span>
                      <div>
                        <h4 className="text-xs font-bold text-[#0F2042]">{m.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{m.deliverables}</p>
                      </div>
                    </div>

                    <div className="text-right sm:text-right shrink-0">
                      <strong className="text-sm font-black text-[#0E82FD] block">{m.amountInr}</strong>
                      <span className="text-[10px] text-slate-500">{m.pct} • {m.weeks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: TIMELINE */}
        {activeTab === 'timeline' && (
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-[#0F2042]">28-Week Master Delivery Schedule</h3>
            <p className="text-xs text-slate-500">Structured into 4 overlapping tracks with bi-weekly client sprint reviews.</p>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Phase 1: Project Foundation, PostgreSQL Database & Auth/RBAC</span>
                <strong className="text-[#0E82FD]">Weeks 1 – 5</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Phase 2: Public Website, 14 Districts, & Patient Vault</span>
                <strong className="text-[#0E82FD]">Weeks 6 – 12</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Phase 3: Kerala Hospital Desk, Appointments & Admin CRM</span>
                <strong className="text-[#0E82FD]">Weeks 13 – 20</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center">
                <span>Phase 4: Travel Desk, Redis Workers, Security Penetration & Launch</span>
                <strong className="text-[#0E82FD]">Weeks 21 – 28</strong>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
