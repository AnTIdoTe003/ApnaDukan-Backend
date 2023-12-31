import {
    addToCartController,
    clearCartController,
    deleteFromCartController,
    updateCartController
} from "../controllers/cartController.js";
import { requireSignIn } from "../middlewares/authMiddleware.js";
import express from 'express'
const router = express.Router()


router.put('/add-to-cart', requireSignIn,  addToCartController)
router.put('/update-cart', requireSignIn, updateCartController)
router.delete('/delete-item-cart', requireSignIn, deleteFromCartController)
router.put('/clear-cart', requireSignIn, clearCartController)
export default router
