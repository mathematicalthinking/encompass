/**
  * # Response API
  * @description This is the API for response requests
  * @author Amir Tahvildaran <amir@mathforum.org>
  * @since 1.0.3
  */

//REQUIRE MODULES
const logger   = require('log4js').getLogger('server');
const _ = require('underscore');

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

function getSubmitterThreads(user, limit, skip) {
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
        return [
          { paginatedResults: [] },
          { totalCount: [] }
        ];
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
        { $group: { _id: '$workspaceId', responses: { $push: "$responses" }, wsName: { $first: '$wsName' }, unreadReplies: { $first: '$unreadResponses' }, mentors: {$addToSet: '$responses.createdBy'}, responseIds: {$push: '$responses._id'}, submissions: { $first: "$submissions" } } },
        {
          $lookup: {
            from: 'users',
            localField: 'mentors',
            foreignField: '_id',
            as: 'mentors'
          }
        },
        { $unwind: "$submissions"},
        { $sort: { 'submissions.createDate': -1 } },
        { $group: { _id: '$_id', responses: { $first: "$responses" }, wsName: { $first: '$wsName' }, unreadReplies: { $first: '$unreadReplies' }, responseIds: {$first: '$responses._id'}, submissions: { $push: "$submissions" }, submissionIds: { $push: "$submissions._id" }, mentors: {$first: '$mentors'}, problemTitle: {$first: '$submissions.publication.puzzle.title'}, } },

        {
          $project: {
           _id: 1, mentors: 1, wsName: 1, threadType: 'submitter', problemTitle: 1,
            submissionIds: 1, responseIds: 1, responses: 1, submissions: 1,
            hasUnreadReply: { $cond: [{ $eq: [{ $size: "$unreadReplies" }, 0] }, false, true] },
            latestReply: { $arrayElemAt: ["$responses", 0] },
            latestSubmission: {$arrayElemAt: ['$submissions', 0]},
          }
        },
        {$facet: {
          paginatedResults: [

        { $sort: { hasUnreadReply: 1, 'latestReply.createDate': 1, 'latestSubmission.createDate': 1 } },
        {$skip: skip},
        { $limit: limit },
        {$project: {
          uniqueIdentifier: '$_id', _id: 0, workspaceName: '$wsName', responses: '$responseIds', threadType: 'submitter', totalThreads: 1, submissions: '$submissionIds', problemTitle: 1, mentors: 1, response: '$responses', submission: '$submission',
        }}
          ],
          totalCount: [
            {
              $count: 'count',
            }
          ]
        }},


      ]).exec();
    })
    .catch((err) => {
      console.error(`Error getSubmitterThreads: ${err}`);
    });

}

