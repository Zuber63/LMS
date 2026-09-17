import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, User, BookOpen, Heart, Star, 
  ShoppingBag, FolderHeart, DollarSign, Wallet, 
  Settings, LogOut, Menu, X, Bell, GraduationCap 
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 📋 SCREENSHOT ALIGNED SIDEBAR STRUCTURE WITH SECTION HEADINGS
  const sidebarLinks = [
    // --- SECTION 1: GENERAL / STUDENT ---
    { name: "Dashboard", path: ".", icon: LayoutDashboard },
    { name: "My Profile", path: "instructorprofile", icon: User },
   
    
    // --- SECTION 2: INSTRUCTOR OPERATIONS ---
    { name: "My Courses", path: "instructormycourses", icon: FolderHeart, isInstructor: true },
   
    // --- SECTION 3: SYSTEM SETTINGS ---
    // { name: "Settings", path: "settings", icon: Settings, isSettings: true },
  ];

  // 🔄 Exact Refresh and Routing Synchronizer
  useEffect(() => {
    const currentPath = location.pathname;

    const matchedLink = sidebarLinks.find((link) => {
      if (link.path === ".") {
        return currentPath.endsWith("instructordashboard") || currentPath.endsWith("instructordashboard/");
      }
      return currentPath.includes(link.path);
    });

    if (matchedLink) {
      setActiveTab(matchedLink.name);
    }
  }, [location]);

  const userData = JSON.parse(localStorage.getItem("user")) || { firstName: "StudyNotion User", accountType: "Instructor" };

  const handleLogout = () => {
    localStorage.clear();
    toast.info("Logged out successfully! Redirecting... 👋", {
      position: "top-right",
      autoClose: 1500,
    });
    setTimeout(() => {
      navigate("/");
    }, 1200);
  };

  const handleTabChange = (tabName, path) => {
    setActiveTab(tabName);
    setIsMobileOpen(false);
    navigate(path);
  };

  // REUSABLE NAV RENDERER (EXACT STUDENT LIGHT BLUE THEME & CARD SHADOW PATTERNS)
  const renderNavigationLinks = () => {
    const activeStyles = "bg-indigo-600 text-white shadow-md shadow-indigo-900/30";
    const inactiveStyles = "text-slate-400 hover:bg-slate-800 hover:text-white";

    return (
      <div className="space-y-4">
        {/* Top Section Links */}
        <div className="space-y-1">
          {sidebarLinks.filter(l => !l.isInstructor && !l.isSettings).map((link) => (
            <button
              key={link.name}
              onClick={() => handleTabChange(link.name, link.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-xs text-left transition duration-150 cursor-pointer ${
                activeTab === link.name ? activeStyles : inactiveStyles
              }`}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        <div className="w-full h-px bg-slate-800 my-2" />

        {/* Instructor Heading & Menu Section */}
        <div className="space-y-1">
          <span className="px-3 text-[10px] font-black tracking-widest text-slate-500 uppercase block mb-1">Instructor</span>
          {sidebarLinks.filter(l => l.isInstructor).map((link) => (
            <button
              key={link.name}
              onClick={() => handleTabChange(link.name, link.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-xs text-left transition duration-150 cursor-pointer ${
                activeTab === link.name ? activeStyles : inactiveStyles
              }`}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </button>
          ))}
        </div>

        <div className="w-full h-px bg-slate-800 my-2" />

        {/* Footer Settings Component Layout */}
        <div className="space-y-1">
          {sidebarLinks.filter(l => l.isSettings).map((link) => (
            <button
              key={link.name}
              onClick={() => handleTabChange(link.name, link.path)}
              className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-xs text-left transition duration-150 cursor-pointer ${
                activeTab === link.name ? activeStyles : inactiveStyles
              }`}
            >
              <link.icon size={18} />
              <span>{link.name}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased">
      <ToastContainer />
      
      {/* 💻 1. DESKTOP SIDEBAR PANEL (EXACT ORIGINAL STYLING) */}
      <aside className="w-64 hidden md:flex flex-col justify-between p-5 bg-slate-900 text-slate-300 h-screen sticky top-0 shrink-0 border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo Identity Title */}
          <div className="flex items-center space-x-3 text-white px-2">
            <GraduationCap size={32} className="text-indigo-400" />
            <span className="font-black text-xl tracking-tight">LMS Portal</span>
          </div>

          {/* Core Mapping Links Rendered */}
          <nav className="space-y-1 overflow-y-auto max-h-[calc(100vh-180px)] pr-1 scrollbar-none">
            {renderNavigationLinks()}
          </nav>
        </div>

        {/* Integrated Exit Logout Button */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center space-x-3 bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl font-bold cursor-pointer transition shadow-md shadow-rose-950/10"
        >
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* 📱 2. MOBILE RECONSTRUCTED OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}>
          <aside className="w-64 h-full bg-slate-900 flex flex-col justify-between p-5 text-slate-300" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-8">
              <div className="flex items-center justify-between text-white border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <GraduationCap size={28} className="text-indigo-400" />
                  <span className="font-black text-lg">LMS Portal</span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                  <X size={18} />
                </button>
              </div>
              <nav>{renderNavigationLinks()}</nav>
            </div>
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center space-x-3 bg-rose-600 text-white p-3 rounded-xl font-bold cursor-pointer"
            >
              <LogOut size={18} /> <span>Logout</span>
            </button>
          </aside>
        </div>
      )}

      {/* 🚀 3. LIVE ROUTE INTERACTIVE CONTENT WINDOW VIEW */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* GLOBAL HEADER BAR LOG */}
        <header className="bg-white border-b border-slate-200 h-16 px-4 md:px-8 flex justify-between items-center shadow-sm sticky top-0 z-40 shrink-0">
          <div className="flex items-center space-x-3">
            <button 
              type="button"
              onClick={() => setIsMobileOpen(true)} 
              className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <span className="font-bold text-slate-700 uppercase text-xs tracking-wider bg-slate-100 px-3 py-1.5 rounded-xl">
              Current Workspace: {activeTab}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <button className="p-2 text-slate-400 hover:text-slate-600 relative rounded-full hover:bg-slate-50 cursor-pointer">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full" />
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center space-x-3">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-bold text-slate-800 leading-tight">{userData.firstName}</p>
                <span className="text-[10px] font-semibold text-indigo-600 uppercase">{userData.accountType}</span>
              </div>
              <div className="h-9 w-9 rounded-xl bg-indigo-100 border border-indigo-200 text-indigo-700 flex items-center justify-center font-bold uppercase shadow-sm">
                {userData.firstName ? userData.firstName[0] : "I"}
              </div>
            </div>
          </div>
        </header>

        {/* CENTRAL DYNAMIC CHILD MOUNT COMPONENT OUTLET */}
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default InstructorDashboard;