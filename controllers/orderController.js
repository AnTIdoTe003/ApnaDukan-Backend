import orderModel from "../models/orderModel.js";
import {instance} from "../index.js";
import crypto from "crypto";
export const orderCheckoutController = async (req, res) => {
  try {
    const { userId, orderId, products, totalPrice, shippingAddress, paymentMethod } = req.body;


    const orderData = await orderModel.create({ userId,  products, totalPrice, shippingAddress, paymentMethod, orderId  });
    return res
      .status(200)
      .json({ success: true, message: "Order Successfull", orderData});
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};



// order id creation

export const createOrderIdController = async(req,res)=>{
  try{
    const options = {
      amount: Number(req.body.totalPrice)*100,
      currency: "INR",
    };
    const order = await instance.orders.create(options);
    return res
        .status(200)
        .json({ success: true, message: "Order Id Created Successfully", order });
  }catch (error){
    return res.status(500).json({ success: false, message: error.message });
  }
}

export const getCartController = async (req, res) => {
  try {
    const cartData = await orderModel
      .find({ userId: req.params.userId })
    return res
      .status(200)
      .send({ success: true, message: "Cart Data", cartData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getRazorPayKey =(req,res)=>{
  return res.status(200).json({success:true, key:process.env.RAZORPAY_API_KEY})
}

export const paymentVerification = async (req, res) => {
  const { razorpayOrderId, razorpayPaymentId, razorpaySignature,userId, orderId, products, totalPrice, shippingAddress } =
      req.body;
  const body = razorpayOrderId + "|" + razorpayPaymentId;

  const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_API_SECRET)
      .update(body.toString())
      .digest("hex");

  const isAuthentic = expectedSignature === razorpaySignature;

  if (isAuthentic) {

    const orderData = await orderModel.create({razorpayOrderId, razorpayPaymentId, razorpaySignature, userId,  products, totalPrice, shippingAddress, orderId, isPaid:true  });

   res.status(200).json({success:true, message:"Payment Verified and ordered successfully", data:orderData})
  } else {
    res.status(400).json({
      success: false,
    });
  }
};


export const getAllOrdersController =  async(req,res)=>{
  try{
    const {userId} = req.query
    const userOrder = await orderModel.find({userId: userId})
    res.status(200).json({success:true, message:"Products Fetched Successfully", userOrder})

  }catch (error){
    return res.status(400).json({success:false, message:"Error Fetching your Products"})
  }
}