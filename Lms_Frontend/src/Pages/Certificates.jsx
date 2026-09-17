import React, { useState } from "react";
import { Award, Download, Share2, Search, Calendar, ShieldCheck, CheckCircle2, Clock } from "lucide-react";
import { toast } from "react-toastify";

const CertificatesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");

  // 🎓 Dummy data system for completed & active courses certificates
  const certificatesData = [
    {
      id: 1,
      courseTitle: "Ultimate MERN Stack Bootcamp 2026",
      issueDate: "2026-02-10",
      credentialId: "EP-MERN-98431",
      status: "completed",
      instructor: "Anuj Kumar",
    },
    {
      id: 2,
      courseTitle: "Mastering Figma & UI/UX Design Systems",
      issueDate: "2026-03-24",
      credentialId: "EP-UIUX-22940",
      status: "completed",
      instructor: "Sahil Verma",
    },
    {
      id: 3,
      courseTitle: "Advanced Next.js & Server Architectures",
      issueDate: "Pending",
      credentialId: "—",
      status: "in-progress",
      progress: 75,
      instructor: "Anuj Kumar",
    },
  ];

  // 📥 Download Handler
  const handleDownload = (title) => {
    toast.success(`Downloading PDF for "${title}"... 📄`);
  };

  // 🔗 Share Handler
  const handleShare = (id) => {
    navigator.clipboard.writeText(`https://edupulse.com/verify/${id}`);
    toast.info("Certificate verification link copied to clipboard! 🔗");
  };

  // 🔍 Filter Search System logic
  const filteredCertificates = certificatesData.filter((cert) =>
    cert.courseTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const completedCount = certificatesData.filter(c => c.status === "completed").length;
  const pendingCount = certificatesData.filter(c => c.status === "in-progress").length;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 md:px-8 py-6 space-y-8">
      
      {/* 1. TOP HEADER STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Total Earned */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Earned</span>
            <span className="text-xl font-black text-slate-800">{completedCount} Certificates</span>
          </div>
        </div>

        {/* Total Pending */}
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Clock size={24} />
          </div>
          <div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">In Progress</span>
            <span className="text-xl font-black text-slate-800">{pendingCount} Courses Left</span>
          </div>
        </div>

        {/* Search Panel box */}
        <div className="bg-white border border-slate-200/80 p-3 rounded-2xl shadow-sm flex items-center px-4 gap-2">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search certificate..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-transparent text-xs font-bold text-slate-700 placeholder-slate-400 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. CERTIFICATES LIST GRID ENGINE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCertificates.length > 0 ? (
          filteredCertificates.map((cert) => (
            <div 
              key={cert.id}
              className={`bg-white border rounded-2xl p-5 shadow-sm flex flex-col justify-between gap-5 relative transition duration-150 ${
                cert.status === "completed" ? "border-slate-200/80" : "border-slate-200/60 bg-slate-50/40"
              }`}
            >
              {/* Top Row badge details */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1.5">
                  <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    cert.status === "completed" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                  }`}>
                    {cert.status === "completed" ? "Verified Badge" : "Course Active"}
                  </span>
                  <h3 className="text-sm font-black text-slate-800 leading-snug line-clamp-2">
                    {cert.courseTitle}
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-400">Mentor: {cert.instructor}</p>
                </div>
                
                <div className={`h-12 w-12 rounded-xl shrink-0 flex items-center justify-center ${
                  cert.status === "completed" ? "bg-indigo-50 text-indigo-600" : "bg-slate-100 text-slate-400"
                }`}>
                  <Award size={24} />
                </div>
              </div>

              {/* Middle Section Data parameters */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span className="flex items-center gap-1"><Calendar size={13}/> Issue Date:</span>
                  <span className="text-slate-700">{cert.issueDate}</span>
                </div>
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                  <span>ID Credential:</span>
                  <span className="font-mono text-slate-700">{cert.credentialId}</span>
                </div>

                {/* Progress rendering logic for in-complete items */}
                {cert.status === "in-progress" && (
                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[10px] font-black text-indigo-600 uppercase">
                      <span>Completion Route</span>
                      <span>{cert.progress}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 transition-all duration-300" style={{ width: `${cert.progress}%` }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Action controllers */}
              <div className="flex gap-2.5 pt-1">
                {cert.status === "completed" ? (
                  <>
                    <button
                      onClick={() => handleDownload(cert.courseTitle)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm shadow-indigo-600/10"
                    >
                      <Download size={14} /> Download PDF
                    </button>
                    <button
                      onClick={() => handleShare(cert.credentialId)}
                      className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xs p-2.5 rounded-xl flex items-center justify-center transition cursor-pointer"
                      title="Share Certificate"
                    >
                      <Share2 size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    disabled
                    className="w-full bg-slate-100 text-slate-400 border border-slate-200/40 font-bold text-xs py-2.5 rounded-xl text-center cursor-not-allowed"
                  >
                    Complete Course to Unlock Badge
                  </button>
                )}
              </div>

            </div>
          ))
        ) : (
          /* Empty search state view */
          <div className="col-span-1 md:col-span-2 bg-white border border-slate-200/80 p-8 rounded-2xl text-center shadow-sm max-w-xs mx-auto space-y-2">
            <span className="text-xl block">🔍</span>
            <h4 className="text-xs font-black text-slate-800">No Certificates Found</h4>
            <p className="text-[11px] text-slate-400 font-medium">Aapke search keyword se match karta hua koi result nahi mila.</p>
          </div>
        )}
      </div>

      {/* 3. SAFETY AND AUTHENTICITY BLOCK */}
      <div className="flex items-center justify-center gap-2 text-slate-400 text-[11px] font-bold">
        <ShieldCheck size={16} className="text-emerald-500" />
        <span>All generated certifications are uniquely block-signed and globally verifiable</span>
      </div>

    </div>
  );
};

export default CertificatesPage;