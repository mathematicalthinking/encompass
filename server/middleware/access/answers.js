/* eslint-disable complexity */
const utils = require('./utils');
const apiUtils = require('../../datasource/api/utils');
const submissionsAccess = require('./submissions');
const _ = require('underscore');
const models = require('../../datasource/schemas');
module.exports.get = {};

const accessibleAnswersQuery = async function(user, ids, filterBy, searchBy, isTrashedOnly) {
  try {
    if (!apiUtils.isNonEmptyObject(user)) {
      return {};
    }
    const { accountType, actingRole } = user;

    if (isTrashedOnly) {
      if (accountType === 'A') {
        return { isTrashed: true };
      }
      return;
    }

    const isStudent = accountType === 'S' || actingRole === 'student';

    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };
    if (apiUtils.isNonEmptyArray(ids)) {
      filter.$and.push({ _id: { $in : ids } });
    } else if(apiUtils.isValidMongoId(ids)) {
      filter.$and.push({ _id: ids });
    }
    if (apiUtils.isNonEmptyObject(filterBy)) {
      if (filterBy.teacher && accountType !== 'T') {
        let [assignments, sections] = await Promise.all([
          utils.getTeacherAssignments(filterBy.teacher),
         utils.getTeacherSectionsById(filterBy.teacher)
        ]);
        let assignmentFilter;
        let sectionFilter;

        if (apiUtils.isNonEmptyArray(assignments)) {
          assignmentFilter = {assignment: {$in: assignments}};

        }
        if (apiUtils.isNonEmptyArray(sections)) {
          sectionFilter = {section: {$in: sections}};
        }
        let orFilter;
        if (!sectionFilter && !assignmentFilter) {
          // filtering by teacher and teacher has no sections or assignments
          return null;
        }
        if (sectionFilter || assignmentFilter) {
          if (_.isArray(filterBy.$or)) {
            orFilter = filterBy.$or;
          } else {
            filterBy.$or = [];
            orFilter = filterBy.$or;
          }
          if (assignmentFilter) {
            orFilter.push(assignmentFilter);
          }
          if (sectionFilter) {
            orFilter.push(sectionFilter);
          }
        }
      }
      if (filterBy.teacher) {
        delete filterBy.teacher;
      }
      filter.$and.push(filterBy);
    }
    if (apiUtils.isNonEmptyObject(searchBy)) {
      filter.$and.push(searchBy);
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
    // removes falsy values
    const compacted = _.compact(answerIds);

    if (apiUtils.isNonEmptyArray(compacted)) {
      orFilter.$or.push({_id: {$in: compacted}});
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
      utils.getTeacherAssignments(user._id),
      utils.getTeacherSectionsById(user._id)
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
    if (filterBy.teacher) {
      delete filterBy.teacher;
    }
    filter.$and.push(orFilter);
    return filter;
  }
  }catch(err) {
    console.log('err', err);
  }

};

module.exports.get.answers = accessibleAnswersQuery;