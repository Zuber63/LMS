import React, { useState, useEffect } from "react";
import { CheckCircle, Clock, Award, BookOpen, ArrowRight, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

const StudentDashboardHome = () => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔄 Fetch Logged-in Student Dashboard Real Data
  useEffect(() => {
    const fetchStudentProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await fetch("http://localhost:5000/api/user/getuser", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await res.json();

        if (result?.success && result?.data) {
          setStudentData(result.data);
        }
      } catch (error) {
        console.error("Error fetching dashboard student data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentProfile();
  }, []);

  // Safe data calculations
  const firstName = studentData?.firstName || "Student";
  const activeCoursesCount = studentData?.enrolledCourses?.length || 0;
  
  // Last/Recent enrolled course for quick resume
  const lastEnrolledCourse = studentData?.enrolledCourses?.[studentData.enrolledCourses.length - 1];
  const resumeCourseId = typeof lastEnrolledCourse === 'object' ? lastEnrolledCourse?._id : lastEnrolledCourse;
  const resumeCourseName = typeof lastEnrolledCourse === 'object' ? lastEnrolledCourse?.courseName : "Your Technical Course";

  return (
    <main className="p-4 md:p-8 max-w-7xl w-full mx-auto flex-1 space-y-6">
      
      {/* 1. WELCOME BANNER WITH MAIN HOME REDIRECT BUTTON */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-indigo-900 text-white rounded-3xl p-6 md:p-8 shadow-lg relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-xl space-y-3">
          <span className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-bold px-3 py-1 rounded-full text-xs inline-block">
            Welcome Back, {firstName} ⚡
          </span>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight">
            Ready to learn and grow today?
          </h2>
          <p className="text-indigo-200/80 text-xs md:text-sm leading-relaxed font-medium">
            Aapke paas <span className="text-white font-bold">{activeCoursesCount} active courses</span> hain. Apni tech learning poori karne ke liye progress jaari rakhein!
          </p>
        </div>

        {/* 🏠 Main Home Page Button */}
        <div className="relative z-10 shrink-0">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs px-5 py-3 rounded-xl transition duration-150 inline-flex items-center gap-2 shadow-md shadow-black/10"
          >
            <Home size={15} className="text-indigo-600" />
            <span>Go to Main Home Page</span>
          </button>
        </div>
        
        <div className="absolute right-4 bottom-[-2rem] opacity-5 font-black text-[10rem] md:text-[14rem] pointer-events-none select-none">
          LMS
        </div>
      </div>

      {/* 2. OVERVIEW STATS CARDS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Enrolled</p>
            <p className="text-lg font-black text-slate-800">{activeCoursesCount} Courses</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
            <CheckCircle size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Completed</p>
            <p className="text-lg font-black text-slate-800">0 Finished</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0">
            <Clock size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Study Time</p>
            <p className="text-lg font-black text-slate-800">12.0 Hrs</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-3.5">
          <div className="p-2.5 bg-violet-50 text-violet-600 rounded-xl shrink-0">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">Certificates</p>
            <p className="text-lg font-black text-slate-800">0 Earned</p>
          </div>
        </div>

      </div>

      {/* 3. LOWER SECTION (RESUME LEARNING & EXPLORE STORE CTA) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Quick Resume Card */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <span className="text-[10px] font-black uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">Quick Action</span>
            <h3 className="text-lg font-black text-slate-900 tracking-tight">Resume Your Learning</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {activeCoursesCount > 0 
                ? `Aapka recent active course "${resumeCourseName}" hai. Wahan se continue karne ke liye niche click karein.`
                : "Aapne abhi tak koi course enroll nahi kiya hai. Explore store me jakar naye courses join karein."}
            </p>
          </div>

          <div>
            {activeCoursesCount > 0 && resumeCourseId ? (
              <button 
                onClick={() => navigate(`/studentdashboard/courseviewer/${resumeCourseId}`)}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition duration-150 inline-flex items-center gap-2 shadow-sm shadow-indigo-600/10"
              >
                <span>Continue Course</span> <ArrowRight size={14} />
              </button>
            ) : (
              <button 
                onClick={() => navigate("/studentdashboard/buycourse")}
                className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition duration-150 inline-flex items-center gap-2 shadow-sm shadow-indigo-600/10"
              >
                <span>Explore Courses Store</span> <ArrowRight size={14} />
              </button>
            )}
          </div>
        </div>

        {/* Platform Announcements / Notice Box */}
        <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <h3 className="text-base font-black text-slate-900 tracking-tight">Platform Updates</h3>
            <div className="space-y-2.5">
              <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800">New Modules Live</span>
                  <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">New</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">Advanced React Hooks & Performance optimization modules are now available.</p>
              </div>
            </div>
          </div>
          
          <div className="text-[11px] text-slate-400 font-bold pt-2 border-t border-slate-100">
            Unified Mentor Student Portal • v2.4
          </div>
        </div>

      </div>

    </main>
  );
};

export default StudentDashboardHome;