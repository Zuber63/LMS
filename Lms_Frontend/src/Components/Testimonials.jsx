import React, { useState, useEffect } from "react";
import { Star, Quote, Loader2 } from "lucide-react";

const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback dummy reviews agar API se data na mile
  const fallbackReviews = [
    {
      id: 1,
      name: "Rohan Sharma",
      role: "Frontend Developer at TechCorp",
      comment:
        "The structured learning path here completely changed my approach to coding. The modular structure of the React course helped me land my frontend internship easily!",
      rating: 5,
      avatarText: "RS",
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "UI/UX Designer",
      comment:
        "I loved how practical the Figma lessons were. Instead of just learning tools, the instructor focuses deeply on design strategy and real-world system architecture.",
      rating: 5,
      avatarText: "PP",
    },
    {
      id: 3,
      name: "Amit Verma",
      role: "Computer Science Student",
      comment:
        "Backend concepts were explained so cleanly. Building real projects with microservices gave me immense confidence for my upcoming developer interviews.",
      rating: 4,
      avatarText: "AV",
    },
  ];

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/course/getAllRatings",
        );
        const result = await response.json();

        // Controller ke response structure ke mutabiq data nikalna
        const ratingList = result.data || result.ratings || result;

        if (Array.isArray(ratingList) && ratingList.length > 0) {
          const mappedReviews = ratingList.map((item) => {
            const user = item.userId;
            const course = item.courseId;

            const userName = user
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
              : "Student";
            const initials =
              userName !== "Student"
                ? userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                : "ST";

            return {
              id: item._id || Math.random(),
              name: userName || "Anonymous Student",
              role: course?.courseName
                ? `Student of ${course.courseName}`
                : "LMS Learner",
              comment: item.review || "Great experience learning from here!",
              rating: item.rating || 5,
              avatarText: initials || "ST",
            };
          });

          // Sirf latest 3 reviews dikhane ke liye slice(0, 3) use kiya hai
          setReviews(mappedReviews.slice(0, 3));
        } else {
          setReviews(fallbackReviews);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching ratings:", error);
        setReviews(fallbackReviews);
        setLoading(false);
      }
    };

    fetchRatings();
  }, []);

  return (
    <section className="bg-slate-50 py-20 lg:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Student Success
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trusted by Thousands of{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Happy Learners
            </span>
          </p>
          <p className="text-base text-slate-500">
            Hear directly from our graduates who shifted their technical careers
            or cracked top interviews using our curriculum.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={36} />
          </div>
        ) : (
          /* Reviews Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between relative group"
              >
                {/* Top Quote Icon Asset */}
                <div className="absolute top-6 right-6 text-slate-100 group-hover:text-indigo-50 transition-colors">
                  <Quote size={40} className="fill-current" />
                </div>

                <div className="space-y-4 relative z-10">
                  {/* Rating Stars */}
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        size={16}
                        className={`${index < review.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`}
                      />
                    ))}
                  </div>

                  {/* Review Text */}
                  <p className="text-sm text-slate-600 leading-relaxed italic">
                    "{review.comment}"
                  </p>
                </div>

                {/* Student Profile Block */}
                <div className="flex items-center space-x-3 pt-6 mt-6 border-t border-slate-100">
                  {/* Avatar Substitute */}
                  <div className="w-10 h-10 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-sm shadow-inner">
                    {review.avatarText}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      {review.name}
                    </h4>
                    <p className="text-[11px] text-slate-400 font-medium">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Testimonials;
