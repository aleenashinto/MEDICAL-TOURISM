"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  MessageSquare, 
  Send, 
  ShieldCheck, 
  UserCheck,
  Paperclip,
  FileText,
  Download,
  X,
  CheckCheck
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
  senderId: string;
  recipientId: string;
  text: string;
  createdAt: string;
}

export default function PatientMessagesPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/patient/messages');
      const data = await res.json();
      if (data.success && data.messages) {
        setMessages(data.messages);
      }
    } catch (e) {
      console.error("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    try {
      const res = await fetch('/api/patient/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: replyText.trim() })
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
    }
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
              <div className="font-bold text-xs text-slate-900">Care Coordinator</div>
              <div className="text-[11px] text-slate-500 flex items-center gap-2">
                <span>MAIDES Kerala Desk</span>
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
          {isLoading ? (
            <div className="text-center text-xs text-slate-500 py-10">Loading messages...</div>
          ) : messages.length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-10">No messages yet. Send a message below to start the conversation!</div>
          ) : (
            messages.map((m) => {
              const isPatient = m.senderId !== "ADMIN";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isPatient ? "items-end" : "items-start"}`}
                >
                  <div className="flex items-center gap-1.5 mb-1 px-1 text-[10px] text-slate-400">
                    <span className="font-semibold text-slate-600">{isPatient ? "You" : "Care Coordinator"}</span>
                    <span>•</span>
                    <span>{new Date(m.createdAt).toLocaleString()}</span>
                  </div>

                  <div
                    className={`max-w-md p-4 rounded-2xl text-xs leading-relaxed ${
                      isPatient
                        ? "bg-blue-600 text-white rounded-br-none shadow-md shadow-blue-500/10"
                        : "bg-white text-slate-800 rounded-bl-none border border-slate-200 shadow-sm"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })
          )}
          <div ref={chatBottomRef} />
        </div>

        {/* Input Form */}
        <div className="p-4 border-t border-slate-100 bg-white space-y-2">
          <form onSubmit={handleSendMessage} className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Ask a question about your case, travel, visa, or doctor consultation..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
            <button 
              type="submit"
              disabled={!replyText.trim()}
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
