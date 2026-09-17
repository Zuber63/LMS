
const USER = require("../Models/user");
const PROFILE = require("../Models/profile");
const COURSE = require("../Models/course");
const CATEGORY = require("../Models/category");
const SubSection = require("../Models/subsection"); // SubSection Model import kar liya
const CourseProgress = require("../Models/courseprogress");
const { uploadImageToCloudinary } = require("../Utils/imageuplode");
const dotenv = require("dotenv");
dotenv.config();

// ==========================================
// 1. CREATE COURSE
// ==========================================
exports.createCourse = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id;

    const {
      courseName,
      courseDescription,
      price,
      category,
      language,
      benefits,
      instructions,
      whatYouWillLearn,
      status,
    } = req.body;
    
    const file = req.files?.thumbnail;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Thumbnail image is required",
      });
    }

    if (
      !courseName ||
      !courseDescription ||
      !price ||
      !category ||
      !language ||
      !benefits ||
      !instructions ||
      !whatYouWillLearn
    ) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const thumbnailUrl = await uploadImageToCloudinary(
      file,
      process.env.FOLDER_NAME,
      500,
      80
    );

    // 🔄 Comma aur Newline (\n, \r\n) dono se array banane ka parser
    const parseToArray = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === "string") {
        return field
          .split(/,|\r\n|\n/)
          .map((item) => item.trim())
          .filter(Boolean);
      }
      return [field];
    };

    const parsedWhatYouWillLearn = parseToArray(whatYouWillLearn);
    const parsedBenefits = parseToArray(benefits);
    const parsedInstructions = parseToArray(instructions);

    // Database me course create karein (Sahi variables use kiye gaye hain)
    const newCourse = await COURSE.create({
      courseName,
      courseDescription,
      price,
      category,
      language,
      whatYouWillLearn: parsedWhatYouWillLearn,
      benefits: parsedBenefits,
      instructions: parsedInstructions,
      thumbnail: thumbnailUrl.secure_url, // 👈 Fix: thumbnailImage ki jagah thumbnailUrl
      instructor: userId,                // 👈 Fix: instructorId ki jagah userId
      status: status || "Draft"
    });

    await USER.findByIdAndUpdate(
      userId,
      { $push: { course: newCourse._id } },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("CREATE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error while creating course.",
      error: error.message,
    });
  }
};

// ==========================================
// 2. UPDATE COURSE
// ==========================================
exports.updateCourse = async (req, res) => {
  try {
    const {
      courseId,
      courseName,
      courseDescription,
      price,
      category,
      language,
      benefits,
      instructions,
      whatYouWillLearn,
      status,
    } = req.body;

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required",
      });
    }

    const course = await COURSE.findById(courseId);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Thumbnail upload check
    let thumbnailUrl = null;
    const file = req.files?.thumbnail; 
    if (file) {
      thumbnailUrl = await uploadImageToCloudinary(
        file,
        process.env.FOLDER_NAME,
        500,
        80
      );
    }

    // 🔄 Updated Parser: Comma aur Newline (\n, \r\n) dono se array mein split karega
    const parseToArray = (field) => {
      if (!field) return [];
      if (Array.isArray(field)) return field;
      if (typeof field === "string") {
        return field
          .split(/,|\r\n|\n/) // Comma ya Enter (line break) se tod dega
          .map((item) => item.trim())
          .filter(Boolean); // Khali lines ko hata dega
      }
      return [field];
    };

    // Updated fields object
    const updateFields = {
      ...(courseName && { courseName }),
      ...(courseDescription && { courseDescription }),
      ...(price && { price }),
      ...(category && { category }),
      ...(language && { language }),
      ...(status && { status }),
      ...(thumbnailUrl && { thumbnail: thumbnailUrl.secure_url }),
    };

    // Arrays ko explicitly parse karke add karenge
    if (benefits !== undefined) updateFields.benefits = parseToArray(benefits);
    if (instructions !== undefined) updateFields.instructions = parseToArray(instructions);
    if (whatYouWillLearn !== undefined) updateFields.whatYouWillLearn = parseToArray(whatYouWillLearn);

    // Database update
    const updatedCourse = await COURSE.findByIdAndUpdate(
      courseId,
      updateFields,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course updated successfully",
      course: updatedCourse,
    });

  } catch (error) {
    console.error("UPDATE COURSE ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error while updating course.",
    });
  }
};

