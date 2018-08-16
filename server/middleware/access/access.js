/* jshint ignore:start */
//REQUIRE MODULES
const _ = require('underscore');
//const logger = require('log4js').getLogger('server');

//REQUIRE FILES
const models = require('../../datasource/schemas');
const utils = require('./utils');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

// async function getOrgUsers(orgId) {
//   try {
//     const orgMembers = await models.User.find({organization: orgId}, {_id: 1});
//     return orgMembers.map(obj => obj._id);
//   }catch(err) {
//     console.log('error getting orgusers', err);
//   }
// }

// async function getTeacherAssignments(userId) {
//   try {
//     const ownAssignmentIds = await models.Assignment.find({createdBy: userId}, {_id: 1});
//     return ownAssignmentIds.map(obj => obj._id);
//   }catch(err) {
//     console.log('error getting teacher assignments', err);
//   }
// }

function getTeacherSections(user) {
  const ownSections = user.sections.map((section) => {
    if (section.role === 'teacher') {
      return section.sectionId;
    }
   });
}

async function getTeacherStudents(teacher) {
  try {
    const teacherSections = getTeacherSections(teacher);
    const students = await models.User.find({ _id:{ $in: teacherSections }}, { _id: 1 });
    return students.map(obj => obj._id);
  }catch(err) {
    console.log(err);
  }
}







/* jshint ignore:end */