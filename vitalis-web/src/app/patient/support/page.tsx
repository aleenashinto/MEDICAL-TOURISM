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
  Paperclip,
  RotateCcw,
  Check
} from "lucide-react";

export type TicketStatus = "Open" | "In Progress" | "Waiting for Patient" | "Resolved" | "Closed";
export type TicketPriority = "Critical" | "High" | "Medium" | "Low";

export interface TicketReply {
  id: string;
  sender: string;
  role: "Admin" | "Patient" | "Coordinator";
  message: string;
  timestamp: string;
}

export interface SupportTicket {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
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
}

const DEFAULT_PATIENT_TICKETS: SupportTicket[] = [
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
    ]
  }
];

export default function PatientSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  // Create Form State
  const [newSubject, setNewSubject] = useState("");
  const [newCategory, setNewCategory] = useState("Appointment & Doctor Consultation");
  const [newDescription, setNewDescription] = useState("");
  const [newAttachment, setNewAttachment] = useState<File | null>(null);

  // Load from LocalStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("maides_shared_support_tickets_v3");
      if (saved) {
        const parsed: SupportTicket[] = JSON.parse(saved);
        // Filter tickets for current patient (Sarah Jenkins)
        const patientTickets = parsed.filter(t => t.patientName === "Sarah Jenkins" || t.patientEmail === "sarah.jenkins@example.com");
        setTickets(patientTickets.length > 0 ? patientTickets : parsed.slice(0, 1));
        setSelectedTicket(patientTickets.length > 0 ? patientTickets[0] : parsed[0]);
      } else {
        setTickets(DEFAULT_PATIENT_TICKETS);
        setSelectedTicket(DEFAULT_PATIENT_TICKETS[0]);
        localStorage.setItem("maides_shared_support_tickets_v3", JSON.stringify(DEFAULT_PATIENT_TICKETS));
      }
    } catch (e) {
      setTickets(DEFAULT_PATIENT_TICKETS);
      setSelectedTicket(DEFAULT_PATIENT_TICKETS[0]);
    }
  }, []);

  // Sync to Shared LocalStorage
  const syncTickets = (updatedList: SupportTicket[]) => {
    try {
      const saved = localStorage.getItem("maides_shared_support_tickets_v3");
      const allTickets: SupportTicket[] = saved ? JSON.parse(saved) : [];
      
      // Merge updated patient tickets with other tickets
      const merged = allTickets.map(t => {
        const match = updatedList.find(u => u.id === t.id);
        return match || t;
      });

      // Add any newly created
      updatedList.forEach(u => {
        if (!merged.find(m => m.id === u.id)) {
          merged.unshift(u);
        }
      });

      localStorage.setItem("maides_shared_support_tickets_v3", JSON.stringify(merged));
      setTickets(updatedList);
      if (selectedTicket) {
        setSelectedTicket(updatedList.find(t => t.id === selectedTicket.id) || updatedList[0]);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Submit New Ticket
  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newDescription.trim()) {
      alert("Please enter subject and description.");
      return;
    }

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newTicket: SupportTicket = {
      id: "TCK-" + Math.floor(810 + Math.random() * 100),
      patientId: "pat-101",
      patientName: "Sarah Jenkins",
      patientEmail: "sarah.jenkins@example.com",
      category: newCategory,
      subject: newSubject.trim(),
      description: newDescription.trim(),
      priority: "Medium",
      status: "Open",
      assignedTo: "Care Coordinator Desk",
      createdAt: timeStr,
      updatedAt: timeStr,
      attachmentName: newAttachment ? newAttachment.name : undefined,
      replies: [
        {
          id: "REP-" + Date.now(),
          sender: "Sarah Jenkins",
          role: "Patient",
          message: newDescription.trim(),
          timestamp: timeStr
        }
      ]
    };

    const updated = [newTicket, ...tickets];
    syncTickets(updated);
    setSelectedTicket(newTicket);
    setIsCreateModalOpen(false);
    setNewSubject("");
    setNewDescription("");
    setNewAttachment(null);
  };

  // Submit Patient Reply
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedTicket) return;

    const timeStr = new Date().toISOString().replace("T", " ").substring(0, 16);
    const newReply: TicketReply = {
      id: "REP-" + Date.now(),
      sender: "Sarah Jenkins",
      role: "Patient",
      message: replyText.trim(),
      timestamp: timeStr
    };

    const updated = tickets.map(t => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: "In Progress" as TicketStatus,
          updatedAt: timeStr,
          replies: [...t.replies, newReply]
        };
      }
      return t;
    });

    syncTickets(updated);
    setReplyText("");
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
            <LifeBuoy className="w-4 h-4" />
            24/7 International Care Support Desk
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Support Tickets & Escalations
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Submit inquiries regarding flight pickups, visa extensions, hospital billing, or physician consults.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-xl shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Open New Support Ticket
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[640px] bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
        
        {/* Left Side: Ticket Dossiers List */}
        <div className="lg:col-span-5 border-r border-slate-200 flex flex-col justify-between bg-slate-50/50">
          <div className="p-4 border-b border-slate-200">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Support Tickets</h3>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-200">
            {tickets.map(t => {
              const isSelected = selectedTicket && selectedTicket.id === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setSelectedTicket(t)}
                  className={`w-full text-left p-4 hover:bg-blue-50/50 transition-all flex flex-col gap-1.5 ${
                    isSelected ? "bg-blue-50 border-l-4 border-blue-600" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600">{t.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                      t.status === "In Progress" ? "bg-amber-100 text-amber-700" :
                      t.status === "Resolved" ? "bg-emerald-100 text-emerald-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {t.status}
                    </span>
                  </div>

                  <div className="text-xs font-bold text-slate-900 line-clamp-1">{t.subject}</div>
                  <div className="text-[11px] text-slate-500 line-clamp-1">{t.category}</div>
                  <div className="text-[10px] text-slate-400 mt-1">{t.createdAt}</div>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-white border-t border-slate-200 text-[11px] text-slate-500 flex items-center justify-between">
            <span>{tickets.length} Active Tickets</span>
            <span className="text-emerald-600 font-semibold flex items-center gap-1">
              <Check className="w-3 h-3" /> Live Support Connected
            </span>
          </div>
        </div>

        {/* Right Side: Conversation Thread */}
        <div className="lg:col-span-7 flex flex-col justify-between bg-white">
          {selectedTicket ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-100 bg-slate-50/30">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-mono text-xs font-bold text-blue-600">{selectedTicket.id}</span>
                    <h2 className="text-sm font-bold text-slate-900 mt-0.5">{selectedTicket.subject}</h2>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                    {selectedTicket.status}
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 mt-1">
                  Category: {selectedTicket.category} • Coordinator: {selectedTicket.assignedTo}
                </div>
              </div>

              {/* Feed */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/20">
                {selectedTicket.replies.map(rep => {
                  const isPatient = rep.role === "Patient";
                  return (
                    <div
                      key={rep.id}
                      className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-600">{rep.sender}</span>
                        <span>•</span>
                        <span>{rep.timestamp}</span>
                      </div>

                      <div
                        className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                          isPatient
                            ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10"
                            : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">{rep.message}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Input */}
              <div className="p-4 border-t border-slate-100 bg-white">
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Type reply to care coordinator..."
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim()}
                    className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-xs font-semibold rounded-xl shadow-md transition-all shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">Select a ticket</div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">Create Support Ticket</h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-600 font-semibold block mb-1">Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Flight arrival change or Visa question"
                  value={newSubject}
                  onChange={e => setNewSubject(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-600 focus:outline-none"
                >
                  <option value="Appointment & Doctor Consultation">Appointment & Doctor Consultation</option>
                  <option value="Travel & Airport Logistics">Travel & Airport Logistics</option>
                  <option value="Billing & Invoices">Billing & Invoices</option>
                  <option value="Visa & FRRO Assistance">Visa & FRRO Assistance</option>
                  <option value="Medical Case & Records">Medical Case & Records</option>
                </select>
              </div>

              <div>
                <label className="text-slate-600 font-semibold block mb-1">Detailed Inquiry</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide complete description of your inquiry..."
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 resize-none focus:ring-2 focus:ring-blue-600 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl"
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
