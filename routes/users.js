const express = require('express');
const router = express.Router();

//middleware
const validateAuth = require('../middleware/auth');

// controllers
const auth = require('../controllers/auth');

router.post('/signup', validateAuth.validateRegisterRequest, auth.register); // signup - register
router.post('/login', validateAuth.validateLoginRequest, auth.login); // login - signin

// access routes to anywhere
module.exports = router;
