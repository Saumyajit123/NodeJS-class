const express = require('express');
const aboutcontroller = require('../controller/aboutcontroller');
const router = express.Router();


router.get('/about', aboutcontroller.about)

module.exports = router;