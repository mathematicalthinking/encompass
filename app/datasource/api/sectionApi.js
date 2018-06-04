/**
  * # Section API
  * @description This is the API for section based requests
  * @author Michael McVeigh
*/

var mongoose = require('mongoose'),
  restify = require('restify'),
  _ = require('underscore'),
  logger = require('log4js').getLogger('server'),
  models = require('../schemas'),
  auth = require('./auth'),
  permissions = require('../../../common/permissions'),
  utils = require('./requestHandler'),
  errors = require('restify-errors');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getSections
  * @description __URL__: /api/sections
  * @returns {Object} An array of section objects
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
*/

const getSections = (req, res, next) => {
  const criteria = utils.buildCriteria(req);
  const user = auth.requireUser(req);
  models.Section.find(criteria)
  .exec((err, sections) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'sections': sections};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method getSection
  * @description __URL__: /api/section/:id
  * @returns {Object} An section object
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
*/

const getSection = (req, res, next) => {
  models.Section.findById(req.params.id)
  .exec((err, section) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'section': section};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method postSection
  * @description __URL__: /api/sections
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
*/

const postSection = (req, res, next) => {
  const user = auth.requireUser(req);
  // do we want to check if the user is allowed to create sections?
  const section = new models.Section(req.body.section);
  section.createdBy = user;
  section.createdDate = Date.now();
  section.save((err, doc) => {
    if (err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    const data = {'section': doc};
    utils.sendResponse(res, data);
    next();
  });
};

/**
  * @public
  * @method putSection
  * @description __URL__: /api/sections/:id
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/

const putSection = (req, res, next) => {
  const user = auth.requireUser(req);
  // what check do we want to perform if the user can edit
  // if they created the section?
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
    }
    // make the updates
    for(let field in req.body.section) {
      if((field !== '_id') && (field !== undefined)) {
        // overwrite primitive types or add to array
        if (field === 'teachers' || field === 'students' || field === 'problems') {
          doc[field].push(req.body.section[field]);
        }
        else {
          doc[field] = req.body.section[field];
        }
      }
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};

/**
  * @public
  * @method addTeacher
  * @description __URL__: /api/sections/addTeacher/:id
  * @body {teacherId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const addTeacher = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
      return;
    }
    if (doc.teachers.indexOf(req.body.teacherId) === -1){
      doc.teachers = doc.teachers.concat([req.body.teacherId]);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
        return;
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};

/**
  * @public
  * @method removeTeacher
  * @description __URL__: /api/sections/removeTeacher/:id
  * @body {teacherId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const removeTeacher = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
      return;
    }
    // only remove teacher if they exist
    if (doc.teachers.indexOf(req.body.teacherId) !== -1) {
      doc.teachers.splice(doc.teachers.indexOf(req.body.teacherId), 1);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
        return
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method addStudent
  * @description __URL__: /api/sections/addStudent/:id
  * @body {studentName: String}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const addStudent = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
      return;
    }
    // only add the student if they're not already in the section
    if (doc.students.indexOf(req.body.studentName) === -1){
      doc.students = doc.students.concat([req.body.studentName]);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
        return;
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method removeStudent
  * @description __URL__: /api/sections/removeStudent/:id
  * @body {studentName: String}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const removeStudent = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
      return;
    }
    // ensure the student is in this section before removing
    if (doc.students.indexOf(req.body.studentName) !== -1) {
      doc.students.splice(doc.students.indexOf(req.body.studentName), 1);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
        return;
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method addProblem
  * @description __URL__: /api/sections/addProblem/:id
  * @body {problemId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const addProblem = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
      return;
    }
    // only add unique problems to the section
    if (doc.problems.indexOf(req.body.problemId) === -1){
      doc.problems = doc.problems.concat([req.body.problemId]);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
        return;
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};
/**
  * @public
  * @method removeProblem
  * @description __URL__: /api/sections/removeProblem:id
  * @body {problemId: ObjectId}
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data update failed
  * @throws {RestError} Something? went wrong
*/
const removeProblem = (req, res, next) => {
  const user = auth.requireUser(req);
  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      utils.sendError(new errors.InternalError(err.message), res);
      return;
    }
    // only remove problem if its in this section
    if (doc.problems.indexOf(req.body.problemId) !== -1){
      doc.problems.splice(doc.problems.indexOf(req.body.problemId), 1);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        utils.sendError(new errors.InternalError(err.message), res);
        return;
      }
      const data = {'section': section};
      utils.sendResponse(res, data);
    });
  });
};

module.exports.get.sections = getSections;
module.exports.get.section = getSection;
module.exports.post.section = postSection;
module.exports.put.section = putSection;
module.exports.put.section.addTeacher = addTeacher;
module.exports.put.section.removeTeacher = removeTeacher;
module.exports.put.section.addStudent = addStudent;
module.exports.put.section.removeStudent = removeStudent;
module.exports.put.section.addProblem = addProblem;
module.exports.put.section.removeProblem = removeProblem;
