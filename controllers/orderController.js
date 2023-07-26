import orderModel from "../models/orderModel.js";

export const addToCartController = async (req, res) => {
  try {
    const { userId, products, totalPrice, shippingAddress, paymentMethod } = req.body;
    const cartData = await orderModel.create({ userId,  products, totalPrice, shippingAddress, paymentMethod  });
    return res
      .status(200)
      .json({ success: true, message: "Product added to cart", cartData });
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
