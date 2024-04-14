const fs = require("fs");
const cloudinary = require("../helper/cloudinaryConfig");

async function imageupdate(req, res, next) {
  try {
    if (
      !(req.file.mimetype === "image/png" || req.file.mimetype === "image/jpeg")
    ) {
      return res.json({ msg: "please upload an image" });
    }
    if (!req?.file?.path || req?.file?.path == undefined) {
      return next();
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    if (result) {
      req.body.image = result.secure_url;
    }
    fs.unlink(req.file.path, function (err) {
      if (err) {
        console.log("err");
      }
      console.log("successfully deleted");
    });

    next();
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
}

module.exports = imageupdate;
