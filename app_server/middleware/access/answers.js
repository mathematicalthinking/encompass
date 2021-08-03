/* eslint-disable complexity */
const _ = require('underscore');

const models = require('../../datasource/schemas');

const utils = require('./utils');
const mongooseUtils = require('../../utils/mongoose');

const submissionsAccess = require('./submissions');

const objectUtils = require('../../utils/objects');
const { isNonEmptyObject, isNonEmptyArray, isNonEmptyString } = objectUtils;

module.exports.get = {};

const accessibleAnswersQuery = async function(user, ids, filterBy, searchBy) {
  try {
    if (!isNonEmptyObject(user)) {
      return {};
    }
    const { accountType, actingRole } = user;

    let filter = {
      $and: [
        { isTrashed: false }
      ]
    };

    if (isNonEmptyObject(filterBy)) {
      const { isTrashedOnly } = filterBy;
      if ( isTrashedOnly === true || isTrashedOnly === "true") {
        if (accountType === 'A') {
          filter = {
            $and: [
              { isTrashed: true }
            ]
          };

        }
      }
      delete filterBy.isTrashedOnly;

    }
    let doIncludeOldPows = false;

    const isStudent = accountType === 'S' || actingRole === 'student';



    if (isNonEmptyArray(ids)) {
      filter.$and.push({ _id: { $in : ids } });
    } else if(mongooseUtils.isValidMongoId(ids)) {
      filter.$and.push({ _id: ids });
    }

    if (isNonEmptyObject(filterBy)) {
      if (filterBy.isVmtOnly === 'true' || filterBy.isVmtOnly === true) {
        filter.$and.push({
          'vmtRoomInfo.roomId': {$ne: null}
        });
      }
      delete filterBy.isVmtOnly;

      if (isNonEmptyString(filterBy.vmtSearchText)) {
        let $or = [];
        let $and = [{
          'vmtRoomInfo.roomId': {$ne: null}
        }];
        let replaced = filterBy.vmtSearchText.replace(/\s+/g, "");
        let regex = new RegExp(replaced, 'i');

        $or.push({'vmtRoomInfo.roomName': regex});
        $or.push({'vmtRoomInfo.activityName': regex});
        $or.push({'vmtRoomInfo.participants': regex});
        $or.push({'vmtRoomInfo.facilitators': regex});

        $and.push({$or});
        filter.$and.push({$and});
        delete filterBy.vmtSearchText;

      }

      if (filterBy.teacher && accountType !== 'T') {
        let [assignments, sections] = await Promise.all([
          utils.getTeacherAssignments(filterBy.teacher),
         utils.getTeacherSectionsById(filterBy.teacher)
        ]);
        let assignmentFilter;
        let sectionFilter;

        if (isNonEmptyArray(assignments)) {
          assignmentFilter = {assignment: {$in: assignments}};

        }
        if (isNonEmptyArray(sections)) {
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

      if (filterBy.doIncludeOldPows === "true" || filterBy.doIncludeOldPows === true) {
        doIncludeOldPows = true;
        delete filterBy.doIncludeOldPows;
      }
      filter.$and.push(filterBy);
    }
    if (isNonEmptyObject(searchBy)) {
      filter.$and.push(searchBy);
    }

    if (accountType === 'A' && !isStudent) {
      return filter;
    }

    const orFilter = { $or: [] };
    orFilter.$or.push({ createdBy: user._id });

    if (doIncludeOldPows) {
      let publicProblemIds = await utils.getModelIds('Problem', {
        isTrashed: false,
        privacySetting: 'E',
      });

      if (isNonEmptyArray(publicProblemIds)) {
        orFilter.$or.push({ problem: {$in: publicProblemIds }, createdBy: '5bb4c600379d310929989c7e'});
      }
    }

    // everyone needs to be able to access answers that correspond with a submission they have access to
    const submissionCriteria = await submissionsAccess.get.submissions(user, null);
    const subsWithAnswers = await models.Submission.find(submissionCriteria, {answer: 1}).lean().exec();
    const answerIds = _.map(subsWithAnswers, sub => sub.answer);
    // removes falsy values
    const compacted = _.compact(answerIds);

    if (isNonEmptyArray(compacted)) {
      orFilter.$or.push({_id: {$in: compacted}});
    }

    if (isStudent) {
      filter.$and.push(orFilter);
      return filter;
    }

  // PdAdmins with acting role 'teacher' can get all answers tied to their org
  if (accountType === 'P') {
    const userOrg = user.organization;
    const userIds = await utils.getModelIds('User', {organization: userOrg, _id: {$ne: "5bb4c600379d310929989c7e"}});
    orFilter.$or.push( {createdBy : {$in : userIds} });
    filter.$and.push(orFilter);

    return filter;
  }
  // Teachers with acting role 'teacher' can get all answers tied to their assignments or sections
  if (accountType === 'T') {
    // only answers from either a teacher's assignments or from a section where they are in the teachers array

    const [ ownAssignmentIds, ownSections ] = await Promise.all([
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

    filter.$and.push(orFilter);
    return filter;
  }
  }catch(err) {
    console.log('err', err);
  }

};

module.exports.get.answers = accessibleAnswersQuery;