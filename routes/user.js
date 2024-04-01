const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
  registerController,
  loginController,
  updatePasswordController,
forgotPasswordController} = require("../controller/authController");

router.post("/register", registerController);
router.post("/login", loginController);
router.put("/updatepassword", verifyToken, updatePasswordController);
router.put("/forgetpassword",verifyToken, forgotPasswordController);
module.exports = router;
