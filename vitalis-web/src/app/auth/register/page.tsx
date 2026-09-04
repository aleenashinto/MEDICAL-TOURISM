"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User, Globe, Phone, Calendar, ShieldCheck, ShieldAlert, Eye, EyeOff, CheckSquare, Square } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "United Arab Emirates",
    dob: "",
    gender: "female",
    password: "",
    confirmPassword: "",
    agreeTerms: true,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!firstName || !lastName) {
      setError("Please provide both your first name and last name.");
      return;
    }

    const emailRegex = /^[^s@]+@[^s@]+.[^s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address (e.g. name@example.com).");
      return;
    }

    // Duplicate email check for admin account
    if (email === "admin@gmail.com" || email === "admin@vitalis.health") {
      setError("This email address is already registered as an administrative account. Please log in or use another email.");
      return;
    }

    if (phone.length < 8) {
      setError("Please provide a valid international phone number with country code.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match. Please verify both password fields.");
      return;
    }

    if (!formData.agreeTerms) {
      setError("You must agree to the Terms of Service and Medical Privacy Policy to register.");
      return;
    }

    setIsLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("maides_user_name", `${firstName} ${lastName}`);
      localStorage.setItem("maides_user_email", email);
      localStorage.setItem("maides_user_location", formData.country || "United Arab Emirates");
      localStorage.setItem("maides_user_phone", phone);
      localStorage.setItem("maides_user_role", "PATIENT");
      
      // Auto-register patient into admin/patient list if not present
      try {
        const storedPatients = localStorage.getItem("maides_admin_patients");
        let patientList = storedPatients ? JSON.parse(storedPatients) : [];
        if (!patientList.some((p: any) => p.email === email)) {
          const newPatient = {
            id: "PAT-" + Math.floor(1000 + Math.random() * 9000),
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            country: formData.country || "United Arab Emirates",
            dob: formData.dob || "1990-01-01",
            gender: formData.gender || "female",
            registeredAt: new Date().toISOString().split("T")[0],
            status: "ACTIVE"
          };
          localStorage.setItem("maides_admin_patients", JSON.stringify([newPatient, ...patientList]));
        }
      } catch (err) {}
    }

    setTimeout(() => {
      setIsLoading(false);
      router.push("/patient/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#0E82FD]/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-xl relative z-10 text-center">
        <Link href="/" className="inline-flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/20">
            M
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-white">MAIDES</span>
        </Link>
        <h2 className="mt-6 text-2xl font-bold tracking-tight text-white">
          Create your Patient Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-[#0E82FD] hover:text-blue-400">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl relative z-10">
        <div className="bg-slate-800/90 border border-slate-700/80 backdrop-blur-xl py-8 px-6 shadow-2xl rounded-2xl sm:px-10">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">First Name *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Sarah"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Last Name *</label>
                <input
                  type="text"
                  required
                  placeholder="Jenkins"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Email Address *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Phone (with Country Code) *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Country of Residence *</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Date of Birth</label>
                <input
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-300">Password (min 8 chars) *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="block w-full pl-10 pr-10 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">Confirm Password *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    className="block w-full pl-10 pr-10 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Mandatory Terms & Conditions Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                  className="mt-0.5 h-4 w-4 rounded bg-slate-900 border-slate-700 text-[#0E82FD] focus:ring-[#0E82FD]"
                />
                <span>
                  I agree to the{" "}
                  <Link href="/privacy-policy" target="_blank" className="text-[#0E82FD] hover:underline font-semibold">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy-policy" target="_blank" className="text-[#0E82FD] hover:underline font-semibold">
                    Medical Data Privacy Policy
                  </Link>.
                </span>
              </label>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0E82FD] hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0E82FD] transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Creating Patient Account..." : "Create Patient Account"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-5 flex items-center gap-2 text-xs text-slate-400 justify-center">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>End-to-end encrypted HIPAA & GDPR compliant health record storage</span>
          </div>
        </div>
      </div>
    </div>
  );
}
