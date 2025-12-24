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
const generateDraft = async (targetSubmissionId) => {
  // Step 1: Fetch submission with all related data (problem, student answers, etc.)
  const targetSubmission = await models.Submission.findById(targetSubmissionId)
    .populate({
      path: 'answer',
      populate: {
        path: 'assignment',
        populate: { path: 'problem', select: 'text title' },
      },
    })
    .populate('creator', 'username')
    .select('shortAnswer longAnswer creator publication')
    .lean()
    .exec();

  if (!targetSubmission) {
    throw new Error(`Submission ${targetSubmissionId} not found`);
  }

  // Step 2: Extract problem statement from different possible locations
  // System has evolved over time, so we check multiple places:
  // - New system: answer.assignment.problem.text (full problem text)
  // - Old PoWs with title: publication.puzzle.title (denormalized title from import)
  // - Old PoWs with problemId only: fetch full problem from publication.puzzle.problemId
  // - Reflections or broken imports: generic fallback message
  let problemStatement =
    targetSubmission?.answer?.assignment?.problem?.text ||
    targetSubmission?.publication?.puzzle?.title;

  // If we have a problemId but no text, try to fetch the problem
  if (!problemStatement && targetSubmission?.publication?.puzzle?.problemId) {
    const problem = await models.Problem.findById(
      targetSubmission.publication.puzzle.problemId
    )
      .select('text title')
      .lean()
      .exec();
    if (problem) problemStatement = problem.text || problem.title;
  }

  // Final fallback for reflections or incomplete data
  if (!problemStatement) {
    problemStatement =
      'The student is sharing their mathematical thinking and work.';
  }

  // Step 3: Extract and clean student work
  const shortAnswer = stripHtml(targetSubmission.shortAnswer || '');
  const longAnswer = stripHtml(targetSubmission.longAnswer || '');
  const studentWork = [shortAnswer, longAnswer].filter(Boolean).join(' ');

  if (!studentWork) {
    throw new Error('No student work available to generate AI draft.');
  }

  // Step 4: Build request body with simplified structure for current AWS API
  const requestBody = {
    problem: {
      statement: stripHtml(problemStatement),
    },
    student_work: {
      short_answer: shortAnswer || '',
      long_answer: longAnswer || '',
      student_name: targetSubmission.creator?.username || 'student',
    },
    response_mode: 'student_only',
  };

  console.log(
    'Sending simplified request:',
    JSON.stringify(requestBody, null, 2)
  );
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
