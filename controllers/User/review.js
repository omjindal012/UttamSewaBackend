const Service = require("../../models/Service.js");
const Review = require("../../models/Review.js");
const User = require("../../models/User.js");

exports.Addreview = async (req, res) => {
  try {
    const { user_id, service_name, rating, comment, provider_id } = req.body;

    if (
      !user_id ||
      !service_name ||
      !rating
      // || !provider_id
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const service = await Service.findOne({ name: service_name });
    if (!service) {
      return res.status(404).json({ message: "Service not found" });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newReview = new Review({
      rating,
      comment: comment || "",
      image_url: user.profile_pic_url || "",
      user_name: user.name || "Anonymous",
      service_id: service._id,
      provider_id: provider_id,
    });

    await newReview.save();

    return res
      .status(200)
      .json({ message: "Review added successfully", review: newReview });
  } catch (error) {
    console.error("Addreview error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
