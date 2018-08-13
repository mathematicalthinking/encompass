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
const auth = require('../datasource/api/auth');

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
        let isStudent = req.body.accountType === 'S';
        User.findOne({
          'username': username
        }, (err, user) => {
          if (err) {
            return next(err);
          }

          if (user) {
            console.log('user org', user.organization);
            console.log('req.body', req.body);
            let isAdmin = req.user.accountType === 'A';
            if (JSON.stringify(user.organization) === JSON.stringify(req.user.organization) || isAdmin) {
              return next(null, false, {
                message: "Can add existing user",
                user: user
              });
            }
            return next(null, false, {
              message: "Username already exists"
            });
          } else if(!isStudent) {
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
            // When a user is first created, they should only ever have 0 or 1 sections as of now
            // If its a student being added to a section, they will have that sectionId and role student
            // If a user has just signed up through the signup form, they will not be in any sections, so sections should
            // just be an empty array

            let userSections = [];
            if (req.body.sectionId) {
              let section = {
                sectionId: req.body.sectionId,
                role: req.body.sectionRole
              };
              userSections.push(section);
            }

          const {
            name,
            email,
            organization,
            location,
            username,
            password,
            isAuthorized,
            requestReason,
            accountType,
            createdBy,
            authorizedBy,
          } = req.body;
          const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
          const newUser = new User({
            name,
            email,
            organization,
            location,
            username,
            password: hashPass,
            isAuthorized,
            requestReason,
            accountType,
            sections: userSections,
            createdBy,
            authorizedBy,
          });
          console.log('newUSer', newUser);

          // students don't have emails
          if (newUser.accountType !== 'S') {
            // generate confirmEmailToken && confirmEmailExpires
          // send email upon successfull save
            auth.getResetToken(20).then((token) => {
              newUser.confirmEmailToken = token;
              newUser.confirmEmailExpires = Date.now() + 86400000; //1 day

              newUser.save((err) => {
                if (err) {
                  next(err);
                }
                auth.sendEmailSMTP(newUser.email, req.headers.host, 'confirmEmailAddress', token).then((res) => {
                  console.log('email send success');
                  return next(null, newUser);
                })
                .catch((err) => {
                  console.log('error sending email', err);
                });

              });
            })
            .catch((err) => {
              console.log(err);
            });
          } else {
            newUser.save((err) => {
              if (err) {
                next(err);
              }
            });
          }
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
        isAuthorized: false,
        accountType: 'T'
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