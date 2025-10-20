const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controller/authController');
const verifyToken = require('../middleware/authJwt');

router.post('/register', register);
router.post('/login', login);
router.get('/me', verifyToken, me);

module.exports = router;