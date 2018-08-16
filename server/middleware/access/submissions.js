const utils = require('./utils');
const wsAccess = require('./workspaces');
module.exports.get = {};

const accessibleSubmissionsQuery = async function(user, ids) {
  const accountType = user.accountType;
  const actingRole = user.actingRole;

  let filter = {
    isTrashed: false
  };

  if (ids) {
    filter._id = {$in : ids};
  }

  // students should never be getting submissions as of now
  // except for seeing responses??
  if (actingRole === 'student' || accountType === 'S') {
    //filter.createdBy = user.id;
    filter['creator.studentId'] = user._id;
    return filter;
  }
  // will only reach here if admins/pdadmins are in actingRole teacher
  if (accountType === 'A') {
    return filter;
  }


  const wsFilter = await wsAccess.get.workspaces(user, null);
  console.log('wsfilter', wsFilter);
  const accessibleWorkspaces = await utils.getModelIds('Workspace', wsFilter);
  console.log('access workspaces', accessibleWorkspaces);


  // should have access to all submissions that belong to a workspace that you have access to
  filter.$or = [];
  filter.$or.push({workspaces : { $elemMatch: { $in: accessibleWorkspaces} }});

  //should have access to all submissions that you created
  // in case they are not in a workspace

  filter.$or.push({createdBy: user._id});

  if (accountType === 'P') {
    console.log('IN P');
    // PDamins can get any submissions created by someone from their organization
    const userOrg = user.organization;
    console.log('user.org', userOrg);
    //const userIds = await getOrgUsers(userOrg);
    const userIds = await utils.getModelIds('Organization', {_id: userOrg});

    console.log('userIds', userIds);

    filter.$or.push({createdBy : {$in : userIds}});
    return filter;
  }

  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array
    // sub.teacher.id = user.id or sub.teachers includes teacher id

    filter.createdBy = user._id;
    filter['teacher.id'] = user.id;
    filter.teachers = user.id
    return filter;
  }
};

module.exports.get.submissions = accessibleSubmissionsQuery;