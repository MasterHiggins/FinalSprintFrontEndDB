//Create Product
app.post('/products', async (req, res) => {
    try {
      const product = new Product(req.body);
      await product.save();
      res.status(201).send(product);
    } catch (err) {
      res.status(400).send(err);
    }
  });

//Read ALL Products
app.get('/products', async (req, res) => {
    try {
      const products = await Product.find();
      res.status(200).send(products);
    } catch (err) {
      res.status(500).send(err);
    }
  });
  
//Read SPECIFIC Product
app.get('/products/:id', async (req, res) => {
    try {
      const product = await Product.findById(req.params.id);
      if (!product) {
        res.status(404).send('Product not found');
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

//Update Product
app.put('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!product) {
        res.status(404).send('Product not found');
      } else {
        res.status(200).send(product);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });

//Delete Product
app.delete('/products/:id', async (req, res) => {
    try {
      const product = await Product.findByIdAndDelete(req.params.id);
      if (!product) {
        res.status(404).send('Product not found');
      } else {
        res.status(200).send('Product deleted');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
  