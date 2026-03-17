// AI SERVICE MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI SERVICE MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
// AI SERVICE MODIFIED FOR A/B TESTING - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
const https = require('https');
const http = require('http');
const he = require('he');
const logger = require('log4js').getLogger('ai');
const models = require('../datasource/schemas');

/**
 * AI Service modified for A/B testing with variant support
 * Will need tweaking once preferred input combination is finalized
 */

/**
 * Strip HTML tags and decode HTML entities from text
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags or entities
 */
const stripHtml = (html) => {
  if (!html) return '';
  return he
    .decode(html.replace(/<[^>]*>/g, ''))
    .replace(/\s+/g, ' ')
    .trim();
};

const looksLikeId = (value) =>
  typeof value === 'string' &&
  (/^[a-f0-9]{24}$/i.test(value) || /^[0-9]+$/.test(value.trim()));

const resolveStudentName = (submission) => {
  const creator = submission?.creator || {};
  const candidates = [
    creator.fullName,
    creator.safeName,
    creator.name,
    creator.username,
  ];

  for (const candidate of candidates) {
    const clean = stripHtml(candidate || '');
    if (clean && !looksLikeId(clean)) {
      return clean;
    }
  }

  return 'the student';
};

const { resolveProblemText } = require('./problemText');

const normalizeApiPath = (path = '') => {
  if (!path) {
    return '';
  }

  return path.startsWith('/') ? path : `/${path}`;
};

const STAGE_NAMES = new Set(['prod', 'dev', 'test', 'stage', 'staging']);

const getStagePrefix = (path = '') => {
  const segments = normalizeApiPath(path).split('/').filter(Boolean);
  const firstSegment = segments[0];

  if (firstSegment && STAGE_NAMES.has(firstSegment.toLowerCase())) {
    return `/${firstSegment}`;
  }

  return '';
};

const buildStatusPath = (requestPath, ticketId) => {
  const stagePrefix = getStagePrefix(requestPath);
  return `${stagePrefix}/api/status/${encodeURIComponent(ticketId)}`;
};

const extractDraft = (payload = {}) => {
  let draft =
    payload.draft_response ||
    payload.draft_feedback ||
    payload.feedback ||
    payload.draft ||
    payload.text ||
    payload.message;

  if (!draft && payload.data) {
    draft =
      payload.data.draft_response ||
      payload.data.draft_feedback ||
      payload.data.feedback ||
      payload.data.draft ||
      payload.data.text ||
      payload.data.message;
  }

  return draft;
};

