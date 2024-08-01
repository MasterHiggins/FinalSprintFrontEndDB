const User = require('../models/user'); //Import the User model
const bcrypt = require('bcrypt');
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

//Create a new user
exports.createUser = async (userData) => {
  try {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = new User({
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      address: userData.address
    });
    await user.save();
    logger.info(`User created: ${user.email}`);
    return user;
  } catch (err) {
    logger.error(`Error creating user: ${err.message}`);
    throw err;
  }
};

//Get all users
exports.getAllUsers = async () => {
  try {
    const users = await User.find();
    return users;
  } catch (err) {
    logger.error(`Error fetching users: ${err.message}`);
    throw err;
  }
};

//Get a user by ID
exports.getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (err) {
    logger.error(`Error fetching user: ${err.message}`);
    throw err;
  }
};

//Update a user by ID
exports.updateUser = async (id, userData) => {
  try {
    const user = await User.findByIdAndUpdate(id, userData, { new: true });
    if (!user) {
      throw new Error('User not found');
    }
    logger.info(`User updated: ${user.email}`);
    return user;
  } catch (err) {
    logger.error(`Error updating user: ${err.message}`);
    throw err;
  }
};

//Delete a user by ID
exports.deleteUser = async (id) => {
  try {
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      throw new Error('User not found');
    }
    logger.info(`User deleted: ${user.email}`);
    return 'User deleted';
  } catch (err) {
    logger.error(`Error deleting user: ${err.message}`);
    throw err;
  }
};
