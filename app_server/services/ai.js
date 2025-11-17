const https = require('https');
const http = require('http');
const models = require('../datasource/schemas');

/**
 * AI Service for generating draft responses
 * Communicates with external AI service to generate response drafts
 */

// Toggle between mock responses (true) and real AI service calls (false)
const isDevelopment = false;

// Default configuration for AI service connection
const DEFAULT_HOST = 'localhost';
const DEFAULT_PORT = 8001;
const DEFAULT_PATH = '/api/generate-draft';

/**
 * Strip HTML tags from text
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
 * @param {string} targetSubmissionId - The ID of the target submission
 * @returns {Promise<string>} The generated AI draft text
 */
const generateDraft = async (targetSubmissionId) => {
  try {
    // Step 1: Get the student's basic submission (their answers to the problem)
    const targetSubmission = await models.Submission.findById(
      targetSubmissionId
    )
      .select('shortAnswer longAnswer')
      .lean()
      .exec();

    if (!targetSubmission) {
      throw new Error(
        `Target submission with ID ${targetSubmissionId} not found`
      );
    }

    // Step 2: Get mentor's highlighted text selections and their observations
    // These represent what mentors "noticed" and "wondered" about in the student's work
    console.log('Fetching selections for submission:', targetSubmissionId);

    const selections = await models.Selection.find({
      submission: targetSubmissionId,
      isTrashed: { $ne: true },
    })
      .populate({
        path: 'comments',
        match: { isTrashed: { $ne: true } },
        select: 'text label',
      })
      .select('text comments')
      .lean()
      .exec();

    console.log(`Found ${selections.length} selections`);

    // Step 3: Format the mentor selections and comments into readable text
    // This becomes the "noticing and wondering" context from previous mentor analysis
    const noticingWondering = selections
      .map((selection) => {
        const selectionText = selection.text || '';
        if (!selectionText.trim()) return '';

        const comments = selection.comments || [];
        if (comments.length === 0) {
          return `[Selection: ${selectionText}]`;
        }

        return comments
          .map((comment) => {
            const commentText = comment.text || '';
            if (!commentText.trim()) return '';
            return `[Selection: ${selectionText}] ${comment.label}: ${commentText}`;
          })
          .filter((text) => text.length > 0)
          .join('\n');
      })
      .filter((text) => text.length > 0)
      .join('\n');

    console.log(
      'Formatted noticing_wondering length:',
      noticingWondering.length
    );

    // Step 4: Get any previous mentor feedback on this submission
    // This helps the AI avoid repeating what's already been said
    const responses = await models.Response.find({
      submission: targetSubmissionId,
      isTrashed: { $ne: true }, // Only get active responses
    })
      .select('text')
      .lean()
      .exec();

    // Combine all previous mentor responses into one text block
    const mentorResponses = responses
      .map((response) => response.text || '')
      .filter((text) => text.trim()) // Remove empty responses
      .join('\n\n'); // Separate responses with double line breaks

    console.log('Found', responses.length, 'previous mentor responses');

    // Step 5: Package all the raw data together
    // This is our internal format with all the context we've gathered
    const requestBody = {
      targetSubmissionId,
      shortAnswer: targetSubmission.shortAnswer || '',
      longAnswer: targetSubmission.longAnswer || '',
      noticingWondering,
      mentorResponses,
    };

    // Step 6: Either generate a mock response or call the real AI service
    if (isDevelopment) {
      // Return fake data for testing without hitting external AI service
      return generateMockDraft(requestBody, targetSubmissionId);
    }

    // Call the external AI service with our collected data
    const aiResponse = await makeAIRequest(requestBody, targetSubmission);

    return aiResponse.draft || 'AI draft generation failed';
  } catch (error) {
    console.error('Error generating AI draft:', error);
    throw error;
  }
};

/**
 * Makes an HTTP POST request to the AI service
 * @param {Object} requestBody - The request body to send
 * @param {string} targetSubmissionId - The ID of the target submission
 * @returns {Promise<Object>} The response from the AI service
 */
