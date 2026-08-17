const express = require("express");
const router = express.Router();
const Validation = require("../../validate/index");
const UserSchemaValidation = require("../../validate/userSchema");
const authController = require("../../controller/APIs/authController");
const AuthMiddleware = require("../../middleware/authMiddleware");

router.post(
  "/signup",
  Validation.validate(UserSchemaValidation.signup),
  authController.signup,
);
router.post("/verify", authController.verify);
router.post(
  "/login",
  Validation.validate(UserSchemaValidation.login),
  authController.login,
);
router.get("/dashboard", AuthMiddleware.verifyToken, authController.dashboard);

router.post("/refresh-token", authController.refreshToken);
router.post("/logout", AuthMiddleware.verifyToken, authController.logout);

module.exports = router;
