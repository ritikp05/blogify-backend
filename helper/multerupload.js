const multer=require("multer");

const data=multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + file.originalname);
  },


})

const upload=multer({storage:data})

module.exports = upload;