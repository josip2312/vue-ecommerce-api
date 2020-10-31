const express = require('express');
const ordersController = require('../controllers/ordersController');

const { protect, admin } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', protect, admin, ordersController.getOrders);

router.get('/:id', protect, ordersController.getOrderById);

router.get('/myorders', protect, ordersController.getMyOrders);

router.post('/', protect, admin, ordersController.createOrder);

router.put('/:id/pay', protect, ordersController.updateOrderToPaid);

router.put(
	'/:id/deliver',
	protect,
	admin,
	ordersController.updateOrderToDelivered,
);

module.exports = router;
