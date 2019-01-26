const models = require('../../datasource/schemas');
const _ = require('underscore');

const wsAuth =require('./workspaces');
const assignmentAuth = require('./assignments');
const wsApi = require('../../datasource/api/workspaceApi');
const responsesAuth = require('./responses');
const mongooseUtils = require('../../utils/mongoose');

const objectUtils = require('../../utils/objects');
const { isNil, isNonEmptyObject, isNonEmptyArray, isNonEmptyString, } = objectUtils;

//Returns an array of oIds
const getModelIds = async function(model, filter={}) {
  try {
    const records = await models[model].find(filter, {_id: 1}).lean().exec();
    return records.map(rec => rec._id);
  }catch(err) {
    console.error(`Error getModelIds: ${err}`);
    console.trace();
  }

};

async function getOrgSections(user) {
  try {
    const org = user.organization;
    const filter = {
      organization: org
    };
    const sectionIds = await getModelIds('Section', filter);
    return sectionIds;
  } catch(err) {
    console.error(`Error getOrgSections: ${err}`);
    console.trace();
  }
}


async function getAssignmentProblems(user) {
  try {
    const criteria = await assignmentAuth.get.assignments(user);
    const assignments = await models.Assignment.find(criteria).lean();
    return assignments.map(assn => assn.problem.toString());
  } catch(err) {
    console.error(`Error getAssignmentProblems: ${err}`);
    console.trace();
  }
}

async function getTeacherAssignments(userId) {
  try {
    const ownAssignmentIds = await models.Assignment.find({createdBy: userId}, {_id: 1}).lean().exec();
    return ownAssignmentIds.map(obj => obj._id);
  } catch(err) {
    console.error(`Error getTeacherAssignments: ${err}`);
    console.trace();
  }
}

function getTeacherSections(user) {
  if (!user || !Array.isArray(user.sections)) {
    return [];
  }
  return user.sections.filter((section) => {
    return section.role === 'teacher';
  });
}

function getTeacherSectionsById(userId) {
  if (!userId) {
    return;
  }
  return getModelIds('Section', {teachers: userId});
}

// returns sections a user belongs to in role 'student'
const getStudentSections = function(user) {
  if (!user || !Array.isArray(user.sections)) {
    return [];
  }
  return user.sections.filter((section) => {
    return section.role === 'student';
  });
};
/**
* Returns array of User ObjectIds (as strings) associated with responses a user has access to
 *
 * @param {object} user - user object
 * @returns {array}
 */
const getResponseUsers = async function (user) {
  try {
    if (!isNonEmptyObject(user)) {
      return [];
    }

    let criteria = await responsesAuth.get.responses(user);

    let responses = await models.Response.find(criteria, {recipient: 1, approvedBy: 1, createdBy: 1 }).lean().exec();

    let idMap = {};

    responses.forEach((response) => {
      ['recipient', 'approvedBy', 'createdBy'].forEach((prop) => {
        if (response.prop && !idMap[prop]) {
          idMap[response.prop] = true;
        }
      });
    });
    return _.keys(idMap);
  }catch(err) {
    console.error(`Error getStudentResponses: ${err}`);
    console.trace();
  }
};


async function getStudentUsers(user) {
  if (!user) {
    return;
  }
  try {
    const sectionIds = _.pluck(getStudentSections(user), 'sectionId');

    let userMap = {};

    if (isNonEmptyArray(sectionIds)) {
      const sections = await models.Section.find({_id: {$in: sectionIds}}, {students: 1, teachers: 1}).lean().exec();

      sections.forEach((section) => {
        if (Array.isArray(section.students)) {
          section.students.forEach((id) => {
            if (!userMap[id]) {
              userMap[id] = true;
            }
          });
        }
        if (Array.isArray(section.teachers)) {
          section.teachers.forEach((id) => {
            if (!userMap[id]) {
              userMap[id] = true;
            }
          });
        }
      });
    }

  return _.keys(userMap);

  }catch(err) {
    console.error(`Error getStudentUsers: ${err}`);
    console.trace();
  }
}

