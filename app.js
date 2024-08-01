const express = require('express');
const mongoose = require('./services/m.db'); //Import the mongoose connection
const passport = require('./services/DDL/m.auth'); //Import the configured Passport module
const session = require('express-session');
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const winston = require('winston');
const path = require('path');
const fs = require('fs');

//Create logs directory if it doesn't exist
const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const app = express();
app.use(express.json());

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

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

//Log each request
app.use((req, res, next) => {
  logger.info(`Requested URL: ${req.url}, Method: ${req.method}, IP: ${req.ip}`);
  next();
});

app.use('/api', userRoutes);
app.use('/api', productRoutes);
app.use('/api', orderRoutes);

app.listen(3000, () => {
  logger.info('Server is running on port 3000');
  console.log('Server is running on port 3000');
});
