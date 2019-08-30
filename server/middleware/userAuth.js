/**
 * # UserAuth Middleware
 * @description This middleware contains a bunch of functions related to users
 *   It mainly gets the user, protects api paths & loads workspaces
 * @author Daniel Kelly & Philip Wisner
 * @since 2.0.0
 */

//REQUIRE MODULES
const logger = require('log4js').getLogger('auth');
const _ = require('underscore');
const randomColor = require('randomcolor');
// const axios = require('axios');

//REQUIRE FILES
const path = require('./path');
const utils = require('./requestHandler');
const models = require('../datasource/schemas');

function getUser(req) {
  return req.mt.auth.encUser;
}

function requireUser(req) {
  let user = getUser(req);

  if (user === null) {
    logger.error('user required but not found');
    throw new Error('user required but not found');
  } else {
    return user;
  }

}

function determineStudentAccess(user, path, method) {
  if (!user) {
    return;
  }

  const {accountType, actingRole} = user;

  if (accountType !== 'S' && actingRole !== 'student') {
    return true;
  }
  const forbiddenGetPaths = [];
  const forbiddenPostPutPaths = ['sections', 'assignments', 'organizations', 'categories', 'copyWorkspaceRequests', 'problems'];

  if (method === 'GET') {
    // students currently cannot make any requests related to workspaces
    let isForbiddenPath = _.any(forbiddenGetPaths, (p) => {
      return path.includes(p);
    });
    return !isForbiddenPath;

  } else {
    // students currently can only make POST/PUT requests to /answers, /image
    let isForbiddenPath = _.any(forbiddenPostPutPaths, (p) => {
      return path.includes(p);
    });
    return !isForbiddenPath;
  }
}

/*
  General layer of protection for all requests
*/
function protect(options) {
  function _protect(req, res, next) {
    // we're not interested in protecting non-api requests
    if (!path.apiRequest(req)) {
      return next();
    }

    let user = getUser(req);


    let openPaths = ['/api/users', '/api/organizations'];
    // /api/user - people need this to login; allows new users to see the user list
    // /api/organizations - need to see existing orgs when signing up

    let openRequest = _.contains(openPaths, req.path);
    //var newOrgRequest = req.path === 'api.organizations' && req.method === 'POST';
    if ((openRequest && req.method === 'GET')) {
      return next();
    }

    let isAuthenticated = user !== null;

    if (!isAuthenticated) {
      return utils.sendError.InvalidCredentialsError('You are not Authenticated.', res);
    }

    if (user.accountType === 'S' || user.actingRole === 'student') {
     let isAllowed = determineStudentAccess(user, req.path, req.method);
     if (isAllowed) {
      return next();
     }
     return utils.sendError.NotAuthorizedError('You are not Authorized.', res);
    }

    // will only reach here if non-student
    let userAuthorized = (isAuthenticated && (user.accountType === 'A' || user.isAuthorized));

    let notAuthorized = !userAuthorized;
    let isGoogleUser = !!user.googleId;

    // users who sign up with google need to be able to update their user info with org, requestReason, and location
    if (notAuthorized && !isGoogleUser) {
      res.redirect('/#/');
      return;
    }
    return next();
  }

  return (_protect);
}

function getEmailAuth() {
  let emailUsername = process.env.GMAIL_USERNAME;
  if (!emailUsername) {
    emailUsername = process.env.TEST_GMAIL_USERNAME;
    if (!emailUsername) {
      console.error(`Missing TEST_GMAIL_USERNAME .env variable`);
    }
  }
  let emailPassword = process.env.GMAIL_PASSWORD;
  if (!emailPassword) {
    emailPassword = process.env.TEST_GMAIL_PASSWORD;
    if (!emailPassword) {
      console.error(`Missing TEST_GMAIL_PASSWORD .env variable`);
    }
  }
  return ({"username": emailUsername, "password": emailPassword});
}

function getUserOrg(userId) {
  return models.User.findById(userId).lean().exec().then((user) => {
    if (user) {
      return user.organization;
    }
  });
}

function generateRandomColor(luminosity, hue, format, count, alpha) {
  return randomColor({
    luminosity,
    count,
    hue,
    format,
    alpha,
  });
}

function splitName(name) {
  return name.split(" ").join("+");
}

function createUserAvatar(name) {
  const bgColor = generateRandomColor('light', null, null, null, null);
  const bgString = bgColor.substring(1);
  const formattedName = splitName(name);
  const baseUrl = `https://ui-avatars.com/api/?rounded=true&color=ffffff&background=${bgString}&name=${formattedName}`;
  return baseUrl;
}

module.exports.protect = protect;
module.exports.getUser = getUser;
module.exports.requireUser = requireUser;
module.exports.getEmailAuth = getEmailAuth;
module.exports.getUserOrg = getUserOrg;
module.exports.createUserAvatar = createUserAvatar;
module.exports.generateRandomColor = generateRandomColor;
module.exports.splitName = splitName;
