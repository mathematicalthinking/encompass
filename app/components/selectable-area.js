/**
 * Passed in by parent:
 * - model - the current submission model
 * - makingSelection
 * - showingSelections
 */
Encompass.SelectableAreaComponent = Ember.Component.extend({
  //classNameBindings: ['id'],

  init: function() {
    this._super(...arguments);
    this.set('trashedSelections', this.trashed);

    this.setupTagging();
  },
  didInsertElement: function() {
    this.set('currSubId', this.model.id);
    this.set('selecting', this.makingSelection);
    this.set('showing', this.showingSelections);
    var comp = this;
    var containerId = 'submission_container';
    var scrollableContainer = 'al_submission';
    var container = document.getElementById(containerId);
    //var tagsListContainer = 'tags-list';

    if (!container) {
      return;
    }

    if (container.style.position !== 'absolute') {
      container.style.position = 'relative';
    }

    // set up the SelectionHighlighting object
    comp.selectionHighlighting = new SelectionHighlighting({
      selectableContainerId: containerId
    });
    comp.selectionHighlighting.init(function(id) {
      var selection = comp.selectionHighlighting.getSelection(id);
      selection.selectionType = 'selection';
      comp.sendAction('addSelection', selection);
    });

    // set up the ImageTagging object
    comp.imageTagging = new window.ImageTagging({
      targetContainer: containerId,
      isCompSelectionMode: this.makingSelection,
      scrollableContainer: scrollableContainer,
      //tagsListContainer: tagsListContainer
    });
    comp.imageTagging.onSave(function(id) {
      var tag = comp.imageTagging.getTag(id);
      tag.selectionType = 'image-tag';
      comp.sendAction('addSelection', tag);
    });



    comp.selectionHighlighting.loadSelections(comp.get('selections'));
    comp.imageTagging.loadTags(comp.get('imgTags'));
    //comp.myPropertyDidChange();
    if (comp.showingSelections) {
      comp.selectionHighlighting.highlightAllSelections();
      comp.imageTagging.showAllTags();
    }
    if (!comp.makingSelection) {
      comp.selectionHighlighting.disableSelection();
      comp.imageTagging.disable();
    }
  },

  didUpdateAttrs: function() {
    var highlighting = this.selectionHighlighting;
    var tagging = this.imageTagging;

    if (this.get('currSubId') !== this.model.id) {
      this.imageTagging.removeAllTags();
    return this.sendAction('handleTransition', true);
    }
    if (this.trashed.get('length') > this.get('trashedSelections.length')) {
      this.set('trashedSelections', this.trashed);
      tagging.removeAllTags();
      highlighting.removeAllHighlights();
    }
    //tagging.removeAllTags();
    this.setupTagging();

    highlighting.loadSelections(this.get('selections'));

    //tagging.removeAllTags();
    tagging.loadTags(this.get('imgTags'));

    var isSelecting = this.makingSelection;
    var isShowing = this.showingSelections;
    if (isSelecting !== this.get('selecting')) {
      if (isSelecting) {
        this.set('selecting', true);
      highlighting.enableSelection();
      tagging.enable();
      }
    }

    if (isShowing !== this.get('showing')) {
      if (isShowing) {
        this.set('showing', true);
        highlighting.highlightAllSelections();
        tagging.showAllTags();

      } else {
        this.set('showing', false);
        highlighting.removeAllHighlights();
        tagging.removeAllTags();

      }
    } else if(isShowing) {
      highlighting.highlightAllSelections();
      tagging.showAllTags();
    }

  },

  setupTagging: function() {
    var selections = [];
    var imgTags = [];

    console.log(this.model); // This should never be null (ENC-479 possibility)
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
            comments: selection.get('comments')
          };
        }
      });
      this.set('selections', selections);
      this.set('imgTags', imgTags);
    }
  },


  willDestroyElement: function() {
    this.sendAction('handleTransition', false);
    this.selectionHighlighting.destroy();
    this.imageTagging.destroy();

  },


});
