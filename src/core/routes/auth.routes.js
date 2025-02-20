const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { auth, isSuperAdmin } = require('../../middlewares/auth.middleware');

router.post('/login', authController.login);
router.post('/register', [auth, isSuperAdmin], authController.register);
router.put('/update-profile', auth, authController.updateProfile);
router.put('/update-password', auth, authController.updatePassword);

module.exports = router;
