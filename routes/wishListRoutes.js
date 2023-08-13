import express from "express";
import {requireSignIn} from '../middlewares/authMiddleware.js'
import { addToWishlistController, removeFromWishlistController } from "../controllers/wishListController.js";

const router = express.Router()

router.put('/add-to-wishlist', requireSignIn, addToWishlistController)

router.delete('/remove-from-wishlist', requireSignIn, removeFromWishlistController)


export default router