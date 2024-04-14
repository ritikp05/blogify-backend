const fs = require("fs");
const cloudinary = require("../helper/cloudinaryConfig");

async function imageupload(req, res, next) {
  try {
    if(!(req.file.mimetype ==="image/png" || req.file.mimetype=== "image/jpeg")){
      return res.json({ msg: "please upload an image" });
    
    }
    const result = await cloudinary.uploader.upload(req.file.path);
    if (result) {
      
     req.body.image = result.secure_url;
    }
    fs.unlink(req.file.path, function (err) {
      if (err) {
        console.log("err");
      }
    });

    next();
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
}

module.exports = imageupload;
