import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Code2, Paintbrush, Database, Terminal, ShieldAlert, Cpu, ArrowRight, Loader2 } from 'lucide-react';

const CategoryShowcase = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Category name ke hisaab se icon mapping
  const iconMap = {
    "Web Development": Code2,
    "UI/UX Design": Paintbrush,
    "UI/UX Design Systems": Paintbrush,
    "Data Engineering": Database,
    "Backend Systems": Terminal,
    "Cyber Security": ShieldAlert,
    "AI & Machine Learning": Cpu,
  };

  const colorList = [
    { color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { color: 'text-amber-600', bgColor: 'bg-amber-50' },
    { color: 'text-rose-600', bgColor: 'bg-rose-50' },
    { color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
  ];

  useEffect(() => {
    const fetchCoursesAndExtractCategories = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/course/getAllCourses");
        const result = await response.json();
        
        const courses = result.data || result.courses || result;

        if (!Array.isArray(courses)) {
          console.error("Courses data is not an array:", courses);
          setLoading(false);
          return;
        }

        // 🔍 Step 1: Sirf Published courses filter karein
        const publishedCourses = courses.filter(course => 
          course.isPublished === true || 
          course.status === 'published' || 
          course.status === 'Published'
        );

        // 🏷️ Step 2: Published courses se categories extract aur group karna
        const categoryMap = {};

        publishedCourses.forEach(course => {
          const catName = course.category?.name || course.category || "General";
          
          if (!categoryMap[catName]) {
            categoryMap[catName] = {
              name: catName,
              count: 0
            };
          }
          categoryMap[catName].count += 1;
        });

        // Object ko array me convert karein
        const formattedCategories = Object.keys(categoryMap).map((catName, index) => ({
          id: index + 1,
          name: catName,
          courseCount: `${categoryMap[catName].count} Course${categoryMap[catName].count > 1 ? 's' : ''}`
        }));

        setCategories(formattedCategories);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses for categories:", error);
        setLoading(false);
      }
    };

    fetchCoursesAndExtractCategories();
  }, []);

  const handleCategoryClick = (categoryName) => {
    // Agar aap chahein toh query parameter ke sath courses page par bhej sakte hain
    navigate('/courses'); 
  };

  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Choice Architecture
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Browse Programs by <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Top Categories</span>
          </p>
          <p className="text-sm text-slate-500">
            Pick a specific engineering or design domain to view highly structured parameters and curated published tracks.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-indigo-600" size={36} />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-slate-400 py-10">No published categories found</div>
        ) : (
          /* Categories Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, index) => {
              const IconComponent = iconMap[cat.name] || Code2;
              const theme = colorList[index % colorList.length];

              return (
                <div 
                  key={cat.id}
                  onClick={() => handleCategoryClick(cat.name)}
                  className="bg-white border border-slate-200/70 p-6 rounded-2xl flex items-center justify-between shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 group cursor-pointer"
                >
                  <div className="flex items-center space-x-4">
                    {/* Icon Frame */}
                    <div className={`p-3 rounded-xl ${theme.bgColor} ${theme.color} transition-transform group-hover:scale-105 duration-200`}>
                      <IconComponent size={24} />
                    </div>
                    {/* Info */}
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-slate-400 font-medium">
                        {cat.courseCount}
                      </p>
                    </div>
                  </div>

                  {/* Arrow Icon Indicator */}
                  <div className="text-slate-300 group-hover:text-indigo-600 transform group-hover:translate-x-1 transition-all duration-200">
                    <ArrowRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </section>
  );
}

export default CategoryShowcase;