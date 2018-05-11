/*
  Auth plugins for restify
  Protects against updates from anon users
  Caches the user for subsequent auth decisions
  Updates the user's lastSeen time
*/

var mongoose = require('mongoose'),
    cookie   = require('cookie'),
    logger   = require('log4js').getLogger('auth'),
    restify  = require('restify'),
    _        = require('underscore'),
    path     = require('./path'),
    cache    = require('./cache'),
    models   = require('../schemas');

/*
  @returns {Object} user as cached from processToken, fetchUser
  consider protecting against nulls (misconfigured restify plugins)
  consider doing this lazily instead of with plugins
  consider processing the req (token, fetchUser) if not cached
*/
function getUser(req) {
  return req.mf.auth.user;
}

function requireUser(req) {
  var user = getUser(req);
  if(!user) {
    logger.error('user required but not found');
    throw new Error('user required but not found');
  }
  return user;
}


/*
  Pull the token from the request
  Stores the token in req.mf.auth.token

  Presently authorization is cookie based only, however we could switch to a token
  header if/when we run into cross server issues (or mobile, etc)
*/
function processToken(options) {
  function _processToken(req, res, next) {

    if(!path.apiRequest(req)) {
      return next();
    }
    // is this necessary?
    logger.info('procToken: ', req.mf);
    _.defaults(req, { mf: { auth: {} } });

    var header = req.header('Cookie');
    logger.info('procTok: ', header);
    if(!header) {
      logger.debug('no token found');
      return (next());
    }

    // should this handle cases where the
    // EncAuth cookie is undefined?
    var key = cookie.parse(header).EncAuth;
    req.mf.auth.token = key;
    logger.trace('token processed: ' + key);
    logger.info('req.mf: ', req.mf);

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

    if(!path.apiRequest(req)) {
      return next();
    }
    // is this necessary?
    _.defaults(req, { mf: { auth: {} } });

    var token = req.mf.auth.token;
    if(!token) {
      logger.warn('no token found while fetching user, misconfig?');
      return (next());
    }

    models.User.findOneAndUpdate({key: token}, {lastSeen: new Date()}, {}, function(err, user) {
      if(err) {
        logger.error(err);
        return (next(new restify.InternalError(err.message)));
      } else {
        if(user) {
          logger.info('fetchUser req.url: ', req.url);
          var url = req.url;
          var len = url.length;
          if(len > 50) {
            url = url.substring(0,50) + '... (' + len + ')';
          }
          logger.info(user.get('username') + ' ' + req.method + ' ' + url);
          // .toObject() converts mongoose doc into plain js object
          req.mf.auth.user = user.toObject();

          return (next());
        } else {
          var error = new restify.InvalidCredentialsError('No user with key:' + token);
          logger.error(error);
          return (next(error));
        }
      }
    });


  }

  return (_fetchUser);
}

/*
  General layer of protection for all requests
*/
function protect(options) {
  function _protect(req, res, next) {

    // we're not interested in protecting non-api requests
    if(!path.apiRequest(req)) {
      return next();
    }
    // is this necessary?
    _.defaults(req, { mf: { auth: {} } });

    var user = getUser(req);

    var openPaths = ['/api/users', '/api/stats'];
    // /api/user - people need this to login; allows new users to see the user list
    // /api/stats - nagios checks this
    var openRequest = _.contains(openPaths, req.getPath());
    if(openRequest && req.method === 'GET') {
      return next();
    }

    var userAuthz = (user && (user.isAdmin || user.isAuthorized));

    var notAuthn = !user;
    var notAuthz = !userAuthz;

    if(notAuthn) {
      res.setHeader('www-authenticate', 'CasLogin');
      res.send(401);
      return next(false); //stop the chain
    }

    if(notAuthz) {
      res.send(403);
      return next(false); //stop the chain
    }

    return next();
  }

  return (_protect);
}

// returns workspaces where either the user is the
// owner or editor of the ws or if the ws mode is public
function accessibleWorkspacesQuery(user) {
  return {$or: [
    {owner: user},
    {mode: 'public'},
    {editors: user}
  ]};
}

function loadAccessibleWorkspaces(options) {
  function _loadAccessibleWorkspaces(req, res, next) {
    var user = getUser(req);
    var schema = path.getSchema(req);
    if(!user || !path.schemaHasWorkspace(schema)) {
      return (next()); //no user, no workspaces - revisit when public means public
    }
    models.Workspace.find(accessibleWorkspacesQuery(user)).select('_id').lean().exec(function(err, workspaces) {
      var ids = workspaces.map(function (w) {
        return w._id;
      });
      req.mf.auth.workspaces = ids;
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

module.exports.processToken = processToken;
module.exports.fetchUser    = fetchUser;
module.exports.protect      = protect;
module.exports.test         = test;
module.exports.getUser      = getUser;
module.exports.requireUser  = requireUser;
module.exports.loadAccessibleWorkspaces  = loadAccessibleWorkspaces;
module.exports.accessibleWorkspacesQuery = accessibleWorkspacesQuery;
