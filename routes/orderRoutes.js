import express from "express";
import { addToCartController, getCartController } from "../controllers/orderController.js";

const router = express.Router()

// add to cart
router.post('/add-to-cart', addToCartController)
router.get('/get-cart/:userId', getCartController)

export default router