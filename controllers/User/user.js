const User = require("../../models/User");

exports.updateUserById = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    Object.keys(req.body).forEach((key) => {
      user[key] = req.body[key];
    });

    if (req.file && req.file.path) {
      user.profile_pic_url = req.file.path;
    }

    await user.save();
    res.status(200).json({
      message: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error("Update User Error:", err);
    res.status(500).json({ error: "Server error: " + err.message });
  }
};

// Get user by phone number
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
