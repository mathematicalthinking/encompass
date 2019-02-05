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

    const { accountType, actingRole } = user;

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };

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
        status: true
      };
      _.each(filterBy, (val, key) => {
        if (allowedKeyHash[key]) {
          filter.$and.push({[key]: val});
        }
      });
    }

    if (isValidMongoId(workspace)) {
      filter.$and.push({workspace});
    }
    let isAdmin = accountType === 'A' && !isStudent && !isAdminActingPd;

    if (isAdmin) {
      return filter;
    }

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

      let [mentorWorkspaceIds, approverWorkspaceIds ] = await utils.getCollabFeedbackWorkspaceIds(user);

      if (isNonEmptyArray(approverWorkspaceIds)) {
        orFilter.$or.push({workspace: {$in: approverWorkspaceIds}, status: { $ne: 'draft'} });
      }

    const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'responses');
    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

    //should have access to all responses that you created
    // in case they are not in a workspace

    if (accountType === 'P' || (isAdminActingPd === 'true' || isAdminActingPd === true)) {
      // PDamins can get any responses created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      if (isValidMongoId(userOrg)) {
        const userIds = await utils.getModelIds('User', {organization: userOrg});

        orFilter.$or.push({createdBy : {$in : userIds}});
        // shouldn't be seeing drafts addressed to their own account
        orFilter.$or.push({$and: [ {recipient: {$ne: user._id }}, {recipient: {$in: userIds}} ]});
      }

      filter.$and.push(orFilter);

      return filter;
    }

    if (accountType === 'T') {
    // teachers can get any responses where they are the primary teacher or in the teachers array
    // should teachers be able to get all responses from organization?
    // get ids of all students? or unneccessary because responses are always tied to submissions?
      filter.$and.push(orFilter);

      return filter;
    }

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
