const express = require('express');
const StudentController = require('../../controller/APIs/studentcontroller');
const upload = require('../../utils/multer');
const router = express.Router();


// For Multer:
router.post('/create-student', upload.single('image'),StudentController.createstudent);
router.put('/student/update/:id', upload.single('image'), StudentController.updateStudent);


// router.post('/create-student', StudentController.createstudent);
router.get('/students', StudentController.getallStudents);
router.get('/student/filter', StudentController.filterStudent);
router.get('/student/:id', StudentController.getStudentById);
// router.put('/student/update/:id', StudentController.updateStudent);
router.delete('/student/delete/:id', StudentController.deleteStudent);
router.get('/student/search/:name', StudentController.searchStudent);








module.exports = router;