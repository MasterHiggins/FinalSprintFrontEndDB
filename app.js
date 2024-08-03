const express = require("express");
const mongoose = require("./services/m.db"); // Import the mongoose connection
const passport = require("./services/DDL/m.auth"); // Import the configured Passport module

const app = express();

// Additional middleware or configuration if needed

module.exports = app;
