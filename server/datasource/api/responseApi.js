/**
  * # Response API
  * @description This is the API for response requests
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.3
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');

//REQUIRE FILES
const utils    = require('../../middleware/requestHandler');
const userAuth = require('../../middleware/userAuth');
const models   = require('../schemas');
const wsAccess = require('../../middleware/access/workspaces');
const access = require('../../middleware/access/responses');
const accessUtils = require('../../middleware/access/utils');

const { isNonEmptyArray } = require('../../utils/objects');
const { isValidMongoId  } = require('../../utils/mongoose');

module.exports.get = {};
module.exports.post = {};
module.exports.put = {};

/**
  * @public
  * @method getResponse
  * @description __URL__: /api/responses/:id
  * @returns {Object} A 'named' response object
  * @throws {InternalError} Data retrieval failed
  */
 function getResponse(req, res, next) {
  let user = userAuth.requireUser(req);

    return models.Response.findById(req.params.id).lean().exec()
      .then((response) => {
        if (!response || response.isTrashed) {
          return utils.sendResponse(res, null);
        }

        return access.get.response(user, req.params.id)
          .then((canGet) => {
            if (!canGet) {
              return utils.sendError.NotAuthorizedError('You do not have permission to access this response.', res);
            }

        // only approvers should see the note field
        // for now just dont send back to students
        if (user.accountType === 'S' || user.actingRole === 'student') {
          delete response.note;
        }
        return utils.sendResponse(res, {response});
      });
  })
  .catch((err) => {
    console.error(`Error getResponse: ${err}`);
    return utils.sendError.InternalError(null, res);
  });
}

/**
  * @public
  * @method getResponses
  * @description __URL__: /api/responses
  * @see [buildCriteria](../../middleware/requestHandler.html)
  * @returns {Object} A 'named' array of response objects: according to specified criteria
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data retrieval failed
  * @throws {RestError} Something? went wrong
  */

