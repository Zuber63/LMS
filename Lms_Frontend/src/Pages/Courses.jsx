import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, BookOpen, Star, Users, ShieldCheck, ArrowRight, Loader2, Sparkles, SlidersHorizontal } from 'lucide-react';

const Courses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default'); // 'low-high', 'high-low', 'default'

  // Fetch Courses from Backend API
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/getAllCourses");
        const result = await response.json();
        
        const allCourses = result.data || result.courses || result;

        if (Array.isArray(allCourses)) {
          // 🔍 Strict check: Sirf wahi courses rakhein jo completely published hain
          const publishedCourses = allCourses.filter(course => 
            course.isPublished === true || 
            course.status === 'published' || 
            course.status === 'Published'
          );
          
          setCourses(publishedCourses);
          setFilteredCourses(publishedCourses);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Search, Category, and Sorting Filter Logic
  useEffect(() => {
    let result = [...courses];

    // 1. Filter by Category
    if (selectedCategory !== 'All') {
      result = result.filter(course => {
        const categoryName = course.category?.name || course.category;
        return categoryName?.toLowerCase() === selectedCategory.toLowerCase();
      });
    }

    // 2. Filter by Search Query
    if (searchQuery.trim() !== '') {
      result = result.filter(course => 
        (course.courseName || course.title)?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // 3. Sort by Price (Low to High / High to Low)
    if (sortBy === 'low-high') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'high-low') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }

    setFilteredCourses(result);
  }, [searchQuery, selectedCategory, sortBy, courses]);

  // 🏷️ Extract unique categories ONLY from published courses
  const categories = ['All', ...new Set(courses.map(c => {
    return c.category?.name || c.category;
  }).filter(Boolean))];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* HEADER SECTION */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider">
            <Sparkles size={14} className="text-indigo-600" />
            <span>Explore Published Programs</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Advance Your Career with <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Expert-Led Courses</span>
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Discover industry-ready professional courses designed to help you excel in tech, design, business, and more on LMS Portal.
          </p>
        </div>

        {/* ADVANCED SEARCH & FILTER TOOLBAR */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative w-full lg:w-96">
              <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text"
                placeholder="Search courses by title or keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:bg-white transition-all"
              />
            </div>

            {/* Price Sorting Dropdown */}
            <div className="flex items-center space-x-3 w-full lg:w-auto justify-end">
              <div className="flex items-center space-x-2 text-slate-500 text-xs font-semibold">
                <SlidersHorizontal size={16} className="text-indigo-600" />
                <span>Sort By:</span>
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer"
              >
                <option value="default">Default Order</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

          </div>

          {/* Category Filter Pills (Dynamic from Published Courses Only) */}
          <div className="flex items-center space-x-2 overflow-x-auto w-full pt-2 border-t border-slate-100 scrollbar-none">
            {categories.map((cat, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200' 
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESULTS COUNT */}
        <div className="flex justify-between items-center px-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Showing <span className="text-indigo-600 font-bold">{filteredCourses.length}</span> Published Courses
          </p>
        </div>

        {/* CONTENT AREA: LOADER / EMPTY / GRID */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-indigo-600" size={40} />
            <p className="text-slate-500 font-medium text-sm">Loading published courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-2xl border border-slate-200 p-8 space-y-4">
            <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto">
              <BookOpen size={28} />
            </div>
            <h3 className="text-xl font-bold text-slate-800">No Courses Found</h3>
            <p className="text-slate-500 text-sm max-w-md mx-auto">
              We couldn't find any published courses matching your search or filters. Try resetting your search terms!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const displayCategory = course.category?.name || course.category || 'General';
              
              return (
                <div 
                  key={course._id || course.id} 
                  className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Course Thumbnail & Top Badges */}
                  <div className="relative h-48 bg-slate-900 overflow-hidden">
                    <img 
                      src={course.thumbnail || course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"} 
                      alt={course.courseName || course.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    
                    {/* Category Badge */}
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-[10px] font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                      {displayCategory}
                    </span>

                    {/* Price Tag */}
                    <span className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-extrabold px-3 py-1 rounded-lg shadow-md">
                      {course.price === 0 || course.price === '0' || course.price === 'Free' ? 'Free' : `₹${course.price}`}
                    </span>

                    {/* Course Title Overlay on Thumbnail Bottom */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-white font-bold text-base line-clamp-1 group-hover:text-indigo-300 transition-colors">
                        {course.courseName || course.title}
                      </h3>
                    </div>
                  </div>

                  {/* Course Body Details */}
                  <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                    <p className="text-slate-600 text-xs line-clamp-2 leading-relaxed">
                      {course.description || "Master professional techniques and build practical real-world projects from scratch."}
                    </p>

                    {/* Meta Stats Info */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-slate-500 text-xs">
                      <div className="flex items-center space-x-1.5">
                        <Users size={14} className="text-indigo-600" />
                        <span>{course.studentsEnrolled?.length || 120}+ Enrolled</span>
                      </div>
                      <div className="flex items-center space-x-1.5 justify-end">
                        <Star size={14} className="text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-800">4.9 (Live)</span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="pt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                        <ShieldCheck size={14} className="text-emerald-600" />
                        <span>Certificate Included</span>
                      </div>
                      <button 
                        onClick={() => navigate(`/coursedetails1/${course._id || course.id}`)}
                        className="bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-semibold text-xs px-4 py-2.5 rounded-xl transition-all duration-200 flex items-center space-x-1 group-hover:bg-indigo-600 group-hover:text-white cursor-pointer"
                      >
                        <span>View Details</span>
                        <ArrowRight size={14} />
                      </button>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Courses;