/* eslint-disable complexity */
/* eslint-disable no-use-before-define */
/**
  * # Assignment API
  * @description This is the API for assignment based requests
  * @author Daniel Kelly
*/
const moment = require('moment');

const logger = require('log4js').getLogger('server');
const _ = require('underscore');

const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const access = require('../../middleware/access/assignments');

const { areObjectIdsEqual, isValidMongoId, auditObjectIdField } = require('../../utils/mongoose');

const { isNonEmptyArray, isNonEmptyString } = require('../../utils/objects');

const { answersToSubmissions } = require('./workspaceApi');
const { generateParentWorkspace } = require('./parentWorkspaceApi');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};


/**
  * @public
  * @method getAssignments
  * @description __URL__: /api/assignments
  * @returns {Object} An array of assignment objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
*/


const getAssignments = async function(req, res, next) {
  try {
    const user = userAuth.requireUser(req);
    let criteria;

    if (req.query.problem) {
      criteria = req.query;
      const requestedAssignments = await models.Assignment.findOne(criteria).exec();
      let data = {
        assignments: requestedAssignments
      };
      return utils.sendResponse(res, data);
    }

    criteria = await access.get.assignments(user, req.query.ids, req.query.filterBy);

    let doFilterAnswers = user.accountType === 'S' || user.actingRole === 'student';

    let assignments;

    if (doFilterAnswers) {
      assignments = await models.Assignment.find(criteria).populate('answers').lean().exec();
    } else {
      assignments = await models.Assignment.find(criteria).lean().exec();
    }

    if (doFilterAnswers) {
      // only send back student's own answers with assignment
      assignments.forEach((assignment) => {
        let answers = assignment.answers || [];

        assignment.answers = _.chain(answers)
          .filter((answer) => {
            return areObjectIdsEqual(answer.createdBy, user._id);
          })
          .pluck('_id').value();
      });
    }

    const data = {'assignments': assignments};
    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getAssignments: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }

};

/**
  * @public
  * @method getAssignment
  * @description __URL__: /api/assignment/:id
  * @returns {Object} An assignment object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
*/

const getAssignment = async function(req, res, next) {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
  }
  let id = req.params.id;

  let assignment = await models.Assignment.findById(id).populate('answers', 'createdBy createDate').populate('problem').populate('section').populate('students').exec();
  // record not found in db or is trashed
  if (!assignment || assignment.isTrashed) {
    return utils.sendResponse(res, null);
  }

  let canLoadAssignment = await access.get.assignment(user, id);

  if (!canLoadAssignment) { // user does not have permission to access assignment
    return utils.sendError.NotAuthorizedError('You do not have permission.', res);
  }

  let data = {};

  let isStudent = user.accountType === 'S' || user.actingRole === 'student';

  if (isStudent) {
    // only send back student's own answers
    assignment.answers = assignment.answers.filter((answer) => {
      return areObjectIdsEqual(answer.createdBy, user._id);
    });
  }

  let metadata = {};

  // put all students in assignment report even if not
  // submitted yet

  if (!isStudent && Array.isArray(assignment.students)) {
    assignment.students.forEach((student) => {
      if (!metadata[student._id]) {
        metadata[student._id] = {
          count: 0,
          latestRevision: null,
        };
      }
    });

    assignment.answers.forEach((answer) => {
      let creatorId = answer.createdBy;
      let latestRev = metadata[creatorId].latestRevision;

      metadata[creatorId].count += 1;
      let newDate = answer.createDate;

      if (latestRev === null || (newDate > latestRev)) {
        metadata[creatorId].latestRevision = newDate;
      }

    });

    assignment.reportDetails = metadata;
  }

  if (isNonEmptyArray(assignment.students)) {
    data.users = assignment.students;
  }

  if (isValidMongoId(_.propertyOf(assignment)(['problem', '_id']))) {
    data.problems = [ assignment.problem ];
  }

  if (isValidMongoId(_.propertyOf(assignment)(['section', '_id']))) {
    data.sections = [ assignment.section ];
  }

  assignment.depopulate('answers');
  assignment.depopulate('problem');
  assignment.depopulate('section');
  assignment.depopulate('students');

  if (!isStudent) {
    data.workspaces = [];
    if (isNonEmptyArray(assignment.linkedWorkspaces)) {
      await assignment.populate('linkedWorkspaces').execPopulate();
      data.workspaces = assignment.linkedWorkspaces;

      assignment.depopulate('linkedWorkspaces');
    }
    if (assignment.parentWorkspace) {
      await assignment.populate('parentWorkspace').execPopulate();
      if (isNonEmptyArray(data.workspaces)) {
        data.workspaces.push(assignment.parentWorkspace);
      } else {
        data.workspaces = assignment.parentWorkspace;
      }
      assignment.depopulate('parentWorkspace');
    }

  }

  let jsonAssn = assignment.toObject();

  if (!isStudent && metadata) {
    jsonAssn.reportDetails = metadata;
  }

  data.assignment = jsonAssn;

  return utils.sendResponse(res, data);

};

