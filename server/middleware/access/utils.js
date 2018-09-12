/* jshint ignore:start */
const models = require('../../datasource/schemas');
const _ = require('underscore');

const wsAuth =require('./workspaces');
const assignmentAuth = require('./assignments');

//Returns an array of oIds
const getModelIds = async function(model, filter={}) {
  try {
    const records = await models[model].find(filter, {_id: 1});
    return records.map(rec => rec._id);
  }catch(err) {
    return new Error(`Error retrieving modelIds: ${err}`);
  }
}

async function getOrgSections(user) {
  try {
    const org = user.organization;
    const filter = {
      organization: org
    }
    const sectionIds = await getModelIds('Section', filter);
    return sectionIds;
  }catch(err) {
    console.error(err);
    console.trace();
  }
}


async function getAssignmentProblems(user) {
  try {
    const criteria = await assignmentAuth.get.assignments(user);
    const assignments = await models.Assignment.find(criteria).lean();
    return assignments.map(assn => assn.problem.toString());
  }catch(err) {
    console.error(err);
    console.trace();
  }
}

async function getTeacherAssignments(userId) {
  try {
    const ownAssignmentIds = await models.Assignment.find({createdBy: userId}, {_id: 1}).lean().exec();
    return ownAssignmentIds.map(obj => obj._id);
  }catch(err) {
    console.log('error getting teacher assignments', err);
  }
}

async function getTeacherSections(user) {
  const ownSections = user.sections.map((section) => {
    if (section.role === 'teacher') {
      return section.sectionId;
    }
   });
   return ownSections;
}

async function getTeacherSectionsById(userId) {
  try {
    const sectionIds = await getModelIds('Section', {teachers: userId});
    return sectionIds;
  }catch(err) {
    console.log('err', err);
  }
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

const getStudentResponses = async function (user) {
  if (!user) {
    return;
  }

 let userId = user._id;

 let respones = await models.Response.find({recipient: userId}).lean().exec();

  return respones.map((response) => {
    return response.createdBy;
  });
}


async function getStudentUsers(user) {
  if (!user) {
    return;
  }
  try {
    const ids = [];
    ids.push(user._id);

    const sectionIds = getStudentSections(user);
    const sections = await models.Section.find({_id: {$in: sectionIds}}).lean().exec();
    const studentIds = sections.map(section => section.students);

    ids.push(studentIds);

    const teacherIds = sections.map(section => section.teachers);

    ids.push(teacherIds);

    const responseUsers = await getStudentResponses(user);

    ids.push(responseUsers);

  const flattened =  _.flatten(ids);
  return flattened.map(id => id.toString());

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
  };
  const orgUserIds = await getModelIds('User', filter);

  ids.push(orgUserIds);

  const flattened = _.flatten(ids);
  return flattened.map(id => id.toString());
}
// teachers can also get all users in org, but may not be able to edit all
async function getTeacherUsers(user) {
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
  };

  const orgUserIds = await getModelIds('User', filter);

  ids.push(orgUserIds);

  const flattened = _.flatten(ids);
  return flattened.map(id => id.toString());

}

async function getAccessibleWorkspaceIds(user) {
  if (!user) {
    return;
  }
  try {
    const criteria = await wsAuth.get.workspaces(user, null);
    const ids = await getModelIds('Workspace', criteria);
    return ids;

  } catch(err) {
    console.log('err getacc ids', err);
  }
}

async function getUsersFromWorkspaces(workspaceIds) {
  if (!workspaceIds || !Array.isArray(workspaceIds)) {
    return [];
  }
  try {

    const workspaces = await models.Workspace.find({ _id: { $in: workspaceIds } }, { owner: 1, editors: 1 } ).lean().exec();
    const userIds =  [];
    workspaces.forEach((ws) => {
      userIds.push(ws.owner.toString());
      userIds.push(ws.editors.map(id => id.toString()));
    });

    const flattened = _.flatten(userIds);
    return flattened;

  }catch(err) {
    console.log('err', err);
  }

}

const getCreatorIds = async function(crit={}) {
  try {
    let users = await models.User.find(crit, {createdBy: 1}).lean().exec();
    let creators = users.map((user) => {
      let createdBy = user.createdBy;
      if (!createdBy) {
        return null;
      }
      return createdBy.toString();
    });

    creators = _.without(creators, null);
    return _.uniq(creators);
  }catch(err) {
    console.error('error getAccessibleUsersCreators', err);
    console.trace();
  }
}

module.exports.getModelIds = getModelIds;
module.exports.getTeacherSections = getTeacherSections;
module.exports.getStudentSections = getStudentSections;
module.exports.getStudentUsers = getStudentUsers;
module.exports.getPdAdminUsers = getPdAdminUsers;
module.exports.getTeacherUsers = getTeacherUsers;
module.exports.getAccessibleWorkspaceIds = getAccessibleWorkspaceIds;
module.exports.getUsersFromWorkspaces = getUsersFromWorkspaces;
module.exports.getTeacherAssignments = getTeacherAssignments;
module.exports.getTeacherSectionsById = getTeacherSectionsById;
module.exports.getOrgSections = getOrgSections;
module.exports.getAssignmentProblems = getAssignmentProblems;
module.exports.getCreatorIds = getCreatorIds;
/* jshint ignore:end */