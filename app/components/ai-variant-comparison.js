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
  @tracked draftC = null;
  @tracked draftD = null;

  @tracked loadingVariant = null; // Track which variant is currently loading

  variants = [
    { code: 'A', label: 'Student work only' },
    { code: 'B', label: 'Student work + teacher selections' },
    { code: 'C', label: 'Student work + teacher comments' },
    { code: 'D', label: 'Student work + selections + comments' },
  ];

  get isVariantADisabled() {
    return this.isLoading || this.loadingVariant === 'A';
  }

  get isVariantBDisabled() {
    return this.isLoading || this.loadingVariant === 'B';
  }

  get isVariantCDisabled() {
    return this.isLoading || this.loadingVariant === 'C';
  }

  get isVariantDDisabled() {
    return this.isLoading || this.loadingVariant === 'D';
  }

  get variantAButtonText() {
    return this.loadingVariant === 'A' ? 'Generating...' : 'Generate A';
  }

  get variantBButtonText() {
    return this.loadingVariant === 'B' ? 'Generating...' : 'Generate B';
  }

  get variantCButtonText() {
    return this.loadingVariant === 'C' ? 'Generating...' : 'Generate C';
  }

  get variantDButtonText() {
    return this.loadingVariant === 'D' ? 'Generating...' : 'Generate D';
  }

  @action
  async generateSingleVariant(submission, variantCode) {
    console.log(
      `Starting generateSingleVariant for variant ${variantCode}, submission:`,
      submission?.id
    );
    console.log('Workspace:', this.args.workspace?.id);

    this.loadingVariant = variantCode;
    this.error = null;

    try {
      const workspaceId = this.args.workspace?.id;
      console.log(
        `Generating variant ${variantCode} for workspace ${workspaceId}...`
      );

      const result = await this.aiDraft.generateDraft(
        submission.id,
        variantCode,
        workspaceId
      );
      console.log(`Variant ${variantCode} completed successfully`);

      // Set the appropriate tracked property
      switch (variantCode) {
        case 'A':
          this.draftA = result;
          break;
        case 'B':
          this.draftB = result;
          break;
        case 'C':
          this.draftC = result;
          break;
        case 'D':
          this.draftD = result;
          break;
      }

      console.log(`Variant ${variantCode} set successfully`);
    } catch (error) {
      console.error(`Error generating variant ${variantCode}:`, error);
      this.error = `Failed to generate variant ${variantCode}: ${error.message}`;
    } finally {
      this.loadingVariant = null;
    }
  }

  @action
  async generateAllVariants(submission) {
    console.log('Starting generateAllVariants for submission:', submission?.id);
    console.log('Workspace:', this.args.workspace?.id);
    this.isLoading = true;
    this.error = null;
    try {
      const workspaceId = this.args.workspace?.id;
      const results = await Promise.all(
        this.variants.map(async (v) => {
          console.log(
            `Generating variant ${v.code} for workspace ${workspaceId}...`
          );
          try {
            const result = await this.aiDraft.generateDraft(
              submission.id,
              v.code,
              workspaceId
            );
            console.log(`Variant ${v.code} completed successfully`);
            return result;
          } catch (error) {
            console.error(`Error generating variant ${v.code}:`, error);
            return `Error: ${error.message}`;
          }
        })
      );
      console.log('All results received, setting individual drafts...');
      this.draftA = results[0];
      this.draftB = results[1];
      this.draftC = results[2];
      this.draftD = results[3];
      console.log('Individual drafts set successfully');
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
      case 'C':
        draftText = this.draftC;
        break;
      case 'D':
        draftText = this.draftD;
        break;
    }
    if (this.args.onDraftSelected && draftText) {
      this.args.onDraftSelected(draftText);
    }
  }
}
