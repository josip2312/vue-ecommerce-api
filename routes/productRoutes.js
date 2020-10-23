const express = require('express');
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/top', productController.getTopProducts);

router.post('/', protect, admin, productController.createProduct);

router.post('/:id/reviews', protect, productController.createProductReview);

router.post('/:id', protect, admin, productController.updateProduct);

router.delete('/', protect, admin, productController.deleteProduct);

module.exports = router;
