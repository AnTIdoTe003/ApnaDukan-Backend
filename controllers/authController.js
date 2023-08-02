import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from "jsonwebtoken";
export const testApi = (req, res) => {
  res.send({
    success: true,
    message: "Test successful",
  });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, phone, address } = req.body;
    if (!name) {
      return res
        .status(400)
        .send({ success: false, message: "Name is required" });
    }
    if (!password || password.length < 6) {
      return res.status(400).send({
        success: false,
        message: "A stronger password must be provided",
      });
    }
    if (password !== confirmPassword) {
      return res
        .status(400)
        .send({ success: false, message: "Passwords do not match" });
    }
    if (!email) {
      return res
        .status(400)
        .send({ success: false, message: "Email is required" });
    }
    if (!phone) {
      return res.status(400).send({
        success: false,
        message: "Please enter a valid contact number",
      });
    }
    if (!address) {
      return res.status(400).send({
        success: false,
        message: "Address na diley kaar baritey pathabo",
      });
    }
    const existEmail = await userModel.findOne({ email: email });
    if (existEmail) {
      return res
        .status(400)
        .send({ success: false, message: "Email already exists" });
    }
    const hashedPassword = await hashPassword(password);
    const confirmHashedPassword = await hashPassword(confirmPassword);
    const userInfo = await userModel.create({
      ...req.body,
      password: hashedPassword,
      confirmPassword: confirmHashedPassword,
    });
    return res.setHeader("Content-Type", "application/json").status(200).send({
      success: true,
      message: "Successfully created the account",
      userInfo,
    });
  } catch (error) {
    return res.status(404).send({
      success: false,
      message: "Error registering user",
      error: errorreturn,
    });
    console.log(error);
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .send({ success: false, message: "Invalid email or password" });
    }
    // check if the user is already registered or not
    const existUser = await userModel.findOne({ email: email });
    if (!existUser) {
      return res
        .status(401)
        .send({ success: false, message: "User does not exist" });
    }
    const matchPassword = await comparePassword(password, existUser.password);
    if (!matchPassword) {
      return res
        .status(401)
        .send({ success: false, message: "Please enter a valid password" });
    }

    // token
    const token = await JWT.sign(
      { _id: existUser._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    const expirationDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    return res
      .setHeader("Content-Type", "application/json")
      .cookie("token", token, {
        expires: expirationDate,
        sameSite:'none',
        secure:true,
      })
      .status(200)
      .send({
        success: true,
        message: "User Logged in successfully",
        existUser,
      });
  } catch (error) {
    return res.status(404).send({
      success: false,
      message: "Error logging in user",
      error: error,
    });
    console.log(error);
  }
};

// forgot password
export const forgotPasswordController = async (req, res) => {
  try {
    const { email, answer, newPassword } = req.body;
    if (!email) {
      return res.status(400).send({ message: "Email is required" });
    }
    if (!answer) {
      return res
        .status(400)
        .send({ message: "Please fill in the correct answer" });
    }
    if (!newPassword) {
      return res
        .status(400)
        .send({ message: "Please enter your new Password" });
    }
    // check
    const user = await userModel.findOne({ email, answer });
    // validation
    if (!user) {
      return res.status(400).send({
        success: false,
        message: "Please check your email and answer and try again",
      });
    }
    const hashed = await hashPassword(newPassword);
    await userModel.findOneAndUpdate(user._id, {
      password: hashed,
      confirmPassword: hashed,
    });
    return res
      .status(200)
      .send({ success: true, message: "password updated successfully" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ success: false, message: "Something went wrong", error });
  }
};

// get User Details
export const getUserDetailsController = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res
        .status(401)
        .send({ success: false, message: "Please login first" });
    }
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    const existUser = await userModel
      .findById({ _id: decoded._id })
      .select("-password -confirmPassword");
    const totalPrice = existUser.cart.reduce((acc,item)=>{
      const productPrice = item.quantity * item.price;
      return acc + productPrice;
    },0)
    return res.status(200).send({
      success: true,
      message: "Your user details",
      data: existUser,
      token: token,
      totalPrice:totalPrice
    });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error });
  }
};

// logout user

export const logoutUser = async (req, res) => {
  try {
    return res
      .cookie("token", "", {
        httpOnly: true,
      })
      .status(200)
      .json({ success: true, message: "User logged out" });
  } catch (error) {
    return res
      .status(500)
      .send({ success: false, message: "Something went wrong", error });
  }
};

// update user details
export const updateUserDetailsController = async (req, res) => {
  try{
        const {name, email, password, confirmPassword, phone, address}= req.body
        const existingUser =  req.existUser
        const updatedUser = await userModel.findByIdAndUpdate(existingUser._id,{name:name, email:email, password:password, confirmPassword:confirmPassword, phone:phone, address:address})
        return res.status(200).json({success: true, message: "User updated successfully"})
  }catch(error){
    return res.status(401).json({ success: false, message: "Error updating user details"})
  }
}


// get user by id
export const userByIdController = async (req, res) => {
  const{id} = req.params
  try{
      const userData = await userModel.findById(id)
      return res.status(200).json({success: true, message: "User Fetched successfully", data:userData})
  }catch(error){
    return res.status(400).json({success:false, message:"Failed to fetch the user"})
  }
}