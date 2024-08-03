const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true, unique: true },
  description: String,
  price: { type: Number, required: true },
  category: String,
  stock: { type: Number, required: true },
  on_sale: { type: Boolean, default: false },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
