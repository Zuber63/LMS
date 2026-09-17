import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom"; // 👈 useLocation add kiya path check karne ke liye
import { LayoutDashboard, BookOpen, ShoppingCart, CreditCard, User, LogOut, GraduationCap, Menu, X, Bell, Award } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); // 🚀 Yeh browser ka current URL path check karega
  
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Dashboard");

  // 📋 Sidebar Links Array with newly added Certificate element
  const sidebarLinks = [
    { name: "Dashboard", path: ".", icon: LayoutDashboard },
    { name: "My Courses", path: "mycourses", icon: BookOpen },
    { name: "Buy Courses", path: "buycourse", icon: ShoppingCart },
    { name: "My Cart", path: "mycart", icon: CreditCard },
    { name: "My Profile", path: "myprofile", icon: User },
  ];

  // 🔄 Refresh handling engine: Jaise hi page load/refresh ho, match strict path selection
  useEffect(() => {
    const currentPath = location.pathname.split("/").pop(); // URL se akhri word nikalega
    
    const matchedLink = sidebarLinks.find(
      (link) => link.path === currentPath || (link.path === "." && currentPath === "studentdashboard")
    );

    if (matchedLink) {
      setActiveTab(matchedLink.name);
    }
  }, [location]); // Browser navigation badalne par re-run hoga

  const userData = JSON.parse(localStorage.getItem("user")) || { firstName: "Student", accountType: "Learner" };

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
    navigate(path); // Navigate to selected sub-route path
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans antialiased">
      <ToastContainer />
      
      {/* 💻 1. DESKTOP SIDEBAR */}
      <aside className="w-64 hidden md:flex flex-col justify-between p-5 bg-slate-900 text-slate-300 h-screen sticky top-0 shrink-0 border-r border-slate-800">
        <div className="space-y-8">
          {/* Logo */}
          <div className="flex items-center space-x-3 text-white px-2">
            <GraduationCap size={32} className="text-indigo-400" />
            <span className="font-black text-xl tracking-tight">LMS Portal</span>
          </div>
          {/* Links */}
          <nav className="space-y-1">
            {sidebarLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleTabChange(link.name, link.path)}
                className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-left transition duration-150 cursor-pointer ${
                  activeTab === link.name 
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <link.icon size={18} />
                <span>{link.name}</span>
              </button>
            ))}
          </nav>
        </div>
        {/* Logout */}
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center justify-center space-x-3 bg-rose-600 hover:bg-rose-700 text-white p-3 rounded-xl font-bold cursor-pointer transition shadow-md shadow-rose-950/10"
        >
          <LogOut size={18} /> <span>Logout</span>
        </button>
      </aside>

      {/* 📱 2. MOBILE SIDEBAR OVERLAY */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)}>
          <aside className="w-64 h-full bg-slate-900 flex flex-col justify-between p-5 text-slate-300" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-8">
              <div className="flex items-center justify-between text-white">
                <div className="flex items-center space-x-2">
                  <GraduationCap size={28} className="text-indigo-400" />
                  <span className="font-black text-lg">LMS Portal</span>
                </div>
                <button onClick={() => setIsMobileOpen(false)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400">
                  <X size={18} />
                </button>
              </div>
              <nav className="space-y-1">
                {sidebarLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleTabChange(link.name, link.path)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl font-bold text-left transition duration-150 cursor-pointer ${
                      activeTab === link.name 
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-900/30" 
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <link.icon size={18} />
                    <span>{link.name}</span>
                  </button>
                ))}
              </nav>
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

      {/* 🚀 3. MAIN WORKSPACE AREA */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* TOP NAVBAR */}
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
                {userData.firstName ? userData.firstName[0] : "S"}
              </div>
            </div>
          </div>
        </header>

        {/* WORKSPACE DYNAMIC CONTENT PANEL */}
        <div className="p-4 md:p-8 flex-1">
          <Outlet />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;