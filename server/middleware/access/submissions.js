const utils = require('./utils');

module.exports.get = {};

const accessibleSubmissionsQuery = async function(user, ids) {
  try {
    const accountType = user.accountType;
    const actingRole = user.actingRole;

    let filter = {
      isTrashed: { $ne: true }
    };

    if (ids) {
      filter._id = {$in : ids};
    }


    // should students ever be getting submissions?
    // or should they be able to see submissions which have a response addressed to them?
    // or just any submissions that they are creator of?
    if (actingRole === 'student' || accountType === 'S') {
      //filter.createdBy = user.id;
      filter['creator.studentId'] = user._id;
      return filter;
    }
    // will only reach here if admins/pdadmins are in actingRole teacher

    if (accountType === 'A') {
      return filter;
    }

    const accessibleWorkspaceIds = await utils.getAccessibleWorkspaceIds(user);

    // everyone should have access to all submissions that belong to a workspace that they have access to
    filter.$or = [];
    filter.$or.push({workspaces : { $elemMatch: { $in: accessibleWorkspaceIds} }});

    //should have access to all submissions that you created
    // in case they are not in a workspace

    if (accountType === 'P') {
      // PDamins can get any submissions created by someone from their organization
      const userOrg = user.organization;

      //const userIds = await getOrgUsers(userOrg);
      const userIds = await utils.getModelIds('User', {organization: userOrg});
      userIds.push(user._id);

      filter.$or.push({createdBy : {$in : userIds}});
      return filter;
    }

    if (accountType === 'T') {
    // teachers can get any submissions where they are the primary teacher or in the teachers array
    // should teachers be able to get all submissions from organization?


      filter.$or.push({ createdBy : user._id });
      // filter.$or.push({ 'teacher.id': user.id });
      // filter.$or.push({ teachers : user.id });

      return filter;
    }

  }catch(err) {
    console.log('err asq', err);
  }
};

const canLoadSubmission = async function(user, id) {
  if (!user) {
    return;
  }

  const { accountType, actingRole } = user;

  if (accountType === 'S' || actingRole === 'student') {
    return false; // currently we are blocking students from getting submissions
  }

  if (accountType === 'A') {
    return true; // admins currently can get all submissions
  }

  // use accessibleSubmissions criteria to determine access for teachers/pdAdmins

  let criteria = await accessibleSubmissionsQuery(user, id);

  let accessibleIds = await utils.getModelIds('Submission', criteria);
  accessibleIds = accessibleIds.map(id => id.toString()); // map objectIds to strings to check for existence

    if (accessibleIds.includes(id)) {
      return true;
    }
    return false;
  };

module.exports.get.submissions = accessibleSubmissionsQuery;
module.exports.get.submission = canLoadSubmission;