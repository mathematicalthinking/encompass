// TEMPORARY A/B TEST CODE - REMOVE AFTER TESTING PERIOD
// TEMPORARY A/B TEST CODE - REMOVE AFTER TESTING PERIOD
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
  @tracked ratingA = 0;
  @tracked ratingD = 0;
  @tracked feedbackA = '';
  @tracked feedbackD = '';

  @tracked loadingVariant = null; // Track which variant is currently loading

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

  get canBringDownA() {
    return Boolean(this.draftA);
  }

  get canBringDownD() {
    return Boolean(this.draftB);
  }

  get ratingLabelA() {
    return this.ratingA > 0 ? `${this.ratingA} / 5` : 'No rating yet';
  }

  get ratingLabelB() {
    return this.ratingD > 0 ? `${this.ratingD} / 5` : 'No rating yet';
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
        workspaceId
      );

      // Set the appropriate tracked property
      switch (variantCode) {
        case 'A':
          this.draftA = result;
          this.ratingA = 0;
          this.feedbackA = '';
          break;
        case 'D':
          this.draftB = result;
          this.ratingD = 0;
          this.feedbackD = '';
          break;
      }
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
              workspaceId
            );
            return result;
          } catch (error) {
            console.error(`Error generating variant ${v.code}:`, error);
            return `Error: ${error.message}`;
          }
        })
      );
      this.draftA = results[0];
      this.draftB = results[1];
      this.ratingA = 0;
      this.ratingD = 0;
      this.feedbackA = '';
      this.feedbackD = '';
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
      return;
    }
    if (variantCode === 'D') {
      this.ratingD = rating;
    }
  }

  @action
  setVariantFeedback(variantCode, event) {
    const value = event.target.value || '';
    if (variantCode === 'A') {
      this.feedbackA = value;
      return;
    }
    if (variantCode === 'D') {
      this.feedbackD = value;
    }
  }

  @action
  bringDownVariant(variantCode) {
    const draftText = variantCode === 'A' ? this.draftA : this.draftB;
    if (!draftText) {
      return;
    }

    if (this.args.onDraftSelected && draftText) {
      this.args.onDraftSelected(draftText);
    }
  }
}
