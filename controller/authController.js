const becrypt = require("bcryptjs");
const User = require("../model/user");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const Otp = require("../model/opt");
const dotenv = require("dotenv");
dotenv.config();
async function registerController(req, res) {
  const { name, password, email } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      msg: "User already exists",
    });
  }
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

      res.status(200).json({
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
      return res.status(400).json({
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

async function sendMailController(req, res) {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
      },
    });

    const mailOptions = {
      from: '"Ritik pandey" <kushagarakp10@gmail.com>',
      to: req.body.email,
      subject: "Otp for Reseting password",
      text: "otp",
      html: `<b>Your otp is ${req.body.otp} and it is valid for 2 minutes</b>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        res.status(403).json({
          msg: err.message,
        });
      }

      res.json({
        msg: info,
      });
    });
  } catch (e) {
    res.status(403).json({
      msg: e.message,
    });
  }
}

async function resetPasswordController(req, res) {
  const { otp, email, password } = req.body;
  try {
    if (!(otp && email && password)) {
      return res.status(403).json({ msg: "Plese provide all required fields" });
    }

    const user = await Otp.findOne({ email });
    if (!user) {
      return res.status(403).json({ msg: "Invalid email address" });
    }
    if (otp == user.otp) {
      if (email == user.email) {
        const time = Date.now();
        if (time > user.time) {
          return res.status(403).json({ msg: "Otp expired " });
        }
        const hashedpassword = await becrypt.hash(password, 10);
        const Updateduser = await User.findOneAndUpdate(
          {
            email: email,
          },
          {
            password: hashedpassword,
          }
        );
        if (Updateduser) {
          res.status(200).json({ msg: "Password changed successfully" });
        }
      }
    } else {
      res.status(403).json({ msg: "Invalid otp" });
    }
  } catch (err) {
    res.status(404).json({ msg: err.message });
  }
}
module.exports = {
  registerController,
  loginController,
  updatePasswordController,
  forgotPasswordController,
  sendMailController,
  resetPasswordController,
};
