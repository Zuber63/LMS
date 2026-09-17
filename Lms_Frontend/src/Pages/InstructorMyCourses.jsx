import React, { useState, useEffect } from "react";
import { 
  Search, Filter, Plus, BookOpen, Users, 
  DollarSign, Eye, Edit3, Trash2, CheckCircle, AlertCircle, X, AlertTriangle, Layers 
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const InstructorMyCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // 🗑️ Delete Modal State Engine
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState(null); // { id, title }
  const [isDeleting, setIsDeleting] = useState(false);

  // Get logged-in user securely
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  // 🔄 Fetch Instructor Courses
  const getInstructorCourses = async () => {
    try {
      if (!user?._id) return;
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/getInstructorCourses/${user._id}`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success) {
        setCourses(data.courses || []);
      } else {
        toast.error(data.message || "Failed to fetch courses");
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      toast.error("Something went wrong while fetching courses.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getInstructorCourses();
  }, []);

  // --- EDIT COURSE ROUTE ---
  const handleEditCourse = (id) => {
    navigate(`/instructordashboard/updatecourse/${id}`);
  };

  // --- OPEN DELETE CONFIRMATION MODAL ---
  const openDeleteModal = (id, title) => {
    setCourseToDelete({ id, title });
    setDeleteModalOpen(true);
  };

  // --- CONFIRM & EXECUTE DELETE API PIPELINE ---
  const handleConfirmDelete = async () => {
    if (!courseToDelete) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/deleteCourse/${courseToDelete.id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await response.json();

      if (data.success || response.ok) {
        setCourses(courses.filter(course => (course._id || course.id) !== courseToDelete.id));
        toast.error(`"${courseToDelete.title}" blueprint purged from cluster. 🗑️`);
        setDeleteModalOpen(false);
        setCourseToDelete(null);
      } else {
        toast.error(data.message || "Failed to delete course");
      }
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error("Server error while deleting course.");
    } finally {
      setIsDeleting(false);
    }
  };

  // --- FILTER ENGINE LOGIC ---
  const filteredCourses = courses.filter(course => {
    const query = searchTerm.trim().toLowerCase();
    const matchesSearch = 
      (course?.courseName || "").toLowerCase().includes(query) || 
      (course?.category || "").toLowerCase().includes(query);
    
    const matchesStatus = statusFilter === "All" || course?.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 dynamic-fade-in relative">
      
      {/* 1. TOP COMMAND HEADER */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <BookOpen size={22} className="text-indigo-600" /> My Blueprint Clusters
          </h1>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Manage your educational assets, audit content pipelines, monitor sales liquidity, and track active deployments.
          </p>
        </div>
        <button 
          onClick={() => {
             navigate("/instructordashboard/coursecreate"); 
             toast.info("Redirecting to Course Creator Engine...");
          }}
          className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-black px-4 py-2.5 rounded-xl text-xs transition shadow-md shadow-indigo-600/10 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus size={16} />
          <span>Create New Course</span>
        </button>
      </div>

      {/* 2. FILTER & SEARCH CONTROL MATRIX */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row gap-3 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses or categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-xs font-bold text-slate-700 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter size={14} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-black text-slate-600 focus:outline-none cursor-pointer"
          >
            <option value="All">All Status Deployments</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
        </div>
      </div>

      {/* 3. GRID CONTENT RENDER LOOPER */}
      {loading ? (
        <div className="text-center py-16">
          <p className="text-xs text-slate-400 font-medium">Loading your course clusters...</p>
        </div>
      ) : filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => {
            const courseId = course?._id || course?.id;
            
            // 🔥 Enrolled Students count fallback
            const studentsCount = 
              course?.studentsEnrolled?.length || 
              course?.students?.length || 
              course?.totalStudents || 
              0;
            
            // 🔥 Sirf Chapters/Sections count nikalne ke liye
            const courseContent = course?.courseContent || course?.sections || course?.chapters || [];
            const chaptersCount = courseContent.length;

            const priceVal = course?.price ? `₹${course.price}` : "Free";
            const revenueVal = course?.revenue || `₹${(course?.price || 0) * studentsCount}`;

            return (
              <div 
                key={courseId} 
                className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden flex flex-col justify-between group hover:border-indigo-200 transition duration-200"
              >
                {/* Asset Thumbnail Segment */}
                <div className="relative h-40 bg-slate-100 overflow-hidden">
                  <img 
                    src={course?.thumbnail || "https://via.placeholder.com/400x200?text=No+Thumbnail"} 
                    alt={course?.courseName} 
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  <span className={`absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border flex items-center gap-1 shadow-xs ${
                    course?.status === "Published" 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-100" 
                      : "bg-amber-50 text-amber-700 border-amber-100"
                  }`}>
                    {course?.status === "Published" ? <CheckCircle size={10} /> : <AlertCircle size={10} />}
                    {course?.status || "Draft"}
                  </span>
                </div>

                {/* Core Info Payload */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md inline-block">
                      {course?.category || "General"}
                    </span>
                    <h3 className="text-xs font-black text-slate-800 tracking-tight leading-snug line-clamp-2 pt-1 group-hover:text-indigo-600 transition">
                      {course?.courseName}
                    </h3>
                  </div>

                  {/* Statistical Matrix Row (Sirf Enrolled aur Chapters) */}
                  <div className="grid grid-cols-2 gap-3 border-y border-slate-100 py-3 text-[11px] font-bold text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <Users size={14} className="text-indigo-500" />
                      <span>{studentsCount} Enrolled</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Layers size={14} className="text-indigo-500" />
                      <span>{chaptersCount} Chapters</span>
                    </div>
                  </div>

                  {/* Pricing & Revenue Node */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Asset Price</p>
                      <p className="text-xs font-black text-slate-800">{priceVal}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Gross Revenue</p>
                      <p className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">
                        {revenueVal}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Operations Footer */}
                <div className="bg-slate-50 border-t border-slate-100 px-5 py-3 flex items-center justify-between gap-2">
                  <span className="text-[10px] font-mono text-slate-400">ID: {courseId?.slice(-6)}</span>
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => handleEditCourse(courseId)}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition cursor-pointer"
                      title="Edit Course Architecture"
                    >
                      <Edit3 size={12} />
                    </button>
                    <button 
                      onClick={() => openDeleteModal(courseId, course?.courseName)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition cursor-pointer"
                      title="Purge Course Asset"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-dashed border-slate-200 text-center p-12 rounded-2xl">
          <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 mx-auto mb-3">
            <BookOpen size={24} />
          </div>
          <h3 className="text-sm font-black text-slate-700">No Course Modules Detected</h3>
          <p className="text-xs text-slate-400 font-medium max-w-xs mx-auto mt-1">
            Change your pipeline search strings or compile a new course blueprint to get started.
          </p>
        </div>
      )}

      {/* 🛑 CUSTOM DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle size={20} />
              </div>
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1.5">
              <h3 className="text-base font-black text-slate-800">
                Purge Course Blueprint?
              </h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-700">"{courseToDelete?.title}"</span>? This action is permanent and will remove all associated modules from the cluster.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={isDeleting}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs py-2.5 rounded-xl transition shadow-md shadow-rose-600/20 cursor-pointer flex items-center justify-center gap-2"
              >
                {isDeleting ? "Purging..." : "Yes, Delete"}
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default InstructorMyCourses;