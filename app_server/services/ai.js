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
    use_rag: true,
    return_examples: false,
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
    // Choose http for local development, https for production
    const protocol = options.hostname === 'localhost' ? http : https;
    const req = protocol.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        let response;
        try {
          response = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Extract draft from response (try multiple possible field names)
            let draft =
              response.draft_feedback ||
              response.draft ||
              response.text ||
              response.message;
            if (!draft && response.data) {
              draft =
                response.data.draft_feedback ||
                response.data.draft ||
                response.data.text ||
                response.data.message;
            }
            if (!draft) {
              reject(new Error('No draft text found in AI response'));
              return;
            }
            resolve(draft);
          } else {
            reject(
              new Error(
                `AI error (${res.statusCode}): ${
                  response.error || response.message || 'Unknown'
                }`
              )
            );
          }
        } catch (e) {
          reject(new Error(`Invalid response: ${e.message}`));
        }
      });
    });

    req.on('error', (e) =>
      reject(new Error(`Connection failed: ${e.message}`))
    );
    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    req.write(postData);
    req.end();
  });
};

module.exports.generateDraft = generateDraft;
