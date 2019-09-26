/* eslint-disable complexity */
/* eslint-disable max-depth */
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
const responseAccess = require('../../middleware/access/responses');
const parentWsApi = require('./parentWorkspaceApi');

const objectUtils = require('../../utils/objects');
const stringUtils = require('../../utils/strings');
const mongooseUtils = require('../../utils/mongoose');

const { isNil, isNonEmptyArray, isNonEmptyObject, } = objectUtils;

const { capitalizeString, } = stringUtils;

const { areObjectIdsEqual, isValidMongoId } = mongooseUtils;

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

function getRestrictedDataMap(user, permissions, ws, isBasicStudentAccess) {
  // check if user has specific permissions in ws permissions array
  // ws has selections, submissions, folders, taggings populated

  // isBasicStudentAccess means user only has access to their own submissions
  // and no sels, folders, comments, and cannot make feedback

  if (isBasicStudentAccess) {
    permissions = {
      submissions: {
        userOnly: true,
        all: false
      },
      selections: 0,
      comments: 0,
      folders: 0,
      feedback: 'none'
    };
  }

  if (isNil(permissions) || !isNonEmptyObject(ws)) {
    return {};
  }

  const dataMap = {};
  const { submissions, folders, selections, comments, feedback } = permissions;

  // filter submissions to requestedIds
  if (_.propertyOf(submissions)('all') !== true) {
    let submissionIds = _.propertyOf(submissions)('submissionIds') || [];
    let wsSubs = ws.submissions || [];

    let filteredSubs;


    if (_.propertyOf(submissions)('userOnly') === true ) {
      // filter for subs created by currentUser
      // i.e. creator.studentId property equals current userId
      filteredSubs = wsSubs.filter((sub) => {
        let userId = _.propertyOf(sub)(['creator', 'studentId']);
        return areObjectIdsEqual(userId, user.id);
      });

    } else {
      filteredSubs = wsSubs.filter((sub) => {
        return _.contains(submissionIds, sub._id.toString());
      });

    }

      dataMap.submissions = filteredSubs;
      // can only take selections that correspond to these submissions
      if (selections === 0) {
        dataMap.selections = [];
        dataMap.comments = [];
        dataMap.taggings = [];
      } else {
        const subIds = _.map(filteredSubs, sub => sub._id.toString());
        const subSels = _.chain(ws.selections)
          .filter(sel => subIds.includes(sel.submission.toString()))
          .flatten()
          .value();

        dataMap.selections = subSels;

        if (folders === 0) {
          dataMap.taggings = [];
        } else {
          const selIds = _.map(subSels, sel => sel._id.toString());
          const selTaggings = _.chain(ws.taggings)
            .filter(tagging => _.contains(selIds, tagging.selection.toString()))
            .flatten()
            .value();
          dataMap.taggings = selTaggings;
        }
        if (comments === 0) {
          dataMap.comments = [];
        } else {
          const selIds = _.map(subSels, sel => sel._id.toString());
          const selComments = _.chain(ws.comments)
            .filter(comment => _.contains(selIds, comment.selection.toString()))
            .flatten()
            .value();
           dataMap.comments = selComments;
        }

          const submissionIds = _.map(filteredSubs, sub => sub._id.toString());
          const subResponses = _.chain(ws.responses)
            .filter(res => res.submission && submissionIds.includes(res.submission.toString()))
            .flatten()
            .value();
          dataMap.responses = subResponses;

      }

  } else {
    // returning all submisisons

    if (selections === 0) {
      dataMap.selections = [];
      dataMap.comments = [];
    }
    if (comments === 0) {
      dataMap.comments = [];
    }
  }

  if (folders === 0) {
    dataMap.folders = [];
    dataMap.taggings = [];
  }

  // if (feedback === 'none') {
  //   dataMap.responses = [];
  // }

  return dataMap;
}
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
function getWorkspace(id, user, specialPermissions, callback, doCheckAllowedResponses) {
  models.Workspace.findById(id)
    .populate('selections')
    .populate('submissions')
    .populate('folders')
    .populate('taggings')
    .populate('responses')
    .exec(function(err, ws){
    if(err) {
      throw err;
    }
    if(!ws) {
      return callback();
    }

    const restrictedDataMap = getRestrictedDataMap(user, specialPermissions, ws);
    _.each(restrictedDataMap, (val, key) => {
      if (ws[key]) {
        ws[key] = val;
      }
    });

    var data = {
      workspace: ws
    };

    var dataMap = {
      'selections':  'selection',
      'submissions': 'submission',
      'folders':     'folder',
      'taggings':     'tagging',
      'responses': 'response',
    };

    var relatedData = {
      'selections':  [],
      'submissions': [],
      'folders':     [],
      'taggings':    [],
      'responses': [],
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
        delete ws[key];
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
async function resolvePermissionObject(user, ws) {
  try {
    if (!user || !ws) {
      return {};
    }
    let results = {
      areNoRestrictions: true,
      permisisonObject: null,
      isBasicStudentAccess: false,
    };

    let { accountType, actingRole } = user;

    let isStudent = accountType === 'S' || actingRole === 'student';

    let isAdmin = accountType === 'A' && !isStudent;
    let isCreator = areObjectIdsEqual(user._id, ws.createdBy);
    let isOwner = areObjectIdsEqual(user._id, ws.owner);

    let isInUserOrg = areObjectIdsEqual(user.organization, ws.organization);

    let isPdAdmin = accountType === 'P' && !isStudent;
    let isPdOrg = isPdAdmin && isInUserOrg;


    if (isAdmin || isCreator || isOwner || isPdOrg) {
      return results;
    }

    // look for permisison obj

    let permissions = ws.permissions || [];
    let permissionObject = _.find(permissions, obj => areObjectIdsEqual(user._id, obj.user));

    if (isNonEmptyObject(permissionObject)) {
      results.areNoRestrictions = false;
      results.permisisonObject = permissionObject;
      return results;
    }

    let isPublic;

    if (isStudent) {
      isPublic = ws.mode === 'internet';
    } else {
      isPublic = ws.mode === 'internet' || ws.mode === 'public' || (ws.mode === 'org' && isInUserOrg);
    }

    if (isPublic) {
      return results;
    }
    let islinkedTeacher = false;

    if (isValidMongoId(ws.linkedAssignment)) {
      let assignment = await models.Assignment.findById(ws.linkedAssignment).lean().exec();

      if (assignment) {
        let userSections = user.sections || [];

        let foundSection = _.find(userSections, (sectionObj) => {
          return sectionObj.role === 'teacher' && areObjectIdsEqual(sectionObj.sectionId, assignment.section);
        });

        if (foundSection) {
          islinkedTeacher = true;
          return results;
        }

      }
    }
    if (!islinkedTeacher) {
      results.isBasicStudentAccess = true;
      results.areNoRestrictions = false;
      return results;
    }


  }catch(err) {
    console.error(`Error resolvePermissionObject: ${err}`);
  }



}

function filterRequestedWorkspaceData(user, results) {
  if (!isNonEmptyObject(user) || !isNonEmptyArray(results)) {
    return Promise.resolve([]);
  }

  const { accountType, actingRole } = user;

  const isStudent = accountType === 'S' || actingRole === 'student';

  if (accountType === 'A' && !isStudent) {
    return Promise.resolve(results);
  }

  return Promise.all(
    _.map(results, (ws) => {
      return resolvePermissionObject(user, ws)
        .then((results) => {
          let { areNoRestrictions, permissionObject, isBasicStudentAccess } = results;
          if (areNoRestrictions) {
            return Promise.resolve(ws);
          }
          // check if submission restrictions
      let areSubmissionRestrictions = _.propertyOf(permissionObject)(['submissions', 'all']) !== true || isBasicStudentAccess;

      let isApprover = _.propertyOf(permissionObject)('feedback') === 'approver';
      let fetchedWs;

      if (!areSubmissionRestrictions) {
        fetchedWs = models.Workspace.findById(ws._id)
          .populate('responses').lean().exec();
      } else {
        fetchedWs = models.Workspace.findById(ws._id)
        .populate('selections')
        .populate('submissions')
        .populate('folders')
        .populate('taggings')
        .populate('owner')
        .populate('createdBy')
        .populate('responses')
        .populate('comments')
        .lean().exec();
      }
      return fetchedWs
      .then((populatedWs) => {
        let populatedResponses = populatedWs.responses ? populatedWs.responses.slice() : [];
        // eslint-disable-next-line no-unused-vars

        if (areSubmissionRestrictions) {
          const [canLoad, specialPermissions] = access.get.workspace(user, populatedWs);
          const restrictedDataMap = getRestrictedDataMap(user, specialPermissions, populatedWs, isBasicStudentAccess);
          // val is array of populated Docs, but we just need Ids
          _.each(restrictedDataMap, (val, key) => {
            if (ws[key]) {
              if (Array.isArray(val)) {
                ws[key] = _.map(val, (val) => {
                  if (val._id) {
                    return val._id;
                  }
                  return val;
                });
              } else {
                ws[key] = val;
              }
            }
          });
        }
        ws.responses = _.chain(populatedResponses)
          .filter((response) => {
            if (!response) {
              return false;
            }

            if (areSubmissionRestrictions) {
              // must be in restricted responses
              if (!_.find(ws.responses, (responseId) => {
                return areObjectIdsEqual(responseId, response._id);
              })) {
                return false;
              }
            }
            let isYours = areObjectIdsEqual(response.createdBy, user._id);
            let isApproved = response.status === 'approved';
            let isToYou = areObjectIdsEqual(response.recipient, user._id);

            if (isApprover) {
              // just filter out drafts not created by you
              let isNotYourDraft = !isYours && response.status === 'draft';

              return !isNotYourDraft;
            }

            return isYours || (isApproved && isToYou);
          })
          .pluck('_id').value();

          return ws;
        });
      });
    })
  );
}


/**
  * @public
  * @method sendWorkspace
  * @description __URL__: /api/workspaces/:id
  * @howto Ideally we'd send back the workspace with all of it's dependencies.
           It's sending back way too much data right now
  */
async function sendWorkspace(req, res, next) {
  try {
    let user = userAuth.requireUser(req);

    let ws = await models.Workspace.findById(req.params.id)
      .populate('owner')
      .populate('createdBy')
      .populate({path: 'selections', populate: {path: 'originalSelection'}})
      .populate({path: 'submissions', populate: {path: 'answer', select: 'createdBy', populate: {path: 'createdBy'}}})
      .populate({ path: 'folders', populate: { path: 'originalFolder'} })
      .populate({path: 'taggings', populate: {path: 'originalTagging'}})
      .populate({ path: 'responses', populate: [ {path: 'recipient'}, {path: 'createdBy'}, {path: 'originalResponse'}]})
      .populate({ path: 'comments', populate: { path: 'originalComment'} } )
      .populate({ path: 'childWorkspaces', populate: { path:  'owner' }})
      .lean().exec();

      if (isNil(ws) || ws.isTrashed) {
        return utils.sendResponse(res, null);
      }
      let isBasicStudentAccess = false;
      let isLinkedAssignmentTeacher = false;

      const [ canLoad, specialPermissions ] = access.get.workspace(user, ws);
      if(!canLoad) {

        if (isValidMongoId(ws.linkedAssignment)) {
          let assignment = await models.Assignment.findById(ws.linkedAssignment).lean().exec();

          if (assignment) {
            let userSections = user.sections || [];

            let foundSection = _.find(userSections, (sectionObj) => {
              return sectionObj.role === 'teacher' && areObjectIdsEqual(sectionObj.sectionId, assignment.section);
            });

            if (foundSection) {
              isLinkedAssignmentTeacher = true;
            }

          }
        }

        if (!isLinkedAssignmentTeacher) {
          // check if is student who created submission in workspace

          let ownSub = _.find(ws.submissions, (sub) => {
            return areObjectIdsEqual(_.propertyOf(sub)(['creator', 'studentId']), user._id);
          });

          if (ownSub) {
            isBasicStudentAccess = true;
          }
        }

        if (!isBasicStudentAccess && !isLinkedAssignmentTeacher) {
          return utils.sendError.NotAuthorizedError('You do not have permission to access this workspace.', res);
        }
      }

      const restrictedDataMap = getRestrictedDataMap(user, specialPermissions, ws, isBasicStudentAccess);
      _.each(restrictedDataMap, (val, key) => {
        if (ws[key]) {
          ws[key] = val;
        }
      });

      // filter out inaccessible responses from workspace
      if (Array.isArray(ws.responses)) {
        ws.responses = ws.responses.filter((response) => {
          return responseAccess.get.response(user, response, ws);
        });
      }

      if (_.propertyOf(ws)(['createdBy', '_id'])) {
        ws.createdBy = ws.createdBy._id;
      }

      if (_.propertyOf(ws)(['owner', '_id'])) {
        ws.owner = ws.owner._id;
      }

      let data = {
        workspace: ws
      };

      let dataMap = {
        selections: 'selection',
        submissions:'submission',
        folders: 'folder',
        taggings: 'tagging',
        responses: 'response',
        comments: 'comment',
      };

      let relatedData = {
        selections: [],
        submissions: [],
        folders: [],
        taggings: [],
        responses: [],
        comments: [],
  //      'workspace': {},
  //      'createdBy': {}
      };
      let submissionUsers = {};

      ws.submissions.forEach((sub) => {
        let user = _.propertyOf(sub)(['answer', 'createdBy']);
        if (isNonEmptyObject(user) && user.username !== 'old_pows_user' && !submissionUsers[user._id]) {
         submissionUsers[user._id] = user;
        }

         // filter out inaccessible responses from workspace submissions
         // sub.responses is array of object ids
        let responses = sub.responses || [];
        sub.responses = responses.filter((response) => {
          return _.find(ws.responses, (wsResponse) => {
            return areObjectIdsEqual(response, wsResponse._id);
          });
        });
      });

      data.user = Object.values(submissionUsers);

      //this would probably be better done as an aggregate?
      //we're just massaging the data into an ember friendly format for side-loading
      _.keys(relatedData).forEach(function(key){
        if(ws[key]){ //array
          var idBag = [];
          ws[key].forEach(function(item){
            if (key === 'submissions') {
              // depopulate answer
              if (item.answer) {
                item.answer = item.answer._id;
              }
            }

            if (key === 'responses') {
              // depopulate response
              if (item.recipient) {
                item.recipient = item.recipient._id;
              }
              if (item.createdBy) {
                item.createdBy = item.createdBy._id;
              }
            }

            let originalRecordProp = `original${stringUtils.capitalizeWord(key.slice(0, key.length - 1))}`;

            relatedData[key].push(item);//[ws[key]._id] = comment[key];
            idBag.push(item._id);

            if (item[originalRecordProp] && item[originalRecordProp]._id) {
              relatedData[key].push(item[originalRecordProp]);
              item[originalRecordProp] = item[originalRecordProp]._id;
            }
          });
          ws[key] = idBag;
        } else {
          logger.error('workspace ' + ws._id + ' missing ' + key);
          delete ws[key];
        }
      });

      _.keys(relatedData).forEach(function(key){
        var modelName = key;
        if(dataMap[key]) {
          modelName = dataMap[key];
        }
        data[modelName] = _.values(relatedData[key]);
      });

      if (isNonEmptyArray(ws.childWorkspaces)) {

        // sideload any owners of child workspaces that are not being
        // sideloaded already

        ws.childWorkspaces.forEach((childWs) => {
          let ownerObj = childWs.owner;
          if (ownerObj) {
            let doesExist = _.find(data.user, (user) => {
              return areObjectIdsEqual(user._id, ownerObj._id);
            });
            if (!doesExist) {
              data.user.push(ownerObj);
            }
          // need to depopulate the owner field
            childWs.owner = childWs.owner._id;
          }
        });

        data.workspaces = Array.isArray(data.workspaces) ? data.workspaces.concat(ws.childWorkspaces) : ws.childWorkspaces;

        ws.childWorkspaces = ws.childWorkspaces.map(childWs => childWs._id);
      }
    return utils.sendResponse(res, data);

  }catch(err) {
    console.error(`Error sendWorkspace: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }

}

/**
  * @public
  * @method putWorkspace
  * @description __URL__: /api/workspaces/:id
  * @howto Ideally we'd send back the workspace with all of it's dependencies.
           It's sending back way too much data right now
  */
async function putWorkspace(req, res, next) {
  try {
    const user = userAuth.requireUser(req);
  // 403 error when a teacher is in a workspace and switches to acting role of student
  // for now let acting role student modify workspaces but need to come up with a better solution
  const popWs = await models.Workspace.findById(req.params.id)
    .populate('owner')
    .populate('createdBy')
    .exec();

  if (isNil(popWs) || popWs.isTrashed) {
    return utils.sendResponse(res, null);
  }
  if(!access.get.workspace(user, popWs)) {
    logger.info("permission denied");
    return utils.sendError.NotAuthorizedError("You don't have permission to modify this workspace", res);
  }

  let { mode, name } = req.body.workspace;

  if (mode === 'public' || mode === 'internet') {
    let isNameUnique = await apiUtils.isRecordUniqueByStringProp('Workspace', name, 'name', {_id: {$ne: req.params.id}, mode: {$in: ['public', 'internet']}});

    if (!isNameUnique) {
      return utils.sendError.ValidationError(`There is already an existing public workspace named "${name}."`, 'name', res);
    }
  }

  // why fetch again?
  // just depopulate
  popWs.depopulate('owner').depopulate('createdBy');
  const ws = popWs;

  let { doOnlyUpdateLastViewed, lastViewed } = req.body.workspace;

  if (doOnlyUpdateLastViewed) {
    ws.lastViewed = lastViewed;
    // set as false so future updates are not interfered with
    ws.doOnlyUpdateLastViewed = false;

    await ws.save();
    return utils.sendResponse(res, {
      workspace: ws
    });
  }

  // only admins or ws owner should be able to trash ws
  // this check should be done for mode, name, owner, organization, and permissions(?)

  let isAdmin = user.accountType === 'A' && user.actingRole !== 'student';
  let isPdAdmin = user.accountType === 'P' && user.actingRole !== 'student';

  let isOwner = areObjectIdsEqual(user._id, ws.owner);
  let isCreator = areObjectIdsEqual(user._id, ws.createdBy);
  let isPdWs = isPdAdmin && (areObjectIdsEqual(user.organization, ws.organization));

  let { isTrashed, owner, organization, linkedAssignment, doAllowSubmissionUpdates, permissions, doAutoUpdateFromChildren } = req.body.workspace;

  if (isAdmin || isOwner || isCreator || isPdWs) {
    ws.isTrashed = isTrashed;
    ws.mode = mode;
    ws.name = name;
    ws.owner = owner;
    ws.organization = organization;
    ws.linkedAssignment = linkedAssignment;
    ws.doAllowSubmissionUpdates = doAllowSubmissionUpdates;
    ws.doAutoUpdateFromChildren = doAutoUpdateFromChildren;
  }

  const originalPermissions = ws.permissions || [];

  let originalCollabIds = [];

  if (isNonEmptyArray(originalPermissions)) {
    originalCollabIds = _.chain(originalPermissions)
    .filter(obj => !isNil(obj.user))
    .map(obj => obj.user.toString())
    .value();
  }

  let ownPermissionObj = _.find(originalPermissions, (obj) => {
    return areObjectIdsEqual(obj.user, user._id);
  });

  let isApprover = ownPermissionObj && ownPermissionObj.feedback === 'approver';

  if (isAdmin || isOwner || isCreator || isPdWs || isApprover) {
    ws.permissions = permissions;
  } else  {
    // everyone needs to be able to remove themself as collab
    if (originalCollabIds.includes(user._id.toString())) {
      // check if user tried to remove self
      let newPermissionObj = _.find(permissions, (obj) => {
        return areObjectIdsEqual(obj.user, user._id);
      });

      if (!newPermissionObj) {
        //user removed self as collab, ignore other changes
        ws.permissions = originalPermissions.filter((obj) => {
          return !areObjectIdsEqual(obj.user, user._id);
        });
      }
    }
  }

  if (ws.permissions) {
    ws.permissions.forEach((permission) => {
      delete permission.userObj;
    });
  }

  ws.lastViewed = lastViewed;
  ws.lastModifiedDate = new Date();
  ws.lastModifiedBy = user._id;

  const savedWorkspace = await ws.save();
    const wsPermissions = savedWorkspace.permissions;

    if (_.isArray(wsPermissions)) {
      const newCollabIds = _.chain(wsPermissions)
      .filter(obj => !isNil(obj.user))
      .map(obj => obj.user.toString())
      .value();

      let removedCollabs = _.difference(originalCollabIds, newCollabIds);
      // remove workspace from users' collabWorkspaces if they were removed as collab

      if (isNonEmptyArray(removedCollabs)) {
        models.User.updateMany({_id: {$in: removedCollabs}}, {$pull: {collabWorkspaces: savedWorkspace._id}}).exec();
      }
    }
    return utils.sendResponse(res, {workspace: savedWorkspace});

  }catch(err) {
    console.error(`Error putWorkspace: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
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

    if (!isNonEmptyObject(wsInfo) || !isNonEmptyObject(folderSetHash)) {
      return;
    }

    let { folderSetId, folderSetObjects } = folderSetHash;
    const { newWsId, newWsOwner } = wsInfo;

    if(!folderSetId && !folderSetObjects) {
      return folders;
    }

    if (isNonEmptyArray(folderSetObjects)) {
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
      if(err) {
        logger.info('in error block pkgsub');
        callback( new Error( err.message ));
      }
      var submissionSets = _.pluck(results, 'submissionSet');

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
 // eslint-disable-next-line complexity
async function getWorkspaces(req, res, next) {
  let user = userAuth.requireUser(req);

  let { ids, filterBy, sortBy, searchBy, page, isTrashedOnly } = req.query;
  //if users hiddenWorkspaces is not an empty array add $nin

  if (filterBy) {
    let { all, includeFromOrg } = filterBy;

    if (includeFromOrg && user.organization) {
      let userIdsFromOrg = await accessUtils.getModelIds('User', { organization: user.organization });
      if (isNonEmptyArray(userIdsFromOrg)) {
        if (_.isArray(filterBy.$or)) {
          filterBy.$or.push({ createdBy: { $in: userIdsFromOrg } });
          filterBy.$or.push({ owner: { $in: userIdsFromOrg } });
        } else {
          let crit = {
            $or: [
              { createdBy: { $in: userIdsFromOrg } },
              { owner: { $in: userIdsFromOrg } }
            ]
          };
          if (!filterBy.$and) {
            filterBy.$and = [];
          }
          filterBy.$and.push(crit);
        }
      }
      // want workspaces createdBy or Owned by someone from users org
      delete filterBy.includeFromOrg;
    } else if (all) {
      let { org } = all;
      if (org) {
        let crit = {};
        let { organizations, includeFromOrg } = org;

        if (isNonEmptyArray(organizations)) {
          if (!crit.$or) {
            crit.$or = [];
          }
          crit.$or.push({ organization: { $in: organizations } });
        }
        if (includeFromOrg && isNonEmptyArray(organizations)) {
          let userIdsFromOrg = await accessUtils.getModelIds('User', { organization: {$in: organizations} });
          if (isNonEmptyArray(userIdsFromOrg)) {
            crit.$or.push({ createdBy: { $in: userIdsFromOrg } });
            crit.$or.push({ owner: { $in: userIdsFromOrg } });
          }
      // want workspaces createdBy or Owned by someone from users org
          delete filterBy.all.org.includeFromOrg;
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
          searchFilter.$or.push({ [prop]: regex });
        }
        let [ownerIds, editorIds] = await Promise.all([
          apiUtils.filterByForeignRef('Workspace', query, 'owner', 'username'),
          apiUtils.filterByForeignRefArray('Workspace', query, 'editors', 'username')
        ]);


        let combined = _.flatten(ownerIds.concat(editorIds));
        let uniqueIds = _.uniq(combined);

        if (isNonEmptyArray(uniqueIds)) {
          searchFilter.$or.push({ _id: { $in: uniqueIds } });
        }


      } else if (criterion === 'owner') {
        let ids = await apiUtils.filterByForeignRef('Workspace', query, 'owner', 'username');

        if (isNonEmptyArray(ids)) {
          searchFilter = { _id: { $in: ids } };
        }

      } else if (criterion === 'editors') {
        let ids = await apiUtils.filterByForeignRefArray('Workspace', query, 'editors', 'username');
        if (isNonEmptyArray(ids)) {
          searchFilter = { _id: { $in: ids } };
        }

      } else {
        query = query.replace(/\s+/g, "");
        let regex = new RegExp(query.split('').join('\\s*'), 'i');

        searchFilter = { [criterion]: regex };
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

  const criteria = await access.get.workspaces(user, ids, filterBy, searchFilter, isTrashedOnly);
  let results, itemCount;

  let sortField = Object.keys(sortParam)[0];
  let sortableFields = ['submissions', 'selections', 'comments', 'responses', 'permissions'];

  if (byRelevance) {
    [results, itemCount] = await Promise.all([
      models.Workspace.find(criteria, { score: { $meta: "textScore" } }).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
      models.Workspace.count(criteria)
    ]);
  } else if (sortParam && sortableFields.includes(sortField)) {
    [results, itemCount] = await Promise.all([
      apiUtils.sortWorkspaces('Workspace', sortParam, req, criteria),
      models.Workspace.count(criteria)
    ]);
  } else if (doCollate) {
    [results, itemCount] = await Promise.all([
      models.Workspace.find(criteria).collation({ locale: 'en', strength: 1 }).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
      models.Workspace.count(criteria)
    ]);
  } else {
    [results, itemCount] = await Promise.all([
      models.Workspace.find(criteria).sort(sortParam).limit(req.query.limit).skip(req.skip).lean().exec(),
      models.Workspace.count(criteria)
    ]);
  }

  const pageCount = Math.ceil(itemCount / req.query.limit);
  let currentPage = page;
  if (!currentPage) {
    currentPage = 1;
  }

  // have to check to make sure we are only sending back the allowed data
  const filteredResults = await filterRequestedWorkspaceData(user, results);
  const data = {
    'workspaces': filteredResults,
    'meta': {
      'total': itemCount,
      pageCount,
      currentPage
    }
  };
  return utils.sendResponse(res, data);
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

      const { studentNames, section, problem, vmtRoomInfo } = ans;

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
          if (isNonEmptyArray(studentNames)) {
            if (studentNames.length === 1) {
              creator.fullName = capitalizeString(studentNames[0], true);
              creator.safeName = apiUtils.getSafeName(creator.fullName, false, false);
            } else {
              // handle cases of multiple students?
              // for now just take first
              creator.fullName = capitalizeString(studentNames[0], true);
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
        if (isNonEmptyArray(teachers)) {
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
        answer: ans._id,
        vmtRoomInfo: vmtRoomInfo
      };
      return sub;
    });
    return subs;
  } catch(err) {
    console.error('error mapping answers to subs', err);
  }
}

async function postWorkspaceEnc(req, res, next) {
  const user = userAuth.requireUser(req);
  if (!user) {
    return utils.sendError.InvalidCredentialsError('You must be logged in!', res);
  }

  const workspaceCriteria = req.body.encWorkspaceRequest;
  const { requestedName, mode, folderSet, owner, answers, permissionObjects } = workspaceCriteria;
  try {
    const pruned = pruneObj(workspaceCriteria);

    // accessibleAnswersQuery will take care of isTrashed
    delete pruned.isTrashed;
    delete pruned.isEmptyAnswerSet;

    const ownerOrg = await userAuth.getUserOrg(owner);
    let accessibleCriteria;
    let answersToConvert;

    if (mode === 'public' || mode === 'internet') {
      let isNameUnique = await apiUtils.isRecordUniqueByStringProp('Workspace', requestedName, 'name', {mode: {$in: ['public', 'internet']}});

      if (!isNameUnique) {
        let rec = pruned;
        rec.createWorkspaceError = 'There already exists a public workspace with that name';

        let enc = new models.EncWorkspaceRequest(rec);
        let saved = await enc.save();

        const data = { encWorkspaceRequest: saved };
        return utils.sendResponse(res, data);
      }
    }

    if (isNonEmptyArray(answers)) {
      let records = await models.Answer.find({_id: {$in: answers}});
      if (isNonEmptyArray(records)) {
        answersToConvert = records;
      } else {
        // something went wrong
        let rec = pruned;
        rec.isEmptyAnswerSet = true;

        let enc = new models.EncWorkspaceRequest(rec);
        let saved = await enc.save();

        const data = { encWorkspaceRequest: saved };
        return utils.sendResponse(res, data);

      }
    } else {
      accessibleCriteria = await answerAccess.get.answers(user);

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
      if (!_.isNull(wsCriteria) && !_.isUndefined(wsCriteria)) {
        answersToConvert = await models.Answer.find(wsCriteria);
      }


      if (_.isEmpty(answersToConvert) || _.isUndefined(answersToConvert)) {
        let rec = pruned;
        rec.isEmptyAnswerSet = true;

        let enc = new models.EncWorkspaceRequest(rec);
        let saved = await enc.save();

        const data = { encWorkspaceRequest: saved };
        return utils.sendResponse(res, data);
      }
    }
    let subs = await answersToSubmissions(answersToConvert);
    const submissions = await Promise.all(subs.map((obj) => {
      let sub = new models.Submission(obj);

      let creatorId;

      let encUserId = _.propertyOf(obj)(['creator', 'studentId']);

      // set creator of submission as the enc user who created it if applicable
      // else set as importer

      if (isValidMongoId(encUserId)) {
        creatorId = encUserId;
      } else {
        creatorId = user._id;
      }
      sub.createdBy = creatorId;
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
      permissions: permissionObjects,
      organization: ownerOrg,
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
    rec.createdBy = user;
    const encRequest = new models.EncWorkspaceRequest(rec);
    const saved = await encRequest.save();

    const data = { encWorkspaceRequest: saved };

    return utils.sendResponse(res,  data);

  } catch(err) {
    console.error(`Error postWorkspaceEnc: ${err}`);
    console.trace();
    return utils.sendError.InternalError(err, res);
  }
}
function buildSubmissionsToClone(submissions, hash) {
  // submissions is array of populated submission docs
  if (!submissions || !_.isArray(submissions)) {
    return;
  }
  let { all, none, submissionIds } = hash;

  if (all) {
    return [...submissions];
  }

  if (none || !isNonEmptyArray(submissionIds)) {
    return [];
  }

  return _.filter(submissions, (submission) => {
    return _.contains(submissionIds, submission._id.toString());
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
    if (isNonEmptyObject(folderSetOptions)) {
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
      // no folders in original workspace
      return results;
    }

    const topLevelFolders = _.filter(folders, (folder => {
      return isNil(folder.parent) && _.contains(_.map(folderIds, id => id.toString()), folder._id.toString());
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
          console.error('err', err);
        });
    };

    const folderObjects = await Promise.all(_.map(topLevelFolderIds, (folderId) => {
      return recurse(folderId);
    }));

    results.folderSetObjects = folderObjects;

    const { doCreateFolderSet, name, privacySetting } = folderSetOptions;
    if (doCreateFolderSet === true) {
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
  if (!isNonEmptyArray(oldTaggingIds)) {
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

    if (isNonEmptyArray(taggings)) {

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
    if (!isNonEmptyArray(folderIds) || !isNonEmptyObject(wsInfo)) {
      return;
    }
    // do we need to check for isTrashed here?
    const oldFolders = await models.Folder.find({_id: { $in: folderIds }}).lean().exec();
    const oldTopLevelFolders = _.filter(oldFolders, (folder => {
      return isNil(folder.parent);
    }));

    return copyFolders(user, oldTopLevelFolders, taggingsKey, wsInfo);

  }catch(err) {
    console.error(`Error deepCloneFolders: ${err}`);
  }
}

async function buildTaggingsKey(folderIdsToCopy, selectionsKey) {
  const hash = {};
  if (!isNonEmptyArray(folderIdsToCopy)) {
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
    // verify before destructuring
    if (!isNonEmptyObject(options) || !isNonEmptyObject(wsInfo)) {
      return results;
    }

    // if oldFolderIds is not a nonEmptyArray, return results
    /*
    wsInfo = {
     originalWsId
     newWsId:
     newWsOwner
   };
    */
   const areOldIdsToCopy = isNonEmptyArray(oldFolderIds);

    const { originalWsId } = wsInfo;

    let { includeStructureOnly, all, none, folderSetOptions } = options;
    let folderIdsToCopy;

    if (none || !areOldIdsToCopy) {
      // return right away if no folderIds to copy and user did not request to use an existing folder set
      if (!isNonEmptyObject(folderSetOptions) || isNil(folderSetOptions.existingFolderSetToUse)) {
        return results;
      }
      // just create folder structure from folderSet Id;
      let folderSetInfo;
      if (folderSetOptions.existingFolderSetToUse) {
        folderSetInfo = { folderSetId: folderSetOptions.existingFolderSetToUse };
      }
      const newFolderIds = await newFolderStructure(user, wsInfo, folderSetInfo);

      if (isNonEmptyArray(newFolderIds)) {
        results.folders = newFolderIds;
      }
      return results;
    } else {
      // copying all old folders
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

      if (_.propertyOf(folderSetInfo)('folderSetId')) {
        results.folderSet = folderSetInfo.folderSetId;
      }
      const newFolderIds = await newFolderStructure(user, wsInfo, folderSetInfo);

      if (isNonEmptyArray(newFolderIds)) {
        results.folders = newFolderIds;
      }
      return results;

    } else {
      // copying contents of folders as well

      let folderSetInfo = await copyAndSaveFolderStructure(user, originalWsId, folderIdsToCopy, folderSetOptions);

      if (_.propertyOf(folderSetInfo)('folderSetId')) {
        results.folderSet = folderSetInfo.folderSetId;
      }
// const results = {
//       folderSetId: null,
//       folderSetObjects: [],
//       isInvalidWorkspace: false
//     };

      taggingsKey = await buildTaggingsKey(folderIdsToCopy, selectionsKey);
      let [folderIds, taggingIds] = await deepCloneFolders(user, folderIdsToCopy, taggingsKey, wsInfo);

      results.folders = folderIds;
      results.taggings = taggingIds;
      return results;
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
  if (!isNonEmptyArray(oldCommentIds)) {
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
  if (!isNonEmptyArray(oldSelections)) {
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
  if (!isNonEmptyArray(newSubmission.responses)) {
    return Promise.resolve([]);
  }
  return Promise.all(
    _.chain(newSubmission.responses)
      .filter(responseId => responsesKey[responseId])
      .map(id => copyResponse(id, newSubmission._id, newWsId))
      .reject(isNil)
      .value()
  );
}



function buildSubmissionSetAndSubmissionsMap(originalWs) {
  // submissions map is used to keep track of the relationship between an submission and its submission
  const submissionsMap = {};
  let submissionSet;
  let error = null;

  // let results = [error, submissionSet, submissionsMap];

    // use the original workspace's submissions array to get the submission pool
    const submissions = originalWs.submissions;
    // return error if there are no submissions (and thus submissions) to copy from original workspace
    if (!isNonEmptyArray(submissions)) {
      error = 'Workspace does not have any submissions to copy.';
      return [error, null, null];
    }
    // all submissions (except currently 15 extraneous KenKen submissions) should have an associated Encompass answer record
    const subsWithAnswers = _.reject(submissions, (sub => isNil(sub.answer)));
    // return error if there are no submissions associated with submissions
    if (!isNonEmptyArray(subsWithAnswers)) {
      error = 'This workspace does not have any submissions';
      return [error, null, null];
    }

    submissionSet = _.map(subsWithAnswers, ((sub) => {
      submissionsMap[sub._id] = sub;

      return sub;
    }));
    return [null, submissionSet, submissionsMap];

}

async function cloneWorkspace(req, res, next) {
  try {
    const user = userAuth.requireUser(req);
    // check if user has permission to copy this workspace
    const copyWorkspaceRequest = req.body.copyWorkspaceRequest;

    if (!isNonEmptyObject(copyWorkspaceRequest)) {
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
    const { name, owner, mode, createdBy, } = copyWorkspaceRequest;

    if (mode === 'public' || mode === 'internet') {
     let isNameUnique = await apiUtils.isRecordUniqueByStringProp('Workspace', name, 'name', {mode: {$in: ['public', 'internet']}});

     if (!isNameUnique) {
      requestDoc.copyWorkspaceError = 'There already exists a public workspace with that name';
      let saved = await requestDoc.save();
      const data = { copyWorkspaceRequest: saved };

      return utils.sendResponse(res, data);
     }
    }

    // if mode is public or internet, make sure name is unique;
    const ownerOrg = await userAuth.getUserOrg(owner);
    // use original name, mode if not provided
    // set owner as current user if owner not provided
    const newWs = new models.Workspace({
      name: name || originalWs.name,
      owner: owner || user._id,
      mode: mode || originalWs.mode,
      createdBy: createdBy || user._id,
      organization: ownerOrg
    });


    // let savedWs = await newWs.save();

    // destructure options parameters
    // will be used to determine which records to copy
    const { submissionOptions, selectionOptions, folderOptions, commentOptions, responseOptions } = copyWorkspaceRequest;

    let folderSetOptions = _.propertyOf(folderOptions)('folderSetOptions');
    if (folderSetOptions) {
      if (folderSetOptions.doCreateFolderSet && folderSetOptions.privacySetting === 'E') {
        // ensure name is unique
        let isNameUnique = await apiUtils.isRecordUniqueByStringProp('FolderSet', folderSetOptions.name, 'name', {privacySetting: 'E'});

        if (!isNameUnique) {
          requestDoc.copyWorkspaceError = `There already exists a public Folder Set named "${folderSetOptions.name}."`;
          let saved = await requestDoc.save();
          const data = { copyWorkspaceRequest: saved };

          return utils.sendResponse(res, data);

        }
      }
    }
    /*
      submissionSet is array of populated submission docs
      submissionsMap is mapping between submissionId and populated submission doc
       submissionId: populatedSubmissionDoc
      }
    */
    // let [ error, answerSet, submissionsMap] = buildAnswerSetAndSubmissionsMap(originalWs);

    let [error, submissionSet, submissionsMap] = buildSubmissionSetAndSubmissionsMap(originalWs);

    if (error) {
      requestDoc.copyWorkspaceError = error;
      let saved = await requestDoc.save();
      const data = { copyWorkspaceRequest: saved };

      return utils.sendResponse(res, data);
    }

    // submissionsToClone is filtered submission docs based on request params
    let submissionsToClone = buildSubmissionsToClone(submissionSet, submissionOptions);

    if (!isNonEmptyArray(submissionsToClone)) {
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
    _.each(submissionsToClone, (sub => {
      submissionsKey[sub._id] = true;
        if (isNonEmptyArray(sub.selections)) {
          _.each(sub.selections, (selId) => {
            submissionSels[selId] = true;
          });
      }

    }));
    // json objects that will be converted to mongoose docs and saved to db
    // does not handle copying of existing submissions' commments, selections, responses, etc
    // let subs = await answersToSubmissions(answersToClone);
    // convert sub json objects to mongoose docs and save

    // create new submission records
    const submissions = await Promise.all(submissionsToClone.map((obj) => {
      // eslint-disable-next-line prefer-object-spread
      const oldSubCopy = Object.assign({}, obj);

      for (let prop of ['_id', 'workspaces', 'createdBy', 'createDate', 'lastModifiedDate']) {
        if (oldSubCopy.hasOwnProperty(prop)) {
          delete oldSubCopy[prop];
        }
      }
      let sub = new models.Submission(oldSubCopy);
      let newId = sub._id.toString();

      //eslint-disable-next-line prefer-object-spread
      submissionsMap[newId] = obj;
      delete submissionsMap[obj._id];

      sub.createdBy = user._id;
      sub.createDate = Date.now();
      sub.lastModifiedBy = user._id;
      sub.lastModifiedDate = Date.now();
      return sub.save();
    }));

    // submissionsMap is now a mapping between the new copied submissionId and the old submission doc

    const workspaceInfo = {
      originalWsId: originalWsId,
      newWsId: newWs._id,
      newWsOwner: newWs.owner,
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
        // some old submissions are missing comments/responses fields
         if (_.isArray(oldSub.comments)) {
          submission.comments = oldSub.comments;
        } else {
          submission.comments = [];
        }
        if (_.isArray(oldSub.responses)) {
          submission.responses = oldSub.responses;
        } else {
          submission.responses = [];
        }

        // copy selections and set new selections on new submission
        return copySelections(user, selectionsKey, oldSub, submission, newWs._id)
          .then((selIds) => {
            if (isNonEmptyArray(selIds)) {
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
      commentsKey is used to determine which commentss should be copied
      {
        commentId: true
      }
    */
    const commentsKey = await buildCommentsKey(selectionsKey, originalWs.comments, commentOptions);

    const newSubsWithComments = await Promise.all(
      _.map(newSubsWithSelections, (submission) => {
        return copyComments(commentsKey, submission, selectionsKey, newWs._id)
        .then((commentIds) => {
          if (isNonEmptyArray(commentIds)) {
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
          if (isNonEmptyArray(responseIds)) {
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

    const newSubmissionSet = await importApi.buildSubmissionSet(newSubsWithSelections, user);
    const submissionIds = _.map(newSubsWithResponses, sub => sub._id);

    // set submissions and submissionSet on ws
    newWs.submissions = submissionIds;
    newWs.submissionSet = newSubmissionSet;

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

  if (newFolders.folderSet) {
    requestDoc.createdFolderSet = newFolders.folderSet;
  }

  // set Permissions

  const { permissionOptions } = copyWorkspaceRequest;

  if (isNonEmptyObject(permissionOptions)) {
    if (isNonEmptyArray(permissionOptions.permissionObjects)) {
      let subMapOnlyId = _.mapObject(submissionsMap, (oldSub, newSubId) => {
        return oldSub._id;
      });
      let invertedSubMap = _.invert(subMapOnlyId);
      // now mapping between old subId and new subId
      let mapped = _.map(permissionOptions.permissionObjects, (obj) => {
        // need to convert old submissionIds to new submissionIDs for custom permissions
      let submissionOptions = obj.submissions;
      let submissionIds;
      if (submissionOptions) {
        submissionIds = submissionOptions.submissionIds;
      }

        if (!obj.all && isNonEmptyArray(submissionIds)) {
          let newSubmissionIds = _.map(submissionIds, (oldId) => {
            return invertedSubMap[oldId];
          });
          // remove null or undefined values
          let compacted = _.compact(newSubmissionIds);
          // set new submissionIDs on the permission object
          obj.submissions.submissionIds = compacted;
        }
        return obj;
      });

      newWs.permissions = mapped;

      const userIdsToUpdate = mapped.map( obj => obj.user);
      await models.User.updateMany({_id: {$in: userIdsToUpdate}}, {$addToSet: {collabWorkspaces: newWs._id }});

      // update collabWorkspaces Array for collaborators
      // each permissionObject has userId
    }
  }
  newWs.sourceWorkspace = originalWsId;


  const savedWs = await newWs.save();

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
/**
  * @private
  * Takes an answer record with a linkedWorkspace property, creates a new submission record,
  * and then adds that submission record to the workspace
  * @method addAnswerToWorkspace
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
  */

async function addAnswerToWorkspace(user, answer, workspaceId, options = {}) {
  try {
    if (!isNonEmptyObject(user) || !isNonEmptyObject(answer) || !isValidMongoId(workspaceId)) {
      return;
    }
    let workspaceToUpdate = await (
      models.Workspace.findById(workspaceId)
      .populate('submissions')
      .populate({path: 'linkedAssignment', populate: 'section'})
      .populate('owner')
      .populate('createdBy')
      .exec());

    if (isNil(workspaceToUpdate)) {
      return;
    }

    let existingSubWithAnswer = _.find(workspaceToUpdate.submissions, (sub) => {
      return areObjectIdsEqual(sub.answer, answer._id);
    });

    if (existingSubWithAnswer) {
      // answer has already been added to workspace
      return;
    }

    let { isParentWsUpdate } = options;

    // create JSON submission obj from answer
    if (!access.canUpdateSubmissions(user, workspaceToUpdate, 'add')) {
      // isParentWsUpdate flag is only set to true after an authorized workspace update
      // has been made to an existing child workspace
      if (!isParentWsUpdate) {
        return;
      }
    }
    // returns array
    let submissionJSON = await answersToSubmissions([answer]);

    if (!isNonEmptyArray(submissionJSON)) {
      return;
    }
    // add createdBy and createDate and create submission record
    let obj = submissionJSON[0];
    obj.createDate = Date.now();

    let creatorId;

    let encUserId = _.propertyOf(obj)(['creator', 'studentId']);

    // set creator of submission as the enc user who created it if applicable
    // else set as importer

    if (isValidMongoId(encUserId)) {
      creatorId = encUserId;
    } else {
      creatorId = user._id;
    }
    obj.createdBy = creatorId;
    // obj.createdBy = user._id;

    // add workspaceId to workspaces array

    let newSubmission = new models.Submission(obj);
    newSubmission.workspaces.push(workspaceId);

    let savedSub = await newSubmission.save();
    workspaceToUpdate.submissions = workspaceToUpdate.submissions.map(sub => sub._id);
    workspaceToUpdate.submissions = workspaceToUpdate.submissions.concat([savedSub._id]);

    await workspaceToUpdate.save();

   return {
     updatedWorkspaceInfo: {
       workspaceId: workspaceToUpdate._id,
       submissionId: savedSub._id,
     }
   };

  }catch(err) {
    console.error(`Error addAnswerToWorkspace: ${err}`);
    console.trace();

  }

}

function addAnswerToWorkspaces(user, answer) {
  if (!isNonEmptyObject(user) || !isNonEmptyObject(answer)) {
    return;
  }

  let workspaceIds = answer.workspacesToUpdate;
  if (!isNonEmptyArray(workspaceIds)) {
    return;
  }

  return Promise.all(workspaceIds.map((id) => {
    return addAnswerToWorkspace(user, answer, id);
  }))
  .then(async (addAnswerResults) => {
    let updatedWorkspaceIds = addAnswerResults.map((result) => {
      return result.updatedWorkspaceInfo.workspaceId;
    });
    let results = {
      updatedWorkspaceInfo: addAnswerResults,
    };

    // get list of the updated workspace ids so we can check if any of them
    // are a child workspace of a parent workspace
    if (isNonEmptyArray(updatedWorkspaceIds)) {
      let parentWorkspacesToUpdate = await models.Workspace.find({isTrashed: false, childWorkspaces: {$elemMatch: {$in: updatedWorkspaceIds}}, doAutoUpdateFromChildren: true}).populate('submissions').exec();

      // create a new submission from answer and add to any parent workspaces
      return Promise.all(parentWorkspacesToUpdate.map((parentWs) => {
        return addAnswerToWorkspace(user, answer, parentWs._id, {isParentWsUpdate: true});
      }))
        .then((parentResults) => {
          let updatedParentWorkspaceIds = parentResults.map((result) => {
            return result.updatedWorkspaceInfo.workspaceId;
          });

          results.updatedParentWsIds = updatedParentWorkspaceIds;
          return results;

        });
    }
  });


}

const updateWorkspaceRequest = async function (req, res, next) {
  try {
    let user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.NotAuthorizedError(null, res);
    }

    if (!isNonEmptyObject(req.body.updateWorkspaceRequest)) {
      return utils.sendError.InvalidContentError(null, res);
    }

    let newUpdateRequest = new models.UpdateWorkspaceRequest(req.body.updateWorkspaceRequest);

    newUpdateRequest.createDate = new Date();

    let { workspace, linkedAssignment, isParentUpdate } = req.body.updateWorkspaceRequest;

    if (!isValidMongoId(workspace) || (!isValidMongoId(linkedAssignment) && !isParentUpdate)) {
      newUpdateRequest.updateErrors.push('Invalid workspace or assignment.');
      await newUpdateRequest.save();
      return utils.sendResponse(res, {
        updateWorkspaceRequest: newUpdateRequest
      });
    }

    let popWorkspace;
    let assignment;

    if (isParentUpdate) {
      popWorkspace = await
        models.Workspace.findById(workspace)
        .populate('submissions')
        .populate({path: 'selections', populate: 'submission'})
        .populate({ path: 'comments', populate: 'submission'})
        .populate({ path: 'responses', populate: 'submission'})
        .populate('folders')
        .populate({ path: 'childWorkspaces', populate: {
          path: 'submissions', populate: 'answer'
        }})
        .populate('owner')
        .populate('createdBy')
        .populate('taggings')
        .exec();
    } else {
      [ popWorkspace, assignment ] = await Promise.all([
        models.Workspace.findById(workspace)
        .populate('submissions')
        .populate({path: 'linkedAssignment', populate: 'section'})
        .populate('owner')
        .populate('createdBy')
        .exec(),
        models.Assignment.findById(linkedAssignment).populate('answers').lean().exec()
      ]);
    }

    if (isNil(popWorkspace)) {
      newUpdateRequest.updateErrors.push('Invalid workspace.');
      await newUpdateRequest.save();
      return utils.sendResponse(res, {
        updateWorkspaceRequest: newUpdateRequest
      });
    }

    if (isNil(assignment) && !isParentUpdate) {
      newUpdateRequest.updateErrors.push('Invalid linked assignment.');
      await newUpdateRequest.save();
      return utils.sendResponse(res, {
        updateWorkspaceRequest: newUpdateRequest
      });
    }

    if (isParentUpdate && !isNonEmptyArray(popWorkspace.childWorkspaces)) {
      newUpdateRequest.updateErrors.push('No child workspaces to update from');
      await newUpdateRequest.save();
      return utils.sendResponse(res, {
        updateWorkspaceRequest: newUpdateRequest
      });

    }

    // check if user has permission to do this

    if (!access.canUpdateSubmissions(user, popWorkspace, 'bulk')) {
      return utils.sendError.NotAuthorizedError('You do not have permission to update this workspace\'s submissions', res);
    }

    let data = {};

    if (isParentUpdate) {
      let results = await parentWsApi.updateParentWorkspace(user, popWorkspace, newUpdateRequest);

      // logger.info('update res: ', JSON.stringify(results, null, 2));

      let updatedWorkspace = await models.Workspace.findById(popWorkspace._id).lean().exec();
      data.workspaces = [ updatedWorkspace ];

      data.updateWorkspaceRequest = results;
    } else {
      let missingAnswers = [];
      assignment.answers.forEach((answer) => {
        let foundAnswer = _.find(popWorkspace.submissions, (sub) => {
          return areObjectIdsEqual(sub.answer, answer._id);
        });
        if (!foundAnswer) {
          missingAnswers.push(answer);
        }
      });

      if (!isNonEmptyArray(missingAnswers)) {
        // no answers to update
        newUpdateRequest.wereNoAnswersToUpdate = true;
        await newUpdateRequest.save();
        return utils.sendResponse(res, {
          updateWorkspaceRequest: newUpdateRequest
        });
      }

      let JSONObjects = await answersToSubmissions(missingAnswers);
      if (!isNonEmptyArray(JSONObjects)) {
        newUpdateRequest.updateErrors.push('Error updating workspace with new submissions.');
        await newUpdateRequest.save();
        return utils.sendResponse(res, {
          updateWorkspaceRequest: newUpdateRequest
        });  }

      let savedSubs = await Promise.all(JSONObjects.map((obj) => {
        obj.createDate = Date.now();
        let creatorId;

        let encUserId = _.propertyOf(obj)(['creator', 'studentId']);

        // set creator of submission as the enc user who created it if applicable
        // else set as importer

        if (isValidMongoId(encUserId)) {
          creatorId = encUserId;
        } else {
          creatorId = user._id;
        }
        obj.createdBy = creatorId;
        // obj.createdBy = user._id;
        let newSubmission = new models.Submission(obj);

        newSubmission.workspaces.push(workspace);
        return newSubmission.save();

      }));

      popWorkspace.submissions = popWorkspace.submissions.map(sub => sub._id);
      savedSubs.forEach((sub) => {
        popWorkspace.submissions.push(sub._id);
        newUpdateRequest.addedSubmissions.push(sub._id);
      });
      await popWorkspace.save();

      newUpdateRequest.workspace = popWorkspace._id;
      data.workspaces = [ popWorkspace ];
      await newUpdateRequest.save();
      data.updateWorkspaceRequest = newUpdateRequest;
    }

    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error updateWorkspaceRequest: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }


};

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
module.exports.getRestrictedDataMap = getRestrictedDataMap;
module.exports.addAnswerToWorkspace = addAnswerToWorkspace;
module.exports.post.updateWorkspaceRequest = updateWorkspaceRequest;
module.exports.addAnswerToWorkspaces = addAnswerToWorkspaces;
module.exports.answersToSubmissions = answersToSubmissions;