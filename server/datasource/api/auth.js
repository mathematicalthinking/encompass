/**
 * # Auth API
 * @description This is the API passport authentication
 * @author Philip Wisner & Daniel Kelly
 */

//REQUIRE MODULES
const passport = require('passport');


const localLogin = (req, res, next) => {
  passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '/#/auth/login',
      // failureFlash: true,
      // passReqToCallback: true
  })(req, res, next);
};

const localSignup = (req, res, next) => {
  passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/#/auth/signup',
  })(req, res, next);
};

const googleAuth = (req, res, next) => {
  passport.authenticate('google', {
     scope:["https://www.googleapis.com/auth/plus.login",
     "https://www.googleapis.com/auth/plus.profile.emails.read"
   ]
  })(req,res,next);
};

const googleReturn = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: "/#/login",
    successRedirect: "/"
  })(req, res, next);
};

const logout = (req, res, next) => {
  console.log('LOGGING OUT!');
  req.logout();
  res.redirect('/');
};

module.exports.logout = logout;
module.exports.localLogin = localLogin;
module.exports.localSignup = localSignup;
module.exports.googleAuth = googleAuth;
module.exports.googleReturn = googleReturn;
