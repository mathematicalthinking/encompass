/**
 * # Auth API
 * @description This is the API for passport authentication
 * @author Philip Wisner & Daniel Kelly
 */

//REQUIRE MODULES

const crypto = require('crypto');
const nodemailer = require('nodemailer');

const models = require('../../datasource/schemas');
const User = models.User;
const userAuth = require('../../middleware/userAuth');
const emails = require('../../datasource/email_templates');
const utils = require('../../middleware/requestHandler');
const { verifyJwt } = require('../../utils/jwt');

const { clearAccessCookie, clearRefreshCookie } = require('../../middleware/mtAuth');


const { extractBearerToken, setSsoCookie, setSsoRefreshCookie } = require('../../middleware/mtAuth');
const { areObjectIdsEqual } = require('../../utils/mongoose');

const ssoService = require('../../services/sso');

const localLogin = async (req, res, next) => {
  try {
    let { message, accessToken, refreshToken } = await ssoService.login(req.body);
    if (message) {
      return res.json({message});
    }

    // do we need to verify the accessToken
    // should always be valid coming from the sso server
    // await jwt.verify(accessToken, process.env.MT_USER_JWT_SECRET);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);
    // send back user?

    return res.json({message: 'success'});
  }catch(err) {
    utils.handleError(err, res);
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

  let {message, accessToken, refreshToken, encUser, existingUser } = await ssoService.signup(req.body, reqUser);

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
    // await jwt.verify(accessToken, process.env.MT_USER_JWT_SECRET);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);
  }
  return res.json(encUser);
}catch(err) {
  console.log('err signup', err);
  utils.handleError(err, res);

}

};


const logout = (req, res, next) => {
  clearAccessCookie(res);
  clearRefreshCookie(res);
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
    let results = await ssoService.forgotPassword(req.body);
    return utils.sendResponse(res, results);
  }catch(err) {
    console.error(`Error auth/forgot: ${err}`);
    console.trace();
    utils.handleError(err, res);
  }
};

const validateResetToken = async function(req, res, next) {
  try {
    let results = await ssoService.validateResetPasswordToken(req.params.token);
    return utils.sendResponse(res, results);

  }catch(err) {
    utils.handleError(err, res);
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

    let results = await ssoService.resetPasswordById(req.body, reqUser);
    return utils.sendResponse(res, results);

    }catch(err) {
      utils.handleError(err, res);
    }
  };

const resetPassword = async function(req, res, next) {
  try {


    let { user, accessToken, refreshToken, message } = await ssoService.resetPassword(req.body, req.params.token);

    if (message) {
      res.json(message);
      return;
    }
    // await jwt.verify(accessToken, process.env.MT_USER_JWT_SECRET);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken );

    return utils.sendResponse(res, user);
  }catch(err) {
    console.error(`Error resetPassword: ${err}`);
    console.trace();
    utils.handleError(err, res);
  }
};

const confirmEmail = async function(req, res, next) {
  try {
      let results = await ssoService.confirmEmail(req.params.token);

      return utils.sendResponse(res, results);
  }catch(err) {
    console.log('err conf em: ', err.message);
    utils.handleError(err, res);
  }
};

const resendConfirmationEmail = async function(req, res, next) {
  try {
    let reqUser = userAuth.getUser(req);
    let results = await ssoService.resendConfirmEmail(reqUser);
    return utils.sendResponse(res, results);

  }catch(err) {
    console.log('err resend conf: ', err.message);
    utils.handleError(err, res);
  }
};

const insertNewMtUser = async (req, res, next) => {
  try {
    let authToken = extractBearerToken(req);

    await verifyJwt(authToken, process.env.MT_USER_JWT_SECRET);

    // valid token
    let newUser = await User.create(req.body);
    return utils.sendResponse(res, newUser);
  }catch(err) {
    console.log('Error insertNewMtUser: ', err);
    utils.handleError(err, res);
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