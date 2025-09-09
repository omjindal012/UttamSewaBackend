const Category = require("../../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error.message);
    res
      .status(500)
      .json({ message: "Server Error: Unable to fetch categories." });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const { category_id } = req.query;

    if (!category_id) {
      return res.status(400).json({ message: "category_id is required" });
    }

    const category = await Category.findById(category_id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error("Error fetching category:", error.message);
    res.status(500).json({ message: "Unable to fetch category." });
  }
};
