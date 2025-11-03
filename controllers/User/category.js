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