function getMentorThreads(user, limit, skip) {
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
        return [
          { paginatedResults: [] },
          { totalCount: [] }
        ];
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
            studentDisplay: { $ifNull: ['$submissions.creator.username', '$submissions.creator.safeName'] },
            submissions: 1,
            responses: 1,
          },
        },
        { $group: { _id: { workspaceId: '$workspaceId', student: '$student' }, studentDisplay: {$first: '$studentDisplay'}, name: {$first: '$name'}, submissions: { $push: '$submissions' }, submissionIds: {$push: '$submissions._id'}, responses: { $first: '$responses' }, } },
        {
          $project: {
            submissionIds: 1, submissions: 1, _id: 1, name: 1, studentDisplay: 1,
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
        { $group: { _id: { workspaceId: '$_id.workspaceId', student: '$_id.student' }, responses: { $push: "$responses" }, name: { $first: '$name' }, studentDisplay: {$first: '$studentDisplay'}, submissions: { $first: "$submissions" }, responseIds: {$push: '$responses._id'}, submissionIds: { $first: "$submissionIds" } } },
        {$unwind: '$submissions'},
        { $sort: { 'submissions.createDate': -1 } },
        { $group: { _id: { workspaceId: '$_id.workspaceId', student: '$_id.student' }, responses: { $first: "$responses" }, name: { $first: '$name' }, studentDisplay: {$first: '$studentDisplay'}, submissions: { $push: "$submissions" }, submissionIds: {$first: '$submissionIds' }, responseIds: {$first: '$responseIds'}, problemTitle: {$first: '$submissions.publication.puzzle.title'} } },

        {$project: {
          _id: 1, studentDisplay: 1, responses: 1, problemTitle: 1, name: 1, submissions: 1, latestReply: { $arrayElemAt: ['$responses', 0] }, latestRevision: { $arrayElemAt: ['$submissions', 0] }, submissionIds: 1, responseIds: 1,
          toUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.recipient', userId] } } },
          fromUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.createdBy', userId] } } }

        }},
        {$project: {
          _id: 1, studentDisplay: 1, problemTitle: 1, responses: 1, responseIds: 1, name: 1, submissions: 1, submissionIds: 1, latestReplyDate: '$latestReply.createDate', latestRevisionDate: '$latestRevision.createDate',
          hasUnread: { $gte: [{ $size: { $filter: { input: '$toUserResponses', as: 'r', cond: { $eq: ['$$r.wasReadByRecipient', false] } } } }, 1]},
          hasPending: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'pendingApproval'] } } } }, 1]},
          hasNeedsRevisions: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'needsRevisions'] } } } }, 1]},
          hasDraft: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'draft'] } } } }, 1]},
          hasUnmentored: { $gte: [{ $size: { $filter: { input: '$submissions', as: 's', cond: { $eq: ['$$s.responses', []] } } } }, 1]}
        }},

        {$facet: {
          paginatedResults: [
            {$sort: {
              hasDraft: 1, hasNeedsRevisions: 1, hasUnmentored: 1, hasUnread: 1, hasPending: 1, latestReplyDate: 1, latestRevisionDate: 1
            }},
            {$skip: skip},
            {$limit: limit},
            {$project: {
              uniqueIdentifier: '$_id', _id: 1, responses: '$responseIds', submissions: '$submissionIds', workspaceName: '$name', problemTitle: 1, threadType: 'mentor', studentDisplay: 1, submission: '$submissions', response: '$responses'
            }}
          ],
          totalCount: [
            {
              $count: 'count',
            }
          ]
        }},
      ]).exec();
    })
    .catch((err) => {
      console.error(`Error getMentorThreads: ${err}`);
    });
  }

