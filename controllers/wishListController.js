import userModel from "../models/userModel.js";

export const addToWishlistController = async (req, res) => {
  try {
    const { productId } = req.body;
    const { _id } = req.existUser;
    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });
    }
    const userToFind = await userModel.findById(_id);
    userToFind.wishlist.push({ productId });
    await userToFind.save();
    return res
      .status(200)
      .json({ success: true, message: "Added to wishlist successfully" });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: "Error adding to wishlist",
    });
  }
};

// remove from wishlist
export const removeFromWishlistController = async (req, res) => {
  try {
    const { productId } = req.body;
    const { _id } = req.existUser;
    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Please Login First" });
    }
    const userToFind = await userModel.findById(_id);
    userToFind.wishlist = userToFind.wishlist.filter(
      (ele) => ele.productId.toString() !== productId
    );
    await userToFind.save();
    return res
      .status(200)
      .json({ success: true, message: "Removed from wishlist successfully" });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Error removing from wishlist" });
  }
};
