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

/**
 * Generate an AI draft response based on submission
 * @param {string} targetSubmissionId - The ID of the target submission
 * @param {string} variant - A/B TEST VARIANT: Input variant ('A', 'B', 'C', or 'D')
 * @param {string} workspaceId - Optional workspace ID to filter selections/comments
 * @param {string} teacherId - Teacher user ID to scope selections/comments
 * @returns {Promise<string>} The generated AI draft text
 *
 * A/B TEST VARIANTS - WILL BE SIMPLIFIED ONCE PREFERRED COMBINATION IS CHOSEN:
 * A: Student work only
 * B: Student work + teacher selections
 * C: Student work + teacher comments (noticings, wonderings, feedback)
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
    .populate('creator', 'username')
    .populate('clazz', 'name')
    .select('shortAnswer longAnswer creator clazz publication')
    .lean()
    .exec();

  if (!targetSubmission) {
    throw new Error(`Submission ${targetSubmissionId} not found`);
  }

  // Step 2: Extract problem statement
  let problemStatement =
    targetSubmission?.answer?.assignment?.problem?.text ||
    targetSubmission?.publication?.puzzle?.title;

  if (!problemStatement && targetSubmission?.publication?.puzzle?.problemId) {
    const problem = await models.Problem.findById(
      targetSubmission.publication.puzzle.problemId
    )
      .select('text title')
      .lean()
      .exec();
    if (problem) problemStatement = problem.text || problem.title;
  }

  if (!problemStatement) {
    problemStatement =
      'The student is sharing their mathematical thinking and work.';
  }

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
  const studentName =
    targetSubmission.creator?.username ||
    targetSubmission.clazz?.name ||
    'the student';

  // Step 5: Build request body matching backend expected format
  const cleanProblemStatement = stripHtml(problemStatement);

  const requestBody = {
    student_work: {
      short_answer: shortAnswer,
      long_answer: longAnswer,
      student_name: studentName,
    },
    variant: variant, // A/B TEST: Include variant in request
  };

  // A/B TEST: Add selections and comments based on variant
  if (variant === 'B' || variant === 'D') {
    // Include teacher selections
    const selections = await getTeacherSelections(
      targetSubmissionId,
      workspaceId,
      teacherId
    );
    if (selections && selections.length > 0) {
      requestBody.teacher_selections = selections;
    }
  }

  if (variant === 'C' || variant === 'D') {
    // Include teacher comments (noticings, wonderings, feedback)
    const comments = await getTeacherComments(
      targetSubmissionId,
      workspaceId,
      teacherId
    );
    if (comments && comments.length > 0) {
      requestBody.teacher_comments = comments;
    }
  }

  // Only include problem if we have valid text after cleaning
  if (cleanProblemStatement && cleanProblemStatement.trim().length > 0) {
    requestBody.problem = {
      statement: cleanProblemStatement,
    };
  }

  return await makeAIRequest(requestBody);
};

/**
 * A/B TEST HELPER: Get teacher selections for a submission
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
    logger.info('AI selection query:', selectionQuery);
    const selections = await models.Selection.find(selectionQuery)
      .populate('createdBy', 'username')
      .select('text createDate createdBy')
      .lean()
      .exec();

    logger.info(
      'AI selection IDs:',
      selections.map((sel) => String(sel._id))
    );
    return selections.map((sel) => ({
      text: stripHtml(sel.text),
      created_by: sel.createdBy?.username || 'teacher',
      created_at: sel.createDate,
    }));
  } catch (error) {
    logger.error('Error fetching teacher selections:', error);
    return [];
  }
};

/**
 * A/B TEST HELPER: Get teacher comments for a submission
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

    logger.info('AI comment query:', commentQuery);
    const comments = await models.Comment.find(commentQuery)
      .populate('createdBy', 'username')
      .select('text label createDate createdBy')
      .lean()
      .exec();

    logger.info(
      'AI comment IDs:',
      comments.map((comment) => String(comment._id))
    );
    return comments.map((comment) => ({
      text: stripHtml(comment.text),
      label: comment.label, // noticing, wondering, feedback, etc.
      created_by: comment.createdBy?.username || 'teacher',
      created_at: comment.createDate,
    }));
  } catch (error) {
    logger.error('Error fetching teacher comments:', error);
    return [];
  }
};

/**
 * Makes an HTTP POST request to the AI service
 * @param {Object} requestBody - The structured request body
 * @returns {Promise<string>} The draft text from AI service
 */
const makeAIRequest = async (requestBody) => {
  const postData = JSON.stringify(requestBody);
  const requestContext = {
    variant: requestBody.variant,
    has_teacher_selections: Boolean(requestBody.teacher_selections?.length),
    teacher_selections_count: requestBody.teacher_selections
      ? requestBody.teacher_selections.length
      : 0,
    has_teacher_comments: Boolean(requestBody.teacher_comments?.length),
    teacher_comments_count: requestBody.teacher_comments
      ? requestBody.teacher_comments.length
      : 0,
  };
  logger.info('AI request context:', requestContext);
  logger.info('AI request payload:', requestBody);
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
        console.log('AI response:', { statusCode: res.statusCode, body: data });
        try {
          const response = JSON.parse(data);
          console.log('Parsed response object:', response);
          console.log('Available keys:', Object.keys(response));
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
            console.log('Extracted draft text:', draft);
            if (!draft) {
              console.error(
                'No draft text found in response. Available fields:',
                Object.keys(response)
              );
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
