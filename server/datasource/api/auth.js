/**
 * # Auth API
 * @description This is the API for passport authentication
 * @author Philip Wisner & Daniel Kelly
 */

//REQUIRE MODULES

const passport = require('passport');
const utils = require('../../middleware/requestHandler');
const crypto = require('crypto');
const axios = require('axios');

const models = require('../../datasource/schemas');
const User = models.User;
const nodemailer = require('nodemailer');
const userAuth = require('../../middleware/userAuth');
const emails = require('../../datasource/email_templates');

const { generateAnonApiToken } = require('../../middleware/mtAuth');

const jwt = require('jsonwebtoken');

const { extractBearerToken, setSsoCookie, setSsoRefreshCookie } = require('../../middleware/mtAuth');
const { getMtSsoUrl } = require('../../middleware/appUrls');
const { areObjectIdsEqual } = require('../../utils/mongoose');

const ssoService = require('../../services/sso');
const { accessCookie, refreshCookie } = require('../../constants/sso');

const localLogin = async (req, res, next) => {
  try {
    let { message, accessToken, refreshToken } = await ssoService.login(req.body);
    if (message) {
      return res.json({message});
    }

    await jwt.verify(accessToken, process.env.MT_USER_JWT_SECRET);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);
    // send back user?

    return res.json({message: 'success'});
  }catch(err) {
    return utils.sendError.InternalError(err, res);
  }
};

const localSignup = async (req, res, next) => {
try {
  let reqUser = userAuth.getUser(req);
  let isFromSignupForm = !reqUser;

  let allowedAccountTypes = [];
  let requestedAccountType = req.body.accountType;

  if (isFromSignupForm) {
    allowedAccountTypes = ['T'];
  } else {
    let creatorAccountType = reqUser.accountType;

    if (creatorAccountType === 'S') {
      // students cannot create other users;
      return utils.sendError.NotAuthorizedError('Your account type is not authorized to create other users');
    }
    if (creatorAccountType === 'T' || creatorAccountType === 'P') {
      allowedAccountTypes = ['S', 'T'];
    } else if (creatorAccountType === 'A') {
      allowedAccountTypes = ['S', 'T', 'P', 'A'];
    }

    let isValidAccountType = allowedAccountTypes.includes(requestedAccountType);

    if (!isValidAccountType) {
      // default to teacher if not valid account type
      // should this return error instead?
      req.body.accountType = 'T';
    }
  }

  let {message, accessToken, refreshToken, encUser, existingUser } = await ssoService.signup(req.body);

  if (message) {
    if (existingUser && !isFromSignupForm) {
      // check if can add existing User
      let existingEncId = existingUser.encUserId;

      let existingEncUser = await User.findById(existingEncId).lean();

      if (existingEncUser === null) {
        // should never happen
        return utils.sendError.InternalError(null, res);
      }

      let canAdd = reqUser.accountType === 'A' || areObjectIdsEqual(reqUser.organization, existingEncUser.organization);

        return res.json({
          message,
          user: existingEncUser,
          canAddExistingUser: canAdd
        });

    }
    return res.json({message});
  }

  if (typeof accessToken === 'string') {
    // accessToken will be undefined if user was created by an already logged in user
    await jwt.verify(accessToken, process.env.MT_USER_JWT_SECRET);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);
  }
  return res.json(encUser);
}catch(err) {
  console.log('err signup', err);
  return utils.sendError.InternalError(err, res);

}

};


const logout = (req, res, next) => {
  res.cookie(accessCookie.name, '', {httpOnly: true, maxAge: 0});
  res.cookie(refreshCookie.name, '', {httpOnly: true, maxAge: 0});

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

const sendEmailSMTP = function(recipient, host, template, token=null, userObj) {
  console.log(`getEmailAuth() return: ${userAuth.getEmailAuth().username}`);
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: userAuth.getEmailAuth().username,
      pass: userAuth.getEmailAuth().password
    }
  });
  const msg = emails[template](recipient, host, token, userObj);
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