async function getUsersFromTeacherSections(user) {
  try {
    const sectionIds = _.pluck(getTeacherSections(user), 'sectionId');

    let userMap = {};

    if (isNonEmptyArray(sectionIds)) {
      const sections = await models.Section.find({_id: {$in: sectionIds}}, {students: 1, teachers: 1, createdBy: 1}).lean().exec();

      sections.forEach((section) => {
        if (section.createdBy && !userMap[section.createdBy]) {
          userMap[section.createdBy] = true;
        }

        if (Array.isArray(section.students)) {
          section.students.forEach((id) => {
            if (!userMap[id]) {
              userMap[id] = true;
            }
          });
        }
        if (Array.isArray(section.teachers)) {
          section.teachers.forEach((id) => {
            if (!userMap[id]) {
              userMap[id] = true;
            }
          });
        }
      });
    }

    return _.keys(userMap);
  } catch(err) {
    console.error(`Error getUsersFromTeacherSections: ${err}`);
  }

}

function getPdAdminUsers(user) {
  try {
    let userOrg = _.propertyOf(user)('organization');
    if (!mongooseUtils.isValidMongoId(userOrg)) {
      return [];
    }

    const filter = {
      isTrashed: false,
      organization: userOrg
    };

    return getModelIds('User', filter);

  }catch(err) {
    console.error(`Error getPdAdminUsers: ${err}`);
    console.trace();
  }
}
// teachers can also get all users in org, but may not be able to edit all
function getTeacherUsers(user) {
  try {
    let userOrg = _.propertyOf(user)('organization');
    if (!mongooseUtils.isValidMongoId(userOrg)) {
      return [];
    }

    const filter = {
      isTrashed: false,
      organization: userOrg
    };

    return getModelIds('User', filter);

  }catch(err) {
    console.error(`Error getPdAdminUsers: ${err}`);
    console.trace();
  }
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
    console.error(`Error accessibleWorkspaceIds: ${err}`);
    console.trace();
  }
}
// takes a user object and returns an array of userIds associated with workspaces that the input user has access to
async function getUsersFromWorkspaces(user) {
  try {
    if (!isNonEmptyObject(user)) {
      return [];
    }

    let wsCriteria = await wsAuth.get.workspaces(user);

    if (!isNonEmptyObject(wsCriteria)) {
      return [];
    }

    let accessibleWorkspaces = await models.Workspace.find(wsCriteria, {owner: 1, createdBy: 1, 'permissions.user': 1, }).lean().exec();

    if (!isNonEmptyArray(accessibleWorkspaces)) {
      return [];
    }

    let userMap = {};

    accessibleWorkspaces.forEach((workspace) => {
      if (!userMap[workspace.owner]) {
        userMap[workspace.owner] = true;
      }
      if (!userMap[workspace.createdBy]) {
        userMap[workspace.createdBy] = true;
      }
      if (Array.isArray(workspace.permissions)) {
        workspace.permissions.forEach((obj) => {
          if (!userMap[obj.user]) {
            userMap[obj.user] = true;
          }
        });
      }
    });

    return _.keys(userMap);

  }catch(err) {
    console.error(`Error getUsersFromWorkspaces: ${err}`);
    console.trace();
  }

}

const getCreatorIds = async function(model, crit={}) {
  try {
    if (!model) {
      return [];
    }
    let users = await models[model].find(crit, {createdBy: 1}).lean().exec();

    let idMap = {};

    users.forEach((obj) => {
      if (obj.createdBy && !idMap[obj.createdBy]) {
        idMap[obj.createdBy] = true;
      }
    });
    return _.keys(idMap);

  }catch(err) {
    console.error('error getCreatorIds', err);
    console.trace();
  }
};

const getProblemsByCategory = async function(query) {
  try {
    let queryLower = query.toLowerCase();
    let problems = await models.Problem.find({categories: {$ne: []}}, {categories: 1}).populate('categories').lean().exec();
    let results;

    results = problems.filter((p) => {
      let identifiers = p.categories.map(c => c.identifier);
      for (let identifier of identifiers) {

        let identifierLower = identifier.toLowerCase();
        if (identifierLower.includes(queryLower)) {
          return true;
        }
      }
    });
    return results.map(p => p._id);
  }catch(err) {
    console.error('error getProblemsByCategory', err);
    console.trace();
  }
};

// takes a category and returns all child categories
const getAllChildCategories = async function(categoryId, isIdOnly, asStrings) {
  try {
    let category = await models.Category.findById(categoryId);
    let identifier = category.identifier;
    let regex = new RegExp(`^${identifier}`, 'i');

    let children = await models.Category.find({identifier: regex}).lean().exec();

    if (isIdOnly) {
      if (asStrings) {
        return _.map(children, child => child._id.toString());

      }
      return _.map(children, child => child._id);
    }
    return children;
  } catch(err) {
    console.error('Error getAllChildCategories', err);
  }
};

