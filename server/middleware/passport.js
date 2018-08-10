/**
 * # Passport Authentication Middleware & Logic
 * @description This file hosts all the logic needed to:
 *   Serialize and deserialize users
 *   Login & Signup using a local strategy
 *   Signup & Login using Google OAuth
 * @author Philip Wisner & Daniel Kelly
 * @since 2.0.0
 */

//REQUIRE MODULES
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

//PASSWORD ENCRYPTION
const bcrypt = require('bcrypt');

//USER MODEL
const models = require('../datasource/schemas');
const User = models.User;

module.exports = (passport) => {
  // passport session setup
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

 /* This is the local strategy for login
  * It checks to see if the username matches a username in the database
  * If it doesn't it sends an error of incorrect username
  * It then checks to see if the hashed passwords match
  * If they don't then it returns incorrect password
  */
  passport.use('local-login', new LocalStrategy((username, password, next) => {
    User.findOne({
      username: username
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

  /* This is the local strategy for signup
  * It checks to see if the username already exists
  * If it does it returns an error of username already exists
  * It then creates a new user with the name, email, organziation,
  *   location, password and request reason
  */
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
            console.log('user org', user.organization);
            console.log('req.body', req.body);
            if (JSON.stringify(user.organization) === JSON.stringify(req.user.organization) || req.user.isAdmin) {
              return next(null, false, {
                message: "Can add existing user",
                user: user
              });
            }
            return next(null, false, {
              message: "Username already exists"
            });
          } else if(!req.body.isStudent) {
            User.findOne({
              'email': req.body.email
            }, (err, user) => {
              if (err) {
                return next(err);
              }
              if (user) {
                return next(null, false, {
                  message: "There already exists a user with that email address."
                });
              }
            });
          }
            console.log('req.body.section', req.body);
            let userSection = {
              sectionId: req.body.sectionId,
              role: req.body.sectionRole
            };
          const {
            name,
            email,
            organization,
            location,
            username,
            password,
            requestReason,
            isStudent,
            createdBy
          } = req.body;
          const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
          const newUser = new User({
            name,
            email,
            organization,
            location,
            username,
            password: hashPass,
            isAuthorized: true,
            requestReason,
            createdBy,
            isStudent,
            sections: [userSection]
          });
          console.log('newUSer', newUser);

          newUser.save((err) => {
            if (err) {
              next(err);
            }
            return next(null, newUser);
          });
        });
      });
    }));


 /* This is the Google Strategy for login and signup
  * It first checks to see if the user has already loggedin with Google
  * If this is the first time it then creates a new User with:
  *   googleId, name, username, email & isAuthorized
  * This allows you to signup with google and then when you return
  *   we already have you in our database
  */
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
  }, (accessToken, refreshToken, profile, done) => {
    User.findOne({
      googleId: profile.id
    }, (err, user) => {
      if (err) {
        return done(err);
      }
      if (user) {
        return done(null, user);
      }

      const newUser = new User({
        googleId: profile.id,
        name: profile.name.givenName + " " + profile.name.familyName,
        username: profile.emails[0].value,
        email: profile.emails[0].value,
        isAuthorized: true
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