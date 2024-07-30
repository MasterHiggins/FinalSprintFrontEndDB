//Create User
app.post('/users', async (req, res) => {
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        address: req.body.address
      });
      await user.save();
      res.status(201).send(user);
    } catch (err) {
      res.status(400).send(err);
    }
  });

//Read Users
app.get('/users', async (req, res) => {
    try {
      const users = await User.find();
      res.status(200).send(users);
    } catch (err) {
      res.status(500).send(err);
    }
  });

//Read Single User
app.get('/users/:id', async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });

//Update User
app.put('/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send(user);
      }
    } catch (err) {
      res.status(400).send(err);
    }
  });
  
//Delete User
app.delete('/users/:id', async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).send('User not found');
      } else {
        res.status(200).send('User deleted');
      }
    } catch (err) {
      res.status(500).send(err);
    }
  });
  