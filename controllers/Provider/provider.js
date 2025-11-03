const Provider = require("../../models/Provider");
const Token = require("../../models/Token");

exports.updateProvider = async (req, res) => {
  const { _id, latitude, longitude, ...updateData } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Provider ID (_id) is required" });
  }

  try {
    if (req.files?.aadhar?.[0]?.path) {
      updateData.aadhar = req.files.aadhar[0].path;
    }

    if (req.files?.profile_pic_url?.[0]?.path) {
      updateData.profile_pic_url = req.files.profile_pic_url[0].path;
    }

    if (latitude && longitude) {
      updateData.location = {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      };
    }

    const provider = await Provider.findByIdAndUpdate(
      _id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    res.status(200).json({
      message: "Provider updated successfully",
      provider,
    });
  } catch (err) {
    console.error("Update Provider Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

exports.getProvider = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Provider ID is required." });
    }

    const provider = await Provider.findById(id)
      .populate("address_id")
      .populate("shop_address_id");

    if (!provider) {
      return res.status(404).json({ error: "Provider not found." });
    }

    res.status(200).json({
      message: "Provider fetched successfully",
      provider,
    });
  } catch (error) {
    console.error("Get Provider Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.logout = async (req, res) => {
  const { refreshToken } = req.body;

  await Token.deleteOne({ refreshToken });

  res.json({ message: "Logged out" });
};
