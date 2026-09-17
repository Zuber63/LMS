const COURSE = require("../Models/course");
const SECTION = require("../Models/section");
const SUBSECTION = require("../Models/subsection");

exports.createSection = async (req, res) => {
  try {
    const { courseId, title } = req.body;

    if (!courseId || !title) {
      return res.status(400).json({
        success: false,
        message: "CourseId and Title are required",
      });
    }

    const course = await COURSE.findById(courseId);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    const newSection = await SECTION.create({
      title,
    });

    await COURSE.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );

    return res.status(201).json({
      success: true,
      message: "Section created successfully",
      data: newSection,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

    exports.updateSection = async (req, res) => {
    try {
        const { sectionId, title } = req.body;
        if (!sectionId || !title) {
            return res.status(400).json({ success: false, message: "Missing required fields" });
        }

        const updatedSection = await SECTION.findByIdAndUpdate(
            sectionId,
            { title },
            { new: true }
        );

        if (!updatedSection) {
            return res.status(404).json({ success: false, message: "Section not found" });
        }

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section: updatedSection
        });
    } catch (error) {
        console.error("Error occurred while updating section:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;
    if (!sectionId || !courseId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }
const updatedCourse = await COURSE.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

const section =await SECTION.findById(sectionId);
    if (!section) {
      return res.status(404).json({ success: false, message: "Section not found" });
    }
    await SECTION.deleteMany({sectionId: { $in: section.subsections } });
await SECTION.findByIdAndDelete(sectionId); 


const updatedCourseAfterDeletion = await COURSE.findById(courseId).populate({
    path: "courseContent",
    populate: {
        path: "subsections"
    }
}).exec();
return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      course: updatedCourseAfterDeletion
    });


  } catch (error) {
    console.error("Error occurred while deleting section:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};





