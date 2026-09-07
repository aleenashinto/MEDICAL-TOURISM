"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  Search, 
  User,
  ShieldCheck,
  RefreshCw
} from "lucide-react";

export interface ChatMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  category?: string;
  createdAt: string;
  patient?: { id: string; firstName: string; lastName: string };
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, selectedPatientId]);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/messages');
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
        // Auto-select first patient
        if (data.messages.length > 0 && !selectedPatientId) {
          setSelectedPatientId(data.messages[0].patient?.id || data.messages[0].senderId);
        }
      }
    } catch (e) {
      console.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  // Group messages by patient
  const patientConversations = React.useMemo(() => {
    const map = new Map<string, { patientId: string; patientName: string; messages: ChatMessage[] }>();
    for (const m of messages) {
      const patientId = m.patient?.id || m.senderId;
      const patientName = m.patient 
        ? `${m.patient.firstName} ${m.patient.lastName}` 
        : `Patient ${patientId.slice(0,8)}`;
      if (!map.has(patientId)) {
        map.set(patientId, { patientId, patientName, messages: [] });
      }
      map.get(patientId)!.messages.push(m);
    }
    return Array.from(map.values());
  }, [messages]);

  const filteredConversations = patientConversations.filter(c =>
    c.patientName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedConversation = patientConversations.find(c => c.patientId === selectedPatientId) || null;

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !selectedPatientId) return;
    setIsSending(true);
    try {
      const res = await fetch('/api/admin/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText.trim(), patientId: selectedPatientId })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText("");
        fetchMessages();
      } else {
        alert(data.error || "Failed to send message");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-950 p-6 rounded-3xl border border-slate-800/80 backdrop-blur-md shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">
            <MessageSquare className="w-4 h-4" />
            MAIDES Patient Direct Messaging Center
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Patient Messaging Hub
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Respond to patient queries and coordinate care across all active cases.
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition-all shrink-0"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Main dual-pane layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[700px] bg-slate-950/90 border border-slate-800/90 rounded-3xl overflow-hidden shadow-2xl backdrop-blur-md">

        {/* Left: Conversation List */}
        <div className="lg:col-span-4 border-r border-slate-800/80 flex flex-col bg-slate-950/70">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patients..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/40">
            {isLoading ? (
              <div className="p-8 text-center text-xs text-slate-500">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">No patient messages yet.</div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = conv.patientId === selectedPatientId;
                const lastMsg = conv.messages[conv.messages.length - 1];
                return (
                  <button
                    key={conv.patientId}
                    onClick={() => setSelectedPatientId(conv.patientId)}
                    className={`w-full text-left p-4 transition-all flex items-center gap-3 ${
                      isSelected
                        ? "bg-slate-900 border-l-2 border-blue-500"
                        : "hover:bg-slate-900/60 border-l-2 border-transparent"
                    }`}
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center shrink-0">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-xs text-white truncate">{conv.patientName}</div>
                      {lastMsg && (
                        <div className="text-[10px] text-slate-500 truncate mt-0.5">{lastMsg.text}</div>
                      )}
                      <div className="text-[10px] text-slate-600 mt-0.5">{conv.messages.length} messages</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          <div className="p-3 bg-slate-900/60 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Patient-Isolated Secure Messaging</span>
          </div>
        </div>

        {/* Right: Message Thread */}
        <div className="lg:col-span-8 flex flex-col bg-slate-950/40">
          {selectedConversation ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800/80 bg-slate-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white">{selectedConversation.patientName}</div>
                    <div className="text-[11px] text-slate-400">{selectedConversation.messages.length} messages</div>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-950/20 to-slate-900/10">
                {selectedConversation.messages.map(m => {
                  const isAdmin = m.senderId !== selectedConversation.patientId;
                  return (
                    <div key={m.id} className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}>
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                        <span className="font-semibold text-slate-300">
                          {isAdmin ? "You (Admin)" : selectedConversation.patientName}
                        </span>
                        <span>•</span>
                        <span>{new Date(m.createdAt).toLocaleString()}</span>
                        {m.category && m.category !== "General" && (
                          <span className="px-1.5 py-0.5 bg-slate-800 text-slate-400 rounded text-[9px] font-semibold">
                            {m.category}
                          </span>
                        )}
                      </div>
                      <div className={`max-w-xl p-4 rounded-2xl text-xs leading-relaxed shadow-md ${
                        isAdmin
                          ? "bg-gradient-to-r from-[#0E82FD] to-blue-600 text-white rounded-tr-none"
                          : "bg-slate-900 text-slate-200 border border-slate-800/80 rounded-tl-none"
                      }`}>
                        <p className="whitespace-pre-wrap">{m.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={chatBottomRef} />
              </div>

              {/* Reply Input */}
              <div className="p-4 border-t border-slate-800/80 bg-slate-900/70">
                <form onSubmit={handleSendReply} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Reply to ${selectedConversation.patientName}...`}
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    className="flex-1 px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-all"
                  />
                  <button
                    type="submit"
                    disabled={!replyText.trim() || isSending}
                    className="px-5 py-2.5 bg-[#0E82FD] hover:bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send
                  </button>
                </form>
              </div>
            </>
          ) : (
            <div className="p-16 text-center text-xs text-slate-500">
              Select a patient conversation from the left to begin messaging.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
