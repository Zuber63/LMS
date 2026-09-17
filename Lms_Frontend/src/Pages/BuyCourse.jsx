import React, { useState, useEffect } from "react";
import { Search, Star, ArrowUpDown, ShoppingBag, Check } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuyCourse = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [maxPrice, setMaxPrice] = useState(5000);
  
  const [coursesData, setCoursesData] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);

  // 🔄 1. Fetch All Courses & Student Enrolled List
  const loadPageData = async () => {
    try {
      // A. Fetch All Store Courses
      const response = await fetch("http://localhost:5000/api/course/getAllCourses");
      const data = await response.json();

      if (data?.courses) {
        const filteredCourses = data.courses.filter(
          (course) => course?.status === "Published"
        );
        setCoursesData(filteredCourses);
      }

      // B. Fetch Student Enrolled Courses (If logged in)
      const token = localStorage.getItem("token");
      if (token) {
        const profileRes = await fetch("http://localhost:5000/api/user/getuser", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
        const profileData = await profileRes.json();
        
        if (profileData?.success && profileData?.data?.enrolledCourses) {
          const enrolledIds = profileData.data.enrolledCourses.map(course => 
            typeof course === 'object' ? course._id : course
          );
          setEnrolledCourses(enrolledIds);
        }
      }
    } catch (error) {
      console.error("Data loading failed in BuyCourse:", error);
    }
  };

  useEffect(() => {
    loadPageData();
  }, []);

  // 🛒 Cart Items Initialization from LocalStorage
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Watcher to Sync Cart items changes to storage automatically
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // 📥 Add to Cart Click Handler
  const handleAddToCart = (course) => {
    const isAlreadyInCart = cartItems.some((item) => item._id === course._id);

    if (isAlreadyInCart) {
      toast.info("Course already in cart! Redirecting... 🛒", { autoClose: 1500 });
      navigate("/studentdashboard/mycart");
      return;
    }
    setCartItems([...cartItems, course]);
    toast.success(`"${course?.courseName}" added to your cart! 🛒`, { autoClose: 1000 });
  };

  // 💳 Buy Now Handler
  const handleBuyNow = (course) => {
    const isAlreadyInCart = cartItems.some((item) => item._id === course._id);

    if (!isAlreadyInCart) {
      setCartItems([...cartItems, course]);
    }

    toast.info("Redirecting to checkout panel... 💳", { autoClose: 1200 });
    
    setTimeout(() => {
      navigate("/studentdashboard/mycart");
    }, 1000);
  };

  // 🏷️ Dynamic Unique Categories Extraction from Database Courses (Handling object or string formats)
  const uniqueCategories = ["All", ...new Set(coursesData.map(course => {
    if (typeof course?.category === 'object' && course?.category !== null) {
      return course.category.name || course.category.categoryName;
    }
    return course?.category;
  }).filter(Boolean))];

  // ⚙️ Search, Filter & Sort Core Engine
  const processedCourses = coursesData
    .filter((course) => {
      const matchesSearch = course?.courseName?.toLowerCase().includes(searchQuery.toLowerCase().trim()) || 
                            course?.instructor?.firstName?.toLowerCase().includes(searchQuery.toLowerCase().trim());
      
      const courseCatName = typeof course?.category === 'object' && course?.category !== null 
        ? (course.category.name || course.category.categoryName) 
        : course?.category;

      const matchesCategory = selectedCategory === "All" || courseCatName === selectedCategory;
      const matchesPrice = (course?.price || 0) <= maxPrice;
      
      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (sortBy === "priceLow") return (a.price || 0) - (b.price || 0);
      if (sortBy === "priceHigh") return (b.price || 0) - (a.price || 0);
      if (sortBy === "rating") return (b.rating || 0) - (a.rating || 0);
      return 0;
    });

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 space-y-8">
      
      {/* 1. TOP HEADER & GENERAL SEARCH */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="space-y-1">
          <h2 className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-2">
            <ShoppingBag className="text-indigo-600" size={22} />
            Explore Skills Store
          </h2>
          <p className="text-xs font-medium text-slate-400">
            Apne career ko grow karne ke liye best technical courses choose karein
          </p>
        </div>

        <div className="relative max-w-md w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search size={16} />
          </span>
          <input
            type="text"
            placeholder="Search by course name or mentor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* 2. ADVANCED FILTER CONTROLS TOOLBAR (Dynamic API Categories) */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/60 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                selectedCategory === cat
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "bg-slate-50 text-slate-500 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
          <div className="flex items-center space-x-3 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <span className="text-[10px] font-bold text-slate-400 uppercase">Max Price:</span>
            <input
              type="range"
              min="1000"
              max="5000"
              step="500"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-24 md:w-32 accent-indigo-600 h-1 bg-slate-200 rounded-lg cursor-pointer"
            />
            <span className="text-xs font-black text-slate-700">₹{maxPrice}</span>
          </div>

          <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5">
            <ArrowUpDown size={14} className="text-slate-400 mr-1.5" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-600 outline-none pr-2 cursor-pointer"
            >
              <option value="default">Sort By</option>
              <option value="priceLow">Price: Low to High</option>
              <option value="priceHigh">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* 3. STORE COURSE CARDS GRID */}
      {processedCourses.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {processedCourses?.map((course, i) => {
            const courseInCart = cartItems.some((item) => item._id === course._id);
            const isStudentEnrolled = enrolledCourses.includes(course._id);

            // Calculate average rating dynamically from ratingAndReviews if available
            const avgRating = course.ratingAndReviews?.length > 0 
              ? (course.ratingAndReviews.reduce((acc, rev) => acc + (rev.rating || 0), 0) / course.ratingAndReviews.length).toFixed(1) 
              : (course.rating || "4.8");

            const totalLearners = course.studentsEnrolled?.length || course.reviews || 0;

            return (
              <div
                key={course._id || i}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between group hover:shadow-md transition duration-200"
              >
                {/* Product Card Thumbnail Area */}
                <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                  <img
                    onClick={() => navigate(`/studentdashboard/coursedetails/${course._id}`)}
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="cursor-pointer w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {course?.badge && (
                    <span className="absolute top-3 left-3 text-[9px] font-black tracking-wider text-white bg-indigo-600 px-2.5 py-0.5 shadow-sm rounded-md uppercase">
                      {course.badge}
                    </span>
                  )}
                  {course?.duration && (
                    <span className="absolute bottom-3 right-3 text-[10px] font-bold bg-slate-900/80 backdrop-blur-sm text-white px-2 py-1 rounded-md">
                      {course.duration}
                    </span>
                  )}
                </div>

                {/* Product Meta Descriptions */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      Instructor: {course?.instructor?.firstName} {course?.instructor?.lastName || ""}       
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 leading-snug group-hover:text-indigo-600 transition h-10 line-clamp-2">
                      {course?.courseName}
                    </h3>
                    
                    <div className="flex items-center space-x-1.5 pt-1">
                      <div className="flex items-center text-amber-500">
                        <Star size={13} fill="currentColor" />
                        <span className="text-xs font-black text-slate-700 ml-1">{avgRating}</span>
                      </div>
                      <span className="text-[11px] font-medium text-slate-400">
                        ({totalLearners} learners)
                      </span>
                    </div>
                  </div>

                  {/* Price Display Rows */}
                  <div className="flex items-baseline space-x-2 pt-2 border-t border-slate-100">
                    <span className="text-base font-black text-slate-900">₹{course?.price}</span>
                    <span className="text-xs font-semibold text-slate-400 line-through">₹{course?.originalPrice || Number(course?.price || 0) * 3}</span>
                    {course?.originalPrice && course?.originalPrice > course?.price && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
                        {Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>

                  {/* 📊 Interactive Dynamic CTAs Buttons */}
                  <div className="pt-1">
                    {isStudentEnrolled ? (
                      <button
                        onClick={() => navigate(`/studentdashboard/courseviewer/${course._id}`)}
                        className="w-full bg-emerald-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-emerald-700 shadow-md shadow-emerald-600/10 transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Check size={14} className="stroke-[3]" /> Go to Course
                      </button>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleAddToCart(course)}
                          className={`font-bold text-xs py-2.5 rounded-xl transition cursor-pointer flex items-center justify-center gap-1 border ${
                            courseInCart 
                              ? "bg-emerald-50 border-emerald-200 text-emerald-600 font-black" 
                              : "border-slate-200 text-slate-700 hover:bg-slate-50 active:bg-slate-100"
                          }`}
                        >
                          {courseInCart ? (
                            <>
                              <Check size={12} className="stroke-[3]" /> Added
                            </>
                          ) : (
                            "Add to Cart"
                          )}
                        </button>

                        <button
                          onClick={() => handleBuyNow(course)}
                          className="bg-indigo-600 text-white font-bold text-xs py-2.5 rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/10 active:scale-[0.99] transition cursor-pointer"
                        >
                          Buy Now
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 p-12 rounded-2xl text-center shadow-sm max-w-sm mx-auto">
          <p className="text-3xl">🛒</p>
          <h3 className="text-sm font-bold text-slate-700 mt-2">No Matching Courses</h3>
          <p className="text-xs text-slate-400 mt-1">Aapke budget range ya selected filters ke andar koi course nahi mila.</p>
        </div>
      )}
    </div>
  );
};

export default BuyCourse;