/**
  * @public
  * @method postAssignment
  * @description __URL__: /api/assignments
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
*/

const postAssignment = async (req, res, next) => {
  try {
    const user = userAuth.requireUser(req);
    // do we want to check if the user is allowed to create assignments?

    let { assignedDate, dueDate, name, problem, linkedWorkspacesRequest, parentWorkspaceRequest  } = req.body.assignment;

    // assignedDate, dueDate should be isoDate strings

    let assignedMoment = moment(assignedDate);

    if (!assignedMoment.isValid()) {
      // invalid assigned Date
      // not required to have assigned date on creation
      delete req.body.assignment.assignedDate;
      delete req.body.assignment.dueDate;
    }

    let dueMoment = moment(dueDate);

    if (!dueMoment.isValid()) {
      delete req.body.assignment.dueDate;
    }

    if (dueMoment < assignedMoment) {
      // due date before assigned date
      // set due data as undefined
      // can be edited later
      delete req.body.assignment.dueDate;
    }

    if (!isNonEmptyString(name)) {
      // generate default name from problem  and assigned date
      if (!isValidMongoId(problem)) {
        // missing problem, return error
        return utils.sendError.InvalidContentError(
          'You must provide a valid problemId to create an assignment',
          res
        );
      }
      let foundProblem = await models.Problem.findById(problem, {
        title: 1
      }).lean();
      if (!foundProblem || foundProblem.isTrashed) {
        return utils.sendError.InvalidContentError(
          'Could not find the provided problem',
          res
        );
      }
      let formattedDate =
        typeof assignedDate === 'string' ?
          moment(assignedDate).format('MMM Do YYYY') :
          moment(new Date()).format('MMM Do YYYY');
      req.body.assignment.name = `${foundProblem.title} / ${formattedDate} `;
    }

    const assignment = new models.Assignment(req.body.assignment);
    assignment.createdBy = user;
    assignment.createDate = Date.now();
    assignment.lastModifiedDate = Date.now();
    assignment.lastModifiedBy = user;

    await assignment.save();

    let doCreateLinkedWorkspaces = _.propertyOf(linkedWorkspacesRequest)('doCreate') === true;
    let doCreateParentWorkspace = _.propertyOf(parentWorkspaceRequest)('doCreate') === true;

    let linkedWorkspaces;
    let parentWorkspace;
    let parentWorkspaceError;

    if (doCreateLinkedWorkspaces) {
      // create a linked workspace for each student in assignment
      await assignment
        .populate('students')
        .populate('answers')
        .populate({ path: 'section', select: 'name' })
        .execPopulate();

        let [ err, linkedWorkspaces ] = await generateLinkedWorkspacesFromAssignment(
        assignment,
        user,
        linkedWorkspacesRequest
      );

      if (err) {
        assignment.linkedWorkspacesRequest.error = err;
      } else {
        if (isNonEmptyArray(linkedWorkspaces)) {
          let linkedWorkspacesIds = linkedWorkspaces.map(ws => ws._id);

          assignment.linkedWorkspaces = linkedWorkspacesIds;
          assignment.linkedWorkspacesRequest.createdWorkspaces = linkedWorkspacesIds;

          if (doCreateParentWorkspace) {
            let { name, doAutoUpdateFromChildren } = parentWorkspaceRequest;

            if (typeof doAutoUpdateFromChildren !== 'boolean') {
              doAutoUpdateFromChildren = true;
            }
            // linked assignment?

            let parentWsConfig = {
              childWorkspaces: linkedWorkspacesIds,
              createdBy: user,
              owner: user,
              organization: user.organization,
              name: name || `Parent Workspace: ${assignment.name}`,
              mode: 'private',
              doAutoUpdateFromChildren,
              linkedAssignment: assignment._id,
            };
            [ parentWorkspaceError, parentWorkspace ] = await generateParentWorkspace(parentWsConfig);

            if (parentWorkspaceError) {
              assignment.parentWorkspaceRequest.error = parentWorkspaceError;
            }

            if (parentWorkspace) {
              assignment.parentWorkspace = parentWorkspace._id;
              assignment.parentWorkspaceRequest.createdWorkspace = parentWorkspace._id;
            }
          }
        }
      }
      assignment.depopulate('students').depopulate('section').depopulate('answers');

      // so future assignment put requests do not default to having doCreate=true
      if (doCreateLinkedWorkspaces) {
        assignment.linkedWorkspacesRequest.doCreate = false;
      }

      if (doCreateParentWorkspace) {
        assignment.parentWorkspaceRequest.doCreate = false;
      }

      await assignment.save();
    }

    let assignmentJson = assignment.toObject();

    let data = { assignment: assignmentJson };


    if (isNonEmptyArray(linkedWorkspaces)) {
      data.workspaces = linkedWorkspaces;
    }
    if (parentWorkspace) {
      if (data.workspaces) {
        data.workspaces.push(parentWorkspace);
      } else {
        data.workspaces = [ parentWorkspace ];
      }
    }
    utils.sendResponse(res, data);
  } catch (err) {
    logger.error('postAssnErr: ', err);
    return utils.sendError.InternalError(err, res);
  }
};

