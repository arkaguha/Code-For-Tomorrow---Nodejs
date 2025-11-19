const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const sendMail = require("../helpers/sendMail");

exports.apiTest = (req, res) => {
  res.json({ message: "Working." });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    const passCheck = await bcrypt.compare(password, user.password);
    // console.log(passCheck);

    if (!user) return res.json({ message: "User not registered or invalid " });
    if (!passCheck) return res.json({ message: "invalid password" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "5m",
    });

    return res.json({ token: `${token}` });
  } catch (error) {
    console.log(`Error from post Login: ${error}`);
  }
};

exports.postSignup = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  let hashPass;

  try {
    const user = await User.findOne({ email });
    if (user) return res.json({ message: "User already registered." });
    else {
      const hashPass = await bcrypt.hash(password, 10);
      const newUser = new User({
        firstName,
        lastName,
        email,
        password: hashPass,
      });
      newUser.save();
      res.json(newUser);
    }
  } catch (error) {
    console.log(`Error from post Signup: ${error}`);
  }
};

exports.getUserInfo = async (req, res) => {
  const id = req.params.id;
  let userInfo;
  try {
    userInfo = await User.findById(id);
  } catch (error) {
    console.log(error);
  }
  res.json({
    firstName: userInfo.firstName,
    LastName: userInfo.lastName,
    email: userInfo.email,
  });
};

exports.postForgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.json({ message: "User not found" });

    const rawToken = Math.random().toString(36).substring(2, 10);
    user.resetToken = rawToken;
    user.resetTokenExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    const resetLink = `http://localhost:5173/user/password/${rawToken}`;

    await sendMail(
      user.email,
      "Password Reset",
      `Your password reset link: ${resetLink}`
    );

    res.json({ message: `Reset link sent to ${user.email}` });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error sending reset link" });
  }
};

exports.postPasswordReset = async (req, res) => {
  try {
    const { resetToken } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetToken,
      resetTokenExpiry: { $gt: Date.now() },
    });

    if (!user) {
      return res.json({ message: "Invalid token" });
    }

    // Update password
    // await bcrypt.hash(password, 10, (error, result) => {
    //   if (error) {
    //     return res.json({ message: "passwords dont match" });
    //   } else  = result;
    // });
    user.password = await bcrypt.hash(password, 10);
    console.log(user.password);

    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;

    await user.save();

    res.json({ message: "Password successfully updated" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error resetting password" });
  }
};
