/**
 * Passed in by parent:
 * - model - the current submission model
 * - makingSelection
 * - showingSelections
 */
Encompass.SelectableAreaComponent = Ember.Component.extend({
  elementId: 'selectable-area',

  init: function() {
    this._super(...arguments);
    this.setupTagging();
  },

  didInsertElement: function() {
    this.set('currSubId', this.get('model.id'));
    this.set('selecting', this.get('makingSelection'));
    this.set('showing', this.get('showingSelections'));

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
      selectableContainerId: containerId
    });
    this.selectionHighlighting.init((id) => {
      let selection = this.selectionHighlighting.getSelection(id);
      selection.selectionType = 'selection';
      this.sendAction('addSelection', selection);
    });

    // set up the ImageTagging object
    this.imageTagging = new window.ImageTagging({
      targetContainer: containerId,
      isCompSelectionMode: this.get('makingSelection'),
      scrollableContainer: scrollableContainer,
    });
    this.imageTagging.onSave((id, isUpdateOnly) => {
      let tag = this.imageTagging.getTag(id);
      tag.selectionType = 'image-tag';
      this.sendAction('addSelection', tag, isUpdateOnly);
    });

    this.selectionHighlighting.loadSelections(this.get('selections'));
    this.imageTagging.loadTags(this.get('imgTags'));

    if (this.get('showingSelections')) {
      this.selectionHighlighting.highlightAllSelections();
      this.imageTagging.showAllTags();
    }
    if (!this.get('makingSelection')) {
      this.selectionHighlighting.disableSelection();
      this.imageTagging.disable();
    }
    this.get('setupResizeHandler')();

  },

  didReceiveAttrs() {
    let selections = this.get('sels');
    let currentSelections = this.get('currentSelections');
    if (!currentSelections) {
      this.set('currentSelections', selections);
    }
    this._super(...arguments);
  },

  didUpdateAttrs: function() {
    let highlighting = this.selectionHighlighting;
    let tagging = this.imageTagging;

    let currentSelsLength = this.get('currentSelections.length');
    let attrSelsLength = this.get('sels.length');

    if (attrSelsLength !== currentSelsLength) {
      this.set('currentSelections', this.get('sels'));
    }

    let wasSelRemoved = currentSelsLength > attrSelsLength;

    //submission was changed
    if (this.get('currSubId') !== this.get('model.id')) {
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

    highlighting.loadSelections(this.get('selections'));

    tagging.loadTags(this.get('imgTags'));

    let isSelecting = this.get('makingSelection');
    let isShowing = this.get('showingSelections');

    if (isSelecting !== this.get('selecting')) {
      // toggled from NOT selecting to now selecting
      if (isSelecting) {
        this.set('selecting', true);
        highlighting.enableSelection();
        tagging.enable();
      }

      // component is destroyed when toggling to not selecting
    }

    if (isShowing !== this.get('showing')) {
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
    } else if(isShowing) {
      // for when switching between submissions while showing selections
      highlighting.highlightAllSelections();
      tagging.showAllTags();
    }

  },

  setupTagging: function() {
    var selections = [];
    var imgTags = [];

    if (this.model) {
      this.model.get('selections').forEach(function(selection) {
        if (selection.get('isTrashed')) {
          return; // don't include trashed selections
        }

        var coordinates = selection.get('coordinates'),
            arrCoords = [];

        if(coordinates) {
          arrCoords = coordinates.split(' ');
        }
        if (arrCoords.length === 6) {
          selections[selections.length] = {
            id: selection.get('id'),
            coords: coordinates,
            text: selection.get('text'),
            comments: selection.get('comments')
          };
        } else if (arrCoords.length === 5) {
          imgTags[imgTags.length] = {
            id: selection.get('id'),
            parent: arrCoords[0],
            coords: {
              left: arrCoords[1],
              top: arrCoords[2]
            },
            size: {
              width: arrCoords[3],
              height: arrCoords[4]
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
      this.get('toggleShow')();
    }
  }


});
