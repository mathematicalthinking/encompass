/**
 * Passed in by parent:
 * - model - the current submission model
 * - makingSelection
 * - showingSelections
 */
Encompass.SelectableAreaComponent = Ember.Component.extend({
  //classNameBindings: ['id'],
  didInsertElement: function() {
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
    }

    comp.selectionHighlighting.loadSelections(selections);
    comp.imageTagging.loadTags(imgTags);
    comp.myPropertyDidChange();
  },
  willDestroyElement: function() {
    this.selectionHighlighting.destroy();
    this.imageTagging.destroy();
  },
  myPropertyDidChange: function() {
    var comp = this,
      containerId = 'submission_container',
      container = document.getElementById(containerId),
      highlighting = comp.selectionHighlighting,
      tagging = comp.imageTagging;

    if (!container) {
      return;
    }

    console.log("Prop changed, showingSelections: " + this.showingSelections );
    if (this.showingSelections) {
      highlighting.removeAllHighlights();
      highlighting.highlightAllSelections();
      highlighting.disableSelection();
      tagging.removeAllTags();
      tagging.showAllTags();
      tagging.disable();
    } else {
      highlighting.removeAllHighlights();
      tagging.removeAllTags();
    }
    if (this.makingSelection && !this.showingSelections) {
      highlighting.enableSelection();
      tagging.enable();
    }
  }.observes('this.showingSelections', 'this.makingSelection'),

  modelChanged: function() {
    this.rerender(); //we want SelectionHighlighting.init() to be called again so that
      //each of the DOM elements has an id ENC-450
  }.observes('this.model.id')

});
