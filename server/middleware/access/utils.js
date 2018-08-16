/* jshint ignore:start */
const models = require('../../datasource/schemas');
const _ = require('underscore');

//Returns an array of oIds
const getModelIds = async function(model, filter={}) {
  try {
    console.log('filter', filter);
    console.log('model', model);
    const records = await models[model].find(filter, {_id: 1});
    console.log('records', records);
    return records.map(rec => rec._id);
  }catch(err) {
    return new Error(`Error retrieving modelIds: ${err}`);
  }
}

// async function getOrgUsers(orgId) {
//   try {
//     const orgMembers = await models.User.find({organization: orgId}, {_id: 1});
//     return orgMembers.map(obj => obj._id);
//   }catch(err) {
//     console.log('error getting orgusers', err);
//   }
// }

async function getTeacherAssignments(userId) {
  try {
    const ownAssignmentIds = await models.Assignment.find({createdBy: userId}, {_id: 1});
    return ownAssignmentIds.map(obj => obj._id);
  }catch(err) {
    console.log('error getting teacher assignments', err);
  }
}

function getTeacherSections(user) {
  const ownSections = user.sections.map((section) => {
    if (section.role === 'teacher') {
      return section.sectionId;
    }
   });
}

const getStudentSections = function(user) {
  if (!user || !Array.isArray(user.sections)) {
    return;
  }
  return user.sections.map((section) => {
    if (section.role === 'student') {
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

async function getStudentPeers(user) {
  if (!user) {
    return;
  }
  try {
  const sectionIds = getStudentSections(user);
  const sections = await models.Section.find({$in: sectionIds});
  const studentIds = sections.map(section => section.students);
  return _.flatten(studentIds);
  }catch(err) {
    return new Error(err);
  }
}

async function getStudentUsers(user) {
  if (!user) {
    return;
  }
  try {
    const ids = [];
  ids.push(user._id);

  const sectionIds = getStudentSections(user);
  const sections = await models.Section.find({$in: sectionIds});
  const studentIds = sections.map(section => section.students);

  ids.push(studentIds);

  const teacherIds = sections.map(section => section.teachers);

  ids.push(teacherIds);

  return _.flatten(ids);
  }catch(err) {
    return new Error(err);
  }


}

async function getStudentTeachers(user) {
  if (!user) {
    return;
  }
  try {
    const sectionIds = getStudentSections(user);
  const sections = await models.Section.find({$in: sectionIds});
  const teacherIds = sections.map(section => section.teachers);
  return _.flatten(teacherIds);
  }catch(err) {
    return new Error(err);
  }
}

async function getPdAdminUsers(user) {
  if (!user) {
    return user;
  }
  const ids = [];
  ids.push(user._id);
  const org = user.organization;
  const filter = {
    $or: [
      {organization: org},
      {createdBy: user._id}
    ]
  }
  const orgUserIds = await getModelIds('User', filter);

  ids.push(orgUserIds);

  return _.flatten(ids);
}
// teacher can get all students in one of their sections
// or any student who they created
async function getTeacherUsers(user) {
  if (!user) {
    return user;
  }
  const ids = [];
  ids.push(user._id);
  const sectionIds = getTeacherSections(user);
  const sections = await models.Section.find({_id: {$in: sectionIds}});
  const students = _.flatten(sections.map(section => section.students));

  const filter = {
    $or: [
      { _id: { $in: students} },
      {createdBy: user._id}
    ]
  };

  const users = await getModelIds('User', filter);
  ids.push(users);
  return _.flatten(ids);

}

module.exports.getModelIds = getModelIds;
module.exports.getTeacherSections = getTeacherSections;
module.exports.getStudentSections = getStudentSections;
module.exports.getStudentPeers = getStudentPeers;
module.exports.getStudentTeachers = getStudentTeachers;
module.exports.getStudentUsers = getStudentUsers;
module.exports.getPdAdminUsers = getPdAdminUsers;
module.exports.getTeacherUsers = getTeacherUsers;
/* jshint ignore:end */