const Address = require("../../models/Address");
const User = require("../../models/User");

exports.saveAddress = async (req, res) => {
  const { user_id, address, city, state, country, zip_code } = req.body;

  if (!user_id || !address || !city || !state || !country || !zip_code) {
    return res.status(400).json({ message: "Required fields are missing" });
  }

  try {
    const newAddress = await Address.create({
      address,
      city,
      state,
      country,
      zip_code,
    });

    const user = await User.findById(user_id);

    if (!user) {
      await Address.findByIdAndDelete(newAddress._id);
      return res.status(404).json({ message: "User not found" });
    }

    user.addresses.push(newAddress._id);

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
    const { userId } = req.body;

    const user = await User.findById(userId).populate({
      path: "addresses",
      options: { sort: { created_at: -1 } },
    });

    if (!user || user.addresses.length === 0) {
      return res
        .status(404)
        .json({ message: "No addresses found for this user" });
    }

    const mostRecentAddress = user.addresses[0];

    const { address, city, state, country, zip_code } = mostRecentAddress;
    const composed = `${address}, ${city}, ${state}, ${zip_code}, ${country}`;

    res.status(200).json({
      composed,
      data: mostRecentAddress,
      all_addresses: user.addresses,
    });
  } catch (error) {
    console.error("Fetch address error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
