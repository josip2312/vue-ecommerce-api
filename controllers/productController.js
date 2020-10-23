const asyncHandler = require('express-async-handler');
const Product = require('../models/Product');

// @desc    Fetch all products
// @route   GET /products
// @access  Public
const getProducts = asyncHandler(async (req, res, next) => {
	const products = await Product.find();

	res.status(200).json(products);
});

// @desc    Fetch single product
// @route   GET /products/:id
// @access  Public
const getSingleProduct = asyncHandler(async (req, res, next) => {
	const id = req.params.id;
	const product = await Product.findById(id);

	if (product) {
		res.json(product);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc    Create a product
// @route   POST /products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
	const product = new Product({
		user: req.body.id,
		name: 'Sample name',
		description: 'Sample description',
		image: '/images/sample.jpg',
		category: 'Sample category',
		brand: 'Sample brand',
		price: 0,
		inStock: 0,
		numReviews: 0,
	});

	const createdProduct = await product.save();
	res.status(201).json(createdProduct);
});

// @desc    Delete a product
// @route   DELETE /products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
	const product = await Product.findById(req.params.id);

	if (product) {
		await product.remove();
		res.json({ message: 'Product removed' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc    Update a product
// @route   PUT /products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
	const {
		name,
		price,
		description,
		image,
		brand,
		category,
		inStock,
	} = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		product.name = name;
		product.price = price;
		product.description = description;
		product.image = image;
		product.brand = brand;
		product.category = category;
		product.inStock = inStock;

		const updatedProduct = await product.save();
		res.json(updatedProduct);
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc    Create new review
// @route   POST /products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
	const { rating, comment } = req.body;

	const product = await Product.findById(req.params.id);

	if (product) {
		const alreadyReviewed = product.reviews.find(
			(review) => review.user.toString() === req.user._id.toString(),
		);

		if (alreadyReviewed) {
			res.status(400);
			throw new Error('Product already reviewed');
		}

		const review = {
			name: req.user.name,
			rating: Number(rating),
			comment,
			user: req.user._id,
		};

		product.reviews.push(review);

		product.numReviews = product.reviews.length;

		product.rating =
			product.reviews.reduce((acc, item) => item.rating + acc, 0) /
			product.reviews.length;

		await product.save();
		res.status(201).json({ message: 'Review added' });
	} else {
		res.status(404);
		throw new Error('Product not found');
	}
});

// @desc    Get top rated products
// @route   GET /products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
	const products = await Product.find({}).sort({ rating: -1 }).limit(5);

	res.json(products);
});

module.exports = {
	getProducts,
	getSingleProduct,
	createProduct,
	deleteProduct,
	updateProduct,
	createProductReview,
	getTopProducts,
};
