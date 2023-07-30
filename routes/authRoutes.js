import express from "express";
import { testApi, registerUser, loginUser, forgotPasswordController, getUserDetailsController, logoutUser, updateUserDetailsController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

const router = express.Router()


// register user
router.post('/register', registerUser)

// login user
router.post('/login', loginUser)

// logout user
router.get('/logout', logoutUser)

// forgot password
router.post('/forgot-password', forgotPasswordController)

// test api route
router.get('/test', requireSignIn, isAdmin, testApi)

// protected route
router.get('/user-auth', requireSignIn, (req,res)=>{
     res.status(200).send({"success":true})
})


// admin auth
router.get('/admin-auth', requireSignIn, isAdmin,(req,res)=>{
     res.status(200).send({"success":true})
})


// get user details
router.get('/get-user-details', getUserDetailsController)

// update user details
router.put('/update-user-details', requireSignIn, updateUserDetailsController)

export default router