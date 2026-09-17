import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CTABanner = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check login status on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleMainButtonClick = () => {
    if (isLoggedIn) {
      navigate('/courses'); // Agar logged in hai toh courses page par bhejein
    } else {
      navigate('/signin'); // Agar logged in nahi hai toh signin/signup page par bhejein
    }
  };

  const handleEnterpriseClick = () => {
    // Check if the contact element exists on the current page
    const contactElement = document.getElementById('contact');
    
    if (contactElement) {
      // Smooth scroll to the contact section
      contactElement.scrollIntoView({ behavior: 'smooth' });
    } else {
      // If contact is on a separate page, navigate to it
      navigate('/contact'); 
    }
  };

  return (
    <section className="bg-white py-16 sm:py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Banner Box with Gradient Theme */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl shadow-indigo-100 overflow-hidden text-center lg:text-left">
          
          {/* Decorative Mesh Circle Effects */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl translate-x-1/3 -translate-y-1/3"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-xl -translate-x-1/3 translate-y-1/3"></div>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left/Center Text Content Block */}
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center space-x-1.5 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mx-auto lg:mx-0">
                <Sparkles size={12} className="text-amber-300 fill-amber-300" />
                <span>Limited Time Offer Included</span>
              </div>
              
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight">
                Ready to Accelerate <br className="hidden sm:inline" />
                Your Professional Career?
              </h2>
              
              <p className="text-sm sm:text-base text-indigo-100 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Sign up today and get absolute instant access to free frontend development mini-courses, digital architecture sandboxes, and our global alumni network.
              </p>
            </div>

            {/* Right Action Buttons Block */}
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-center justify-center lg:items-end gap-4 w-full">
              
              {/* Dynamic Main CTA Button */}
              <button 
                onClick={handleMainButtonClick}
                className="w-full sm:w-auto lg:w-full bg-white hover:bg-slate-50 text-indigo-700 font-bold px-8 py-4 rounded-xl shadow-md transition-all duration-200 flex items-center justify-center space-x-2 group whitespace-nowrap cursor-pointer"
              >
                <span>{isLoggedIn ? "Explore Courses" : "Create Free Account"}</span>
                <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
              </button>
              
              {/* Secondary CTA Button with Smooth Scroll */}
              <button 
                onClick={handleEnterpriseClick}
                className="w-full sm:w-auto lg:w-full bg-indigo-500/30 hover:bg-indigo-500/40 border border-indigo-400/30 text-white font-semibold px-8 py-4 rounded-xl transition whitespace-nowrap cursor-pointer"
              >
                Contact Enterprise
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default CTABanner;