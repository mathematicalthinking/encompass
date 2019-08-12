const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const _ = require('underscore');

const objectUtils = require('../../utils/objects');
const { isNonEmptyArray, isNonEmptyObject, isNonEmptyString } = objectUtils;

const { isValidMongoId, } = mongooseUtils;

module.exports.get = {};

async function accessibleAssignmentsQuery(user, ids, filterBy) {
  if (!isNonEmptyObject(user)) {
    return;
  }
  const { accountType, actingRole } = user;

  let filter = {
    isTrashed: false
  };

  // ids will either be an array of ids or a single id or null
  if (ids) {
    if (isNonEmptyArray(ids)) {
      filter._id = { $in: ids };
    } else if (isValidMongoId(ids)) {
      filter._id = ids;
    }
  }

  if (isNonEmptyObject(filterBy)) {
    if (isNonEmptyString(filterBy.name)) {
      let replaced = filterBy.name.replace(/\s+/g, "");
      let regex = new RegExp(replaced, 'i');
      filter.name = regex;
    }
  }

  if (accountType === 'A' && actingRole !== 'student') {
    return filter;
  }
  // everyone can get assignments linked to workspaces they have access to

  let accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);

  filter.$or = [
    { createdBy: user._id },
  ];
  if (isNonEmptyArray(accessibleWorkspaceIds)) {
    filter.$or.push({linkedWorkspaces: { $elemMatch: {$in: accessibleWorkspaceIds } } } );
  }
  // students can get any assignment that has been assigned to them
  if (accountType === 'S' || actingRole === 'student') {
    filter.$or.push({ students: user._id });
    return filter;
  }
  // teachers can get any assignment they have created or any section where they
  if (accountType === 'T') {
    const sections = _.pluck(utils.getTeacherSections(user), 'sectionId');

    if (isNonEmptyArray(sections)) {
      filter.$or.push({
        section: { $in: sections }
      });
    }
    return filter;
  }

  if (accountType === 'P') {
    const sections = await utils.getOrgSections(user);
    if (isNonEmptyArray(sections)) {
      filter.$or.push({
        section: { $in: sections}
      });
    }

    return filter;
  }

}

const canGetAssignment = async function(user, assignmentId) {
  if (!user) {
    return;
  }

  const { accountType } = user;

  // admins currently can get all assignments
  if (accountType === 'A') {
    return true;
  }

  // use accessibleAssignments criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleAssignmentsQuery(user, assignmentId);

  return utils.doesRecordExist('Assignment', criteria);
};

module.exports.get.assignments = accessibleAssignmentsQuery;
module.exports.get.assignment = canGetAssignment;