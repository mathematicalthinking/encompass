/**
  * # Fake Login API
  * @description This is the API for logging into Encompass w/o CAS
  * @authors Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.3
  */

//REQUIRE MODULES
const uuid = require('uuid');
const cookie = require('cookie');

//REQUIRE FILES
const config = require('./config');
const models = require('./datasource/schemas');
const util = require('util');


function fakeLogin(req, res, next) {
  var username = req.params.username;
  var name     = username.toLowerCase();
  var key      = uuid.v4();
  var webConf = config.nconf.get('web');

  // Create the user
  var user = new models.User({
    username: name,
    key: key
  });

  var upsertData = user.toObject();
  delete upsertData._id;
  delete upsertData.history;

  // Create login event
  var loggedIn = user.history.create({
    event: 'Login',
    creator: name,
    message: util.format("User %s (fake) logged in", name)
  });


  models.User.update({username: name}, upsertData, {upsert: true}, function(err, count, result) {
    if(err) {
      res.send(err); // This should never happen
    } else {
      // Give them a session cookie
      res.header('Set-Cookie', cookie.serialize('EncAuth', key, {path: '/'}));
      res.header('Location', webConf.base);
      res.send(301);
    }
  });
}

module.exports.fakeLogin = fakeLogin;
