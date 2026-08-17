const express = require("express");
const router = express.Router();
const Validation = require("../../validate/index");
const UserSchemaValidation = require("../../validate/userSchema");
const adminController = require("../../controller/APIs/adminController");
const AuthMiddleware = require("../../middleware/authMiddleware");

router.post(
  "/login/create",
  Validation.validate(UserSchemaValidation.login),
  adminController.login,
);


router.get(
    "/dashboard", 
    AuthMiddleware.verifyToken, 
    adminController.dashboard
);

module.exports = router;
