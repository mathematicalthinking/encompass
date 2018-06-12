var utils = require('../datasource/api/requestHandler');

function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated()) {
    return utils.sendError.NotAuthorizedError(req, res);
  }
  return next();
}

module.exports = isAuthenticated;