const utils = require('./utils');
const apiUtils = require('../../datasource/api/utils');
const _ = require('underscore');

module.exports.get = {};

const accessibleResponsesQuery = async function(user, ids, workspace, filterBy) {
  try {
    if (!apiUtils.isNonEmptyObject(user)) {
      return {};
    }

    const { accountType, actingRole } = user;

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };

    if (apiUtils.isNonEmptyArray(ids)) {
      filter.$and.push({ _id: { $in : ids } });
    } else if(apiUtils.isValidMongoId(ids)) {
      filter.$and.push({ _id: ids });
    }

    if (apiUtils.isNonEmptyObject(filterBy)) {
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

    if (apiUtils.isValidMongoId(workspace)) {
      filter.$and.push({workspace});
    }

    if (accountType === 'A' && !isStudent) {
      return filter;
    }

    const orFilter = { $or: [] };

    // can access direct feedback addressed to user only if status is approved
      orFilter.$or.push({
        recipient: user._id,
        $or: [
          { status: 'approved' },
          { type: 'approver', status: { $ne: 'superceded' } }
        ]
      });

    // can access any feedback from workspace where user has approve permissions

    let approverWorkspaceIds = await utils.getApproverWorkspaceIds(user);
    if (apiUtils.isNonEmptyArray(approverWorkspaceIds)) {
      orFilter.$or.push({
        workspace: {$in: approverWorkspaceIds}
      });
    }

    // can access any feedback you created


    // orFilter.$or = [];
    orFilter.$or.push({ createdBy: user._id });
    // orFilter.$or.push({workspace : { $in: accessibleWorkspaceIds} });

    // const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'responses');
    // console.log('restrictedResponseIds', restrictedRecords);

    // if (apiUtils.isNonEmptyArray(restrictedRecords)) {
    //   filter.$and.push({ _id: { $nin: restrictedRecords } });
    // }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

    //should have access to all responses that you created
    // in case they are not in a workspace

    if (accountType === 'P') {
      // PDamins can get any responses created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      orFilter.$or.push({createdBy : {$in : userIds}, recipient: {$in: userIds}});
      filter.$and.push(orFilter);

      return filter;
    }

    if (accountType === 'T') {
    // teachers can get any responses where they are the primary teacher or in the teachers array
    // should teachers be able to get all responses from organization?

    // createdBy is already taken care of above
      // filter.$or.push({ createdBy : user._id });
      // filter.$or.push({ 'teacher.id': user.id });
      // filter.$or.push({ teachers : user.id });
      filter.$and.push(orFilter);

      return filter;
    }

  }catch(err) {
    console.trace();
    console.error(`error building accessible responses critera: ${err}`);
  }
};

const canGetResponse = async function(user, responseId) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;
  const isStudent = accountType === 'S' || actingRole === 'student';

  // if (accountType === 'S' || actingRole === 'student') {
  //   return false; // currently we are blocking students from getting responses
  // }

  if (accountType === 'A' && !isStudent) {
    return true; // admins currently can get all responses
  }

  // use accessibleResponses criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleResponsesQuery(user, responseId);
  let accessibleIds = await utils.getModelIds('Response', criteria);

  accessibleIds = accessibleIds.map(id => id.toString()); // map objectIds to strings to check for existence
  return _.contains(accessibleIds, responseId);
};

module.exports.get.responses = accessibleResponsesQuery;
module.exports.get.response = canGetResponse;
