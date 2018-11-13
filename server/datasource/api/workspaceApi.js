/**
  * # Workspaces API
  * @description This is the API for workspace based requests
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */

  /*jshint ignore:start*/
//REQUIRE MODULES
const mongoose = require('mongoose');
const logger = require('log4js').getLogger('server');
const _ = require('underscore');
const Q = require('q');
const helper = require('util');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils  = require('../../middleware/requestHandler');
const data   = require('./data');
const access = require('../../middleware/access/workspaces');
const answerAccess = require('../../middleware/access/answers');
const accessUtils = require('../../middleware/access/utils');
const importApi = require('./importApi');
const apiUtils = require('./utils');

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
    if(err) {
      throw err;
    }
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
function getWorkspaceWithDependencies(id, callback) { // eslint-disable-line no-unused-vars
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
    if (err) {
      console.error(`Error sendWorkspace: ${err}`);
      console.trace();
      return utils.sendError.InternalError(err, res);
    }
    if (!ws || ws.isTrashed) {
      return utils.sendResponse(res, null);
    }
    if(!access.get.workspace(user, ws)) {
      logger.info("permission denied");
      return utils.sendError.NotAuthorizedError("You don't have permission for this workspace", res);
    } else {
      getWorkspace(req.params.id, function(data) {
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
  // 403 error when a teacher is in a workspace and switches to acting role of student
  // for now let acting role student modify workspaces but need to come up with a better solution

  models.Workspace.findById(req.params.id).lean().populate('owner').populate('editors').exec(function(err, ws){
    if(!access.get.workspace(user, ws)) {
      logger.info("permission denied");
      res.status(403).send("You don't have permission to modify this workspace");
      // res.send(403, "You don't have permission to modify this workspace"); deprecated
      if (err) {
        console.log('putWorkspace error is', err);
      }
    } else {
      models.Workspace.findById(req.params.id).exec(function(err, ws){
        ws.editors = req.body.workspace.editors;
        ws.mode    = req.body.workspace.mode;
        ws.name = req.body.workspace.name;
        ws.owner = req.body.workspace.owner;
        ws.lastViewed = new Date();
        ws.lastModifiedDate = req.body.workspace.lastModifiedDate;
        ws.lastModifiedBy = req.body.workspace.lastModifiedBy;

        // only admins or ws owner should be able to trash ws
        if (user.accountType === 'A' || user.id === ws.owner.toString()) {
          ws.isTrashed = req.body.workspace.isTrashed;
        }

        if (err) {
          console.log('error', err);
        }

        ws.save(function(err, workspace) {
          if (err) {
            return utils.sendError.InternalError(err, res);
          }
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
        if (err) {
          logger.error(err);
          return;
        }
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

  if(folderSetName === 'default' || folderSetName === 'Math Forum Default Folders') {
    folders = data.mathforumFolders;
  }

  if(folderSetName === 'Simple Folder Set') {
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
function nameWorkspace(submissionSet, user, isPows) {
  var puzzle = submissionSet.description.puzzle;
  var group = submissionSet.description.group;
  // var publication = submissionSet.description.publication;
  var pdSet = submissionSet.description.pdSource;
  var labelFmt = "%s / %s";

  var mask = function(source) { return (pdSet === "default") ? "PoWs" : pdSet; };

  var name = (group) ? helper.format(labelFmt, puzzle.title, group.name, mask(pdSet)) : helper.format(labelFmt, puzzle.title, mask(pdSet));

  if (isPows === false && name.includes('PoWs')) {
    name = name.slice(0, -5);
  }
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
    if (err) {
      return utils.sendError.InternalError(err, res);
    }
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
      // console.log(`${workspaces.length} workspaces found for criteria ${criteria}`);
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
      if(err) {
        logger.info('in error block pkgsub');
        callback( new Error( err.message ));
      }
      var submissionSets = _.pluck(results, 'submissionSet');
      // console.log('We got '+ submissionSets.length + 'sets');
      // console.log('We got '+ submissionSets.submissions + 'sets');

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
      utils.sendError.InternalError(err, res);
      logger.error('error preparing and updating ws');
    }

    models.Workspace.find(userAuth.accessibleWorkspacesQuery(user)).exec(function(err, workspaces) {
      if (err) {
        return utils.sendError.InternalError(err, res);
      }
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
  var user = userAuth.requireUser(req);
  var pdSetName = req.body.newWorkspaceRequest.pdSetName;
  var folderSetName = req.body.newWorkspaceRequest.folderSetName;
  // logger.debug('creating new workspace for pdset: ' + pdSetName);

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



function sortWorkspaces(sortParam, req, criteria) {
  let limit = req.query.limit;
  let skip = req.skip;
  console.log('criteria is', criteria);
  let key = Object.keys(sortParam)[0];
  let value = parseInt(sortParam[key], 0);
  let aggregateArray = [];
  let sortObj = { "$sort" : { "length": value } };
  let limitObj = { "$limit": limit };
  let skipObj = { "$skip": skip };
  let matchObj = { "$match" : criteria };
  let matchNest = matchObj.$match;
  matchNest[key] = { $exists: true, $ne: null };
  let projectObj = { "$project" : { } };
  let projNest = projectObj.$project;
  projNest.createdBy = 1;
  projNest.createDate = 1;
  projNest.isTrashed = 1;
  projNest.lastModifiedBy = 1;
  projNest.lastModifiedDate = 1;
  projNest.lastViewed = 1;
  projNest.name = 1;
  projNest.owner = 1;
  projNest.editors = 1;
  projNest.mode = 1;
  projNest.folders = 1;
  projNest.submissionSet = 1;
  projNest.responses = 1;
  projNest.selections = 1;
  projNest.comments = 1;
  projNest.taggings = 1;
  projNest.submissions = 1;
  projNest.length = { "$size": '$' + key };

  aggregateArray.push(matchObj, projectObj, sortObj, skipObj, limitObj);

  console.log('matchObj is', matchObj);

  return models.Workspace.aggregate(aggregateArray).exec();

  //   await models.Workspace.aggregate(
  //   [
  //     {
  //       "$match": {
  //         criteria,
  //         submissions: {
  //           $exists: true,
  //           $ne: null
  //         },
  //       }
  //     },
  //     {
  //       "$project": {
  //         "submissions": 1,
  //         "length": { "$size": "$submissions" }
  //       }
  //     },
  //     { "$sort": { "length": 1 } },
  //     { "$limit": req.query.limit },
  //     { "$skip": req.skip },
  // ], function(err, workspaces) {
  //     if (err) {
  //       console.log('err is', err);
  //     }
  //     console.log('workspaces');
  //   }
  // );
}






/**
  * @public
  * @method getWorkspaces
  * @description __URL__: /api/workspaces (also the endpoint for importRequests)
  * @returns {Object} A 'named' array of workspace objects by creator
  * @throws {RestError} Something? went wrong
  */
 async function getWorkspaces(req, res, next) {
  var user = userAuth.requireUser(req);
  logger.info('in getWorkspaces');
  logger.debug('looking for workspaces for user id' + user._id);

  let { ids, filterBy, sortBy, searchBy, page, } = req.query;

      if (filterBy) {
        console.log('filterBy workspace API:', JSON.stringify(filterBy));
        let { all } = filterBy;

        if (all) {
          let { org } = all;
          if (org) {
            let crit = {};
            let { organizations } = org;

            if (organizations) {
            if (!crit.$or) {
              crit.$or = [];
            }
             crit.$or.push({organization: {$in: organizations}});
           }

           if (!filterBy.$and) {
             filterBy.$and = [];
           }
           filterBy.$and.push(crit);
           delete filterBy.all;
          }
        }
      }
      let searchFilter = {};

      if (searchBy) {
        let { query, criterion } = searchBy;
      if (criterion) {
        if (criterion === 'all') {
          let topLevelStringProps = ['name'];
          query = query.replace(/\s+/g, "");
          let regex = new RegExp(query.split('').join('\\s*'), 'i');
          searchFilter.$or = [];
          for (let prop of topLevelStringProps) {
            searchFilter.$or.push({[prop]: regex});
          }
          let [ownerIds, editorIds] = await Promise.all([
            await apiUtils.filterByForeignRef('Workspace', query, 'owner', 'username'),
            await apiUtils.filterByForeignRefArray('Workspace', query, 'editors', 'username')
          ]);


          let combined = _.flatten(ownerIds.concat(editorIds));
          let uniqueIds = _.uniq(combined);
          searchFilter.$or.push({ _id: {$in: uniqueIds} });


        } else if (criterion === 'owner') {
          let ids = await apiUtils.filterByForeignRef('Workspace', query, 'owner', 'username');
          searchFilter = {_id: {$in: ids}};

        } else if (criterion === 'editors') {
          let ids = await apiUtils.filterByForeignRefArray('Workspace', query, 'editors', 'username');
          searchFilter = {_id: {$in: ids}};

        } else {
          query = query.replace(/\s+/g, "");
          let regex = new RegExp(query.split('').join('\\s*'), 'i');

          searchFilter = {[criterion]: regex};
        }
      }
      }
      let sortParam = { lastModifiedDate: -1 };

      let doCollate, byRelevance;

      if (sortBy) {
        sortParam = sortBy.sortParam;
        doCollate = sortBy.doCollate;
        byRelevance = sortBy.byRelevance;
      }

      const criteria = await access.get.workspaces(user, ids, filterBy, searchFilter);
      let results, itemCount;

      let key = Object.keys(sortParam)[0];
      let sortableFields = ['submissions', 'selections', 'comments', 'responses', 'editors'];

      if (byRelevance) {
      [results, itemCount] = await Promise.all([
        models.Workspace.find(criteria, { score: { $meta: "textScore" }}).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
        models.Workspace.count(criteria)
      ]);
      } else if (sortParam && sortableFields.includes(key)) {
        results = await sortWorkspaces(sortParam, req, criteria);
        itemCount = await models.Workspace.count(criteria);
      } else if (doCollate) {
        [results, itemCount] = await Promise.all([
          models.Workspace.find(criteria).collation({ locale: 'en', strength: 1 }).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
          models.Workspace.count(criteria)
        ]);
       } else {
        [ results, itemCount ] = await Promise.all([
          models.Workspace.find(criteria).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
          models.Workspace.count(criteria)
        ]);
       }


      const pageCount = Math.ceil(itemCount / req.query.limit);
      console.log('pageCount', pageCount);
      let currentPage = page;
      if (!currentPage) {
        currentPage = 1;
      }
      console.log('currentPage', currentPage);
      const data = {
        'workspaces': results,
        'meta': {
          'total': itemCount,
          pageCount,
          currentPage
        }
      };
      // console.log('data', data);

      // models.Workspace.find(userAuth.accessibleWorkspacesQuery(user)).exec(function(err, workspaces) {
      //   if (err) {
      //     return utils.sendError.InternalError(err, res);
      //   }
      //   var response = {
      //     workspaces: workspaces,
      //     meta: { sinceToken: new Date() }
      //   };
      //   if(req.body) {
      //     if(req.body.hasOwnProperty('importRequest')) {
      //       response = {importRequest: req.body.importRequest};
      //     }
      //   }

        return utils.sendResponse(res, data);

  // let criteria = await access.get.workspaces(user);
  //   models.Workspace.find(criteria).exec(function(err, workspaces) {
  //     if (err) {
  //       return utils.sendError.InternalError(err, res);
  //     }
  //     workspaces.forEach((workspace) => {
  //       if (!workspace.lastViewed) {
  //         workspace.lastViewed = workspace.lastModifiedDate;
  //         if (!workspace.lastModifiedDate) {
  //           workspace.lastViewed = workspace.createDate;
  //         }
  //          workspace.save();
  //       }
  //     });
  //     var response = {
  //       workspaces: workspaces,
  //       meta: { sinceToken: new Date() }
  //     };
  //     if(req.body) {
  //       if(req.body.hasOwnProperty('importRequest')) {
  //         response = {importRequest: req.body.importRequest};
  //       }
  //     }

  //     utils.sendResponse(res, response);
  //   });

}

function pruneObj(obj) {

  for (let key of Object.keys(obj)) {
    const val = obj[key];
    if (_.isUndefined(val) || (_.isNull(val))) {
      delete obj[key];
    }
  }
  return obj;
}

async function buildCriteria(accessibleCriteria, requestFilter, user) {
  try {
    if (!user) {
      return null;
    }
    const filterFields = ['assignment', 'problem', 'section'];
  let filter = {
    $and: []
  };
  if (accessibleCriteria) {
    filter.$and.push(accessibleCriteria);
  }

  let startDate = requestFilter.startDate;
  let endDate = requestFilter.endDate;

  if (!_.isEmpty(startDate) && !_.isEmpty(endDate)) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    filter.$and.push({createDate : {
      $gte: startDate,
      $lte: endDate
    }});
  }

  let teacher = requestFilter.teacher;
  let isUserTeacher = user.accountType === 'T';

  let assignments, sections;
  // if user is accountType T this criteria will already be built in the accessibleAnswers function
  // the teacher field is forced to their own account for teachers
  if (teacher && !isUserTeacher) {
    [ assignments, sections ] = await Promise.all([
      accessUtils.getTeacherAssignments(teacher),
      accessUtils.getTeacherSectionsById(teacher)
    ]);
    // have to get teacher users and then filter the answers to be created by teacher

    let areValidSections = _.isArray(sections) && !_.isEmpty(sections);
    let areValidAssignments = _.isArray(assignments) && !_.isEmpty(assignments);

    if (!areValidSections && !areValidAssignments) {
      // teacher has no sections and no assignments
      // return nothing?
      return null;
    } else {
      let crit = { $or: [] };
      if (areValidSections) {
        crit.$or.push({ section: { $in: sections } });
      }
      if (areValidAssignments) {
        crit.$or.push({ assignment: { $in: assignments } });
      }
      filter.$and.push(crit);
    }
  }
  for (let field of filterFields) {
    const val = requestFilter[field];
    if (val) {
      filter.$and.push({[field] : val});
    }
  }
  return filter;
  }catch(err) {
    console.error('err building criteria', err);
  }

}

async function getAnswerIds(criteria) {
  const answers = await models.Answer.find(criteria, {_id: 1}).lean().exec();
  return answers.map(obj => obj._id);
}

async function populateAnswers(answers) {
  // return Promise.all(answerIds.map((ans) => {
  //   return ans.populate('createdBy').populate('section').populate('problem').execPopulate();
  // }));
  const opts = [
    {path: 'createdBy', select: 'username'},
    {path: 'problem', select: 'title'},
    {path: 'section', select: ['name', 'teachers']}
  ];
  try {
     return await models.Answer.populate(answers, opts);
  } catch(err) {
    console.error(err);
  }
}

async function answersToSubmissions(answers) {
  if (!Array.isArray(answers) || _.isEmpty(answers)) {
    return [];
  }
  try {
    const populated = await populateAnswers(answers);
    const subs = populated.map((ans) => {
      //const teachers = {};
      const clazz = {};
      const publication = {
        publicationId: null,
        puzzle: {}
      };
      const creator = {};
      const teacher = {};


      const student = ans.createdBy;
      const studentNames = ans.studentNames;
      const section = ans.section;
      const problem = ans.problem;

      if (problem) {
        publication.puzzle.title = problem.title;
        publication.puzzle.problemId = problem._id;

      }
      // answers should always have createdBy...
      if (student) {
        if (student.username !== 'old_pows_user') {
          creator.studentId = student._id;
          creator.username = student.username;
        } else {
          if (apiUtils.isNonEmptyArray(studentNames)) {
            if (studentNames.length === 1) {
              creator.fullName = apiUtils.capitalizeString(studentNames[0], true);
              creator.safeName = apiUtils.getSafeName(creator.fullName, false, false);
            } else {
              // handle cases of multiple students?
              // for now just take first
              creator.fullName = apiUtils.capitalizeString(studentNames[0], true);
              creator.safeName = apiUtils.getSafeName(creator.fullName, false, false);
            }
          }
        }
      }

      let teachers;
      let primaryTeacher;

      if (section) {
        clazz.sectionId = section._id;
        clazz.name = section.name;
        teachers = section.teachers;
        if (_.isArray(teachers)) {
          primaryTeacher = teachers[0];
          teacher.id = primaryTeacher;
        }
      }

      let teachers;
      let primaryTeacher;

      if (section) {
        clazz.sectionId = section._id;
        clazz.name = section.name;
        teachers = section.teachers;
        if (_.isArray(teachers)) {
          primaryTeacher = teachers[0];
          teacher.id = primaryTeacher;
        }
      }





      let sub = {
        //longAnswer: ans.explanation,
        //shortAnswer: ans.answer,
        clazz: clazz,
        creator: creator,
        teacher: teacher,
        publication: publication,
        imageId: ans.uploadedFileId,
        answer: ans._id
      };
      return sub;
    });
    return subs;
  } catch(err) {
    console.log('error mapping answers to subs', err);
  }
}

async function postWorkspaceEnc(req, res, next) {
  const user = req.user;
  const workspaceCriteria = req.body.encWorkspaceRequest;
  // const requestedName = workspaceCriteria.requestedName;

  // const folderSetName = workspaceCriteria.folderSetName;

  const { requestedName, mode, folderSetName, owner } = workspaceCriteria;

  try {
    const pruned = pruneObj(workspaceCriteria);

    // accessibleAnswersQuery will take care of isTrashed
    delete pruned.isTrashed;
    delete pruned.isEmptyAnswerSet;

    const accessibleCriteria = await answerAccess.get.answers(user);

    let wsCriteria;

    // returns null if teacher has no sections or assignments
    if (!_.isNull(accessibleCriteria)) {
      wsCriteria = await buildCriteria(accessibleCriteria, pruned, user);
    }

    // currently buildCriteria will return null if teacher filter is applied and the chosen
    // teacher does not have any sections or assignments because currently there is no way
    // to have any answers associated with a teacher outside of an assignment/section
    // there can be answers associated with a problem outside of an assignemnt, but these answers
    // are not associated with a teacher that is an encompass user(??)
    let answers;
    if (!_.isNull(wsCriteria) && !_.isUndefined(wsCriteria)) {
      answers = await models.Answer.find(wsCriteria);
    }


    if (_.isEmpty(answers) || _.isUndefined(answers)) {
      //let rec = req.body.encWorkspaceRequest;
      let rec = pruned;
      rec.isEmptyAnswerSet = true;
      let enc = new models.EncWorkspaceRequest(rec);
      let saved = await enc.save();

      const data = { encWorkspaceRequest: saved };
        return utils.sendResponse(res, data);
      }

    let subs = await answersToSubmissions(answers);
    const submissions = await Promise.all(subs.map((obj) => {
      let sub = new models.Submission(obj);
      sub.createdBy = user;
      sub.createDate = Date.now();
      return sub.save();
}));
const submissionIds = submissions.map((sub) => {
  return sub._id;
});
const submissionSet = await importApi.buildSubmissionSet(submissions, user);
let name;

if (requestedName) {
  name = requestedName;
} else {
  name = nameWorkspace(submissionSet, user, false);
}

let workspace = new models.Workspace({
  mode,
  name,
  owner,
  submissionSet: submissionSet,
  submissions: submissionIds,
  createdBy: user,
  lastModifiedBy: user,
  lastModifiedDate: new Date(),
  lastViewed: new Date(),
});
let ws = await workspace.save();
//const data = {'workspaceId': ws._id};

let newFolderSet = await newFolderStructure(user, ws, folderSetName);

let rec = pruned;
rec.createdWorkspace = ws._id;
const encRequest = new models.EncWorkspaceRequest(rec);
const saved = await encRequest.save();
// saved.workspaceId = ws._id;
// saved.submissionId = ws.submissions[0];

const data = { encWorkspaceRequest: saved };

return utils.sendResponse(res,  data);

  } catch(err) {
    return utils.sendError.InternalError(err, res);
  }
}

module.exports.post.workspaceEnc = postWorkspaceEnc;

module.exports.get.workspace = sendWorkspace;
module.exports.get.workspaces = getWorkspaces;
module.exports.put.workspace = putWorkspace;
module.exports.post.workspace = postWorkspace;
module.exports.post.newWorkspaceRequest = newWorkspaceRequest;
module.exports.packageSubmissions = packageSubmissions;
module.exports.nameWorkspace = nameWorkspace;
module.exports.newFolderStructure = newFolderStructure;
/*jshint ignore:end*/