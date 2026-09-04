"use client";

import React, { useState, useEffect } from "react";
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
  UserCheck
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
  
  // Create Ticket Form State
  const [newTicketData, setNewTicketData] = useState({
    patientName: "",
    patientEmail: "",
    patientCountry: "United States",
    category: "Medical Case & Doctor Review",
    subject: "",
    description: "",
    priority: "Medium" as TicketPriority,
    assignedTo: "Care Coordinator Desk"
  });

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

  // Create New Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketData.patientName || !newTicketData.subject || !newTicketData.description) {
      alert("Please fill in patient name, subject, and description.");
      return;
    }

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newTicket: SupportTicket = {
      id: "TCK-" + Math.floor(800 + Math.random() * 200),
      patientId: "pat-" + Math.floor(100 + Math.random() * 900),
      patientName: newTicketData.patientName,
      patientEmail: newTicketData.patientEmail || "patient@example.com",
      patientCountry: newTicketData.patientCountry,
      category: newTicketData.category,
      subject: newTicketData.subject,
      description: newTicketData.description,
      priority: newTicketData.priority,
      status: "Open",
      assignedTo: newTicketData.assignedTo,
      createdAt: timeStr,
      updatedAt: timeStr,
      replies: [
        {
          id: "REP-" + Date.now(),
          sender: "Admin (Created on behalf of patient)",
          role: "Admin",
          message: newTicketData.description,
          timestamp: timeStr
        }
      ],
      internalNotes: []
    };

    saveTickets([newTicket, ...tickets]);
    setSelectedTicket(newTicket);
    setIsCreateModalOpen(false);
    setNewTicketData({
      patientName: "",
      patientEmail: "",
      patientCountry: "United States",
      category: "Medical Case & Doctor Review",
      subject: "",
      description: "",
      priority: "Medium",
      assignedTo: "Care Coordinator Desk"
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4" />
            MAIDES Support Ticket Operations & Resolution Hub
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Support Tickets & Escalation Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Unified ticketing system connecting international patients and care coordinators for clinical reviews, visa clearances, and logistics inquiries.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Create Support Ticket
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Total Active Tickets</div>
          <div className="text-2xl font-bold text-white mt-2">{tickets.length}</div>
          <div className="text-[11px] text-slate-500 mt-0.5">Across all healthcare tracks</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Open & In-Progress</div>
          <div className="text-2xl font-bold text-amber-400 mt-2">
            {tickets.filter(t => t.status === "Open" || t.status === "In Progress").length}
          </div>
          <div className="text-[11px] text-amber-500/80 mt-0.5">Requires coordinator action</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Waiting for Patient</div>
          <div className="text-2xl font-bold text-blue-400 mt-2">
            {tickets.filter(t => t.status === "Waiting for Patient").length}
          </div>
          <div className="text-[11px] text-blue-500/80 mt-0.5">Pending patient document upload</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-4 rounded-2xl">
          <div className="text-xs font-medium text-slate-400">Resolved & Closed</div>
          <div className="text-2xl font-bold text-emerald-400 mt-2">
            {tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length}
          </div>
          <div className="text-[11px] text-emerald-500/80 mt-0.5">Successfully concluded</div>
        </div>
      </div>

      {/* 2-Column Canvas */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[720px] bg-slate-950/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-sm">
        
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col justify-between bg-slate-950/60">
          
          {/* Filters Bar */}
          <div className="p-3.5 border-b border-slate-800 space-y-2.5 bg-slate-900/40">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket #, patient, subject..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-blue-500"
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
                className="px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-blue-500"
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
                className="px-2 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] text-slate-300 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Topics</option>
                <option value="TRAVEL & AIRPORT LOGISTICS">Travel</option>
                <option value="BILLING & INVOICES">Billing</option>
                <option value="MEDICAL CASE & DOCTOR REVIEW">Medical</option>
                <option value="VISA & FRRO ASSISTANCE">Visa</option>
              </select>
            </div>
          </div>

          {/* Tickets List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/50">
            {filteredTickets.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                No tickets match current filters.
              </div>
            ) : (
              filteredTickets.map(t => {
                const isSelected = selectedTicket && selectedTicket.id === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`w-full text-left p-4 hover:bg-slate-900/60 transition-all flex flex-col gap-2 ${
                      isSelected ? "bg-slate-900/90 border-l-4 border-[#0E82FD]" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-xs text-blue-400">{t.id}</span>
                        <span className="font-semibold text-xs text-white truncate">{t.patientName}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                        t.priority === "Critical" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20" :
                        t.priority === "High" ? "bg-amber-500/10 text-amber-400 border border-amber-500/20" :
                        "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                      }`}>
                        {t.priority}
                      </span>
                    </div>

                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">{t.subject}</div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className="truncate max-w-[180px]">{t.category}</span>
                      <span className={`px-2 py-0.5 rounded-md font-semibold ${
                        t.status === "Open" ? "bg-blue-500/10 text-blue-400" :
                        t.status === "In Progress" ? "bg-amber-500/10 text-amber-400" :
                        t.status === "Resolved" ? "bg-emerald-500/10 text-emerald-400" :
                        "bg-slate-800 text-slate-400"
                      }`}>
                        {t.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-900/50 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
            <span>{tickets.length} Registered Support Cases</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> Synchronized
            </span>
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Details */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/40">
          {selectedTicket ? (
            <>
              {/* Ticket Top Header & Actions */}
              <div className="p-5 border-b border-slate-800/80 bg-slate-900/50 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-base font-bold text-white">{selectedTicket.subject}</span>
                      <span className="font-mono text-xs text-blue-400 font-semibold bg-blue-500/10 px-2 py-0.5 rounded-md border border-blue-500/20">
                        {selectedTicket.id}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span>Patient: <strong className="text-white">{selectedTicket.patientName}</strong> ({selectedTicket.patientEmail})</span>
                      <span>•</span>
                      <span>Created: {selectedTicket.createdAt}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Status dropdown */}
                    <select
                      value={selectedTicket.status}
                      onChange={e => handleStatusChange(e.target.value as any)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Patient">Waiting for Patient</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>

                    {/* Priority dropdown */}
                    <select
                      value={selectedTicket.priority}
                      onChange={e => handlePriorityChange(e.target.value as any)}
                      className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-blue-500 font-semibold"
                    >
                      <option value="Critical">Critical</option>
                      <option value="High">High</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>
                </div>

                {/* Meta details bar */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                  <div>Category: <span className="text-white font-medium">{selectedTicket.category}</span></div>
                  <div>Assigned: <span className="text-blue-400 font-medium">{selectedTicket.assignedTo}</span></div>
                </div>
              </div>

              {/* Thread Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-950/20 to-slate-900/10">
                {selectedTicket.replies.map(rep => {
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
                            ? "bg-[#0E82FD] text-white rounded-tr-none"
                            : "bg-slate-900 text-slate-200 border border-slate-800/80 rounded-tl-none"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{rep.message}</p>
                      </div>
                    </div>
                  );
                })}

                {/* Internal Notes Section */}
                {selectedTicket.internalNotes && selectedTicket.internalNotes.length > 0 && (
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl space-y-1.5">
                    <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-3.5 h-3.5" /> Staff Internal Notes (Confidential)
                    </div>
                    {selectedTicket.internalNotes.map((note, idx) => (
                      <div key={idx} className="text-xs text-amber-200/90 pl-2 border-l-2 border-amber-500/40">
                        {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Reply & Note Input Bar */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-900/60 space-y-3">
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type official response to patient..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    <Send className="w-3.5 h-3.5" /> Reply
                  </button>
                </form>

                {/* Internal Staff Note Input */}
                <form onSubmit={handleAddInternalNote} className="flex items-center gap-2 pt-1 border-t border-slate-800/50">
                  <input
                    type="text"
                    placeholder="Add private staff note (hidden from patient)..."
                    value={internalNoteText}
                    onChange={e => setInternalNoteText(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-amber-500/20 rounded-lg text-xs text-amber-300 placeholder-slate-600 focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={!internalNoteText.trim()}
                    className="px-3 py-1.5 bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/30 text-xs font-semibold rounded-lg transition-all"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-xs text-slate-500">
              Select a support ticket from the list to review the thread.
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Create Patient Support Ticket</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 font-semibold block mb-1">Patient Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={newTicketData.patientName}
                  onChange={e => setNewTicketData({ ...newTicketData, patientName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Category</label>
                  <select
                    value={newTicketData.category}
                    onChange={e => setNewTicketData({ ...newTicketData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Medical Case & Doctor Review">Medical Case</option>
                    <option value="Travel & Airport Logistics">Travel & Logistics</option>
                    <option value="Billing & Invoices">Billing & Escrow</option>
                    <option value="Visa & FRRO Assistance">Visa & FRRO</option>
                    <option value="Accommodation & Post-Op">Accommodation</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-400 font-semibold block mb-1">Priority</label>
                  <select
                    value={newTicketData.priority}
                    onChange={e => setNewTicketData({ ...newTicketData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="Brief summary of issue"
                  value={newTicketData.subject}
                  onChange={e => setNewTicketData({ ...newTicketData, subject: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 font-semibold block mb-1">Description / Inquiry</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Enter full details regarding the support request..."
                  value={newTicketData.description}
                  onChange={e => setNewTicketData({ ...newTicketData, description: e.target.value })}
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
                  className="px-5 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold rounded-xl"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
