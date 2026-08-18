import Modifier from 'ember-modifier';
import { registerDestructor } from '@ember/destroyable';

function cleanup(instance) {
  instance.destroyTools();
  instance.currentArgs.handleTransition?.(false);
}

export default class SelectionToolsModifier extends Modifier {
  element = null;
  container = null;
  scrollableContainer = null;
  selectionHighlighting = null;
  imageTagging = null;
  observer = null;
  currentArgs = {};
  submissionId = null;
  selectionsKey = null;

  constructor(owner, args) {
    super(owner, args);
    registerDestructor(this, cleanup);
  }

  modify(element, positional, named) {
    this.element = element;
    this.currentArgs = named;

    const submissionChanged = this.submissionId !== named.submissionId;
    this.submissionId = named.submissionId;

    if (!this.container || submissionChanged) {
      this.initialize();
      return;
    }

    const selectionsKey = this.buildSelectionsKey(named.selections);
    if (selectionsKey !== this.selectionsKey) {
      this.loadSelections();
    }

    this.setSelecting(named.makingSelection);
    this.setShowing(named.showingSelections);
  }

  initialize() {
    this.destroyTools();

    this.container = this.element.querySelector('[data-selection-container]');
    this.scrollableContainer = this.element.closest(
      '[data-selection-scroll-container]'
    );

    if (!this.container || !this.scrollableContainer) {
      this.observeContent();
      return;
    }

    this.container.style.position = 'relative';
    this.initializeTextSelection();
    this.initializeImageTagging();
    this.loadSelections();
    this.setSelecting(this.currentArgs.makingSelection);
    this.setShowing(this.currentArgs.showingSelections);
    this.observeContent();
    this.element.addEventListener('load', this.handleImageLoad, true);
    this.currentArgs.setupResizeHandler?.();
  }

  initializeTextSelection() {
    this.selectionHighlighting = new window.SelectionHighlighting({
      selectableContainer: this.container,
    });
    this.selectionHighlighting.init((id) => {
      const selection = this.selectionHighlighting?.getSelection(id);
      if (!selection) return;

      selection.selectionType = 'selection';
      this.currentArgs.addSelection(selection);
    });
  }

  initializeImageTagging() {
    this.imageTagging?.destroy();
    this.imageTagging = new window.ImageTagging({
      targetContainer: this.container,
      isCompSelectionMode: this.currentArgs.makingSelection,
      scrollableContainer: this.scrollableContainer,
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
      const tag = this.imageTagging?.getTag(id);
      if (!tag) return;

      tag.selectionType = 'image-tag';
      this.currentArgs.addSelection(tag, isUpdateOnly);
    });
  }

  observeContent() {
    this.observer?.disconnect();
    this.observer = new MutationObserver((mutations) => {
      const contentMutations = mutations.filter(
        (mutation) => !this.isSelectionToolNode(mutation.target)
      );
      const imageChanged = contentMutations.some((mutation) =>
        [...mutation.addedNodes, ...mutation.removedNodes].some((node) =>
          this.containsImage(node)
        )
      );
      const textChanged = contentMutations.some((mutation) =>
        [...mutation.addedNodes, ...mutation.removedNodes].some((node) =>
          this.containsSelectableContent(node)
        )
      );

      if (!this.container) {
        this.initialize();
      } else if (imageChanged || textChanged) {
        if (textChanged) {
          this.selectionHighlighting?.destroy();
          this.initializeTextSelection();
        }
        if (imageChanged) {
          this.initializeImageTagging();
        }
        this.loadSelections();
        this.setSelecting(this.currentArgs.makingSelection);
        this.setShowing(this.currentArgs.showingSelections);
      }
    });
    this.observer.observe(this.element, { childList: true, subtree: true });
  }

  containsImage(node) {
    return (
      node.nodeName === 'IMG' ||
      (node.nodeType === Node.ELEMENT_NODE && node.querySelector('img'))
    );
  }

  containsSelectableContent(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent.trim().length > 0;
    }
    return (
      node.nodeType === Node.ELEMENT_NODE && !this.isSelectionToolNode(node)
    );
  }

  isSelectionToolNode(node) {
    const element =
      node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
    const id = element?.id ?? '';
    return [
      'img-tag-',
      'tag-list-',
      'enc-highlight-',
      'sel-box',
      'confirm-img-sel',
      'cancel-img-sel',
      'confirm-text-sel',
    ].some((prefix) => id.startsWith(prefix));
  }

  handleImageLoad = (event) => {
    if (event.target.nodeName === 'IMG') {
      this.setShowing(this.currentArgs.showingSelections);
    }
  };

  loadSelections() {
    const { textSelections, imageTags } = this.prepareSelections(
      this.currentArgs.selections
    );

    this.selectionsKey = this.buildSelectionsKey(this.currentArgs.selections);
    this.selectionHighlighting?.removeAllHighlights();
    this.imageTagging?.removeAllTags(true);
    this.selectionHighlighting?.loadSelections(textSelections);
    this.imageTagging?.loadTags(imageTags);
  }

  prepareSelections(selections = []) {
    const textSelections = [];
    const imageTags = [];

    selections.forEach((selection) => {
      if (selection.isTrashed || !selection.coordinates) return;

      const coords = selection.coordinates.trim().split(/\s+/);
      if (coords.length === 6) {
        textSelections.push({
          id: selection.id,
          coords: selection.coordinates,
          text: selection.text,
          comments: selection.comments,
        });
      } else if (coords.length === 5) {
        const [parent, left, top, width, height] = coords;
        imageTags.push({
          id: selection.id,
          parent,
          coords: { left, top },
          size: { width, height },
          note: selection.text,
          comments: selection.comments,
          relativeCoords: selection.relativeCoords,
          relativeSize: selection.relativeSize,
          imageSrc: selection.imageSrc || selection.imageTagLink,
        });
      }
    });

    return { textSelections, imageTags };
  }

  buildSelectionsKey(selections = []) {
    return selections
      .map((selection) => {
        const relativeCoords = selection.relativeCoords ?? {};
        const relativeSize = selection.relativeSize ?? {};
        return [
          selection.id,
          selection.coordinates,
          relativeCoords.tagLeftPct,
          relativeCoords.tagTopPct,
          relativeSize.widthPct,
          relativeSize.heightPct,
          selection.isTrashed,
        ].join(':');
      })
      .join('|');
  }

  setSelecting(selecting) {
    if (selecting) {
      this.selectionHighlighting?.enableSelection();
      this.imageTagging?.enable();
    } else {
      this.selectionHighlighting?.disableSelection();
      this.imageTagging?.disable();
    }
  }

  setShowing(showing) {
    if (showing) {
      this.selectionHighlighting?.highlightAllSelections();
      this.imageTagging?.showAllTags();
    } else {
      this.selectionHighlighting?.removeAllHighlights();
      this.imageTagging?.removeAllTags();
    }
  }

  destroyTools() {
    this.observer?.disconnect();
    this.observer = null;
    this.element?.removeEventListener('load', this.handleImageLoad, true);
    this.selectionHighlighting?.destroy();
    this.imageTagging?.destroy();
    this.selectionHighlighting = null;
    this.imageTagging = null;
    this.container = null;
    this.scrollableContainer = null;
    this.currentArgs.removeResizeHandler?.();
  }
}
