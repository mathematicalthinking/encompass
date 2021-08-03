const utils = require('./utils');
const assignmentAccess = require('./assignments');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNonEmptyArray, isNonEmptyObject } = objectUtils;
const { isValidMongoId, } = mongooseUtils;

module.exports.get = {};

const accessibleSectionsQuery = async function(user, ids) {
  try {
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

  // Admins with acting role 'teacher' can get everything
  if (accountType === 'A' && actingRole !== 'student') {
    return filter;
  }

  filter.$or = [
    { createdBy: user._id }
  ];

  // everyone needs to be able to get any sections that reference an
  // assignment they have access to

  let assignmentsCriteria = await assignmentAccess.get.assignments(user);
  let assignmentIds = await utils.getModelIds('Assignment', assignmentsCriteria);

  if (isNonEmptyArray(assignmentIds)) {
    filter.$or.push({assignments : { $elemMatch: { $in: assignmentIds} }});
  }

  // Students can get sections they are a student of
  if (actingRole === 'student' || accountType === 'S') {
    filter.$or.push({ students: user._id});

    return filter;
  }


  // PdAdmins with acting role 'teacher' can get all sections tied to their org
  if (accountType === 'P') {
    const userOrg = user.organization;
    if (isValidMongoId(userOrg)) {
      filter.$or.push({ organization: userOrg});
    }

    return filter;
  }
  // Teachers with acting role 'teacher' can get all sections where they are a teacher
  if (accountType === 'T') {

    filter.$or.push({teachers: user._id});
    return filter;
  }
  }catch(err) {
    console.log('err', err);
  }

};

const canGetSection = async function(user, sectionId) {
  if (!user) {
    return;
  }

  const { accountType } = user;

  // admins currently can get all sections
  if (accountType === 'A') {
    return true;
  }

  // use accessibleSections criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleSectionsQuery(user, sectionId);

  return utils.doesRecordExist('Section', criteria);
};

module.exports.get.sections = accessibleSectionsQuery;
module.exports.get.section = canGetSection;