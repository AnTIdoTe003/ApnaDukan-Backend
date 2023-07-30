import express from 'express';
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js';
import {deleteProductController,updateProductController, getProductPhotoController, getSingleProductController,getAllProductsController, createProductController, filterProductsController, searchProductsController, getProductByIDController, getProductByCategoryController } from '../controllers/productController.js';
import formidable from 'express-formidable'
const router = express.Router();

router.post('/create-product', requireSignIn, isAdmin, formidable(), createProductController )

// get-all-products
router.get('/get-all-products', getAllProductsController)

// get-single-product
router.get('/get-single-product/:slug', getSingleProductController)

// get-product-photo
router.get('/get-product-photo/:pid', getProductPhotoController)

// update product
router.put('/update-product/:pid', requireSignIn, isAdmin, formidable(), updateProductController)

// delete product
router.delete('/delete-product/:id', requireSignIn, isAdmin, deleteProductController)

// filter products
router.post('/filter-products', filterProductsController)

// search products query based
router.get('/search-products', searchProductsController)

// get-single-product by id
router.get('/product-by-id', getProductByIDController)


// get-poducts by category
router.get('/product-by-category', getProductByCategoryController)
export default router