const Review = require("../../models/Review");

exports.getReview = async (req, res) => {
  try {
    const provider_id = req.query.provider_id;
    if (!provider_id) {
      return res
        .status(400)
        .json({ success: false, message: "Provider ID is required" });
    }

    const reviews = await Review.find({ provider_id }).sort({
      created_at: -1,
    });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
