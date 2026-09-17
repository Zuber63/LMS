import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const navigate = useNavigate();
  const location = useLocation();

  const handleScrollToSection = (sectionId) => {
    if (location.pathname === "/") {
      const targetElement = document.getElementById(sectionId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          <div className="lg:col-span-4 space-y-4">
            <div onClick={() => navigate("/")} className="flex items-center space-x-2 text-white cursor-pointer w-fit">
              <div className="bg-indigo-600 p-2 rounded-xl text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              </div>
              <span className="font-black text-xl tracking-tight">LMS Portal</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              Empowering the next generation of developers with high-quality courses, hands-on projects, and structured career paths.
            </p>
          </div>

          <div className="lg:col-span-2 lg:col-start-6 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/" className="hover:text-indigo-400 transition-colors">Home</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">All Courses</Link></li>
              <li>
                <button onClick={() => handleScrollToSection('about')} className="hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer p-0 text-inherit">
                  About Us
                </button>
              </li>
              <li>
                <button onClick={() => handleScrollToSection('contact')} className="hover:text-indigo-400 transition-colors bg-transparent border-none cursor-pointer p-0 text-inherit">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Explore Tracks</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">Frontend Architecture</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">Backend Engineering</Link></li>
              <li><Link to="/courses" className="hover:text-indigo-400 transition-colors">UI/UX Design Systems</Link></li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal</h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-indigo-400 transition-colors">Refund Policy</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          
          <div className="text-slate-500 font-medium">
            &copy; {currentYear} LMS Portal Inc. All rights reserved.
          </div>

          <div className="flex items-center space-x-3 text-slate-400">
            <span className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl transition-all cursor-pointer">GitHub</span>
            <span className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl transition-all cursor-pointer">Twitter</span>
            <span className="p-2 bg-slate-800 hover:bg-indigo-600 hover:text-white rounded-xl transition-all cursor-pointer">LinkedIn</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;