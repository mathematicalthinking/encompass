/**
 * Passed in by parent:
 * - model - the current submission model
 * - makingSelection
 * - showingSelections
 */
import Component from '@glimmer/component';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';

export default class SelectableAreaComponent extends Component {
  maxInitRetries = 60;
  @tracked currSubId = this.args.model?.id || null;
  @tracked selecting = this.args.makingSelection || false;
  @tracked showing = this.args.showingSelections || false;
  selections = [];
  currentSelections = null;
  imageTagging = null;
  selectionHighlighting = null;
  onCreateCallback = null;

  constructor() {
    super(...arguments);
    if (this.args.sels && !this.currentSelections) {
      this.currentSelections = this.args.sels;
    }
    this.setupTagging();
  }

  scheduleInitRetry(nextRetryCount) {
    if (typeof window !== 'undefined' && window.requestAnimationFrame) {
      window.requestAnimationFrame(() =>
        this.tryInitializeSelectionTools(nextRetryCount)
      );
      return;
    }

    setTimeout(() => this.tryInitializeSelectionTools(nextRetryCount), 16);
  }

  @action
  initializeSelectionTools() {
    this.tryInitializeSelectionTools(0);
  }

  tryInitializeSelectionTools(retryCount = 0) {
    if (this._toolsInitialized) return;

    const containerId = 'submission_container';
    const scrollableContainer = 'al_submission';
    const container = document.getElementById(containerId);
    const currentImageCount = container?.querySelectorAll('img').length || 0;
    const shouldWaitForImageNodes =
      this.args.makingSelection &&
      currentImageCount === 0 &&
      retryCount < this.maxInitRetries;

    if (!container && retryCount < this.maxInitRetries) {
      this.scheduleInitRetry(retryCount + 1);
      return;
    }

    if (!container) return;

    if (shouldWaitForImageNodes) {
      this.scheduleInitRetry(retryCount + 1);
      return;
    }

    this._toolsInitialized = true;

    if (container.style.position !== 'absolute') {
      container.style.position = 'relative';
    }

    this.selectionHighlighting = new window.SelectionHighlighting({
      selectableContainerId: containerId,
      automaticEvent: !this.isTouchScreen,
    });

    this.onCreateCallback = (id) => {
      const selection = this.selectionHighlighting.getSelection(id);
      selection.selectionType = 'selection';
      this.args.addSelection(selection);
    };

    this.selectionHighlighting.init(this.onCreateCallback);
    this.selectionHighlighting.enableSelection();

    this.imageTagging = new window.ImageTagging({
      targetContainer: containerId,
      isCompSelectionMode: this.args.makingSelection,
      scrollableContainer,
      autoScrollTriggerPadding: 6,
      autoScrollStep: 2,
      selectionBorder: '2px dashed #1D4ED8',
      selectionContrastDark: 'rgba(17, 24, 39, 0.95)',
      selectionContrastLight: 'rgba(255, 255, 255, 0.95)',
      selectionIndicatorBorderColor: '#1D4ED8',
      selectionIndicatorFillColor: '#FFFFFF',
      selectionIndicatorSize: 10,
    });

    this.imageTagging.onSave((id, isUpdateOnly) => {
      const tag = this.imageTagging.getTag(id);
      tag.selectionType = 'image-tag';
      this.args.addSelection(tag, isUpdateOnly);
    });

    this.imageTagging.loadTags(this.imgTags);
    this.imageTagging.enable();

    this.selectionHighlighting.loadSelections(this.selections);

    if (this.args.showingSelections) {
      this.selectionHighlighting.highlightAllSelections();
      this.imageTagging.showAllTags();
    }

    if (!this.args.makingSelection) {
      this.selectionHighlighting.disableSelection();
      this.imageTagging.disable();
    }

    this.args.setupResizeHandler();
  }

  @action
  updateShowingSelections(showing) {
    this.showing = showing;

    if (showing) {
      this.selectionHighlighting?.highlightAllSelections();
      this.imageTagging?.showAllTags();
    } else {
      this.selectionHighlighting?.removeAllHighlights();
      this.imageTagging?.removeAllTags();
    }
  }

  @action
  updateMakingSelections(selecting) {
    this.selecting = selecting;

    if (selecting) {
      this.selectionHighlighting?.enableSelection();
      this.imageTagging?.enable();
    } else {
      this.selectionHighlighting?.disableSelection();
      this.imageTagging?.disable();
    }
  }

  @action
  handleSubmissionChange(newId) {
    if (this.currSubId !== newId) {
      this.currSubId = newId;
      this.imageTagging?.removeAllTags();
      this.selectionHighlighting?.removeAllHighlights();
      this.args.handleTransition?.(true);
    }
  }

  @action
  updateSelections(sels) {
    const prevLength = this.currentSelections?.length ?? 0;
    const newLength = sels.length;
    const wasSelRemoved = prevLength > newLength;
    const contentJustLoaded = prevLength === 0 && newLength > 0;

    this.currentSelections = sels;

    if (
      contentJustLoaded &&
      this.selectionHighlighting &&
      this.onCreateCallback
    ) {
      this.selectionHighlighting.init(this.onCreateCallback);
      if (this.args.makingSelection) {
        this.selectionHighlighting.enableSelection();
      }
    }

    if (wasSelRemoved) {
      this.imageTagging?.removeAllTags();
      this.selectionHighlighting?.removeAllHighlights();
    }

    this.setupTagging();
    this.selectionHighlighting?.loadSelections(this.selections);
    this.imageTagging?.loadTags(this.imgTags);
  }

  setupTagging() {
    const selections = [];
    const imgTags = [];

    const modelSelections = this.args.model?.selections ?? [];

    const previousCount = this.selections?.length ?? 0;
    const newCount = modelSelections.filter((s) => !s.isTrashed).length;

    const contentJustLoaded = previousCount === 0 && newCount > 0;

    modelSelections.forEach((selection) => {
      if (selection.isTrashed) return;

      const coordsStr = selection.coordinates;
      if (!coordsStr) return;

      const coordsArray = coordsStr.trim().split(/\s+/);

      switch (coordsArray.length) {
        case 6: {
          selections.push({
            id: selection.id,
            coords: coordsStr,
            text: selection.text,
            comments: selection.comments,
          });
          break;
        }
        case 5: {
          const [parent, left, top, width, height] = coordsArray;
          imgTags.push({
            id: selection.id,
            parent,
            coords: { left, top },
            size: { width, height },
            note: selection.text,
            comments: selection.comments,
            relativeCoords: selection.relativeCoords,
            relativeSize: selection.relativeSize,
          });
          break;
        }
        default:
          // invalid or unexpected coordinate format, skip
          break;
      }
    });

    this.selections = selections;
    this.imgTags = imgTags;

    if (
      contentJustLoaded &&
      this.selectionHighlighting &&
      this.onCreateCallback
    ) {
      this.selectionHighlighting.init(this.onCreateCallback);
      if (this.args.makingSelection) {
        this.selectionHighlighting.enableSelection();
      }
    }
  }

  @action
  cleanup() {
    this.args.handleTransition(false);
    this.selectionHighlighting?.destroy();
    this.imageTagging?.destroy();
  }
}
