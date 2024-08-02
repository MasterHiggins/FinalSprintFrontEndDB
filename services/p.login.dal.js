const db = require('./db');
const User = require('../models/user'); //Import the MongoDB user model

const useMongoDB = process.env.USE_MONGO_DB === 'true';

async function getLogin() {
  if (DEBUG) console.log("in get login");
  if (useMongoDB) {
    return User.find().exec();
  } else {
    let sql = 'select * from public.users';
    let res = await db.query(sql, []);
    return res.rows;
  }
}

async function getLoginByUsername(username) {
  if (DEBUG) console.log("in get login by username");
  if (useMongoDB) {
    return User.findOne({ username }).exec();
  } else {
    let sql = `select * from public.users where username = $1`;
    let results = await db.query(sql, [username]);
    return results.rows[0];
  }
}

async function addUser(username, email, password) {
  if (DEBUG) console.log("in add user");
  if (useMongoDB) {
    const newUser = new User({ username, email, password });
    return newUser.save();
  } else {
    let sql = 'insert into public.users(username, email, password) values ($1, $2, $3) returning user_id';
    let res = await db.query(sql, [username, email, password]);
    return res.rows[0].user_id;
  }
}

module.exports = {
  getLogin,
  getLoginByUsername,
  addUser,
};
