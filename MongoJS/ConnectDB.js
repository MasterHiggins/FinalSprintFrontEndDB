const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/ecommerce', { useNewUrlParser: true, useUnifiedTopology: true });

const UserSchema = new mongoose.Schema({     //JSON structure
    name: String,
    email: String,
    password: String,
    address: {
      street: String,
      city: String,
      state: String,
      province: String
    }
  });
  
  const ProductSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    category: String,
    stock: Number
  });
  
  //Constructing both User and Product
  const User = mongoose.model('User', UserSchema);
  const Product = mongoose.model('Product', ProductSchema);
  
