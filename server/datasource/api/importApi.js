/**
  * # Import API
  * @description This is the API for import based requests
*/

//REQUIRE MODULES
const logger = require('log4js').getLogger('server');
const _ = require('underscore');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils    = require('../../middleware/requestHandler');
const workspaceApi = require('./workspaceApi');

const objectUtils = require('../../utils/objects');
const { isNil, isNonEmptyArray, isNonEmptyObject } = objectUtils;

const { isValidMongoId, areObjectIdsEqual } = require('../../utils/mongoose');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method postImport
  * @description __URL__: /api/import
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */

const buildSubmissionSet = async function (submissions, user) {
  let submissionSet;
  if (!isNonEmptyArray(submissions)) {
    return;
  }
  const submissionIds = submissions.map((sub) => {
    return sub._id;
  });

  var matchBy = {
    "_id": {
      $in: submissionIds
    },
    $or: [{
        "workspaces": null
      }, //and that aren't already in a workspace | @todo: might be in another user's workspace you know...
      {
        "workspaces": {
          $size: 0
        }
      },
      {
        "workspaces": {
          $exists: true
        }
      },
    ],
    "isTrashed": {
      $in: [null, false]
    } //submissions that are not deleted
  };

  let teacher = submissions[0].teacher;
  let teacherId;
  if (!isNil(teacher)) {
    teacherId = teacher.id;
    matchBy["teacher.id"] = teacherId;
  }

  var sortBy = {
    "createDate": 1
  };
  var groupBy = {
    _id: {
      group: "$clazz.sectionId",
      //pub: "$publication.publicationId",
      puzzle: "$publication.puzzle.problemId",
      name: "$clazz.name",
      title: "$publication.puzzle.title"
    },
    pdSet: {
      $first: "$pdSet"
    },
    firstSubmissionDate: {
      $first: "$createDate"
    },
    lastSubmissionDate: {
      $last: "$createDate"
    },
    submissions: {
      $addToSet: "$_id"
    },
  };
  var include = {
    submissionSet: {
      submissions: "$submissions",
      description: {
        pdSource: "$pdSet",
        firstSubmissionDate: "$firstSubmissionDate",
        lastSubmissionDate: "$lastSubmissionDate",
        puzzle: {
          title: "$_id.title"
        },
        group: {
          name: "$_id.name"
        },
        // publication: {
        //   pubId: "$_id.pub"
        // }
      },
      criteria: {
        pdSet: "$pdSet",
        group: {
          groupId: "$_id.group"
        },
        puzzle: {
          puzzleId: "$_id.puzzle"
        }
      }
    }
  };
  try {
    submissionSet = await models.Submission.aggregate([{
        $match: matchBy
      },
      {
        $sort: sortBy
      },
      {
        $group: groupBy
      },
      {
        $project: include
      }
    ]);
  } catch (err) {
    console.error(`Error buildSubmissionSet: ${err}`);
  }
  if (isNonEmptyArray(submissionSet)) {
    return submissionSet[0].submissionSet;
  }
  return null;
};

/* jshint ignore:start */
const postImport = async function(req, res, next) {
  let submissionSet;
  const user = userAuth.requireUser(req);
  // Add permission checks here
  const subData = JSON.parse(req.body.subs);
  const doCreateWorkspace = req.body.doCreateWorkspace;
  const workspaceMode = JSON.parse(req.body.workspaceMode);
  const workspaceOwner = JSON.parse(req.body.workspaceOwner);
  const folderSetId = JSON.parse(req.body.folderSet);
  const requestedName = JSON.parse(req.body.requestedName);

  let submissions;

  try {
    submissions = await Promise.all(subData.map((obj) => {
      let sub = new models.Submission(obj);

      let creatorId;

      let encUserId = _.propertyOf(obj)(['creator', 'studentId']);

      // set creator of submission as the enc user who created it if applicable
      // else set as importer

      if (isValidMongoId(encUserId)) {
        creatorId = encUserId;
      } else {
        creatorId = user._id;
      }
      sub.createdBy = creatorId;
      sub.createDate = Date.now();

      return sub.save();
    }));

    const submissionIds = submissions.map((sub) => {
      return sub._id;
    });

    // if user does not want to automatically create workspace
    if (!doCreateWorkspace) {
      const data = {'submissionIds': submissionIds};
      return utils.sendResponse(res, data);
    }
// else create workspace from newly created submissions

// submissionSet is used to determine if a workspace already exists for
// a given set of submissions
submissionSet = await buildSubmissionSet(submissions, user);

let name;

if (requestedName) {
  name = requestedName;
} else {
  name = workspaceApi.nameWorkspace(submissionSet, user, false);
}

const ownerOrg = await userAuth.getUserOrg(workspaceOwner);

let workspace = new models.Workspace({
  mode: workspaceMode,
  name: name,
  owner: workspaceOwner,
  submissionSet: submissionSet,
  submissions: submissionIds,
  createdBy: user,
  lastModifiedBy: user,
  organization: ownerOrg,
});
let ws = await workspace.save();
let folderHash = { folderSetId: folderSetId };
let wsInfo = { newWsId: ws._id, newWsOwner: ws._owner };
let newFolderSet = await workspaceApi.newFolderStructure(user, wsInfo, folderHash); // eslint-disable-line no-unused-vars
//sending back workspace and submissionID for redirect
const data = { 'workspace': ws };
return utils.sendResponse(res, data);

} catch(err) {
    logger.error(err);
    return utils.sendError.InternalError(err, res);
  }
};

