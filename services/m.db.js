const mongoose = require('mongoose');
require('dotenv').config(); //Load environment variables from .env file

//Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

module.exports = mongoose; //Export the mongoose connection
