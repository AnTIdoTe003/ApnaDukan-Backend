import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: true
  },
  products: [
    {
      productId: {
        type: mongoose.ObjectId,
        ref: "Products",
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      price:{
        type: Number,
        required: true,
      }
    },
  ],
  orderId:{
    type:String,
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type:String,
    required: true
  },
  paymentMethod: {
    type: String,
  },
  isPaid: {
    type: Boolean,
    default: false
  },
  paidAt: {
    type: Date
  },
  isDelivered: {
    type: String,
    default: "Processing"
  },
  deliveredAt: {
    type: Date
  },
  razorpayOrderId: {
    type: String,
    required:true
  },
  razorpayPaymentId: {
    type: String,
    required:true
  },
  razorpaySignature: {
    type: String,
    required:true
  },
}, {
  timestamps: true
});

export default mongoose.model("orders", orderSchema);
