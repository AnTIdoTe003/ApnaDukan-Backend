import express from "express";
import {
    createOrderIdController, getAllOrdersController,
    getRazorPayKey,
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

// get-all-orders
router.get('/get-all-orders', getAllOrdersController)
export default router