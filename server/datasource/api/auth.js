/*
  Auth plugins for express
  Protects against updates from anon users
  Caches the user for subsequent auth decisions
  Updates the user's lastSeen time
*/

const mongoose = require('mongoose'),
  cookie = require('cookie'),
  logger = require('log4js').getLogger('auth'),
  express = require('express'),
  passport = require('passport'),
  _ = require('underscore'),
  path = require('../../middleware/path'),
  cache = require('./cache'),
  utils = require('../../middleware/requestHandler'),
  models = require('../schemas');

const User = require("../schemas/user");
const FbStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;


function facebookAuthentication() {
  passport.authenticate("facebook", {
    scope: 'email'
  });
}

function facebookAuthenticationCallback() {
  passport.authenticate("facebook", {
    successRedirect: "/profile",
    failureRedirect: "/login"
  });
}

const localLogin = function(){
  passport.authenticate('local-login', {
    failureRedirect: '/#/login'
  });
};

const localRedirect = function (req, res) {
  res.redirect('/');
};

const logout = (req, res, next) => {
    console.log('LOGGING OUT!');
    req.logout();
    res.redirect('/');
  };


module.exports.facebookAuthentication = facebookAuthentication;
module.exports.facebookAuthenticationCallback = facebookAuthenticationCallback;
module.exports.localLogin = localLogin;
module.exports.localRedirect = localRedirect;
module.exports.logout = logout;