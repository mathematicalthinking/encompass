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
    this.isDevelopment = true;
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
   * Makes an HTTP POST request to the AI service
   * @param {Object} requestBody - The request body to send
   * @returns {Promise<Object>} The response from the AI service
   */
  _makeAIRequest(requestBody) {
    return new Promise((resolve, reject) => {
      const postData = JSON.stringify(requestBody);

      const options = {
        hostname: this.apiEndpoint,
        path: this.apiPath,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(postData),
        },
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (res.statusCode >= 200 && res.statusCode < 300) {
              resolve(response);
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
      "Here's an AI-generated response based on the student's work:\n\n";

    if (shortAnswer && shortAnswer.trim()) {
      mockDraft += `I notice in your short answer that you wrote: "${shortAnswer.substring(
        0,
        100
      )}${shortAnswer.length > 100 ? '...' : ''}"\n\n`;
    }

    if (longAnswer && longAnswer.trim()) {
      mockDraft += `Looking at your detailed explanation, I can see your thinking process. `;
    }

    if (mentorResponses && mentorResponses.trim()) {
      mockDraft += `Building on previous mentor feedback, I'd like to add some additional thoughts.\n\n`;
    }

    mockDraft += `This is a mock AI response for development purposes. In production, this would contain personalized feedback based on the student's submission (ID: ${targetSubmissionId}).`;

    return mockDraft;
  }
}

module.exports = new AIService();
