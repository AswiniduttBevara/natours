const express = require('express');
const authController = require('./../controller/authController');
const userController = require('../controller/userController');

const router = express.Router();

router.post('/signup', authController.signUp);
router.post('/login', authController.login);

router.post('/forgetpassword', authController.forgetPassword);
router.patch('/resetpassword/:token', authController.resetPassword);

router.patch('/updatepassword', authController.protect, authController.updatePassword);
router.delete('/deleteme', authController.protect, userController.deleteMe);

router.patch('/updateMe', authController.protect, userController.updateMe);

router.route('/').get(userController.getusers).post(userController.createuser);
router.route('/:id').get(userController.getuser).patch(userController.updateuser).delete(userController.deleteuser);

module.exports = router;
