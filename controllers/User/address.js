const Address = require("../../models/Address");
const User = require("../../models/User");

exports.saveAddress = async (req, res) => {
  const { user_id, address, city, state, country, zip_code } = req.body;

  if (!user_id || !address || !city || !state || !country || !zip_code) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const newAddress = await Address.create({
      address,
      city,
      state,
      country,
      zip_code,
    });
    user.addresses_id.push(newAddress._id);
    await user.save();
    res.status(201).json({
      message: "Address saved successfully and linked to user",
      data: newAddress,
    });
  } catch (err) {
    console.error("Save Address Error:", err);
    res.status(500).json({ message: "Error saving address" });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const user = await User.findById(userId).populate({
      path: "addresses",
      options: { sort: { created_at: -1 } },
    });
    if (!user || user.addresses_id.length === 0) {
      return res
        .status(404)
        .json({ message: "No addresses found for this user" });
    }
    const mostRecentAddress = user.addresses_id[0];
    const { address, city, state, country, zip_code } = mostRecentAddress;
    const composed = `${address}, ${city}, ${state}, ${zip_code}, ${country}`;

    res.status(200).json(composed);
  } catch (error) {
    console.error("Fetch address error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
