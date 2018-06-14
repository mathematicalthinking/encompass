/**
  * # Workspaces API
  * @description This is the API for workspace based requests
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */
var mongoose = require('mongoose'),
    express  = require('express'),
    logger = require('log4js').getLogger('server'),
    models = require('../schemas'),
    auth   = require('./auth'),
    userAuth = require('../../middleware/userAuth'),
    permissions  = require('../../../common/permissions'),
    utils  = require('../../middleware/requestHandler'),
    data   = require('./data'),
    _      = require('underscore'),
    Q      = require('q'),
    helper = require('util');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};


/**
  * @private
  * @method getWorkspaces
  * @description Retrieves a workspace by id and passes to callback
  * @param {String} id Workspace ID
  * @param {Function} callback Accepts a single argument i.e the workspace
  * @returns {Array} Workspace objects by creator
  * @throws {MongoError} Data retrieval failed
  * @todo This should really accept a node-style callback
  */
function getWorkspace(id, callback) {
  models.Workspace.findById(id)
    .populate('selections')
    .populate('submissions')
    .populate('folders')
    .populate('taggings')
    .exec(function(err, ws){
    if(err) {throw err;}
    if(!ws) {
      return callback();
    }
    var data = {
      workspace: ws
    };
    var dataMap = {
      'selections':  'selection',
      'submissions': 'submission',
      'folders':     'folder',
      'taggings':     'tagging'
    };

    var relatedData = {
      'selections':  [],
      'submissions': [],
      'folders':     [],
      'taggings':    []
//      'workspace': {},
//      'createdBy': {}
    };

    //this would probably be better done as an aggregate?
    //we're just massaging the data into an ember friendly format for side-loading
    _.keys(relatedData).forEach(function(key){
      if(ws[key]){ //array
        var idBag = [];
        ws[key].forEach(function(item){
          relatedData[key].push(item);//[ws[key]._id] = comment[key];
          idBag.push(item._id);
        });
        ws[key] = idBag;
      } else {
        logger.error('workspace ' + ws._id + ' missing ' + key);
        delete ws.key;
      }
    });

    _.keys(relatedData).forEach(function(key){
      var modelName = key;
      if(dataMap[key]) {
        modelName = dataMap[key];
      }
      data[modelName] = _.values(relatedData[key]);
    });
    callback(data);
  });
}

/**
  * @private
  * @method getWorkspaceWithDependencies
  * @description Due to the way Ember sideloads data, we need to flatten a retrieved workspace
  *              to expose some of its nested properties.
  * @param {String} id The ID of the workspace to retrieve
  * @param {Function} callback Accepts a single argument - the flattened workspace
  * @throws {MongoError} Data retrieval failed
  * @todo + This should really accept a node-style callback
  *       + Could be simpler. Needs refactoring
  */
function getWorkspaceWithDependencies(id, callback) {
  models.Workspace.findById(id)
    .exec(
      function(err, workspace) {
        if(err) {throw err;}
        if(!workspace) {logger.info("No such workspace"); callback(); return;}
        models.Folder.find(/**{'_id': { $in: workspace.folders}}*/).exec(
          function(err, folders) {
            if(err) {throw err;}
            models.Submission.find({'_id': { $in: workspace.submissions}, 'isTrashed': false}).exec(
              function(err, submissions) {
                if(err) {throw err;}
                models.Selection.find({'_id': { $in: workspace.selections}, 'isTrashed': false}).exec(
                  function(err, selections) {
                    if(err) {throw err;}
                    models.Comment.find({'_id': { $in: workspace.comments}, 'isTrashed': false}).exec(
                      function(err, comments) {
                        if(err) {throw err;}
                        models.Tagging.find({'_id': { $in: workspace.taggings}, 'isTrashed': false}).exec(
                          function(err, taggings) {
                            if(err) {throw err;}
                            callback({
                              'workspace': workspace,
                              'folder': folders,
                              'submission': submissions,
                              'selection': selections,
                              'tagging': taggings,
                              'comment': comments
                            });
                          });
                      });
                  });
              });
          });
      });
}


/**
  * @public
  * @method sendWorkspace
  * @description __URL__: /api/workspaces/:id
  * @howto Ideally we'd send back the workspace with all of it's dependencies.
           It's sending back way too much data right now
  */