// ==========================================
// 3. GET ALL COURSES
// ==========================================
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await COURSE.find()
      .populate("category")
      .populate("instructor", "firstName lastName email");

    return res.status(200).json({
      success: true,
      message: "Courses fetched successfully",
      courses: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message + " Internal server error while fetching courses.",
    });
  }
};

// ==========================================
// 4. GET SINGLE COURSE WITH PROGRESS SYNC 
// ==========================================
exports.getSingleCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId || req.user?.id; // Optional: Authenticated user ID

    // 1. Fetch course without worrying about complex schema population issues
    const course = await COURSE.findById(courseId)
      .populate("category")
      .populate({
    path: "instructor",
    select: "firstName lastName email",
    populate: {
      path: "additionalInfo", // Yeh important hai
      select: "about gender profession" // Jo field aapko chahiye
    }
  }).populate({
        path: "courseContent",
        populate: {
          path: "subsections",
        },
      });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // 2. Fetch all ratings & reviews for this course directly using Rating model
    // (Yeh ensure karega ki chahe course schema me field ho ya na ho, reviews mil hi jayenge!)
    const courseReviews = await Rating.find({ courseId: courseId })
      .populate("userId", "firstName lastName email image")
      .sort({ createdAt: -1 });

    // 3. Convert mongoose document to a plain JavaScript object so we can attach reviews safely
    const courseObj = course.toObject();
    courseObj.ratingAndReviews = courseReviews; // Frontend iskey through reviews show karega

    // 4. User ki progress retrieve karke frontend ko pass karna
    let courseProgressCount = [];
    if (userId && typeof CourseProgress !== 'undefined') {
      const courseProgress = await CourseProgress.findOne({
        courseID: courseId,
        userId: userId,
      });
      courseProgressCount = courseProgress ? courseProgress.completedVideos : [];
    }

    return res.status(200).json({
      success: true,
      message: "Course fetched successfully",
      course: courseObj, // 👈 Modified course object with attached reviews
      data: {
        completedVideos: courseProgressCount 
      }
    });
  } catch (error) {
    console.error("Error in getSingleCourse:", error);
    return res.status(500).json({
      success: false,
      message: error.message + " Internal server error while fetching course.",
    });
  }
};

// ==========================================
// 5. GET INSTRUCTOR COURSES
// ==========================================
exports.getInstructorCourses = async (req, res) => {
  try {
    const { instructorId } = req.params;

    const courses = await COURSE.find({ instructor: instructorId }).populate("category");

    return res.status(200).json({
      success: true,
      message: "Instructor's courses fetched successfully",
      courses: courses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message + " Internal server error while fetching instructor's courses.",
    });
  }
};

// ==========================================
// 6. UPDATE COURSE PROGRESS (ADD)
// ==========================================
// 🟢 MARK AS COMPLETED (ADD PROGRESS)

exports.updateCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  // Auth middleware decoded token se userId lo
  const userId = req.user.userId || req.user.id; 

  try {
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({ success: false, error: "Invalid lecture ID" });
    }

    // Schema field names 'course' aur 'user' use karo
    let courseProgress = await CourseProgress.findOne({
      course: courseId,
      user: userId,
    });

    if (!courseProgress) {
      // 1. New document creation with exact schema keys (course & user)
      courseProgress = new CourseProgress({
        course: courseId,
        user: userId,
        completedVideos: [subSectionId],
      });
      await courseProgress.save();

      // 🚨 FIX 1: User document ke 'courseProgress' array me NAYE document ki ID push karein
      await USER.findByIdAndUpdate(
        userId,
        { $push: { courseProgress: courseProgress._id } },
        { new: true }
      );

    } else {
      // 🚨 FIX 2: { new: true } lagaya hai taaki updated completedVideos array response me mil jaye
      courseProgress = await CourseProgress.findOneAndUpdate(
        { course: courseId, user: userId },
        { $addToSet: { completedVideos: subSectionId } },
        { new: true }
      );
    }

    return res.status(200).json({ 
      success: true, 
      message: "Lecture marked as completed",
      completedVideos: courseProgress.completedVideos // 👈 Frontend state sync ke liye array bhej rahe hain
    });

  } catch (error) {
    console.error("Progress Update Error:", error);
    return res.status(500).json({ success: false, error: error.message || "Internal Server Error" });
  }
};

