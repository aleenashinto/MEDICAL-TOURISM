"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Globe2, 
  DollarSign, 
  Clock, 
  ArrowUpRight, 
  Filter, 
  Search, 
  Plus, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Building2,
  TrendingUp,
  MessageSquare,
  BarChart3,
  MapPin,
  Sparkles,
  ArrowRight,
  Palmtree,
  Leaf
} from "lucide-react";
import { INITIAL_KERALA_CRM_LEADS, CRMLead } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export function AdminCRMView() {
  const [leads, setLeads] = useState<CRMLead[]>(INITIAL_KERALA_CRM_LEADS);
  const [selectedStage, setSelectedStage] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<'pipeline' | 'analytics' | 'geography'>('pipeline');

  const pipelineStages = [
    "All",
    "New Inquiry",
    "Clinical Review",
    "Quote Sent",
    "Consultation",
    "Visa & Travel",
    "Completed"
  ];

  const filteredLeads = leads.filter((lead) => {
    const matchesStage = selectedStage === "All" || lead.stage === selectedStage;
    const matchesSearch = 
      lead.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.treatment.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.targetDistrict.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStage && matchesSearch;
  });

  const totalEstimatedRevenueInr = leads.reduce((sum, l) => sum + l.estimatedRevenueInr, 0);
  const totalEstimatedRevenueUsd = Math.round(totalEstimatedRevenueInr / 88);

  const keralaCorridors = [
    { source: "UAE / GCC 🇦🇪", dest: "Kochi (Aster Medcity / Rajagiri 🌴)", inquiries: 540, consultations: 320, treatments: 154, revenueInr: 125000000, revenueUsd: 1420000 },
    { source: "Saudi Arabia 🇸🇦", dest: "Malappuram (Arya Vaidya Sala Kottakkal 🌿)", inquiries: 310, consultations: 195, treatments: 98, revenueInr: 45000000, revenueUsd: 510000 },
    { source: "United States 🇺🇸 / NRI", dest: "Kochi & Thrissur (Joint & Cardiac)", inquiries: 280, consultations: 145, treatments: 58, revenueInr: 68000000, revenueUsd: 772000 },
    { source: "United Kingdom 🇬🇧 / Europe", dest: "Thiruvananthapuram (Oncology & Kovalam)", inquiries: 190, consultations: 105, treatments: 46, revenueInr: 52000000, revenueUsd: 590000 },
    { source: "Africa (Nigeria/Kenya) 🌍", dest: "Kozhikode (BMH / MIMS Liver Care)", inquiries: 240, consultations: 130, treatments: 62, revenueInr: 74000000, revenueUsd: 840000 },
    { source: "Australia 🇦🇺 / Oman 🇴🇲", dest: "Kottayam & Palakkad (Ayurveda & Spine)", inquiries: 160, consultations: 95, treatments: 42, revenueInr: 32000000, revenueUsd: 363000 }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 pb-20">
      
      {/* Top Navigation with Madies Blue Accent */}
      <div className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#0E82FD] flex items-center justify-center font-bold">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-[#0F2042]">Kerala Concierge CRM & Operations Desk</h1>
                  <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0E82FD] border border-blue-200">
                    Live Platform Ops
                  </span>
                </div>
                <p className="text-xs text-slate-500">Super Admin Lead Pipeline • Multi-District Hospital SLA Triage</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Link 
                href="/proposal"
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
              >
                Commercial Blueprint
              </Link>
              <Link 
                href="/portal"
                className="px-4 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold shadow-md shadow-blue-500/20 transition-all"
              >
                Patient Portal
              </Link>
            </div>
          </div>

          {/* Sub Navigation */}
          <div className="flex space-x-2 mt-6 pt-4 border-t border-slate-100">
            {[
              { id: 'pipeline', label: 'Kerala Patient Pipeline' },
              { id: 'geography', label: 'International Corridors' },
              { id: 'analytics', label: 'Conversion & SLA Analytics' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
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

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* KPI Strip */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Active Kerala Pipeline</span>
            <div className="text-2xl font-black text-[#0F2042] mt-1">{leads.length} Inquiries</div>
            <span className="text-[10px] text-[#0E82FD] font-bold">14 districts represented</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Weighted Pipeline Value</span>
            <div className="text-2xl font-black text-[#0E82FD] mt-1">₹{(totalEstimatedRevenueInr / 100000).toFixed(1)} Lakhs</div>
            <span className="text-[10px] text-slate-500 font-bold">~${totalEstimatedRevenueUsd.toLocaleString()} USD</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Fast-Track eVisa Approvals</span>
            <div className="text-2xl font-black text-[#0F2042] mt-1">100% (4 hrs)</div>
            <span className="text-[10px] text-[#0E82FD] font-bold">Official hospital invite</span>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500">Top Destination District</span>
            <div className="text-2xl font-black text-[#0F2042] mt-1">Ernakulam (55%)</div>
            <span className="text-[10px] text-slate-500 font-bold">Followed by Malappuram (22%)</span>
          </div>
        </div>

        {/* TAB 1: PIPELINE */}
        {activeTab === 'pipeline' && (
          <div className="space-y-4">
            
            {/* Filters */}
            <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex flex-wrap gap-1.5">
                {pipelineStages.map((stage) => (
                  <button
                    key={stage}
                    onClick={() => setSelectedStage(stage)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                      selectedStage === stage
                        ? 'bg-[#0E82FD] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {stage}
                  </button>
                ))}
              </div>

              <div className="relative w-full md:w-64">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter leads..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD]"
                />
              </div>
            </div>

            {/* Table */}
            <div className="rounded-3xl bg-white border border-slate-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 border-b border-slate-200 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                    <tr>
                      <th className="p-4">Patient / Origin</th>
                      <th className="p-4">Treatment Required</th>
                      <th className="p-4">Kerala Destination</th>
                      <th className="p-4">Stage</th>
                      <th className="p-4">Est. Revenue</th>
                      <th className="p-4">Assigned Case Owner</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {filteredLeads.map((lead) => (
                      <tr key={lead.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <strong className="text-[#0F2042] block">{lead.patientName}</strong>
                          <span className="text-[11px] text-slate-500">{lead.country}</span>
                        </td>

                        <td className="p-4">
                          <span className="text-[#0F2042] font-semibold">{lead.treatment}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">ID: {lead.id}</span>
                        </td>

                        <td className="p-4">
                          <span className="text-[#0E82FD] font-bold">{lead.targetDistrict}</span>
                          <span className="text-[11px] text-slate-500 block">{lead.preferredHospital}</span>
                        </td>

                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-[#0E82FD] border border-blue-200">
                            {lead.stage}
                          </span>
                        </td>

                        <td className="p-4">
                          <strong className="text-[#0F2042]">₹{lead.estimatedRevenueInr.toLocaleString('en-IN')}</strong>
                          <span className="text-[10px] text-slate-500 block">~${lead.estimatedRevenueUsd}</span>
                        </td>

                        <td className="p-4">
                          <span className="text-slate-800">{lead.caseOwner}</span>
                        </td>

                        <td className="p-4 text-right">
                          <button 
                            onClick={() => alert(`Opening CRM file for ${lead.patientName}`)}
                            className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-[#0E82FD] hover:text-white text-slate-700 font-bold text-[11px] transition-colors"
                          >
                            Manage
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: GEOGRAPHY CORRIDORS */}
        {activeTab === 'geography' && (
          <div className="space-y-4">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#0F2042]">International Patient Corridors to Kerala</h2>
              <p className="text-xs text-slate-500">Key originating regions mapped to specialized Kerala medical districts.</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {keralaCorridors.map((c, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <strong className="text-sm font-bold text-[#0F2042]">{c.source}</strong>
                      <span className="text-xs font-bold text-[#0E82FD]">₹{(c.revenueInr / 10000000).toFixed(1)} Cr</span>
                    </div>

                    <div className="text-xs text-slate-600 font-semibold">
                      Destination: <span className="text-[#0E82FD]">{c.dest}</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-slate-200 text-xs">
                      <div className="p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">Inquiries</span>
                        <strong className="text-[#0F2042]">{c.inquiries}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">Video Consults</span>
                        <strong className="text-[#0E82FD]">{c.consultations}</strong>
                      </div>
                      <div className="p-2 rounded-lg bg-white border border-slate-100">
                        <span className="text-[10px] text-slate-400 block font-bold">Treated</span>
                        <strong className="text-[#0E82FD]">{c.treatments}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
