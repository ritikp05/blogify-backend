const becrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
async function registerController(req, res) {
  const { name, password, email } = req.body;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    try {
      const hashedpassword = await becrypt.hash(password, 10);
      const user = await User.create({
        name,
        email,
        password: hashedpassword,
      });

      const userWithoutPassword = await User.findOne(
        { _id: user._id },
        "-password"
      );

      res.json({
        msg: "User registered Sucessfully",
        user: userWithoutPassword,
      });
    } catch (err) {
      return res.json({
        msg: err.message,
      });
    }
  }
}

async function loginController(req, res) {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
    return  res.status(400).json({
        msg: "Not an existing user ,register first",
      });
    }
    const user = {
      _id: existingUser._id,
      name: existingUser.name,
      email: existingUser.email,
    };

    const pass = await becrypt.compare(password, existingUser.password);
    if (!pass) {
      return res.status(403).json({
        msg: "invalid password",
      });
    }
    const token = await jwt.sign({ existingUser }, "secret");

    if (token) {
      return res.status(200).json({
        msg: "Login sucessfull",
        token,
        user: user,
      });
    }
  } catch (err) {
   return res.status(403).json({
      msg: err.message,
    });
  }
}

async function updatePasswordController(req, res) {
  const { password, confirmPassword } = req.body;
  const _id = req.user._id;
  try {
    if (password === confirmPassword) {
      const hashedPassword = await becrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(_id, {
        password: hashedPassword,
      });

      if (user) {
        res.json({
          msg: "Password changed successfully",
        });
      } else {
        res.status(404).json({
          msg: "User not found",
        });
      }
    } else {
      res.status(400).json({
        msg: "Passwords do not match",
      });
    }
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
}

async function forgotPasswordController(req, res) {
  const { email } = req.body;
  const user = await User.findById(req.user._id);
  if (user.email === email) {
  } else {
    res.json({
      msg: "Email not found",
    });
  }
}

module.exports = {
  registerController,
  loginController,
  updatePasswordController,
  forgotPasswordController,
};
