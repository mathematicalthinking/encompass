//PASSPORT REQS
const passport = require('passport');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//PASSWORD CREATION
const bcrypt = require('bcrypt');

//USER MODEL
const models = require('../datasource/schemas');
const User = models.User;

module.exports = (passport) => {

  // =========================================================================
  // passport session setup ==================================================
  // =========================================================================
  // required for persistent login sessions
  // passport needs ability to serialize and unserialize users out of session

  // used to serialize the user for the session
  passport.serializeUser((user, next) => {
    next(null, user.id);
  });

  passport.deserializeUser((id, next) => {
    User.findById(id, (err, user) => {
      if (err) {
        return next(err);
      }
      next(null, user);
    });
  });


  passport.use('local-login', new LocalStrategy((username, password, next) => {
   console.log(`in local with username: ${username}, password ${password}`);
    User.findOne({
      username: username
    }, (err, user) => {
      console.log('user', user);
      if (err) {
        console.log('err from db', err);
        return next(err);
      }
      if (!user) {
        console.log('incorrect username');
        return next(null, false, {
          message: "Incorrect username"
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        console.log('incorrect password');
        return next(null, false, {
          message: "Incorrect password"
        });
      }

      return next(null, user);
    });
  }));

  passport.use('local-signup', new LocalStrategy({
      passReqToCallback: true
    },
    (req, username, password, next) => {
      process.nextTick(() => {
        User.findOne({
          'username': username
        }, (err, user) => {
          if (err) {
            return next(err);
          }

          if (user) {
            console.log('username already exists');
            return next(null, false, {
              message: "Username already exists"
            });
          } else {
            const {
              username,
              password,
            } = req.body;
            const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
            const newUser = new User({
              username,
              password: hashPass,
              isAuthorized: true
            });

            newUser.save((err) => {
              if (err) {
                next(err);
              }
              return next(null, newUser);
            });
          }
        });
      });
    }));


  //GOOGLE STRATEGY
  passport.use(new GoogleStrategy({
    clientID: "662267278166-nd0hruqqie1ns8h6eil5hvdiv4e019lo.apps.googleusercontent.com",
    clientSecret: "1HNNnmglV5FgSkdhf9NH73la",
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    console.log('profileid', profile.id);
    User.findOne({
      googleId: profile.id
    }, (err, user) => {
      if (err) {
        console.log('in err block', err);
        return done(err);
      }
      if (user) {
        console.log('found google user', user);
        return done(null, user);
      }

      const newUser = new User({
        googleId: profile.id,
        name: profile.name.givenName + " " + profile.name.familyName,
        username: profile.emails[0].value,
        email: profile.emails[0].value,
        isAuthorized: true
      });
      console.log('new user', newUser);
      newUser.save((err) => {
        if (err) {
          console.log('error saving', err);
          return done(err);
        }
        done(null, newUser);
      });
    });

  }));
};