const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

//Security for email and password
passport.use(new LocalStrategy(
  function(email, password, done) {
    User.findOne({ email: email }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      bcrypt.compare(password, user.password, function(err, res) {
        if (res) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      });
    });
  }
));

//Serialization
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

app.use(require('express-session')({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

//Success and Failure
app.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));
