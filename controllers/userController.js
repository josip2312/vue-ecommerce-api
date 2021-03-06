const generateToken = require('../utils/generateToken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @desc    Auth user & get token
// @route   POST /users/login
// @access  Public
const loginUser = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email });

	if (user && (await user.matchPassword(password))) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(401);
		throw new Error('Invalid email or password');
	}
});

// @desc    Create new user, generate token
// @route   GET /users/register
// @access  Public
const registerUser = asyncHandler(async (req, res, next) => {
	const { email, password, name } = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400);
		throw new Error('User already exists');
	}

	const user = await User.create({
		name,
		email,
		password,
	});
	if (user) {
		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

// @desc    Get a user by id
// @route   GET /users/:id
// @access  Private
const getUser = asyncHandler(async (req, res, next) => {
	const id = req.params.id;

	const user = await User.findById(id);

	if (!user) {
		res.status(400);
		throw new Error('User not found');
	}

	const { _id, name, email, isAdmin } = user;
	res.status(200).json({
		_id,
		name,
		email,
		isAdmin,
	});
});

// @desc    Update a user by id
// @route   PUT /users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res, next) => {
	const user = await User.findById(req.user._id);

	if (!user) {
		res.status(400);
		throw new Error('User not found');
	}

	const { name, email, password } = req.body;

	user.name = name || user.name;
	user.email = email || user.email;
	user.password = password || user.password;

	const updatedUser = await user.save();

	res.status(200).json({
		_id: updatedUser._id,
		name: updatedUser.name,
		email: updatedUser.email,
		isAdmin: updatedUser.isAdmin,
		token: generateToken(updatedUser._id),
	});
});
// @desc    Get all users
// @route   GET /users
// @access  Private/Admin
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({});
	res.json(users);
});

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await user.remove();
		res.json({ message: 'User removed' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

// @desc    Update user
// @route   PUT /users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		user.name = req.body.name || user.name;
		user.email = req.body.email || user.email;
		user.isAdmin = req.body.isAdmin;

		const updatedUser = await user.save();
		const { _id, name, email, isAdmin } = updatedUser;
		res.json({
			_id,
			name,
			email,
			isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

module.exports = {
	loginUser,
	registerUser,
	getUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	updateUser,
};
