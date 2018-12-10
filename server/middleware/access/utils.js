const models = require('../../datasource/schemas');
const _ = require('underscore');

const wsAuth =require('./workspaces');
const assignmentAuth = require('./assignments');
const apiUtils = require('../../datasource/api/utils');
const wsApi = require('../../datasource/api/workspaceApi');

//Returns an array of oIds
const getModelIds = async function(model, filter={}) {
  try {
    const records = await models[model].find(filter, {_id: 1});
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
  if (!user) {
    return [];
  }
  let sections = user.sections;

  if (!Array.isArray(sections)) {
    return [];
  }

  return sections.map((section) => {
    if (section.role === 'teacher') {
      return section.sectionId;
    }
  });
}

function getTeacherSectionsById(userId) {
  if (!userId) {
    return;
  }
  return getModelIds('Section', {teachers: userId});
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
};

const getStudentResponses = async function (user) {
  try {
    if (!user) {
      return;
    }

    let userId = user._id;

    let respones = await models.Response.find({recipient: userId}).lean().exec();

    return respones.map((response) => {
      return response.createdBy;
    });
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
    console.error(`Error getStudentUsers: ${err}`);
    console.trace();
  }
}

async function getPdAdminUsers(user) {
  try {
    if (!user) {
      return;
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
  }catch(err) {
    console.error(`Error getPdAdminUsers: ${err}`);
    console.trace();
  }
}
// teachers can also get all users in org, but may not be able to edit all
async function getTeacherUsers(user) {
  try {
    if (!user) {
      return;
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
  }catch(err) {
    console.error(`Error getTeacherUsers: ${err}`);
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

    let withCreatedBy = users.filter(user => !!user.createdBy);
    let creators = withCreatedBy.map(user => user.createdBy.toString());

    return _.uniq(creators);
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
    console.log('err', err);
  }
};

function getRestrictedWorkspaceData(user, requestedModel) {
  if (!apiUtils.isNonEmptyObject(user) || !apiUtils.isNonEmptyString(requestedModel)) {
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

  if (!apiUtils.isNonEmptyArray(collabWorkspaces)) {
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
      .lean().exec()
      .then((populatedWs) => {
        const [canLoad, specialPermissions] = wsAuth.get.workspace(user, populatedWs);

        const restrictedDataMap = wsApi.getRestrictedDataMap(user, specialPermissions, populatedWs);
        console.log('RDM', restrictedDataMap);

        // no restrictions
        if (!apiUtils.isNonEmptyObject(restrictedDataMap)) {
          return [];
        }

        // if the workspace does not have records of requested type, there is nothing to restrict
        const allRecords = populatedWs[requestedModel];
        if (!apiUtils.isNonEmptyArray(allRecords)) {
          return [];
        }

        // if this is undefined, means no restrictions
        // if empty array, means everything is restricted
        const allowedValues = _.propertyOf(restrictedDataMap)(requestedModel);
        if (_.isUndefined(allowedValues)) {
          return [];
        }
        let allowedIds;

        if (!apiUtils.isNullOrUndefined(allowedValues)) {
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
