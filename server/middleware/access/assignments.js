const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const _ = require('underscore');

const objectUtils = require('../../utils/objects');
const { isNonEmptyArray, } = objectUtils;

module.exports.get = {};

async function accessibleAssignmentsQuery(user, ids) {
  if (!user) {
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
    } else if (mongooseUtils.isValidMongoId(ids)) {
      filter._id = ids;
    }
  }

  // students can get any assignment that has been assigned to them
  if (accountType === 'S' || actingRole === 'student') {
    filter.students = user;
    return filter;
  }
  // teachers can get any assignment they have created or any section where they
  if (accountType === 'T') {
    const sections = _.pluck(utils.getTeacherSections(user), 'sectionId');
    filter.$or = [
      { createdBy: user },
    ];
    if (isNonEmptyArray(sections)) {
      filter.$or.push({
        section: { $in: sections }
      });
    }
    return filter;
  }

  if (accountType === 'P') {
    const sections = await utils.getOrgSections(user);
    filter.$or = [
      { createdBy: user },
      { section: { $in: sections} }
    ];

    return filter;
  }

  if (accountType === 'A') {
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
  let accessibleIds = await utils.getModelIds('Assignment', criteria);

  // map objectIds to strings to check for existence
  accessibleIds = accessibleIds.map(id => id.toString());

    if (accessibleIds.includes(assignmentId)) {
      return true;
    }
    return false;
};

module.exports.get.assignments = accessibleAssignmentsQuery;
module.exports.get.assignment = canGetAssignment;