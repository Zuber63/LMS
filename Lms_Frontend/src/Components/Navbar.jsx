import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, LayoutDashboard } from 'lucide-react';
import { NavLink, useNavigate, useLocation, Link } from 'react-router-dom';

export default function HomeNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [dashboardRoute, setDashboardRoute] = useState("/studentdashboard");
  const navigate = useNavigate();
  const location = useLocation();

  // 🔄 Check token & user role (Student or Instructor)
  useEffect(() => {
    const checkUserRoleAndAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoggedIn(false);
        return;
      }

      setIsLoggedIn(true);

      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/getuser`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const result = await res.json();
        if (result?.success && result?.data?.accountType) {
          const role = result.data.accountType;
          if (role === "Instructor") {
            setDashboardRoute("/instructordashboard");
          } else {
            setDashboardRoute("/studentdashboard");
          }
        }
      } catch (error) {
        const localUser = JSON.parse(localStorage.getItem("user"));
        if (localUser?.role === "Instructor") {
          setDashboardRoute("/instructordashboard");
        } else {
          setDashboardRoute("/studentdashboard");
        }
      }
    };

    checkUserRoleAndAuth();
  }, []);

  // 🧭 Handle Smooth Scroll or Page Navigation for Sections
  const handleScrollToSection = (sectionId) => {
    setIsOpen(false); // Mobile menu close karne ke liye

    const targetElement = document.getElementById(sectionId);

    if (location.pathname === "/") {
      // Agar user already Home page par hai, toh direct scroll karo
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      // Agar user doosre page par hai, toh pehle Home par jao phir scroll karo
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        }
      }, 150); // DOM load hone ka thoda wait time
    }
  };

  return (
    <nav className="bg-white border-b border-gray-100 fixed w-full top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <div onClick={() => navigate("/")} className="flex items-center space-x-2 cursor-pointer">
            <div className="bg-indigo-600 p-2 rounded-xl text-white">
              <BookOpen size={22} />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-wide">LMS Portal</span>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden md:flex items-center space-x-8">
            <NavLink to={"/"} className="text-gray-600 hover:text-indigo-600 font-medium transition">Home</NavLink>
            <Link to={"/courses"} className="text-gray-600 hover:text-indigo-600 font-medium transition">All Courses</Link>

            <button
              onClick={() => handleScrollToSection('about')}
              className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer bg-transparent border-none"
            >
              About Us
            </button>

            <button
              onClick={() => handleScrollToSection('contact')}
              className="text-gray-600 hover:text-indigo-600 font-medium transition cursor-pointer bg-transparent border-none"
            >
              Contact
            </button>
          </div>

          {/* Desktop Auth / Dynamic Dashboard Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <button
                onClick={() => navigate(dashboardRoute)}
                className="cursor-pointer bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold text-xs px-5 py-2.5 rounded-xl transition flex items-center gap-2 border border-indigo-200"
              >
                <LayoutDashboard size={15} />
                <span>Dashboard</span>
              </button>
            ) : (
              <>
                <NavLink to={"/signin"} className="text-gray-700 hover:text-indigo-600 font-medium px-4 py-2 transition">
                  Sign In
                </NavLink>
                <button
                  onClick={() => navigate("/signup")}
                  className="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2.5 rounded-xl shadow-sm hover:shadow transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:bg-gray-50 p-2 rounded-xl transition cursor-pointer"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 px-4 pt-2 pb-4 space-y-3 shadow-lg absolute w-full left-0">
          <NavLink to={"/"} onClick={() => setIsOpen(false)} className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-xl font-medium">Home</NavLink>
          <Link to={"/courses"} onClick={() => setIsOpen(false)} className="block text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-xl font-medium">All Courses</Link>

          <button
            onClick={() => handleScrollToSection('about')}
            className="w-full text-left text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-xl font-medium cursor-pointer"
          >
            About Us
          </button>

          <button
            onClick={() => handleScrollToSection('contact')}
            className="w-full text-left text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-xl font-medium cursor-pointer"
          >
            Contact
          </button>

          <div className="border-t border-gray-100 pt-3 flex flex-col space-y-2">
            {isLoggedIn ? (
              <button
                onClick={() => { navigate(dashboardRoute); setIsOpen(false); }}
                className="w-full text-center bg-indigo-50 text-indigo-600 hover:bg-indigo-100 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 border border-indigo-200"
              >
                <LayoutDashboard size={15} />
                <span>Go to Dashboard</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => { navigate("/signin"); setIsOpen(false); }}
                  className="w-full text-center text-gray-700 hover:bg-gray-50 py-2.5 rounded-xl font-medium"
                >
                  Sign In
                </button>
                <button
                  onClick={() => { navigate("/signup"); setIsOpen(false); }}
                  className="w-full text-center bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-medium shadow-sm"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}