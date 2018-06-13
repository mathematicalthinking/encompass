/**
  * # Error API
  * @description This is the API for error requests
  * @author amir@mathforum.org
  * @since 1.0.4
  */
var mongoose = require('mongoose'),
    express  = require('express'),
    logger   = require('log4js').getLogger('server'),
    utils    = require('../../middleware/requestHandler'),
    auth     = require('./auth'),
    permissions  = require('../../../common/permissions'),
    data     = require('./data'),
    models   = require('../schemas');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method postError
  * @description __URL__: /api/errors
  */
function postError(req, res, next) {

  var user = auth.getUser(req);
  var error = new models.Error(req.body);
  error.object = req.body; //store the full POST
  error.createdBy = user;
  error.createDate = Date.now();

  error.save(function(err, doc) {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }

    var data = {'error': doc};
    return utils.sendResponse(res, data);
    //next();
  });

}

module.exports.post.error = postError;
