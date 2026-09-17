import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, ArrowRight, RefreshCw, MailOpen } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
// React Toastify imports
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();

  // Signup page se bheja hua data fetch kar rahe hain
  const signupData = location.state?.formData;

  // 6 Digits OTP Array State
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(300); // 5 Minutes countdown timer in seconds (5 * 60)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const inputRefs = useRef([]);

  // Actual Running Timer Functionality
  useEffect(() => {
    if (timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Format seconds to MM:SS (e.g., 05:00)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Security Gate: Agar koi bina signup kiye direct is page par aaye
  useEffect(() => {
    if (!signupData) {
      setError("Signup data is missing. Redirecting you back...");
      const delay = setTimeout(() => {
        navigate('/signup');
      }, 3000);
      return () => clearTimeout(delay);
    }
  }, [signupData, navigate]);

  // Handle Input Changes & Auto-Focus next field
  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    // Kuch bhi naya type karte hi purana error gayab ho jayega
    setError("");

    // If a number is typed, move focus to the next input box automatically
    if (element.value !== '' && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle Backspace deletion and focus shifting backwards
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // ─── FINAL CONTROLLER SIGNUP TRIGGER ───
  const handleSubmit = async (e) => {
    e.preventDefault();
    const finalOtp = otp.join('');

    // 1. Pura OTP Na Hone Ka Error Handler
    if (finalOtp.length < 6) {
      const incompleteError = "Please enter the complete 6-digit verification code.";
      setError(incompleteError);
      toast.error(incompleteError);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Payload preparation
      const finalPayload = { ...signupData, otp: finalOtp };

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(finalPayload),
      });

      const result = await res.json();

      // Check for success response status (usually 200 or 201)
      if (res.ok && result.success) {
        // 🔥 GREEN SUCCESS TOAST
        toast.success(result.message || "Account verified and registered successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
        });

        // 1 second baad login page par navigation
        setTimeout(() => {
          navigate("/signin");
        }, 1000);
      } else {
        // ❌ WRONG OTP / SERVER BUSINESS LOGIC ERROR
        setError(result.message || "Invalid OTP code. Please try again.");
        toast.error(result.message || "Verification failed!");
      }

    } catch (err) {
      // NETWORK BREAKDOWN OR SERVER CRASH ERRORS
      const networkError = err?.message || "Internal server error. Please try again.";
      setError(networkError);
      toast.error(networkError);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Service Trigger
  const handleResend = async () => {
    setError("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupData?.email }),
      });
      
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "A fresh OTP has been sent! Check inbox.");
        setTimer(300); // Reset countdown back to 5 minutes (300s)
        setOtp(['', '', '', '', '', '']); // Clear inputs
        if(inputRefs.current[0]) inputRefs.current[0].focus();
      } else {
        setError(result.message || "Failed to resend OTP.");
        toast.error(result.message || "Resend failed.");
      }
    } catch (err) {
      setError("Failed to resend OTP. Please try again later.");
      toast.error("Network issue while resending OTP.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-8 sm:py-12 px-3 sm:px-6 lg:px-8 overflow-x-hidden">
      {/* Toast Container standard inclusion */}
      <ToastContainer position="top-right" autoClose={4000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      
      {/* Security Brand Icon Header */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3 px-2">
        <div className="inline-flex items-center justify-center bg-indigo-600 p-2.5 rounded-2xl text-white shadow-md shadow-indigo-100">
          <ShieldCheck size={28} />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight break-words">
          Verify your email
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto break-words px-1">
          We have sent a 6-digit secure verification code to <span className="font-semibold text-indigo-600 break-all">{signupData?.email || "your***@mail.com"}</span>
        </p>
      </div>

      {/* Main OTP Container Box */}
      <div className="mt-6 sm:mt-8 sm:mx-auto sm:w-full sm:max-w-md px-2 sm:px-4">
        <div className="bg-white py-6 px-3.5 sm:py-8 sm:px-10 shadow-sm border border-slate-200/60 rounded-2xl sm:rounded-3xl space-y-5 sm:space-y-6">
          
          <div className="flex justify-center my-1 sm:my-2 text-indigo-500">
            <MailOpen size={40} className="sm:w-12 sm:h-12 animate-bounce" />
          </div>

          {/* Dynamic Error Prompt Wrapper */}
          {error && (
            <div className="text-xs font-bold text-rose-500 bg-rose-50 border border-rose-100 p-3 rounded-xl text-center break-words">
              {error}
            </div>
          )}

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSubmit}>
            
            {/* --- 6-DIGIT EXPANDED OTP DIGIT SLOTS --- */}
            <div className="space-y-2">
              <label className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wide text-center block">
                Enter Verification Code
              </label>
              
              <div className="flex justify-between items-center gap-1 sm:gap-2 pt-1">
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    disabled={loading}
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={data}
                    onChange={(e) => handleChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    onFocus={(e) => e.target.select()}
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-white border-2 rounded-xl text-center text-base sm:text-lg font-black text-slate-800 focus:outline-none focus:ring-1 transition-all shadow-sm ${
                      error ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500' : 'border-slate-200 focus:border-indigo-600 focus:ring-indigo-600'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Countdown / Resend Logic */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs px-1">
              <span className="text-slate-500 font-medium">
                {timer > 0 ? (
                  <span>Resend code in <strong className="text-indigo-600 font-bold">{formatTime(timer)}</strong></span>
                ) : (
                  <span className="text-rose-500 font-semibold">Code expired</span>
                )}
              </span>
              
              <button
                type="button"
                disabled={timer > 0 || loading}
                onClick={handleResend}
                className={`inline-flex items-center space-x-1 font-bold transition-colors focus:outline-none self-start sm:self-auto ${
                  timer > 0 || loading
                    ? 'text-slate-300 cursor-not-allowed' 
                    : 'text-indigo-600 hover:text-indigo-700 underline underline-offset-2 cursor-pointer'
                }`}
              >
                <RefreshCw size={12} className={timer === 0 && !loading ? 'animate-spin shrink-0' : 'shrink-0'} />
                <span>Resend OTP</span>
              </button>
            </div>

            {/* Verification Processing CTA */}
            <div className="pt-1 sm:pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm py-3 sm:py-3.5 rounded-xl transition shadow-md shadow-indigo-100 flex items-center justify-center space-x-2 group ${loading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                <span>{loading ? "Verifying..." : "Verify & Activate Account"}</span>
                {!loading && <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform shrink-0" />}
              </button>
            </div>

          </form>

        </div>
      </div>

    </div>
  );
}

export default VerifyEmail;