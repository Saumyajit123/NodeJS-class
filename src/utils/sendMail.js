const transporter = require("../config/mailconfig");
const Otp = require("../models/otp");

const verifyEmailOtp = async (req, user) => {
  
  // Delete previous OTPs for this user
  await Otp.deleteMany({
    userId: user._id,
  });

  // Generate a random 6-digit number
  const otp = Math.floor(100000 + Math.random() * 900000);

  // Save otp in Database
  const dataotp = await new Otp({ userId: user._id, otp: otp }).save();

  // OTP verification Link:
  // const otpVerificationLink = `${process.env.FRONTEND_HOST}/account/verify-email`;

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: user.email,
    subject: "OTP - Verify your account",
    text: "",
    html: `<p>Dear ${user.name},</p><p>Thank you for signing up with our website. To complete your registration, please verify your email address by entering the following one-time password (OTP)</p>
    <h2 style="text-align: center; background-color: #a61616ff; padding: 10px;">OTP: ${otp}</h2>
    <p>This OTP is valid for 10 minutes. If you didn't request this OTP, please ignore this email.</p>`,
  });

  return otp;
};

module.exports = verifyEmailOtp;
