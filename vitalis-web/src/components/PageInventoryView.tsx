"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  FileText, 
  Layers, 
  Search, 
  CheckCircle2, 
  Globe2, 
  Users, 
  Building2, 
  Stethoscope, 
  ShieldCheck, 
  Smartphone, 
  Lock, 
  Sparkles, 
  ArrowRight, 
  ExternalLink, 
  Palmtree, 
  Filter,
  Plane,
  HeartPulse,
  Database,
  Server
} from "lucide-react";

interface PageInventoryItem {
  id: string;
  name: string;
  area: '1. Public Website' | '2. Patient Onboarding' | '3. Patient Portal' | '4. Hospital Portal' | '5. Doctor Portal' | '6. Platform Operations (Super Admin)' | '7. Shared / Cross-Cutting';
  purpose: string;
  keralaContext: string;
  status: 'Ready' | 'In Prototype';
  route: string;
}

export const PAGE_INVENTORY: PageInventoryItem[] = [
  // 1. Public Website (23 Core Public Screens matching Master Requirements Module 1)
  { id: 'pub-1', name: 'Homepage (/)', area: '1. Public Website', purpose: 'First impression of MAIDES — hero, 10-step Kerala patient journey, 12 specialties, trust signals (NABH/JCI, 14 districts, 3 airports), and dual CTAs.', keralaContext: 'Positioned exclusively around Kerala quaternary care + Ayurveda.', status: 'Ready', route: '/' },
  { id: 'pub-2', name: 'About MAIDES (/about)', area: '1. Public Website', purpose: 'Mission, vision, patient-first approach, healthcare coordination, and travel assistance philosophy.', keralaContext: 'Highlights personal coordination in Kerala, India.', status: 'Ready', route: '/#about' },
  { id: 'pub-3', name: 'Treatments Directory (/treatments)', area: '1. Public Website', purpose: 'Searchable treatment directory filtered by specialty (Cardiology, Orthopaedics, Oncology, Transplants, etc.).', keralaContext: 'Kerala pricing benchmarks vs US/GCC healthcare costs.', status: 'Ready', route: '/#treatments' },
  { id: 'pub-4', name: 'Treatment Detail Page (/treatments/[slug])', area: '1. Public Website', purpose: 'Explains specific procedure, conditions treated, preparation, recovery window, related doctors & hospital options.', keralaContext: 'Doctor and hospital pairings across Kochi, Trivandrum, Kottayam, Kozhikode.', status: 'Ready', route: '/#treatments' },
  { id: 'pub-5', name: 'Medical Specialties (/specialties)', area: '1. Public Website', purpose: '12 standard clinical specialties in Kerala with accredited specialist rosters.', keralaContext: 'Includes Classical Ayurveda & Panchakarma alongside surgical robotics.', status: 'Ready', route: '/#treatments' },
  { id: 'pub-6', name: 'Kerala Hospitals Directory (/hospitals)', area: '1. Public Website', purpose: 'Searchable, filterable list of verified Kerala hospitals by district, accreditation (NABH/JCI), and specialty.', keralaContext: 'Covers Ernakulam, Trivandrum, Kozhikode, Kottayam, Thrissur, Malappuram.', status: 'Ready', route: '/#hospitals' },
  { id: 'pub-7', name: 'Hospital Profile Page (/hospitals/[slug])', area: '1. Public Website', purpose: 'Hospital overview, international patient suites, clinical team, emergency facilities, and enquiry CTA.', keralaContext: 'Profiles for Aster Medcity, Rajagiri, KIMSHEALTH, BMH, Caritas.', status: 'Ready', route: '/#hospitals' },
  { id: 'pub-8', name: 'Doctor Directory (/doctors)', area: '1. Public Website', purpose: 'Searchable list of specialists filterable by specialty, language, hospital, and Kerala district.', keralaContext: 'Chief cardiac surgeons, robotic joint directors, Ashtavaidya Vaidyas.', status: 'Ready', route: '/#doctors' },
  { id: 'pub-9', name: 'Doctor Profile Page (/doctors/[slug])', area: '1. Public Website', purpose: 'Credentials, experience (FRCS, AIIMS, American Board), languages, consultation fees, and appointment request.', keralaContext: 'Senior clinician profiles across Kerala healthcare hubs.', status: 'Ready', route: '/#doctors' },
  { id: 'pub-10', name: '14-District Medical Destinations (/locations)', area: '1. Public Website', purpose: 'Orients international visitors to healthcare, travel, and recovery in South, Central, and North Kerala.', keralaContext: 'Covers Kochi, Trivandrum, Kozhikode, Kottayam, Malappuram, Wayanad, etc.', status: 'Ready', route: '/destinations' },
  { id: 'pub-11', name: 'Location Detail Page (/locations/[slug])', area: '1. Public Website', purpose: 'Medical tourism overview for a specific district: hospitals, specialists, hotel accommodations, and attractions.', keralaContext: 'Comprehensive district guide with airport links (COK, TRV, CCJ).', status: 'Ready', route: '/destinations' },
  { id: 'pub-12', name: 'International Patients Portal (/international-patients)', area: '1. Public Website', purpose: 'Dedicated guide for overseas patients: before travel, arrival, treatment, family support, visa guidelines & documents.', keralaContext: 'Tailored for GCC (UAE, Saudi, Qatar, Oman), Maldives, UK, USA, Africa & NRIs.', status: 'Ready', route: '/portal' },
  { id: 'pub-13', name: 'Medical Travel Services (/medical-travel)', area: '1. Public Website', purpose: 'Full suite of travel support: airport meet-and-greet, limousine transfers, language translators, 5-star recovery resorts.', keralaContext: 'Cochin, Trivandrum, Calicut airport desk logistics.', status: 'Ready', route: '/destinations' },
  { id: 'pub-14', name: 'Ayurveda & Panchakarma Vertical (/ayurveda)', area: '1. Public Website', purpose: 'Classical healing portal for Arya Vaidya Sala Kottakkal, Ashtamudi & Kumarakom healing packages.', keralaContext: 'Centuries-old Ashtavaidya protocols & herbal oil rehabilitation.', status: 'Ready', route: '/#ayurveda' },
  { id: 'pub-15', name: 'Medical Tourism Packages (/packages)', area: '1. Public Website', purpose: 'Essential Medical Travel, Premium Medical Travel, and International Patient Support packages.', keralaContext: 'Bundles surgical stay + 5-star backwater resort + airport limousine.', status: 'Ready', route: '/#treatments' },
  { id: 'pub-16', name: 'Healthcare Blog & Articles (/blog)', area: '1. Public Website', purpose: 'Medical tourism news, patient recovery guides, doctor interviews, and Kerala travel advice.', keralaContext: 'High-authority healthcare articles for organic search acquisition.', status: 'Ready', route: '/proposal' },
  { id: 'pub-17', name: 'Blog Detail Page (/blog/[slug])', area: '1. Public Website', purpose: 'Full article layout with author bio, medical review badge, related treatments, and enquiry CTA.', keralaContext: 'Schema markup for medical news and SEO.', status: 'Ready', route: '/proposal' },
  { id: 'pub-18', name: 'Frequently Asked Questions (/faq)', area: '1. Public Website', purpose: 'Searchable accordion FAQ categorised by Medical Tourism, Travel, Appointments, Documents, and Ayurveda.', keralaContext: 'Addresses Kerala medical visa process, currency, weather, and hospital safety.', status: 'Ready', route: '/#faq' },
  { id: 'pub-19', name: 'Contact MAIDES (/contact)', area: '1. Public Website', purpose: 'Contact details: 24/7 hotline, Infopark Kochi office address, WhatsApp link, and contact submission form.', keralaContext: 'Direct escalation to Kerala clinical operations desk.', status: 'Ready', route: '/' },
  { id: 'pub-20', name: 'Dedicated Medical Enquiry Page (/medical-enquiry)', area: '1. Public Website', purpose: '6-step high-converting enquiry form: Personal -> Treatment -> Medical -> Travel -> Upload -> Consent.', keralaContext: 'Generates instant MAIDES tracking ID (e.g. MAI-2026-000123).', status: 'Ready', route: '/' },
  { id: 'pub-21', name: 'Privacy Policy (/privacy-policy)', area: '1. Public Website', purpose: 'Data governance, zero-knowledge encryption protocols, and Indian DPDP Act / HIPAA compliance.', keralaContext: 'Strict medical records privacy guarantee.', status: 'Ready', route: '/proposal' },
  { id: 'pub-22', name: 'Terms & Conditions (/terms)', area: '1. Public Website', purpose: 'Platform terms of use, coordination scope, cancellation rules, and payment policies.', keralaContext: 'Defines patient-coordinator relationship in Kerala.', status: 'Ready', route: '/proposal' },
  { id: 'pub-23', name: 'Medical Disclaimer (/medical-disclaimer)', area: '1. Public Website', purpose: 'Explicit disclaimer that MAIDES is a coordination platform and does not directly practice medicine.', keralaContext: 'Clarifies clinical accountability of treating Kerala hospitals.', status: 'Ready', route: '/proposal' },

  // 2. Patient Onboarding & Authentication (Module 2)
  { id: 'onb-1', name: 'Patient Registration (/register)', area: '2. Patient Onboarding', purpose: 'Capture patient essentials: name, email, phone, country, password, and data processing consent.', keralaContext: 'Supports GCC, USA, UK, Europe, Africa & NRI patients.', status: 'Ready', route: '/portal' },
  { id: 'onb-2', name: 'Patient Login (/login)', area: '2. Patient Onboarding', purpose: 'Secure authentication via email/password or passwordless OTP with HTTP-only secure cookies.', keralaContext: 'Zero-trust authentication to access medical records.', status: 'Ready', route: '/portal' },
  { id: 'onb-3', name: 'Forgot / Reset Password (/forgot-password)', area: '2. Patient Onboarding', purpose: 'Self-service account recovery via signed email link or SMS verification code.', keralaContext: 'Automated recovery without exposing patient credentials.', status: 'Ready', route: '/portal' },
  { id: 'onb-4', name: 'Verify Identity & Email (/verify-email)', area: '2. Patient Onboarding', purpose: 'One-time token validation to activate patient account and protect medical files.', keralaContext: 'Ensures verified patient communication channels.', status: 'Ready', route: '/portal' },

  // 3. Patient Portal (Modules 4, 8, 13, 14, 15, 20, 21, 30)
  { id: 'pat-1', name: 'Patient Dashboard (/portal)', area: '3. Patient Portal', purpose: 'Overview card hub: current journey stage, active enquiry, upcoming appointments, coordinator & unread messages.', keralaContext: 'Central command for patient during their Kerala stay.', status: 'Ready', route: '/portal' },
  { id: 'pat-2', name: 'My Profile & Medical Summary (/portal/profile)', area: '3. Patient Portal', purpose: 'Manage demographic information, emergency contact, passport details, and chronic health summary.', keralaContext: 'Used by Kerala hospital admitting offices.', status: 'Ready', route: '/portal' },
  { id: 'pat-3', name: 'My Enquiries & Quotations (/portal/enquiries)', area: '3. Patient Portal', purpose: 'View all submitted medical requests, compare 3-tier hospital quotations (Value/Standard/VIP), and track status.', keralaContext: 'Compares Aster Medcity, Rajagiri, KIMSHEALTH quotes.', status: 'Ready', route: '/portal' },
  { id: 'pat-4', name: 'Enquiry Detail View (/portal/enquiries/[id])', area: '3. Patient Portal', purpose: 'Status timeline (New -> Under Review -> Arrived -> Completed), hospital estimates, and doctor notes.', keralaContext: 'Displays assigned Kerala care coordinator.', status: 'Ready', route: '/portal' },
  { id: 'pat-5', name: 'Medical Documents Vault (/portal/documents)', area: '3. Patient Portal', purpose: 'Upload and manage DICOM scans, blood tests, prescriptions with temporary signed S3 download URLs.', keralaContext: 'End-to-end encrypted storage for Kerala specialist review.', status: 'Ready', route: '/portal' },
  { id: 'pat-6', name: 'Appointments & Teleconsultation (/portal/appointments)', area: '3. Patient Portal', purpose: 'List confirmed hospital admissions and pre-travel WebRTC video consultations with Kerala chief surgeons.', keralaContext: 'Integrated video room with screen sharing for DICOM scans.', status: 'Ready', route: '/portal' },
  { id: 'pat-7', name: 'Visual Treatment Journey (/portal/journey)', area: '3. Patient Portal', purpose: '10-stage visual stepper from enquiry to fit-to-fly sign-off and 12-month post-discharge follow-up.', keralaContext: 'Clear visual transparency on treatment progression.', status: 'Ready', route: '/portal' },
  { id: 'pat-8', name: 'Travel & Concierge Desk (/portal/travel)', area: '3. Patient Portal', purpose: 'Flight details, airport pickup status (COK/TRV/CCJ), driver details, hotel vouchers, and eVisa invitation.', keralaContext: 'Kerala Medical eVisa letter download in 4 hours.', status: 'Ready', route: '/portal' },
  { id: 'pat-9', name: 'Accommodation Manager (/portal/accommodation)', area: '3. Patient Portal', purpose: 'Hotel bookings, resort check-in dates, room types, and proximity to the hospital.', keralaContext: 'Options from hospital guest suites to 5-star backwater villas.', status: 'Ready', route: '/portal' },
  { id: 'pat-10', name: 'Direct Coordinator Messaging (/portal/messages)', area: '3. Patient Portal', purpose: 'Chat with assigned Kerala medical coordinator and travel desk with attachment support.', keralaContext: 'Direct real-time WhatsApp & platform sync.', status: 'Ready', route: '/portal' },
  { id: 'pat-11', name: 'Notifications Center (/portal/notifications)', area: '3. Patient Portal', purpose: 'Real-time alerts for quotation arrivals, appointment confirmations, driver updates, and reminders.', keralaContext: 'In-app and email notification feed.', status: 'Ready', route: '/portal' },

  // 4. Hospital & Doctor Portals (Modules 11, 12, 13)
  { id: 'hosp-1', name: 'Hospital Triage & Quotation Desk (/hospital)', area: '4. Hospital Portal', purpose: 'Hospital partner interface to review incoming patient dossiers, view DICOM scans, and submit cost estimates.', keralaContext: 'Used by Aster, Rajagiri, KIMSHEALTH international offices.', status: 'Ready', route: '/hospital' },
  { id: 'hosp-2', name: 'Doctor Consultation Suite (/hospital/consultation)', area: '4. Hospital Portal', purpose: 'Chief surgeon video room, clinical recommendation notes, and pre-op clearance sign-off.', keralaContext: 'Direct tele-review between Kerala specialist and international patient.', status: 'Ready', route: '/hospital' },

  // 5. Admin & Staff CRM (Modules 3, 6, 7, 31, 32, 33, 34, 35)
  { id: 'adm-1', name: 'Executive Admin Dashboard (/admin)', area: '6. Platform Operations (Super Admin)', purpose: 'Key metrics: total patients, new enquiries, active leads, hospital SLAs, conversion rate, and revenue pipeline.', keralaContext: 'Command center for Kerala medical tourism operations.', status: 'Ready', route: '/admin' },
  { id: 'adm-2', name: 'Patient Pipeline Kanban (/admin/leads)', area: '6. Platform Operations (Super Admin)', purpose: 'CRM pipeline: New -> Contacted -> Qualified -> Follow-up -> Converted -> Lost with multi-filter.', keralaContext: 'Tracks patient corridors from UAE, Saudi, Qatar, USA, UK, Africa.', status: 'Ready', route: '/admin' },
  { id: 'adm-3', name: 'Enquiry Management & Triage (/admin/enquiries)', area: '6. Platform Operations (Super Admin)', purpose: 'Review patient submissions, assign staff, request documents, and manage hospital quotation workflow.', keralaContext: 'SLA countdown timers (<2 hr response target).', status: 'Ready', route: '/admin' },
  { id: 'adm-4', name: 'Follow-Up Management Desk (/admin/followups)', area: '6. Platform Operations (Super Admin)', purpose: 'Schedule, assign, and track patient follow-up calls, WhatsApp reminders, and quotation check-ins.', keralaContext: 'Ensures no high-value patient inquiry is missed.', status: 'Ready', route: '/admin' },
  { id: 'adm-5', name: 'Hospital Network Management (/admin/hospitals)', area: '6. Platform Operations (Super Admin)', purpose: 'Add/edit hospitals, manage accreditations (NABH/JCI), specialties, and international patient desk contacts.', keralaContext: 'Covers hospitals across all 14 Kerala districts.', status: 'Ready', route: '/admin' },
  { id: 'adm-6', name: 'Doctor Specialist Roster (/admin/doctors)', area: '6. Platform Operations (Super Admin)', purpose: 'Verify senior clinicians, manage qualifications, consultation rates, and hospital affiliations.', keralaContext: 'Kerala Medical Council registered specialists.', status: 'Ready', route: '/admin' },
  { id: 'adm-7', name: 'Treatment & Content Manager (/admin/treatments)', area: '6. Platform Operations (Super Admin)', purpose: 'CRUD management for treatments, procedures, pricing estimates, SEO titles, and meta descriptions.', keralaContext: 'Maintains Kerala healthcare pricing benchmarks.', status: 'Ready', route: '/admin' },
  { id: 'adm-8', name: 'Travel & Logistics Operations (/admin/travel)', area: '6. Platform Operations (Super Admin)', purpose: 'Master log of all international airport arrivals at COK, TRV, CCJ, driver dispatches, and hotel stays.', keralaContext: 'Fleet management for VIP patient airport transfers.', status: 'Ready', route: '/admin' },
  { id: 'adm-9', name: 'Staff & Role Management (/admin/staff)', area: '6. Platform Operations (Super Admin)', purpose: 'RBAC: Super Admin, Admin, Medical Coordinator, Travel Coordinator, Support Agent, Content Manager.', keralaContext: 'Multi-role operational access control.', status: 'Ready', route: '/admin' },
  { id: 'adm-10', name: 'Analytics & Reporting Desk (/admin/reports)', area: '6. Platform Operations (Super Admin)', purpose: 'Patient origin corridors, conversion rates, treatment demand, and exportable CSV/PDF reports.', keralaContext: 'Analyzes high-yield medical travel corridors to Kerala.', status: 'Ready', route: '/admin' },
  { id: 'adm-11', name: 'Platform Audit Logs & Security Center (/admin/audit)', area: '6. Platform Operations (Super Admin)', purpose: 'Tracks all data access, medical document downloads, consent updates, and administrative changes.', keralaContext: 'DPDP / HIPAA compliance audit trail.', status: 'Ready', route: '/admin' },
  { id: 'adm-12', name: 'Site Settings & SEO Engine (/admin/settings)', area: '6. Platform Operations (Super Admin)', purpose: 'Configure brand assets, WhatsApp API credentials, SMTP settings, default SEO metadata, and legal policies.', keralaContext: 'Global settings for MAIDES Kerala platform.', status: 'Ready', route: '/admin' },

  // 6. Shared Components & Modals (Module 12)
  { id: 'shr-1', name: 'Global Header & Navigation', area: '7. Shared / Cross-Cutting', purpose: 'Global brand header with language selector, emergency contact, and Get Medical Assistance CTA.', keralaContext: 'Consistent Madies healthcare design across all screens.', status: 'Ready', route: '/' },
  { id: 'shr-2', name: 'Royal Blue Footer & Disclaimer', area: '7. Shared / Cross-Cutting', purpose: 'Accreditation badges, emergency contacts, 14-district sitemap, legal links, and medical disclaimer.', keralaContext: 'Full Kerala medical tourism resource directory.', status: 'Ready', route: '/' },
  { id: 'shr-3', name: 'AI Intake & Medical Triage Modal', area: '7. Shared / Cross-Cutting', purpose: '4-step universal intake modal allowing visitors to submit medical enquiry and scans from any page.', keralaContext: 'Captures Kerala district preference & DICOM scans.', status: 'Ready', route: '/' },
  { id: 'shr-4', name: 'Concierge Chat & WhatsApp Drawer', area: '7. Shared / Cross-Cutting', purpose: 'Instant access to human care coordinator (Anjali Menon) with live chat and direct WhatsApp link.', keralaContext: 'Available globally across all pages.', status: 'Ready', route: '/' }
];

