const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userService = require("./userService"); // Use the new userService

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;
        const username = profile.displayName;
        const providerId = profile.id;

        // Check if the user exists in PostgreSQL
        let user = await userService.getUserByEmail(email);

        if (!user) {
          // If user does not exist, create a new user in PostgreSQL
          user = await userService.createUser(username, email, providerId);
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (user_id, done) => {
  try {
    const user = await userService.getUserById(user_id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
