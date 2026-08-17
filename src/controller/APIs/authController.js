const User = require("../../models/user");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const StatusCode = require("../../utils/statusCode");
const verifyEmailOTP = require("../../utils/sendMail");
const Otp = require("../../models/otp");

class AuthController {
  async signup(req, res) {
    // console.log(req.body);

    try {
      const { name, email, phone, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "User already exists",
        });
      }

      //Password hashing:
      const salt = 10;
      const hasedPassword = await bcryptjs.hash(password, salt);
      const data = new User({
        name: name,
        email: email,
        phone: phone,
        password: hasedPassword,
      });

      const user = await data.save();
      await verifyEmailOTP(req, user);

      return res.status(StatusCode.OK).json({
        success: true,
        message:
          "User created successfully and OTP send for email verification",
        // data: user,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async verify(req, res) {
    try {
      const { email, otp } = req.body;
      // Check if all required fields are provided
      if (!email || !otp) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ status: false, message: "All fields are required" });
      }
      const existingUser = await User.findOne({ email });

      // Check if email doesn't exists
      if (!existingUser) {
        return res
          .status(StatusCode.NOT_FOUND)
          .json({ status: "failed", message: "User doesn't exists" });
      }

      // Check if email is already verified
      if (existingUser.isVerified) {
        return res
          .status(StatusCode.BAD_REQUEST)
          .json({ status: false, message: "Email is already verified" });
      }
      // Check if there is a matching email verification OTP
      const emailVerification = await Otp.findOne({
        userId: existingUser._id,
        otp,
      });

      if (!emailVerification) {

        if (!existingUser.isVerified) {
          // console.log(existingUser);
          await verifyEmailOTP(req, existingUser);

          return res.status(StatusCode.BAD_REQUEST).json({
            status: false,
            message: "Invalid OTP, new OTP sent to your email",
          });
        }

        return res.status(StatusCode.BAD_REQUEST).json({ status: false, message: "Invalid OTP" });
      }

      // Check if OTP is expired
      const currentTime = new Date();
      // 10 * 60 * 1000 calculates the expiration period in milliseconds(10 minutes).
      const expirationTime = new Date(
        emailVerification.createdAt.getTime() + 10 * 60 * 1000,
      );

      if (currentTime > expirationTime) {
        // OTP expired, send new OTP
        await verifyEmailOTP(req, existingUser);
        return res.status(StatusCode.BAD_REQUEST).json({
          status: "failed",
          message: "OTP expired, new OTP sent to your email",
        });
      }
      // OTP is valid and not expired, mark email as verified
      existingUser.isVerified = true;
      await existingUser.save();

      // Delete email verification document
      await Otp.deleteMany({ userId: existingUser._id });
      return res
        .status(StatusCode.OK)
        .json({ status: true, message: "Email verified successfully" });
    } catch (error) {
      console.error(error);
      res.status(StatusCode.SERVER_ERROR).json({
        status: false,
        message: "Unable to verify email, please try again later",
      });
    }
  }

  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(StatusCode.UNAUTHORISED).json({
          success: false,
          message: "Refresh token required",
        });
      }

      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);

      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(StatusCode.UNAUTHORISED).json({
          success: false,
          message: "Invalid refresh token",
        });
      }

      if (user.refreshToken !== refreshToken) {
        return res.status(StatusCode.UNAUTHORISED).json({
          success: false,
          message: "Invalid Refresh Token",
        });
      }

      const newAccessToken = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        process.env.ACCESS_TOKEN,
        {
          expiresIn: "15m",
        },
      );

      return res.json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (error) {
      return res.status(401).json({
        success: false,
        message: "Refresh Token Expired",
      });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not found",
        });
      }

      const isMatch = await bcryptjs.compare(password, user.password);

      if (!isMatch) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Invalid credentials",
        });
      }

      if (!user.isVerified) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Please verify your email",
        });
      }

      if (isMatch && user.role === "User") {
        // Access token:
        const accessToken = jwt.sign(
          {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          process.env.ACCESS_TOKEN,
          { expiresIn: "10m" },
        );

        // Refresh token:
        const refreshToken = jwt.sign(
          {
            id: user._id,
          },
          process.env.REFRESH_TOKEN,
          {
            expiresIn: "7d",
          },
        );

        user.refreshToken = refreshToken;
        await user.save();

        return res.status(StatusCode.OK).json({
          success: true,
          message: "User Login Successful",
          accessToken,
          refreshToken,
          data: {
            id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role,
          },
          // token: token,
        });
      } else {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "Only User can login",
        });
      }
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async dashboard(req, res) {
    try {
      return res.status(StatusCode.OK).json({
        success: true,
        message: "Welcome to dashboard",
        user: req.user,
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }

  async logout(req, res) {
    try {
      const user = await User.findById(req.user.id);

      if (!user) {
        return res.status(StatusCode.BAD_REQUEST).json({
          success: false,
          message: "User not found",
        });
      }

      user.refreshToken = null;
      await user.save();

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Logout Successful",
      });
    } catch (error) {
      return res.status(StatusCode.SERVER_ERROR).json({
        success: false,
        message: error.message,
      });
    }
  }
}

module.exports = new AuthController();
