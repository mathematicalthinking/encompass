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
      failureRedirect: '/#/auth/login',
      // failureFlash: true,
      // passReqToCallback: true
  })(req, res, next);
};

const localSignup = (req, res, next) => {
  passport.authenticate('local-signup', {
      successRedirect: '/',
      failureRedirect: '/#/auth/signup',
  })(req, res, next);
};

const googleAuth = (req, res, next) => {
  passport.authenticate('google', {
     scope:["https://www.googleapis.com/auth/plus.login",
     "https://www.googleapis.com/auth/plus.profile.emails.read"
   ]
  })(req,res,next);
};

const googleReturn = (req, res, next) => {
  passport.authenticate('google', {
    failureRedirect: "/#/login",
    successRedirect: "/"
  })(req, res, next);
};

const facebookAuth = (req, res, next) => {
  passport.authenticate("facebook", {
    scope: 'email'
  })(req, res, next);
};

const facebookReturn = (req, res, next) => {
  passport.authenticate("facebook", {
    failureRedirect: "/#/login",
    successRedirect: "/"
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
module.exports.googleAuth = googleAuth;
module.exports.googleReturn = googleReturn;
module.exports.facebookAuth = facebookAuth;
module.exports.facebookReturn = facebookReturn;