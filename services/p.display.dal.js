const db = require('./db');
const Product = require('../models/product'); //Import the MongoDB Product model

const useMongoDB = process.env.USE_MONGO_DB === 'true';

const getInfo = async function(text) {
  if (DEBUG) console.log('in display.dal.js');
  if (useMongoDB) {
    return Product.find({ $or: [
      { description: { $regex: text, $options: 'i' } },
      { name: { $regex: text, $options: 'i' } },
      { price: { $regex: text, $options: 'i' } }
    ] }).exec();
  } else {
    const sql = `select * from products where description iLIKE '%'||$1||'%' or name iLIKE '%'||$1||'%' or cast(price as text) iLIKE '%'||$1||'%'`;
    return new Promise(function(resolve, reject) {
      db.query(sql, [text], (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res.rows);
        }
      });
    });
  }
};

module.exports = {
  getInfo,
};

//Suffering :(
