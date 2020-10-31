const express = require('express');
const userController = require('../controllers/userController');

const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', userController.loginUser);

router.post('/register', userController.registerUser);

router.get('/:id', protect, userController.getUser);

router.get('/', protect, admin, userController.getUsers);

router.delete('/:id', protect, admin, userController.deleteUser);

router.put('/profile', protect, userController.updateUserProfile);

router.put('/:id', protect, admin, userController.updateUser);

module.exports = router;
