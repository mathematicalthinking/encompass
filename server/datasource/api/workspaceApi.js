/**
  * # Workspaces API
  * @description This is the API for workspace based requests
  * @authors Damola Mabogunje <damola@mathforum.org>, Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.0
  */

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
async function newFolderStructure(user, wsInfo, folderSetHash) {
  try {
    let folders = [];
    const folderIds = [];

    if (!apiUtils.isNonEmptyObject(wsInfo) || !apiUtils.isNonEmptyObject(folderSetHash)) {
      return;
    }

    let { folderSetId, folderSetObjects } = folderSetHash;
    const { newWsId, newWsOwner } = wsInfo;

    if(!folderSetId && !folderSetObjects) {
      return folders;
    }

    if (apiUtils.isNonEmptyArray(folderSetObjects)) {
      folders = folderSetObjects;
    } else if (folderSetId) {
      // lookup folderSet in db
      const folderSet = await models.FolderSet.findById(folderSetId).lean().exec();
      folderSetObjects = folderSet.folders;
    }

    const recurse = async function(folderObj, parentId) {
      try {
        if (!folderObj) {
          return;
        }
        // console.log(`parent for folderObj: ${folderObj.name}: ${parentId}`);

        let f = new models.Folder({
          owner: newWsOwner,
          name: folderObj.name,
          weight: folderObj.weight ? folderObj.weight : 0,
          createdBy: user._id,
          lastModifiedBy: user._id,
          children: [],
          workspace: newWsId
        });

        if (parentId) {
          f.parent = parentId;
        }

        const children = folderObj.children;
        if (_.isEmpty(children)) {
          return f.save()
          .then((doc) => {
            folderIds.push(doc._id);
            return doc;
          });
        }

        f.children = await Promise.all(_.map(children, (child => {
          return recurse(child, f._id);
        })));

        let newChildren = f.children;
        let mapped = _.map(newChildren, (child => {
          // can only save the id of the child folder in children array
          return child._id;
        }));

        f.children = mapped;
        return f.save()
          .then((doc) => {
            folderIds.push(doc._id);
            return doc;
          });
      }catch(err) {
        console.error(`Error recurse : ${err}`);
      }
    };

    folders = await Promise.all(_.map(folderSetObjects, (obj => {
      return recurse(obj, null);
    })));
    return folderIds;
  }catch(err) {
    console.error(`Error newFolderStructure: ${err}`);
  }
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
function newWorkspace(submissionSet, user, folderSetId) {
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
      console.error(`Error newWorkspace save: ${err}`);
    }
    var wsInfo = { newWsId: ws._id, newWsOwner: ws._owner };
    var folderSetInfo = { folderSetId: folderSetId, folderSetObjects: null };
    newFolderStructure(user, wsInfo, folderSetInfo).then(function(){
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
function handleSubmissionSet(submissionSet, user, folderSetId) {
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
    return newWorkspace(submissionSet, user, folderSetId).then(function(){
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
function handleSubmissionSets(submissionSets, user, folderSetId) {
  logger.debug('There are ' + submissionSets.length + 'submission sets.');
  logger.debug('looking for filters');
  var tasks = [];
  submissionSets.forEach(function(submissionSet){
    tasks.push(handleSubmissionSet(submissionSet, user, folderSetId));
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
  var folderSetId = req.body.newWorkspaceRequest.folderSetId;
  // logger.debug('creating new workspace for pdset: ' + pdSetName);

  //copy over all of the pdsubmissions
  prepareUserSubmissions(user, pdSetName, folderSetId, function () {
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

      handleSubmissionSets(submissionSets, user, folderSetId).then(function() {
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
 async function getWorkspaces(req, res, next) {
  var user = userAuth.requireUser(req);
  logger.info('in getWorkspaces');
  logger.debug('looking for workspaces for user id' + user._id);

  let { ids, filterBy, sortBy, searchBy, page, } = req.query;

      if (filterBy) {
        // console.log('filterBy workspace API:', JSON.stringify(filterBy));
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

      let sortField = Object.keys(sortParam)[0];
      let sortableFields = ['submissions', 'selections', 'comments', 'responses', 'editors'];

      if (byRelevance) {
        [results, itemCount] = await Promise.all([
          models.Workspace.find(criteria, { score: { $meta: "textScore" }}).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
          models.Workspace.count(criteria)
        ]);
      } else if (sortParam && sortableFields.includes(sortField)) {
        results = await apiUtils.sortWorkspaces('Workspace', sortParam, req, criteria);
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
      let currentPage = page;
      if (!currentPage) {
        currentPage = 1;
      }
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

function populateAnswers(answers) {
  const opts = [
    {path: 'createdBy', select: 'username'},
    {path: 'problem', select: 'title'},
    {path: 'section', select: ['name', 'teachers']}
  ];
    return models.Answer.populate(answers, opts);
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
        if (apiUtils.isNonEmptyArray(teachers)) {
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
  const user = userAuth.requireUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError('You must be logged in!', res);
  }

  const workspaceCriteria = req.body.encWorkspaceRequest;
  const { requestedName, mode, folderSet, owner } = workspaceCriteria;

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

    const wsInfo = { newWsId: ws._id, newWsOwner: ws._owner };
    const folderSetInfo = { folderSetId: folderSet, folderSetObjects: null };

    // creates new folders for workspace
    await newFolderStructure(user, wsInfo, folderSetInfo);

    let rec = pruned;
    rec.createdWorkspace = ws._id;
    const encRequest = new models.EncWorkspaceRequest(rec);
    const saved = await encRequest.save();

    const data = { encWorkspaceRequest: saved };

    return utils.sendResponse(res,  data);

  } catch(err) {
    return utils.sendError.InternalError(err, res);
  }
}

function buildAnswersToClone(answers, hash) {
  // answers is array of populated answer docs
  if (!answers || !_.isArray(answers)) {
    return;
  }
  let { all, none, answerIds } = hash;

  if (all) {
    return [...answers];
  }

  if (none || !apiUtils.isNonEmptyArray(answerIds)) {
    return [];
  }

  return _.filter(answers, (answer) => {
    return _.contains(answerIds, answer._id.toString());
  });
}

async function copyAndSaveFolderStructure(user, originalWsId, folderIds, folderSetOptions) {

  // check if user has proper permissions
  try {
    const results = {
      folderSetId: null,
      folderSetObjects: [],
      isInvalidWorkspace: false
    };
    if (apiUtils.isNonEmptyObject(folderSetOptions)) {
      const { existingFolderSetToUse } = folderSetOptions;

      if (existingFolderSetToUse) {
        results.folderSetId = existingFolderSetToUse;
        return results;
      }
    }

    const workspace = await models.Workspace.findById(originalWsId).populate('folders').lean().exec();

    if (_.isNull(workspace)) {
      results.isInvalidWorkspace = true;
      return results;
    }
    const folders = workspace.folders;
    if (_.isEmpty(folders)) {
      // console.log('no folders in original ws:', originalWsId);
      return results;
    }

    const topLevelFolders = _.filter(folders, (folder => {
      return apiUtils.isNullOrUndefined(folder.parent) && _.contains(_.map(folderIds, id => id.toString()), folder._id.toString());
    }));
    const topLevelFolderIds = _.map(topLevelFolders, folder => folder._id);
    const recurse = function(folderId) {
      if (!folderId) {
        return;
      }
      let ret = {};

      return models.Folder.findById(folderId).lean().exec()
        .then(async (doc) => {
          if (_.isNull(doc)) {
            return null;
          }
          ret = {
            name: doc.name,
            weight: doc.weight ? doc.weight : 0,
            children: [],
          };

          const children = doc.children;
          if (_.isEmpty(children)) {
            return ret;
          }
          ret.children = await Promise.all(_.map(children, (child => {
            return recurse(child);
          })));

          return ret;

        })
        .catch((err) => {
          console.log('err', err);
        });
    };

    const folderObjects = await Promise.all(_.map(topLevelFolderIds, (folderId) => {
      return recurse(folderId);
    }));

    results.folderSetObjects = folderObjects;

    const { doCreateFolderSet, name, privacySetting } = folderSetOptions;

    if (doCreateFolderSet) {
      // verify this is a valid enum value?

      const folderSet = new models.FolderSet({
        name,
        privacySetting,
        folders: folderObjects,
        createdBy: user._id,
        lastModifiedBy: user._id
      });

      const saved = await folderSet.save();
      results.folderSetId = saved._id;
      return results;
    }
    // else just return the folder objects
    // console.log('not creating folderset');
    return results;
  }catch(err) {
    console.error(`Error copyAndSaveFolderStructure: ${err}`);
  }
}

function copyTagging(id, newFolder, taggingsKey, wsInfo) {
/*
 taggingsKey map betweeen oldTagging and newSelectionId
*/
  return models.Tagging.findById(id).lean().exec()
    .then(async (tagging) => {
      if (_.isNull(tagging)) {
        return null;
      }
      //remove told tagging references from selection
      await models.Selection.update({_id: taggingsKey[tagging._id]}, {$pull: {taggings: tagging._id}});

      const { newWsId } = wsInfo;

      const newTagging = new models.Tagging({
        workspace: newWsId,
        createdBy: tagging.createdBy,
        lastModifiedBy: tagging.lastModifiedBy,
        lastModifiedDate: tagging.lastModifiedDate,
        folder: newFolder._id,
        selection: taggingsKey[tagging._id]
      });

      return newTagging.save();
    })
    .then((tag) => {
      return tag._id;
    });
}

function copyTaggings(oldTaggingIds, newFolder, taggingsKey, wsInfo) {
  if (!apiUtils.isNonEmptyArray(oldTaggingIds)) {
    return Promise.resolve([]);
  }

  return Promise.all(
    _.chain(oldTaggingIds)
      .filter((taggingId) => {
        return taggingsKey[taggingId];
      })
      .map((id) => {
        return copyTagging(id, newFolder, taggingsKey, wsInfo);
      })
      .value()
  );

}

function copyFolders(user, oldTopLevelFolders, taggingsKey, wsInfo) {
  const { newWsId, newWsOwner } = wsInfo;
  const folderIds = [];
  const taggingIds = [];

  const recurse = async function(folder, parentId) {
    if (!folder) {
      return;
    }
    // check if folder passed in is objectId
    let isObjectId = mongoose.Types.ObjectId.isValid(folder);

    if (isObjectId) {
      // lookup folder
      folder = await models.Folder.findById(folder).lean().exec();
    }

    let f = new models.Folder({
      owner: newWsOwner,
      name: folder.name,
      weight: folder.weight ? folder.weight : 0,
      createdBy: user._id,
      lastModifiedBy: user._id,
      children: [],
      workspace: newWsId
    });

    if (parentId) {
      f.parent = parentId;
    }

    const taggings = folder.taggings;

    if (apiUtils.isNonEmptyArray(taggings)) {

      let ids = await copyTaggings(taggings, f, taggingsKey, wsInfo);
      taggingIds.push(...ids);
      f.taggings = ids;
    }

    const children = folder.children;

    if (_.isEmpty(children)) {
      return f.save()
      .then((doc) => {
        folderIds.push(doc._id);
        return doc;
      });
    }

    f.children = await Promise.all(_.map(children, (child => {
      return recurse(child, f._id);
    })));

    let newChildren = f.children;
    // can only save the id of the child folder in children array
    f.children = _.map(newChildren, child => child._id);

    return f.save()
      .then((doc) => {
        folderIds.push(doc._id);
        return doc;
    });
  };

  return Promise.all(
    _.map(oldTopLevelFolders, (obj => {
      return recurse(obj, null);
  })))
    .then((folders) => {
      return [folderIds, taggingIds];
    });
}

//deepCloneFolders(folderIdsToCopy, taggingsKey, wsInfo)
async function deepCloneFolders(user, folderIds, taggingsKey, wsInfo) {
  // taggings key is hash where key is oldTaggingId and value is new selectionId

  try {
    if (!apiUtils.isNonEmptyArray(folderIds) || !apiUtils.isNonEmptyObject(wsInfo)) {
      return;
    }
    // do we need to check for isTrashed here?
    const oldFolders = await models.Folder.find({_id: { $in: folderIds }}).lean().exec();
    const oldTopLevelFolders = _.filter(oldFolders, (folder => {
      return apiUtils.isNullOrUndefined(folder.parent);
    }));

    return copyFolders(user, oldTopLevelFolders, taggingsKey, wsInfo);

  }catch(err) {
    console.error(`Error deepCloneFolders: ${err}`);
  }
}

async function buildTaggingsKey(folderIdsToCopy, selectionsKey) {
  const hash = {};
  if (!apiUtils.isNonEmptyArray(folderIdsToCopy)) {
    return hash;
  }

  const folders = await models.Folder.find({_id: {$in: folderIdsToCopy}}).populate('taggings').lean().exec();
  if (_.isEmpty(folders)) {
    return hash;
  }

  _.chain(folders)
  .map(folder => folder.taggings)
  .flatten()
  .filter((tagging) => {
    return tagging.selection && selectionsKey[tagging.selection];
  })
  .each((tagging) => {
    // set value to new selectionId
    hash[tagging._id] = selectionsKey[tagging.selection];
  })
  .value();

  return hash;

}

async function handleNewFolders(user, wsInfo, oldFolderIds, options, selectionsKey) {
  try {
    // check user permissions
    const results = {
      folders: [],
      taggings: [],
      folderSet: null
    };
    /*
    wsInfo = {
     originalWsId
     newWsId:
     newWsOwner
   };
    */

    const { originalWsId } = wsInfo;

    let { includeStructureOnly, all, none, folderSetOptions } = options;
    let folderIdsToCopy;

    if (none) {
      if (!apiUtils.isNonEmptyObject(folderSetOptions) || apiUtils.isNullOrUndefined(folderSetOptions.existingFolderSetToUse)) {
        return results;
      }
      // just create folder structure from folderSet Id;
      let folderSetInfo;
      if (folderSetOptions.existingFolderSetToUse) {
        folderSetInfo = { folderSetId: folderSetOptions.existingFolderSetToUse };
      }
      const newFolderIds = await newFolderStructure(user, wsInfo, folderSetInfo);

      if (apiUtils.isNonEmptyArray(newFolderIds)) {
        results.folders = newFolderIds;
      }
      return results;
    } else {
      folderIdsToCopy = all ? [...oldFolderIds] : [];
    }

     let taggingsKey = {};

    if (includeStructureOnly) {
      // need to copy and make new folder set

      //should return object
      /*
        folderSetId: objectId or null,
        folderSetObjects: array of objects that can be passed to newFolderStructure
      */
      let folderSetInfo = await copyAndSaveFolderStructure(user, originalWsId, folderIdsToCopy, folderSetOptions);
      // newFolderStructure returns array of newly created FolderIds
      const newFolderIds = await newFolderStructure(user, wsInfo, folderSetInfo);

      if (apiUtils.isNonEmptyArray(newFolderIds)) {
        results.folders = newFolderIds;
      }
      return results;

    } else {
      taggingsKey = await buildTaggingsKey(folderIdsToCopy, selectionsKey);
      let [folderIds, taggingIds] = await deepCloneFolders(user, folderIdsToCopy, taggingsKey, wsInfo);

      results.folders = folderIds;
      results.taggings = taggingIds;
      return results;
      // need to copy folder AND taggings (and selections)
      // and create new folder
      // make new folderSet too?
    }
  }catch(err) {
    console.error(`Error handleNewFolders: ${err}`);
  }
}

function buildSelectionsKey(submissionSels, originalSelectionIds, selectionsConfig) {
  const hash = {};
  const { all, none, selectionIds } = selectionsConfig;

  if (none) {
    return hash;
  }

  const ids = all ? originalSelectionIds : selectionIds;
  _.chain(ids)
    .filter(id => submissionSels[id])
    .each((id) => {
      hash[id] = true;
    })
    .value();
    return hash;
}
function copyComment(oldCommentId, newSub, selectionsKey, newWsId) {
  return models.Comment.findById(oldCommentId).lean().exec()
    .then((oldComment => {
      if (_.isNull(oldComment)) {
        return null;
      }
      const oldCommentSelectionId = oldComment.selection;

      const newComment = new models.Comment({
        createdBy: oldComment.createdBy,
        lastModifiedBy: oldComment.lastModifiedBy,
        coordinates: oldComment.coordinates,
        text: oldComment.text,
        label: oldComment.label,
        useForResponse: oldComment.useForResponse,
        selection: selectionsKey[oldCommentSelectionId],
        submission: newSub._id,
        workspace: newWsId,
        type: oldComment.type
      });
      return newComment.save().then((comment) => {
        return comment._id;
      });
    }))
    .catch((err => {
      console.error(`Error copyComment: ${err}`);
    }));
}

function copyComments(commentsKey, newSub, selectionsKey, newWsId) {
  const oldCommentIds = newSub.comments;
  if (!apiUtils.isNonEmptyArray(oldCommentIds)) {
    return Promise.resolve([]);
  }

  return Promise.all(
    _.chain(oldCommentIds)
      .filter((commentId) => {
        return commentsKey[commentId];
      })
      .map((id) => {
        return copyComment(id, newSub, selectionsKey, newWsId);
      })
      .value()
  );
}

function copySelection(user, oldSelId, newSubId, newWsId, selectionsKey) {
  // oldSel is objectId
  // oldSub is json Object
  // newSub is functional mongoose Submission document
  // folderOptions will determine if taggings should be copied

  return models.Selection.findById(oldSelId).lean().exec()
    .then((oldSelection => {
      // sel does not exist
      if (_.isNull(oldSelection)) {
        return null;
      }
      const newSel = new models.Selection({
        createdBy: oldSelection.createdBy,
        lastModifiedBy: oldSelection.lastModifiedBy,
        coordinates: oldSelection.coordinates,
        text: oldSelection.text,
        submission: newSubId,
        workspace: newWsId,
        comments: oldSelection.comments,
        taggings: oldSelection.taggings
      });

      // selections have array of comments
      // const newComments = await copyComments(oldSelection.comments, newSel._id, newSub._id);
      return newSel.save().then((sel) => {
        selectionsKey[oldSelId] = sel._id;
        return sel;
      });

    }))
    .catch((err) => {
      console.error(`Error copySelection: ${err}`);
    });
}
// copySelections(user, selectionsKey, oldSub, newSub, newWs._id)
function copySelections(user, selectionsKey, oldSub, newSub, newWsId) {
  //selectionsKey is hash where keys are oldSelectionIds to be copied and value is true
  const oldSelections = oldSub.selections;
  if (!apiUtils.isNonEmptyArray(oldSelections)) {
    return Promise.resolve([]);
  }
  return Promise.all(
    _.chain(oldSelections)
      .reject((selId) => {
        return _.isUndefined(selectionsKey[selId.toString()]);
      })
      .map((selId) => {
        // update selectionsKey
        return copySelection(user, selId, newSub._id, newWsId, selectionsKey)
          .then((newSel) => {
            return newSel._id;

          });
      })
      .value()
  );
}

// buildCommentsKey(selectionsKey, originalWs.comments, commentsConfig);
async function buildCommentsKey(selectionsKey, originalCommentIds, commentsConfig) {
  const hash = {};
  const { all, none, commentIds } = commentsConfig;
  if (none) {
    return hash;
  }

  const ids = all ? originalCommentIds : commentIds;
  // filter ids based on selectionsKey

const comments = await models.Comment.find({_id: {$in: ids}});

_.chain(comments)
  .filter(comment => selectionsKey[comment.selection])
  .each((comment) => {
    hash[comment._id] = true;
  })
  .value();
  return hash;
}

// await handleResponses(user, workspaceInfo, originalWs.responses, responseOptions);
function buildResponsesKey(originalResponseIds, responseOptions) {
  const hash = {};
  const { all, none, responseIds } = responseOptions;
  if (none) {
    return hash;
  }

  const ids = all ? originalResponseIds : responseIds;

  _.each(ids, (id) => {
    hash[id] = true;
  });
  return hash;
}
function copyResponse(originalResponseId, newSubId, newWsId) {
  return models.Response.findById(originalResponseId).lean().exec()
    .then((oldResponse) => {
      if (_.isNull(oldResponse)) {
        return null;
      }
      const newResponse = new models.Response({
        createdBy: oldResponse.createdBy,
        lastModifiedBy: oldResponse.lastModifiedBy,
        text: oldResponse.text,
        source: oldResponse.source,
        original: oldResponse.original,
        recipient: oldResponse.recipient,
        workspace: newWsId,
        submission: newSubId
      });
      return newResponse.save().then(doc => doc._id);
    });
}
//copyResponses(responsesKey, submission, newWs._id)
function copyResponses(responsesKey, newSubmission, newWsId) {
  if (!apiUtils.isNonEmptyArray(newSubmission.responses)) {
    return Promise.resolve([]);
  }
  return Promise.all(
    _.chain(newSubmission.responses)
      .filter(responseId => responsesKey[responseId])
      .map(id => copyResponse(id, newSubmission._id, newWsId))
      .reject(apiUtils.isNullOrUndefined)
      .value()
  );
}

function buildAnswerSetAndSubmissionsMap(originalWs) {
  const copiedAnswers = originalWs.answers;
  // submissions map is used to keep track of the relationship between an answer and its submission
  const submissionsMap = {};
  let answerSet;
  let error = null;

  // let results = [error, answerSet, submissionsMap];

  // currently workspaces do not have answers field but could in future?
  if (apiUtils.isNonEmptyArray(copiedAnswers)) {
    answerSet = copiedAnswers;
    return [null, answerSet, null];
  } else {
    // use the original workspace's submissions array to get the answer pool
    const submissions = originalWs.submissions;

    // return error if there are no submissions (and thus answers) to copy from original workspace
    if (!apiUtils.isNonEmptyArray(submissions)) {
      error = 'Workspace does not have any submissions to copy.';
      return [error, null, null];
    }
    // all submissions (except currently 15 extraneous KenKen submissions) should have an associated Encompass answer record
    const subsWithAnswers = _.reject(submissions, (sub => apiUtils.isNullOrUndefined(sub.answer)));

    // return error if there are no answers associated with submissions
    if (!apiUtils.isNonEmptyArray(subsWithAnswers)) {
      error = 'This workspace does not have any answers';
      return [error, null, null];
    }


    answerSet = _.map(subsWithAnswers, (sub => {
      submissionsMap[sub.answer._id] = sub;
      return sub.answer;
    }));

    return [null, answerSet, submissionsMap];
  }

}

async function cloneWorkspace(req, res, next) {
  try {
    const user = userAuth.requireUser(req);
    // check if user has permission to copy this workspace
    // console.log('clone request options', JSON.stringify(req.body));
    const copyWorkspaceRequest = req.body.copyWorkspaceRequest;
    console.log('CWR', JSON.stringify(copyWorkspaceRequest, null, 2));
    if (!apiUtils.isNonEmptyObject(copyWorkspaceRequest)) {
      return utils.sendError.InvalidContentError('Invalid or missing copy workspace request parameters', res);
    }

    const requestDoc = new models.CopyWorkspaceRequest(copyWorkspaceRequest);

    if (!requestDoc.createdBy) {
      requestDoc.createdBy = user.id;
    }
    /*
    {
      name: if not provided will be same as original (or possible concatenate copy + sequential number?),
      owner: default to current user, unless other userId is provided
      mode: default to original
      answers: {
        all: bool,
        answerIds: [array of answerIds]
        none: bool,
      }

      folders: {
        includeStructureOnly: bool,
        folderSetOptions: {
          doCreateFolderSet: bool,
          name: string,
          privacySetting: ['M', 'O', 'E']
        }
        all: bool,
        none: bool,
        folderIds: [array of folderIds]

      }
      comments: {
        all: bool,
        none: bool,
        commentIds: [array of commentIds]
      }
      responses: {
        all: bool,
        none: bool,
        responseIds: [responseIds]
      }

      comments, selections, taggings are dependent on the setting chosen for answers
      e.g. if only a subset of the workspace's answers are chosen, 'all' for comments means
      all of the comments related to that subset of answers
      permissions?? editors??
    }
    */

    // check for optionsHash

    // look up workspace in db by id snd populate submissions (and the submission answers), and answers(if any)
    const { originalWsId } = copyWorkspaceRequest;
    const originalWs = await models.Workspace.findById(originalWsId).populate({path: 'submissions', populate: {path: 'answer'}}).populate('answers').lean().exec();

    // workspace does not exist
    if (_.isNull(originalWs)) {
      requestDoc.copyWorkspaceError = 'Requested workspace does not exist';
      let saved = await requestDoc.save();
      const data = { copyWorkspaceRequest: saved };

      return utils.sendResponse(res, data);
    }

    // process basic settings
    const { name, owner, mode, createdBy } = copyWorkspaceRequest;

    // use original name, mode if not provided
    // set owner as current user if owner not provided
    const newWs = new models.Workspace({
      name: name || originalWs.name,
      owner: owner || user._id,
      mode: mode || originalWs.mode,
      createdBy: createdBy || user._id
    });

    let savedWs = await newWs.save();

    // destructure options parameters
    // will be used to determine which records to copy
    const { answerOptions, selectionOptions, folderOptions, commentOptions, responseOptions } = copyWorkspaceRequest;

    /*
      answerSet is array of populated answer docs
      submissionsMap is mapping between an answer and its corresponding submission
      {
        answerId: populatedSubmissionDoc
      }
    */
    let [ error, answerSet, submissionsMap] = buildAnswerSetAndSubmissionsMap(originalWs);

    if (error) {
      requestDoc.copyWorkspaceError = error;
      let saved = await requestDoc.save();
      const data = { copyWorkspaceRequest: saved };

      return utils.sendResponse(res, data);
    }

    // answersToClone is filtered answer docs based on request params
    let answersToClone = buildAnswersToClone(answerSet, answerOptions);

    if (!apiUtils.isNonEmptyArray(answersToClone)) {
      requestDoc.copyWorkspaceError = `There are no submissions to copy.`;
      let saved = await requestDoc.save();
      const data = { copyWorkspaceRequest: saved };

      return utils.sendResponse(res, data);
    }

    /*
      submissionKey is used to keep track of which original submissions should be copied
      {
        submissionId: true
      }
    */
    let submissionsKey = {};

    /*
      submissionSels is used to keep track of the original selections that belong to an original submission that is in submission key
      {
        selectionId: true
      }
    */
    let submissionSels = {};

    _.each(answersToClone, (ans => {
      let sub = submissionsMap[ans._id];

      if (sub) {
        submissionsKey[sub._id] = true;

        if (apiUtils.isNonEmptyArray(sub.selections)) {
          _.each(sub.selections, (selId) => {
            submissionSels[selId] = true;
          });
        }
      }
    }));

    // json objects that will be converted to mongoose docs and saved to db
    // does not handle copying of existing submissions' commments, selections, responses, etc
    let subs = await answersToSubmissions(answersToClone);

    // convert sub json objects to mongoose docs and save
    const submissions = await Promise.all(subs.map((obj) => {
      let sub = new models.Submission(obj);
      let ans = obj.answer.toString();
      let newId = sub._id.toString();

      //eslint-disable-next-line prefer-object-spread
      submissionsMap[newId] = Object.assign({}, submissionsMap[ans]);
      delete submissionsMap[ans];

      sub.createdBy = user._id;
      sub.createDate = Date.now();
      sub.lastModifiedBy = user._id;
      return sub.save();
    }));

    // submissionsMap is now a mapping between the new copied submissionId and the old submission doc

    const workspaceInfo = {
      originalWsId: originalWsId,
      newWsId: newWs._id,
      newWsOwner: newWs.owner
    };


    /*
      selectionsKey is used to determine which selections should be copied
      {
        selectionId: true
      }
    */
    const selectionsKey = buildSelectionsKey(submissionSels, originalWs.selections, selectionOptions);

    const newSubsWithSelections = await Promise.all(
      _.map(submissions, (submission) => {
        // use oldSub document to set original comments, responses on new sub doc
        // these will be updated later
        let oldSub = submissionsMap[submission._id];
        submission.comments = oldSub.comments;
        submission.responses = oldSub.responses;

        // copy selections and set new selections on new submission
        return copySelections(user, selectionsKey, oldSub, submission, newWs._id)
          .then((selIds) => {
            if (apiUtils.isNonEmptyArray(selIds)) {
              submission.selections = selIds;
            } else {
              submission.selections = [];
            }
            return submission.save();
          });
      }));

      newWs.selections = _.chain(newSubsWithSelections)
        .map(sub => sub.selections)
        .flatten()
        .value();

    /*
      commentssKey is used to determine which commentss should be copied
      {
        commentId: true
      }
    */
    const commentsKey = await buildCommentsKey(selectionsKey, originalWs.comments, commentOptions);

    const newSubsWithComments = await Promise.all(
      _.map(newSubsWithSelections, (submission) => {
        return copyComments(commentsKey, submission, selectionsKey, newWs._id)
        .then((commentIds) => {
          if (apiUtils.isNonEmptyArray(commentIds)) {
            submission.comments = commentIds;
          } else {
            submission.comments = [];
          }
          return submission.save();
        });
      })
    );

    newWs.comments = _.chain(newSubsWithComments)
      .map(sub => sub.comments)
      .flatten()
      .value();

    const responsesKey = buildResponsesKey(originalWs.responses, responseOptions);

    const newSubsWithResponses = await Promise.all(
      _.map(newSubsWithComments, (submission) => {
        return copyResponses(responsesKey, submission, newWs._id)
        .then((responseIds) => {
          if (apiUtils.isNonEmptyArray(responseIds)) {
            submission.responses = responseIds;
          } else {
            submission.responses = [];
          }
          return submission.save();
        });
      })
    );

    newWs.responses = _.chain(newSubsWithResponses)
      .map(sub => sub.responses)
      .flatten()
      .value();
    const submissionSet = await importApi.buildSubmissionSet(newSubsWithSelections, user);


    const submissionIds = _.map(newSubsWithResponses, sub => sub._id);

    // set submissions and submissionSet on ws
    newWs.submissions = submissionIds;
    newWs.submissionSet = submissionSet;

    /*
    returns {
    folders: [oIds],
    taggings: [oIds],
    folderSet: folderSetId
  }
  */
  const newFolders = await handleNewFolders(user, workspaceInfo, originalWs.folders, folderOptions, selectionsKey);

  newWs.folders = newFolders.folders;
  newWs.taggings = newFolders.taggings;

  // set Permissions

  const { permissionsOptions } = { copyWorkspaceRequest };

  if (apiUtils.isNonEmptyObject(permissionsOptions)) {
    if (apiUtils.isNonEmptyArray(permissionsOptions.permissionObjects)) {
      newWs.permissions = permissionsOptions.permissionObjects;
    }
  }

  savedWs = await newWs.save();

  requestDoc.createdWorkspace = savedWs._id;

  const savedRequest = await requestDoc.save();

  const data = { copyWorkspaceRequest: savedRequest};

  return utils.sendResponse(res, data);

  }catch(err) {
    console.error(`Error copyWorkspace: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }
}

module.exports.post.workspaceEnc = postWorkspaceEnc;
module.exports.post.cloneWorkspace = cloneWorkspace;
module.exports.get.workspace = sendWorkspace;
module.exports.get.workspaces = getWorkspaces;
module.exports.put.workspace = putWorkspace;
module.exports.post.workspace = postWorkspace;
module.exports.post.newWorkspaceRequest = newWorkspaceRequest;
module.exports.packageSubmissions = packageSubmissions;
module.exports.nameWorkspace = nameWorkspace;
module.exports.newFolderStructure = newFolderStructure;
