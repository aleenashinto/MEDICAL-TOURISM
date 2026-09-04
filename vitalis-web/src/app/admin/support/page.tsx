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
  AlertTriangle
} from "lucide-react";

export type TicketStatus = "Open" | "In Progress" | "Waiting for Patient" | "Resolved" | "Closed";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";

interface TicketReply {
  id: string;
  sender: string;
  role: "Admin" | "Patient" | "Coordinator";
  message: string;
  timestamp: string;
}

interface SupportTicket {
  id: string;
  patientName: string;
  patientEmail: string;
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
  replies: TicketReply[];
  internalNotes: string[];
}

const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: "TCK-801",
    patientName: "Sarah Jenkins",
    patientEmail: "sarah.jenkins@example.com",
    category: "Travel & Airport Logistics",
    subject: "Requesting wheelchair accessible airport vehicle",
    description: "I will be arriving via EK 530 at Cochin International Airport and require ramp/wheelchair transfer directly to Aster Medcity.",
    priority: "High",
    status: "In Progress",
    assignedTo: "Rahul Nair (Travel Desk)",
    createdAt: "2026-09-04 08:30",
    replies: [
      {
        id: "REP-1",
        sender: "Sarah Jenkins",
        role: "Patient",
        message: "Please let me know the contact number of the chauffeur once assigned.",
        timestamp: "2026-09-04 08:45"
      },
      {
        id: "REP-2",
        sender: "Rahul Nair",
        role: "Coordinator",
        message: "A specialized wheelchair accessible Toyota Innova has been reserved. Chauffeur details: Mr. Sajan (+91 98471 00223).",
        timestamp: "2026-09-04 09:15"
      }
    ],
    internalNotes: [
      "Aster Medcity emergency department notified for stretcher standby."
    ]
  },
  {
    id: "TCK-800",
    patientName: "Mohammed Al-Maktoum",
    patientEmail: "m.maktoum@example.ae",
    category: "Forex & Billing Support",
    subject: "Tax residency certificate clarification for forex wire",
    description: "Our bank in Dubai requested Kerala hospital FRRO registration number before releasing the international escrow wire.",
    priority: "Medium",
    status: "Open",
    assignedTo: "Finance Team",
    createdAt: "2026-09-03 15:45",
    replies: [
      {
        id: "REP-3",
        sender: "Mohammed Al-Maktoum",
        role: "Patient",
        message: "Attached our bank's standard foreign remittance form.",
        timestamp: "2026-09-03 15:50"
      }
    ],
    internalNotes: [
      "Finance department sent stamped FRRO certificate."
    ]
  },
  {
    id: "TCK-799",
    patientName: "David Miller",
    patientEmail: "david.miller@example.co.uk",
    category: "Clinical Second Opinion",
    subject: "Uploaded additional MRI report for review",
    description: "Added fresh contrast lumbar spine MRI scans taken last week for Dr. Rajesh K.",
    priority: "High",
    status: "Resolved",
    assignedTo: "Dr. Rajesh K.",
    createdAt: "2026-09-01 10:20",
    replies: [
      {
        id: "REP-4",
        sender: "Dr. Rajesh K.",
        role: "Admin",
        message: "MRI scans analyzed. L4-L5 disc decompression suitable for endoscopic microdiscectomy.",
        timestamp: "2026-09-01 14:00"
      }
    ],
    internalNotes: [
      "Patient informed and consultation concluded."
    ]
  }
];

const CATEGORIES_LIST = [
  "All Categories",
  "Travel & Airport Logistics",
  "Forex & Billing Support",
  "Clinical Second Opinion",
  "Medical Visa & FRRO Invitation",
  "Hospital Accommodation & Translation",
  "Pharmacy & Medicine Courier"
];