const sendEmailsToAdmins = async function(host, template, relatedUser) {
  try {
    let adminCrit = {
      isTrashed: false,
      accountType: 'A',
      email: { $exists: true, $ne: null },
    };
    let admins = await User.find(adminCrit).lean().exec();
    if (!Array.isArray(admins)) {
      return;
    }

    // relatedUser is who the email is about, i.e. if a new user signed up
    admins.forEach((user) => {
      if (user.email) {
        sendEmailSMTP(user.email, host, template, null, relatedUser);
      }
    });

  }catch(err) {
    console.error(`Error sendEmailsToAdmins: ${err}`);
  }

};

const forgot = async function(req, res, next) {
  try {
    let ssoUrl = `${getMtSsoUrl()}/auth/forgot/password`;

    let token = await generateAnonApiToken();

    let config = {
      headers: { Authorization: 'Bearer ' + token },
    };

    let results = await axios.post(ssoUrl, req.body, config);
    return utils.sendResponse(res, results.data);
  }catch(err) {
    console.error(`Error auth/forgot: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }
};

const validateResetToken = async function(req, res, next) {
  try {
    let ssoUrl = `${getMtSsoUrl()}/auth/reset/password/${req.params.token}`;

    let token = await generateAnonApiToken();

    let config = {
      headers: { Authorization: 'Bearer ' + token },
    };

    let results = await axios.get(ssoUrl, config);
    return utils.sendResponse(res, results.data);

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
      return utils.sendError.NotAuthorizedError('You are not authorized.', res);
    }

    let ssoUrl = `${getMtSsoUrl()}/auth/reset/password/user`;

    let token = await generateAnonApiToken();

    let config = {
      headers: { Authorization: 'Bearer ' + token },
    };

    let results = await axios.post(ssoUrl, req.body, config);
    return utils.sendResponse(res, results.data);

    }catch(err) {
      return utils.sendError.InternalError(err, res);
    }
  };

const resetPassword = async function(req, res, next) {
  try {
    let ssoUrl = `${getMtSsoUrl()}/auth/reset/password/${req.params.token}`;

    let token = await generateAnonApiToken();

    let config = {
      headers: { Authorization: 'Bearer ' + token },
    };

    let results = await axios.post(ssoUrl, req.body, config);

    let { user, accessToken, refreshToken } = results.data;

    await jwt.verify(accessToken, process.env.MT_USER_JWT_SECRET);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken );

    return utils.sendResponse(res, user);
  }catch(err) {
    console.error(`Error resetPassword: ${err}`);
    console.trace();
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

const resendConfirmationEmail = async function(req, res, next) {
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
    await sendEmailSMTP(savedUser.email, req.headers.host, 'confirmEmailAddress', token, savedUser);
    return utils.sendResponse(res, {
     isSuccess: true,
     info: `Email has been sent to ${userRec.email} with instructions for email confirmation.`
   });

  }catch(err) {
    return utils.sendError.InternalError(err, res);
  }
};

const insertNewMtUser = async (req, res, next) => {
  try {
    let authToken = extractBearerToken(req);

    await jwt.verify(authToken, process.env.MT_USER_JWT_SECRET);

    let newUser = await User.create(req.body);
    return utils.sendResponse(res, newUser);
  }catch(err) {
    // invalid token
    console.log('Error insertNewMtUser: ', err);
    return utils.sendError.InvalidCredentialsError('Unauthorized request', res);
  }
};

module.exports.logout = logout;
module.exports.localLogin = localLogin;
module.exports.localSignup = localSignup;
module.exports.forgot = forgot;
module.exports.validateResetToken = validateResetToken;
module.exports.resetPassword = resetPassword;
module.exports.resetPasswordById = resetPasswordById;
module.exports.confirmEmail = confirmEmail;
module.exports.getResetToken = getResetToken;
module.exports.sendEmailSMTP = sendEmailSMTP;
module.exports.resendConfirmationEmail = resendConfirmationEmail;
module.exports.sendEmailsToAdmins = sendEmailsToAdmins;
module.exports.insertNewMtUser = insertNewMtUser;