function sendWorkspace(req, res, next) {

  var user = userAuth.requireUser(req);
  models.Workspace.findById(req.params.id).lean().populate('owner').populate('editors').exec(function(err, ws){
    if(!permissions.userCanLoadWorkspace(user, ws)) {
      logger.info("permission denied");
      res.send(403, "You don't have permission for this workspace");
    } else {
      getWorkspace(req.params.id, function(data) {
        console.log(`${user} has permission to load workspace #${req.params.id}`);
        if(!data) {
          return utils.sendCustomError(404, 'no such workspace', res);
        }
        utils.sendResponse(res, data);
      });
    }
  });
}

/**
  * @public
  * @method putWorkspace
  * @description __URL__: /api/workspaces/:id
  * @howto Ideally we'd send back the workspace with all of it's dependencies.
           It's sending back way too much data right now
  */
function putWorkspace(req, res, next) {
  var user = userAuth.requireUser(req);
  models.Workspace.findById(req.params.id).lean().populate('owner').exec(function(err, ws){
    if(!permissions.userCanModifyWorkspace(user, ws)) {
      logger.info("permission denied");
      res.send(403, "You don't have permission to modify this workspace");
    } else {
      models.Workspace.findById(req.params.id).exec(function(err, ws){
        ws.editors = req.body.workspace.editors;
        ws.mode    = req.body.workspace.mode;
        ws.name    = req.body.workspace.name;
        ws.save(function(err, workspace) {
          utils.sendResponse(res, {workspace: workspace});
        });
      });

    }
  });
}


/**
  * @private
  * @method updateWorkspaces
  * @description Update a set of workspaces with their new set of submissions.
  *              This would happen when we are re-checking the submission pool.
  * @param  {Object}   workspaces      A mongoose collection of workspaces (we use .forEach on it)
  * @param  {Object}   submissionSet   A mongoose collection of submissions
  * @return {Promise}   Resolves when each of the workspaces have been updated
  * @todo It would be nice to record what is coming and going and notify the user that there are new submissions,
  *       or catch the case when submissions drop out (that you did work on?)
 */
function updateWorkspaces(workspaces, submissionSet){
  var tasks = [];

  /** ENC-579
    * Inserts the PoW Id for a PD copied submission
    */
  var insertPowId = function(doc, obj, options) {
    var promise = Q.defer();
    var opts = {path: 'pdSrcId', model: 'PDSubmission'};
    var isSubDoc = (typeof doc.ownerDocument) === 'function';

    if(!isSubDoc) {
      doc.populate(opts, function(err, submission) {
        if(submission.pdSrcId) {
          obj = _.defaults(obj, {powId: submission.pdSrcId.powId});
        }

        promise.resolve(obj);
      });
    }

    return promise.resolve(obj);
  };

  var updateWorkspace = function(err, ws) {
    if(err) {
      logger.error(err);
      return;
    }

    models.Submission.populate(submissionSet, {path: 'submissions', model: 'Submission'}, function(err, subset) {
      if(err) {
        logger.error(err);
        return;
      }

      var transformExistingSubmissions = Q.all( ws.submissions.map(function(obj) {
        var sub = obj.toJSON({transform: insertPowId});
        return sub;
      }));

      var transformNewSubmissions = Q.all( subset.submissions.map(function(obj) {
        var sub = obj.toJSON({transform: insertPowId});
        return sub;
      }));

      /** ENC-579: We need the powIds of both the existing submissions, and the new submissionSet
        * in order to compare and avoid duplication
        */
      transformExistingSubmissions.then(function(old) {
        transformNewSubmissions.then(function(newer) {
          var sorted = _.sortBy(newer, 'createDate');
          var startDates = [ws.submissionSet.description.firstSubmissionDate, _.first(sorted).createDate];
          var endDates = [ws.submissionSet.description.lastSubmissionDate, _.last(sorted).createDate];
          var existing = _.pluck(old, 'powId');
          var toAdd = _.reject(newer, function(submission) {
            return (existing.indexOf(submission.powId) > -1);
          });
          var pdA = old[0].pdSet;
          var pdB = newer[0].pdSet;

          if(pdA === pdB) {
            ws.update({
              'submissionSet.lastUpdated': new Date(),
              'submissionSet.description.firstSubmissionDate': _.min(startDates), //ENC-573 - updates date ranges
              'submissionSet.description.lastSubmissionDate': _.max(endDates),
              '$addToSet' : {submissions: {$each: toAdd}}
            }).exec();
          }
        });
      });
    });
  };

  workspaces.forEach(function(workspace) {
    tasks.push(models.Workspace.findById(workspace._id)
      .populate('submissions')
      .exec(updateWorkspace));
  });

  return Q.all(tasks);
}