// 🔴 MARK AS INCOMPLETE (REMOVE PROGRESS)
exports.removeCourseProgress = async (req, res) => {
  const { courseId, subSectionId } = req.body;
  const userId = req.user.userId || req.user.id;

  try {
    if (!courseId || !subSectionId) {
      return res.status(400).json({
        success: false,
        error: "Course ID and SubSection ID are required.",
      });
    }

    // 1. Array me se subSectionId remove ($pull) karein
    const updatedProgress = await CourseProgress.findOneAndUpdate(
      { course: courseId, user: userId },
      { $pull: { completedVideos: subSectionId } },
      { new: true } // 👈 Updated document return karega
    );

    if (!updatedProgress) {
      return res.status(404).json({
        success: false,
        message: "Progress record not found",
      });
    }

    // 2. Updated completedVideos array response me bhej rahe hain
    return res.status(200).json({ 
      success: true, 
      message: "Lecture marked as incomplete",
      completedVideos: updatedProgress.completedVideos // 👈 Frontend Redux/State updates me easily use ho sake
    });

  } catch (error) {
    console.error("Progress Remove Error:", error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};


const Rating = require("../Models/rating"); // Aap apne schema ka sahi path dena



exports.createRating = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id; 
        const { courseId, rating, review } = req.body;

        if (!courseId || !rating || !review) {
            return res.status(400).json({
                success: false,
                message: "All fields (courseId, rating, review) are required!"
            });
        }

        // Optional: Check if user is enrolled
        const courseDetails = await COURSE.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in this course"
            });
        }

        // Check if user has already reviewed this course
        const alreadyReviewed = await Rating.findOne({
            userId: userId,
            courseId: courseId
        });

        if (alreadyReviewed) {
            alreadyReviewed.rating = rating;
            alreadyReviewed.review = review;
            await alreadyReviewed.save();

            // 🔥 Ensure course array also contains this rating ID (using $addToSet to avoid duplicates)
            await COURSE.findByIdAndUpdate(courseId, {
                $addToSet: { ratings: alreadyReviewed._id }
            });

            const updatedPopulated = await Rating.findById(alreadyReviewed._id).populate("userId", "firstName lastName");

            return res.status(200).json({
                success: true,
                message: "Rating and review updated successfully!",
                data: updatedPopulated || alreadyReviewed
            });
        }

        // Create a new rating entry
        const newRating = await Rating.create({
            userId,
            courseId,
            rating,
            review
        });

        // 🔥 Add this rating to the Course's ratingAndReviews array using $addToSet (safe alternative to $push)
        await COURSE.findByIdAndUpdate(courseId, {
            $addToSet: { ratings: newRating._id }
        }, { returnDocument: 'after' });

        const populatedRating = await Rating.findById(newRating._id).populate("userId", "firstName lastName");

        return res.status(201).json({
            success: true,
            message: "Rating and review created successfully! ⭐",
            data: populatedRating || newRating
        });

    } catch (error) {
        console.error("Error in createRating controller:", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error while creating rating",
            error: error.message
        });
    }
};


// Get All Ratings with Populate & Latest First Sorting
exports.getAllRatings = async (req, res) => {
    try {
        const ratings = await Rating.find({})
            .populate({
                path: "userId",
                select: "firstName lastName email image" // Jo fields aapko user ki chahiyein
            })
            .populate({
                path: "courseId",
                select: "courseName thumbnail price" // Jo fields course ki chahiyein
            })
            .sort({ _id: -1 }); // MongoDB _id se latest records sabse upar aa jayenge (agar createdAt field nahi hai toh _id best hai)

        res.status(200).json({
            success: true,
            message: "Ratings fetched successfully",
            count: ratings.length,
            data: ratings
        });
    } catch (error) {
        console.error("Error fetching ratings:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch ratings",
            error: error.message
        });
    }
};


exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        // 1. Check karein ki course exist karta hai ya nahi
        const course = await COURSE.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        // 2. Is course se jude saare reviews & ratings ko delete karein
        if (course.ratings && course.ratings.length > 0) {
            await Rating.deleteMany({ _id: { $in: course.ratings } });
        }

        // 3. Students ke enrolledCourses array se is course ko remove karein
        await USER.updateMany(
            { enrolledCourses: courseId },
            { $pull: { enrolledCourses: courseId } }
        );

        // 4. Instructor ke courses array se bhi course ID remove karein (agar applicable ho)
        if (course.instructor) {
            await USER.findByIdAndUpdate(course.instructor, {
                $pull: { courses: courseId },
            });
        }

        // 5. Aakhir me Course ko khud database se delete kar dein
        await COURSE.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course and all related progress/reviews deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting course completely:", error);
        return res.status(500).json({
            success: false,
            message: "Failed to delete course and related data",
            error: error.message,
        });
    }
};