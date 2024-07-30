const winston = require('winston');

//Creating the logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'search_queries.log' })
  ]
});

//Searching
app.get('/search', (req, res) => {
  let query = req.query.q;
  logger.info({ user_id: req.user.id, query: query, timestamp: new Date().toISOString() });

  Product.find({ $text: { $search: query } }, (err, products) => {
    if (err) { res.status(500).send(err); }
    res.render('search', { products: products });
  });
});
