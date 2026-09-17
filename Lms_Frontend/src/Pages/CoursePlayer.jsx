import React, { useState } from 'react';
import { 
  ArrowLeft, Play, CheckCircle2, ChevronDown, ChevronUp, 
  FileText, MessageSquare, HelpCircle, Download, BookOpen, Video
} from 'lucide-react';

function CoursePlayer() {
  const [activeTab, setActiveTab] = useState('desc'); // 'desc', 'resources', 'qa'
  const [openSection, setOpenSection] = useState(1); // Track open accordion section
  const [currentVideo, setCurrentVideo] = useState({
    id: 'vid-1',
    title: '1.2 Understanding Flexbox Grid vs CSS Grid Architecture',
    duration: '14:25'
  });

  // --- MOCK DATABASE FOR MODULES & SYLLABUS ---
  const syllabus = [
    {
      id: 1,
      title: 'Module 1: Layout Fundamentals & Tailwind Setup',
      lectures: [
        { id: 'vid-1', title: '1.1 Installing Tailwind CSS in React 19', duration: '08:40', completed: true },
        { id: 'vid-2', title: '1.2 Understanding Flexbox Grid vs CSS Grid Architecture', duration: '14:25', completed: false },
        { id: 'vid-3', title: '1.3 Configuring custom Theme Tokens in tailwind.config', duration: '11:10', completed: false },
      ]
    },
    {
      id: 2,
      title: 'Module 2: Advanced Dynamic Component Styling',
      lectures: [
        { id: 'vid-4', title: '2.1 Writing Complex Conditional Classes with clsx & tailwind-merge', duration: '19:45', completed: false },
        { id: 'vid-5', title: '2.2 Micro-interactions & Custom Framer Motion Animations', duration: '22:15', completed: false },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      
      {/* 1. TOP VIDEO PLAYER HEADER LAYER */}
      <header className="h-16 bg-slate-950 border-b border-slate-800/60 px-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center space-x-3 min-w-0">
          <button className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl transition flex-shrink-0">
            <ArrowLeft size={16} />
          </button>
          <div className="truncate">
            <span className="text-[10px] text-indigo-400 font-bold tracking-wide uppercase block">Advanced React & Tailwind Architecture</span>
            <h1 className="text-xs sm:text-sm font-bold text-slate-200 truncate">{currentVideo.title}</h1>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl text-[11px] font-bold text-slate-300 whitespace-nowrap hidden sm:block">
          Your Progress: 8/12 Done
        </div>
      </header>

      {/* 2. DUAL MAIN PANEL CONTENT INTERFACE */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0 overflow-hidden">
        
        {/* --- LEFT HAND SIDE: THE CINEMATIC MEDIA CONTROLLER AREA --- */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          
          {/* Main Simulated Video Placeholder Frame */}
          <div className="w-full aspect-video bg-slate-900 relative flex items-center justify-center border-b border-slate-800/80 shadow-inner group">
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
            
            {/* Center Big Play UI Indicator */}
            <div className="w-16 h-16 rounded-full bg-indigo-600/90 text-white flex items-center justify-center shadow-2xl shadow-indigo-600/30 cursor-pointer transform group-hover:scale-105 transition-all">
              <Play size={24} fill="currentColor" className="ml-1" />
            </div>

            {/* Dummy Mock Video Bottom Control HUD Bar */}
            <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent flex items-center justify-between text-xs text-slate-400 font-mono select-none">
              <span>00:00 / {currentVideo.duration}</span>
              <span className="bg-slate-800 px-2 py-0.5 rounded text-[10px] font-sans font-bold text-slate-300 uppercase">1080p HD</span>
            </div>
          </div>

          {/* Under Video Documentation / Metadata Tabs */}
          <div className="p-6 space-y-6 max-w-4xl w-full mx-auto bg-slate-950">
            <div className="flex space-x-1 border-b border-slate-800/80 pb-px">
              {[
                { id: 'desc', label: 'Overview', icon: <FileText size={14} /> },
                { id: 'resources', label: 'Resources (2)', icon: <Download size={14} /> },
                { id: 'qa', label: 'Q&A Community', icon: <MessageSquare size={14} /> }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2.5 text-xs font-bold transition-all relative top-px ${
                    activeTab === tab.id 
                      ? 'text-indigo-400 border-b-2 border-indigo-500' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Dynamic Content Switches based on Tab Selected */}
            <div className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium pt-2">
              {activeTab === 'desc' && (
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-white tracking-tight">About this Lecture</h3>
                  <p className="text-slate-400">In this deep-dive tutorial video, we disassemble the core engine mechanics of web UI layouts. You will learn the exact practical edge-cases where standard Tailwind flex rows collapse and why using a native Grid framework acts as an absolute bulletproof alternative structure.</p>
                </div>
              )}
              {activeTab === 'resources' && (
                <div className="space-y-2">
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg"><FileText size={16} /></div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-xs">Grid-cheat-sheet.pdf</h4>
                        <p className="text-[10px] text-slate-500 font-semibold font-mono">1.2 MB</p>
                      </div>
                    </div>
                    <button className="p-2 text-slate-400 hover:text-white bg-slate-800/50 rounded-lg transition"><Download size={14} /></button>
                  </div>
                </div>
              )}
              {activeTab === 'qa' && (
                <p className="text-slate-500 italic text-xs py-4">No community discussion responses posted yet. Be the first to start a thread!</p>
              )}
            </div>
          </div>

        </div>

        {/* --- RIGHT HAND SIDE: SYLLABUS TRACK ACCORDION CONSOLE --- */}
        <aside className="w-full lg:w-80 bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-800 flex flex-col flex-shrink-0 min-h-0">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50 flex items-center space-x-2 text-slate-300 font-bold text-xs tracking-wide uppercase flex-shrink-0">
            <BookOpen size={14} className="text-indigo-400" />
            <span>Course Content Playlist</span>
          </div>

          {/* Core Accordion Loop Container */}
          <div className="flex-1 overflow-y-auto division-list">
            {syllabus.map((section) => (
              <div key={section.id} className="border-b border-slate-800 last:border-none">
                
                {/* Accordion Trigger Header Bar */}
                <button
                  onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                  className="w-full px-4 py-3.5 bg-slate-900 hover:bg-slate-850 flex items-start justify-between text-left transition-colors"
                >
                  <span className="text-xs font-bold text-slate-200 tracking-tight pr-2 leading-snug">
                    {section.title}
                  </span>
                  {openSection === section.id ? <ChevronUp size={16} className="text-slate-500 flex-shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-slate-500 flex-shrink-0 mt-0.5" />}
                </button>

                {/* Dropdown Lecture Rows Mapping */}
                {openSection === section.id && (
                  <div className="bg-slate-950/40 border-t border-slate-800/40">
                    {section.lectures.map((lec) => (
                      <button
                        key={lec.id}
                        onClick={() => setCurrentVideo(lec)}
                        className={`w-full px-4 py-3 flex items-start space-x-3 border-b border-slate-800/30 last:border-none text-left transition-all ${
                          currentVideo.id === lec.id 
                            ? 'bg-indigo-600/10 border-l-2 border-indigo-500 text-indigo-400' 
                            : 'hover:bg-slate-800/30 text-slate-400 hover:text-slate-300'
                        }`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          {lec.completed ? (
                            <CheckCircle2 size={14} className="text-emerald-500" />
                          ) : (
                            <Video size={14} className={currentVideo.id === lec.id ? "text-indigo-400" : "text-slate-600"} />
                          )}
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <h5 className={`text-xs font-medium leading-tight ${currentVideo.id === lec.id ? 'font-bold text-indigo-300' : 'text-slate-300'}`}>
                            {lec.title}
                          </h5>
                          <span className="block text-[10px] font-semibold text-slate-500 font-mono">{lec.duration}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

              </div>
            ))}
          </div>
        </aside>

      </div>

    </div>
  );
}

export default CoursePlayer;