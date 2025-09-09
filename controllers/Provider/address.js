const Address = require("../../models/Address");

exports.saveAddress = async (req, res) => {
  try {
    const { address, city, state, country, zip_code } = req.body;

    if (!address || !city || !state || !country || !zip_code) {
      return res
        .status(400)
        .json({ error: "All address fields are required." });
    }

    const newAddress = new Address({
      address,
      city,
      state,
      country,
      zip_code,
    });

    const savedAddress = await newAddress.save();

    res.status(201).json({
      message: "Address created successfully",
      address_id: savedAddress._id,
    });
  } catch (error) {
    console.error("Create Address Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.getAddress = async (req, res) => {
  try {
    const { address_id } = req.query;

    if (!address_id) {
      return res.status(400).json({ message: "address_id is required" });
    }

    const address = await Address.findById(address_id);

    if (!address) {
      return res.status(404).json({ message: "Address not found" });
    }

    const composed = `${address.address}, ${address.city}, ${address.state}, ${address.country} - ${address.zip_code}`;

    res.status(200).json({ composed });
  } catch (error) {
    console.error("Get address error:", error);
    res
      .status(500)
      .json({ message: "Failed to fetch address", error: error.message });
  }
};
