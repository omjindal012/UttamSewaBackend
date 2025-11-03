const { Ticket } = require("../../models/Ticket");

const createTicket = async (req, res) => {
  try {
    const { user_id, category, job_id, issue, ticket_id } = req.body;
    let attachments = [];
    if (req.file) {
      attachments.push(req.file.path);
    }
    const ticket = new Ticket({
      user_id,
      category,
      job_id,
      issue,
      ticket_id,
      attachments,
    });
    await ticket.save();
    return res.status(201).json({ success: true, ticket });
  } catch (error) {
    console.error("Error creating ticket:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

const checkTicketId = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const ticket = await Ticket.findOne({ ticketId });
    if (ticket) {
      return res.json({ isUnique: false });
    } else {
      return res.json({ isUnique: true });
    }
  } catch (error) {
    console.error("Error checking ticket ID:", error);
    return res
      .status(500)
      .json({ message: "Server Error", error: error.message });
  }
};

module.exports = {
  createTicket,
  checkTicketId,
};
