import React, { useState } from "react";
import { User, Mail, Phone, Briefcase, Calendar, ShieldCheck, Edit3, Save } from "lucide-react";
import { toast } from "react-toastify";

const InstructorProfile = () => {
  const userData = JSON.parse(localStorage.getItem("user")) || {
    firstName: "Aman",
    lastName: "Sharma",
    email: "instructor.aman@edupulse.com",
    contactNumber: "9876543210",
    accountType: "Instructor",
    createdAt: "2026-01-15"
  };

  // State management for edit toggle
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData.firstName,
    lastName: userData.lastName,
    contactNumber: userData.contactNumber,
    bio: userData.bio || "Senior Full-Stack Developer & Technical Educator with over 5+ years of production-level systems engineering experience.",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    // LocalStorage payload compilation update
    const updatedUser = { ...userData, ...formData };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setIsEditing(false);
    toast.success("Profile documentation updated successfully! 👤");
  };

  return (
    <div className="space-y-6 dynamic-fade-in max-w-4xl mx-auto">
      
      {/* 1. CINEMATIC TOP AVATAR BANNER BLOCK */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-indigo-500 to-indigo-700"></div>
        
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-end justify-between pt-10 gap-4">
          <div className="flex flex-col sm:flex-row items-center sm:items-end space-y-3 sm:space-y-0 sm:space-x-4 text-center sm:text-left">
            <div className="h-24 w-24 rounded-2xl bg-indigo-100 border-4 border-white text-indigo-700 flex items-center justify-center text-3xl font-black uppercase shadow-md shrink-0">
              {formData.firstName ? formData.firstName[0] : "I"}
            </div>
            <div className="sm:mb-2">
              <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                {formData.firstName} {formData.lastName}
                <ShieldCheck size={18} className="text-emerald-500 inline shrink-0" />
              </h1>
              <span className="text-xs font-semibold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md tracking-wider inline-block mt-1">
                {userData.accountType} Studio Admin
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(!isEditing)}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-sm cursor-pointer sm:mb-2 ${
              isEditing 
                ? "bg-slate-100 text-slate-600 hover:bg-slate-200" 
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            <Edit3 size={14} />
            <span>{isEditing ? "Cancel Edit" : "Edit Profile"}</span>
          </button>
        </div>
      </div>

      {/* 2. CORE SYSTEM BIO & FIELDS MATRIX */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* LEFT COLUMN PROFILE INFORMATION VIEW/EDIT FORM */}
        <form onSubmit={handleSave} className="md:col-span-2 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
          <h3 className="text-sm font-black uppercase tracking-wider text-slate-700 border-b border-slate-100 pb-3">
            Account Architecture Info
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-bold text-slate-500">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">First Name</label>
              <input
                type="text"
                name="firstName"
                disabled={!isEditing}
                value={formData.firstName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-50/50 disabled:text-slate-400 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">Last Name</label>
              <input
                type="text"
                name="lastName"
                disabled={!isEditing}
                value={formData.lastName}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-50/50 disabled:text-slate-400 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">Email Address (Read-Only)</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="email"
                  disabled
                  value={userData.email}
                  className="w-full bg-slate-50/60 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-400 font-medium select-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">Contact Number</label>
              <div className="relative">
                <Phone size={14} className="absolute left-3.5 top-3.5 text-slate-400" />
                <input
                  type="text"
                  name="contactNumber"
                  disabled={!isEditing}
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-50/50 disabled:text-slate-400 rounded-xl pl-9 pr-3 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <label className="text-[10px] uppercase tracking-wider text-slate-400">Professional Bio</label>
              <textarea
                name="bio"
                disabled={!isEditing}
                rows={4}
                value={formData.bio}
                onChange={handleInputChange}
                className="w-full bg-slate-50 border border-slate-200 disabled:bg-slate-50/50 disabled:text-slate-400 rounded-xl px-3 py-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition resize-none font-medium leading-relaxed"
              />
            </div>
          </div>

          {isEditing && (
            <button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 rounded-xl transition uppercase tracking-wider text-xs flex items-center justify-center space-x-2 shadow-md shadow-indigo-600/10 cursor-pointer"
            >
              <Save size={14} />
              <span>Commit System Changes</span>
            </button>
          )}
        </form>

        {/* RIGHT COLUMN METADATA SNAPSHOT BOX */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm space-y-4 h-fit">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
            System Metadata
          </h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-slate-50 rounded-xl flex items-center space-x-3 text-xs">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                <Briefcase size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Status</span>
                <span className="font-black text-slate-700">Active Node Admin</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl flex items-center space-x-3 text-xs">
              <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 shrink-0">
                <Calendar size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">System Register Date</span>
                <span className="font-black text-slate-700">{userData.createdAt}</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-700 font-semibold leading-relaxed">
            🚩 <strong>Security Warning:</strong> Email verification handles your workspace keys. Open a terminal support ticket to update system emails.
          </div>
        </div>

      </div>

    </div>
  );
};

export default InstructorProfile;