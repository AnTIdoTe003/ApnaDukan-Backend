import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import ProductModel from "../models/productModel.js";

export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    //validation
    switch (true) {
      case !name:
        return res.status(500).json({ error: "Name is Required" });
      case !description:
        return res.status(500).json({ error: "Description is Required" });
      case !price:
        return res.status(500).json({ error: "Price is Required" });
      case !category:
        return res.status(500).json({ error: "Category is Required" });
      case !quantity:
        return res.status(500).json({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .json({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.create({
      ...req.fields,
      slug: slugify(name),
    });

    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }

    await products.save();
    res.status(201).json({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

export const getAllProductsController = async (req, res) => {
  try {
    const allProducts = await ProductModel.find({})
      .select("-photo")
      .limit(12)
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      allProducts,
      message: "Products fetched successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in fetching all products",
    });
  }
};

export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: { $regex: req.params.slug, $options: "i" } })
      .select("-photo")
      .populate("category");
    res.status(200).json({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

export const getProductPhotoController = async (req, res) => {
  try {
    const productPhoto = await ProductModel.findById(req.params.pid);
    if (productPhoto.photo.data) {
      res.set("Content-Type", productPhoto.photo.contentType);
      return res.status(200).send(productPhoto.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error while getting single product",
      error,
    });
  }
};

//update product controller
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;

    switch (true) {
      case !name:
        return res.status(500).json({ error: "Name is Required" });
      case !description:
        return res.status(500).json({ error: "Description is Required" });
      case !price:
        return res.status(500).json({ error: "Price is Required" });
      case !category:
        return res.status(500).json({ error: "Category is Required" });
      case !quantity:
        return res.status(500).json({ error: "Quantity is Required" });
      case photo && photo.size > 1000000:
        return res
          .status(500)
          .json({ error: "photo is Required and should be less then 1mb" });
    }

    const products = await productModel.findByIdAndUpdate(
      req.params.pid,
      { ...req.fields, slug: slugify(name) },
      { new: true }
    );
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).json({
      success: true,
      message: "Product Updated Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in Updating product",
    });
  }
};

//delete product
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.id);
    return res
      .status(200)
      .json({ success: true, message: "Product Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in Deleting product",
    });
  }
};

// filter products controller

export const filterProductsController = async (req, res) => {
  try {
    const { price, category } = req.body;
    if (price && category.length === 0) {
      const priceBasedProduct = await productModel
        .find({
          price: {
            $gte: Number(price[0]),
            $lte: Number(price[1]),
          },
        })
        .select("-photo");
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: priceBasedProduct,
      });
    }
    if (!price && category) {
      const categoryBasedProduct = await productModel
        .find({
          category: category,
        })
        .select("-photo");
      return res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: categoryBasedProduct,
      });
    }
    const products = await productModel
      .find({
        price: {
          $gte: price[0],
          $lte: price[1],
        },
        category: category,
      })
      .select("-photo");
    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      data: products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in fetching all products",
    });
  }
};

// search for products query based

export const searchProductsController = async (req, res) => {
  try {
    const { query } = req.query;
    if (query) {
      const searchedProducts = await productModel
        .find({ name: { $regex: query, $options: "i" } })
        .select("-photo");
      res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: searchedProducts,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      error,
      message: "Error in fetching searched products",
    });
  }
};

export const getProductByIDController = async (req, res) => {
  try {
    const { query } = req.query;
    const productData = await productModel.findById(query).select("-photo");
    if (!productData) {
      return res
        .status(400)
        .json({ success: true, message: "Product not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Product retrieved successfully",
        data: productData,
      });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Error fetching product by ID" });
  }
};

export const getProductByCategoryController = async (req, res) => {
  try {
    const { query } = req.query;
    const existProduct = await productModel.findById(query).select("-photo");
    const productData = await productModel.find({
      category: existProduct.category,
      name: { $ne: existProduct.name },
    });
    if (!productData) {
      return res
        .status(400)
        .json({ success: true, message: "Products not found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Products retrieved successfully",
        data: productData,
      });
  } catch (error) {
    return res
      .status(400)
      .json({ success: false, message: "Error fetching product by category" });
  }
};
