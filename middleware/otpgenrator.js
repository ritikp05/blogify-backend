const User = require("../model/user");
const Otp = require("../model/opt");

async function optGenerator(req, res, next) {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Invalid Email" });
    }

    const randomNo = Math.floor(Math.random() * 1000000);

    const otp = await Otp.findOneAndUpdate(
      { email },
      {
        otp: randomNo,
        time: Date.now() + 60 * 1000 * 2.1,
      },
      { upsert: true, new: true }
    );

    req.body.otp = randomNo;
    next();
  } catch (err) {
    res.status(400).json({
      msg: err.message,
    });
  }
}

module.exports = optGenerator;
