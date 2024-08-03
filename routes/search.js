const express = require("express");
const router = express.Router();
const { setTok, authJWT } = require("../services/auth");
const searchController = require("../controllers/searchController");

router.use(setTok);
router.use(authJWT);

router.get("/", searchController.renderSearchPage);
router.post("/results", searchController.performSearch);

module.exports = router;
