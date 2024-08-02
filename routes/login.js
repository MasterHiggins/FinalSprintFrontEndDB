const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const { addUser, getLoginByUsername } = require("../services/p.login.dal");

router.get("/", async (req, res) => {
  if (DEBUG) console.log("in login.js");
  res.render("login", { stat: req.session.stat });
  return;
});

router.post("/", async (req, res) => {
  try {
    if (DEBUG) console.log("in post /");
    let user = await getLoginByUsername(req.body.username);
    if (!user) {
      req.session.stat = "wrong username";
      console.log("wrong username");
      res.redirect("/login");
      return;
    }
    if (await bcrypt.compare(req.body.password, user.password)) {
      const token = jwt.sign(
        { username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );
      req.session.user = user;
      req.session.token = token;
      req.session.stat = `hello ${user.username}`;
      res.redirect("/");
      return;
    } else {
      req.session.stat = "wrong password";
      console.log("wrong password");
      res.redirect("/login");
      return;
    }
  } catch (error) {
    console.log(error);
    res.redirect("/");
    return;
  }
});

router.get("/new", async (req, res) => {
  if (DEBUG) console.log("in login.js");
  res.render("register", { stat: req.session.stat });
  return;
});

router.post("/new", async (req, res) => {
  try {
    const hashPass = await bcrypt.hash(req.body.password, 10);
    if (req.body.email && req.body.username && req.body.password) {
      if (DEBUG) console.log("in /new");
      await addUser(req.body.username, req.body.email, hashPass);
      req.session.stat = `welcome ${req.body.username}`;
    }
    console.log("new user made");
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
