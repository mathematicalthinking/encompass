/* jshint ignore:start */
//REQUIRE MODULES
const _ = require('underscore');
//const logger = require('log4js').getLogger('server');

//REQUIRE FILES
const models = require('../datasource/schemas');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

async function getOrgUsers(orgId) {
  try {
    const orgMembers = await models.User.find({organization: orgId}, {_id: 1});
    return orgMembers.map(obj => obj._id);
  }catch(err) {
    console.log('error getting orgusers', err);
  }
}

async function getTeacherAssignments(userId) {
  try {
    const ownAssignmentIds = await models.Assignment.find({createdBy: userId}, {_id: 1});
    return ownAssignmentIds.map(obj => obj._id);
  }catch(err) {
    console.log('error getting teacher assignments', err);
  }
}

const accessibleAnswersQuery = async function(user, ids) {
  const accountType = user.accountType;
  const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };

  if (ids) {
    filter._id = {$in : ids};
  }

  if (actingRole === 'student' || accountType === 'S') {
    filter.createdBy = user.id;
    return filter;
  }
  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }

  if (accountType === 'P') {
    // only answers tied to organization
    //get users from org and then ch
    const userOrg = user.organization;
    const userIds = await getOrgUsers(userOrg);
    console.log('userIds', userIds);

    filter.createdBy = {$in : userIds};
    return filter;
  }

  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    const ownSections = user.sections.map((section) => {
      if (section.role === 'teacher') {
        return section.sectionId;
      }
     });
     const ownAssignmentIds = await getTeacherAssignments(user.id);
     filter.assignment = { $in: ownAssignmentIds };

    filter.section = { $in: ownSections };
    return filter;
  }
};

const canLoadWorkspace = function(user, ws) {
  console.log('ws.editors', ws.editors);
  const accountType = user.accountType;

  if (accountType === 'S' || user.actingRole === 'student') {
    return false;
  }
  if (accountType === 'A') {
    return true;
  }

  const ownerOrg = ws.owner.organization.toString();
  const userOrg = user.organization.toString();

  if (accountType === 'P') {
    if (ownerOrg === userOrg) {
      return true;
    }
  }
  const wsId = ws._id.toString();
  const userId = user._id.toString();


  const isOwner = userId === wsId;

  const wsEditors = ws.editors.map(ws => ws._id.toString());
  const isEditor = wsEditors.includes(userId);
  console.log('isEditor', isEditor);
  const isPublic = ws.mode === 'public';

  return isOwner || isEditor || isPublic;


};

module.exports.get.answers = accessibleAnswersQuery;
module.exports.get.workspace = canLoadWorkspace;
/* jshint ignore:end */