/**
  * @private
  * @method newFolderSructure
  * @description Whip up the standard Math Forum folder structure
  * @param {User}      user     The user this folder structure will be for
  * @param {Workspace} ws       The workspace this folder structure will be in
  * @return {Promise}  Resolves when all the folders are created
 */
function newFolderStructure(user, ws, folderSetName) {
  var promise = new mongoose.Promise();
  var tasks = [];

  var folders = []; // 'none' and anything else will use the empty set

  if(!folderSetName) { folderSetName = 'none'; }

  if(folderSetName === 'default' || folderSetName === 'mathforumFolders') {
    folders = data.mathforumFolders;
  }

  if(folderSetName === 'simple') {
    //yes, we could do data[folderSetName] but that requires a lot of sanitizing
    //since we are getting the param from the request
    folders = data.simple;
  }

  folders.forEach(function(folder){
    var folderPromise = new mongoose.Promise();
    var f = new models.Folder({
      //owner: user,
      name: folder.name,
      workspace: ws._id,
      weight: folder.weight ? folder.weight : 0,
      parent: null
    });
    f.save(function(err, fSaved){
      if(err) {
        logger.error(err);
        folderPromise.reject(err);
      } else {
        if(folder.children) {
          folder.children.forEach(function(child){
            //not sure this is kosher - the promise is resolving
            //whenever one of the children saves...?
            var c = new models.Folder({
              //owner: user,
              name: child.name,
              workspace: ws._id,
              weight: child.weight ? child.weight : 0,
              parent: fSaved
            });
            c.save(function(err, doc){
              if(err) {
                logger.error(err);
                folderPromise.reject(err);
              } else {
                folderPromise.resolve();
              }
            });
          });
        } else {
          folderPromise.resolve(); //no children, we're good
        }
      }
    });
    tasks.push(folderPromise);
  });
  Q.all(tasks).then(function(){
    promise.resolve();
  });
  return promise;
}

/**
  * @private
  * @method nameWorkspace
  * @description Determine the name for a workspace according to submissionSet
  * @param {Object} submissionSet   An object describing a set of submission objects
  * @param {User}   user  The user this `submissionSet` belongs to.
  * @return {String} The name for the workspace
  * @howto This method assumes that the following are defined:
  *         + `submissionSet.description.puzzle.title`
  *         + `submissionSet.description.publication.pubId`
*/
function nameWorkspace(submissionSet, user) {
  var puzzle = submissionSet.description.puzzle;
  var group = submissionSet.description.group;
  var publication = submissionSet.description.publication;
  var pdSet = submissionSet.description.pdSource;
  var labelFmt = "%s / %s";

  var mask = function(source) { return (pdSet === "default") ? "PoWs" : pdSet; };

  var name = (group) ? helper.format(labelFmt, puzzle.title, group.name, mask(pdSet))
                     : helper.format(labelFmt, puzzle.title, mask(pdSet));
  return name;
}

/**
  * @private
  * @method newWorkspace
  * @description Create a new workspace for user
  * @param  {Object} submissionSet       This is one of the results from a mongoose aggregate describing a submission set.
  * @param  {User}   user    We use the user's name for the workspace name, also set them as the owner
  * @return {Promise}   resolves when the workspace is stored
 */
function newWorkspace(submissionSet, user, folderSetName) {
  console.log('CREATING NEW WORKSPACE...');
  var workspace = new models.Workspace({
    name: nameWorkspace(submissionSet, user),
    submissionSet: submissionSet,
    owner: user,
    submissions: submissionSet.submissions,
    selections: [],
    comments: [],
    //createDate: new Date(),
    isTrashed: false
  });
  var promise = new mongoose.Promise();
  workspace.save(function(err, ws){
    newFolderStructure(user, ws, folderSetName).then(function(){
      promise.resolve();
    });
  });
  return promise;
}

/**
  * @private
  * @method handleSubmissionSet
  * @description Handles a submission set for a user
  * @see prepareAndUpdateWorkspaces
 */