function getApproverThreads(user, asSuperAdmin, limit, skip) {
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
                  {$ne: ['$$r.recipient', userId]},
                  {$ne: ['$$r.status', 'draft']}
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
            studentDisplay: { $ifNull: ['$submissions.creator.username', '$submissions.creator.safeName'] },
            submissions: 1,
            responses: 1,
          },
        },
        { $group: { _id: { workspaceId: '$_id', student: '$student' }, name: {$first: '$name'}, submissions: { $push: '$submissions' }, submissionIds: {$push: '$submissions._id'}, responses: { $first: '$responses' }, problemTitle: {$first: '$submissions.publication.puzzle.title'}, studentDisplay: {$first: '$studentDisplay'} } },
    {$project: {
      _id: 1, name: 1, submissions: 1, submissionIds: 1, problemTitle: 1, studentDisplay: 1,
      responses: {$filter: {
        input: '$responses', as: 'r', cond: {
          $in: ['$$r.submission', '$submissionIds']
        }
      }}
    }},
    {$project: {
      _id: 1, name: 1, submissions: 1, responses: 1, submissionIds: 1, problemTitle: 1, studentDisplay: 1,
      mentorResponses: {
        $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.responseType', 'mentor'] } }
      },
    }},
    {$unwind: '$mentorResponses'},
    {$group: {
      _id: '$_id', name: {$first: '$name'}, submissions: {$first: '$submissions'}, submissionIds: {$first: '$submissionIds'}, responses: {$first: '$responses'},
      mentors: {$addToSet: '$mentorResponses.createdBy'}, mentorResponses: {$push: '$mentorResponses'}, problemTitle: {$first: '$problemTitle'}, studentDisplay: {$first: '$studentDisplay'},
    }},
    {$unwind: '$mentors'},
    {$group: {
      _id: {workspaceId: '$_id.workspaceId', student: '$_id.student', mentor: '$mentors'}, name: {$first: '$name'}, submissions: {$first: '$submissions'}, responses: {$first: '$responses'}, mentorResponses: {$first: '$mentorResponses'}, submissionIds: {$first: '$submissionIds'},
      problemTitle: {$first: '$problemTitle'}, studentDisplay: {$first: '$studentDisplay'},
    }},
    {$unwind: '$responses'},
    { $sort: { 'responses.createDate': -1 } },
    { $group: { _id: '$_id', responses: { $push: "$responses" }, responseIds: {$push: "$responses._id"}, submissionIds: {$first: '$submissionIds'}, name: { $first: '$name' }, submissions: { $first: "$submissions" }, mentorResponses: {$first: '$mentorResponses'}, problemTitle: {$first: '$problemTitle'}, studentDisplay: {$first: '$studentDisplay'}} },
    {$lookup: {
      from: 'users',
      localField: '_id.mentor',
      foreignField: '_id',
      as: 'mentors'
    }},
    {$project: {
      _id: 1, mentors: 1, problemTitle: 1, studentDisplay: 1, name: 1, submissions: 1, submissionIds: 1, responseIds: 1, responses: 1, mentorResponses: 1, latestReply: {$arrayElemAt: ['$responses', 0]},
      toUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.recipient', userId] } } },
      fromUserResponses: { $filter: { input: '$responses', as: 'r', cond: { $eq: ['$$r.createdBy', userId] } } }
    }},
    {$project: {
      _id: 1, mentors: 1, studentDisplay: 1, responseIds: 1, responses: 1, problemTitle: 1, name: 1, submissionIds: 1, submissions: 1, latestReplyDate: '$latestReply.createDate',
      hasUnread: { $gte: [{ $size: { $filter: { input: '$toUserResponses', as: 'r', cond: { $eq: ['$$r.wasReadByRecipient', false] } } } }, 1]},
      hasPending: { $gte: [{ $size: { $filter: { input: '$mentorResponses', as: 'r', cond: { $eq: ['$$r.status', 'pendingApproval'] } } } }, 1]},
      hasNeedsRevisions: { $gte: [{ $size: { $filter: { input: '$mentorResponses', as: 'r', cond: { $eq: ['$$r.status', 'needsRevisions'] } } } }, 1]},
      hasDraft: { $gte: [{ $size: { $filter: { input: '$fromUserResponses', as: 'r', cond: { $eq: ['$$r.status', 'draft'] } } } }, 1]},
    }},
    {$facet: {
      paginatedResults: [
        {$sort: {
          hasDraft: 1, hasPending: 1, hasUnread: 1, hasNeedsRevisions: 1, latestReplyDate: 1
        }},
        {$skip: skip},
        {$limit: limit},
        {$project: {
          uniqueIdentifier: '$_id', _id: 0, problemTitle: 1, responses: '$responseIds', submissions: '$submissionIds', workspaceName: '$name', threadType: 'approver', studentDisplay: 1, response: '$responses', submission: '$submissions', mentors: 1,
        }}
      ],
      totalCount: [
        {
          $count: 'count',
        }
      ]
    }},
  ]).exec();
}

