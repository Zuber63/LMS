import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Play, CheckCircle2, ShieldCheck, Trophy, Users } from 'lucide-react';

const Hero = () => {
  const navigate = useNavigate();

  const [heroData, setHeroData] = useState({
    totalStudents: "1,250+",
    averageRating: "4.9",
    featuredCourseTitle: "Full-Stack Web Development Masterclass",
    featuredCourseDesc: "Learn React, Tailwind, Node.js & MongoDB"
  });

  useEffect(() => {
    const fetchHeroDataFromAPI = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/getAllCourses");
        const result = await response.json();
        
        const courses = result.data || result.courses || result;

        if (Array.isArray(courses) && courses.length > 0) {
          // 1. Total Enrolled Students count calculate karna (jaise Stats component me kiya)
          let totalStudentsCount = 0;
          courses.forEach(c => {
            if (Array.isArray(c.studentsEnrolled)) {
              totalStudentsCount += c.studentsEnrolled.length;
            }
          });

          // Agar studentsEnrolled array me data nahi hai, toh courses ke hisaab se calculated count
          const finalStudents = totalStudentsCount > 0 ? totalStudentsCount : (courses.length * 45) + 850;

          // 2. Sabse latest course ko featured dikhane ke liye
          const latestCourse = courses[courses.length - 1];

          setHeroData({
            totalStudents: `${finalStudents.toLocaleString()}+`,
            averageRating: "4.9",
            featuredCourseTitle: latestCourse.courseName || latestCourse.title || "Full-Stack Web Development Masterclass",
            featuredCourseDesc: latestCourse.category || latestCourse.description?.slice(0, 35) + '...' || "Learn modern skills with experts"
          });
        }
      } catch (error) {
        console.error("Error fetching courses for hero section:", error);
      }
    };

    fetchHeroDataFromAPI();
  }, []);

  return (
    <section className="relative bg-slate-50 pt-26 pb-24 overflow-hidden">
      {/* Decorative Grid Background - Theme Match */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* LEFT CONTENT: TEXT & CTAs */}
          <div className="space-y-8 text-center lg:text-left">
            {/* Trust Badge */}
            <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
              <ShieldCheck size={14} className="text-indigo-600" />
              <span>The Ultimate Learning Experience on LMS Portal</span>
            </div>

            {/* Main Premium Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
              Master Skills with <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                Structured Learning
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Explore professional-grade courses designed to take you from absolute scratch to a high-paying job. Learn at your own pace with industry experts on LMS Portal.
            </p>

            {/* Buttons with Indigo Theme */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <button 
                onClick={() => navigate('/courses')} 
                className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-8 py-4 rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group cursor-pointer"
              >
                <span>Explore All Courses</span>
                <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button 
                onClick={() => navigate('/signup')} 
                className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-800 font-semibold px-8 py-4 rounded-xl border border-slate-200 transition-all duration-200 flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
              >
                <Play size={16} className="text-indigo-600 fill-indigo-600" />
                <span>Get Started</span>
              </button>
            </div>

            {/* Bullet Points for Features */}
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0 pt-2">
              <div className="flex items-center space-x-2 text-slate-700 text-sm font-medium">
                <CheckCircle2 size={16} className="text-indigo-600" />
                <span>Industry Certificates</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-700 text-sm font-medium">
                <CheckCircle2 size={16} className="text-indigo-600" />
                <span>1-on-1 Mentorship</span>
              </div>
            </div>
          </div>

          {/* RIGHT CONTENT: THEMED UI MOCKUP CARD */}
          <div className="relative flex justify-center">
            {/* Background glowing circles */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-300 rounded-full blur-[80px] opacity-40"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-300 rounded-full blur-[80px] opacity-40"></div>

            {/* Main Mockup Card */}
            <div className="relative bg-white border border-slate-200/80 rounded-2xl shadow-2xl p-6 w-full max-w-md space-y-6 transform hover:-translate-y-1 transition-transform duration-300">
              
              {/* Fake Browser/Header Controls */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex space-x-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-3 py-1 rounded-md">lmsportal.com/learn</span>
              </div>

              {/* Course Mini Visual Preview (Dynamic from API) */}
              <div className="bg-slate-900 rounded-xl p-6 text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 opacity-80 mix-blend-multiply"></div>
                <div className="relative space-y-2">
                  <span className="text-[10px] bg-white/20 uppercase tracking-widest px-2 py-0.5 rounded font-bold">Featured Live</span>
                  <h4 className="text-lg font-bold line-clamp-1">{heroData.featuredCourseTitle}</h4>
                  <p className="text-xs text-indigo-200 line-clamp-1">{heroData.featuredCourseDesc}</p>
                </div>
              </div>

              {/* Stats Breakdown Inside Card */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center space-x-3">
                  <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Students Enrolled</p>
                    <p className="text-sm font-bold text-slate-800">{heroData.totalStudents}</p>
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl flex items-center space-x-3">
                  <div className="p-2 bg-emerald-50 rounded-lg text-emerald-600">
                    <Trophy size={16} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-medium">Rating</p>
                    <p className="text-sm font-bold text-slate-800">{heroData.averageRating} ★</p>
                  </div>
                </div>
              </div>

              {/* Progress bar simulation to match LMS theme */}
              <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex justify-between text-xs font-medium text-slate-600">
                  <span>Your Batch Progress</span>
                  <span className="text-indigo-600 font-bold">82%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Hero;