const convertVmtRoomsToAnswers = function(rooms, currentUser) {
  if(!isNonEmptyArray(rooms)) {
    return [];
  }

  let answerPromises = rooms.map((room) => {
    // set brief summary to 'See VMT Replayer'
    // explanation is null
    // add each member of room to studentNames

    // activity? not currentl receiving from vpt api
    // facilitator?
    /*
    {
      _id,
      image: string url,
      name: string,
      members: array of populated users
    }
    */

   let members = room.members || [];
    let facilitators = members
      .filter(m => m.role === 'facilitator')
      .map(f => _.propertyOf(f)(['user', 'username'] || 'Unknown User'));

    let participants = members
      .filter(m => m.role === 'participant')
      .map(p => _.propertyOf(p)(['user', 'username'] || 'Unknown User'));

    let activityName = _.propertyOf(room)(['activity', 'name']) || null;

    let partialRoom = {
      roomId: room._id,
      imageUrl: room.image,
      roomName: room.name,
      facilitators: facilitators,
      participants: participants,
      activityName,
    };
    let description = `VMT Replayer for room "${room.name}"`;

    if (activityName) {
      description += ` from activity "${activityName}"`;
    }

    let answer = new models.Answer({
      createdBy: currentUser,
      createDate: Date.now(), // or vmt date of activity or creation?
      answer: description,
      explanation: '',
      vmtRoomInfo: partialRoom, // currently only contains _id, image, members
      studentNames: participants,
      problem: room.problem._id,
    });

    return answer.save();
  });

  return Promise.all(answerPromises);
};

const convertVmtAnswersToSubmissions = function(answers, roomsWithProblems) {
  if (!isNonEmptyArray(answers)) {
    return [];
  }
  let submissionPromises = answers.map((answer) => {

      //const teachers = {};
      const clazz = {};
      const publication = {
        publicationId: null,
        puzzle: {}
      };
      const creator = {};
      const teacher = {};


      // const student = answer.createdBy;

      // const studentNames = answer.studentNames;
      const section = answer.section;
      let problem;

      const roomWithProb = _.find(roomsWithProblems, (room) => {
        return areObjectIdsEqual(room.problem._id, answer.problem);
      });

      if (roomWithProb) {
        problem = roomWithProb.problem;
      }
      if (problem) {
        publication.puzzle.title = problem.title;
        publication.puzzle.problemId = problem._id;

      }
      // answers should always have createdBy...

      let teachers;
      let primaryTeacher;

      if (section) {
        clazz.sectionId = section._id;
        clazz.name = section.name;
        teachers = section.teachers;
        if (isNonEmptyArray(teachers)) {
          primaryTeacher = teachers[0];
          teacher.id = primaryTeacher;
        }
      }
      let sub = new models.Submission({
        clazz: clazz,
        creator: creator,
        teacher: teacher,
        publication: publication,
        answer: answer._id,
        vmtRoomInfo: answer.vmtRoomInfo,
        createDate: Date.now(),
        createdBy: answer.createdBy,
      });

      return sub.save();

  });

  return Promise.all(submissionPromises);
};

const createDefaultProblemsFromVmtRooms = function(user, rooms) {
  if (!isNonEmptyArray(rooms) || !isNonEmptyObject(user)) {
    return [];
  }
  let roomsWithProblem = rooms.map(async (room) => {

    let { image, instructions, name } = room;

    let text = instructions || 'Unedited VMT import';

    let problem = await models.Problem.create({
      createdBy: user._id,
      lastModifiedBy: user._id,
      lastModifiedDate: Date.now(),
      createDate: Date.now(),
      title: name,
      text,
      privacySetting: 'M',
      organization: user.organization || undefined,
      status: 'approved',
      contexts: ['VMT'],
    });

    room.problem = problem;
    return room;
  });
  return Promise.all(roomsWithProblem);
};

const postVmtImportRequests = async (req, res, next) => {
  try {
    const user = userAuth.requireUser(req);
    let importRequest = req.body.vmtImportRequest;

    let { vmtRooms, doCreateWorkspace, workspaceMode, workspaceOwner, workspaceName, folderSet } = req.body.vmtImportRequest;

    let roomsWithProblems = await createDefaultProblemsFromVmtRooms(user, vmtRooms);

    let answerRecords = await convertVmtRoomsToAnswers(vmtRooms, user);
    let importRecord = new models.VmtImportRequest(importRequest);

    if (!doCreateWorkspace) {
      importRecord.createdAnswers = answerRecords.map(a => a._id);
      return utils.sendResponse(res, {
        vmtImportRequest: importRecord
      });
    }

    let submissions = await convertVmtAnswersToSubmissions(answerRecords, roomsWithProblems);
    let workspace = new models.Workspace({
      mode: workspaceMode,
      owner: workspaceOwner,
      name: workspaceName,
      submissions: submissions.map(s => s._id),
      createdBy: user,
      organization: user.organization,
      lastModifiedBy: user,
      folderSet,
    });

    let savedWorkspace = await workspace.save();
    importRecord.createdWorkspace = savedWorkspace._id;

    if (isValidMongoId(folderSet)) {
      // folder set is id
      let folderHash = { folderSetId: folderSet };
      let wsInfo = { newWsId: savedWorkspace._id, newWsOwner: savedWorkspace._owner };
      await workspaceApi.newFolderStructure(user, wsInfo, folderHash);

      // need updated workspace with folder structure
      savedWorkspace = await models.Workspace.findById(savedWorkspace._id).lean();
    }

    let data = {
      vmtImportRequest: importRecord,
      workspaces: [savedWorkspace]
    };
    return utils.sendResponse(res, data);
  }catch(err) {
    console.error(`Error postVmtImportRequests: ${err}`);
    return utils.sendError.InternalError(null, res);
  }

};

module.exports.post.import = postImport;
module.exports.post.vmtImportRequests = postVmtImportRequests;
module.exports.buildSubmissionSet = buildSubmissionSet;
