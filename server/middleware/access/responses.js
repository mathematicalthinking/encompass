/* eslint-disable complexity */
const utils = require('./utils');
const _ = require('underscore');
const mongooseUtils = require('../../utils/mongoose');
const objectUtils = require('../../utils/objects');
const wsAccess = require('./workspaces');

const { isValidMongoId, areObjectIdsEqual } = mongooseUtils;
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;

module.exports.get = {};

const accessibleResponsesQuery = async function(user, ids, workspace, filterBy, isAdminActingPd) {
  try {
    if (!isNonEmptyObject(user)) {
      return;
    }

    const { accountType, actingRole, organization } = user;

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };

    // used to narrow down search when looking up approver workspaces
    let workspaceFilter = {};

    if (isNonEmptyArray(ids)) {
      filter.$and.push({ _id: { $in : ids } });
    } else if(isValidMongoId(ids)) {
      filter.$and.push({ _id: ids });
    }

    if (isNonEmptyObject(filterBy)) {
      let allowedKeyHash = {
        workspace: true,
        submission: true,
        createdBy: true,
        recipient: true,
        responseType: true,
        status: true,
        submissions: true,
      };
      _.each(filterBy, (val, key) => {
        if (allowedKeyHash[key]) {
          if (key === 'submissions') {
            if (isNonEmptyArray(val)) {
              filter.$and.push({
                submission: { $in: val }
              });
              workspaceFilter.submissions = { $elemMatch: {$in: val } };
            }
          } else {
            filter.$and.push({[key]: val});
          }
        }
      });
    }

    if (isValidMongoId(workspace)) {
      filter.$and.push({workspace});
      workspaceFilter._id = workspace;
    }
    let isAdmin = accountType === 'A' && !isStudent && !isAdminActingPd;

    if (isAdmin) {
      return filter;
    }

    let isPdAdmin = accountType === 'P' || (isAdminActingPd === 'true' || isAdminActingPd === true);

    const orFilter = { $or: [] };

    // can access direct feedback addressed to user only if status is approved
      orFilter.$or.push({
        recipient: user._id,
        status: { $nin: ['superceded', 'draft'] },
        $or: [
          { status: 'approved' },
          { responseType: 'approver' }
        ]
      });

      orFilter.$or.push({ createdBy: user._id });

      let promises = [
        utils.getCollabFeedbackWorkspaceIds(user, workspaceFilter),
        utils.getRestrictedWorkspaceData(user, 'responses')
      ];

      if (isPdAdmin && isValidMongoId(organization)) {
        promises.push(utils.getModelIds('User', { organization }));
      }
    let [ collabWorkspaceIds, restrictedRecords, orgUserIds ] = await Promise.all(promises);

    let approverWorkspaceIds = collabWorkspaceIds[1];
    if (isNonEmptyArray(approverWorkspaceIds)) {
      orFilter.$or.push({workspace: {$in: approverWorkspaceIds}, status: { $ne: 'draft'} });
    }
    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isNonEmptyArray(orgUserIds)) {
      orFilter.$or.push({createdBy : {$in : orgUserIds}});
      orFilter.$or.push({$and: [ {recipient: {$ne: user._id }}, {recipient: {$in: orgUserIds}} ]});
    }

    filter.$and.push(orFilter);
    return filter;

  }catch(err) {
    console.trace();
    console.error(`error building accessible responses critera: ${err}`);
  }
};

// popWs is passed in when this function is called from workspace api
const canGetResponse = function(user, response, popWs) {
  try {
    if (!isNonEmptyObject(user) || !isNonEmptyObject(response)) {
      return false;
    }
    // workspace is populated, workspace.owner and workspace.createdBy are populated
    // createdBy is populated
    // recipient is populated

    let { accountType, actingRole } = user;

    let userOrg = user.organization;

    let isAdmin = accountType === 'A' && actingRole !== 'student';

    if (isAdmin) {
      return true; // admins currently can get all responses
    }


    let { status, workspace, approvedBy } = response;

    let creatorId = _.propertyOf(response)(['createdBy', '_id']);
    let recipientId = _.propertyOf(response)(['recipient', '_id']);

    let creatorOrgId = _.propertyOf(response)(['createdBy', 'organization']);
    let recipientOrgId = _.propertyOf(response)(['recipient', 'organization']);

    let isApproved = status === 'approved';
    let isDraft = status === 'draft';

    let isRecipient = areObjectIdsEqual(user._id, recipientId);

    // recipient of approved response
    if (isApproved && isRecipient) {
      return true;
    }
    // creator of response
    if (areObjectIdsEqual(user._id, creatorId)) {
      return true;
    }
    // approver of response
    if (areObjectIdsEqual(user._id, approvedBy)) {
      return true;
    }

    if (isDraft) {
      return false;
    }

    // only creators and admins can access drafts

    let isPdAdmin = accountType === 'P' && actingRole !== 'student';

    if (isPdAdmin) {
      // pdAdmins can access any responses addressed to members of their org or responses
      // created by members
      if (areObjectIdsEqual(creatorOrgId, userOrg)) {
        return true;
      }
      if (!isRecipient && areObjectIdsEqual(recipientOrgId, userOrg)) {
        return true;
      }
    }

    // check if user has approver permissions for workspace

    let workspaceArg = popWs ? popWs : workspace;

   return wsAccess.canModify(user, workspaceArg, 'feedback', 3);

  } catch(err) {
    console.error(`Error canGetResponse: ${err}`);
  }
};

module.exports.get.responses = accessibleResponsesQuery;
module.exports.get.response = canGetResponse;
