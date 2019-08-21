/* eslint-disable no-use-before-define */
/**
  * # Assignment API
  * @description This is the API for assignment based requests
  * @author Daniel Kelly
*/

const logger = require('log4js').getLogger('server');
const _ = require('underscore');

const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const access = require('../../middleware/access/assignments');

const { areObjectIdsEqual, isValidMongoId } = require('../../utils/mongoose');

const { isNonEmptyArray, } = require('../../utils/objects');

const { answersToSubmissions} = require('./workspaceApi');

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

    const assignment = new models.Assignment(req.body.assignment);
    assignment.createdBy = user;
    assignment.createDate = Date.now();

    await assignment.save();

    let { doCreateLinkedWorkspaces, linkedWorkspaceCreationOptions } = req.body.assignment;
    let linkedWorkspaces;

    if (doCreateLinkedWorkspaces) {
      await assignment.populate('students').populate({ path: 'section', select: 'name'}).execPopulate();
      linkedWorkspaces = await generateLinkedWorkspacesFromAssignment(assignment, user, linkedWorkspaceCreationOptions);

      console.log({linkedWorkspaces});
      assignment.linkedWorkspaces = linkedWorkspaces.map(ws => ws._id);
      console.log({assignment});
      assignment.depopulate('students').depopulate('section');
      await assignment.save();
    }



    let data = { assignment };

    if (isNonEmptyArray(linkedWorkspaces)) {
      data.workspaces = linkedWorkspaces;
    }
    utils.sendResponse(res, data);

  }catch(err) {
    console.log({postAssignmentErr: err});
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

const putAssignment = (req, res, next) => {
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }
  // what check do we want to perform if the user can edit
  // if they created the assignment?
  models.Assignment.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // make the updates
    for(let field in req.body.assignment) {
      if((field !== '_id') && (field !== undefined)) {
        doc[field] = req.body.assignment[field];
      }
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
  try {
    if (!assignment) {
      return [];
    }
    // assignment will have students, section populated
    let { students, answers, section } = assignment;

    let { mode } = wsOptions;

    // if answers convert answers to submissions

    let submissionObjects = await answersToSubmissions(answers);

    // create a workspace for each student in assignment
    let workspaces = await Promise.all(students.map(async (student) => {
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
      }));

      let wsName = `${student.username}: ${assignment.name} (${section.name})`;

      return models.Workspace.create({
        name: wsName,
        owner: student._id,
        createdBy: reqUser._id,
        lastModifiedBy: reqUser._id,
        lastModifiedDate: Date.now(),
        mode: mode || 'private',
        submissions: submissionRecords,
        linkedAssignment: assignment._id,
        organization: reqUser.organization,

      });
    }));

    let { doCreateParentWs } = parentWsOptions;

    if ( doCreateParentWs ) {
      // create parent ws from linked workspaces

    }

    return workspaces;

  }catch(err) {
    console.log({generateLinkedWorkspacesFromAssignmentErr: err});
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