async function getResponseThreads(req, res, next) {
  try {
    let user = userAuth.requireUser(req);
    let { asSuperAdmin, limit, page, threadType  } = req.query;

    let skip = req.skip;

    if (!page) {
      page = 1;
    }

    let threads = [];

    if (threadType === 'all') {
      threads = await Promise.all([
        getSubmitterThreads(user, limit, skip),
        getMentorThreads(user, limit, skip),
        getApproverThreads(user, asSuperAdmin, limit, skip)
      ]);
    } else if (threadType === 'submitter') {
      let submitterThreads = await getSubmitterThreads(user, limit, skip);
      let mentoringThreads = [
        { paginatedResults: [] },
        { totalCount: [] }
      ];
      let approvingThreads = [
        { paginatedResults: [] },
        { totalCount: [] }
      ];

      threads = [submitterThreads, mentoringThreads, approvingThreads];
    } else if (threadType === 'mentor') {
      let mentoringThreads = await getMentorThreads(user, limit, skip);
      let submitterThreads = [
        { paginatedResults: [] },
        { totalCount: [] }
      ];
      let approvingThreads = [
        { paginatedResults: [] },
        { totalCount: [] }
      ];
      threads = [submitterThreads, mentoringThreads, approvingThreads];
    } else if (threadType === 'approver') {
      let approvingThreads = await getApproverThreads(user, asSuperAdmin, limit, skip);

      let submitterThreads = [
        { paginatedResults: [] },
        { totalCount: [] }
      ];
      let mentoringThreads = [
        { paginatedResults: [] },
        { totalCount: [] }
      ];

      threads = [submitterThreads, mentoringThreads, approvingThreads];

    }

    let [ submitter, mentoring, approving ] = threads;

    let submitterResults = submitter[0];
    let mentoringResults = mentoring[0];
    let approvingResults = approving[0];

    let submitterThreads = _.propertyOf(submitterResults)('paginatedResults');
    // array with { count: num } doc
    let submitterCount = _.propertyOf(submitterResults)('totalCount') || [];

    let mentoringThreads = _.propertyOf(mentoringResults)('paginatedResults');
    let mentoringCount = _.propertyOf(mentoringResults)('totalCount') || [];

    let approvingThreads = _.propertyOf(approvingResults)('paginatedResults');
    let approvingCount = _.propertyOf(approvingResults)('totalCount') || [];




    let numSubmitter = _.propertyOf(submitterCount[0])('count') || 0;
    let numMentoring = _.propertyOf(mentoringCount[0])('count') || 0;
    let numApproving = _.propertyOf(approvingCount[0])('count') || 0;

    let results = [];

      if (isNonEmptyArray(submitterThreads)) {
        submitterThreads.forEach((thread) => {
          let wsId = thread.uniqueIdentifier;
          if (wsId) {
            let id = 'srt' + wsId.toString();
            thread._id = id;
          }
          results.push(thread);
        });
      }

      if (isNonEmptyArray(mentoringThreads)) {
        mentoringThreads.forEach((thread) => {
          let wsId = _.propertyOf(thread)(['uniqueIdentifier', 'workspaceId']);
          let student = _.propertyOf(thread)(['uniqueIdentifier', 'student']);
          if (wsId && student) {
            let id = wsId.toString() + student;
            thread._id = id;
          }
          results.push(thread);
        });
      }
      if (isNonEmptyArray(approvingThreads)) {
       approvingThreads.forEach((thread) => {
         let wsId = _.propertyOf(thread)(['uniqueIdentifier', 'workspaceId']);
         let student = _.propertyOf(thread)(['uniqueIdentifier', 'student']);
        let mentor = _.propertyOf(thread)(['uniqueIdentifier', 'mentor']);

        if (wsId && student && mentor) {
          let id = wsId.toString() + student + mentor.toString();
          thread._id = id;
        }
          results.push(thread);
        });
      }
      let data = {
        responseThreads: results,
        response: [],
        submission: [],
        user: [],
        meta: {
          meta: {
            submitter: {
              total: numSubmitter,
              pageCount: Math.ceil(numSubmitter / limit),
              currentPage: page
            },
            mentoring: {
              total: numMentoring,
              pageCount: Math.ceil(numMentoring / limit),
              currentPage: page
            },
            approving: {
              total: numApproving,
              pageCount: Math.ceil(numApproving / limit),
              currentPage: page
            }

          }
        }
      };

      let base = data.responseThreads;
      base.forEach((thread) => {
        let responses = thread.response || [];
        responses.forEach((response) => {
          data.response.push(response);
        });
        delete thread.response;

        let submissions = thread.submission || [];
        submissions.forEach((submission) => {
          data.submission.push(submission);
        });
        delete thread.submission;
        if (thread.threadType === 'submitter' || thread.threadType === 'approver') {
          let mentors = thread.mentors || [];
          mentors.forEach((user) => {
            data.user.push(user);
          });
          thread.mentors = _.pluck(mentors, '_id');
        }

      });

      // console.log('results', results);
    return utils.sendResponse(res, data);
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