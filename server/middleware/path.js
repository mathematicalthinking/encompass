/**
 * # Path Middlware
 * @description Middle to provide path consistency
 *   It prevents any call to the server that doesn't start with /api
 *   It also runs a regex to make sure that whatever follows the api is correct
 *   It protects against bad ObjectIDs and caches path parts for future decisions
 * @author Daniel Kelly & Philip Wisner
 * @since 2.0.0
 */

//REQUIRE MODULES
const util = require('util');
const _ = require('underscore');

//REQUIRE FILES
const utils = require('./requestHandler');
const models = require('../datasource/schemas');

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
  let idRegExp = /\/api\/([a-z]*)\/(\S+)/;
  return idRegExp.exec(req.path);
}

function prep(options) {
  function _prep(req, res, next) {
    _.defaults(req, { mt: {} });
    _.defaults(req.mt, { auth: {} });
    _.defaults(req.mt, { path: {} });

    return next();
  }

  return _prep;
}

/*
*/
function processPath(options) {
  function _processPath(req, res, next) {
    if(!apiRequest(req)) {
      return next();
    }

    let pathRegExp = /\/api\/([a-z]*)\/?/;
    let match = pathRegExp.exec(req.path);
    if(match) {
      req.mt.path.model = match[1];
    }

    return (next());
  }

  return (_processPath);
}


/*
  ENC-486 bad ObjectIDs crash the server
  is this validation sufficient? if for some reason someone passed an object as the id param, the server would crash
*/
function validateId(options) {
  function _validateId(req, res, next) {
    let match = idRequest(req);
    if(!match) {
      return next();
    }

    let id = req.params.id;
    //http://stackoverflow.com/questions/11985228/mongodb-node-check-if-objectid-is-valid
    let checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$");
    if(!checkForHexRegExp.test(id)) {
      return utils.sendError.InvalidArgumentError('bad object id', res);
    }
    return next();

  }

  return _validateId;
}

// when the path is /api/workspaces return 'workspace'
function getModel(req) {
  let model = req.mt.path.model;
  if(!model){ return; }
  let singularModel = model.slice(0, -1);
  return singularModel;
}

// when the path is /api/workspaces return 'Workspace'
function getSchema(req) {
  let model = getModel(req);
  if(!model){ return; }
  let schema = model.charAt(0).toUpperCase() + model.slice(1);
  return schema;
}

function schemaHasWorkspace(schema) {
  let mSchema = models[schema];
  if(!mSchema) {
    return false;
  }
  let hasWorkspace = !!mSchema.schema.paths.workspace;
  return hasWorkspace;
}

/*
   ENC-417 posts missing required data, crash the server
*/

function validateContent(options) {
  function _validateContent(req, res, next) {
    let checkForModRequest = /POST|PUT/;
    // Ignore api requests that don't attempt to modify a value
    if(!apiRequest(req) || !(checkForModRequest.test(req.method) && req.body)) { // Ignore api requests that don't attempt to modify a value
      return next();
    }

    let model = getModel(req),
        schema = getSchema(req),
        data = req.body[model];
    if(models[schema]) {
      let required = models[schema].schema.requiredPaths();
      let hasRequiredData = _.every(required, function(x) { return data[x]; });
      if(!hasRequiredData) {
        let error = 'Model %s is missing post/put data';
        return utils.sendError.InvalidContentError(util.format(error, schema), res);
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
