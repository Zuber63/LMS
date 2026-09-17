import React, { useState, useEffect } from "react";
import {
  Search,
  PlayCircle,
  CheckCircle2,
  BookOpen,
  Layers,
  Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MyCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");

  const [coursesData, setCoursesData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const fetchEnrolledCourses = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        setLoading(false);
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getuser`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data?.success && data?.data) {
        setCoursesData(data.data.enrolledCourses || []);
        setProgressData(data.data.courseProgress || []);
      } else {
        toast.error(data?.message || "Failed to fetch enrolled courses");
      }
    } catch (error) {
      console.error("Error fetching enrolled courses:", error);
      toast.error("Something went wrong while loading your courses");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  // ⚙️ Accurate Progress Calculation
  const calculateCourseProgress = (course) => {
    const courseId = String(course?._id || course?.id || course);

    // progressData me se match dhoondo
    const matchedProgress = progressData.find((cp) => {
      const cpCourseId = String(
        cp?.course?._id || cp?.course?.id || cp?.course || "",
      );
      return cpCourseId === courseId;
    });

    const completedVideosList = matchedProgress?.completedVideos || [];
    const completedCount = Array.isArray(completedVideosList)
      ? completedVideosList.length
      : 0;

    // Total subsections (lectures) count karo courseContent se
    let totalCount = 0;
    if (Array.isArray(course?.courseContent)) {
      course.courseContent.forEach((section) => {
        if (Array.isArray(section?.subSection)) {
          totalCount += section.subSection.length;
        }
      });
    }

    const safeTotalCount = totalCount > 0 ? totalCount : 1;
    const percentage = Math.min(
      100,
      Math.round((completedCount / safeTotalCount) * 100),
    );

    return {
      completedCount,
      totalCount: safeTotalCount,
      percentage,
      isFinished: totalCount > 0 && percentage === 100,
    };
  };

  // ⚙️ Search & Filter Engine (Fixed extra spaces & case-insensitive matching)
  const filteredCourses = coursesData.filter((course) => {
    const courseName = course?.courseName || course?.title || "";

    // Extra spaces remove karke lowercase me convert karna
    const cleanedSearchQuery = searchQuery.trim().toLowerCase();
    const cleanedCourseName = courseName.trim().toLowerCase();

    const matchesSearch = cleanedCourseName.includes(cleanedSearchQuery);

    const { isFinished } = calculateCourseProgress(course);
    const courseStatus = isFinished ? "Completed" : "In Progress";

    const matchesFilter =
      activeFilter === "All" || courseStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const handleCertificateClick = (e) => {
    e.stopPropagation();
    toast.info("Certificate feature will be available soon! 🚀", {
      autoClose: 2000,
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/85 shadow-3xs">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <Layers className="text-indigo-600" size={22} />
            My Enrolled Courses
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Aapke chal rahe aur poore kiye gaye courses ka control panel
          </p>
        </div>

        <div className="relative max-w-xs w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search classes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* TABS */}
      <div className="flex items-center space-x-2 border-b border-slate-200 pb-1">
        {["All", "In Progress", "Completed"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-4 py-2 text-xs font-bold relative transition cursor-pointer ${
              activeFilter === filter
                ? "text-indigo-600 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* LOADING / DATA */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-xs font-bold text-slate-400">
            Loading your classroom dashboard...
          </p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const courseId = course?._id;
            const { completedCount, totalCount, percentage, isFinished } =
              calculateCourseProgress(course);

            return (
              <div
                key={courseId}
                className="bg-white border border-slate-200/80 rounded-2xl shadow-3xs overflow-hidden flex flex-col justify-between group hover:shadow-md transition duration-200"
              >
                <div className="h-40 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName || "Course"}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span
                    className={`absolute top-3 right-3 text-[10px] font-black px-2.5 py-1 rounded-md uppercase ${
                      isFinished
                        ? "bg-emerald-500 text-white"
                        : "bg-indigo-600 text-white"
                    }`}
                  >
                    {isFinished ? "Completed" : "In Progress"}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Instructor:{" "}
                      {course?.instructor?.firstName || "Instructor"}{" "}
                      {course?.instructor?.lastName || ""}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition h-10 line-clamp-2">
                      {course?.courseName || course?.title || "Untitled Course"}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-500">
                      <span className="flex items-center gap-1">
                        <BookOpen size={12} /> {completedCount} / {totalCount}{" "}
                        Modules Completed
                      </span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isFinished ? "bg-emerald-500" : "bg-indigo-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>

                  <button
                    className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-xs transition ${
                      isFinished
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 cursor-pointer"
                        : "bg-slate-900 text-white hover:bg-slate-800 cursor-pointer"
                    }`}
                  >
                    {isFinished ? (
                      <div
                        onClick={handleCertificateClick}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 size={15} />
                        <span>Claim Certificate</span>
                      </div>
                    ) : (
                      <div
                        onClick={() =>
                          navigate(`/studentdashboard/courseviewer/${courseId}`)
                        }
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <PlayCircle size={15} />
                        <span>Resume Learning</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-3xs max-w-sm mx-auto">
          <p className="text-2xl">🎓</p>
          <h3 className="text-sm font-bold text-slate-700 mt-2">
            No Enrolled Courses
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Aapne abhi tak koi course nahi kharida hai. Store par jaakar explore
            karein!
          </p>
        </div>
      )}
    </div>
  );
};

export default MyCourses;