function getRestrictedWorkspaceData(user, requestedModel) {
  if (!isNonEmptyObject(user) || !isNonEmptyString(requestedModel)) {
    return [];
  }

  const { accountType, actingRole, collabWorkspaces } = user;

  const isStudent = accountType === 'S' || actingRole === 'student';

  // admins in non-student role have 0 restrictions
  if (accountType === 'A' && !isStudent) {
    return [];
  }
  // if collabWorkspaces is empty, user has not been added as a collab on any workspaces
  // and thus does not have any accessible workspaces with restricted access

  if (!isNonEmptyArray(collabWorkspaces)) {
    return [];
  }

  return Promise.all(
    _.map(collabWorkspaces, (wsId) => {
      return models.Workspace.findById(wsId)
      .populate('selections')
      .populate('submissions')
      .populate('folders')
      .populate('taggings')
      .populate('owner')
      .populate('editors')
      .populate('createdBy')
      .populate('responses')
      .lean().exec()
      .then((populatedWs) => {
        // eslint-disable-next-line no-unused-vars
        const [canLoad, specialPermissions] = wsAuth.get.workspace(user, populatedWs);

        const restrictedDataMap = wsApi.getRestrictedDataMap(user, specialPermissions, populatedWs);

        // no restrictions
        if (!isNonEmptyObject(restrictedDataMap)) {
          return [];
        }

        // if the workspace does not have records of requested type, there is nothing to restrict
        const allRecords = populatedWs[requestedModel];
        if (!isNonEmptyArray(allRecords)) {
          return [];
        }

        // if this is undefined, means no restrictions
        // if empty array, means everything is restricted
        const allowedValues = _.propertyOf(restrictedDataMap)(requestedModel);
        if (_.isUndefined(allowedValues)) {
          return [];
        }
        let allowedIds;

        if (!isNil(allowedValues)) {
          if (Array.isArray(allowedValues)) {
            allowedIds = _.map(allowedValues, (val) => {
             if (val._id) {
               return val._id.toString();
             }
             return val.toString();
             });
           } else {
             allowedIds = allowedValues.toString();
           }
        } else {
          allowedIds = [];
        }

        const restrictedValues = _.filter(allRecords, (record) => {
          let idAsString;
          if (record._id) {
            idAsString = record._id.toString();
          } else {
            idAsString = record.toString();
          }
          return !_.contains(allowedIds, idAsString);
        });

        return _.map(restrictedValues, (val) => {
          return val._id || val;
        });
       });
      })
  )
  .then(_.flatten);
}

function getCollabApproverWorkspaceIds(user) {
  if (!isNonEmptyArray(_.propertyOf(user)('collabWorkspaces'))) {
    return [];
  }
  return models.Workspace.find({_id: { $in: user.collabWorkspaces }, isTrashed: false }, {permissions: 1}).lean().exec()
    .then((workspaces) => {
      return _.chain(workspaces)
        .filter((ws) => {
          return ws.permissions && ws.permissions.feedback === 'approver';
        })
        .pluck('_id')
        .value();
    });
}

// TODO update with new permissions structure
function getApproverWorkspaceIds(user) {
  if (!isNonEmptyObject(user)) {
    return [];
  }

  let { accountType, actingRole } = user;
  let criteria = { isTrashed: false };
  let isAdmin = accountType === 'A' && actingRole !== 'student';

  if (!isAdmin) {
    criteria.$or = [];
    criteria.$or.push({createdBy: user._id});
    criteria.$or.push({owner: user._id});

    if (accountType === 'P' && actingRole !== 'student') {
      if (mongooseUtils.isValidMongoId(user.organization)) {
        criteria.$or.push({organization: user.organization});
      }
    }
      return getModelIds('Workspace', criteria);
  }
}

function doesRecordExist(model, criteria) {
  if (!isNonEmptyString(model) || !isNonEmptyObject(criteria)) {
    return false;
  }
  return models[model].findOne(criteria).lean().exec()
    .then((record) => {
      return !isNil(record);
    });
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
module.exports.getProblemsByCategory = getProblemsByCategory;
module.exports.getAllChildCategories = getAllChildCategories;
module.exports.getRestrictedWorkspaceData = getRestrictedWorkspaceData;
module.exports.getApproverWorkspaceIds = getApproverWorkspaceIds;
module.exports.getResponseUsers = getResponseUsers;
module.exports.getUsersFromTeacherSections = getUsersFromTeacherSections;
module.exports.doesRecordExist = doesRecordExist;
module.exports.getCollabApproverWorkspaceIds = getCollabApproverWorkspaceIds;