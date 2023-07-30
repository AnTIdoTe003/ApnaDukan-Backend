import orderModel from "../models/orderModel.js";

export const orderCheckoutController = async (req, res) => {
  try {
    const { userId, orderId, products, totalPrice, shippingAddress, paymentMethod } = req.body;
    console.log(userId)
    const orderData = await orderModel.create({ userId,  products, totalPrice, shippingAddress, paymentMethod, orderId  });
    return res
      .status(200)
      .json({ success: true, message: "Order Successfull", orderData });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

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