function getResponses(req, res, next) {
  let user = userAuth.requireUser(req);

  let { ids, workspace, filterBy, isAdminActingPd } = req.query;
  return access.get.responses(user, ids, workspace, filterBy, isAdminActingPd)
  .then((criteria) => {
    models.Response.find(criteria).lean().exec()
      .then((responses) => {

        let data = {'response': responses};

        return utils.sendResponse(res, data );
      });
  })
  .catch((err) => {
    console.error(`Error get Responses: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  });

}

/**
  * @public
  * @method postResponse
  * @description __URL__: /api/responses
  * @throws {NotAuthorizedError} User has inadequate permissions
  * @throws {InternalError} Data saving failed
  * @throws {RestError} Something? went wrong
  */
function postResponse(req, res, next) {

  var user = userAuth.requireUser(req);
  var workspaceId = req.body.response.workspace;
  models.Workspace.findById(workspaceId).lean().populate('owner').populate('editors').populate('createdBy').exec(function(err, ws){
    if (err) {
      logger.error(err);
      return utils.sendError.InternalError(err, res);
    }
    if(wsAccess.canModify(user, ws, 'feedback')) {

      var response = new models.Response(req.body.response);
      response.createdBy = user;
      response.createDate = Date.now();

      response.save(function(err, doc) {
        if(err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }

        var data = {'response': doc};
        utils.sendResponse(res, data);
        next();
      });
    } else {
      logger.info("permission denied");
      res.send(403, "You don't have permission for this workspace");
    }
  });
}


function putResponse(req, res, next) {

  var user = userAuth.requireUser(req);

  if (!user) {
    return utils.sendError.InvalidCredentialsError('No user logged in!', res);
  }

  models.Response.findById(req.params.id,
    function (err, doc) {
      if(err) {
        logger.error(err);
        return utils.sendError.InternalError(err, res);
      }

      //TODO permissions check

      for(var field in req.body.response) {
        if((field !== '_id') && (field !== undefined)) {
          doc[field] = req.body.response[field];
        }
      }

      doc.save(function (err, response) {
        if (err) {
          logger.error(err);
          return utils.sendError.InternalError(err, res);
        }
        var data = {'response': response};
        utils.sendResponse(res, data);
        next();
      });
    }
  );
}

function getSubmitterThreads(user) {
  let userId = user._id;
  let userIdStr = user._id.toString();

  let responseIds = accessUtils.getModelIds('Response', {
    isTrashed: false,
    status: 'approved',
    responseType: 'mentor',
    recipient: user._id
  });
  return responseIds
    .then((responseIds) => {
      if (!isNonEmptyArray(responseIds)) {
        return [];
      }
      return models.Workspace.aggregate([
        {
          $match: {
            responses: {
              $elemMatch: {
                $in: responseIds
              }
            }
          }
        },
        {
          $lookup: {
            from: 'responses',
            localField: 'responses',
            foreignField: '_id',
            as: 'responses'
          }
        },
        {
          $lookup: {
            from: 'submissions',
            localField: 'submissions',
            foreignField: '_id',
            as: 'submissions'
          }
        },
        {
          $project: {
            workspaceId: "$_id", wsName: "$name",
            submissions: { $filter: { input: '$submissions', as: 's', cond: { $eq: ['$$s.creator.studentId', userIdStr] } } },

            responses: {
              $filter: {
                input: '$responses', as: 'r', cond: {
                  $in: ['$$r._id', responseIds]
                }
              }
            }


          }
        },
        {
          $project: {
            workspaceId: 1, wsName: 1, responses: 1,
            submissions: 1,

            unreadResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.wasReadByRecipient', false] } } },


          }
        },
        { $unwind: "$responses" },
        { $sort: { 'responses.createDate': -1 } },
        { $group: { _id: '$workspaceId', responses: { $push: "$responses" }, wsName: { $first: '$wsName' }, unreadReplies: { $first: '$unreadResponses' }, submissions: { $first: "$submissions" } } },
        {
          $project: {
            workspaceId: "$_id", wsName: 1, responses: 1, _id: 0, threadType: 'submitter',
            submissions: 1,
            hasUnreadReply: { $cond: [{ $eq: [{ $size: "$unreadReplies" }, 0] }, false, true] },
            latestReply: { $arrayElemAt: ["$responses", 0] }
          }
        },
        { $limit: 25 },
        { $sort: { hasUnreadReply: 1, 'latestReply.createDate': 1 } }

      ]);    })
    .catch((err) => {
      console.error(`Error getSubmitterThreads: ${err}`);
    });

}

function getMentorThreads(user) {
  let userId = user._id;
  let userIdStr = user._id.toString();

  let ids = accessUtils.getModelIds('Response', {
    isTrashed: false,
    $or: [
      {
        responseType: 'mentor',
        createdBy: user._id,
      },
      {
        responseType: 'approver',
        recipient: user._id,
        status: 'approved'
      }
    ]

  });
  return ids
    .then((responseIds) => {
      if (!isNonEmptyArray(responseIds)) {
        return [];
      }
      return models.Workspace.aggregate([
        {
          $match: {
            responses: {
              $elemMatch: {
                $in: responseIds
              }
            }
          }
        },
        {
          $lookup: {
            from: 'responses',
            localField: 'responses',
            foreignField: '_id',
            as: 'responses'
          }
        },
        {
          $lookup: {
            from: 'submissions',
            localField: 'submissions',
            foreignField: '_id',
            as: 'submissions'
          }
        },
        {$project: {
          _id: 1, name: 1,
          responses: {
            $filter: {
              input: '$responses', as: 'r', cond: {
                $in: ['$$r._id', responseIds]
              }
            }
          },
          submissions: {
            $filter: {
              input: '$submissions', as: 's', cond: {
                $ne: ['$$s.creator.studentId', userIdStr]
              }
            }
          }
        }},
        { $unwind: '$submissions' },
        {
          $project: {
            workspaceId: '$_id', name: 1,
            student: { $ifNull: ['$submissions.creator.studentId', '$submissions.creator.username'] },
            submissions: 1,
            responses: 1,
          },
        },
        { $group: { _id: { workspaceId: '$workspaceId', student: '$student' }, name: {$first: '$name'}, submissions: { $push: '$submissions' }, submissionIds: {$push: '$submissions._id'}, responses: { $first: '$responses' } } },
        {
          $project: {
            submissionIds: 1, submissions: 1, _id: 1, name: 1,
            responses: {
              $filter: {
                input: '$responses', as: 'r', cond: {$in: ['$$r.submission', '$submissionIds']}
              }
            },
          }
        },
        { $match: { responses: { $ne: [] } } },
        {$unwind: '$responses'},
        { $sort: { 'responses.createDate': -1 } },
        { $group: { _id: { workspaceId: '$_id.workspaceId', student: '$_id.student' }, responses: { $push: "$responses" }, name: { $first: '$name' }, submissions: { $first: "$submissions" } } },
        {$unwind: '$submissions'},
        { $sort: { 'submissions.createDate': -1 } },
        { $group: { _id: { workspaceId: '$_id.workspaceId', student: '$_id.student' }, responses: { $first: "$responses" }, name: { $first: '$name' }, submissions: { $push: "$submissions" } } },

        {$project: {
          _id: 1, responses: 1, name: 1, submissions: 1, latestReply: { $arrayElemAt: ['$responses', 0] }, latestRevision: { $arrayElemAt: ['$submissions', 0] },
          toUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.recipient', userId] } } },
          fromUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.createdBy', userId] } } }

        }},
        {$project: {
          _id: 1, responses: 1, name: 1, submissions: 1, latestReply: 1, latestRevision: 1,
          toUserResponses: 1,
          fromUserResponses: 1,
          hasUnread: { $gte: [{ $size: { $filter: { input: '$toUserResponses', as: 'r', cond: { $eq: ['$$r.wasReadByRecipient', false] } } } }, 1]},
          hasPending: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'pendingApproval'] } } } }, 1]},
          hasNeedsRevisions: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'needsRevisions'] } } } }, 1]},
          hasDraft: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'draft'] } } } }, 1]},
          hasUnmentored: { $gte: [{ $size: { $filter: { input: '$submissions', as: 's', cond: { $eq: ['$$s.responses', []] } } } }, 1]}
        }},

        {$limit: 25},
        {$sort: {
          hasDraft: 1, hasNeedsRevisions: 1, hasUnmentored: 1, hasUnread: 1, hasPending: 1, 'latestReply.createDate': 1, 'latestRevision.createDate': 1
        }},
        {$project: {
          uniqueIdentifier: '$_id', _id: 0, responses: 1, submissions: 1, workspaceName: '$name', threadType: 'mentor',
        }}
      ]);
    })
    .catch((err) => {
      console.error(`Error getMentorThreads: ${err}`);
    });
  }

function getApproverThreads(user, asSuperAdmin) {
  let userId = user._id;
  let userIdStr = user._id.toString();

  let isAdmin = user.accountType === 'A' && user.actingRole !== 'student';
  let isPdAdmin = user.accountType === 'P' && user.actingRole !== 'student';

  let wsCriteria;

  if (asSuperAdmin && isAdmin) {
    wsCriteria = {
      isTrashed: false,
      responses: {$ne: []}
    };
  }
  wsCriteria = {
    isTrashed: false,
    responses: {$ne: []},
    $or: [
      { createdBy: userId },
      { owner: userId },
      { permissions: {$elemMatch: { $and: [{user: userId}, {feedback: 'approver'}]}}}
    ]
  };

  if (isAdmin || isPdAdmin ) {
    if (isValidMongoId(user.organization)) {
      wsCriteria.$or.push({
        organization: user.organization
      });
    }
  }
  // let ids = accessUtils.getModelIds('Response', {
  //   isTrashed: false,
  //   $or: [
  //     approvedBy: userId,

  //   ]

  // });

  return models.Workspace.aggregate([
    { $match: wsCriteria, },
    {
      $lookup: {
        from: 'responses',
        localField: 'responses',
        foreignField: '_id',
        as: 'responses'
      }
    },
    {
      $lookup: {
        from: 'submissions',
        localField: 'submissions',
        foreignField: '_id',
        as: 'submissions'
      }
    },
    {$project: {
      _id: 1, name: 1,
      submissions: {
        $filter: {
          input: '$submissions', as: 's', cond: {
            $ne: ['$$s.creator.studentId', userIdStr]
          }
        }
      },
      responses: {
        $filter: {
          input: '$responses', as: 'r', cond: {
            $and: [
              { $eq: ['$$r.isTrashed', false] },
              { $or: [
                { $eq: ['$$r.approvedBy', userId] },
                { $and: [
                  {$eq: ['$$r.responseType', 'mentor']},
                  {$ne: ['$$r.createdBy', userId]},
                  {$ne: ['$$r.recipient', userId]}
                ]},
                { $and: [
                  {$eq: ['$$r.responseType', 'approver']},
                  {$ne: ['$$r.recipient', userId]}
                ]}
              ]},
            ]
          }
        }
      }
    }},
    {$match: {
      responses: {$ne: []}
    }},
    { $unwind: '$submissions' },
        {
          $project: {
            _id: 1, name: 1,
            student: { $ifNull: ['$submissions.creator.studentId', '$submissions.creator.username'] },
            submissions: 1,
            responses: 1,
          },
        },
        { $group: { _id: { workspaceId: '$_id', student: '$student' }, name: {$first: '$name'}, submissions: { $push: '$submissions' }, submissionIds: {$push: '$submissions._id'}, responses: { $first: '$responses' } } },
    {$project: {
      _id: 1, name: 1, submissions: 1,
      responses: {$filter: {
        input: '$responses', as: 'r', cond: {
          $in: ['$$r.submission', '$submissionIds']
        }
      }}
    }},
    {$project: {
      _id: 1, name: 1, submissions: 1, responses: 1,
      mentorResponses: {
        $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.responseType', 'mentor'] } }
      },
    }},
    {$unwind: '$mentorResponses'},
    {$group: {
      _id: '$_id', name: {$first: '$name'}, submissions: {$first: '$submissions'}, responses: {$first: '$responses'},
      mentors: {$addToSet: '$mentorResponses.createdBy'}, mentorResponses: {$push: '$mentorResponses'}
    }},
    {$unwind: '$mentors'},
    {$group: {
      _id: {workspaceId: '$_id.workspaceId', student: '$_id.student', mentor: '$mentors'}, name: {$first: '$name'}, submissions: {$first: '$submissions'}, responses: {$first: '$responses'}, mentorResponses: {$first: '$mentorResponses'}
    }},
    {$unwind: '$responses'},
    { $sort: { 'responses.createDate': -1 } },
    { $group: { _id: '$_id', responses: { $push: "$responses" }, name: { $first: '$name' }, submissions: { $first: "$submissions" }, mentorResponses: {$first: '$mentorResponses'} } },

    {$project: {
      _id: 1, name: 1, submissions: 1, responses: 1, mentorResponses: 1, latestReply: {$arrayElemAt: ['$responses', 0]},
      toUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.recipient', userId] } } },
      fromUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.createdBy', userId] } } }
    }},
    {$project: {
      _id: 1, responses: 1, name: 1, submissions: 1, latestReply: 1,
      toUserResponses: 1,
      fromUserResponses: 1,
      hasUnread: { $gte: [{ $size: { $filter: { input: '$toUserResponses', as: 'r', cond: { $eq: ['$$r.wasReadByRecipient', false] } } } }, 1]},
      hasPending: { $gte: [{ $size: { $filter: { input: '$mentorResponses', as: 'r', cond: { $eq: ['$$r.status', 'pendingApproval'] } } } }, 1]},
      hasNeedsRevisions: { $gte: [{ $size: { $filter: { input: '$mentorResponses', as: 'r', cond: { $eq: ['$$r.status', 'needsRevisions'] } } } }, 1]},
      hasDraft: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'draft'] } } } }, 1]},
    }},
    {$limit: 25},
    {$sort: {
      hasDraft: 1, hasPending: 1, hasUnread: 1, hasNeedsRevisions: 1,
    }},
    {$project: {
      uniqueIdentifier: '$_id', _id: 0, responses: 1, submissions: 1, workspaceName: '$name', threadType: 'approver'
    }}
  ]);
}

async function getResponseThreads(req, res, next) {
  try {
    let user = userAuth.requireUser(req);
    let threadType = req.params.threadType;
    let asSuperAdmin = req.query.asSuperAdmin;
    let threads = [];
    if (threadType === 'submitter') {
      threads = await getSubmitterThreads(user);
    }
    if (threadType === 'mentor') {
      threads = await getMentorThreads(user);
    }
    if (threadType === 'approver') {
      threads = await getApproverThreads(user, asSuperAdmin);
    }
    if (threadType === 'all') {
      let [ submitter, mentor, approver ] = await Promise.all([
        getSubmitterThreads(user),
        getMentorThreads(user),
        getApproverThreads(user, asSuperAdmin)
      ]);

      if (isNonEmptyArray(submitter)) {
        submitter.forEach((thread) => {
          threads.push(thread);
        });
      }

      if (isNonEmptyArray(mentor)) {
        mentor.forEach((thread) => {
          threads.push(thread);
        });
      }
      if (isNonEmptyArray(approver)) {
       approver.forEach((thread) => {
          threads.push(thread);
        });
      }
    }
    return utils.sendResponse(res, {
      responseThreads: threads
    });
  }catch(err) {
    console.error(`Error getResponseThreads: ${err}`);
    console.trace();
    return utils.sendError.InternalError(null, res);
  }
}


module.exports.get.response   = getResponse;
module.exports.get.responses = getResponses;
module.exports.post.response  = postResponse;
module.exports.put.response   = putResponse;
module.exports.get.responseThreads = getResponseThreads;