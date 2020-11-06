const express = require('express');
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', productController.getProducts);

router.get('/:id', productController.getSingleProduct);

router.get('/all/top', productController.getTopProducts);

router.post('/', protect, admin, productController.createProduct);

router.post('/:id/reviews', protect, productController.createProductReview);

router.put('/:id', protect, admin, productController.updateProduct);

router.delete('/:id', protect, admin, productController.deleteProduct);

module.exports = router;
