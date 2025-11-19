const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
// const nodemailer = require("nodemailer");
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

    if (!user || passCheck)
      return res.json({ message: "User not registered or invalid " });
    else {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "5m",
      });

      return res.json({ token: `${token}` });
    }
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
      await bcrypt.hash(password, 10, (error, result) => {
        if (error) {
          return res.json({ message: "passwords dont match" });
        } else hashPass = result;
        // console.log(typeof hashPass);
        const newUser = new User({
          firstName,
          lastName,
          email,
          password: hashPass,
        });
        newUser.save();
        res.json(newUser);
      });
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
  return res.json({
    firstName: userInfo.firstName,
    LastName: userInfo.lastName,
    email: userInfo.email,
  });
};

exports.postPasswordReset = async (req, res) => {
  const { token } = req.params;
};

exports.postForgetPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "user not found" });

  const token = "placeholder";
  user.resetToken = token;
  await user.save();

  const resetLink = `http:localhost:5173/user/password/${token}`;
  await sendMail(
    user.email,
    "Pasword Reset",
    `Link to reset the password: ${resetLink}`
  );

  res.json({ message: `Link sent at ${user.email}` });
};
