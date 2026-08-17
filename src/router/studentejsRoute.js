const express = require("express");
const StudentEjsController = require("../controller/studentejscontroller");
const upload = require('../utils/multer');

const router = express.Router();

router.get("/student", StudentEjsController.list);
router.get("/student/store",StudentEjsController.store);
router.post("/student/create", upload.single("image"), StudentEjsController.create);

router.get("/student/delete/:id", StudentEjsController.delete);

router.get("/student/update/:id", StudentEjsController.edit);
router.post("/student/update/:id",upload.single("image"), StudentEjsController.update);

router.get("/student/view/:id", StudentEjsController.view);

module.exports = router;
