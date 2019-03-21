/* eslint-disable complexity */
const utils = require('./utils');
const _ = require('underscore');
const mongooseUtils = require('../../utils/mongoose');
const objectUtils = require('../../utils/objects');

const { isValidMongoId } = mongooseUtils;
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

const canGetResponse = async function(user, responseId) {
  try {
    if (!isNonEmptyObject(user)) {
      return false;
    }

    const { accountType, actingRole } = user;
    const isStudent = accountType === 'S' || actingRole === 'student';

    if (accountType === 'A' && !isStudent) {
      return true; // admins currently can get all responses
    }

    let criteria = await accessibleResponsesQuery(user, responseId);

    return utils.doesRecordExist('Response', criteria);
  } catch(err) {
    console.error(`Error canGetResponse: ${err}`);
  }
};

module.exports.get.responses = accessibleResponsesQuery;
module.exports.get.response = canGetResponse;