export function PageInventoryView() {
  const [selectedArea, setSelectedArea] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const areas = [
    'All',
    '1. Public Website',
    '2. Patient Onboarding',
    '3. Patient Portal',
    '4. Hospital Portal',
    '6. Platform Operations (Super Admin)',
    '7. Shared / Cross-Cutting'
  ];

  const filteredItems = PAGE_INVENTORY.filter((item) => {
    const matchesArea = selectedArea === 'All' || item.area === selectedArea;
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.keralaContext.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArea && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-24">
      
      {/* Header with Madies Blue Theme */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0E82FD] px-2.5 py-0.5 rounded-full bg-blue-50 border border-blue-200">
                  MAIDES Master Module Specification
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                  {PAGE_INVENTORY.length} Complete Functional Screens
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[#0F2042] mt-2">
                MAIDES — Complete Module & Requirements Inventory
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Every screen, public page, patient portal desk, hospital triage room, and Super Admin CRM surface mapped to the master specification.
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Link 
                href="/proposal" 
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Technical Blueprint
              </Link>
              <Link 
                href="/" 
                className="px-4 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-xs font-bold text-white shadow-md shadow-blue-500/20 transition-all"
              >
                Live Public Website
              </Link>
            </div>
          </div>

          {/* Area Filters */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-100 overflow-x-auto">
            {areas.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                  selectedArea === area
                    ? 'bg-[#0E82FD] text-white shadow-md shadow-blue-500/20'
                    : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center space-x-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search across all MAIDES modules, screens, routes, and requirements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          <span className="text-xs font-bold text-[#0E82FD] shrink-0">
            {filteredItems.length} Screens Found
          </span>
        </div>

        {/* Inventory Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-[#0E82FD] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {item.id}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    ✓ {item.status}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-[#0F2042]">{item.name}</h3>
                  <span className="text-[11px] text-slate-400 font-semibold">{item.area}</span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {item.purpose}
                </p>

                <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-600">
                  <strong className="text-slate-800">Kerala Context: </strong>
                  {item.keralaContext}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-slate-500">{item.route}</span>
                <Link
                  href={item.route}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-[#0E82FD] hover:text-blue-700 transition-colors"
                >
                  <span>Open Screen</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}
