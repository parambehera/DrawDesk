const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/generateTokens");
const crypto = require("crypto");
const nodemailer = require("nodemailer");

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    res.json({ message: "User registered" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    // 🔥 Store this specific refreshToken in DB
    user.refreshToken = refreshToken;
    await user.save();

    // Return only name, email and refreshToken
    res.json({
      user: { name: user.name, email: user.email },
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// REFRESH TOKEN
exports.refresh = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken)
    return res.status(401).json({ message: "No refresh token provided" });

  // 🔥 Check if this refresh token exists in DB
  const user = await User.findOne({ refreshToken });
  if (!user)
    return res.status(403).json({ message: "Refresh token not recognized" });

  // 🔥 Verify refresh token signature + expiration
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    // Create new access token
    const accessToken = generateAccessToken(user);

    res.json({ accessToken });
  });
};

// FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).json({ message: "Email not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    // console.log(req.body.email);
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
     const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
     
    await transporter.sendMail({
      from: "Whiteboard App <no-reply@whiteboard.com>",
      to: req.body.email,
      subject: "Reset Your Password",
      html: `
      <p>Click the link below to reset your password:</p>
      <a href="${resetLink}">Reset Password</a>
      <p>This link is valid for 15 minutes.</p>
    `,
    });


    res.json({
      message: "Reset link generated",
      resetLink: `${process.env.FRONTEND_URL}/reset-password/${resetToken}`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// RESET PASSWORD
exports.resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() },
    });

    if (!user) return res.status(400).json({ message: "Invalid token" });

    const hashed = await bcrypt.hash(req.body.password, 10);

    user.password = hashed;
    user.resetToken = null;
    user.resetTokenExpire = null;
    await user.save();

    res.json({ message: "Password updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ME - return current user's details (protected route)
exports.me = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId).select("name email refreshToken");
    if (!user) return res.status(404).json({ message: "User not found" });

    // Only return name, email and refreshToken
    res.json({
      user: { name: user.name, email: user.email },
      refreshToken: user.refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
