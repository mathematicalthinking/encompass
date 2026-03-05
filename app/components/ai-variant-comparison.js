// TEMPORARY A/B TEST CODE - REMOVE AFTER TESTING PERIOD
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { service } from '@ember/service';

// TEMPORARY A/B TEST CODE
export default class AiVariantComparisonComponent extends Component {
  @service('ai-draft') aiDraft;
  @tracked isLoading = false;
  @tracked error = null;

  @tracked draftA = null;
  @tracked draftB = null;
  @tracked variantLogIdA = null;
  @tracked variantLogIdD = null;
  @tracked requestIdA = null;
  @tracked requestIdD = null;
  @tracked isReviewLoggedA = false;
  @tracked isReviewLoggedD = false;
  @tracked isLoggingReviewA = false;
  @tracked isLoggingReviewD = false;
  @tracked ratingA = 0;
  @tracked ratingD = 0;
  @tracked feedbackA = '';
  @tracked feedbackD = '';

  @tracked loadingVariant = null; // Track which variant is currently loading
  minFeedbackLength = 10;

  variants = [
    { code: 'A', displayLabel: 'A', label: 'Student work only' },
    {
      code: 'D',
      displayLabel: 'B',
      label: 'Student work + selections + comments',
    },
  ];

  get isVariantADisabled() {
    return this.isLoading || this.loadingVariant === 'A';
  }

  get isVariantBDisabled() {
    return this.isLoading || this.loadingVariant === 'D';
  }

  get variantAButtonText() {
    return this.loadingVariant === 'A' ? 'Generating...' : 'Generate A';
  }

  get variantBButtonText() {
    return this.loadingVariant === 'D' ? 'Generating...' : 'Generate B';
  }

  starDefinitions = [
    { value: 1, tooltip: 'Poor: Not useful, needs major changes' },
    { value: 2, tooltip: 'Fair: Somewhat useful but significant issues' },
    { value: 3, tooltip: 'Good: Moderately helpful with minor issues' },
    { value: 4, tooltip: 'Very Good: Helpful and well-formed' },
    { value: 5, tooltip: 'Excellent: Very useful, clear, and actionable' },
  ];

  _forVariant(variantCode, valueA, valueD) {
    return variantCode === 'A' ? valueA : valueD;
  }

  _setReviewLogged(variantCode, value) {
    if (variantCode === 'A') {
      this.isReviewLoggedA = value;
      return;
    }
    this.isReviewLoggedD = value;
  }

  _setLoggingReview(variantCode, value) {
    if (variantCode === 'A') {
      this.isLoggingReviewA = value;
      return;
    }
    this.isLoggingReviewD = value;
  }

  _resetReviewInputs(variantCode) {
    this._setReviewLogged(variantCode, false);
    if (variantCode === 'A') {
      this.ratingA = 0;
      this.feedbackA = '';
      return;
    }
    this.ratingD = 0;
    this.feedbackD = '';
  }

  _applyGeneratedVariant(variantCode, draftText, variantLogId, requestId) {
    if (variantCode === 'A') {
      this.draftA = draftText;
      this.variantLogIdA = variantLogId;
      this.requestIdA = requestId;
    } else {
      this.draftB = draftText;
      this.variantLogIdD = variantLogId;
      this.requestIdD = requestId;
    }
    this._resetReviewInputs(variantCode);
  }

  _canLogReview(variantCode) {
    const draft = this._forVariant(variantCode, this.draftA, this.draftB);
    const rating = this._forVariant(variantCode, this.ratingA, this.ratingD);
    const feedback = this._forVariant(
      variantCode,
      this.feedbackA,
      this.feedbackD
    );
    const isLogging = this._forVariant(
      variantCode,
      this.isLoggingReviewA,
      this.isLoggingReviewD
    );
    return (
      Boolean(draft) &&
      rating > 0 &&
      feedback.trim().length >= this.minFeedbackLength &&
      !isLogging
    );
  }

  get canBringDownA() {
    return Boolean(this.draftA) && this.isReviewLoggedA;
  }

  get canBringDownD() {
    return Boolean(this.draftB) && this.isReviewLoggedD;
  }

  get canLogReviewA() {
    return this._canLogReview('A');
  }

  get canLogReviewD() {
    return this._canLogReview('D');
  }

  get bringDownTooltipA() {
    if (!this.draftA) return 'Generate Variant A first';
    if (this.ratingA <= 0) return 'Rate Variant A before logging review';
    if (this.feedbackA.trim().length < this.minFeedbackLength) {
      return `Add at least ${this.minFeedbackLength} characters of written feedback for Variant A`;
    }
    if (!this.isReviewLoggedA) {
      return 'Log review for Variant A before bringing it down';
    }
    return 'Bring Variant A into the editor';
  }

  get bringDownTooltipB() {
    if (!this.draftB) return 'Generate Variant B first';
    if (this.ratingD <= 0) return 'Rate Variant B before logging review';
    if (this.feedbackD.trim().length < this.minFeedbackLength) {
      return `Add at least ${this.minFeedbackLength} characters of written feedback for Variant B`;
    }
    if (!this.isReviewLoggedD) {
      return 'Log review for Variant B before bringing it down';
    }
    return 'Bring Variant B into the editor';
  }

