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

const localLogin = (req, res, next) => {
  passport.authenticate('local-login', {
      successRedirect: '/',
      failureRedirect: '#/auth/login',
      failureFlash: true
  })(req, res, next);
};

const localSignup = (req, res, next) => {
  passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '#/auth/signup',
      failureFlash: true
  })(req, res, next);
};

const logout = (req, res, next) => {
  console.log('LOGGING OUT!');
  req.logout();
  res.redirect('/');
};

module.exports.logout = logout;
module.exports.localLogin = localLogin;
module.exports.localSignup = localSignup;