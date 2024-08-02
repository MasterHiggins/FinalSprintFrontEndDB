const Product = require("../models/product");

// Create a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, on_sale } = req.body;
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      stock,
      on_sale,
    });
    await newProduct.save();
    res.status(201).json({ message: "Product created successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all products
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update product by ID
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, on_sale } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { name, description, price, category, stock, on_sale },
      { new: true }
    );
    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete product by ID
const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};
