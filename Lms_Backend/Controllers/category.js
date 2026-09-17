const CATEGORY = require("../Models/category");

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Category name and description are required"
      });
    }

    const newCategory = await CATEGORY.create({
      name,
      description
    });

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      category: newCategory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }

};