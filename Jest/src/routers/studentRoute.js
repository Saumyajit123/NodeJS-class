const express = require("express");

const StudentController = require("../controllers/studentController");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Create
router.post(
  "/student/create",
  upload.single("image"),
  StudentController.createStudent,
);

// Read all
router.get("/students", StudentController.getAllStudent);

// Read by slug
router.get("/student/slug/:slug", StudentController.getSlugStudent);

// Read by ID
router.get("/student/id/:id", StudentController.getStudentById);

// Update
router.put("/student/update/:id", StudentController.updateStudent);

// Search
router.post("/student/search", StudentController.search);

// Filter
router.get("/student/filter", StudentController.filter);

// Delete
router.delete("/student/delete/:id", StudentController.deleteStudent);

module.exports = router;
