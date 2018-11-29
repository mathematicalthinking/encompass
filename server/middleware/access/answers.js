const utils = require('./utils');
const apiUtils = require('../../datasource/api/utils');
const submissionsAccess = require('./submissions');
const _ = require('underscore');
const models = require('../../datasource/schemas');
module.exports.get = {};

const accessibleAnswersQuery = async function(user, ids) {
  try {
    if (!apiUtils.isNonEmptyObject(user)) {
      return {};
    }

    const { accountType, actingRole } = user;

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };

    if (apiUtils.isNonEmptyArray(ids)) {
      filter.$and.push({ _id: { $in : ids } });
    } else if(!apiUtils.isNullOrUndefined(ids)) {
      filter.$and.push({ _id: ids });
    }

    if (accountType === 'A' && !isStudent) {
      return filter;
    }
    const orFilter = { $or: [] };
    orFilter.$or.push({ createdBy: user._id });

    // everyone needs to be able to access answers that correspond with a submission they have access to
    const submissionCriteria = await submissionsAccess.get.submissions(user, null);
    const subsWithAnswers = await models.Submission.find(submissionCriteria, {answer: 1}).lean().exec();
    const answerIds = _.map(subsWithAnswers, sub => sub.answer);

    if (apiUtils.isNonEmptyArray(answerIds)) {
      orFilter.$or.push({_id: {$in: answerIds}});
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

  // PdAdmins with acting role 'teacher' can get all answers tied to their org
  if (accountType === 'P') {
    const userOrg = user.organization;
    const userIds = await utils.getModelIds('User', {organization: userOrg});
    orFilter.$or.push( {createdBy : {$in : userIds} });
    filter.$and.push(orFilter);

    return filter;
  }
  // Teachers with acting role 'teacher' can get all answers tied to their assignments or sections
  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    // const ownSections = await utils.getTeacherSections(user);

    // const ownAssignmentIds = await utils.getModelIds('Assignment', {createdBy: user._id});

    const [ ownSections, ownAssignmentIds ] = await Promise.all([
      utils.getTeacherSections(user),
      utils.getModelIds('Assignment', {createdBy: user._id})
    ]);

    let areValidSections = _.isArray(ownSections) && !_.isEmpty(ownSections);
    let areValidAssignments = _.isArray(ownAssignmentIds) && !_.isEmpty(ownAssignmentIds);

    if (areValidAssignments || areValidSections) {
      if (areValidAssignments) {
        orFilter.$or.push({ assignment : { $in: ownAssignmentIds } });
      }
      if (areValidSections) {
        orFilter.$or.push({ section: { $in: ownSections} });
      }
    }
    filter.$and.push(orFilter);
    return filter;
  }
  }catch(err) {
    console.log('err', err);
  }

};

module.exports.get.answers = accessibleAnswersQuery;