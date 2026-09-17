import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Clock, BookOpen, ArrowRight, Loader2 } from "lucide-react";

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  // Background gradients ka array
  const gradients = [
    "from-blue-600 to-indigo-600",
    "from-purple-600 to-pink-600",
    "from-emerald-600 to-teal-600",
    "from-amber-600 to-orange-600",
    "from-indigo-600 to-violet-600",
    "from-rose-600 to-red-600",
  ];

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/course/getAllCourses",
        );
        const result = await response.json();
        const courseData = result.data || result.courses || result;

        if (Array.isArray(courseData)) {
          const publishedCourses = courseData.filter(
            (course) =>
              course.status === "Published" ||
              course.isPublished === true ||
              !course.status, // Agar status field nahi hai toh by default dikha dega
          );
          setCourses(publishedCourses);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching popular courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const handleEnrollClick = (courseId) => {
    if (isLoggedIn) {
      navigate(`/coursedetails1/${courseId}`);
    } else {
      navigate("/signin");
    }
  };

  return (
    <section className="bg-slate-50 py-20 lg:py-28 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div className="space-y-3 max-w-xl">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Top Rated Programs
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Explore Our{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Popular Courses
              </span>
            </p>
            <p className="text-sm text-slate-500">
              Pick from our highly curated courses built specifically to match
              current tech industry requirements.
            </p>
          </div>

          <button
            onClick={() => navigate("/courses")}
            className="inline-flex items-center space-x-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition group self-start md:self-auto whitespace-nowrap cursor-pointer"
          >
            <span>View All Courses</span>
            <ArrowRight
              size={16}
              className="transform group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center text-slate-400 py-16">
            No published courses available at the moment.
          </div>
        ) : (
          /* Courses Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const currentGradient = gradients[index % gradients.length];
              const categoryName =
                course.category?.name || course.category || "Development";
              const instructorName = course.instructor
                ? `${course.instructor.firstName || ""} ${course.instructor.lastName || ""}`.trim()
                : "LMS Expert";
              const thumbnail = course.thumbnail;
              const courseId = course._id || course.id;

              return (
                <div
                  key={courseId}
                  className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-slate-300/80 transition-all duration-300 flex flex-col group"
                >
                  {/* Course Thumbnail or Gradient Placeholder */}
                  {thumbnail ? (
                    <div
                      className="h-48 overflow-hidden relative cursor-pointer"
                      onClick={() => handleEnrollClick(courseId)}
                    >
                      <img
                        src={thumbnail}
                        alt={course.courseName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div
                      onClick={() => handleEnrollClick(courseId)}
                      className={`h-48 bg-gradient-to-br ${currentGradient} flex items-center justify-center p-6 text-white font-black text-xl tracking-wide relative cursor-pointer`}
                    >
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                      <span className="text-center line-clamp-2">
                        {course.courseName}
                      </span>
                    </div>
                  )}

                  {/* Course Meta & Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="inline-block bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md">
                        {categoryName}
                      </span>

                      <h3
                        onClick={() => handleEnrollClick(courseId)}
                        className="text-base font-bold text-slate-900 tracking-tight leading-snug hover:text-indigo-600 transition cursor-pointer line-clamp-2"
                      >
                        {course.courseName}
                      </h3>

                      <p className="text-xs text-slate-400">
                        By {instructorName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-500 border-b border-slate-100 pb-3">
                      <div className="flex items-center space-x-1 font-semibold text-slate-700">
                        <Star
                          size={14}
                          className="text-amber-500 fill-amber-500"
                        />
                        <span>{course.rating || "4.8"}</span>
                        <span className="text-slate-400 font-normal">
                          ({course.ratings?.length || "500+"})
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <span className="flex items-center space-x-1">
                          <BookOpen size={13} className="text-slate-400" />
                          <span>
                            {course.courseContent?.length ||
                              course.lessons ||
                              "20"}{" "}
                            ch
                          </span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Clock size={13} className="text-slate-400" />
                          <span>{course.duration || "15 hrs"}</span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-xl font-extrabold text-slate-900">
                          ₹{course.price}
                        </span>
                        <span className="text-xs text-slate-400 line-through">
                          ₹{Number(course.price || 0) * 3 || "4,999"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleEnrollClick(courseId)}
                        className="bg-slate-900 text-white group-hover:bg-indigo-600 font-medium text-xs px-4 py-2.5 rounded-xl transition-colors duration-200 cursor-pointer"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Courses;
