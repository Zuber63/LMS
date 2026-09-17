import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Mail, ArrowLeft, ArrowRight, GraduationCap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "" }
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/user/reset-password-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(result.message || "Reset link sent to your email! ✉️");
        setEmailSent(true);
      } else {
        toast.error(result.message || "Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error);
      toast.error("Server down or network error. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Back to Login */}
      <button
        onClick={() => navigate("/signin")}
        disabled={loading}
        className="cursor-pointer absolute top-6 left-6 inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm transition-all focus:outline-none disabled:opacity-50"
      >
        <ArrowLeft size={14} />
        <span>Back to Login</span>
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-4">
        <div className="inline-flex items-center justify-center bg-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-100">
          <GraduationCap size={28} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          {emailSent ? "Check your email" : "Reset your password"}
        </h2>
        <p className="text-sm text-slate-500">
          {emailSent 
            ? "We have sent the reset instructions to your email address." 
            : "Enter your registered email and we'll send you a password reset link."}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/60 sm:rounded-3xl sm:px-10 space-y-6">
          
          {!emailSent ? (
            <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Email Address</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    disabled={loading}
                    placeholder="name@example.com"
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

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 group ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <span>{loading ? "Sending link..." : "Send Reset Link"}</span>
                  {!loading && <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <button
                onClick={() => setEmailSent(false)}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm py-3 rounded-xl transition cursor-pointer"
              >
                Resend email
              </button>
            </div>
          )}

          <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
            Remember your password?{" "}
            <button
              onClick={() => navigate("/signin")}
              className="font-bold text-indigo-600 hover:text-indigo-700 focus:outline-none cursor-pointer"
            >
              Sign in
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;