const multer = require("multer");
const path = require("path");

//multer configs

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    try {
      cb(null, "./public/uploads/");
    } catch (error) {
      console.error("multer error", error);
    }
  },
  filename: function (req, file, cb) {
    cb(
      null,
      path.basename(file.originalname, path.extname(file.originalname)) +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    ); //Appending extension
  },
});
const uploadSingle = multer({ storage: storage }).single("file");
const uploadMultiple = multer({ storage: storage }).fields([
  { name: "attachments" },
]);

module.exports = uploadSingle;
module.exports = uploadMultiple;
