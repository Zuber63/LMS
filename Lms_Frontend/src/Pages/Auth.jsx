import React, { useState } from "react";

import { useForm } from "react-hook-form";

import {
  Mail,
  Lock,
  ArrowRight,
  ArrowLeft,
  GraduationCap,
  Eye,
  EyeOff,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Login handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        // 🎉 Success Toast
        toast.success(result.message || "Login successful! Welcome back 👋");

        // 💾 Token aur User Info ko LocalStorage mein save kar rahe hain
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.data));

        // Redirect to Dashboard or Home after 1.5s
        setTimeout(() => {
          const accountType = result.data?.accountType;

          if (accountType === "Instructor") {
            navigate("/instructordashboard"); // 👈 Instructor ko uske dashboard par bhejo
          } else {
            navigate("/studentdashboard"); // 👈 Student ko uske dashboard par bhejo
          }
        }, 1000);
      } else {
        // ❌ Backend error (Wrong password or email not found)
        toast.error(result.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.log(error);
      toast.error("Server down or network error. Please try again later!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Back to Home */}
      <button
        onClick={() => navigate("/")}
        disabled={loading}
        className="cursor-pointer absolute top-6 left-6 inline-flex items-center space-x-2 text-xs font-bold text-slate-600 hover:text-indigo-600 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-sm transition-all focus:outline-none disabled:opacity-50"
      >
        <ArrowLeft size={14} />
        <span>Back to Home</span>
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-4">
        <div className="inline-flex items-center justify-center bg-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-100">
          <GraduationCap size={28} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Welcome back
        </h2>

        <p className="text-sm text-slate-500">
          Enter your details to access your account.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/60 sm:rounded-3xl sm:px-10 space-y-6">

          {/* Google Quick Login */}
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

            <span>Sign in with Google</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>

            <div className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">
              Or sign in with email
            </div>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  disabled={loading}
                  placeholder="name@example.com"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9.\_%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Invalid email address",
                    },
                  })}
                  className={`w-full bg-white border text-sm pl-11 pr-4 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                    errors.email
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-slate-200 focus:border-indigo-600"
                  }`}
                />
              </div>

              {errors.email && (
                <p className="text-xs font-semibold text-rose-500 mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  Password
                </label>

                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="cursor-pointer text-xs font-semibold text-indigo-600 hover:text-indigo-700 focus:outline-none"
                >
                  Forgot password?
                </button>
              </div>

              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  disabled={loading}
                  placeholder="••••••••"
                  {...register("password", {
                    required: "Password is required",
                  })}
                  className={`w-full bg-white border text-sm pl-11 pr-11 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                    errors.password
                      ? "border-rose-500 focus:border-rose-500"
                      : "border-slate-200 focus:border-indigo-600"
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

              {errors.password && (
                <p className="text-xs font-semibold text-rose-500 mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 group ${
                  loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <span>{loading ? "Signing in..." : "Sign In"}</span>

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transform group-hover:translate-x-1 transition-transform"
                  />
                )}
              </button>
            </div>
          </form>

          {/* Footer Navigation link */}
          <div className="text-center text-sm text-slate-500 pt-2 border-t border-slate-100">
            Don't have an account?{" "}

            <button
              onClick={() => navigate("/signup")}
              className="font-bold text-indigo-600 hover:text-indigo-700 focus:outline-none"
            >
              Sign up
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;