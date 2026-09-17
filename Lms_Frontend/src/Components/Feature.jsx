import React from 'react';
import { Video, ShieldCheck, Award, Users, BookOpen, Clock } from 'lucide-react';

const Features = () => {
  const featuresList = [
    {
      icon: Video,
      title: 'Interactive Live Classes',
      description: 'Learn live from industry experts and solve your doubts instantly in real-time sessions.',
      iconColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
    },
    {
      icon: Users,
      title: 'Expert Mentorship',
      description: 'Get career guidance and portfolio reviews directly from senior working professionals.',
      iconColor: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      icon: Award,
      title: 'Verified Certificates',
      description: 'Earn industry-recognized certificates upon course completion to showcase on your resume.',
      iconColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      icon: BookOpen,
      title: 'Rich Learning Material',
      description: 'Access high-quality coding sandboxes, quizzes, notes, and downloadable assets.',
      iconColor: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Clock,
      title: 'Lifetime Access',
      description: 'Learn at your own comfortable pace with absolute lifetime access to all course materials.',
      iconColor: 'text-amber-600',
      bgColor: 'bg-amber-50',
    },
    {
      icon: ShieldCheck,
      title: 'Placement Assistance',
      description: 'Get mock interview practice, resume building tips, and direct job opening referrals.',
      iconColor: 'text-rose-600',
      bgColor: 'bg-rose-50',
    },
  ];

  return (
    <section className="bg-white py-20 lg:py-28 border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <h2 className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            Why Choose Us
          </h2>
          <p className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for High-Impact <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">Learning Experiences</span>
          </p>
          <p className="text-base text-slate-500">
            We provide everything you need to successfully shift your career or upgrade your skills. No fluff, just practical learning.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuresList.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="bg-slate-50 border border-slate-100/80 p-6 rounded-2xl shadow-sm hover:shadow-md hover:border-slate-200 transition-all duration-200 space-y-4 group"
              >
                {/* Icon Box */}
                <div className={`w-12 h-12 rounded-xl ${feature.bgColor} ${feature.iconColor} flex items-center justify-center transition-transform group-hover:scale-105 duration-200`}>
                  <IconComponent size={24} />
                </div>
                
                {/* Content */}
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

export default Features;