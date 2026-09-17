import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // React router import kiya
import { Presentation, ShieldCheck, BadgeCheck, ArrowRight } from 'lucide-react';

const BecomeInstructor = () => {
  const navigate = useNavigate(); // Navigation hook

  const [instructorData, setInstructorData] = useState({
    name: "Suresh Kumar",
    role: "Senior Architect & Creator",
    quote: "Teaching on LMS Portal helped me reach thousands of learners worldwide.",
    initials: "SK",
    totalInstructors: "120+"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInstructorFromCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/getAllCourses");
        const result = await response.json();
        
        const courses = result.data || result.courses || result;

        if (Array.isArray(courses) && courses.length > 0) {
          const uniqueInstructors = new Set(
            courses.map(c => c.instructor?._id || c.instructor?.id || c.instructor).filter(Boolean)
          );

          const firstCourseWithInstructor = courses.find(c => c.instructor && (c.instructor.firstName || c.instructor.name));
          
          if (firstCourseWithInstructor) {
            const inst = firstCourseWithInstructor.instructor;
            const fullName = inst.firstName ? `${inst.firstName} ${inst.lastName || ''}`.trim() : (inst.name || "Suresh Kumar");
            const initials = fullName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

            setInstructorData({
              name: fullName,
              role: firstCourseWithInstructor.courseName ? `Instructor of ${firstCourseWithInstructor.courseName}` : "Expert Instructor",
              quote: `Teaching on LMS Portal gave me the perfect platform to share my knowledge globally.`,
              initials: initials || "SK",
              totalInstructors: uniqueInstructors.size > 0 ? `${uniqueInstructors.size}+` : "120+"
            });
          } else if (uniqueInstructors.size > 0) {
            setInstructorData(prev => ({
              ...prev,
              totalInstructors: `${uniqueInstructors.size}+`
            }));
          }
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching instructor details:", error);
        setLoading(false);
      }
    };

    fetchInstructorFromCourses();
  }, []);

  return (
    <section className="bg-white py-20 lg:py-24 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Container Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* LEFT SIDE: VISUAL PROMPT CARD */}
          <div className="relative flex justify-center lg:justify-start">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-violet-200 rounded-full blur-[80px] opacity-40"></div>
            
            <div className="relative bg-slate-900 text-white rounded-3xl p-8 max-w-md w-full shadow-xl space-y-6 overflow-hidden">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-xl"></div>
              
              <div className="inline-flex items-center space-x-1.5 bg-white/10 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Presentation size={12} className="text-indigo-400" />
                <span>Instructor Suite</span>
              </div>

              <h3 className="text-xl font-black tracking-tight leading-snug">
                "{instructorData.quote}"
              </h3>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 text-sm text-slate-300">
                  <BadgeCheck size={16} className="text-indigo-400" />
                  <span>Interactive course analytics engine</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-slate-300">
                  <BadgeCheck size={16} className="text-indigo-400" />
                  <span>Direct payout system architecture</span>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 flex items-center space-x-3">
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                  {instructorData.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold">{instructorData.name}</h4>
                  <p className="text-[10px] text-slate-500">{instructorData.role}</p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: TEXT CONTENT & ACTION BUTTON */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Join Our Faculty ({instructorData.totalInstructors} Expert Mentors)
            </h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Share Knowledge. <br />
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Build Your Global Brand.</span>
            </h3>
            <p className="text-base text-slate-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Millions of learners are looking to upgrade their technology skills. We provide the tools, distribution, and monetization infrastructure to turn your expertise into high-quality digital assets on LMS Portal.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-left max-w-md mx-auto lg:mx-0">
              <div className="flex items-start space-x-2.5">
                <ShieldCheck size={18} className="text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Flexible Schedule</h4>
                  <p className="text-xs text-slate-500">Record content on your own time parameters.</p>
                </div>
              </div>
              <div className="flex items-start space-x-2.5">
                <ShieldCheck size={18} className="text-indigo-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">High Revenue Share</h4>
                  <p className="text-xs text-slate-500">Keep up to 70% of your course monetization earnings.</p>
                </div>
              </div>
            </div>

            {/* CTA Trigger with onClick to navigate to signup page */}
            <div className="pt-4 flex justify-center lg:justify-start">
              <button 
                onClick={() => navigate('/signup')} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-6 py-3.5 rounded-xl transition shadow-md shadow-indigo-100 flex items-center space-x-2 group cursor-pointer"
              >
                <span>Apply as Instructor</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default BecomeInstructor;