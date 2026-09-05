"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Lock, Mail, User, Globe, Phone, Calendar, ShieldCheck, ShieldAlert, Eye, EyeOff, CheckSquare, Square } from "lucide-react";

interface CountryOption {
  name: string;
  code: string;
  dialCode: string;
}

const COUNTRIES_LIST: CountryOption[] = [
  { name: "United Arab Emirates", code: "AE", dialCode: "+971" },
  { name: "Saudi Arabia", code: "SA", dialCode: "+966" },
  { name: "Qatar", code: "QA", dialCode: "+974" },
  { name: "Oman", code: "OM", dialCode: "+968" },
  { name: "Kuwait", code: "KW", dialCode: "+965" },
  { name: "Bahrain", code: "BH", dialCode: "+973" },
  { name: "United Kingdom", code: "GB", dialCode: "+44" },
  { name: "United States", code: "US", dialCode: "+1" },
  { name: "Canada", code: "CA", dialCode: "+1" },
  { name: "Maldives", code: "MV", dialCode: "+960" },
  { name: "India (NRI)", code: "IN", dialCode: "+91" },
  { name: "Australia", code: "AU", dialCode: "+61" },
  { name: "Germany", code: "DE", dialCode: "+49" },
  { name: "France", code: "FR", dialCode: "+33" },
  { name: "Kenya", code: "KE", dialCode: "+254" },
  { name: "Nigeria", code: "NG", dialCode: "+234" },
  { name: "Tanzania", code: "TZ", dialCode: "+255" },
  { name: "Sri Lanka", code: "LK", dialCode: "+94" },
];

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "+971 ",
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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleCountryChange = (countryName: string) => {
    const selected = COUNTRIES_LIST.find(c => c.name === countryName);
    const dial = selected ? selected.dialCode : "+971";
    
    // Auto-update phone country code if phone is empty or only had prior dial code
    let currentPhone = formData.phone;
    const currentCode = COUNTRIES_LIST.find(c => currentPhone.startsWith(c.dialCode))?.dialCode;
    if (currentCode) {
      currentPhone = currentPhone.replace(currentCode, dial);
    } else if (!currentPhone.trim() || currentPhone === "+") {
      currentPhone = `${dial} `;
    }

    setFormData({
      ...formData,
      country: countryName,
      phone: currentPhone
    });
  };

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const passStrength = calculatePasswordStrength(formData.password);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: Record<string, string> = {};
    const firstName = formData.firstName.trim();
    const lastName = formData.lastName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phone.trim();
    const password = formData.password.trim();
    const confirmPassword = formData.confirmPassword.trim();

    if (!firstName) {
      errors.firstName = "First name is required.";
    }
    if (!lastName) {
      errors.lastName = "Last name is required.";
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      errors.email = "Please enter a valid email address (e.g. name@example.com).";
    }

    // Duplicate email check
    if (email === "admin@gmail.com" || email === "admin@vitalis.health") {
      errors.email = "This email is registered as an administrative account. Please sign in.";
    }

    // Phone validation
    const digitsOnly = phone.replace(/[^0-9]/g, '');
    if (digitsOnly.length < 7 || digitsOnly.length > 15) {
      errors.phone = "Please enter a valid international phone number with country code.";
    }

    // Password validation
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match.";
    }

    if (!formData.agreeTerms) {
      errors.terms = "You must agree to the Terms of Service & Privacy Policy.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setError("Please resolve the highlighted validation errors.");
      return;
    }

    setIsLoading(true);

    if (typeof window !== "undefined") {
      localStorage.setItem("maides_user_name", `${firstName} ${lastName}`);
      localStorage.setItem("maides_user_email", email);
      localStorage.setItem("maides_user_location", formData.country || "United Arab Emirates");
      localStorage.setItem("maides_user_phone", phone);
      localStorage.setItem("maides_user_role", "PATIENT"); // Immutable Role Security Enforcement
      localStorage.setItem("maides_consent_timestamp", new Date().toISOString());
      localStorage.setItem("maides_consent_version", "v2026.1");

      // Auto-register patient into admin/patient list if not present
      try {
        const storedPatients = localStorage.getItem("maides_admin_patients");
        let patientList = storedPatients ? JSON.parse(storedPatients) : [];
        if (!patientList.some((p: any) => p.email.toLowerCase() === email)) {
          const newPatient = {
            id: "PAT-" + Math.floor(1000 + Math.random() * 9000),
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            country: formData.country || "United Arab Emirates",
            dob: formData.dob || "1990-01-01",
            gender: formData.gender || "female",
            registeredAt: new Date().toISOString().split("T")[0],
            status: "ACTIVE",
            role: "PATIENT"
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

          <form className="space-y-4" onSubmit={handleSubmit} noValidate>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-first-name" className="block text-xs font-medium text-slate-300">First Name *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <User className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-first-name"
                    name="given-name"
                    autoComplete="given-name"
                    type="text"
                    required
                    placeholder="Sarah"
                    value={formData.firstName}
                    onChange={(e) => {
                      setFormData({ ...formData, firstName: e.target.value });
                      if (fieldErrors.firstName) setFieldErrors({ ...fieldErrors, firstName: "" });
                    }}
                    className={`block w-full pl-10 pr-3 py-2 bg-slate-900/60 border ${
                      fieldErrors.firstName ? "border-red-500 ring-1 ring-red-500" : "border-slate-700"
                    } rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none`}
                  />
                </div>
                {fieldErrors.firstName && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.firstName}</p>}
              </div>

              <div>
                <label htmlFor="reg-last-name" className="block text-xs font-medium text-slate-300">Last Name *</label>
                <input
                  id="reg-last-name"
                  name="family-name"
                  autoComplete="family-name"
                  type="text"
                  required
                  placeholder="Jenkins"
                  value={formData.lastName}
                  onChange={(e) => {
                    setFormData({ ...formData, lastName: e.target.value });
                    if (fieldErrors.lastName) setFieldErrors({ ...fieldErrors, lastName: "" });
                  }}
                  className={`mt-1 block w-full px-3 py-2 bg-slate-900/60 border ${
                    fieldErrors.lastName ? "border-red-500 ring-1 ring-red-500" : "border-slate-700"
                  } rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none`}
                />
                {fieldErrors.lastName && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.lastName}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-email" className="block text-xs font-medium text-slate-300">Email Address *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Mail className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-email"
                    name="email"
                    autoComplete="email"
                    type="email"
                    required
                    placeholder="sarah@example.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData({ ...formData, email: e.target.value });
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: "" });
                    }}
                    className={`block w-full pl-10 pr-3 py-2 bg-slate-900/60 border ${
                      fieldErrors.email ? "border-red-500 ring-1 ring-red-500" : "border-slate-700"
                    } rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none`}
                  />
                </div>
                {fieldErrors.email && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.email}</p>}
              </div>

              <div>
                <label htmlFor="reg-phone" className="block text-xs font-medium text-slate-300">Phone (with Country Code) *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Phone className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-phone"
                    name="tel"
                    autoComplete="tel"
                    type="tel"
                    required
                    placeholder="+971 50 123 4567"
                    value={formData.phone}
                    onChange={(e) => {
                      setFormData({ ...formData, phone: e.target.value });
                      if (fieldErrors.phone) setFieldErrors({ ...fieldErrors, phone: "" });
                    }}
                    className={`block w-full pl-10 pr-3 py-2 bg-slate-900/60 border ${
                      fieldErrors.phone ? "border-red-500 ring-1 ring-red-500" : "border-slate-700"
                    } rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none`}
                  />
                </div>
                {fieldErrors.phone && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.phone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="reg-country" className="block text-xs font-medium text-slate-300">Country of Residence *</label>
                <select
                  id="reg-country"
                  name="country-name"
                  autoComplete="country-name"
                  value={formData.country}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                >
                  {COUNTRIES_LIST.map((c) => (
                    <option key={c.code} value={c.name} className="bg-slate-800 text-white">
                      {c.name} ({c.dialCode})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reg-dob" className="block text-xs font-medium text-slate-300">Date of Birth</label>
                <input
                  id="reg-dob"
                  name="bday"
                  autoComplete="bday"
                  type="date"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none [color-scheme:dark]"
                />
              </div>

              <div>
                <label htmlFor="reg-gender" className="block text-xs font-medium text-slate-300">Gender</label>
                <select
                  id="reg-gender"
                  name="sex"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-slate-900/60 border border-slate-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
                >
                  <option value="female" className="bg-slate-800 text-white">Female</option>
                  <option value="male" className="bg-slate-800 text-white">Male</option>
                  <option value="other" className="bg-slate-800 text-white">Other / Prefer not to say</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="reg-password" className="block text-xs font-medium text-slate-300">Password (min 8 chars) *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-password"
                    name="new-password"
                    autoComplete="new-password"
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => {
                      setFormData({ ...formData, password: e.target.value });
                      if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: "" });
                    }}
                    className={`block w-full pl-10 pr-10 py-2 bg-slate-900/60 border ${
                      fieldErrors.password ? "border-red-500 ring-1 ring-red-500" : "border-slate-700"
                    } rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none`}
                  />
                  <button
                    type="button"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Strength Meter */}
                {formData.password && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden flex gap-1">
                      <div className={`h-full flex-1 rounded-full ${passStrength >= 1 ? "bg-red-500" : "bg-transparent"}`} />
                      <div className={`h-full flex-1 rounded-full ${passStrength >= 3 ? "bg-amber-400" : "bg-transparent"}`} />
                      <div className={`h-full flex-1 rounded-full ${passStrength >= 4 ? "bg-emerald-400" : "bg-transparent"}`} />
                    </div>
                    <span className="text-[10px] text-slate-400">
                      {passStrength < 2 ? "Weak" : passStrength < 4 ? "Medium" : "Strong"}
                    </span>
                  </div>
                )}
                {fieldErrors.password && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.password}</p>}
              </div>

              <div>
                <label htmlFor="reg-confirm-password" className="block text-xs font-medium text-slate-300">Confirm Password *</label>
                <div className="mt-1 relative rounded-xl shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    id="reg-confirm-password"
                    name="confirm-password"
                    autoComplete="new-password"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => {
                      setFormData({ ...formData, confirmPassword: e.target.value });
                      if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: "" });
                    }}
                    className={`block w-full pl-10 pr-10 py-2 bg-slate-900/60 border ${
                      fieldErrors.confirmPassword ? "border-red-500 ring-1 ring-red-500" : "border-slate-700"
                    } rounded-xl text-white text-sm focus:ring-2 focus:ring-[#0E82FD] focus:outline-none`}
                  />
                  <button
                    type="button"
                    aria-label={showConfirmPassword ? "Hide password confirmation" : "Show password confirmation"}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {fieldErrors.confirmPassword && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.confirmPassword}</p>}
              </div>
            </div>

            {/* Mandatory Terms & Conditions Checkbox */}
            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer text-xs text-slate-300">
                <input
                  type="checkbox"
                  id="reg-terms"
                  checked={formData.agreeTerms}
                  onChange={(e) => {
                    setFormData({ ...formData, agreeTerms: e.target.checked });
                    if (fieldErrors.terms) setFieldErrors({ ...fieldErrors, terms: "" });
                  }}
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
              {fieldErrors.terms && <p className="mt-1 text-[11px] text-red-400">{fieldErrors.terms}</p>}
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
