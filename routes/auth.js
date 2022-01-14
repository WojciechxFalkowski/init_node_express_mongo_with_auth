const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/authController');
const passport = require('passport');

const jwtAuth = require('../middlewares/auth')


router.post('/login', passport.authenticate('local', { session: false }), AuthController.login);

router.post('/register', AuthController.register);

router.get('/current-user', jwtAuth, AuthController.currentUser);

router.get('/verify/:id', AuthController.verify);

router.post('/forget-password', AuthController.forgetPassword);

router.post('/reset-password-check-email', AuthController.resetPasswordCheckEmail);

router.post('/reset-password', AuthController.resetPassword);

module.exports = router;