  get ratingLabelA() {
    return this.ratingA > 0 ? `${this.ratingA} / 5` : 'No rating yet';
  }

  get ratingLabelB() {
    return this.ratingD > 0 ? `${this.ratingD} / 5` : 'No rating yet';
  }

  get logReviewButtonTextA() {
    return this.isLoggingReviewA ? 'Logging...' : 'Log Review';
  }

  get logReviewButtonTextB() {
    return this.isLoggingReviewD ? 'Logging...' : 'Log Review';
  }

  @action
  isStarActive(variantCode, starNumber) {
    const rating = variantCode === 'A' ? this.ratingA : this.ratingD;
    return rating >= starNumber;
  }

  @action
  async generateSingleVariant(submission, variantCode) {
    this.loadingVariant = variantCode;
    this.error = null;

    try {
      const workspaceId = this.args.workspace?.id;
      const result = await this.aiDraft.generateDraft(
        submission.id,
        variantCode,
        workspaceId,
        { includeMeta: true }
      );

      // Set the appropriate tracked property
      this._applyGeneratedVariant(
        variantCode,
        result.draft,
        result.variantLogId || null,
        result.requestId || null
      );
    } catch (error) {
      console.error(`Error generating variant ${variantCode}:`, error);
      this.error = `Failed to generate variant ${variantCode}: ${error.message}`;
    } finally {
      this.loadingVariant = null;
    }
  }

  @action
  async generateAllVariants(submission) {
    this.isLoading = true;
    this.error = null;
    try {
      const workspaceId = this.args.workspace?.id;
      const results = await Promise.all(
        this.variants.map(async (v) => {
          try {
            const result = await this.aiDraft.generateDraft(
              submission.id,
              v.code,
              workspaceId,
              { includeMeta: true }
            );
            return { variantCode: v.code, result };
          } catch (error) {
            console.error(`Error generating variant ${v.code}:`, error);
            return { variantCode: v.code, error: error.message };
          }
        })
      );

      results.forEach(({ variantCode, result, error }) => {
        const draftText = error ? `Error: ${error}` : result?.draft;
        const variantLogId = result?.variantLogId || null;
        const requestId = result?.requestId || null;
        this._applyGeneratedVariant(
          variantCode,
          draftText,
          variantLogId,
          requestId
        );
      });
    } catch (e) {
      console.error('Overall error:', e);
      this.error = e.message || 'Failed to generate drafts';
    } finally {
      this.isLoading = false;
    }
  }

  @action
  setVariantRating(variantCode, rating) {
    if (variantCode === 'A') {
      this.ratingA = rating;
      this._setReviewLogged(variantCode, false);
      return;
    }
    if (variantCode === 'D') {
      this.ratingD = rating;
      this._setReviewLogged(variantCode, false);
    }
  }

  @action
  setVariantFeedback(variantCode, event) {
    const value = event.target.value || '';
    if (variantCode === 'A') {
      this.feedbackA = value;
      this._setReviewLogged(variantCode, false);
      return;
    }
    if (variantCode === 'D') {
      this.feedbackD = value;
      this._setReviewLogged(variantCode, false);
    }
  }

  @action
  async logVariantReview(variantCode) {
    const rating = this._forVariant(variantCode, this.ratingA, this.ratingD);
    const feedback = this._forVariant(
      variantCode,
      this.feedbackA,
      this.feedbackD
    );
    const variantLogId = this._forVariant(
      variantCode,
      this.variantLogIdA,
      this.variantLogIdD
    );

    if (rating <= 0 || feedback.trim().length < this.minFeedbackLength) {
      return;
    }

    if (!variantLogId) {
      this.error = `Variant ${variantCode} review could not be logged because variantLogId is missing. Generate the variant again and retry.`;
      return;
    }

    this._setLoggingReview(variantCode, true);
    this.error = null;
    try {
      const response = await fetch(`/api/aiVariants/${variantLogId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          aiVariant: {
            rating,
            teacherNotes: feedback,
          },
        }),
      });

      if (!response.ok) {
        let errMessage = `Failed to log review for variant ${variantCode}`;
        try {
          const parsed = await response.json();
          errMessage = parsed.message || parsed.error || errMessage;
        } catch (e) {
          // Best-effort parse only; keep default message.
        }
        throw new Error(errMessage);
      }

      this._setReviewLogged(variantCode, true);
    } catch (error) {
      console.error(`Error logging review for variant ${variantCode}:`, error);
      this.error =
        error.message || `Failed to log review for variant ${variantCode}`;
    } finally {
      this._setLoggingReview(variantCode, false);
    }
  }

  @action
  bringDownVariant(variantCode) {
    const canBringDown =
      variantCode === 'A' ? this.canBringDownA : this.canBringDownD;
    if (!canBringDown) {
      return;
    }

    const draftText = variantCode === 'A' ? this.draftA : this.draftB;
    if (!draftText) {
      return;
    }

    if (this.args.onDraftSelected && draftText) {
      this.args.onDraftSelected({
        draftText,
        variantKey: variantCode,
        variantLogId: this._forVariant(
          variantCode,
          this.variantLogIdA,
          this.variantLogIdD
        ),
        requestId: this._forVariant(
          variantCode,
          this.requestIdA,
          this.requestIdD
        ),
      });
    }
  }
}
