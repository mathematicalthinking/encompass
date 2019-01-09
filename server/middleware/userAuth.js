/**
 * # UserAuth Middleware
 * @description This middleware contains a bunch of functions related to users
 *   It mainly gets the user, protects api paths & loads workspaces
 * @author Daniel Kelly & Philip Wisner
 * @since 2.0.0
 * @todo Remove all the old authentication code
 */

//REQUIRE MODULES
const cookie = require('cookie');
const logger = require('log4js').getLogger('auth');
const _ = require('underscore');
const randomColor = require('randomcolor');
// const axios = require('axios');

//REQUIRE FILES
const path = require('./path');
const utils = require('./requestHandler');
const models = require('../datasource/schemas');

function getUser(req) {
  return req.user;
}

function requireUser(req) {
  var user = getUser(req);
  if (!user) {
    logger.error('user required but not found');
    throw new Error('user required but not found');
  }
  return req.user.toObject();
}


/*
  Pull the token from the request
  Stores the token in req.mf.auth.token
  Presently authorization is cookie based only, however we could switch to a token
  header if/when we run into cross server issues (or mobile, etc)
*/
function processToken(options) {
  function _processToken(req, res, next) {
    if (!path.apiRequest(req)) {
      return next();
    }

    _.defaults(req, {
      mf: {
        auth: {}
      }
    });

    var header = req.header('Cookie');
    if (!header) {
      logger.debug('no token found');
      return (next());
    }

    var key = cookie.parse(header).EncAuth;
    req.mf.auth.token = key;
    logger.trace('token processed: ' + key);

    return (next());
  }

  return (_processToken);
}

/*
  Based on the token set on the request (req.mf.auth.token) this
  pulls the user from the database and stores in req.mf.auth.user
  Updates the user's lastSeen time (findAndModify)
*/
function fetchUser(options) {
  function _fetchUser(req, res, next) {
    if (!path.apiRequest(req)) {
      return next();
    }
   _.defaults(req, {
      mf: {
        auth: {}
      }
    });
    var user = req.user;
    if (!user) {
      logger.warn('no user logged in');
      return (next());
    }

    models.User.findOneAndUpdate({
      username: req.user.username
    }, {
      lastSeen: new Date()
    }, {
      new: true
    }, function (err, user) {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      } else {
        if (user) {
          var url = req.url;
          var len = url.length;
          if (len > 50) {
            url = url.substring(0, 50) + '... (' + len + ')';
          }
          logger.info(user.get('username') + ' ' + req.method + ' ' + url);
          req.mf.auth.user = user.toObject();
          return (next());
        } else {
          return utils.sendError.InvalidCredentialsError('No user with username' + req.user.username, res);
        }
      }
    });
  }

  return (_fetchUser);
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
    _.defaults(req, {
      mf: {
        auth: {}
      }
    });

    var user = getUser(req);

    var openPaths = ['/api/users', '/api/stats', '/api/organizations'];
    // /api/user - people need this to login; allows new users to see the user list
    // /api/stats - nagios checks this
    var openRequest = _.contains(openPaths, req.path);
    //var newOrgRequest = req.path === 'api.organizations' && req.method === 'POST';
    if ((openRequest && req.method === 'GET')) {
      return next();
    }

    var userAuthenticated = req.isAuthenticated && req.isAuthenticated();
    var notAuthenticated = !userAuthenticated;

    if (notAuthenticated) {
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
    var userAuthorized = (userAuthenticated && (user.accountType === 'A' || user.isAuthorized));

    var notAuthorized = !userAuthorized;
    var isGoogleUser = !!user.googleId;

    // users who sign up with google need to be able to update their user info with org, requestReason, and location
    if (notAuthorized && !isGoogleUser) {
      res.redirect('/#/');
      return;
    }
    return next();
  }

  return (_protect);
}

function accessibleWorkspacesQuery(user) {
  return {
    $or: [{
        owner: user
      },
      {
        mode: 'public'
      },
      {
        editors: user
      }
    ],
    isTrashed: false
  };
}

function loadAccessibleWorkspaces(options) {
  function _loadAccessibleWorkspaces(req, res, next) {
    var user = getUser(req);
    var schema = path.getSchema(req);
    if (!user || !path.schemaHasWorkspace(schema)) {
      return (next()); //no user, no workspaces - revisit when public means public
    }
    models.Workspace.find(accessibleWorkspacesQuery(user)).select('_id').lean().exec(function (err, workspaces) {
      if (err) {
        logger.error('user required but not found');
        throw new Error('user required but not found');
      }
      var ids = workspaces.map(function (w) {
        return w._id;
      });
      req.mf.auth.workspaces = ids;
      req.accessibleWorkspaces = ids;
      return (next());
    });
  }

  return (_loadAccessibleWorkspaces);
}


function test(options) {
  function _test(req, res, next) {
    return (next());
  }

  return (_test);
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
  console.log('baseUrl is', baseUrl);
  return baseUrl;
}

module.exports.processToken = processToken;
module.exports.fetchUser = fetchUser;
module.exports.protect = protect;
module.exports.test = test;
module.exports.getUser = getUser;
module.exports.requireUser = requireUser;
module.exports.loadAccessibleWorkspaces = loadAccessibleWorkspaces;
module.exports.accessibleWorkspacesQuery = accessibleWorkspacesQuery;
module.exports.getEmailAuth = getEmailAuth;
module.exports.getUserOrg = getUserOrg;
module.exports.createUserAvatar = createUserAvatar;
module.exports.generateRandomColor = generateRandomColor;
module.exports.splitName = splitName;
