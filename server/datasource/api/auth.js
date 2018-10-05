/**
 * # Auth API
 * @description This is the API for passport authentication
 * @author Philip Wisner & Daniel Kelly
 */

//REQUIRE MODULES
/* jshint ignore:start */
const passport = require('passport');
const utils = require('../../middleware/requestHandler');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const models = require('../../datasource/schemas');
const User = models.User;
const nodemailer = require('nodemailer');
const userAuth = require('../../middleware/userAuth');
const emails = require('../../datasource/email_templates');


const localLogin = (req, res, next) => {
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
  passport.authenticate('local-signup', {
      // successRedirect: '/',
      // failureRedirect: '/#/auth/signup',
  },
  function (err, user, info) {
    if (err) {
      console.error('localSignup error: ', err);
      console.trace();
      return next(err);
    }

    if (!user) {
      if (info.message && info.user && info.message === 'Can add existing user') {
        return utils.sendResponse(res, info);
      }
      return utils.sendResponse(res, info);
    }
    if(!req.user) {
      req.logIn(user, function(err) {
        if (err) { return next(err); }
        //return utils.sendResponse(res, user);
        return next(null, user);
      });
    }
    return utils.sendResponse(res, user);
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

const sendEmailSMTP = function(recipient, host, template, token=null) {
  console.log(`getEmailAuth() return: ${userAuth.getEmailAuth().username}`);
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: userAuth.getEmailAuth().username,
      pass: userAuth.getEmailAuth().password
    }
  });

  const msg = emails[template](recipient, host, token);
    return new Promise( (resolve, reject) => {
      smtpTransport.sendMail(msg, (err) => {
        if (err) {
          let errorMsg = `Error sending email (${template}) to ${recipient} from ${userAuth.getEmailAuth().username}: ${err}`;
          console.error(errorMsg);
          console.trace();
          return reject(errorMsg);
        }
        let msg = `Email (${template}) sent successfully to ${recipient} from ${userAuth.getEmailAuth().username}`;
      return resolve(msg);
    });
  });
};

const forgot = async function(req, res, next) {
  let token;
  let user;

  try {
    token = await getResetToken(20);
    let { email, username } = req.body;

    if (email) {
      user = await User.findOne({ email });
      if (!user) {
        const msg = {
          info: 'There is no account associated with that email address',
          isSuccess: false
        };
        return utils.sendResponse(res, msg);
      }
    } else if (username) {
      user = await User.findOne({ username });
      if (!user) {
        const msg = {
          info: 'There is no account associated with that username',
          isSuccess: false
        };
        return utils.sendResponse(res, msg);
      }
    }


      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 3600000;

      await user.save();
      // should we assume all users have emails?
      if (!email) {
        if (user.email) {
          email = user.email;
        } else {
          const msg = {
            info: 'You must have an email address associated with your EnCoMPASS account in order to reset your password',
            isSuccess: false
          };
          return utils.sendResponse(res, msg);
        }

      }

      await sendEmailSMTP(email, req.headers.host, 'resetTokenEmail', token);

      return utils.sendResponse(res, {'info': `Password reset email sent to ${email}`, isSuccess: true});
  }catch(err) {
    console.error(`Error auth/forgot: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }
};

const validateResetToken = async function(req, res, next) {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now()}});

    if (!user) {
      return utils.sendResponse(res, {info: 'Password reset token is invalid or has expired', isValid: false});
    }
    return utils.sendResponse(res, { info: 'valid token', isValid: true });

  }catch(err) {
    return utils.sendError.InternalError(err, res);
  }
};

const resetPasswordById = async function(req, res, next) {
  try {
    const reqUser = userAuth.getUser(req);

    // need to be admin or be teacher and resetting one of your students
    //TODO: update this to only let you reset one of your student's passwords
    const hasPermission = reqUser && !reqUser.isStudent;

    if (!hasPermission) {
      return utils.sendError.NotAuthorizedError(err, res);
    }

    const { id, password } = req.body;

    if (!id || !password) {
      const err = {
        info: 'Invalid user id or password'
      };
      return utils.sendError.InvalidArgumentError(err, res);
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return utils.sendResponse(res, {
        info: 'Cannot find user'
      });
    }

    const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(12), null);
    user.password = hashPass;
    user.lastModifiedBy = reqUser.id;
    user.lastModifiedDate = Date.now();

    let actingRole = user.actingRole;
    let accountType = user.accountType;

    if (!actingRole && accountType !== 'S') {
      user.actingRole = 'teacher';
    }

    // should we store most recent password and block that password in future? or all past passwords and block all of them?

    await user.save();

    return utils.sendResponse(res, user);

    }catch(err) {
      return utils.sendError.InternalError(err, res);
    }
  };

const resetPassword = async function(req, res, next) {
  try {
    const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
    if (!user) {
      return utils.sendResponse(res, {
        info: 'Password reset token is invalid or has expired.'
      });
    }

    const hashPass = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(12), null);
    user.password = hashPass;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    req.logIn(user, (err) => {
      if (err) {
        return utils.sendError.InternalError(err, res);
      }
      return utils.sendResponse(res, user);
    });

  }catch(err) {
    console.log(err);
    return utils.sendError.InternalError(err, res);
  }
};

const confirmEmail = async function(req, res, next) {
  try {
    const user = await User.findOne({ confirmEmailToken: req.params.token, confirmEmailExpires: { $gt: Date.now() } });
    if (!user) {
      return utils.sendResponse(res, {
        isValid: false,
        info: 'Confirm email token is invalid or has expired.'
      });
    }

      user.isEmailConfirmed = true;
      user.confirmEmailToken = undefined;
      user.confirmEmailExpires = undefined;

      const savedUser = await user.save();

      const data = {
        isValid: true,
        isEmailConfirmed: savedUser.isEmailConfirmed
      };
      return utils.sendResponse(res, data);
  }catch(err) {
    return utils.sendError.InternalError(err, res);
  }
};

resendConfirmationEmail = async function(req, res, next) {
  const user = userAuth.getUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError(null, res);
  }

  try {
    let userRec = await models.User.findById(user._id);
    const token = await getResetToken(20);

    userRec.confirmEmailToken = token;
    userRec.confirmEmailExpires = Date.now() + 86400000; // 1 day
    let savedUser = await userRec.save();
    await sendEmailSMTP(savedUser.email, req.headers.host, 'confirmEmailAddress', token);
    return utils.sendResponse(res, {
     isSuccess: true,
     info: `Email has been sent to ${userRec.email} with instructions for email confirmation.`
   });

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
module.exports.validateResetToken = validateResetToken;
module.exports.resetPassword = resetPassword;
module.exports.resetPasswordById = resetPasswordById;
module.exports.confirmEmail = confirmEmail;
module.exports.getResetToken = getResetToken;
module.exports.sendEmailSMTP = sendEmailSMTP;
module.exports.resendConfirmationEmail = resendConfirmationEmail;
/* jshint ignore:end */