function handleSubmissionSet(submissionSet, user, folderSetName) {
  var promise = new mongoose.Promise();
  var prefix = 'submissionSet.criteria.';
  var criteria = {'$and': []};

  // See prepareAndUpdateWorkspaces for what criteria we're looking at here
  for (var key in submissionSet.criteria) {
    if( submissionSet.criteria.hasOwnProperty(key) ) {
      var criterion = {};
      if (!_.isEmpty(submissionSet.criteria[key])) {
        criterion[prefix.concat(key)] = submissionSet.criteria[key];
        criteria.$and.push(criterion);
      }

    }
  }
  criteria.$and.push({owner: user}); //limit this to workspaces for the current user only
//  criteria.$and.push({pdSet: submissionSet.description.pdSource}); //limit this to workspaces for the current user only

  // Looks for existing workspaces for this user for the submission set
  models.Workspace.find(criteria).exec(function(err, workspaces){

    if(err){
      logger.error(err);
    }
    // if it finds a workspace
    if(workspaces.length) {
      console.log(`${workspaces.length} workspaces found for criteria ${criteria}`);
      logger.info('there is already a workspace for this');
      //promise.resolve();

      //updates it
      updateWorkspaces(workspaces, submissionSet).then(function(result){
        promise.resolve();
      });//
    } else {
    // if not, make a new one
    return newWorkspace(submissionSet, user, folderSetName).then(function(){
        promise.resolve();
      });
    }
  });
  return promise; // @return {Promise} resolves when we've either update all workspaces or created a new one
}

/**
  * @private
  * @method handleSubmissionSets
  * @callback handleSubmissionSet on each of the args
  * @see `handleSubmissionSet` for each of the args
  * @return {Promise}  a grouped promise
  */
function handleSubmissionSets(submissionSets, user, folderSetName) {
  logger.debug('There are ' + submissionSets.length + 'submission sets.');
  logger.debug('looking for filters');
  var tasks = [];
  submissionSets.forEach(function(submissionSet){
    tasks.push(handleSubmissionSet(submissionSet, user, folderSetName));
  });
  return Q.all(tasks);
}

function convertPDSubmissionToSubmission(obj, ind, arr) {
  var data = obj.toObject();

  data.pdSrcId = data._id;
  delete data._id;
  delete data.powId; //Why are we ever deleting this!?
  arr[ind] = data;
}

function setTeacher(obj, ind, arr) {
  obj["teacher.username"] = this.username;
  arr[ind] = obj;
}

/**
  * @private
  * @method prepareUserSubmissions
  * @description Retrieves PD submissions that the user wants, and
                 makes them available to them if they don't have
                 copies already.'
  * @param {Object} user The user requesting the submissions
  * @param {String} pdSet The name of the PD submission set desired
  * @param {Function} callback Should handle retrieved submissions
 */
function prepareUserSubmissions(user, pdSet, folderSet, callback) {
  if (!pdSet) { pdSet = 'default'; }

  logger.info('copying ' + pdSet + ' for ' + user.username);
  //does the user already have the PD submissions?
  models.Submission.find({ "teacher.username": user.username, pdSet: pdSet }, function(err, docs){
    if(err) {logger.error(err); callback(err);}

    if(docs.length) {
      logger.info('user: ' + user.username + ' already has ' + docs.length + ' pd submissions for ' + pdSet + ', not copying');
      logger.debug('... in workspaces ' + docs[0].get('workspaces'));
      callback();
    } else {
      //copy over all of the pdsubmissions
      models.PDSubmission.find({ pdSet: pdSet }, function(err, docs){
        if(err) {logger.error(err); callback(err);}

        logger.info('setting up ' + user.username + ' with ' + docs.length + ' PDSubmissions');

        docs.forEach(convertPDSubmissionToSubmission);
        docs.forEach(setTeacher, user);

        models.Submission.create(docs, function(err, docs) {
          if(err) {
            logger.error(err);
            callback(err);
          }
          logger.debug('copied PDSubmissions');
          callback();
        });
      });
    }
  });
}

/**
  * @private
  * @method packageSubmissions
  * @description This is really just a wrapper for Mongoose's extremely powerful
                 `aggregate` method. We use this to reconstitute submissions into
                 whatever form we want.
  * @see [aggregate](http://mongoosejs.com/docs/api.html#aggregate-js)
  * @param {Object} matchOpts How to filter our collection of submissions
  * @param {Object} sortOpts  How to sort the submissions that have filtered through
  * @param {Object} groupOpts How to group the now sorted submissions
  * @param {Object} inclusions Any computed or nested properties we would like to use
  * @param {Function} callback Should accept an error, and the packagedSubmissions
 */
