"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  LifeBuoy, 
  Search, 
  Clock, 
  Plus, 
  Send, 
  Shield, 
  Check, 
  Tag, 
  UserCheck,
  CheckCircle,
  Sparkles,
  X
} from "lucide-react";

export type TicketStatus = "Open" | "In Progress" | "Waiting for Patient" | "Resolved" | "Closed";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";

export interface TicketReply {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  patientId: string;
  patient: { name: string; email: string; country?: string };
  category: string;
  subject: string;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  assignedTo: string;
  createdAt: string;
  updatedAt?: string;
  messages: TicketReply[];
  internalNotes: string[];
}

export default function SupportTicketsAdminPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");

  // Interaction State
  const [replyText, setReplyText] = useState("");
  const [internalNoteText, setInternalNoteText] = useState("");
  const [activeTab, setActiveTab] = useState<"thread" | "notes">("thread");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  const QUICK_TEMPLATES = [
    "Thank you for contacting MAIDES. Your coordinator has been assigned and is verifying your details.",
    "Your hospital admission is confirmed.",
    "The required documents have been uploaded.",
    "We have marked this ticket as resolved. Reach out anytime!"
  ];

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/support');
      const data = await res.json();
      if (data.success) {
        setTickets(data.tickets);
        if (data.tickets.length > 0 && !selectedTicket) {
          setSelectedTicket(data.tickets[0]);
        } else if (selectedTicket) {
          const updated = data.tickets.find((t: any) => t.id === selectedTicket.id);
          if (updated) setSelectedTicket(updated);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [selectedTicket?.messages]);

  // Filter Logic
  const filteredTickets = tickets.filter(t => {
    const matchSearch = 
      t.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFilter === "ALL" || t.status.toUpperCase() === statusFilter.toUpperCase();
    const matchPriority = priorityFilter === "ALL" || t.priority.toUpperCase() === priorityFilter.toUpperCase();
    const matchCategory = categoryFilter === "ALL" || t.category.toUpperCase() === categoryFilter.toUpperCase();
    return matchSearch && matchStatus && matchPriority && matchCategory;
  });

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    try {
      const res = await fetch(`/api/admin/support/${selectedTicket.id}/replies`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText.trim() })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchTickets();
      } else {
        alert(data.error || "Failed to send reply");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateTicket = async (updates: Partial<SupportTicket>) => {
    if (!selectedTicket) return;
    try {
      const res = await fetch(`/api/admin/support/${selectedTicket.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      const data = await res.json();
      if (data.success) {
        fetchTickets();
      } else {
        alert(data.error || "Failed to update ticket");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = (newStatus: TicketStatus) => {
    handleUpdateTicket({ status: newStatus });
  };

  const handlePriorityChange = (newPriority: TicketPriority) => {
    handleUpdateTicket({ priority: newPriority });
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
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Cases</span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-400"><LifeBuoy className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-white mt-3">{tickets.length}</div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Open & In Progress</span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400"><Clock className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-amber-400 mt-3">
            {tickets.filter(t => t.status === "Open" || t.status === "In Progress").length}
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Waiting for Patient</span>
            <span className="p-2 rounded-xl bg-purple-500/10 text-purple-400"><UserCheck className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-purple-400 mt-3">
            {tickets.filter(t => t.status === "Waiting for Patient").length}
          </div>
        </div>

        <div className="bg-slate-950/80 border border-slate-800/80 p-5 rounded-2xl relative overflow-hidden group hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Resolved & Closed</span>
            <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400"><CheckCircle className="w-4 h-4" /></span>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-3">
            {tickets.filter(t => t.status === "Resolved" || t.status === "Closed").length}
          </div>
        </div>
      </div>

      {/* Main Dual-Pane Ticket Studio */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[760px] bg-slate-950/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">
        
        {/* Left Pane: Ticket Queue */}
        <div className="lg:col-span-5 border-r border-slate-800/80 flex flex-col justify-between bg-slate-950/70">
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
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
            {loading ? (
              <div className="p-12 text-center text-xs text-slate-500">Loading tickets...</div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500">No tickets found.</div>
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
                          {t.id.slice(0, 8)}...
                        </span>
                        <span className="font-bold text-xs text-white truncate max-w-[140px]">{t.patient?.name || "Unknown"}</span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${getPriorityBadge(t.priority)}`}>
                        {t.priority}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200 line-clamp-1">{t.subject}</div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                      <span className={`px-2 py-0.5 rounded-md font-semibold ${getStatusBadge(t.status)}`}>
                        {t.status}
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Pane */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-slate-950/40">
          {selectedTicket ? (
            <>
              <div className="p-5 border-b border-slate-800/80 bg-slate-900/60 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base font-bold text-white">{selectedTicket.subject}</h2>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-1">
                      <span>Patient: <strong className="text-white font-semibold">{selectedTicket.patient?.name}</strong></span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedTicket.status}
                      onChange={e => handleStatusChange(e.target.value as any)}
                      className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-blue-500"
                    >
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Waiting for Patient">Waiting for Patient</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-950/20 to-slate-900/10">
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-300">Patient (Original Request)</span>
                  </div>
                  <div className="max-w-xl p-4 rounded-2xl text-xs leading-relaxed shadow-md bg-slate-900 text-slate-200 border border-slate-800/80 rounded-tl-none font-normal">
                    <p className="whitespace-pre-wrap">{selectedTicket.description}</p>
                  </div>
                </div>

                {selectedTicket.messages?.map((rep) => {
                  const isAdmin = rep.senderId === "ADMIN";
                  return (
                    <div key={rep.id} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-300">{isAdmin ? "Admin" : "Patient"}</span>
                      </div>
                      <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                        isAdmin
                          ? "bg-gradient-to-r from-[#0E82FD] to-blue-600 text-white rounded-tr-none font-normal"
                          : "bg-slate-900 text-slate-200 border border-slate-800/80 rounded-tl-none font-normal"
                      }`}>
                        <p className="whitespace-pre-wrap">{rep.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              <div className="p-4 border-t border-slate-800/80 bg-slate-900/70 space-y-2.5">
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type response to patient..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all shrink-0"
                  >
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-xs text-slate-500">
              Select a support ticket.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
