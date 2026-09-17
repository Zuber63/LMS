import React, { useState, useEffect } from 'react';
import { Sparkles, Users, Award, BookOpen, CheckCircle, Target, ShieldCheck, Zap } from 'lucide-react';

const About = () => {
  const [totalCourses, setTotalCourses] = useState(null);
  const [totalLearners, setTotalLearners] = useState(null);

  // Courses API se dynamic count calculate karna
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/getAllCourses");
        
        if (response.ok) {
          const result = await response.json();
          const coursesList = result?.courses || result?.data?.courses || result?.data || result;
          
          if (Array.isArray(coursesList)) {
            // 1. Total Courses count
            setTotalCourses(coursesList.length);

            // 2. Total Active Learners count (Har course ke enrolled students ko sum karke)
            const uniqueStudents = new Set();
            let totalEnrollments = 0;

            coursesList.forEach((course) => {
              const students = 
                course.studentsEnrolled || 
                course.studentsEnroled || 
                course.enrolledStudents || 
                course.students || 
                [];

              if (Array.isArray(students)) {
                totalEnrollments += students.length;
                students.forEach((s) => {
                  const studentId = typeof s === 'object' ? (s._id || s.id) : s;
                  if (studentId) uniqueStudents.add(String(studentId));
                });
              }
            });

            // Unique students prefer karenge, nahi toh total enrollments
            const finalCount = uniqueStudents.size > 0 ? uniqueStudents.size : totalEnrollments;
            setTotalLearners(finalCount);
          }
        }
      } catch (error) {
        console.warn("Could not fetch courses for stats, using fallback defaults:", error);
      }
    };

    fetchCoursesData();
  }, []);

  // Number Formatting Function (e.g. 1500 -> 1.5K+)
  const formatCount = (count, fallback) => {
    if (count === null || count === undefined) return fallback;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K+`;
    return `${count}+`;
  };

  // Dynamic Stats List
  const stats = [
    { 
      label: "Active Learners", 
      value: formatCount(totalLearners, "100+") 
    },
    { 
      label: "Total Courses", 
      value: totalCourses !== null ? `${totalCourses}+` : "10+" 
    },
    { 
      label: "Placement Rate", 
      value: "95%" 
    },
    { 
      label: "Community Support", 
      value: "24/7" 
    }
  ];

  return (
    <section id="about" className="min-h-screen bg-slate-50 pt-28 pb-20 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 bg-indigo-50 border border-indigo-100 text-indigo-700 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sparkles size={14} />
            <span>About Our Platform</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Empowering the Next Generation of Developers
          </h1>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            We bridge the gap between theoretical learning and industry-level frontend execution through hands-on architecture sandboxes and real-world projects.
          </p>
        </div>

        {/* Dynamic Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-white border border-slate-200/80 rounded-3xl p-6 text-center shadow-sm space-y-1">
              <h3 className="text-3xl sm:text-4xl font-black text-indigo-600">{stat.value}</h3>
              <p className="text-xs sm:text-sm font-semibold text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Mission & Vision Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-6 bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-3xl p-8 sm:p-12 shadow-xl relative overflow-hidden space-y-6">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Target size={14} className="text-amber-300" />
              <span>Our Core Mission</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-snug">
              Making Quality Tech Education Accessible & Practical for Everyone.
            </h2>

            <p className="text-xs sm:text-sm text-indigo-100 leading-relaxed">
              We believe that code is best learned by building. Our platform offers structured guidance, interactive sandboxes, and mentorship to help you turn your career aspirations into absolute reality.
            </p>
          </div>

          <div className="lg:col-span-6 space-y-4">
            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl shrink-0">
                <BookOpen size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Industry-Aligned Curriculum</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Our modules are crafted by senior software architects keeping modern web trends (React, Tailwind, Next.js) in mind.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Verified Certifications</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Earn recognized certificates upon course completion to directly strengthen your LinkedIn profile and professional resume.
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex items-start space-x-4">
              <div className="bg-indigo-50 text-indigo-600 p-3 rounded-xl shrink-0">
                <Zap size={22} />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-slate-900 text-base">Real-world Application</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Build production-ready projects like e-commerce dashboards, interactive SaaS tools, and polished portfolios.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

export default About;