/**
 * Passed in by parent:
 * - model - the current submission model
 * - makingSelection
 * - showingSelections
 */
import Component from '@ember/component';
import $ from 'jquery';

export default Component.extend({
  elementId: 'selectable-area',

  init: function () {
    this._super(...arguments);
    this.setupTagging();
  },

  didInsertElement: function () {
    this.set('currSubId', this.model.id);
    this.set('selecting', this.makingSelection);
    this.set('showing', this.showingSelections);

    let containerId = 'submission_container';
    let scrollableContainer = 'al_submission';
    let container = document.getElementById(containerId);

    if (!container) {
      return;
    }

    if (container.style.position !== 'absolute') {
      container.style.position = 'relative';
    }

    // set up the SelectionHighlighting object
    this.selectionHighlighting = new SelectionHighlighting({
      selectableContainerId: containerId,
      automaticEvent: !this.isTouchScreen,
    });
    this.selectionHighlighting.init((id) => {
      let selection = this.selectionHighlighting.getSelection(id);
      selection.selectionType = 'selection';
      this.sendAction('addSelection', selection);
    });

    // set up the ImageTagging object
    this.imageTagging = new window.ImageTagging({
      targetContainer: containerId,
      isCompSelectionMode: this.makingSelection,
      scrollableContainer: scrollableContainer,
    });
    this.imageTagging.onSave((id, isUpdateOnly) => {
      let tag = this.imageTagging.getTag(id);
      tag.selectionType = 'image-tag';
      this.sendAction('addSelection', tag, isUpdateOnly);
    });

    this.selectionHighlighting.loadSelections(this.selections);
    this.imageTagging.loadTags(this.imgTags);

    if (this.showingSelections) {
      this.selectionHighlighting.highlightAllSelections();
      this.imageTagging.showAllTags();
    }
    if (!this.makingSelection) {
      this.selectionHighlighting.disableSelection();
      this.imageTagging.disable();
    }
    this.setupResizeHandler();
  },

  didReceiveAttrs() {
    let selections = this.sels;
    let currentSelections = this.currentSelections;
    if (!currentSelections) {
      this.set('currentSelections', selections);
    }
    this._super(...arguments);
  },

  didUpdateAttrs: function () {
    let highlighting = this.selectionHighlighting;
    let tagging = this.imageTagging;

    let currentSelsLength = this.currentSelections.length;
    let attrSelsLength = this.sels.length;

    if (attrSelsLength !== currentSelsLength) {
      this.set('currentSelections', this.sels);
    }

    let wasSelRemoved = currentSelsLength > attrSelsLength;

    //submission was changed
    if (this.currSubId !== this.model.id) {
      this.imageTagging.removeAllTags();
      this.set('makingSelection', false);
      this.set('showingSelections', false);
      return this.sendAction('handleTransition', true);
    }
    if (wasSelRemoved) {
      tagging.removeAllTags();
      highlighting.removeAllHighlights();
    }
    this.setupTagging();

    highlighting.loadSelections(this.selections);

    tagging.loadTags(this.imgTags);

    let isSelecting = this.makingSelection;
    let isShowing = this.showingSelections;

    if (isSelecting !== this.selecting) {
      // toggled from NOT selecting to now selecting
      if (isSelecting) {
        this.set('selecting', true);
        highlighting.enableSelection();
        tagging.enable();
      } else {
        // toggled from selection to now not selecting
        this.set('selecting', false);
        highlighting.disableSelection();
        tagging.disable();
      }
    }

    if (isShowing !== this.showing) {
      if (isShowing) {
        // toggled from NOT showing selections to now showing selections
        this.set('showing', true);
        highlighting.highlightAllSelections();
        tagging.showAllTags();
      } else {
        // toggled from showing selections to now NOT showing selections
        this.set('showing', false);
        highlighting.removeAllHighlights();
        tagging.removeAllTags();
      }
    } else if (isShowing) {
      // for when switching between submissions while showing selections
      highlighting.highlightAllSelections();
      tagging.showAllTags();
    }
  },

  setupTagging: function () {
    var selections = [];
    var imgTags = [];

    if (this.model) {
      this.model.get('selections').forEach(function (selection) {
        if (selection.get('isTrashed')) {
          return; // don't include trashed selections
        }

        var coordinates = selection.get('coordinates'),
          arrCoords = [];

        if (coordinates) {
          arrCoords = coordinates.split(' ');
        }
        if (arrCoords.length === 6) {
          selections[selections.length] = {
            id: selection.get('id'),
            coords: coordinates,
            text: selection.get('text'),
            comments: selection.get('comments'),
          };
        } else if (arrCoords.length === 5) {
          imgTags[imgTags.length] = {
            id: selection.get('id'),
            parent: arrCoords[0],
            coords: {
              left: arrCoords[1],
              top: arrCoords[2],
            },
            size: {
              width: arrCoords[3],
              height: arrCoords[4],
            },
            note: selection.get('text'),
            comments: selection.get('comments'),
            relativeCoords: selection.get('relativeCoords'),
            relativeSize: selection.get('relativeSize'),
          };
        }
      });
      this.set('selections', selections);
      this.set('imgTags', imgTags);
    }
  },

  willDestroyElement() {
    this.sendAction('handleTransition', false);
    this.selectionHighlighting.destroy();
    this.imageTagging.destroy();
    $(window).off('resize.selectableArea');
    this._super(...arguments);
  },

  actions: {
    toggleShow() {
      this.toggleShow();
    },
  },
});
