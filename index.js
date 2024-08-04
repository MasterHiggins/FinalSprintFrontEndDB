const express = require("express");
const session = require("express-session");
const winston = require("winston");
const path = require("path");
const fs = require("fs");
const EventEmitter = require("events");
const passport = require("./services/passport");
const db = require("./services/db");
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
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport.js
app.use(passport.initialize());
app.use(passport.session());

// Middleware to make user available in all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || req.user;
  next();
});

// Middleware to log session and user information
app.use((req, res, next) => {
  console.log("Debugging middleware:");
  console.log("Session:", req.session);
  console.log("Cookies:", req.cookies);
  console.log("User:", req.user);
  next();
});

// Middleware to check authentication
const checkAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return res.redirect("/search");
  }
  next();
};

const checkNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
};

// Auth routes
const authRouter = require("./routes/auth");
app.use("/auth", authRouter);

const registerRouter = require("./routes/register");
app.use("/register", registerRouter);
app.use((req, res, next) => {
  if (req.path === "/register") {
    console.log("Register route accessed");
  }
  next();
});

const protectedRouter = require("./routes/protected");
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
app.get("/", checkAuthenticated, (req, res) => {
  myEmitter.emit("log", "Visited homepage");
  res.render("index", { stat: req.session.stat });
});

const loginRouter = require("./routes/login");
app.use("/login", checkAuthenticated, loginRouter);

const searchRouter = require("./routes/search");
app.use("/search", checkNotAuthenticated, searchRouter);

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
app.use("/api", userRoutes);
app.use("/api", productRoutes);

const testPostgresRouter = require("./routes/testPostgres");
app.use("/test", testPostgresRouter);

const logoutRouter = require("./routes/logout");
app.use("/logout", logoutRouter);

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Something went wrong!");
});

// Start server
app.listen(PORT, (err) => {
  if (err) console.log(err);
  logger.info(`Server is running on port ${PORT}`);
  console.log(`Server is running on port ${PORT}`);
});
