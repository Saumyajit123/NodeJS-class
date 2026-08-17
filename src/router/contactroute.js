const express = require('express');
const contactcontroller = require('../controller/contactcontroller');
const router = express.Router();


router.get('/contact', contactcontroller.contact)

module.exports = router;