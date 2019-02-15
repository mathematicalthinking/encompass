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

    const { accountType, actingRole } = user;

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: { $ne: true } }
      ]
    };

      if (isNonEmptyArray(ids)) {
        filter.$and.push({ _id: { $in : ids } });
      } else if(isValidMongoId(ids)) {
        filter.$and.push({ _id: ids });
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
        }
      }

      if (accountType === 'A' && !isStudent) {
        return filter;
      }

    const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);

    // everyone should have access to all submissions that belong to a workspace that they have access to
    const orFilter = { $or: [] };
    orFilter.$or.push({ createdBy: user._id });
    orFilter.$or.push({workspaces : { $elemMatch: { $in: accessibleWorkspaceIds} }});

    // everyone should have access to submissions related to approved mentor replies addressed to them

    let approvedMentorReplies = await utils.getModelIds('Response', {
      isTrashed: false,
      responseType: 'mentor',
      status: 'approved',
      recipient: user._id
    });

    if (isNonEmptyArray(approvedMentorReplies)) {
      orFilter.$or.push({ responses: { $elemMatch: { $in: approvedMentorReplies } } } );
    }

    const restrictedRecords = await utils.getRestrictedWorkspaceData(user, 'submissions');

    if (isNonEmptyArray(restrictedRecords)) {
      filter.$and.push({ _id: { $nin: restrictedRecords } });
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

    // will only reach here if admins/pdadmins are in actingRole teacher
    //should have access to all submissions that you created
    // in case they are not in a workspace

    if (accountType === 'P') {
      // PDamins can get any submissions created by someone from their organization
      const userOrg = user.organization;

      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      orFilter.$or.push({createdBy : {$in : userIds}});
      filter.$and.push(orFilter);
      return filter;
    }

    if (accountType === 'T') {
    // teachers can get any submissions where they are the primary teacher or in the teachers array?
    // should teachers be able to get all submissions from organization?


      // filter.$or.push({ 'teacher.id': user.id });
      // filter.$or.push({ teachers : user.id });
      filter.$and.push(orFilter);
      return filter;
    }

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