const https = require('https');
const http = require('http');
const models = require('../datasource/schemas');

/**
 * AI Service for generating draft responses
 * Enhanced version with structured student/teacher context separation
 * Communicates with external AI service to generate response drafts
 */

// Default configuration for AI service connection
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8001;
const DEFAULT_PATH = '/api/generate-draft';

/**
 * Strip HTML tags and entities from text
 * @param {string} html - HTML string to strip
 * @returns {string} Plain text without HTML tags
 */
const stripHtml = (html) => {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&#(\d+);/g, (match, dec) => String.fromCharCode(dec)) // Decode numeric entities first
    .replace(/&nbsp;/g, ' ') // Replace &nbsp; with space
    .replace(/&amp;/g, '&') // Replace &amp; with &
    .replace(/&lt;/g, '<') // Replace &lt; with <
    .replace(/&gt;/g, '>') // Replace &gt; with >
    .replace(/&quot;/g, '"') // Replace &quot; with "
    .replace(/&apos;/g, "'") // Replace &apos; with '
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
};

/**
 * Generate an AI draft response based on submission and context
 * Enhanced version that structures data by student work vs mentor/teacher observations
 * @param {string} targetSubmissionId - The ID of the target submission
 * @param {string} responseMode - Mode for AI response: 'student_only', 'teacher_only', or 'all' (default: 'student_only')
 * @returns {Promise<string>} The generated AI draft text
 */
const generateDraft = async (targetSubmissionId, responseMode = 'all') => {
  try {
    // Step 1: Fetch submission with all related data (problem, student answers, etc.)
    const targetSubmission = await models.Submission.findById(
      targetSubmissionId
    )
      .populate({
        path: 'answer',
        populate: {
          path: 'assignment',
          populate: {
            path: 'problem',
            select: 'text title',
          },
        },
      })
      .populate('creator', 'username')
      .select('shortAnswer longAnswer creator clazz publication')
      .lean()
      .exec();

    if (!targetSubmission) {
      throw new Error(
        `Target submission with ID ${targetSubmissionId} not found`
      );
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
      try {
        const problem = await models.Problem.findById(
          targetSubmission.publication.puzzle.problemId
        )
          .select('text title')
          .lean()
          .exec();

        if (problem) {
          problemStatement = problem.text || problem.title;
        }
      } catch (err) {
        console.error('Error fetching problem from problemId:', err);
      }
    }

    // Final fallback for reflections or incomplete data
    if (!problemStatement) {
      problemStatement =
        'The student is sharing their mathematical thinking and work.';
    }

    // Step 3: Get mentor/teacher selections with their associated comments
    // Selections = text portions that mentors highlighted in the student's work
    // Comments = mentor observations attached to those selections (labeled as notice/wonder/feedback)
    const selections = await models.Selection.find({
      submission: targetSubmissionId,
      isTrashed: { $ne: true },
    })
      .populate({
        path: 'comments',
        match: { isTrashed: { $ne: true } },
        populate: {
          path: 'createdBy',
          select: 'username',
        },
        select: 'text label createdBy createDate',
      })
      .populate('createdBy', 'username')
      .select('text comments createdBy createDate')
      .lean()
      .exec();

    // Step 4: Format selections with their associated comments for AI service
    // Structure: Each selection (highlighted text) + its comments (notice/wonder/feedback observations)
    const formattedSelections = selections.map((selection) => {
      const comments = (selection.comments || []).map((comment) => ({
        type: comment.label, // notice, wonder, or feedback
        text: stripHtml(comment.text),
        author: comment.createdBy?.username || 'Unknown',
        date: comment.createDate,
      }));

      return {
        selected_text: stripHtml(selection.text),
        mentor_teacher: selection.createdBy?.username || 'Unknown',
        comments: comments,
      };
    });

    // Step 5: Get any previous mentor responses on this submission
    // This helps the AI avoid repeating what's already been said
    const responses = await models.Response.find({
      submission: targetSubmissionId,
      isTrashed: { $ne: true },
    })
      .populate('createdBy', 'username')
      .select('text createdBy createDate')
      .sort({ createDate: 1 })
      .lean()
      .exec();

    const formattedResponses = responses.map((response) => ({
      text: stripHtml(response.text),
      author: response.createdBy?.username || 'Unknown',
      date: response.createDate,
    }));

    // Step 6: Build structured request with clear separation of student vs mentor/teacher content
    // This format helps AI distinguish between:
    // - What the student was asked to do (problem)
    // - What the student wrote (student_work)
    // - What mentors/teachers observed and previously said (mentor_teacher_context)
    // - How AI should respond (response_mode)

    // Check if we have student work or teacher observations
    const shortAnswer = stripHtml(targetSubmission.shortAnswer || '');
    const longAnswer = stripHtml(targetSubmission.longAnswer || '');
    const hasStudentWork = shortAnswer || longAnswer;
    const hasTeacherObservations = formattedSelections.length > 0;

    const aiRequestBody = {
      problem: {
        statement: stripHtml(problemStatement),
      },
      student_work: {
        short_answer:
          shortAnswer ||
          (hasTeacherObservations
            ? '[Student has not yet provided a written response]'
            : ''),
        long_answer:
          longAnswer ||
          (hasTeacherObservations
            ? '[Student has not yet provided a detailed explanation]'
            : ''),
        student_name: targetSubmission.creator?.username || 'Student',
      },
      mentor_teacher_context: {
        selections_and_observations: formattedSelections,
        previous_responses: formattedResponses,
      },
      response_mode: responseMode,
    };

    // If no student work and no teacher observations, we need to discuss on what to do in this case
    if (!hasStudentWork && !hasTeacherObservations) {
      throw new Error(
        'No student work or teacher observations available. Please add content before generating AI draft.'
      );
    }

    // Call the external AI service with our structured data
    const aiResponse = await makeAIRequest(aiRequestBody);

    if (!aiResponse.draft) {
      throw new Error('AI service returned empty response');
    }

    return aiResponse.draft;
  } catch (error) {
    console.error('Error generating AI draft:', error);
    throw error;
  }
};

/**
 * Makes an HTTP POST request to the AI service
 * @param {Object} requestBody - The structured request body with problem, student_work, and mentor_teacher_context
 * @returns {Promise<Object>} The response from the AI service
 */
const makeAIRequest = async (requestBody) => {
  const postData = JSON.stringify(requestBody);

  const options = {
    hostname: process.env.AI_DRAFT_HOST || DEFAULT_HOST,
    port: process.env.AI_DRAFT_PORT || DEFAULT_PORT,
    path: process.env.AI_DRAFT_PATH || DEFAULT_PATH,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData),
    },
  };

  return new Promise((resolve, reject) => {
    // Choose http for local development, https for production
    const protocol = options.hostname === 'localhost' ? http : https;
    const req = protocol.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            // AI service returns draft_response field
            resolve({ draft: response.draft_response });
          } else {
            reject(
              new Error(
                `AI service error (${res.statusCode}): ${
                  response.error || response.message || 'Unknown error'
                }`
              )
            );
          }
        } catch (parseError) {
          reject(
            new Error(`Invalid AI service response: ${parseError.message}`)
          );
        }
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Cannot connect to AI service: ${error.message}`));
    });

    req.setTimeout(30000, () => {
      req.destroy();
      reject(new Error('AI service request timed out after 30 seconds'));
    });

    req.write(postData);
    req.end();
  });
};

module.exports.generateDraft = generateDraft;
