/* eslint-disable no-use-before-define */
/**
 * # Auth API
 * @description This is the API for authentication
 * @author Philip Wisner & Daniel Kelly
 */

//REQUIRE MODULES

const crypto = require('crypto');
const nodemailer = require('nodemailer');
const fs = require('fs');
const { propertyOf } = require('underscore');

const models = require('../../datasource/schemas');
const User = models.User;
const userAuth = require('../../middleware/userAuth');
const emails = require('../../datasource/email_templates');
const utils = require('../../middleware/requestHandler');
const { verifyJwt } = require('../../utils/jwt');

const { clearAccessCookie, clearRefreshCookie } = require('../../middleware/mtAuth');


const { extractBearerToken, setSsoCookie, setSsoRefreshCookie } = require('../../middleware/mtAuth');
const { areObjectIdsEqual } = require('../../utils/mongoose');
const { isNil } = require('../../utils/objects');

const ssoService = require('../../services/sso');

let secret;
if (process.env.NODE_ENV === 'seed') {
  secret = process.env.MT_USER_JWT_SECRET_TEST;
} else {
  secret = process.env.MT_USER_JWT_SECRET;
}


const localLogin = async (req, res) => {
  try {
    let { message, accessToken, refreshToken } = await ssoService.login(req.body);
    if (message) {
      return res.json({ message });
    }

    // do we need to verify the accessToken
    // should always be valid coming from the sso server
    // await jwt.verify(accessToken, process.env.MT_USER_JWT_SECRET);

    setSsoCookie(res, accessToken);
    setSsoRefreshCookie(res, refreshToken);
    // send back user?
    return res.json({ message: 'success' });
  }catch(err) {
    utils.handleError(err, res);
  }
};

const localSignup = async (req, res, next) => {
try {
  let reqUser = userAuth.getUser(req);
  let isFromSignupForm = !reqUser;
  let { isFromSectionPage } = req.body;

  delete req.body.isFromSectionPage;

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
    let userSections = [];
    if (req.body.sectionId) {
      let section = {
        sectionId: req.body.sectionId,
        role: req.body.sectionRole
      };
      userSections.push(section);
      req.body.sections = userSections;
      delete req.body.sectionId;
      delete req.body.sectionRole;
    }
  }

  let {message, accessToken, refreshToken, encUser, existingUser } = await ssoService.signup(req.body, reqUser);

  if (message) {
    if (existingUser && isFromSectionPage) {
      // check if can add existing User
      let existingEncId = existingUser.encUserId;

      let existingEncUser = await User.findById(existingEncId).lean();

      if (existingEncUser === null) {
        // should never happen
        return utils.sendError.InternalError(null, res);
      }

      let canAdd = reqUser.accountType === 'A' || areObjectIdsEqual(reqUser.organization, existingEncUser.organization);

      if (canAdd) {
        return res.json({
          user: existingEncUser,
          canAddExistingUser: true
        });
      }

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
  let username = userAuth.getEmailAuth().username;
  let password = userAuth.getEmailAuth().password;

  return resolveTransporter(username, password)
  .then((smtpTransport) => {
    const msg = emails[template](recipient, host, token, userObj);
    let mailUsername = propertyOf(smtpTransport)(['options.auth.user']);

    return new Promise( (resolve, reject) => {
      smtpTransport.sendMail(msg, (err) => {
        if (err) {
          let errorMsg = `Error sending email (${template}) to ${recipient} from ${mailUsername}: ${err}`;
          console.error(errorMsg);
          console.trace();
          return reject(errorMsg);
        }
        let msg = `Email (${template}) sent successfully to ${recipient} from ${mailUsername}`;
      return resolve(msg);
    });
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

      // do not send user object back if user was not already logged in
      let reqUser = userAuth.getUser(req);
      let isNotLoggedIn = isNil(reqUser);

      if (isNotLoggedIn) {
        delete results.user;
      }

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

    await verifyJwt(authToken, secret);

    // valid token
    let newUser = await User.create(req.body);
    return utils.sendResponse(res, newUser);
  }catch(err) {
    console.log('Error insertNewMtUser: ', err);
    utils.handleError(err, res);
  }
};

const ssoUpdateUser = async(req, res, next) => {
  try {
    let authToken = extractBearerToken(req);
    await verifyJwt(
    authToken,
    secret
   );
   let user = await User.findByIdAndUpdate(req.params.id, {$set: req.body}, {new: true});
   return res.json(user);
  }catch(err) {
    utils.handleError(err, res);
  }

};

const resolveTransporter = function(
  username,
  password,
) {
  return new Promise(
    (resolve, reject) => {
      let isTestEnv = process.env.NODE_ENV === 'seed';

      if (isTestEnv) {
        nodemailer.createTestAccount(
          (err, account) => {
            // create reusable transporter object using the default SMTP transport
            if (err) {
              reject(err);
            } else {
              // in case we want to look at the sent emails
              let fileName = 'ethereal_creds.json';
              fs.writeFile(
                fileName,
                JSON.stringify({
                  user: account.user,
                  pass: account.pass,
                }),
                (err) => {
                  if (err) {
                    throw err;
                  }
                  console.log('Ethereal creds saved to ', fileName);
                },
              );

              resolve(
                nodemailer.createTransport({
                  host: 'smtp.ethereal.email',
                  port: 587,
                  secure: false, // true for 465, false for other ports
                  auth: {
                    user: account.user, // generated ethereal user
                    pass: account.pass, // generated ethereal password
                  },
                }),
              );
            }
          },
        );
      } else {
        if (typeof username !== 'string') {
          return reject(new Error('Missing gmail username'));
        }

        if (typeof password !== 'string') {
          return reject(new Error('Missing gmail password'));
        }

        resolve(
          nodemailer.createTransport({
            service: 'Gmail',
            auth: {
              user: username,
              pass: password,
            },
          }),
        );
      }
    },
  );
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
module.exports.ssoUpdateUser = ssoUpdateUser;