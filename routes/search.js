const express = require('express');
const router = express.Router();
const { setTok, authJWT } = require('../services/auth');
const pDal = require('../services/p.display.dal');

router.use(setTok);
router.use(authJWT);

router.get('/', async (req, res) => {
  const results = [];
  res.render('search', { stat: req.session.stat, results });
});

router.post('/', async (req, res) => {
  const results = await pDal.getInfo(req.body.keyword);
  res.render('search', { stat: req.session.stat, results });
});

module.exports = router;