/**
  * @public
  * @method putAssignment
  * @description __URL__: /api/assignments/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const putAssignment = async (req, res, next) => {
  try {
    const user = userAuth.requireUser(req);
    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }

    let assignment = await models.Assignment.findById(req.params.id).exec();

    if (!assignment || assignment.isTrashed) {
      return utils.sendResponse(res, null);
    }

    // currently only support 1 request at a time for already existing assn
    let { linkedWorkspacesRequest, parentWorkspaceRequest } = req.body.assignment;

    let doCreateLinkedWorkspaces = _.propertyOf(linkedWorkspacesRequest)('doCreate') === true;
    let doCreateParentWorkspace = _.propertyOf(parentWorkspaceRequest)('doCreate') === true;

    let linkedWorkspacesErr;
    let linkedWorkspaces;

    if (doCreateLinkedWorkspaces) {
      // create a linked workspace for each student in assignment
      assignment.linkedWorkspacesRequest.doCreate = false;
      let data = {};

      await assignment
        .populate('students')
        .populate({ path: 'section', select: 'name' })
        .populate('answers')
        .execPopulate();
      [
        linkedWorkspacesErr,
        linkedWorkspaces
      ] = await generateLinkedWorkspacesFromAssignment(
        assignment,
        user,
        linkedWorkspacesRequest
      );

      if (linkedWorkspacesErr) {
        assignment.linkedWorkspacesRequest.error = linkedWorkspacesErr;
      } else if (isNonEmptyArray(linkedWorkspaces)) {
        data.workspaces = linkedWorkspaces;

        let linkedWorkspacesIds = linkedWorkspaces.map(ws => ws._id);
        assignment.linkedWorkspaces = assignment.linkedWorkspaces.concat(
          linkedWorkspacesIds
        );
        assignment.linkedWorkspacesRequest.createdWorkspaces = linkedWorkspacesIds;
      }
      assignment
      .depopulate('students')
      .depopulate('section')
      .depopulate('answers');

      await assignment.save();

      data.assignment = assignment;

      return utils.sendResponse(res, data);
    }

    if (doCreateParentWorkspace) {
      assignment.linkedWorkspacesRequest.doCreate = false;
      // reset to false so future put requests do not default to true;
      let data = {};
      assignment.parentWorkspaceRequest = {};
      if (assignment.parentWorkspace) {
        assignment.parentWorkspaceRequest.error = 'Assignment already has a parent workspace';
        assignment.lastModifiedBy = user;
        assignment.lastModifiedDate = Date.now();

        await assignment.save();

        data.assignment = assignment;
        return utils.sendResponse(res, data);
      }
      let { name, doAutoUpdateFromChildren, childWorkspaces } = parentWorkspaceRequest;

      if (typeof doAutoUpdateFromChildren !== 'boolean') {
        doAutoUpdateFromChildren = true;
      }
      // linked assignment?

      let parentWsConfig = {
        childWorkspaces, // ids
        createdBy: user,
        owner: user,
        organization: user.organization,
        name: name || `Parent Workspace: ${assignment.name}`,
        mode: 'private',
        doAutoUpdateFromChildren,
        linkedAssignment: assignment._id,
      };
      let [ parentWorkspaceError, parentWorkspace ] = await generateParentWorkspace(parentWsConfig);

      if (parentWorkspaceError) {
        assignment.parentWorkspaceRequest.error = parentWorkspaceError;
      }

      if (parentWorkspace) {
        assignment.parentWorkspace = parentWorkspace._id;
        assignment.parentWorkspaceRequest.createdWorkspace = parentWorkspace._id;
        data.workspaces = [ parentWorkspace ];
      }

      assignment.lastModifiedBy = user;
      assignment.lastModifiedDate = Date.now();

      await assignment.save();
      data.assignment = assignment;

      return utils.sendResponse(res, data);

    }

    let oldSection = assignment.section;
    let newSection = req.body.assignment.section;

    let didSectionChange = auditObjectIdField(oldSection, newSection) !== 0;

    // make the updates
    for(let field in req.body.assignment) {
      if((field !== '_id') && (field !== undefined)) {
        assignment[field] = req.body.assignment[field];
      }
    }

    if (didSectionChange) {
      // section was updated
      // set assignment students to section's students
      // set assignment teachers to section's teachers
      // should the creator of assignment be in the teachers array?
      // teacher's array is not being displayed right now.. should it?

      await assignment.populate('section').execPopulate();
      assignment.students = assignment.section.students;
      assignment.teachers = assignment.section.teachers;
      assignment.depopulate('section');
    }

    assignment.lastModifiedBy = user;
    assignment.lastModifiedDate = Date.now();

    await assignment.save();

    if (didSectionChange) {
      // pull assignment from old section
      models.Section.findByIdAndUpdate(oldSection, {
        $pull: { $assignments: assignment._id },
      }).exec();

      let { students = [], teachers = [] } = assignment;
      let combinedStudentsTeachers = students.concat(teachers);

      if (isNonEmptyArray(combinedStudentsTeachers)) {
        // pull assignment from students that are NOT from new section
        models.User.updateMany(
          { _id: { $nin: combinedStudentsTeachers }, assignments: assignment._id },
          { $pull: { assignments: assignment._id } }
        ).exec();
      }

      // what if linked workspaces or parent ws have already been created?
      // should we prevent user from changing section?
      // if not, need to trash all of them
    }

    const data = { assignment };
    utils.sendResponse(res, data);

  }catch(err) {
    logger.error(err);
    return utils.sendError.InternalError(err, res);
}
};

/**
  * @public
  * @method addTeacher
  * @description __URL__: /api/assignments/addTeacher/:id
  * @body {teacherId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const addTeacher = (req, res, next) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Assignment.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if (doc.teachers.indexOf(req.body.teacherId) === -1){
      doc.teachers = doc.teachers.concat([req.body.teacherId]);
    }
    doc.save((err, assignment) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'assignment': assignment};
      utils.sendResponse(res, data);
    });
  });
};

/**
  * @public
  * @method removeTeacher
  * @description __URL__: /api/assignments/removeTeacher/:id
  * @body {teacherId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const removeTeacher = (req, res, next) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Assignment.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only remove teacher if they exist
    if (doc.teachers.indexOf(req.body.teacherId) !== -1) {
      doc.teachers.splice(doc.teachers.indexOf(req.body.teacherId), 1);
    }
    doc.save((err, assignment) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'assignment': assignment};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method addStudent
  * @description __URL__: /api/assignments/addStudent/:id
  * @body {studentName: String}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const addStudent = (req, res, next) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Assignment.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only add the student if they're not already in the assignment
    if (doc.students.indexOf(req.body.studentId) === -1){
      doc.students = doc.students.concat([req.body.studentId]);
    }
    doc.save((err, assignment) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'assignment': assignment};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method removeStudent
  * @description __URL__: /api/assignments/removeStudent/:id
  * @body {studentName: String}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const removeStudent = (req, res, next) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Assignment.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // ensure the student is in this assignment before removing
    if (doc.students.indexOf(req.body.studentName) !== -1) {
      doc.students.splice(doc.students.indexOf(req.body.studentName), 1);
    }
    doc.save((err, assignment) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'assignment': assignment};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method addProblem
  * @description __URL__: /api/assignments/addProblem/:id
  * @body {problemId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const addProblem = (req, res, next) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Assignment.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only add unique problems to the assignment
    if (doc.problems.indexOf(req.body.problemId) === -1){
      doc.problems = doc.problems.concat([req.body.problemId]);
    }
    doc.save((err, assignment) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'assignment': assignment};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method removeProblem
  * @description __URL__: /api/assignments/removeProblem:id
  * @body {problemId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const removeProblem = (req, res, next) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Assignment.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only remove problem if its in this assignment
    if (doc.problems.indexOf(req.body.problemId) !== -1){
      doc.problems.splice(doc.problems.indexOf(req.body.problemId), 1);
    }
    doc.save((err, assignment) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }
      const data = {'assignment': assignment};
      utils.sendResponse(res, data);
    });
  });
};


const generateLinkedWorkspacesFromAssignment = async (assignment, reqUser, wsOptions = {}, parentWsOptions = {}) => {
  let results = {
    createdWorkspaces: [],
    error: null,
  };

  try {
    if (!assignment) {
      return ['Missing assignment', null];
    }
    // assignment will have students, section populated
    let { students, answers, section } = assignment;

    let { mode, name, doAllowSubmissionUpdates } = wsOptions;

    await assignment.populate({path: 'linkedWorkspaces', select: 'owner'}).execPopulate();

    let studentsWithoutWorkspaces = _.reject(students, (student) => {
      return _.find(assignment.linkedWorkspaces, (ws) => {
        return areObjectIdsEqual(ws.owner, student._id);
      });
    });

    await assignment.depopulate('linkedWorkspaces');

    // logger.info('students without workspaces', studentsWithoutWorkspaces.map(s => s.username));
    if (!isNonEmptyArray(studentsWithoutWorkspaces)) {
      // should send message detailing this
      // logger.info('No students without a linked workspace');
      return ['All students already own a linked workspace', null ];
    }
    // if answers convert answers to submissions

    let submissionObjects = await answersToSubmissions(answers);

    // create a workspace for each student in assignment
    let workspaces = await Promise.all(studentsWithoutWorkspaces.map(async (student) => {
      // create submission record copies
      let submissionRecords = await Promise.all( submissionObjects.map((obj) => {
        let sub = new models.Submission(obj);
        let creatorId;

        let encUserId = _.propertyOf(obj)(['creator', 'studentId']);

        // set creator of submission as the enc user who created it if applicable
        // else set as importer

        if (isValidMongoId(encUserId)) {
          creatorId = encUserId;
        } else {
          creatorId = reqUser._id;
        }
        sub.createdBy = creatorId;
        sub.createDate = Date.now();
        sub.lastModifiedDate = Date.now();
        sub.lastModifiedBy = creatorId;
        return sub.save();
      }));

      let nameSuffix = name ? name : `${assignment.name} (${section.name})`;

      let wsName = `${student.username}: ${nameSuffix}`;

      return models.Workspace.create({
        name: wsName,
        owner: student._id,
        createdBy: reqUser._id,
        lastModifiedBy: reqUser._id,
        lastModifiedDate: Date.now(),
        mode: mode || 'private',
        submissions: submissionRecords.map(s => s._id),
        linkedAssignment: assignment._id,
        organization: reqUser.organization,
        doAllowSubmissionUpdates: typeof doAllowSubmissionUpdates === 'boolean' ? doAllowSubmissionUpdates : true,

      });
    }));

    let { doCreateParentWs } = parentWsOptions;

    if ( doCreateParentWs ) {
      // create parent ws from linked workspaces

    }

    results.createdWorkspaces = workspaces;
    return [ null, workspaces ];

  }catch(err) {
    console.log({generateLinkedWorkspacesFromAssignmentErr: err});
    return [ err, null ];
  }
};

module.exports.get.assignments = getAssignments;
module.exports.get.assignment = getAssignment;
module.exports.post.assignment = postAssignment;
module.exports.put.assignment = putAssignment;
module.exports.put.assignment.addTeacher = addTeacher;
module.exports.put.assignment.removeTeacher = removeTeacher;
module.exports.put.assignment.addStudent = addStudent;
module.exports.put.assignment.removeStudent = removeStudent;
module.exports.put.assignment.addProblem = addProblem;
module.exports.put.assignment.removeProblem = removeProblem;
