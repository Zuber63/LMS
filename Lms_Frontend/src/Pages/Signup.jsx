import React, { useState } from "react";
import { useForm } from "react-hook-form"; // React Hook Form import kiya
import {
  Mail,
  Lock,
  User,
  Phone,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Eye,
  EyeOff,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
// React Toastify imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [accountType, setAccountType] = useState("Student"); // Main state for pill switch
  const [loading, setLoading] = useState(false); // API Call loader state

  // react-hook-form configuration
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  // Password ko watch kar rahe hain taaki Confirm Password se compare kar sakein
  const passwordValue = watch("password");

  // Form submit hone par call hoga
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const finalData = { ...data, accountType };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: finalData.email,
        }),
      });
      
      const result = await res.json();

      if (res.ok && result.success) {
        // 🎉 GREEN SUCCESS TOAST
        toast.success(result.message || "OTP sent successfully to your email! ✉️");
        
        // Dynamic payload validation pass karte hue navigation
        setTimeout(() => {
          navigate("/verifyemail", { state: { email: finalData.email, formData: finalData } });
        }, 1000); // 1.5s delay taaki user toast dekh sake
      } else {
        // ❌ BACKEND ERRORS (e.g., User already registered)
        toast.error(result.message || "Something went wrong. Please try again.");
      }

    } catch (error) {
      console.log(error);
      // ❌ NETWORK OR SERVER DOWN ERROR
      toast.error("Server connection failed. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Toast Container for alerts layout injection */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      
      {/* ─── FLOATING BACK TO HOME BUTTON ─── */}
      <button
        onClick={() => navigate("/")}
        disabled={loading}
        className="cursor-pointer absolute top-6 left-6 inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm transition-all focus:outline-none disabled:opacity-50"
      >
        <ArrowLeft size={14} />
        <span>Back to Home</span>
      </button>

      {/* Branding Header Area */}
      <div className="sm:mx-auto sm:w-full sm:max-w-xl text-center space-y-3 px-4">
        <div className="inline-flex items-center justify-center bg-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-100">
          <GraduationCap size={28} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Create your account
        </h2>
        <p className="text-sm text-slate-500">
          Join our learning universe and upgrade your technical skills.
        </p>
      </div>

      {/* Main Form Holder */}
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/60 sm:rounded-3xl sm:px-10 space-y-6">
          
          {/* Google Quick Sign Up */}
          <button
            type="button"
            disabled={loading}
            className="cursor-pointer w-full flex items-center justify-center space-x-2.5 border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-sm px-4 py-3 rounded-xl transition duration-150 focus:outline-none disabled:opacity-50"
          >
            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.227C18.241 1.483 15.48 0 12.24 0 5.58 0 0 5.58 0 12.24s5.58 12.24 12.24 12.24c6.96 0 11.57-4.894 11.57-11.79 0-.795-.085-1.4-.195-2.005H12.24z"
              />
            </svg>
            <span>Sign up with Google</span>
          </button>

          {/* Form Divider Separator */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or register with email
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* ACCOUNT TYPE SELECTOR */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                I want to join as a:
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setAccountType("Student")}
                  className={`cursor-pointer flex items-center justify-center space-x-2.5 p-3.5 rounded-xl border text-sm font-bold transition-all disabled:opacity-50 ${
                    accountType === "Student"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Sparkles size={16} className={accountType === "Student" ? "text-indigo-600" : "text-slate-400"} />
                  <span>Student</span>
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setAccountType("Instructor")}
                  className={`cursor-pointer flex items-center justify-center space-x-2.5 p-3.5 rounded-xl border text-sm font-bold transition-all disabled:opacity-50 ${
                    accountType === "Instructor"
                      ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm"
                      : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <UserCheck size={16} className={accountType === "Instructor" ? "text-indigo-600" : "text-slate-400"} />
                  <span>Instructor</span>
                </button>
              </div>
            </div>

            {/* First Name & Last Name Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">First Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    disabled={loading}
                    placeholder="First Name"
                    {...register("firstName", { required: "First name is required" })}
                    className={`w-full bg-white border text-sm pl-11 pr-4 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                      errors.firstName ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.firstName && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.firstName.message}</p>}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Last Name</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    disabled={loading}
                    placeholder="Last Name"
                    {...register("lastName", { required: "Last name is required" })}
                    className={`w-full bg-white border text-sm pl-11 pr-4 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                      errors.lastName ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.lastName && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.lastName.message}</p>}
              </div>
            </div>

            {/* Phone & Email Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Phone Number */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    disabled={loading}
                    placeholder="Phone Number"
                    {...register("phone", { 
                      required: "Phone number is required",
                      pattern: { value: /^[0-9]{10}$/, message: "Must be a valid 10-digit number" }
                    })}
                    className={`w-full bg-white border text-sm pl-11 pr-4 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                      errors.phone ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.phone && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.phone.message}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    disabled={loading}
                    placeholder="Email Address"
                    {...register("email", { 
                      required: "Email is required",
                      pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" }
                    })}
                    className={`w-full bg-white border text-sm pl-11 pr-4 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                      errors.email ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
                    }`}
                  />
                </div>
                {errors.email && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.email.message}</p>}
              </div>
            </div>

            {/* Password & Confirm Password Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    disabled={loading}
                    placeholder="••••••••"
                    {...register("password", { 
                      required: "Password is required",
                      minLength: { value: 6, message: "Password must be at least 6 characters" }
                    })}
                    className={`w-full bg-white border text-sm pl-11 pr-11 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                      errors.password ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Confirm Password</label>
                <div className="relative">
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    disabled={loading}
                    placeholder="••••••••"
                    {...register("confirmPassword", { 
                      required: "Please confirm your password",
                      validate: (value) => value === passwordValue || "Passwords do not match!"
                    })}
                    className={`w-full bg-white border text-sm pl-11 pr-11 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                      errors.confirmPassword ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.confirmPassword.message}</p>}
              </div>
            </div>

            {/* Primary Submit Trigger Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 group ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{loading ? "Sending OTP..." : "Register Account"}</span>
                {!loading && <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;