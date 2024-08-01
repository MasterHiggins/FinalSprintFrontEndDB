const Product = require('../models/product'); //Import the Product model
const winston = require('winston');
const path = require('path');

//Logger setup
const logDir = 'logs';
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss'
    }),
    winston.format.printf(info => `${info.timestamp} ${info.level}: ${info.message}`)
  ),
  transports: [
    new winston.transports.File({ filename: path.join(logDir, 'app.log'), level: 'info' })
  ]
});

//Create a new product
exports.createProduct = async (productData) => {
  try {
    const product = new Product(productData);
    await product.save();
    logger.info(`Product created: ${product.name}`);
    return product;
  } catch (err) {
    logger.error(`Error creating product: ${err.message}`);
    throw err;
  }
};

//Get all products
exports.getAllProducts = async () => {
  try {
    const products = await Product.find();
    return products;
  } catch (err) {
    logger.error(`Error fetching products: ${err.message}`);
    throw err;
  }
};

//Get a product by ID
exports.getProductById = async (id) => {
  try {
    const product = await Product.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  } catch (err) {
    logger.error(`Error fetching product: ${err.message}`);
    throw err;
  }
};

//Update a product by ID
exports.updateProduct = async (id, productData) => {
  try {
    const product = await Product.findByIdAndUpdate(id, productData, { new: true });
    if (!product) {
      throw new Error('Product not found');
    }
    logger.info(`Product updated: ${product.name}`);
    return product;
  } catch (err) {
    logger.error(`Error updating product: ${err.message}`);
    throw err;
  }
};

//Delete a product by ID
exports.deleteProduct = async (id) => {
  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      throw new Error('Product not found');
    }
    logger.info(`Product deleted: ${product.name}`);
    return 'Product deleted';
  } catch (err) {
    logger.error(`Error deleting product: ${err.message}`);
    throw err;
  }
};
