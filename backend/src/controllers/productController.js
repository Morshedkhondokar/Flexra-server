import productModel from "../models/product.model.js";

// Get all products
export const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.find();
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// Get single product by ID
export const getSingleProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json(product);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching product", error: error.message });
  }
};

// Get products by category
export const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const products = await productModel.find({ category });
    return res.status(200).json(products);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching products", error: error.message });
  }
};

// add new product
export const addProduct = async (req, res) => {
  try {
    const { name, description, price, images, category, brand, stock } =
      req.body;

    // Validate required fields
    if (!name || !description || !price || !images || !category || !brand) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create new product
    const newProduct = new productModel({
      name,
      description,
      price,
      images,
      category,
      brand,
      stock,
    });

    // Save product to database
    const savedProduct = await newProduct.save();

    // Return success response
    return res
      .status(201)
      .json({ message: "Product added successfully", product: savedProduct });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error adding product", error: error.message });
  }
};

// update existing product
export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { name, description, price, images, category, brand, stock } =
      req.body;
    // Find product by ID
    const product = await productModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update product fields
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.images = images || product.images;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.stock = stock || product.stock;

    // Save updated product
    const updatedProduct = await product.save();
    return res
      .status(200)
      .json({
        message: "Product updated successfully",
        product: updatedProduct,
      });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error updating product", error: error.message });
  }
};

// delete product
export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await productModel.findByIdAndDelete(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    return res.status(200).json({ message: "Product deleted successfully" });

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error deleting product", error: error.message });
  }
};


