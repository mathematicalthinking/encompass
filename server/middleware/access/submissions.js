/* eslint-disable complexity */
const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, } = objectUtils;
const { isValidMongoId } = mongooseUtils;

module.exports.get = {};

const accessibleSubmissionsQuery = async function(user, ids, filterBy) {
  try {
    if (!isNonEmptyObject(user)) {
      return {};
    }

    const { accountType, actingRole, organization } = user;

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: { $ne: true } }
      ]
    };

    let workspaceFilter = {};

      if (isNonEmptyArray(ids)) {
        filter.$and.push({ _id: { $in : ids } });
        workspaceFilter.submissions = { $elemMatch: {$in: ids } };
      } else if(isValidMongoId(ids)) {
        filter.$and.push({ _id: ids });
        workspaceFilter.submissions = ids;
      }

      if (isNonEmptyObject(filterBy)) {
        let { answer, answers, student, startDate, workspace } = filterBy;
        if (isValidMongoId(filterBy.answer)) {
          filter.$and.push({answer: answer });
        }

        if (isNonEmptyArray(answers)) {
          filter.$and.push({answer: {$in: answers}});
        }

        if (isValidMongoId(student)) {
          filter.$and.push({'creator.studentId': student});
        }

        if (startDate) {
          let date = new Date(startDate);
          filter.$and.push({createDate: {$gt: date}});
        }

        if (isValidMongoId(workspace)) {
          filter.$and.push({workspaces: workspace});
          workspaceFilter._id = workspace;
        }
      }

      if (accountType === 'A' && !isStudent) {
        return filter;
      }

      let responseCriteria = {
        isTrashed: false,
        responseType: 'mentor',
        status: 'approved',
        recipient: user._id
      };

      if (isNonEmptyArray(ids)) {
        responseCriteria.submission = { $in: ids };
      }

      if (isValidMongoId(ids)) {
        responseCriteria.submission = ids;
      }

      let promises = [
        utils.getAccessibleWorkspaceIds(user, workspaceFilter),
        utils.getModelIds('Response', responseCriteria),
        utils.getRestrictedWorkspaceData(user, 'submissions'),
      ];

      if (accountType === 'P' && isValidMongoId(organization)) {
        promises.push(utils.getModelIds('User', { organization }));
      }

      let [ accessibleWorkspaceIds, approvedMentorReplies, restrictedRecords, orgUserIds ] = await Promise.all(promises);

    // everyone should have access to all submissions that belong to a workspace that they have access to
    const orFilter = { $or: [] };

    orFilter.$or.push({ createdBy: user._id });

    if (isNonEmptyArray(accessibleWorkspaceIds)) {
      orFilter.$or.push({ workspaces : { $elemMatch: { $in: accessibleWorkspaceIds } } });
    }

    // everyone should have access to submissions related to approved mentor replies addressed to them

    if (isNonEmptyArray(approvedMentorReplies)) {
      orFilter.$or.push({ responses: { $elemMatch: { $in: approvedMentorReplies } } } );
    }

    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isNonEmptyArray(orgUserIds)) {
      orFilter.$or.push({createdBy : { $in : orgUserIds } });
    }

    filter.$and.push(orFilter);
    return filter;


  }catch(err) {
    console.log('err asq', err);
  }
};

const canLoadSubmission = async function(user, id) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;
  const isStudent = accountType === 'S' || actingRole === 'student';

  if (accountType === 'A' && !isStudent) {
    return true; // admins currently can get all submissions
  }

  // use accessibleSubmissions criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleSubmissionsQuery(user, id);

  return utils.doesRecordExist('Submission', criteria);
  };

module.exports.get.submissions = accessibleSubmissionsQuery;
module.exports.get.submission = canLoadSubmission;