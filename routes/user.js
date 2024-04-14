const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const otpgenrator=require("../middleware/otpgenrator")
const {
  registerController,
  loginController,
  updatePasswordController,
forgotPasswordController,sendMailController,resetPasswordController} = require("../controller/authController");

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/updatepassword", verifyToken, updatePasswordController);
router.put("/forgetpassword",verifyToken, forgotPasswordController);
router.post("/sendmail",otpgenrator,sendMailController);
router.put("/resetpassword",resetPasswordController);
module.exports = router;
