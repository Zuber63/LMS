import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Star, Users, ShieldCheck, User, Loader2, Check, Sparkles, Layers, CheckCircle2, FileText, PlayCircle, MessageSquare, ChevronDown } from 'lucide-react';
import { toast } from 'react-toastify';

const CourseDetails1 = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [currentUserRole, setCurrentUserRole] = useState(null); // 🏷️ New state for user role

  // 📂 Sections open/close state
  const [openSections, setOpenSections] = useState({});

  const toggleSection = (idx) => {
    setOpenSections((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  // 🛒 LocalStorage Cart Initialization
  const [cartItems, setCartItems] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cartItems));
    } catch (e) {
      console.error("LocalStorage save error:", e);
    }
  }, [cartItems]);

  useEffect(() => {
    const fetchCourseAndUserData = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!courseId) {
          throw new Error("Invalid Course ID in URL params.");
        }

        // 1. Fetch Single Course Details API
        const response = await fetch(`http://localhost:5000/api/course/getSingleCourse/${courseId}`);

        if (!response.ok) {
          throw new Error(`Server Error: Status ${response.status}`);
        }

        const result = await response.json();
        const courseData = result?.course || result?.data?.course || result?.data || result;

        if (courseData && typeof courseData === 'object') {
          setCourse(courseData);
          
          const initialSectionsState = {};
          const sectionsArr = courseData.courseContent || courseData.sections || [];
          sectionsArr.forEach((_, i) => {
            initialSectionsState[i] = false;
          });
          setOpenSections(initialSectionsState);

        } else {
          throw new Error("Course data structure is invalid.");
        }

        // 2. Fetch User Profile to check role, enrollment, and ID
        const token = localStorage.getItem("token");
        if (token) {
          try {
            const profileRes = await fetch("http://localhost:5000/api/user/getuser", {
              method: "GET",
              headers: {
                "Authorization": `Bearer ${token}`
              }
            });

            if (profileRes.ok) {
              const profileData = await profileRes.json();
              const userData = profileData?.data?.user || profileData?.user || profileData?.data || profileData;
              
              if (userData) {
                const userId = userData._id || userData.id;
                setCurrentUserId(userId);
                // 🏷️ User ka role capture kar rahe hain (e.g., "Instructor" ya "Student")
                setCurrentUserRole(userData.accountType || userData.role);
              }

              const enrolledList = profileData?.data?.enrolledCourses || profileData?.enrolledCourses;
              if (profileData?.success && Array.isArray(enrolledList)) {
                const enrolledIds = enrolledList.map(c => 
                  typeof c === 'object' ? (c._id || c.id) : c
                );
                if (enrolledIds.includes(courseId)) {
                  setIsEnrolled(true);
                }
              }
            }
          } catch (profileErr) {
            console.warn("Could not verify user/enrollment status:", profileErr);
          }
        }

      } catch (err) {
        console.error("Fetch Error:", err);
        setError(err.message || "Failed to load course details.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseAndUserData();
  }, [courseId]);

  const courseRealId = course?._id || course?.id || courseId;
  const isInCart = cartItems.some((item) => (item._id || item.id || item.courseId) === courseRealId);

  // 🛑 Strict check: Agar logged-in user ka accountType ya role "Instructor" hai, toh woh course nahi khareed sakta
  const isUserAnInstructor = currentUserRole && currentUserRole.toLowerCase() === 'instructor';

  const handleAddToCart = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please sign in first to add items to cart!");
      navigate("/signin");
      return;
    }

    // 🛑 Instructor check alert
    if (isUserAnInstructor) {
      toast.info("Instructors are not allowed to purchase courses!");
      return;
    }

    if (isInCart) {
      navigate("/studentdashboard/mycart");
      return;
    }

    if (course) {
      setCartItems([...cartItems, course]);
      toast.success(`"${course?.courseName || course?.title || 'Course'}" added to cart! 🛒`, { autoClose: 1200 });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4 pt-20">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-slate-600 font-medium text-sm">Fetching course details...</p>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center px-4 space-y-4 pt-20">
        <div className="bg-rose-50 border border-rose-100 text-rose-700 p-6 rounded-2xl text-center space-y-3 max-w-md shadow-sm">
          <h3 className="text-lg font-bold">Failed to Load Course</h3>
          <p className="text-xs text-rose-600 leading-relaxed">{error || "Course data is empty."}</p>
          <div className="pt-2 flex justify-center space-x-3">
            <button 
              onClick={() => window.location.reload()}
              className="bg-rose-600 hover:bg-rose-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Retry
            </button>
            <button 
              onClick={() => navigate('/courses')}
              className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
            >
              Back to Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  const categoryName = course.category?.name || course.category || course.categoryName || 'General';
  
  const instructorFullName = course.instructor && typeof course.instructor === 'object'
    ? `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() 
    : "Expert Instructor";
  const finalInstructorName = instructorFullName || course.instructor?.name || "Expert Instructor";

  const courseTitle = course.courseName || course.title || course.name || "Untitled Course";
  const courseDesc = course.courseDescription || course.description || course.about || "No description provided.";
  const coursePrice = course.price !== undefined ? course.price : 'Free';
  const courseThumbnail = course.thumbnail || course.image || course.courseImage || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";

  const whatYouWillLearn = Array.isArray(course.whatYouWillLearn) ? course.whatYouWillLearn : [];
  const benefits = Array.isArray(course.benefits) ? course.benefits : [];
  const instructions = Array.isArray(course.instructions) ? course.instructions : [];
  const courseContent = Array.isArray(course.courseContent) ? course.courseContent : (Array.isArray(course.sections) ? course.sections : []);
  const reviewsList = Array.isArray(course.ratingAndReviews) ? course.ratingAndReviews : (Array.isArray(course.reviews) ? course.reviews : []);

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-600 hover:text-indigo-600 bg-white border border-slate-200 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Details Section */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <span className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold px-3.5 py-1 rounded-full uppercase tracking-wider">
                  {categoryName}
                </span>
                <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1 rounded-full flex items-center space-x-1">
                  <ShieldCheck size={14} />
                  <span>Verified Content</span>
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                {courseTitle}
              </h1>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {courseDesc}
              </p>

              <div className="flex items-center space-x-4 pt-4 border-t border-slate-200">
                <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-lg">
                  {finalInstructorName !== "Expert Instructor" ? finalInstructorName.charAt(0) : <User size={22} />}
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">Instructor</p>
                  <p className="text-sm font-bold text-slate-800">
                    {finalInstructorName}
                  </p>
                </div>
              </div>
            </div>

            {/* What you will learn Section */}
            {whatYouWillLearn.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <Sparkles className="text-indigo-600" size={20} />
                  <span>What you'll learn</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {whatYouWillLearn.map((item, index) => (
                    <div key={index} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course Content / Curriculum & Videos Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <Layers className="text-indigo-600" size={20} />
                <span>Course Curriculum & Videos</span>
              </h3>
              
              {courseContent.length > 0 ? (
                <div className="space-y-3">
                  {courseContent.map((section, idx) => {
                    const subSections = 
                      section.subSection || 
                      section.subsections || 
                      section.lectures || 
                      section.videos || 
                      section.lessons || 
                      [];

                    const sectionName = 
                      section.sectionName || 
                      section.title || 
                      section.name || 
                      `Section ${idx + 1}`;

                    const isOpen = openSections[idx];

                    return (
                      <div key={idx} className="border border-slate-200 bg-slate-50/50 rounded-xl overflow-hidden transition-all">
                        
                        <div 
                          onClick={() => toggleSection(idx)}
                          className="flex justify-between items-center p-4 cursor-pointer hover:bg-slate-100/60 select-none"
                        >
                          <div className="flex items-center space-x-2">
                            <ChevronDown 
                              size={18} 
                              className={`text-slate-600 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                            />
                            <h4 className="font-bold text-slate-800 text-sm">
                              {sectionName}
                            </h4>
                          </div>

                          <span className="text-xs text-slate-500 font-medium bg-slate-200/60 px-2.5 py-1 rounded-lg">
                            {subSections.length} Lectures
                          </span>
                        </div>

                        {isOpen && subSections.length > 0 && (
                          <div className="space-y-2 p-3 pt-0 border-t border-slate-200/60 bg-white">
                            {subSections.map((lecture, lIdx) => {
                              const lectureTitle = 
                                lecture.title || 
                                lecture.subSectionName || 
                                lecture.name || 
                                lecture.lectureName || 
                                lecture.heading || 
                                `Lecture ${lIdx + 1}`;

                              const lectureDuration = 
                                lecture.timeDuration || 
                                lecture.duration || 
                                lecture.length || 
                                "";

                              return (
                                <div key={lecture._id || lIdx} className="flex items-center justify-between text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100 mt-2">
                                  <div className="flex items-center space-x-2 min-w-0">
                                    <PlayCircle size={15} className="text-indigo-600 shrink-0" />
                                    <span className="font-medium truncate">{lectureTitle}</span>
                                  </div>
                                  {lectureDuration && (
                                    <span className="text-slate-400 shrink-0">{lectureDuration}</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No curriculum sections or videos available yet.</p>
              )}
            </div>

            {/* Benefits Section */}
            {benefits.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <BookOpen className="text-indigo-600" size={20} />
                  <span>Key Benefits</span>
                </h3>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs sm:text-sm text-slate-700">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600"></span>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements Section */}
            {instructions.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                  <FileText className="text-indigo-600" size={20} />
                  <span>Requirements & Instructions</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
                  {instructions.map((inst, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{inst}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Section */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <MessageSquare className="text-indigo-600" size={20} />
                <span>Student Reviews & Ratings</span>
              </h3>

              {reviewsList.length > 0 ? (
                <div className="space-y-3">
                  {reviewsList.map((review, rIdx) => {
                    const reviewerName = review.user ? `${review.user.firstName || ''} ${review.user.lastName || ''}`.trim() : "Student";
                    return (
                      <div key={rIdx} className="border border-slate-100 bg-slate-50/50 p-4 rounded-xl space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-bold text-xs text-slate-800">{reviewerName || "Verified Student"}</span>
                          <div className="flex items-center space-x-1 text-amber-500 text-xs font-bold">
                            <Star size={14} className="fill-amber-400 text-amber-400" />
                            <span>{review.rating || 5}</span>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{review.review || review.comment || "No comment provided."}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">No reviews yet for this course.</p>
              )}
            </div>

          </div>

          {/* Right Sticky Checkout Box */}
          <div className="relative">
            <div className="sticky top-28 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden space-y-6">
              <div className="relative h-48 bg-slate-900">
                <img 
                  src={courseThumbnail} 
                  alt="Thumbnail" 
                  className="w-full h-full object-cover opacity-90"
                />
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase">Price</span>
                  <span className="text-3xl font-black text-slate-900">
                    {coursePrice === 0 || coursePrice === '0' || coursePrice === 'Free' ? 'Free' : `₹${coursePrice}`}
                  </span>
                </div>

                {isEnrolled ? (
                  <button 
                    onClick={() => navigate(`/studentdashboard/courseviewer/${courseRealId}`)}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3.5 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <Check size={16} className="stroke-[3]" />
                    <span>Go to Course</span>
                  </button>
                ) : isUserAnInstructor ? (
                  // 🛑 Instructor Notice Box (Chahe kisi bhi instructor ka course ho)
                  <div className="bg-amber-50 border border-amber-200 text-amber-800 text-xs font-medium p-3.5 rounded-xl text-center leading-relaxed">
                    Instructors are not permitted to buy courses.
                  </div>
                ) : (
                  <div className="space-y-3">
                    <button 
                      onClick={handleAddToCart}
                      className={`w-full font-semibold py-3.5 rounded-xl shadow-md transition-all text-xs tracking-wider uppercase cursor-pointer ${
                        isInCart ? "bg-emerald-600 hover:bg-emerald-700 text-white" : "bg-indigo-600 hover:bg-indigo-700 text-white"
                      }`}
                    >
                      {isInCart ? "Go to Cart 🛒" : "Add to Cart 🛒"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CourseDetails1;