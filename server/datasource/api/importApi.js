/**
  * # Import API
  * @description This is the API for import based requests
*/

//REQUIRE MODULES
const logger = require('log4js').getLogger('server');

//REQUIRE FILES
const models = require('../schemas');
const userAuth = require('../../middleware/userAuth');
const utils    = require('../../middleware/requestHandler');
const workspaceApi = require('./workspaceApi');
const apiUtils = require('../api/utils');

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

/* jshint ignore:start */
const buildSubmissionSet = async function (submissions, user) {
  let submissionSet;
  if (!apiUtils.isNonEmptyArray(submissions)) {
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
  if (!apiUtils.isNullOrUndefined(teacher)) {
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
  if (apiUtils.isNonEmptyArray(submissionSet)) {
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
      sub.createdBy = user;
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

module.exports.post.import = postImport;
module.exports.buildSubmissionSet = buildSubmissionSet;
/* jshint ignore:end */