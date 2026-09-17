import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Award,
  Star,
  Users,
  Smartphone,
  ShieldCheck,
  ArrowRight,
  Check,
} from "lucide-react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";

const CourseDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSection, setExpandedSection] = useState(0);
  const [isEnrolled, setIsEnrolled] = useState(false);

  // 🛒 Cart Items Initialization from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // 🔄 Sync Cart items changes to localStorage automatically
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Fetch course details & check enrollment status
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        setLoading(true);

        // 1. Fetch Course Details
        const res = await fetch(
          `${import.meta.env.VITE_API_URL}/api/course/getSingleCourse/${courseId}`,
        );
        const result = await res.json();
        if (result && result.success) {
          const courseData = result.course || result.data;
          setCourse(courseData);

          // 2. Fetch Student Enrolled Courses
          const token = localStorage.getItem("token");
          if (token) {
            const profileRes = await fetch(
              `${import.meta.env.VITE_API_URL}/api/user/getuser`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );
            const profileData = await profileRes.json();

            if (profileData?.success && profileData?.data?.enrolledCourses) {
              const enrolledIds = profileData.data.enrolledCourses.map((c) =>
                typeof c === "object" ? c._id : c,
              );
              setIsEnrolled(enrolledIds.includes(courseId));
            }
          }
        } else {
          toast.error(result.message || "Failed to load course details");
        }
      } catch (error) {
        console.error("Error fetching course details:", error);
        toast.error("Error fetching course details");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId]);

  // 📥 Add to Cart Click Handler
  const handleAddToCart = () => {
    if (!course) return;
    const isAlreadyInCart = cartItems.some((item) => item._id === course._id);

    if (isAlreadyInCart) {
      toast.info("Course already in cart! Redirecting... 🛒", {
        autoClose: 1500,
      });
      navigate("/studentdashboard/mycart");
      return;
    }

    setCartItems([...cartItems, course]);
    toast.success(`"${course?.courseName}" added to your cart! 🛒`, {
      autoClose: 1000,
    });
  };

  // 💳 Buy Now Handler
  const handleBuyNow = () => {
    if (!course) return;
    const isAlreadyInCart = cartItems.some((item) => item._id === course._id);

    if (!isAlreadyInCart) {
      setCartItems([...cartItems, course]);
    }

    toast.info("Redirecting to checkout panel... 💳", { autoClose: 1200 });

    setTimeout(() => {
      navigate("/studentdashboard/mycart");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-indigo-600 font-bold text-lg animate-pulse">
          Loading course details... 🚀
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="w-full h-96 flex items-center justify-center">
        <div className="text-slate-500 font-bold text-lg">
          Course not found.
        </div>
      </div>
    );
  }

  const courseInCart = cartItems.some((item) => item._id === course._id);

  // Calculate average rating safely
  const avgRating =
    course.ratingAndReviews?.length > 0
      ? (
          course.ratingAndReviews.reduce(
            (acc, rev) => acc + (rev.rating || 0),
            0,
          ) / course.ratingAndReviews.length
        ).toFixed(1)
      : "4.8";

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-8 text-slate-800">
      {/* HERO SECTION */}
      <div className="bg-slate-900 text-white p-6 md:p-10 rounded-3xl mb-8 border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-4">
          <span className="bg-indigo-600 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-md tracking-wider">
            {course.category?.name || course.category || "Bestseller 🔥"}
          </span>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight">
            {course.courseName}
          </h1>
          <p className="text-slate-300 text-sm md:text-base leading-relaxed font-medium">
            {course.courseDescription}
          </p>

          <div className="flex flex-wrap items-center gap-3 md:gap-4 text-xs md:text-sm font-bold pt-2">
            <div className="flex items-center gap-1 text-amber-400">
              <span className="font-black text-white text-sm">{avgRating}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    fill="currentColor"
                    className="text-amber-400"
                  />
                ))}
              </div>
              <span className="text-slate-400 font-medium">
                ({course.ratingAndReviews?.length || 0} reviews)
              </span>
            </div>
            <div className="hidden sm:block text-slate-400">•</div>
            <div className="flex items-center gap-1">
              <Users size={14} className="text-indigo-400" />
              <span>
                {course.studentsEnrolled?.length || 0} students enrolled
              </span>
            </div>
            <div className="hidden sm:block text-slate-400">•</div>
            <div className="text-slate-300">
              Instructor:{" "}
              <span className="text-indigo-400 underline font-black">
                {course.instructor?.firstName} {course.instructor?.lastName}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* LEFT COLUMN */}
        <div className="flex-1 space-y-8 w-full min-w-0">
          {/* 1. WHAT YOU WILL LEARN SECTION */}
          {course.whatYouWillLearn && course.whatYouWillLearn.length > 0 && (
            <div className="border border-indigo-100 bg-indigo-50/40 p-5 md:p-6 rounded-2xl shadow-3xs space-y-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                What you'll learn
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.whatYouWillLearn.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle
                      size={16}
                      className="text-indigo-600 shrink-0 mt-0.5"
                    />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. COURSE BENEFITS / PERKS SECTION */}
          {course.benefits && course.benefits.length > 0 && (
            <div className="border border-slate-200 bg-white p-5 md:p-6 rounded-2xl shadow-3xs space-y-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Course Benefits
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.benefits.map((benefit, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2.5 text-xs font-semibold text-slate-700"
                  >
                    <Check
                      size={16}
                      className="text-emerald-600 shrink-0 mt-0.5 stroke-[3]"
                    />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COURSE CONTENT */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Course content
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  {course.courseContent?.length || 0} sections •{" "}
                  {course.courseContent?.reduce(
                    (acc, curr) => acc + (curr.subsections?.length || 0),
                    0,
                  )}{" "}
                  lectures
                </p>
              </div>
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === null ? 0 : null)
                }
                className="text-indigo-600 text-xs font-black hover:underline cursor-pointer self-start sm:self-auto"
              >
                Expand/Collapse Sections
              </button>
            </div>

            <div className="border border-slate-200/80 rounded-2xl bg-white overflow-hidden shadow-3xs divide-y divide-slate-100">
              {course.courseContent?.map((section, sIdx) => {
                const isOpen = expandedSection === sIdx;
                return (
                  <div key={section._id || sIdx} className="transition">
                    <button
                      onClick={() => setExpandedSection(isOpen ? null : sIdx)}
                      className="w-full px-4 md:px-5 py-4 flex items-center justify-between text-left bg-slate-50/60 hover:bg-slate-50 transition cursor-pointer"
                    >
                      <div className="pr-2 min-w-0">
                        <span className="block font-black text-xs md:text-sm text-slate-800 tracking-tight leading-tight">
                          {section.sectionName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold mt-0.5 block">
                          {section.subsections?.length || 0} lectures
                        </span>
                      </div>
                      <div className="text-slate-400 shrink-0">
                        {isOpen ? (
                          <ChevronUp size={16} />
                        ) : (
                          <ChevronDown size={16} />
                        )}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="bg-white divide-y divide-slate-50 px-4 md:px-5 py-1">
                        {section.subsections?.map((lecture, lIdx) => (
                          <div
                            key={lecture._id || lIdx}
                            className="py-3 flex items-center justify-between gap-4 text-xs"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <BookOpen
                                size={13}
                                className="text-slate-400 shrink-0"
                              />
                              <span className="text-slate-600 font-semibold truncate">
                                {lecture.title}
                              </span>
                            </div>
                            <span className="text-slate-400 font-bold shrink-0">
                              {lecture.timeDuration || "10 mins"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. INSTRUCTIONS SECTION */}
          {course.instructions && course.instructions.length > 0 && (
            <div className="border border-slate-200 bg-white p-5 md:p-6 rounded-2xl shadow-3xs space-y-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Requirements / Instructions
              </h2>
              <ul className="list-disc list-inside space-y-2 text-xs font-medium text-slate-600">
                {course.instructions.map((instruction, index) => (
                  <li key={index}>{instruction}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 🔥 4. FULLY RESPONSIVE RATINGS & REVIEWS SECTION */}
          <div className="border border-slate-200 bg-white p-5 md:p-6 rounded-2xl shadow-3xs space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-slate-900 tracking-tight">
                  Student Ratings & Reviews
                </h2>
                <p className="text-xs text-slate-400 font-bold mt-0.5">
                  Real feedback from verified enrolled students
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200/60 px-3 py-1.5 rounded-full self-start sm:self-auto">
                <Star
                  size={14}
                  fill="currentColor"
                  className="text-amber-500 shrink-0"
                />
                <span className="font-black text-xs text-amber-800">
                  {avgRating} out of 5
                </span>
              </div>
            </div>

            {course.ratingAndReviews && course.ratingAndReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {course.ratingAndReviews.map((review, index) => {
                  const reviewerName = review.user
                    ? `${review.user.firstName || ""} ${review.user.lastName || ""}`.trim()
                    : "Verified Student";
                  const reviewerImage =
                    review.user?.image ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${reviewerName}`;

                  return (
                    <div
                      key={review._id || index}
                      className="p-4 rounded-xl border border-slate-200/70 bg-slate-50/60 flex flex-col justify-between space-y-3"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img
                            src={reviewerImage}
                            alt={reviewerName}
                            className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0"
                          />
                          <span className="font-bold text-xs text-slate-800 truncate">
                            {reviewerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-0.5 shrink-0">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              fill={
                                i < (review.rating || 5)
                                  ? "currentColor"
                                  : "none"
                              }
                              className={
                                i < (review.rating || 5)
                                  ? "text-amber-400"
                                  : "text-slate-300"
                              }
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 font-medium leading-relaxed italic break-words">
                        "
                        {review.review ||
                          review.comment ||
                          "Great course! Learned a lot of new concepts."}
                        "
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 px-4 text-slate-400 text-xs font-semibold bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                No reviews yet for this course. Be the first to leave a review
                after enrolling! 🌟
              </div>
            )}
          </div>

          {/* INSTRUCTOR */}
          <div className="border border-slate-200 bg-white p-5 md:p-6 rounded-2xl shadow-3xs space-y-4">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              Your Instructor
            </h2>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <img
                src={
                  course.instructor?.image ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=instructor"
                }
                alt="Instructor"
                className="w-14 h-14 rounded-full object-cover border-2 border-indigo-100 shadow-sm shrink-0"
              />
              <div className="space-y-0.5">
                <h3 className="font-black text-sm text-slate-800">
                  {course.instructor?.firstName} {course.instructor?.lastName}
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  {course.instructor?.additionalInfo?.profession}
                </p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed pt-1">
                  {course.instructor?.additionalInfo?.about ||
                    "Experienced developer and instructor passionate about teaching software engineering best practices."}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: STICKY CHECKOUT CARD */}
        <div className="w-full lg:w-80 lg:sticky lg:top-6 bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden shrink-0">
          <div className="aspect-video bg-slate-900 flex items-center justify-center relative border-b border-slate-200 overflow-hidden">
            <img
              src={course.thumbnail}
              alt="Thumbnail"
              className="w-full h-full object-cover absolute opacity-60"
            />
            <div className="text-center p-4 z-10">
              <span className="text-indigo-300 text-[10px] font-black uppercase block tracking-widest mb-1">
                Preview Course
              </span>
              <div className="w-10 h-10 mx-auto rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white cursor-pointer transition mb-2 shadow">
                <BookOpen size={16} fill="currentColor" className="ml-0.5" />
              </div>
              <span className="text-[10px] text-white font-bold block drop-shadow">
                Click to watch intro
              </span>
            </div>
          </div>

          <div className="p-5 space-y-5">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900">
                  ₹{course.price}
                </span>
                <span className="text-xs text-slate-400 font-bold line-through">
                  ₹{course.originalPrice || Number(course.price) * 3}
                </span>
              </div>
            </div>

            {/* DYNAMIC CTAs (ENROLLED vs CART / BUY NOW) */}
            {isEnrolled ? (
              <button
                onClick={() =>
                  navigate(`/studentdashboard/courseviewer/${course._id}`)
                }
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-600/10 cursor-pointer transition"
              >
                <Check size={14} className="stroke-[3]" />{" "}
                <span>Go to Course 🚀</span>
              </button>
            ) : (
              <div className="space-y-2.5">
                <button
                  onClick={handleAddToCart}
                  className={`w-full font-bold text-xs py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border ${
                    courseInCart
                      ? "bg-emerald-50 border-emerald-200 text-emerald-600 font-black"
                      : "border-slate-200 text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {courseInCart ? (
                    <>
                      <Check size={14} className="stroke-[3]" /> Added to Cart
                    </>
                  ) : (
                    "Add to Cart 🛒"
                  )}
                </button>

                <button
                  onClick={handleBuyNow}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 cursor-pointer transition"
                >
                  <span>Enroll In Course Now</span> <ArrowRight size={14} />
                </button>
              </div>
            )}

            <div className="space-y-2.5 pt-2 border-t border-slate-100 text-[11px] text-slate-600 font-semibold">
              <span className="text-[10px] text-slate-400 font-black uppercase tracking-wider block">
                This course includes:
              </span>
              <div className="flex items-center gap-2">
                <Clock size={13} className="text-slate-400" />{" "}
                <span>On-demand comprehensive video</span>
              </div>
              <div className="flex items-center gap-2">
                <BookOpen size={13} className="text-slate-400" />{" "}
                <span>Full lifetime source access</span>
              </div>
              <div className="flex items-center gap-2">
                <Smartphone size={13} className="text-slate-400" />{" "}
                <span>Access on mobile and website dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <Award size={13} className="text-slate-400" />{" "}
                <span>Verified Certificate of Completion</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck size={13} className="text-slate-400" />{" "}
                <span>100% Risk-Free Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;