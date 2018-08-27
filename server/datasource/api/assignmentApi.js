/**
  * # Assignment API
  * @description This is the API for assignment based requests
  * @author Daniel Kelly
*/

var mongoose = require('mongoose'),
  express = require('express'),
  _ = require('underscore'),
  logger = require('log4js').getLogger('server'),
  models = require('../schemas'),
  auth = require('./auth'),
  userAuth = require('../../middleware/userAuth'),
  permissions = require('../../../common/permissions'),
  utils = require('../../middleware/requestHandler');

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

function accessibleAssignments(user) {
  if (!user) {
    return;
  }
  const accountType = user.accountType;
  const actingRole = user.actingRole;
  let filter = {
    isTrashed: false
  };

  if (accountType === 'S' || actingRole === 'student') {
    filter.students = user;
    return filter;
  }

  if (accountType === 'T') {
    filter.createdBy = user;
    return filter;
  }

  if (accountType === 'P') {
    filter.createdBy = user;
    return filter;
  }
}

const getAssignments = (req, res, next) => {
  const user = userAuth.requireUser(req);
  const criteria = accessibleAssignments(user);
  models.Assignment.find(criteria)
  .exec((err, assignments) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'assignments': assignments};
    utils.sendResponse(res, data);
  });
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

const getAssignment = (req, res, next) => {
  models.Assignment.findById(req.params.id)
  .exec((err, assignment) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'assignment': assignment};
    utils.sendResponse(res, data);
  });
};

/**
  * @public
  * @method postAssignment
  * @description __URL__: /api/assignments
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
*/

const postAssignment = (req, res, next) => {
  const user = userAuth.requireUser(req);
  // do we want to check if the user is allowed to create assignments?
  const assignment = new models.Assignment(req.body.assignment);
  assignment.createdBy = user;
  assignment.createDate = Date.now();
  assignment.save((err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'assignment': doc};
    utils.sendResponse(res, data);
  });
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
