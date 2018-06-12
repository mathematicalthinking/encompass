//PASSPORT REQS
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//PASSWORD CREATION
const bcrypt = require('bcrypt');
const bcryptSalt = 10;

//USER MODEL
const User = require('./datasource/schemas/user');


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
    User.findOne({
      username
    }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {
          message: "Incorrect username"
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
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
            return next(null, false, {
              message: "Username already exists"
            });
          } else {
            const {
              username,
              email,
              password
            } = req.body;
            const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
            const newUser = new User({
              username,
              email,
              password: hashPass
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
    clientID: "881861196583-d8gjkkped1kgukjsg9cb6eedqja3k8c0.apps.googleusercontent.com",
    clientSecret: "JwlD-62nOiJLnODXHrWR6ftV",
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({
      googleID: profile.id
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        googleID: profile.id,
        username: profile.name.givenName + " " + profile.name.familyName,
        email: profile.emails[0].value
      });

      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        done(null, newUser);
      });
    });

  }));


  //FACEBOOK STRATEGY
  passport.use(new FacebookStrategy({
    clientID: "857307061101319",
    clientSecret: "6a3eace08f83082fe80681f9078c0105",
    callbackURL: "/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'email']
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({
      facebookID: profile.id
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        facebookID: profile.id,
        username: profile.displayName,
        email: profile.emails[0].value
      });
      newUser.save((err) => {
        if (err) {
          return done(err);
        }
        done(null, newUser);
      });
    });
  }));

};