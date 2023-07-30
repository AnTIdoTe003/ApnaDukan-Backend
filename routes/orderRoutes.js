import express from "express";
import {orderCheckoutController } from "../controllers/orderController.js";

const router = express.Router()

// order checkout
router.post('/order-checkout', orderCheckoutController)


export default router