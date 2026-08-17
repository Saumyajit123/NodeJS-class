const express = require('express');
const AuthEjsController = require('../controller/authEJSController');
const AuthCheck = require('../middleware/auth');

const router = express.Router();



router.get("/", AuthCheck, AuthEjsController.home);

router.get('/register', AuthCheck, AuthEjsController.register);
router.post('/register/create', AuthEjsController.registerCreate);

router.get('/login', AuthCheck, AuthEjsController.login);
router.post('/login/create', AuthEjsController.loginCreate);

router.get('/dashboard', AuthCheck, AuthEjsController.CheckAuth, AuthEjsController.dashboard);

router.get('/logout', AuthCheck, AuthEjsController.CheckAuth, AuthEjsController.logout);




module.exports = router;