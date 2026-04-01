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
  @tracked draftE = null;
  @tracked draftF = null;

  @tracked variantLogIdA = null;
  @tracked variantLogIdB = null;
  @tracked variantLogIdE = null;
  @tracked variantLogIdF = null;

  @tracked requestIdA = null;
  @tracked requestIdB = null;
  @tracked requestIdE = null;
  @tracked requestIdF = null;

  @tracked isReviewLoggedA = false;
  @tracked isReviewLoggedB = false;
  @tracked isReviewLoggedE = false;
  @tracked isReviewLoggedF = false;

  @tracked isLoggingReviewA = false;
  @tracked isLoggingReviewB = false;
  @tracked isLoggingReviewE = false;
  @tracked isLoggingReviewF = false;

  @tracked ratingA = 0;
  @tracked ratingB = 0;
  @tracked ratingE = 0;
  @tracked ratingF = 0;

  @tracked feedbackA = '';
  @tracked feedbackB = '';
  @tracked feedbackE = '';
  @tracked feedbackF = '';

  @tracked loadingVariant = null; // Track which variant is currently loading
  minFeedbackLength = 10;

  variants = [
    { code: 'A', displayLabel: 'A', label: 'Student work only (RAG on)' },
    {
      code: 'B',
      displayLabel: 'B',
      label: 'Student work + selections + comments (all) (RAG on)',
    },
    { code: 'E', displayLabel: 'E', label: 'Student work only (RAG off)' },
    {
      code: 'F',
      displayLabel: 'F',
      label: 'Student work + selections + comments (all) (RAG off)',
    },
  ];

  starDefinitions = [
    { value: 1, tooltip: 'Poor: Not useful, needs major changes' },
    { value: 2, tooltip: 'Fair: Somewhat useful but significant issues' },
    { value: 3, tooltip: 'Good: Moderately helpful with minor issues' },
    { value: 4, tooltip: 'Very Good: Helpful and well-formed' },
    { value: 5, tooltip: 'Excellent: Very useful, clear, and actionable' },
  ];

  _forVariant(variantCode, values) {
    return values[variantCode];
  }

  _getDraft(variantCode) {
    return this._forVariant(variantCode, {
      A: this.draftA,
      B: this.draftB,
      E: this.draftE,
      F: this.draftF,
    });
  }

  _getRating(variantCode) {
    return this._forVariant(variantCode, {
      A: this.ratingA,
      B: this.ratingB,
      E: this.ratingE,
      F: this.ratingF,
    });
  }

  _getFeedback(variantCode) {
    return this._forVariant(variantCode, {
      A: this.feedbackA,
      B: this.feedbackB,
      E: this.feedbackE,
      F: this.feedbackF,
    });
  }

  _getVariantLogId(variantCode) {
    return this._forVariant(variantCode, {
      A: this.variantLogIdA,
      B: this.variantLogIdB,
      E: this.variantLogIdE,
      F: this.variantLogIdF,
    });
  }

  _getRequestId(variantCode) {
    return this._forVariant(variantCode, {
      A: this.requestIdA,
      B: this.requestIdB,
      E: this.requestIdE,
      F: this.requestIdF,
    });
  }

  _getIsLoggingReview(variantCode) {
    return this._forVariant(variantCode, {
      A: this.isLoggingReviewA,
      B: this.isLoggingReviewB,
      E: this.isLoggingReviewE,
      F: this.isLoggingReviewF,
    });
  }

  _getIsReviewLogged(variantCode) {
    return this._forVariant(variantCode, {
      A: this.isReviewLoggedA,
      B: this.isReviewLoggedB,
      E: this.isReviewLoggedE,
      F: this.isReviewLoggedF,
    });
  }

  _setReviewLogged(variantCode, value) {
    switch (variantCode) {
      case 'A':
        this.isReviewLoggedA = value;
        break;
      case 'B':
        this.isReviewLoggedB = value;
        break;
      case 'E':
        this.isReviewLoggedE = value;
        break;
      case 'F':
        this.isReviewLoggedF = value;
        break;
      default:
        break;
    }
  }

  _setLoggingReview(variantCode, value) {
    switch (variantCode) {
      case 'A':
        this.isLoggingReviewA = value;
        break;
      case 'B':
        this.isLoggingReviewB = value;
        break;
      case 'E':
        this.isLoggingReviewE = value;
        break;
      case 'F':
        this.isLoggingReviewF = value;
        break;
      default:
        break;
    }
  }

  _resetReviewInputs(variantCode) {
    this._setReviewLogged(variantCode, false);
    switch (variantCode) {
      case 'A':
        this.ratingA = 0;
        this.feedbackA = '';
        break;
      case 'B':
        this.ratingB = 0;
        this.feedbackB = '';
        break;
      case 'E':
        this.ratingE = 0;
        this.feedbackE = '';
        break;
      case 'F':
        this.ratingF = 0;
        this.feedbackF = '';
        break;
      default:
        break;
    }
  }

  _applyGeneratedVariant(variantCode, draftText, variantLogId, requestId) {
    switch (variantCode) {
      case 'A':
        this.draftA = draftText;
        this.variantLogIdA = variantLogId;
        this.requestIdA = requestId;
        break;
      case 'B':
        this.draftB = draftText;
        this.variantLogIdB = variantLogId;
        this.requestIdB = requestId;
        break;
      case 'E':
        this.draftE = draftText;
        this.variantLogIdE = variantLogId;
        this.requestIdE = requestId;
        break;
      case 'F':
        this.draftF = draftText;
        this.variantLogIdF = variantLogId;
        this.requestIdF = requestId;
        break;
      default:
        break;
    }
    this._resetReviewInputs(variantCode);

    if (this.args.onVariantGenerated && variantLogId) {
      this.args.onVariantGenerated({
        variantKey: variantCode,
        variantLogId,
        requestId: requestId || null,
      });
    }
  }

  _canLogReview(variantCode) {
    const draft = this._getDraft(variantCode);
    const rating = this._getRating(variantCode);
    const feedback = this._getFeedback(variantCode);
    const isLogging = this._getIsLoggingReview(variantCode);

    return (
      Boolean(draft) &&
      rating > 0 &&
      feedback.trim().length >= this.minFeedbackLength &&
      !isLogging
    );
  }

  _bringDownTooltip(variantCode, variantLabel) {
    const draft = this._getDraft(variantCode);
    const rating = this._getRating(variantCode);
    const feedback = this._getFeedback(variantCode);
    const isReviewLogged = this._getIsReviewLogged(variantCode);

    if (!draft) return `Generate ${variantLabel} first`;
    if (rating <= 0) return `Rate ${variantLabel} before logging review`;
    if (feedback.trim().length < this.minFeedbackLength) {
      return `Add at least ${this.minFeedbackLength} characters of written feedback for ${variantLabel}`;
    }
    if (!isReviewLogged) {
      return `Log review for ${variantLabel} before bringing it down`;
    }
    return `Bring ${variantLabel} into the editor`;
  }

  _ratingLabel(variantCode) {
    const rating = this._getRating(variantCode);
    return rating > 0 ? `${rating} / 5` : 'No rating yet';
  }

  _logReviewButtonText(variantCode) {
    return this._getIsLoggingReview(variantCode) ? 'Logging...' : 'Log Review';
  }

  get isVariantADisabled() {
    return this.isLoading || this.loadingVariant === 'A';
  }

  get isVariantBDisabled() {
    return this.isLoading || this.loadingVariant === 'B';
  }

  get isVariantEDisabled() {
    return this.isLoading || this.loadingVariant === 'E';
  }

  get isVariantFDisabled() {
    return this.isLoading || this.loadingVariant === 'F';
  }

  get variantAButtonText() {
    return this.loadingVariant === 'A' ? 'Generating...' : 'Generate A';
  }

  get variantBButtonText() {
    return this.loadingVariant === 'B' ? 'Generating...' : 'Generate B';
  }

  get variantEButtonText() {
    return this.loadingVariant === 'E' ? 'Generating...' : 'Generate E';
  }

  get variantFButtonText() {
    return this.loadingVariant === 'F' ? 'Generating...' : 'Generate F';
  }

  get canBringDownA() {
    return Boolean(this.draftA) && this.isReviewLoggedA;
  }

  get canBringDownB() {
    return Boolean(this.draftB) && this.isReviewLoggedB;
  }

  get canBringDownE() {
    return Boolean(this.draftE) && this.isReviewLoggedE;
  }

  get canBringDownF() {
    return Boolean(this.draftF) && this.isReviewLoggedF;
  }

  get canLogReviewA() {
    return this._canLogReview('A');
  }

  get canLogReviewB() {
    return this._canLogReview('B');
  }

  get canLogReviewE() {
    return this._canLogReview('E');
  }

  get canLogReviewF() {
    return this._canLogReview('F');
  }

  get bringDownTooltipA() {
    return this._bringDownTooltip('A', 'Variant A');
  }

  get bringDownTooltipB() {
    return this._bringDownTooltip('B', 'Variant B');
  }

  get bringDownTooltipE() {
    return this._bringDownTooltip('E', 'Variant E');
  }

  get bringDownTooltipF() {
    return this._bringDownTooltip('F', 'Variant F');
  }

  get ratingLabelA() {
    return this._ratingLabel('A');
  }

  get ratingLabelB() {
    return this._ratingLabel('B');
  }

  get ratingLabelE() {
    return this._ratingLabel('E');
  }

  get ratingLabelF() {
    return this._ratingLabel('F');
  }

  get logReviewButtonTextA() {
    return this._logReviewButtonText('A');
  }

  get logReviewButtonTextB() {
    return this._logReviewButtonText('B');
  }

  get logReviewButtonTextE() {
    return this._logReviewButtonText('E');
  }

  get logReviewButtonTextF() {
    return this._logReviewButtonText('F');
  }

  @action
  isStarActive(variantCode, starNumber) {
    return this._getRating(variantCode) >= starNumber;
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
    switch (variantCode) {
      case 'A':
        this.ratingA = rating;
        break;
      case 'B':
        this.ratingB = rating;
        break;
      case 'E':
        this.ratingE = rating;
        break;
      case 'F':
        this.ratingF = rating;
        break;
      default:
        break;
    }
    this._setReviewLogged(variantCode, false);
  }

  @action
  setVariantFeedback(variantCode, event) {
    const value = event.target.value || '';
    switch (variantCode) {
      case 'A':
        this.feedbackA = value;
        break;
      case 'B':
        this.feedbackB = value;
        break;
      case 'E':
        this.feedbackE = value;
        break;
      case 'F':
        this.feedbackF = value;
        break;
      default:
        break;
    }
    this._setReviewLogged(variantCode, false);
  }

  @action
  async logVariantReview(variantCode) {
    const rating = this._getRating(variantCode);
    const feedback = this._getFeedback(variantCode);
    const variantLogId = this._getVariantLogId(variantCode);

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
    const canBringDown = this._forVariant(variantCode, {
      A: this.canBringDownA,
      B: this.canBringDownB,
      E: this.canBringDownE,
      F: this.canBringDownF,
    });

    if (!canBringDown) {
      return;
    }

    const draftText = this._getDraft(variantCode);
    if (!draftText) {
      return;
    }

    if (this.args.onDraftSelected) {
      this.args.onDraftSelected({
        draftText,
        variantKey: variantCode,
        variantLogId: this._getVariantLogId(variantCode),
        requestId: this._getRequestId(variantCode),
        rating: this._getRating(variantCode),
        writtenFeedback: this._getFeedback(variantCode),
      });
    }
  }
}
