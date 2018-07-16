/**
 * # Auth API
 * @description This is the API for passport authentication
 * @author Philip Wisner & Daniel Kelly
 */

//REQUIRE MODULES
const passport = require('passport');
const utils = require('../../middleware/requestHandler');


const localLogin = (req, res, next) => {
  console.log('inside local login');
  passport.authenticate('local-login', {
      // failureRedirect: '/#/auth/login',
      // failureFlash: true,
      // passReqToCallback: true,
      //failwithError: true,
  },
function(err, user, info) {
  console.log('info', info);
  if (err) {
    return next(err);
  }

  if (!user) {return utils.sendResponse(res, info);}
  req.logIn(user, function(err) {
    if (err) { return next(err); }
    return utils.sendResponse(res, user);
  });
}
)(req, res, next);
};

const localSignup = (req, res, next) => {
 console.log('in localsignup :', req.body);
  passport.authenticate('local-signup', {
      // successRedirect: '/',
      // failureRedirect: '/#/auth/signup',
  },
  function (err, user, info) {
    console.log('info', info);
    if (err) {
      console.log('err: ', err);
      return next(err);
    }

    if (!user) {
      console.log('user: ', user);
      return utils.sendResponse(res, info);
    }
    return utils.sendResponse(res, user);
    // console.log('user', user);
    // req.logIn(user, function (err) {
    //   if (err) {
    //     return next(err);
    //   }
    //   return utils.sendResponse(res, user);
    // });
  }
)(req, res, next);
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
