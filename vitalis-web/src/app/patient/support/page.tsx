"use client";

import React, { useState, useEffect } from "react";
import { 
  LifeBuoy, 
  Plus, 
  CheckCircle2, 
  Clock, 
  Send, 
  AlertCircle,
  X,
  MessageSquare,
  FileText,
  ChevronRight,
  Shield,
  HelpCircle,
  Search,
  Filter,
  User,
  Paperclip
} from "lucide-react";

interface TicketReply {
  id: string;
  sender: "PATIENT" | "ADMIN";
  senderName: string;
  message: string;
  timestamp: string;
}

interface Ticket {
  id: string;
  subject: string;
  category: string;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  status: "OPEN" | "IN_PROGRESS" | "WAITING_FOR_PATIENT" | "RESOLVED" | "CLOSED";
  createdAt: string;
  description: string;
  attachmentName?: string;
  replies: TicketReply[];
}

const DEFAULT_TICKETS: Ticket[] = [
  {
    id: "TCK-1025",
    subject: "Airport pickup is not confirmed for flight EK-532",
    category: "Travel & Airport Logistics",
    priority: "HIGH",
    status: "IN_PROGRESS",
    createdAt: "Sep 04, 2026, 09:15 AM",
    description: "My flight is arriving tomorrow morning at Cochin International Airport (COK) at 08:45 AM, but my driver contact details are still showing unassigned.",
    attachmentName: "emirates_flight_ticket.pdf",
    replies: [
      {
        id: "rep-1",
        sender: "PATIENT",
        senderName: "Aleena",
        message: "My flight is arriving tomorrow morning at Cochin International Airport (COK) at 08:45 AM, but my driver contact details are still showing unassigned.",
        timestamp: "Sep 04, 2026, 09:15 AM"
      },
      {
        id: "rep-2",
        sender: "ADMIN",
        senderName: "MAIDES Concierge Team (Suresh Babu)",
        message: "Hello Aleena, we have verified your flight EK-532. Driver assigned: Rajesh Kumar (+91 98471 23456) with AC Toyota Innova. He will be waiting at Terminal 3 Arrival Gate 4 holding a MAIDES name board.",
        timestamp: "Sep 04, 2026, 10:30 AM"
      }
    ]
  },
  {
    id: "TCK-1018",
    subject: "Requesting itemized hospital cost estimate for insurance claim",
    category: "Billing & Invoices",
    priority: "MEDIUM",
    status: "RESOLVED",
    createdAt: "Sep 02, 2026, 02:40 PM",
    description: "My international health insurer (Allianz Care) requires an official cost estimate stamped by Aster Medcity.",
    attachmentName: "insurance_pre_auth_form.pdf",
    replies: [
      {
        id: "rep-1",
        sender: "PATIENT",
        senderName: "Aleena",
        message: "My international health insurer (Allianz Care) requires an official cost estimate stamped by Aster Medcity.",
        timestamp: "Sep 02, 2026, 02:40 PM"
      },
      {
        id: "rep-2",
        sender: "ADMIN",
        senderName: "Billing Support",
        message: "The stamped estimate has been generated and uploaded to your Medical Document Locker under 'Insurance Pre-Auth Estimate'.",
        timestamp: "Sep 03, 2026, 11:15 AM"
      }
    ]
  }
];

