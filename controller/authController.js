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
      res.json({
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
      res.json({
        msg: "invalid password",
      });
    }
    const token = await jwt.sign({ existingUser }, "secret");
    return res.json({
      msg: "Login sucessfull",
      token,
      user: user,
    });
  } catch (err) {
    res.json({
      msg: err.message,
    });
  }
}

async function updatePasswordController(req, res) {
  const { password, confirmpassword } = req.body;
  const id = req.user._id;
  try {
    if (password == confirmpassword) {
      const hashedpassword = await becrypt.hash(password, 10);

      const user = await User.findByIdAndUpdate(id, {
        password:hashedpassword,
      });

      if (user) {
        res.json({
          msg: "Password changed Sucessfully",
        });
      }
    }
    else{
      res.json({
        msg: "Passwords do not match",
      });
    }
  } catch (err) {
    res.json({ msg: err.message });
  }
}

async function forgotPasswordController(req, res) {
  const { email } = req.body;
}

module.exports = {
  registerController,
  loginController,
  updatePasswordController,
  forgotPasswordController,
};
