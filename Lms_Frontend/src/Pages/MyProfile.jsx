import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  BookOpen,
  Edit2,
  Check,
  X,
  ShieldCheck,
  Key,
  Calendar,
  Users,
  Briefcase,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔄 UI states (Removed dangerZone support)
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [activeSubSection, setActiveSubSection] = useState("personal"); // personal | password

  // 📝 Main Profile State (Shuru me empty)
  const [profileData, setProfileData] = useState({});

  const [tempData, setTempData] = useState({ ...profileData }); // Cancel backup

  // 🔑 Password Form State
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // 📥 1. FETCH PROFILE DETAILS ON MOUNT
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      setIsDataLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getUser`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const jsonResponse = await response.json();
        if (response.ok && jsonResponse.success) {
          const userDetails = jsonResponse.data;
          const formattedData = {
            firstName: userDetails.firstName || "",
            lastName: userDetails.lastName || "",
            email: userDetails.email || "",
            phone: userDetails.phone || "",
            dob: userDetails.additionalInfo?.dob
              ? userDetails.additionalInfo.dob.split("T")[0]
              : "",
            gender: userDetails.additionalInfo?.gender,
            profession: userDetails.additionalInfo?.profession,
            about: userDetails.additionalInfo?.about,
            accountType: userDetails.accountType,
          };
          setProfileData(formattedData);
        } else {
          toast.error(jsonResponse.message || "Failed to fetch profile.");
        }
      } catch (error) {
        console.error("Profile fetch error:", error);
        toast.error("Server error while loading profile.");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchProfile();
  }, [token, navigate]);

  // 🛠️ Edit Toggle Handlers
  const handleEditToggle = () => {
    setTempData({ ...profileData });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setProfileData({ ...tempData });
    setIsEditing(false);
    toast.info("Changes discarded.");
  };

  // 🚀 2. UPDATE PROFILE HANDLER (API Call)
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/profile/updateprofile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            dob: profileData.dob,
            gender: profileData.gender,
            profession: profileData.profession,
            about: profileData.about,
          }),
        },
      );

      const jsonResponse = await response.json();

      if (response.ok && jsonResponse.success) {
        setIsEditing(false);
        const localUser = JSON.parse(localStorage.getItem("user")) || {};
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...localUser,
            firstName: profileData.firstName,
            lastName: profileData.lastName,
          }),
        );

        toast.success("Profile details synchronized successfully! 🎉");
      } else {
        toast.error(jsonResponse.message || "Update failed.");
      }
    } catch (error) {
      console.error("Profile update error:", error);
      toast.error("Failed to update profile due to network issue.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 🔑 3. UPDATE PASSWORD HANDLER (API Call)
  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match! ❌");
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/changepassword`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword,
            confirmNewPassword: passwordData.confirmPassword,
          }),
        },
      );

      const jsonResponse = await response.json();
      if (response.ok && jsonResponse.success) {
        toast.success("Password updated securely! 🔐");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        toast.error(jsonResponse.message || "Password change rejected.");
      }
    } catch (error) {
      console.error("Password update error:", error);
      toast.error("Server connection fault during password update.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Loading Screen Tracker
  if (isDataLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-indigo-600" size={28} />
        <p className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wider">
          Syncing user authentication track...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* 1. TOP PROFILE HERO BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center gap-5 z-10 text-center sm:text-left">
          <div className="h-20 w-20 rounded-2xl bg-indigo-500/20 border-2 border-indigo-500/40 text-indigo-300 flex items-center justify-center font-black text-3xl uppercase tracking-tight shadow-inner">
            {profileData.firstName ? profileData.firstName[0] : "S"}
            {profileData.lastName ? profileData.lastName[0] : "K"}
          </div>
          <div className="space-y-1">
            <h2 className="text-xl font-black tracking-tight">
              {profileData.firstName || "Loading..."} {profileData.lastName}
            </h2>
            <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-semibold text-indigo-200/80">
              <span className="bg-indigo-500/30 text-indigo-300 px-2.5 py-0.5 rounded-md uppercase tracking-wider text-[10px]">
                {profileData.accountType}
              </span>
              <span>•</span>
              <span className="text-slate-300">
                {profileData.profession || "No Profession Added"}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS BAR (Danger Zone removed) */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-px">
        <button
          disabled={isProcessing}
          onClick={() => setActiveSubSection("personal")}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer disabled:opacity-50 ${
            activeSubSection === "personal"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Personal Info
        </button>
        <button
          disabled={isProcessing}
          onClick={() => setActiveSubSection("password")}
          className={`px-4 py-2.5 font-bold text-xs border-b-2 transition whitespace-nowrap cursor-pointer disabled:opacity-50 ${
            activeSubSection === "password"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          Security & Password
        </button>
      </div>

      {/* 3. DYNAMIC CONTENTS CONFIGURATIONS BASED ON ACTIVE TAB */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-sm overflow-hidden">
        {/* A. PERSONAL DETAILS TAB VIEW */}
        {activeSubSection === "personal" && (
          <form onSubmit={handleSaveProfile} className="p-6 md:p-8 space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <User size={16} className="text-indigo-600" /> Account Identity
                Credentials
              </h3>
              {!isEditing && (
                <button
                  type="button"
                  onClick={handleEditToggle}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition cursor-pointer"
                >
                  <Edit2 size={12} /> Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  First Name
                </label>
                <input
                  type="text"
                  value={profileData.firstName || ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      firstName: e.target.value,
                    })
                  }
                  disabled={!isEditing || isProcessing}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none transition ${isEditing ? "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white" : "bg-slate-100/50 border border-transparent text-slate-500 cursor-not-allowed"}`}
                />
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  Last Name
                </label>
                <input
                  type="text"
                  value={profileData.lastName || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, lastName: e.target.value })
                  }
                  disabled={!isEditing || isProcessing}
                  required
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none transition ${isEditing ? "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white" : "bg-slate-100/50 border border-transparent text-slate-500 cursor-not-allowed"}`}
                />
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Mail size={12} /> Email Address
                </label>
                <input
                  type="email"
                  value={profileData.email || ""}
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100/50 border border-transparent text-slate-400 font-semibold rounded-xl text-xs cursor-not-allowed"
                />
              </div>

              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Phone size={12} /> Phone Number
                </label>
                <input
                  type="text"
                  value={profileData.phone || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, phone: e.target.value })
                  }
                  disabled={!isEditing || isProcessing}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none transition ${isEditing ? "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white" : "bg-slate-100/50 border border-transparent text-slate-500 cursor-not-allowed"}`}
                />
              </div>

              {/* Date of Birth (DOB) */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Calendar size={12} /> Date of Birth
                </label>
                <input
                  type="date"
                  value={profileData.dob || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, dob: e.target.value })
                  }
                  disabled={!isEditing || isProcessing}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none transition ${isEditing ? "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white" : "bg-slate-100/50 border border-transparent text-slate-500 cursor-not-allowed"}`}
                />
              </div>

              {/* Gender Dropdown Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Users size={12} /> Gender
                </label>
                <select
                  value={profileData.gender || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, gender: e.target.value })
                  }
                  disabled={!isEditing || isProcessing}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none transition ${isEditing ? "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white cursor-pointer" : "bg-slate-100/50 border border-transparent text-slate-500 cursor-not-allowed"}`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Profession Field */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide flex items-center gap-1">
                  <Briefcase size={12} /> Profession
                </label>
                <input
                  type="text"
                  value={profileData.profession || ""}
                  onChange={(e) =>
                    setProfileData({
                      ...profileData,
                      profession: e.target.value,
                    })
                  }
                  disabled={!isEditing || isProcessing}
                  placeholder="e.g. Student, Software Engineer"
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none transition ${isEditing ? "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white" : "bg-slate-100/50 border border-transparent text-slate-500 cursor-not-allowed"}`}
                />
              </div>

              {/* About Textarea */}
              <div className="space-y-1.5 md:col-span-2">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  About Me
                </label>
                <textarea
                  rows="3"
                  value={profileData.about || ""}
                  onChange={(e) =>
                    setProfileData({ ...profileData, about: e.target.value })
                  }
                  disabled={!isEditing || isProcessing}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none transition resize-none leading-relaxed ${isEditing ? "bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white" : "bg-slate-100/50 border border-transparent text-slate-500 cursor-not-allowed"}`}
                />
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={handleCancel}
                  className="border border-slate-200 text-slate-600 font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-slate-50 transition cursor-pointer flex items-center gap-1 disabled:opacity-50"
                >
                  <X size={14} /> Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1 shadow-sm disabled:opacity-50"
                >
                  {isProcessing ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Save Changes
                </button>
              </div>
            )}
          </form>
        )}

        {/* B. PASSWORD CHANGE TAB VIEW */}
        {activeSubSection === "password" && (
          <form
            onSubmit={handlePasswordChange}
            className="p-6 md:p-8 space-y-6"
          >
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider border-b border-slate-100 pb-3 flex items-center gap-2">
              <Key size={16} className="text-indigo-600" /> Update Password
              Panel
            </h3>

            <div className="max-w-md space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  Current Password
                </label>
                <input
                  type="password"
                  required
                  disabled={isProcessing}
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  disabled={isProcessing}
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-wide">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  disabled={isProcessing}
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition cursor-pointer flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              >
                {isProcessing ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Key size={14} />
                )}
                Change Password
              </button>
            </div>
          </form>
        )}
      </div>

      {/* FOOTER PRIVACY CAPTION BADGE */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-bold">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>
          Your security architecture complies with dynamic token encryption
          protection
        </span>
      </div>
    </div>
  );
};

export default MyProfile;