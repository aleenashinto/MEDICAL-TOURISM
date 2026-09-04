"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Calendar, 
  Save, 
  CheckCircle2, 
  ShieldCheck,
  Camera,
  Trash2,
  Lock,
  Edit3,
  X,
  FileText,
  HeartPulse,
  AlertCircle,
  Building2,
  MapPin,
  ArrowRight,
  Stethoscope,
  Plane
} from "lucide-react";

export default function PatientProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Profile Form State
  const [profile, setProfile] = useState({
    patientId: "MED-2026-00125",
    firstName: "Sarah",
    lastName: "Jenkins",
    email: "sarah.jenkins@example.com",
    phone: "+44 7911 123456",
    altPhone: "+44 7911 987654",
    dob: "1982-04-12",
    gender: "Female",
    country: "United Kingdom",
    state: "Greater London",
    city: "London",
    addressLine1: "42 Highfield Terrace, Flat 3B",
    addressLine2: "Kensington",
    postalCode: "SW7 2AZ",
    passportNo: "UK9988221A",
    passportExpiry: "2031-08-19",
    nationality: "British",
    emergencyName: "Mark Jenkins",
    emergencyRelation: "Spouse",
    emergencyPhone: "+44 7911 654321",
    emergencyEmail: "mark.jenkins@example.com",
    bloodGroup: "O Positive (O+)",
    status: "Active",
    emailVerified: true,
  });

  const [initialProfile, setInitialProfile] = useState(profile);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedName = localStorage.getItem("maides_user_name");
      const storedEmail = localStorage.getItem("maides_user_email");
      const storedLocation = localStorage.getItem("maides_user_location");
      const storedPhone = localStorage.getItem("maides_user_phone");
      const storedPhoto = localStorage.getItem("maides_user_photo");

      if (storedPhoto) setProfilePhoto(storedPhoto);

      if (storedName || storedEmail) {
        const parts = (storedName || "Sarah Jenkins").trim().split(" ");
        const first = parts[0] || "Aleena";
        const last = parts.slice(1).join(" ") || "";

        const loaded = {
          ...profile,
          firstName: first,
          lastName: last,
          email: storedEmail || profile.email,
          country: storedLocation || profile.country,
          phone: storedPhone || profile.phone,
        };
        setProfile(loaded);
        setInitialProfile(loaded);
      }
    }
  }, []);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 2 * 1024 * 1024) {
        alert("File size exceeds 2MB limit.");
        return;
      }
      setIsUploadingPhoto(true);
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const base64 = uploadEvent.target?.result as string;
        setProfilePhoto(base64);
        if (typeof window !== "undefined") {
          localStorage.setItem("maides_user_photo", base64);
        }
        setIsUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemovePhoto = () => {
    setProfilePhoto(null);
    if (typeof window !== "undefined") {
      localStorage.removeItem("maides_user_photo");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("maides_user_name", `${profile.firstName} ${profile.lastName}`.trim());
      localStorage.setItem("maides_user_email", profile.email);
      localStorage.setItem("maides_user_location", profile.country);
      localStorage.setItem("maides_user_phone", profile.phone);
    }
    setInitialProfile(profile);
    setIsEditing(false);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleCancel = () => {
    setProfile(initialProfile);
    setIsEditing(false);
  };

  // Completion calculation
  const requiredFields = [
    profile.firstName,
    profile.lastName,
    profile.email,
    profile.phone,
    profile.dob,
    profile.country,
    profile.addressLine1,
    profile.emergencyName,
    profile.emergencyPhone,
    profile.passportNo
  ];
  const filledCount = requiredFields.filter(Boolean).length;
  const completionPercentage = Math.round((filledCount / requiredFields.length) * 100);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header Profile Dossier Card */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
            {/* Profile Avatar with Upload */}
            <div className="relative group">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-[#0E82FD] to-[#38BDF8] text-white font-black text-2xl flex items-center justify-center overflow-hidden shadow-lg shadow-blue-500/20 border-4 border-white">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span>{`${profile.firstName[0] || "A"}${profile.lastName[0] || ""}`.toUpperCase()}</span>
                )}
              </div>
              <label
                htmlFor="photo-upload"
                className="absolute -bottom-1.5 -right-1.5 p-2 bg-[#0E82FD] hover:bg-blue-600 text-white rounded-xl shadow-md cursor-pointer transition-all"
                title="Upload Photo"
              >
                <Camera className="w-3.5 h-3.5" />
                <input
                  id="photo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                  {profile.firstName} {profile.lastName}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                  {profile.status}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Email Verified ?
                </span>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <span className="font-semibold text-slate-700">Patient ID: {profile.patientId}</span>
                <span>•</span>
                <span>{profile.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1 font-medium text-slate-700">
                  <MapPin className="w-3 h-3 text-blue-500" />
                  {profile.city}, {profile.country}
                </span>
              </div>

              {/* Profile Completion Bar */}
              <div className="pt-2 max-w-xs">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Profile Completion</span>
                  <span className="text-[#0E82FD] font-bold">{completionPercentage}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-[#0E82FD] to-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completionPercentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {profilePhoto && (
              <button
                type="button"
                onClick={handleRemovePhoto}
                className="px-3 py-2 border border-slate-200 hover:bg-rose-50 hover:text-rose-600 text-slate-600 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Photo</span>
              </button>
            )}

            {!isEditing ? (
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="px-4 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCancel}
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cancel</span>
              </button>
            )}

            <Link
              href="/patient/settings"
              className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
            >
              <Lock className="w-3.5 h-3.5 text-slate-500" />
              <span>Security</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Integration Shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          href="/patient/medical-info"
          className="p-5 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2">
              <HeartPulse className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">Medical History</h3>
            <p className="text-xs text-slate-500">Allergies, conditions, blood group & meds</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 mt-1" />
        </Link>

        <Link
          href="/patient/documents"
          className="p-5 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">Encrypted Locker</h3>
            <p className="text-xs text-slate-500">Upload scans, lab reports & prescriptions</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 mt-1" />
        </Link>

        <Link
          href="/patient/travel"
          className="p-5 bg-white border border-slate-200 rounded-3xl hover:border-blue-300 hover:shadow-md transition-all group flex items-start justify-between"
        >
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2">
              <Plane className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">Visa & Logistics Hub</h3>
            <p className="text-xs text-slate-500">FRRO Visa invitation & 24/7 airport liaison</p>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 mt-1" />
        </Link>
      </div>

      {/* Success Notification */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3 text-emerald-800 text-xs font-semibold shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Patient profile updated and synchronized with hospital admission records.</span>
        </div>
      )}

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 1. Basic & Personal Information */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              1. Basic & Personal Information
            </h2>
            <User className="w-4 h-4 text-blue-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                required
                disabled={!isEditing}
                value={profile.dob}
                onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Gender</label>
              <select
                disabled={!isEditing}
                value={profile.gender}
                onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              >
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Group</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.bloodGroup}
                onChange={(e) => setProfile({ ...profile, bloodGroup: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nationality</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.nationality}
                onChange={(e) => setProfile({ ...profile, nationality: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 2. Contact & Address Information */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              2. Contact & Residential Address
            </h2>
            <Mail className="w-4 h-4 text-blue-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email Address</label>
              <input
                type="email"
                disabled
                value={profile.email}
                className="w-full px-3.5 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Phone Number *</label>
              <input
                type="tel"
                required
                disabled={!isEditing}
                value={profile.phone}
                onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Alternative Phone (WhatsApp)</label>
              <input
                type="tel"
                disabled={!isEditing}
                value={profile.altPhone}
                onChange={(e) => setProfile({ ...profile, altPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Country of Residence *</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">State / Province</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.state}
                onChange={(e) => setProfile({ ...profile, state: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">City *</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">Street Address</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.addressLine1}
                onChange={(e) => setProfile({ ...profile, addressLine1: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Postal Code</label>
              <input
                type="text"
                disabled={!isEditing}
                value={profile.postalCode}
                onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 3. Medical Visa & Passport Details */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              3. Indian Medical Visa & Passport Data
            </h2>
            <Globe className="w-4 h-4 text-blue-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passport / Travel Document Number *</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={profile.passportNo}
                onChange={(e) => setProfile({ ...profile, passportNo: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Passport Expiry Date</label>
              <input
                type="date"
                disabled={!isEditing}
                value={profile.passportExpiry}
                onChange={(e) => setProfile({ ...profile, passportExpiry: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* 4. 24/7 Emergency Contact */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              4. 24/7 International Emergency Contact
            </h2>
            <HeartPulse className="w-4 h-4 text-rose-500" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Full Name *</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={profile.emergencyName}
                onChange={(e) => setProfile({ ...profile, emergencyName: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship to Patient *</label>
              <input
                type="text"
                required
                disabled={!isEditing}
                value={profile.emergencyRelation}
                onChange={(e) => setProfile({ ...profile, emergencyRelation: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Phone Number *</label>
              <input
                type="tel"
                required
                disabled={!isEditing}
                value={profile.emergencyPhone}
                onChange={(e) => setProfile({ ...profile, emergencyPhone: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Emergency Email Address</label>
              <input
                type="email"
                disabled={!isEditing}
                value={profile.emergencyEmail}
                onChange={(e) => setProfile({ ...profile, emergencyEmail: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 disabled:opacity-75 focus:bg-white focus:ring-2 focus:ring-[#0E82FD] focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Form Bottom Actions */}
        {isEditing && (
          <div className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
            <button
              type="button"
              onClick={handleCancel}
              className="px-5 py-2.5 border border-slate-200 text-slate-700 font-bold text-xs rounded-xl hover:bg-slate-50 transition-all cursor-pointer"
            >
              Discard Changes
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0E82FD] hover:bg-blue-600 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              Save Profile Changes
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
