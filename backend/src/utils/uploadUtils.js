const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadFolder = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadFolder)) fs.mkdirSync(uploadFolder);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

async function uploadImage(file) {
  // For now, just return relative path
  return `/uploads/${file.filename}`;
}

module.exports = { upload, uploadImage };
