const Payment = require("../../models/Payment");

exports.createPayment = async (req, res) => {
  try {
    const { subtotal } = req.body;

    if (!subtotal) {
      return res.status(400).json({
        success: false,
        message: "Subtotal is required.",
      });
    }

    const newPayment = new Payment({
      subtotal,
    });

    const savedPayment = await newPayment.save();

    res.status(201).json(savedPayment);
  } catch (error) {
    console.error("Error creating payment:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create payment.",
      error: error.message,
    });
  }
};