// TODO: Current implementation uses simplified format for initial integration.
// AI service may require full conversation thread format with rubrics/metadata.
const makeAIRequest = async (requestBody, targetSubmission) => {
  try {
    // Step 1: Get the original problem/assignment text that the student was working on
    // We need this so the AI understands what the student was supposed to do
    let submissionWithProblem = targetSubmission;

    // If we don't already have the problem text, fetch it from the database
    if (!targetSubmission.answer?.assignment?.problem) {
      submissionWithProblem = await models.Submission.findById(
        requestBody.targetSubmissionId
      )
        .populate({
          path: 'answer', // Get the student's answer
          populate: {
            path: 'assignment', // Get the assignment details
            populate: {
              path: 'problem', // Get the actual problem text
              select: 'text title',
            },
          },
        })
        .lean()
        .exec();
    }

    // Step 2: Extract the problem statement from different possible locations
    // Our system has evolved over time, so we check multiple places:
    // - New system: problem is stored in assignment.problem.text
    // - Old PoWs system: problem is in publication.puzzle.title
    // - Legacy: some submissions don't have clear problem statements
    let problemStatement =
      submissionWithProblem?.answer?.assignment?.problem?.text || // Try new system first
      submissionWithProblem?.publication?.puzzle?.title; // Try old system

    if (!problemStatement) {
      // If we can't find the original problem, create a generic context
      problemStatement = `This is a reflection or response submission. The student has provided their thoughts and observations.`;
      console.log('Using generic problem statement for legacy submission');
    }

    // Step 3: Clean up all text by removing HTML tags and entities
    // The database might contain HTML formatting that the AI doesn't need
    problemStatement = stripHtml(problemStatement);

    console.log('Problem statement (HTML stripped):', problemStatement);
    console.log(
      'Noticing/wondering to send:',
      requestBody.noticingWondering.substring(0, 200)
    );

    // Clean all the text fields to remove HTML formatting
    const cleanShortAnswer = stripHtml(requestBody.shortAnswer);
    const cleanLongAnswer = stripHtml(requestBody.longAnswer);
    const cleanNoticingWondering = stripHtml(requestBody.noticingWondering);
    const cleanMentorResponses = stripHtml(requestBody.mentorResponses);

    // Step 4: Format the data in the structure the AI service expects
    // This is different from our internal format - it's optimized for the AI
    const aiRequestBody = {
      problem_statement: problemStatement, // What the student was asked to do
      student_solution: `Short Answer: ${cleanShortAnswer}\n\nLong Answer: ${cleanLongAnswer}`, // What they wrote
      noticing_wondering: cleanNoticingWondering, // What mentors previously observed/questioned
      mentor_responses: cleanMentorResponses, // Previous feedback they received
    };

    const postData = JSON.stringify(aiRequestBody);

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

    // Step 5: Send the request to the AI service and handle the response
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
              resolve({ draft: response.draft_response });
            } else {
              reject(
                new Error(
                  `AI service returned status ${res.statusCode}: ${
                    response.message || 'Unknown error'
                  }`
                )
              );
            }
          } catch (parseError) {
            reject(
              new Error(
                `Failed to parse AI service response: ${parseError.message}`
              )
            );
          }
        });
      });

      req.on('error', (error) => {
        reject(new Error(`AI service request failed: ${error.message}`));
      });

      req.write(postData);
      req.end();
    });
  } catch (error) {
    throw new Error(`Failed to prepare AI request: ${error.message}`);
  }
};

/**
 * Generate a mock AI draft for development/testing purposes
 * @param {Object} requestBody - The request body that would be sent to AI service
 * @param {string} targetSubmissionId - The target submission ID
 * @returns {string} Mock AI draft text
 */
const generateMockDraft = (requestBody) => {
  // Extract all the context we've gathered about the student's work
  const { shortAnswer, longAnswer, noticingWondering, mentorResponses } =
    requestBody;

  // Start building a realistic-looking mentor response
  let mockDraft =
    "Thank you for your thoughtful submission. Here's my feedback:\n\n";

  // Give feedback on the student's short answer if they provided one
  if (shortAnswer && shortAnswer.trim()) {
    const shortText = shortAnswer.trim();
    mockDraft += `Regarding your short answer: "${shortText.substring(0, 150)}${
      shortText.length > 150 ? '...' : ''
    }"\n\n`;

    // Add some contextual feedback based on content
    if (
      shortText.toLowerCase().includes('because') ||
      shortText.toLowerCase().includes('since')
    ) {
      mockDraft +=
        "I appreciate that you're providing reasoning for your thinking. ";
    }
    if (shortText.includes('?')) {
      mockDraft +=
        'I notice you have some questions - that shows good mathematical curiosity. ';
    }
    mockDraft += 'Let me build on this idea.\n\n';
  }

  // Give more detailed feedback on their longer explanation
  if (longAnswer && longAnswer.trim()) {
    const longText = longAnswer.trim();
    mockDraft += `Looking at your detailed explanation, I can see you've put thought into this problem. `;

    if (longText.length > 200) {
      mockDraft += `Your thorough explanation shows deep engagement with the problem. `;
    }

    // Look for mathematical language
    if (
      longText.toLowerCase().includes('pattern') ||
      longText.toLowerCase().includes('relationship')
    ) {
      mockDraft += `I'm glad to see you're thinking about patterns and relationships. `;
    }

    mockDraft += `Here's what I want to highlight from your work: "${longText.substring(
      0,
      200
    )}${longText.length > 200 ? '...' : ''}"\n\n`;
  }

  // Reference their observations and questions (noticing/wondering)
  if (noticingWondering && noticingWondering.trim()) {
    const noticingText = noticingWondering.trim();
    mockDraft += `I see you noticed/wondered: "${noticingText.substring(
      0,
      100
    )}${noticingText.length > 100 ? '...' : ''}"\n\n`;
    mockDraft += `Let me build on your observations. `;
  }

  // Acknowledge previous mentor feedback to avoid repetition
  if (mentorResponses && mentorResponses.trim()) {
    const responseText = mentorResponses.trim();
    mockDraft += `Building on the previous mentor feedback: "${responseText.substring(
      0,
      100
    )}${responseText.length > 100 ? '...' : ''}"\n\n`;
    mockDraft += `I'd like to add to what was already shared. `;
  }

  // End with some generic but helpful prompting questions
  mockDraft += `Here are some additional thoughts to consider:\n\n`;
  mockDraft += `• What mathematical strategies did you use to approach this problem?\n`;
  mockDraft += `• Can you think of other ways to represent or solve this?\n`;
  mockDraft += `• How might you check if your solution makes sense?\n\n`;

  mockDraft += `Keep up the good mathematical thinking!`;

  return mockDraft;
};

module.exports.generateDraft = generateDraft;
