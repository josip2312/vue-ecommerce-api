const express = require('express');
const userController = require('../controllers/userController');

const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', userController.loginUser);

router.post('/register', userController.registerUser);

router.get('/:id', protect, userController.getUser);

router.put('/:id', protect, userController.updateUser);

module.exports = router;
