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
  @tracked currSubId = this.args.model?.id || null;
  @tracked selecting = this.args.makingSelection || false;
  @tracked showing = this.args.showingSelections || false;
  @tracked selections = [];
  currentSelections = null;
  imageTagging = null;
  selectionHighlighting = null;

  constructor() {
    super(...arguments);
    if (this.args.sels && !this.currentSelections) {
      this.currentSelections = this.args.sels;
    }
    this.setupTagging();
  }

  @action
  initializeSelectionTools() {
    console.log('Initializing selection tools...');
    if (this._toolsInitialized) return;
    this._toolsInitialized = true;

    const containerId = 'submission_container';
    const scrollableContainer = 'al_submission';
    const container = document.getElementById(containerId);
    console.log('Container:', container);

    if (!container) return;

    if (container.style.position !== 'absolute') {
      container.style.position = 'relative';
    }

    this.selectionHighlighting = new window.SelectionHighlighting({
      selectableContainerId: containerId,
      automaticEvent: !this.isTouchScreen,
    });

    console.log('SelectionHighlighting:', this.selectionHighlighting);

    this.selectionHighlighting.init((id) => {
      console.log('Selection created with ID:', id);
      const selection = this.selectionHighlighting.getSelection(id);
      selection.selectionType = 'selection';
      this.args.addSelection(selection);
    });

    this.selectionHighlighting.enableSelection();

    this.imageTagging = new window.ImageTagging({
      targetContainer: containerId,
      isCompSelectionMode: this.args.makingSelection,
      scrollableContainer,
    });

    this.imageTagging.onSave((id, isUpdateOnly) => {
      const tag = this.imageTagging.getTag(id);
      tag.selectionType = 'image-tag';
      this.args.addSelection(tag, isUpdateOnly);
    });

    this.setupTagging();

    this.imageTagging.loadTags(this.imgTags);
    this.imageTagging.enable();

    console.log('about to load selections:', this.selections);

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
    const prevLength = this.currentSelections.length;
    const newLength = sels.length;
    const wasSelRemoved = prevLength > newLength;

    this.currentSelections = sels;

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

    const modelSelections = this.model?.selections ?? [];

    modelSelections.forEach((selection) => {
      if (selection.isTrashed) return;

      const coordsStr = selection.coordinates;
      if (!coordsStr) return;

      const coordsArray = coordsStr.split(' ');

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
  }

  @action
  cleanup() {
    this.args.handleTransition(false);
    this.selectionHighlighting.destroy();
    this.imageTagging.destroy();
  }
}
