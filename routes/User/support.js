const express = require("express");
const router = express.Router();
const multer = require("multer");
const { userIssueStorage } = require("../../config/cloudConfig");
const upload = multer({ storage: userIssueStorage });
const {
  createTicket,
  checkTicketId,
} = require("../../controllers/User/support");

router.get("/check/:ticketId", checkTicketId);
router.post("/create", upload.single("attachments"), createTicket);

module.exports = router;
