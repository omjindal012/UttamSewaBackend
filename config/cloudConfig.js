const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRECT_KEY,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Uttam_sewa_Users_images",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

const userIssueStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Uttam_sewa_User_Issues",
    allowedFormats: ["png", "jpg", "jpeg"],
  },
});

module.exports = {
  cloudinary,
  storage,
  userIssueStorage,
};
