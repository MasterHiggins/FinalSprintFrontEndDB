require("dotenv").config();
const express = require("express");
const session = require("express-session");
const winston = require("winston");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
const passport = require("./services/passport"); // Import passport configuration
const db = require("./services/db"); // Ensure database initialization
const protectedRouter = require("./routes/protected");
const app = express();
const PORT = process.env.PORT || 3000;
global.DEBUG = true;

// Setup event emitter
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();

// Setup view engine
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

//protected router
app.use("/api", protectedRouter);

// Create logs directory if it doesn't exist
const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

// Setup logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: path.join(logDir, "app.log"),
      level: "info",
    }),
  ],
});

// Log each request
app.use((req, res, next) => {
  logger.info(
    `Requested URL: ${req.url}, Method: ${req.method}, IP: ${req.ip}`
  );
  next();
});

// Event emitter logging
myEmitter.on("log", (message) => {
  logger.info(message);
});

// Routes
app.get("/", (req, res) => {
  myEmitter.emit("log", "Visited homepage");
  res.render("index", { stat: req.session.stat });
});

const loginRouter = require("./routes/login");
app.use("/login", loginRouter);

const searchRouter = require("./routes/search");
app.use("/search", searchRouter);

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
app.use("/api", userRoutes);
app.use("/api", productRoutes);

const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const testPostgresRouter = require("./routes/testPostgres");
app.use("/test", testPostgresRouter);

// Start server
app.listen(PORT, (err) => {
  if (err) console.log(err);
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