function packageSubmissions (matchOpts, sortOpts, groupOpts, inclusions, callback) {
  logger.info('running packageSubmissions');
  models.Submission.aggregate([
    { $match: matchOpts },
    { $sort:  sortOpts },
    { $group: groupOpts },
    { $project: inclusions }]).exec(callback);

}

/**
  * @private
  * @method prepareAndUpdateWorkspaces
  * @description This looks at all of the users submissions
                 (submissions where the `user.username` matches `submission.teacher.username`)
  *              Groups the submissions by the class (aka Group) and problem
  *              and "handles" each of those groups (@see handleSubmissionSets)
  * @param  {User}  user
  * @param  {Function}  callback    the function to execute when all of the submission sets have been handled, no parameters passed
  *
  * @see `handleSubmissionSets`
  * @see `prepareUserSubmissions`
  * @see `packageSubmissions`
  * @howto The submission sets we create look something like this:
  *  [{
  *     submissions: [ ],
  *     description: {
  *       firstSubmissionDate: Date,
  *       lastSubmissionDate: Date,
  *       pub: { pubId: ______ }
  *       puzzle: { title: _____ },
  *       group: { name: ______ }
  *     },
  *     criteria: {
  *       group: {
  *         groupId:
  *       },
  *       puzzle: {
  *         puzzleId:
  *       }
  *     }
  *  },{
  *    ...
  *  }]
 */
function prepareAndUpdateWorkspaces(user, callback) {
  logger.info('in prepupdws');
  prepareUserSubmissions(user, null, null, function () {
    var matchBy = {
      "teacher.username": user.username,
      $or: [
        {"workspaces": null},  //and that aren't already in a workspace | @todo: might be in another user's workspace you know...
        {"workspaces": {$size: 0}},
        {"workspaces": {$exists: true}},
      ],
      "isTrashed": {$in: [null, false]} //submissions that are not deleted
    };
    var sortBy = { "createDate": 1 };
    var groupBy = {
      _id: {
        group: "$clazz.clazzId",
        pub: "$publication.publicationId",
        puzzle: "$publication.puzzle.puzzleId",
        name:  "$clazz.name",
        title:  "$publication.puzzle.title"
      },
      pdSet: {$first: "$pdSet"},
      firstSubmissionDate: {$first: "$createDate"},
      lastSubmissionDate:  {$last:  "$createDate"},
      submissions: { $addToSet: "$_id" },
    };
    var include = {
      submissionSet: {
        submissions: "$submissions",
        description: {
          pdSource: "$pdSet",
          firstSubmissionDate: "$firstSubmissionDate",
          lastSubmissionDate: "$lastSubmissionDate",
          puzzle: {
            title: "$_id.title"
          },
          group: {
            name: "$_id.name"
          },
          publication: {
            pubId: "$_id.pub"
          }
        },
        criteria: {
          pdSet: "$pdSet",
          group: {
            groupId: "$_id.group"
          },
          puzzle: {
            puzzleId: "$_id.puzzle"
          }
        }
      }
    };

    packageSubmissions(matchBy, sortBy, groupBy, include, function (err, results) {
      logger.info('pkg sub callback in');
      if(err) { logger.info('in error block pkgsub');callback( new Error( err.message ) ); }

      var submissionSets = _.pluck(results, 'submissionSet');
      console.log('We got '+ submissionSets.length + 'sets');
      console.log('We got '+ submissionSets.submissions + 'sets');

      submissionSets = _.reject(submissionSets, function (set) {
        //why would we be getting these?
        return  (!(set.criteria && set.description && set.submissions));
      });

      handleSubmissionSets(submissionSets, user).then(function() {
        callback();
      });
    });
  });
}

/**
  * @public
  * @method getUserWorkspaces
  * @description __URL__: /api/workspaces (also the endpoint for importRequests)
  * @returns {Object} A 'named' array of workspace objects by creator
  * @throws {RestError} Something? went wrong
  */
function sendWorkspaces(req, res, next) {
  var user = userAuth.requireUser(req);
  logger.info('in sendWorkspaces');
  logger.debug('looking for workspaces for user id' + user._id);
  prepareAndUpdateWorkspaces(user, function(err){
    if(err){
      utils.sendError(err, res);
      logger.error('error preparing and updating ws');
    }

    models.Workspace.find(userAuth.accessibleWorkspacesQuery(user)).exec(function(err, workspaces) {
      var response = {
        workspaces: workspaces,
        meta: { sinceToken: new Date() }
      };
      if(req.body) {
        if(req.body.hasOwnProperty('importRequest')) {
          response = {importRequest: req.body.importRequest};
        }
      }

      utils.sendResponse(res, response);
    });
  });
}

