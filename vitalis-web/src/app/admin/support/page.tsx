"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  LifeBuoy, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  MessageSquare, 
  ArrowRight, 
  Eye, 
  Edit, 
  Trash2, 
  X, 
  Send, 
  User, 
  Shield, 
  AlertTriangle, 
  Paperclip, 
  FileText, 
  Download, 
  RotateCcw, 
  Check, 
  Tag, 
  Calendar, 
  Building2, 
  UserCheck,
  ChevronRight,
  MoreVertical,
  SlidersHorizontal,
  Flame,
  CheckCircle,
  HelpCircle,
  Plane,
  CreditCard,
  HeartPulse,
  Sparkles
} from "lucide-react";

export type TicketStatus = "Open" | "In Progress" | "Waiting for Patient" | "Resolved" | "Closed";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";

export interface TicketReply {
  id: string;
  sender: string;
  role: "Admin" | "Patient" | "Coordinator";
  message: string;
  timestamp: string;
  attachments?: { name: string; size: string }[];
}

export interface SupportTicket {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientCountry?: string;
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt?: string;
  attachmentName?: string;
  replies: TicketReply[];
  internalNotes: string[];
}

const DEFAULT_ADMIN_TICKETS: SupportTicket[] = [
  {
    id: "TCK-801",
    patientId: "pat-101",
    patientName: "Sarah Jenkins",
    patientEmail: "sarah.jenkins@example.com",
    patientCountry: "United Kingdom",
    category: "Travel & Airport Logistics",
    subject: "Requesting wheelchair accessible airport vehicle",
    description: "I will be arriving via EK 530 at Cochin International Airport and require ramp/wheelchair transfer directly to Aster Medcity.",
    priority: "High",
    status: "In Progress",
    assignedTo: "Rahul Nair (Travel Desk)",
    createdAt: "2026-09-04 08:30",
    updatedAt: "2026-09-04 09:15",
    attachmentName: "emirates_flight_ticket.pdf",
    replies: [
      {
        id: "REP-1",
        sender: "Sarah Jenkins",
        role: "Patient",
        message: "I will be arriving via EK 530 at Cochin International Airport and require ramp/wheelchair transfer directly to Aster Medcity. Please let me know the contact number of the chauffeur once assigned.",
        timestamp: "2026-09-04 08:30"
      },
      {
        id: "REP-2",
        sender: "Rahul Nair (Admin Coordinator)",
        role: "Coordinator",
        message: "A specialized wheelchair accessible Toyota Innova has been reserved. Chauffeur details: Mr. Sajan (+91 98471 00223). He will meet you at Terminal 3 Arrival Gate 4 with a MAIDES placard.",
        timestamp: "2026-09-04 09:15"
      }
    ],
    internalNotes: [
      "Aster Medcity emergency department notified for stretcher standby upon arrival."
    ]
  },
  {
    id: "TCK-800",
    patientId: "pat-102",
    patientName: "Mohammed Al-Maktoum",
    patientEmail: "m.maktoum@example.ae",
    patientCountry: "United Arab Emirates",
    category: "Billing & Invoices",
    subject: "Tax residency certificate clarification for forex wire",
    description: "Our bank in Dubai requested Kerala hospital FRRO registration number before releasing the international escrow wire.",
    priority: "Medium",
    status: "Open",
    assignedTo: "Finance Team (Anjali Pillai)",
    createdAt: "2026-09-03 15:45",
    updatedAt: "2026-09-03 15:50",
    attachmentName: "uae_remittance_guidelines.pdf",
    replies: [
      {
        id: "REP-3",
        sender: "Mohammed Al-Maktoum",
        role: "Patient",
        message: "Our bank in Dubai requested Kerala hospital FRRO registration number before releasing the international escrow wire. Attached our bank's standard foreign remittance form.",
        timestamp: "2026-09-03 15:45"
      }
    ],
    internalNotes: [
      "Hospital accounts desk shared Form 15CA/CB documentation."
    ]
  },
  {
    id: "TCK-799",
    patientId: "pat-104",
    patientName: "David Miller",
    patientEmail: "david.miller@austech.com.au",
    patientCountry: "Australia",
    category: "Medical Case & Doctor Review",
    subject: "Pre-surgery cardiology clearance submission",
    description: "Forwarding latest 24h Holter monitor reports from Sydney for Dr. Vijay Anand's review.",
    priority: "High",
    status: "Resolved",
    assignedTo: "Clinical Liaison Desk",
    createdAt: "2026-09-01 11:20",
    updatedAt: "2026-09-02 14:10",
    attachmentName: "holter_ecg_sydney.pdf",
    replies: [
      {
        id: "REP-4",
        sender: "David Miller",
        role: "Patient",
        message: "Forwarding latest 24h Holter monitor reports from Sydney for Dr. Vijay Anand's review.",
        timestamp: "2026-09-01 11:20"
      },
      {
        id: "REP-5",
        sender: "Clinical Liaison (Dr. Lakshmi)",
        role: "Coordinator",
        message: "Dr. Vijay Anand has evaluated the Holter ECG. Sinus rhythm is stable; patient cleared for minimally invasive arthroscopy.",
        timestamp: "2026-09-02 14:10"
      }
    ],
    internalNotes: [
      "Anaesthesia team pre-cleared."
    ]
  }
];

