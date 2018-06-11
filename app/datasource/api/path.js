/*
  Path plugins for restify
  Protects against bad ObjectIDs (ENC-486)
  Caches the path parts for future decisions
*/

var logger   = require('log4js').getLogger('sane'),
    utils    = require('./requestHandler'),
    util     = require('util'),
    express  = require('express'),
    _        = require('underscore'),
    models   = require('../schemas'),

/*
  @returns {Boolean} - is this request an /api/ request?
*/
function apiRequest(req) {
  return !!req.path.match('/api');
}

/*
  @returns {Array} [0] model [1] id
*/
function idRequest(req) {
  var idRegExp = /\/api\/([a-z]*)\/(\w+)/;
  return idRegExp.exec(req.path);
}

function prep(options) {
  function _prep(req, res, next) {
    console.log('prep is called');
    _.defaults(req, { mf: {} });
    _.defaults(req.mf, { path: {} });
    _.defaults(req.mf, { auth: {} });
    return next();
  }

  return _prep;
}

/*
*/
function processPath(options) {
  function _processPath(req, res, next) {
    console.log('in process path');
    if(!apiRequest(req)) {
      return next();
    }

    _.defaults(req, { mf: {} });
    _.defaults(req.mf, { path: {} });

    var pathRegExp = /\/api\/([a-z]*)\/?/;
    var match = pathRegExp.exec(req.path);
    if(match) {
      req.mf.path.model = match[1];
    }

    return (next());
  }

  return (_processPath);
}

/*
  ENC-486 bad ObjectIDs crash the server
*/
function validateId(options) {
  function _validateId(req, res, next) {
    console.log('inside validate Id');
    var match = idRequest(req);
    if(!match) {
      return next();
    }

    var id = req.params.id;
    //http://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid
    var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(!checkForHexRegExp.test(id)) {
      //TODO this is sending a 500 error although its a 4xx
      utils.sendError(new errors.InvalidArgumentError('bad object id'), res);
      return next(false);
    }

    return next();

  }

  return _validateId;
}

// when the path is /api/workspaces return 'workspace'
function getModel(req) {
  var model = req.mf.path.model;
  if(!model){ return; }
  var singularModel = model.slice(0, -1);
  return singularModel;
}

// when the path is /api/workspaces return 'Workspace'
function getSchema(req) {
  var model = getModel(req);
  if(!model){ return; }
  var schema = model.charAt(0).toUpperCase() + model.slice(1);
  return schema;
}

function schemaHasWorkspace(schema) {
  var mSchema = models[schema];
  if(!mSchema) {
    return false;
  }
  var hasWorkspace = !!mSchema.schema.paths.workspace;
  return hasWorkspace;
}

/*
   ENC-417 posts missing required data, crash the server
*/

function validateContent(options) {
  function _validateContent(req, res, next) {
    console.log('inside validateContent');
    var checkForModRequest = /POST|PUT/;


    // Ignore api requests that don't attempt to modify a value
    if(!apiRequest(req) || !(checkForModRequest.test(req.method) && req.body)) { // Ignore api requests that don't attempt to modify a value
      return next();
    }

    var model = getModel(req),
        schema = getSchema(req),
        data = req.body[model];

    if(models[schema]) {
      var required = models[schema].schema.requiredPaths();
      var hasRequiredData = _.every(required, function(x) { return data[x]; });

      if(!hasRequiredData) {
        var error = 'Model %s is missing post/put data';
        utils.sendError.InvalidContentError(util.format(error, schema), res));
        return next(false);
      }
    }

    return next();
  }

  return _validateContent;
}

module.exports.prep             = prep;
module.exports.processPath      = processPath;
module.exports.validateId       = validateId;
module.exports.validateContent  = validateContent;
module.exports.apiRequest       = apiRequest;
module.exports.getModel         = getModel;
module.exports.getSchema        = getSchema;
module.exports.schemaHasWorkspace = schemaHasWorkspace;