function postWorkspace(req, res, next) {
  logger.info('IN POSTWORKSPACE!!');
  // next(new Error('TESTING next(new ERROR'));
  return utils.sendError.BadMethodError('This action is not yet supported!'); // Not sure how to handle this
 }

/**
  * @public
  * @method newWorkspaceRequest
  * @description __URL__: /api/workspaces/new
  *              Because a workspace is such a monolithic object, where
  *              creating a new one requires several actions, we use this
  *              request method to bundle them together and also acknowledge
  *              the action as a single operation.
  * @see `prepareUserSubmissions`
  * @see `packageSubmissions`
  * @see `handleSubmissionSets`
  * @callback `sendWorkspaces`
 */
function newWorkspaceRequest(req, res, next) {
  console.log('CREATING NEW WORKSPACE');
  var user = userAuth.requireUser(req);
  var pdSetName = req.body.newWorkspaceRequest.pdSetName;
  var folderSetName = req.body.newWorkspaceRequest.folderSetName;
  logger.debug('creating new workspace for pdset: ' + pdSetName);

  //copy over all of the pdsubmissions
  prepareUserSubmissions(user, pdSetName, folderSetName, function () {
    var matchBy = {
      "teacher.username": user.username,
      "pdSet": pdSetName, // submissions that belong to our pdSet
      $or: [
        {"workspaces": null},  //and that aren't already in a workspace | @todo: might be in another user's workspace you know...
        {"workspaces": {$size: 0}},
        {"workspaces": {$exists: true}},
      ],
      "isTrashed": {$in: [null, false]}
    };

    var sortBy = { "createDate": 1 };
    var groupBy = {
      _id: {
        group: "$clazz.clazzId",
        puzzle: "$publication.puzzle.puzzleId",
        name:  "$clazz.name",
        title:  "$publication.puzzle.title"
      },
      pdSet: {$first: "$pdSet"},
      firstSubmissionDate: {$first: "$createDate"},
      lastSubmissionDate:  {$last:  "$createDate"},
      submissions: { $addToSet: "$_id" }
    };
    var include = {
      submissionSet: {
        submissions: "$submissions",
        description: {
          pdSource: "$pdSet",
          firstSubmissionDate: "$firstSubmissionDate",
          lastSubmissionDate: "$lastSubmissionDate",
          puzzle: {
            title: "$_id.title"
          },
          group: {
            name: "$_id.name"
          }
        },
        criteria: {
          pdSet: "$pdSet",
          group: {
            groupId: "$_id.group"
          },
          puzzle: {
            puzzleId: "$_id.puzzle"
          }
        }
      }
    };

    packageSubmissions(matchBy, sortBy, groupBy, include, function (err, results) {
      if(err) { throw new Error( err.message ); }

      var submissionSets = _.pluck(results, 'submissionSet');
      logger.info('package submissions: ' + submissionSets.length);

      submissionSets = _.reject(submissionSets, function (set) {
        return  (!(set.criteria && set.description && set.submissions));
      });

      handleSubmissionSets(submissionSets, user, folderSetName).then(function() {
        sendWorkspaces(req, res, next);
      });
    });
  });
}

/**
  * @public
  * @method getWorkspaces
  * @description __URL__: /api/workspaces (also the endpoint for importRequests)
  * @returns {Object} A 'named' array of workspace objects by creator
  * @throws {RestError} Something? went wrong
  */
 function getWorkspaces(req, res, next) {
  var user = userAuth.requireUser(req);
  logger.info('in getWorkspaces');
  logger.debug('looking for workspaces for user id' + user._id);
  let criteria = utils.buildCriteria(req);
    models.Workspace.find(userAuth.accessibleWorkspacesQuery(user)).exec(function(err, workspaces) {
      var response = {
        workspaces: workspaces,
        meta: { sinceToken: new Date() }
      };
      if(req.body) {
        if(req.body.hasOwnProperty('importRequest')) {
          response = {importRequest: req.body.importRequest};
        }
      }

      utils.sendResponse(res, response);
    });

}

module.exports.get.workspace = sendWorkspace;
module.exports.get.workspaces = getWorkspaces;
module.exports.put.workspace = putWorkspace;
module.exports.post.workspace = postWorkspace;
module.exports.post.newWorkspaceRequest = newWorkspaceRequest;
