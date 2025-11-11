const https = require('https');
const http = require('http');
const models = require('../datasource/schemas');

/**
 * AI Service for generating draft responses
 * Communicates with external AI service to generate response drafts
 */
class AIService {
  constructor() {
    this.apiEndpoint = 'aidraftserver.com';
    this.apiPath = '/api/generate-draft';
    this.isDevelopment = false;
  }

  /**
   * Generate an AI draft response based on submission and context
   * @param {string} targetSubmissionId - The ID of the target submission
   * @param {string[]} contextSubmissionIds - Array of context submission IDs
   * @returns {Promise<string>} The generated AI draft text
   */
  async generateDraft(targetSubmissionId, contextSubmissionIds = []) {
    try {
      // Fetch the target submission with its shortAnswer and longAnswer
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

      // Fetch mentor responses for the target submission
      const responses = await models.Response.find({
        submission: targetSubmissionId,
      })
        .select('text')
        .lean()
        .exec();

      // Format mentor responses into a single string
      const mentorResponses = responses
        .map((response) => response.text || '')
        .filter((text) => text.trim().length > 0)
        .join('; ');

      // Prepare the request body
      const requestBody = {
        targetSubmissionId,
        shortAnswer: targetSubmission.shortAnswer || '',
        longAnswer: targetSubmission.longAnswer || '',
        mentorResponses,
      };

      // In development mode, return mock data instead of calling external API
      if (this.isDevelopment) {
        return this._generateMockDraft(requestBody, targetSubmissionId);
      }

      // Make the HTTP POST request to the AI service
      const aiResponse = await this._makeAIRequest(requestBody);

      return aiResponse.draft || 'AI draft generation failed';
    } catch (error) {
      console.error('Error generating AI draft:', error);
      throw error;
    }
  }

  /**
   * Makes an HTTP POST rerence-tracker>quest to the AI service
   * @param {Object} requestBody - The request body to send
   * @returns {Promise<Object>} The response from the AI service
   */

  // TODO: Current implementation uses simplified format for initial integration.
  // RAG service may require full conversation thread format with rubrics/metadata.
  async _makeAIRequest(requestBody) {
    try {
      // Get assignment/problem text for the submission
      const targetSubmission = await models.Submission.findById(
        requestBody.targetSubmissionId
      )
        .populate('assignment')
        .lean()
        .exec();

      const problemStatement =
        targetSubmission?.assignment?.text ||
        targetSubmission?.assignment?.description ||
        'No problem statement available';

      const ragRequestBody = {
        problem_statement: problemStatement,
        student_solution: `Short Answer: ${requestBody.shortAnswer}\n\nLong Answer: ${requestBody.longAnswer}`,
        noticing_wondering: requestBody.mentorResponses || '',
      };

      const postData = JSON.stringify(ragRequestBody);

      const options = {
        hostname: process.env.RAG_HOST || 'localhost' || this.apiEndpoint,
        port: process.env.RAG_PORT || 8001,
        path: process.env.RAG_PATH || this.apiPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      return new Promise((resolve, reject) => {
        // Use https for secure connections, http for localhost
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
  }

  /**
   * Generate a mock AI draft for development/testing purposes
   * @param {Object} requestBody - The request body that would be sent to AI service
   * @param {string} targetSubmissionId - The target submission ID
   * @returns {string} Mock AI draft text
   */
  _generateMockDraft(requestBody, targetSubmissionId) {
    const { shortAnswer, longAnswer, mentorResponses } = requestBody;

    let mockDraft =
      "Thank you for your thoughtful submission. Here's my feedback:\n\n";

    // Provide specific feedback on short answer
    if (shortAnswer && shortAnswer.trim()) {
      const shortText = shortAnswer.trim();
      mockDraft += `Regarding your short answer: "${shortText.substring(
        0,
        150
      )}${shortText.length > 150 ? '...' : ''}"\n\n`;

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

    // Provide feedback on long answer with more analysis
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

    // Reference previous mentor responses
    if (mentorResponses && mentorResponses.trim()) {
      const responseText = mentorResponses.trim();
      mockDraft += `Building on the previous mentor feedback: "${responseText.substring(
        0,
        100
      )}${responseText.length > 100 ? '...' : ''}"\n\n`;
      mockDraft += `I'd like to add to what was already shared. `;
    }

    // Add substantive mathematical feedback
    mockDraft += `Here are some additional thoughts to consider:\n\n`;
    mockDraft += `• What mathematical strategies did you use to approach this problem?\n`;
    mockDraft += `• Can you think of other ways to represent or solve this?\n`;
    mockDraft += `• How might you check if your solution makes sense?\n\n`;

    mockDraft += `Keep up the good mathematical thinking!`;

    return mockDraft;
  }
}

module.exports = AIService;
