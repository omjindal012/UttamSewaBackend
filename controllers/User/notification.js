const Notification = require("../../models/Notification");

exports.getNotifications = async (req, res) => {
  try {
    const user_id = req.query.user_id;
    if (!user_id) {
      return res
        .status(400)
        .json({ success: false, message: "Provider ID is required" });
    }
    const notifications = await Notification.find({ user_id }).sort({
      created_at: -1,
    });
    res.json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