export default function SupportTicketsAdminPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Interaction State
  const [replyText, setReplyText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"thread" | "notes">("thread");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick Preset Replies
  const QUICK_TEMPLATES = [
    "Thank you for contacting MAIDES. Your coordinator has been assigned and is verifying your flight details.",
    "Your hospital admission and doctor consultation are confirmed. Chauffeur will meet you at Kochi Airport Terminal 3.",
    "The required hospital invoice and FRRO invitation documents have been uploaded to your document locker.",
    "We have reviewed your inquiry and marked this ticket as resolved. Please reach out anytime if further assistance is needed!"
  ];

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maides_shared_support_tickets_v3");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTickets(parsed);
        if (parsed.length > 0) setSelectedTicket(parsed[0]);
      } else {
        setTickets(DEFAULT_ADMIN_TICKETS);
        setSelectedTicket(DEFAULT_ADMIN_TICKETS[0]);
        localStorage.setItem("maides_shared_support_tickets_v3", JSON.stringify(DEFAULT_ADMIN_TICKETS));
      }
    } catch (e) {
      setTickets(DEFAULT_ADMIN_TICKETS);
      setSelectedTicket(DEFAULT_ADMIN_TICKETS[0]);
    }
  }, []);

  const saveTickets = (data: SupportTicket[]) => {
    setTickets(data);
    localStorage.setItem("maides_shared_support_tickets_v3", JSON.stringify(data));
    if (selectedTicket) {
      const updatedSel = data.find(t => t.id === selectedTicket.id) || null;
      setSelectedTicket(updatedSel);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.replies]);

  // Filter Logic
  const filteredTickets = tickets.filter(t => {
    const matchSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.status.toUpperCase() === statusFilter.toUpperCase();
    const matchPriority = priorityFilter === "ALL" || t.priority.toUpperCase() === priorityFilter.toUpperCase();
    const matchCategory = categoryFilter === "ALL" || t.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  // Send Admin Reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newReply: TicketReply = {
      id: "REP-" + Date.now(),
      sender: "MAIDES Admin Coordinator",
      role: "Coordinator",
      message: replyText.trim(),
      timestamp: timeStr
    };

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: "Waiting for Patient" as TicketStatus,
          updatedAt: timeStr,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    });

    saveTickets(updated);
    setReplyText("");
  };

  // Add Internal Staff Note
  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!internalNoteText.trim() || !selectedTicket) return;

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          internalNotes: [...(t.internalNotes || []), internalNoteText.trim()]
        };
      }
      return t;
    });

    saveTickets(updated);
    setInternalNoteText("");
  };

  // Update Status
  const handleStatusChange = (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const updated = tickets.map(t => t.id === selectedTicket.id ? { ...t, status: newStatus, updatedAt: timeStr } : t);
    saveTickets(updated);
  };

  // Update Priority
  const handlePriorityChange = (newPriority: TicketPriority) => {
    if (!selectedTicket) return;
    const updated = tickets.map(t => t.id === selectedTicket.id ? { ...t, priority: newPriority } : t);
    saveTickets(updated);
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "Critical":
        return "bg-rose-500/15 text-rose-400 border border-rose-500/30";
      case "High":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "Medium":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      default:
        return "bg-slate-800 text-slate-400 border border-slate-700";
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return "bg-blue-500/15 text-blue-400 border border-blue-500/30";
      case "In Progress":
        return "bg-amber-500/15 text-amber-400 border border-amber-500/30";
      case "Waiting for Patient":
        return "bg-purple-500/15 text-purple-400 border border-purple-500/30";
      case "Resolved":
        return "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30";
      default:
        return "bg-slate-800 text-slate-400 border border-slate-700";
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4 text-blue-400" />
            MAIDES Patient Support Operations & Live Escalation Desk
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Support Tickets & Escalation Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
            Manage inquiries, assign medical coordinators, resolve patient tickets, and synchronize bidirectional updates with patients in real time.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#0E82FD] to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      {/* Modern Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Registered Cases</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><LifeBuoy className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-white mt-3">{tickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-1">Global medical tourism tracking</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Open & In Progress</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-3">
            {tickets.filter(t => t.status === "Open" || t.status === "In Progress").length}
          </div>
          <div className="text-[11px] text-amber-500/80 mt-1">Requires coordinator attention</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Waiting for Patient</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><UserCheck className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-purple-400 mt-3">
            {tickets.filter(t => t.status === "Waiting for Patient").length}
          </div>
          <div className="text-[11px] text-purple-400/80 mt-1">Awaiting traveler reply/docs</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Resolved & Closed</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-3">
            {tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-1 flex items-center gap-1">
            <Check className="w-3 h-3" /> Successfully concluded
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Ticket Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[760px] bg-slate-950/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Left Pane: Ticket Queue & Filters (5 cols) */}
        <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col justify-between bg-slate-950/70">
          
          {/* Search and Filters Header */}
          <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-900/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket ID, patient, subject, email..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-medium text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Status</option>
                <option value="OPEN">Open</option>
                <option value="IN PROGRESS">In Progress</option>
                <option value="WAITING FOR PATIENT">Waiting</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>

              <select
                value={priorityFilter}
                onChange={e => setPriorityFilter(e.target.value)}
                className="px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-medium text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Priority</option>
                <option value="CRITICAL">Critical</option>
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>

              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="px-2.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-[11px] font-medium text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Topics</option>
                <option value="TRAVEL & AIRPORT LOGISTICS">Travel</option>
                <option value="BILLING & INVOICES">Billing</option>
                <option value="MEDICAL CASE & DOCTOR REVIEW">Medical</option>
              </select>
            </div>
          </div>

          {/* Ticket Queue List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">
                No tickets match your filter criteria.
              </div>
            ) : (
              filteredTickets.map(t => {
                const isSelected = selectedTicket && selectedTicket.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-4 rounded-2xl transition-all flex flex-col gap-2.5 ${
                      isSelected 
                        ? "bg-slate-900 border border-blue-500/40 shadow-lg shadow-blue-500/5" 
                        : "hover:bg-slate-900/60 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                          {t.id}
                        </span>
                        <span className="font-bold text-xs text-white truncate max-w-[140px]">{t.patientName}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getPriorityBadge(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">
                      {t.subject}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="truncate max-w-[160px] text-slate-400 flex items-center gap-1">
                        <Tag className="w-3 h-3 text-slate-500" />
                        {t.category}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Bottom Live Sync Indicator */}
          <div className="p-3.5 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span className="flex items-center gap-1.5 font-medium text-slate-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              Patient-Isolated Ticket Vault
            </span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Live Synchronized
            </span>
          </div>
        </div>

        {/* Right Pane: Selected Ticket Thread & Action Studio (7 cols) */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/40">
          {selectedTicket ? (
            <>
              {/* Ticket Top Header & Action Controls */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h2 className="text-base font-bold text-white">{selectedTicket.subject}</h2>
                      <span className="font-mono text-xs text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                        {selectedTicket.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span>Patient: <strong className="text-white font-semibold">{selectedTicket.patientName}</strong></span>
                      <span>•</span>
                      <span>{selectedTicket.patientEmail}</span>
                      <span>•</span>
                      <span>{selectedTicket.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status Dropdown */}
                    <select
                      value={selectedTicket.status}
                      onChange={e => handleStatusChange(e.target.value as any)}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-bold shadow-sm"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Patient">Waiting for Patient</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>

                    {/* Priority Dropdown */}
                    <select
                      value={selectedTicket.priority}
                      onChange={e => handlePriorityChange(e.target.value as any)}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500 font-bold shadow-sm"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Sub-Header Metadata Chips */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <div className="flex items-center gap-3">
                    <span>Category: <strong className="text-slate-200">{selectedTicket.category}</strong></span>
                    <span>•</span>
                    <span>Assigned: <strong className="text-blue-400">{selectedTicket.assignedTo}</strong></span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveTab("thread")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "thread" ? "bg-blue-600 text-white" : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      Conversation Thread ({selectedTicket.replies.length})
                    </button>
                    <button
                      onClick={() => setActiveTab("notes")}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        activeTab === "notes" ? "bg-amber-600/30 text-amber-300 border border-amber-500/30" : "bg-slate-900 text-slate-400 hover:text-white"
                      }`}
                    >
                      Staff Notes ({selectedTicket.internalNotes?.length || 0})
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Feed & Thread */}
              {activeTab === "thread" ? (
                <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-950/20 to-slate-900/10">
                  {selectedTicket.replies.map((rep) => {
                    const isAdmin = rep.role === "Coordinator" || rep.role === "Admin";
                    return (
                      <div
                        key={rep.id}
                        className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                      >
                        <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                          <span className="font-semibold text-slate-300">{rep.sender}</span>
                          <span>•</span>
                          <span>{rep.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                            isAdmin
                              ? "bg-gradient-to-r from-[#0E82FD] to-blue-600 text-white rounded-tr-none font-normal"
                              : "bg-slate-900 text-slate-200 border border-slate-800/80 rounded-tl-none font-normal"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{rep.message}</p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={chatBottomRef} />
                </div>
              ) : (
                /* Internal Staff Notes Tab */
                <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-950/60">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs text-amber-300 flex items-center gap-2 mb-2">
                    <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>Internal Staff Notes are strictly confidential and completely invisible to patients.</span>
                  </div>

                  {(!selectedTicket.internalNotes || selectedTicket.internalNotes.length === 0) ? (
                    <div className="p-8 text-center text-xs text-slate-500">
                      No internal notes recorded yet. Use the input below to log confidential clinical instructions.
                    </div>
                  ) : (
                    selectedTicket.internalNotes.map((note, idx) => (
                      <div key={idx} className="p-3.5 bg-slate-900 border border-slate-800 rounded-2xl text-xs text-slate-200 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                          <span>Internal Staff Note #{idx + 1}</span>
                          <span className="text-slate-500 font-normal">Confidential</span>
                        </div>
                        <p className="text-slate-300">{note}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Bottom Response Bar */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 space-y-2.5">
                
                {/* Quick Templates bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px]">
                  <span className="text-slate-500 font-bold uppercase shrink-0 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-blue-400" /> Quick Replies:
                  </span>
                  {QUICK_TEMPLATES.map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setReplyText(tpl)}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 whitespace-nowrap transition-all"
                    >
                      {tpl.substring(0, 32)}...
                    </button>
                  ))}
                </div>

                {activeTab === "thread" ? (
                  <form onSubmit={handleSendReply} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Type response to patient (press Enter to send)..."
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!replyText.trim()}
                      className="px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" /> Reply to Patient
                    </button>
                  </form>
                ) : (
                  <form onSubmit={handleAddInternalNote} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Add private staff note (hidden from patient)..."
                      value={internalNoteText}
                      onChange={e => setInternalNoteText(e.target.value)}
                      className="flex-1 px-4 py-2.5 bg-slate-950 border border-amber-500/30 rounded-xl text-xs text-amber-200 placeholder-slate-600 focus:outline-none focus:border-amber-500 transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!internalNoteText.trim()}
                      className="px-4 py-2.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-300 border border-amber-500/30 text-xs font-bold rounded-xl transition-all shrink-0"
                    >
                      Save Internal Note
                    </button>
                  </form>
                )}
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-xs text-slate-500">
              Select a support ticket from the left list to review its complete thread.
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Patient Support Ticket</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={e => {
              e.preventDefault();
              const form = e.target as any;
              const patientName = form.patientName.value;
              const subject = form.subject.value;
              const description = form.description.value;
              const category = form.category.value;
              const priority = form.priority.value;

              const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
              const newTicket: SupportTicket = {
                id: "TCK-" + Math.floor(810 + Math.random() * 100),
                patientId: "pat-" + Math.floor(100 + Math.random() * 900),
                patientName,
                patientEmail: "patient@example.com",
                category,
                subject,
                description,
                priority,
                status: "Open",
                assignedTo: "Care Coordinator Desk",
                createdAt: timeStr,
                updatedAt: timeStr,
                replies: [
                  {
                    id: "REP-" + Date.now(),
                    sender: "Admin Desk",
                    role: "Admin",
                    message: description,
                    timestamp: timeStr
                  }
                ],
                internalNotes: []
              };

              saveTickets([newTicket, ...tickets]);
              setSelectedTicket(newTicket);
              setIsCreateModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Patient Name</label>
                <input
                  name="patientName"
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Category</label>
                  <select
                    name="category"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Travel & Airport Logistics">Travel & Logistics</option>
                    <option value="Medical Case & Doctor Review">Medical Case</option>
                    <option value="Billing & Invoices">Billing & Escrow</option>
                    <option value="Visa & FRRO Assistance">Visa & FRRO</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Priority</label>
                  <select
                    name="priority"
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  name="subject"
                  type="text"
                  required
                  placeholder="e.g. Chauffeur pickup confirmation"
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Description / Inquiry</label>
                <textarea
                  name="description"
                  rows={3}
                  required
                  placeholder="Enter full inquiry details..."
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white resize-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold rounded-xl"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
