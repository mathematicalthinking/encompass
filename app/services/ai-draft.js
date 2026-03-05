import Service from '@ember/service';
import { service } from '@ember/service';

/**
 * AI Draft Service
 *
 * Centralized service for AI draft generation functionality.
 * Handles student work validation and API communication for generating
 * AI-powered feedback drafts based on student submissions.
 */
export default class AiDraftService extends Service {
  @service store;

  /**
   * Checks if a submission has student work available for AI analysis
   *
   * Supports two data sources:
   * 1. Direct properties: submission.shortAnswer and submission.longAnswer (regular submissions)
   * 2. Answer relationship: answer.answer and answer.explanation (VMT submissions)
   *
   * @param {Object} submission
   * @returns {Boolean}
   */
  hasStudentWork(submission) {
    if (!submission) return false;

    // Check direct submission properties first
    let shortAnswer = submission.shortAnswer?.trim();
    let longAnswer = submission.longAnswer?.trim();

    // Fall back to answer relationship for VMT submissions
    if (!shortAnswer && !longAnswer) {
      const answerId = submission.belongsTo('answer').id();
      if (answerId) {
        const answer = this.store.peekRecord('answer', answerId);
        if (answer) {
          shortAnswer = answer.answer?.trim();
          longAnswer = answer.explanation?.trim();
        }
      }
    }

    return Boolean(shortAnswer || longAnswer);
  }

  /**
   * Generates an AI draft response for a given submission
   * A/B TEST MODIFICATION - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
   * A/B TEST MODIFICATION - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
   * A/B TEST MODIFICATION - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
   *
   * Makes API call to backend AI service which analyzes student work
   * and generates appropriate feedback.
   *
   * @param {String} submissionId - The ID of the submission to generate feedback for
   * @param {String} variant - Variant key ('A' or 'D')
   * @returns {Promise<String>} HTML string containing the generated draft
   * @throws {Error} If API call fails or no content is received
   */
  async generateDraft(
    submissionId,
    variant = 'A',
    workspaceId = null,
    options = {}
  ) {
    const includeMeta = Boolean(options.includeMeta);
    const params = new URLSearchParams({
      target: submissionId,
      variant,
    });
    if (workspaceId) {
      params.set('workspace', workspaceId);
    }
    const url = `/api/aiDraft?${params.toString()}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
    });

    if (!response.ok) {
      const raw = await response.text();
      let errMessage = 'Failed to generate AI draft';
      try {
        const parsed = JSON.parse(raw);
        errMessage = parsed.message || parsed.error || errMessage;
      } catch (e) {
        // Upstream errors may return HTML/plain text (e.g., 502), preserve status.
        errMessage = `Failed to generate AI draft (${response.status})`;
      }
      throw new Error(errMessage);
    }

    const raw = await response.text();
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      throw new Error('Invalid response format from AI draft endpoint');
    }
    if (!data || !data.draft) {
      throw new Error('No content received');
    }

    if (includeMeta) {
      return {
        draft: data.draft,
        requestId: data.requestId || null,
        variantLogId: data.variantLogId || null,
        variant: data.variant || variant,
      };
    }

    return data.draft;
  }
}