export default function PatientSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>(DEFAULT_TICKETS);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [userName, setUserName] = useState("Aleena");

  // Form State
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Travel & Airport Logistics");
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("HIGH");
  const [description, setDescription] = useState("");
  const [attachmentName, setAttachmentName] = useState("");
  const [newReply, setNewReply] = useState("");
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("maides_user_name");
      if (storedName) setUserName(storedName);

      const storedTickets = localStorage.getItem("maides_patient_tickets");
      if (storedTickets) {
        try {
          setTickets(JSON.parse(storedTickets));
        } catch (e) {
          console.error("Failed to parse tickets", e);
        }
      }
    }
  }, []);

  const saveTickets = (updated: Ticket[]) => {
    setTickets(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_patient_tickets", JSON.stringify(updated));
    }
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!subject.trim()) {
      setFormError("Please enter a ticket subject.");
      return;
    }
    if (!description.trim()) {
      setFormError("Please provide a detailed problem description.");
      return;
    }

    setIsSubmitting(true);

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) + 
      ", " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const newTicketId = `TCK-${Math.floor(1000 + Math.random() * 9000)}`;

    const createdTicket: Ticket = {
      id: newTicketId,
      subject: subject.trim(),
      category,
      priority,
      status: "OPEN",
      createdAt: dateStr,
      description: description.trim(),
      attachmentName: attachmentName ? attachmentName : undefined,
      replies: [
        {
          id: `rep-${Date.now()}`,
          sender: "PATIENT",
          senderName: userName,
          message: description.trim(),
          timestamp: dateStr
        }
      ]
    };

    setTimeout(() => {
      const updatedList = [createdTicket, ...tickets];
      saveTickets(updatedList);
      setIsSubmitting(false);
      setShowCreateModal(false);
      setSelectedTicket(createdTicket);

      // Reset form
      setSubject("");
      setDescription("");
      setAttachmentName("");
      setPriority("HIGH");

      setSuccessToast(`Support Ticket ${newTicketId} created successfully! Our team will respond within 2 hours.`);
      setTimeout(() => setSuccessToast(""), 5000);
    }, 500);
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReply.trim() || !selectedTicket) return;

    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }) + 
      ", " + now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    const replyObj: TicketReply = {
      id: `rep-${Date.now()}`,
      sender: "PATIENT",
      senderName: userName,
      message: newReply.trim(),
      timestamp: dateStr
    };

    const updated = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: t.status === "RESOLVED" || t.status === "CLOSED" ? ("OPEN" as const) : t.status,
          replies: [...t.replies, replyObj]
        };
      }
      return t;
    });

    saveTickets(updated);
    const updatedSelected = updated.find(t => t.id === selectedTicket.id) || null;
    setSelectedTicket(updatedSelected);
    setNewReply("");
  };

  const filteredTickets = tickets.filter((t) => {
    const matchesFilter = 
      activeFilter === "ALL" ? true :
      activeFilter === "OPEN" ? (t.status === "OPEN" || t.status === "IN_PROGRESS" || t.status === "WAITING_FOR_PATIENT") :
      activeFilter === "RESOLVED" ? (t.status === "RESOLVED" || t.status === "CLOSED") : true;

    const matchesSearch = 
      t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  const getStatusBadge = (status: Ticket["status"]) => {
    switch (status) {
      case "OPEN":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">Open</span>;
      case "IN_PROGRESS":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">In Progress</span>;
      case "WAITING_FOR_PATIENT":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">Waiting for You</span>;
      case "RESOLVED":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Resolved</span>;
      case "CLOSED":
        return <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-300">Closed</span>;
    }
  };

  const getPriorityBadge = (priority: Ticket["priority"]) => {
    switch (priority) {
      case "URGENT":
        return <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-rose-100 text-rose-800 border border-rose-300 uppercase">Urgent</span>;
      case "HIGH":
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 uppercase">High</span>;
      case "MEDIUM":
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-blue-100 text-blue-800 border border-blue-200 uppercase">Medium</span>;
      case "LOW":
        return <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700 border border-slate-200 uppercase">Low</span>;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Notification */}
      {successToast && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-between gap-3 text-emerald-800 text-xs font-semibold shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{successToast}</span>
          </div>
          <button onClick={() => setSuccessToast("")} className="text-emerald-600 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F2042] to-[#1E3A8A] text-white p-6 rounded-3xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-200 border border-blue-400/30 text-xs font-semibold mb-2">
            <LifeBuoy className="w-3.5 h-3.5" />
            24/7 International Patient Assistance
          </div>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight">Support Tickets & Problem Resolution</h1>
          <p className="text-xs sm:text-sm text-blue-200 mt-1 max-w-xl">
            Raise requests for airport pick-ups, visa inquiries, hospital coordination, and billing support with guaranteed coordinator tracking.
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 px-5 py-3 bg-[#0E82FD] hover:bg-blue-500 text-white text-xs font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Raise New Support Ticket</span>
        </button>
      </div>

      {/* Main Grid: Ticket List + Thread View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ticket List */}
        <div className="lg:col-span-5 space-y-4">
          {/* Filter Bar & Search */}
          <div className="bg-white border border-slate-200 p-3.5 rounded-2xl shadow-xs space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400 pointer-events-none" />
              <input
                type="text"
                placeholder="Search tickets by ID, subject, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
              />
            </div>

            <div className="flex gap-1.5 p-1 bg-slate-100 rounded-xl">
              {[
                { id: "ALL", label: "All Tickets" },
                { id: "OPEN", label: "Active" },
                { id: "RESOLVED", label: "Resolved" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id)}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                    activeFilter === tab.id
                      ? "bg-white text-[#0E82FD] shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket Items */}
          <div className="space-y-3">
            {filteredTickets.length === 0 ? (
              <div className="bg-white border border-slate-200 p-8 rounded-2xl text-center space-y-3">
                <LifeBuoy className="w-10 h-10 text-slate-300 mx-auto" />
                <h2 className="text-sm font-bold text-slate-700">No tickets found</h2>
                <p className="text-xs text-slate-500">
                  You have not raised any support requests under this filter.
                </p>
              </div>
            ) : (
              filteredTickets.map((t) => {
                const isSelected = selectedTicket?.id === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTicket(t)}
                    className={`bg-white border rounded-2xl p-4 transition-all cursor-pointer space-y-2.5 relative ${
                      isSelected
                        ? "border-[#0E82FD] ring-2 ring-blue-100 shadow-md bg-blue-50/20"
                        : "border-slate-200 hover:border-slate-300 shadow-xs hover:shadow"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-600">{t.id}</span>
                        {getPriorityBadge(t.priority)}
                      </div>
                      {getStatusBadge(t.status)}
                    </div>

                    <h2 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2">
                      {t.subject}
                    </h2>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1 border-t border-slate-100">
                      <span>{t.category}</span>
                      <span className="text-[10px] text-slate-400">{t.createdAt.split(",")[0]}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Ticket Conversation & Details */}
        <div className="lg:col-span-7">
          {selectedTicket ? (
            <div className="bg-white border border-slate-200 rounded-3xl shadow-xs overflow-hidden flex flex-col h-full min-h-[500px]">
              {/* Ticket Top Info Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50/70 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="font-mono text-sm font-extrabold text-[#0E82FD]">{selectedTicket.id}</span>
                    {getPriorityBadge(selectedTicket.priority)}
                  </div>
                  {getStatusBadge(selectedTicket.status)}
                </div>

                <h2 className="text-base font-bold text-slate-900">{selectedTicket.subject}</h2>

                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                  <div>
                    <span className="font-medium text-slate-400">Category:</span>{" "}
                    <span className="font-semibold text-slate-700">{selectedTicket.category}</span>
                  </div>
                  <div>
                    <span className="font-medium text-slate-400">Created:</span>{" "}
                    <span className="text-slate-700">{selectedTicket.createdAt}</span>
                  </div>
                </div>

                {selectedTicket.attachmentName && (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-medium text-slate-700">
                    <Paperclip className="w-3.5 h-3.5 text-blue-500" />
                    <span>Attached Document: {selectedTicket.attachmentName}</span>
                  </div>
                )}
              </div>

              {/* Thread Messages */}
              <div className="p-5 space-y-4 flex-1 overflow-y-auto max-h-[420px] bg-slate-50/30">
                {selectedTicket.replies.map((r) => {
                  const isPatient = r.sender === "PATIENT";
                  return (
                    <div
                      key={r.id}
                      className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 text-[11px] text-slate-400">
                        <span className="font-bold text-slate-700">{r.senderName}</span>
                        <span>•</span>
                        <span>{r.timestamp}</span>
                      </div>
                      <div
                        className={`p-4 rounded-2xl text-xs max-w-[85%] leading-relaxed ${
                          isPatient
                            ? "bg-[#0E82FD] text-white rounded-tr-xs shadow-xs"
                            : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs"
                        }`}
                      >
                        {r.message}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Reply Form */}
              <div className="p-4 border-t border-slate-200 bg-white">
                <form onSubmit={handleSendReply} className="space-y-3">
                  <textarea
                    rows={3}
                    placeholder="Type your message or response to the support team..."
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] resize-none"
                  />
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">
                      Average response time: <strong className="text-slate-700">Under 2 hours</strong>
                    </span>
                    <button
                      type="submit"
                      disabled={!newReply.trim()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E82FD] hover:bg-blue-600 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-xs cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Reply</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[400px] space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h2 className="text-base font-bold text-slate-800">Select a Ticket to View Details</h2>
              <p className="text-xs text-slate-500 max-w-sm">
                Click on any ticket from the list on the left to see the complete history, status progress, and coordinator replies.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Create Ticket Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#0E82FD] flex items-center justify-center font-bold">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 leading-tight">Create Support Ticket</h2>
                  <p className="text-[11px] text-slate-500">Submit an official request to MAIDES Concierge</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Ticket Subject *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Airport pickup not confirmed, flight arriving tomorrow"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Issue Category *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                  >
                    <option value="Travel & Airport Logistics">✈️ Travel & Airport Logistics</option>
                    <option value="Hotel & Accommodation">🏨 Hotel & Accommodation</option>
                    <option value="Hospital & Doctor Coordination">🏥 Hospital & Doctor Coordination</option>
                    <option value="Medical Visa & Documents">📄 Medical Visa & Documents</option>
                    <option value="Billing & Invoices">💳 Billing & Invoices</option>
                    <option value="General Question">❓ General Question</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Priority Level *</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                  >
                    <option value="HIGH">🔴 High (Next 2-4 Hours)</option>
                    <option value="URGENT">🚨 Urgent (Immediate / Critical)</option>
                    <option value="MEDIUM">🟡 Medium (Within 24 Hours)</option>
                    <option value="LOW">🟢 Low (General Query)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Please describe your problem or request in detail with any relevant booking numbers, hospital names, or flight times..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E82FD] resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Optional Document Attachment</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="e.g. flight_ticket.pdf or hotel_voucher.jpg"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="flex-1 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0E82FD]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-[#0E82FD] hover:bg-blue-600 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  {isSubmitting ? "Submitting Ticket..." : "Submit Support Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