export default function SupportAdminPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);

  const [activeTicket, setActiveTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    patientName: "",
    patientEmail: "",
    category: "Travel & Airport Logistics",
    subject: "",
    description: "",
    priority: "High" as TicketPriority,
    status: "Open" as TicketStatus,
    assignedTo: "Admin Desk"
  });

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("maides_admin_tickets");
    if (saved) {
      try {
        setTickets(JSON.parse(saved));
      } catch {
        setTickets(INITIAL_TICKETS);
      }
    } else {
      setTickets(INITIAL_TICKETS);
      localStorage.setItem("maides_admin_tickets", JSON.stringify(INITIAL_TICKETS));
    }
  }, []);

  const saveTickets = (updated: SupportTicket[]) => {
    setTickets(updated);
    localStorage.setItem("maides_admin_tickets", JSON.stringify(updated));
  };

  // Open Create
  const handleOpenAdd = () => {
    setFormData({
      patientName: "",
      patientEmail: "",
      category: "Travel & Airport Logistics",
      subject: "",
      description: "",
      priority: "High",
      status: "Open",
      assignedTo: "Care Coordinator"
    });
    setIsAddModalOpen(true);
  };

  // Submit Create
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const newId = `TCK-${Math.floor(805 + Math.random() * 90)}`;
    const now = new Date().toISOString().replace("T", " ").substring(0, 16);

    const newTicket: SupportTicket = {
      id: newId,
      patientName: formData.patientName || "International Patient",
      patientEmail: formData.patientEmail || "patient@example.com",
      category: formData.category,
      subject: formData.subject,
      description: formData.description,
      priority: formData.priority,
      status: formData.status,
      assignedTo: formData.assignedTo,
      createdAt: now,
      replies: [],
      internalNotes: []
    };

    const updated = [newTicket, ...tickets];
    saveTickets(updated);
    setIsAddModalOpen(false);
  };

  // Open Edit
  const handleOpenEdit = (t: SupportTicket) => {
    setActiveTicket(t);
    setFormData({
      patientName: t.patientName,
      patientEmail: t.patientEmail,
      category: t.category,
      subject: t.subject,
      description: t.description,
      priority: t.priority,
      status: t.status,
      assignedTo: t.assignedTo
    });
    setIsEditModalOpen(true);
  };

  // Submit Edit
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket) return;

    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          patientName: formData.patientName,
          patientEmail: formData.patientEmail,
          category: formData.category,
          subject: formData.subject,
          description: formData.description,
          priority: formData.priority,
          status: formData.status,
          assignedTo: formData.assignedTo
        };
      }
      return t;
    });

    saveTickets(updated);
    if (activeTicket) {
      setActiveTicket({
        ...activeTicket,
        patientName: formData.patientName,
        patientEmail: formData.patientEmail,
        category: formData.category,
        subject: formData.subject,
        description: formData.description,
        priority: formData.priority,
        status: formData.status,
        assignedTo: formData.assignedTo
      });
    }
    setIsEditModalOpen(false);
  };

  // Open View Dossier & Reply
  const handleOpenView = (t: SupportTicket) => {
    setActiveTicket(t);
    setIsViewModalOpen(true);
  };

  // Send Reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !replyText.trim()) return;

    const newReply: TicketReply = {
      id: `REP-${Date.now()}`,
      sender: "MAIDES Concierge Admin",
      role: "Admin",
      message: replyText.trim(),
      timestamp: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          status: "Waiting for Patient" as TicketStatus,
          replies: [...(t.replies || []), newReply]
        };
      }
      return t;
    });

    saveTickets(updated);
    setActiveTicket({
      ...activeTicket,
      status: "Waiting for Patient",
      replies: [...(activeTicket.replies || []), newReply]
    });
    setReplyText("");
  };

  // Add Internal Note
  const handleAddInternalNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeTicket || !internalNoteText.trim()) return;

    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return {
          ...t,
          internalNotes: [...(t.internalNotes || []), internalNoteText.trim()]
        };
      }
      return t;
    });

    saveTickets(updated);
    setActiveTicket({
      ...activeTicket,
      internalNotes: [...(activeTicket.internalNotes || []), internalNoteText.trim()]
    });
    setInternalNoteText("");
  };

  // Close Ticket
  const handleCloseTicket = () => {
    if (!activeTicket) return;
    const updated = tickets.map((t) => {
      if (t.id === activeTicket.id) {
        return { ...t, status: "Closed" as TicketStatus };
      }
      return t;
    });
    saveTickets(updated);
    setIsCloseModalOpen(false);
    if (isViewModalOpen) {
      setActiveTicket({ ...activeTicket, status: "Closed" });
    }
  };

  // Reopen Ticket
  const handleReopenTicket = (t: SupportTicket) => {
    const updated = tickets.map((item) => {
      if (item.id === t.id) {
        return { ...item, status: "In Progress" as TicketStatus };
      }
      return item;
    });
    saveTickets(updated);
    if (activeTicket && activeTicket.id === t.id) {
      setActiveTicket({ ...activeTicket, status: "In Progress" });
    }
  };

  // Filtered
  const filteredTickets = tickets.filter((t) => {
    const matchesSearch =
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || t.status === statusFilter;
    const matchesCategory = categoryFilter === "All Categories" || t.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2.5">
            <LifeBuoy className="w-5 h-5 text-[#0E82FD]" />
            Patient Support Tickets & Concierge Desk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage patient inquiries, medical record delivery requests, airport logistics, and billing support questions.
          </p>
        </div>
        <button 
          onClick={handleOpenAdd}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-lg shadow-blue-500/20 transition-all active:scale-95"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Support Ticket
        </button>
      </div>

      {/* KPI Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
            <LifeBuoy className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Total Tickets</div>
            <div className="text-lg font-bold text-white">{tickets.length} Inquiries</div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Open / In Progress</div>
            <div className="text-lg font-bold text-amber-400">
              {tickets.filter((t) => t.status === "Open" || t.status === "In Progress").length} Active
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Waiting for Patient</div>
            <div className="text-lg font-bold text-purple-400">
              {tickets.filter((t) => t.status === "Waiting for Patient").length} Pending
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-medium">Resolved & Closed</div>
            <div className="text-lg font-bold text-emerald-400">
              {tickets.filter((t) => t.status === "Resolved" || t.status === "Closed").length} Completed
            </div>
          </div>
        </div>
      </div>

      {/* Tickets Table & Filters */}
      <div className="bg-slate-950 border border-slate-800/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/40">
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ticket ID, patient, subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Waiting for Patient">Waiting for Patient</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
            >
              {CATEGORIES_LIST.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/50 text-slate-400 font-semibold">
                <th className="py-3 px-4">Ticket ID & Date</th>
                <th className="py-3 px-4">Patient Profile</th>
                <th className="py-3 px-4">Category & Subject</th>
                <th className="py-3 px-4">Assigned Specialist</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    No support tickets found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-900/40 transition-colors group">
                    <td className="py-3.5 px-4">
                      <div className="font-mono font-bold text-blue-400">{t.id}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">{t.createdAt}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 group-hover:text-blue-400 transition-colors">
                        {t.patientName}
                      </div>
                      <div className="text-[11px] text-slate-500">{t.patientEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-200 line-clamp-1 max-w-[280px]">
                        {t.subject}
                      </div>
                      <div className="text-[11px] text-blue-400 mt-0.5">{t.category}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 text-[11px]">{t.assignedTo || "Unassigned"}</div>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          t.priority === "Critical" || t.priority === "High"
                            ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                            : "bg-blue-500/10 text-blue-400 border border-blue-500/20"
                        }`}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          t.status === "Resolved" || t.status === "Closed"
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : t.status === "Waiting for Patient"
                            ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                            : "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenView(t)}
                          title="View Ticket & Conversation"
                          className="px-2.5 py-1.5 rounded-lg bg-[#0E82FD] hover:bg-blue-600 text-white font-semibold text-[11px] transition-all flex items-center gap-1"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          Respond
                        </button>
                        <button
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Ticket Details"
                          className="p-1.5 rounded-lg bg-slate-900 hover:bg-blue-600/20 text-slate-300 hover:text-[#0E82FD] transition-all border border-slate-800"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VIEW TICKET & CONVERSATION MODAL                                          */}
      {/* ========================================================================= */}
      {isViewModalOpen && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] overflow-y-auto shadow-2xl p-6 flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-400">{activeTicket.id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-300">
                      {activeTicket.category}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {activeTicket.status}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-white mt-1">{activeTicket.subject}</h2>
                  <div className="text-xs text-slate-400 mt-0.5">
                    From: <strong className="text-slate-200">{activeTicket.patientName}</strong> ({activeTicket.patientEmail})
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 my-5 flex-1 overflow-y-auto">
              {/* Ticket Initial Description */}
              <div className="bg-slate-900/60 border border-slate-800 p-4 rounded-2xl">
                <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold mb-1">
                  Original Issue Description
                </div>
                <p className="text-xs text-slate-200 leading-relaxed">{activeTicket.description}</p>
                <div className="text-[10px] text-slate-500 mt-2">Submitted: {activeTicket.createdAt}</div>
              </div>

              {/* Conversation Log */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 text-[#0E82FD]" />
                  Conversation Thread ({activeTicket.replies ? activeTicket.replies.length : 0})
                </div>

                {activeTicket.replies && activeTicket.replies.length > 0 ? (
                  activeTicket.replies.map((rep) => (
                    <div
                      key={rep.id}
                      className={`p-4 rounded-2xl text-xs space-y-1 border ${
                        rep.role === "Admin"
                          ? "bg-blue-600/10 border-blue-500/20 ml-6"
                          : "bg-slate-900/80 border-slate-800 mr-6"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white flex items-center gap-1.5">
                          {rep.role === "Admin" && <Shield className="w-3 h-3 text-[#0E82FD]" />}
                          {rep.sender} ({rep.role})
                        </span>
                        <span className="text-[10px] text-slate-500">{rep.timestamp}</span>
                      </div>
                      <p className="text-slate-200 leading-relaxed pt-1">{rep.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-slate-500 italic py-2">No replies yet. Send the first response below.</div>
                )}
              </div>

              {/* Internal Staff Notes */}
              {activeTicket.internalNotes && activeTicket.internalNotes.length > 0 && (
                <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-2xl space-y-1.5">
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Internal Staff Notes (Hidden from Patient)
                  </div>
                  {activeTicket.internalNotes.map((note, idx) => (
                    <div key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                      <span className="text-amber-400">•</span>
                      <span>{note}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions Bar */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              {/* Send Reply Form */}
              <form onSubmit={handleSendReply} className="space-y-2">
                <textarea
                  rows={2}
                  required
                  placeholder="Type official reply to international patient..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {activeTicket.status !== "Closed" ? (
                      <button
                        type="button"
                        onClick={handleCloseTicket}
                        className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold border border-slate-800 transition-all"
                      >
                        Close Ticket
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleReopenTicket(activeTicket)}
                        className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 text-xs font-semibold border border-emerald-500/20 transition-all"
                      >
                        Reopen Ticket
                      </button>
                    )}
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Reply
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD TICKET MODAL                                                          */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Create Support Ticket</h2>
                  <p className="text-xs text-slate-400">Log patient request for clinical or concierge assistance</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Sarah Jenkins"
                    value={formData.patientName}
                    onChange={(e) => setFormData({ ...formData, patientName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Patient Email *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. sarah.jenkins@example.com"
                    value={formData.patientEmail}
                    onChange={(e) => setFormData({ ...formData, patientEmail: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    {CATEGORIES_LIST.filter(c => c !== "All Categories").map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Flight delay notice / medical visa clarification"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Description *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Provide complete background on patient inquiry..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* EDIT TICKET MODAL                                                         */}
      {/* ========================================================================= */}
      {isEditModalOpen && activeTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-950 border border-slate-800 rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-[#0E82FD]">
                  <Edit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-white">Edit Support Ticket ({activeTicket.id})</h2>
                  <p className="text-xs text-slate-400">Reassign ticket, update status, or change priority</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-4 mt-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Waiting for Patient">Waiting for Patient</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned Specialist / Coordinator</label>
                  <input
                    type="text"
                    value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1">Subject</label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:ring-1 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
