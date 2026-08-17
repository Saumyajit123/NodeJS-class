const express = require("express");
const router = express.Router();
const Validation = require("../../validate/index");
const UserSchemaValidation = require("../../validate/userSchema");
const teacherController = require("../../controller/APIs/teacherController");
const AuthMiddleware = require("../../middleware/authMiddleware");

router.post(
  "/login/create",
  Validation.validate(UserSchemaValidation.login),
  teacherController.login,
);


router.get(
    "/dashboard", 
    AuthMiddleware.verifyToken, 
    teacherController.dashboard
);

module.exports = router;
