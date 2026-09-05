"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  Clock, 
  UserCheck,
  Paperclip,
  FileText,
  Download,
  X,
  CheckCheck,
  Building2,
  Calendar,
  Sparkles,
  PhoneCall
} from "lucide-react";

export interface ChatAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: "admin" | "patient";
  senderName: string;
  text: string;
  category?: "General" | "Medical Case" | "Appointment" | "Travel & Visa" | "Billing & Escrow" | "Support";
  time: string;
  timestamp: string;
  status: "sent" | "delivered" | "read";
  attachments?: ChatAttachment[];
}

// Removed mocked messages per data isolation rules

export default function PatientMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [category, setCategory] = useState<ChatMessage["category"]>("General");
  const [selectedAttachment, setSelectedAttachment] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/messages');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.messages) {
            setMessages(data.messages);
          }
        }
      } catch (e) {
        console.error("Failed to load messages");
      } finally {
        setIsLoading(false);
      }
    };
    fetchMessages();
  }, []);

  // Auto-scroll
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message (Patient -> Admin)
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() && !selectedAttachment) return;
    alert("Message API POST not implemented yet");
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">
          <MessageSquare className="w-4 h-4" />
          Direct Clinical & Travel Liaison
        </div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
          Care Coordinator Messaging
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct secure channel with your dedicated Kerala patient coordinator, hospital liaison, and medical translators.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm h-[640px] flex flex-col justify-between">
        {/* Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs text-slate-900">Rahul Nair (Senior Care Coordinator)</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>Aster Medcity & MAIDES Kerala Desk</span>
                <span>•</span>
                <span className="text-emerald-600 font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Online
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> 256-bit Encrypted
            </span>
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/30">
          {messages.map((m) => {
            const isPatient = m.sender === "patient";
            return (
              <div
                key={m.id}
                className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}
              >
                <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                  <span className="font-semibold text-slate-600">{isPatient ? "You (Sarah Jenkins)" : m.senderName}</span>
                  <span>•</span>
                  <span>{m.time}</span>
                  {m.category && m.category !== "General" && (
                    <span className="px-1.5 py-0.2 bg-slate-200 text-slate-700 rounded text-[9px] font-semibold">
                      {m.category}
                    </span>
                  )}
                </div>

                <div
                  className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                    isPatient
                      ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10"
                      : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{m.text}</p>

                  {/* Attachment in Message */}
                  {m.attachments && m.attachments.length > 0 && (
                    <div className="mt-3 space-y-2 pt-2 border-t border-slate-100">
                      {m.attachments.map(att => (
                        <div 
                          key={att.id}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                            isPatient ? "bg-blue-700/50 text-white" : "bg-slate-50 border border-slate-200 text-slate-800"
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <FileText className="w-4 h-4 shrink-0" />
                            <div className="truncate">
                              <div className="font-medium truncate">{att.name}</div>
                              <div className="text-[10px] opacity-70">{att.size}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => alert("Downloading document: " + att.name)}
                            className="p-1.5 hover:bg-black/10 rounded-lg shrink-0"
                            title="Download document"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {isPatient && (
                  <span className="flex items-center gap-1 text-[10px] text-blue-600 mt-1 px-1 font-mono">
                    <CheckCheck className="w-3 h-3" /> Sent
                  </span>
                )}
              </div>
            );
          })}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          {selectedAttachment && (
            <div className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span className="font-medium">{selectedAttachment.name}</span>
                <span className="text-[10px] text-slate-500">({(selectedAttachment.size / 1024).toFixed(0)} KB)</span>
              </div>
              <button onClick={() => setSelectedAttachment(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              onChange={e => {
                if (e.target.files && e.target.files[0]) {
                  setSelectedAttachment(e.target.files[0]);
                }
              }}
            />

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-slate-500 hover:text-slate-800 rounded-xl border border-slate-200 transition-colors"
              title="Attach Medical Record / PDF"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            <select
              value={category}
              onChange={e => setCategory(e.target.value as any)}
              className="px-2.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
            >
              <option value="General">General</option>
              <option value="Medical Case">Medical Case</option>
              <option value="Appointment">Appointment</option>
              <option value="Travel & Visa">Travel & Visa</option>
              <option value="Billing & Escrow">Billing & Escrow</option>
              <option value="Support">Support</option>
            </select>

            <input
              type="text"
              placeholder="Ask a question about your case, travel, visa, or doctor consultation..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button 
              type="submit"
              disabled={!replyText.trim() && !selectedAttachment}
              className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white transition-all shadow-md shadow-blue-500/20 shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
