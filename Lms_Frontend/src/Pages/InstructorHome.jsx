import React, { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Award,
  ArrowUpRight,
  Plus,
  Home,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstructorHome = () => {
  const navigate = useNavigate();
  const [instructorData, setInstructorData] = useState(null);
  const [coursesData, setCoursesData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get logged-in user securely from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🔄 Fetch Instructor Profile & Specific Instructor Courses Data
  useEffect(() => {
    const fetchInstructorDashboardData = async () => {
      try {
        if (!token) {
          setLoading(false);
          return;
        }

        // 1. Fetch Instructor Profile Details
        const profileRes = await fetch(
          `${import.meta.env.VITE_API_URL}/api/user/getuser`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const profileResult = await profileRes.json();

        if (profileResult?.success && profileResult?.data) {
          setInstructorData(profileResult.data);
        }

        // 2. Fetch Instructor Specific Courses using user._id
        const instructorId = user?._id || profileResult?.data?._id;
        if (instructorId) {
          const coursesRes = await fetch(
            `${import.meta.env.VITE_API_URL}/api/course/getInstructorCourses/${instructorId}`,
            {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
              },
            },
          );
          const coursesResult = await coursesRes.json();

          if (coursesResult?.success) {
            setCoursesData(coursesResult.courses || []);
          }
        }
      } catch (error) {
        console.error("Error loading instructor dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorDashboardData();
  }, []);

  const firstName =
    instructorData?.firstName || user?.firstName || "Instructor";

  // Dynamic stats calculation based on API data
  const totalCoursesCount = coursesData.length || 0;

  // Total students enrolled across all courses
  const totalStudentsCount = coursesData.reduce((acc, course) => {
    return acc + (course?.studentsEnrolled?.length || course?.students || 0);
  }, 0);

  // Total earnings estimation
  const totalEarnings = coursesData.reduce((acc, course) => {
    const studentsLen =
      course?.studentsEnrolled?.length || course?.students || 0;
    return acc + Number(course?.price || 0) * studentsLen;
  }, 0);

  const stats = [
    {
      label: "Total Courses",
      value: totalCoursesCount,
      icon: BookOpen,
      color: "bg-indigo-50 text-indigo-600",
    },
    {
      label: "Total Students",
      value: totalStudentsCount.toLocaleString(),
      icon: Users,
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      label: "Total Earnings",
      value: `₹${totalEarnings.toLocaleString()}`,
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600",
    },
    {
      label: "Course Rating",
      value: "4.8",
      icon: Award,
      color: "bg-violet-50 text-violet-600",
    },
  ];

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
            Manage your studio & courses
          </h2>
          <p className="text-indigo-200/80 text-xs md:text-sm leading-relaxed font-medium">
            Aapke paas{" "}
            <span className="text-white font-bold">
              {totalCoursesCount} courses
            </span>{" "}
            registered hain. Naye courses publish karne aur students ki
            performance track karne ke liye studio use karein.
          </p>
        </div>

        {/* Action Buttons Group */}
        <div className="relative z-10 flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={() => navigate("/")}
            className="cursor-pointer bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs px-4 py-3 rounded-xl transition duration-150 inline-flex items-center gap-2 shadow-sm"
          >
            <Home size={15} />
            <span>Main Home</span>
          </button>

          <button
            onClick={() => navigate("/instructordashboard/instructormycourses")}
            className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-5 py-3 rounded-xl transition duration-150 inline-flex items-center gap-2 shadow-md shadow-indigo-600/20"
          >
            <Plus size={15} />
            <span>Create New Course</span>
          </button>
        </div>

        <div className="absolute right-4 bottom-[-2rem] opacity-5 font-black text-[10rem] md:text-[14rem] pointer-events-none select-none">
          LMS
        </div>
      </div>

      {/* 2. STATS GRID */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-4 rounded-2xl border border-slate-200/60 shadow-sm flex items-center space-x-3.5"
          >
            <div className={`p-2.5 rounded-xl ${stat.color} shrink-0`}>
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-wide">
                {stat.label}
              </p>
              <h3 className="text-lg font-black text-slate-800 mt-0.5">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* 3. ANALYTICS PREVIEW & RECENT COURSES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Earnings Graph Card Placeholder */}
        <div className="lg:col-span-2 bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[320px]">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-base font-black text-slate-900 tracking-tight">
                Earnings & Revenue Flow
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Visualizing your monthly studio sales analytics
              </p>
            </div>
            <button className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center space-x-1 cursor-pointer">
              <span>View Full Analytics</span>
              <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="flex-1 bg-slate-50 border border-dashed border-slate-200 rounded-xl mt-4 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600 mb-2">
              <DollarSign size={24} />
            </div>
            <p className="text-xs font-bold text-slate-700">
              Studio Revenue Graph Active
            </p>
            <p className="text-[11px] text-slate-400 max-w-xs mt-0.5">
              Real-time sale trends are syncing with backend database records.
            </p>
          </div>
        </div>

        {/* Recent Created Courses List Card */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Course Performance
            </h2>
            <p className="text-xs text-slate-400 font-medium mb-4">
              Quick overview of your active programs
            </p>

            <div className="space-y-3 overflow-y-auto max-h-[240px]">
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400 font-medium">
                    Loading courses...
                  </p>
                </div>
              ) : coursesData.length > 0 ? (
                coursesData.slice(0, 4).map((course) => (
                  <div
                    key={course._id || course.id}
                    className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex justify-between items-center gap-3"
                  >
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {course.courseName || course.title}
                      </h4>
                      <p className="text-[11px] text-slate-400 font-medium mt-0.5">
                        {course.studentsEnrolled?.length ||
                          course.students ||
                          0}{" "}
                        students enrolled
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-xs font-black text-slate-900 block">
                        ₹{course.price}
                      </span>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-md inline-block mt-1 ${
                          (course.status || "Published") === "Published"
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {course.status || "Published"}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-xs text-slate-400 font-medium">
                    No courses found.
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() =>
                navigate("/instructordashboard/instructormycourses")
              }
              className="w-full text-center text-xs font-bold text-indigo-600 hover:text-indigo-700 transition cursor-pointer"
            >
              View All My Courses →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default InstructorHome;