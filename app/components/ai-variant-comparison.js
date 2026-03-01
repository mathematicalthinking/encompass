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
          break;
        case 'D':
          this.draftB = result;
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
    } catch (e) {
      console.error('Overall error:', e);
      this.error = e.message || 'Failed to generate drafts';
    } finally {
      this.isLoading = false;
    }
  }

  @action
  useDraft(variant) {
    let draftText;
    switch (variant) {
      case 'A':
        draftText = this.draftA;
        break;
      case 'B':
        draftText = this.draftB;
        break;
      case 'D':
        draftText = this.draftB;
        break;
    }
    if (this.args.onDraftSelected && draftText) {
      this.args.onDraftSelected(draftText);
    }
  }
}
