/**
  * # CAS Login API
  * @description This is the API for logging into Encompass via CAS
  * @authors Amir Tahvildaran <amir@mathforum.org>, Damola Mabogunje <damola@mathforum.org>
  * @since 1.0.0
  * @todo Integrate this with the api module using best practices
  */
var config   = require('./config'),
    //CAS      = require('cas'),
    logger   = require('log4js').getLogger('mfcas'),
    Q        = require('q'),
    uuid     = require('node-uuid'),
    cookie   = require('cookie'),
    util     = require('util'),
    models   = require('./datasource/schemas'),
    cache    = require('./datasource/api/cache'),
    request  = require('request'),
    SUCCESS  = "Success";

var ssoConf = config.nconf.get('sso');
var webConf = config.nconf.get('web');

//just send the user to cas
function login(req, res, next) {
  /* jshint camelcase: false */
  logger.debug("SSO base url: " + ssoConf.baseUrl );
  res.header('Location', ssoConf.baseUrl + '/NCTM-TMF-Login-Page/?SsoReturnType=tmf&SsoReturnUrl='+ssoConf.service);
  res.send(301);
}

function logout(req, res, next) {
  /* jshint camelcase: false */
  // drop the cookie
  res.header('Set-Cookie', cookie.serialize('EncAuth', 'deleted', {path: '/', expires: new Date(0)}));
  // send the user to cas
  res.header('Location', ssoConf.baseUrl + '/logout');
  res.send(301);
}

/*
  handle the return from cas
  we'll have a token parameter that we validate and get the username from
  we issue a key for them, a uuid cookie: EncAuth
  and store that key in the DB with their user record (which we create on the fly if necessary)
 */
function back(req, res, next) {
  var userManager = models.User;
  var findUser = Q.nbind(userManager.findOne, userManager);
  var updateUser = Q.nbind(userManager.update, userManager);
  var start = new Date();
  var token = req.query.token;
  var username = req.query.tmfUserName;

  // tmp for testing
  if( username === '206008' ){
    username = "arm353";
  }

  logger.warn('token:'+token + ', user: ' + username);
  if(token) {

    // http://dev.nctm.org/SSO/TmfCheckToken.ashx
    var reqObj = {
      url: ssoConf.baseUrl + ssoConf.validateUrl + "?token=" + token,
      json: {"token": token}
    };

    logger.warn("Validating token at: " + reqObj.url );

    // validate token
    request.post( reqObj, function( err, resp, body ){
      if( err || (body.indexOf( SUCCESS ) === -1) ){
        logger.warn( err );
        res.send({error: "Could not validate user, invalid SSO token.", response: body});
        return;
      }

      logger.info('validated token');
      //Authenticated guest/unknown user
      var guest = models.User({
        username: username.toLowerCase(),
        name: username,
        key: uuid.v4(),
      });

      // Return user if passed, otherwise return guest
      var getUser = function(user) {
        logger.info('user param in getUser', user);
        return (user) ? user : guest;
      };

       // Give user a session cookie
      var startSession = function(record) {
        logger.info('Set new cookie');
        res.header('Set-Cookie', cookie.serialize('EncAuth', guest.key, {path: '/'}));
        res.header('Location', webConf.base);
        res.send(301);
      };

      // Get User > Update History > Import Submissions > Login User > Start Session
      logger.info('Find user ' + guest.username);
      findUser({username: guest.username})
        // call getUser with the user object returned from findUser
        .then(getUser)
        .then(function(user) {
          user.history.push({event:'Login', time: start, creator: guest.username});

          if(!user.lastImported) {
            user.history.push({event:'PoW Import', time: config.nconf.get('cache').fromDate});
          }
          return user;
        }) /* Disabling auto-import
        .then(function(user) { // jshint camelcase: false
          cache({user: user.username, teacher: user.username, since_date: user.lastImported.getTime()})
            .then(function(caching) {
              var imported = user.history.create({
                event:'PoW Import',
                time: start,
                duration: (Date.now() - start.getTime()),
                isError: !caching.success,
              });

              console.debug(caching);
              updateUser({username: user.username}, {$push: {history: imported}}, {upsert: true});
            });
        })*/
        // updates key on existing user or inserts new user record if new user
        .then( updateUser({username: guest.username}, {key: guest.key}, {upsert: true}) )
        // sets cookie on res with key'EncAuth' and value equal to the user's key
        // done terminates promise chain
        .done(startSession, res.send);
    });
  // if token is undefined
  } else {
    res.send("why are you here without a token?");
  }
}

module.exports.sendToCas = login;
module.exports.logout = logout;
module.exports.returnFromCas = back;
