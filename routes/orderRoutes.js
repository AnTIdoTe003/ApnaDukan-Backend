import express from "express";
import {
    createOrderIdController, getAllOrdersController,
    getAllUserOrdersController,
    getRazorPayKey,
    orderByIdController,
    orderCheckoutController,
    paymentVerification
} from "../controllers/orderController.js";

const router = express.Router()

// order checkout
router.post('/order-checkout', orderCheckoutController)

// get razorpay api key
router.get('/get-api-key', getRazorPayKey)

// order id creation
router.post('/create-order-id', createOrderIdController)

// payment verification

router.post('/payment-verification',paymentVerification)

// get-all-orders for a user Id
router.get('/get-all-orders', getAllUserOrdersController)

// get single order by order id
router.get('/order-by-id', orderByIdController)

// get all order for admin
router.get('/fetchOrders', getAllOrdersController)

export default router