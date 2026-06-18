import Service from '@ember/service';
import { service } from '@ember/service';

const relationshipId = (record, relationshipName) => {
  try {
    return record?.belongsTo?.(relationshipName)?.id?.() || null;
  } catch (error) {
    return null;
  }
};

const relationshipValue = (record, relationshipName) => {
  try {
    return record?.belongsTo?.(relationshipName)?.value?.() || null;
  } catch (error) {
    return null;
  }
};

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
   * Supports direct submission text/images and answer-linked text/images.
   *
   * @param {Object} submission
   * @returns {Boolean}
   */
  hasStudentWork(submission) {
    if (!submission) return false;

    // Check direct submission properties first
    let shortAnswer = submission.shortAnswer?.trim();
    let longAnswer = submission.longAnswer?.trim();
    const hasUploadedImage = Boolean(submission.uploadedFile?.savedFileName);
    const answerId = relationshipId(submission, 'answer');
    const answer =
      relationshipValue(submission, 'answer') ||
      (answerId ? this.store.peekRecord('answer', answerId) : null);

    if (answer) {
      shortAnswer ||= answer.answer?.trim();
      longAnswer ||= answer.explanation?.trim();
    }

    const hasAnswerImage = Boolean(
      relationshipId(answer, 'explanationImage') ||
        relationshipId(answer, 'additionalImage') ||
        answer?.explanationImage?.id ||
        answer?.additionalImage?.id
    );

    return Boolean(
      shortAnswer || longAnswer || hasUploadedImage || hasAnswerImage
    );
  }

  /**
   * Generates an AI draft response for a given submission
   * A/B TEST MODIFICATION - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
   * A/B TEST MODIFICATION - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
   * A/B TEST MODIFICATION - NEEDS TWEAKING ONCE PREFERRED VARIANT IS FINALIZED
   *
   * The browser sends only the submission ID. The Encompass backend chooses
   * generate-draft or generate-draft-ocr and keeps the OCR API key server-side.
   *
   * @param {String} submissionId - The ID of the submission to generate feedback for
   * @param {String} variant - Variant key ('A', 'B', 'E', or 'F'); legacy aliases C/D are accepted server-side
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
        errMessage =
          parsed.message ||
          parsed.error ||
          parsed.errors?.[0]?.detail ||
          errMessage;
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
