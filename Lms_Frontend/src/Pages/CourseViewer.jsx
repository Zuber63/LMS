import React, { useState, useEffect, useRef, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Play,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Bookmark,
  ArrowRight,
  Gauge,
  Megaphone,
  Star,
  MessageSquare,
  Loader2,
  Check,
  Sparkles,
} from "lucide-react";
import { toast } from "react-toastify";

const CourseViewer = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef(null);

  // 🔄 Loading & Course states
  const [courseData, setCourseData] = useState(null);
  const [courseSyllabus, setCourseSyllabus] = useState([]);
  const [allLectures, setAllLectures] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  // 📑 Navigation & Tabs States
  const [activeTab, setActiveTab] = useState("description");
  const [sidebarTab, setSidebarTab] = useState("syllabus");
  const [expandedSection, setExpandedSection] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  // 📌 Workspace Notes States
  const [bookmarkInput, setBookmarkInput] = useState("");
  const [savedBookmarks, setSavedBookmarks] = useState([
    {
      id: 1,
      text: "MERN Stack architecture initialization step",
      timestamp: "02:15",
    },
  ]);

  // ⭐ Review & Rating States
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [courseReviews, setCourseReviews] = useState([]);

  const [completedLectures, setCompletedLectures] = useState([]);

  const fetchFullCourseDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("User token missing! Please login again.");
        setLoading(false);
        return;
      }

      // 1. Fetch User Data (contains courseProgress info)
      const responseuser = await fetch(
        `${import.meta.env.VITE_API_URL}/api/user/getuser`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const userData = await responseuser.json();

      // 🎯 EXTRACT COMPLETED SUBSECTIONS FOR CURRENT COURSE FROM USER DATA
      let completedList = [];
      if (userData.success && userData.data) {
        const userProfile = userData.data;
        const userProgressArray =
          userProfile.courseProgress || userProfile.coursesProgress || [];

        const currentCourseProgress = userProgressArray.find(
          (cp) =>
            String(cp.courseId || cp.course?._id || cp.course) ===
            String(courseId),
        );

        if (currentCourseProgress) {
          const rawCompleted =
            currentCourseProgress.completedVideos ||
            currentCourseProgress.subSectionId ||
            [];
          completedList = Array.isArray(rawCompleted)
            ? rawCompleted.map((item) =>
                typeof item === "object" && item !== null
                  ? String(item._id || item.subSectionId || item.id)
                  : String(item),
              )
            : [];
        }
      }

      setCompletedLectures(completedList);

      // 2. Fetch Single Course Data (Syllabus, Details, Reviews, etc.)
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/course/getSingleCourse/${courseId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      const resData = await response.json();
      if (resData.success) {
        const fetchedCourse = resData.course || resData.data;
        setCourseData(fetchedCourse);
        setCourseReviews(fetchedCourse?.ratingAndReviews || []);

        const formattedSyllabus = fetchedCourse?.courseContent || [];
        setCourseSyllabus(formattedSyllabus);

        // Subsections mapping with String ID conversion
        const flattened = formattedSyllabus.flatMap((section, sIdx) =>
          (section.subsections || section.subSection || []).map((sub) => ({
            id: String(sub._id),
            title: sub.title,
            duration: sub.timeDuration || "0:00",
            videoUrl: sub.videoUrl,
            sectionIndex: sIdx,
          })),
        );
        setAllLectures(flattened);

        if (flattened.length > 0) {
          const firstUncompleted = flattened.find(
            (l) => !completedList.includes(l.id),
          );
          const defaultVideo = firstUncompleted || flattened[0];
          setCurrentVideo(defaultVideo);
          setExpandedSection(defaultVideo.sectionIndex);
        }
      } else {
        toast.error(resData.message || "Failed to load course details");
      }
    } catch (error) {
      console.error("Error loading course environment:", error);
      toast.error("Network error while fetching course data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (courseId) {
      fetchFullCourseDetails();
    }
  }, [courseId]);

  // ==========================================
  // 🧮 Dynamic Progress Percentage Calculator
  // ==========================================
  const courseProgress = useMemo(() => {
    if (!allLectures.length) return 0;
    const validCompletedCount = allLectures.filter((lec) =>
      completedLectures.includes(lec.id),
    ).length;
    return Math.min(
      100,
      Math.round((validCompletedCount / allLectures.length) * 100),
    );
  }, [completedLectures, allLectures]);

  // ==========================================
  // 🛠️ DATABASE SYNC API CALL (Progress)
  // ==========================================
  const updateLectureStatusOnDB = async (lectureId, isCompleting) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Authorization Token missing! Please login again.");
        return false;
      }

      const url = isCompleting
        ? `${import.meta.env.VITE_API_URL}/api/course/updateCourseProgress`
        : `${import.meta.env.VITE_API_URL}/api/course/removeCourseProgress`;

      const payload = {
        courseId: String(courseId),
        subSectionId: String(lectureId),
      };

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (!data.success) {
        toast.error(`DB Error: ${data.message || "Progress update failed"}`);
        return false;
      }

      return true;
    } catch (err) {
      console.error("Database sync error:", err);
      toast.error("Server connection failed during DB update!");
      return false;
    }
  };

  // ==========================================
  // 🎥 Video Completion Handler
  // ==========================================
  const handleVideoEnded = async () => {
    if (!currentVideo) return;
    const currentIdStr = String(currentVideo.id);

    if (!completedLectures.includes(currentIdStr)) {
      setCompletedLectures((prev) => [...prev, currentIdStr]);
      const success = await updateLectureStatusOnDB(currentIdStr, true);
      if (success) {
        toast.success("Progress saved in Database! 🎉", { autoClose: 1500 });
      } else {
        setCompletedLectures((prev) =>
          prev.filter((id) => id !== currentIdStr),
        );
      }
    }

    handleNextLectureLoad(false);
  };

  // ==========================================
  // 🔘 Manual Checkbox & Next Button Handlers
  // ==========================================
  const handleManualCheckToggle = async (id, e) => {
    if (e) e.stopPropagation();

    const lectureIdStr = String(id);
    const isAlreadyCompleted = completedLectures.includes(lectureIdStr);

    if (isAlreadyCompleted) {
      setCompletedLectures((prev) =>
        prev.filter((item) => item !== lectureIdStr),
      );
      const success = await updateLectureStatusOnDB(lectureIdStr, false);
      if (success) {
        toast.info("Removed from DB progress.");
      } else {
        setCompletedLectures((prev) => [...prev, lectureIdStr]);
      }
    } else {
      setCompletedLectures((prev) => [...prev, lectureIdStr]);
      const success = await updateLectureStatusOnDB(lectureIdStr, true);
      if (success) {
        toast.success("Marked completed & saved in DB! 🎉");
      } else {
        setCompletedLectures((prev) =>
          prev.filter((item) => item !== lectureIdStr),
        );
      }
    }
  };

  const handleNextLectureLoad = async (manualClick = false) => {
    if (!currentVideo) return;
    const currentIdStr = String(currentVideo.id);

    if (manualClick && !completedLectures.includes(currentIdStr)) {
      setCompletedLectures((prev) => [...prev, currentIdStr]);
      await updateLectureStatusOnDB(currentIdStr, true);
    }

    const currentIdx = allLectures.findIndex((l) => l.id === currentIdStr);
    const nextVideo = allLectures[currentIdx + 1];

    if (nextVideo) {
      setCurrentVideo(nextVideo);
      setExpandedSection(nextVideo.sectionIndex);
      toast.info("Playing Next Lecture 🎬", { autoClose: 1200 });
    } else {
      toast.dark("Congratulations! You completed the course! 🏆");
    }
  };

  const handleSpeedChange = (speed) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
      toast.info(`Speed set to ${speed}x ⚡`, { autoClose: 800 });
    }
  };

  const handleAddBookmark = (e) => {
    e.preventDefault();
    if (!bookmarkInput.trim()) return;
    setSavedBookmarks([
      ...savedBookmarks,
      {
        id: Date.now(),
        text: bookmarkInput,
        timestamp: `${Math.floor((videoRef.current?.currentTime || 0) / 60)}:${String(Math.floor((videoRef.current?.currentTime || 0) % 60)).padStart(2, "0")}`,
      },
    ]);
    setBookmarkInput("");
    toast.success("Note saved! 📌");
  };

  // ==========================================
  // ⭐ Review & Rating API Call Handler
  // ==========================================
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) {
      toast.error("Please write feedback first!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/api/course/createRating`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            courseId: String(courseId),
            rating: Number(reviewRating),
            review: reviewComment.trim(),
          }),
        },
      );

      const resData = await response.json();

      if (resData.success) {
        toast.success("Review submitted and saved successfully! ⭐");

        // Fetch user info from localStorage to display instantly in the reviews list
        const userLocal = JSON.parse(localStorage.getItem("user")) || {};
        const newReviewObj = {
          _id: resData.data?._id || Date.now().toString(),
          user: {
            firstName: userLocal.firstName || "You",
            lastName: userLocal.lastName || "",
          },
          rating: reviewRating,
          review: reviewComment.trim(),
          createdAt: new Date().toISOString(),
        };

        setCourseReviews((prev) => [newReviewObj, ...prev]);
        setReviewComment("");
        setReviewRating(5);
      } else {
        toast.error(resData.message || "Failed to submit review");
      }
    } catch (error) {
      console.error("Review Submit Error:", error);
      toast.error("Network error while submitting review");
    }
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="animate-spin text-indigo-600" size={48} />
        <p className="text-sm font-bold text-slate-500">
          Loading Course Space...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-6 py-4 flex flex-col lg:flex-row gap-6 h-[calc(100vh-100px)] overflow-hidden">
      {/* LEFT PORTION (VIDEO PLAYER & DETAILS) */}
      <div className="flex-1 flex flex-col h-full overflow-y-auto pr-0 lg:pr-2 space-y-5 scrollbar-thin">
        {/* TOP BAR WITH PROGRESS % & BAR */}
        <div className="flex flex-col gap-2 bg-white p-3 border border-slate-200/60 rounded-xl shadow-3xs">
          <div className="flex items-center justify-between">
            <div
              onClick={() => navigate("/studentdashboard/mycourses")}
              className="flex items-center gap-2 text-slate-500 font-bold text-xs cursor-pointer hover:text-indigo-600 transition"
            >
              <ArrowLeft size={14} /> <span>Back to Curriculum</span>
            </div>
            <span className="text-[10px] bg-gradient-to-r from-emerald-600 to-indigo-600 text-white font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-xs flex items-center gap-1.5">
              <Sparkles size={11} className="animate-pulse" /> {courseProgress}%
              COMPLETED
            </span>
          </div>

          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-indigo-600 h-full transition-all duration-300 rounded-full"
              style={{ width: `${courseProgress}%` }}
            />
          </div>
        </div>

        {/* MOVIE PLAYER SCREEN */}
        <div className="w-full bg-slate-950 rounded-2xl overflow-hidden aspect-video shadow-xl border border-slate-900 relative group">
          {currentVideo ? (
            <video
              ref={videoRef}
              key={currentVideo.id}
              src={currentVideo.videoUrl}
              controls
              autoPlay
              onPlay={() => {
                if (videoRef.current)
                  videoRef.current.playbackRate = playbackSpeed;
              }}
              onEnded={handleVideoEnded}
              className="w-full h-full object-contain"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
              <Play size={40} className="animate-pulse mb-2 text-indigo-500" />
              <p className="text-xs font-bold">
                No lecture selected. Click sidebar syllabus to play.
              </p>
            </div>
          )}
          <div className="absolute top-4 right-4 bg-slate-900/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-800/80 flex items-center gap-2 transition opacity-0 group-hover:opacity-100 duration-200 z-10">
            <Gauge size={12} className="text-indigo-400" />
            <select
              value={playbackSpeed}
              onChange={(e) => handleSpeedChange(Number(e.target.value))}
              className="bg-transparent text-[10px] font-black text-slate-200 outline-none cursor-pointer"
            >
              <option value="0.5" className="bg-slate-900 text-white">
                0.5x
              </option>
              <option value="1" className="bg-slate-900 text-white">
                1.0x (Normal)
              </option>
              <option value="1.5" className="bg-slate-900 text-white">
                1.5x
              </option>
              <option value="2" className="bg-slate-900 text-white">
                2.0x 🚀
              </option>
            </select>
          </div>
        </div>

        {/* CONTROLLER BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 border border-slate-200 rounded-2xl shadow-sm">
          <div className="space-y-1 min-w-0 flex-1">
            <h2 className="text-xs md:text-sm font-black text-slate-800 leading-snug tracking-tight truncate">
              {currentVideo ? currentVideo.title : "Initialization Completed"}
            </h2>
            <p className="text-[10px] font-bold text-slate-400">
              Track: {courseData?.courseName} • Instructor:{" "}
              {courseData?.instructor?.firstName}{" "}
              {courseData?.instructor?.lastName}
            </p>
          </div>
          <button
            onClick={() => handleNextLectureLoad(true)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-5 py-3 rounded-xl flex items-center justify-center gap-2 shadow-md shadow-indigo-600/10 cursor-pointer transition shrink-0"
          >
            {currentVideo &&
            completedLectures.includes(String(currentVideo.id)) ? (
              <>
                <span>Skip & Next</span> <ArrowRight size={14} />
              </>
            ) : (
              <>
                <Check size={14} className="stroke-[3]" />{" "}
                <span>Mark Completed & Next</span>
              </>
            )}
          </button>
        </div>

        {/* TAB CONTROLLER */}
        <div className="border-b border-slate-200 flex gap-5 pt-2">
          {["description", "announcements", "reviews"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2.5 text-xs font-black uppercase tracking-wider border-b-2 transition cursor-pointer ${
                activeTab === tab
                  ? "border-indigo-600 text-indigo-600"
                  : "border-transparent text-slate-400 hover:text-slate-600"
              }`}
            >
              {tab === "description"
                ? "Overview"
                : tab === "announcements"
                  ? "Announcements"
                  : "Reviews & Feed"}
            </button>
          ))}
        </div>

        {/* TAB CONTENT VIEWS */}
        <div className="bg-white border border-slate-200 p-5 rounded-2xl shadow-xs text-xs text-slate-600 leading-relaxed font-medium">
          {activeTab === "description" && (
            <div className="space-y-2">
              <h3 className="font-bold text-slate-800">About this course</h3>
              <p>
                {courseData?.courseDescription ||
                  "No course description available."}
              </p>
            </div>
          )}

          {activeTab === "announcements" && (
            <div className="flex gap-3 bg-indigo-50/50 border border-indigo-100 p-3 rounded-xl">
              <Megaphone
                size={16}
                className="text-indigo-600 shrink-0 mt-0.5"
              />
              <div>
                <span className="text-[10px] font-black text-indigo-950 uppercase block">
                  Live doubt class notification
                </span>
                <p className="text-slate-600 text-[11px] mt-0.5">
                  Saturday doubt clearance live session is scheduled.
                </p>
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="space-y-6">
              <form
                onSubmit={handleReviewSubmit}
                className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h4 className="font-black text-slate-800 text-xs uppercase tracking-wide flex items-center gap-1">
                    <MessageSquare size={13} className="text-indigo-600" />{" "}
                    Share Your Course Experience
                  </h4>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        onMouseEnter={() => setReviewHoverRating(star)}
                        onMouseLeave={() => setReviewHoverRating(0)}
                        className="text-amber-400 focus:outline-none transition-transform active:scale-120 cursor-pointer"
                      >
                        <Star
                          size={16}
                          fill={
                            star <= (reviewHoverRating || reviewRating)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Write honest feedback here..."
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 transition shadow-3xs"
                  />
                  <button
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white font-black text-xs px-4 rounded-xl transition cursor-pointer"
                  >
                    Submit
                  </button>
                </div>
              </form>

              <div className="space-y-3 divide-y divide-slate-100 max-h-60 overflow-y-auto pr-1 scrollbar-thin">
                {courseReviews.length > 0 ? (
                  courseReviews.map((rev) => (
                    <div key={rev._id} className="pt-3 first:pt-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-black text-slate-800 text-[11px]">
                          {rev?.userId?.firstName} {rev?.userId?.lastName}
                        </span>
                        <span className="text-[10px] text-slate-400 font-bold">
                          {rev.createdAt
                            ? new Date(rev.createdAt).toLocaleDateString()
                            : "Just now"}
                        </span>
                      </div>
                      <div className="flex gap-0.5 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={11}
                            fill={i < rev.rating ? "currentColor" : "none"}
                          />
                        ))}
                      </div>
                      <p className="text-slate-500 text-[11px] font-medium leading-relaxed">
                        {rev.review}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-center py-4 text-slate-400 text-[11px] font-bold">
                    No reviews submitted yet. Be the first to add! ⭐
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT SIDEBAR (SYLLABUS & NOTES) */}
      <div className="w-full lg:w-80 h-full bg-white border border-slate-200/80 rounded-2xl flex flex-col overflow-hidden shadow-sm shrink-0">
        <div className="grid grid-cols-2 border-b border-slate-100 bg-slate-50 text-center shrink-0">
          <button
            onClick={() => setSidebarTab("syllabus")}
            className={`py-3.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition ${sidebarTab === "syllabus" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-400"}`}
          >
            Curriculum ({completedLectures.length}/{allLectures.length})
          </button>
          <button
            onClick={() => setSidebarTab("bookmarks")}
            className={`py-3.5 text-[10px] font-black uppercase tracking-wider border-b-2 transition ${sidebarTab === "bookmarks" ? "border-indigo-600 text-indigo-600 bg-white" : "border-transparent text-slate-400"}`}
          >
            My Workspace Notes
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3 scrollbar-thin">
          {sidebarTab === "syllabus" ? (
            <div className="space-y-2.5">
              {courseSyllabus.map((section, sIndex) => {
                const isSectionOpen = expandedSection === sIndex;
                return (
                  <div
                    key={section._id || sIndex}
                    className="border border-slate-100 rounded-xl overflow-hidden shadow-2xs"
                  >
                    <button
                      onClick={() =>
                        setExpandedSection(isSectionOpen ? null : sIndex)
                      }
                      className="w-full bg-slate-50/80 px-3 py-3 flex items-center justify-between text-left font-black text-[11px] text-slate-700 hover:bg-slate-100 transition"
                    >
                      <span className="line-clamp-1 pr-1">
                        {section.title || section.sectionName}
                      </span>
                      {isSectionOpen ? (
                        <ChevronUp size={13} />
                      ) : (
                        <ChevronDown size={13} />
                      )}
                    </button>
                    {isSectionOpen && (
                      <div className="bg-white divide-y divide-slate-50">
                        {(section.subsections || section.subSection || []).map(
                          (lecture) => {
                            const lectureIdStr = String(lecture._id);
                            const internalLecObj = {
                              id: lectureIdStr,
                              title: lecture.title,
                              duration: lecture.timeDuration || "0:00",
                              videoUrl: lecture.videoUrl,
                              sectionIndex: sIndex,
                            };
                            const isActive = currentVideo?.id === lectureIdStr;
                            const isFinished =
                              completedLectures.includes(lectureIdStr);

                            return (
                              <button
                                key={lecture._id}
                                onClick={() => setCurrentVideo(internalLecObj)}
                                className={`w-full p-2.5 flex items-start gap-3 text-left transition relative ${isActive ? "bg-indigo-50/70" : "hover:bg-slate-50/80"}`}
                              >
                                <div
                                  onClick={(e) =>
                                    handleManualCheckToggle(lecture._id, e)
                                  }
                                  className="mt-0.5 shrink-0 transition-transform active:scale-90 cursor-pointer"
                                  title={
                                    isFinished
                                      ? "Mark as incomplete"
                                      : "Mark as completed"
                                  }
                                >
                                  {isFinished ? (
                                    <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center shadow-xs shadow-emerald-500/40 border border-emerald-400">
                                      <Check size={12} className="stroke-[3]" />
                                    </div>
                                  ) : (
                                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-emerald-500 bg-white flex items-center justify-center group/check">
                                      <div className="w-1.5 h-1.5 rounded-xs bg-transparent group-hover/check:bg-emerald-400 transition" />
                                    </div>
                                  )}
                                </div>

                                <div className="min-w-0 flex-1 space-y-0.5">
                                  <p
                                    className={`text-[11px] leading-tight line-clamp-2 ${isActive ? "font-black text-indigo-700" : isFinished ? "text-slate-500 font-semibold" : "text-slate-800 font-bold"}`}
                                  >
                                    {lecture.title}
                                  </p>
                                  <span
                                    className={`text-[10px] font-bold flex items-center gap-1 ${isFinished ? "text-emerald-600/80" : "text-slate-400"}`}
                                  >
                                    <Play size={8} />{" "}
                                    {lecture.timeDuration || "Video"}
                                  </span>
                                </div>
                              </button>
                            );
                          },
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-4 h-full flex flex-col justify-between">
              <form onSubmit={handleAddBookmark} className="space-y-2 shrink-0">
                <textarea
                  placeholder="Write a code snippet note or concept point..."
                  value={bookmarkInput}
                  onChange={(e) => setBookmarkInput(e.target.value)}
                  rows="3"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white resize-none transition"
                />
                <button
                  type="submit"
                  className="w-full bg-slate-900 text-white py-2 rounded-xl text-xs font-black hover:bg-slate-800 transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Bookmark size={12} /> Capture Instant Note
                </button>
              </form>
              <div className="flex-1 overflow-y-auto space-y-2 pt-2">
                {savedBookmarks.map((b) => (
                  <div
                    key={b.id}
                    className="bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-[11px] font-medium text-slate-600 space-y-1"
                  >
                    <p className="font-bold text-slate-800 leading-snug">
                      {b.text}
                    </p>
                    <span className="text-[9px] font-black bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded-md uppercase">
                      ⏱️ Timestamp: {b.timestamp}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;