var utils = require('./requestHandler');

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return utils.sendError.NotAuthorizedError(req, res);
  }
  console.log(`Authenticated user ${req.user.username}`);
  return next();
}

module.exports.isAuthenticated = isAuthenticated;