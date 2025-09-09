const Provider = require("../../models/Provider");
const Token = require("../../models/Token");

exports.updateProvider = async (req, res) => {
  const { _id } = req.body;

  if (!_id) {
    return res.status(400).json({ error: "Provider ID (_id) is required" });
  }

  try {
    let provider = await Provider.findById(_id);
    if (!provider) {
      return res.status(404).json({ error: "Provider not found" });
    }

    for (let key in req.body) {
      if (key !== "_id") {
        provider[key] = req.body[key];
      }
    }

    if (req.files?.aadhar?.[0]?.path) {
      provider.aadhar = req.files.aadhar[0].path;
    }

    if (req.files?.profile_pic_url?.[0]?.path) {
      provider.profile_pic_url = req.files.profile_pic_url[0].path;
    }

    await provider.save();

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
