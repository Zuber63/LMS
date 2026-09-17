import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Layers,
  Upload,
  Image,
  Save,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const CreateCourseForm = ({ onNextStage }) => {
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(false);
  const navigate = useNavigate();
  const { courseId } = useParams();
  const isEditMode = Boolean(courseId);
  const token = localStorage.getItem("token");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseName: "",
      courseDescription: "",
      price: "",
      category: "Web Development",
      language: "Hindi",
      benefits: "",
      instructions: "",
      whatYouWillLearn: "",
      status: "Draft",
      thumbnailFile: null,
    },
  });

  // 🔄 EDIT MODE: Database se purana data laakar pre-fill karne ke liye
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!isEditMode) return;

      setIsDataLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api/course/getSingleCourse/${courseId}`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const jsonResponse = await response.json();

        if (response.ok && jsonResponse.course) {
          const course = jsonResponse.course;

          setValue("courseName", course.courseName || "");
          setValue("courseDescription", course.courseDescription || "");
          setValue("price", course.price || "");
          setValue(
            "category",
            course.category?.name || course.category || "Web Development",
          );
          setValue("language", course.language || "Hindi");

          // Agar backend se array aa raha hai toh commas se join karke string me convert karenge taaki textarea me sahi dikhe
          setValue(
            "benefits",
            Array.isArray(course.benefits)
              ? course.benefits.join(", ")
              : course.benefits || "",
          );
          setValue(
            "instructions",
            Array.isArray(course.instructions)
              ? course.instructions.join(", ")
              : course.instructions || "",
          );
          setValue(
            "whatYouWillLearn",
            Array.isArray(course.whatYouWillLearn)
              ? course.whatYouWillLearn.join(", ")
              : course.whatYouWillLearn || "",
          );

          setValue("status", course.status || "Draft");
          setThumbnailPreview(course.thumbnail);
        } else {
          toast.error("Course data fetch karne me dikkat aayi.");
        }
      } catch (error) {
        console.error("Fetch Details Error:", error);
        toast.error("Server se data nahi laa paye.");
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, isEditMode, token, setValue]);

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setValue("thumbnailFile", file);
      setThumbnailPreview(URL.createObjectURL(file));
      toast.success("Thumbnail image loaded successfully! 📸");
    }
  };

  // 🚀 DYNAMIC SUBMIT: Create aur Edit dono ka pipeline handle karega
  const onSubmitPipeline = async (data) => {
    if (!isEditMode && !data.thumbnailFile) {
      toast.error("Please upload a course thumbnail image.");
      return;
    }

    setIsSubmitting(true);
    const msg = isEditMode
      ? "Updating course data on server... ⏳"
      : "Deploying course data to server... ⏳";
    const loadingToastId = toast.info(msg, { autoClose: false });

    try {
      const formData = new FormData();
      formData.append("courseName", data.courseName);
      formData.append("courseDescription", data.courseDescription);
      formData.append("price", data.price);
      formData.append("category", data.category);
      formData.append("language", data.language);

      // Textareas ki string ko comma-separated array ya string me format karke bhejna (Backend compatibility ke liye)
      // Agar aapka backend direct string ya JSON array chahta hai toh aap dono tarike se bhej sakte hain:
      const formatAsArrayOrString = (val) => {
        if (!val) return "";
        // Agar aapko array bhejna hai toh comma se split karke bhej sakte hain:
        // return JSON.stringify(val.split(",").map(item => item.trim()));
        return val; // Filhal normal string bhej rahe hain, jaisa aapka purana code tha
      };

      formData.append("benefits", formatAsArrayOrString(data.benefits));
      formData.append("instructions", formatAsArrayOrString(data.instructions));
      formData.append(
        "whatYouWillLearn",
        formatAsArrayOrString(data.whatYouWillLearn),
      );
      formData.append("status", data.status);

      if (data.thumbnailFile) {
        formData.append("thumbnail", data.thumbnailFile);
      }
      if (isEditMode) {
        formData.append("courseId", courseId);
      }

      const targetUrl = isEditMode
        ? "http://localhost:5000/api/course/updateCourse"
        : "http://localhost:5000/api/course/createCourse";

      const targetMethod = isEditMode ? "PUT" : "POST";
      const response = await fetch(targetUrl, {
        method: targetMethod,
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const jsonResponse = await response.json();


      if (response.ok) {
        toast.dismiss(loadingToastId);
        toast.success(
          isEditMode
            ? "Course updated successfully! 🎉"
            : "Course base initialized successfully! 🚀",
        );

        const serverCourseId =
          courseId ||
          jsonResponse.course?._id ||
          jsonResponse.data?._id ||
          jsonResponse._id;

        if (onNextStage) onNextStage(serverCourseId);
        navigate(`/instructordashboard/coursesyllabusform/${serverCourseId}`);
      } else {
        throw new Error(
          jsonResponse.message || "Database cluster transaction failed.",
        );
      }
    } catch (error) {
      toast.dismiss(loadingToastId);
      toast.error(`Transmission Fault: ${error.message}`);
      console.error("Network request logs:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isDataLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-2">
        <Loader2 className="animate-spin text-indigo-600" size={28} />
        <p className="text-xs font-mono font-bold text-slate-500 uppercase">
          Synchronizing Course Entity data...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6 text-xs font-sans text-slate-700 antialiased selection:bg-indigo-500 selection:text-white">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => navigate("/instructordashboard/instructormycourses")}
            className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 rounded-xl transition flex items-center justify-center shrink-0 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-base font-black text-slate-800 tracking-tight">
              {isEditMode
                ? "Modify Course Settings"
                : "Create Professional Course"}
            </h1>
            <p className="text-slate-400 text-[11px] font-medium mt-0.5">
              {isEditMode
                ? "Change or tune core parameters of the existing course model."
                : "Fills core attributes and uploads binary thumbnail directly via multipart stream."}
            </p>
          </div>
        </div>
        <div className="bg-amber-50 text-amber-700 font-bold border border-amber-200 px-3 py-1.5 rounded-xl flex items-center gap-1.5 shrink-0 ml-auto sm:ml-0">
          <AlertCircle size={14} />
          <span>
            {isEditMode ? "Edit Mode Config" : "Step 1: Course Credentials"}
          </span>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmitPipeline)}
        className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
              Course Title *
            </label>
            <input
              type="text"
              placeholder="e.g., Ultimate React 19 Next.js Architecture Pipeline"
              {...register("courseName", {
                required: "Course Name is mandatory",
              })}
              className={`w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold transition ${errors.courseName ? "border-rose-400 bg-rose-50/10" : "border-slate-200 focus:border-indigo-500"}`}
            />
            {errors.courseName && (
              <p className="text-[10px] text-rose-500 font-bold">
                {errors.courseName.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
                Price (INR) *
              </label>
              <input
                type="text"
                placeholder="₹3499"
                {...register("price", { required: "Price key needed" })}
                className={`w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold transition ${errors.price ? "border-rose-400 bg-rose-50/10" : "border-slate-200 focus:border-indigo-500"}`}
              />
              {errors.price && (
                <p className="text-[10px] text-rose-500 font-bold">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* 🌟 Expanded Categories List */}
            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
                Category
              </label>
              <select
                {...register("category")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-bold text-slate-600 cursor-pointer"
              >
                <option value="Web Development">Web Development</option>
                <option value="Frontend Engineering">
                  Frontend Engineering
                </option>
                <option value="Backend Engineering">Backend Engineering</option>
                <option value="Full Stack Development">
                  Full Stack Development
                </option>
                <option value="Data Science">Data Science & AI</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="DevOps Cloud Systems">
                  DevOps Cloud Systems
                </option>
                <option value="Mobile Development">
                  Mobile App Development
                </option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
                Language
              </label>
              <select
                {...register("language")}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-bold text-slate-600 cursor-pointer"
              >
                <option value="Hindi">Hindi / Hinglish</option>
                <option value="English">English Standard</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px] flex items-center gap-1">
            <Image size={12} /> Course Branding Thumbnail Image{" "}
            {isEditMode ? "" : "*"}
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-2xl p-6 text-center relative hover:border-indigo-400 transition w-full sm:w-64 shrink-0 flex flex-col items-center justify-center min-h-[110px] cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleThumbnailChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload size={20} className="text-slate-400 mb-1" />
              <span className="font-black text-slate-600 block text-[11px]">
                Select device photo snapshot
              </span>
              <p className="text-[9px] text-slate-400 font-bold mt-0.5">
                Supports PNG, JPG, JPEG formats
              </p>
            </div>
            {thumbnailPreview && (
              <div className="border border-slate-200 bg-slate-900 rounded-2xl overflow-hidden w-52 h-28 relative shadow-md">
                <img
                  src={thumbnailPreview}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
            Course Overview Description *
          </label>
          <textarea
            rows="3"
            placeholder="Write details description..."
            {...register("courseDescription", {
              required: "Description field cannot be empty",
            })}
            className={`w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold transition ${errors.courseDescription ? "border-rose-400 bg-rose-50/10" : "border-slate-200 focus:border-indigo-500"}`}
          />
          {errors.courseDescription && (
            <p className="text-[10px] text-rose-500 font-bold">
              {errors.courseDescription.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
              What You Will Learn *
            </label>
            <textarea
              rows="3"
              placeholder="e.g., React Hooks, Node.js REST APIs, MongoDB (Comma separated)"
              {...register("whatYouWillLearn", { required: "Required" })}
              className={`w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold transition ${errors.whatYouWillLearn ? "border-rose-400 bg-rose-50/10" : "border-slate-200 focus:border-indigo-500"}`}
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
              Key Perks / Benefits *
            </label>
            <textarea
              rows="3"
              placeholder="e.g., Lifetime Access, Certificate, Live Projects (Comma separated)"
              {...register("benefits", { required: "Required" })}
              className={`w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold transition ${errors.benefits ? "border-rose-400 bg-rose-50/10" : "border-slate-200 focus:border-indigo-500"}`}
            />
          </div>
          <div className="space-y-1">
            <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
              Requirements & Instructions *
            </label>
            <textarea
              rows="3"
              placeholder="e.g., Basic JavaScript knowledge, Laptop with Node.js installed"
              {...register("instructions", { required: "Required" })}
              className={`w-full bg-slate-50 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 font-bold transition ${errors.instructions ? "border-rose-400 bg-rose-50/10" : "border-slate-200 focus:border-indigo-500"}`}
            />
          </div>
        </div>

        <div className="flex justify-between items-end pt-3 border-t border-slate-100">
          <div className="space-y-1">
            <label className="font-bold uppercase text-slate-500 tracking-wider text-[10px]">
              Course Status
            </label>
            <select
              {...register("status")}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 focus:outline-none focus:border-indigo-500 font-bold text-slate-600 cursor-pointer"
            >
              <option value="Draft">Draft</option>
              <option value="Published">Published</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-1.5 bg-slate-900 text-white font-black px-6 py-3 rounded-xl hover:bg-indigo-600 transition cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                <span>
                  {isEditMode
                    ? "Updating course..."
                    : "Creating base course..."}
                </span>
              </>
            ) : (
              <>
                <Save size={14} />
                <span>
                  {isEditMode ? "Save & Next Step" : "Next Step (Add Syllabus)"}
                </span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateCourseForm;
