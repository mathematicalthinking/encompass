/**
 * # Auth API
 * @description This is the API for passport authentication
 * @author Philip Wisner & Daniel Kelly
 */

//REQUIRE MODULES
const passport = require('passport');
const utils = require('../../middleware/requestHandler');
const crypto = require('crypto');
const models = require('../../datasource/schemas');
const User = models.User;
const nodemailer = require('nodemailer');


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
      if (info.message && info.user && info.message === 'Can add existing user') {
        return utils.sendResponse(res, info);
      }
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

const getResetToken = function(size) {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(size, (err, buf) => {
      if (err) {
        return reject(err);
      }
      const token = buf.toString('hex');
      return resolve(token);
    });
  });
};
/* jshint ignore:start */
const forgot = async function(req, res, next) {
  console.log('in forgot', req.body.email);
  let token;
  let user;
  let savedUser;
  try {
    token = await getResetToken(20);
    console.log('token', token);
    user = await User.findOne({ email: req.body.email });
      if (!user) {
        const msg = {
          info: 'There is no account associated with that email address'};
        return utils.sendResponse(res, msg);
      }

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;
      user.save();
      return next();
  }catch(err) {
    return utils.sendError.InternalError(err, res);
  }
};

module.exports.logout = logout;
module.exports.localLogin = localLogin;
module.exports.localSignup = localSignup;
module.exports.googleAuth = googleAuth;
module.exports.googleReturn = googleReturn;
module.exports.forgot = forgot;
/* jshint ignore:start */