const summarizeResponseBody = (value, maxLength = 400) => {
  if (value === null || value === undefined) {
    return '';
  }

  const text =
    typeof value === 'string' ? value : JSON.stringify(value, null, 2);

  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength)}...`;
};

const buildAIServiceError = ({
  message,
  statusCode = null,
  requestOptions = {},
  responseBody = null,
}) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.host = requestOptions.hostname || null;
  error.port = requestOptions.port || null;
  error.path = requestOptions.path || null;
  error.method = requestOptions.method || null;
  error.responseBodyPreview = summarizeResponseBody(responseBody);

  if (statusCode === 403) {
    error.hint =
      'Upstream AI service denied the request. Check API Gateway stage/path, API-key authorization, resource policy, or source-network restrictions.';
  } else if (statusCode === 404) {
    error.hint =
      'Upstream AI endpoint was not found. Check AI_DRAFT_HOST, AI_DRAFT_PATH, and deployed stage routing.';
  } else if (statusCode && statusCode >= 500) {
    error.hint =
      'Upstream AI service failed after receiving the request. Check the external service logs.';
  }

  return error;
};

/**
 * Generate an AI draft response based on submission
 * @param {string} targetSubmissionId - The ID of the target submission
 * @param {string} variant - Input variant ('A' or 'D')
 * @param {string} workspaceId - Optional workspace ID to filter selections/comments
 * @param {string} teacherId - Teacher user ID to scope selections/comments
 * @returns {Promise<string>} The generated AI draft text
 *
 * Active variants:
 * A: Student work only
 * D: Student work + teacher selections + teacher comments
 */
const generateDraft = async (
  targetSubmissionId,
  variant = 'A',
  workspaceId = null,
  teacherId = null
) => {
  // Step 1: Fetch submission with all related data
  const targetSubmission = await models.Submission.findById(targetSubmissionId)
    .populate({
      path: 'answer',
      populate: {
        path: 'assignment',
        populate: { path: 'problem', select: 'text title' },
      },
    })
    .select('shortAnswer longAnswer answer creator clazz publication pdSet')
    .lean()
    .exec();

  if (!targetSubmission) {
    throw new Error(`Submission ${targetSubmissionId} not found`);
  }

  // Step 2: Extract problem statement
  const problemStatement = await resolveProblemText(targetSubmission, models);

  // Step 3: Extract and clean student work
  let shortAnswer = stripHtml(targetSubmission.shortAnswer || '');
  let longAnswer = stripHtml(targetSubmission.longAnswer || '');

  // If no direct student work, check the answer relationship (for VMT submissions)
  if (
    (!shortAnswer || shortAnswer.trim().length === 0) &&
    (!longAnswer || longAnswer.trim().length === 0)
  ) {
    if (targetSubmission.answer) {
      shortAnswer = stripHtml(targetSubmission.answer.answer || '');
      longAnswer = stripHtml(targetSubmission.answer.explanation || '');
    }
  }

  // If still no student work found, throw error
  if (
    (!shortAnswer || shortAnswer.trim().length === 0) &&
    (!longAnswer || longAnswer.trim().length === 0)
  ) {
    throw new Error(
      'No student work found. Students must provide a short or long answer.'
    );
  }
  // Step 4: Determine student name
  const studentName = resolveStudentName(targetSubmission);

  // Step 5: Build request body matching backend expected format
  const cleanProblemStatement = stripHtml(problemStatement);

  const requestBody = {
    variant,
    problem: {
      statement: cleanProblemStatement,
    },
    student_work: {
      short_answer: shortAnswer,
      long_answer: longAnswer,
      student_name: studentName,
    },
    mentor_teacher_context: {
      selections_and_observations: [],
    },
  };

  const selectionsAndObservations = await buildSelectionsAndObservations(
    targetSubmissionId,
    variant,
    workspaceId,
    teacherId
  );
  requestBody.mentor_teacher_context.selections_and_observations =
    selectionsAndObservations;

  return await makeAIRequest(requestBody);
};

/**
 * Helper: Get teacher selections for a submission
 * @param {string} submissionId - The submission ID
 * @param {string} workspaceId - The workspace ID to filter selections
 * @param {string} teacherId - The teacher user ID to filter selections
 * @returns {Promise<Array>} Array of selection objects
 */
const getTeacherSelections = async (submissionId, workspaceId, teacherId) => {
  try {
    const selectionQuery = {
      submission: submissionId,
      isTrashed: { $ne: true },
    };
    if (teacherId) {
      selectionQuery.createdBy = teacherId;
    }
    if (workspaceId) {
      selectionQuery.workspace = workspaceId;
    }
    const selections = await models.Selection.find(selectionQuery)
      .select('text')
      .lean()
      .exec();
    return selections.map((sel) => ({
      selection_id: String(sel._id),
      selected_text: stripHtml(sel.text),
      comments: [],
    }));
  } catch (error) {
    logger.error('Error fetching teacher selections:', error);
    return [];
  }
};

/**
 * Helper: Get teacher comments for a submission
 * @param {string} submissionId - The submission ID
 * @param {string} workspaceId - The workspace ID to filter comments
 * @param {string} teacherId - The teacher user ID to filter comments
 * @returns {Promise<Array>} Array of comment objects
 */
const getTeacherComments = async (submissionId, workspaceId, teacherId) => {
  try {
    const commentQuery = {
      submission: submissionId,
      isTrashed: { $ne: true },
    };
    if (teacherId) {
      commentQuery.createdBy = teacherId;
    }
    if (workspaceId) {
      commentQuery.workspace = workspaceId;
    }
    const comments = await models.Comment.find(commentQuery)
      .populate('selection', 'text')
      .select('text label selection')
      .lean()
      .exec();
    return comments.map((comment) => ({
      selection_id: comment.selection?._id
        ? String(comment.selection._id)
        : comment.selection
        ? String(comment.selection)
        : null,
      selected_text: stripHtml(comment.selection?.text || ''),
      type: comment.label, // notice, wonder, feedback
      text: stripHtml(comment.text),
    }));
  } catch (error) {
    logger.error('Error fetching teacher comments:', error);
    return [];
  }
};

/**
 * Build mentor_teacher_context.selections_and_observations payload
 * based on requested variant.
 */
const buildSelectionsAndObservations = async (
  submissionId,
  variant,
  workspaceId,
  teacherId
) => {
  const includeSelections = variant === 'D';
  const includeComments = variant === 'D';

  const [selections, comments] = await Promise.all([
    includeSelections
      ? getTeacherSelections(submissionId, workspaceId, teacherId)
      : Promise.resolve([]),
    includeComments
      ? getTeacherComments(submissionId, workspaceId, teacherId)
      : Promise.resolve([]),
  ]);

  const selectionMap = new Map();
  const list = [];

  selections.forEach((selection) => {
    const key = selection.selection_id || `sel_${list.length}`;
    const row = {
      selected_text: selection.selected_text || '',
      comments: [],
    };
    selectionMap.set(key, row);
    list.push(row);
  });

  comments.forEach((comment) => {
    const key = comment.selection_id || `comment_only_${list.length}`;
    let row = selectionMap.get(key);

    if (!row) {
      row = {
        selected_text: comment.selected_text || '',
        comments: [],
      };
      selectionMap.set(key, row);
      list.push(row);
    }

    row.comments.push({
      type: comment.type || '',
      text: comment.text || '',
    });
  });

  return list;
};

/**
 * Makes an HTTP POST request to the AI service
 * @param {Object} requestBody - The structured request body
 * @returns {Promise<string>} The draft text from AI service
 */
const makeAIRequest = async (requestBody) => {
  const postData = JSON.stringify(requestBody);
  const options = {
    hostname: process.env.AI_DRAFT_HOST,
    port: process.env.AI_DRAFT_PORT,
    path: process.env.AI_DRAFT_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  // Add API key if provided
  if (process.env.AI_DRAFT_API_KEY) {
    options.headers['x-api-key'] = process.env.AI_DRAFT_API_KEY;
  }

  return new Promise((resolve, reject) => {
    const protocol = options.hostname === 'localhost' ? http : https;
    const requestJson = (requestOptions, body = null) =>
      new Promise((resolveRequest, rejectRequest) => {
        const req = protocol.request(requestOptions, (res) => {
          let data = '';
          res.on('data', (chunk) => (data += chunk));
          res.on('end', () => {
            let response = {};
            try {
              response = data ? JSON.parse(data) : {};
            } catch (e) {
              rejectRequest(
                buildAIServiceError({
                  message: `Invalid response from AI service: ${e.message}`,
                  statusCode: res.statusCode,
                  requestOptions,
                  responseBody: data,
                })
              );
              return;
            }

            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolveRequest(response);
              return;
            }

            rejectRequest(
              buildAIServiceError({
                message: `AI error (${res.statusCode}): ${
                  response.error || response.message || 'Unknown'
                }`,
                statusCode: res.statusCode,
                requestOptions,
                responseBody: data || response,
              })
            );
          });
        });

        req.on('error', (e) =>
          rejectRequest(
            buildAIServiceError({
              message: `Connection failed: ${e.message}`,
              requestOptions,
            })
          )
        );
        req.setTimeout(30000, () => {
          req.destroy();
          rejectRequest(
            buildAIServiceError({
              message: 'Request timeout',
              requestOptions,
            })
          );
        });

        if (body) {
          req.write(body);
        }
        req.end();
      });

    requestJson(options, postData)
      .then((response) => {
        const ticketId = response.ticketId || response.ticket_id || null;
        if (!ticketId) {
          reject(new Error('No ticket ID found in AI response'));
          return;
        }

        const startedAt = Date.now();
        const statusPath = buildStatusPath(options.path, ticketId);
        const statusOptions = {
          hostname: options.hostname,
          port: options.port,
          path: statusPath,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };

        if (process.env.AI_DRAFT_API_KEY) {
          statusOptions.headers['x-api-key'] = process.env.AI_DRAFT_API_KEY;
        }

        const poll = () => {
          if (Date.now() - startedAt >= 180000) {
            reject(new Error('Draft generation timed out. Please retry.'));
            return;
          }

          requestJson(statusOptions)
            .then((statusResponse) => {
              const status = String(statusResponse.status || '').toLowerCase();

              if (status === 'completed' || status === 'ready') {
                const draft = extractDraft(statusResponse);
                if (!draft) {
                  reject(new Error('No draft text found in AI response'));
                  return;
                }
                resolve(draft);
                return;
              }

              if (status === 'failed' || status === 'error') {
                reject(
                  new Error(
                    statusResponse.error || 'Failed to generate AI draft'
                  )
                );
                return;
              }

              setTimeout(poll, 1000);
            })
            .catch(reject);
        };

        poll();
      })
      .catch(reject);
  });
};

module.exports.generateDraft = generateDraft;
