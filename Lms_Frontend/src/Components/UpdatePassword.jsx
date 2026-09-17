import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Lock, Eye, EyeOff, ArrowRight, GraduationCap } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdatePassword = () => {
  const navigate = useNavigate();
  const { token } = useParams(); // URL se token extract karne ke liye
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: { password: "", confirmPassword: "" }
  });

  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: data.password,
          confirmPassword: data.confirmPassword,
          token: token,
        }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        toast.success(result.message || "Password updated successfully! 🎉");
        setTimeout(() => {
          navigate("/signin");
        }, 1500);
      } else {
        toast.error(result.message || "Failed to update password. Try again.");
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

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-4">
        <div className="inline-flex items-center justify-center bg-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-100">
          <GraduationCap size={28} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tight">
          Choose new password
        </h2>
        <p className="text-sm text-slate-500">
          Almost done. Enter your new password below.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-4 shadow-sm border border-slate-200/60 sm:rounded-3xl sm:px-10 space-y-6">
          
          <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
            
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">New Password</label>
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
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">Confirm New Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  disabled={loading}
                  placeholder="••••••••"
                  {...register("confirmPassword", { 
                    required: "Please confirm your password",
                    validate: (value) => value === passwordValue || "Passwords do not match"
                  })}
                  className={`w-full bg-white border text-sm pl-11 pr-11 py-2.5 rounded-xl focus:outline-none font-medium transition-colors disabled:opacity-75 ${
                    errors.confirmPassword ? "border-rose-500 focus:border-rose-500" : "border-slate-200 focus:border-indigo-600"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs font-semibold text-rose-500 mt-1">{errors.confirmPassword.message}</p>}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm py-3.5 rounded-xl transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 group ${loading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{loading ? "Resetting..." : "Reset Password"}</span>
                {!loading && <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;