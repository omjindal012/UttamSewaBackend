const Service = require("../../models/Service.js");
const Review = require("../../models/Review");
const Faq = require("../../models/Faq");

exports.getAllServicesByCategory = async (req, res) => {
  const { category_id } = req.query;
  try {
    const services = await Service.find({ category_id });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error.message);
    res.status(500).json({ message: "Unable to fetch services." });
  }
};

exports.getAllEmergencyServices = async (req, res) => {
  try {
    const services = await Service.find({ is_emergency: true });
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching emergency services:", error.message);
    res.status(500).json({ message: "Unable to fetch emergency services." });
  }
};

exports.getServiceReviewFaq = async (req, res) => {
  const { id } = req.params;
  try {
    const reviews = await Review.find({ service_id: id });
    const faqs = await Faq.find({ service_id: id });
    const data = { reviews, faqs };
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching data:", error.message);
    res.status(500).json({ message: "Unable to fetch data." });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching all services:", error.message);
    res.status(500).json({ message: "Unable to fetch services." });
  }
};
