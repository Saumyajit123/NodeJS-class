const express = require('express');
const homecontroller = require('../controller/homecontroller');
const router = express.Router();


router.get('/', homecontroller.home);
router.get('/about', homecontroller.about);
router.get('/card', homecontroller.card);
router.get('/add', homecontroller.add);
router.get('/update', homecontroller.update);
router.get('/list', homecontroller.list);
router.get('/view', homecontroller.view);

module.exports = router;