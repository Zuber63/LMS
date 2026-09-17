import React, { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Plus,
  Trash2,
  Film,
  FileCode,
  Save,
  ArrowLeft,
  Layers,
  HelpCircle,
  Loader2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CourseSyllabusForm = ({ onBack }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);

  const [deletedSections, setDeletedSections] = useState([]);
  const [deletedSubSections, setDeletedSubSections] = useState([]);

  const token = localStorage.getItem("token");
  const { courseId } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(courseId);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      sections: [
        {
          title: "",
          subsections: [{ subTitle: "", subDescription: "", videoFile: null, videoUrl: "" }],
        },
      ],
    },
  });

  const {
    fields: sectionFields,
    append: appendSection,
    remove: removeSection,
  } = useFieldArray({
    control,
    name: "sections",
  });

  const watchedSections = watch("sections");

  useEffect(() => {
    const fetchSyllabusDetails = async () => {
      if (!isEditMode) return;

      setIsDataLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/course/getSingleCourse/${courseId}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });
        const jsonResponse = await response.json();

        if (response.ok && jsonResponse.course && jsonResponse.course.courseContent) {
          const content = jsonResponse.course.courseContent;
          
          const structuredSections = content.map((section) => ({
            sectionId: section._id, 
            title: section.title,
            subsections: (section.subsections || []).map((sub) => ({
              subSectionId: sub._id, 
              subTitle: sub.title,
              subDescription: sub.description,
              videoUrl: sub.videoUrl, 
              videoFile: null, 
            })),
          }));

          setValue("sections", structuredSections);
        }
      } catch (error) {
        console.error("Syllabus initialization engine fault:", error);
        toast.error("Purana syllabus structure load nahi ho paya.");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchSyllabusDetails();
  }, [courseId, isEditMode, token, setValue]);

  const handleRemoveSection = (sectionIndex) => {
    const sectionToRemove = watchedSections[sectionIndex];
    if (sectionToRemove?.sectionId) {
      setDeletedSections((prev) => [...prev, sectionToRemove.sectionId]);
      
      sectionToRemove.subsections?.forEach((sub) => {
        if (sub.subSectionId) {
          setDeletedSubSections((prev) => [...prev, sub.subSectionId]);
        }
      });
    }
    removeSection(sectionIndex);
  };

  const handleRemoveSubSection = (sectionIndex, subIndex) => {
    const subToRemove = watchedSections[sectionIndex]?.subsections?.[subIndex];
    if (subToRemove?.subSectionId) {
      setDeletedSubSections((prev) => [...prev, subToRemove.subSectionId]);
    }
    const filtered = watchedSections[sectionIndex].subsections.filter((_, idx) => idx !== subIndex);
    setValue(`sections.${sectionIndex}.subsections`, filtered);
  };

  const onSyllabusSubmit = async (data, statusType) => {
    if (!courseId) {
      toast.error("Data Routing Fault: Course ID reference token is missing.");
      return;
    }

    setIsProcessing(true);
    const modeMsg = isEditMode ? `Updating course status to [${statusType}]... ⏳` : `Saving syllabus tracks as [${statusType}]... ⏳`;
    const loadingToastId = toast.info(modeMsg, { autoClose: false });

    try {
      // 🔥 STEP 0: COURSE STATUS UPDATE (Agar aap chahte hain ki course ka main status bhi update ho)
      const courseStatusFormData = new FormData();
      courseStatusFormData.append("courseId", courseId);
      courseStatusFormData.append("status", statusType); // "Draft" ya "Published"

      await fetch(`${import.meta.env.VITE_API_URL}/api/course/updateCourse`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: courseStatusFormData,
      }).catch((err) => console.log("Course status update warning:", err));

      // 🗑️ STEP 1: BACKEND CLEANUP FOR DELETED ITEMS
      if (isEditMode) {
        for (const subId of deletedSubSections) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/course/deleteSubsection`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ subSectionId: subId, courseId }),
          }).catch((err) => console.log("Subsection delete error:", err));
        }

        for (const secId of deletedSections) {
          await fetch(`${import.meta.env.VITE_API_URL}/api/course/deleteSection`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
            body: JSON.stringify({ sectionId: secId, courseId }),
          }).catch((err) => console.log("Section delete error:", err));
        }
      }

      // 🔄 STEP 2: SECTIONS LOOP (Create/Update Sections)
      for (let sIdx = 0; sIdx < data.sections.length; sIdx++) {
        const section = data.sections[sIdx];
        let currentSectionId = section.sectionId;

        const sectionFormData = new FormData();
        sectionFormData.append("courseId", courseId);
        sectionFormData.append("title", section.title);
        if (currentSectionId) sectionFormData.append("sectionId", currentSectionId);

        const sectionUrl = currentSectionId
          ? `${import.meta.env.VITE_API_URL}/api/course/updateSection` 
          : `${import.meta.env.VITE_API_URL}/api/course/createSection`;

        const sectionMethod = currentSectionId ? "PUT" : "POST";

        const sectionResponse = await fetch(sectionUrl, {
          method: sectionMethod,
          headers: { Authorization: `Bearer ${token}` },
          body: sectionFormData,
        });

        const sectionResult = await sectionResponse.json();
        if (!sectionResponse.ok) {
          throw new Error(sectionResult.message || `Failed at Section idx: ${sIdx}`);
        }

        const targetSectionId = currentSectionId || sectionResult.data?._id || sectionResult.updatedCourse?.courseContent?.[sIdx]?._id;

        // 🔄 STEP 3: SUBSECTIONS LOOP (Create/Update Subsections)
        if (section.subsections && section.subsections.length > 0) {
          for (let subIdx = 0; subIdx < section.subsections.length; subIdx++) {
            const sub = section.subsections[subIdx];
            let currentSubId = sub.subSectionId;

            const subFormData = new FormData();
            subFormData.append("sectionId", targetSectionId);
            subFormData.append("title", sub.subTitle);
            subFormData.append("description", sub.subDescription);
            if (currentSubId) subFormData.append("subSectionId", currentSubId);

            if (sub.videoFile && sub.videoFile.length > 0 && sub.videoFile[0]) {
              subFormData.append("videoUrl", sub.videoFile[0]);
            } else if (statusType === "Published" && !isEditMode && !sub.videoUrl) {
              throw new Error(`Lecture ${subIdx + 1} in Section ${sIdx + 1} is missing a video file.`);
            }

            const subUrl = currentSubId
              ? `${import.meta.env.VITE_API_URL}/api/course/updateSubsection` 
              : `${import.meta.env.VITE_API_URL}/api/course/createSubsection`;

            const subMethod = currentSubId ? "PUT" : "POST";

            const subResponse = await fetch(subUrl, {
              method: subMethod,
              headers: { Authorization: `Bearer ${token}` },
              body: subFormData,
            });

            const subResult = await subResponse.json();
            if (!subResponse.ok) {
              throw new Error(subResult.message || `Failed uploading media at position: ${subIdx}`);
            }
          }
        }
      }

      toast.dismiss(loadingToastId);
      toast.success(
        isEditMode 
          ? `Curriculum roadmap successfully saved as [${statusType}]! 🎉`
          : `Complete dynamic curriculum matrix synced up cleanly as [${statusType}]! 🎉`
      );

      navigate("/instructordashboard/instructormycourses");
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(`Syllabus Processing Error: ${error.message}`);
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-indigo-600" size={28} />
        <p className="text-xs font-mono font-bold text-slate-500 uppercase">Reconstructing Curriculum data tracks...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-xs font-sans text-slate-700 antialiased dynamic-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-md text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-slate-800 text-indigo-400 border border-slate-700 rounded-xl">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-base font-black tracking-tight">
              {isEditMode ? "Phase 2: Edit Syllabus Configuration" : "Phase 2: Syllabus Engine Controller"}
            </h1>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5">
              Target Reference Token key:{" "}
              <span className="text-indigo-400 font-mono">#{courseId}</span>
            </p>
          </div>
        </div>
        <button
          type="button"
          disabled={isProcessing}
          onClick={() => navigate(`/instructordashboard/updatecourse/${courseId}`)}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2 rounded-xl text-xs font-bold text-slate-300 transition disabled:opacity-40"
        >
          <ArrowLeft size={14} />
          <span>Back to Page 1</span>
        </button>
      </div>

      <div className="flex justify-between items-center bg-white border border-slate-200 rounded-xl p-4 shadow-2xs">
        <span className="font-bold text-slate-400 flex items-center gap-1">
          <HelpCircle size={14} className="text-slate-300" /> Structure course hierarchy tree systematically.
        </span>
        <button
          type="button"
          disabled={isProcessing}
          onClick={() =>
            appendSection({
              title: "",
              subsections: [{ subTitle: "", subDescription: "", videoFile: null, videoUrl: "" }],
            })
          }
          className="flex items-center gap-1 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition disabled:opacity-40"
        >
          <Plus size={12} /> Add New Section
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        {sectionFields.map((sectionField, sectionIndex) => (
          <div
            key={sectionField.id}
            className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs border-t-2 border-t-slate-900"
          >
            <div className="bg-slate-50 border-b border-slate-100 p-4 flex justify-between items-center gap-4">
              <div className="flex items-center gap-2 flex-1">
                <span className="bg-slate-200 text-slate-700 px-2.5 py-0.5 text-[9px] font-black rounded border border-slate-300">
                  SECTION 0{sectionIndex + 1}
                </span>
                <input
                  type="text"
                  disabled={isProcessing}
                  placeholder="Enter Section Name Context..."
                  {...register(`sections.${sectionIndex}.title`, { required: true })}
                  className="bg-transparent focus:outline-none font-black text-slate-800 w-full pb-0.5 text-xs border-b border-transparent focus:border-indigo-500 transition-all"
                />
              </div>
              
              <button
                type="button"
                disabled={isProcessing}
                onClick={() => handleRemoveSection(sectionIndex)}
                className="text-slate-400 hover:text-rose-500 p-1 disabled:opacity-40 transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </div>

            <div className="p-5 space-y-4 bg-slate-50/20">
              <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <span className="font-black text-slate-400 text-[10px] uppercase flex items-center gap-1">
                  Lecture Node Subsections
                </span>
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => {
                    const currentSubs = watchedSections[sectionIndex]?.subsections || [];
                    setValue(`sections.${sectionIndex}.subsections`, [
                      ...currentSubs,
                      { subTitle: "", subDescription: "", videoFile: null, videoUrl: "" },
                    ]);
                  }}
                  className="text-indigo-600 bg-indigo-50 hover:bg-indigo-100 font-black text-[10px] px-2.5 py-1.5 rounded-lg disabled:opacity-40"
                >
                  + Add Lecture
                </button>
              </div>

              {watchedSections[sectionIndex]?.subsections?.map((subField, subIndex) => (
                <div
                  key={subIndex}
                  className="bg-white border border-slate-200 rounded-xl p-4 grid grid-cols-1 md:grid-cols-2 gap-4 shadow-2xs relative"
                >
                  <button
                    type="button"
                    disabled={isProcessing}
                    onClick={() => handleRemoveSubSection(sectionIndex, subIndex)}
                    className="absolute top-3 right-3 text-slate-300 hover:text-rose-500 disabled:opacity-40 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Lecture Video Title *</label>
                      <input
                        type="text"
                        disabled={isProcessing}
                        placeholder="Title..."
                        {...register(`sections.${sectionIndex}.subsections.${subIndex}.subTitle`, { required: true })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Video Description *</label>
                      <textarea
                        rows="2"
                        disabled={isProcessing}
                        placeholder="Description logs..."
                        {...register(`sections.${sectionIndex}.subsections.${subIndex}.subDescription`, { required: true })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 font-bold text-slate-700 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <label className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                      Target Video File {isEditMode ? "(Optional)" : "*"}
                    </label>
                    <div className="border border-dashed border-slate-200 bg-slate-50 rounded-xl p-4 text-center relative flex flex-col items-center justify-center flex-1 min-h-[90px] hover:border-indigo-400 transition">
                      <input
                        type="file"
                        accept="video/*"
                        disabled={isProcessing}
                        {...register(`sections.${sectionIndex}.subsections.${subIndex}.videoFile`)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Film size={18} className="text-slate-400 mb-1" />
                      
                      <span className="text-[10px] font-black text-slate-600 truncate max-w-[260px] px-2">
                        {watch(`sections.${sectionIndex}.subsections.${subIndex}.videoFile`)?.[0]?.name || 
                         (subField.videoUrl ? `✅ Saved: ${subField.videoUrl.split("/").pop()}` : "Select Video file stream")}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex justify-end gap-3 pt-3 border-t border-slate-200">
          {/* DRAFT BUTTON */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSubmit((data) => onSyllabusSubmit(data, "Draft"))}
            className="bg-slate-100 border border-slate-300 hover:bg-slate-200 text-slate-700 font-black px-6 py-3 rounded-xl flex items-center gap-1.5 transition disabled:opacity-50"
          >
            <FileCode size={14} />
            <span>Save as Draft</span>
          </button>

          {/* PUBLISH / DEPLOY LIVE BUTTON */}
          <button
            type="button"
            disabled={isProcessing}
            onClick={handleSubmit((data) => onSyllabusSubmit(data, "Published"))}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-7 py-3 rounded-xl shadow-md flex items-center gap-1.5 transition disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>Processing Loops...</span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>{isEditMode ? "Update & Deploy Live" : "Commit & Deploy Course Live"}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CourseSyllabusForm;