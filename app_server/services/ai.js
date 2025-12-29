const https = require('https');
const http = require('http');
const he = require('he');
const models = require('../datasource/schemas');

/**
 * Simplified AI Service for generating draft responses
 * Uses simple format compatible with current AWS API
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
 * @returns {Promise<string>} The generated AI draft text
 */
const generateDraft = async (
  targetSubmissionId,
  responseMode = 'student_only',
  workspaceId = null
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

  // Step 2: Fetch teacher selections for this submission (mandatory)
  const selectionsQuery = {
    submission: targetSubmissionId,
    isTrashed: { $ne: true },
  };

  if (workspaceId) {
    selectionsQuery.workspace = workspaceId;
  }

  const selections = await models.Selection.find(selectionsQuery)
    .populate('createdBy', 'username')
    .select('text createdBy')
    .lean()
    .exec();

  // Step 3: Extract problem statement
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

  // Step 4: Extract and clean student work
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
  // Step 5: Determine student name
  const studentName =
    targetSubmission.creator?.username ||
    targetSubmission.clazz?.name ||
    'the student';

  // Step 6: Build request body matching backend expected format
  const cleanProblemStatement = stripHtml(problemStatement);

  const requestBody = {
    student_work: {
      short_answer: shortAnswer,
      long_answer: longAnswer,
      student_name: studentName,
    },
    response_mode: responseMode,
  };

  // Only include problem if we have valid text after cleaning
  if (cleanProblemStatement && cleanProblemStatement.trim().length > 0) {
    requestBody.problem = {
      statement: cleanProblemStatement,
    };
  }

  return await makeAIRequest(requestBody);
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
        console.log('AI response:', { statusCode: res.statusCode, body: data });
        try {
          const response = JSON.parse(data);
          console.log('Parsed response object:', response);
          console.log('Available keys:', Object.keys(response));
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // Extract draft from response (AWS API returns draft_feedback field)
            const draft = response.draft_feedback;
            console.log('Extracted draft text:', draft);
            resolve(draft);
          } else {
            reject(
              new Error(
                `AI error (${res.statusCode}): ${response.error || 'Unknown'}`
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
