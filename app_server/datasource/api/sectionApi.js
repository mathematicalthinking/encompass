/**
  * # Section API
  * @description This is the API for section based requests
  * @author Michael McVeigh
*/
const _ = require('underscore');

const logger = require('log4js').getLogger('server');
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils = require('../../middleware/requestHandler');
const access = require('../../middleware/access/sections');

const { isNonEmptyArray, } = require('../../utils/objects');

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

// function accessibleSections(user) {
//   return {
//     $or: [
//       { createdBy: user },
//       { teachers: { $in : [user] } },
//       { students: { $in : [user] } },
//       {organization: user.organization}
//     ],
//     isTrashed: false
//   };
// }

const getSections = (req, res, next) => {
  const user = userAuth.requireUser(req);
  let ids = req.query.ids;

  return access.get.sections(user, ids)
  .then((criteria) => {
    return models.Section.find(criteria).lean().exec();
  })
  .then((sections) => {
    const data = {'sections': sections};
    utils.sendResponse(res, data);
  })
  .catch((err) => {
    return utils.sendError.InternalError(err, res);
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

const getSection = async function(req, res, next) {
  try {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('You must be logged in.', res);
    }

    let id = req.params.id;

    let section = await models.Section.findById(id);

    // record not found in db
    if (!section || section.isTrashed) {
      return utils.sendResponse(res, null);
    }

    let canLoadSection = await access.get.section(user, id);

    // user does not have permission to access section
    if (!canLoadSection) {
      return utils.sendError.NotAuthorizedError('You do not have permission.', res);
    }

    // user has permission; send back record
    const data = {
      section
    };

    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error getSection: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
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

  // return utils.sendError.ValidationError('There is already an existing public problem with that title.', 'title', res);
  const user = userAuth.requireUser(req);
  // do we want to check if the user is allowed to create sections?
  const section = new models.Section(req.body.section);
  section.createdBy = user;
  section.createDate = Date.now();
  section.save((err, doc) => {
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    const data = {'section': doc};
    utils.sendResponse(res, data);
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

const putSection = async (req, res, next) => {
  try {
    const user = userAuth.requireUser(req);

    if (!user) {
      return utils.sendError.InvalidCredentialsError('No user logged in!', res);
    }
    let section = await models.Section.findById(req.params.id).exec();

    // ids coming from put request are strings
    // ids from database record are objects
    // convert db record ids to strings for easy comparison

    let originalStudentIds = section.students || [];
    let newStudentIds = req.body.section.students || [];

    let originalStringIds = originalStudentIds.map(id => id.toString());

    let addedStudents = _.difference(newStudentIds, originalStringIds);
    let removedStudents = _.difference(originalStringIds, newStudentIds);

    let originalTeacherIds = section.teachers || [];
    let newTeacherIds = req.body.section.teachers || [];

    let originalTeacherStringIds = originalTeacherIds.map(id => id.toString());

    let addedTeachers = _.difference(newTeacherIds, originalTeacherStringIds);
    let removedTeachers = _.difference(originalTeacherStringIds, newTeacherIds);

    //TODO: permissions

    for(let field in req.body.section) {
      if((field !== '_id') && (field !== undefined)) {
        section[field] = req.body.section[field];
      }
    }

    let savedSection = await section.save();

    let sectionAssignments = savedSection.assignments;

    if (isNonEmptyArray(removedStudents)) {

      let updateHash = { $pull: { sections: { sectionId: savedSection._id, role: 'student'} } };

      if (isNonEmptyArray(sectionAssignments)) {
        // remove assignments from user's assignments array
        updateHash.$pullAll = {
          assignments: sectionAssignments
        };
      }
      models.User.updateMany({_id: {$in: removedStudents}}, updateHash).exec();
    }

    if (isNonEmptyArray(addedStudents)) {
      let updateHash = { $addToSet: { 'sections': { sectionId: savedSection._id, role: 'student'} } };

      if (isNonEmptyArray(sectionAssignments)) {
        updateHash = { $addToSet: { 'sections': { sectionId: savedSection._id, role: 'student'}, assignments: {$each: sectionAssignments} } };

        models.Assignment.updateMany({_id: { $in: sectionAssignments}}, { $addToSet: { students: { $each: addedStudents} } }).exec();

      }
      models.User.updateMany({_id: {$in: addedStudents}}, updateHash).exec();
    }

    if (isNonEmptyArray(removedTeachers)) {
      models.User.updateMany({_id: {$in: removedTeachers}}, { $pull: { 'sections': { sectionId: savedSection._id, role: 'teacher'} } }).exec();
    }

    if (isNonEmptyArray(addedTeachers)) {
      models.User.updateMany({_id: {$in: addedTeachers}}, { $addToSet: { 'sections': { sectionId: savedSection._id, role: 'teacher'} } }).exec();
    }
    const data = {'section': section};
    utils.sendResponse(res, data);

  }catch(err) {
    console.error(`Error put section: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
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
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if (doc.teachers.indexOf(req.body.teacherId) === -1){
      doc.teachers = doc.teachers.concat([req.body.teacherId]);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
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
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only remove teacher if they exist
    if (doc.teachers.indexOf(req.body.teacherId) !== -1) {
      doc.teachers.splice(doc.teachers.indexOf(req.body.teacherId), 1);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
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
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only add the student if they're not already in the section
    if (doc.students.indexOf(req.body.studentId) === -1){
      doc.students = doc.students.concat([req.body.studentId]);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
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
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // ensure the student is in this section before removing
    if (doc.students.indexOf(req.body.studentName) !== -1) {
      doc.students.splice(doc.students.indexOf(req.body.studentName), 1);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
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
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only add unique problems to the section
    if (doc.problems.indexOf(req.body.problemId) === -1){
      doc.problems = doc.problems.concat([req.body.problemId]);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
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
  const user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Section.findById(req.params.id, (err, doc) => {
    if(err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    // only remove problem if its in this section
    if (doc.problems.indexOf(req.body.problemId) !== -1){
      doc.problems.splice(doc.problems.indexOf(req.body.problemId), 1);
    }
    doc.save((err, section) => {
      if (err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
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
