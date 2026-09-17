const COURSE = require("../Models/course");
const SECTION = require("../Models/section");
const SUBSECTION = require("../Models/subsection");
const { uploadVideoToCloudinary } = require("../Utils/videouplode");
const dotenv = require("dotenv");
dotenv.config();

exports.createSubsection = async (req, res) => {
  try {
    console.log(req.body)
    const { title, description, sectionId } = req.body;
    const file = req.files.videoUrl;
    

    if (!title || !description || !sectionId || !file) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const videoUrl = await uploadVideoToCloudinary(
      file,
      process.env.VIDEOS_FOLDER_NAME,
      500,
      80,
    );

    const newSubsection = await SUBSECTION.create({
      title,
      description,
      videoUrl: videoUrl.secure_url,
    });

    const section = await SECTION.findByIdAndUpdate(
      sectionId,
      { $push: { subsections: newSubsection._id } },
      { new: true },
    );

    return res.status(201).json({
      success: true,
      message: "Subsection created successfully",
      subsection: newSubsection,
      section: section,
    });
  } catch (error) {
    console.error("Error occurred while creating subsection:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSubsection = async (req, res) => {
  try {
    const { subsectionId, sectionId } = req.body;
    if (!subsectionId || !sectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const deletedSubsection = await SUBSECTION.findByIdAndDelete(subsectionId);
    if (!deletedSubsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    const section = await SECTION.findByIdAndUpdate(
      sectionId,
      { $pull: { subsections: subsectionId } },
      { new: true },
    );

    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
      section: section,
    });
  } catch (error) {
    console.error("Error occurred while deleting subsection:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSubsection = async (req, res) => {
  try {
    const { subSectionId, title, description } = req.body;

    const subsection = await SUBSECTION.findById(subSectionId);
    if (!subsection) {
      return res.status(404).json({
        success: false,
        message: "Subsection not found",
      });
    }

    if (title !== undefined) {
      subsection.title = title;
    }
    if (description !== undefined) {
      subsection.description = description;
    }

    if (req.files && req.files.file !== undefined) {
      const file = req.files.file;
      const videoUrl = await uploadVideoToCloudinary(
        file,
        process.env.VIDEOS_FOLDER_NAME,
        500,
        80,
      );
      subsection.videoUrl = videoUrl.secure_url;
    }
    const updatedSubsection = await subsection.save();

    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      subsection: updatedSubsection,
    });
  } catch (error) {
    console.error("Error occurred while updating subsection:", error);
    return res
      .status(500)
      .json({
        success: false,
        message: "Error occurred while updating subsection" + error.message,
      });
  }
};
