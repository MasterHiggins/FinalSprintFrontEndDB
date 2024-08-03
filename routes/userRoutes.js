const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController"); // Ensure authController is correctly imported

// User routes
router.post("/users", userController.createUser);
router.get("/users", userController.getAllUsers);
router.get("/users/:id", userController.getUserById);
router.put("/users/:id", userController.updateUser);
router.delete("/users/:id", userController.deleteUser);

// Authentication routes
router.post("/register", authController.register); // Ensure register is correctly defined in authController
router.post("/login", authController.login); // Ensure login is correctly defined in authController

module.exports = router;
