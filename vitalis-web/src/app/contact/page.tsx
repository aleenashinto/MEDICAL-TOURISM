"use client";

import React, { useState } from "react";
import { PublicPageLayout } from "@/components/PublicPageLayout";
import { Phone, Mail, MapPin, Clock, Send, Globe, MessageCircle, CheckCircle } from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <PublicPageLayout navbarStyle="white">
      {({ onOpenIntake }) => (
        <div className="min-h-screen">
          {/* Hero */}
          <div className="bg-gradient-to-r from-[#17468A] via-[#1E5DAE] to-[#1C5098] text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-200">Contact MAIDES</span>
              <h1 className="text-4xl sm:text-5xl font-black leading-tight">We're Here to Help</h1>
              <p className="text-sm text-blue-100 max-w-2xl leading-relaxed">
                Our international patient coordination team is available 24 hours a day, 7 days a week. Reach us by phone, WhatsApp, email, or the enquiry form below.
              </p>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* Contact Info */}
              <div className="space-y-5">
                <h2 className="text-lg font-black text-[#0F2042]">Contact Information</h2>

                {[
                  {
                    icon: <Phone className="w-5 h-5" />,
                    title: "24/7 International Desk",
                    lines: ["+91 (484) 290-8482 (India)", "+971 (4) 389-7200 (UAE Desk)", "WhatsApp: +91 484 290 8482"],
                    color: "text-[#0E82FD]"
                  },
                  {
                    icon: <Mail className="w-5 h-5" />,
                    title: "Email",
                    lines: ["international@maides.in", "ayurveda@maides.in", "care@maides.in"],
                    color: "text-emerald-600"
                  },
                  {
                    icon: <MapPin className="w-5 h-5" />,
                    title: "Registered Office",
                    lines: ["MAIDES Platform Pvt. Ltd.", "Infopark Phase II, Kakkanad", "Kochi, Kerala — 682 030, India"],
                    color: "text-amber-600"
                  },
                  {
                    icon: <Clock className="w-5 h-5" />,
                    title: "Operating Hours",
                    lines: ["Medical Enquiries: 24/7", "Admin Support: Mon–Sat 9 AM–6 PM IST", "Emergency Coordination: 24/7"],
                    color: "text-purple-600"
                  },
                ].map((c) => (
                  <div key={c.title} className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm flex gap-4">
                    <div className={`w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center flex-shrink-0 ${c.color}`}>{c.icon}</div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-[#0F2042]">{c.title}</div>
                      {c.lines.map((l) => (
                        <div key={l} className="text-xs text-slate-500">
                          {l.includes("+91") ? (
                            <a href="tel:+914842908482" className="hover:text-[#0E82FD] transition-colors">{l}</a>
                          ) : l.includes("@") ? (
                            <a href={`mailto:${l}`} className="hover:text-[#0E82FD] transition-colors">{l}</a>
                          ) : (
                            l
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Languages */}
                <div className="rounded-2xl bg-[#D4E8FC] border border-blue-200 p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#0F2042]">
                    <Globe className="w-4 h-4 text-[#0E82FD]" />
                    Language Support
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {["Arabic", "English", "Malayalam", "Hindi", "French", "Dhivehi", "Urdu"].map((l) => (
                      <span key={l} className="text-[10px] font-bold text-[#0E82FD] bg-white px-2.5 py-1 rounded-full border border-blue-200">{l}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="rounded-3xl bg-white border border-slate-200 shadow-sm p-8 space-y-6">
                  {submitted ? (
                    <div className="py-16 text-center space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto">
                        <CheckCircle className="w-8 h-8 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-black text-[#0F2042]">Message Sent!</h3>
                      <p className="text-sm text-slate-500 max-w-sm mx-auto">Our team will respond to your enquiry within 4 hours during business hours, or within 24 hours on weekends.</p>
                      <button onClick={() => setSubmitted(false)} className="px-5 py-2.5 rounded-xl bg-[#0E82FD] text-white text-xs font-bold">
                        Send Another Message
                      </button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <h2 className="text-lg font-black text-[#0F2042]">Send Us a Message</h2>
                        <p className="text-xs text-slate-500 mt-1">For urgent medical enquiries, use the <button onClick={onOpenIntake} className="text-[#0E82FD] font-bold hover:underline">Medical Enquiry Form</button> for faster triage.</p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Full Name *</label>
                            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all"
                              placeholder="Your full name" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Email Address *</label>
                            <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all"
                              placeholder="your@email.com" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">WhatsApp / Phone</label>
                            <input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all"
                              placeholder="+971 XX XXX XXXX" />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-xs font-bold text-slate-700">Country</label>
                            <input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}
                              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all"
                              placeholder="UAE, UK, India..." />
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Subject *</label>
                          <select required value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all bg-white">
                            <option value="">Select a subject...</option>
                            <option>Medical Treatment Enquiry</option>
                            <option>Ayurveda Programme Enquiry</option>
                            <option>Visa & Travel Assistance</option>
                            <option>Cost Estimate Request</option>
                            <option>Hospital / Doctor Recommendation</option>
                            <option>Second Opinion Request</option>
                            <option>Feedback / Complaint</option>
                            <option>Partnership / Hospital Tie-Up</option>
                            <option>Media / Press Enquiry</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-bold text-slate-700">Message *</label>
                          <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                            rows={5}
                            className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#0E82FD] focus:ring-2 focus:ring-blue-100 transition-all resize-none"
                            placeholder="Describe your enquiry..." />
                        </div>

                        <div className="text-[10px] text-slate-400">
                          By submitting this form, you agree to our Privacy Policy. Your information is encrypted and never shared without consent.
                        </div>

                        <button type="submit" className="w-full py-3.5 rounded-xl bg-[#0E82FD] text-white text-xs font-black hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
                          <Send className="w-4 h-4" />
                          Send Message
                        </button>
                      </form>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="rounded-3xl bg-[#25D366]/10 border border-[#25D366]/30 p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
              <div className="w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-sm font-black text-[#0F2042]">Prefer WhatsApp?</h3>
                <p className="text-xs text-slate-600 mt-1">Chat directly with our international coordination team in Arabic, English, or Malayalam. Available 24/7.</p>
              </div>
              <a 
                href="https://wa.me/914842908482?text=Hello%20MAIDES,%20I%20would%20like%20assistance%20with%20medical%20treatment%20in%20Kerala." 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-full bg-[#25D366] text-white text-xs font-black hover:bg-green-600 transition-all shadow-lg whitespace-nowrap flex-shrink-0 cursor-pointer"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </PublicPageLayout>
  );
}
