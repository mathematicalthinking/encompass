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
const LocalStrategy = require('passport-local').Strategy;
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const auth = require('../datasource/api/auth');
const userAuth = require('../../server/middleware/userAuth');

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
      // crashes app if user.password does not exist
      // users should always have a password if they are in db
      if ( !user.password || !bcrypt.compareSync(password, user.password)) {
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
        const isFromSignupForm = !req.user;
        let newUserType;
        let creatorType;
        if (!isFromSignupForm) {
          creatorType = req.user.accountType;
          newUserType = req.body.accountType;
        } else {
          newUserType = 'T';
        }

        // let isStudent = req.body.accountType === 'S';

        User.findOne({
          'username': username
        }, (err, user) => {
          if (err) {
            return next(err);
          }

          if (user) {
            console.log('USER ALREADY EXISTS', user);

            // let isAdmin = req.user.accountType === 'A';

            if (!isFromSignupForm) {
              if ((JSON.stringify(user.organization) === JSON.stringify(req.user.organization)) || creatorType === 'A') {
                return next(null, false, {
                  message: "Can add existing user",
                  user: user
                });
              }
            }

            return next(null, false, {
              message: "Username already exists"
            });
          } else {
            if (newUserType !== 'S') {
              User.findOne({
                'email': req.body.email, 'accountType': {$ne: 'S'}
              }, (err, user) => {
                if (err) {
                  return next(err);
                }
                if (user) {
                  console.log('EMAIL IN USE ALREADY!!');
                  return next(null, false, {
                    message: "There already exists a user with that email address."
                  });
                } else {
                  // When a user is first created, they should only ever have 0 or 1 sections as of now
                  // If its a student being added to a section, they will have that sectionId and role student
                  // If a user has just signed up through the signup form, they will not be in any sections, so sections should
                  // just be an empty array

                  let userSections = [];
                  if (req.body.sectionId) {
                    console.log('in sectionid if', req.body.sectionId);
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
                    organizationRequest,
                    location,
                    username,
                    password,
                    isAuthorized,
                    requestReason,
                    accountType,
                    createdBy,
                    authorizedBy,
                    isEmailConfirmed,
                  } = req.body;

                  const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);

                  const newUser = new User({
                    name,
                    email,
                    organization,
                    organizationRequest,
                    location,
                    username,
                    password: hashPass,
                    isAuthorized,
                    requestReason,
                    accountType,
                    sections: userSections,
                    createdBy,
                    authorizedBy,
                    isEmailConfirmed,
                    actingRole: 'teacher'
                  });

                  // generate confirmEmailToken && confirmEmailExpires
                  // send email upon successfull save
                  auth.getResetToken(20).then((token) => {
                    newUser.confirmEmailToken = token;
                    newUser.confirmEmailExpires = Date.now() + 86400000; //1 day

                    newUser.save((err) => {
                      if (err) {
                        next(err);
                      }
                      // send email to new user asking to confirm email
                      auth.sendEmailSMTP(newUser.email, req.headers.host, 'confirmEmailAddress', token);

                      // send email to encompass main email notifying new user signup
                      auth.sendEmailSMTP(userAuth.getEmailAuth().username, req.headers.host, 'newUserNotification');

                      return next(null, newUser);


                    });
                  })
                .catch((err) => {
                  console.error(`Error local-signup: ${err}`);
                  console.trace();
                });
              }
            });
          } else {
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
                    organizationRequest,
                    location,
                    username,
                    password,
                    isAuthorized,
                    requestReason,
                    accountType,
                    createdBy,
                    authorizedBy,
                    isEmailConfirmed,
                  } = req.body;

                  const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);

                  const newUser = new User({
                    name,
                    email,
                    organization,
                    organizationRequest,
                    location,
                    username,
                    password: hashPass,
                    isAuthorized,
                    requestReason,
                    accountType,
                    sections: userSections,
                    createdBy,
                    authorizedBy,
                    isEmailConfirmed,
                  });
            newUser.save((err) => {
              if (err) {
                next(err);
              }
              return next(null, newUser);

            });
          }
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
  let callbackURL;

  if (process.env.NODE_ENV === 'production') {
    callbackURL = process.env.GOOGLE_CALLBACK_URL_PROD;
    console.log(`production`);
  } else if (process.env.NODE_ENV === 'staging') {
      callbackURL = process.env.GOOGLE_CALLBACK_URL_STAGING;
      console.log(`staging`);
    } else {
    callbackURL = "/auth/google/callback";
    console.log(`other environment`);
  }
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`callbackURL: ${callbackURL}`);

  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: callbackURL
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
        accountType: 'T',
        actingRole: 'teacher',
        isEmailConfirmed: true
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