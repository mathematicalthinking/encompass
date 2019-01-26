const utils = require('./utils');
const _ = require('underscore');
const mongooseUtils = require('../../utils/mongoose');
const submissionAccess = require('./submissions');
const objectUtils = require('../../utils/objects');

const { isValidMongoId } = mongooseUtils;
const { isNonEmptyObject, isNonEmptyArray, isNil } = objectUtils;

module.exports.get = {};

const accessibleResponsesQuery = async function(user, ids, workspace, filterBy) {
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

    if (accountType === 'A' && !isStudent) {
      return filter;
    }

    const orFilter = { $or: [] };

    // can access direct feedback addressed to user only if status is approved
      orFilter.$or.push({
        recipient: user._id,
        $or: [
          { status: 'approved' },
          { responseType: 'approver', status: { $ne: 'superceded' } }
        ]
      });

      let [ collabApproverWorkspaceIds, approverWorkspaceIds ] = await Promise.all([utils.getCollabApproverWorkspaceIds(user), utils.getApproverWorkspaceIds(user)]);

      console.log('caw', collabApproverWorkspaceIds, 'aw', approverWorkspaceIds);
      if (isNonEmptyArray(collabApproverWorkspaceIds)) {
        orFilter.$or.push({workspace: {$in: collabApproverWorkspaceIds}});
      }

      if (isNonEmptyArray(approverWorkspaceIds)) {
        orFilter.$or.push({workspace: {$in: approverWorkspaceIds}});
      }

    // can access any feedback from workspace where user has approve permissions

    // let approverWorkspaceIds = await utils.getApproverWorkspaceIds(user);

    // if (isNonEmptyArray(approverWorkspaceIds)) {
    //   orFilter.$or.push({
    //     workspace: {$in: approverWorkspaceIds}
    //   });
    // }

    // let subCriteria = await submissionAccess.get.submissions(user);

    // let allowedSubmissionIds = await utils.getModelIds('Submission', subCriteria);
    // if (isNonEmptyArray(allowedSubmissionIds)) {
    //   orFilter.$or.push({
    //     submission: {$in: allowedSubmissionIds}
    //   });
    // }
    // can access any feedback from submissions you have access to

    // can access any feedback you created


    // orFilter.$or = [];
    orFilter.$or.push({ createdBy: user._id });
    // orFilter.$or.push({workspace : { $in: accessibleWorkspaceIds} });

    const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'responses');
    console.log('restricted records', restrictedRecords);
    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

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
      if (isValidMongoId(userOrg)) {
        const userIds = await utils.getModelIds('User', {organization: userOrg});

        orFilter.$or.push({createdBy : {$in : userIds}});
        orFilter.$or.push({recipient: {$in: userIds}});
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
