const jwt = require("jsonwebtoken");
const User = require("../models/user");
const StatusCode = require("../utils/statusCode");

class AuthMiddleware {

  static async verifyToken(req, res, next) {
    try {
      const token = req.headers.authorization;
      if (!token || !token.startsWith("Bearer")) {
        return res.status(StatusCode.UNAUTHORISED).json({
          success: false,
          message: "No token provided",
        });
      }

      const cleanToken = token.split(" ")[1];

      const decoded = jwt.verify(cleanToken, process.env.ACCESS_TOKEN);
      const user = await User.findById(decoded.id);

      if (!user) {
        return res.status(StatusCode.UNAUTHORISED).json({
          success: false,
          message: "User not found",
        });
      }

      req.user = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      };

      next();
    } catch (error) {
      return res.status(StatusCode.UNAUTHORISED).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
  }
}


module.exports = AuthMiddleware;
