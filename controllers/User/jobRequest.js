const JobRequest = require("../../models/jobRequest");

exports.createJobRequest = async (req, res) => {
  try {
    const { serviceName, location, description } = req.body;

    if (!serviceName || !location || !description) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRequest = new JobRequest({
      serviceName,
      location,
      description,
    });

    await newRequest.save();

    res
      .status(201)
      .json({ message: "Job request created successfully", data: newRequest });
  } catch (error) {
    console.error("Error creating job request:", error);
    res.status(500).json({ message: "Server error" });
  }
};
